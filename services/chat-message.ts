import { getErrorMessage } from '@/lib/utils';
import { httpClient } from './http';
import { ChatMessageResponse } from '@/types/chat-message';
import { FilterDto } from '@/types/common';

export const getMessages = async (id: string, filter: FilterDto): Promise<ChatMessageResponse> => {
  try {
    if (!id || id === '') {
      return { items: [], pinnedMessages: [], total: 0 };
    } else {
      const response = await httpClient.get('/chat-message/group-chat/' + id, { params: filter });
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
