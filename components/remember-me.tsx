export default function RememberMe({ label }: { label: string }) {
  return (
    <div className='flex items-center space-x-2'>
      <input
        type='checkbox'
        id='rememberMe'
        name='rememberMe'
        className='shadow-custom-3 h-[20.5px] w-[20.5px] cursor-pointer rounded-[5.625px] border-[0.225px] border-[#8A9AA9]'
      />
      <label
        htmlFor='rememberMe'
        className='cursor-pointer text-sm font-medium text-dark-blue dark:text-white'
      >
        {label}
      </label>
    </div>
  );
}
