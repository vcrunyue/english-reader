'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { SavedWord } from '@/types';
import { useClientReady } from '@/hooks/use-client-ready';
import {
  getSavedWords,
  saveWord,
  removeSavedWord,
  getSavedArticles,
  saveArticle,
  removeSavedArticle,
} from '@/lib/storage';

interface CollectionContextType {
  savedWords: Record<string, SavedWord>;
  saveWordToCollection: (word: SavedWord) => void;
  removeWordFromCollection: (word: string) => void;
  isWordInCollection: (word: string) => boolean;
  savedArticles: Record<string, string>;
  saveArticleToCollection: (slug: string) => void;
  removeArticleFromCollection: (slug: string) => void;
  isArticleInCollection: (slug: string) => boolean;
}

const CollectionContext = createContext<CollectionContextType | null>(null);

const EMPTY_COLLECTION: CollectionContextType = {
  savedWords: {},
  saveWordToCollection: () => undefined,
  removeWordFromCollection: () => undefined,
  isWordInCollection: () => false,
  savedArticles: {},
  saveArticleToCollection: () => undefined,
  removeArticleFromCollection: () => undefined,
  isArticleInCollection: () => false,
};

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const ready = useClientReady();

  if (!ready) {
    return (
      <CollectionContext.Provider value={EMPTY_COLLECTION}>
        {children}
      </CollectionContext.Provider>
    );
  }

  return <HydratedCollectionProvider>{children}</HydratedCollectionProvider>;
}

function HydratedCollectionProvider({ children }: { children: React.ReactNode }) {
  const [savedWords, setSavedWords] = useState<Record<string, SavedWord>>(() => getSavedWords());
  const [savedArticles, setSavedArticles] = useState<Record<string, string>>(() => getSavedArticles());

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

  return (
    <CollectionContext.Provider
      value={{
        savedWords,
        saveWordToCollection,
        removeWordFromCollection,
        isWordInCollection,
        savedArticles,
        saveArticleToCollection,
        removeArticleFromCollection,
        isArticleInCollection,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection(): CollectionContextType {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error('useCollection must be used within CollectionProvider');
  return ctx;
}
