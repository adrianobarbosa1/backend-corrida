import httpStatus from 'http-status';
import { Dependents } from '../models';
import { AthleteDocument } from '../models/athlete.model';
import { Team } from '../models/team.model';
import multer from 'multer';
import ApiError from '../utils/ApiError';

const createTeam = async (team, user) => {
  team.user = user;
  return Team.create(team);
};

export default {
  createTeam,
  // getAthleteById,
  // updateAthleteById,
};
