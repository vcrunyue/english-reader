'use client';

import { useAppContext } from '@/context/AppContext';
import type { SentencePair } from '@/types';
import ArticleReader from './ArticleReader';
import CloseReadingPanel from '@/components/reader/CloseReadingPanel';

interface Props {
  content: string;
  translations: SentencePair[][];
  title: string;
  source: string;
  date: string;
}

export default function CloseReadingLayout({
  content,
  translations,
  title,
  source,
  date,
}: Props) {
  const { closeReadingEnabled, selectedParagraph } = useAppContext();

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* 文章正文区 */}
      <div
        className={`flex-1 overflow-y-auto py-8 min-w-0 ${
          closeReadingEnabled ? 'max-w-[680px]' : ''
        }`}
      >
        <div className="px-8">
          <h1 className="font-display text-3xl text-[#2D2B28] mb-2">{title}</h1>
          <p className="text-[13px] text-[#78716C] mb-8">
            {source} · {date}
          </p>
        </div>
        <ArticleReader content={content} />
      </div>

      {/* 精读面板 */}
      {closeReadingEnabled && (
        <CloseReadingPanel
          translations={translations}
          selectedParagraph={selectedParagraph}
        />
      )}
    </div>
  );
}
