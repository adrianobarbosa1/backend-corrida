import express from 'express';
import { auth } from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { eventValidation } from '../../validations';
import { eventController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(auth('event'), validate(eventValidation.createEvent), eventController.createEvent)
  .get(auth('event'), validate(eventValidation.showEvents), eventController.showEvents);

router
  .route('/:eventId')
  .get(auth('event'), validate(eventValidation.showEvent), eventController.showEvent)

export default router;
