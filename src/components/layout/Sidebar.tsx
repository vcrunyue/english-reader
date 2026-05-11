'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  FilePlus,
  Star,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const menuItems = [
  { href: '/', label: '开始学习', icon: BookOpen },
  { href: '/import', label: '导入文章', icon: FilePlus },
  { href: '/collection', label: '生词收藏夹', icon: Star },
  { href: '/stats', label: '学习统计', icon: BarChart3 },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col bg-gray-50 border-r border-gray-200 transition-all duration-200 overflow-hidden ${
        collapsed ? 'w-14' : 'w-48'
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-b border-gray-200 hover:bg-gray-100 transition-colors shrink-0"
        title={collapsed ? '展开侧边栏' : '收起侧边栏'}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <nav className="flex-1 py-2">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 mx-1 rounded-lg text-sm transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              <span className={`transition-opacity duration-200 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
