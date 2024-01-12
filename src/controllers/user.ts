import { Response, NextFunction } from 'express';
import { ConsumerSearchFilter, User, UserRole, UserSearchQuery } from 'types/user';
import { TypedRequestBody, TypedRequestQuery } from 'types/routes';
import userModel from 'models/user';
import {
  validateUserCreateFunction,
  validateUserEmployerUpdateFunction,
  validateConsumerUpdateFunction
} from 'validation/user';
import AppError, { handleParamMissingError } from 'utils/appError';
import { defaultLimit, defaultPage } from 'utils/constants';
import { SearchOptions } from 'types/search';
import { getSearchOptionValue } from 'utils/helpers';
import { handleAjvError } from 'middlewares/globalErrorHandler';
import allowedToCreateUser from 'helpers/allowedToCreateUser';
import { hashPassword } from './auth';
import { handleMongoError, updateErrorMessage } from './user.utils';

const createUser = async (req: TypedRequestBody<User>, res: Response, next: NextFunction) => {
  try {
    const hasUserCreateRight = await allowedToCreateUser(req);
    if (!hasUserCreateRight) {
      throw new AppError({ statusCode: 403, message: 'You can not access to this action' });
    }

    const isValid = validateUserCreateFunction(req.body);
    if (!isValid) {
      throw new AppError({ statusCode: 400, ajvError: validateUserCreateFunction.errors });
    }

    req.body.password = await hashPassword(req.body.password);

    const user = await userModel.createUser({ ...req.body, employerID: req.params.employerId });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req: TypedRequestBody<User>, res: Response, next: NextFunction) => {
  try {
    const {
      user: { role }
    } = req.ctx;

    const userId = req.params.id;

    if (role === UserRole.admin) {
      const isValid = validateUserEmployerUpdateFunction(req.body);
      if (!isValid) {
        throw new AppError({
          statusCode: 400,
          ajvError: validateUserEmployerUpdateFunction.errors
        });
      }
    }
    if (role === UserRole.employer) {
      const isValid = validateConsumerUpdateFunction(req.body);
      if (!isValid) {
        throw new AppError({ statusCode: 400, ajvError: validateConsumerUpdateFunction.errors });
      }
    }
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    const updatedUser = await userModel.updateUser(req.body, userId);
    if (!updatedUser) {
      throw new AppError({ statusCode: 404, message: 'No user found with that ID.' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req: TypedRequestBody<User>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) handleParamMissingError('id');

    const user = await userModel.getUser(id);

    if (!user) {
      throw new AppError({ statusCode: 404, message: 'No user found with that ID.' });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (
  req: TypedRequestQuery<UserSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { employerId } = req.params;

    const { page = defaultPage, limit = defaultLimit } = req.query;
    const {
      user: { role }
    } = req.ctx;

    type FilterFields = Pick<UserSearchQuery, 'firstName' | 'lastName' | 'SSN'>;
    type FilterFieldsNames = keyof FilterFields;
    const filters: FilterFieldsNames[] = ['firstName', 'lastName', 'SSN'];
    const filter: ConsumerSearchFilter = {};
    filters.forEach(field => {
      if (req.query[field]) {
        filter[field] = new RegExp(`${req.query[field]}`, 'i');
      }
    });
    if (employerId) {
      filter.employerID = employerId;
    }
    if (role === UserRole.employer) {
      filter.role = UserRole.consumer;
    }
    if (role === UserRole.admin) {
      filter.role = UserRole.employer;
    }

    const options: SearchOptions = {
      page: getSearchOptionValue(defaultPage, page),
      limit: getSearchOptionValue(defaultLimit, limit),
      sortBy: 'lastName'
    };
    const result = await userModel.getUsersByFilter(filter, options);
    res.send(result);
  } catch (err) {
    next(err);
  }
};

const createUsers = async (req: TypedRequestBody<User[]>, res: Response, next: NextFunction) => {
  const validationErrors: AppError[] = [];
  const mongoDBErrors: Error[] = [];
  const newUsers: User[] = [];

  try {
    const users: User[] = req.body;
    const hasUserCreateRight = await allowedToCreateUser(req);
    if (!hasUserCreateRight) {
      throw new AppError({ statusCode: 403, message: 'You can not access to this action' });
    }

    for (const user of users) {
      const isValid = validateUserCreateFunction(user);
      if (!isValid) {
        const validationError = handleAjvError(
          new AppError({ statusCode: 400, ajvError: validateUserCreateFunction.errors })
        );
        if (validationError.fields) updateErrorMessage(validationError.fields, user);
        validationErrors.push(validationError);
      }
    }

    if (validationErrors.length) {
      return res.status(400).json({ mongoDBErrors, validationErrors });
    }

    for (const user of users) {
      try {
        user.password = await hashPassword(user.password);
        const newUser = await userModel.createUser({
          ...user,
          employerID: req.params.employerId
        });
        newUsers.push(newUser);
      } catch (err) {
        const error: AppError = handleMongoError(err);
        if (error.fields) updateErrorMessage(error.fields, user);
        mongoDBErrors.push(error);
      }
    }

    if (mongoDBErrors.length) {
      newUsers.forEach(user => userModel.deleteUser(user.id));
      return res.status(400).json({ mongoDBErrors, validationErrors });
    }

    res.status(201).json(newUsers);
  } catch (err) {
    next(err);
  }
};

export default { createUser, updateUser, getUser, getUsers, createUsers };
