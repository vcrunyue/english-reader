'use client';

import { useReading } from '@/context/ReadingContext';

export default function ArticleReadMarker({ slug }: { slug: string }) {
  const { ready, isArticleRead, markArticleRead, unmarkArticleRead } = useReading();

  if (!ready) {
    return <span aria-hidden="true" className="inline-block h-11 w-20 shrink-0" />;
  }

  const read = isArticleRead(slug);

  return (
    <button
      type="button"
      aria-label={read ? '将文章标记为未读' : '将文章标记为已读'}
      onClick={() => {
        if (read) unmarkArticleRead(slug);
        else markArticleRead(slug);
      }}
      className={`inline-flex min-h-11 w-20 items-center justify-center rounded-md px-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C4A] ${
        read
          ? 'bg-[#EDE9E0] text-[#5C3D2E] hover:bg-[#E8DCC8]'
          : 'border border-[#D8D2C8] text-[#78716C] hover:border-[#C88C4A] hover:text-[#5C3D2E]'
      }`}
    >
      {read ? '标为未读' : '标为已读'}
    </button>
  );
}
ArticleReadMarker.displayName = 'ArticleReadMarker';
