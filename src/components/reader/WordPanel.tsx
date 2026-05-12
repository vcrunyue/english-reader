'use client';

import { useState } from 'react';
import type { VocabEntry } from '@/types';
import { getDifficultyDotColor } from '@/lib/vocab';
import { useAppContext } from '@/context/AppContext';
import { Star, Check } from 'lucide-react';

interface PanelWord {
  word: string;
  entry: VocabEntry;
}

interface WordPanelProps {
  words: PanelWord[];
}

type Tab = 'words' | 'sentences';

export default function WordPanel({ words }: WordPanelProps) {
  const [tab, setTab] = useState<Tab>('words');
  const { markKnown, saveWordToCollection, isWordInCollection } = useAppContext();

  const handleMarkKnown = (word: string) => {
    markKnown(word);
  };

  const handleSave = (w: PanelWord) => {
    saveWordToCollection({
      word: w.word,
      definition: w.entry.definition,
      difficulty: w.entry.difficulty,
      date: new Date().toISOString().split('T')[0],
      articleTitle: '',
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-1 p-2">
        <button
          onClick={() => setTab('words')}
          className={`flex-1 text-[13px] py-1.5 rounded-md font-medium transition-colors ${
            tab === 'words'
              ? 'bg-[#E8DCC8] text-[#5C3D2E]'
              : 'bg-transparent text-[#78716C] hover:bg-[#EDE9E0]'
          }`}
        >
          词汇
        </button>
        <button
          onClick={() => setTab('sentences')}
          className={`flex-1 text-[13px] py-1.5 rounded-md font-medium transition-colors ${
            tab === 'sentences'
              ? 'bg-[#E8DCC8] text-[#5C3D2E]'
              : 'bg-transparent text-[#78716C] hover:bg-[#EDE9E0]'
          }`}
        >
          句子
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {tab === 'sentences' && (
          <p className="text-xs text-[#78716C] text-center mt-8 font-zh-serif">句子分析功能即将推出</p>
        )}

        {tab === 'words' && words.length === 0 && (
          <p className="text-xs text-[#78716C] text-center mt-8 font-zh-serif">本文暂无生词</p>
        )}

        {tab === 'words' &&
          words.map(({ word, entry }) => {
            const saved = isWordInCollection(word);
            return (
              <div
                key={word}
                className="flex items-start gap-2 py-2 border-b border-[#E8E4DD] last:border-0 group"
              >
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getDifficultyDotColor(entry.difficulty)}`}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-[#2D2B28]">{word}</span>
                  <span className="text-[10px] text-[#78716C] ml-1">{entry.pos}</span>
                  <p className="text-xs text-[#78716C] truncate">{entry.definition}</p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleSave({ word, entry })}
                    disabled={saved}
                    title="收藏"
                    className={`p-1 rounded ${
                      saved ? 'text-[#C88C4A]' : 'text-[#78716C] hover:text-[#C88C4A]'
                    }`}
                  >
                    <Star size={14} fill={saved ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => handleMarkKnown(word)}
                    title="已认识"
                    className="p-1 rounded text-[#78716C] hover:text-[#7CB868]"
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
