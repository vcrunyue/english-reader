'use client';

import { useAppContext } from '@/context/AppContext';

export default function CloseReadingToggle() {
  const { closeReadingEnabled, toggleCloseReading } = useAppContext();

  return (
    <button
      onClick={toggleCloseReading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        closeReadingEnabled ? 'bg-[#8B6F4C]' : 'bg-[#D8D2C8]'
      }`}
      title={closeReadingEnabled ? '关闭精读' : '开启精读'}
    >
      <span
        className={`absolute left-0.5 inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          closeReadingEnabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
