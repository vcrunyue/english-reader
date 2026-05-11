# Task 18: 阅读页

> **Phase 1 / 21** | 依赖: Task 9, Task 14, Task 16, Task 17

**目标**: 创建 `article/[slug]/page.tsx` 阅读页——三区布局，组裝顶栏 + 正文 + 右侧面板。

**文件**:
- 创建: `src/app/article/[slug]/page.tsx`

---

- [ ] **Step 1: 创建阅读页目录和文件**

```bash
mkdir -p src/app/article/\[slug\]
```

- [ ] **Step 2: 写 page.tsx**

```tsx
// src/app/article/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/articles';
import HighlightToggle from '@/components/reader/HighlightToggle';
import { getDifficultyLabel } from '@/lib/vocab';
import ArticleReader from './ArticleReader';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map(slug => ({ slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="flex h-full">
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶栏 */}
        <header className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
          <a href="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            ← 返回
          </a>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-400">高亮</span>
            <HighlightToggle />
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {getDifficultyLabel(article.difficulty)}
          </span>
        </header>

        {/* 正文 */}
        <div className="flex-1 overflow-y-auto px-8 py-6 max-w-3xl">
          <h1 className="text-xl font-bold mb-1">{article.title}</h1>
          <p className="text-xs text-gray-400 mb-6">
            {article.source} · {article.date}
          </p>
          <ArticleReader content={article.content} />
        </div>
      </div>

      {/* 右侧面板 */}
      <aside className="w-1/6 min-w-[180px] max-w-[280px] border-l border-gray-200 bg-gray-50 overflow-y-auto">
        <WordPanelWrapper slug={slug} content={article.content} />
      </aside>
    </div>
  );
}
```

- [ ] **Step 3: 写 ArticleReader.tsx（客户端组件）**

```tsx
'use client';

// src/app/article/[slug]/ArticleReader.tsx
import { useState, useEffect } from 'react';
import type { VocabMap } from '@/types';
import { loadVocab } from '@/lib/vocab';
import ArticleBody from '@/components/reader/ArticleBody';

export default function ArticleReader({ content }: { content: string }) {
  const [vocab, setVocab] = useState<VocabMap | null>(null);

  useEffect(() => {
    loadVocab().then(setVocab);
  }, []);

  if (!vocab) {
    return <div className="text-gray-400 text-sm py-12 text-center">加载词汇表中...</div>;
  }

  return <ArticleBody content={content} vocab={vocab} />;
}
```

- [ ] **Step 4: 写 WordPanelWrapper.tsx（客户端组件）**

```tsx
'use client';

// src/app/article/[slug]/WordPanelWrapper.tsx
import { useState, useEffect, useMemo } from 'react';
import type { VocabMap } from '@/types';
import { loadVocab, analyzeText } from '@/lib/vocab';
import { useAppContext } from '@/context/AppContext';
import WordPanel from '@/components/reader/WordPanel';

export default function WordPanelWrapper({ content }: { content: string }) {
  const [vocab, setVocab] = useState<VocabMap | null>(null);
  const { knownWords } = useAppContext();

  useEffect(() => {
    loadVocab().then(setVocab);
  }, []);

  const words = useMemo(() => {
    if (!vocab) return [];
    return analyzeText(content, vocab, knownWords);
  }, [content, vocab, knownWords]);

  return <WordPanel words={words} />;
}
```

> 注意：`ArticleReader.tsx` 和 `WordPanelWrapper.tsx` 都放在 `src/app/article/[slug]/` 目录下。

- [ ] **Step 5: 类型检查**

```bash
npm run typecheck
```

- [ ] **Step 6: 启动验证**

```bash
npm run dev
```

点击首页任一文章卡片 → 进入阅读页 → 打开高亮开关 → hover 单词看弹窗 → 右侧面板显示生词。

- [ ] **Step 7: 提交**

```bash
git add src/app/article/ && git commit -m "feat: add reading page with three-zone layout and SSG"
```
