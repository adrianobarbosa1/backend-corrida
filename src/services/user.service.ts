import httpStatus from 'http-status';
import { User } from '../models';
import ApiError from '../utils/ApiError';

const createUser = async (name: string, email: string, password: string): Promise<any> => {
  if (await getUserByEmail(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email já existe!');
  }
  const strategy: string = 'EMAIL_PASSWORD'
  return await User.create({ name, email, password, strategy });
};

//Query for Users
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

//Get user by id
const getUserById = async (id) => {
  return User.findById(id);
};

//Get user by cpf
const getUserByCpf = async (cpf) => {
  return User.findOne({ cpf });
};

//Get user by email
const getUserByEmail = async (email: string): Promise<any> => {
  const user = await User.findOne({ email });
  if (!user) return null;
  return user;
};

//update user by id
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.cpf && (await User.isCpfTaken(updateBody.cpf, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'CPF already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const updateUserAccess = async (userId) => {
  const user = await getUserById(userId);
  user.access = 1;
  await user.save()
  return user;
}

//Delete user by id
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.deletado = true;
  Object.assign(user);
  await user.save();
  return user;
};

export default {
  createUser,
  queryUsers,
  updateUserAccess,
  getUserById,
  getUserByCpf,
  getUserByEmail,
  updateUserById,
  deleteUserById,
}
