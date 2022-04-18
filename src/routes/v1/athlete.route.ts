import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { athleteValidation } from '../../validations';
import { athleteController } from '../../controllers';

const router = express.Router();

router
  .post('/create', auth(), validate(athleteValidation.createAthlete), athleteController.createAthlete);
  /*
  .get
  .patch
  .delete
  */

export default router;
