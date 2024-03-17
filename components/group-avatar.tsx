import { User } from '@/types/user';
import { Avatar, AvatarImage } from './ui/avatar';

export default function GroupAvatar({
  highlightMembers,
  totalMembers,
}: {
  highlightMembers?: User[];
  totalMembers: number;
}) {
  if (!highlightMembers || totalMembers === 0) {
    return (
      <Avatar className='h-[52px] w-[52px] bg-gray-200'>
        <AvatarImage src={'/images/default-avatar.png'} />
      </Avatar>
    );
  }

  if (totalMembers === 1) {
    return (
      <Avatar className='h-[52px] w-[52px] bg-gray-200'>
        <AvatarImage src={highlightMembers[0]?.profile?.avatar || '/images/default-avatar.png'} />
      </Avatar>
    );
  }

  if (totalMembers === 2) {
    return (
      <div className='relative flex h-[52px] w-[52px]'>
        <Avatar className='absolute left-5 top-0 order-1 h-7 w-7'>
          <AvatarImage src={highlightMembers[0]?.profile?.avatar || '/images/default-avatar.png'} />
        </Avatar>

        <Avatar className='absolute left-0 top-5 order-2 h-7 w-7'>
          <AvatarImage src={highlightMembers[1]?.profile?.avatar || '/images/default-avatar.png'} />
        </Avatar>
      </div>
    );
  }

  if (totalMembers === 3) {
    return (
      <div className='relative flex h-[52px] w-[52px]'>
        <Avatar className='absolute left-5 top-0 order-1 h-7 w-7'>
          <AvatarImage src={highlightMembers[0]?.profile?.avatar || '/images/default-avatar.png'} />
        </Avatar>

        <Avatar className='absolute left-2 top-5 order-2 h-7 w-7'>
          <AvatarImage src={highlightMembers[1]?.profile?.avatar || '/images/default-avatar.png'} />
        </Avatar>

        <Avatar className='absolute inset-0 order-3 h-7 w-7'>
          <AvatarImage src={highlightMembers[2]?.profile?.avatar || '/images/default-avatar.png'} />
        </Avatar>
      </div>
    );
  }

  return (
    <div className='relative flex h-[52px] w-[52px]'>
      <Avatar className='absolute left-5 top-0 order-1 h-7 w-7'>
        <AvatarImage src={highlightMembers[0]?.profile?.avatar || '/images/default-avatar.png'} />
      </Avatar>

      <Avatar className='absolute left-0 top-5 order-2 h-7 w-7'>
        <AvatarImage src={highlightMembers[1]?.profile?.avatar || '/images/default-avatar.png'} />
      </Avatar>

      <Avatar className='absolute inset-0 order-3 h-7 w-7'>
        <AvatarImage src={highlightMembers[2]?.profile?.avatar || '/images/default-avatar.png'} />
      </Avatar>

      <div className='absolute left-5 top-5 order-4 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-bold text-dark-blue shadow-custom-5'>
        {totalMembers - 3}+
      </div>
    </div>
  );
}
