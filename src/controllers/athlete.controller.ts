import { Request, Response } from 'express'
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { athleteService } from '../services';

const createAthlete = catchAsync(async (req: Request, res:Response)=>{
  const athlete = await athleteService.createAthlete(req.body)
  res.status(httpStatus.CREATED).send(athlete);
})

export default {
  createAthlete
}
