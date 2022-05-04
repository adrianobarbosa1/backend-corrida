import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { catchAsync } from '../utils/catchAsync';
import { authService, userService, tokenService, emailService } from '../services';
import { UserInterface } from '../interfaces/user.interface';

const createTeam = catchAsync(async (req: Request, res: Response) => {
  const team = await teamService.createTeam(req.body, req.user);

  res.status(httpStatus.CREATED).json({
    dependente: {
      id: dependents._id,
      name: dependents.name,
      genre: dependents.genre,
      dt_nascimento: dependents.dt_nascimento,
    },
  });
});

const getTeam = catchAsync(async (req: Request, res: Response) => {
  var team = await athleteService.getAthleteById(req.params.athleteId);
  if (!athlete) {
    throw new ApiError(`${httpStatus.NOT_FOUND}`, 'Atleta não encontrado');
  }
  res.status(httpStatus.CREATED).send(athlete);
});

const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserInterface;
  const tokens = await tokenService.generateAuthTokens(user._id);
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    tokens,
  });
});

const googleAuthReactSuccess = catchAsync(async (req: Request, res: Response) => {
  const { email, name }: { email: string; name: string } = req.body;
  const secret = req.params.secret;
  let user = await tokenService.getUserByToken(req.headers.authorization);
  if (!user) {
    const newUser = await authService.createFacebookOrGoogleUser(email, name, 'GOOGLE_STRATEGY');

    user = newUser;
  }
  const tokens = await tokenService.generateAuthTokens(user._id);
  res.json({
    status: 'success',
    data: {
      tokens,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

const facebookAuth = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user as UserInterface;
  const tokens = await tokenService.generateAuthTokens(currentUser._id);
  res.json({
    status: 'success',
    data: {
      tokens,
      user: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      },
    },
  });
});

const setAccess = catchAsync(async (req, res) => {
  const user = await tokenService.getUserByToken(req.headers.authorization);
  await authService.accessPassword(user, req.body.password);
  await authService.setUserAccess(user);
  res.send(user);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email }: { email: string } = req.body;
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email);
  await emailService.sendResetPasswordEmail(email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).json({
    status: 'success',
    message: 'Verifique seu e-mail para redefinir a senha',
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { password }: { password: string } = req.body;
  await authService.resetPassword(req.query.token, password);
  res.status(httpStatus.NO_CONTENT).send({
    status: 'success',
    message: 'Senha alterada faça login',
  });
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
