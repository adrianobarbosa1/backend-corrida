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

export default {
  createAthlete,
  getAthleteById
}
