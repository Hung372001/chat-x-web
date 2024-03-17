export interface GroupSetting {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  pinned: boolean;
  hiding: boolean;
  deleteMessageFrom: any;
  muteNotification: boolean;
  unReadMessages: number;
  userId: string;
  groupId: string;
}

export type AutoRemoveTime = '0' | '30' | '60' | '120';
