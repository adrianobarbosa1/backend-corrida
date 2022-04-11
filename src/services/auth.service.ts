const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const emailService = require('./email.service')
const { User } = require('../models');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

//Login with cpf and password
const loginUserWithCpfOrEmail = async (body) => {
  let user = null;
  console.log(body)
  if (body.username.includes('@')) {
    user = await userService.getUserByEmail(body.username)
  } else {
    user = await userService.getUserByCpf(body.username);
  }

  if (!user || !(await user.isPasswordMatch(body.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Senha ou CPF incorreto');
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
  loginUserWithCpfOrEmail,
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
