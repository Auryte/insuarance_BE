import {
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB
} from 'middlewares/globalErrorHandler';
import mongoose from 'mongoose';
import { User } from 'types/user';

export function handleMongoError(err: any) {
  let error: any;
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err instanceof mongoose.Error.CastError) error = handleCastErrorDB(err);
  if (err instanceof mongoose.Error.ValidationError) error = handleValidationErrorDB(err);
  return error;
}

export function updateErrorMessage(
  fields: Record<'name' | 'message', string | undefined>[],
  user: User
) {
  // eslint-disable-next-line no-restricted-syntax
  for (const field of fields) {
    const errorProperty = field.name;
    field.message = `User ${user.username} (${user.firstName} ${user.lastName}). ${errorProperty} ${
      user[errorProperty as keyof User]
    }. ${field.message}`;
  }
}
