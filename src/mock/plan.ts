import { Plan, PlanType, PlanPayrollFrequency } from 'types/insurance';

export const mockPlan: Omit<
  Plan,
  'id' | 'initializedAt' | 'initialized' | 'employerId' | 'inactive'
> = {
  name: 'Test Dental Insurance',
  type: PlanType.dental,
  contributions: 200,
  startDate: '2022-10-11T11:34:40+0000',
  endDate: '2023-11-29T11:34:40+0000',
  payrollFrequency: PlanPayrollFrequency.weekly
};
