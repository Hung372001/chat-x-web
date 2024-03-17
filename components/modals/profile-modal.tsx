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
import { Input } from '@/components/ui/input';
import useModal from '@/hooks/useModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Bio from '../bio';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useDataContext } from '@/context/data-context';
import { Gender, User } from '@/types/user';
import { useEffect, useMemo, useRef, useState } from 'react';
import { phoneNumberRegex } from '@/lib/consts';
import { useUpdateProfile } from '@/hooks/useProfile';
import { UpdateProfileDto } from '@/types/profile';
import Spin from '../ui/spin';
import DynamicAvatar from '../dynamic-avatar';
import CopyIcon from '../icons/copy-icon';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export function ProfileFormBody({ form }: { form: any }) {
  const t = useTranslations();

  const handleCopyClick = () => {
    const content = form.getValues('phoneNumber');
    if (content === '' || !content) return;
    navigator.clipboard.writeText(content);
    toast.success('Copied: ' + content);
  };

  return (
    <div className='flex flex-1 flex-col gap-6'>
      <FormField
        control={form.control}
        name='username'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='font-normal text-[#292941] dark:text-white'>
              {t('AUTH.DISPLAY_NAME')}
              <span className='ml-1 text-[#2FACE1]'>*</span>
            </FormLabel>
            <FormControl>
              <Input
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
        name='phoneNumber'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='font-normal text-[#292941] dark:text-white'>
              {t('PHONE_NUMBER')}
              <span className='ml-1 text-[#2FACE1]'>*</span>
            </FormLabel>
            <FormControl>
              <div className='relative h-[45px]'>
                <Input
                  type='phone'
                  className='absolute inset-0 h-[45px] w-full rounded-[10px] bg-white dark:bg-white/[0.3]'
                  placeholder=''
                  {...field}
                />
                <div className='absolute right-3 top-3 cursor-pointer' onClick={handleCopyClick}>
                  <CopyIcon />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='gender'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='font-normal text-[#292941] dark:text-white'>
              {t('GENDER')}
              <span className='ml-1 text-[#2FACE1]'>*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className='flex gap-10'
              >
                <FormItem className='flex items-center space-x-3 space-y-0'>
                  <FormControl>
                    <RadioGroupItem value={Gender.FEMALE} />
                  </FormControl>
                  <FormLabel className='font-normal'>{t('FEMALE')}</FormLabel>
                </FormItem>
                <FormItem className='flex items-center space-x-3 space-y-0'>
                  <FormControl>
                    <RadioGroupItem value={Gender.MALE} />
                  </FormControl>
                  <FormLabel className='font-normal'>{t('MALE')}</FormLabel>
                </FormItem>
                <FormItem className='flex items-center space-x-3 space-y-0'>
                  <FormControl>
                    <RadioGroupItem value={Gender.OTHER} />
                  </FormControl>
                  <FormLabel className='font-normal'>{t('OTHER')}</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export function ProfileModal() {
  const t = useTranslations();
  const { open, onClose } = useProfileModal();
  const { currentUser } = useDataContext();
  const { update, isLoading } = useUpdateProfile();
  const oldData = useRef<{ username: string; phoneNumber: string; gender: Gender }>({
    username: '',
    phoneNumber: '',
    gender: Gender.MALE,
  });

  const formSchema = z.object({
    username: z.string().min(0, {
      message: t('PROFILE.INVALID_NAME'),
    }),
    phoneNumber: z
      .string()
      .min(0, {
        message: t('PROFILE.INVALID_PHONE_NUMBER'),
      })
      .refine((value) => phoneNumberRegex.test(value), {
        message: t('PROFILE.INVALID_PHONE_NUMBER'),
      }),
    gender: z.string().min(0, {
      message: 'Gender number is required.',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      phoneNumber: '',
      gender: '',
    },
  });
  const { reset, watch } = form;

  const currentData = watch();

  const isChanged = useMemo(
    () =>
      currentData.username !== oldData.current.username ||
      currentData.phoneNumber !== oldData.current.phoneNumber ||
      currentData.gender !== oldData.current.gender,
    [currentData]
  );

  useEffect(() => {
    if (currentUser) {
      oldData.current = {
        username: currentUser?.username ?? '',
        phoneNumber: currentUser?.phoneNumber ?? '',
        gender: currentUser?.profile?.gender ?? Gender.MALE,
      };
    }

    reset(oldData.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.phoneNumber, currentUser?.username, currentUser?.profile?.gender, reset]);

  const onCloseModal = () => {
    onClose();
    reset(oldData.current);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data: UpdateProfileDto = {
      gender: values.gender as Gender,
      phoneNumber: values.phoneNumber,
      username: values.username,
    };
    update(data);
  }

  return (
    <Dialog open={open} onOpenChange={onCloseModal}>
      <DialogContent className='px-[50px] dark:bg-[#333] sm:max-w-[432px] sm:rounded-[32px]'>
        <DialogHeader>
          <DialogTitle className='mx-auto mb-2 w-[290px] text-center text-[25px] font-bold text-dark-blue dark:text-white'>
            {t('MODALS.PROFILE')}
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-col items-center'>
          <DynamicAvatar />
          <Bio>{t('WELCOME')}</Bio>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='py-9'>
              <ProfileFormBody form={form} />
            </div>

            <DialogFooter className='flex sm:justify-center'>
              <Button
                className='h-[48px] w-full rounded-full bg-gradient-blue !text-[16px] text-lg font-medium text-white shadow-custom-blue transition-all active:bg-none active:opacity-60 active:shadow-none'
                type='submit'
                disabled={!isChanged || isLoading}
              >
                <Spin isLoading={isLoading}>{t('UPDATE_PROFILE')}</Spin>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function useProfileModal() {
  const { modals, openModal, closeModal } = useModal();

  return {
    open: modals['profile-modal'] === true,
    onOpen: () => openModal('profile-modal'),
    onClose: () => closeModal('profile-modal'),
  };
}
