import httpStatus from 'http-status';
import { Dependents } from '../models';
import { AthleteDocument } from '../models/athlete.model';
import ApiError from '../utils/ApiError';

const createDependents = async (dependents, user) => {
  dependents.user = user;
  return Dependents.create(dependents);
};

const getAthleteById = async (id: string) => {
  return Athlete.findById(id);
};

const updateAthleteById = async (id, updateBody) => {
  const athlete = await getAthleteById(id);
  if (!athlete) {
    throw new ApiError(`${httpStatus.NOT_FOUND}`, 'Atleta não encontrado');
  }
  if (updateBody.email && (await Athlete.findOne({ email: updateBody.email }))) {
    throw new ApiError(`${httpStatus.BAD_REQUEST}`, 'Email já existe');
  }
  Object.assign(athlete, updateBody);
  await athlete.save();
  return athlete;
};

export default {
  createDependents,
  getAthleteById,
  updateAthleteById,
};
