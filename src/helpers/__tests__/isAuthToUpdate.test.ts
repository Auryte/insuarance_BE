import { EmployerBody } from 'types/employer';
import { User, UserRole } from 'types/user';
import { TypedRequestBody } from 'types/routes';
import { Token } from 'types/auth';
import { LeanDocument } from 'mongoose';
import { isAuthorizedToUpdate } from '../isAuthToUpdate';

jest.mock('types/routes');

const employerBody: EmployerBody = {
  name: 'US - Coherent Solutions',
  code: 'US',
  street: '1600 Utica Ave S, Suite 120',
  city: 'Minneapolis',
  phone: '16122796262',
  id: '123455',
  claimFilling: true,
  addConsumers: true
};

describe('Check if user is authorized to update', () => {
  it('Returns true if user has an admin role', async () => {
    const user: LeanDocument<User> = {
      id: '1',
      email: 'fakeMail',
      username: 'fakeName',
      password: 'fakePass',
      role: UserRole.admin,
      firstName: 'UserName',
      lastName: 'UserLastName'
    };

    const context: Partial<Token | undefined> = { user };

    const request: Partial<TypedRequestBody<EmployerBody>> = {
      body: employerBody,
      ctx: context as Token,
      params: { id: '1234ss' }
    };

    const result = isAuthorizedToUpdate(request as TypedRequestBody<EmployerBody>);
    expect(result).toBe(true);
  });

  it('Returns false if user has a consumer role', async () => {
    const user: LeanDocument<User> = {
      id: '1',
      email: 'fakeMail',
      username: 'fakeName',
      password: 'fakePass',
      role: UserRole.consumer,
      firstName: 'UserName',
      lastName: 'UserLastName'
    };

    const context: Partial<Token | undefined> = { user };

    const request: Partial<TypedRequestBody<EmployerBody>> = {
      body: employerBody,
      ctx: context as Token
    };

    const result = isAuthorizedToUpdate(request as TypedRequestBody<EmployerBody>);
    expect(result).toBe(false);
  });

  it('Returns true if user has an employer role and if employer user tries to update his own data', async () => {
    const user: LeanDocument<User> = {
      id: '1',
      email: 'fakeMail',
      username: 'fakeName',
      password: 'fakePass',
      role: UserRole.employer,
      employerID: 'sameId',
      firstName: 'UserName',
      lastName: 'UserLastName'
    };

    const context: Partial<Token | undefined> = { user };

    const request: Partial<TypedRequestBody<EmployerBody>> = {
      body: employerBody,
      ctx: context as Token,
      params: { id: 'sameId' }
    };

    const result = isAuthorizedToUpdate(request as TypedRequestBody<EmployerBody>);
    expect(result).toBe(true);
  });

  it('Returns false if employer user tries to update data for different employer', async () => {
    const user: LeanDocument<User> = {
      id: '1',
      email: '',
      username: '',
      password: '',
      role: UserRole.employer,
      employerID: 'randomId',
      firstName: 'UserName',
      lastName: 'UserLastName'
    };

    const context: Partial<Token | undefined> = { user };

    const request: Partial<TypedRequestBody<EmployerBody>> = {
      body: employerBody,
      ctx: context as Token,
      params: { id: 'NOTsameId' }
    };

    const result = isAuthorizedToUpdate(request as TypedRequestBody<EmployerBody>);
    expect(result).toBe(false);
  });
});
