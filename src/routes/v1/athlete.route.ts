import express from 'express';
import multer from 'multer';

import { auth } from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { athleteValidation } from '../../validations';
import { athleteController } from '../../controllers';
import { upload } from '../../middlewares/multer';

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(athleteValidation.createAthlete), athleteController.createAthlete)
  .get(auth(), validate(athleteValidation.showAthlete), athleteController.showAthlete)
  .patch(auth(), validate(athleteValidation.updateAthlete), athleteController.updateAthlete);

router
  .route('/img')
  .patch(auth(), validate(athleteValidation.uploadFoto), multer(upload).single("avatar"), athleteController.uploadFoto)
  .get(auth(), validate(athleteValidation.uploadFoto), athleteController.showUploadFoto);

router
  .route('/:idEvento')
  .patch(auth(), validate(athleteValidation.registerEvent), multer(upload).single("avatar"), athleteController.uploadFoto)

export default router;
