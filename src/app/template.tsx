'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const isArticle = pathname.startsWith('/article/');

  useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [children]);

  const blur = isArticle ? 'blur(3.5px)' : 'blur(2.5px)';
  const scale = isArticle ? 'scale(0.975)' : 'scale(0.985)';
  const duration = isArticle ? '2000ms' : '1500ms';

  return (
    <div
      className="h-full"
      style={{
        opacity: visible ? 1 : 0.25,
        filter: visible ? 'blur(0px)' : blur,
        transform: visible ? 'translateY(0) scale(1)' : `translateY(6px) ${scale}`,
        transition: `opacity ${duration} cubic-bezier(0.22, 1, 0.36, 1), filter ${duration} cubic-bezier(0.22, 1, 0.36, 1), transform ${duration} cubic-bezier(0.22, 1, 0.36, 1)`,
      }}
    >
      {children}
    </div>
  );
}
