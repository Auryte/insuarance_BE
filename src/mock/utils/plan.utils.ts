import app from 'app';
import { Plan } from 'types/insurance';
import request, { Response } from 'supertest';

const adminToken = process.env.ADMIN_TOKEN;

export const mockCreatePlan = async (
  data: Omit<Plan, 'id' | 'initializedAt' | 'initialized' | 'employerId' | 'inactive'>,
  employerId: string
): Promise<Response> =>
  request(app).post(`/employers/${employerId}/plans`).send(data).set('Authorization', adminToken);

export const mockGetPlan = async (docId: string, employerId: string): Promise<Response> =>
  request(app).get(`/employers/${employerId}/plans/${docId}`).set('Authorization', adminToken);

export const mockUpdatePlan = async (
  docId: string,
  employerId: string,
  data: Omit<Plan, 'id' | 'initializedAt' | 'initialized' | 'employerId' | 'inactive'>
): Promise<Response> =>
  request(app)
    .patch(`/employers/${employerId}/plans/${docId}`)
    .send(data)
    .set('Authorization', adminToken);

export const mockGetPlans = async (employerId: string): Promise<Response> =>
  request(app).get(`/employers/${employerId}/plans`).set('Authorization', adminToken);

export const mockDeletePlan = async (planId: string, employerId: string): Promise<Response> =>
  request(app).delete(`/employers/${employerId}/plans/${planId}`).set('Authorization', adminToken);

export const mockInitializePlan = async (planId: string, employerId: string): Promise<Response> =>
  request(app)
    .patch(`/employers/${employerId}/plans/${planId}/initialize`)
    .set('Authorization', adminToken);
