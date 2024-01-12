import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';

import { Plan, PlanType, PlanPayrollFrequency } from 'types/insurance';

const ajv = new Ajv({ allErrors: true, $data: true });
addFormats(ajv);
ajvErrors(ajv);

export const planSchema: JSONSchemaType<Omit<Plan, 'inactive'>> = {
  type: 'object',
  properties: {
    name: { type: 'string', pattern: '^[A-Za-z_ ]{3,50}$' },
    type: { type: 'string', enum: [PlanType.medical, PlanType.dental] },
    contributions: { type: 'number', minimum: 1, maximum: 9999 },
    startDate: {
      type: 'string',
      format: 'date-time'
    },
    endDate: {
      type: 'string',
      format: 'date-time',
      formatMinimum: { $data: '1/startDate' }
    },
    payrollFrequency: {
      type: 'string',
      enum: [PlanPayrollFrequency.weekly, PlanPayrollFrequency.monthly]
    },
    initialized: {
      type: 'boolean'
    },
    employerId: {
      type: 'string'
    },
    initializedAt: {
      type: 'string',
      format: 'date-time',
      nullable: true
    },
    id: {
      type: 'string',
      nullable: true
    }
  },
  required: ['name', 'type', 'contributions', 'startDate', 'endDate', 'payrollFrequency'],
  additionalProperties: false,
  errorMessage: {
    properties: {
      name: 'can only contain Latin letters. Length from 3 to 30 characters',
      type: `must be 'medical', 'dental'`,
      contributions: 'can only contain numbers. Length from 1 to 4 characters',
      startDate: 'should be in date-time format',
      endDate: 'should be in date-time format',
      payrollFrequency: `must be 'weekly', 'monthly'`
    }
  }
};

export const validatePlanFunction = ajv.compile(planSchema);
