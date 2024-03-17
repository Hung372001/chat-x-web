import { ChatItemProps } from '@/components/chat-panel/chat-item';
import { GroupChatType, GroupItem } from '@/types/group-chat';
import moment from 'moment';

export function fromGroupItemToConversationItem(
  groups: GroupItem[],
  currentUserId: string | undefined,
  locale: string
) {
  moment.locale(locale);
  return groups?.map((group) => {
    const lastMessageTime = group.latestMessage?.createdAt
      ? moment(group.latestMessage?.createdAt)
          .startOf('second')
          .fromNow()
      : '';

    if (group?.type === GroupChatType.DOU) {
      const otherUser = group.members?.find((user) => user.id !== currentUserId);
      const conversation: ChatItemProps = {
        id: group.id,
        avatar: otherUser?.profile?.avatar || '',
        title: otherUser?.nickname || otherUser?.username || 'Unknown',
        lastMessage: group.latestMessage?.message || '',
        lastMessageTime,
        lastMessageTimeStamp: group.latestMessage?.createdAt
          ? new Date(group.latestMessage?.createdAt).getTime()
          : 0,
        isGroup: false,
        members: group.members || [],
        totalMembers: group.memberQty || 0,
        unreadCount: group.settings?.[0]?.unReadMessages || 0,
        pinned: group.settings?.[0]?.pinned || false,
        isArchived: group.settings?.[0]?.hiding || false,
      };
      return conversation;
    } else {
      const conversation: ChatItemProps = {
        id: group.id,
        avatar: '',
        title: group.name || 'Unknown',
        lastMessage: group.latestMessage?.message || '',
        lastMessageTime,
        lastMessageTimeStamp: group.latestMessage?.createdAt
          ? new Date(group.latestMessage?.createdAt).getTime()
          : 0,
        isGroup: true,
        members: group.members || [],
        totalMembers: group.memberQty || 0,
        unreadCount: group.settings?.[0]?.unReadMessages || 0,
        pinned: group.settings?.[0]?.pinned || false,
        isArchived: group.settings?.[0]?.hiding || false,
      };
      return conversation;
    }
  });
}
