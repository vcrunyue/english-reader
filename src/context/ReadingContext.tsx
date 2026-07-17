'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useClientReady } from '@/hooks/use-client-ready';
import {
  getHighlightEnabled,
  setHighlightEnabled,
  getCloseReadingEnabled,
  setCloseReadingEnabled,
  getReadArticles,
  markArticleRead as storageMarkArticleRead,
  unmarkArticleRead as storageUnmarkArticleRead,
} from '@/lib/storage';

interface ReadingContextType {
  ready: boolean;
  highlightEnabled: boolean;
  toggleHighlight: () => void;
  closeReadingEnabled: boolean;
  toggleCloseReading: () => void;
  selectedParagraph: number;
  selectParagraph: (index: number) => void;
  readArticles: Record<string, string>;
  markArticleRead: (slug: string) => void;
  unmarkArticleRead: (slug: string) => void;
  isArticleRead: (slug: string) => boolean;
}

const ReadingContext = createContext<ReadingContextType | null>(null);

const EMPTY_READING: ReadingContextType = {
  ready: false,
  highlightEnabled: true,
  toggleHighlight: () => undefined,
  closeReadingEnabled: false,
  toggleCloseReading: () => undefined,
  selectedParagraph: 0,
  selectParagraph: () => undefined,
  readArticles: {},
  markArticleRead: () => undefined,
  unmarkArticleRead: () => undefined,
  isArticleRead: () => false,
};

export function ReadingProvider({ children }: { children: React.ReactNode }) {
  const ready = useClientReady();

  if (!ready) {
    return (
      <ReadingContext.Provider value={EMPTY_READING}>
        {children}
      </ReadingContext.Provider>
    );
  }

  return <HydratedReadingProvider>{children}</HydratedReadingProvider>;
}

function HydratedReadingProvider({ children }: { children: React.ReactNode }) {
  const [highlightEnabled, setHighlightEnabledState] = useState(() => getHighlightEnabled());
  const [closeReadingEnabled, setCloseReadingEnabledState] = useState(() => getCloseReadingEnabled());
  const [selectedParagraph, setSelectedParagraph] = useState(0);
  const [readArticles, setReadArticles] = useState<Record<string, string>>(() => getReadArticles());

  const toggleHighlight = useCallback(() => {
    setHighlightEnabledState(prev => {
      const next = !prev;
      setHighlightEnabled(next);
      return next;
    });
  }, []);

  const toggleCloseReading = useCallback(() => {
    setCloseReadingEnabledState(prev => {
      const next = !prev;
      setCloseReadingEnabled(next);
      if (next) setSelectedParagraph(0);
      return next;
    });
  }, []);

  const selectParagraph = useCallback((index: number) => {
    setSelectedParagraph(index);
  }, []);

  const markArticleRead = useCallback((slug: string) => {
    storageMarkArticleRead(slug);
    setReadArticles(prev => {
      if (slug in prev) return prev;
      return { ...prev, [slug]: new Date().toISOString().split('T')[0] };
    });
  }, []);

  const unmarkArticleRead = useCallback((slug: string) => {
    storageUnmarkArticleRead(slug);
    setReadArticles(prev => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  }, []);

  const isArticleRead = useCallback(
    (slug: string) => slug in readArticles,
    [readArticles],
  );

  return (
    <ReadingContext.Provider
      value={{
        ready: true,
        highlightEnabled,
        toggleHighlight,
        closeReadingEnabled,
        toggleCloseReading,
        selectedParagraph,
        selectParagraph,
        readArticles,
        markArticleRead,
        unmarkArticleRead,
        isArticleRead,
      }}
    >
      {children}
    </ReadingContext.Provider>
  );
}

export function useReading(): ReadingContextType {
  const ctx = useContext(ReadingContext);
  if (!ctx) throw new Error('useReading must be used within ReadingProvider');
  return ctx;
}
