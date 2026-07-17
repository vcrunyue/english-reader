'use client';

import { useState, useEffect, useMemo, useCallback, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import type { VocabMap, VocabEntry } from '@/types';
import { useKnownWords } from '@/context/KnownWordsContext';
import { useCollection } from '@/context/CollectionContext';
import { useReading } from '@/context/ReadingContext';
import { lookupWord, getDifficultyColor } from '@/lib/vocab';
import { parseArticleContent } from '@/lib/article-content';
import WordPopup from './WordPopup';

interface ArticleBodyProps {
  content: string;
  vocab: VocabMap;
  onParagraphSelect?: (index: number) => void;
  closeReadingEnabled?: boolean;
  selectedParagraph?: number;
}

interface PopupData {
  anchorKey: string;
  trigger: HTMLButtonElement;
  word: string;
  entry: VocabEntry;
  wordLeft: number;
  wordTop: number;
  wordBottom: number;
  closing?: boolean;
  focusOnOpen?: boolean;
  restoreFocus?: boolean;
}

interface OpenWordOptions {
  focusPopup?: boolean;
  fromFocus?: boolean;
}

interface HighlightedTextProps {
  text: string;
  vocab: VocabMap;
  knownWords: Set<string>;
  enabled: boolean;
  anchorPrefix: string;
  popupId: string;
  expandedAnchorKey: string | null;
  onOpenWord: (
    anchor: HTMLButtonElement,
    anchorKey: string,
    word: string,
    entry: VocabEntry,
    options?: OpenWordOptions,
  ) => void;
  onScheduleClose: () => void;
}

interface HighlightedWordProps {
  word: string;
  entry: VocabEntry;
  anchorKey: string;
  popupId: string;
  expanded: boolean;
  onOpenWord: (
    anchor: HTMLButtonElement,
    anchorKey: string,
    word: string,
    entry: VocabEntry,
    options?: OpenWordOptions,
  ) => void;
  onScheduleClose: () => void;
}

const headingClasses: Record<'h1' | 'h2' | 'h3', string> = {
  h1: 'font-display text-xl',
  h2: 'font-display text-lg',
  h3: 'font-display text-base',
};

export default function ArticleBody({ content, vocab, onParagraphSelect, closeReadingEnabled, selectedParagraph }: ArticleBodyProps) {
  const { knownWords, markWordKnown, unmarkWordKnown } = useKnownWords();
  const { highlightEnabled } = useReading();
  const { saveWordToCollection, removeWordFromCollection, isWordInCollection } = useCollection();
  const [popup, setPopup] = useState<PopupData | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressFocusOpenRef = useRef(false);
  const popupId = useId();

  const blocks = useMemo(() => parseArticleContent(content), [content]);

  const handleToggleSave = useCallback(
    (word: string) => {
      if (!popup) return;
      if (isWordInCollection(word)) {
        removeWordFromCollection(word);
      } else {
        saveWordToCollection({
          word,
          definition: popup.entry.definition,
          pos: popup.entry.pos,
          difficulty: popup.entry.difficulty,
          date: new Date().toISOString().split('T')[0],
          articleTitle: '',
        });
        // Mutual exclusion: if marking as saved, remove from known
        if (knownWords.has(word.toLowerCase())) {
          unmarkWordKnown(word);
        }
      }
    },
    [popup, saveWordToCollection, removeWordFromCollection, isWordInCollection, knownWords, unmarkWordKnown],
  );

  const handleToggleKnown = useCallback(
    (word: string) => {
      const lower = word.toLowerCase();
      if (knownWords.has(lower)) {
        unmarkWordKnown(word);
      } else {
        markWordKnown(word);
        // Mutual exclusion: if marking as known, remove from saved
        if (isWordInCollection(word)) {
          removeWordFromCollection(word);
        }
      }
    },
    [knownWords, markWordKnown, unmarkWordKnown, isWordInCollection, removeWordFromCollection],
  );

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setPopup(current =>
        current ? { ...current, closing: true, restoreFocus: false } : null,
      );
    }, 200);
  }, [clearCloseTimer]);

  const closeAndRestoreFocus = useCallback(() => {
    clearCloseTimer();
    setPopup(current =>
      current ? { ...current, closing: true, restoreFocus: true } : null,
    );
  }, [clearCloseTimer]);

  const closeDisconnectedPopup = useCallback(() => {
    clearCloseTimer();
    setPopup(null);
  }, [clearCloseTimer]);

  const handleOpenWord = useCallback(
    (
      anchor: HTMLButtonElement,
      anchorKey: string,
      word: string,
      entry: VocabEntry,
      options: OpenWordOptions = {},
    ) => {
      if (options.fromFocus && suppressFocusOpenRef.current) {
        suppressFocusOpenRef.current = false;
        return;
      }

      clearCloseTimer();
      const rect = anchor.getBoundingClientRect();

      setPopup(current => {
        if (
          current &&
          !current.closing &&
          current.anchorKey === anchorKey &&
          current.trigger === anchor &&
          current.word === word &&
          current.entry === entry &&
          current.wordLeft === rect.left &&
          current.wordTop === rect.top &&
          current.wordBottom === rect.bottom &&
          (!options.focusPopup || current.focusOnOpen)
        ) {
          return current;
        }

        return {
          anchorKey,
          trigger: anchor,
          word,
          entry,
          wordLeft: rect.left,
          wordTop: rect.top,
          wordBottom: rect.bottom,
          focusOnOpen: options.focusPopup,
        };
      });
    },
    [clearCloseTimer],
  );

  const handlePopupAnimationEnd = useCallback(() => {
    const trigger = popup?.trigger;
    const shouldRestoreFocus = popup?.restoreFocus;
    setPopup(null);

    if (
      shouldRestoreFocus &&
      trigger?.isConnected &&
      document.activeElement !== trigger
    ) {
      suppressFocusOpenRef.current = true;
      trigger.focus({ preventScroll: true });

      if (document.activeElement !== trigger) {
        suppressFocusOpenRef.current = false;
      }
    }
  }, [popup]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  // Dismiss popup on any scroll
  useEffect(() => {
    if (!popup || popup.closing) return;
    const handleScroll = () => {
      clearCloseTimer();
      setPopup(null);
    };
    document.addEventListener('scroll', handleScroll, true);
    return () => document.removeEventListener('scroll', handleScroll, true);
  }, [clearCloseTimer, popup]);

  const expandedAnchorKey = popup && !popup.closing ? popup.anchorKey : null;

  return (
    <div className="relative">
      {blocks.map((block, blockIndex) => {
        if (block.type === 'heading') {
          const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3';
          return (
            <Tag
              key={`heading-${blockIndex}`}
              className={`text-[#2D2B28] mb-3 mt-6 first:mt-0 ${headingClasses[Tag]}`}
            >
              <HighlightedText
                text={block.text}
                vocab={vocab}
                knownWords={knownWords}
                enabled={highlightEnabled}
                anchorPrefix={`heading-${blockIndex}`}
                popupId={popupId}
                expandedAnchorKey={expandedAnchorKey}
                onOpenWord={handleOpenWord}
                onScheduleClose={scheduleClose}
              />
            </Tag>
          );
        }

        const isSelected = closeReadingEnabled && selectedParagraph === block.paragraphIndex;
        return (
          <p
            key={`paragraph-${blockIndex}`}
            className={`leading-[1.85] text-[18px] text-[#2D2B28] font-serif [text-indent:2em] px-8 py-2 ${
              closeReadingEnabled
                ? 'cursor-pointer transition-colors duration-200 hover:bg-[#F3EFE6]'
                : ''
            } ${isSelected ? 'bg-[#EBE6DA]' : ''}`}
            onClick={closeReadingEnabled ? () => onParagraphSelect?.(block.paragraphIndex) : undefined}
          >
            <HighlightedText
              text={block.text}
              vocab={vocab}
              knownWords={knownWords}
              enabled={highlightEnabled}
              anchorPrefix={`paragraph-${block.paragraphIndex}`}
              popupId={popupId}
              expandedAnchorKey={expandedAnchorKey}
              onOpenWord={handleOpenWord}
              onScheduleClose={scheduleClose}
            />
          </p>
        );
      })}

      {popup && (
        <WordPopup
          key={popup.anchorKey}
          id={popupId}
          trigger={popup.trigger}
          word={popup.word}
          entry={popup.entry}
          wordLeft={popup.wordLeft}
          wordTop={popup.wordTop}
          wordBottom={popup.wordBottom}
          isSaved={isWordInCollection(popup.word)}
          isKnown={knownWords.has(popup.word.toLowerCase())}
          closing={popup.closing}
          focusOnOpen={popup.focusOnOpen}
          onToggleSave={handleToggleSave}
          onToggleKnown={handleToggleKnown}
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
          onClose={closeAndRestoreFocus}
          onAnchorDisconnect={closeDisconnectedPopup}
          onAnimationEnd={handlePopupAnimationEnd}
        />
      )}
    </div>
  );
}

