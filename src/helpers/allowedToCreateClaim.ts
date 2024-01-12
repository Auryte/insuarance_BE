import { Request } from 'express';

import userModel from 'models/user';

const allowedToCreateClaim = async (req: Request) => {
  const { userId } = req.params;
  const user = await userModel.getUser(userId);

  if (user && !user.employer?.claimFilling) {
    return false;
  }
  return true;
};

export default allowedToCreateClaim;
