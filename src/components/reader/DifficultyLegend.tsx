'use client';

import { useState, useRef } from 'react';
import { HelpCircle } from 'lucide-react';
import { DIFFICULTY_STYLE } from '@/config/difficulty';
import type { Difficulty } from '@/types';

const DIFFICULTY_ORDER: Difficulty[] = ['cet4', 'cet6', 'postgrad'];

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
          {DIFFICULTY_ORDER.map(key => {
            const s = DIFFICULTY_STYLE[key];
            return (
              <div key={key} className="flex items-center gap-2 py-1">
                <span className={`w-3 h-3 rounded-full shrink-0 ${s.dotColor}`} />
                <span className="text-[13px] text-[#2D2B28]">{s.label}词汇</span>
                <span className="text-[11px] text-[#78716C] ml-auto">{s.description}</span>
              </div>
            );
          })}
        </div>
      )}
    </span>
  );
}
