import { Claim, ClaimStatus } from 'types/insurance';

export const mockClaim: Omit<Claim, 'id' | 'consumerID' | 'number' | 'status'> = {
  startDate: '2022-11-24T17:09:58+0000',
  planID: '6bc846ed-77e7-466b-aabd-003eaf8cee53',
  amount: 999
};

export const mockClaims: Omit<Claim, 'id'>[] = [
  {
    consumerID: 'f24ad404-f09a-4c4e-a3fe-74a775b2fed7',
    number: 'BY20221124M00001',
    startDate: '2022-11-24T17:09:58+0000',
    planID: 'ef5951da-c14b-4b9c-9703-65c008e2c118',
    amount: 100,
    status: ClaimStatus.pending
  },
  {
    consumerID: 'f24ad404-f09a-4c4e-a3fe-74a775b2fed7',
    number: 'BY20221124M00002',
    startDate: '2022-11-24T17:09:58+0000',
    planID: 'ef5951da-c14b-4b9c-9703-65c008e2c118',
    amount: 100,
    status: ClaimStatus.pending
  },
  {
    consumerID: '5d172efa-382e-4d27-9740-018a30b59431',
    number: 'LT20221124M00003',
    startDate: '2022-11-24T17:09:58+0000',
    planID: 'ef5951da-c14b-4b9c-9703-65c008e2c118',
    amount: 100,
    status: ClaimStatus.pending
  }
];
