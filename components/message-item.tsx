/* eslint-disable @next/next/no-img-element */
'use client';

import clsx from 'clsx';
import { BiCheck } from 'react-icons/bi';
import PinIcon from './icons/pin-icon';
import TrashIcon from './icons/trash-icon';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useSocketContext } from '@/context/socket-context';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Linkify from 'linkify-react';
import { PinOff } from 'lucide-react';
import DownloadButton from './download-button';
import { User } from '@/types/chat-message';
import PinIcon2 from './icons/pin-icon-2';
import { isImageUrl, isVideoUrl } from '@/lib/utils';

export type MessageItemProps = {
  isSending?: boolean;
  isMyMessage?: boolean;
  avatar?: string;
  title?: string;
  message?: string;
  sentAt?: string;
  sentAtYYYYMMDD?: string;
  id?: string;
  pinned?: boolean;
  isDeleted?: boolean;
  nameCard?: User;
  imageUrls?: string[];
  documentUrls?: string[];
  onPreview?: (url: string) => void;
};

export default function MessageItem({
  isMyMessage = false,
  isSending = false,
  avatar,
  title,
  message,
  sentAt,
  id,
  pinned,
  isDeleted,
  nameCard,
  imageUrls,
  documentUrls,
  onPreview,
}: MessageItemProps) {
  const { socket } = useSocketContext();

  const onDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (socket && id) {
      socket.emit('onDeleteMessage', id);
    }
  };

  const onPin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (socket && id) {
      socket.emit('onPinMessage', id);
    }
  };

  const onUnpin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (socket && id) {
      socket.emit('onUnpinMessage', id);
    }
  };

  const t = useTranslations();

  const isSpecialMessage = useMemo(() => {
    return (imageUrls && imageUrls?.length > 0) || (documentUrls && documentUrls?.length > 0);
  }, [documentUrls, imageUrls]);

  const mediaUrls = useMemo(() => {
    return [...(imageUrls || []), ...(documentUrls || [])];
  }, [documentUrls, imageUrls]);

  return (
    <div className='flex' id={`message-${id}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild disabled={isDeleted} className={clsx(isDeleted && 'opacity-70')}>
            {!!nameCard ? (
              <div
                className={clsx(
                  'relative my-4 min-w-[180px] max-w-[45%] rounded-[20px]',
                  !isMyMessage
                    ? 'bg-white dark:bg-[#333]'
                    : 'ml-auto bg-[#D6F3FF] dark:bg-[#C2DDE9]'
                )}
              >
                {pinned && (
                  <div className='absolute -right-2 -top-2 rotate-45 scale-[0.8]'>
                    <PinIcon2 />
                  </div>
                )}
                {isDeleted && (
                  <div className='px-[15px] pt-[12px] text-[12px] font-medium text-[#8A9AA9]'>
                    {t('CONVERSATION.DELETED_MESSAGE')}
                  </div>
                )}
                <div className='flex items-center border-b border-[#8A9AA9]/[0.3] p-[15px] pb-2 pt-3'>
                  <div
                    className={clsx(
                      'ml-1 text-[14px] font-bold capitalize',
                      isMyMessage && 'text-dark-blue'
                    )}
                  >
                    {t('MODALS.NAME_CARD')}
                  </div>
                  <div
                    className={clsx(
                      'capitalize-first ml-[15px] mr-[7px] text-[12px]',
                      isMyMessage && 'dark:text-[#8A9AA9]'
                    )}
                  >
                    {sentAt}
                  </div>
                  <span
                    className={clsx(
                      isMyMessage && 'dark:text-[#8A9AA9]',
                      isSending ? 'opacity-0' : 'opacity-100'
                    )}
                  >
                    <BiCheck />
                  </span>
                </div>
                <div className='flex px-[17px] py-[13px]'>
                  <Avatar className='h-11 w-11 bg-gray-200'>
                    <AvatarImage src={nameCard?.profile?.avatar || '/images/default-avatar.png'} />
                  </Avatar>
                  <div className='ml-2'>
                    <div
                      className={clsx(
                        'ml-1 text-[14px] font-bold capitalize',
                        isMyMessage && 'text-dark-blue'
                      )}
                    >
                      {nameCard?.username}
                    </div>
                    <div className='flex flex-wrap'>
                      <div
                        className={clsx(
                          isMyMessage && 'text-[#8A9AA9]',
                          'ml-1 mr-2 max-w-[150px] truncate whitespace-pre-wrap break-words text-[14px] font-medium text-[#8A9AA9]'
                        )}
                      >
                        {nameCard?.phoneNumber || nameCard?.email}
                      </div>
                      <Button className='ml-auto h-[22px] min-w-[75px] rounded-full bg-[#2FACE1] px-[10px] text-[12px] font-medium text-white hover:bg-[#2FACE1] active:bg-dark-blue'>
                        {t('SEND_MESSAGE')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={clsx(
                  'relative my-4 min-w-[180px] max-w-[45%] rounded-[20px] p-[15px] pt-3',
                  !isMyMessage
                    ? 'bg-white dark:bg-[#333]'
                    : 'ml-auto bg-[#D6F3FF] dark:bg-[#C2DDE9]'
                )}
              >
                {pinned && (
                  <div className='absolute -right-2 -top-2 rotate-45 scale-[0.8]'>
                    <PinIcon2 />
                  </div>
                )}
                {isDeleted && (
                  <div className='mb-2 text-[12px] font-medium text-[#8A9AA9]'>
                    {t('CONVERSATION.DELETED_MESSAGE')}
                  </div>
                )}
                <div className='flex items-center'>
                  <Avatar className='h-6 w-6 bg-gray-200'>
                    <AvatarImage src={avatar || '/images/default-avatar.png'} />
                  </Avatar>
                  <div
                    className={clsx(
                      'ml-1 text-[14px] font-bold capitalize',
                      isMyMessage && 'text-dark-blue'
                    )}
                  >
                    {title}
                  </div>
                  <div
                    className={clsx(
                      'capitalize-first ml-[15px] mr-[7px] text-[12px]',
                      isMyMessage && 'dark:text-[#8A9AA9]'
                    )}
                  >
                    {sentAt}
                  </div>
                  <span
                    className={clsx(
                      isMyMessage && 'dark:text-[#8A9AA9]',
                      isSending ? 'opacity-0' : 'opacity-100'
                    )}
                  >
                    <BiCheck />
                  </span>
                </div>
                {isSpecialMessage ? (
                  <div>
                    {mediaUrls.map((url: string) =>
                      isImageUrl(url) ? (
                        <div
                          className={clsx(
                            'group relative flex',
                            isMyMessage ? 'justify-end' : 'justify-start'
                          )}
                          key={url}
                        >
                          <div className='absolute right-1 top-[25px] z-10 hidden group-hover:block'>
                            <DownloadButton url={url} />
                          </div>

                          <img
                            draggable={false}
                            onClick={() => (onPreview ? onPreview(url) : null)}
                            alt={url}
                            className='mt-5 max-h-[200px] min-w-[245px] cursor-pointer rounded-sm object-cover'
                            src={url}
                          />
                        </div>
                      ) : (
                        isVideoUrl(url) && (
                          <div
                            className={clsx(
                              'group relative flex',
                              isMyMessage ? 'justify-end' : 'justify-start'
                            )}
                            key={url}
                          >
                            <div className='absolute right-1 top-[25px] z-10 hidden group-hover:block'>
                              <DownloadButton url={url} />
                            </div>

                            <video
                              className='mt-5 max-h-[300px] w-full cursor-pointer rounded-sm bg-black'
                              controls
                              muted={true}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();

                                const vid = e.target as HTMLVideoElement;
                                vid.pause();

                                onPreview ? onPreview(url) : null;
                              }}
                            >
                              <source src={url} />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )
                      )
                    )}
                  </div>
                ) : (
                  <p
                    className={clsx(
                      isMyMessage && 'dark:text-dark-blue',
                      'message-wrapper mt-[10px] whitespace-pre-wrap break-words text-[14px] font-medium'
                    )}
                  >
                    <Linkify
                      options={{ attributes: { target: '_blank', rel: 'noopener noreferrer' } }}
                    >
                      {message}
                    </Linkify>
                  </p>
                )}
              </div>
            )}
          </TooltipTrigger>
          {!isDeleted && (
            <TooltipContent
              className='border-none bg-transparent shadow-none'
              side={isMyMessage ? 'left' : 'right'}
            >
              <div className='flex gap-1'>
                <Button
                  className='h-9 w-9 rounded-full bg-[#2FACE1] p-0 text-white hover:bg-[#2FACE1] active:opacity-60'
                  onClick={onDelete}
                >
                  <TrashIcon />
                </Button>
                {!pinned ? (
                  <Button
                    className='h-9 w-9 rounded-full bg-[#2FACE1] p-0 text-white hover:bg-[#2FACE1] active:opacity-60'
                    onClick={onPin}
                  >
                    <PinIcon />
                  </Button>
                ) : (
                  <Button
                    className='h-9 w-9 rounded-full bg-[#FF8F8F] p-0 hover:bg-[#FF8F8F] active:opacity-60'
                    onClick={onUnpin}
                  >
                    <PinOff color='white' />
                  </Button>
                )}
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
