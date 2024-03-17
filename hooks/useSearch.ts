import useSWR from 'swr';
import { SearchResponse } from '@/types/search';
import { FilterDto } from '@/types/common';
import { search } from '@/services/search';

export const useSearch = (filter: FilterDto) => {
  const { data, error } = useSWR<SearchResponse | null>(
    `/api/search?filter=${JSON.stringify(filter)}`,
    () => search(filter),
    {
      revalidateOnFocus: false,
      errorRetryCount: 1, // Number of retries
      errorRetryInterval: 3000, // Interval between retries in milliseconds
    }
  );

  return {
    data,
    error,
    isLoading: !data && !error,
  };
};
