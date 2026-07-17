import type { VocabEntry, VocabMap, Difficulty } from '@/types';
import { getHighlightClass, getDotColor, getDifficultyLabel } from '@/config/difficulty';

// Re-export under legacy names for backward compatibility
export { getDotColor as getDifficultyDotColor, getDifficultyLabel };
export const getDifficultyColor = getHighlightClass;

export interface DefPart {
  pos: string;
  def: string;
}

const POS_BREAK_RE = /(?:^|\s+)(n\.|vt\.|vi\.|v\.|adj\.|adv\.|a\.|ad\.|prep\.|pron\.|conj\.|det\.)\s+/gm;

/** Split a definition string that may contain multiple POS entries */
export function parseDefinitionParts(pos: string, definition: string): DefPart[] {
  const breakpoints: Array<{ pos: string; start: number; end: number }> = [];
  let match: RegExpExecArray | null;
  while ((match = POS_BREAK_RE.exec(definition)) !== null) {
    breakpoints.push({ pos: match[1], start: match.index, end: match.index + match[0].length });
  }

  if (breakpoints.length === 0) {
    return [{ pos, def: definition.trim() }];
  }

  const parts: DefPart[] = [];
  const firstDef = definition.slice(0, breakpoints[0].start).trim();

  if (!firstDef && breakpoints[0].start === 0 && breakpoints.length > 0) {
    const mergedPos = pos + ' &  ' + breakpoints[0].pos;
    const next = breakpoints.length > 1 ? breakpoints[1].start : definition.length;
    parts.push({ pos: mergedPos, def: definition.slice(breakpoints[0].end, next).trim() });
    for (let i = 1; i < breakpoints.length; i++) {
      const bp = breakpoints[i];
      const n = i + 1 < breakpoints.length ? breakpoints[i + 1].start : definition.length;
      parts.push({ pos: bp.pos, def: definition.slice(bp.end, n).trim() });
    }
  } else {
    parts.push({ pos, def: firstDef });
    for (let i = 0; i < breakpoints.length; i++) {
      const bp = breakpoints[i];
      const n = i + 1 < breakpoints.length ? breakpoints[i + 1].start : definition.length;
      parts.push({ pos: bp.pos, def: definition.slice(bp.end, n).trim() });
    }
  }

  return parts.filter(p => p.def);
}

let vocabCache: VocabMap | null = null;

async function fetchVocab(path: string): Promise<VocabMap> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`词表资源加载失败: ${path}`);
  }
  return response.json() as Promise<VocabMap>;
}

export async function loadVocab(): Promise<VocabMap> {
  if (vocabCache) return vocabCache as VocabMap;
  const [cet4, cet6, postgrad] = await Promise.all([
    fetchVocab('/vocab/cet4.json'),
    fetchVocab('/vocab/cet6.json'),
    fetchVocab('/vocab/postgrad.json'),
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
