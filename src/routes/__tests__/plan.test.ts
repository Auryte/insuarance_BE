import EmployerModel from 'models/employer';
import { mockPlan } from 'mock/plan';
import { mockEmployer, validEmployerBody } from 'mock/employer';
import {
  mockCreatePlan,
  mockDeletePlan,
  mockGetPlan,
  mockGetPlans,
  mockInitializePlan,
  mockUpdatePlan
} from 'mock/utils/plan.utils';
import { mockCreateEmployer } from 'mock/utils/employer.utils';

let employerId: string;

describe('Create Plan Endpoint', () => {
  beforeEach(async () => {
    const employer = await EmployerModel.addNewEmployer(mockEmployer);
    employerId = employer.id;
  });

  it('should create a new plan in DB and send it back as a response 201 (Created) if provided data is valid', async () => {
    const res = await mockCreatePlan(mockPlan, employerId);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject(mockPlan);
  });

  it('should send a response 404 (Bad Request) if we don"t have employer with this ID in DB', async () => {
    const res = await mockCreatePlan(mockPlan, `employers/${123}`);
    expect(res.statusCode).toEqual(404);
  });

  it('should send a response 400 (Bad Request) if provided data is not valid', async () => {
    const res = await mockCreatePlan(
      {
        ...mockPlan,
        name: 'Test Dental Insurance 123'
      },
      employerId
    );
    expect(res.badRequest).toBeTruthy();
    expect(res.statusCode).toEqual(400);
  });
});

describe('Get Plan Endpoint', () => {
  beforeEach(async () => {
    const employer = await EmployerModel.addNewEmployer(mockEmployer);
    employerId = employer.id;
  });

  it('should get a plan from DB and send it back as a response 200 (OK)', async () => {
    const resCreate = await mockCreatePlan(mockPlan, employerId);
    const docId = resCreate.body.id;
    const resGet = await mockGetPlan(docId, employerId);
    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body).toMatchObject(mockPlan);
  });

  it('should get all plans for selected user from DB and send it back as a response 200 (OK)', async () => {
    await mockCreatePlan(mockPlan, employerId);
    await mockCreatePlan(mockPlan, employerId);
    await mockCreatePlan(mockPlan, employerId);

    const resGet = await mockGetPlans(employerId);
    expect(resGet.body).toHaveLength(3);
  });

  it('should send a response 404 (Not Found) if no document was found with such ID', async () => {
    await mockCreatePlan(mockPlan, employerId);
    const resGet = await mockGetPlan('intentional-wrong-id', employerId);
    expect(resGet.notFound).toBeTruthy();
    expect(resGet.statusCode).toEqual(404);
    expect(resGet.body.message).toEqual('No plan found with that ID.');
  });
});

describe('Update Plan Endpoint', () => {
  beforeEach(async () => {
    const response = await mockCreateEmployer(validEmployerBody);
    employerId = response.body.id;
  });

  it('should update a plan in DB and send it back as a response 200 (OK) if provided data is valid', async () => {
    const resCreate = await mockCreatePlan(mockPlan, employerId);
    const docId = resCreate.body.id;
    const resUpdate = await mockUpdatePlan(docId, employerId, {
      ...mockPlan,
      name: 'Updated Test Dental Insurance'
    });
    expect(resUpdate.statusCode).toEqual(200);
    expect(resUpdate.body).toMatchObject({
      ...mockPlan,
      name: 'Updated Test Dental Insurance'
    });
  });

  it('should send a response 400 (Bad Request) if provided data is not valid', async () => {
    const resCreate = await mockCreatePlan(mockPlan, employerId);
    const docId = resCreate.body.id;
    const resUpdate = await mockUpdatePlan(docId, employerId, {
      ...mockPlan,
      name: 'Updated Test Dental Insurance 123'
    });
    expect(resUpdate.badRequest).toBeTruthy();
    expect(resUpdate.statusCode).toEqual(400);
  });

  it('should send a response 404 (Not Found) if no document was found with such ID', async () => {
    await mockCreatePlan(mockPlan, employerId);
    const resGet = await mockUpdatePlan('intentional-wrong-id', employerId, mockPlan);
    expect(resGet.notFound).toBeTruthy();
    expect(resGet.statusCode).toEqual(404);
    expect(resGet.body.message).toEqual('No plan found with that ID.');
  });
});

describe('Delete Plan Endpoint', () => {
  beforeEach(async () => {
    const employer = await EmployerModel.addNewEmployer(mockEmployer);
    employerId = employer.id;
  });

  it('should delete a new plan in DB and send back as a response 200', async () => {
    await mockCreatePlan(mockPlan, employerId);
    const newPlan = await mockCreatePlan(mockPlan, employerId);
    await mockDeletePlan(newPlan.body.id, employerId);
    const plans = await mockGetPlans(employerId);
    expect(plans.body).toHaveLength(1);
  });

  it('should send a response 404 (Not Found) if no document was found with such ID', async () => {
    await mockCreatePlan(mockPlan, employerId);
    const resGet = await mockDeletePlan('intentional-wrong-id', employerId);
    expect(resGet.notFound).toBeTruthy();
    expect(resGet.statusCode).toEqual(404);
    expect(resGet.body.message).toEqual('No plan found with that ID.');
  });

  it('should send a response 400 (Not Found) if no document was found with such ID', async () => {
    const plan = await mockCreatePlan(mockPlan, employerId);
    await mockInitializePlan(plan.body.id, employerId);
    const resGet = await mockDeletePlan(plan.body.id, employerId);
    expect(resGet.statusCode).toEqual(400);
    expect(resGet.body.message).toEqual(
      `Only a plan that has not been initialized can be deleted.`
    );
  });
});

describe('Initialize Plan Endpoint', () => {
  let planID: string;
  beforeEach(async () => {
    const employer = await EmployerModel.addNewEmployer(mockEmployer);
    employerId = employer.id;
    const plan = await mockCreatePlan(mockPlan, employerId);
    planID = plan.body.id;
  });

  it('should return error if no document was found with such ID', async () => {
    const response = await mockInitializePlan('invalid-plan-ID', employerId);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('No plan found with that ID.');
  });

  it('should return initialized a plan', async () => {
    const response = await mockInitializePlan(planID, employerId);
    expect(response.statusCode).toBe(200);
  });

  it('should return error if user try initialize initialized plan', async () => {
    await mockInitializePlan(planID, employerId);
    const response = await mockInitializePlan(planID, employerId);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Plan already initialized.');
  });

  it('should return error if user try initialize a plan with date after plan end date', async () => {
    const plan = await mockCreatePlan(
      { ...mockPlan, endDate: '2022-11-11T11:34:40+0000' },
      employerId
    );
    planID = plan.body.id;
    const response = await mockInitializePlan(planID, employerId);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      'Plan initialize date should be within the boundary of plan year.'
    );
  });
});
