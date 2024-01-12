import Ajv, { JSONSchemaType } from 'ajv';
import ajvErrors from 'ajv-errors';
import { EmployerBody, EmployerSetup } from 'types/employer';

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);

const schema: JSONSchemaType<Omit<EmployerBody, 'id'>> = {
  type: 'object',
  properties: {
    name: { type: 'string', pattern: '^[A-Z]{2}\\s*-\\s*[a-zA-Z0-9_.\\s]{3,50}$' },
    code: { type: 'string', pattern: '^[a-zA-Z]{2}$' },
    street: { type: 'string', pattern: '^[a-zA-Z0-9_.,\\s]{4,50}$' },
    city: { type: 'string', pattern: '^[a-zA-Z ]{3,30}$' },
    phone: {
      type: 'string',
      pattern: '^(\\s*)?(\\+)?([- _():=+]?\\d[- _():=+]?){10,14}(\\s*)?$'
    },
    state: { type: 'string', pattern: `(^[a-zA-Z ]{3,30}$)|(^$)`, nullable: true },
    zipCode: { type: 'string', pattern: '(^[0-9]{5}$)|(^$)', nullable: true },
    logo: { type: 'string', nullable: true },
    claimFilling: { type: 'boolean', nullable: true },
    addConsumers: { type: 'boolean', nullable: true }
  },
  required: ['name', 'code', 'street', 'city', 'phone'],
  additionalProperties: false,
  errorMessage: {
    properties: {
      name: `Name must be in this format 'BY - ISsoft'. Length from 3 to 50 characters`,
      code: 'can only contain Latin letters. Length is 2 characters',
      street: 'can only contain Latin letters and numbers only. Length from 4 to 50 characters',
      city: 'can only contain Latin letters. Length from 3 to 30 characters',
      phone: `should be in this format '+375 44 1112233'`,
      state: 'can only contain Latin letters. Length from 3 to 30 characters',
      zipCode: 'can only contain 5 numbers'
    }
  }
};

const setupSchema: JSONSchemaType<EmployerSetup> = {
  type: 'object',
  properties: {
    claimFilling: { type: 'boolean' },
    addConsumers: { type: 'boolean', nullable: true }
  },
  required: ['claimFilling'],
  additionalProperties: false
};

export const validateEmployerSetup = ajv.compile(setupSchema);

export const validateEmployerFunction = ajv.compile(schema);
