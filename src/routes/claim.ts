import { Router } from 'express';

import claimController from 'controllers/claim';

const claimRouter = Router({ mergeParams: true });

claimRouter.route('/').get(claimController.getClaims).post(claimController.createClaim);

claimRouter.route('/:id').get(claimController.getClaim).patch(claimController.updateClaim);

export default claimRouter;
