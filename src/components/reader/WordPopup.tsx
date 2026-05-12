'use client';

import { useEffect, useRef } from 'react';
import type { VocabEntry } from '@/types';
import { getDifficultyDotColor, getDifficultyLabel } from '@/lib/vocab';
import { Star } from 'lucide-react';

interface WordPopupProps {
  word: string;
  entry: VocabEntry;
  position: { x: number; y: number };
  isSaved: boolean;
  onSave: (word: string) => void;
  onMouseEnter?: () => void;
  onClose: () => void;
}

export default function WordPopup({
  word,
  entry,
  position,
  isSaved,
  onSave,
  onMouseEnter,
  onClose,
}: WordPopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let { x, y } = position;
    if (x + rect.width > vw - 16) x = vw - rect.width - 16;
    if (y + rect.height > vh - 16) y = y - rect.height - 8;
    if (x < 0) x = 4;
    if (y < 0) y = 4;
    ref.current.style.left = `${x}px`;
    ref.current.style.top = `${y}px`;
  }, [position]);

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-[#FEFCF5] rounded-xl shadow-lg border border-[#E8E4DD] p-3 min-w-[180px] max-w-[240px]"
      style={{ left: position.x, top: position.y }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2.5 h-2.5 rounded-full ${getDifficultyDotColor(entry.difficulty)}`} />
        <span className="font-semibold text-sm text-[#2D2B28]">{word}</span>
        <span className="text-[11px] text-[#78716C]">
          {getDifficultyLabel(entry.difficulty)}
        </span>
      </div>
      <p className="text-xs text-[#78716C] mb-0.5">{entry.pos}</p>
      <p className="text-sm text-[#2D2B28] mb-2">{entry.definition}</p>
      <button
        onClick={() => onSave(word)}
        disabled={isSaved}
        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors ${
          isSaved
            ? 'bg-[#EDE9E0] text-[#C88C4A]'
            : 'bg-[#EDE9E0] text-[#78716C] hover:bg-[#E8DCC8] hover:text-[#5C3D2E]'
        }`}
      >
        <Star size={12} fill={isSaved ? 'currentColor' : 'none'} />
        {isSaved ? '已收藏' : '收藏'}
      </button>
    </div>
  );
}
