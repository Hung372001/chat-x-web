/* eslint-disable @next/next/no-img-element */
'use client';

import HappyFaceIcon from '@/components/icons/happy-face-icon';
import ImageIcon from '@/components/icons/image-icon';
import MessageUserIcon from '@/components/icons/message-user-icon';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataContext } from '@/context/data-context';
import { useSocketContext } from '@/context/socket-context';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Input } from '../ui/input';
import { uploadMulti } from '@/services/upload';
import toast from 'react-hot-toast';
import useChatId from '@/hooks/useChatId';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { GrClose } from 'react-icons/gr';
import { isImageFile, isImageUrl, isVideoFile, isVideoUrl } from '@/lib/utils';
import { BsFileEarmarkPlus } from 'react-icons/bs';
import { GroupChatType } from '@/types/group-chat';
import { SendingMessage } from '@/types/chat-message';
import { useSendCardModal } from '../modals/send-card-modal';

const MAX_ROWS = 10;
const LINE_HEIGHT = 24;

let typingTimeout: NodeJS.Timeout;
let isTyping: boolean = false;

export default function MessageForm() {
  const t = useTranslations();
  const { socket } = useSocketContext();
  const [message, setMessage] = useState('');
  const [textArRows, setTextArRows] = useState(1);
  const {
    groupDetail,
    selectedFiles,
    setSelectedFiles,
    currentUser,
    enqueueSendingMessage,
    currentFriend,
  } = useDataContext();
  const { onOpen: onOpenSendCardModal } = useSendCardModal();
  const { chatId } = useChatId();
  const messageInputRef = useRef<any>(null);

  useEffect(() => {
    if (chatId) {
      // Focus on message input
      const messageInput = messageInputRef.current;
      if (messageInput) {
        messageInput.focus();
      }

      // Reset message
      setMessage('');
      setSelectedFiles(null);
    }
  }, [chatId]);

  const handleKeyDown = useCallback(
    (event: { key: string; shiftKey: any; preventDefault: () => void }) => {
      if (event.key === 'Enter') {
        if (!event.shiftKey) {
          event.preventDefault();

          sendMessage();
        } else if (textArRows <= MAX_ROWS) {
          setTextArRows(textArRows + 1);
        }
      } else {
        if (socket && groupDetail?.id && !isTyping) {
          socket.emit('onTypingStart', groupDetail.id);
          isTyping = true;
        }

        clearTimeout(typingTimeout);

        typingTimeout = setTimeout(() => {
          if (socket && groupDetail?.id) {
            socket.emit('onTypingStop', groupDetail.id);
            isTyping = false;
          }
        }, 500);
      }
    },
    [groupDetail?.id, socket, textArRows, message, selectedFiles]
  );

  const handleInput = () => {
    const textArea = messageInputRef.current;
    textArea.style.height = 'auto'; // Reset the height to auto
    textArea.style.height = textArea.scrollHeight + 2 + 'px'; // Set the height to the scrollHeight
  };

  useEffect(() => {
    if (message === '') {
      setTextArRows(1);
      const textArea = messageInputRef.current;
      textArea.style.height = LINE_HEIGHT + 'px';
    }
  }, [message]);

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setMessage(message + emojiData.emoji);
    document.getElementById('emoji-picker-btn')?.click();
  };

  const addFiles = (e: any) => {
    const selectedFiles: File[] = Array.from(e.target.files);
    setSelectedFiles(selectedFiles);
  };

  const addFile = (e: any) => {
    const selectedFile: File = e.target.files[0];
    setSelectedFiles((prev) => [selectedFile, ...(prev || [])]);
  };

  const handleUploadFiles = (files: File[]) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append('files', file);
    }

    const uploadRequest = uploadMulti(formData).then(async (uploadResponse) => {
      const fileUrls: string[] = uploadResponse.data.map((file: any) => file.url);
      if (socket && groupDetail?.id && fileUrls) {
        const newMessage: SendingMessage = {
          groupId: groupDetail.id,
          imageUrls: fileUrls.filter((url) => isImageUrl(url)),
          documentUrls: fileUrls.filter((url) => isVideoUrl(url)),
        };
        socket.emit('onSendMessage', newMessage);
        enqueueSendingMessage({ ...newMessage, sentAt: new Date().toISOString() });
        setMessage('');
        setSelectedFiles(null);
      }
    });

    toast.promise(uploadRequest, {
      loading: t('CONVERSATION.UPLOADING'),
      success: (data) => {
        return t('CONVERSATION.UPLOAD_SUCCESS');
      },
      error: t('AN_ERROR_OCCURRED'),
    });
  };

  const onInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement;
    element.value = '';
  };

  const removeFile = (filename: string) => {
    const newSelectedFiles = selectedFiles?.filter((file) => file.name !== filename);
    if (newSelectedFiles) setSelectedFiles(newSelectedFiles);
  };

  const sendMessage = useCallback(() => {
    // Text message
    setMessage('');
    if (message !== '') {
      if (socket && groupDetail?.id) {
        const newMessage: SendingMessage = {
          groupId: groupDetail.id,
          message,
        };
        socket.emit('onSendMessage', newMessage);
        enqueueSendingMessage({ ...newMessage, sentAt: new Date().toISOString() });
      }
    }

    // File message
    setSelectedFiles(null);
    if (selectedFiles && selectedFiles.length > 0) {
      handleUploadFiles(selectedFiles);
    }
  }, [groupDetail?.id, message, selectedFiles, socket]);

  useEffect(() => {
    const handlePaste = (e: any) => {
      const clipboardData = e.clipboardData || window.Clipboard;
      const messageInput = messageInputRef.current;
      if (messageInput === e.target) {
        if (clipboardData.items) {
          const hasFiles = Array.from(clipboardData.items).some(
            (item: any) => item.kind === 'file'
          );

          if (hasFiles) {
            const files = Array.from(clipboardData.items)
              .filter((item: any) => item.kind === 'file')
              .map((item: any) => item.getAsFile());

            const imageExtensions = ['.jpg', '.jpeg', '.gif', '.png', '.mpeg-2'];
            const videoExtensions = ['.mp4', '.mov', '.wmv', '.avi', '.flv'];
            const acceptedFiles = files.filter(
              (item) =>
                imageExtensions.some((extension) => item.name.endsWith(extension)) ||
                videoExtensions.some((extension) => item.name.endsWith(extension))
            );

            if (acceptedFiles.length > 0) {
              setSelectedFiles((prev) => [...acceptedFiles, ...(prev || [])]);
              e.preventDefault();
              return;
            }
          }
        }
      }
    };

    const messageInput = messageInputRef.current;
    if (messageInput) {
      messageInput.addEventListener('paste', handlePaste);
    }

    return () => {
      const messageInput = messageInputRef.current;
      if (messageInput) {
        messageInput.removeEventListener('paste', handlePaste);
      }
    };
  }, []);

  const isFriendOrMyGroup = useMemo(() => {
    if (groupDetail?.type === GroupChatType.DOU) {
      return currentFriend?.isFriend;
    }
    return true;
  }, [currentFriend?.isFriend, groupDetail?.type]);

  return (
    <div className='z-30 bg-white p-6 dark:bg-[#333]'>
      <form className='flex items-end gap-6'>
        <div
          className={clsx(
            'group relative my-2 h-[26px] w-9 rounded-md bg-transparent',
            isFriendOrMyGroup ? 'cursor-pointer' : 'cursor-not-allowed'
          )}
          onClick={isFriendOrMyGroup ? onOpenSendCardModal : undefined}
        >
          <span className='invisible absolute left-0 top-0 group-hover:visible'>
            <MessageUserIcon fill='#2FACE1' stroke='#2FACE1' />
          </span>
          <span className='visible absolute  left-0 top-0 group-hover:invisible'>
            <MessageUserIcon fill='#8A9AA9' stroke='#8A9AA9 ' />
          </span>
        </div>

        <div className='relative flex flex-1 items-center'>
          <div
            className={clsx(
              'relative flex flex-1 overflow-hidden rounded-3xl border border-[#E0EEF4] bg-[#E0EEF4]',
              selectedFiles && selectedFiles?.length > 0 && 'pt-[90px]'
            )}
          >
            {!!selectedFiles && selectedFiles?.length > 0 && (
              <div className='absolute inset-0 h-[90px] w-full overflow-x-auto'>
                <div className='inline-flex h-[80px] flex-nowrap pr-4'>
                  <Label className='ml-4 mt-4 flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-lg bg-white text-[25px] text-black hover:bg-gray-300'>
                    <BsFileEarmarkPlus />
                    <Input
                      id='upload-file-chat'
                      className='hidden'
                      type='file'
                      accept='.jpg, .jpeg, .gif, .png, .mp4, .mov, .wmv, .avi, .flv, .mpeg-2'
                      onChange={addFile}
                      onClick={onInputClick}
                    />
                  </Label>
                  {selectedFiles.map((file, index) => (
                    <div className='relative ml-4 mt-4 flex w-[60px]' key={index}>
                      <Button
                        className='absolute -top-2 right-0 z-20 h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white p-0 hover:bg-gray-200 active:bg-gray-300'
                        onClick={() => removeFile(file.name)}
                        type='button'
                      >
                        <GrClose />
                      </Button>
                      {isImageFile(file) && (
                        <img
                          draggable={false}
                          className='h-12 w-12 rounded-lg object-cover'
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                        />
                      )}
                      {isVideoFile(file) && (
                        <video
                          className='h-12 w-12 rounded-lg bg-gray-100 object-cover'
                          src={URL.createObjectURL(file)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Textarea
              ref={messageInputRef}
              id='message-input'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              rows={textArRows}
              className={clsx(
                '!focus-visible:outline-none !focus-visible:shadow-none max-h-[250px] w-full resize-none rounded-3xl border border-[#E0EEF4] bg-[#E0EEF4] p-2 pl-[17px] pr-20 leading-6 text-dark-blue'
              )}
              placeholder={t('CONVERSATION.MESSAGE')}
              disabled={!isFriendOrMyGroup}
            />
          </div>

          <div className='absolute bottom-[5px] right-[17px] flex'>
            <Popover>
              <PopoverTrigger id='emoji-picker-btn'>
                <div className='flex h-8 w-8 items-center justify-center rounded-md bg-transparent p-0 hover:bg-[#2FACE1]/[0.3]'>
                  <HappyFaceIcon stroke='#8A9AA9' />
                </div>
              </PopoverTrigger>
              <PopoverContent side='top' align='end' className='w-full'>
                <EmojiPicker autoFocusSearch={false} onEmojiClick={onEmojiClick} />
              </PopoverContent>
            </Popover>

            <Label className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-[#2FACE1]/[0.3]'>
              <ImageIcon stroke='#8A9AA9' />
              <Input
                id='upload-file-chat-multiple'
                className='hidden'
                type='file'
                accept='.jpg, .jpeg, .gif, .png, .mp4, .mov, .wmv, .avi, .flv, .mpeg-2'
                onChange={addFiles}
                onClick={onInputClick}
                multiple
              />
            </Label>
          </div>
        </div>

        <Button
          onClick={sendMessage}
          type='button'
          disabled={
            (message === '' && (!selectedFiles || selectedFiles.length === 0)) || !isFriendOrMyGroup
          }
          className='h-[42px] w-[42px] rounded-full bg-[#2FACE1] p-0 text-[24px] text-white hover:scale-110 hover:bg-[#2FACE1]'
        >
          <IoPaperPlaneOutline />
        </Button>
      </form>
    </div>
  );
}
