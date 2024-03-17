import { useUserListModal } from '@/components/modals/user-list-modal';
import { SubmitAction, useSelectedUsersContext } from '@/context/selected-users-context';
import { FilterDto, SortOrder } from '@/types/common';
import { useEffect } from 'react';
import { useGetUsers } from './useUser';
import { FRIEND_PAGE_SIZE } from '@/lib/consts';

export default function useAddGroupMember() {
  const { onOpen } = useUserListModal();
  const { setSubmitAction, setUserList, keyword, submitAction } = useSelectedUsersContext();
  const { data, fetch } = useGetUsers();

  useEffect(() => {
    if (submitAction === SubmitAction.ADD_GROUP_MEMBER) {
      if (keyword && keyword.length > 0) {
        const filter: FilterDto = {
          keyword: `["${keyword}","${keyword}","${keyword}"]`,
          searchBy: `["username","email","phoneNumber"]`,
          sortBy: 'username',
          sortOrder: SortOrder.ASC,
          limit: FRIEND_PAGE_SIZE,
          page: 1,
          isGetAll: false,
        };
        fetch(filter);
      } else {
        setUserList([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, submitAction]);

  useEffect(() => {
    if (data && submitAction === SubmitAction.ADD_GROUP_MEMBER) {
      setUserList(
        data.items.map((item) => {
          return {
            id: item.id || '',
            username: item.nickname || item.username || 'Unknown',
            avatar: item.profile?.avatar || '',
          };
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, submitAction]);

  const handleOpen = () => {
    setUserList([]);
    setSubmitAction(SubmitAction.ADD_GROUP_MEMBER);
    onOpen();
  };

  return { handleOpen };
}
