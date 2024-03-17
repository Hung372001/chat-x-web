import React from 'react';
import AddGroupIcon from './icons/add-group-icon';
import { Button } from './ui/button';
import useAddFriend from '@/hooks/useAddFriend';
import { useTranslations } from 'next-intl';

export default function EmptyFriendList() {
  const { handleOpen: openAddFriend } = useAddFriend();
  const t = useTranslations();

  return (
    <div className='mt-[32px] flex flex-col items-center gap-10'>
      <div className='flex items-center'>
        <AddGroupIcon />
        <div className='ml-[9px] text-[13px] font-medium'>
          {t('CONVERSATION.FRIEND_REQUEST')}
        </div>
      </div>
      <div className='text-[13px] font-medium text-[#8A9AA9]'>
        {t('CONVERSATION.EMPTY_LIST_CONTENT')}
      </div>
      <Button
        className='h-[32px] rounded-full bg-[#2FACE1] px-[29px] text-[13px] font-medium hover:bg-[#2FACE1] active:bg-dark-blue'
        onClick={openAddFriend}
      >
        {t('CONVERSATION.FIND_MORE_FRIEND')}
      </Button>
    </div>
  );
}
