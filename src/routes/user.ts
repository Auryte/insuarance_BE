import { Router } from 'express';

import authController from 'controllers/auth';
import userController from 'controllers/user';
import checkUserInDB from 'middlewares/checkUserInDB';
import checkPlanInDB from 'middlewares/checkPlanInDB';
import claimRouter from './claim';
import enrollmentRouter from './enrollment';

const userRouter = Router({ mergeParams: true });

userRouter.use('/:userId/claims', checkUserInDB, checkPlanInDB, claimRouter);
userRouter.use('/:userId/enrollments', checkUserInDB, checkPlanInDB, enrollmentRouter);
userRouter.use('/:employerId/users', userRouter);

userRouter.post('/login', authController.login);

userRouter.route('/').get(userController.getUsers).post(userController.createUser);
userRouter.route('/upload-scv').post(userController.createUsers);

userRouter.route('/:id').get(userController.getUser).patch(userController.updateUser);

export default userRouter;
