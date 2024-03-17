import { getErrorMessage } from '@/lib/utils';
import { httpClient } from '@/services/http';
import { FilterDto } from '@/types/common';
import {
  FriendRequestResponse,
  GetRollCallDto,
  GetUsersResponse,
  RollCallResponse,
  User,
} from '@/types/user';

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await httpClient.get('/user/me');
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const getRollCall = async (data: GetRollCallDto): Promise<RollCallResponse> => {
  try {
    const response = await httpClient.get('/user/roll-call');
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const rollCall = async (): Promise<any> => {
  try {
    const response = await httpClient.patch('/user/roll-call');
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const toggleHiding = async (): Promise<any> => {
  try {
    const response = await httpClient.patch('/user/hiding/toggle');
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const toggleSoundNotification = async (): Promise<any> => {
  try {
    const response = await httpClient.patch('/user/sound-notification/toggle');
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const getUsers = async (filter: FilterDto): Promise<GetUsersResponse> => {
  try {
    const response = await httpClient.get('/user', { params: filter });
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const addFriends = async (friends: string[]): Promise<any> => {
  try {
    const response = await httpClient.post('/user/add-friends', { friends });
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const getFriendRequest = async (userId: string | null): Promise<FriendRequestResponse> => {
  try {
    if (userId === null) throw new Error('User id is required');
    const response = await httpClient.get(`/user/friend-request/${userId}`);
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const acceptFriend = async (friendId: string): Promise<any> => {
  try {
    const response = await httpClient.patch(`/user/friend-request/accept/${friendId}`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const removeFriend = async (friendId: string): Promise<any> => {
  try {
    const response = await httpClient.post(`/user/remove-friend/${friendId}`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const getUser = async (id: string | null): Promise<any> => {
  try {
    if (id === null) throw new Error('User id is required');
    const response = await httpClient.get(`/user/${id}`);
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const updateNickname = async (id: string, nickname: string): Promise<any> => {
  try {
    const response = await httpClient.patch(`/user/nickname/${id}`, { nickname });
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};
