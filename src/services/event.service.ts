import httpStatus from 'http-status';
import { Event } from '../models';
import ApiError from '../utils/ApiError';

const createEvent = async (eventBody) => {
  return Event.create(eventBody);
}

const getEventById = async (eventId) => {
  return Event.findById(eventId);
}

const queryEvents = async (filter, options) => {
  const events = await Event.paginate(filter, options);
  return events;
}

const updateEventFoto = async (eventId, updateFoto) => {
  const event = await getEventById(eventId)
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  event.foto = [{
    name: updateFoto.originalname,
    size: updateFoto.size,
    key: updateFoto.filename,
    url: '',
    path: updateFoto.path,
  }]

  await event.save();
  return event;
};

export default {
  createEvent,
  queryEvents,
  getEventById,
  updateEventFoto
}
