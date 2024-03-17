import { GroupItem } from './group-chat';
import { User } from './user';

export interface SearchResponse {
  total: number;
  items: GroupItem[] | User[];
}
