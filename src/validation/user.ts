import Ajv, { JSONSchemaType } from 'ajv';
import { ConsumerBody } from 'types/consumer';
import { User, UserRole } from 'types/user';
import ajvErrors from 'ajv-errors';

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);

const userCustomErrors = {
  username: 'must consist of Latin letters and numbers only. Length from 3 to 16 characters',
  email: 'should be in this format email@example.com',
  role: `must be 'employer', 'consumer'`,
  password:
    'must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
  firstName: 'must consist of Latin letters. Length from 3 to 16 characters',
  lastName: 'must consist of Latin letters. Length from 3 to 16 characters',
  SSN: 'must consist of 9 numbers',
  phone: `should be in this format '+375 44 1112233'`,
  street: 'can only contain Latin letters. Length from 4 to 50 characters',
  city: 'can only contain Latin letters. Length from 3 to 30 characters',
  state: 'can only contain Latin letters. Length from 3 to 30 characters',
  zipCode: 'can only contain 5 numbers'
};

export const userCreateSchema: JSONSchemaType<Omit<User, 'id' | 'employerID' | 'employer'>> = {
  type: 'object',
  properties: {
    username: { type: 'string', pattern: '^[A-Za-z0-9_ ]{3,16}$' },
    email: { type: 'string', pattern: '\\S+@\\S+\\.\\S+' },
    role: { type: 'string', enum: [UserRole.employer, UserRole.consumer] },
    password: {
      type: 'string',
      pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
    },
    firstName: { type: 'string', pattern: '^[A-Za-z_ ]{3,16}$', nullable: true },
    lastName: { type: 'string', pattern: '^[A-Za-z_ ]{3,16}$', nullable: true },
    SSN: { type: 'string', pattern: '(^[0-9]{9}$)|(^$)', nullable: true },
    phone: {
      type: 'string',
      pattern: '^(\\s*)?(\\+)?([- _():=+]?\\d[- _():=+]?){10,14}(\\s*)?$',
      nullable: true
    },
    street: { type: 'string', pattern: '^[a-zA-Z0-9_.,\\s]{4,50}$', nullable: true },
    city: { type: 'string', pattern: `(^[a-zA-Z ]{3,30}$)|(^$)`, nullable: true },
    state: { type: 'string', pattern: `(^[a-zA-Z ]{3,30}$)|(^$)`, nullable: true },
    zipCode: { type: 'string', pattern: '(^[0-9]{5}$)|(^$)', nullable: true }
  },
  required: ['username', 'email', 'role', 'password'],
  additionalProperties: false,
  errorMessage: {
    properties: userCustomErrors
  }
};

export const userEmployerUpdateSchema: JSONSchemaType<
  Omit<User, 'id' | 'employerID' | 'employer'>
> = {
  type: 'object',
  properties: {
    username: { type: 'string', pattern: '^[A-Za-z0-9_ ]{3,16}$' },
    email: { type: 'string', pattern: '\\S+@\\S+\\.\\S+' },
    role: { type: 'string', enum: [UserRole.employer, UserRole.consumer], nullable: true },
    password: {
      type: 'string',
      pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
      nullable: true
    },
    firstName: { type: 'string', pattern: '^[A-Za-z_ ]{3,16}$' },
    lastName: { type: 'string', pattern: '^[A-Za-z_ ]{3,16}$' },
    SSN: { type: 'string', pattern: '(^[0-9]{9}$)|(^$)', nullable: true },
    phone: {
      type: 'string',
      pattern: '^(\\s*)?(\\+)?([- _():=+]?\\d[- _():=+]?){10,14}(\\s*)?$',
      nullable: true
    },
    street: { type: 'string', pattern: '^[a-zA-Z0-9_.,\\s]{4,50}$', nullable: true },
    city: { type: 'string', pattern: `(^[a-zA-Z ]{3,30}$)|(^$)`, nullable: true },
    state: { type: 'string', pattern: `(^[a-zA-Z ]{3,30}$)|(^$)`, nullable: true },
    zipCode: { type: 'string', pattern: '(^[0-9]{5}$)|(^$)', nullable: true }
  },
  required: ['username', 'email', 'firstName', 'lastName'],
  additionalProperties: false,
  errorMessage: {
    properties: userCustomErrors
  }
};

export const consumerUpdateSchema: JSONSchemaType<
  Omit<ConsumerBody, 'id' | 'employerID' | 'employer'>
> = {
  type: 'object',
  properties: {
    username: { type: 'string', pattern: '^[A-Za-z0-9_ ]{3,16}$' },
    email: { type: 'string', pattern: '\\S+@\\S+\\.\\S+' },
    role: { type: 'string', enum: [UserRole.employer, UserRole.consumer] },
    password: {
      type: 'string',
      pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
    },
    firstName: { type: 'string', pattern: '^[A-Za-z_ ]{3,16}$', nullable: true },
    lastName: { type: 'string', pattern: '^[A-Za-z_ ]{3,16}$', nullable: true },
    SSN: { type: 'string', pattern: '(^[0-9]{9}$)|(^$)', nullable: true },
    phone: {
      type: 'string',
      pattern: '^(\\s*)?(\\+)?([- _():=+]?\\d[- _():=+]?){10,14}(\\s*)?$',
      nullable: true
    },
    street: { type: 'string', pattern: '^[a-zA-Z0-9_.,\\s]{4,50}$', nullable: true },
    city: { type: 'string', pattern: `(^[a-zA-Z ]{3,30}$)|(^$)`, nullable: true },
    state: { type: 'string', pattern: `(^[a-zA-Z ]{3,30}$)|(^$)`, nullable: true },
    zipCode: { type: 'string', pattern: '(^[0-9]{5}$)|(^$)', nullable: true }
  },
  required: [
    'username',
    'email',
    'firstName',
    'lastName',
    'SSN',
    'phone',
    'street',
    'city',
    'state',
    'zipCode'
  ],
  additionalProperties: false,
  errorMessage: {
    properties: userCustomErrors
  }
};

export const validateUserCreateFunction = ajv.compile(userCreateSchema);
export const validateUserEmployerUpdateFunction = ajv.compile(userEmployerUpdateSchema);
export const validateConsumerUpdateFunction = ajv.compile(consumerUpdateSchema);
