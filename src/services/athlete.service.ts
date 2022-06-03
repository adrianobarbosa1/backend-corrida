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

const updateAthleteByIdUser = async (userId: string, updateBody) => {
  const athlete = await Athlete.findOne({ user: userId })
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

const registerAthleteEvent = async (eventId, userId) => {
  console.log(eventId)
  const temEvent = await Athlete.find({ event: eventId })
  console.log(temEvent)
  await Athlete.updateOne(
    { userId },
    { $addToSet: { event: [{ event }] } }
  ).then(response => {
    // console.log(response)
    return response
  }).catch(err => {
    throw new ApiError(httpStatus.NOT_FOUND, `${err} - User not found`)
  })

};

// const athlete = await getAthleteByIdUser(userId);
// console.log(athlete)
// const existeEvento = await athlete.event.map(item => item.id).includes(event.id)
// if (!athlete) {
//   throw new ApiError(`${httpStatus.NOT_FOUND}`, 'Atleta não encontrado');
// }
// if (existeEvento) {
//   throw new ApiError(`${httpStatus.BAD_REQUEST}`, 'Athleta já cadastrado nesse evento!');
// }

// await athlete.event.push(event.id)

// await athlete.save();
// return athlete;


const removeRegisterAthleteEvent = async (eventId, userId) => {
  const athlete = await Athlete.findOne({ user: userId })
  if (!athlete) {
    throw new ApiError(`${httpStatus.NOT_FOUND}`, 'Atleta não encontrado');
  }
  const createdAt = new Date().getTime()
  athlete.event.splice(eventId, createdAt)
  await athlete.save();
  return athlete;
};

export default {
  createAthlete,
  updateAthleteByIdUser,
  registerAthleteEvent,
  removeRegisterAthleteEvent,
};


