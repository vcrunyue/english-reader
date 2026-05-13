'use client';

import { useEffect, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [children]);

  return (
    <div
      className="h-full"
      style={{
        opacity: visible ? 1 : 0.6,
        filter: visible ? 'blur(0px)' : 'blur(2.5px)',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.99)',
        transition: 'opacity 1500ms cubic-bezier(0.22, 1, 0.36, 1), filter 1500ms cubic-bezier(0.22, 1, 0.36, 1), transform 1500ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </div>
  );
}
