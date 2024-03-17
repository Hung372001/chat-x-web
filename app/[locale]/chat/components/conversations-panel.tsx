import ChatList from '@/components/chat-panel/chat-list';
import ChatPanelHeader from '@/components/chat-panel/chat-panel-header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useMemo } from 'react';
import SearchInput from '@/components/search-input';
import { SortOrder } from '@/types/common';
import { useGetGroups } from '@/hooks/useGroupChat';
import { useGroupsContext } from '@/context/groups-context';
import ChatListSkeleton from '@/components/skeleton/chat-list-skeleton';
import { useTranslations } from 'next-intl';
import { GROUP_PAGE_SIZE } from '@/lib/consts';

export enum MessageType {
  ALL = 'all',
  UNREAD = 'unread',
}

export default function ConversationPanel() {
  const t = useTranslations();
  const groupQuery = {
    keyword: '',
    sortBy: 'updatedAt',
    sortOrder: SortOrder.DESC,
    isGetAll: false,
    limit: GROUP_PAGE_SIZE,
  };

  const { data: groups, isLoading } = useGetGroups({ ...groupQuery, page: 1 });
  const { keyword, setKeyword, setGroups, selectedMessageTab, setSelectedMessageTab, chatList } =
    useGroupsContext();

  useEffect(() => {
    setGroups(groups?.items || []);
  }, [groups]);

  useEffect(() => {
    setKeyword('');
  }, [selectedMessageTab]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const hasMore = useMemo(() => !!groups && GROUP_PAGE_SIZE < groups?.total, [groups]);

  return (
    <div className='z-30 flex h-full w-[349px] flex-col border-r border-black/10 bg-white dark:border-black dark:bg-[#333]'>
      <ChatPanelHeader title={t('CONVERSATION.TITLE')} />

      <div className='flex flex-1 flex-col px-0 pt-4'>
        <Tabs
          value={selectedMessageTab}
          defaultValue={MessageType.ALL}
          className='flex h-full w-full flex-col'
        >
          <TabsList className='ml-2 mr-2 h-[40px] bg-transparent'>
            <TabsTrigger
              className='flex-1'
              value={MessageType.ALL}
              onClick={() => setSelectedMessageTab(MessageType.ALL)}
            >
              {t('CONVERSATION.ALL_MESSAGES')}
            </TabsTrigger>
            <TabsTrigger
              className='flex-1'
              value={MessageType.UNREAD}
              onClick={() => setSelectedMessageTab(MessageType.UNREAD)}
            >
              {t('CONVERSATION.UNREAD_MESSAGES')}
            </TabsTrigger>
          </TabsList>
          <div className='mt-2 max-h-[calc(100vh-150px)]'>
            <div className='h-full'>
              <div className='mt-2 flex h-full flex-col'>
                <div className='mb-3 px-4'>
                  {(chatList?.length > 0 ||
                    (isLoading && chatList?.length === 0) ||
                    (!!keyword && chatList?.length === 0)) && (
                    <SearchInput
                      placeholder={t('CONVERSATION.ALL_MESSAGES')}
                      onChange={handleSearch}
                      value={keyword}
                    />
                  )}
                </div>
                {isLoading ? (
                  <ChatListSkeleton />
                ) : (
                  <ChatList groupQuery={groupQuery} hasMoreInitial={hasMore} />
                )}
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
