import { Response, NextFunction } from 'express';
import { isAuthorizedToUpdate } from 'helpers/isAuthToUpdate';
import { EmployerBody } from 'types/employer';
import { TypedRequestBody } from 'types/routes';
import AppError from 'utils/appError';

const isAuthorizedToUpdateEmployer = async (
  req: TypedRequestBody<EmployerBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!isAuthorizedToUpdate(req)) {
      throw new AppError({ statusCode: 401, message: 'Unauthorized to update.' });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default isAuthorizedToUpdateEmployer;
