'use client';

import { useState, useEffect, useMemo } from 'react';
import type { VocabMap } from '@/types';
import { loadVocab, analyzeText } from '@/lib/vocab';
import { useAppContext } from '@/context/AppContext';
import WordPanel from '@/components/reader/WordPanel';

export default function WordPanelWrapper({ content }: { content: string }) {
  const [vocab, setVocab] = useState<VocabMap | null>(null);
  const { knownWords } = useAppContext();

  useEffect(() => {
    loadVocab().then(setVocab);
  }, []);

  const words = useMemo(() => {
    if (!vocab) return [];
    return analyzeText(content, vocab, knownWords);
  }, [content, vocab, knownWords]);

  return <WordPanel words={words} />;
}
