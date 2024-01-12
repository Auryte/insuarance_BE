import { LeanDocument, model } from 'mongoose';

import {
  EmployerBody,
  EmployerBodyMongoDB,
  EmployerSearchFilter,
  EmployerSetup
} from 'types/employer';
import { SearchOptions, SearchResult } from 'types/search';
import { EmployerSchema } from 'schemas/employer';
import { searchInDbByFilter } from 'utils/search';

const EmployerModel = model<EmployerBody>('Employer', EmployerSchema);

const addNewEmployer = async (body: Omit<EmployerBody, 'id'>): Promise<EmployerBodyMongoDB> => {
  const employer = await EmployerModel.create(body);
  return employer;
};

const updateEmployerData = async (
  body: EmployerBody | EmployerSetup,
  id: string
): Promise<EmployerBodyMongoDB | null> => {
  const employer = await EmployerModel.findOneAndUpdate({ id }, body, {
    new: true
  });

  return employer;
};

const getEmployersByFilter = async (
  filter: EmployerSearchFilter,
  options: SearchOptions
): Promise<SearchResult<EmployerBodyMongoDB>> => {
  const employers: SearchResult<EmployerBodyMongoDB> = await searchInDbByFilter(
    EmployerModel,
    filter,
    options
  );
  return employers;
};

const getEmployer = async (id: string): Promise<LeanDocument<EmployerBody> | null> => {
  const employer = await EmployerModel.findOne({ id }).lean();
  return employer;
};

export default { addNewEmployer, updateEmployerData, getEmployersByFilter, getEmployer };
