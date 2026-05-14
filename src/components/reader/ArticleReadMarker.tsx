'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function ArticleReadMarker({ slug }: { slug: string }) {
  const { markArticleRead } = useAppContext();
  useEffect(() => { markArticleRead(slug); }, [slug, markArticleRead]);
  return null;
}
ArticleReadMarker.displayName = 'ArticleReadMarker';
