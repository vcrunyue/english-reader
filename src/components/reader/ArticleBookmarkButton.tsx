'use client';

import { useCollection } from '@/context/CollectionContext';

interface Props {
  slug: string;
}

export default function ArticleBookmarkButton({ slug }: Props) {
  const { isArticleInCollection, saveArticleToCollection, removeArticleFromCollection } =
    useCollection();
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
      className={`text-sm px-2.5 py-1 rounded-md transition-colors duration-200 font-zh-serif font-semibold ${
        saved
          ? 'bg-[#EDE0C8] text-[#5C3D2E]'
          : 'text-[#78716C] hover:bg-[#EDE9E0] hover:text-[#C88C4A]'
      }`}
      aria-label={saved ? '取消收藏' : '收藏文章'}
    >
      {saved ? '已收藏' : '收藏'}
    </button>
  );
}
