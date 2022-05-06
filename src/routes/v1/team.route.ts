import express from 'express';
import multer from 'multer';

import { auth } from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { teamValidation } from '../../validations';
import { teamController } from '../../controllers';

const router = express.Router();

router.post('/create', auth(), validate(teamValidation.createTeam), teamController.createTeam);
router.post('/upload-img', auth(), multer(upload).single('file'), teamController.createTeam);

// .get('/:athleteId', auth(), validate(athleteValidation.getAthlete), athleteController.getAthlete)
// .patch(
//   '/:athleteId',
//   auth(),
//   validate(athleteValidation.updateAthlete),
//   athleteController.updateAthlete
// )
// .delete(
//   '/delete',
//   auth(),
//   validate(athleteValidation.createAthlete),
//   athleteController.createAthlete
// );

export default router;
