import type { VocabEntry, VocabMap, Difficulty } from '@/types';

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

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  cet4: 'bg-[#D4E8D0] hover:bg-[#B8D8B0] px-0.5',
  cet6: 'bg-[#F5E6C8] hover:bg-[#EED9A8] px-0.5',
  postgrad: 'bg-[#F0D3D3] hover:bg-[#E8B8B8] px-0.5',
};

const DIFFICULTY_DOT_COLORS: Record<Difficulty, string> = {
  cet4: 'bg-[#7CB868]',
  cet6: 'bg-[#D4A84C]',
  postgrad: 'bg-[#C86868]',
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  cet4: '四级',
  cet6: '六级',
  postgrad: '考研',
};

export function getDifficultyColor(d: Difficulty): string {
  return DIFFICULTY_COLORS[d];
}

export function getDifficultyDotColor(d: Difficulty): string {
  return DIFFICULTY_DOT_COLORS[d];
}

export function getDifficultyLabel(d: Difficulty): string {
  return DIFFICULTY_LABELS[d];
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
