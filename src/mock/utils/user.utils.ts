import app from 'app';
import request, { Response } from 'supertest';
import { User } from 'types/user';
import { mockUser } from '../user';

const adminToken = process.env.ADMIN_TOKEN;
const employerToken = process.env.EMPLOYER_TOKEN;

export const mockLogin = async (password?: string): Promise<Response> =>
  request(app)
    .post('/users/login')
    .send({ username: mockUser.username, password })
    .set('Authorization', adminToken);

export const mockCreateUser = async (email?: string): Promise<Response> =>
  request(app)
    .post('/users')
    .send({
      ...mockUser,
      email: email || 'jsmith@example.com',
      password: 'Jsmith#1234'
    })
    .set('Authorization', adminToken);

export const mockGetUser = async (docId: string): Promise<Response> =>
  request(app).get(`/users/${docId}`).set('Authorization', adminToken);

export const mockCreateUsers = async (employerID: string, data: Omit<User, 'id'>[]) =>
  request(app)
    .post(`/users/${employerID}/users/upload-scv`)
    .send(data)
    .set('Authorization', employerToken);

export const mockUpdateUser = async (docId: string, data: Omit<User, 'id'>): Promise<Response> =>
  request(app).patch(`/users/${docId}`).set('Authorization', adminToken).send(data);
