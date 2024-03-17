import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import EditIcon from './icons/edit-icon';
import { upload } from '@/services/upload';
import toast from 'react-hot-toast';
import { useDataContext } from '@/context/data-context';
import { wait } from '@/lib/utils';
import { updateAvatar } from '@/services/profile';
import { Input } from './ui/input';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

export default function DynamicAvatar() {
  const t = useTranslations();
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, refreshCurrentUser } = useDataContext();

  useEffect(() => {
    if (currentUser?.profile?.avatar) {
      setAvatar(currentUser.profile.avatar);
    }
  }, [currentUser]);

  const handleFileChange = async (e: any) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    setIsLoading(true);

    const uploadRequest = upload(formData)
      .then(async (res) => {
        await updateAvatar(res.data.url);
        await wait(500);
        refreshCurrentUser();
      })
      .finally(() => {
        setIsLoading(false);
      });

    toast.promise(uploadRequest, {
      loading: t('CONVERSATION.UPLOADING'),
      success: (data) => {
        return t('PROFILE.UPDATE_PROFILE_SUCCESS');
      },
      error: t('AN_ERROR_OCCURRED'),
    });
  };

  return (
    <div className='relative'>
      <Avatar className={clsx('h-[93px] w-[93px] bg-gray-200', isLoading && 'opacity-60')}>
        <AvatarImage src={avatar || '/images/default-avatar.png'} />
      </Avatar>

      <Input
        id='avatar-change'
        className='hidden'
        type='file'
        accept='.jpg, .jpeg, .gif, .png, .mpeg-2'
        onChange={handleFileChange}
      />
      <Button
        className='absolute bottom-0 right-0 h-[26px] w-[26px] rounded-full bg-[#2FACE1] p-0'
        disabled={isLoading}
        onClick={() => document.getElementById('avatar-change')!.click()}
      >
        <EditIcon fill='white' />
      </Button>
    </div>
  );
}
