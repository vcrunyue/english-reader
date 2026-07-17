'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Star, ClipboardCheck, BarChart3, Ellipsis } from 'lucide-react';

const tabs = [
  { href: '/', label: '阅读', icon: BookOpen },
  { href: '/collection', label: '生词', icon: Star },
  { href: '/known-words', label: '熟词', icon: ClipboardCheck },
  { href: '/stats', label: '统计', icon: BarChart3 },
  { href: '/saved-articles', label: '更多', icon: Ellipsis },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-[#E8E4DD] bg-[#F7F5F0] lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C88C4A] ${
              active ? 'text-[#5C3D2E]' : 'text-[#A09888]'
            }`}
          >
            <Icon size={16} strokeWidth={active ? 2.5 : 1.5} />
            <span className="text-[10px] font-zh-serif font-semibold leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
