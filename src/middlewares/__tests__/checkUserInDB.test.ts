import { NextFunction, Request, Response } from 'express';

import checkUserInDB from 'middlewares/checkUserInDB';
import UserModel from 'models/user';
import { mockUser } from 'mock/user';
import { mockGetUser } from 'mock/utils/user.utils';

const mockNext: NextFunction = jest.fn();

const mockRequest: Partial<Request> = {
  headers: {
    authorization: `Bearer ${process.env.ADMIN_TOKEN}`
  }
};

describe('checkUserInDB', () => {
  let userId: string;

  beforeEach(async () => {
    const user = await UserModel.createUser({
      ...mockUser,
      id: 'd748ebc8-8179-4737-9bd8-d767a8eb3212',
      email: 'jsmith@example.com',
      password: 'Jsmith#1234'
    });
    userId = user.id;
  });

  it('should return 404 error if no user in DB', async () => {
    const res = await mockGetUser('intentional-wrong-id');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('No user found with that ID.');
  });

  it('should call next function if found plan in DB', async () => {
    await checkUserInDB(
      { ...mockRequest, params: { userId } } as Request,
      {} as Response,
      mockNext
    );
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
