'use client';

import type { Difficulty } from '@/types';
import { DIFFICULTY_FILTERS } from '@/config/difficulty';

interface FilterBarProps {
  selectedDifficulty: Difficulty | 'all';
  selectedSource: string;
  sources: string[];
  onDifficultyChange: (d: Difficulty | 'all') => void;
  onSourceChange: (s: string) => void;
}

export default function FilterBar({
  selectedDifficulty,
  selectedSource,
  sources,
  onDifficultyChange,
  onSourceChange,
}: FilterBarProps) {
  const btnBase =
    'text-sm px-3 py-1.5 rounded-md border border-[#D8D2C8] transition-colors duration-200 font-zh-serif';

  return (
    <div className="flex flex-col gap-3">
      {/* 难度行 */}
      <div className="flex items-center gap-2.5">
        <span className="text-[15px] text-[#78716C] font-bold w-10 shrink-0 font-zh-serif -mt-px ml-0.5">
          难度
        </span>
        {DIFFICULTY_FILTERS.map(({ key, label, activeClass }) => {
          const active = selectedDifficulty === key;
          return (
            <button
              key={key}
              onClick={() => onDifficultyChange(key)}
              className={`${btnBase} ${
                active
                  ? activeClass
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
        <span className="text-[15px] text-[#78716C] font-bold w-10 shrink-0 font-zh-serif -mt-px ml-0.5">
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
