import { getErrorMessage } from '@/lib/utils';
import { httpClient } from './http';

export const upload = async (formData: FormData): Promise<any> => {
  try {
    const response = await httpClient.post('/upload', formData);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const uploadMulti = async (formData: FormData): Promise<any> => {
  try {
    const response = await httpClient.post('/upload/files', formData);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};
