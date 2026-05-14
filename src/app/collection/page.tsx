'use client';

import { useState, useMemo } from 'react';
import { useCollection } from '@/context/CollectionContext';
import { getDifficultyDotColor, getDifficultyLabel, parseDefinitionParts } from '@/lib/vocab';
import { getBadgeClass, DIFFICULTY_FILTERS } from '@/config/difficulty';
import type { Difficulty, SavedWord } from '@/types';
import { X } from 'lucide-react';

const btnBase = 'text-sm px-3 py-1.5 rounded-md border border-[#D8D2C8] transition-colors duration-200 font-zh-serif';

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
    <div className="max-w-2xl mx-auto px-8 py-10">
      <h1 className="font-display text-4xl text-[#2D2B28] mb-10">生词收藏</h1>

      {words.length === 0 && (
        <p className="text-[#78716C] text-center py-12 font-zh-serif">
          还没有收藏的生词。阅读文章时点击收藏按钮即可收藏。
        </p>
      )}

      {words.length > 0 && (
        <>
          <div className="flex gap-2 mb-6">
            {DIFFICULTY_FILTERS.map(({ key, label, activeClass }) => (
              <button
                key={key}
                onClick={() => setDifficulty(key)}
                className={`${btnBase} ${difficulty === key ? activeClass : 'text-[#78716C] hover:bg-[#EDE9E0]'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="text-[#78716C] text-center py-8 font-zh-serif">该难度暂无生词</p>
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
                  <span className="text-[13px] text-[#78716C] ml-1.5">
                    {w.pos
                      ? parseDefinitionParts(w.pos, w.definition)
                          .map(p => p.pos + ' ' + p.def)
                          .join('    ')
                      : w.definition}
                  </span>
                </div>
                <span className={`text-[13px] font-semibold px-2 py-1 rounded-md shrink-0 ${getBadgeClass(w.difficulty)}`}>
                  {getDifficultyLabel(w.difficulty)}
                </span>
                <button
                  onClick={() => handleRemove(w.word)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[#78716C] hover:text-red-400 transition-all"
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
