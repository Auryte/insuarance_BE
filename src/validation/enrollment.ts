import Ajv, { JSONSchemaType } from 'ajv';

import { Enrollment } from 'types/insurance';

const ajv = new Ajv({ allErrors: true });
require('ajv-errors')(ajv);

export const enrollmentSchema: JSONSchemaType<Omit<Enrollment, 'id' | 'consumerID'>> = {
  type: 'object',
  properties: {
    planID: { type: 'string' },
    election: { type: 'number', minimum: 1, maximum: 9999 }
  },
  required: ['planID', 'election'],
  additionalProperties: false,
  errorMessage: {
    properties: {
      election: 'can only contain numbers. Length from 1 to 4 characters'
    }
  }
};

export const validateEnrollmentFunction = ajv.compile(enrollmentSchema);
