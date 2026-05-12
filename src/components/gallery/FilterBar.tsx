'use client';

import type { Difficulty } from '@/types';
import { getDifficultyLabel } from '@/lib/vocab';

interface FilterBarProps {
  selectedDifficulty: Difficulty | 'all';
  selectedSource: string;
  sources: string[];
  onDifficultyChange: (d: Difficulty | 'all') => void;
  onSourceChange: (s: string) => void;
}

const DIFFICULTIES: Array<{ key: Difficulty | 'all'; label: string; style: string }> = [
  { key: 'all', label: '全部', style: 'bg-[#EDE9E0] text-[#5C3D2E]' },
  { key: 'cet4', label: '四级', style: 'bg-[#D4E8D0] text-[#3A5C34]' },
  { key: 'cet6', label: '六级', style: 'bg-[#F5E6C8] text-[#5C4A1E]' },
  { key: 'postgrad', label: '考研', style: 'bg-[#F0D3D3] text-[#5C2A2A]' },
];

export default function FilterBar({
  selectedDifficulty,
  selectedSource,
  sources,
  onDifficultyChange,
  onSourceChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
      {/* 难度筛选 */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-[#78716C] font-medium mr-1 font-zh-serif">难度</span>
        {DIFFICULTIES.map(({ key, label, style }) => (
          <button
            key={key}
            onClick={() => onDifficultyChange(key)}
            className={`text-sm px-3 py-1.5 rounded-md border transition-colors duration-200 min-w-[44px] ${
              selectedDifficulty === key
                ? `${style} border-transparent`
                : 'bg-transparent text-[#78716C] border-[#D8D2C8] hover:border-[#C88C4A] hover:text-[#5C3D2E]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 来源筛选 */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-[#78716C] font-medium mr-1 font-zh-serif">来源</span>
        {['all', ...sources].map(s => (
          <button
            key={s}
            onClick={() => onSourceChange(s)}
            className={`text-sm px-3 py-1.5 rounded-md border transition-colors duration-200 min-w-[44px] ${
              selectedSource === s
                ? 'bg-[#EDE0C8] text-[#5C3D2E] border-transparent'
                : 'bg-transparent text-[#78716C] border-[#D8D2C8] hover:border-[#C88C4A] hover:text-[#5C3D2E]'
            }`}
          >
            {s === 'all' ? '全部' : s}
          </button>
        ))}
      </div>
    </div>
  );
}
