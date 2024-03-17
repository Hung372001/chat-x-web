import { FilterDto } from '@/types/common';
import useSWR from 'swr';
import { getMessages } from '@/services/chat-message';
import { ChatMessageResponse } from '@/types/chat-message';

export const useGetChatMessage = (groupChatId: string, filter: FilterDto) => {
  const { data, error } = useSWR<ChatMessageResponse>(
    `/chat-message/group-chat/${groupChatId}?filter=${JSON.stringify(filter)}`,
    () => getMessages(groupChatId, filter),
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
