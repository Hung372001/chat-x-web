'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import useModal from '@/hooks/useModal';
import { useEffect, useMemo, useState } from 'react';
import { AttendanceCalendar } from '../attendance-calendar';
import { useGetRollCall, useRollCall } from '@/hooks/useUser';
import { useTranslations } from 'next-intl';
import { useDataContext } from '@/context/data-context';

export function DailyAttendanceModal() {
  const { open, onClose, onOpen } = useDailyAttendanceModal();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const t = useTranslations();

  const { rollCallData } = useDataContext();

  const checkedDays = useMemo(
    () => rollCallData.map((dateString) => new Date(dateString)),
    [rollCallData]
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[440px] sm:rounded-[32px]'>
        <DialogHeader>
          <DialogTitle className='mx-auto w-[290px] text-center text-[27px] text-dark-blue dark:text-white'>
            {t('MODALS.DAILY_ATTENDANCE')}
          </DialogTitle>
        </DialogHeader>

        <AttendanceCalendar
          mode='single'
          selected={date}
          onSelect={setDate}
          className='[&>.flex]:justify-center'
          checkedDays={checkedDays}
        />

        <DialogFooter className='flex sm:justify-center'>
          <Button
            onClick={onClose}
            className='h-[54px] w-[373px] rounded-full bg-gradient-blue text-lg font-medium text-white shadow-custom-blue transition-all active:bg-none active:opacity-60 active:shadow-none'
            type='button'
          >
            {t('MODALS.ACCEPT')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useDailyAttendanceModal() {
  const { modals, openModal, closeModal } = useModal();

  return {
    open: modals['daily-attendance'] === true,
    onOpen: () => openModal('daily-attendance'),
    onClose: () => closeModal('daily-attendance'),
  };
}
