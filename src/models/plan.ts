import { HydratedDocument, LeanDocument, model } from 'mongoose';

import { Plan } from 'types/insurance';
import { PlanSchema } from 'schemas/plan';

const PlanModel = model<Plan>('Plan', PlanSchema);

const createPlan = async (body: Plan): Promise<HydratedDocument<Plan>> => {
  const plan = await PlanModel.create(body);
  return plan;
};

const getPlan = async (id: string): Promise<LeanDocument<Plan> | null> => {
  const plan = await PlanModel.findOne({ id, inactive: false }).lean();
  return plan;
};

const getPlans = async (id: string): Promise<HydratedDocument<Plan>[] | null> => {
  const plans = await PlanModel.find({ employerId: id, inactive: false });
  return plans;
};

const updatePlan = async (body: Plan, id: string): Promise<HydratedDocument<Plan> | null> => {
  const plan = await PlanModel.findOneAndUpdate({ id, inactive: false }, body, {
    new: true
  });
  return plan;
};

const deletePlan = async (id: string): Promise<void> => {
  await PlanModel.findOneAndUpdate({ id }, { inactive: true });
};

export default { createPlan, getPlan, getPlans, updatePlan, deletePlan };
