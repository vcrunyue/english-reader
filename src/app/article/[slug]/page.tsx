import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticleSlugs, stripTranslationLines, extractTranslations } from '@/lib/articles';
import HighlightToggle from '@/components/reader/HighlightToggle';
import CloseReadingToggle from '@/components/reader/CloseReadingToggle';
import CloseReadingLegend from '@/components/reader/CloseReadingLegend';
import DifficultyLegend from '@/components/reader/DifficultyLegend';
import { getDifficultyLabel } from '@/lib/vocab';
import { getBadgeClass } from '@/config/difficulty';
import ArticleReader from './ArticleReader';
import PanelContainer from './PanelContainer';
import CloseReadingPanelWrapper from './CloseReadingPanelWrapper';
import Link from 'next/link';
import ArticleBookmarkButton from '@/components/reader/ArticleBookmarkButton';
import ArticleReadMarker from '@/components/reader/ArticleReadMarker';
import MobileReaderTools from './MobileReaderTools';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map(slug => ({ slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const cleanContent = stripTranslationLines(article.content);
  const translations = extractTranslations(article.content);

  return (
    <div className="flex h-full">
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶栏 */}
        <header className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-[#E8E4DD] bg-[#FEFCF5] px-3 py-2 sm:gap-4 sm:px-6 sm:py-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-md px-2.5 text-base font-semibold text-[#78716C] transition-colors duration-200 hover:bg-[#EDE9E0] hover:text-[#C88C4A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C4A] font-zh-serif"
          >
            返回
          </Link>
          <ArticleBookmarkButton slug={article.slug} />
          <ArticleReadMarker slug={article.slug} />
          <span className={`text-sm px-2.5 py-1 rounded-md font-zh-serif ${getBadgeClass(article.difficulty)}`}>
            {getDifficultyLabel(article.difficulty)}
          </span>
          <div className="order-3 flex w-full items-center justify-between gap-3 sm:order-none sm:ml-auto sm:mr-2 sm:w-auto sm:justify-start sm:gap-5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-[#78716C] font-zh-serif">精读</span>
              <CloseReadingLegend />
              <CloseReadingToggle />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-[#78716C] font-zh-serif">高亮</span>
              <DifficultyLegend />
              <HighlightToggle />
            </div>
          </div>
          <MobileReaderTools content={cleanContent} translations={translations} />
        </header>

        {/* 正文 */}
        <div className="flex-1 overflow-y-auto py-6 sm:py-8">
          <div className="px-4 sm:px-8">
            <h1 className="mb-2 font-display text-2xl text-[#2D2B28] sm:text-3xl">{article.title}</h1>
            <p className="text-[13px] text-[#78716C] mb-8">
              {article.source} · {article.date}
            </p>
          </div>
          <ArticleReader content={cleanContent} />
        </div>
      </div>

      {/* 精读面板（位于正文与单词栏之间） */}
      <CloseReadingPanelWrapper translations={translations} />

      {/* 右侧面板 */}
      <PanelContainer content={cleanContent} />
    </div>
  );
}
