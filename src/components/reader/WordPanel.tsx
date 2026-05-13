'use client';

import { useState } from 'react';
import type { VocabEntry } from '@/types';
import { getDifficultyDotColor } from '@/lib/vocab';
import { useAppContext } from '@/context/AppContext';
import { Star, Check, Eye, EyeOff, Undo2 } from 'lucide-react';

interface PanelWord {
  word: string;
  entry: VocabEntry;
}

interface WordPanelProps {
  unknownWords: PanelWord[];
  knownArticleWords: PanelWord[];
  onMarkKnown: (word: string) => void;
  onUnmarkKnown: (word: string) => void;
}

type Tab = 'words' | 'sentences';

export default function WordPanel({
  unknownWords,
  knownArticleWords,
  onMarkKnown,
  onUnmarkKnown,
}: WordPanelProps) {
  const [tab, setTab] = useState<Tab>('words');
  const [showKnown, setShowKnown] = useState(true);
  const { saveWordToCollection, isWordInCollection } = useAppContext();

  const handleSave = (w: PanelWord) => {
    saveWordToCollection({
      word: w.word,
      definition: w.entry.definition,
      difficulty: w.entry.difficulty,
      date: new Date().toISOString().split('T')[0],
      articleTitle: '',
    });
  };

  const renderWordRow = (w: PanelWord, isKnown: boolean) => {
    const saved = isWordInCollection(w.word);
    return (
      <div
        key={w.word}
        className={`flex items-start gap-2 py-2 border-b border-[#E8E4DD] last:border-0 group ${
          isKnown ? 'opacity-40 hover:opacity-70' : ''
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isKnown ? 'bg-[#C0B8A8]' : getDifficultyDotColor(w.entry.difficulty)}`}
        />
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-medium ${isKnown ? 'text-[#A09888]' : 'text-[#2D2B28]'}`}>
            {w.word}
          </span>
          <span className="text-[10px] text-[#78716C] ml-1">{w.entry.pos}</span>
          <p className="text-xs text-[#78716C] truncate">{w.entry.definition}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0 mt-0.5 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {isKnown ? (
            <button
              onClick={() => onUnmarkKnown(w.word)}
              title="移回生词"
              className="p-1 rounded text-[#78716C] hover:text-[#C88C4A]"
            >
              <Undo2 size={15} />
            </button>
          ) : (
            <>
              <button
                onClick={() => handleSave(w)}
                disabled={saved}
                title="收藏"
                className={`p-1 rounded ${
                  saved ? 'text-[#C88C4A]' : 'text-[#78716C] hover:text-[#C88C4A]'
                }`}
              >
                <Star size={15} fill={saved ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => onMarkKnown(w.word)}
                title="已认识"
                className="p-1 rounded text-[#78716C] hover:text-[#7CB868]"
              >
                <Check size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-1 p-2">
        <button
          onClick={() => setTab('words')}
          className={`flex-1 text-[13px] py-1.5 rounded-md font-medium transition-colors font-zh-serif ${
            tab === 'words'
              ? 'bg-[#E8DCC8] text-[#5C3D2E]'
              : 'bg-transparent text-[#78716C] hover:bg-[#EDE9E0]'
          }`}
        >
          词汇
        </button>
        <button
          onClick={() => setTab('sentences')}
          className={`flex-1 text-[13px] py-1.5 rounded-md font-medium transition-colors font-zh-serif ${
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

        {tab === 'words' && unknownWords.length === 0 && knownArticleWords.length === 0 && (
          <p className="text-xs text-[#78716C] text-center mt-8 font-zh-serif">本文暂无生词</p>
        )}

        {tab === 'words' && (
          <>
            {unknownWords.map(w => renderWordRow(w, false))}

            {knownArticleWords.length > 0 && (
              <div className="mt-3 pt-2 border-t border-[#E8E4DD]">
                <button
                  onClick={() => setShowKnown(!showKnown)}
                  className="flex items-center gap-1 text-[11px] text-[#A09888] hover:text-[#78716C] transition-colors mb-1 font-zh-serif"
                >
                  {showKnown ? <Eye size={12} /> : <EyeOff size={12} />}
                  已认识 · {knownArticleWords.length}
                </button>
                {showKnown && knownArticleWords.map(w => renderWordRow(w, true))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
