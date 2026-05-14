'use client';

import { useState, useRef } from 'react';
import { HelpCircle } from 'lucide-react';

export default function CloseReadingLegend() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const closeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeRef.current) clearTimeout(closeRef.current);
    setLeaving(false);
    setShow(true);
  };

  const handleMouseLeave = () => {
    setLeaving(true);
    closeRef.current = setTimeout(() => {
      setShow(false);
      setLeaving(false);
    }, 1000);
  };

  const animClass = leaving ? 'animate-popup-out' : 'animate-popup-in';

  return (
    <span className="relative inline-flex items-center -ml-0.5" onMouseLeave={handleMouseLeave}>
      <button
        type="button"
        className="text-[#78716C] hover:text-[#B08844] transition-colors cursor-help"
        onMouseEnter={handleMouseEnter}
        aria-label="精读说明"
      >
        <HelpCircle size={16} />
      </button>

      {show && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 bg-[#FEFCF5] border border-[#E8E4DD] rounded-xl shadow-lg p-3 min-w-[220px] ${animClass}`}
          onMouseEnter={handleMouseEnter}
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
