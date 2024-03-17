import EditIcon from './icons/edit-icon';

export default function Bio({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-[#ECECEC] px-4 py-2 rounded-[20px] flex items-center gap-2 mt-4'>
      <EditIcon fill='#292941' />
      <div className='text-[14px] text-gray-500 font-semibold'>{children}</div>
    </div>
  );
}
