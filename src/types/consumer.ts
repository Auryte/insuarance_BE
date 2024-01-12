import { HydratedDocument } from 'mongoose';
import { User } from './user';

export interface ConsumerBody extends User {
  SSN: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export type ConsumerBodyMongoDB = HydratedDocument<ConsumerBody>;
