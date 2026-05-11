# Task 17: 生词面板组件

> **Phase 1 / 21** | 依赖: Task 4, Task 6

**目标**: 创建阅读页右侧面板——词汇/句子标签切换，生词列表，收藏和已认识操作。

**文件**:
- 创建: `src/components/reader/WordPanel.tsx`

---

- [ ] **Step 1: 写 WordPanel.tsx**

```tsx
'use client';

// src/components/reader/WordPanel.tsx
import { useState } from 'react';
import type { VocabEntry } from '@/types';
import { getDifficultyDotColor } from '@/lib/vocab';
import { useAppContext } from '@/context/AppContext';
import { Star, Check } from 'lucide-react';

interface PanelWord {
  word: string;
  entry: VocabEntry;
}

interface WordPanelProps {
  words: PanelWord[];
}

type Tab = 'words' | 'sentences';

export default function WordPanel({ words }: WordPanelProps) {
  const [tab, setTab] = useState<Tab>('words');
  const { markKnown, saveWordToCollection, isWordInCollection } = useAppContext();

  const handleMarkKnown = (word: string) => {
    markKnown(word);
  };

  const handleSave = (w: PanelWord) => {
    saveWordToCollection({
      word: w.word,
      definition: w.entry.definition,
      difficulty: w.entry.difficulty,
      date: new Date().toISOString().split('T')[0],
      articleTitle: '',
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 标签切换 */}
      <div className="flex gap-1 p-2">
        <button
          onClick={() => setTab('words')}
          className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
            tab === 'words'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          词汇
        </button>
        <button
          onClick={() => setTab('sentences')}
          className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
            tab === 'sentences'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          句子
        </button>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {tab === 'sentences' && (
          <p className="text-xs text-gray-400 text-center mt-8">句子分析功能即将推出</p>
        )}

        {tab === 'words' && words.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-8">本文暂无生词</p>
        )}

        {tab === 'words' &&
          words.map(({ word, entry }) => {
            const saved = isWordInCollection(word);
            return (
              <div
                key={word}
                className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-0 group"
              >
                {/* 难度色点 */}
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getDifficultyDotColor(entry.difficulty)}`}
                />

                {/* 单词 + 释义 */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{word}</span>
                  <span className="text-[10px] text-gray-400 ml-1">{entry.pos}</span>
                  <p className="text-xs text-gray-500 truncate">{entry.definition}</p>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-0.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleSave({ word, entry })}
                    disabled={saved}
                    title="收藏"
                    className={`p-1 rounded ${
                      saved ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <Star size={14} fill={saved ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => handleMarkKnown(word)}
                    title="已认识"
                    className="p-1 rounded text-gray-400 hover:text-green-500"
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 类型检查**

```bash
npm run typecheck
```

- [ ] **Step 3: 提交**

```bash
git add src/components/reader/WordPanel.tsx && git commit -m "feat: add word panel component with save and mark-known actions"
```
