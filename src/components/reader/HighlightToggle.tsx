'use client';

import { useReading } from '@/context/ReadingContext';
import Toggle from './Toggle';

export default function HighlightToggle() {
  const { highlightEnabled, toggleHighlight } = useReading();
  return (
    <Toggle
      enabled={highlightEnabled}
      onToggle={toggleHighlight}
      label={highlightEnabled ? '关闭高亮' : '开启高亮'}
    />
  );
}
