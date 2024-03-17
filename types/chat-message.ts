export interface ChatMessageResponse {
  items: Message[];
  pinnedMessages: any[];
  total: number;
}

export interface Message {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  message: string;
  imageUrls: any;
  documentUrls: any;
  isRead: boolean;
  unsent: boolean;
  pinned: boolean;
  sender: User;
  readsBy: ReadsBy[];
  nameCard: User;
}

export interface SendingMessage {
  groupId: string;
  message?: string;
  imageUrls?: string[];
  documentUrls?: string[];
  nameCardUserId?: string;
  sentAt?: string;
}

export interface User {
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
  profile: Profile;
  nickname: string;
}

export interface Profile {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  avatar: string;
  gender: string;
  activityScore: string;
  creditScore: string;
}

export interface ReadsBy {
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
}
