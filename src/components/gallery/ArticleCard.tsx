'use client';

import Link from 'next/link';
import type { ArticleMeta } from '@/types';
import { getDifficultyLabel } from '@/lib/vocab';
import { getBadgeClass } from '@/config/difficulty';
import { useCollection } from '@/context/CollectionContext';
import { useReading } from '@/context/ReadingContext';
import { Bookmark } from 'lucide-react';

const TOPIC_GRADIENTS: Record<string, string> = {
  technology: 'from-[#D4C8B8] to-[#C8B8A8]',
  environment: 'from-[#C0CFC0] to-[#B0C0A8]',
  science: 'from-[#C8C0D8] to-[#B8B0C8]',
};

function getGradient(topic: string): string {
  return TOPIC_GRADIENTS[topic] ?? 'from-[#D0C8C0] to-[#C0B8B0]';
}

interface ArticleCardProps {
  article: ArticleMeta;
  layout?: 'grid' | 'list';
}

export default function ArticleCard({ article, layout = 'grid' }: ArticleCardProps) {
  const { isArticleInCollection, saveArticleToCollection, removeArticleFromCollection } =
    useCollection();
  const { isArticleRead } = useReading();
  const saved = isArticleInCollection(article.slug);
  const read = isArticleRead(article.slug);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (saved) {
      removeArticleFromCollection(article.slug);
    } else {
      saveArticleToCollection(article.slug);
    }
  };

  // ---------- list layout ----------
  if (layout === 'list') {
    return (
      <div className="relative group hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300">
        <Link
          href={`/article/${article.slug}`}
          className="flex rounded-xl overflow-hidden border border-[#E8E4DD] group-hover:shadow-md group-hover:border-[#C88C4A]/40 transition-all duration-300 bg-white/60"
        >
          {/* cover — hidden on mobile */}
          <div className="w-28 shrink-0 overflow-hidden hidden sm:block">
            <div
              className={`h-full min-h-[6rem] bg-gradient-to-br ${getGradient(article.topic)} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
            >
              <span className="text-white/70 text-lg font-display">
                {(article.source || '?').slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>

          {/* info */}
          <div className="flex-1 px-3 py-2.5 sm:p-4 flex flex-col gap-1 sm:gap-1.5 min-w-0">
            <h3 className="font-serif text-[13px] sm:text-base leading-snug truncate sm:line-clamp-2 text-[#2D2B28] group-hover:text-[#C88C4A] transition-colors">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 sm:gap-1.5 flex-wrap text-[10px] sm:text-[13px] text-[#78716C]">
              <span
                className={`inline-block text-[9px] sm:text-[11px] px-1.5 py-0.5 rounded-md font-medium ${getBadgeClass(article.difficulty)}`}
              >
                {getDifficultyLabel(article.difficulty)}
              </span>
              <span>{article.source}</span>
              <span className="text-[#D8D2C8] hidden sm:inline">·</span>
              <span>{article.date}</span>
              {read && (
                <span className="text-[#A0A090] font-zh-serif font-bold text-[9px]">已读</span>
              )}
            </div>
          </div>
        </Link>

        {/* bookmark — always visible on mobile, hover on desktop */}
        <button
          type="button"
          onClick={handleToggle}
          className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C4A] ${
            saved
              ? 'text-[#C88C4A] sm:opacity-100 sm:bg-[#FEFCF5]/90 sm:shadow-sm'
              : 'text-[#D8D2C8] sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 sm:focus-visible:opacity-100 sm:bg-[#FEFCF5]/80 sm:text-[#78716C] sm:hover:text-[#C88C4A] sm:hover:bg-[#FEFCF5] sm:shadow-sm'
          }`}
          aria-label={saved ? '取消收藏' : '收藏文章'}
        >
          <Bookmark aria-hidden="true" size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    );
  }

  // ---------- grid layout ----------
  return (
    <div className="relative group h-full hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
      <Link
        href={`/article/${article.slug}`}
        className="flex flex-col h-full rounded-xl overflow-hidden border border-[#E8E4DD] group-hover:shadow-lg group-hover:border-[#C88C4A]/50 transition-all duration-300 bg-white/60"
      >
        {/* cover */}
        <div className="h-24 overflow-hidden shrink-0">
          <div
            className={`h-full bg-gradient-to-br ${getGradient(article.topic)} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
          >
            <span className="text-white/70 text-2xl font-display">
              {(article.source || '?').slice(0, 2).toUpperCase()}
            </span>
          </div>
        </div>

        {/* body */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <h3 className="font-display text-base leading-snug line-clamp-2 text-[#2D2B28] group-hover:text-[#C88C4A] transition-colors min-h-[2.75rem]">
            {article.title}
          </h3>
          <div className="flex-1" />

          {/* meta row: diff · source · date · read */}
          <div className="flex items-center gap-1.5 flex-wrap text-[13px] text-[#78716C]">
            <span
              className={`inline-block text-[11px] px-1.5 py-0.5 rounded-md font-medium ${getBadgeClass(article.difficulty)}`}
            >
              {getDifficultyLabel(article.difficulty)}
            </span>
            <span className="text-[#D8D2C8]">·</span>
            <span>{article.source}</span>
            <span className="text-[#D8D2C8]">·</span>
            <span>{article.date}</span>
            {read && (
              <>
                <span className="text-[#D8D2C8]">·</span>
                <span className="text-[#A0A090] font-zh-serif font-bold">已读</span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* bookmark */}
      <button
        type="button"
        onClick={handleToggle}
        className={`absolute top-2 right-2 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C4A] ${
          saved
            ? 'opacity-100 bg-[#FEFCF5]/90 text-[#C88C4A] shadow-sm'
            : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 bg-[#FEFCF5]/80 text-[#78716C] hover:text-[#C88C4A] hover:bg-[#FEFCF5] shadow-sm'
        }`}
        aria-label={saved ? '取消收藏' : '收藏文章'}
      >
        <Bookmark aria-hidden="true" size={15} fill={saved ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
