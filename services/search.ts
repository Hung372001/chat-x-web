import { SearchResponse } from '@/types/search';
import { httpClient } from './http';
import { FilterDto } from '@/types/common';
import { getErrorMessage } from '@/lib/utils';
import { getSession } from 'next-auth/react';

export const search = async (filter: FilterDto): Promise<SearchResponse | null> => {
  try {
    const session = await getSession();
    if (session) {
      const response = await httpClient.get('/search', { params: filter });
      return response.data.data;
    } else {
      return null;
    }
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};
