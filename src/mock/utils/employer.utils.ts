import app from 'app';
import request, { Response } from 'supertest';
import { EmployerBody, EmployerSetup } from 'types/employer';

const adminToken = process.env.ADMIN_TOKEN;

export const mockCreateEmployer = async (
  data?: Omit<EmployerBody, 'id'> | Omit<EmployerBody, 'phone' | 'id' | 'claimFilling'>
) => {
  const response = await request(app)
    .post('/employers')
    .send(data)
    .set('Authorization', adminToken);
  return response;
};

export const mockUpdateEmployer = async (
  id: string,
  data?: Omit<EmployerBody, 'id'> | Omit<EmployerBody, 'phone' | 'id' | 'claimFilling'>
) => {
  const response = await request(app)
    .patch(`/employers/${id}`)
    .send(data)
    .set('Authorization', adminToken);
  return response;
};

export const mockUpdateEmployerRules = async (
  id: string,
  data: EmployerSetup | (EmployerSetup & { invalid: 'invalid' }),
  token: string
) => {
  const response = await request(app)
    .patch(`/employers/${id}/manage-rules`)
    .send(data)
    .set('Authorization', token);
  return response;
};

export const mockGetEmployer = async (employerId: string): Promise<Response> =>
  request(app).get(`/employers/${employerId}`).set('Authorization', adminToken);
