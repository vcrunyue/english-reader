'use client';

import { useAppContext } from '@/context/AppContext';
import Toggle from './Toggle';

export default function CloseReadingToggle() {
  const { closeReadingEnabled, toggleCloseReading } = useAppContext();
  return (
    <Toggle
      enabled={closeReadingEnabled}
      onToggle={toggleCloseReading}
      label={closeReadingEnabled ? '关闭精读' : '开启精读'}
    />
  );
}
