import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import httpStatus from 'http-status';
import config from '../config/config';
import userService from './user.service';
import { Token } from '../models';
import ApiError from '../utils/ApiError';
import { TokenTypes } from '../config/tokenTypes.enum';
import { UserInterface } from '../interfaces/user.interface';

//Generate token
const generateToken = (
  userId: string,
  expires: Moment,
  type: string,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

//Save a token
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

//Verify token and return token doc (or throw an error if it is not valid)
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

//Generate auth tokens
const generateAuthTokens = async (user: UserInterface) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user._id, accessTokenExpires, TokenTypes.ACCESS);
  return accessToken;
};

const getUserByToken = async (authorization) => {
  if (!authorization) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Usuário não autorizado!');
  }
  const parts = authorization.split(' ');
  const [scheme, token] = parts;
  const tokenUser = await Token.findOne({ token });
  const userId = tokenUser.user.toHexString();
  const user = await userService.getUserById(tokenUser.user);
  return user;
};

//Generate reset password token
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Nenhum usuario encontrado com ess email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, TokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, TokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

//Generate verify email token
const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, TokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, TokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

export default {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  getUserByToken,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
