const httpStatus = require('http-status');
const { Event } = require('../models');
const ApiError = require('../utils/ApiError');

const createEvent = async (eventBody) => {
    return Event.create(eventBody);
}

module.exports = {
  createEvent
}
