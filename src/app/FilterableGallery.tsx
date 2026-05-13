'use client';

import { useState, useMemo } from 'react';
import type { ArticleMeta, Difficulty } from '@/types';
import ArticleCard from '@/components/gallery/ArticleCard';
import FilterBar from '@/components/gallery/FilterBar';
import { LayoutGrid, List, Shuffle } from 'lucide-react';

type ViewMode = 'grid' | 'list';
type SortMode = 'default' | 'difficulty' | 'wordCount' | 'random';

const DIFFICULTY_ORDER: Record<Difficulty, number> = { cet4: 0, cet6: 1, postgrad: 2 };

const btnBase =
  'text-sm px-3 py-1.5 rounded-md border border-[#D8D2C8] transition-colors duration-200 font-zh-serif';

const toggleBtnBase =
  'p-1.5 rounded-md border border-[#D8D2C8] transition-colors duration-200';

export default function FilterableGallery({ articles }: { articles: ArticleMeta[] }) {
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [source, setSource] = useState('all');
  const [view, setView] = useState<ViewMode>('grid');
  const [sort, setSort] = useState<SortMode>('default');

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
      case 'difficulty':
        result = [...result].sort(
          (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty],
        );
        break;
      case 'wordCount':
        result = [...result].sort((a, b) => b.wordCount - a.wordCount);
        break;
      case 'random':
        result = [...result].sort(() => Math.random() - 0.5);
        break;
    }

    return result;
  }, [articles, difficulty, source, sort]);

  const SORT_OPTIONS: Array<{ key: SortMode; label: string; icon?: React.ReactNode }> = [
    { key: 'default', label: '默认' },
    { key: 'difficulty', label: '难度' },
    { key: 'wordCount', label: '字数' },
    { key: 'random', label: '随机', icon: <Shuffle size={13} /> },
  ];

  return (
    <div className="space-y-6">
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
        {/* 视图切换 */}
        <div className="flex gap-1">
          <button
            onClick={() => setView('grid')}
            className={`${toggleBtnBase} ${view === 'grid' ? 'bg-[#EDE9E0] text-[#5C3D2E]' : 'text-[#78716C] hover:border-[#C88C4A] hover:text-[#5C3D2E]'}`}
            title="网格视图"
            role="radio"
            aria-checked={view === 'grid'}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`${toggleBtnBase} ${view === 'list' ? 'bg-[#EDE9E0] text-[#5C3D2E]' : 'text-[#78716C] hover:border-[#C88C4A] hover:text-[#5C3D2E]'}`}
            title="列表视图"
            role="radio"
            aria-checked={view === 'list'}
          >
            <List size={16} />
          </button>
        </div>
        {/* 排序选项 */}
        {SORT_OPTIONS.map(({ key, label, icon }) => {
          const active = sort === key;
          return (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`${btnBase} flex items-center gap-1 ${
                active
                  ? 'bg-[#EDE9E0] text-[#5C3D2E]'
                  : 'bg-transparent text-[#78716C] hover:border-[#C88C4A] hover:text-[#5C3D2E]'
              }`}
            >
              {icon}
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
              key={article.slug}
              className="animate-card-enter"
              style={{ animationDelay: `${Math.min(i * 100, 1500)}ms` }}
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
              key={article.slug}
              className="animate-card-enter"
              style={{ animationDelay: `${Math.min(i * 100, 1500)}ms` }}
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
