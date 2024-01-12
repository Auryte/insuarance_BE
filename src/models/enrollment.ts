import { HydratedDocument, LeanDocument, model, SortOrder } from 'mongoose';

import { Enrollment, EnrollmentSearchFilter } from 'types/insurance';
import { EnrollmentSchema } from 'schemas/enrollment';

const EnrollmentModel = model<Enrollment>('Enrollment', EnrollmentSchema);

const createEnrollment = async (body: Enrollment): Promise<HydratedDocument<Enrollment>> => {
  const enrollment = await EnrollmentModel.create(body);
  return enrollment;
};

const getEnrollment = async (id: string): Promise<HydratedDocument<Enrollment> | null> => {
  const enrollment = await EnrollmentModel.findOne({ id }).populate({ path: 'plan' });
  return enrollment;
};

const getEnrollmentByFilterAndSort = async (
  filter: EnrollmentSearchFilter,
  fieldToSort: string,
  sortOrder: SortOrder
): Promise<LeanDocument<Enrollment> | null> => {
  const enrollment = await EnrollmentModel.findOne({ ...filter })
    .sort({
      [fieldToSort]: sortOrder
    })
    .lean();

  return enrollment;
};

const getEnrollments = async (userId: string): Promise<HydratedDocument<Enrollment>[] | null> => {
  const enrollments = await EnrollmentModel.find({ consumerID: userId }).populate({ path: 'plan' });
  return enrollments;
};

const updateEnrollment = async (
  body: Enrollment,
  id: string
): Promise<HydratedDocument<Enrollment> | null> => {
  const enrollment = await EnrollmentModel.findOneAndUpdate({ id }, body, {
    new: true
  });
  return enrollment;
};

export default {
  createEnrollment,
  getEnrollment,
  getEnrollmentByFilterAndSort,
  getEnrollments,
  updateEnrollment
};
