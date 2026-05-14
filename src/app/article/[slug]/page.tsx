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
      <ArticleReadMarker slug={article.slug} />
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶栏 */}
        <header className="flex items-center gap-4 px-6 py-3 border-b border-[#E8E4DD] bg-[#FEFCF5] sticky top-0 z-10">
          <Link
            href="/"
            className="text-base px-2.5 py-1 rounded-md transition-colors duration-200 font-zh-serif font-semibold text-[#78716C] hover:bg-[#EDE9E0] hover:text-[#C88C4A]"
          >
            返回
          </Link>
          <ArticleBookmarkButton slug={article.slug} />
          <div className="flex items-center gap-5 ml-auto mr-2">
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
          <span className={`text-sm px-2.5 py-1 rounded-md font-zh-serif ${getBadgeClass(article.difficulty)}`}>
            {getDifficultyLabel(article.difficulty)}
          </span>
        </header>

        {/* 正文 */}
        <div className="flex-1 overflow-y-auto py-8">
          <div className="px-8">
            <h1 className="font-display text-3xl text-[#2D2B28] mb-2">{article.title}</h1>
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
