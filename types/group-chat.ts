import { Profile } from './user';

export enum GroupChatType {
  DOU = 'Dou',
  GROUP = 'Group',
}

export interface CreateGroupChatDto {
  name?: string;
  members: string[];
  type: GroupChatType;
}

export interface MembersResponse {
  items: Member[];
  total: number;
}

export interface GetGroupsData {
  items: GroupItem[];
  total: number;
}

export interface GroupItem {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  type: GroupChatType;
  canAddFriends: boolean;
  enabledChat: boolean;
  clearMessageDuration: string;
  isPublic: boolean;
  members: Member[];
  latestMessage: LatestMessage;
  settings: Setting[];
  name?: string;
  isAdmin?: boolean;
  isOwner?: boolean;
  admins?: Member[];
  nickname?: string;
  username?: string;
  profile?: Profile;
  isFriend?: boolean;
  memberQty?: number;
}

export interface Member {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  email: string;
  phoneNumber: string;
  username: string;
  hashedPassword: string;
  currentRefreshToken: string;
  hiding: boolean;
  soundNotification: boolean;
  friends: any;
  groupChatSettings: GroupChatSetting[];
  profile: Profile;
  nickname?: string;
}

export interface GroupChatSetting {
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
}

export interface LatestMessage {
  id?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: any;
  message?: string;
  imageUrls?: any;
  documentUrls?: any;
  isRead?: boolean;
  unsent?: boolean;
  pinned?: boolean;
}

export interface Setting {
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
}
