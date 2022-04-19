import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { athleteValidation } from '../../validations';
import { athleteController } from '../../controllers';

const router = express.Router();

router
  .post('/create', auth(), validate(athleteValidation.createAthlete), athleteController.createAthlete)
  .get('/:athleteId', auth(), validate(athleteValidation.getAthlete), athleteController.getAthlete)
  .patch('/:athleteId', auth(), validate(athleteValidation.updateAthlete), athleteController.updateAthlete)
  .delete('/delete', auth(), validate(athleteValidation.createAthlete), athleteController.createAthlete);

export default router;
