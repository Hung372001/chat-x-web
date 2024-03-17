import clsx from 'clsx';
import React from 'react';
import DownloadIcon from './icons/download-icon';
import { useTranslations } from 'next-intl';

export default function ArchivedGroups({ onClick }: { onClick: () => void }) {
  const t = useTranslations();

  return (
    <div className='relative pl-2' onClick={onClick}>
      <div
        className={clsx(
          'group flex min-h-[80px] w-full cursor-pointer justify-between rounded-[15px] p-[15px] hover:bg-[#E6E6E6]'
        )}
      >
        <div className='flex items-center'>
          <div className='flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#2FACE1]'>
            <DownloadIcon size={35} />
          </div>

          <div className={clsx('ml-[10px] w-[130px] pt-1')}>
            <p className={clsx('mb-1 text-[15px] font-bold group-hover:text-dark-blue')}>
              {t('CONVERSATION.ARCHIVED')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
