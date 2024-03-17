'use client';

import AddFriendIcon from '@/components/icons/add-friend-icon';
import OnelineStatus from '@/components/online-status';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import SettingIcon from '../icons/seting-icon';
import { useGroupSettingModal } from '../modals/group-setting-modal';
import { useAcceptFriend } from '@/hooks/useUser';
import { useDataContext } from '@/context/data-context';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GroupChatType } from '@/types/group-chat';
import useAddGroupMember from '@/hooks/useAddGroupMember';
import { User } from '@/types/user';
import GroupAvatar from '../group-avatar';
import useModifyMembers from '@/hooks/useModifyMember';
import { useOtherUserModal } from '../modals/other-user-modal';
import { useSocketContext } from '@/context/socket-context';
import useChatId from '@/hooks/useChatId';
import { Skeleton } from '../ui/skeleton';
import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations();
  const { onOpen: openGroupSetting } = useGroupSettingModal();
  const { groupDetail, isLoadingGroupDetail, currentUser, isLoadingCurrentUser, currentFriend } =
    useDataContext();
  const {
    isLoading: isLoadingAcceptFriend,
    submit,
    error,
    data: acceptFriendSuccessData,
  } = useAcceptFriend();
  const [conversation, setConversation] = useState<{
    avatar?: string;
    title?: string;
    id?: string;
    members?: User[];
    description?: string;
  }>({});
  const { handleOpen: openAddToGroup } = useAddGroupMember();
  const { handleOpen: openRemoveFromGroup } = useModifyMembers();
  const { onOpen: openOtherUserModal } = useOtherUserModal();
  const { chatId } = useChatId();
  const { socket, membersOnlineIds } = useSocketContext();

  const isLoading = useMemo(
    () => isLoadingCurrentUser || isLoadingGroupDetail,
    [isLoadingCurrentUser, isLoadingGroupDetail]
  );

  useEffect(() => {
    if (socket && chatId) {
      socket.emit('getOnlineGroupMembers', chatId);
    }
  }, [chatId, socket]);

  useEffect(() => {
    if (groupDetail?.type === GroupChatType.DOU) {
      if (groupDetail && currentUser) {
        const otherUser = groupDetail.members?.find((user) => user.id !== currentUser.id);
        setConversation({
          avatar: otherUser?.profile.avatar,
          title: otherUser?.nickname || otherUser?.username || 'Unknown',
          id: otherUser?.id,
        });
      } else {
        setConversation({});
      }
    } else if (groupDetail?.type === GroupChatType.GROUP) {
      setConversation({
        avatar: '',
        title: groupDetail?.name,
        id: groupDetail?.id,
        members: groupDetail?.members,
      });
    }
  }, [currentUser, groupDetail]);

  const isGroup = useMemo(() => {
    return groupDetail?.type === GroupChatType.GROUP;
  }, [groupDetail?.type]);

  const handleAcceptFriend = useCallback(() => {
    if (conversation.id) {
      submit(conversation.id);
    }
  }, [conversation.id]);

  const isFriendRequest = useMemo(() => {
    return (
      groupDetail?.type === GroupChatType.DOU &&
      !currentFriend?.isFriend &&
      currentFriend?.friendRequest?.isActive
    );
  }, [currentFriend?.friendRequest?.isActive, currentFriend?.isFriend, groupDetail?.type]);

  const handleOpenModifyMembers = () => {
    openRemoveFromGroup();
  };

  const handleOpenOtherUserModal = () => {
    if (groupDetail?.type === GroupChatType.DOU) {
      openOtherUserModal();
    }
  };

  const isOnline = useMemo(() => {
    if (groupDetail && currentUser) {
      const otherUser = groupDetail.members?.find((user) => user.id !== currentUser.id);
      if (membersOnlineIds && otherUser && membersOnlineIds.includes(otherUser.id)) return true;
    }

    return false;
  }, [currentUser, groupDetail, membersOnlineIds]);

  return (
    <div className='z-30 flex h-[84px] items-center justify-between border-b border-black/10 bg-white px-6 dark:border-black dark:bg-[#333]'>
      <div className='flex'>
        {isLoading && (
          <div className='flex items-center space-x-2'>
            <Skeleton className='h-[46px] w-[46px] rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-5 w-[150px]' />
              <Skeleton className='h-3 w-[100px]' />
            </div>
          </div>
        )}

        {conversation && !isLoading && (
          <div
            className='group flex cursor-pointer hover:opacity-80'
            onClick={
              groupDetail?.type === GroupChatType.GROUP
                ? handleOpenModifyMembers
                : handleOpenOtherUserModal
            }
          >
            {/* Avatar */}
            {isGroup ? (
              <>
                {conversation?.members && conversation?.members?.length > 0 && (
                  <GroupAvatar
                    highlightMembers={conversation?.members}
                    totalMembers={groupDetail?.memberQty || 0}
                  />
                )}
              </>
            ) : (
              <Avatar className='h-[46px] w-[46px] bg-gray-200'>
                <AvatarImage src={conversation?.avatar || '/images/default-avatar.png'} />
              </Avatar>
            )}

            {/* Name and status/description */}
            <div className='ml-[10px] max-w-[300px] pt-1'>
              <p className='truncate text-[20px] font-semibold leading-6 group-hover:text-[#2FACE1]'>
                {conversation?.title || 'Unkown'}
              </p>

              {isGroup ? (
                <div className='text-xs font-medium lowercase text-[#2FACE1]'>
                  {groupDetail?.memberQty || 0} {t('GROUP.MEMBER')}
                </div>
              ) : (
                <OnelineStatus online={isOnline} />
              )}
            </div>
          </div>
        )}
      </div>

      <div className='flex items-center gap-1'>
        {isFriendRequest && !acceptFriendSuccessData && (
          <Button
            className='h-[22px] rounded-full bg-[#2FACE1] px-[10px] text-[12px] font-medium hover:bg-[#2FACE1] active:bg-dark-blue'
            onClick={handleAcceptFriend}
            disabled={isLoadingAcceptFriend}
          >
            {t('CONVERSATION.ACCEPT_FRIEND')}
          </Button>
        )}

        {groupDetail?.type === GroupChatType.GROUP && (
          <>
            {(groupDetail?.isAdmin || groupDetail?.isOwner) && (
              <Button
                className='h-9 w-9 rounded-full bg-[#2FACE1] p-0 hover:bg-[#2FACE1] active:opacity-80'
                onClick={openAddToGroup}
              >
                <AddFriendIcon />
              </Button>
            )}
            <Button
              className='h-9 w-9 rounded-full bg-[#2FACE1] p-0 hover:bg-[#2FACE1] active:opacity-80'
              onClick={openGroupSetting}
            >
              <SettingIcon />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
