import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import 'dotenv/config';
import { Token } from 'types/auth';

const tokenAuth = function (req: Request, res: Response, next: NextFunction) {
  const authHeader: string | undefined = req.headers.authorization;
  const token: string | undefined = authHeader?.substring(7);

  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET as Secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    req.ctx = decoded as Token;
    return next();
  });
};

export default tokenAuth;
