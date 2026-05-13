'use client';

import { useAppContext } from '@/context/AppContext';
import { getDifficultyDotColor, getDifficultyLabel } from '@/lib/vocab';
import type { Difficulty } from '@/types';
import { X } from 'lucide-react';
import type { SavedWord } from '@/types';

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  cet4: 'bg-[#D4E8D0] text-[#3A5C34]',
  cet6: 'bg-[#F5E6C8] text-[#5C4A1E]',
  postgrad: 'bg-[#F0D3D3] text-[#5C2A2A]',
};

export default function CollectionPage() {
  const { savedWords, removeWordFromCollection } = useAppContext();
  const words = Object.values(savedWords);

  const handleRemove = (word: string) => {
    removeWordFromCollection(word);
  };

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <h1 className="font-display text-4xl text-[#2D2B28] mb-10">生词收藏</h1>

      {words.length === 0 && (
        <p className="text-[#78716C] text-center py-12 font-zh-serif">
          还没有收藏的生词。阅读文章时点击 ⭐ 即可收藏。
        </p>
      )}

      {words.length > 0 && (
        <div className="space-y-1">
          {Object.values(words)
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
                  <span className="text-[13px] text-[#78716C] ml-2">{w.definition}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${DIFFICULTY_BADGE[w.difficulty]}`}>
                  {getDifficultyLabel(w.difficulty)}
                </span>
                <span className="text-[10px] text-[#78716C]">{w.date}</span>
                <button
                  onClick={() => handleRemove(w.word)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[#78716C] hover:text-red-400 transition-all"
                  title="删除"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
