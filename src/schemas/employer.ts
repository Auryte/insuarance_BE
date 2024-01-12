import mongoose from 'mongoose';
import * as uuid from 'uuid';
import { EmployerBody } from 'types/employer';

export const EmployerSchema = new mongoose.Schema<EmployerBody>(
  {
    id: {
      type: String,
      default: uuid.v4,
      unique: true
    },
    name: {
      type: String,
      unique: true,
      required: [true, 'Name is required.']
    },
    code: {
      type: String,
      required: [true, 'Code is required.']
    },
    street: {
      type: String,
      required: [true, 'Street is required.']
    },
    city: {
      type: String,
      required: [true, 'City is required.']
    },
    phone: {
      type: String,
      required: [true, 'Phone is required.']
    },
    claimFilling: {
      type: Boolean,
      default: true
    },
    addConsumers: {
      type: Boolean,
      default: true
    },
    state: String,
    zipCode: String,
    logo: String
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
      }
    }
  }
);
