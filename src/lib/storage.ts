import type { SavedWord } from '@/types';

const STORAGE_KEYS = {
  knownWords: 'eng_known_words',
  savedWords: 'eng_saved_words',
  savedArticles: 'eng_saved_articles',
  readArticles: 'eng_read_articles',
  highlightEnabled: 'eng_highlight',
  closeReadingEnabled: 'eng_close_reading',
} as const;

export function getKnownWords(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.knownWords);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // migrate old string[] format
    if (Array.isArray(parsed)) {
      const migrated: Record<string, string> = {};
      const today = new Date().toISOString().split('T')[0];
      for (const w of parsed) migrated[w] = today;
      localStorage.setItem(STORAGE_KEYS.knownWords, JSON.stringify(migrated));
      return migrated;
    }
    return parsed;
  } catch {
    return {};
  }
}

export function addKnownWord(word: string): void {
  const words = getKnownWords();
  const key = word.toLowerCase();
  if (!(key in words)) {
    words[key] = new Date().toISOString().split('T')[0];
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
  const words = getKnownWords();
  delete words[word.toLowerCase()];
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

export function getSavedArticles(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.savedArticles);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveArticle(slug: string): void {
  const articles = getSavedArticles();
  if (!(slug in articles)) {
    articles[slug] = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEYS.savedArticles, JSON.stringify(articles));
  }
}

export function removeSavedArticle(slug: string): void {
  const articles = getSavedArticles();
  delete articles[slug];
  localStorage.setItem(STORAGE_KEYS.savedArticles, JSON.stringify(articles));
}

export function isArticleSaved(slug: string): boolean {
  const articles = getSavedArticles();
  return slug in articles;
}

export function getReadArticles(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.readArticles);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function markArticleRead(slug: string): void {
  const articles = getReadArticles();
  if (!(slug in articles)) {
    articles[slug] = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEYS.readArticles, JSON.stringify(articles));
  }
}

export function isArticleRead(slug: string): boolean {
  return slug in getReadArticles();
}
