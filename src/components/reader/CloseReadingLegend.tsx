'use client';

import { useId, useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function CloseReadingLegend() {
  const [show, setShow] = useState(false);
  const [pinned, setPinned] = useState(false);
  const tooltipId = useId();

  const closeLegend = () => {
    setPinned(false);
    setShow(false);
  };

  return (
    <span
      className="relative -ml-0.5 inline-flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={event => {
        if (!pinned && !event.currentTarget.contains(document.activeElement)) {
          setShow(false);
        }
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeLegend();
      }}
      onKeyDown={event => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          closeLegend();
        }
      }}
    >
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#78716C] transition-colors hover:text-[#B08844] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C4A] cursor-help"
        onFocus={() => setShow(true)}
        onClick={() => {
          if (pinned) closeLegend();
          else {
            setPinned(true);
            setShow(true);
          }
        }}
        aria-label="精读说明"
        aria-expanded={show}
        aria-controls={tooltipId}
        aria-describedby={show ? tooltipId : undefined}
      >
        <HelpCircle size={16} />
      </button>

      {show && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute left-0 top-full z-50 mt-2 w-[min(220px,calc(100vw-2rem))] rounded-xl border border-[#E8E4DD] bg-[#FEFCF5] p-3 shadow-lg animate-popup-in sm:left-1/2 sm:-translate-x-1/2"
        >
          <p className="text-sm font-medium text-[#2D2B28] mb-2 font-zh-serif">精读模式</p>
          <p className="text-[13px] text-[#78716C] leading-relaxed font-zh-serif">
            开启后点击正文段落，右侧面板展示该段的逐句中英双语翻译。
          </p>
        </div>
      )}
    </span>
  );
}
