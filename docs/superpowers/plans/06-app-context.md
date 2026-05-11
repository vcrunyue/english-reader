# Task 6: React Context 全局状态

> **Phase 1 / 21** | 依赖: Task 2, Task 5

**目标**: 创建 AppContext，管理已知词、收藏词、高亮开关等全局状态。

**文件**:
- 创建: `src/context/AppContext.tsx`

---

- [ ] **Step 1: 写 AppContext.tsx**

```tsx
'use client';

// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { SavedWord } from '@/types';
import {
  getKnownWords,
  addKnownWord,
  getSavedWords,
  saveWord,
  removeSavedWord,
  getHighlightEnabled,
  setHighlightEnabled,
} from '@/lib/storage';

interface AppContextType {
  knownWords: Set<string>;
  markKnown: (word: string) => void;
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

  // 客户端挂载后从 localStorage 加载
  useEffect(() => {
    setKnownWords(new Set(getKnownWords()));
    setSavedWords(getSavedWords());
    setHighlightEnabledState(getHighlightEnabled());
  }, []);

  const markKnown = useCallback((word: string) => {
    addKnownWord(word);
    setKnownWords(prev => new Set(prev).add(word.toLowerCase()));
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

  const isWordInCollection = useCallback((word: string) => {
    return word.toLowerCase() in savedWords;
  }, [savedWords]);

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
```

- [ ] **Step 2: 类型检查**

```bash
npm run typecheck
```

- [ ] **Step 3: 提交**

```bash
git add src/context/AppContext.tsx && git commit -m "feat: add global AppContext provider"
```
