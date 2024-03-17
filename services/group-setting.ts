import { AutoRemoveTime, GroupSetting } from '@/types/group-setting';
import { httpClient } from './http';
import { getErrorMessage } from '@/lib/utils';

export const getGroupSetting = async (id: string): Promise<GroupSetting> => {
  try {
    const response = await httpClient.get(`/group-chat/${id}/setting`);
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const clearMessages = async (id: string): Promise<any> => {
  try {
    const response = await httpClient.patch(`/group-chat/${id}/setting/clear`);
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const togglePin = async (id: string): Promise<any> => {
  try {
    const response = await httpClient.patch(`/group-chat/${id}/setting/pin/toggle`);
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const toggleHiding = async (id: string): Promise<any> => {
  try {
    const response = await httpClient.patch(`/group-chat/${id}/setting/hiding/toggle`);
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const toggleMuteNotification = async (id: string): Promise<any> => {
  try {
    const response = await httpClient.patch(`/group-chat/${id}/setting/mute-notification/toggle`);
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const toggleAddFriend = async (id: string): Promise<any> => {
  try {
    const response = await httpClient.patch(`/group-chat/${id}/setting/add-friends/toggle`);
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const toggleGroupType = async (id: string): Promise<any> => {
  try {
    const response = await httpClient.patch(`/group-chat/${id}/setting/group-type/toggle`);
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const toggleChatFeature = async (id: string): Promise<any> => {
  try {
    const response = await httpClient.patch(`/group-chat/${id}/setting/chat-feature/toggle`);
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const clearMessageSequence = async (id: string, duration: AutoRemoveTime): Promise<any> => {
  try {
    const response = await httpClient.patch(`/group-chat/${id}/setting/clear-message-sequence`, {
      duration,
    });
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};
