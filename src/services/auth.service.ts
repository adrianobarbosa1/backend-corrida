import httpStatus from 'http-status';
import tokenService from './token.service';
import userService from './user.service';
import emailService from './email.service';
import { User } from '../models';
import Token from '../models/token.model';
import ApiError from '../utils/ApiError';
import { tokenTypes } from '../config/tokens';

const loginUserWithEmail = async (email, password) => {
  const user = await userService.getUserByEmail(email)

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Senha ou email incorreto');
  }

  return user;
};

const createFaceBookOrGoogleUser = async (email, name, strategy) => {
  const  user = await User.create({ email, name, strategy, password: 'O usuário não exige senha' })
  console.log(user)
  return user;
};

const sendNewOauthUserEMail = async (email) => {
  await emailService.sendEmail(email, 'Obrigado por se juntar a nós', 'Conta criada com sucesso')
};

const googleAuth = async (reqUser) => {
  try {
    const token = await tokenService.createJwt(reqUser._id);
    return token;
  } catch (error) {
    throw next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao fazer login'));
  }
}

const accessPassword = async (user, newPassword) => {
  user.password = newPassword;
  return user.save();
};

const setUserAccess = async (user) => {
  user.access = 1;
  return user.save()
};

// Logout
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

//Refresh auth tokens
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

//Reset password
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

//Verify email
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

export default {
  loginUserWithEmail,
  createFaceBookOrGoogleUser,
  sendNewOauthUserEMail,
  googleAuth,
  accessPassword,
  setUserAccess,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
