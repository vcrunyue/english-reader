import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/articles';
import HighlightToggle from '@/components/reader/HighlightToggle';
import { getDifficultyLabel } from '@/lib/vocab';
import ArticleReader from './ArticleReader';
import WordPanelWrapper from './WordPanelWrapper';

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

  return (
    <div className="flex h-full">
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶栏 */}
        <header className="flex items-center gap-4 px-6 py-3 border-b border-[#E8E4DD] bg-[#FEFCF5] sticky top-0 z-10">
          <a href="/" className="text-[13px] text-[#78716C] hover:text-[#C88C4A] transition-colors">
            ← 返回
          </a>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[13px] text-[#78716C]">高亮</span>
            <HighlightToggle />
          </div>
          <span className="text-xs text-[#78716C] bg-[#EDE9E0] px-2 py-0.5 rounded-md">
            {getDifficultyLabel(article.difficulty)}
          </span>
        </header>

        {/* 正文 */}
        <div className="flex-1 overflow-y-auto px-8 py-8 max-w-4xl">
          <h1 className="font-display text-2xl text-[#2D2B28] mb-2">{article.title}</h1>
          <p className="text-[13px] text-[#78716C] mb-8">
            {article.source} · {article.date}
          </p>
          <ArticleReader content={article.content} />
        </div>
      </div>

      {/* 右侧面板 */}
      <aside className="w-[220px] shrink-0 border-l border-[#E8E4DD] bg-[#F7F5F0] overflow-y-auto">
        <WordPanelWrapper content={article.content} />
      </aside>
    </div>
  );
}
