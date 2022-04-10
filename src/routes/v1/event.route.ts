const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const eventValidation = require('../../validations/event.validation');
const eventController = require('../../controllers/event.controller');

const router = express.Router();

router
  .post('/createEvent', auth('adminEvent'), validate(eventValidation.createEvent), eventController.createEvent);


  module.exports = router
