'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { ArticleMeta, Difficulty } from '@/types';
import { useCollection } from '@/context/CollectionContext';
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

export default function SavedArticlesContent({ allMetas }: { allMetas: ArticleMeta[] }) {
  const { savedArticles } = useCollection();

  // only show articles that are saved
  const savedMetas = useMemo(
    () => allMetas
      .filter(m => m.slug in savedArticles)
      .sort((a, b) => (savedArticles[b.slug] ?? '').localeCompare(savedArticles[a.slug] ?? '')),
    [allMetas, savedArticles],
  );

  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [source, setSource] = useState('all');
  const [view, setView] = useState<ViewMode>('grid');
  const [sort, setSort] = useState<SortMode>('default');
  const [randomSeed, setRandomSeed] = useState(0);

  const sources = useMemo(
    () => [...new Set(savedMetas.map(a => a.source))],
    [savedMetas],
  );

  const filtered = useMemo(() => {
    let result = savedMetas.filter(a => {
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
  }, [savedMetas, difficulty, source, sort, randomSeed]);

  const handleSort = useCallback((key: SortMode) => {
    setSort(key);
    if (key === 'random') setRandomSeed(s => s + 1);
  }, []);

  const generation = `${difficulty}|${source}|${sort}|${randomSeed}`;

  const FILTER_KEY = 'eng_filter_state_saved';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FILTER_KEY);
      if (saved) {
        const s = JSON.parse(saved);
        setDifficulty(s.difficulty ?? 'all');
        setSource(s.source ?? 'all');
        setView(s.view ?? 'grid');
        setSort(s.sort ?? 'default');
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(FILTER_KEY, JSON.stringify({ difficulty, source, view, sort }));
  }, [difficulty, source, view, sort]);

  const count = Object.keys(savedArticles).length;

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <h1 className="font-display text-4xl text-[#2D2B28] mb-10">文章收藏</h1>

      {count === 0 && (
        <p className="text-[#78716C] text-center py-12 font-zh-serif">
          还没有收藏的文章。在文章列表或阅读页面点击收藏按钮即可收藏。
        </p>
      )}

      {count > 0 && savedMetas.length === 0 && (
        <p className="text-[#78716C] text-center py-12 font-zh-serif">
          收藏的文章暂无数据，可能已被移除。
        </p>
      )}

      {savedMetas.length > 0 && (
        <div className="space-y-3">
          <FilterBar
            selectedDifficulty={difficulty}
            selectedSource={source}
            sources={sources}
            onDifficultyChange={setDifficulty}
            onSourceChange={setSource}
          />

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

          {view === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 !mt-[27px]">
              {filtered.map((article, i) => (
                <div
                  key={`${generation}-${article.slug}`}
                  className="animate-card-enter"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <ArticleCard article={article} layout="grid" />
                </div>
              ))}
            </div>
          )}

          {view === 'list' && (
            <div className="flex flex-col gap-3 !mt-[27px]">
              {filtered.map((article, i) => (
                <div
                  key={`${generation}-${article.slug}`}
                  className="animate-card-enter"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <ArticleCard article={article} layout="list" />
                </div>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <p className="text-[#78716C] text-center py-12 font-zh-serif">没有匹配的文章</p>
          )}
        </div>
      )}
    </div>
  );
}
