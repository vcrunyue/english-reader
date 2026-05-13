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
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const [knownWordDates, setKnownWordDates] = useState<Record<string, string>>({});
  const [savedWords, setSavedWords] = useState<Record<string, SavedWord>>({});
  const [highlightEnabled, setHighlightEnabledState] = useState(true);
  const [closeReadingEnabled, setCloseReadingEnabledState] = useState(false);
  const [selectedParagraph, setSelectedParagraph] = useState(0);

  useEffect(() => {
    const dates = getKnownWords();
    setKnownWords(new Set(Object.keys(dates)));
    setKnownWordDates(dates);
    setSavedWords(getSavedWords());
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
