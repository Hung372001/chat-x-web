import { GroupChatType, GroupItem } from '@/types/group-chat';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message);
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = 'Unknown error';
  }

  return message;
}

export function isEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const wait = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getDate30DaysAgo(): Date {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 30);
  return currentDate;
}

export function formatDateText(date: Date): string {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const monthIndex = date.getMonth();
  const day = date.getDate();

  return `${monthNames[monthIndex]} ${day}`;
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

export function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.gif', '.png', '.mpeg-2'];
  return imageExtensions.some((extension) => url.endsWith(extension));
}

export function isVideoUrl(url: string): boolean {
  const videoExtensions = ['.mp4', '.mov', '.wmv', '.avi', '.flv'];
  return videoExtensions.some((extension) => url.endsWith(extension));
}
