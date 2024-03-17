'use client';

import { ChatItemProps } from '@/components/chat-panel/chat-item';
import { GroupChatType, GroupItem } from '@/types/group-chat';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useDataContext } from './data-context';
import { MessageType } from '@/app/[locale]/chat/components/conversations-panel';
import { usePathname, useRouter } from 'next/navigation';
import { useSocketContext } from './socket-context';
import useChatId from '@/hooks/useChatId';
import { fromGroupItemToConversationItem } from '@/lib/convert';
import { ContactTabs } from '@/app/[locale]/contacts/components/contacts-panel';
import { useLocale } from 'next-intl';

interface DataContextType {
  groups: GroupItem[];
  setGroups: React.Dispatch<React.SetStateAction<GroupItem[]>>;
  chatList: ChatItemProps[];

  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;

  selectedMessageTab: MessageType;
  setSelectedMessageTab: React.Dispatch<React.SetStateAction<MessageType>>;

  selectedContactTab: ContactTabs;
  setSelectedContactTab: React.Dispatch<React.SetStateAction<ContactTabs>>;

  backupGroupItem: GroupItem | undefined;
  setBackupTargetId: React.Dispatch<React.SetStateAction<string | null>>;

  isShowArchived: boolean;
  toggleShowArchived: () => void;

  togglePin: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  toggleHiding: (groupId: string) => void;
}

const GroupsContext = createContext<DataContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

const GroupsProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();

  const [groups, setGroups] = React.useState<GroupItem[]>([]);
  const [keyword, setKeyword] = React.useState<string>('');
  const [selectedMessageTab, setSelectedMessageTab] = React.useState<MessageType>(MessageType.ALL);
  const [selectedContactTab, setSelectedContactTab] = React.useState<ContactTabs>(
    ContactTabs.PERSON
  );
  const { currentUser } = useDataContext();
  const [filteredChatList, setFilteredChatList] = useState<ChatItemProps[]>([]);
  const { chatId } = useChatId();
  const { latestGroupCreated, latestMessages, latestGroupDeletedId } = useSocketContext();
  const [backupTargetId, setBackupTargetId] = useState<string | null>(null);

  const [isShowArchived, setIsShowArchived] = useState<boolean>(false);

  const toggleShowArchived = () => {
    setIsShowArchived((prev) => !prev);
  };

  const backupGroupItem = useMemo(() => {
    return groups?.find((x) => x.id === backupTargetId);
  }, [backupTargetId, groups]);

  useEffect(() => {
    const newGroups = [...groups];
    const selectedGroup = newGroups.find((x) => x.id === chatId);
    if (selectedGroup) {
      if (selectedGroup.settings?.[0]) {
        selectedGroup.settings[0].unReadMessages = 0;
      }
    }
    setGroups(newGroups);
  }, [chatId]);

  useEffect(() => {
    if (!latestMessages) {
      return;
    }
    /**
     * Update latest message for group even if it's not in the list yet
     */
    console.log('[DEBUG] - latestMessages', latestMessages);
    if (groups.map((x) => x.id).includes(latestMessages?.group?.id)) {
      // Update latest message for group in the list
      const index = groups.findIndex((x) => x.id === latestMessages?.group?.id);
      const newGroups = [...groups];
      const [targetGroup] = newGroups.splice(index, 1);

      targetGroup.latestMessage = {
        message: latestMessages?.message,
        createdAt: latestMessages?.createdAt,
        imageUrls: latestMessages?.sender?.profile?.avatar,
      };

      if (!targetGroup.settings) {
        targetGroup.settings = [];
        targetGroup.settings[0] = {} as any;
        targetGroup.settings[0].unReadMessages = 0;
      }

      if (targetGroup.settings?.[0]) {
        if (chatId != latestMessages?.group?.id) {
          targetGroup.settings[0].unReadMessages += 1;
        } else {
          targetGroup.settings[0].unReadMessages = 0;
        }
      }

      newGroups.unshift(targetGroup);
      setGroups(newGroups);
    } else {
      // Update latest message for group not in the list yet
      const newGroup: GroupItem = {
        ...latestMessages?.group,

        latestMessage: {
          message: latestMessages?.message,
          createdAt: latestMessages?.createdAt,
          imageUrls: latestMessages?.sender?.profile?.avatar,
        },
        settings: [
          {
            unReadMessages: 1,
          },
        ],
      };

      if (newGroup.type === GroupChatType.DOU) {
        newGroup.members = [
          latestMessages?.sender,
          {
            ...currentUser,
          },
        ];
      }

      setGroups((prev) => [newGroup, ...prev]);
    }
  }, [latestMessages, currentUser]);

  const pathname = usePathname();
  const isContactsPage = useMemo(() => {
    const contactPaths = ['/contacts/chat', '/vi/contacts/chat', '/en/contacts/chat'];
    return contactPaths.some((pattern) => pathname?.startsWith(pattern));
  }, [pathname]);

  useEffect(() => {
    if (isContactsPage) {
      setSelectedMessageTab(MessageType.ALL);
    } else {
      setSelectedContactTab(ContactTabs.PERSON);
    }

    setIsShowArchived(false);
  }, [isContactsPage]);

  const locale = useLocale();

  const chatList: ChatItemProps[] = useMemo(() => {
    return fromGroupItemToConversationItem(groups, currentUser?.id, locale);
  }, [groups, currentUser?.id]);

  // [CONTACTS PAGE]
  // With contacts page, no need to filter by keyword or tabs
  useEffect(() => {
    if (isContactsPage && currentUser?.id && selectedContactTab === ContactTabs.PERSON) {
      const filterdByKeyword = chatList?.filter((item) => {
        if (item.title.toLowerCase().includes(keyword.toLowerCase())) {
          return item;
        }
      });

      setFilteredChatList(filterdByKeyword);
    } else if (isContactsPage && currentUser?.id && selectedContactTab === ContactTabs.GROUP) {
      const filterdByKeyword = chatList?.filter((item) => {
        if (item.title.toLowerCase().includes(keyword.toLowerCase())) {
          return item;
        }
      });

      setFilteredChatList(filterdByKeyword);
    }
  }, [chatList, isContactsPage, currentUser?.id, selectedContactTab, keyword]);

  // [CHAT PAGE]
  // With chat page, filter by keyword, tabs and not in friend requests
  useEffect(() => {
    if (!isContactsPage) {
      const filterdByKeyword = chatList?.filter((item) => {
        if (item.title.toLowerCase().includes(keyword.toLowerCase())) {
          return item;
        }
      });

      const filteredByTab = filterdByKeyword?.filter((item) => {
        if (selectedMessageTab === MessageType.ALL) {
          return item;
        } else if (selectedMessageTab === MessageType.UNREAD) {
          return item.unreadCount > 0;
        }
      });

      setFilteredChatList(filteredByTab);
    }
  }, [chatList, isContactsPage, keyword, selectedMessageTab, currentUser?.id]);

  // Realtime created group
  useEffect(() => {
    if (!!latestGroupCreated) {
      if (!latestGroupCreated.latestMessage) {
        latestGroupCreated.latestMessage = {};
      }
      latestGroupCreated.latestMessage.createdAt = new Date().toISOString();
      if (latestGroupCreated?.type === GroupChatType.GROUP) {
        latestGroupCreated.memberQty =
          latestGroupCreated.memberQty || latestGroupCreated?.members?.length || 2; // 2: default for 1-1 chat
        setGroups((prev) => [latestGroupCreated, ...prev]);
      } else {
        setGroups((prev) => [latestGroupCreated, ...prev]);
      }
    }
  }, [currentUser?.id, latestGroupCreated]);

  // Realtime deleted group
  useEffect(() => {
    if (latestGroupDeletedId) {
      const newGroups = groups.filter((x) => x.id !== latestGroupDeletedId);
      setGroups(newGroups);
      router.push(isContactsPage ? '/contacts/chat' : '/chat');
    }
  }, [isContactsPage, latestGroupDeletedId]);

  const togglePin = useCallback(
    (groupId: string) => {
      const newGroups = [...groups];
      const targetGroup = newGroups.find((x) => x.id === groupId);
      if (targetGroup && targetGroup.settings?.[0]) {
        targetGroup.settings[0].pinned = !targetGroup.settings?.[0]?.pinned;
        setGroups(newGroups);
      }
    },
    [groups]
  );

  const leaveGroup = useCallback(
    (groupId: string) => {
      const newGroups = groups.filter((x) => x.id !== groupId);
      setGroups(newGroups);
    },
    [groups]
  );

  const toggleHiding = useCallback(
    (groupId: string) => {
      const newGroups = [...groups];
      const targetGroup = newGroups.find((x) => x.id === groupId);
      if (targetGroup && targetGroup.settings?.[0]) {
        targetGroup.settings[0].hiding = !targetGroup.settings?.[0]?.hiding;
        setGroups(newGroups);
      }
    },
    [groups]
  );

  return (
    <GroupsContext.Provider
      value={{
        groups,
        setGroups,
        chatList: filteredChatList,

        keyword,
        setKeyword,

        selectedMessageTab,
        setSelectedMessageTab,

        selectedContactTab,
        setSelectedContactTab,

        backupGroupItem,
        setBackupTargetId,

        isShowArchived,
        toggleShowArchived,

        togglePin,
        toggleHiding,
        leaveGroup,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};

export function useGroupsContext() {
  const context = React.useContext(GroupsContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a GroupsProvider');
  }
  return context;
}

export { GroupsContext, GroupsProvider };
