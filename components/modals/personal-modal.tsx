'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import useModal from '@/hooks/useModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Bio from '../bio';
import GlobalIcon from '../icons/global-icon';
import KeyIcon from '../icons/key-icon';
import MoonIcon from '../icons/moon-icon';
import SpeakerIcon from '../icons/speaker-icon';
import UnlockIcon from '../icons/unlock-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { useChangePasswordModal } from './change-password-modal';
import { signOut } from 'next-auth/react';
import { ProfileFormBody } from './profile-modal';
import { UpdateProfileDto } from '@/types/profile';
import { Gender } from '@/types/user';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDataContext } from '@/context/data-context';
import { useUpdateProfile } from '@/hooks/useProfile';
import Spin from '../ui/spin';
import ThemeSwitch from '../theme-switch';
import { toggleHiding, toggleSoundNotification } from '@/services/user';
import toast from 'react-hot-toast';
import { wait } from '@/lib/utils';
import DynamicAvatar from '../dynamic-avatar';
import { useLocale, useTranslations } from 'next-intl';
import { phoneNumberRegex } from '@/lib/consts';
import { usePathname, useRouter as useRouterIntl } from 'next-intl/client';

function PersonalFormBody({ form, children }: { form: any; children: React.ReactNode }) {
  const t = useTranslations();
  const { onOpen: onOpenChangePasswordModal } = useChangePasswordModal();
  const { currentUser, refreshCurrentUser } = useDataContext();

  const [isHiding, setIsHiding] = useState(false);
  const [isLoadingToggleHiding, setIsLoadingToggleHiding] = useState(false);

  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isLoadingToggleSound, setIsLoadingToggleSound] = useState(false);

  useEffect(() => {
    setIsHiding(currentUser?.hiding ?? false);
    setIsSoundOn(currentUser?.soundNotification ?? false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.hiding, currentUser?.soundNotification]);

  const handleToggleHiding = async () => {
    setIsLoadingToggleHiding(true);
    await toggleHiding()
      .then(async () => {
        setIsHiding(!isHiding);
        setIsLoadingToggleHiding(false);
        toast.success(t('PROFILE.UPDATE_PROFILE_SUCCESS'));
        await wait(2000);
        refreshCurrentUser();
      })
      .catch((error) => {
        setIsLoadingToggleHiding(false);
        toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
      });
  };

  const handleToggleSound = async () => {
    setIsLoadingToggleSound(true);
    await toggleSoundNotification()
      .then(async () => {
        setIsSoundOn(!isSoundOn);
        setIsLoadingToggleSound(false);
        toast.success(t('PROFILE.UPDATE_PROFILE_SUCCESS'));
        await wait(2000);
        refreshCurrentUser();
      })
      .catch((error) => {
        setIsLoadingToggleSound(false);
        toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
      });
  };

  const router = useRouterIntl();
  const pathname = usePathname();

  const locale = useLocale();

  const switchLanguage = (value: string) => {
    router.push(pathname, { locale: value });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className='flex flex-wrap py-4'>
      <div className='flex flex-1 flex-col gap-6 border-r-2 px-11 py-5'>{children}</div>
      <div className='flex flex-1 flex-col px-11 py-5'>
        <FormField
          control={form.control}
          name='allow_people_see_my_profile'
          render={() => (
            <FormItem className='flex flex-row items-center justify-between border-b border-[#8A9AA9]/[0.3] py-3'>
              <div className='flex items-center'>
                <UnlockIcon />
                <FormLabel className='ml-2 font-normal text-[#292941] dark:text-white'>
                  {t('ALLOW_PEOPLE_SEE_MY_PROFILE')}
                </FormLabel>
              </div>
              <FormControl>
                <Switch
                  disabled={isLoadingToggleHiding}
                  className='!mt-0'
                  checked={!isHiding}
                  onCheckedChange={handleToggleHiding}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='dark_mode'
          render={() => (
            <FormItem className='flex flex-row items-center justify-between border-b border-[#8A9AA9]/[0.3] py-3'>
              <div className='flex items-center'>
                <MoonIcon />
                <FormLabel className='ml-2 font-normal text-[#292941] dark:text-white'>
                  {t('DARK_MODE')}
                </FormLabel>
              </div>
              <FormControl>
                <ThemeSwitch />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='sound'
          render={() => (
            <FormItem className='flex flex-row items-center justify-between border-b border-[#8A9AA9]/[0.3] py-3'>
              <div className='flex items-center'>
                <SpeakerIcon />
                <FormLabel className='ml-2 font-normal text-[#292941] dark:text-white'>
                  {t('SOUND')}
                </FormLabel>
              </div>
              <FormControl>
                <Switch
                  disabled={isLoadingToggleSound}
                  className='!mt-0'
                  checked={isSoundOn}
                  onCheckedChange={handleToggleSound}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between border-b border-[#8A9AA9]/[0.3] py-3'>
              <div className='flex items-center'>
                <GlobalIcon />
                <FormLabel className='ml-2 font-normal text-[#292941] dark:text-white'>
                  {t('LANGUAGE')}
                </FormLabel>
              </div>
              <FormControl>
                <Select onValueChange={switchLanguage} defaultValue={locale}>
                  <FormControl>
                    <SelectTrigger className='!m-0 h-[29px] w-[130px] rounded-[9px] bg-[#A2AEBA] text-[12px] text-white dark:text-[#031B27]'>
                      <SelectValue placeholder='Language' />
                      {/* <ArrowDownIcon /> */}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='bg-[#838C94] text-white'>
                    <SelectItem className='text-[12px]' value='vi'>
                      Tiếng Việt
                    </SelectItem>
                    <SelectItem className='text-[12px]' value='en'>
                      English
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <div className=''>
          <Button
            className='group bg-transparent px-0 text-dark-blue hover:bg-transparent dark:text-white'
            onClick={onOpenChangePasswordModal}
            type='button'
          >
            <KeyIcon />
            <div className='ml-2 group-hover:text-[#2FACE1]'>{t('CHANGE_PASSWORD')}</div>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PersonalModal() {
  const t = useTranslations();
  const { open, onClose } = usePersonalModal();

  const profileformSchema = z.object({
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

  const { currentUser } = useDataContext();
  const { update, isLoading } = useUpdateProfile();
  const oldData = useRef<{ username: string; phoneNumber: string; gender: Gender }>({
    username: '',
    phoneNumber: '',
    gender: Gender.MALE,
  });

  const form = useForm<z.infer<typeof profileformSchema>>({
    resolver: zodResolver(profileformSchema),
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

  function onSubmit(values: z.infer<typeof profileformSchema>) {
    const data: UpdateProfileDto = {
      gender: values.gender as Gender,
      phoneNumber: values.phoneNumber,
      username: values.username,
    };
    update(data);
  }

  const handleSignOut = () => {
    signOut()
      .then((callback) => {
        localStorage.removeItem('session');
      })
      .catch((error) => {
        console.log('Logout failed - error:', error);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onCloseModal}>
      <DialogContent className='dark:bg-[#333] sm:max-w-[910px] sm:rounded-[32px]'>
        <DialogHeader>
          <DialogTitle className='mx-auto mb-2 w-[290px] text-center text-[25px] font-bold text-dark-blue dark:text-white'>
            {t('MODALS.PERSONAL')}
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-col items-center'>
          <DynamicAvatar />
          <Bio>{t('WELCOME')}</Bio>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <PersonalFormBody form={form}>
              <ProfileFormBody form={form} />
            </PersonalFormBody>

            <DialogFooter className='flex sm:justify-center'>
              <Button
                onClick={() => handleSignOut()}
                className='h-[48px] w-[168px] rounded-full border-2 border-[#2FACE1] bg-transparent !text-[16px] text-lg font-medium text-dark-blue  transition-all hover:bg-transparent active:bg-[#2FACE1] active:text-white dark:text-white'
                type='button'
              >
                {t('MODALS.SIGN_OUT')}
              </Button>
              <Button
                className='h-[48px] w-[168px] rounded-full bg-gradient-blue !text-[16px] text-lg font-medium text-white shadow-custom-blue transition-all active:bg-none active:opacity-60 active:shadow-none'
                type='submit'
                disabled={!isChanged || isLoading}
              >
                <Spin isLoading={isLoading}>{t('MODALS.SAVE_CHANGES')}</Spin>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function usePersonalModal() {
  const { modals, openModal, closeModal } = useModal();

  return {
    open: modals['personal-modal'] === true,
    onOpen: () => openModal('personal-modal'),
    onClose: () => closeModal('personal-modal'),
  };
}
