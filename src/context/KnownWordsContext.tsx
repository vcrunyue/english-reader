'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { getKnownWords, addKnownWord, removeKnownWord } from '@/lib/storage';
import { useClientReady } from '@/hooks/use-client-ready';

interface KnownWordsContextType {
  knownWords: Set<string>;
  knownWordDates: Record<string, string>;
  markWordKnown: (word: string) => void;
  unmarkWordKnown: (word: string) => void;
}

const KnownWordsContext = createContext<KnownWordsContextType | null>(null);

const EMPTY_KNOWN_WORDS: KnownWordsContextType = {
  knownWords: new Set(),
  knownWordDates: {},
  markWordKnown: () => undefined,
  unmarkWordKnown: () => undefined,
};

export function KnownWordsProvider({ children }: { children: React.ReactNode }) {
  const ready = useClientReady();

  if (!ready) {
    return (
      <KnownWordsContext.Provider value={EMPTY_KNOWN_WORDS}>
        {children}
      </KnownWordsContext.Provider>
    );
  }

  return <HydratedKnownWordsProvider>{children}</HydratedKnownWordsProvider>;
}

function HydratedKnownWordsProvider({ children }: { children: React.ReactNode }) {
  const [{ knownWords, knownWordDates }, setKnownWordState] = useState(() => {
    const dates = getKnownWords();
    return {
      knownWords: new Set(Object.keys(dates)),
      knownWordDates: dates,
    };
  });

  const markWordKnown = useCallback((word: string) => {
    addKnownWord(word);
    const lower = word.toLowerCase();
    setKnownWordState(prev => ({
      knownWords: new Set(prev.knownWords).add(lower),
      knownWordDates: {
        ...prev.knownWordDates,
        [lower]: new Date().toISOString().split('T')[0],
      },
    }));
  }, []);

  const unmarkWordKnown = useCallback((word: string) => {
    removeKnownWord(word);
    const lower = word.toLowerCase();
    setKnownWordState(prev => {
      const next = new Set(prev.knownWords);
      next.delete(lower);
      const nextDates = { ...prev.knownWordDates };
      delete nextDates[lower];
      return {
        knownWords: next,
        knownWordDates: nextDates,
      };
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
