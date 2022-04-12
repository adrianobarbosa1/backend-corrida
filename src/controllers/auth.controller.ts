import { Request, Response } from 'express'
import httpStatus from "http-status";

import catchAsync from "../utils/catchAsync";
import { authService, userService, tokenService, emailService } from "../services";
import { UserDocument } from '../interfaces/model/userDocument'

const signUp = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const { name, email, password }: { name: string, email: string, password: string } = req.body;
  const user = await userService.createUser(name, email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({
    status: 'success',
    data: {
      tokens,
      user
    }
  });
});

const signIn = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const { email, password }: { email: string, password: string } = req.body;
  const user = await authService.loginUserWithEmail(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({
    status: 'success',
    data: {
      tokens,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }
  });
});

const googleAuth = catchAsync(async (req: Request, res: Response): Promise<any> => {
  req.currentUser = req.user as UserDocument;
  const tokens = await tokenService.generateAuthTokens(req.currentUser._id);
  res.send({
    status: 'success',
    data: {
      tokens,
      user: {
        id: req.currentUser._id,
        name: req.currentUser.name,
        email: req.currentUser.email,
        role: req.currentUser.role,
      }
    }
  });
});

const googleAuthReactSuccess = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const { email, name }: { email: string, name: string } = req.body;
  const secret = req.params.secret;
  console.log(secret)
  let user = await tokenService.getUserByToken(req.headers.authorization)
  if (!user) {
    const newUser = await authService.createFacebookOrGoogleUser(email, name, 'GOOGLE_STRATEGY');

    user = newUser
  }
  const tokens = await tokenService.generateAuthTokens(user._id);
  res.send({
    status: 'success',
    data: {
      tokens,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }
  });
});

const facebookAuth = catchAsync(async (req: Request, res: Response): Promise<any> => {
  req.currentUser = req.user as UserDocument;
  const tokens = await tokenService.generateAuthTokens(req.currentUser._id);
  res.send({
    status: 'success',
    data: {
      tokens,
      user: {
        id: req.currentUser._id,
        name: req.currentUser.name,
        email: req.currentUser.email,
        role: req.currentUser.role,
      }
    }
  });
});

const setAccess = catchAsync(async (req, res) => {
  const user = await tokenService.getUserByToken(req.headers.authorization)
  await authService.accessPassword(user, req.body.password)
  await authService.setUserAccess(user)
  res.send(user);
})

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken)
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  signUp,
  signIn,
  googleAuth,
  googleAuthReactSuccess,
  facebookAuth,
  setAccess,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
