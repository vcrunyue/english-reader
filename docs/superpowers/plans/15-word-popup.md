# Task 15: 单词弹窗组件

> **Phase 1 / 21** | 依赖: Task 2, Task 4

**目标**: 创建 hover 悬浮弹窗——显示释义、词性、收藏按钮。

**文件**:
- 创建: `src/components/reader/WordPopup.tsx`

---

- [ ] **Step 1: 写 WordPopup.tsx**

```tsx
'use client';

// src/components/reader/WordPopup.tsx
import { useEffect, useRef } from 'react';
import type { VocabEntry } from '@/types';
import { getDifficultyDotColor, getDifficultyLabel } from '@/lib/vocab';
import { Star } from 'lucide-react';

interface WordPopupProps {
  word: string;
  entry: VocabEntry;
  position: { x: number; y: number };
  isSaved: boolean;
  onSave: (word: string) => void;
  onClose: () => void;
}

export default function WordPopup({
  word,
  entry,
  position,
  isSaved,
  onSave,
  onClose,
}: WordPopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  // 调整位置防止超出视口
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let { x, y } = position;
    if (x + rect.width > vw - 16) x = vw - rect.width - 16;
    if (y + rect.height > vh - 16) y = y - rect.height - 8;
    ref.current.style.left = `${x}px`;
    ref.current.style.top = `${y}px`;
  }, [position]);

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-3 min-w-[180px] max-w-[240px]"
      style={{ left: position.x, top: position.y }}
      onMouseLeave={onClose}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`w-2.5 h-2.5 rounded-full ${getDifficultyDotColor(entry.difficulty)}`}
        />
        <span className="font-semibold text-sm">{word}</span>
        <span className="text-[10px] text-gray-400">{getDifficultyLabel(entry.difficulty)}</span>
      </div>
      <p className="text-xs text-gray-500 mb-0.5">{entry.pos}</p>
      <p className="text-sm text-gray-800 mb-2">{entry.definition}</p>
      <button
        onClick={() => onSave(word)}
        disabled={isSaved}
        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
          isSaved
            ? 'bg-yellow-50 text-yellow-600'
            : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-700'
        }`}
      >
        <Star size={12} fill={isSaved ? 'currentColor' : 'none'} />
        {isSaved ? '已收藏' : '收藏'}
      </button>
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
git add src/components/reader/WordPopup.tsx && git commit -m "feat: add word popup component with hover definition"
```
