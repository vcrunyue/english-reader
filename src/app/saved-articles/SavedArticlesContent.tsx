'use client';

import { useMemo } from 'react';
import { useCollection } from '@/context/CollectionContext';
import type { ArticleMeta } from '@/types';
import ArticleCard from '@/components/gallery/ArticleCard';

export default function SavedArticlesContent({ allMetas }: { allMetas: ArticleMeta[] }) {
  const { savedArticles } = useCollection();

  const metas = useMemo(
    () => allMetas.filter(m => m.slug in savedArticles),
    [allMetas, savedArticles],
  );

  const count = Object.keys(savedArticles).length;

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <h1 className="font-display text-4xl text-[#2D2B28] mb-10">文章收藏</h1>

      {count === 0 && (
        <p className="text-[#78716C] text-center py-12 font-zh-serif">
          还没有收藏的文章。在文章列表或阅读页面点击收藏按钮即可收藏。
        </p>
      )}

      {count > 0 && metas.length === 0 && (
        <p className="text-[#78716C] text-center py-12 font-zh-serif">
          收藏的文章暂无数据，可能已被移除。
        </p>
      )}

      {metas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {metas
            .sort((a, b) => (savedArticles[b.slug] ?? '').localeCompare(savedArticles[a.slug] ?? ''))
            .map(article => (
              <ArticleCard key={article.slug} article={article} />
            ))}
        </div>
      )}
    </div>
  );
}
