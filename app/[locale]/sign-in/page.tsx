'use client';

import EmailIcon from '@/components/icons/email-icon';
import LockIcon from '@/components/icons/lock-icon';
import RememberMe from '@/components/remember-me';
import { useLogin } from '@/hooks/useAuth';
import { isEmail } from '@/lib/utils';
import { LoginData } from '@/services/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Spin from '@/components/ui/spin';
import { useTranslations } from 'next-intl';

export default function SignIn() {
  const session = useSession();
  const router = useRouter();
  const { handleSubmit: handleLogin, error, isLoading } = useLogin();
  const t = useTranslations();

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/chat');
    }
  }, [session?.status, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const formData = {
      username: fd.get('username') as string,
      password: fd.get('password') as string,
    };

    const data: LoginData = {
      email: isEmail(formData.username.trim()) ? formData.username.trim() : '',
      phoneNumber: !isEmail(formData.username.trim()) ? formData.username.trim() : '',
      password: formData.password,
    };

    handleLogin(data);
  };

  return (
    <div className='flex flex-col items-center pb-10 pt-8'>
      <Image src='/images/logo.svg' alt='logo' width={100.125} height={108} />
      <h1 className='mb-[70px] mt-[52px] text-[35px] font-bold uppercase text-dark-blue dark:text-white'>
        {t('WELCOME')}
      </h1>
      <form onSubmit={handleSubmit} className='w-[min(95%,586px)]'>
        <div className='flex flex-col gap-[33.75px]'>
          <div className='flex flex-col'>
            <label htmlFor='username' className='text-dark-blue dark:text-white'>
              {t('AUTH.USERNAME')}
            </label>
            <div className='relative flex items-center'>
              <span className='absolute left-3 top-4'>
                <EmailIcon />
              </span>
              <input
                className='mui-input mt-1 h-[51px] w-full rounded-[11.25px] bg-white px-5 pl-[3rem] shadow-custom-1 outline-gray-600 dark:bg-[#5F5F5F]'
                required
                id='username'
                name='username'
                autoComplete='username'
                autoFocus
                type='text'
              />
            </div>
          </div>

          <div className='flex flex-col'>
            <label htmlFor='password' className='text-dark-blue dark:text-white'>
              {t('AUTH.PASSWORD')}
            </label>
            <div className='relative flex items-center'>
              <span className='absolute left-3 top-4'>
                <LockIcon />
              </span>
              <input
                className='mui-input mt-1 h-[51px] w-full rounded-[11.25px] bg-white px-5 pl-[3rem] shadow-custom-1 outline-gray-600 dark:bg-[#5F5F5F]'
                required
                name='password'
                type='password'
                id='password'
                autoComplete='current-password'
              />
            </div>
          </div>
          <div className='flex justify-between'>
            <RememberMe label={t('AUTH.REMEMBER_ME')} />
            <Link
              href='#'
              className='text-sm font-medium italic text-[#8A9AA9] underline hover:text-gray-950 dark:text-[#AFBAC5]'
            >
              {t('AUTH.FORGOT_PASSWORD')}
            </Link>
          </div>
        </div>

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

        <div className='mt-20 flex flex-col items-center gap-9'>
          <button
            className='h-[54px] w-[346.5px] rounded-full bg-gradient-blue text-lg font-medium text-white shadow-custom-blue transition-all hover:scale-105 active:scale-100 disabled:opacity-60'
            type='submit'
            disabled={isLoading}
          >
            <Spin isLoading={isLoading}>{t('AUTH.SIGN_IN')}</Spin>
          </button>

          <span className='text-[#8A9AA9] dark:text-[#AFBAC5]'>
            {t('AUTH.DONT_HAVE_ACCOUNT')}{' '}
            <Link href='/sign-up' className='italic text-dark-blue underline dark:text-white'>
              {t('AUTH.SIGN_UP')}
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
