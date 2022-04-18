import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { eventValidation } from '../../validations';
import { eventController } from '../../controllers';

const router = express.Router();

router
  .post('/create', auth('adminEvent'), validate(eventValidation.createEvent), eventController.createEvent);


export default router;
