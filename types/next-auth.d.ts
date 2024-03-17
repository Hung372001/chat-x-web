import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: any;
    email: string;
    phoneNumber: string;
    username: string;
    currentRefreshToken: string;
    hiding: boolean;
    soundNotification: boolean;
    roles: Role[];
    profile: Profile;
    accessToken: string;
    refreshToken: string;
  }

  interface Role {
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

  interface Profile {
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
}
