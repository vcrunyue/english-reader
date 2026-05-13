'use client';

import { useEffect, useState, useRef } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const prevKey = useRef<string>('');

  useEffect(() => {
    // trigger exit animation on old content then enter on new
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [children]);

  return (
    <div
      className="h-full transition-opacity duration-300 ease-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {children}
    </div>
  );
}
