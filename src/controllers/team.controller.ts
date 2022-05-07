import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { catchAsync } from '../utils/catchAsync';
import { teamService } from '../services';

const createTeam = catchAsync(async (req: Request, res: Response) => {
  const team = await teamService.createTeam(req.body, req.user);
  res.status(httpStatus.CREATED).json({
    team: {
      id: team._id,
      name: team.name,
      logo: team.logo,
      phrase: team.phrase,
      description: team.description,
      invite_code: team.invite_code,
    },
  });
});

const uploadImg = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const team = await teamService.uploadImg(req.file, id)
  res.send(team)
});

export default {
  createTeam,
  uploadImg
};
