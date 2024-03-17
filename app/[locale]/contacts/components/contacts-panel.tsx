import ChatList from '@/components/chat-panel/chat-list';
import ChatPanelHeader from '@/components/chat-panel/chat-panel-header';
import SearchInput from '@/components/search-input';
import ChatListSkeleton from '@/components/skeleton/chat-list-skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGroupsContext } from '@/context/groups-context';
import { useGetGroups } from '@/hooks/useGroupChat';
import { GROUP_PAGE_SIZE } from '@/lib/consts';
import { SortOrder } from '@/types/common';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';

export enum ContactTabs {
  PERSON = 'Dou',
  GROUP = 'Group',
}

export default function ContactsPanel() {
  const t = useTranslations();
  const {
    setGroups,
    selectedContactTab: selectedTab,
    setSelectedContactTab: setSelectedTab,
    chatList,
    setKeyword,
    keyword,
  } = useGroupsContext();

  const friendQuery = {
    keyword: ContactTabs.PERSON,
    searchBy: 'type',
    sortBy: 'updatedAt',
    sortOrder: SortOrder.DESC,
    isGetAll: false,
    limit: GROUP_PAGE_SIZE,
  };

  const { data: douGroups, isLoading: isLoadingDouGroup } = useGetGroups({
    ...friendQuery,
    page: 1,
  });

  const teamQuery = {
    andKeyword: ContactTabs.GROUP,
    searchAndBy: 'type',
    sortBy: 'updatedAt',
    sortOrder: SortOrder.DESC,
    isGetAll: false,
    limit: GROUP_PAGE_SIZE,
  };

  const { data: teamGroups, isLoading: isLoadingTeamGroup } = useGetGroups({
    ...teamQuery,
    page: 1,
  });

  const isLoading = useMemo(() => {
    return isLoadingDouGroup || isLoadingTeamGroup;
  }, [isLoadingTeamGroup, isLoadingDouGroup]);

  const groups = useMemo(() => {
    if (selectedTab === ContactTabs.PERSON) {
      return douGroups?.items || [];
    } else {
      return teamGroups?.items || [];
    }
  }, [douGroups?.items, selectedTab, teamGroups?.items]);

  useEffect(() => {
    setGroups(groups || []);
  }, [groups]);

  useEffect(() => {
    setKeyword('');
  }, [selectedTab]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const hasMore = useMemo(() => {
    if (selectedTab === ContactTabs.PERSON) {
      return !!douGroups && GROUP_PAGE_SIZE < douGroups?.total;
    } else {
      return !!teamGroups && GROUP_PAGE_SIZE < teamGroups?.total;
    }
  }, [douGroups, selectedTab, teamGroups]);

  return (
    <div className='z-30 flex h-full w-[349px] flex-col border-r border-black/10 bg-white dark:border-black dark:bg-[#333]'>
      <ChatPanelHeader title={t('CONTACT.TITLE')} />

      <div className='flex flex-1 flex-col px-0 pt-4'>
        <Tabs defaultValue={ContactTabs.PERSON} className='flex h-full w-full flex-col'>
          <TabsList className='ml-2 mr-2 h-[40px] bg-transparent'>
            <TabsTrigger
              className='flex-1'
              value={ContactTabs.PERSON}
              onClick={() => setSelectedTab(ContactTabs.PERSON)}
            >
              {t('CONTACT.FRIEND_LIST')}
            </TabsTrigger>
            <TabsTrigger
              className='flex-1'
              value={ContactTabs.GROUP}
              onClick={() => setSelectedTab(ContactTabs.GROUP)}
            >
              {t('CONTACT.GROUP_LIST')}
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
                  <ChatList
                    groupQuery={selectedTab === ContactTabs.PERSON ? friendQuery : teamQuery}
                    hasMoreInitial={hasMore}
                  />
                )}
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
