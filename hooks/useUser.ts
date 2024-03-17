import { useDailyAttendanceModal } from '@/components/modals/daily-attendance-modal';
import { useDataContext } from '@/context/data-context';
import { MESSAGE_PAGE_SIZE } from '@/lib/consts';
import { formatDate, getDate30DaysAgo, wait } from '@/lib/utils';
import {
  acceptFriend,
  addFriends,
  getCurrentUser,
  getFriendRequest,
  getRollCall,
  getUser,
  getUsers,
  removeFriend,
  rollCall,
  toggleHiding,
  toggleSoundNotification,
  updateNickname,
} from '@/services/user';
import { FilterDto, SortOrder } from '@/types/common';
import { FriendRequestResponse, GetUsersResponse, User } from '@/types/user';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useSWR, { mutate } from 'swr';

export const useCurrentUser = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [data, setData] = useState<User | null>(null);
  const session = useSession();

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetch();
    }
  }, [session.status]);

  const fetch = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const data = await getCurrentUser();
      setData(data);
      setIsLoaded(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, refresh: fetch, isLoaded };
};

export const useGetUsers = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<GetUsersResponse | null>(null);

  const fetch = async (filter: FilterDto) => {
    setIsLoading(true);
    try {
      setError(null);
      const data = await getUsers(filter);
      setData(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, fetch };
};

export const useGetRollCall = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAttended, setIsAttended] = useState<boolean>(true);
  const [data, setData] = useState<string[]>([]);
  const session = useSession();

  useEffect(() => {
    if (session.status === 'authenticated') {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(0, 0, 0, 0);
      let timeUntilMidnight = midnight.getTime() - now.getTime();

      if (timeUntilMidnight <= 0) {
        timeUntilMidnight += 24 * 60 * 60 * 1000;
      }

      const intervalId = setInterval(fetch, timeUntilMidnight);

      fetch();

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [session.status]);

  const fetch = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const data = await getRollCall({
        fromDate: formatDate(getDate30DaysAgo()),
        toDate: formatDate(new Date()),
        sortOrder: SortOrder.DESC,
      });

      const todayStart = new Date(new Date().toLocaleDateString()).getTime();

      const isAttended = new Date(data?.items?.[0]).getTime() > todayStart;

      setIsAttended(isAttended);
      setData(data?.items || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isAttended, data, error, isLoading, refresh: fetch };
};

export const useRollCall = () => {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onOpen } = useDailyAttendanceModal();
  const session = useSession();

  const submit = async () => {
    if (session.status === 'authenticated') {
      setIsLoading(true);
      try {
        setError(null);
        await rollCall();
        onOpen();
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { error, isLoading, submit };
};

export const useToggleHiding = () => {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submit = async () => {
    setIsLoading(true);
    try {
      setError(null);
      await toggleHiding();
      await wait(2000);
      toast.success(t('PROFILE.UPDATE_PROFILE_SUCCESS'));
    } catch (error: any) {
      setError(error.message);
      toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, submit };
};

export const useToggleSoundNotification = () => {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submit = async () => {
    setIsLoading(true);
    try {
      setError(null);
      await toggleSoundNotification();
      await wait(2000);
      toast.success(t('PROFILE.UPDATE_PROFILE_SUCCESS'));
    } catch (error: any) {
      setError(error.message);
      toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, submit };
};

export const useAddFriends = () => {
  const t = useTranslations();

  const handleSubmit = async (friends: string[]) => {
    try {
      await addFriends(friends);
    } catch (error: any) {
      toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
      throw new Error(error.message);
    }
  };

  return { handleSubmit };
};

export const useAcceptFriend = () => {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  const submit = async (friendId: string) => {
    setIsLoading(true);
    try {
      setError(null);
      const data = await acceptFriend(friendId);
      setData(data);
      toast.success(t('ACTION_SUCCESS'));
    } catch (error: any) {
      setError(error.message);
      toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, submit, data };
};

export const useRemoveFriend = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations();

  const submit = async (friendId: string) => {
    setIsLoading(true);
    try {
      setError(null);
      await removeFriend(friendId);
    } catch (error: any) {
      setError(error.message);
      toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, submit };
};

export const useGetUser = (id: string | null) => {
  const { data, error, isLoading } = useSWR<User>(`/user/${id}`, () => getUser(id), {
    revalidateOnFocus: false,
    errorRetryCount: 1, // Number of retries
    errorRetryInterval: 3000, // Interval between retries in milliseconds
  });

  return {
    data,
    error,
    isLoading,
  };
};

export const useGetFriendRequest = (userId: string | null) => {
  const { data, error, isLoading } = useSWR<FriendRequestResponse>(
    `/user/friend-request/${userId}`,
    () => getFriendRequest(userId),
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

export const useUpdateNickname = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations();
  const { refreshGroupDetail } = useDataContext();

  const submit = async ({ userId, nickname }: { userId: string; nickname: string }) => {
    setIsLoading(true);
    try {
      setError(null);
      await updateNickname(userId, nickname);

      // Update cache
      await mutate(
        `/group-chat?filter=${JSON.stringify({
          keyword: '',
          sortBy: 'updatedAt',
          sortOrder: SortOrder.DESC,
          isGetAll: false,
          page: 1,
          limit: MESSAGE_PAGE_SIZE,
        })}`
      );

      await refreshGroupDetail();

      toast.success(t('ACTION_SUCCESS'));
    } catch (error: any) {
      setError(error.message);
      toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, submit };
};
