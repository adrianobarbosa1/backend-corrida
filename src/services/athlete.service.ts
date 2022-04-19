import httpStatus from 'http-status';
import { Athlete } from '../models';
import { AthleteDocument } from '../models/athlete.model';
import ApiError from '../utils/ApiError';

const createAthlete = async (athlete: AthleteDocument, user) => {
  if (await Athlete.findOne({ user: user._id })) {
    throw new ApiError(`${httpStatus.BAD_REQUEST}`, 'Athleta já existe');
  }
  athlete.user = user;
  return Athlete.create(athlete);
}

const getAthleteById = async (id: string) => {
  return Athlete.findById(id);
}

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
  createAthlete,
  getAthleteById,
  updateAthleteById
}
