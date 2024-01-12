import { Request, Response, NextFunction } from 'express';

import userModel from 'models/user';
import AppError, { handleParamMissingError } from 'utils/appError';

const checkUserInDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    if (!userId) handleParamMissingError('userId');

    const user = await userModel.getUser(userId);
    if (!user) {
      throw new AppError({ statusCode: 404, message: 'No user found with that ID.' });
    }

    res.locals.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default checkUserInDB;
