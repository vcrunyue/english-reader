'use client';

import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isArticle = pathname.startsWith('/article/');

  return (
    <div className={`h-full route-enter${isArticle ? ' route-enter--article' : ''}`}>
      {children}
    </div>
  );
}
