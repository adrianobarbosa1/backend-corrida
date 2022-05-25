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
};

const getAthleteByIdUser = async (id: string) => {
  const athlete = await Athlete.findOne({ user: id })
  if (!athlete) {
    throw new ApiError(`${httpStatus.NOT_FOUND}`, 'Atleta não encontrado');
  }

  return athlete;
};

const updateAthleteByIdUser = async (id, updateBody) => {
  console.log(updateBody)
  const athlete = await getAthleteByIdUser(id);
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
  getAthleteByIdUser,
  updateAthleteByIdUser,
};


