import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';
import { athleteService, userService } from '../services';
import { userInfo } from 'os';

const createAthlete = catchAsync(async (req: Request, res: Response) => {
  const athlete = await athleteService.createAthlete(req.body, req.user);
  userService.updateUserIfCreateAthlete(req.user);
  res.status(httpStatus.CREATED).send(athlete);
});

const showAthlete = catchAsync(async (req: Request, res: Response) => {
  const athlete = await athleteService.getAthleteByIdUser(req.user.id);

  res.status(httpStatus.CREATED).send(athlete);
});

const uploadFoto = catchAsync(async (req: Request, res: Response) => {
  const { foto } = await userService.updateUserFoto(req.user.id, req.file);
  res.status(httpStatus.CREATED).send(foto);
});

const showUploadFoto = catchAsync(async (req: Request, res: Response) => {
  const { foto } = await userService.getFoto(req.user.id, req.file);
  res.status(httpStatus.CREATED).json({ foto });
});

const updateAthlete = catchAsync(async (req: Request, res: Response) => {
  const user = await athleteService.updateAthleteByIdUser(req.params.athleteId, req.body);
  console.log(user)
  res.send(user);
});

export default {
  createAthlete,
  uploadFoto,
  showUploadFoto,
  showAthlete,
  updateAthlete,
};
