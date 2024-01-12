import { Request, Response, NextFunction } from 'express';

import planModel from 'models/plan';
import AppError from 'utils/appError';

const checkPlanInDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { planID } = req.body;

    if (planID) {
      const plan = await planModel.getPlan(planID);

      if (!plan) {
        throw new AppError({ statusCode: 404, message: 'No plan found with that ID.' });
      }

      res.locals.plan = plan;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default checkPlanInDB;
