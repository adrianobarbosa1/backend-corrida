import httpStatus from 'http-status';
import { IUserRequest, UserInterface } from '../interfaces/user.interface';
import { User } from '../models';
import ApiError from '../utils/ApiError';

const createUser = async ({ name, email, password }: IUserRequest): Promise<UserInterface> => {
  if (await getUserByEmail(email)) {
    throw new ApiError(`${httpStatus.BAD_REQUEST}`, 'Email já existe!');
  }
  const strategy: string = 'EMAIL_PASSWORD';
  return await User.create({ name, email, password, strategy });
};

//Query for Users
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const updateUserFoto = async (id, updateFoto) => {
  const user = await getUserById(id)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.foto = [{
    name: updateFoto.originalname,
    size: updateFoto.size,
    key: updateFoto.filename,
    url: '',
    path: updateFoto.path,
  }]

  await user.save();
  return user;
};

const getFoto = async (id) => {
  const user = await getUserById(id)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
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
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const updateUserIfCreateAthlete = async (userId) => {
  await User.findByIdAndUpdate(userId, { registered: true }).then(response => {
    return response
  }).catch(err => {
    throw new ApiError(httpStatus.NOT_FOUND, `${err} - User not found`)
  })
}

//Delete user by id
const deleteUserById = async (userId) => {
  await User.findByIdAndUpdate(userId, { deletado: true }).then(response => {
    return response
  }).catch(err => {
    throw new ApiError(httpStatus.NOT_FOUND, `${err} - User not found`)
  })
};

export default {
  createUser,
  queryUsers,
  updateUserIfCreateAthlete,
  updateUserFoto,
  getUserById,
  getFoto,
  getUserByCpf,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
