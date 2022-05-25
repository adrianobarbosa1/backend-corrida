import express from 'express';
import { auth } from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { eventValidation } from '../../validations';
import { eventController } from '../../controllers';

const router = express.Router();

router
  .post('/create', auth('createEvent'), validate(eventValidation.createEvent), eventController.createEvent);
// .patch('/img', auth(), validate(athleteValidation.uploadFoto), multer(upload).single("avatar"), athleteController.uploadFoto);

export default router;
