import { Metadata } from './metadata';

export type SearchOptions = {
  page: number;
  limit: number;
  sortBy: string;
};

export type SearchResult<T> = {
  metadata: Metadata[];
  data: T[];
};
