import { Skeleton } from '@/components/ui/skeleton';

export function ChatItemSkeleton() {
  return (
    <div className='flex items-center space-x-4 p-[15px]'>
      <Skeleton className='h-[50px] w-[50px] rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[250px]' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
  );
}
