import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';
import { athleteService, dependentsService } from '../services';

const createDependents = catchAsync(async (req: Request, res: Response) => {
  const dependents = await dependentsService.createDependents(req.body, req.user);

  res.status(httpStatus.CREATED).json({
    dependente: {
      id: dependents._id,
      name: dependents.name,
      genre: dependents.genre,
      dt_nascimento: dependents.dt_nascimento,
    },
  });
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
  createDependents,
  getAthlete,
  updateAthlete,
};
