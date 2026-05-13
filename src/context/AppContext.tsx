'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { SavedWord } from '@/types';
import {
  getKnownWords,
  addKnownWord,
  removeKnownWord,
  getSavedWords,
  saveWord,
  removeSavedWord,
  getHighlightEnabled,
  setHighlightEnabled,
  getCloseReadingEnabled,
  setCloseReadingEnabled,
  getSavedArticles,
  saveArticle,
  removeSavedArticle,
  getReadArticles,
  markArticleRead,
} from '@/lib/storage';

interface AppContextType {
  knownWords: Set<string>;
  knownWordDates: Record<string, string>;
  markKnown: (word: string) => void;
  unmarkKnown: (word: string) => void;
  savedWords: Record<string, SavedWord>;
  saveWordToCollection: (word: SavedWord) => void;
  removeWordFromCollection: (word: string) => void;
  isWordInCollection: (word: string) => boolean;
  highlightEnabled: boolean;
  toggleHighlight: () => void;
  closeReadingEnabled: boolean;
  toggleCloseReading: () => void;
  selectedParagraph: number;
  selectParagraph: (index: number) => void;
  savedArticles: Record<string, string>;
  saveArticleToCollection: (slug: string) => void;
  removeArticleFromCollection: (slug: string) => void;
  isArticleInCollection: (slug: string) => boolean;
  readArticles: Record<string, string>;
  markAsRead: (slug: string) => void;
  isArticleRead: (slug: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const [knownWordDates, setKnownWordDates] = useState<Record<string, string>>({});
  const [savedWords, setSavedWords] = useState<Record<string, SavedWord>>({});
  const [highlightEnabled, setHighlightEnabledState] = useState(true);
  const [closeReadingEnabled, setCloseReadingEnabledState] = useState(false);
  const [selectedParagraph, setSelectedParagraph] = useState(0);
  const [savedArticles, setSavedArticles] = useState<Record<string, string>>({});
  const [readArticles, setReadArticles] = useState<Record<string, string>>({});

  useEffect(() => {
    const dates = getKnownWords();
    setKnownWords(new Set(Object.keys(dates)));
    setKnownWordDates(dates);
    setSavedWords(getSavedWords());
    setSavedArticles(getSavedArticles());
    setReadArticles(getReadArticles());
    setHighlightEnabledState(getHighlightEnabled());
    setCloseReadingEnabledState(getCloseReadingEnabled());
  }, []);

  const markKnown = useCallback((word: string) => {
    addKnownWord(word);
    const lower = word.toLowerCase();
    setKnownWords(prev => new Set(prev).add(lower));
    setKnownWordDates(prev => ({ ...prev, [lower]: new Date().toISOString().split('T')[0] }));
  }, []);

  const unmarkKnown = useCallback((word: string) => {
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

  const saveWordToCollection = useCallback((word: SavedWord) => {
    saveWord(word);
    setSavedWords(prev => ({ ...prev, [word.word.toLowerCase()]: word }));
  }, []);

  const removeWordFromCollection = useCallback((word: string) => {
    removeSavedWord(word);
    setSavedWords(prev => {
      const next = { ...prev };
      delete next[word.toLowerCase()];
      return next;
    });
  }, []);

  const isWordInCollection = useCallback(
    (word: string) => word.toLowerCase() in savedWords,
    [savedWords],
  );

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

  const saveArticleToCollection = useCallback((slug: string) => {
    saveArticle(slug);
    setSavedArticles(prev => ({ ...prev, [slug]: new Date().toISOString().split('T')[0] }));
  }, []);

  const removeArticleFromCollection = useCallback((slug: string) => {
    removeSavedArticle(slug);
    setSavedArticles(prev => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  }, []);

  const isArticleInCollection = useCallback(
    (slug: string) => slug in savedArticles,
    [savedArticles],
  );

  const markAsRead = useCallback((slug: string) => {
    markArticleRead(slug);
    setReadArticles(prev => {
      if (slug in prev) return prev;
      return { ...prev, [slug]: new Date().toISOString().split('T')[0] };
    });
  }, []);

  const isRead = useCallback(
    (slug: string) => slug in readArticles,
    [readArticles],
  );

  return (
    <AppContext.Provider
      value={{
        knownWords,
        knownWordDates,
        markKnown,
        unmarkKnown,
        savedWords,
        saveWordToCollection,
        removeWordFromCollection,
        isWordInCollection,
        highlightEnabled,
        toggleHighlight,
        closeReadingEnabled,
        toggleCloseReading,
        selectedParagraph,
        selectParagraph,
        savedArticles,
        saveArticleToCollection,
        removeArticleFromCollection,
        isArticleInCollection,
        readArticles,
        markAsRead,
        isArticleRead: isRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
