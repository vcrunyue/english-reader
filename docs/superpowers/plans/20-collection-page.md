# Task 20: 生词收藏夹页

> **Phase 1 / 21** | 依赖: Task 6

**目标**: 创建收藏夹页面——展示所有已收藏词汇，支持删除。

**文件**:
- 创建: `src/app/collection/page.tsx`

---

- [ ] **Step 1: 创建目录**

```bash
mkdir -p src/app/collection
```

- [ ] **Step 2: 写 page.tsx**

```tsx
'use client';

// src/app/collection/page.tsx
import { useAppContext } from '@/context/AppContext';
import { getDifficultyDotColor, getDifficultyLabel } from '@/lib/vocab';
import { Trash2 } from 'lucide-react';
import type { SavedWord } from '@/types';

export default function CollectionPage() {
  const { savedWords, removeWordFromCollection, isWordInCollection } = useAppContext();
  const words = Object.values(savedWords);

  const handleRemove = (word: string) => {
    if (confirm(`确定删除 "${word}" 吗？`)) {
      removeWordFromCollection(word);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">生词收藏夹</h1>

      {words.length === 0 && (
        <p className="text-gray-400 text-center py-12">
          还没有收藏的生词。阅读文章时点击 ⭐ 即可收藏。
        </p>
      )}

      {words.length > 0 && (
        <div className="space-y-1">
          {Object.values(words)
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((w: SavedWord) => (
              <div
                key={w.word}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-gray-50 group"
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDifficultyDotColor(w.difficulty)}`}
                />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm">{w.word}</span>
                  <span className="text-xs text-gray-400 ml-2">{w.definition}</span>
                </div>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {getDifficultyLabel(w.difficulty)}
                </span>
                <span className="text-[10px] text-gray-400">{w.date}</span>
                <button
                  onClick={() => handleRemove(w.word)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                  title="删除"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 类型检查**

```bash
npm run typecheck
```

- [ ] **Step 4: 提交**

```bash
git add src/app/collection/ && git commit -m "feat: add word collection page with delete support"
```