function HighlightedText({
  text,
  vocab,
  knownWords,
  enabled,
  anchorPrefix,
  popupId,
  expandedAnchorKey,
  onOpenWord,
  onScheduleClose,
}: HighlightedTextProps): ReactNode {
  const parts = text.split(/(\b[a-zA-Z]+(?:[''][a-zA-Z]+)?\b)/g);

  return (
    <>
      {parts.map((part, index) => {
        const isWord = /^[a-zA-Z]/.test(part);
        if (!isWord) {
          return <span key={index}>{part}</span>;
        }

        if (!enabled) {
          return <span key={index} className="px-0.5">{part}</span>;
        }

        const entry = lookupWord(part, vocab, knownWords);
        if (!entry) {
          return <span key={index} className="px-0.5">{part}</span>;
        }

        return (
          <HighlightedWord
            key={index}
            word={part}
            entry={entry}
            anchorKey={`${anchorPrefix}-${index}`}
            popupId={popupId}
            expanded={expandedAnchorKey === `${anchorPrefix}-${index}`}
            onOpenWord={onOpenWord}
            onScheduleClose={onScheduleClose}
          />
        );
      })}
    </>
  );
}

function HighlightedWord({
  word,
  entry,
  anchorKey,
  popupId,
  expanded,
  onOpenWord,
  onScheduleClose,
}: HighlightedWordProps) {
  const colorClass = getDifficultyColor(entry.difficulty);

  return (
    <button
      type="button"
      aria-label={`查看 ${word} 的释义`}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls={popupId}
      className={`relative inline cursor-pointer appearance-none border-0 px-0.5 py-0 align-baseline leading-[1.45] ${colorClass}`}
      onMouseEnter={event => onOpenWord(event.currentTarget, anchorKey, word, entry)}
      onMouseLeave={onScheduleClose}
      onFocus={event =>
        onOpenWord(event.currentTarget, anchorKey, word, entry, { fromFocus: true })
      }
      onKeyDown={event => {
        if (event.key !== 'ArrowDown') return;
        event.preventDefault();
        onOpenWord(event.currentTarget, anchorKey, word, entry, { focusPopup: true });
      }}
      onClick={event => {
        event.stopPropagation();
        onOpenWord(
          event.currentTarget,
          anchorKey,
          word,
          entry,
          event.detail === 0 ? { focusPopup: true } : undefined,
        );
      }}
    >
      {word}
    </button>
  );
}
