# Task 11: 文章卡片组件

> **Phase 1 / 21** | 依赖: Task 2

**目标**: 创建文章画廊的卡片组件——圆角矩形、渐变色占位封面、标题、来源标签、难度标签。

**文件**:
- 创建: `src/components/gallery/ArticleCard.tsx`

---

- [ ] **Step 1: 写 ArticleCard.tsx**

```tsx
// src/components/gallery/ArticleCard.tsx
import Link from 'next/link';
import type { ArticleMeta } from '@/types';
import { getDifficultyLabel } from '@/lib/vocab';

const DIFFICULTY_STYLES: Record<string, string> = {
  cet4: 'bg-green-100 text-green-700',
  cet6: 'bg-yellow-100 text-yellow-700',
  postgrad: 'bg-red-100 text-red-700',
};

const TOPIC_GRADIENTS: Record<string, string> = {
  technology: 'from-blue-400 to-cyan-300',
  environment: 'from-emerald-400 to-green-300',
  science: 'from-purple-400 to-pink-300',
};

function getGradient(topic: string): string {
  return TOPIC_GRADIENTS[topic] ?? 'from-gray-400 to-gray-300';
}

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="block rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all group"
    >
      {/* 封面占位 */}
      <div
        className={`h-36 bg-gradient-to-br ${getGradient(article.topic)} flex items-center justify-center`}
      >
        <span className="text-white text-3xl font-bold opacity-60">
          {article.source.slice(0, 2).toUpperCase()}
        </span>
      </div>

      {/* 信息区 */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{article.source}</span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[article.difficulty] ?? ''}`}
          >
            {getDifficultyLabel(article.difficulty)}
          </span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: 类型检查**

```bash
npm run typecheck
```

- [ ] **Step 3: 提交**

```bash
git add src/components/gallery/ArticleCard.tsx && git commit -m "feat: add article card component"
```
