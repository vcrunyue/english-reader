'use client';

import { useReading } from '@/context/ReadingContext';
import Toggle from './Toggle';

export default function CloseReadingToggle() {
  const { closeReadingEnabled, toggleCloseReading } = useReading();
  return (
    <Toggle
      enabled={closeReadingEnabled}
      onToggle={toggleCloseReading}
      label={closeReadingEnabled ? '关闭精读' : '开启精读'}
    />
  );
}
