import { HydratedDocument } from 'mongoose';

export interface EmployerBody {
  id: string;
  name: string;
  code: string;
  street: string;
  city: string;
  phone: string;
  state?: string;
  zipCode?: string;
  logo?: string;
  claimFilling: boolean;
  addConsumers: boolean;
}

export interface EmployerSetup {
  addConsumers?: boolean;
  claimFilling: boolean;
}

export type EmployerBodyMongoDB = HydratedDocument<EmployerBody>;

export type EmployerSearchQuery = {
  name?: string;
  code?: string;
  page?: string;
  limit?: string;
};

export type EmployerSearchFilter = {
  name?: RegExp;
  code?: RegExp;
};
