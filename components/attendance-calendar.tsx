'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type AttendanceCalendarProps = React.ComponentProps<typeof DayPicker> & {
  checkedDays: Date[];
};

function AttendanceCalendar({
  className,
  classNames,
  showOutsideDays = true,
  checkedDays,
  ...props
}: AttendanceCalendarProps) {
  const today = new Date();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      disabled
      disableNavigation
      ISOWeek
      modifiers={{
        beforeToday: { before: today },
        afterToday: { after: today },
        checked: checkedDays,
      }}
      modifiersClassNames={{
        beforeToday: 'bg-[rgb(159,159,159)]',
        afterToday: 'attendance-date-lock',
        checked: 'attendance-date-active',
      }}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center hidden',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex gap-2',
        head_cell: 'text-muted-foreground rounded-md w-[46px] font-normal text-[16px]',
        row: 'flex w-full mt-2 gap-2',
        cell: 'text-center text-md p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 [&>button]:text-[#292941]',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-[46px] w-[46px] p-0 font-normal aria-selected:opacity-100 bg-[#EEE] text-[20px] text-[#292941]'
        ),
        day_selected:
          ' text-primary-foreground hover:text-primary-foreground focus:text-primary-foreground text-[#292941]',
        day_today: 'attendance-date-active text-accent-foreground text-[#292941]',
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground !opacity-100',
        day_range_middle: 'aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      {...props}
    />
  );
}
AttendanceCalendar.displayName = 'AttendanceCalendar';

export { AttendanceCalendar };
