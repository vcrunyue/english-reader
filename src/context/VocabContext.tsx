'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { VocabMap } from '@/types';
import { loadVocab } from '@/lib/vocab';

interface VocabContextType {
  vocab: VocabMap | null;
}

const VocabContext = createContext<VocabContextType | null>(null);

export function VocabProvider({ children }: { children: React.ReactNode }) {
  const [vocab, setVocab] = useState<VocabMap | null>(null);

  useEffect(() => {
    loadVocab().then(setVocab);
  }, []);

  return (
    <VocabContext.Provider value={{ vocab }}>
      {children}
    </VocabContext.Provider>
  );
}

export function useVocab(): VocabMap | null {
  const ctx = useContext(VocabContext);
  if (!ctx) throw new Error('useVocab must be used within VocabProvider');
  return ctx.vocab;
}
