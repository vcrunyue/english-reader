'use client';

import { useState, useRef } from 'react';
import { HelpCircle } from 'lucide-react';

const LEGEND = [
  { color: 'bg-[#D4E8D0]', dot: 'bg-[#7CB868]', label: '四级词汇', desc: '大学英语四级范围' },
  { color: 'bg-[#F5E6C8]', dot: 'bg-[#D4A84C]', label: '六级词汇', desc: '大学英语六级范围' },
  { color: 'bg-[#F0D3D3]', dot: 'bg-[#C86868]', label: '考研词汇', desc: '考研及以上难度' },
];

export default function DifficultyLegend() {
  const [show, setShow] = useState(false);
  const closeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeRef.current) clearTimeout(closeRef.current);
    setShow(true);
  };

  const handleMouseLeave = () => {
    closeRef.current = setTimeout(() => setShow(false), 200);
  };

  return (
    <span className="relative inline-flex items-center -ml-0.5" onMouseLeave={handleMouseLeave}>
      <button
        type="button"
        className="text-[#78716C] hover:text-[#C88C4A] transition-colors cursor-help"
        onMouseEnter={handleMouseEnter}
        aria-label="难度说明"
      >
        <HelpCircle size={16} />
      </button>

      {show && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 bg-[#FEFCF5] border border-[#E8E4DD] rounded-xl shadow-lg p-3 min-w-[200px] animate-popup-in"
          onMouseEnter={handleMouseEnter}
        >
          <p className="text-sm font-medium text-[#2D2B28] mb-2 font-zh-serif">高亮难度说明</p>
          {LEGEND.map(item => (
            <div key={item.label} className="flex items-center gap-2 py-1">
              <span className={`w-3 h-3 rounded-full shrink-0 ${item.dot}`} />
              <span className="text-[13px] text-[#2D2B28]">{item.label}</span>
              <span className="text-[11px] text-[#78716C] ml-auto">{item.desc}</span>
            </div>
          ))}
        </div>
      )}
    </span>
  );
}
