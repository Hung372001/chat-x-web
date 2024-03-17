'use client';

import { useTheme } from 'next-themes';
import { Switch } from './ui/switch';

export default function ThemeSwitch({}) {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      className='!mt-0'
      checked={theme === 'dark'}
      onCheckedChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    />
  );
}
