'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { VocabEntry } from '@/types';
import { getDifficultyDotColor } from '@/lib/vocab';
import { Star } from 'lucide-react';

interface WordPopupProps {
  word: string;
  entry: VocabEntry;
  position: { x: number; y: number };
  wordTop?: number;
  wordBottom?: number;
  isSaved: boolean;
  onToggleSave: (word: string) => void;
  onMouseEnter?: () => void;
  onClose: () => void;
}

export default function WordPopup({
  word,
  entry,
  position,
  wordTop,
  wordBottom,
  isSaved,
  onToggleSave,
  onMouseEnter,
  onClose,
}: WordPopupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let { x, y } = position;
    // Right edge overflow → flip left
    if (x + rect.width > vw - 16) x = x - rect.width - 8;
    // Bottom overflow → flip above (10px gap above word)
    if (y + rect.height > vh - 16 && wordTop != null) y = wordTop - rect.height - 10;
    // Left edge overflow
    if (x < 4) x = 4;
    // Top edge overflow
    if (y < 4) y = 4;
    ref.current.style.left = `${x}px`;
    ref.current.style.top = `${y}px`;
  }, [position]);

  const content = (
    <div
      ref={ref}
      className="fixed z-50 bg-[#FEFCF5] rounded-xl shadow-lg border border-[#E8E4DD] p-3 min-w-[200px] max-w-[280px] animate-popup-in"
      style={{ left: position.x, top: position.y }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDifficultyDotColor(entry.difficulty)}`} />
        <span className="font-semibold text-sm text-[#2D2B28]">{word}</span>
        <button
          onClick={() => onToggleSave(word)}
          className={`ml-auto flex items-center gap-1 text-xs px-2 py-0.5 rounded-md transition-colors shrink-0 ${
            isSaved
              ? 'bg-[#EDE9E0] text-[#C88C4A] hover:bg-[#E8DCC8]'
              : 'bg-[#EDE9E0] text-[#78716C] hover:bg-[#E8DCC8] hover:text-[#5C3D2E]'
          }`}
        >
          <Star size={11} fill={isSaved ? 'currentColor' : 'none'} />
          {isSaved ? '已收藏' : '收藏'}
        </button>
      </div>
      <p className="text-[13px] text-[#78716C] mt-1.5 leading-relaxed">
        <span className="text-[#5C3D2E] font-medium -mt-px ml-[3px] inline-block">{entry.pos}</span>
        <span className="ml-1.5 mr-px text-[#D8D2C8]">·</span>
        <span className="relative top-[2px]">{entry.definition}</span>
      </p>
    </div>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
