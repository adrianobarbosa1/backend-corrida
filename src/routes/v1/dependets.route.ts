import express from 'express';
import { auth } from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { dependentsValidation } from '../../validations';
import { dependentsController } from '../../controllers';

const router = express.Router();

router.post(
  '/create',
  auth(),
  validate(dependentsValidation.createDependents),
  dependentsController.createDependents
);
// router.patch('/img/:id', auth(), multer(multerConfig).single('file'), teamController.uploadImg);

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
