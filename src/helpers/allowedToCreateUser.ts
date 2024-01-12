import employerModel from 'models/employer';
import { TypedRequestBody } from 'types/routes';
import { User, UserRole } from 'types/user';

const allowedToCreateUser = async (req: TypedRequestBody<User | User[]>) => {
  const employer = await employerModel.getEmployer(req.params.employerId);
  const {
    user: { role, employerID }
  } = req.ctx;

  if (
    role === UserRole.admin ||
    (role === UserRole.employer && employerID === employer!.id && employer!.addConsumers)
  ) {
    return true;
  }
  return false;
};

export default allowedToCreateUser;
