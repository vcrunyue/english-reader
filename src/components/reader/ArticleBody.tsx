'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import type { VocabMap, VocabEntry } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { lookupWord, getDifficultyColor } from '@/lib/vocab';
import WordPopup from './WordPopup';

interface ArticleBodyProps {
  content: string;
  vocab: VocabMap;
}

interface PopupData {
  word: string;
  entry: VocabEntry;
  x: number;
  y: number;
}

export default function ArticleBody({ content, vocab }: ArticleBodyProps) {
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

  return (
    <div className="relative">
      {paragraphs.map((text, pIdx) => {
        const headingMatch = text.match(/^(#{1,3})\s+(.+)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const headingText = headingMatch[2];
          const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
          const headingClasses = {
            h1: 'text-xl',
            h2: 'text-lg',
            h3: 'text-base',
          };
          return (
            <Tag
              key={pIdx}
              className={`font-bold text-gray-900 mb-3 mt-6 first:mt-0 ${headingClasses[Tag]}`}
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

        return (
          <p key={pIdx} className="mb-3 leading-[1.8] text-[17px] text-gray-800 font-serif">
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

  return parts.map((part, i) => {
    const isWord = /^[a-zA-Z]/.test(part);
    if (!isWord) {
      return <span key={i}>{part}</span>;
    }

    if (!enabled) {
      return <span key={i}>{part}</span>;
    }

    const entry = lookupWord(part, vocab, known);
    if (!entry) {
      return <span key={i}>{part}</span>;
    }

    const colorClass = getDifficultyColor(entry.difficulty);

    return (
      <span
        key={i}
        className={`relative cursor-pointer ${colorClass}`}
        onMouseEnter={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPopup({
            word: part,
            entry,
            x: rect.left,
            y: rect.bottom + 4,
          });
        }}
        onMouseLeave={scheduleClose}
      >
        {part}
      </span>
    );
  });
}
