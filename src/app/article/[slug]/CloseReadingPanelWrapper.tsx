'use client';

import { useReading } from '@/context/ReadingContext';
import type { SentencePair } from '@/types';
import CloseReadingPanel from '@/components/reader/CloseReadingPanel';

interface Props {
  translations: SentencePair[][];
}

export default function CloseReadingPanelWrapper({ translations }: Props) {
  const { closeReadingEnabled, selectedParagraph } = useReading();

  return (
    <div
      className={`shrink-0 overflow-hidden transition-[width] duration-[900ms] ease-out ${
        closeReadingEnabled ? 'w-[600px]' : 'w-0'
      }`}
    >
      <div className="w-[600px] h-full border-l border-[#E8E4DD] bg-[#F7F5F0]">
        <CloseReadingPanel
          translations={translations}
          selectedParagraph={selectedParagraph}
        />
      </div>
    </div>
  );
}
