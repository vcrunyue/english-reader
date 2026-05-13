'use client';

import { useState, useMemo, useCallback } from 'react';
import type { ArticleMeta, Difficulty } from '@/types';
import ArticleCard from '@/components/gallery/ArticleCard';
import FilterBar from '@/components/gallery/FilterBar';

type ViewMode = 'grid' | 'list';
type SortMode = 'default' | 'wordCount' | 'random';

const btnBase =
  'text-sm px-3 py-1.5 rounded-md border border-[#D8D2C8] transition-colors duration-200 font-zh-serif';

const activeCls = 'bg-[#EDE9E0] text-[#5C3D2E]';
const inactiveCls = 'bg-transparent text-[#78716C] hover:border-[#C88C4A] hover:text-[#5C3D2E]';

const VIEW_OPTIONS: Array<{ key: ViewMode; label: string }> = [
  { key: 'grid', label: '网格' },
  { key: 'list', label: '列表' },
];

const SORT_OPTIONS: Array<{ key: SortMode; label: string }> = [
  { key: 'default', label: '默认' },
  { key: 'wordCount', label: '字数' },
  { key: 'random', label: '随机' },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FilterableGallery({ articles }: { articles: ArticleMeta[] }) {
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [source, setSource] = useState('all');
  const [view, setView] = useState<ViewMode>('grid');
  const [sort, setSort] = useState<SortMode>('default');
  const [randomSeed, setRandomSeed] = useState(0);

  const sources = useMemo(
    () => [...new Set(articles.map(a => a.source))],
    [articles],
  );

  const filtered = useMemo(() => {
    let result = articles.filter(a => {
      if (difficulty !== 'all' && a.difficulty !== difficulty) return false;
      if (source !== 'all' && a.source !== source) return false;
      return true;
    });

    switch (sort) {
      case 'wordCount':
        result = [...result].sort((a, b) => b.wordCount - a.wordCount);
        break;
      case 'random':
        result = shuffleArray(result);
        break;
    }

    return result;
    // randomSeed is intentionally in deps to force re-shuffle on each "随机" click
  }, [articles, difficulty, source, sort, randomSeed]);

  const handleSort = useCallback((key: SortMode) => {
    setSort(key);
    if (key === 'random') {
      setRandomSeed(s => s + 1);
    }
  }, []);

  // Force remount on filter/sort changes so CSS animation replays
  const generation = `${difficulty}|${source}|${sort}|${randomSeed}`;

  return (
    <div className="space-y-3">
      <FilterBar
        selectedDifficulty={difficulty}
        selectedSource={source}
        sources={sources}
        onDifficultyChange={setDifficulty}
        onSourceChange={setSource}
      />

      {/* 显示行 */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-[15px] text-[#78716C] font-bold w-10 shrink-0 font-zh-serif -mt-px ml-0.5">
          显示
        </span>
        {VIEW_OPTIONS.map(({ key, label }) => {
          const active = view === key;
          return (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`${btnBase} ${active ? activeCls : inactiveCls}`}
            >
              {label}
            </button>
          );
        })}
        {SORT_OPTIONS.map(({ key, label }) => {
          const active = sort === key;
          return (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`${btnBase} ${active ? activeCls : inactiveCls}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* grid view */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((article, i) => (
            <div
              key={`${generation}-${article.slug}`}
              className="animate-card-enter"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <ArticleCard article={article} layout="grid" />
            </div>
          ))}
        </div>
      )}

      {/* list view */}
      {view === 'list' && (
        <div className="flex flex-col gap-4">
          {filtered.map((article, i) => (
            <div
              key={`${generation}-${article.slug}`}
              className="animate-card-enter"
              style={{ animationDelay: `${i * 100}ms` }}
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
