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
  const athlete = await athleteService.getAthleteById(req.user.id);

  res.status(httpStatus.CREATED).send(athlete);
});

const updateAthlete = catchAsync(async (req: Request, res: Response) => {
  const athlete = await athleteService.updateAthleteById(req.params.athleteId, req.body);
  res.send(athlete);
});

export default {
  createAthlete,
  showAthlete,
  updateAthlete,
};
