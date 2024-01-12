import app from 'app';
import request, { Response } from 'supertest';
import { Claim } from 'types/insurance';

const adminToken = process.env.ADMIN_TOKEN;

export const mockCreateClaimOnUser = async (
  userId: string,
  data: Omit<Claim, 'id' | 'consumerID' | 'number' | 'status'>
): Promise<Response> =>
  request(app).post(`/users/${userId}/claims`).send(data).set('Authorization', adminToken);

export const mockGetClaim = async (docId: string): Promise<Response> =>
  request(app).get(`/claims/${docId}`).set('Authorization', adminToken);

export const mockUpdateClaim = async (
  docId: string,
  data: Omit<Claim, 'id' | 'consumerID' | 'number' | 'status'>
): Promise<Response> =>
  request(app).patch(`/claims/${docId}`).send(data).set('Authorization', adminToken);
