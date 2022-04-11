const Joi = require("joi");

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

export default {
  createEvent
}
