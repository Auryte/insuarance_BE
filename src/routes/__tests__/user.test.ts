import request from 'supertest';
import { model } from 'mongoose';

import app from 'app';
import { UserSchema } from 'schemas/user';
import { mockUser, mockConsumers, users } from 'mock/user';
import { mockEmployer } from 'mock/employer';
import { EmployerBody } from 'types/employer';
import { EmployerSchema } from 'schemas/employer';
import {
  mockCreateUser,
  mockCreateUsers,
  mockGetUser,
  mockLogin,
  mockUpdateUser
} from 'mock/utils/user.utils';

const adminToken = process.env.ADMIN_TOKEN;
const emplToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzYWFlZDIxNDU1NTY2NjFmNWQyYzEwYyIsInVzZXJuYW1lIjoiQWRtaW5hIiwiZW1haWwiOiJhZG1pbmFAdmFsaW8uY29tIiwicm9sZSI6ImVtcGxveWVyIiwicGFzc3dvcmQiOiIkMmIkMTIkY25nbThpVjk0L1dLVnBVeklQcDRZLlJkdnZCOVRXRVhKVGJoZVlEcjk3a09vbVo3eGJLanEiLCJmaXJzdE5hbWUiOiJBZG1pbmEiLCJsYXN0TmFtZSI6IkFkbWluYWl0ZSIsImVtcGxveWVySUQiOiI2MTYxYTU1My0yMGY2LTQ2YmEtYjdjYS03ZjZjNTU2NDU3MDgiLCJpZCI6IjE2M2NiMzcwLTIxNzAtNGY3OS1hMThiLWJjZmFjZjRjMTQ5ZCIsImNyZWF0ZWRBdCI6IjIwMjItMTItMjdUMTM6MDM6MjkuNjc0WiIsInVwZGF0ZWRBdCI6IjIwMjItMTItMjdUMTM6MDM6MjkuNjc0WiIsIl9fdiI6MH0sImlhdCI6MTY3MjE0NjI3Mn0.fgFZ5fM9W5_8Rj9cUubQC1Pzu_ErMZ_tEO7W5xpwH-4';

const EmployerModel = model<EmployerBody>('Employer', EmployerSchema);
const UserModel = model('User', UserSchema);

describe('Create User Endpoint', () => {
  it('should create a new user in DB and send it back as a response 201 (Created) if provided data is valid', async () => {
    const res = await mockCreateUser();
    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject(mockUser);
  });

  it('should send a response 400 (Bad Request) if provided data is not valid', async () => {
    const res = await mockCreateUser('jsmith@example');
    expect(res.badRequest).toBeTruthy();
    expect(res.statusCode).toEqual(400);
  });
});

describe('Get User Endpoint', () => {
  it('should get a user from DB and send it back as a response 200 (OK)', async () => {
    const resCreate = await mockCreateUser();
    const docId = resCreate.body.id;
    const resGet = await mockGetUser(docId);
    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body).toMatchObject(mockUser);
  });

  it('should send a response 404 (Not Found) if no document was found with such ID', async () => {
    await mockCreateUser();
    const resGet = await mockGetUser('intentional-wrong-id');
    expect(resGet.notFound).toBeTruthy();
    expect(resGet.statusCode).toEqual(404);
    expect(resGet.body.message).toEqual('No user found with that ID.');
  });
});

describe('Login Endpoint', () => {
  it('should log a user in and send token back as a response 200 (OK) if provided credentials are valid', async () => {
    await mockCreateUser();
    const res = await mockLogin('Jsmith#1234');
    expect(res.ok).toBeTruthy();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should send a response 400 (Bad Request) with error message if required credentials are missing', async () => {
    await mockCreateUser();
    const res = await mockLogin();
    expect(res.badRequest).toBeTruthy();
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Please provide username and password.');
  });

  it('should send a response 401 (Unauthorized) with error message if provided credentials are not valid', async () => {
    await mockCreateUser();
    const res = await mockLogin('Jsmith#123456789');
    expect(res.unauthorized).toBeTruthy();
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Incorrect username or password.');
  });
});

