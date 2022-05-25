import Joi from "joi";
import { objectId } from './custom.validation';

const createEvent = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    maxNumber: Joi.number().integer().required(),
    eventDate: Joi.date().required(),
    hour: Joi.string().required(),
    dateStart: Joi.date().required(),
    dateEnd: Joi.date().required(),
    map: Joi.string().required(),
    address: Joi.string().required()
  })
}

const showEvents = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

const showEvent = {
  params: Joi.object().keys({
    eventId: Joi.string().custom(objectId),
  }),
};

export default {
  createEvent,
  showEvents,
  showEvent
}
