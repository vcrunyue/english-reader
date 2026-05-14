'use client';

import { useEffect } from 'react';
import { useReading } from '@/context/ReadingContext';

export default function ArticleReadMarker({ slug }: { slug: string }) {
  const { markArticleRead } = useReading();
  useEffect(() => { markArticleRead(slug); }, [slug, markArticleRead]);
  return null;
}
ArticleReadMarker.displayName = 'ArticleReadMarker';
