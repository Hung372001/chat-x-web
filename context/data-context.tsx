'use client';

import useChatId from '@/hooks/useChatId';
import { useGetGroupDetail } from '@/hooks/useGroupChat';
import { useCurrentUser, useGetFriendRequest, useGetRollCall } from '@/hooks/useUser';
import { GroupChatType, GroupItem } from '@/types/group-chat';
import { FriendRequestResponse, User } from '@/types/user';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { mutate } from 'swr';
import { SendingMessage } from '@/types/chat-message';

interface DataContextType {
  currentUser: User | null;
  isCurrentUserLoaded: boolean;
  isLoadingCurrentUser: boolean;
  refreshCurrentUser: () => void;

  groupDetail: GroupItem | null;
  isLoadingGroupDetail: boolean;
  refreshGroupDetail: () => void;

  selectedFiles: File[] | null;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[] | null>>;

  sendingMessages: Array<SendingMessage>;
  enqueueSendingMessage: (message: SendingMessage) => void;
  dequeueSendingMessage: (groupId: string) => void;
  clearSendingMessage: () => void;

  isAttended: boolean;
  rollCallData: string[];

  currentFriend: FriendRequestResponse | null;
  refreshCurrentFriend: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

const DataProvider: React.FC<Props> = ({ children }) => {
  const {
    data: currentUser,
    refresh: refreshCurrentUser,
    isLoaded: isCurrentUserLoaded,
    isLoading: isLoadingCurrentUser,
  } = useCurrentUser();
  const { chatId } = useChatId();
  const { isLoading: isLoadingGroupDetail, data: groupDetail } = useGetGroupDetail(chatId);

  const friendInDouGroup = useMemo(() => {
    if (currentUser && groupDetail?.members && groupDetail?.type === GroupChatType.DOU) {
      return groupDetail?.members?.find((user) => user.id !== currentUser.id) ?? null;
    }
    return null;
  }, [currentUser, groupDetail?.members, groupDetail?.type]);

  const { data: currentFriend } = useGetFriendRequest(friendInDouGroup?.id ?? null);

  const { isAttended, data: rollCallData } = useGetRollCall();

  const [sendingMessages, setSendingMessages] = useState<Array<SendingMessage>>([]);

  const refreshCurrentFriend = useCallback(() => {
    mutate(`/user/friend-request/${friendInDouGroup?.id}`);
  }, [friendInDouGroup?.id]);

  const sendingMessagesByGroup = useMemo(() => {
    return sendingMessages.filter((message) => message.groupId === chatId);
  }, [chatId, sendingMessages]);

  const enqueueSendingMessage = useCallback((message: SendingMessage) => {
    setSendingMessages((prev) => [...prev, message]);
  }, []);

  const dequeueSendingMessage = useCallback(
    (groupId: string) => {
      const oldestSendingMessageOfGroup = sendingMessages.find(
        (message) => message.groupId === groupId
      );
      if (oldestSendingMessageOfGroup) {
        setSendingMessages((prev) =>
          prev.filter((message) => message !== oldestSendingMessageOfGroup)
        );
      }
    },
    [sendingMessages]
  );

  const clearSendingMessage = useCallback(() => {
    setSendingMessages((prev) => prev.filter((message) => message.groupId !== chatId));
  }, [chatId]);

  const refreshGroupDetail = async () => {
    await mutate(`/group-chat/${chatId}`);
  };

  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);

  useEffect(() => {
    setSelectedFiles(null);
  }, [chatId]);

  return (
    <DataContext.Provider
      value={{
        currentUser,
        isCurrentUserLoaded,
        isLoadingCurrentUser,

        groupDetail: groupDetail ?? null,
        isLoadingGroupDetail,

        refreshCurrentUser,
        refreshGroupDetail,

        selectedFiles,
        setSelectedFiles,

        sendingMessages: sendingMessagesByGroup,
        enqueueSendingMessage,
        dequeueSendingMessage,
        clearSendingMessage,

        isAttended,
        rollCallData,

        currentFriend: currentFriend ?? null,
        refreshCurrentFriend,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useDataContext() {
  const context = React.useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
}

export { DataContext, DataProvider };
