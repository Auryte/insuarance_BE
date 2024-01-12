import request from 'supertest';
import { model } from 'mongoose';

import app from 'app';
import { User } from 'types/user';
import { ClaimStatus } from 'types/insurance';
import { ClaimSchema } from 'schemas/claim';
import { UserSchema } from 'schemas/user';
import { EmployerSchema } from 'schemas/employer';
import { PlanSchema } from 'schemas/plan';
import { mockEmployer } from 'mock/employer';
import { mockUsers } from 'mock/user';
import { mockClaim, mockClaims } from 'mock/claim';
import { mockPlan } from 'mock/plan';
import { mockCreateClaimOnUser, mockGetClaim, mockUpdateClaim } from 'mock/utils/claim.utils';

const adminToken = process.env.ADMIN_TOKEN;
const consumerToken = process.env.CONSUMER_TOKEN;

const plan = {
  ...mockPlan,
  employerId: mockEmployer.id
};
const mockUser = mockUsers[1];

const ClaimModel = model('Claim', ClaimSchema);
const UserModel = model('User', UserSchema);
const EmployerModel = model('Employer', EmployerSchema);
const PlanModel = model('Plan', PlanSchema);

describe('Create Claim Endpoint', () => {
  let user: User;
  let planID: string;
  beforeEach(async () => {
    await EmployerModel.create(mockEmployer);
    const newPlan = await PlanModel.create(plan);
    planID = newPlan.id;
    user = await UserModel.create(mockUser);
  });

  it('should send a response 403 (Bad Request) if user has no access to create claim', async () => {
    await EmployerModel.deleteOne({ id: mockEmployer.id });
    await EmployerModel.create({ ...mockEmployer, claimFilling: false });
    const res = await mockCreateClaimOnUser(user.id, { ...mockClaim, planID });
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('This possibility was prevented');
  });

  it('should send a response 400 (Bad Request) if provided data is not valid', async () => {
    const res = await mockCreateClaimOnUser(user.id, {
      ...mockClaim,
      startDate: 'intentional-wrong-date',
      planID
    });
    expect(res.badRequest).toBeTruthy();
    expect(res.statusCode).toEqual(400);
  });

  it('should send a response 404 (Not Found) if no user was found with that ID', async () => {
    const res = await mockCreateClaimOnUser('intentional-wrong-id', mockClaim);
    expect(res.notFound).toBeTruthy();
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('No user found with that ID.');
  });

  it('should send a response 404 (Not Found) if no plan was found with that ID', async () => {
    const res = await mockCreateClaimOnUser(user.id, mockClaim);
    expect(res.notFound).toBeTruthy();
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('No plan found with that ID.');
  });

  it('should create a new claim in DB and send it back as a response 201 (Created) if provided data is valid', async () => {
    const res = await mockCreateClaimOnUser(user.id, { ...mockClaim, planID });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject({ ...mockClaim, planID });
  });

  it('should send a response 404 (Not Found) if provided date is invalid', async () => {
    const res = await mockCreateClaimOnUser(user.id, {
      ...mockClaim,
      planID,
      startDate: '2044-11-24T17:09:58+0000'
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Claim date should be within the boundary of plan year.');
  });
});

describe('Get Claim Endpoint', () => {
  let user: User;
  let planID: string;
  beforeEach(async () => {
    await EmployerModel.create(mockEmployer);
    const newPlan = await PlanModel.create(plan);
    planID = newPlan.id;
    user = await UserModel.create(mockUser);
  });

  it('should get a claim from DB and send it back as a response 200 (OK)', async () => {
    const resCreate = await mockCreateClaimOnUser(user.id, { ...mockClaim, planID });
    const docId = resCreate.body.id;
    const resGet = await mockGetClaim(docId);
    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body).toMatchObject({ ...mockClaim, planID });
  });

  it('should send a response 404 (Not Found) if no document was found with such ID', async () => {
    await mockCreateClaimOnUser(user.id, { ...mockClaim, planID });
    const resGet = await mockGetClaim('intentional-wrong-id');
    expect(resGet.notFound).toBeTruthy();
    expect(resGet.statusCode).toEqual(404);
    expect(resGet.body.message).toEqual('No claim found with that ID.');
  });
});

describe('Update Claim Endpoint', () => {
  let user: User;
  let planID: string;
  beforeEach(async () => {
    await EmployerModel.create(mockEmployer);
    const newPlan = await PlanModel.create(plan);
    planID = newPlan.id;
    user = await UserModel.create(mockUser);
  });

  it('should send a response 400 (Bad Request) if provided data is not valid', async () => {
    const res = await mockCreateClaimOnUser(user.id, {
      ...mockClaim,
      planID,
      startDate: 'intentional-wrong-date'
    });
    expect(res.badRequest).toBeTruthy();
    expect(res.statusCode).toEqual(400);
  });

  it('should send a response 404 (Not Found) if no document was found with such ID', async () => {
    await mockCreateClaimOnUser(user.id, { ...mockClaim, planID });
    const resGet = await mockGetClaim('intentional-wrong-id');
    expect(resGet.notFound).toBeTruthy();
    expect(resGet.statusCode).toEqual(404);
    expect(resGet.body.message).toEqual('No claim found with that ID.');
  });

  it("should send a response 200 (OK) if claim's status was changed from 'pending' to 'denied'", async () => {
    const resCreate = await mockCreateClaimOnUser(user.id, { ...mockClaim, planID });
    const docId = resCreate.body.id;
    const updatedMockClaim = { ...mockClaim, planID, status: ClaimStatus.denied };
    const resUpdate = await mockUpdateClaim(docId, updatedMockClaim);
    expect(resUpdate.statusCode).toEqual(200);
    expect(resUpdate.body).toMatchObject(updatedMockClaim);
  });

  it('should send a response 400 (Bad Request) if not a pending claim was about to be approved/denied', async () => {
    const resCreate = await mockCreateClaimOnUser(user.id, { ...mockClaim, planID });
    const docId = resCreate.body.id;
    const updatedMockClaim = { ...mockClaim, planID, status: ClaimStatus.approved };
    await mockUpdateClaim(docId, updatedMockClaim);
    const resUpdate = await mockUpdateClaim(docId, updatedMockClaim);
    expect(resUpdate.badRequest).toBeTruthy();
    expect(resUpdate.statusCode).toEqual(400);
    expect(resUpdate.body.message).toEqual("Only a claim with status 'pending' can be updated.");
  });

  it('should update a claim in DB and send it back as a response 200 (OK)', async () => {
    const resCreate = await mockCreateClaimOnUser(user.id, { ...mockClaim, planID });
    const docId = resCreate.body.id;
    const updatedMockClaim = { ...mockClaim, planID, amount: 111 };
    const resUpdate = await mockUpdateClaim(docId, updatedMockClaim);
    expect(resUpdate.statusCode).toEqual(200);
    expect(resUpdate.body).toMatchObject(updatedMockClaim);
  });
});

describe('Claims tests', () => {
  beforeEach(async () => {
    await ClaimModel.create(mockClaims);
    await UserModel.create(mockUsers);
    await EmployerModel.create(mockEmployer);
  });

  it('GET /claims admin should gets all claims', async () => {
    const response = await request(app).get('/claims').set('Authorization', adminToken);
    expect(response.body.data).toHaveLength(3);
  });

  it('GET /claims admin should gets expected search result', async () => {
    const response = await request(app)
      .get('/claims/?number&employer&page=1&limit=9&status=pending')
      .set('Authorization', adminToken);
    expect(response.body.data).toHaveLength(3);
  });

  it('GET /claims admin should gets expected search result with all filters', async () => {
    const response = await request(app)
      .get('/claims/?number=by&employer=by&page=1&limit=9&status=pending')
      .set('Authorization', adminToken);
    expect(response.body.data).toHaveLength(2);
  });

  it('GET /claims admin should gets empty search result with invalid filters', async () => {
    const response = await request(app)
      .get('/claims/?number=by&employer=lv&page=1&limit=9&status=pending')
      .set('Authorization', adminToken);
    expect(response.body.data).toHaveLength(0);
  });

  it('GET /claims admin should gets search result with default page with invalid page value in URL', async () => {
    const response = await request(app)
      .get('/claims/?number=&employer=&page=dgdsfgdfgdfs&limit=9&status=pending')
      .set('Authorization', adminToken);
    expect(response.body.data).toHaveLength(3);
  });

  it('GET /claims consumer should gets her own claims', async () => {
    const response = await request(app).get('/claims').set('Authorization', consumerToken);
    expect(response.body.data).toHaveLength(2);
  });
});
