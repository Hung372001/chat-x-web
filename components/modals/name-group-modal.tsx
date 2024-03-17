'use client';

import useModal from '@/hooks/useModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useCreateGroup } from '@/hooks/useGroupChat';
import { GroupChatType } from '@/types/group-chat';
import Spin from '../ui/spin';
import { useDataContext } from '@/context/data-context';
import { useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const formSchema = z.object({
  name: z.string().min(0, {
    message: 'Group name is required.',
  }),
});

export default function NameGroupModal({
  selectedUserIds,
  onSuccess,
}: {
  selectedUserIds: string[];
  onSuccess: () => void;
}) {
  const t = useTranslations();
  const { open, onClose } = useNameGroupModal();
  const { handleSubmit, isLoading, data } = useCreateGroup();
  const { currentUser } = useDataContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      if (currentUser?.id) {
        await handleSubmit({
          name: values.name,
          members: [...selectedUserIds, currentUser?.id],
          type: GroupChatType.GROUP,
        });
        onClose();
        onSuccess();
      }
    },
    [currentUser?.id, handleSubmit, onSuccess, selectedUserIds]
  );

  useEffect(() => {
    if (data?.id) {
      form.reset();
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='dark:bg-[#333] sm:max-w-[370px] sm:rounded-[32px]'>
        <DialogHeader>
          <DialogTitle className='mx-auto w-[290px] text-center text-[22px] font-bold text-dark-blue dark:text-white'>
            {t('NAMING_GROUP')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className='my-5 h-[45px] rounded-[10px] bg-white pl-5 dark:bg-white/[0.3]'
                      placeholder={t('GROUP_NAME')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='flex sm:justify-center'>
              <Button
                onClick={onClose}
                className='h-[48px] w-[152px] rounded-full border-2 border-[#2FACE1] bg-transparent !text-[16px] text-lg font-medium text-dark-blue  transition-all hover:bg-transparent active:bg-[#2FACE1] active:text-white dark:text-white'
                type='button'
              >
                {t('MODALS.CANCEL')}
              </Button>
              <Button
                className='!ml-4 h-[48px] w-[152px] rounded-full bg-gradient-blue !text-[16px] text-lg font-medium text-white shadow-custom-blue transition-all active:bg-none active:opacity-60 active:shadow-none'
                type='submit'
                disabled={isLoading}
              >
                <Spin isLoading={isLoading}>{t('GROUP.CREATE_GROUP')}</Spin>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function useNameGroupModal() {
  const { modals, openModal, closeModal } = useModal();

  return {
    open: modals['name-group-modal'] === true,
    onOpen: () => openModal('name-group-modal'),
    onClose: () => closeModal('name-group-modal'),
  };
}
