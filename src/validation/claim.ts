import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';

import { Claim, ClaimStatus } from 'types/insurance';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajvErrors(ajv);

export const claimSchema: JSONSchemaType<Omit<Claim, 'id' | 'consumerID' | 'number'>> = {
  type: 'object',
  properties: {
    startDate: {
      type: 'string',
      format: 'date-time'
    },
    planID: { type: 'string' },
    amount: { type: 'number', minimum: 1, maximum: 9999 },
    status: {
      type: 'string',
      enum: [ClaimStatus.pending, ClaimStatus.approved, ClaimStatus.denied]
    }
  },
  required: ['startDate', 'planID', 'amount'],
  additionalProperties: false,
  errorMessage: {
    properties: {
      startDate: 'should be in date-time format',
      amount: 'can only contain numbers. Length from 1 to 4 characters',
      status: `must be 'pending', 'approved', 'denied'`
    }
  }
};

export const validateClaimFunction = ajv.compile(claimSchema);
