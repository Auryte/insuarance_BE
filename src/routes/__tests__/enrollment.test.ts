import { mockEnrollment } from 'mock/enrollment';
import { mockPlan } from 'mock/plan';
import UserModel from 'models/user';
import EmployerModel from 'models/employer';
import { mockUser } from 'mock/user';
import { mockEmployer } from 'mock/employer';
import { mockCreatePlan } from 'mock/utils/plan.utils';
import {
  mockCreateEnrollmentOnUser,
  mockGetEnrollment,
  mockGetEnrollments,
  mockUpdateEnrollment
} from 'mock/utils/enrollments.utils';

const userBody = {
  ...mockUser,
  id: 'd748ebc8-8179-4737-9bd8-d767a8eb3212',
  email: 'jsmith@example.com',
  password: 'Jsmith#1234'
};

let userId: string;
let employerId: string;
let planId: string;

describe('Create Enrollment Endpoint', () => {
  beforeEach(async () => {
    const user = await UserModel.createUser(userBody);
    userId = user.id;
    const employer = await EmployerModel.addNewEmployer(mockEmployer);
    employerId = employer.id;
    const resPlan = await mockCreatePlan(mockPlan, employerId);
    planId = resPlan.body.id;
  });

  it('should create a new enrollment in DB and send it back as a response 201 (Created) if provided data is valid', async () => {
    const res = await mockCreateEnrollmentOnUser(userId, { ...mockEnrollment, planID: planId });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject({ ...mockEnrollment, planID: planId });
  });

  it('should send a response 400 (Bad Request) if provided data is not valid', async () => {
    const res = await mockCreateEnrollmentOnUser(userId, {
      ...mockEnrollment,
      planID: planId,
      election: 999999999999
    });
    expect(res.badRequest).toBeTruthy();
    expect(res.statusCode).toEqual(400);
  });

  it('should send an error message if there is enrollment from user for this plan already', async () => {
    await mockCreateEnrollmentOnUser(userId, { ...mockEnrollment, planID: planId });
    const res = await mockCreateEnrollmentOnUser(userId, { ...mockEnrollment, planID: planId });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Only one enrollment from user is allowed per plan.');
  });
});

describe('Get Enrollment Endpoint', () => {
  beforeEach(async () => {
    const user = await UserModel.createUser(userBody);
    userId = user.id;
    const employer = await EmployerModel.addNewEmployer(mockEmployer);
    employerId = employer.id;
    const resPlan = await mockCreatePlan(mockPlan, employerId);
    planId = resPlan.body.id;
  });

  it('should get an enrollment from DB and send it back as a response 200 (OK)', async () => {
    const resCreate = await mockCreateEnrollmentOnUser(userId, {
      ...mockEnrollment,
      planID: planId
    });
    const docId = resCreate.body.id;
    const resGet = await mockGetEnrollment(docId, userId);
    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body).toMatchObject({
      ...mockEnrollment,
      planID: planId
    });
  });

  it('should get all enrollments for selected user from DB and send it back as a response 200 (OK)', async () => {
    const resPlan1 = await mockCreatePlan(mockPlan, employerId);
    const resPlan2 = await mockCreatePlan(mockPlan, employerId);
    const resPlan3 = await mockCreatePlan(mockPlan, employerId);

    await mockCreateEnrollmentOnUser(userId, { planID: resPlan1.body.id, election: 111 });
    await mockCreateEnrollmentOnUser(userId, { planID: resPlan2.body.id, election: 222 });
    await mockCreateEnrollmentOnUser(userId, { planID: resPlan3.body.id, election: 333 });

    const resGet = await mockGetEnrollments(userId);
    expect(resGet.body).toHaveLength(3);
  });

  it('should send a response 404 (Not Found) if no document was found with such ID', async () => {
    await mockCreateEnrollmentOnUser(userId, {
      ...mockEnrollment,
      planID: planId
    });
    const resGet = await mockGetEnrollment('intentional-wrong-id', userId);
    expect(resGet.notFound).toBeTruthy();
    expect(resGet.statusCode).toEqual(404);
    expect(resGet.body.message).toEqual('No enrollment found with that ID.');
  });
});

describe('Update Enrollment Endpoint', () => {
  beforeEach(async () => {
    const user = await UserModel.createUser(userBody);
    userId = user.id;
    const employer = await EmployerModel.addNewEmployer(mockEmployer);
    employerId = employer.id;
    const resPlan = await mockCreatePlan(mockPlan, employerId);
    planId = resPlan.body.id;
  });

  it('should update an enrollment in DB and send it back as a response 200 (OK) if provided data is valid', async () => {
    const resCreate = await mockCreateEnrollmentOnUser(userId, {
      ...mockEnrollment,
      planID: planId
    });
    const docId = resCreate.body.id;
    const resUpdate = await mockUpdateEnrollment(docId, userId, {
      ...mockEnrollment,
      planID: planId,
      election: 666
    });
    expect(resUpdate.statusCode).toEqual(200);
    expect(resUpdate.body).toMatchObject({
      ...mockEnrollment,
      planID: planId,
      election: 666
    });
  });

  it('should send a response 400 (Bad Request) if provided data is not valid', async () => {
    const resCreate = await mockCreateEnrollmentOnUser(userId, {
      ...mockEnrollment,
      planID: planId
    });
    const docId = resCreate.body.id;
    const resUpdate = await mockUpdateEnrollment(docId, userId, {
      ...mockEnrollment,
      planID: planId,
      election: 999999999999
    });
    expect(resUpdate.badRequest).toBeTruthy();
    expect(resUpdate.statusCode).toEqual(400);
  });

  it('should send a response 404 (Not Found) if no document was found with such ID', async () => {
    await mockCreateEnrollmentOnUser(userId, {
      ...mockEnrollment,
      planID: planId
    });
    const resUpdate = await mockUpdateEnrollment('intentional-wrong-id', userId, {
      ...mockEnrollment,
      planID: planId,
      election: 666
    });
    expect(resUpdate.notFound).toBeTruthy();
    expect(resUpdate.statusCode).toEqual(404);
    expect(resUpdate.body.message).toEqual('No enrollment found with that ID.');
  });
});
