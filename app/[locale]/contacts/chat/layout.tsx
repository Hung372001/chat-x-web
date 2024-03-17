'use client';

import Header from '@/components/chat-window/header';
import ContactsPanel from '../components/contacts-panel';
import MessageForm from '@/components/chat-window/message-form';

export default function ConversationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='fixed flex h-full w-full pl-[88px]'>
      <ContactsPanel />
      <div className='h-full flex-1'>
        <div className='relative z-30 flex h-full w-full flex-col border-r border-black/10 bg-white dark:border-black dark:bg-[#333]'>
          <Header />
          {children}
          <MessageForm />
        </div>
      </div>
    </div>
  );
}
