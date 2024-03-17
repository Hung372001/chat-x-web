import ContactIcon from '@/components/icons/contact-icon';
import MessageIcon from '@/components/icons/message-icon';
import UserAltIcon from '@/components/icons/user-alt-icon';
import { usePersonalModal } from '@/components/modals/personal-modal';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const useRoutes = () => {
  const pathname = usePathname();
  const { theme } = useTheme();

  const { onOpen, open } = usePersonalModal();

  const isContactPath = useMemo(() => {
    const contactPaths = ['/contacts/chat', '/vi/contacts/chat', '/en/contacts/chat'];
    return contactPaths.some((pattern) => pathname?.startsWith(pattern));
  }, [pathname]);

  const isChatPath = useMemo(() => {
    const chatPaths = ['/chat', '/vi/chat', '/en/chat'];
    return chatPaths.some((pattern) => pathname?.startsWith(pattern));
  }, [pathname]);

  const routes = useMemo(
    () => [
      {
        label: 'Contacts',
        href: '/contacts/chat',
        icon: <ContactIcon fill='transparent' stroke='#8A9AA9' />,
        activeIcon: <ContactIcon fill='#2FACE1' stroke={theme === 'dark' ? '#031B27' : '#fff'} />,
        active: !open && isContactPath,
      },
      {
        label: 'Conversations',
        href: '/chat',
        icon: <MessageIcon fill='transparent' stroke='#8A9AA9' />,
        activeIcon: <MessageIcon fill='#2FACE1' stroke='#fff' strokeWidth={0} />,
        active: !open && isChatPath,
      },
      {
        label: 'Profile',
        href: '#',
        icon: <UserAltIcon fill='transparent' stroke='#8A9AA9' />,
        activeIcon: <UserAltIcon fill='#2FACE1' stroke='#2FACE1' />,
        active: open,
        onClick: onOpen,
      },
    ],
    [theme, open, isContactPath, isChatPath, onOpen]
  );

  return routes;
};

export default useRoutes;
