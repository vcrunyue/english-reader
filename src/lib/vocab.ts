import type { VocabEntry, VocabMap, Difficulty } from '@/types';
import { getHighlightClass, getDotColor, getDifficultyLabel } from '@/config/difficulty';

// Re-export under legacy names for backward compatibility
export { getDotColor as getDifficultyDotColor, getDifficultyLabel };
export const getDifficultyColor = getHighlightClass;

let vocabCache: VocabMap | null = null;

export async function loadVocab(): Promise<VocabMap> {
  if (vocabCache) return vocabCache as VocabMap;
  const [cet4, cet6, postgrad] = await Promise.all([
    fetch('/vocab/cet4.json').then(r => r.json()),
    fetch('/vocab/cet6.json').then(r => r.json()),
    fetch('/vocab/postgrad.json').then(r => r.json()),
  ]);
  const merged: VocabMap = { ...cet4, ...cet6, ...postgrad };
  vocabCache = merged;
  return merged;
}

export function tokenize(text: string): Array<{ word: string; index: number }> {
  const tokens: Array<{ word: string; index: number }> = [];
  const regex = /\b[a-zA-Z]+(?:[''][a-zA-Z]+)?\b/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    tokens.push({ word: match[0].toLowerCase(), index: match.index });
  }
  return tokens;
}

export function lookupWord(
  word: string,
  vocab: VocabMap,
  knownWords: Set<string>,
): VocabEntry | null {
  const lower = word.toLowerCase();
  if (knownWords.has(lower)) return null;
  return vocab[lower] ?? null;
}

export function analyzeText(
  text: string,
  vocab: VocabMap,
  knownWords: Set<string>,
): Array<{ word: string; entry: VocabEntry }> {
  const tokens = tokenize(text);
  const seen = new Set<string>();
  const results: Array<{ word: string; entry: VocabEntry }> = [];
  for (const { word } of tokens) {
    const lower = word.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);
    const entry = lookupWord(lower, vocab, knownWords);
    if (entry) {
      results.push({ word: lower, entry });
    }
  }
  results.sort((a, b) => {
    const order: Record<Difficulty, number> = { postgrad: 0, cet6: 1, cet4: 2 };
    return order[a.entry.difficulty] - order[b.entry.difficulty];
  });
  return results;
}
