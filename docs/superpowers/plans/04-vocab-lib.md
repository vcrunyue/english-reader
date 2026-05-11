# Task 4: 词汇匹配库

> **Phase 1 / 21** | 依赖: Task 2, Task 3

**目标**: 创建客户端词汇匹配工具函数——分词、查词、难度分色。

**文件**:
- 创建: `src/lib/vocab.ts`

---

- [ ] **Step 1: 写 vocab.ts**

```ts
// src/lib/vocab.ts
import type { VocabEntry, VocabMap, Difficulty } from '@/types';

let vocabCache: VocabMap | null = null;

/** 加载合并所有词汇表（浏览器端 fetch JSON） */
export async function loadVocab(): Promise<VocabMap> {
  if (vocabCache) return vocabCache;
  const [cet4, cet6, postgrad] = await Promise.all([
    fetch('/vocab/cet4.json').then(r => r.json()),
    fetch('/vocab/cet6.json').then(r => r.json()),
    fetch('/vocab/postgrad.json').then(r => r.json()),
  ]);
  vocabCache = { ...cet4, ...cet6, ...postgrad };
  return vocabCache;
}

/** 把文本拆成单词数组，保留位置信息 */
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
  cet4: 'bg-green-200 text-green-900 border-green-400',
  cet6: 'bg-yellow-200 text-yellow-900 border-yellow-400',
  postgrad: 'bg-red-200 text-red-900 border-red-400',
};

const DIFFICULTY_DOT_COLORS: Record<Difficulty, string> = {
  cet4: 'bg-green-500',
  cet6: 'bg-yellow-500',
  postgrad: 'bg-red-500',
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

/** 在词汇表中查找一个单词 */
export function lookupWord(
  word: string,
  vocab: VocabMap,
  knownWords: Set<string>,
): VocabEntry | null {
  const lower = word.toLowerCase();
  if (knownWords.has(lower)) return null;
  return vocab[lower] ?? null;
}

/** 分析文本，返回所有生词（去重，按难度分组） */
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
```

- [ ] **Step 2: 类型检查**

```bash
npm run typecheck
```

- [ ] **Step 3: 提交**

```bash
git add src/lib/vocab.ts && git commit -m "feat: add vocabulary matching library"
```
