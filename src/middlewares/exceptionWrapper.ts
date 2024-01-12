import { Request, Response, NextFunction } from 'express';

const unless = function (
  paths: string[],
  middleware: (req: Request, res: Response, next: NextFunction) => any
) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (paths.includes(req.path)) {
      return next();
    }
    return middleware(req, res, next);
  };
};

export default unless;
