import React, { useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { GrClose } from 'react-icons/gr';
import Linkify from 'linkify-react';
import PinIcon2 from './icons/pin-icon-2';
import { useTranslations } from 'next-intl';

export default function PinnedMessage({
  pinnedMessages,
  handleUnpin,
  scrollToMessage,
}: {
  pinnedMessages: any;
  handleUnpin: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  scrollToMessage: (messageId: string) => void;
}) {
  const t = useTranslations();
  const [activeId, setActiveId] = React.useState<number>(0);

  const shownPinnedMessages = useMemo(() => {
    return pinnedMessages?.[activeId];
  }, [activeId, pinnedMessages]);

  useEffect(() => {
    if (pinnedMessages?.length === 0) {
      setActiveId(0);
    } else if (pinnedMessages?.length > 0 && activeId >= pinnedMessages?.length) {
      setActiveId(pinnedMessages?.length - 1);
    }
  }, [activeId, pinnedMessages]);

  const isSpecialMessage = useMemo(() => {
    return (
      (shownPinnedMessages?.documentUrls && shownPinnedMessages?.documentUrls?.length > 0) ||
      (shownPinnedMessages?.imageUrls && shownPinnedMessages?.imageUrls?.length > 0)
    );
  }, [shownPinnedMessages?.documentUrls, shownPinnedMessages?.imageUrls]);

  const onClick = () => {
    scrollToMessage(shownPinnedMessages?.id);
    setActiveId(activeId + 1 < pinnedMessages?.length ? activeId + 1 : 0);
  };

  return (
    <div
      className='group relative flex min-h-[53px] cursor-pointer items-center justify-center rounded-b-[10px] bg-[#D6F3FF] py-2'
      onClick={onClick}
    >
      <PinIcon2 />

      <span className='text-[12px] font-semibold text-dark-blue'>
        {shownPinnedMessages?.sender?.nickname || shownPinnedMessages?.sender?.username}:
      </span>

      {shownPinnedMessages?.nameCard ? (
        <div className='message-wrapper ml-1 max-h-[50px] overflow-y-auto whitespace-pre-wrap break-words text-[12px] font-medium text-dark-blue'>
          <Linkify options={{ attributes: { target: '_blank', rel: 'noopener noreferrer' } }}>
            {t('MODALS.NAME_CARD')}
            {': '}
            {shownPinnedMessages?.nameCard?.nickname || shownPinnedMessages?.nameCard?.username}
            {' - '}
            {shownPinnedMessages?.nameCard?.phoneNumber || shownPinnedMessages?.nameCard?.email}
          </Linkify>
        </div>
      ) : isSpecialMessage ? (
        <div className='message-wrapper ml-1 max-h-[50px] overflow-y-auto whitespace-pre-wrap break-words text-[12px] font-medium text-dark-blue'>
          <Linkify options={{ attributes: { target: '_blank', rel: 'noopener noreferrer' } }}>
            {t('IMAGE_VIDEO')}
          </Linkify>
        </div>
      ) : (
        <div className='message-wrapper ml-1 max-h-[50px] overflow-y-auto whitespace-pre-wrap break-words text-[12px] font-medium text-dark-blue'>
          <Linkify options={{ attributes: { target: '_blank', rel: 'noopener noreferrer' } }}>
            {shownPinnedMessages?.message}
          </Linkify>
        </div>
      )}

      <Button
        className='absolute right-5 z-20 hidden h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-transparent p-0 hover:bg-[#B0DFF2] group-hover:flex'
        onClick={handleUnpin}
      >
        <GrClose />
      </Button>
    </div>
  );
}
