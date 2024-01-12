import { Model } from 'mongoose';
import { EmployerBody, EmployerSearchFilter } from 'types/employer';
import { Claim, ClaimSearchFilter } from 'types/insurance';
import { SearchOptions } from 'types/search';
import { ConsumerSearchFilter, User } from 'types/user';

export const searchInDbByFilter = async <
  T extends Claim | EmployerBody | User,
  U extends ClaimSearchFilter | EmployerSearchFilter | ConsumerSearchFilter
>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  model: Model<T, {}, {}, {}, any>,
  filter: U,
  options: SearchOptions,
  excludedData: string[] = [],
  additionalSettings: any = {}
) => {
  const result = await model.aggregate([
    ...additionalSettings,
    { $match: { ...filter } },
    { $sort: { [options.sortBy]: 1 } },
    {
      $unset: ['_id', ...excludedData]
    },
    {
      $facet: {
        metadata: [
          { $count: 'numberOfDocuments' },
          {
            $addFields: {
              page: options.page,
              pageSize: options.limit
            }
          }
        ],
        data: [
          {
            $skip: (options.page - 1) * options.limit
          },
          {
            $limit: options.limit
          },
          {
            $project: {
              _id: 0
            }
          }
        ]
      }
    }
  ]);

  return result[0];
};
