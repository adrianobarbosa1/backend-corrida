import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';
import { athleteService } from '../services';

const createAthlete = catchAsync(async (req: Request, res: Response) => {
  const athlete = await athleteService.createAthlete(req.body, req.user);
  res.status(httpStatus.CREATED).send(athlete);
});

const getAthlete = catchAsync(async (req: Request, res: Response) => {
  const athlete = await athleteService.getAthleteById(req.params.athleteId);
  if (!athlete) {
    throw new ApiError(`${httpStatus.NOT_FOUND}`, 'Atleta não encontrado');
  }
  res.status(httpStatus.CREATED).send(athlete);
});

const updateAthlete = catchAsync(async (req: Request, res: Response) => {
  const athlete = await athleteService.updateAthleteById(req.params.athleteId, req.body);
  res.send(athlete);
});

export default {
  createAthlete,
  getAthlete,
  updateAthlete,
};
