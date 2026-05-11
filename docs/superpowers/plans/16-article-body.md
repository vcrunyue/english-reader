# Task 16: 文章正文组件（含高亮）

> **Phase 1 / 21** | 依赖: Task 4, Task 6, Task 15

**目标**: 创建文章正文渲染组件——Markdown 解析 + 单词高亮 + hover 弹窗。

**文件**:
- 创建: `src/components/reader/ArticleBody.tsx`

---

- [ ] **Step 1: 写 ArticleBody.tsx**

```tsx
'use client';

// src/components/reader/ArticleBody.tsx
import React, { useState, useMemo, useCallback } from 'react';
import type { VocabMap, VocabEntry } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { tokenize, lookupWord, getDifficultyColor } from '@/lib/vocab';
import WordPopup from './WordPopup';

interface ArticleBodyProps {
  content: string;
  vocab: VocabMap;
}

interface PopupData {
  word: string;
  entry: VocabEntry;
  x: number;
  y: number;
}

/** 把文章内容按段落拆开，每个段落内的单词逐词渲染 */
export default function ArticleBody({ content, vocab }: ArticleBodyProps) {
  const { knownWords, highlightEnabled, saveWordToCollection, isWordInCollection } = useAppContext();
  const [popup, setPopup] = useState<PopupData | null>(null);

  const paragraphs = useMemo(
    () => content.split(/\n\n+/).filter(p => p.trim()),
    [content],
  );

  const renderParagraph = useCallback(
    (text: string, pIdx: number) => {
      // 处理 Markdown 标题 (# ## ###)
      const headingMatch = text.match(/^(#{1,3})\s+(.+)/);
      if (headingMatch) {
        const Tag = `h${headingMatch[1].length}` as 'h1' | 'h2' | 'h3';
        const headingText = headingMatch[2];
        return (
          <Tag key={pIdx} className="font-bold text-gray-900 mb-3 mt-6 first:mt-0">
            {renderTextWithHighlights(headingText, vocab, knownWords, highlightEnabled, setPopup)}
          </Tag>
        );
      }

      return (
        <p key={pIdx} className="mb-3 leading-[1.8] text-[15px] text-gray-800 font-serif">
          {renderTextWithHighlights(text, vocab, knownWords, highlightEnabled, setPopup)}
        </p>
      );
    },
    [vocab, knownWords, highlightEnabled],
  );

  const handleSave = useCallback(
    (word: string) => {
      if (!popup) return;
      saveWordToCollection({
        word,
        definition: popup.entry.definition,
        difficulty: popup.entry.difficulty,
        date: new Date().toISOString().split('T')[0],
        articleTitle: '',
      });
      setPopup(null);
    },
    [popup, saveWordToCollection],
  );

  return (
    <div className="relative">
      {paragraphs.map((p, i) => renderParagraph(p, i))}

      {popup && (
        <WordPopup
          word={popup.word}
          entry={popup.entry}
          position={{ x: popup.x, y: popup.y }}
          isSaved={isWordInCollection(popup.word)}
          onSave={handleSave}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

/** 把一段文本拆成单词 + 标点，按规则渲染 */
function renderTextWithHighlights(
  text: string,
  vocab: VocabMap,
  knownWords: Set<string>,
  enabled: boolean,
  setPopup: (p: PopupData | null) => void,
): React.ReactNode[] {
  // 将文本切分为单词和非单词片段
  const parts = text.split(/(\b[a-zA-Z]+(?:[''][a-zA-Z]+)?\b)/g);
  const known = new Set(knownWords);

  return parts.map((part, i) => {
    const wordMatch = part.match(/^[a-zA-Z]/);
    if (!wordMatch) {
      // 标点、空格、数字等，原样输出
      return <span key={i}>{part}</span>;
    }

    if (!enabled) {
      return <span key={i}>{part}</span>;
    }

    const entry = lookupWord(part, vocab, known);
    if (!entry) {
      return <span key={i}>{part}</span>;
    }

    const colorClass = getDifficultyColor(entry.difficulty);

    return (
      <span
        key={i}
        className={`relative border-b-2 cursor-pointer ${colorClass}`}
        onMouseEnter={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPopup({
            word: part,
            entry,
            x: rect.left,
            y: rect.bottom + 4,
          });
        }}
        onMouseLeave={() => setPopup(null)}
      >
        {part}
      </span>
    );
  });
}
```

- [ ] **Step 2: 类型检查**

```bash
npm run typecheck
```

- [ ] **Step 3: 提交**

```bash
git add src/components/reader/ArticleBody.tsx && git commit -m "feat: add article body with word highlighting and hover popup"
```
