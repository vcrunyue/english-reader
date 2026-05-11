# Task 5: localStorage 工具

> **Phase 1 / 21** | 依赖: Task 2

**目标**: 封装 localStorage 读写，处理 knownWords 和 savedWords。

**文件**:
- 创建: `src/lib/storage.ts`

---

- [ ] **Step 1: 写 storage.ts**

```ts
// src/lib/storage.ts
import type { SavedWord, AppState } from '@/types';

const STORAGE_KEYS = {
  knownWords: 'eng_known_words',
  savedWords: 'eng_saved_words',
  highlightEnabled: 'eng_highlight',
} as const;

export function getKnownWords(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.knownWords);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addKnownWord(word: string): void {
  const words = getKnownWords();
  if (!words.includes(word.toLowerCase())) {
    words.push(word.toLowerCase());
    localStorage.setItem(STORAGE_KEYS.knownWords, JSON.stringify(words));
  }
}

export function getSavedWords(): Record<string, SavedWord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.savedWords);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveWord(word: SavedWord): void {
  const words = getSavedWords();
  words[word.word.toLowerCase()] = word;
  localStorage.setItem(STORAGE_KEYS.savedWords, JSON.stringify(words));
}

export function removeSavedWord(word: string): void {
  const words = getSavedWords();
  delete words[word.toLowerCase()];
  localStorage.setItem(STORAGE_KEYS.savedWords, JSON.stringify(words));
}

export function isWordSaved(word: string): boolean {
  const words = getSavedWords();
  return word.toLowerCase() in words;
}

export function getHighlightEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEYS.highlightEnabled) !== 'false';
  } catch {
    return true;
  }
}

export function setHighlightEnabled(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEYS.highlightEnabled, String(enabled));
}
```

- [ ] **Step 2: 类型检查**

```bash
npm run typecheck
```

- [ ] **Step 3: 提交**

```bash
git add src/lib/storage.ts && git commit -m "feat: add localStorage helpers"
```
