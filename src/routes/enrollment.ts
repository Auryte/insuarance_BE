import { Router } from 'express';

import enrollmentController from 'controllers/enrollment';

const enrollmentRouter = Router({ mergeParams: true });

enrollmentRouter
  .route('/')
  .get(enrollmentController.getEnrollments)
  .post(enrollmentController.createEnrollment);

enrollmentRouter
  .route('/:id')
  .get(enrollmentController.getEnrollment)
  .patch(enrollmentController.updateEnrollment);

export default enrollmentRouter;
