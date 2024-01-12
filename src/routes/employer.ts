import { Router } from 'express';

import employerController from 'controllers/employer';
import checkEmployerInDB from 'middlewares/checkEmployerInDB';
import isAuthorizedToUpdateEmployer from 'middlewares/checkIsAuthToUpdate';
import userRouter from './user';
import planRouter from './plan';

const employerRouter = Router();

employerRouter.use('/:id', checkEmployerInDB);
employerRouter.use('/:employerId/users', userRouter);
employerRouter.use('/:employerId/plans', planRouter);

employerRouter
  .route('/')
  .get(employerController.getEmployers)
  .post(employerController.createEmployer);

employerRouter
  .route('/:id')
  .get(employerController.getEmployer)
  .patch(isAuthorizedToUpdateEmployer, employerController.updateEmployer);

employerRouter.route('/:id/manage-rules').patch(employerController.changeEmployerRules);

export default employerRouter;
