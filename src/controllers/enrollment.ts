import { Response, NextFunction } from 'express';

import { TypedRequestBody, TypedRequestParams } from 'types/routes';
import { Enrollment, EnrollmentSearchFilter } from 'types/insurance';
import enrollmentModel from 'models/enrollment';
import { validateEnrollmentFunction } from 'validation/enrollment';
import AppError, { handleParamMissingError } from 'utils/appError';

const createEnrollment = async (
  req: TypedRequestBody<Enrollment>,
  res: Response,
  next: NextFunction
) => {
  try {
    const isValid = validateEnrollmentFunction(req.body);
    if (!isValid) {
      throw new AppError({ statusCode: 400, ajvError: validateEnrollmentFunction.errors });
    }

    const filter: EnrollmentSearchFilter = {
      consumerID: res.locals.user.id,
      planID: res.locals.plan.id
    };
    const isPlanEnrolled = await enrollmentModel.getEnrollmentByFilterAndSort(filter, 'planID', -1);
    if (isPlanEnrolled) {
      throw new AppError({
        statusCode: 400,
        message: 'Only one enrollment from user is allowed per plan.'
      });
    }

    const enrollment = await enrollmentModel.createEnrollment({
      ...req.body,
      consumerID: res.locals.user.id
    });

    res.status(201).json(enrollment);
  } catch (err) {
    next(err);
  }
};

const getEnrollment = async (
  req: TypedRequestBody<Enrollment>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) handleParamMissingError('id');

    const enrollment = await enrollmentModel.getEnrollment(id);

    if (!enrollment) {
      throw new AppError({ statusCode: 404, message: 'No enrollment found with that ID.' });
    }

    res.status(200).json(enrollment);
  } catch (err) {
    next(err);
  }
};

const getEnrollments = async (
  req: TypedRequestParams<{ userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    if (!userId) handleParamMissingError('userId');

    const enrollments = await enrollmentModel.getEnrollments(userId);
    res.status(200).json(enrollments);
  } catch (error) {
    next(error);
  }
};

const updateEnrollment = async (
  req: TypedRequestBody<Enrollment>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) handleParamMissingError('id');

    const isValid = validateEnrollmentFunction(req.body);
    if (!isValid) {
      throw new AppError({ statusCode: 400, ajvError: validateEnrollmentFunction.errors });
    }

    const enrollment = await enrollmentModel.updateEnrollment(req.body, id);

    if (!enrollment) {
      throw new AppError({ statusCode: 404, message: 'No enrollment found with that ID.' });
    }

    res.status(200).json(enrollment);
  } catch (err) {
    next(err);
  }
};

export default { createEnrollment, getEnrollment, getEnrollments, updateEnrollment };
