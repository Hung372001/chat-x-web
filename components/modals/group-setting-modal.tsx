'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import useModal from '@/hooks/useModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import AddUserIcon from '../icons/add-user-icon';
import UserIcon2 from '../icons/user-icon-2';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import useModifyAdmin from '@/hooks/useModifyAdmin';
import { useDataContext } from '@/context/data-context';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { wait } from '@/lib/utils';
import { clearMessageSequence, toggleAddFriend, toggleGroupType } from '@/services/group-setting';
import { AutoRemoveTime } from '@/types/group-setting';
import ConfirmModal from './confirm-modal';
import { useDeleteGroup, useLeaveGroup } from '@/hooks/useGroupChat';
import Spin from '../ui/spin';
import { useTranslations } from 'next-intl';

const formSchema = z.object({});

function GroupSettingFormBody({ form }: { form: any }) {
  const t = useTranslations();
  const [canAddFriend, setCanAddFriend] = useState(false);
  const [isLoadingCanAddFriend, setIsLoadingCanAddFriend] = useState(false);

  const [autoRemoveTime, setAutoRemoveTime] = useState<AutoRemoveTime>();
  const [isLoadingAutoRemoveTime, setIsLoadingAutoRemoveTime] = useState(false);

  const { theme } = useTheme();
  const { handleOpen: modifyAdmin } = useModifyAdmin();
  const { groupDetail, refreshGroupDetail } = useDataContext();

  useEffect(() => {
    setCanAddFriend(groupDetail?.canAddFriends ?? false);
    setAutoRemoveTime((groupDetail?.clearMessageDuration ?? '0') as AutoRemoveTime);
  }, [groupDetail?.canAddFriends, groupDetail?.clearMessageDuration]);

  const handleToggleAddFriend = async () => {
    if (groupDetail?.id) {
      setIsLoadingCanAddFriend(true);
      await toggleAddFriend(groupDetail?.id)
        .then(async () => {
          setCanAddFriend((prev) => !prev);
          setIsLoadingCanAddFriend(false);
          toast.success(t('GROUP.UPDATE_GROUP_SETTING_SUCCESS'));
          await wait(2000);
          await refreshGroupDetail();
        })
        .catch((error) => {
          setIsLoadingCanAddFriend(false);
          toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
        });
    }
  };
  const handleChangeAutoRemoveTime = async (autoRemoveTime: AutoRemoveTime) => {
    if (groupDetail?.id) {
      setIsLoadingAutoRemoveTime(true);
      await clearMessageSequence(groupDetail?.id, autoRemoveTime)
        .then(async () => {
          setAutoRemoveTime(autoRemoveTime);
          setIsLoadingAutoRemoveTime(false);
          toast.success(t('GROUP.UPDATE_GROUP_SETTING_SUCCESS'));
          await wait(2000);
          await refreshGroupDetail();
        })
        .catch((error) => {
          setIsLoadingAutoRemoveTime(false);
          toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
        });
    }
  };

  return (
    <div className='flex flex-wrap py-4'>
      <div className='flex flex-1 flex-col py-5'>
        <FormField
          control={form.control}
          name='add_friend'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between border-b border-[#8A9AA9]/[0.3] py-4'>
              <div className='flex items-center'>
                <AddUserIcon
                  stroke={theme === 'light' ? '#292941' : 'white'}
                  fill={theme === 'light' ? '#292941' : 'white'}
                />
                <FormLabel className='ml-2 font-normal text-[#292941] dark:text-white'>
                  {t('GROUP.ADD_FRIEND')}
                </FormLabel>
              </div>
              <FormControl>
                <Switch
                  className='!mt-0'
                  checked={canAddFriend}
                  onCheckedChange={handleToggleAddFriend}
                  disabled={isLoadingCanAddFriend}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {(groupDetail?.isOwner || groupDetail?.isAdmin) && (
          <div className='flex flex-row items-center justify-between border-b border-[#8A9AA9]/[0.3] py-4'>
            <div className='flex items-center'>
              <UserIcon2 fill={theme === 'light' ? '#292941' : 'white'} />
              <div className='ml-2 text-[14px] font-normal text-[#292941] dark:text-white'>
                {t('GROUP.ADMIN')}
              </div>
            </div>

            <Button
              className='h-[22px] rounded-full bg-[#2FACE1] px-[10px] text-[12px] font-medium hover:bg-[#2FACE1] active:bg-dark-blue'
              onClick={modifyAdmin}
            >
              {t('GROUP.SHOW_ADMIN')}
            </Button>
          </div>
        )}

        <div className='mt-4'>
          <FormField
            control={form.control}
            name='autoRemoveTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-normal text-[#292941] dark:text-white'>
                  {t('GROUP.AUTO_DELETE_MESSAGE')}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value: string) =>
                      handleChangeAutoRemoveTime(value as unknown as AutoRemoveTime)
                    }
                    defaultValue={autoRemoveTime}
                    disabled={isLoadingAutoRemoveTime}
                    className='flex gap-5'
                  >
                    <FormItem className='flex items-center space-x-1 space-y-0'>
                      <FormControl>
                        <RadioGroupItem value='0' checked={autoRemoveTime === '0'} />
                      </FormControl>
                      <FormLabel className='font-normal'>{t('GROUP.DELETE_TIME.NO')}</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center space-x-1 space-y-0'>
                      <FormControl>
                        <RadioGroupItem value='30' checked={autoRemoveTime === '30'} />
                      </FormControl>
                      <FormLabel className='font-normal'>{t('GROUP.DELETE_TIME.30_MIN')}</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center space-x-1 space-y-0'>
                      <FormControl>
                        <RadioGroupItem value='60' checked={autoRemoveTime === '60'} />
                      </FormControl>
                      <FormLabel className='font-normal'>{t('GROUP.DELETE_TIME.1_HOUR')}</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center space-x-1 space-y-0'>
                      <FormControl>
                        <RadioGroupItem value='120' checked={autoRemoveTime === '120'} />
                      </FormControl>
                      <FormLabel className='font-normal'>{t('GROUP.DELETE_TIME.2_HOUR')}</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export function GroupSettingModal() {
  const t = useTranslations();
  const { open, onClose } = useGroupSettingModal();
  const { groupDetail } = useDataContext();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const { isLoading: isDeleting, handleDelete } = useDeleteGroup();
  const { isLoading: isLeaving, submit: handleLeave } = useLeaveGroup();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const handleDeleteGroup = () => {
    setOpenConfirmModal(true);
  };

  function onConfirm() {
    setOpenConfirmModal(false);
    if (groupDetail?.id) handleDelete(groupDetail?.id);
  }

  const onLeaveGroup = () => {
    if (groupDetail?.id) handleLeave(groupDetail?.id);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className='px-[50px] dark:bg-[#333] sm:max-w-[432px] sm:rounded-[32px]'>
            <DialogHeader>
              <DialogTitle className='mx-auto mb-2 w-[290px] text-center text-[25px] font-bold text-dark-blue dark:text-white'>
                {t('GROUP.SETTING')}
              </DialogTitle>
            </DialogHeader>

            {(groupDetail?.isOwner || groupDetail?.isAdmin) && <GroupSettingFormBody form={form} />}

            <DialogFooter className='flex sm:justify-center'>
              {groupDetail?.isOwner ? (
                <Button
                  className='h-[48px] w-full rounded-full bg-gradient-blue !text-[16px] text-lg font-medium text-white shadow-custom-blue transition-all active:bg-none active:opacity-60 active:shadow-none'
                  type='button'
                  onClick={handleDeleteGroup}
                  disabled={isDeleting}
                >
                  <Spin isLoading={isDeleting}>{t('GROUP.DELETE')}</Spin>
                </Button>
              ) : (
                <Button
                  className='h-[48px] w-full rounded-full bg-gradient-blue !text-[16px] text-lg font-medium text-white shadow-custom-blue transition-all active:bg-none active:opacity-60 active:shadow-none'
                  type='button'
                  onClick={onLeaveGroup}
                  disabled={isLeaving}
                >
                  <Spin isLoading={isLeaving}>{t('GROUP.LEAVE_GROUP')}</Spin>
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ConfirmModal
          open={openConfirmModal}
          onConfirm={onConfirm}
          onClose={() => setOpenConfirmModal(false)}
          message={t('GROUP.DO_YOU_WANT_TO_DELETE_THIS_GROUP')}
        />
      </form>
    </Form>
  );
}

export function useGroupSettingModal() {
  const { modals, openModal, closeModal } = useModal();

  return {
    open: modals['group-setting-modal'] === true,
    onOpen: () => openModal('group-setting-modal'),
    onClose: () => closeModal('group-setting-modal'),
  };
}
