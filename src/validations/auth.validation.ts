const Joi = require('joi');
const { password } = require('./custom.validation');

const signUp = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const signIn = {
  body: Joi.object().keys({
    email:Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const googleAuthReactSuccess = {
  params: Joi.object().keys({
    secret: Joi.string().required()
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
  })
}

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export default {
  signUp,
  signIn,
  logout,
  googleAuthReactSuccess,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
