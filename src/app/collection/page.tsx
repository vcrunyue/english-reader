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
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDifficultyDotColor(w.difficulty)}`}
                />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-[#2D2B28]">{w.word}</span>
                  {(() => {
                    const parts = parseDefinitionParts(w.pos, w.definition);
                    return parts.length === 1 ? (
                      <p className="text-xs text-[#78716C] truncate mt-[4px]">
                        <span className="text-[#5C3D2E] font-medium text-[11px] mr-1">{parts[0].pos}</span>
                        {parts[0].def}
                      </p>
                    ) : (
                      <div className="text-xs text-[#78716C] space-y-[10px] mt-[4px]">
                        {parts.map((p, i) => (
                          <p key={i} className="truncate">
                            <span className="text-[#5C3D2E] font-medium text-[11px] mr-1">{p.pos}</span>
                            {p.def}
                          </p>
                        ))}
                      </div>
                    );
                  })()}
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${getBadgeClass(w.difficulty)}`}>
                  {getDifficultyLabel(w.difficulty)}
                </span>
                <span className="text-[10px] text-[#78716C]">{w.date}</span>
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
