import request, { Response } from 'supertest';

import app from 'app';
import { Enrollment } from 'types/insurance';

const adminToken = process.env.ADMIN_TOKEN;

export const mockCreateEnrollmentOnUser = async (
  userId: string,
  data: Omit<Enrollment, 'id' | 'consumerID'>
): Promise<Response> =>
  request(app).post(`/users/${userId}/enrollments`).send(data).set('Authorization', adminToken);

export const mockGetEnrollment = async (docId: string, userId: string): Promise<Response> =>
  request(app).get(`/users/${userId}/enrollments/${docId}`).set('Authorization', adminToken);

export const mockGetEnrollments = async (userId: string): Promise<Response> =>
  request(app).get(`/users/${userId}/enrollments`).set('Authorization', adminToken);

export const mockUpdateEnrollment = async (
  docId: string,
  userId: string,
  data: Omit<Enrollment, 'id' | 'consumerID'>
): Promise<Response> =>
  request(app)
    .patch(`/users/${userId}/enrollments/${docId}`)
    .send(data)
    .set('Authorization', adminToken);
