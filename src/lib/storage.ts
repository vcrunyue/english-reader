import type { SavedWord } from '@/types';

const STORAGE_KEYS = {
  knownWords: 'eng_known_words',
  savedWords: 'eng_saved_words',
  highlightEnabled: 'eng_highlight',
  closeReadingEnabled: 'eng_close_reading',
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
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(STORAGE_KEYS.highlightEnabled) !== 'false';
  } catch {
    return true;
  }
}

export function removeKnownWord(word: string): void {
  const words = getKnownWords().filter(w => w !== word.toLowerCase());
  localStorage.setItem(STORAGE_KEYS.knownWords, JSON.stringify(words));
}

export function setHighlightEnabled(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEYS.highlightEnabled, String(enabled));
}

export function getCloseReadingEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEYS.closeReadingEnabled) === 'true';
  } catch {
    return false;
  }
}

export function setCloseReadingEnabled(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEYS.closeReadingEnabled, String(enabled));
}
