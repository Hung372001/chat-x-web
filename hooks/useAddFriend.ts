import { useUserListModal } from '@/components/modals/user-list-modal';
import { SubmitAction, useSelectedUsersContext } from '@/context/selected-users-context';
import { FilterDto, SortOrder } from '@/types/common';
import { useEffect } from 'react';
import { useGetUsers } from './useUser';
import { FRIEND_PAGE_SIZE } from '@/lib/consts';

export default function useAddFriend() {
  const { onOpen } = useUserListModal();
  const { setSubmitAction, setUserList, keyword, submitAction, setRawUserList } =
    useSelectedUsersContext();
  const { data, fetch } = useGetUsers();

  useEffect(() => {
    if (submitAction === SubmitAction.ADD_FRIEND) {
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
    if (data && submitAction === SubmitAction.ADD_FRIEND) {
      setRawUserList((prev) => [...prev, ...data.items]);

      setUserList(
        data.items.map((item) => {
          return {
            id: item.id,
            username: item.nickname || item.username || 'Unknown',
            avatar: item.profile?.avatar || '',
          };
        })
      );
    }
  }, [data, submitAction]);

  const handleOpen = () => {
    setUserList([]);
    setSubmitAction(SubmitAction.ADD_FRIEND);
    onOpen();
  };

  return { handleOpen };
}
