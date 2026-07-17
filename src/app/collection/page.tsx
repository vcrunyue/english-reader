'use client';

import { useState, useMemo } from 'react';
import { useCollection } from '@/context/CollectionContext';
import { getDifficultyDotColor, getDifficultyLabel, parseDefinitionParts } from '@/lib/vocab';
import { getBadgeClass, DIFFICULTY_FILTERS } from '@/config/difficulty';
import type { Difficulty, SavedWord } from '@/types';
import { X } from 'lucide-react';
import { PageState } from '@/components/feedback/PageState';

const btnBase = 'min-h-11 text-sm px-3 py-1.5 rounded-md border border-[#D8D2C8] transition-colors duration-200 font-zh-serif';

export default function CollectionPage() {
  const { savedWords, removeWordFromCollection } = useCollection();
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const words = Object.values(savedWords);

  const filtered = useMemo(
    () => difficulty === 'all' ? words : words.filter(w => w.difficulty === difficulty),
    [words, difficulty],
  );

  const handleRemove = (word: string) => {
    removeWordFromCollection(word);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-8 sm:py-10">
      <h1 className="mb-6 font-display text-3xl text-[#2D2B28] sm:mb-10 sm:text-4xl">生词收藏</h1>

      {words.length === 0 && (
        <PageState
          title="还没有收藏生词"
          description="阅读文章时可以在词汇面板中收藏想复习的单词。"
          action={{ label: '开始阅读', href: '/' }}
          tone="empty"
        />
      )}

      {words.length > 0 && (
        <>
          <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="按难度筛选">
            {DIFFICULTY_FILTERS.map(({ key, label, activeClass }) => (
              <button
                key={key}
                type="button"
                onClick={() => setDifficulty(key)}
                aria-pressed={difficulty === key}
                className={`${btnBase} ${difficulty === key ? activeClass : 'text-[#78716C] hover:bg-[#EDE9E0]'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <PageState
              title="该难度暂无生词"
              description="清除难度筛选后可以查看全部收藏的生词。"
              action={{ label: '清除筛选', onClick: () => setDifficulty('all') }}
              tone="empty"
            />
          ) : (
            <div className="space-y-1">
              {filtered
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((w: SavedWord) => (
              <div
                key={w.word}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[#F2EFE8] group transition-colors"
              >
                <span
                  className={`w-[9px] h-[9px] rounded-full shrink-0 ${getDifficultyDotColor(w.difficulty)}`}
                />
                <div className="flex-1 min-w-0 truncate">
                  <span className="font-medium text-sm text-[#2D2B28]">{w.word}</span>
                  <span className="text-[13px] text-[#78716C]">
                    {'       '}
                    {w.pos
                      ? parseDefinitionParts(w.pos, w.definition)
                          .map(p => p.pos + ' ' + p.def)
                          .join('     ')
                      : w.definition}
                  </span>
                </div>
                <span className={`text-[13px] font-semibold px-2 py-1 rounded-md shrink-0 ${getBadgeClass(w.difficulty)}`}>
                  {getDifficultyLabel(w.difficulty)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(w.word)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-[#78716C] opacity-100 transition-all hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C4A] lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
                  aria-label="删除"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
