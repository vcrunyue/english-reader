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
    <div className="relative hidden shrink-0 lg:flex">
      {/* 悬浮触发区 + 竖线拉出式标签按钮 */}
      <div className="absolute left-0 top-0 bottom-0 w-6 -translate-x-6 z-20 group/toggle">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={`
            absolute right-0 top-1/2 -translate-y-1/2
            flex min-h-11 min-w-11 items-center justify-end
            transition-all duration-[900ms] ease-out
            opacity-0 group-hover/toggle:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C4A]
            ${collapsed ? 'translate-x-1 group-hover/toggle:translate-x-0' : 'translate-x-0'}
          `}
          aria-label={collapsed ? '展开单词栏' : '收起单词栏'}
        >
          <span className="flex h-12 w-5 items-center justify-center rounded-l-md border border-r-0 border-[#E8E4DD] bg-[#F7F5F0]">
            <ChevronRight
              aria-hidden="true"
              size={13}
              className={`text-[#A09888] transition-transform duration-700 ${
                collapsed ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>
      </div>

      <aside
        className={`border-l border-[#E8E4DD] bg-[#F7F5F0] overflow-hidden transition-[width] duration-[900ms] ease-out ${
          collapsed ? 'w-0 border-l-0' : expanded ? 'w-[360px]' : 'w-[220px]'
        }`}
      >
        <div className={`h-full ${expanded ? 'w-[360px]' : 'w-[220px]'}`}>
          <WordPanelWrapper content={content} onTabChange={handleTabChange} />
        </div>
      </aside>
    </div>
  );
}
