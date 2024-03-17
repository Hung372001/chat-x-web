import clsx from 'clsx';
import React from 'react';

export default function OnelineStatus({ online = false }: { online?: boolean }) {
  return (
    <div className='flex items-center gap-2'>
      <div
        className={clsx('h-[10px] w-[10px] rounded-full', online ? 'bg-[#68D391]' : 'bg-gray-500')}
      ></div>
      <span
        className={clsx('text-[12px] font-medium', online ? 'text-[#2FACE1]' : 'text-gray-500')}
      >
        {online ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}
