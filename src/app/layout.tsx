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
      <body className="flex h-screen overflow-hidden bg-white text-gray-900 antialiased">
        <AppProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
