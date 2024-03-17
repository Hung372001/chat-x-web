import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

export default function ConfirmModal({
  open,
  onConfirm,
  onClose,
  message,
}: {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  message?: string;
}) {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='dark:bg-[#333] sm:max-w-[370px] sm:rounded-[32px]'>
        <DialogHeader>
          <DialogTitle className='mx-auto w-[290px] text-center text-[22px] font-bold text-dark-blue dark:text-white'>
            {t('MODALS.ACCEPT')}
          </DialogTitle>
        </DialogHeader>

        <div className='text-4 mb-9 mt-5 text-center font-medium'>{message}</div>

        <DialogFooter className='flex sm:justify-center'>
          <Button
            className='!ml-4 h-[48px] w-[152px] rounded-full bg-gradient-blue !text-[16px] text-lg font-medium text-white shadow-custom-blue transition-all active:bg-none active:opacity-60 active:shadow-none'
            type='button'
            onClick={onConfirm}
          >
            {t('MODALS.ACCEPT')}
          </Button>
          <Button
            onClick={onClose}
            className='h-[48px] w-[152px] rounded-full border-2 border-[#2FACE1] bg-transparent !text-[16px] text-lg font-medium text-dark-blue  transition-all hover:bg-transparent active:bg-[#2FACE1] active:text-white dark:text-white'
            type='button'
          >
            {t('MODALS.CANCEL')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
