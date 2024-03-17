import { getErrorMessage } from '@/lib/utils';
import { httpClient } from './http';
import { CreateGroupChatDto, GetGroupsData, GroupItem, MembersResponse } from '@/types/group-chat';
import { FilterDto } from '@/types/common';

export const createGroup = async (data: CreateGroupChatDto): Promise<any> => {
  try {
    const response = await httpClient.post('/group-chat', data);
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const getGroups = async (filter: FilterDto): Promise<GetGroupsData> => {
  try {
    const response = await httpClient.get('/group-chat', { params: filter });
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const getGroupDetail = async (id: string): Promise<GroupItem | null> => {
  try {
    if (!id || id === '') {
      return null;
    } else {
      const response = await httpClient.get('/group-chat/' + id);
      return response.data.data;
    }
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const getGroupMembers = async (
  id: string,
  filter: FilterDto
): Promise<MembersResponse | null> => {
  try {
    if (!id || id === '') {
      return null;
    } else {
      const response = await httpClient.get('/group-chat/members/' + id, { params: filter });
      return response.data.data;
    }
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const addGroupMembers = async (id: string, members: string[]): Promise<GroupItem> => {
  try {
    const response = await httpClient.patch('/group-chat/add-members/' + id, { members });
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const modifyAdmin = async (id: string, admins: string[]): Promise<GroupItem> => {
  try {
    const response = await httpClient.patch('/group-chat/modify-admin/' + id, { admins });
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const modifyMembers = async (id: string, members: string[]): Promise<GroupItem> => {
  try {
    const response = await httpClient.patch('/group-chat/remove-members/' + id, { members });
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const deleteGroup = async (id: string): Promise<GroupItem> => {
  try {
    const response = await httpClient.delete('/group-chat/' + id);
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const leaveGroup = async (id: string): Promise<any> => {
  try {
    const response = await httpClient.patch(`/group-chat/leave-group/${id}`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};
