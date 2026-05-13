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
        filter: visible ? 'blur(0px)' : 'blur(3px)',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.997)',
        transition: 'opacity 1250ms cubic-bezier(0.22, 1, 0.36, 1), filter 1250ms cubic-bezier(0.22, 1, 0.36, 1), transform 1250ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </div>
  );
}
