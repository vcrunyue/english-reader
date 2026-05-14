'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { VocabEntry } from '@/types';
import { getDifficultyDotColor } from '@/lib/vocab';
import { Star } from 'lucide-react';

interface WordPopupProps {
  word: string;
  entry: VocabEntry;
  wordLeft: number;
  wordTop: number;
  wordBottom: number;
  isSaved: boolean;
  closing?: boolean;
  onToggleSave: (word: string) => void;
  onMouseEnter?: () => void;
  onClose: () => void;
  onAnimationEnd?: () => void;
}

const GAP_BELOW = 4;
const GAP_ABOVE = 8;
const LEFT_SHIFT = 8;
const VIEWPORT_PAD = 16;
const FLIP_MARGIN = 8;

export default function WordPopup({
  word,
  entry,
  wordLeft,
  wordTop,
  wordBottom,
  isSaved,
  closing,
  onToggleSave,
  onMouseEnter,
  onClose,
  onAnimationEnd,
}: WordPopupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Single effect: handles both initial mount and repositioning
  useLayoutEffect(() => {
    if (!ready) {
      setReady(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // x: left-align with word, shifted LEFT_SHIFT px left
    let x = wordLeft - LEFT_SHIFT;
    if (x + rect.width > vw - VIEWPORT_PAD) {
      x = wordLeft - rect.width - FLIP_MARGIN;
    }
    if (x < VIEWPORT_PAD - 12) x = VIEWPORT_PAD - 12;

    // y: prefer below word (4px), flip above (8px) if overflow
    let y = wordBottom + GAP_BELOW;
    if (y + rect.height > vh - VIEWPORT_PAD) {
      y = wordTop - rect.height - GAP_ABOVE;
    }
    if (y < VIEWPORT_PAD - 12) y = VIEWPORT_PAD - 12;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }, [ready, wordLeft, wordTop, wordBottom]);

  if (!ready) return null;

  return createPortal(
    <div
      ref={ref}
      className={`fixed z-50 bg-[#FEFCF5] rounded-xl shadow-sm border border-[#E8E4DD] p-3 min-w-[200px] max-w-[280px] ${closing ? 'animate-popup-out' : 'animate-popup-in'}`}
      onMouseEnter={closing ? undefined : onMouseEnter}
      onMouseLeave={closing ? undefined : onClose}
      onAnimationEnd={closing ? onAnimationEnd : undefined}
    >
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDifficultyDotColor(entry.difficulty)}`} />
        <span className="font-semibold text-lg text-[#2D2B28] relative top-[-1px]">{word}</span>
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
        <span className="text-[#5C3D2E] font-bold text-sm -mt-px ml-[3px] inline-block">{entry.pos}</span>
        <span className="ml-1.5 mr-px text-[#D8D2C8]">·</span>
        <span className="relative top-[1px] -ml-[4px] font-semibold text-sm">{entry.definition}</span>
      </p>
    </div>,
    document.body,
  );
}
