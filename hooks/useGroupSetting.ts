import { clearMessages, getGroupSetting, toggleHiding, togglePin } from '@/services/group-setting';
import { GroupSetting } from '@/types/group-setting';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useChatId from './useChatId';
import { SortOrder } from '@/types/common';
import { mutate } from 'swr';
import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import { useGroupsContext } from '@/context/groups-context';
import { MESSAGE_PAGE_SIZE } from '@/lib/consts';

export const useGetGroupSetting = (id: string) => {
  const { data, error } = useSWR<GroupSetting>(
    `/group-chat/${id}/setting`,
    () => getGroupSetting(id),
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

export const useClearHistory = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { chatId } = useChatId();
  const t = useTranslations();

  const fetch = async (id: string) => {
    setIsLoading(true);
    try {
      setError(null);
      await clearMessages(id);
      await mutate(
        `/chat-message/group-chat/${chatId}?filter=${JSON.stringify({
          sortBy: 'createdAt',
          sortOrder: SortOrder.DESC,
          limit: MESSAGE_PAGE_SIZE,
          page: 1,
        })}`
      );
      toast.success(t('GROUP.CLEAR_HISTORY_SUCCESS'));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, fetch };
};

export const useTogglePin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { togglePin: togglePinLocal } = useGroupsContext();

  const submit = async (id: string) => {
    setIsLoading(true);
    try {
      setError(null);
      togglePinLocal(id);
      await togglePin(id);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, submit };
};

export const useToggleHiding = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toggleHiding: toggleHidingLocal } = useGroupsContext();

  const submit = async (id: string) => {
    setIsLoading(true);
    try {
      setError(null);
      await toggleHiding(id);
      toggleHidingLocal(id);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, submit };
};
