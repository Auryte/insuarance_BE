import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

beforeEach(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

jest.mock('middlewares/globalErrorHandler', () => ({
  ...jest.requireActual('middlewares/globalErrorHandler'),
  globalErrorHandler: jest.fn((err, req, res, next) =>
    res.status(err.statusCode).json({
      message: err.message
    })
  )
}));
