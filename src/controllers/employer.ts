import { Response, NextFunction } from 'express';

import { validateEmployerFunction, validateEmployerSetup } from 'validation/employer';
import employerModel from 'models/employer';
import { TypedRequestBody, TypedRequestQuery } from 'types/routes';
import {
  EmployerBody,
  EmployerSearchFilter,
  EmployerSearchQuery,
  EmployerSetup
} from 'types/employer';
import { defaultPage, defaultLimit } from 'utils/constants';
import AppError, { handleParamMissingError } from 'utils/appError';
import { SearchOptions } from 'types/search';
import { getSearchOptionValue } from 'utils/helpers';
import { UserRole } from 'types/user';
import { isAuthorizedToUpdate } from 'helpers/isAuthToUpdate';

const createEmployer = async (
  req: TypedRequestBody<EmployerBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const isValid = validateEmployerFunction(req.body);
    if (!isValid) {
      throw new AppError({ statusCode: 400, ajvError: validateEmployerFunction.errors });
    }

    const newEmployer = await employerModel.addNewEmployer(req.body);
    res.status(201).json(newEmployer);
  } catch (err) {
    next(err);
  }
};

const getEmployer = async (
  req: TypedRequestBody<EmployerBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) handleParamMissingError('id');

    const employer = await employerModel.getEmployer(id);

    res.status(200).json(employer);
  } catch (err) {
    next(err);
  }
};

const getEmployers = async (
  req: TypedRequestQuery<EmployerSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = defaultPage, limit = defaultLimit, name, code } = req.query;

    const filter: EmployerSearchFilter = {};
    if (name) {
      filter.name = new RegExp(`${name}`, 'i');
    }
    if (code) {
      filter.code = new RegExp(`${code}`, 'i');
    }

    const options: SearchOptions = {
      page: getSearchOptionValue(defaultPage, page),
      limit: getSearchOptionValue(defaultLimit, limit),
      sortBy: 'name'
    };

    const employers = await employerModel.getEmployersByFilter(filter, options);

    res.send(employers);
  } catch (err) {
    next(err);
  }
};

const updateEmployer = async (
  req: TypedRequestBody<EmployerBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) handleParamMissingError('id');

    const isValid = validateEmployerFunction(req.body);
    if (!isValid) {
      throw new AppError({ statusCode: 400, ajvError: validateEmployerFunction.errors });
    }

    const updatedEmployer = await employerModel.updateEmployerData(req.body, id);

    res.status(200).json(updatedEmployer);
  } catch (err) {
    next(err);
  }
};

const changeEmployerRules = async (
  req: TypedRequestBody<EmployerSetup>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const isValid = validateEmployerSetup(req.body);
    if (!isValid) {
      throw new AppError({ statusCode: 400, ajvError: validateEmployerSetup.errors });
    }

    const body =
      req.ctx.user.role === UserRole.admin ? req.body : { claimFilling: req.body.claimFilling };

    if (!isAuthorizedToUpdate(req)) {
      throw new AppError({ statusCode: 403, message: 'You can not access to this action' });
    }

    const updatedEmployer = await employerModel.updateEmployerData(body, id);

    res.status(200).json(updatedEmployer);
  } catch (err) {
    next(err);
  }
};

export default { createEmployer, getEmployer, getEmployers, updateEmployer, changeEmployerRules };
