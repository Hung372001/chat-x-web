'use client';

import DateDivider from '@/components/date-divider';
import MessageItem, { MessageItemProps } from '@/components/message-item';
import { useDataContext } from '@/context/data-context';
import useChatId from '@/hooks/useChatId';
import { SortOrder } from '@/types/common';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSocketContext } from '@/context/socket-context';
import { isImageUrl, isVideoUrl } from '@/lib/utils';
import moment from 'moment';
import 'moment/locale/vi';
import { Avatar, AvatarImage } from '../ui/avatar';
import { useGetChatMessage } from '@/hooks/useChatMessage';
import ChatMessagesSkeleton from '../skeleton/chat-messages-skeleton';
import InfiniteScroll from 'react-infinite-scroller';
import { getMessages } from '@/services/chat-message';
import { useLocale, useTranslations } from 'next-intl';
import PinnedMessage from '../pinned-message';
import DragArea from '../drag-area';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Video from 'yet-another-react-lightbox/plugins/video';
import Download from 'yet-another-react-lightbox/plugins/download';
import { MESSAGE_PAGE_SIZE } from '@/lib/consts';

const _ = require('lodash');

let lastEmitTimestamp = 0;
let isLoadingMore = false;

export default function ChatView() {
  const locale = useLocale();
  moment.locale(locale);
  const { chatId } = useChatId();
  const [page, setPage] = useState(1);
  const { currentUser, groupDetail, sendingMessages, dequeueSendingMessage, clearSendingMessage } =
    useDataContext();
  const {
    latestMessages,
    deletedMessage,
    pinnedMessage,
    unPinnedMessage,
    stopTyping,
    startTyping,
  } = useSocketContext();
  const [renderedMessage, setRenderedMessage] = useState<MessageItemProps[]>([]);
  const { socket } = useSocketContext();
  const [pinnedMessages, setPinnedMessages] = useState<any[]>();
  const [typingUsers, setTypingUsers] = useState<any[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { data, error, isLoading } = useGetChatMessage(chatId, {
    sortBy: 'createdAt',
    sortOrder: SortOrder.DESC,
    limit: MESSAGE_PAGE_SIZE,
    page: 1,
  });
  const [hasMore, setHasMore] = useState(true);
  const t = useTranslations();
  const [newMessages, setNewMessages] = useState<MessageItemProps[]>([]);
  const [isAllowLoadMore, setIsAllowLoadMore] = useState(false);
  const [openLightBox, setOpenLightBox] = React.useState(false);
  const [lightBoxIndex, setLightBoxIndex] = React.useState(0);

  useEffect(() => {
    setIsFirstLoad(true);
  }, [chatId]);

  // Scroll to bottom when new message is added
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsFirstLoad(false);
  };

  // Emit read messages when select new chat
  useEffect(() => {
    if (socket && chatId) {
      const currentTime = Date.now();
      if (currentTime - lastEmitTimestamp > 1000) {
        socket.emit('onReadMessages', chatId);
        lastEmitTimestamp = currentTime;
      }
    }
  }, [chatId, socket]);

  // [FIRST-LOAD] Get from server
  useEffect(() => {
    if (data) {
      const res: MessageItemProps[] = data?.items.toReversed().map((item) => ({
        id: item.id,
        avatar: item?.sender?.profile?.avatar || '/images/default-avatar.png',
        title: item?.sender?.nickname || item?.sender?.username || 'Unknown',
        message: item?.message,
        isMyMessage: item?.sender?.id === currentUser?.id,
        sentAt: moment(item?.createdAt).format('HH:mm'),
        sentAtYYYYMMDD: moment(item?.createdAt).format('DD/MM/YYYY'),
        pinned: item?.pinned,
        isDeleted: !!item?.deletedAt,
        nameCard: item?.nameCard,
        documentUrls: item?.documentUrls,
        imageUrls: item?.imageUrls,
      }));
      setRenderedMessage(res);
      setPinnedMessages(data?.pinnedMessages);
      setHasMore(MESSAGE_PAGE_SIZE < data?.total);

      setTimeout(() => {
        scrollToBottom();
        setIsAllowLoadMore(true);
      }, 1000);
    }
  }, [data, currentUser]);

  // Add new message to rendered message
  useEffect(() => {
    const isNewMessage = renderedMessage?.find((x) => x.id === latestMessages?.id) === undefined;
    if (latestMessages?.group?.id === chatId && isNewMessage) {
      const formatedMessage = {
        id: latestMessages.id,
        avatar: latestMessages?.sender?.profile?.avatar || '/images/default-avatar.png',
        title: latestMessages?.sender?.nickname || latestMessages?.sender?.username || 'Unknown',
        message: latestMessages?.message,
        isMyMessage: latestMessages?.sender?.id === currentUser?.id,
        sentAt: moment(latestMessages?.createdAt).format('HH:mm'),
        sentAtYYYYMMDD: moment(latestMessages?.createdAt).format('DD/MM/YYYY'),
        nameCard: latestMessages?.nameCard,
        documentUrls: latestMessages?.documentUrls,
        imageUrls: latestMessages?.imageUrls,
      };
      setRenderedMessage((prev) => [...prev, formatedMessage]);
      setNewMessages((prev) => [...prev, formatedMessage]);

      dequeueSendingMessage(chatId);
    }
  }, [chatId, currentUser?.id, latestMessages, socket]);

  // Remove deleted message from rendered message
  useEffect(() => {
    if (deletedMessage?.group?.id === chatId) {
      if (groupDetail?.isAdmin || groupDetail?.isOwner) {
        const deletedMessageInList = renderedMessage.find((x) => x.id === deletedMessage?.id);
        if (deletedMessageInList) {
          deletedMessageInList.isDeleted = true;
        }
        setRenderedMessage((prev) => [...prev]);
      } else {
        const newRenderedMessage = renderedMessage.filter((x) => x.id !== deletedMessage?.id);
        setRenderedMessage(newRenderedMessage);
      }
    }
  }, [chatId, deletedMessage]);

  // Add new pinned message to pinned message
  useEffect(() => {
    if (pinnedMessage?.group?.id === chatId) {
      setPinnedMessages((prevPinnedMessages) => {
        const newPinnedMessages = prevPinnedMessages
          ? [pinnedMessage, ...prevPinnedMessages]
          : [pinnedMessage];
        return newPinnedMessages;
      });
    }
  }, [pinnedMessage, chatId]);

  const handleUnpin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    if (socket && pinnedMessages?.length && pinnedMessages?.length > 0) {
      socket.emit('onUnpinMessage', pinnedMessages[0].id);
    }
  };

  useEffect(() => {
    if (unPinnedMessage?.group?.id === chatId) {
      setPinnedMessages((prevPinnedMessages) => {
        const newPinnedMessages = prevPinnedMessages?.filter((x) => x.id !== unPinnedMessage?.id);
        return newPinnedMessages;
      });
    }
  }, [unPinnedMessage, chatId]);

  useEffect(() => {
    if (stopTyping?.groupChat?.id === chatId) {
      setTypingUsers((prev) => prev.filter((x) => x.id !== stopTyping?.typingMember?.id));
    }
  }, [stopTyping, chatId]);

  useEffect(() => {
    if (
      startTyping?.groupChat?.id === chatId &&
      typingUsers?.find((x) => x.id === startTyping?.typingMember?.id) === undefined
    ) {
      setTypingUsers((prev) => [...prev, startTyping?.typingMember]);
    }
  }, [startTyping, chatId]);

  // Messages to be rendered
  const uniqueMessages: MessageItemProps[] = useMemo(() => {
    const updatedMessages = renderedMessage.map((item) => ({
      ...item,
      pinned: pinnedMessages?.map((x) => x.id).includes(item.id),
    }));
    return _.uniqBy(updatedMessages, 'id');
  }, [renderedMessage, pinnedMessages?.length]);

  useEffect(() => {
    if (socket && chatId && latestMessages?.group?.id === chatId) {
      const currentTime = Date.now();
      if (currentTime - lastEmitTimestamp > 1000) {
        socket.emit('onReadMessages', chatId);
        lastEmitTimestamp = currentTime;
      }
    }
  }, [chatId, latestMessages, socket]);

  // Infinite scroll
  const fetchItems = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading || !isAllowLoadMore) {
      return;
    }

    isLoadingMore = true;

    try {
      const loadMoreData = await getMessages(chatId, {
        sortBy: 'createdAt',
        sortOrder: SortOrder.DESC,
        limit: MESSAGE_PAGE_SIZE,
        page: page + 1,
      });

      const convertedMessages: MessageItemProps[] = loadMoreData?.items
        .toReversed()
        .map((item) => ({
          id: item.id,
          avatar: item?.sender?.profile?.avatar || '/images/default-avatar.png',
          title: item?.sender?.nickname || item?.sender?.username || 'Unknown',
          message: item?.message,
          isMyMessage: item?.sender?.id === currentUser?.id,
          sentAt: moment(item?.createdAt).format('HH:mm'),
          sentAtYYYYMMDD: moment(item?.createdAt).format('DD/MM/YYYY'),
          pinned: item?.pinned,
          isDeleted: !!item?.deletedAt,
          nameCard: item?.nameCard,
          documentUrls: item?.documentUrls,
          imageUrls: item?.imageUrls,
        }));

      setRenderedMessage((prev) => [...convertedMessages, ...prev]);

      setHasMore(loadMoreData.total > MESSAGE_PAGE_SIZE * (page + 1));

      setPage((prev) => prev + 1);
    } finally {
      isLoadingMore = false;
    }
  }, [chatId, currentUser?.id, hasMore, isAllowLoadMore, isLoading, page]);

  useEffect(() => {
    if (newMessages?.length > 0) {
      scrollToBottom();
    }
  }, [newMessages?.length]);

  // Scroll to pinned message
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToMessage = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: messageElement.offsetTop - messageElement.offsetHeight - 50,
        behavior: 'smooth',
      });
    }
  };

  const slides = useMemo(() => {
    let mediaUrls: any[] = [];
    uniqueMessages.forEach((message) => {
      const urls: string[] = [...(message.imageUrls || []), ...(message.documentUrls || [])];

      const images =
        urls
          .filter((url) => isImageUrl(url))
          .map((url) => ({ src: url, download: `${url}?download` })) || [];

      const videos =
        urls
          .filter((url) => isVideoUrl(url))
          .map((url) => ({
            type: 'video',
            src: url,
            download: `${url}?download`,
            autoplay: true,
            sources: [
              {
                src: url,
              },
            ],
          })) || [];
      mediaUrls = [...mediaUrls, ...images, ...videos];
    });
    return mediaUrls;
  }, [uniqueMessages]);

  const onPreview = useCallback(
    (url: string) => {
      const selectedIndex = slides.findIndex((slide) => slide.src === url);

      setLightBoxIndex(selectedIndex);
      setOpenLightBox(true);
    },
    [slides]
  );

  const formatedSendingMessages: MessageItemProps[] = useMemo(() => {
    return sendingMessages.map((item) => ({
      isSending: true,
      id: item.sentAt,
      avatar: currentUser?.profile?.avatar || '/images/default-avatar.png',
      title: currentUser?.nickname || currentUser?.username || 'Unknown',
      message: item?.message,
      isMyMessage: true,
      sentAt: t('SENDING'),
      pinned: false,
      isDeleted: false,
      documentUrls: item?.documentUrls,
      imageUrls: item?.imageUrls,
    }));
  }, [
    currentUser?.nickname,
    currentUser?.profile?.avatar,
    currentUser?.username,
    sendingMessages,
    t,
  ]);

  useEffect(() => {
    if (formatedSendingMessages?.length > 0) {
      scrollToBottom();
    }
  }, [formatedSendingMessages?.length]);

  useEffect(() => {
    if (data) {
      clearSendingMessage();
    }
  }, [data]);

  return (
    <>
      {!!pinnedMessages && pinnedMessages?.length > 0 && (
        <PinnedMessage
          pinnedMessages={pinnedMessages}
          handleUnpin={handleUnpin}
          scrollToMessage={scrollToMessage}
        />
      )}

      {isLoading && isFirstLoad ? (
        <ChatMessagesSkeleton />
      ) : (
        <div
          className='flex-1 overflow-y-auto bg-gray-100 px-6 py-0 dark:bg-[#031A26]'
          ref={chatContainerRef}
        >
          {!hasMore && (
            <div className='text-md my-10 text-center text-gray-500'>
              {t('CONVERSATION.NO_MORE_MESSAGES')}
            </div>
          )}
          <InfiniteScroll
            loadMore={fetchItems}
            hasMore={hasMore}
            isReverse={true}
            pageStart={0}
            loader={
              <div className='loader my-5 text-center' key={0}>
                Loading ...
              </div>
            }
            threshold={500}
            useWindow={false}
          >
            {uniqueMessages.map((message, index) => (
              <React.Fragment key={message?.id}>
                {(index === 0 ||
                  uniqueMessages[index].sentAtYYYYMMDD !==
                    uniqueMessages[index - 1].sentAtYYYYMMDD) && (
                  <DateDivider date={message.sentAtYYYYMMDD || ''} />
                )}

                <MessageItem {...message} onPreview={onPreview} />
              </React.Fragment>
            ))}

            {formatedSendingMessages.map((message) => (
              <React.Fragment key={message?.id}>
                <MessageItem {...message} onPreview={onPreview} />
              </React.Fragment>
            ))}

            {typingUsers.map((user) => (
              <div key={user.id} className='ml-4 flex items-center'>
                <Avatar className='h-6 w-6 bg-gray-200'>
                  <AvatarImage src={user?.profile?.avatar || '/images/default-avatar.png'} />
                </Avatar>
                <div className={'ml-1 text-[14px] font-bold capitalize'}>
                  {user?.nickname || user?.username || 'Unknown'} ...
                </div>
              </div>
            ))}
          </InfiniteScroll>

          <div style={{ marginBottom: 20 }} ref={messagesEndRef} />
        </div>
      )}

      <DragArea />

      {openLightBox && (
        <Lightbox
          plugins={[Video, Download]}
          index={lightBoxIndex}
          open={openLightBox}
          close={() => setOpenLightBox(false)}
          slides={slides}
          controller={{ closeOnBackdropClick: true }}
          carousel={{
            finite: true,
            preload: 2,
            padding: '16px',
            spacing: '30%',
            imageFit: 'contain',
          }}
        />
      )}
    </>
  );
}
