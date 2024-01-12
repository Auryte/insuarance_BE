import { User, UserRole } from 'types/user';

export const mockUser: Pick<User, 'firstName' | 'lastName' | 'username' | 'email' | 'role'> = {
  firstName: 'John',
  lastName: 'Smith',
  username: 'jsmith',
  email: 'jsmith@example.com',
  role: UserRole.consumer
};

export const mockUsers: User[] = [
  {
    username: 'admin',
    email: 'admin@example.com',
    role: UserRole.admin,
    password: '123',
    id: 'd748ebc8-8179-4737-9bd8-d767a8eb3212',
    firstName: 'admin',
    lastName: 'addmmmiinn'
  },
  {
    username: 'tester',
    email: 'tester@example.com',
    role: UserRole.consumer,
    password: '123',
    firstName: 'Tester',
    lastName: 'Consumer',
    SSN: '123456789',
    phone: '+370 68611012',
    street: 'Consumer St.',
    city: 'Vilnius',
    state: 'Vilnius',
    zipCode: '55555',
    employerID: '6161a553-20f6-46ba-b7ca-7f6c55645708',
    id: 'f24ad404-f09a-4c4e-a3fe-74a775b2fed7'
  }
];

export const mockConsumers: Omit<User, 'employerID' | 'id'>[] = Array.from(
  { length: 3 },
  (_, i) => ({
    username: `tester${i}`,
    email: `tester${i}@example.com`,
    role: UserRole.consumer,
    password: 'AAAaa!!!123',
    firstName: 'Tester',
    lastName: 'Consumer',
    SSN: `12345678${i}`,
    phone: `+370 6861101${i}`,
    street: 'Consumer St.',
    city: 'Vilnius',
    state: 'Vilnius',
    zipCode: '55555'
  })
);

export const users = [
  {
    firstName: 'John',
    lastName: 'Smith',
    username: 'jsmith',
    email: 'jsmith@example.com',
    SSN: '123456789',
    role: UserRole.consumer,
    password: 'Admin#1234',
    employerID: '6161a553-20f6-46ba-b7ca-7f6c55645708'
  },
  {
    firstName: 'Max',
    lastName: 'Smith',
    username: 'adminas',
    email: 'adminas@example.com',
    SSN: '123456789',
    role: UserRole.consumer,
    password: 'Admin#1234',
    employerID: '6161a553-20f6-46ba-b7ca-7f6c55645708'
  },
  {
    firstName: 'Jonas',
    lastName: 'Smith',
    username: 'jonas',
    email: 'jonas@example.com',
    SSN: '123456789',
    role: UserRole.consumer,
    password: 'Admin#1234',
    employerID: '6161a553-20f6-46ba-b7ca-7f6c55645708'
  },
  {
    firstName: 'Bob',
    lastName: 'Smith',
    username: 'bobas',
    email: 'bobas@example.com',
    SSN: '123456789',
    role: UserRole.admin,
    password: 'Admin#1234',
    employerID: '6161a553-20f6-46ba-b7ca-7f6c55645708'
  }
];
