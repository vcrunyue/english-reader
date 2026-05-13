import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticleSlugs, stripTranslationLines, extractTranslations } from '@/lib/articles';
import HighlightToggle from '@/components/reader/HighlightToggle';
import CloseReadingToggle from '@/components/reader/CloseReadingToggle';
import CloseReadingLegend from '@/components/reader/CloseReadingLegend';
import DifficultyLegend from '@/components/reader/DifficultyLegend';
import { getDifficultyLabel } from '@/lib/vocab';
import PanelContainer from './PanelContainer';
import CloseReadingLayout from './CloseReadingLayout';
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
          <a href="/" className="text-sm text-[#78716C] hover:text-[#C88C4A] transition-colors font-zh-serif" aria-label="返回首页">
            ← 返回
          </a>
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
          <ArticleBookmarkButton slug={article.slug} />
          <span className={`text-sm px-2.5 py-1 rounded-md font-zh-serif ${
            article.difficulty === 'cet4' ? 'bg-[#D4E8D0] text-[#3A5C34]' :
            article.difficulty === 'cet6' ? 'bg-[#F5E6C8] text-[#5C4A1E]' :
            'bg-[#F0D3D3] text-[#5C2A2A]'
          }`}>
            {getDifficultyLabel(article.difficulty)}
          </span>
        </header>

        {/* 正文 + 精读面板 */}
        <CloseReadingLayout
          content={cleanContent}
          translations={translations}
          title={article.title}
          source={article.source}
          date={article.date}
        />
      </div>

      {/* 右侧面板 */}
      <PanelContainer content={cleanContent} />
    </div>
  );
}
