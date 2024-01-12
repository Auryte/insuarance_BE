import { Response, NextFunction } from 'express';
import { LeanDocument } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { Credentials } from 'types/auth';
import { User } from 'types/user';
import { TypedRequestBody } from 'types/routes';
import userModel from 'models/user';
import AppError from 'utils/appError';

const signToken = (user: LeanDocument<User>) =>
  jwt.sign({ user }, process.env.JWT_SECRET as string);

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const login = async (req: TypedRequestBody<Credentials>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new AppError({ statusCode: 400, message: 'Please provide username and password.' });
    }

    const user = await userModel.getUserWithPassword(req.body);

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw new AppError({ statusCode: 401, message: 'Incorrect username or password.' });
    }

    const token = signToken(user);

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
export default { login };
