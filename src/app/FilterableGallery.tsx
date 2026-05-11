'use client';

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
