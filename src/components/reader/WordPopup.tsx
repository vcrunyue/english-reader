'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { VocabEntry } from '@/types';
import { getDifficultyDotColor, parseDefinitionParts } from '@/lib/vocab';
import { Star, Check, X } from 'lucide-react';

interface WordPopupProps {
  id: string;
  trigger: HTMLButtonElement;
  word: string;
  entry: VocabEntry;
  wordLeft: number;
  wordTop: number;
  wordBottom: number;
  isSaved: boolean;
  isKnown: boolean;
  closing?: boolean;
  focusOnOpen?: boolean;
  onToggleSave: (word: string) => void;
  onToggleKnown: (word: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
  onAnchorDisconnect: () => void;
  onAnimationEnd?: () => void;
}

const GAP_BELOW = 5;
const GAP_ABOVE = 8;
const LEFT_SHIFT = 12;
const VIEWPORT_PAD = 16;

const btnBase = 'group flex min-h-11 min-w-11 shrink-0 items-center justify-center p-0 text-xs font-semibold';
const actionSurface = 'inline-flex h-7 items-center justify-center gap-1 rounded-md px-1.5 transition-colors';

function clampPopupX(anchorLeft: number, width: number, viewportWidth: number): number {
  const furthestRight = Math.max(VIEWPORT_PAD, viewportWidth - width - VIEWPORT_PAD);
  return Math.min(Math.max(anchorLeft - LEFT_SHIFT, VIEWPORT_PAD), furthestRight);
}

function choosePopupY(
  anchorTop: number,
  anchorBottom: number,
  height: number,
  viewportHeight: number,
): number {
  const lowestTop = Math.max(VIEWPORT_PAD, viewportHeight - height - VIEWPORT_PAD);
  const below = anchorBottom + GAP_BELOW;
  if (below + height <= viewportHeight - VIEWPORT_PAD) {
    return Math.min(Math.max(below, VIEWPORT_PAD), lowestTop);
  }

  return Math.min(
    Math.max(VIEWPORT_PAD, anchorTop - height - GAP_ABOVE),
    lowestTop,
  );
}

function positionPopup(
  element: HTMLDivElement,
  trigger: HTMLButtonElement,
): boolean {
  if (!trigger.isConnected) {
    return false;
  }

  const anchorRect = trigger.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const x = clampPopupX(anchorRect.left, rect.width, viewportWidth);
  const y = choosePopupY(
    anchorRect.top,
    anchorRect.bottom,
    rect.height,
    viewportHeight,
  );

  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  element.style.visibility = 'visible';
  return true;
}

export default function WordPopup({
  id,
  trigger,
  word,
  entry,
  wordLeft,
  wordTop,
  wordBottom,
  isSaved,
  isKnown,
  closing,
  focusOnOpen,
  onToggleSave,
  onToggleKnown,
  onMouseEnter,
  onMouseLeave,
  onClose,
  onAnchorDisconnect,
  onAnimationEnd,
}: WordPopupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const firstActionRef = useRef<HTMLButtonElement>(null);
  const lastFocusedTriggerRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reposition = () => {
      if (!positionPopup(el, trigger)) {
        onAnchorDisconnect();
        return false;
      }
      return true;
    };
    if (!reposition()) return;

    if (focusOnOpen && lastFocusedTriggerRef.current !== trigger) {
      const firstAction = firstActionRef.current;
      if (firstAction) {
        firstAction.focus();
        lastFocusedTriggerRef.current = trigger;
      }
    }

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(reposition);
    const visualViewport = window.visualViewport;
    resizeObserver?.observe(el);
    resizeObserver?.observe(trigger);
    window.addEventListener('resize', reposition);
    visualViewport?.addEventListener('resize', reposition);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', reposition);
      visualViewport?.removeEventListener('resize', reposition);
    };
  }, [
    focusOnOpen,
    isKnown,
    isSaved,
    onAnchorDisconnect,
    trigger,
    wordLeft,
    wordTop,
    wordBottom,
  ]);

  useEffect(() => {
    if (closing) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closing, onClose]);

  const defParts = parseDefinitionParts(entry.pos, entry.definition);

  return createPortal(
    <div
      id={id}
      ref={ref}
      role="dialog"
      aria-label={`${word} 的释义`}
      style={{ left: 0, top: 0, visibility: 'hidden' }}
      className={`fixed z-50 max-h-[calc(100dvh-2rem)] min-w-[200px] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-[#E8E4DD] bg-[#FEFCF5] p-3 shadow-[0_0_6px_0_rgba(0,0,0,0.08)] sm:max-w-[380px] ${closing ? 'animate-popup-out' : 'animate-popup-in'}`}
      onMouseEnter={closing ? undefined : onMouseEnter}
      onMouseLeave={
        closing
          ? undefined
          : event => {
              if (event.currentTarget.contains(document.activeElement)) return;
              onMouseLeave();
            }
      }
      onAnimationEnd={closing ? onAnimationEnd : undefined}
    >
      {/* header: dot + word + buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span aria-hidden="true" className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDifficultyDotColor(entry.difficulty)}`} />
        <span className="font-semibold text-lg text-[#2D2B28] relative top-[-1px]">{word}</span>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-1">
          <button
            ref={firstActionRef}
            type="button"
            aria-label={isKnown ? `将 ${word} 标记为不认识` : `将 ${word} 标记为认识`}
            onClick={() => onToggleKnown(word)}
            className={btnBase}
          >
            <span className={`${actionSurface} ${
              isKnown
                ? 'bg-[#EDE9E0] text-[#7CB868] group-hover:bg-[#E8DCC8]'
                : 'bg-[#EDE9E0] text-[#78716C] group-hover:bg-[#E8DCC8] group-hover:text-[#5C3D2E]'
            }`}>
              <Check aria-hidden="true" size={11} />
              {isKnown ? '已认识' : '认识'}
            </span>
          </button>
          <button
            type="button"
            aria-label={isSaved ? `取消收藏 ${word}` : `收藏 ${word}`}
            onClick={() => onToggleSave(word)}
            className={btnBase}
          >
            <span className={`${actionSurface} ${
              isSaved
                ? 'bg-[#EDE9E0] text-[#C88C4A] group-hover:bg-[#E8DCC8]'
                : 'bg-[#EDE9E0] text-[#78716C] group-hover:bg-[#E8DCC8] group-hover:text-[#5C3D2E]'
            }`}>
              <Star aria-hidden="true" size={11} fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? '已收藏' : '收藏'}
            </span>
          </button>
          <button
            type="button"
            aria-label="关闭释义"
            onClick={onClose}
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-[#78716C] transition-colors hover:bg-[#E8DCC8] hover:text-[#5C3D2E]"
          >
            <X aria-hidden="true" size={16} />
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
