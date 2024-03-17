import React from 'react';
import { ChatItemSkeleton } from './chat-item-skeleton';

export default function ChatListSkeleton() {
  return (
    <div className='flex flex-col'>
      <ChatItemSkeleton />
      <ChatItemSkeleton />
      <ChatItemSkeleton />
      <ChatItemSkeleton />
      <ChatItemSkeleton />
    </div>
  );
}
