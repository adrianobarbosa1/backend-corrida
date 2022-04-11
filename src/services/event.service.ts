import httpStatus from 'http-status';
import { Event } from '../models';
import ApiError from '../utils/ApiError';

const createEvent = async (eventBody) => {
    return Event.create(eventBody);
}

export default {
  createEvent
}
