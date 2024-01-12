import { HydratedDocument } from 'mongoose';

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  contributions: number;
  startDate: string;
  endDate: string;
  payrollFrequency: PlanPayrollFrequency;
  initialized: boolean;
  initializedAt: string;
  employerId: string;
  inactive: boolean;
}

export enum PlanType {
  medical = 'medical',
  dental = 'dental'
}

export enum PlanPayrollFrequency {
  weekly = 'weekly',
  monthly = 'monthly'
}

export interface Claim {
  id: string;
  consumerID: string;
  planID: string;
  number: string;
  startDate: string;
  amount: number;
  status: ClaimStatus;
}

export enum ClaimStatus {
  pending = 'pending',
  approved = 'approved',
  denied = 'denied'
}

export type ClaimSearchQuery = {
  number?: string;
  employer?: string;
  status?: ClaimStatus;
  page?: string;
  limit?: string;
};

export type ClaimSearchFilter = {
  id?: string;
  number?: RegExp;
  'employer.name'?: RegExp;
  status?: RegExp;
  'consumer.id'?: string;
};

export type ClaimMongoDB = HydratedDocument<Claim>;

export interface Enrollment {
  id: string;
  consumerID: string;
  planID: string;
  election: number;
}

export type EnrollmentSearchFilter = {
  consumerID?: string;
  planID?: string;
};
