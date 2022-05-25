import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';
import { athleteService, eventService, userService } from '../services';
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

const registerEvent = catchAsync(async (req: Request, res: Response) => {
  await athleteService.registerAthleteEvent(req.params.eventId, req.user.id);
  const { name } = await eventService.getEventById(req.params.eventId);
  res.status(httpStatus.CREATED).json({ name });
});

const removeRegisterEvent = catchAsync(async (req: Request, res: Response) => {
  await athleteService.removeRegisterAthleteEvent(req.params.eventId, req.user.id);
  const { name } = await eventService.getEventById(req.params.eventId);
  res.status(httpStatus.CREATED).json({ name });
});

const updateAthlete = catchAsync(async (req: Request, res: Response) => {
  const user = await athleteService.updateAthleteByIdUser(req.params.athleteId, req.body);
  console.log(user)
  res.send(user);
});

export default {
  createAthlete,
  registerEvent,
  uploadFoto,
  showUploadFoto,
  showAthlete,
  updateAthlete,
  removeRegisterEvent,
};
