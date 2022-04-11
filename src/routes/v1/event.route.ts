import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import eventValidation from '../../validations/event.validation';
import eventController from '../../controllers/event.controller';

const router = express.Router();

router
  .post('/createEvent', auth('adminEvent'), validate(eventValidation.createEvent), eventController.createEvent);


export default router;
