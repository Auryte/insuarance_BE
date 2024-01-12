import mongoose from 'mongoose';
import * as uuid from 'uuid';
import { User, UserRole } from 'types/user';

export const UserSchema = new mongoose.Schema<User>(
  {
    id: {
      type: String,
      default: uuid.v4,
      unique: true
    },
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required.']
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, 'Email is required.']
    },
    role: {
      type: String,
      enum: UserRole
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Password is required.']
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    SSN: {
      type: String,
      unique: true
    },
    phone: {
      type: String,
      unique: true
    },
    street: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    zipCode: {
      type: String
    },
    employerID: {
      type: String,
      ref: 'Employer'
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
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

UserSchema.virtual('employer', {
  ref: 'Employer',
  localField: 'employerID',
  foreignField: 'id',
  justOne: true
});

UserSchema.virtual('enrollments', {
  ref: 'Enrollment',
  foreignField: 'consumerID',
  localField: 'id'
});
