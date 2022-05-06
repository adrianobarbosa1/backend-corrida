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

const updateLogo = async (img, user) => {
  if (img)
    if (await getUserByEmail(email)) {
      throw new ApiError(`${httpStatus.BAD_REQUEST}`, 'Email já existe!');
    }
  await athlete.save();
  return athlete;
};

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (img, file, cb) => {
    cb(null, file.originalName);
  },
});

const uploadImg = multer({
  storage: storage,
}).single('testImage');

// const getAthleteById = async (id: string) => {
//   return Athlete.findById(id);
// };

// const updateAthleteById = async (id, updateBody) => {
//   const athlete = await getAthleteById(id);
//   if (!athlete) {
//     throw new ApiError(`${httpStatus.NOT_FOUND}`, 'Atleta não encontrado');
//   }
//   if (updateBody.email && (await Athlete.findOne({ email: updateBody.email }))) {
//     throw new ApiError(`${httpStatus.BAD_REQUEST}`, 'Email já existe');
//   }
//   Object.assign(athlete, updateBody);
//   await athlete.save();
//   return athlete;
// };

export default {
  createTeam,
  // getAthleteById,
  // updateAthleteById,
};
