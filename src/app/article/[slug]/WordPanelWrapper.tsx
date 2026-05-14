'use client';

import { useState, useMemo, useCallback } from 'react';
import { analyzeText } from '@/lib/vocab';
import { useVocab } from '@/context/VocabContext';
import { useAppContext } from '@/context/AppContext';
import WordPanel from '@/components/reader/WordPanel';

interface Props {
  content: string;
  onTabChange?: (tab: 'words' | 'sentences') => void;
}

export default function WordPanelWrapper({ content, onTabChange }: Props) {
  const vocab = useVocab();
  const [knownInArticle, setKnownInArticle] = useState<Set<string>>(new Set());
  const { knownWords, markKnown, unmarkKnown } = useAppContext();

  const allWords = useMemo(() => {
    if (!vocab) return [];
    return analyzeText(content, vocab, new Set());
  }, [content, vocab]);

  const unknownWords = useMemo(
    () => allWords.filter(w => !knownInArticle.has(w.word) && !knownWords.has(w.word)),
    [allWords, knownInArticle, knownWords],
  );

  const knownArticleWords = useMemo(
    () => allWords.filter(w => knownInArticle.has(w.word)),
    [allWords, knownInArticle],
  );

  const handleMarkKnown = useCallback(
    (word: string) => {
      markKnown(word);
      setKnownInArticle(prev => new Set(prev).add(word));
    },
    [markKnown],
  );

  const handleUnmarkKnown = useCallback(
    (word: string) => {
      unmarkKnown(word);
      setKnownInArticle(prev => {
        const next = new Set(prev);
        next.delete(word);
        return next;
      });
    },
    [unmarkKnown],
  );

  return (
    <WordPanel
      unknownWords={unknownWords}
      knownArticleWords={knownArticleWords}
      onMarkKnown={handleMarkKnown}
      onUnmarkKnown={handleUnmarkKnown}
      onTabChange={onTabChange}
    />
  );
}
