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

export default {
  createEvent,
  queryEvents,
  getEventById
}
