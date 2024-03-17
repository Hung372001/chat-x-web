'use client';

import useRoutes from '@/hooks/useRoutes';
import { useProfileModal } from './modals/profile-modal';
import SidebarItem from './sidebar-item';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useEffect, useState } from 'react';
import { useDataContext } from '@/context/data-context';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

function Sidebar({ children }: { children: React.ReactNode }) {
  const routes = useRoutes();
  const { onOpen } = useProfileModal();
  const pathname = usePathname();

  const pubicPaths = [
    '/sign-in',
    '/vi/sign-in',
    '/en/sign-in',
    '/sign-up',
    '/en/sign-up',
    '/vi/sign-up',
  ];

  const isPublicPath = pubicPaths.some((pattern) => pathname?.startsWith(pattern));

  const [avatar, setAvatar] = useState('');
  const { currentUser, isCurrentUserLoaded, isLoadingCurrentUser } = useDataContext();

  useEffect(() => {
    if (currentUser?.profile?.avatar) {
      setAvatar(currentUser.profile.avatar);
    } else if (isCurrentUserLoaded) {
      setAvatar('/images/default-avatar.png');
    }
  }, [currentUser?.profile?.avatar, isCurrentUserLoaded]);

  return (
    <div className='h-full'>
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex flex-col overflow-y-auto border-r-[1px] bg-white px-4 shadow-custom-2 dark:bg-[#031A26]',
          isPublicPath && 'hidden'
        )}
      >
        <nav className='mt-4 flex flex-col items-center justify-between gap-12'>
          <div className='cursor-pointer transition hover:opacity-75'>
            {isLoadingCurrentUser ? (
              <Skeleton className='h-14 w-14 rounded-full' />
            ) : (
              <Avatar className='h-14 w-14 bg-gray-200' onClick={onOpen}>
                <AvatarImage src={avatar} />
              </Avatar>
            )}
          </div>
          <ul role='list' className='flex flex-col items-center space-y-1'>
            {routes.map((item) => (
              <SidebarItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                activeIcon={item.activeIcon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
      </div>
      <div className='h-full'>{children}</div>
    </div>
  );
}

export default Sidebar;
