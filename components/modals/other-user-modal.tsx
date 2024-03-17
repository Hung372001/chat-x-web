'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import useModal from '@/hooks/useModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Avatar, AvatarImage } from '../ui/avatar';
import { useEffect, useMemo, useState } from 'react';
import { useDataContext } from '@/context/data-context';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { useUpdateNickname } from '@/hooks/useUser';
import { useClearHistory } from '@/hooks/useGroupSetting';
import useChatId from '@/hooks/useChatId';
import ConfirmModal from './confirm-modal';
import { useTranslations } from 'next-intl';
import { GroupChatType, Member } from '@/types/group-chat';
import toast from 'react-hot-toast';
import { wait } from '@/lib/utils';
import { toggleMuteNotification, togglePin } from '@/services/group-setting';
import { useGroupsContext } from '@/context/groups-context';

const formSchema = z.object({
  disturb: z.boolean(),
  ontop: z.boolean(),
  nickname: z.string().min(1, { message: 'Please enter a nickname.' }),
});

export function OtherUserModal() {
  const t = useTranslations();
  const { open, onClose } = useOtherUserModal();
  const { groupDetail, currentUser, refreshGroupDetail } = useDataContext();
  const { submit: updateNickname } = useUpdateNickname();
  const { fetch: clearHistory } = useClearHistory();
  const { chatId } = useChatId();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const { togglePin: togglePinLocal } = useGroupsContext();

  const [mute, setMute] = useState(false);
  const [isLoadingMute, setIsLoadingMute] = useState(false);

  const [pinned, setPinned] = useState(false);
  const [isLoadingPin, setIsLoadingPin] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disturb: false,
      ontop: false,
      nickname: '',
    },
  });

  const onHandleClose = () => {
    onClose();
    form.reset();
  };

  const handleDeleteGroup = () => {
    setOpenConfirmModal(true);
  };

  function onConfirm() {
    setOpenConfirmModal(false);
    if (chatId) clearHistory(chatId);
  }

  const selectedUser = useMemo(() => {
    if (groupDetail?.type === GroupChatType.DOU && currentUser?.id) {
      const otherUser = groupDetail.members?.find((user) => user.id !== currentUser.id);
      return otherUser;
    }
    return {} as Member;
  }, [currentUser?.id, groupDetail?.members, groupDetail?.type]);

  const setting = useMemo(() => {
    return groupDetail?.settings?.[0];
  }, [groupDetail?.settings]);

  useEffect(() => {
    form.setValue('nickname', selectedUser?.nickname || '');
  }, [form, selectedUser?.nickname, open]);

  useEffect(() => {
    setMute(setting?.muteNotification || false);
    setPinned(setting?.pinned || false);
  }, [setting?.muteNotification, setting?.pinned]);

  const handleToggleMute = async () => {
    if (groupDetail?.id) {
      setIsLoadingMute(true);
      await toggleMuteNotification(groupDetail?.id)
        .then(async () => {
          setMute((prev) => !prev);
          setIsLoadingMute(false);
          await wait(2000);
          await refreshGroupDetail();
        })
        .catch((error) => {
          setIsLoadingMute(false);
          toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
        });
    }
  };

  const handleTogglePin = async () => {
    if (groupDetail?.id) {
      setIsLoadingPin(true);
      togglePinLocal(groupDetail?.id);
      await togglePin(groupDetail?.id)
        .then(async () => {
          setPinned((prev) => !prev);
          setIsLoadingPin(false);
          await refreshGroupDetail();
        })
        .catch((error) => {
          setIsLoadingPin(false);
          toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
        });
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedUser?.id)
      updateNickname({
        nickname: values.nickname,
        userId: selectedUser?.id,
      });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onHandleClose}>
        <DialogContent className='px-[62px] dark:bg-[#333] sm:max-w-[432px] sm:rounded-[32px]'>
          <div className='mt-5 flex flex-col items-center'>
            <div className='relative'>
              <Avatar className='h-[55px] w-[55px] bg-gray-200'>
                <AvatarImage src={selectedUser?.profile?.avatar || '/images/default-avatar.png'} />
              </Avatar>
            </div>
            <div className='text min-h-7 mt-2 text-center text-[24px] italic text-[#292941] dark:text-white'>
              {selectedUser?.nickname || selectedUser?.username}
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <div className='flex flex-1 flex-col pb-3 pt-5'>
                <FormField
                  control={form.control}
                  name='disturb'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between border-b border-[#8A9AA9]/[0.3] py-3'>
                      <div className='flex items-center'>
                        <FormLabel className='ml-2 font-normal text-[#292941] dark:text-white'>
                          {t('FRIEND_SETTING.DO_NOT_DISTURB')}
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          className='!mt-0'
                          checked={mute}
                          onCheckedChange={handleToggleMute}
                          disabled={isLoadingMute}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='ontop'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between border-b border-[#8A9AA9]/[0.3] py-3'>
                      <div className='flex items-center'>
                        <FormLabel className='ml-2 font-normal text-[#292941] dark:text-white'>
                          {t('FRIEND_SETTING.ON_TOP_MESSAGE')}
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          className='!mt-0'
                          checked={pinned}
                          onCheckedChange={handleTogglePin}
                          disabled={isLoadingPin}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className='flex flex-row items-center justify-between border-b border-[#8A9AA9]/[0.3] py-3'>
                  <span
                    className='ml-2 cursor-pointer text-[14px] hover:text-[#309DCB]'
                    onClick={handleDeleteGroup}
                  >
                    {t('CLEAR_CHAT_HISTORY')}
                  </span>
                </div>

                <div className='mt-2'>
                  <FormField
                    control={form.control}
                    name='nickname'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='ml-2 font-normal text-[#292941] dark:text-white'>
                          {t('ADD_NICK_NAME')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            className='mx-2 h-[45px] rounded-[10px] bg-white dark:bg-white/[0.3]'
                            placeholder='Enter nickname'
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter className='flex sm:justify-center'>
                <Button
                  className='h-[48px] w-full rounded-full bg-gradient-blue !text-[16px] text-lg font-medium text-white shadow-custom-blue transition-all active:bg-none active:opacity-60 active:shadow-none'
                  type='submit'
                >
                  {t('MODALS.SAVE_CHANGES')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ConfirmModal
        open={openConfirmModal}
        onConfirm={onConfirm}
        onClose={() => setOpenConfirmModal(false)}
        message={t('CONVERSATION.DO_YOU_WANT_TO_DELETE_ALL_MESSAGE')}
      />
    </>
  );
}

export function useOtherUserModal() {
  const { modals, openModal, closeModal } = useModal();

  return {
    open: modals['other-user-modal'] === true,
    onOpen: () => openModal('other-user-modal'),
    onClose: () => closeModal('other-user-modal'),
  };
}
