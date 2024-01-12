import { ErrorObject } from 'ajv';

interface AppErrorArgs {
  message?: string;
  ajvError?: ErrorObject[] | null;
  fields?: Record<'name' | 'message', string | undefined>[];
  statusCode: number;
}

export default class AppError extends Error {
  statusCode: number;

  ajvError?: ErrorObject[] | null;

  fields?: Record<'name' | 'message', string | undefined>[];

  isOperational = true;

  constructor(args: AppErrorArgs) {
    super(args.message);

    this.ajvError = args.ajvError;
    this.fields = args.fields;
    this.statusCode = args.statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleParamMissingError = (param: string) => {
  throw new AppError({
    statusCode: 400,
    message: `Parameter '${param}' is missing in the request.`
  });
};
