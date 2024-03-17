import useSWR from 'swr';
import { useGroupSettingModal } from '@/components/modals/group-setting-modal';
import {
  createGroup,
  deleteGroup,
  getGroupDetail,
  getGroupMembers,
  getGroups,
  leaveGroup,
} from '@/services/group-chat';
import { FilterDto } from '@/types/common';
import { CreateGroupChatDto, GetGroupsData, GroupItem, MembersResponse } from '@/types/group-chat';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useGroupsContext } from '@/context/groups-context';

export const useCreateGroup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const t = useTranslations();

  const handleSubmit = async (data: CreateGroupChatDto): Promise<any> => {
    setIsLoading(true);
    try {
      setError(null);
      const res = await createGroup(data);
      setData(res);
      toast.success(t('GROUP.CREATE_GROUP_SUCCESS'));
    } catch (error: any) {
      setError(error.message);
      toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, error, isLoading, data };
};

export const useGetGroups = (filter: FilterDto) => {
  const { data, error } = useSWR<GetGroupsData>(
    `/group-chat?filter=${JSON.stringify(filter)}`,
    () => getGroups(filter),
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

export const useGetGroupDetail = (id: string) => {
  const { data, error } = useSWR<GroupItem | null>(`/group-chat/${id}`, () => getGroupDetail(id), {
    revalidateOnFocus: false,
    errorRetryCount: 1, // Number of retries
    errorRetryInterval: 3000, // Interval between retries in milliseconds
  });

  return {
    data,
    error,
    isLoading: !data && !error,
  };
};

export const useGetGroupMembers = (
  id: string,
  filter: FilterDto,
  allowToFetch: boolean = false
) => {
  const { data, error, isLoading } = useSWR<MembersResponse | null>(
    allowToFetch ? `/group-chat/members/${id}?filter=${JSON.stringify(filter)}` : null,
    () => getGroupMembers(id, filter),
    {
      revalidateOnFocus: false,
      errorRetryCount: 1, // Number of retries
      errorRetryInterval: 3000, // Interval between retries in milliseconds
    }
  );

  return {
    data,
    error,
    isLoading,
  };
};

export const useDeleteGroup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const route = useRouter();
  const pathname = usePathname();
  const { onClose } = useGroupSettingModal();
  const t = useTranslations();

  const isContactPath = useMemo(() => {
    const contactPaths = ['/contacts/chat', '/vi/contacts/chat', '/en/contacts/chat'];
    return contactPaths.some((pattern) => pathname?.startsWith(pattern));
  }, [pathname]);

  const isChatPath = useMemo(() => {
    const chatPaths = ['/chat', '/vi/chat', '/en/chat'];
    return chatPaths.some((pattern) => pathname?.startsWith(pattern));
  }, [pathname]);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      setError(null);
      await deleteGroup(id);
      onClose();
      isContactPath && route.push('/contacts/chat');
      isChatPath && route.push('/chat');
    } catch (error: any) {
      setError(error.message);
      toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, handleDelete };
};

export const useLeaveGroup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations();
  const { onClose } = useGroupSettingModal();
  const router = useRouter();
  const pathname = usePathname();
  const isContactsPage = useMemo(() => {
    const contactPaths = ['/contacts/chat', '/vi/contacts/chat', '/en/contacts/chat'];
    return contactPaths.some((pattern) => pathname?.startsWith(pattern));
  }, [pathname]);
  const { leaveGroup: leaveGroupLocal } = useGroupsContext();

  const submit = async (id: string) => {
    setIsLoading(true);
    try {
      setError(null);
      await leaveGroup(id);
      toast.success(t('ACTION_SUCCESS'));
      onClose();
      leaveGroupLocal(id);
      router.push(isContactsPage ? '/contacts/chat' : '/chat');
    } catch (error: any) {
      setError(error.message);
      toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, submit };
};
