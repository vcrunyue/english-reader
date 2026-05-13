'use client';

import { useAppContext } from '@/context/AppContext';
import { Bookmark } from 'lucide-react';

interface Props {
  slug: string;
}

export default function ArticleBookmarkButton({ slug }: Props) {
  const { isArticleInCollection, saveArticleToCollection, removeArticleFromCollection } =
    useAppContext();
  const saved = isArticleInCollection(slug);

  const handleToggle = () => {
    if (saved) {
      removeArticleFromCollection(slug);
    } else {
      saveArticleToCollection(slug);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-md transition-colors duration-200 font-zh-serif ${
        saved
          ? 'bg-[#EDE0C8] text-[#5C3D2E]'
          : 'text-[#78716C] hover:bg-[#EDE9E0] hover:text-[#C88C4A]'
      }`}
      title={saved ? '取消收藏' : '收藏文章'}
    >
      <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
      {saved ? '已收藏' : '收藏'}
    </button>
  );
}
