import { LeanDocument } from 'mongoose';
import { User } from './user';

export interface Credentials {
  username: string;
  password: string;
}

export interface Token {
  user: LeanDocument<User>;
  iat: number;
}
