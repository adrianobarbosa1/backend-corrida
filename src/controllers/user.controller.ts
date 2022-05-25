import { Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';
import { userService } from '../services';
import { User } from '../models';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      foto: user.foto[0],
      registered: user.registered,
      role: user.role,
      isEmailVerifield: user.isEmailVerifield,
      deletado: user.deletado,
    },
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send(user);
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
