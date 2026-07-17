'use client';

import { useState, useMemo } from 'react';
import type { Difficulty } from '@/types';
import { getDifficultyDotColor, getDifficultyLabel, parseDefinitionParts } from '@/lib/vocab';
import { getBadgeClass, DIFFICULTY_FILTERS } from '@/config/difficulty';
import { useVocab } from '@/context/VocabContext';
import { useKnownWords } from '@/context/KnownWordsContext';
import { PageState } from '@/components/feedback/PageState';
import { X } from 'lucide-react';

const btnBase = 'min-h-11 text-sm px-3 py-1.5 rounded-md border border-[#D8D2C8] transition-colors duration-200 font-zh-serif';

export default function KnownWordsPage() {
  const { vocab, error, retry } = useVocab();
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const { knownWords, unmarkWordKnown } = useKnownWords();

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

      {error && (
        <PageState
          title="词表加载失败"
          description={`${error} 保存在本机的熟词记录没有受到影响。`}
          action={{ label: '重新加载词表', onClick: retry }}
          tone="error"
        />
      )}

      {!error && !vocab && (
        <PageState
          title="正在加载词表"
          description="词表准备好后即可查看和管理熟词。"
          tone="loading"
        />
      )}

      {vocab && knownWords.size === 0 && (
        <p className="text-[#78716C] text-center py-12 font-zh-serif">
          还没有熟词。阅读文章时点击熟词按钮即可添加。
        </p>
      )}

      {vocab && knownWords.size > 0 && (
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
          {knownList.length === 0 ? (
            <p className="text-[#78716C] text-center py-8 font-zh-serif">该难度暂无熟词</p>
          ) : (
            <div className="space-y-1">
              {knownList.map(({ word, entry }) => {
            return (
            <div
              key={word}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[#F2EFE8] group transition-colors"
            >
              <span className={`w-[9px] h-[9px] rounded-full shrink-0 ${getDifficultyDotColor(entry.difficulty)}`} />
              <div className="flex-1 min-w-0 truncate">
                <span className="font-medium text-sm text-[#2D2B28]">{word}</span>
                <span className="text-[13px] text-[#78716C]">
                  {'       '}
                  {parseDefinitionParts(entry.pos, entry.definition)
                    .map(p => p.pos + ' ' + p.def)
                    .join('     ')}
                </span>
              </div>
              <span className={`text-[13px] font-semibold px-2 py-1 rounded-md shrink-0 ${getBadgeClass(entry.difficulty)}`}>
                {getDifficultyLabel(entry.difficulty)}
              </span>
              <button
                type="button"
                onClick={() => unmarkWordKnown(word)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-[#78716C] opacity-100 transition-all hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C4A] lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
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
