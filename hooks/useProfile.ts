import { useState } from 'react';

import { UpdateProfileDto } from '../types/profile';
import { updateProfile } from '../services/profile';
import { User } from '@/types/user';
import { useDataContext } from '@/context/data-context';
import { wait } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export const useUpdateProfile = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<User | null>(null);
  const { refreshCurrentUser } = useDataContext();
  const t = useTranslations();

  const update = async (updateData: UpdateProfileDto) => {
    setIsLoading(true);
    try {
      setError(null);
      const res = await updateProfile(updateData);
      await wait(2000);
      refreshCurrentUser();
      toast.success(t('PROFILE.UPDATE_PROFILE_SUCCESS'));
      setData(res);
      await wait(1000);
    } catch (error: any) {
      setError(error.message);
      toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, update };
};
