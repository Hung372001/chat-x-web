import React from 'react';

export default function DateDivider({ date }: { date: string }) {
  return (
    <div className='sticky top-2 my-4 flex justify-center'>
      <div className='rounded-full bg-white px-3 py-2 text-[10px] font-semibold dark:bg-[#333]'>
        {date}
      </div>
    </div>
  );
}
