'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function ArticleReadMarker({ slug }: { slug: string }) {
  const { markAsRead } = useAppContext();
  useEffect(() => { markAsRead(slug); }, [slug, markAsRead]);
  return null;
}
