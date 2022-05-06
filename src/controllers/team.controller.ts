import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { container } from 'tsyringe';

import { catchAsync } from '../utils/catchAsync';
import { authService, userService, tokenService, emailService, teamService } from '../services';
import { UserInterface } from '../interfaces/user.interface';

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

export default {
  createTeam,
};
