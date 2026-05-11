# Task 2: 类型定义

> **Phase 1 / 21** | 依赖: Task 1

**目标**: 创建项目所有 TypeScript 类型定义。

**文件**:
- 创建: `src/types/index.ts`

---

- [ ] **Step 1: 写类型文件**

```ts
// src/types/index.ts

export type Difficulty = 'cet4' | 'cet6' | 'postgrad';

export interface ArticleMeta {
  slug: string;
  title: string;
  source: string;
  difficulty: Difficulty;
  topic: string;
  coverImage?: string;
  date: string;
}

export interface Article extends ArticleMeta {
  content: string; // raw markdown body
}

export interface VocabEntry {
  word: string;
  definition: string; // Chinese
  pos: string; // part of speech e.g. "n.", "v.", "adj."
  difficulty: Difficulty;
}

export type VocabMap = Record<string, VocabEntry>;

export interface SavedWord {
  word: string;
  definition: string;
  difficulty: Difficulty;
  date: string;
  articleTitle: string;
}

export interface AppState {
  knownWords: string[];
  savedWords: Record<string, SavedWord>;
  highlightEnabled: boolean;
}
```

- [ ] **Step 2: 验证类型检查**

```bash
npm run typecheck
```

- [ ] **Step 3: 提交**

```bash
git add src/types/index.ts && git commit -m "feat: add TypeScript type definitions"
```
