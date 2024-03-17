import React from 'react';
import { Input } from '@/components/ui/input';
import SearchIcon from './icons/search-icon';

type SearchInputProps = {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};

export default function SearchInput({ placeholder = 'Search', onChange, value }: SearchInputProps) {
  return (
    <div className=''>
      <Input
        className='!dark:text-[#AFBAC5] h-[45px] rounded-full border-[#8A9AA9] px-[14px] font-medium focus-visible:outline-none dark:bg-white/[0.3]'
        icon={<SearchIcon />}
        type='text'
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}
