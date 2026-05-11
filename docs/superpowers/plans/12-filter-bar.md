# Task 12: 筛选栏组件

> **Phase 1 / 21** | 依赖: Task 2

**目标**: 创建文章画廊顶部的筛选栏——按难度、来源筛选。

**文件**:
- 创建: `src/components/gallery/FilterBar.tsx`

---

- [ ] **Step 1: 写 FilterBar.tsx**

```tsx
'use client';

// src/components/gallery/FilterBar.tsx
import type { Difficulty } from '@/types';
import { getDifficultyLabel } from '@/lib/vocab';

interface FilterBarProps {
  selectedDifficulty: Difficulty | 'all';
  selectedSource: string;
  sources: string[];
  onDifficultyChange: (d: Difficulty | 'all') => void;
  onSourceChange: (s: string) => void;
}

const DIFFICULTIES: Array<Difficulty | 'all'> = ['all', 'cet4', 'cet6', 'postgrad'];

export default function FilterBar({
  selectedDifficulty,
  selectedSource,
  sources,
  onDifficultyChange,
  onSourceChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 难度筛选 */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-500 font-medium">难度:</span>
        {DIFFICULTIES.map(d => (
          <button
            key={d}
            onClick={() => onDifficultyChange(d)}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              selectedDifficulty === d
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {d === 'all' ? '全部' : getDifficultyLabel(d)}
          </button>
        ))}
      </div>

      {/* 来源筛选 */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-500 font-medium">来源:</span>
        <button
          onClick={() => onSourceChange('all')}
          className={`text-xs px-2 py-1 rounded-full transition-colors ${
            selectedSource === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {sources.map(s => (
          <button
            key={s}
            onClick={() => onSourceChange(s)}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              selectedSource === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
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
git add src/components/gallery/FilterBar.tsx && git commit -m "feat: add filter bar component"
```
