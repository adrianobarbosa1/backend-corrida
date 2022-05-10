import httpStatus from 'http-status';
import fs from 'fs';
import { Dependents } from '../models';
import { AthleteDocument } from '../models/athlete.model';
import { Team } from '../models/team.model';
import multer from 'multer';
import ApiError from '../utils/ApiError';
import { compressImage } from '../helpers/upload-image-helper';

const createTeam = async (team, user) => {
  team.user = user;
  return Team.create(team);
};

const uploadImg = async (file, idTeam) => {
  const team = await Team.findById(idTeam);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Time não encontrado');
  }
  console.log(file.buffer)
  const base64file = Buffer.from(file.buffer).toString('base64');

  team.logo = base64file;
  return await team.save();
}


export default {
  createTeam,
  uploadImg
  // updateAthleteById,
};
