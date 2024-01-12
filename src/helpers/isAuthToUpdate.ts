import { EmployerBody, EmployerSetup } from 'types/employer';
import { TypedRequestBody } from 'types/routes';
import { UserRole } from 'types/user';

export const isAuthorizedToUpdate = (
  req: TypedRequestBody<EmployerBody | EmployerSetup>
): boolean => {
  const {
    user: { role, employerID }
  } = req.ctx;
  if (role === UserRole.admin || (role === UserRole.employer && employerID === req.params.id)) {
    return true;
  }
  return false;
};
