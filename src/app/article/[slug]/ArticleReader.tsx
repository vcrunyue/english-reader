'use client';

import { useVocab } from '@/context/VocabContext';
import { useReading } from '@/context/ReadingContext';
import ArticleBody from '@/components/reader/ArticleBody';

export default function ArticleReader({ content }: { content: string }) {
  const vocab = useVocab();
  const { closeReadingEnabled, selectedParagraph, selectParagraph } = useReading();

  if (!vocab) {
    return (
      <div className="text-gray-400 text-sm py-12 text-center">加载词汇表中...</div>
    );
  }

  return (
    <ArticleBody
      content={content}
      vocab={vocab}
      closeReadingEnabled={closeReadingEnabled}
      selectedParagraph={selectedParagraph}
      onParagraphSelect={selectParagraph}
    />
  );
}
