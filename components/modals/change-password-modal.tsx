'use client';

import useModal from '@/hooks/useModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useChangePassword } from '@/hooks/useAuth';
import Spin from '../ui/spin';
import { useTranslations } from 'next-intl';

export default function ChangePasswordModal() {
  const t = useTranslations();
  const { open, onClose } = useChangePasswordModal();
  const { handleSubmit: handleSignUp, isLoading, error } = useChangePassword();

  const formSchema = z
  .object({
    oldPassword: z.string().min(6, {
      message: t('AUTH.PASSWORD_LENGTH_INVALID'),
    }),
    newPassword: z.string().min(6, {
      message: t('AUTH.PASSWORD_LENGTH_INVALID'),
    }),
    confirmedNewPassword: z.string().min(6, {
      message: t('AUTH.PASSWORD_LENGTH_INVALID'),
    }),
  })
  .refine((data) => data.newPassword === data.confirmedNewPassword, {
    message: t('AUTH.CONFIRM_PASSWORD_INVALID'),
    path: ['confirmedNewPassword'],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmedNewPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleSignUp(values);
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='dark:bg-[#333] sm:max-w-[357px] sm:rounded-[32px]'>
        <DialogHeader>
          <DialogTitle className='mx-auto w-[290px] text-center text-[22px] font-bold text-dark-blue dark:text-white'>
            {t('CHANGE_PASSWORD')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-normal text-[#292941] dark:text-white'>
                    {t('AUTH.OLD_PASSWORD')}
                    <span className='ml-1 text-[#2FACE1]'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      className='h-[45px] rounded-[10px] bg-white dark:bg-white/[0.3]'
                      placeholder=''
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-normal text-[#292941] dark:text-white'>
                    {t('AUTH.NEW_PASSWORD')}
                    <span className='ml-1 text-[#2FACE1]'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      className='h-[45px] rounded-[10px] bg-white dark:bg-white/[0.3]'
                      placeholder=''
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmedNewPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-normal text-[#292941] dark:text-white'>
                    {t('AUTH.PASSWORD_CONFIRM')}
                    <span className='ml-1 text-[#2FACE1]'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      className='h-[45px] rounded-[10px] bg-white dark:bg-white/[0.3]'
                      placeholder=''
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className='mt-10 text-center'>
                {typeof error === 'string' && <p className='text-red-500'>{error}</p>}
                {Array.isArray(error) &&
                  error.map((message, index) => (
                    <p key={index} className='text-red-500'>
                      {message}
                    </p>
                  ))}
              </div>
            )}

            <Button
              className='mt-3 h-[48px] w-full rounded-full bg-gradient-blue !text-[16px] text-lg font-medium text-white shadow-custom-blue transition-all active:bg-none active:opacity-60 active:shadow-none'
              type='submit'
              disabled={isLoading}
            >
              <Spin isLoading={isLoading}>{t('UPDATE_PASSWORD')}</Spin>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function useChangePasswordModal() {
  const { modals, openModal, closeModal } = useModal();

  return {
    open: modals['change-password-modal'] === true,
    onOpen: () => openModal('change-password-modal'),
    onClose: () => closeModal('change-password-modal'),
  };
}
