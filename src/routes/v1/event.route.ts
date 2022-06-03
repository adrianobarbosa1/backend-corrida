import express from 'express';
import multer from 'multer';
import { auth } from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { eventValidation } from '../../validations';
import { eventController } from '../../controllers';
import { upload } from '../../middlewares/multer';

const router = express.Router();

router
  .route('/')
  .post(auth('event'), validate(eventValidation.createEvent), eventController.createEvent)
  .get(validate(eventValidation.showEvents), eventController.showEvents);

router
  .route('/:eventId')
  .get(validate(eventValidation.showEvent), eventController.showEvent)
  .patch(auth(), validate(eventValidation.uploadFoto), multer(upload).single("avatar"), eventController.uploadFoto)

export default router;

