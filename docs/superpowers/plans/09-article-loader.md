# Task 9: 文章加载库

> **Phase 1 / 21** | 依赖: Task 2

**目标**: 创建从 `content/articles/` 读取 Markdown 文件、解析 frontmatter 的工具函数。

**文件**:
- 创建: `src/lib/articles.ts`

---

- [ ] **Step 1: 写 articles.ts**

```ts
// src/lib/articles.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Article, ArticleMeta } from '@/types';

const articlesDir = path.join(process.cwd(), 'content/articles');

/** 获取所有文章的元数据（不含正文），用于画廊列表 */
export function getAllArticleMetas(): ArticleMeta[] {
  if (!fs.existsSync(articlesDir)) return [];
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  return files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(articlesDir, filename), 'utf-8');
    const { data } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      source: data.source ?? '',
      difficulty: data.difficulty ?? 'cet4',
      topic: data.topic ?? '',
      coverImage: data.coverImage ?? null,
      date: data.date ?? '',
    };
  });
}

/** 获取单篇文章的完整内容（含正文） */
export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(articlesDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    source: data.source ?? '',
    difficulty: data.difficulty ?? 'cet4',
    topic: data.topic ?? '',
    coverImage: data.coverImage ?? null,
    date: data.date ?? '',
    content,
  };
}

/** 获取所有文章 slug（用于 generateStaticParams） */
export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDir)) return [];
  return fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}
```

- [ ] **Step 2: 类型检查**

```bash
npm run typecheck
```

- [ ] **Step 3: 提交**

```bash
git add src/lib/articles.ts && git commit -m "feat: add article loading library with gray-matter"
```
