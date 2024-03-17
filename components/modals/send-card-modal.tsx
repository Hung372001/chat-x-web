'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import SearchInput from '../search-input';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { useDebouncedCallback } from 'use-debounce';
import useModal from '@/hooks/useModal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { UserSearchItem } from '@/types/user';
import { useTranslations } from 'next-intl';
import { UserItem } from './user-list-modal';
import { useGetUsers } from '@/hooks/useUser';
import { SortOrder } from '@/types/common';
import { useSendCard } from '@/hooks/useSendCard';
import { FRIEND_PAGE_SIZE } from '@/lib/consts';

export default function SendCardModal() {
  const t = useTranslations();

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedUserTemp, setSelectedUserTemp] = useState<UserSearchItem[]>([]);

  const { open, onClose } = useSendCardModal();

  const { data, fetch: fetchFriendList, isLoading: isLoadingUsers } = useGetUsers();

  const { sendCard } = useSendCard();

  useEffect(() => {
    if (open) {
      const keyword = '';

      fetchFriendList({
        keyword: `["${keyword}","${keyword}","${keyword}"]`,
        searchBy: `["username","email","phoneNumber"]`,
        sortBy: 'username',
        sortOrder: SortOrder.ASC,
        limit: FRIEND_PAGE_SIZE,
        page: 1,
        isGetAll: true,
      });
    }
  }, [open]);

  const userList = useMemo(() => {
    return (
      data?.items
        ?.filter((item) => item.isFriend) // only friends allow when create group
        .map((item) => ({
          id: item.id,
          username: item.nickname || item.username || 'Unknown',
          avatar: item.profile?.avatar || '',
        })) || []
    );
  }, [data]);

  const handleSearch = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    fetchFriendList({
      keyword: `["${keyword}","${keyword}","${keyword}"]`,
      searchBy: `["username","email","phoneNumber"]`,
      sortBy: 'username',
      sortOrder: SortOrder.ASC,
      limit: FRIEND_PAGE_SIZE,
      page: 1,
      isGetAll: true,
    });
  }, 1000);

  const onToggleItem = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds((prev) => prev.filter((item) => item !== id));
      setSelectedUserTemp((prev) => prev.filter((item) => item.id !== id));
    } else {
      setSelectedUserIds((prev) => [...prev, id]);
      const newSelectedUser = userList.find((item) => item.id === id);
      if (newSelectedUser) setSelectedUserTemp((prev) => [...prev, newSelectedUser]);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedUserIds([]);
    setSelectedUserTemp([]);
  };

  const handleSubmit = useCallback(() => {
    const selectedUsers = data?.items.filter((x) => selectedUserIds.includes(x.id)) || [];
    const simplifiedUsers = selectedUsers.map((x) => ({
      id: x.id,
      username: x.nickname || x.username || 'Unknown',
      avatar: x.profile?.avatar || '',
      phoneNumber: x.phoneNumber || '',
      email: x.email || '',
    }));
    sendCard(simplifiedUsers);

    handleClose();
  }, [data?.items, selectedUserIds]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='px-[50px] dark:bg-[#333] sm:max-w-[432px] sm:rounded-[32px]'>
        <DialogHeader>
          <DialogTitle className='mx-auto mb-3 w-[290px] text-center text-[25px] font-bold text-dark-blue dark:text-white'>
            {t('MODALS.SELECT_NAME_CARD')}
          </DialogTitle>
        </DialogHeader>
        <SearchInput placeholder={t('USER_NAME')} onChange={handleSearch} />

        <ScrollArea className='h-[400px] translate-x-2 pr-4'>
          {selectedUserTemp.length > 0 &&
            selectedUserTemp
              .filter((item) => !userList.map((x) => x.id).includes(item.id))
              .map((item) => (
                <UserItem
                  key={item.id}
                  avatar={item.avatar}
                  id={item.id}
                  username={item.username}
                  onToggle={onToggleItem}
                  checked={selectedUserIds.includes(item.id)}
                />
              ))}

          {userList.map((item) => (
            <UserItem
              key={item.id}
              avatar={item.avatar}
              id={item.id}
              username={item.username}
              onToggle={onToggleItem}
              checked={selectedUserIds.includes(item.id)}
            />
          ))}

          {isLoadingUsers && (
            <div className='flex h-full w-full items-center justify-center py-5'>
              <div className='loader' />
              Loading...
            </div>
          )}
        </ScrollArea>

        <DialogFooter className='flex sm:justify-center'>
          <Button
            onClick={handleClose}
            className='h-[48px] w-[152px] rounded-full border-2 border-[#2FACE1] bg-transparent !text-[16px] text-lg font-medium text-dark-blue  transition-all hover:bg-transparent active:bg-[#2FACE1] active:text-white dark:text-white'
            type='button'
          >
            {t('MODALS.CANCEL')}
          </Button>
          <Button
            className='!ml-4 h-[48px] min-w-[152px] rounded-full bg-gradient-blue !text-[16px] text-lg font-medium text-white shadow-custom-blue transition-all active:bg-none active:opacity-60 active:shadow-none'
            type='button'
            disabled={selectedUserIds.length === 0}
            onClick={handleSubmit}
          >
            {t('SEND')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useSendCardModal() {
  const { modals, openModal, closeModal } = useModal();

  return {
    open: modals['send-card-modal'] === true,
    onOpen: () => openModal('send-card-modal'),
    onClose: () => closeModal('send-card-modal'),
  };
}
