'use client';

import { useState, useMemo, useCallback } from 'react';
import { analyzeText } from '@/lib/vocab';
import { useVocab } from '@/context/VocabContext';
import { useKnownWords } from '@/context/KnownWordsContext';
import { PageState } from '@/components/feedback/PageState';
import WordPanel from '@/components/reader/WordPanel';

interface Props {
  content: string;
  onTabChange?: (tab: 'words' | 'sentences') => void;
}

export default function WordPanelWrapper({ content, onTabChange }: Props) {
  const { vocab, error, retry } = useVocab();
  const [knownInArticle, setKnownInArticle] = useState<Set<string>>(new Set());
  const { knownWords, markWordKnown, unmarkWordKnown } = useKnownWords();

  const allWords = useMemo(() => {
    if (!vocab) return [];
    return analyzeText(content, vocab, new Set());
  }, [content, vocab]);

  const unknownWords = useMemo(
    () => allWords.filter(w => !knownInArticle.has(w.word) && !knownWords.has(w.word)),
    [allWords, knownInArticle, knownWords],
  );

  const knownArticleWords = useMemo(
    () => allWords.filter(w => knownInArticle.has(w.word)),
    [allWords, knownInArticle],
  );

  const handleMarkKnown = useCallback(
    (word: string) => {
      markWordKnown(word);
      setKnownInArticle(prev => new Set(prev).add(word));
    },
    [markWordKnown],
  );

  const handleUnmarkKnown = useCallback(
    (word: string) => {
      unmarkWordKnown(word);
      setKnownInArticle(prev => {
        const next = new Set(prev);
        next.delete(word);
        return next;
      });
    },
    [unmarkWordKnown],
  );

  if (error) {
    return (
      <div className="p-3 [&_section]:px-4 [&_section]:py-6 [&_h2]:text-lg">
        <PageState
          title="词表加载失败"
          description={`${error} 本机学习记录没有受到影响。`}
          action={{ label: '重新加载', onClick: retry }}
          tone="error"
        />
      </div>
    );
  }

  if (!vocab) {
    return (
      <div className="p-3 [&_section]:px-4 [&_section]:py-6 [&_h2]:text-lg">
        <PageState
          title="正在加载词表"
          description="词表准备好后会显示本文生词。"
          tone="loading"
        />
      </div>
    );
  }

  return (
    <WordPanel
      unknownWords={unknownWords}
      knownArticleWords={knownArticleWords}
      onMarkKnown={handleMarkKnown}
      onUnmarkKnown={handleUnmarkKnown}
      onTabChange={onTabChange}
    />
  );
}
