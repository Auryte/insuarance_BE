import { EmployerBody, EmployerSetup } from 'types/employer';

export const mockEmployer: EmployerBody = {
  name: 'BY - CoherentSolutions',
  code: 'BY',
  street: 'hisug uorut',
  city: 'Kaunas',
  phone: '+370 699 132230',
  zipCode: '45454',
  id: '6161a553-20f6-46ba-b7ca-7f6c55645708',
  claimFilling: true,
  addConsumers: true
};

export const validEmployerBody: Omit<EmployerBody, 'id'> = {
  name: 'BY - ISsoft',
  code: 'BY',
  street: 'Chapaeva',
  city: 'Minsk',
  phone: '1234567890',
  claimFilling: true,
  addConsumers: true
};

export const updatedEmployerBody: Omit<EmployerBody, 'id'> = {
  name: 'US - Coherent Solutions',
  code: 'US',
  street: '1600 Utica Ave S, Suite 120',
  city: 'Minneapolis',
  phone: '16122796262',
  claimFilling: true,
  addConsumers: true
};

export const invalidEmployerBody: Omit<EmployerBody, 'phone' | 'id' | 'claimFilling'> = {
  name: 'BY - ISsoft',
  code: 'BY',
  street: 'Chapaeva',
  city: 'Minsk',
  addConsumers: true
};

export const mockSetup: EmployerSetup = { claimFilling: false };
