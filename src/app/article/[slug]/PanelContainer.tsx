'use client';

import { useState, useCallback } from 'react';
import WordPanelWrapper from './WordPanelWrapper';

export default function PanelContainer({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);

  const handleTabChange = useCallback((tab: 'words' | 'sentences') => {
    setExpanded(tab === 'sentences');
  }, []);

  return (
    <aside
      className={`shrink-0 border-l border-[#E8E4DD] bg-[#F7F5F0] overflow-y-auto transition-[width] duration-400 ease-out ${
        expanded ? 'w-[360px]' : 'w-[220px]'
      }`}
    >
      <WordPanelWrapper content={content} onTabChange={handleTabChange} />
    </aside>
  );
}
