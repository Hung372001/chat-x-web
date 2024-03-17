import React from 'react';
import { Skeleton } from '../ui/skeleton';

export default function ChatMessagesSkeleton() {
  return (
    <div className='flex-1 bg-gray-100 px-6 dark:bg-[#031A26]'>
      <Skeleton className='my-4 h-[100px] w-[300px] max-w-[45%] rounded-[20px] bg-gray-200/40 p-[15px] pt-3' />
      <Skeleton className='my-4 h-20 w-[150px] max-w-[45%] rounded-[20px] bg-gray-200/40 p-[15px] pt-3' />
      <Skeleton className='w-15 my-4 ml-auto h-20 max-w-[45%] rounded-[20px] bg-gray-200/40 p-[15px] pt-3' />
      <Skeleton className='my-4 ml-auto h-20 w-[200px] max-w-[45%] rounded-[20px] bg-gray-200/40 p-[15px] pt-3' />
    </div>
  );
}
