'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { VocabMap } from '@/types';
import { loadVocab } from '@/lib/vocab';

interface VocabContextType {
  vocab: VocabMap | null;
  error: string | null;
  retry: () => void;
}

const VocabContext = createContext<VocabContextType | null>(null);
const VOCAB_LOAD_ERROR = '词表暂时无法加载，请检查本地文件或网络状态后重试。';

export function VocabProvider({ children }: { children: React.ReactNode }) {
  const [vocab, setVocab] = useState<VocabMap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const activeRequestRef = useRef(0);

  useEffect(() => {
    let active = true;
    const requestId = activeRequestRef.current + 1;
    activeRequestRef.current = requestId;

    void loadVocab().then(
      nextVocab => {
        if (!active || activeRequestRef.current !== requestId) return;
        setVocab(nextVocab);
        setError(null);
      },
      () => {
        if (!active || activeRequestRef.current !== requestId) return;
        setVocab(null);
        setError(VOCAB_LOAD_ERROR);
      },
    );

    return () => {
      active = false;
    };
  }, [requestVersion]);

  const retry = useCallback(() => {
    activeRequestRef.current += 1;
    setVocab(null);
    setError(null);
    setRequestVersion(version => version + 1);
  }, []);

  return (
    <VocabContext.Provider value={{ vocab, error, retry }}>
      {children}
    </VocabContext.Provider>
  );
}

export function useVocab(): VocabContextType {
  const ctx = useContext(VocabContext);
  if (!ctx) throw new Error('useVocab must be used within VocabProvider');
  return ctx;
}
