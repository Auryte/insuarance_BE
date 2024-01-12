import { Router } from 'express';

import planController from 'controllers/plan';

const planRouter = Router({ mergeParams: true });

planRouter.route('/').get(planController.getPlans).post(planController.createPlan);

planRouter
  .route('/:id')
  .get(planController.getPlan)
  .patch(planController.updatePlan)
  .delete(planController.deletePlan);

planRouter.route('/:id/initialize').patch(planController.initializePlan);

export default planRouter;
