'use client';

import { useState, useEffect, useMemo } from 'react';
import type { VocabMap } from '@/types';
import { loadVocab, getDifficultyDotColor, getDifficultyLabel } from '@/lib/vocab';
import { useAppContext } from '@/context/AppContext';
import type { Difficulty } from '@/types';
import { X } from 'lucide-react';

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  cet4: 'bg-[#D4E8D0] text-[#3A5C34]',
  cet6: 'bg-[#F5E6C8] text-[#5C4A1E]',
  postgrad: 'bg-[#F0D3D3] text-[#5C2A2A]',
};

export default function KnownWordsPage() {
  const [vocab, setVocab] = useState<VocabMap | null>(null);
  const { knownWords, knownWordDates, unmarkKnown } = useAppContext();

  useEffect(() => {
    loadVocab().then(setVocab);
  }, []);

  const knownList = useMemo(() => {
    if (!vocab) return [];
    return [...knownWords]
      .map(word => ({ word, entry: vocab[word.toLowerCase()] }))
      .filter(item => item.entry)
      .sort((a, b) => a.word.localeCompare(b.word));
  }, [vocab, knownWords]);

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <h1 className="font-display text-4xl text-[#2D2B28] mb-10">熟词收藏</h1>

      {!vocab && (
        <p className="text-[#78716C] text-center py-12 font-zh-serif">加载中...</p>
      )}

      {vocab && knownList.length === 0 && (
        <p className="text-[#78716C] text-center py-12 font-zh-serif">
          还没有熟词。阅读文章时点击 ✓ 即可添加。
        </p>
      )}

      {vocab && knownList.length > 0 && (
        <div className="space-y-1">
          {knownList.map(({ word, entry }) => {
            const date = knownWordDates[word.toLowerCase()];
            return (
            <div
              key={word}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[#F2EFE8] group transition-colors"
            >
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDifficultyDotColor(entry.difficulty)}`} />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm text-[#2D2B28]">{word}</span>
                <span className="text-[13px] text-[#78716C] ml-2">{entry.definition}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${DIFFICULTY_BADGE[entry.difficulty]}`}>
                {getDifficultyLabel(entry.difficulty)}
              </span>
              {date && <span className="text-[10px] text-[#78716C]">{date}</span>}
              <button
                onClick={() => unmarkKnown(word)}
                className="opacity-0 group-hover:opacity-100 p-1 text-[#78716C] hover:text-red-400 transition-all"
                title="移出熟词"
              >
                <X size={14} />
              </button>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}
