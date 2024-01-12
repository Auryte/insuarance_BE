import { Request, Response, NextFunction } from 'express';
import unless from 'middlewares/exceptionWrapper';

const mockTokenAuth = jest.fn();
const createMockRequest = (mockPath: string): Partial<Request> => {
  const mockRequest: Partial<Request> = {
    path: mockPath
  };
  return mockRequest;
};
const mockResponse: Partial<Response> = {};
const mockNext: NextFunction = jest.fn();

describe('With exception path', () => {
  const mockExceptions: string[] = ['/login', '/'];
  const mockRequest = createMockRequest('/login');

  it('"tokenAuth" function shouldn\'t be executed', () => {
    unless(mockExceptions, mockTokenAuth)(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});

describe('With non-exception path', () => {
  const mockExceptions: string[] = ['/login', '/'];
  const mockRequest = createMockRequest('/test');

  it('"tokenAuth" function should be executed', () => {
    unless(mockExceptions, mockTokenAuth)(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );
    expect(mockTokenAuth).toHaveBeenCalledTimes(1);
  });
});
