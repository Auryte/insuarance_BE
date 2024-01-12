import request from 'supertest';

import app from 'app';
import employerModel from 'models/employer';
import {
  mockCreateEmployer,
  mockGetEmployer,
  mockUpdateEmployer,
  mockUpdateEmployerRules
} from 'mock/utils/employer.utils';
import {
  invalidEmployerBody,
  mockSetup,
  updatedEmployerBody,
  validEmployerBody
} from 'mock/employer';

const adminToken = process.env.ADMIN_TOKEN;
const employerToken = process.env.EMPLOYER_TOKEN;

describe('Create Employer', () => {
  it('server works', async () => {
    const response = await request(app).get('/').set('Authorization', adminToken);
    expect(response.statusCode).toBe(200);
  });

  it('POST /employers without body should returns error', async () => {
    const response = await mockCreateEmployer();
    expect(response.statusCode).toBe(400);
  });

  it('POST /employers with invalid body should returns error', async () => {
    const response = await mockCreateEmployer(invalidEmployerBody);

    expect(response.statusCode).toBe(400);
  });

  it('POST /employers with valid body should returns new employer', async () => {
    const response = await mockCreateEmployer(validEmployerBody);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe('BY - ISsoft');
    expect(response.body.code).toBe('BY');
    expect(response.body.street).toBe('Chapaeva');
    expect(response.body.city).toBe('Minsk');
    expect(response.body.phone).toBe('1234567890');
  });
});

let employerId: string;

describe('Update Employer', () => {
  beforeEach(async () => {
    const employer = await employerModel.addNewEmployer(validEmployerBody);
    const { id } = employer;
    employerId = id;
  });

  it('PATCH /employers without body should returns error', async () => {
    const response = await mockUpdateEmployer(employerId);
    expect(response.statusCode).toBe(400);
  });

  it('PATCH /employers with invalid body should returns error', async () => {
    const response = await mockUpdateEmployer(employerId, invalidEmployerBody);
    expect(response.statusCode).toBe(400);
  });

  it('PATCH /employers with valid body should returns updated employer', async () => {
    const response = await mockUpdateEmployer(employerId, updatedEmployerBody);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('US - Coherent Solutions');
    expect(response.body.code).toBe('US');
    expect(response.body.street).toBe('1600 Utica Ave S, Suite 120');
    expect(response.body.city).toBe('Minneapolis');
    expect(response.body.phone).toBe('16122796262');
  });

  it('PATCH /employers with invalid id in URL should returns error', async () => {
    const response = await mockUpdateEmployer('111', validEmployerBody);
    expect(response.statusCode).toBe(404);
  });
});

describe('GET employers', () => {
  beforeEach(async () => {
    await employerModel.addNewEmployer(validEmployerBody);
    await employerModel.addNewEmployer({
      ...validEmployerBody,
      name: 'BY - ISsoft1'
    });
    await employerModel.addNewEmployer({
      ...validEmployerBody,
      name: 'BY - ISsoft2'
    });
    await employerModel.addNewEmployer({
      ...validEmployerBody,
      name: 'BY - ISsoft3'
    });
    await employerModel.addNewEmployer({
      ...validEmployerBody,
      name: 'BY - ISsoft4'
    });
  });

  it('request without query params should returns all employers', async () => {
    const response = await request(app).get('/employers').set('Authorization', adminToken);
    expect(response.body.data).toHaveLength(5);
  });

  it('request with limit param should returns 3 employers', async () => {
    const response = await request(app).get('/employers?limit=3').set('Authorization', adminToken);
    expect(response.body.data).toHaveLength(3);
  });

  it('request with limit and page param should returns 2 employers', async () => {
    const response = await request(app)
      .get('/employers?limit=3&page=2')
      .set('Authorization', adminToken);
    expect(response.body.data).toHaveLength(2);
  });

  it('request with limit, page, name param should returns 2 employers', async () => {
    const response = await request(app)
      .get('/employers?limit=3&page=2&name=by')
      .set('Authorization', adminToken);
    expect(response.body.data).toHaveLength(2);
  });

  it('request with limit, page, name, code (DB does not have docs with this code) param should returns 0 employers', async () => {
    const response = await request(app)
      .get('/employers?limit=3&page=2&name=by&code=gb')
      .set('Authorization', adminToken);
    expect(response.body.data).toHaveLength(0);
  });
});

describe('GET employer', () => {
  beforeEach(async () => {
    const employer = await employerModel.addNewEmployer({
      ...validEmployerBody,
      name: 'BY - ISsoft1'
    });
    const { id } = employer;
    employerId = id;
  });

  it('request should have status 200 if correct employer ID is provided', async () => {
    const resEmployer = await mockGetEmployer(employerId);
    expect(resEmployer.statusCode).toEqual(200);
  });

  it('request should return employer with correct ID and correct name', async () => {
    const resEmployer = await mockGetEmployer(employerId);
    expect(resEmployer.body.name).toBe('BY - ISsoft1');
  });

  it('request should have status 404 if incorrect epmloyer ID is provided', async () => {
    const resEmployer = await mockGetEmployer('incorrectId');
    expect(resEmployer.statusCode).toEqual(404);
  });
});

describe('Manage rules', () => {
  beforeEach(async () => {
    const employer = await employerModel.addNewEmployer(validEmployerBody);
    const { id } = employer;
    employerId = id;
  });

  test('Admin can change rules for employer', async () => {
    const response = await mockUpdateEmployerRules(employerId, mockSetup, adminToken);
    expect(response.statusCode).toEqual(200);
  });

  test('Admin can change rules (with full settings) for employer', async () => {
    const response = await mockUpdateEmployerRules(
      employerId,
      { ...mockSetup, addConsumers: false },
      adminToken
    );
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      ...validEmployerBody,
      id: employerId,
      claimFilling: false,
      addConsumers: false
    });
  });

  test('Server return error if setup body is invalid', async () => {
    const response = await mockUpdateEmployerRules(
      employerId,
      { ...mockSetup, invalid: 'invalid' },
      adminToken
    );

    expect(response.statusCode).toEqual(400);
  });

  test('Server return error if employer try to change settings for another employer', async () => {
    const response = await mockUpdateEmployerRules(employerId, mockSetup, employerToken);
    expect(response.statusCode).toEqual(403);
    expect(response.body.message).toEqual('You can not access to this action');
  });

  test('Server return error if user send request with invalid employerId', async () => {
    const response = await mockUpdateEmployerRules('111', mockSetup, employerToken);
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual('No employer found with that ID.');
  });
});
