'use client';

import { useState, useCallback } from 'react';
import WordPanelWrapper from './WordPanelWrapper';
import { ChevronRight } from 'lucide-react';

export default function PanelContainer({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleTabChange = useCallback((tab: 'words' | 'sentences') => {
    setExpanded(tab === 'sentences');
  }, []);

  return (
    <div className="relative shrink-0 flex">
      {/* 悬浮触发区 + 半圆按钮 */}
      <div className="absolute left-0 top-0 bottom-0 w-8 -translate-x-6 z-20 group/toggle">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            absolute left-0 top-1/2 -translate-y-1/2
            w-7 h-14 bg-[#F7F5F0] border border-[#E8E4DD] rounded-l-full
            flex items-center justify-center pl-0.5
            transition-all duration-300 ease-out
            opacity-0 group-hover/toggle:opacity-100
            ${collapsed ? 'translate-x-1 group-hover/toggle:translate-x-0' : 'translate-x-0'}
          `}
          aria-label={collapsed ? '展开单词栏' : '收起单词栏'}
        >
          <ChevronRight
            size={15}
            className={`text-[#78716C] transition-transform duration-300 ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      <aside
        className={`border-l border-[#E8E4DD] bg-[#F7F5F0] overflow-hidden transition-[width] duration-500 ease-out ${
          collapsed ? 'w-0 border-l-0' : expanded ? 'w-[360px]' : 'w-[220px]'
        }`}
      >
        <div className={expanded ? 'w-[360px]' : 'w-[220px]'}>
          <WordPanelWrapper content={content} onTabChange={handleTabChange} />
        </div>
      </aside>
    </div>
  );
}
