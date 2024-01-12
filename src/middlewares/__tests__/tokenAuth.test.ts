import { Request, Response, NextFunction } from 'express';
import tokenAuth from '../tokenAuth';

const createMockRequest = (mockToken?: string): Partial<Request> => {
  const mockRequest: Partial<Request> = {
    headers: {
      authorization: mockToken ? `Bearer ${mockToken}` : ''
    }
  };
  return mockRequest;
};
const mockResponse: Partial<Response> = {
  send: jest.fn(),
  statusCode: 0,
  status: jest.fn().mockImplementation(x => {
    mockResponse.statusCode = x;
    return mockResponse;
  })
};
const mockNext: NextFunction = jest.fn();

describe('Without provided token', () => {
  const mockRequest = createMockRequest();

  it('should respond with 401 (No token provided) status code', () => {
    tokenAuth(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.statusCode).toEqual(401);
    expect(mockResponse.send).toBeCalledWith({ message: 'No token provided' });
  });
});

describe('With provided token', () => {
  describe('With non-valid token', () => {
    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const mockRequest = createMockRequest(mockToken);

    it('should respond with 401 (Unauthorized) status code', () => {
      tokenAuth(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockResponse.statusCode).toEqual(401);
      expect(mockResponse.send).toBeCalledWith({ message: 'Unauthorized' });
    });
  });

  describe('With valid token', () => {
    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.1mI6367-rdR2iTkX33I2Q-zL7YgwpMl-yn25YVLV8NI';
    const mockRequest = createMockRequest(mockToken);

    it('"next" function should be called', () => {
      tokenAuth(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});
