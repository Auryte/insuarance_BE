import { HydratedDocument, LeanDocument, model, SortOrder } from 'mongoose';

import { Claim, ClaimSearchFilter, ClaimMongoDB } from 'types/insurance';
import { SearchOptions, SearchResult } from 'types/search';
import { ClaimSchema } from 'schemas/claim';
import { searchInDbByFilter } from 'utils/search';

const ClaimModel = model<Claim>('Claim', ClaimSchema);

const createClaim = async (body: Claim): Promise<HydratedDocument<Claim>> => {
  const claim = await ClaimModel.create(body);
  return claim;
};

const getClaim = async (id: string): Promise<HydratedDocument<Claim> | null> => {
  const claim = await ClaimModel.findOne({ id }).populate([
    {
      path: 'consumer',
      populate: {
        path: 'employer',
        model: 'Employer'
      }
    },
    { path: 'plan' }
  ]);

  return claim;
};

const getClaimByFilterAndSort = async (
  filter: ClaimSearchFilter,
  fieldToSort: string,
  sortOrder: SortOrder
): Promise<LeanDocument<Claim> | null> => {
  const claim = await ClaimModel.findOne({ ...filter })
    .sort({
      [fieldToSort]: sortOrder
    })
    .lean();

  return claim;
};

const updateClaim = async (body: Claim, id: string): Promise<HydratedDocument<Claim> | null> => {
  const claim = await ClaimModel.findOneAndUpdate({ id }, body, {
    new: true
  });
  return claim;
};

const getClaimsByFilter = async (
  filter: ClaimSearchFilter,
  options: SearchOptions
): Promise<SearchResult<ClaimMongoDB>> => {
  const excludedData = [
    'plan._id',
    'plan.createdAt',
    'plan.updatedAt',
    'plan.__v',
    'consumer._id',
    'consumer.role',
    'consumer.password',
    'consumer.createdAt',
    'consumer.updatedAt',
    'consumer.__v',
    'employer._id',
    'employer.createdAt',
    'employer.updatedAt',
    'employer.__v'
  ];

  const additionalSettings = [
    {
      $lookup: {
        from: 'plans',
        localField: 'planID',
        foreignField: 'id',
        as: 'plan'
      }
    },
    {
      $unwind: {
        path: '$plan',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'consumerID',
        foreignField: 'id',
        as: 'consumer'
      }
    },
    {
      $unwind: {
        path: '$consumer',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'employers',
        localField: 'consumer.employerID',
        foreignField: 'id',
        as: 'employer'
      }
    },
    {
      $unwind: {
        path: '$employer',
        preserveNullAndEmptyArrays: true
      }
    }
  ];

  const claims: SearchResult<ClaimMongoDB> = await searchInDbByFilter(
    ClaimModel,
    filter,
    options,
    excludedData,
    additionalSettings
  );

  return claims;
};

export default {
  createClaim,
  getClaim,
  getClaimByFilterAndSort,
  getClaimsByFilter,
  updateClaim
};
