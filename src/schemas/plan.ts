import mongoose from 'mongoose';
import * as uuid from 'uuid';

import { Plan, PlanType, PlanPayrollFrequency } from 'types/insurance';

export const PlanSchema = new mongoose.Schema<Plan>(
  {
    id: {
      type: String,
      default: uuid.v4,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Name is required.']
    },
    type: {
      type: String,
      enum: PlanType,
      required: [true, 'Type is required.']
    },
    contributions: {
      type: Number,
      required: [true, 'Contributions is required.']
    },
    startDate: {
      type: String,
      required: [true, 'StartDate is required.']
    },
    endDate: {
      type: String,
      required: [true, 'EndDate is required.']
    },
    payrollFrequency: {
      type: String,
      enum: PlanPayrollFrequency,
      required: [true, 'PayrollFrequency is required.']
    },
    initialized: {
      type: Boolean,
      default: false
    },
    initializedAt: {
      type: String,
      default: null
    },
    employerId: {
      type: String,
      ref: 'Employer',
      required: [true, 'EmployerID is required.']
    },
    inactive: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        delete ret.inactive;
      }
    },
    timestamps: true
  }
);
