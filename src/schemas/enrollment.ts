import mongoose from 'mongoose';
import * as uuid from 'uuid';

import { Enrollment } from 'types/insurance';

export const EnrollmentSchema = new mongoose.Schema<Enrollment>(
  {
    id: {
      type: String,
      default: uuid.v4,
      unique: true
    },
    consumerID: {
      type: String,
      ref: 'User',
      required: [true, 'ConsumerID is required.']
    },
    planID: {
      type: String,
      ref: 'Plan',
      required: [true, 'PlanID is required.']
    },
    election: {
      type: Number,
      required: [true, 'Election is required.']
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
      },
      virtuals: true
    },
    toObject: { virtuals: true },
    timestamps: true
  }
);

EnrollmentSchema.virtual('plan', {
  ref: 'Plan',
  localField: 'planID',
  foreignField: 'id',
  justOne: true
});
