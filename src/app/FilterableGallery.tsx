'use client';

import { useState, useMemo, useCallback } from 'react';
import type { ArticleMeta, Difficulty } from '@/types';
import ArticleCard from '@/components/gallery/ArticleCard';
import FilterBar from '@/components/gallery/FilterBar';
import { PageState } from '@/components/feedback/PageState';
import { useClientReady } from '@/hooks/use-client-ready';

type ViewMode = 'grid' | 'list';
type SortMode = 'default' | 'wordCount' | 'random';

interface GalleryPreferences {
  difficulty: Difficulty | 'all';
  source: string;
  view: ViewMode;
  sort: SortMode;
}

const FILTER_KEY = 'eng_filter_state';

const DEFAULT_PREFERENCES: GalleryPreferences = {
  difficulty: 'all',
  source: 'all',
  view: 'grid',
  sort: 'default',
};

const btnBase =
  'min-h-11 text-sm px-3 py-1.5 rounded-md border border-[#D8D2C8] transition-colors duration-200 font-zh-serif';

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

function readPreferences(key: string): GalleryPreferences {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(saved) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return DEFAULT_PREFERENCES;
    }
    const values = parsed as Record<string, unknown>;
    return {
      difficulty:
        values.difficulty === 'all' ||
        values.difficulty === 'cet4' ||
        values.difficulty === 'cet6' ||
        values.difficulty === 'postgrad'
          ? values.difficulty
          : DEFAULT_PREFERENCES.difficulty,
      source:
        typeof values.source === 'string' && values.source.trim().length > 0
          ? values.source
          : DEFAULT_PREFERENCES.source,
      view:
        values.view === 'grid' || values.view === 'list'
          ? values.view
          : DEFAULT_PREFERENCES.view,
      sort:
        values.sort === 'default' || values.sort === 'wordCount' || values.sort === 'random'
          ? values.sort
          : DEFAULT_PREFERENCES.sort,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function shuffleArray<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let state = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = Math.floor((state / 4294967296) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FilterableGallery({ articles }: { articles: ArticleMeta[] }) {
  const ready = useClientReady();
  const initial = ready ? readPreferences(FILTER_KEY) : DEFAULT_PREFERENCES;

  return (
    <HydratedGallery
      key={ready ? 'client' : 'server'}
      articles={articles}
      initial={initial}
    />
  );
}

function HydratedGallery({
  articles,
  initial,
}: {
  articles: ArticleMeta[];
  initial: GalleryPreferences;
}) {
  const [preferences, setPreferences] = useState(initial);
  const [randomSeed, setRandomSeed] = useState(0);
  const { difficulty, source, view, sort } = preferences;

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
        result = shuffleArray(result, randomSeed);
        break;
    }

    return result;
  }, [articles, difficulty, source, sort, randomSeed]);

  const updatePreferences = useCallback((updates: Partial<GalleryPreferences>) => {
    const next = { ...preferences, ...updates };
    setPreferences(next);
    try {
      localStorage.setItem(FILTER_KEY, JSON.stringify(next));
    } catch {
      // Keep the in-memory preference when storage is unavailable.
    }
  }, [preferences]);

  const handleSort = useCallback((key: SortMode) => {
    updatePreferences({ sort: key });
    if (key === 'random') {
      setRandomSeed(s => s + 1);
    }
  }, [updatePreferences]);

  const resetFilters = useCallback(() => {
    updatePreferences({ difficulty: 'all', source: 'all' });
  }, [updatePreferences]);

  // Force remount on filter/sort changes so CSS animation replays
  const generation = `${difficulty}|${source}|${sort}|${randomSeed}`;

  return (
    <div className="space-y-3">
      <FilterBar
        selectedDifficulty={difficulty}
        selectedSource={source}
        sources={sources}
        onDifficultyChange={value => updatePreferences({ difficulty: value })}
        onSourceChange={value => updatePreferences({ source: value })}
      />

      {/* 显示行 */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="切换显示方式">
          <span className="ml-0.5 w-10 shrink-0 -mt-px font-zh-serif text-[15px] font-bold text-[#78716C]">
            显示
          </span>
          {VIEW_OPTIONS.map(({ key, label }) => {
            const active = view === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => updatePreferences({ view: key })}
                aria-pressed={active}
                className={`${btnBase} ${active ? activeCls : inactiveCls}`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="排序方式">
          <span className="ml-0.5 w-10 shrink-0 -mt-px font-zh-serif text-[15px] font-bold text-[#78716C]">
            排序
          </span>
          {SORT_OPTIONS.map(({ key, label }) => {
            const active = sort === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSort(key)}
                aria-pressed={active}
                className={`${btnBase} ${active ? activeCls : inactiveCls}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* grid view */}
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

      {/* list view */}
      {view === 'list' && (
        <div className="flex flex-col gap-2 !mt-[27px]">
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

      {/* empty */}
      {filtered.length === 0 && (
        <div className="!mt-8">
          <PageState
            title="没有匹配的文章"
            description="当前筛选条件下没有文章，可以清除筛选后重新查看。"
            action={{ label: '清除筛选', onClick: resetFilters }}
            tone="empty"
          />
        </div>
      )}
    </div>
  );
}
