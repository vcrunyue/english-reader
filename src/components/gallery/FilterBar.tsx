'use client';

import type { Difficulty } from '@/types';

interface FilterBarProps {
  selectedDifficulty: Difficulty | 'all';
  selectedSource: string;
  sources: string[];
  onDifficultyChange: (d: Difficulty | 'all') => void;
  onSourceChange: (s: string) => void;
}

const DIFFICULTIES: Array<{ key: Difficulty | 'all'; label: string; activeBg: string }> = [
  { key: 'all', label: '全部', activeBg: 'bg-[#EDE9E0] text-[#5C3D2E]' },
  { key: 'cet4', label: '四级', activeBg: 'bg-[#D4E8D0] text-[#3A5C34]' },
  { key: 'cet6', label: '六级', activeBg: 'bg-[#F5E6C8] text-[#5C4A1E]' },
  { key: 'postgrad', label: '考研', activeBg: 'bg-[#F0D3D3] text-[#5C2A2A]' },
];

export default function FilterBar({
  selectedDifficulty,
  selectedSource,
  sources,
  onDifficultyChange,
  onSourceChange,
}: FilterBarProps) {
  const btnBase =
    'text-sm px-3 py-1.5 rounded-md border border-[#D8D2C8] transition-colors duration-200';

  return (
    <div className="flex flex-col gap-3">
      {/* 难度行 */}
      <div className="flex items-center gap-2.5">
        <span className="text-sm text-[#78716C] font-medium w-10 shrink-0 font-zh-serif">
          难度
        </span>
        {DIFFICULTIES.map(({ key, label, activeBg }) => {
          const active = selectedDifficulty === key;
          return (
            <button
              key={key}
              onClick={() => onDifficultyChange(key)}
              className={`${btnBase} ${
                active
                  ? activeBg
                  : 'bg-transparent text-[#78716C] hover:border-[#C88C4A] hover:text-[#5C3D2E]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 来源行 */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-sm text-[#78716C] font-medium w-10 shrink-0 font-zh-serif">
          来源
        </span>
        {['all', ...sources].map(s => {
          const active = selectedSource === s;
          return (
            <button
              key={s}
              onClick={() => onSourceChange(s)}
              className={`${btnBase} ${
                active
                  ? 'bg-[#EDE0C8] text-[#5C3D2E]'
                  : 'bg-transparent text-[#78716C] hover:border-[#C88C4A] hover:text-[#5C3D2E]'
              }`}
            >
              {s === 'all' ? '全部' : s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
