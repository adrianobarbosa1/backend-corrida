import httpStatus from 'http-status';
import { Athlete } from '../models';
import { AthleteDocument } from '../models/athlete.model';
import ApiError from '../utils/ApiError';

const createAthlete = async (athlete:AthleteDocument) => {
    return Athlete.create(athlete);
}

export default {
  createAthlete
}
