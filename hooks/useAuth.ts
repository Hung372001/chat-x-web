import { ChangePasswordDto, LoginData, SignUpData, changePassword, signUp } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useChangePasswordModal } from '@/components/modals/change-password-modal';
import { wait } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export const useSignUp = () => {
  const [error, setError] = useState<string | null>(null);
  const { handleSubmit: login } = useLogin();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      setError(null);
      await signUp(data);
      await login({
        password: data.password,
        email: data.email,
        phoneNumber: data.phoneNumber,
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      await wait(1000);
      setIsLoading(false);
    }
  };

  return { handleSubmit, error, isLoading };
};

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations();

  const handleSubmit = async (formData: LoginData) => {
    setIsLoading(true);
    setError(null);

    signIn('credentials', {
      ...formData,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          setError(t('AUTH.INVALID_CRENDENTIALS'));
          setIsLoading(false);
        }

        if (callback?.ok) {
          toast.success(t('WELCOME'));
          router.push('/chat');
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  return { handleSubmit, error, isLoading };
};

export const useChangePassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onClose } = useChangePasswordModal();
  const t = useTranslations();

  const handleSubmit = async (data: ChangePasswordDto) => {
    setIsLoading(true);
    try {
      setError(null);
      await changePassword(data);
      toast.success(t('AUTH.CHANGE_PASSWORD_SUCCESS'));
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, error, isLoading };
};
