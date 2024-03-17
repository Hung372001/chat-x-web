import { useUserListModal } from '@/components/modals/user-list-modal';
import { useDataContext } from '@/context/data-context';
import { SubmitAction, useSelectedUsersContext } from '@/context/selected-users-context';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useChatId from './useChatId';
import { useGetGroupMembers } from './useGroupChat';

export default function useModifyAdmin() {
  const { onOpen } = useUserListModal();
  const { setSubmitAction, setUserList, keyword, submitAction, setSelectedUserIds } =
    useSelectedUsersContext();
  const { chatId } = useChatId();
  const { groupDetail } = useDataContext();
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

  const adminIds = useMemo(
    () => groupDetail?.admins?.map((admin) => admin.id) || [],
    [groupDetail?.admins]
  );

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
    if (submitAction === SubmitAction.MODIFY_ADMIN) {
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

    setSubmitAction(SubmitAction.MODIFY_ADMIN);

    setUserList(
      userList.map((item) => {
        return {
          id: item.id,
          username: item.nickname || item.username || 'Unknown',
          avatar: item.profile.avatar || '',
        };
      })
    );

    setSelectedUserIds(adminIds);

    onOpen();
  }, [userList]);

  return { handleOpen };
}
