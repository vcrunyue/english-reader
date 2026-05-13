'use client';

import { useAppContext } from '@/context/AppContext';

export default function HighlightToggle() {
  const { highlightEnabled, toggleHighlight } = useAppContext();

  return (
    <button
      onClick={toggleHighlight}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        highlightEnabled ? 'bg-[#B08844]' : 'bg-[#D8D2C8]'
      }`}
      aria-label={highlightEnabled ? '关闭高亮' : '开启高亮'}
    >
      <span
        className={`absolute left-0.5 inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          highlightEnabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
