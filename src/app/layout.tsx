import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Sidebar from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'English Reader',
  description: '智能英文阅读学习工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex h-screen overflow-hidden bg-[#FEFCF5] text-[#2D2B28] antialiased">
        <AppProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
