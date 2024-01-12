import mongoose from 'mongoose';
import * as uuid from 'uuid';

import { Claim, ClaimStatus } from 'types/insurance';

export const ClaimSchema = new mongoose.Schema<Claim>(
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
    number: {
      type: String,
      unique: true,
      required: [true, 'Number is required.']
    },
    startDate: {
      type: String,
      required: [true, 'StartDate is required.']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required.']
    },
    status: {
      type: String,
      enum: ClaimStatus,
      default: ClaimStatus.pending
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

ClaimSchema.virtual('consumer', {
  ref: 'User',
  localField: 'consumerID',
  foreignField: 'id',
  justOne: true
});

ClaimSchema.virtual('plan', {
  ref: 'Plan',
  localField: 'planID',
  foreignField: 'id',
  justOne: true
});
