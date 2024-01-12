import { Request, Response, NextFunction } from 'express';

import employerModel from 'models/employer';
import AppError from 'utils/appError';

const checkEmployerInDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employerID = req.params.employerId || req.params.id;
    const employer = await employerModel.getEmployer(employerID);

    if (!employer) {
      throw new AppError({ statusCode: 404, message: 'No employer found with that ID.' });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default checkEmployerInDB;
