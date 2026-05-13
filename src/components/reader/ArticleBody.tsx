'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import type { VocabMap, VocabEntry } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { lookupWord, getDifficultyColor } from '@/lib/vocab';
import WordPopup from './WordPopup';

interface ArticleBodyProps {
  content: string;
  vocab: VocabMap;
  onParagraphSelect?: (index: number) => void;
  closeReadingEnabled?: boolean;
  selectedParagraph?: number;
}

interface PopupData {
  word: string;
  entry: VocabEntry;
  x: number;
  y: number;
}

export default function ArticleBody({ content, vocab, onParagraphSelect, closeReadingEnabled, selectedParagraph }: ArticleBodyProps) {
  const { knownWords, highlightEnabled, saveWordToCollection, isWordInCollection } =
    useAppContext();
  const [popup, setPopup] = useState<PopupData | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const paragraphs = useMemo(
    () => content.split(/\n\n+/).filter(p => p.trim()),
    [content],
  );

  const handleSave = useCallback(
    (word: string) => {
      if (!popup) return;
      saveWordToCollection({
        word,
        definition: popup.entry.definition,
        difficulty: popup.entry.difficulty,
        date: new Date().toISOString().split('T')[0],
        articleTitle: '',
      });
      setPopup(null);
    },
    [popup, saveWordToCollection],
  );

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setPopup(null), 200);
  }, []);

  const headingClasses: Record<string, string> = {
    h1: 'font-display text-xl',
    h2: 'font-display text-lg',
    h3: 'font-display text-base',
  };

  return (
    <div className="relative">
      {paragraphs.map((text, pIdx) => {
        const headingMatch = text.match(/^(#{1,3})\s+(.+)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const headingText = headingMatch[2];
          const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
          return (
            <Tag
              key={pIdx}
              className={`text-[#2D2B28] mb-3 mt-6 first:mt-0 ${headingClasses[Tag]}`}
            >
              {renderTextWithHighlights(
                headingText,
                vocab,
                knownWords,
                highlightEnabled,
                setPopup,
                scheduleClose,
                clearCloseTimer,
              )}
            </Tag>
          );
        }

        const isSelected = closeReadingEnabled && selectedParagraph === pIdx;
        return (
          <p
            key={pIdx}
            className={`leading-[1.85] text-[18px] text-[#2D2B28] font-serif [text-indent:2em] px-8 py-2 ${
              closeReadingEnabled
                ? 'cursor-pointer transition-colors duration-200 hover:bg-[#F3EFE6]'
                : ''
            } ${isSelected ? 'bg-[#EBE6DA]' : ''}`}
            onClick={closeReadingEnabled ? () => onParagraphSelect?.(pIdx) : undefined}
          >
            {renderTextWithHighlights(
              text,
              vocab,
              knownWords,
              highlightEnabled,
              setPopup,
              scheduleClose,
              clearCloseTimer,
            )}
          </p>
        );
      })}

      {popup && (
        <WordPopup
          word={popup.word}
          entry={popup.entry}
          position={{ x: popup.x, y: popup.y }}
          isSaved={isWordInCollection(popup.word)}
          onSave={handleSave}
          onMouseEnter={clearCloseTimer}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

function renderTextWithHighlights(
  text: string,
  vocab: VocabMap,
  knownWords: Set<string>,
  enabled: boolean,
  setPopup: (p: PopupData | null) => void,
  scheduleClose: () => void,
  clearCloseTimer: () => void,
): React.ReactNode[] {
  const parts = text.split(/(\b[a-zA-Z]+(?:[''][a-zA-Z]+)?\b)/g);
  const known = new Set(knownWords);

  // First pass: identify which parts are highlighted words
  const items = parts.map(part => {
    const isWord = /^[a-zA-Z]/.test(part);
    if (!isWord || !enabled) return { text: part, hl: false, entry: null as VocabEntry | null };
    const entry = lookupWord(part, vocab, known);
    return { text: part, hl: !!entry, entry };
  });

  // Second pass: merge consecutive highlighted words with separators between them
  const result: React.ReactNode[] = [];
  let i = 0;
  let runKey = 0;

  while (i < items.length) {
    if (!items[i].hl) {
      result.push(<span key={runKey++}>{items[i].text}</span>);
      i++;
      continue;
    }

    // Start a highlighted run
    const runStart = i;
    let combined = items[i].text;
    const entry = items[i].entry!;
    i++;
    // Absorb separator + next highlighted word
    while (i + 1 < items.length && !items[i].hl && items[i + 1].hl) {
      combined += items[i].text + items[i + 1].text;
      i += 2;
    }

    const colorClass = getDifficultyColor(entry.difficulty);
    const word = items[runStart].text;
    result.push(
      <span
        key={runKey++}
        className={`relative cursor-pointer ${colorClass}`}
        onMouseEnter={e => {
          clearCloseTimer();
          const rect = e.currentTarget.getBoundingClientRect();
          setPopup({
            word,
            entry,
            x: rect.left,
            y: rect.bottom + 10,
          });
        }}
        onMouseLeave={scheduleClose}
      >
        {combined}
      </span>,
    );
  }

  return result;
}
