import AddFriendIcon from '@/components/icons/add-friend-icon';
import AddGroupIcon from '@/components/icons/add-group-icon';
import { Button } from '@/components/ui/button';
import { useDataContext } from '@/context/data-context';
import { useGroupsContext } from '@/context/groups-context';
import useAddFriend from '@/hooks/useAddFriend';
import { useRollCall } from '@/hooks/useUser';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import { useCreateGroupModal } from '../modals/create-group-modal';

export default function ChatPanelHeader({ title }: { title: string }) {
  const { handleOpen: openAddFriend } = useAddFriend();
  const { onOpen: onOpenCreateGroupModal } = useCreateGroupModal();
  const { submit: rollCall } = useRollCall();
  const { isAttended } = useDataContext();
  const { isShowArchived, toggleShowArchived } = useGroupsContext();
  const t = useTranslations();

  useEffect(() => {
    if (!isAttended) {
      rollCall();
    }
  }, [isAttended]);

  return (
    <div className='flex h-[84px] items-center justify-between border-b border-black/10 px-6 dark:border-black'>
      {isShowArchived ? (
        <div className='flex items-center space-x-4'>
          <div className='cursor-pointer text-2xl hover:text-[#2FACE1]'>
            <HiArrowLeft onClick={toggleShowArchived} />
          </div>

          <h1 className='text-[25px] font-bold text-dark-blue dark:text-white'>{t('ARCHIVE')}</h1>
        </div>
      ) : (
        <>
          <h1 className='text-[25px] font-bold text-dark-blue dark:text-white'>{title}</h1>
          <div className='flex gap-1'>
            <Button className='h-9 w-9 rounded-full p-0 active:opacity-80' onClick={openAddFriend}>
              <AddFriendIcon />
            </Button>
            <Button
              className='h-9 w-9 rounded-full p-0 active:opacity-80'
              onClick={onOpenCreateGroupModal}
            >
              <AddGroupIcon />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
