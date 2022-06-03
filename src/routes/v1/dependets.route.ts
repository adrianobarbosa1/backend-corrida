import express from 'express';
import { auth } from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { dependentsValidation } from '../../validations';
import { dependentsController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(dependentsValidation.createDependents), dependentsController.createDependents);

export default router;
