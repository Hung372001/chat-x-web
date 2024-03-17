import { getErrorMessage } from '@/lib/utils';
import { httpClient } from '@/services/http';
import { UpdateProfileDto } from '@/types/profile';
import { User } from '@/types/user';

export const updateProfile = async (data: UpdateProfileDto): Promise<User> => {
  try {
    const response = await httpClient.put('/profile', data);
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const updateAvatar = async (avatar: string): Promise<User> => {
  try {
    const response = await httpClient.patch('/profile/avatar', { avatar });
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};
