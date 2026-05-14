'use client';

import { useAppContext } from '@/context/AppContext';
import Toggle from './Toggle';

export default function HighlightToggle() {
  const { highlightEnabled, toggleHighlight } = useAppContext();
  return (
    <Toggle
      enabled={highlightEnabled}
      onToggle={toggleHighlight}
      label={highlightEnabled ? '关闭高亮' : '开启高亮'}
    />
  );
}
