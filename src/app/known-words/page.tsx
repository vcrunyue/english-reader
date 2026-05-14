'use client';

import { useState, useEffect, useMemo } from 'react';
import type { VocabMap, Difficulty } from '@/types';
import { loadVocab, getDifficultyDotColor, getDifficultyLabel } from '@/lib/vocab';
import { getBadgeClass, DIFFICULTY_FILTERS } from '@/config/difficulty';
import { useAppContext } from '@/context/AppContext';
import { X } from 'lucide-react';

const btnBase = 'text-sm px-3 py-1.5 rounded-md border border-[#D8D2C8] transition-colors duration-200 font-zh-serif';

export default function KnownWordsPage() {
  const [vocab, setVocab] = useState<VocabMap | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const { knownWords, knownWordDates, unmarkKnown } = useAppContext();

  useEffect(() => {
    loadVocab().then(setVocab);
  }, []);

  const knownList = useMemo(() => {
    if (!vocab) return [];
    const all = [...knownWords]
      .map(word => ({ word, entry: vocab[word.toLowerCase()] }))
      .filter(item => item.entry)
      .sort((a, b) => a.word.localeCompare(b.word));
    if (difficulty === 'all') return all;
    return all.filter(item => item.entry.difficulty === difficulty);
  }, [vocab, knownWords, difficulty]);

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <h1 className="font-display text-4xl text-[#2D2B28] mb-10">熟词收藏</h1>

      {!vocab && (
        <p className="text-[#78716C] text-center py-12 font-zh-serif">加载中...</p>
      )}

      {vocab && knownWords.size === 0 && (
        <p className="text-[#78716C] text-center py-12 font-zh-serif">
          还没有熟词。阅读文章时点击熟词按钮即可添加。
        </p>
      )}

      {vocab && knownWords.size > 0 && (
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
          {knownList.length === 0 ? (
            <p className="text-[#78716C] text-center py-8 font-zh-serif">该难度暂无熟词</p>
          ) : (
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
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${getBadgeClass(entry.difficulty)}`}>
                {getDifficultyLabel(entry.difficulty)}
              </span>
              {date && <span className="text-[10px] text-[#78716C]">{date}</span>}
              <button
                onClick={() => unmarkKnown(word)}
                className="opacity-0 group-hover:opacity-100 p-1 text-[#78716C] hover:text-red-400 transition-all"
                aria-label="移出熟词"
              >
                <X size={14} />
              </button>
            </div>
          )})}
            </div>
          )}
        </>
      )}
    </div>
  );
}
