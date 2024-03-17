'use client';

import React, { createContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useDataContext } from './data-context';
import { mutate } from 'swr';
import { wait } from '@/lib/utils';
const _ = require('lodash');

interface SocketContextType {
  socket: Socket | null;
  latestMessages?: any;
  latestGroupCreated?: any;
  latestGroupDeletedId?: string;
  deletedMessage?: any;
  pinnedMessage?: any;
  unPinnedMessage?: any;
  stopTyping?: any;
  startTyping?: any;
  membersOnlineIds?: string[];
}

const SocketContext = createContext<SocketContextType | undefined>({ socket: null });

interface Props {
  children: React.ReactNode;
}

const SocketProvider: React.FC<Props> = ({ children }) => {
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;
  const [socket, setSocket] = useState<Socket | null>(null);
  const { currentUser, refreshGroupDetail, groupDetail, refreshCurrentFriend } = useDataContext();

  const [latestMessages, setLatestMessages] = useState<any>();
  const [latestGroupCreated, setLatestGroupCreated] = useState<any>();
  const [latestGroupDeletedId, setLatestGroupDeletedId] = useState<string>();
  const [deletedMessage, setDeletedMessage] = useState<any>();
  const [pinnedMessage, setPinnedMessage] = useState<any>();
  const [unPinnedMessage, setUnPinnedMessage] = useState<any>();
  const [stopTyping, setStopTyping] = useState<any>();
  const [startTyping, setStartTyping] = useState<any>();
  const [membersOnlineIds, setMembersOnlineIds] = useState<string[]>();

  useEffect(() => {
    if (accessToken) {
      // Create a socket connection
      const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?token=Bearer ${accessToken}`, {
        transports: ['websocket', 'polling'],
      });

      setSocket(socket);

      // Clean up the socket connection on unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [accessToken]);

  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on('newGroupChatCreated', (data: any) => {
        if (data?.groupChat) {
          setLatestGroupCreated(data?.groupChat);
        }
      });

      // Not support yet
      // socket.on('groupChatRenamed', (message: any) => {
      //   console.log('[SOCKET] - groupChatRenamed', message);
      // });

      socket.on('groupChatRemoved', (message: any) => {
        console.log('[SOCKET] - groupChatRemoved', message);
        setLatestGroupDeletedId(message?.groupChat?.id);
      });

      socket.on('messageUnsent', (message: any) => {
        console.log('[SOCKET] - messageUnsent', message);
      });

      socket.on('messagePinned', (message: any) => {
        setPinnedMessage(message?.pinnedMessage);
      });

      socket.on('messageUnpinned', (message: any) => {
        setUnPinnedMessage(message?.unPinnedMessage);
      });

      socket.on('messageDeleted', (message: any) => {
        setDeletedMessage(message?.deletedMessage);
      });

      // Not support yet
      // socket.on('messagesRead', (message: any) => {
      //   console.log('[SOCKET] - messagesRead', message);
      // });

      socket.on('someoneIsTyping', (message: any) => {
        setStartTyping(message);
      });

      socket.on('someoneStopTyping', (message: any) => {
        setStopTyping(message);
      });

      socket.on('someoneOnline', (message: any) => {
        setMembersOnlineIds((membersOnlineIds) =>
          _.uniq([message?.member?.id, ...(membersOnlineIds || [])])
        );
      });

      socket.on('someoneOffline', (message: any) => {
        setMembersOnlineIds(
          (membersOnlineIds) => membersOnlineIds?.filter((x) => x !== message?.member?.id) || []
        );
      });

      socket.on('onlineGroupMembersResponse', (message: any) => {
        const onlineMemberIds = message?.onlineMembers.map((x: any) => x?.id);

        setMembersOnlineIds((membersOnlineIds) =>
          _.uniq([...onlineMemberIds, ...(membersOnlineIds || [])])
        );
      });

      socket.on('chatError', (message: any) => {
        toast.error(message?.errorMsg);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('newMembersJoined', async (message: any) => {
        if (message?.newMembers?.map((x: any) => x.id).includes(currentUser?.id)) {
          setLatestGroupCreated(message?.groupChat);
        } else if (message?.groupChat?.id === groupDetail?.id) {
          await wait(5000);
          await mutate(
            `/group-chat/members/${groupDetail?.id}?filter=${JSON.stringify({
              isGetAll: true,
            })}`
          );
          await refreshGroupDetail();
        }
      });

      socket.on('groupMembersRemoved', async (message: any) => {
        const isCurrentUserRemoved = message?.removeMembers
          ?.map((x: any) => x.id)
          .includes(currentUser?.id);
        if (isCurrentUserRemoved) {
          setLatestGroupDeletedId(message?.groupChat?.id);
        } else if (message?.groupChat?.id === groupDetail?.id) {
          await wait(5000);
          await mutate(
            `/group-chat/members/${groupDetail?.id}?filter=${JSON.stringify({
              isGetAll: true,
            })}`
          );
          await refreshGroupDetail();
        }
      });
    }
  }, [currentUser?.id, groupDetail?.id, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessageReceived', (data: any) => {
        const { newMessage } = data;
        const { group } = newMessage;
        const isMyGroup = group?.members?.map((x: any) => x.id).includes(currentUser?.id);
        if (newMessage?.isFriendRequest && isMyGroup) {
          refreshCurrentFriend();
        }

        setLatestMessages(newMessage);
      });
    }
  }, [currentUser?.id, refreshCurrentFriend, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('adminGroupChatModified', async (message: any) => {
        if (message?.groupChat?.id === groupDetail?.id) {
          await refreshGroupDetail();
        }
      });
    }
  }, [groupDetail?.id, socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        latestMessages,
        latestGroupCreated,
        latestGroupDeletedId,
        deletedMessage,
        pinnedMessage,
        unPinnedMessage,
        stopTyping,
        startTyping,
        membersOnlineIds,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export function useSocketContext() {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
}

export { SocketContext, SocketProvider };
