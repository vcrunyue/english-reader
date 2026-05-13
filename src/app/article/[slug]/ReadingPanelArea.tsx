'use client';

import type { SentencePair } from '@/types';
import { useAppContext } from '@/context/AppContext';
import CloseReadingPanel from '@/components/reader/CloseReadingPanel';

interface ReadingPanelAreaProps {
  translations: SentencePair[][];
}

export default function ReadingPanelArea({ translations }: ReadingPanelAreaProps) {
  const { closeReadingEnabled, selectedParagraph } = useAppContext();

  if (!closeReadingEnabled) return null;

  return (
    <CloseReadingPanel
      translations={translations}
      selectedParagraph={selectedParagraph}
    />
  );
}
