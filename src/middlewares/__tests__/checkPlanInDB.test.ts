import { NextFunction, Request, Response } from 'express';

import checkPlanInDB from 'middlewares/checkPlanInDB';
import { mockPlan } from 'mock/plan';
import EmployerModel from 'models/employer';
import { mockEmployer } from 'mock/employer';
import { mockCreatePlan, mockGetPlan } from 'mock/utils/plan.utils';

const mockNext: NextFunction = jest.fn();

const mockRequest: Partial<Request> = {
  headers: {
    authorization: `Bearer ${process.env.ADMIN_TOKEN}`
  }
};

describe('checkPlanInDB', () => {
  let employerId: string;
  let planId: string;

  beforeEach(async () => {
    const employer = await EmployerModel.addNewEmployer(mockEmployer);
    employerId = employer.id;
    const resPlan = await mockCreatePlan(mockPlan, employerId);
    planId = resPlan.body.id;
  });

  it('should return 404 error if no plan in DB', async () => {
    const res = await mockGetPlan('intentional-wrong-id', employerId);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('No plan found with that ID.');
  });

  it('should call next function if found plan in DB', async () => {
    await checkPlanInDB(
      {
        ...mockRequest,
        body: {
          planID: planId
        }
      } as Request,
      {} as Response,
      mockNext
    );
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
