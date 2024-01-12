import { HydratedDocument } from 'mongoose';
import { EmployerBody } from './employer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  password: string;
  firstName: string;
  lastName: string;
  SSN?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  employerID?: string;
  employer?: EmployerBody;
}

export enum UserRole {
  admin = 'admin',
  employer = 'employer',
  consumer = 'consumer'
}

export type UserBodyMongoDB = HydratedDocument<User>;
export interface ConsumerSearchFilter {
  employerID?: string;
  firstName?: RegExp;
  lastName?: RegExp;
  SSN?: RegExp;
  role?: string;
}

export type UserSearchQuery = {
  firstName?: string;
  lastName?: string;
  SSN?: string;
  page?: string;
  limit?: string;
};
