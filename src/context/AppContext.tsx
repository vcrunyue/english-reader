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
} from '@/lib/storage';

interface AppContextType {
  knownWords: Set<string>;
  markKnown: (word: string) => void;
  unmarkKnown: (word: string) => void;
  savedWords: Record<string, SavedWord>;
  saveWordToCollection: (word: SavedWord) => void;
  removeWordFromCollection: (word: string) => void;
  isWordInCollection: (word: string) => boolean;
  highlightEnabled: boolean;
  toggleHighlight: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const [savedWords, setSavedWords] = useState<Record<string, SavedWord>>({});
  const [highlightEnabled, setHighlightEnabledState] = useState(true);

  useEffect(() => {
    setKnownWords(new Set(getKnownWords()));
    setSavedWords(getSavedWords());
    setHighlightEnabledState(getHighlightEnabled());
  }, []);

  const markKnown = useCallback((word: string) => {
    addKnownWord(word);
    setKnownWords(prev => new Set(prev).add(word.toLowerCase()));
  }, []);

  const unmarkKnown = useCallback((word: string) => {
    removeKnownWord(word);
    setKnownWords(prev => {
      const next = new Set(prev);
      next.delete(word.toLowerCase());
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

  return (
    <AppContext.Provider
      value={{
        knownWords,
        markKnown,
        unmarkKnown,
        savedWords,
        saveWordToCollection,
        removeWordFromCollection,
        isWordInCollection,
        highlightEnabled,
        toggleHighlight,
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
