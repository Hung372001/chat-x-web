'use client';

import EmptyFriendList from '@/components/empty-friend-list';
import { usePathname, useRouter } from 'next/navigation';
import ChatItem, { ChatItemProps } from './chat-item';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useChatId from '@/hooks/useChatId';
import { useGroupsContext } from '@/context/groups-context';
import ArchivedGroups from '../archived-groups';
import { MessageType } from '@/app/[locale]/chat/components/conversations-panel';
import InfiniteScroll from 'react-infinite-scroller';
import { getGroups } from '@/services/group-chat';
import { FilterDto } from '@/types/common';
import { GROUP_PAGE_SIZE } from '@/lib/consts';

const _ = require('lodash');
let isLoadingMore = false;

export default function ChatList({
  groupQuery,
  hasMoreInitial,
}: {
  groupQuery: FilterDto;
  hasMoreInitial: boolean;
}) {
  const router = useRouter();
  const { chatId } = useChatId();
  const pathname = usePathname();
  const { chatList, isShowArchived, toggleShowArchived, setSelectedMessageTab, setGroups } =
    useGroupsContext();

  const baseUrl = pathname?.startsWith('/contacts/chat') ? '/contacts/chat' : '/chat';

  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [page, setPage] = useState(1);

  const isContactChat = useMemo(() => {
    return pathname?.startsWith('/contacts/chat');
  }, [pathname]);

  const viewConversation = useCallback(
    (id: string) => {
      if (chatId !== id) {
        router.push(`${baseUrl}/${id}`);
        setSelectedMessageTab(MessageType.ALL);
      }
    },
    [baseUrl, chatId, router]
  );

  const archivedGroups: ChatItemProps[] = useMemo(() => {
    return chatList.filter((item) => item.isArchived);
  }, [chatList]);

  useEffect(() => {
    if (!archivedGroups || archivedGroups.length === 0) {
      isShowArchived && toggleShowArchived();
    }
  }, [archivedGroups, isShowArchived]);

  const pinnedGroups: ChatItemProps[] = useMemo(() => {
    return chatList.filter((item) => item.pinned && !item.isArchived);
  }, [chatList]);

  const uniqueSortedGroups: ChatItemProps[] = useMemo(() => {
    const combinedGroupList = _.uniqBy(chatList, 'id').filter(
      (item: ChatItemProps) => (!isContactChat && !item.pinned && !item.isArchived) || isContactChat
    );
    return _.sortBy(combinedGroupList, ['lastMessageTimeStamp']).reverse();
  }, [chatList]);

  const fetchItems = useCallback(async () => {
    if (!isLoadingMore && hasMore) {
      isLoadingMore = true;

      try {
        const res = await getGroups({
          ...groupQuery,
          page: page + 1,
        });

        if (res.items) {
          setGroups((prev) => [...prev, ...res.items]);
        }

        setHasMore((page + 1) * GROUP_PAGE_SIZE < res.total);

        setPage((prev) => prev + 1);
      } finally {
        isLoadingMore = false;
      }
    }
  }, [groupQuery, hasMore, page]);

  return (
    <>
      {uniqueSortedGroups?.length > 0 || pinnedGroups?.length > 0 || archivedGroups?.length > 0 ? (
        <div className='relative max-h-[calc(100%-64px)] pb-0'>
          <div className='h-full overflow-y-auto pr-2'>
            <InfiniteScroll
              loadMore={fetchItems}
              hasMore={hasMore}
              isReverse={false}
              pageStart={0}
              loader={
                <div className='loader my-5 text-center' key={0}>
                  Loading ...
                </div>
              }
              threshold={0}
              useWindow={false}
            >
              {isShowArchived ? (
                <>
                  {archivedGroups.map((item) => (
                    <div onClick={() => viewConversation(item.id)} key={item.id}>
                      <ChatItem
                        id={item.id}
                        avatar={item.avatar}
                        title={item.title}
                        lastMessage={item.lastMessage}
                        unreadCount={item.unreadCount}
                        lastMessageTime={item.lastMessageTime}
                        isSelected={chatId === item.id?.toString()}
                        isGroup={item.isGroup}
                        members={item.members}
                        totalMembers={item.totalMembers}
                        pinned={false}
                        isArchived={true}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {!isContactChat && archivedGroups && archivedGroups.length > 0 && (
                    <ArchivedGroups onClick={toggleShowArchived} />
                  )}

                  {!isContactChat &&
                    pinnedGroups.map((item) => (
                      <div onClick={() => viewConversation(item.id)} key={item.id}>
                        <ChatItem
                          id={item.id}
                          avatar={item.avatar}
                          title={item.title}
                          lastMessage={item.lastMessage}
                          unreadCount={item.unreadCount}
                          lastMessageTime={item.lastMessageTime}
                          isSelected={chatId === item.id?.toString()}
                          isGroup={item.isGroup}
                          members={item.members}
                          totalMembers={item.totalMembers}
                          pinned
                          isArchived={false}
                        />
                      </div>
                    ))}

                  {uniqueSortedGroups.map((item) => (
                    <div onClick={() => viewConversation(item.id)} key={item.id}>
                      <ChatItem
                        id={item.id}
                        avatar={item.avatar}
                        title={item.title}
                        lastMessage={item.lastMessage}
                        unreadCount={item.unreadCount}
                        lastMessageTime={item.lastMessageTime}
                        isSelected={chatId === item.id?.toString()}
                        isGroup={item.isGroup}
                        members={item.members}
                        totalMembers={item.totalMembers}
                        pinned={false}
                        isArchived={false}
                      />
                    </div>
                  ))}
                </>
              )}
            </InfiniteScroll>
          </div>
        </div>
      ) : (
        <EmptyFriendList />
      )}
    </>
  );
}
