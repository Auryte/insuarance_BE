import { HydratedDocument, model } from 'mongoose';

import { Credentials } from 'types/auth';
import { ConsumerSearchFilter, User, UserBodyMongoDB } from 'types/user';
import { UserSchema } from 'schemas/user';
import { SearchOptions, SearchResult } from 'types/search';
import { searchInDbByFilter } from 'utils/search';

const UserModel = model<User>('User', UserSchema);

const createUser = async (body: User): Promise<HydratedDocument<User>> => {
  const user = await UserModel.create(body);
  return user;
};

const updateUser = async (body: User, id: string): Promise<HydratedDocument<User> | null> => {
  const user = await UserModel.findOneAndUpdate({ id }, body, {
    new: true
  }).populate({ path: 'employer' });
  return user;
};

const getUser = async (id: string): Promise<HydratedDocument<User> | null> => {
  const user = await UserModel.findOne({ id }).populate([
    { path: 'employer' },
    {
      path: 'enrollments',
      populate: {
        path: 'plan',
        model: 'Plan'
      }
    }
  ]);

  return user;
};

const getUserWithPassword = async ({
  username
}: Credentials): Promise<HydratedDocument<User> | null> => {
  const user = await UserModel.findOne({ username })
    .select('+password')
    .populate([
      { path: 'employer' },
      {
        path: 'enrollments',
        populate: {
          path: 'plan',
          model: 'Plan'
        }
      }
    ]);

  return user;
};

const getUsersByFilter = async (
  filter: ConsumerSearchFilter,
  options: SearchOptions
): Promise<SearchResult<UserBodyMongoDB>> => {
  const users: SearchResult<UserBodyMongoDB> = await searchInDbByFilter(UserModel, filter, options);
  return users;
};

const deleteUser = async (id: string) => {
  await UserModel.findOneAndDelete({ id });
};

export default {
  createUser,
  updateUser,
  getUser,
  getUserWithPassword,
  getUsersByFilter,
  deleteUser
};
