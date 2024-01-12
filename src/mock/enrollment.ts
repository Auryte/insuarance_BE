import { Enrollment } from 'types/insurance';

export const mockEnrollment: Omit<Enrollment, 'id' | 'consumerID'> = {
  planID: 'e6318212-24d2-484a-ad3c-d0322ed3697e',
  election: 100
};
