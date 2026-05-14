'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

export function ReadingProvider({ children }: { children: React.ReactNode }) {
  const [highlightEnabled, setHighlightEnabledState] = useState(true);
  const [closeReadingEnabled, setCloseReadingEnabledState] = useState(false);
  const [selectedParagraph, setSelectedParagraph] = useState(0);
  const [readArticles, setReadArticles] = useState<Record<string, string>>({});

  useEffect(() => {
    setReadArticles(getReadArticles());
    setHighlightEnabledState(getHighlightEnabled());
    setCloseReadingEnabledState(getCloseReadingEnabled());
  }, []);

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
