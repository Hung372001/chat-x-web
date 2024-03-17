'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import SearchInput from '../search-input';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { useDebouncedCallback } from 'use-debounce';
import { useSelectedUsersContext } from '@/context/selected-users-context';
import useModal from '@/hooks/useModal';
import { useEffect, useState } from 'react';
import { UserSearchItem } from '@/types/user';
import { useTranslations } from 'next-intl';

export function UserItem({
  avatar,
  username,
  id,
  onToggle,
  checked,
  disabled = false,
}: {
  avatar: string;
  username: string;
  id: string;
  onToggle: (id: string) => void;
  checked: boolean;
  disabled?: boolean;
}) {
  return (
    <div className='flex items-center py-4'>
      <Avatar className='h-[50px] w-[50px] bg-gray-200'>
        <AvatarImage src={avatar || '/images/default-avatar.png'} />
      </Avatar>
      <div className='ml-[10px] max-w-[200px] break-words text-[15px] font-bold'>{username}</div>
      <div className='ml-auto'>
        <Checkbox
          className='h-[22px] w-[22px] rounded-full border-[1.5px] border-[#8A9AA9] data-[state=checked]:border-[#2FACE1] data-[state=checked]:bg-[#2FACE1]'
          onCheckedChange={(checked) => {
            onToggle(id);
          }}
          checked={checked}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default function UserListModal({ disabled }: { disabled: boolean }) {
  const {
    modalTitle,
    submitButtonText,
    setKeyword,
    userList,
    onSubmit,
    isLoading,
    selectedUserIds: currentSelectedUserIds,
  } = useSelectedUsersContext();

  const t = useTranslations();

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedUserTemp, setSelectedUserTemp] = useState<UserSearchItem[]>([]);

  useEffect(() => {
    setSelectedUserIds(currentSelectedUserIds);
    setSelectedUserTemp([...userList.filter((item) => currentSelectedUserIds.includes(item.id))]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelectedUserIds]);

  const { open, onClose } = useUserListModal();

  const handleSearch = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (setKeyword) {
      setKeyword(e.target.value);
    }
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
    setKeyword('');
    onSubmit([]);
    setSelectedUserIds(currentSelectedUserIds); // reset selected user ids
    setSelectedUserTemp([]);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(selectedUserIds);
      setSelectedUserTemp([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='px-[50px] dark:bg-[#333] sm:max-w-[432px] sm:rounded-[32px]'>
        <DialogHeader>
          <DialogTitle className='mx-auto mb-3 w-[290px] text-center text-[25px] font-bold text-dark-blue dark:text-white'>
            {modalTitle}
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
                  disabled={disabled}
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
              disabled={disabled}
            />
          ))}
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
            disabled={selectedUserIds.length === 0 || isLoading || disabled}
            onClick={handleSubmit}
          >
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useUserListModal() {
  const { modals, openModal, closeModal } = useModal();

  return {
    open: modals['user-list-modal'] === true,
    onOpen: () => openModal('user-list-modal'),
    onClose: () => closeModal('user-list-modal'),
  };
}
