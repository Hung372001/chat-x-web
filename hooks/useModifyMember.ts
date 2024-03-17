import { useUserListModal } from '@/components/modals/user-list-modal';
import { SubmitAction, useSelectedUsersContext } from '@/context/selected-users-context';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetGroupMembers } from './useGroupChat';
import useChatId from './useChatId';

export default function useModifyMembers() {
  const { onOpen } = useUserListModal();
  const { setSubmitAction, setUserList, keyword, submitAction, setSelectedUserIds } =
    useSelectedUsersContext();
  const { chatId } = useChatId();
  const [allowToFetch, setAllowToFetch] = useState<boolean>(false);
  const { data: groupMembers } = useGetGroupMembers(
    chatId,
    {
      isGetAll: true,
    },
    allowToFetch
  );

  useEffect(() => {
    setAllowToFetch(false);
  }, [chatId]);

  const userList = useMemo(() => {
    return (
      groupMembers?.items?.filter((x) =>
        x.nickname
          ? x.nickname?.toLowerCase().includes(keyword.toLowerCase())
          : x.username?.toLowerCase().includes(keyword.toLowerCase())
      ) || []
    );
  }, [groupMembers, keyword]);

  useEffect(() => {
    if (submitAction === SubmitAction.MODIFY_MEMBER) {
      setUserList(
        userList.map((item) => {
          return {
            id: item.id,
            username: item.nickname || item.username || 'Unknown',
            avatar: item.profile.avatar || '',
          };
        })
      );
    }
  }, [userList, submitAction]);

  const handleOpen = useCallback(() => {
    setAllowToFetch(true);

    setSubmitAction(SubmitAction.MODIFY_MEMBER);

    setUserList(
      userList.map((item) => {
        return {
          id: item.id,
          username: item.nickname || item.username || 'Unknown',
          avatar: item.profile.avatar || '',
        };
      })
    );

    setSelectedUserIds([]);

    onOpen();
  }, [userList]);

  return { handleOpen };
}
