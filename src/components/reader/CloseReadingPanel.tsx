'use client';

import type { SentencePair } from '@/types';

interface CloseReadingPanelProps {
  translations: SentencePair[][];
  selectedParagraph: number;
}

export default function CloseReadingPanel({
  translations,
  selectedParagraph,
}: CloseReadingPanelProps) {
  const totalParagraphs = translations.length;
  const current = translations[selectedParagraph] ?? [];

  return (
    <aside className="shrink-0 w-[400px] border-l border-[#E8E4DD] bg-[#F7F5F0] overflow-y-auto flex flex-col">
      <div className="px-5 py-4 border-b border-[#E8E4DD]">
        <span className="text-[14px] font-medium text-[#5C3D2E] font-zh-serif">
          精读
        </span>
        <span className="text-[12px] text-[#A09888] ml-2 font-zh-serif">
          第 {selectedParagraph + 1} 段{totalParagraphs > 0 && ` / ${totalParagraphs}`}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {current.length === 0 ? (
          <p className="text-xs text-[#78716C] text-center mt-8 font-zh-serif">
            该段落暂无翻译
          </p>
        ) : (
          current.map((pair, i) => (
            <div key={i} className="pb-4 border-b border-[#E8E4DD] last:border-0 last:pb-0">
              <p className="text-[15px] text-[#2D2B28] leading-relaxed font-serif">
                {pair.en}
              </p>
              <p className="text-[13px] text-[#78716C] leading-relaxed mt-2 font-zh-serif">
                {pair.zh}
              </p>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