describe('GET users', () => {
  beforeEach(async () => {
    await UserModel.create(users);
  });

  it('request without query params should returns all users', async () => {
    const response = await request(app)
      .get('/users/6161a553-20f6-46ba-b7ca-7f6c55645708/users')
      .set('Authorization', emplToken);
    expect(response.body.data).toHaveLength(3);
  });
  it('request with limit param should returns 2 users', async () => {
    const response = await request(app)
      .get('/users/6161a553-20f6-46ba-b7ca-7f6c55645708/users?limit=2')
      .set('Authorization', emplToken);
    expect(response.body.data).toHaveLength(2);
  });

  it('request with limit and page param should returns 1 user', async () => {
    const response = await request(app)
      .get('/users/6161a553-20f6-46ba-b7ca-7f6c55645708/users?limit=2&page=2')
      .set('Authorization', emplToken);
    expect(response.body.data).toHaveLength(1);
  });
  it('request with firstName param should returns 2 users', async () => {
    const response = await request(app)
      .get('/users/6161a553-20f6-46ba-b7ca-7f6c55645708/users?firstName=jo')
      .set('Authorization', emplToken);
    expect(response.body.data).toHaveLength(2);
  });
  it('request with firstName and lastName param should returns 2 users', async () => {
    const response = await request(app)
      .get('/users/6161a553-20f6-46ba-b7ca-7f6c55645708/users?firstName=jo&lastName=mith')
      .set('Authorization', emplToken);
    expect(response.body.data).toHaveLength(2);
  });
  it('request with SSN param should returns 3 users', async () => {
    const response = await request(app)
      .get('/users/6161a553-20f6-46ba-b7ca-7f6c55645708/users?SSN=234&role=consumer')
      .set('Authorization', emplToken);
    expect(response.body.data).toHaveLength(3);
  });
  it('request with admin token should returns 0 users "consumers"', async () => {
    const response = await request(app)
      .get('/users/6161a553-20f6-46ba-b7ca-7f6c55645708/users')
      .set('Authorization', adminToken);
    expect(response.body.data).toHaveLength(0);
  });
  it('request with wrong url should returns error', async () => {
    const response = await request(app)
      .get('/6161a553-6c55645708/users')
      .set('Authorization', emplToken);
    expect(response.statusCode).toEqual(404);
  });
});

describe('Update Employer User Endpoint', () => {
  let docId: string;
  beforeEach(async () => {
    const res = await mockCreateUser();
    docId = res.body.id;
  });

  it('should update a user from DB and send it back as a response 200 (OK)', async () => {
    const resUpdate = await mockUpdateUser(docId, {
      ...mockUser,
      username: 'NewName',
      firstName: 'MyName',
      lastName: 'MyLastName',
      email: 'name@lastname.com',
      password: 'Admin#123'
    });
    expect(resUpdate.statusCode).toEqual(200);
    expect(resUpdate.body).toMatchObject({
      ...mockUser,
      username: 'NewName',
      firstName: 'MyName',
      lastName: 'MyLastName',
      email: 'name@lastname.com'
    });
  });

  it('should send a response 404 (Not Found) if no document was found with such ID', async () => {
    const resUpdate = await mockUpdateUser('wrong', {
      ...mockUser,
      username: 'NewName',
      firstName: 'MyName',
      lastName: 'MyLastName',
      email: 'name@lastname.com',
      password: 'Admin#123'
    });
    expect(resUpdate.notFound).toBeTruthy();
    expect(resUpdate.statusCode).toEqual(404);
    expect(resUpdate.body.message).toEqual('No user found with that ID.');
  });
});

describe('Create many users', () => {
  let employerId: string; // this employerId the same as employerId in employerToken
  beforeEach(async () => {
    const employer = await EmployerModel.create({
      ...mockEmployer,
      id: 'ac2489c9-9e98-48a6-bafc-4f9e159bfeae'
    });
    employerId = employer.id;
  });

  test('return array with new users if employer trying to create users', async () => {
    const res = await mockCreateUsers(employerId, mockConsumers);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject(
      mockConsumers.map(user => {
        const { password, ...rest } = user;
        return rest;
      })
    );
  });

  test('return error if employer trying to create user for another employer', async () => {
    const newEmployer = await EmployerModel.create({
      ...mockEmployer,
      name: 'BY - CoherentSolutions2'
    });
    const res = await mockCreateUsers(newEmployer.id, users);

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('You can not access to this action');
  });

  test('server should return validation errors if user trying to create users with invalid body', async () => {
    const res = await mockCreateUsers(employerId, [
      ...mockConsumers,
      { ...mockConsumers[0], username: '1' },
      { ...mockConsumers[0], password: '1' }
    ]);
    expect(res.statusCode).toEqual(400);
    expect(res.body.mongoDBErrors).toHaveLength(0);
    expect(res.body.validationErrors).toHaveLength(2);
  });

  test('server should return mongo errors if user trying to create users who already have', async () => {
    await mockCreateUsers(employerId, mockConsumers);
    const res = await mockCreateUsers(employerId, mockConsumers);
    expect(res.statusCode).toEqual(400);
    expect(res.body.validationErrors).toHaveLength(0);
    expect(res.body.mongoDBErrors).toHaveLength(3);
  });
});
