import type { SavedWord } from '@/types';

// ============================================================================
// Storage abstraction layer
//
// All persistence goes through the functions below. To swap localStorage for
// a backend API, replace the bodies of readJSON / writeJSON (and the two
// boolean helpers) with fetch calls — the rest of the module stays identical.
// ============================================================================

export const STORAGE_KEYS = {
  knownWords: 'eng_known_words',
  savedWords: 'eng_saved_words',
  savedArticles: 'eng_saved_articles',
  readArticles: 'eng_read_articles',
  highlightEnabled: 'eng_highlight',
  closeReadingEnabled: 'eng_close_reading',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// -- JSON helpers (public — usable by tests / migration scripts) -------------

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

// -- known words ------------------------------------------------------------

export function getKnownWords(): Record<string, string> {
  const parsed = readJSON<unknown>(STORAGE_KEYS.knownWords, {});
  // migrate old string[] format
  if (Array.isArray(parsed)) {
    const migrated: Record<string, string> = {};
    const d = today();
    for (const w of parsed) migrated[w] = d;
    writeJSON(STORAGE_KEYS.knownWords, migrated);
    return migrated;
  }
  return parsed as Record<string, string>;
}

export function addKnownWord(word: string): void {
  const words = getKnownWords();
  const key = word.toLowerCase();
  if (!(key in words)) {
    words[key] = today();
    writeJSON(STORAGE_KEYS.knownWords, words);
  }
}

export function removeKnownWord(word: string): void {
  const words = getKnownWords();
  delete words[word.toLowerCase()];
  writeJSON(STORAGE_KEYS.knownWords, words);
}

// -- saved words ------------------------------------------------------------

export function getSavedWords(): Record<string, SavedWord> {
  return readJSON<Record<string, SavedWord>>(STORAGE_KEYS.savedWords, {});
}

export function saveWord(word: SavedWord): void {
  const words = getSavedWords();
  words[word.word.toLowerCase()] = word;
  writeJSON(STORAGE_KEYS.savedWords, words);
}

export function removeSavedWord(word: string): void {
  const words = getSavedWords();
  delete words[word.toLowerCase()];
  writeJSON(STORAGE_KEYS.savedWords, words);
}

export function isWordSaved(word: string): boolean {
  return word.toLowerCase() in getSavedWords();
}

// -- highlight toggle -------------------------------------------------------

export function getHighlightEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(STORAGE_KEYS.highlightEnabled) !== 'false';
}

export function setHighlightEnabled(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEYS.highlightEnabled, String(enabled));
}

// -- close reading toggle ---------------------------------------------------

export function getCloseReadingEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.closeReadingEnabled) === 'true';
}

export function setCloseReadingEnabled(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEYS.closeReadingEnabled, String(enabled));
}

// -- saved articles ---------------------------------------------------------

export function getSavedArticles(): Record<string, string> {
  return readJSON<Record<string, string>>(STORAGE_KEYS.savedArticles, {});
}

export function saveArticle(slug: string): void {
  const articles = getSavedArticles();
  if (!(slug in articles)) {
    articles[slug] = today();
    writeJSON(STORAGE_KEYS.savedArticles, articles);
  }
}

export function removeSavedArticle(slug: string): void {
  const articles = getSavedArticles();
  delete articles[slug];
  writeJSON(STORAGE_KEYS.savedArticles, articles);
}

export function isArticleSaved(slug: string): boolean {
  return slug in getSavedArticles();
}

// -- read articles ----------------------------------------------------------

export function getReadArticles(): Record<string, string> {
  return readJSON<Record<string, string>>(STORAGE_KEYS.readArticles, {});
}

export function markArticleRead(slug: string): void {
  const articles = getReadArticles();
  if (!(slug in articles)) {
    articles[slug] = today();
    writeJSON(STORAGE_KEYS.readArticles, articles);
  }
}

export function unmarkArticleRead(slug: string): void {
  const articles = getReadArticles();
  delete articles[slug];
  writeJSON(STORAGE_KEYS.readArticles, articles);
}

export function isArticleRead(slug: string): boolean {
  return slug in getReadArticles();
}
