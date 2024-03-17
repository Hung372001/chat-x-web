'use client';

import UserListModal, { useUserListModal } from '@/components/modals/user-list-modal';
import { useAddFriends } from '@/hooks/useUser';
import { addGroupMembers, modifyAdmin, modifyMembers } from '@/services/group-chat';
import { User, UserSearchItem } from '@/types/user';
import React, { createContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDataContext } from './data-context';
import { GroupSettingModal } from '@/components/modals/group-setting-modal';
import { useTranslations } from 'next-intl';
import { wait } from '@/lib/utils';
import { mutate } from 'swr';

interface SelectedUsersContextType {
  modalTitle: string;
  submitButtonText: string;
  setSubmitAction: React.Dispatch<React.SetStateAction<SubmitAction>>;
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  userList: UserSearchItem[];
  setUserList: React.Dispatch<React.SetStateAction<UserSearchItem[]>>;
  onSubmit: (selectedUserIds: string[]) => void;
  isLoading: boolean;
  submitAction: SubmitAction;
  selectedUserIds: string[];
  setSelectedUserIds: React.Dispatch<React.SetStateAction<string[]>>;
  setRawUserList: React.Dispatch<React.SetStateAction<User[]>>;
}

const SelectedUsersContext = createContext<SelectedUsersContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export enum SubmitAction {
  ADD_FRIEND = 'ADD_FRIEND',
  ADD_GROUP_MEMBER = 'ADD_GROUP_MEMBER',
  MODIFY_ADMIN = 'MODIFY_ADMIN',
  MODIFY_MEMBER = 'MODIFY_MEMBER',
}

const SelectedUsersProvider: React.FC<Props> = ({ children }) => {
  const t = useTranslations();
  const [modalTitle, setModalTitle] = React.useState<string>('');
  const [submitButtonText, setSubmitButtonText] = React.useState<string>('');
  const [keyword, setKeyword] = React.useState<string>('');
  const [userList, setUserList] = React.useState<UserSearchItem[]>([]);
  const [submitAction, setSubmitAction] = React.useState<SubmitAction>(SubmitAction.ADD_FRIEND);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { handleSubmit: handleAddFriends } = useAddFriends();
  const { groupDetail, refreshGroupDetail } = useDataContext();
  const { onClose } = useUserListModal();
  const [disabled, setDisabled] = React.useState<boolean>(false);

  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);

  const [rawUserList, setRawUserList] = React.useState<User[]>([]);

  useEffect(() => {
    switch (submitAction) {
      case SubmitAction.ADD_FRIEND:
        setModalTitle(t('ADD_FRIEND'));
        setSubmitButtonText(t('SEND_FRIEND_REQUEST'));
        setDisabled(false);
        break;
      case SubmitAction.ADD_GROUP_MEMBER:
        setModalTitle(t('GROUP.ADD_MEMBER'));
        setSubmitButtonText(t('GROUP.ADD_TO'));
        setDisabled(false);
        break;
      case SubmitAction.MODIFY_ADMIN:
        setModalTitle(t('GROUP.ADMIN'));
        setSubmitButtonText(t('GROUP.ADD_TO'));
        setDisabled(false);
        break;
      case SubmitAction.MODIFY_MEMBER:
        setModalTitle(t('GROUP.MEMBER'));
        setSubmitButtonText(t('GROUP.REMOVE_FROM_GROUP'));
        setDisabled(!groupDetail?.isAdmin && !groupDetail?.isOwner);
        break;
    }
  }, [groupDetail?.isAdmin, groupDetail?.isOwner, submitAction, t]);

  const onSubmit = (useIds: string[]) => {
    if (useIds.length > 0) {
      switch (submitAction) {
        case SubmitAction.ADD_FRIEND:
          localStorage.setItem('lastFriendRequestTime', JSON.stringify(Date.now()));
          setIsLoading(true);
          handleAddFriends(useIds)
            .then(() => {
              setIsLoading(false);
              toast.success(t('ACTION_SUCCESS'));
              onClose();
              setKeyword('');
              onSubmit([]);
            })
            .catch((error) => {
              toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
              setIsLoading(false);
            });
          break;
        case SubmitAction.ADD_GROUP_MEMBER:
          setIsLoading(true);
          addGroupMembers(groupDetail?.id || '', useIds)
            .then(async () => {
              setIsLoading(false);
              toast.success(t('ACTION_SUCCESS'));
              onClose();
              setKeyword('');
              onSubmit([]);
              await wait(5000);
              await mutate(
                `/group-chat/members/${groupDetail?.id}?filter=${JSON.stringify({
                  isGetAll: true,
                })}`
              );
              await refreshGroupDetail();
            })
            .catch((error) => {
              toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
              setIsLoading(false);
            });
          break;
        case SubmitAction.MODIFY_ADMIN:
          setIsLoading(true);
          modifyAdmin(groupDetail?.id || '', useIds)
            .then(async () => {
              setIsLoading(false);
              toast.success(t('ACTION_SUCCESS'));
              onClose();
              setKeyword('');
              onSubmit([]);
              await wait(5000);
              await refreshGroupDetail();
            })
            .catch((error) => {
              toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
              setIsLoading(false);
            });
          break;
        case SubmitAction.MODIFY_MEMBER:
          setIsLoading(true);
          modifyMembers(groupDetail?.id || '', useIds)
            .then(async () => {
              setIsLoading(false);
              toast.success(t('ACTION_SUCCESS'));
              onClose();
              setKeyword('');
              onSubmit([]);
              await wait(5000);
              await mutate(
                `/group-chat/members/${groupDetail?.id}?filter=${JSON.stringify({
                  isGetAll: true,
                })}`
              );
              await refreshGroupDetail();
            })
            .catch((error) => {
              toast.error(error?.message ?? t('AN_ERROR_OCCURRED'));
              setIsLoading(false);
            });
          break;
      }
    }
  };

  return (
    <SelectedUsersContext.Provider
      value={{
        setSubmitAction,
        modalTitle,
        submitButtonText,
        keyword,
        setKeyword,
        userList,
        setUserList,
        onSubmit,
        isLoading,
        submitAction,
        selectedUserIds,
        setSelectedUserIds,
        setRawUserList,
      }}
    >
      {children}
      <UserListModal disabled={disabled} />
      <GroupSettingModal />
    </SelectedUsersContext.Provider>
  );
};

export function useSelectedUsersContext() {
  const context = React.useContext(SelectedUsersContext);
  if (context === undefined) {
    throw new Error('useSelectedUsersContext must be used within a SelectedUsersProvider');
  }
  return context;
}

export { SelectedUsersContext, SelectedUsersProvider };
