# Task 13: 首页画廊

> **Phase 1 / 21** | 依赖: Task 9, Task 11, Task 12

**目标**: 修改首页 `page.tsx`，读取文章列表并渲染卡片网格 + 筛选栏。

**文件**:
- 修改: `src/app/page.tsx`

---

- [ ] **Step 1: 修改 page.tsx**

```tsx
// src/app/page.tsx
import { getAllArticleMetas } from '@/lib/articles';
import ArticleCard from '@/components/gallery/ArticleCard';
import FilterableGallery from './FilterableGallery';

export default function HomePage() {
  const articles = getAllArticleMetas();

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">发现文章</h1>
      <FilterableGallery articles={articles} />
    </div>
  );
}
```

- [ ] **Step 2: 创建 FilterableGallery 客户端组件**

```tsx
'use client';

// src/app/FilterableGallery.tsx
import { useState, useMemo } from 'react';
import type { ArticleMeta, Difficulty } from '@/types';
import ArticleCard from '@/components/gallery/ArticleCard';
import FilterBar from '@/components/gallery/FilterBar';

export default function FilterableGallery({ articles }: { articles: ArticleMeta[] }) {
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [source, setSource] = useState('all');

  const sources = useMemo(
    () => [...new Set(articles.map(a => a.source))],
    [articles],
  );

  const filtered = useMemo(() => {
    return articles.filter(a => {
      if (difficulty !== 'all' && a.difficulty !== difficulty) return false;
      if (source !== 'all' && a.source !== source) return false;
      return true;
    });
  }, [articles, difficulty, source]);

  return (
    <div className="space-y-6">
      <FilterBar
        selectedDifficulty={difficulty}
        selectedSource={source}
        sources={sources}
        onDifficultyChange={setDifficulty}
        onSourceChange={setSource}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(article => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-gray-400 text-center py-12">没有匹配的文章</p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 启动验证**

```bash
npm run dev
```

打开 http://localhost:3000 ，应看到 3 张文章卡片，筛选按钮可点击切换。

- [ ] **Step 4: 类型检查**

```bash
npm run typecheck
```

- [ ] **Step 5: 提交**

```bash
git add src/app/page.tsx src/app/FilterableGallery.tsx && git commit -m "feat: add article gallery homepage with filters"
```
