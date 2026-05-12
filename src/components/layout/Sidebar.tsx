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
  { href: '/collection', label: '生词收藏', icon: Star },
  { href: '/stats', label: '学习统计', icon: BarChart3 },
];

const itemBase =
  'flex items-center gap-3 mx-2 rounded-lg text-[13px] transition-all duration-400 ease-out whitespace-nowrap px-3 py-2';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col bg-[#F7F5F0] border-r border-[#E8E4DD] transition-[width] duration-400 ease-out overflow-hidden shrink-0 ${
        collapsed ? 'w-[60px]' : 'w-[152px]'
      }`}
    >
      <nav className="flex-1 py-3 space-y-1">
        {/* 折叠按钮 */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`${itemBase} text-[#78716C] hover:bg-[#EDE9E0] hover:text-[#5C3D2E]`}
          title={collapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {collapsed ? (
            <ChevronRight size={18} className="shrink-0" />
          ) : (
            <ChevronLeft size={18} className="shrink-0" />
          )}
          <span
            className={`transition-all duration-400 ease-out ${
              collapsed ? 'opacity-0 w-0 overflow-hidden delay-0' : 'opacity-100 w-auto delay-150'
            }`}
          >
            收起
          </span>
        </button>

        {/* 菜单项 */}
        {menuItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`${itemBase} ${
                isActive
                  ? 'bg-[#E8DCC8] text-[#5C3D2E] font-medium'
                  : 'text-[#78716C] hover:bg-[#EDE9E0] hover:text-[#5C3D2E]'
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              <span
                className={`transition-all duration-400 ease-out ${
                  collapsed ? 'opacity-0 w-0 overflow-hidden delay-0' : 'opacity-100 w-auto delay-150'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
