'use client';

import { useState, useMemo } from 'react';
import type { ArticleMeta, Difficulty } from '@/types';
import ArticleCard from '@/components/gallery/ArticleCard';
import FilterBar from '@/components/gallery/FilterBar';
import { LayoutGrid, List } from 'lucide-react';

type ViewMode = 'grid' | 'list';

const toggleBtnBase =
  'p-1.5 rounded-md border border-[#D8D2C8] transition-colors duration-200';
const toggleInactive = 'text-[#78716C] hover:border-[#C88C4A] hover:text-[#5C3D2E]';
const toggleActive = 'bg-[#EDE9E0] text-[#5C3D2E]';

export default function FilterableGallery({ articles }: { articles: ArticleMeta[] }) {
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [source, setSource] = useState('all');
  const [view, setView] = useState<ViewMode>('grid');

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
      {/* filter bar + view toggle */}
      <div className="flex items-start justify-between gap-4">
        <FilterBar
          selectedDifficulty={difficulty}
          selectedSource={source}
          sources={sources}
          onDifficultyChange={setDifficulty}
          onSourceChange={setSource}
        />
        <div className="flex gap-1 shrink-0 mt-0.5" role="radiogroup" aria-label="视图切换">
          <button
            onClick={() => setView('grid')}
            className={`${toggleBtnBase} ${view === 'grid' ? toggleActive : toggleInactive}`}
            title="网格视图"
            role="radio"
            aria-checked={view === 'grid'}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`${toggleBtnBase} ${view === 'list' ? toggleActive : toggleInactive}`}
            title="列表视图"
            role="radio"
            aria-checked={view === 'list'}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* grid view */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((article, i) => (
            <div
              key={article.slug}
              className={`animate-card-enter ${i === 0 ? 'lg:col-span-2' : ''}`}
              style={{ animationDelay: `${Math.min(i * 60, 1200)}ms` }}
            >
              <ArticleCard article={article} layout="grid" featured={i === 0} />
            </div>
          ))}
        </div>
      )}

      {/* list view */}
      {view === 'list' && (
        <div className="flex flex-col gap-4">
          {filtered.map((article, i) => (
            <div
              key={article.slug}
              className="animate-card-enter"
              style={{ animationDelay: `${Math.min(i * 60, 1200)}ms` }}
            >
              <ArticleCard article={article} layout="list" />
            </div>
          ))}
        </div>
      )}

      {/* empty */}
      {filtered.length === 0 && (
        <p className="text-[#78716C] text-center py-12 font-zh-serif">没有匹配的文章</p>
      )}
    </div>
  );
}
