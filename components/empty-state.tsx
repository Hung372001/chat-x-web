import { useTranslations } from 'next-intl';

const EmptyState = () => {
  const t = useTranslations();
  return (
    <div
      className='
        items-cente 
        flex 
        h-full 
        justify-center 
        px-4 
        py-10 
        sm:px-6 
        lg:px-8 
        lg:py-6
      '
    >
      <div className='flex flex-col items-center text-center'>
        <h3 className='mt-[10vh] text-2xl font-semibold'>{t('SELECT_CONVERSATION')}</h3>
      </div>
    </div>
  );
};

export default EmptyState;
