import { SortOrder } from './common';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Others',
}

export interface User {
  id: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: any;
  email?: string;
  phoneNumber?: any;
  username?: string;
  hashedPassword?: string;
  currentRefreshToken?: string;
  hiding?: boolean;
  soundNotification?: boolean;
  roles?: Role[];
  profile?: Profile;
  nickname?: string;
  isFriend?: boolean;
}

export interface Role {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  name: string;
  permissions: string;
  isDefault: boolean;
  description: string;
  type: string;
}

export interface Profile {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  avatar?: string;
  gender: Gender;
  activityScore: string;
  creditScore: string;
}

export interface GetRollCallDto {
  fromDate: string;
  toDate: string;
  sortOrder: SortOrder;
}

export interface GetUsersResponse {
  total: number;
  items: User[];
}

export interface RollCallResponse {
  total: number;
  items: string[];
}

export interface UserSearchItem {
  id: string;
  avatar: string;
  username: string;
}

export interface FriendRequestResponse {
  isFriend: boolean;
  friendRequest: FriendRequest;
}

export interface FriendRequest {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  status: string;
}
