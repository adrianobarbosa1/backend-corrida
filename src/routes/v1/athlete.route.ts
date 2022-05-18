import express from 'express';
import { auth } from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { athleteValidation } from '../../validations';
import { athleteController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(athleteValidation.createAthlete), athleteController.createAthlete)
  .get(auth(), validate(athleteValidation.showAthlete), athleteController.showAthlete)
  .patch(auth(), validate(athleteValidation.updateAthlete), athleteController.updateAthlete);

export default router;
