import { Response, NextFunction } from 'express';

import { Plan } from 'types/insurance';
import { TypedRequestBody, TypedRequestParams } from 'types/routes';
import planModel from 'models/plan';
import { validatePlanFunction } from 'validation/plan';
import AppError, { handleParamMissingError } from 'utils/appError';
import { isValidBetweenDates } from 'utils/date';

const createPlan = async (req: TypedRequestBody<Plan>, res: Response, next: NextFunction) => {
  try {
    const { employerId } = req.params;
    const isValid = validatePlanFunction(req.body);
    if (!isValid) {
      throw new AppError({ statusCode: 400, ajvError: validatePlanFunction.errors });
    }

    const plan = await planModel.createPlan({ ...req.body, employerId });

    res.status(201).json(plan);
  } catch (err) {
    next(err);
  }
};

const getPlan = async (req: TypedRequestBody<Plan>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) handleParamMissingError('id');

    const plan = await planModel.getPlan(id);

    if (!plan) {
      throw new AppError({ statusCode: 404, message: 'No plan found with that ID.' });
    }

    res.status(200).json(plan);
  } catch (err) {
    next(err);
  }
};

const getPlans = async (
  req: TypedRequestParams<{ employerId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { employerId } = req.params;
    if (!employerId) handleParamMissingError('employerId');

    const plans = await planModel.getPlans(employerId);
    res.status(200).json(plans);
  } catch (error) {
    next(error);
  }
};

const updatePlan = async (req: TypedRequestBody<Plan>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) handleParamMissingError('id');

    const isValid = validatePlanFunction(req.body);
    if (!isValid) {
      throw new AppError({ statusCode: 400, ajvError: validatePlanFunction.errors });
    }

    const plan = await planModel.updatePlan(req.body, id);
    if (!plan) {
      throw new AppError({ statusCode: 404, message: 'No plan found with that ID.' });
    }

    res.status(200).json(plan);
  } catch (err) {
    next(err);
  }
};

const deletePlan = async (
  req: TypedRequestParams<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: planID } = req.params;
    const plan = await planModel.getPlan(planID);
    if (!plan) {
      throw new AppError({ statusCode: 404, message: 'No plan found with that ID.' });
    }

    if (plan.initialized) {
      throw new AppError({
        statusCode: 400,
        message: `Only a plan that has not been initialized can be deleted.`
      });
    }

    await planModel.deletePlan(planID);

    res.status(200).json({ message: 'Plan deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

const initializePlan = async (
  req: TypedRequestParams<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: planID } = req.params;
    const plan = await planModel.getPlan(planID);
    if (!plan) {
      throw new AppError({ statusCode: 404, message: 'No plan found with that ID.' });
    }

    const { startDate: planStartDate, endDate: planEndDate } = plan;
    const currentDate = new Date().toISOString();

    if (!isValidBetweenDates(currentDate, planStartDate, planEndDate)) {
      throw new AppError({
        statusCode: 400,
        message: 'Plan initialize date should be within the boundary of plan year.'
      });
    }
    if (plan.initialized) {
      throw new AppError({
        statusCode: 400,
        message: 'Plan already initialized.'
      });
    }

    const initializedPlan = await planModel.updatePlan(
      {
        ...plan,
        initialized: true,
        initializedAt: currentDate
      },
      planID
    );
    res.status(200).json(initializedPlan);
  } catch (err) {
    next(err);
  }
};

export default { createPlan, getPlan, getPlans, updatePlan, deletePlan, initializePlan };
