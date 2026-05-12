'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { VocabMap, VocabEntry } from '@/types';
import { loadVocab, analyzeText } from '@/lib/vocab';
import { useAppContext } from '@/context/AppContext';
import WordPanel from '@/components/reader/WordPanel';

export default function WordPanelWrapper({ content }: { content: string }) {
  const [vocab, setVocab] = useState<VocabMap | null>(null);
  const [knownInArticle, setKnownInArticle] = useState<Set<string>>(new Set());
  const { knownWords, markKnown } = useAppContext();

  useEffect(() => {
    loadVocab().then(setVocab);
  }, []);

  const allWords = useMemo(() => {
    if (!vocab) return [];
    return analyzeText(content, vocab, new Set()); // don't filter known words
  }, [content, vocab]);

  // split into unknown and known-in-article
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

  return (
    <WordPanel
      unknownWords={unknownWords}
      knownArticleWords={knownArticleWords}
      onMarkKnown={handleMarkKnown}
    />
  );
}
