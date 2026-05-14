'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { VocabEntry } from '@/types';
import { getDifficultyDotColor } from '@/lib/vocab';
import { Star, Check } from 'lucide-react';

interface WordPopupProps {
  word: string;
  entry: VocabEntry;
  wordLeft: number;
  wordTop: number;
  wordBottom: number;
  isSaved: boolean;
  isKnown: boolean;
  closing?: boolean;
  onToggleSave: (word: string) => void;
  onToggleKnown: (word: string) => void;
  onMouseEnter?: () => void;
  onClose: () => void;
  onAnimationEnd?: () => void;
}

const GAP_BELOW = 5;
const GAP_ABOVE = 8;
const LEFT_SHIFT = 12;
const VIEWPORT_PAD = 16;
const RIGHT_GAP = 30;

const btnBase = 'flex items-center gap-1 text-xs px-2 py-0.5 rounded-md transition-colors shrink-0 font-semibold';

// Split a definition string that may contain multiple POS entries
// e.g. "离弃，丢弃；放弃 n. 放任；纵情" → [{pos:"vt.", def:"离弃，丢弃；放弃"}, {pos:"n.", def:"放任；纵情"}]
function parseDefinitionParts(pos: string, definition: string): Array<{ pos: string; def: string }> {
  const POS_RE = /(?:^|\s+)(n\.|vt\.|vi\.|v\.|adj\.|adv\.|a\.|ad\.|prep\.|pron\.|conj\.|det\.)\s+/gm;

  const breakpoints: Array<{ pos: string; start: number; end: number }> = [];
  let match: RegExpExecArray | null;
  while ((match = POS_RE.exec(definition)) !== null) {
    breakpoints.push({ pos: match[1], start: match.index, end: match.index + match[0].length });
  }

  if (breakpoints.length === 0) {
    return [{ pos, def: definition.trim() }];
  }

  const parts: Array<{ pos: string; def: string }> = [];
  let firstDef = definition.slice(0, breakpoints[0].start).trim();

  // If the entry's primary POS has no definition (def starts with another POS),
  // merge the POS labels so "det." + "pron." → "det., pron."
  if (!firstDef && breakpoints[0].start === 0 && breakpoints.length > 0) {
    const mergedPos = pos + ' ' + breakpoints[0].pos;
    const next = breakpoints.length > 1 ? breakpoints[1].start : definition.length;
    parts.push({ pos: mergedPos, def: definition.slice(breakpoints[0].end, next).trim() });
    for (let i = 1; i < breakpoints.length; i++) {
      const bp = breakpoints[i];
      const n = i + 1 < breakpoints.length ? breakpoints[i + 1].start : definition.length;
      parts.push({ pos: bp.pos, def: definition.slice(bp.end, n).trim() });
    }
  } else {
    parts.push({ pos, def: firstDef });
    for (let i = 0; i < breakpoints.length; i++) {
      const bp = breakpoints[i];
      const n = i + 1 < breakpoints.length ? breakpoints[i + 1].start : definition.length;
      parts.push({ pos: bp.pos, def: definition.slice(bp.end, n).trim() });
    }
  }

  return parts.filter(p => p.def);
}

export default function WordPopup({
  word,
  entry,
  wordLeft,
  wordTop,
  wordBottom,
  isSaved,
  isKnown,
  closing,
  onToggleSave,
  onToggleKnown,
  onMouseEnter,
  onClose,
  onAnimationEnd,
}: WordPopupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

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

    let x = wordLeft - LEFT_SHIFT;
    const cardRight = x + rect.width;
    if (cardRight > vw - RIGHT_GAP) {
      x = vw - rect.width - RIGHT_GAP;
    }
    if (x < VIEWPORT_PAD - 12) x = VIEWPORT_PAD - 12;

    let y = wordBottom + GAP_BELOW;
    if (y + rect.height > vh - VIEWPORT_PAD) {
      y = wordTop - rect.height - GAP_ABOVE;
    }
    if (y < VIEWPORT_PAD - 12) y = VIEWPORT_PAD - 12;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }, [ready, wordLeft, wordTop, wordBottom]);

  if (!ready) return null;

  const defParts = parseDefinitionParts(entry.pos, entry.definition);

  return createPortal(
    <div
      ref={ref}
      className={`fixed z-50 bg-[#FEFCF5] rounded-xl shadow-[0_0_6px_0_rgba(0,0,0,0.08)] border border-[#E8E4DD] p-3 min-w-[200px] max-w-[380px] ${closing ? 'animate-popup-out' : 'animate-popup-in'}`}
      onMouseEnter={closing ? undefined : onMouseEnter}
      onMouseLeave={closing ? undefined : onClose}
      onAnimationEnd={closing ? onAnimationEnd : undefined}
    >
      {/* header: dot + word + buttons */}
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDifficultyDotColor(entry.difficulty)}`} />
        <span className="font-semibold text-lg text-[#2D2B28] relative top-[-1px]">{word}</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => onToggleKnown(word)}
            className={`${btnBase} ${
              isKnown
                ? 'bg-[#EDE9E0] text-[#7CB868] hover:bg-[#E8DCC8]'
                : 'bg-[#EDE9E0] text-[#78716C] hover:bg-[#E8DCC8] hover:text-[#5C3D2E]'
            }`}
          >
            <Check size={11} />
            {isKnown ? '已认识' : '认识'}
          </button>
          <button
            onClick={() => onToggleSave(word)}
            className={`${btnBase} ${
              isSaved
                ? 'bg-[#EDE9E0] text-[#C88C4A] hover:bg-[#E8DCC8]'
                : 'bg-[#EDE9E0] text-[#78716C] hover:bg-[#E8DCC8] hover:text-[#5C3D2E]'
            }`}
          >
            <Star size={11} fill={isSaved ? 'currentColor' : 'none'} />
            {isSaved ? '已收藏' : '收藏'}
          </button>
        </div>
      </div>

      {/* definition lines — one per POS */}
      <div className="mt-1.5 space-y-0.5 ml-0.5">
        {defParts.map((part, i) => (
          <p key={i} className="leading-relaxed truncate">
            <span className="text-[#5C3D2E] font-bold text-sm">{part.pos}</span>
            <span className="text-[#D8D2C8] ml-[3px] mr-[3px]">·</span>
            <span className="font-semibold text-sm text-[#78716C]">{part.def}</span>
          </p>
        ))}
      </div>
    </div>,
    document.body,
  );
}
