'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getKnownWords, addKnownWord, removeKnownWord } from '@/lib/storage';

interface KnownWordsContextType {
  knownWords: Set<string>;
  knownWordDates: Record<string, string>;
  markWordKnown: (word: string) => void;
  unmarkWordKnown: (word: string) => void;
}

const KnownWordsContext = createContext<KnownWordsContextType | null>(null);

export function KnownWordsProvider({ children }: { children: React.ReactNode }) {
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const [knownWordDates, setKnownWordDates] = useState<Record<string, string>>({});

  useEffect(() => {
    const dates = getKnownWords();
    setKnownWords(new Set(Object.keys(dates)));
    setKnownWordDates(dates);
  }, []);

  const markWordKnown = useCallback((word: string) => {
    addKnownWord(word);
    const lower = word.toLowerCase();
    setKnownWords(prev => new Set(prev).add(lower));
    setKnownWordDates(prev => ({ ...prev, [lower]: new Date().toISOString().split('T')[0] }));
  }, []);

  const unmarkWordKnown = useCallback((word: string) => {
    removeKnownWord(word);
    const lower = word.toLowerCase();
    setKnownWords(prev => {
      const next = new Set(prev);
      next.delete(lower);
      return next;
    });
    setKnownWordDates(prev => {
      const next = { ...prev };
      delete next[lower];
      return next;
    });
  }, []);

  return (
    <KnownWordsContext.Provider value={{ knownWords, knownWordDates, markWordKnown, unmarkWordKnown }}>
      {children}
    </KnownWordsContext.Provider>
  );
}

export function useKnownWords(): KnownWordsContextType {
  const ctx = useContext(KnownWordsContext);
  if (!ctx) throw new Error('useKnownWords must be used within KnownWordsProvider');
  return ctx;
}
