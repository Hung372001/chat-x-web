import { getErrorMessage } from '@/lib/utils';
import axios from 'axios';
import { ApiClient, httpClient } from './http';

export type SignUpData = {
  email?: string;
  phoneNumber?: string;
  password: string;
  username: string;
};

export type LoginData = {
  email?: string;
  phoneNumber?: string;
  password: string;
};

export type ChangePasswordDto = {
  oldPassword: string;
  newPassword: string;
  confirmedNewPassword: string;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signUp = async (data: SignUpData): Promise<any> => {
  try {
    const response = await api.post('/auth/sign-up', data);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const login = async (data: LoginData): Promise<any> => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const changePassword = async (data: ChangePasswordDto): Promise<any> => {
  try {
    const response = await ApiClient(process.env.NEXT_PUBLIC_AUTH_API_URL).put(
      '/auth/change-password',
      data
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      throw error.response?.data;
    } else {
      throw new Error(getErrorMessage(error));
    }
  }
};
