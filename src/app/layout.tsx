import type { Metadata } from 'next';
import './globals.css';
import { VocabProvider } from '@/context/VocabContext';
import { KnownWordsProvider } from '@/context/KnownWordsContext';
import { CollectionProvider } from '@/context/CollectionContext';
import { ReadingProvider } from '@/context/ReadingContext';
import Sidebar from '@/components/layout/Sidebar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

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
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Liu+Jian+Mao+Cao&family=Ma+Shan+Zheng&family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@400;500;700&family=ZCOOL+QingKe+HuangYou&family=ZCOOL+XiaoWei&family=Zhi+Mang+Xing&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex h-screen overflow-hidden bg-[#FEFCF5] text-[#2D2B28] antialiased">
        <VocabProvider>
          <KnownWordsProvider>
            <CollectionProvider>
              <ReadingProvider>
                <Sidebar />
                <main className="flex-1 overflow-y-auto pb-14 lg:pb-0" style={{ scrollbarGutter: 'stable' }}>{children}</main>
                <MobileBottomNav />
              </ReadingProvider>
            </CollectionProvider>
          </KnownWordsProvider>
        </VocabProvider>
      </body>
    </html>
  );
}
