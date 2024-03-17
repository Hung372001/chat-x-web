'use client';

import EmptyState from '@/components/empty-state';
import useChatId from '@/hooks/useChatId';
import clsx from 'clsx';

const Home = () => {
  const { isOpen } = useChatId();

  return (
    <div
      className={clsx(
        'absolute right-0 top-0 z-40 h-screen w-full bg-gray-100 px-6 dark:bg-[#031A26]',
        isOpen ? 'hidden' : 'block'
      )}
    >
      <EmptyState />
    </div>
  );
};

export default Home;
