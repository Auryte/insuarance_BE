import { ErrorObject } from 'ajv';
import mongoose, { CastError } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import AppError from 'utils/appError';
import { capitalize } from 'utils/helpers';

export const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${Object.values(err.value)}.`;
  const fields = [{ name: err.path, message }];
  return new AppError({ statusCode: 400, fields, message });
};

export const handleDuplicateFieldsDB = (err: any) => {
  const fieldName = Object.keys(err.keyPattern)[0];
  const message = `${capitalize(fieldName)} has to be unique.`;
  const fields = [{ name: fieldName, message }];
  return new AppError({ statusCode: 400, fields, message });
};

export const handleValidationErrorDB = (err: mongoose.Error.ValidationError) => {
  const fields = Object.values(err.errors).map(el => {
    return {
      name: el.path,
      message: (el as mongoose.Error.ValidatorError).properties.message
    };
  });
  const message = `Invalid input data. ${fields.map(el => el.message).join(' ')}`;
  return new AppError({ statusCode: 400, fields, message });
};

export const handleAjvError = (err: AppError) => {
  const fields = err.ajvError?.map((el: ErrorObject) => {
    const isOfKeywordRequired = el.keyword === 'required';
    const isOfKeywordAdditionalProperties = el.keyword === 'additionalProperties';

    let message;
    if (isOfKeywordAdditionalProperties) message = `${capitalize(el.message)}.`;
    if (isOfKeywordRequired) message = `${capitalize(el.params.missingProperty)} is required.`;
    else if (!isOfKeywordAdditionalProperties && !isOfKeywordRequired) {
      message = `${capitalize(el.instancePath.replace(/\//g, ''))} ${el.message}.`;
    }

    return {
      name: isOfKeywordRequired
        ? el.message?.match(/'([^']+)'/)![1]
        : el.instancePath.replace(/\//g, ''),
      message
    };
  });

  const message = `Invalid input data. ${fields?.map(el => el.message).join(' ')}`;
  return new AppError({ statusCode: 400, fields, message });
};

const sendErrorDev = (err: AppError & { error: any }, req: Request, res: Response) => {
  return res.status(err.statusCode).json({
    fields: err.fields,
    message: err.message,
    stack: err.stack,
    error: err.error
  });
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      fields: err.fields,
      message: err.message
    });
  }

  console.error('ERROR', err);

  return res.status(500).json({
    message: 'Something went wrong.'
  });
};

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  err.statusCode = err.statusCode || 500;
  let error = { ...err };
  error.message = err.message;

  if (err.code === 11000) error = handleDuplicateFieldsDB(error);
  if (err instanceof mongoose.Error.CastError) error = handleCastErrorDB(error);
  if (err instanceof mongoose.Error.ValidationError) error = handleValidationErrorDB(error);
  if (error.ajvError) error = handleAjvError(error);

  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
    error.error = err;
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, req, res);
  }

  next();
}
