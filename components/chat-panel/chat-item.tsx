'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import GroupAvatar from '../group-avatar';
import DownloadIcon from '../icons/download-icon';
import PinIcon from '../icons/pin-icon';
import TrashIcon from '../icons/trash-icon';
import { Button } from '../ui/button';
import { Member } from '@/types/group-chat';
import { useDeleteGroup } from '@/hooks/useGroupChat';
import PinIcon2 from '../icons/pin-icon-2';
import { useTranslations } from 'next-intl';
import { PinOff } from 'lucide-react';
import { useToggleHiding, useTogglePin } from '@/hooks/useGroupSetting';
import { useRemoveFriend } from '@/hooks/useUser';
import { useDataContext } from '@/context/data-context';
import { useGroupsContext } from '@/context/groups-context';

export type ChatItemProps = {
  id: string;
  title: string;
  lastMessage: string;
  unreadCount: number;
  avatar: string;
  lastMessageTime: string;
  lastMessageTimeStamp?: number;
  isSelected?: boolean;
  isGroup?: boolean;
  members?: Member[];
  totalMembers: number;
  pinned: boolean;
  isArchived: boolean;
};

export default function ChatItem({
  id,
  title,
  lastMessage,
  unreadCount,
  avatar,
  lastMessageTime,
  isSelected,
  isGroup,
  members,
  pinned,
  totalMembers,
  isArchived,
}: ChatItemProps) {
  const [isShowActions, setIsShowActions] = useState(false);
  const t = useTranslations();
  const { isLoading: isDeletingGroup, handleDelete } = useDeleteGroup();
  const { isLoading: isRemovingFriend, submit: handleRemoveFriend } = useRemoveFriend();
  const { submit: togglePin, isLoading: isTogglingPin } = useTogglePin();
  const { submit: toggleArchive, isLoading: isTogglingArchive } = useToggleHiding();
  const { currentUser } = useDataContext();
  const { leaveGroup: leaveGroupLocal } = useGroupsContext();

  const showActions = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    setIsShowActions(true);
  };

  const otherUser = useMemo(() => {
    return currentUser ? members?.find((user) => user.id !== currentUser.id) : null;
  }, [currentUser, members]);

  const onDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    handleDelete(id);

    if (otherUser && !isGroup) {
      leaveGroupLocal(id);
      handleRemoveFriend(otherUser.id);
    }
  };

  const onPin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    togglePin(id);
  };

  const onArchive = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    toggleArchive(id);
  };

  return (
    <div className='relative pl-2'>
      {pinned && (
        <div className='absolute left-0 top-6 z-20'>
          <PinIcon2 />
        </div>
      )}
      <div
        className={clsx(
          'group flex min-h-[80px] w-full cursor-pointer justify-between rounded-[15px] p-[15px] hover:bg-[#E6E6E6]',
          isSelected && 'bg-[#D6F3FF]'
        )}
        onMouseLeave={() => setIsShowActions(false)}
      >
        <div className='flex items-center'>
          {isGroup ? (
            <>
              {members && totalMembers > 0 && (
                <GroupAvatar highlightMembers={members} totalMembers={totalMembers} />
              )}
            </>
          ) : (
            <Avatar className='h-[50px] w-[50px] bg-gray-200'>
              <AvatarImage src={avatar || '/images/default-avatar.png'} />
            </Avatar>
          )}

          <div className={clsx('ml-[10px] w-[130px] pt-1', !isGroup && !!lastMessage && 'pb-5')}>
            <p
              className={clsx(
                'mb-1 truncate text-[15px] font-bold group-hover:text-dark-blue',
                isSelected && 'text-dark-blue'
              )}
            >
              {title}
            </p>
            {!!lastMessage && (
              <p className='relative text-xs text-[#8A9AA9] dark:text-[#AFBAC5]'>
                {isGroup && (
                  <Avatar className='mr-1 inline-block h-[15px] w-[15px] bg-gray-200'>
                    <AvatarImage src={avatar || '/images/default-avatar.png'} />
                  </Avatar>
                )}
                <span className='absolute w-[calc(100%-15px)] truncate'>{lastMessage}</span>
              </p>
            )}
          </div>
        </div>
        <div className='relative hidden items-center gap-1 group-hover:flex'>
          {isShowActions ? (
            <div className='absolute right-1 flex items-center gap-1'>
              <Button
                className='h-9 w-9 rounded-full bg-[#2FACE1] p-0 text-white hover:bg-[#2FACE1] active:opacity-60'
                onClick={onArchive}
                disabled={isTogglingArchive}
              >
                <DownloadIcon />
              </Button>

              {!isArchived && (
                <>
                  <Button
                    className={clsx(
                      'h-9 w-9 rounded-full bg-[#2FACE1] p-0 text-white hover:bg-[#2FACE1] active:opacity-60',
                      pinned && 'active bg-[#FF8F8F] hover:bg-[#FF8F8F]'
                    )}
                    disabled={isTogglingPin}
                    onClick={onPin}
                  >
                    {pinned ? <PinOff color='white' /> : <PinIcon />}
                  </Button>
                  <Button
                    className='h-9 w-9 rounded-full bg-[#FF8F8F] p-0 text-white hover:bg-[#FF8F8F] active:opacity-60'
                    disabled={isDeletingGroup || isRemovingFriend}
                    onClick={onDelete}
                  >
                    <TrashIcon />
                  </Button>
                </>
              )}
            </div>
          ) : (
            <Button
              className='h-[30px] bg-transparent px-2 py-0 text-xl text-gray-500 hover:bg-gray-300 hover:text-[#2FACE1] active:bg-transparent'
              onClick={showActions}
            >
              <HiDotsHorizontal />
            </Button>
          )}
        </div>

        <div className='flex flex-col justify-center text-right group-hover:hidden'>
          {unreadCount > 0 && !isSelected && (
            <div className='flex justify-end'>
              <div
                className={clsx(
                  'mb-2 min-w-[21px] rounded-full bg-[#0174B5] px-[7px] py-[3px] text-center text-[10px] font-bold text-white group-hover:dark:text-white',
                  isSelected ? 'dark:text-white' : 'dark:text-[#333333]'
                )}
              >
                {unreadCount}
              </div>
            </div>
          )}
          <p className='text-xs text-[#8A9AA9] dark:text-[#AFBAC5]'>{lastMessageTime}</p>
        </div>
      </div>
    </div>
  );
}
