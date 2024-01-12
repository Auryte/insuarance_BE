import { model } from 'mongoose';
import { NextFunction, Request, Response } from 'express';

import { EmployerSchema } from 'schemas/employer';
import checkEmployerInDB from 'middlewares/checkEmployerInDB';
import { mockEmployer } from 'mock/employer';
import { mockGetPlan } from 'mock/utils/plan.utils';

const EmployerModel = model('Employer', EmployerSchema);

const mockNext: NextFunction = jest.fn();

const mockRequest: Partial<Request> = {
  headers: {
    authorization: `Bearer ${process.env.ADMIN_TOKEN}`
  },
  params: {
    employerId: mockEmployer.id
  }
};

describe('checkEmployerInDB', () => {
  beforeEach(async () => {
    await EmployerModel.create(mockEmployer);
  });

  it('should return 404 error if no employer in DB', async () => {
    const res = await mockGetPlan('111', 'invalid-employer-id');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('No employer found with that ID.');
  });

  it('should call next function if found employer in DB', async () => {
    await checkEmployerInDB(mockRequest as Request, {} as Response, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
