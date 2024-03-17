import { User } from './user';

export interface StorageItem {
  userId: string;
  data: StorageDataItem;
}

export interface StorageDataItem {
  friendRequests?: User[];
  friendList?: User[];
}
