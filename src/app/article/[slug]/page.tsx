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
        <header className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
          <a href="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            ← 返回
          </a>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-400">高亮</span>
            <HighlightToggle />
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {getDifficultyLabel(article.difficulty)}
          </span>
        </header>

        {/* 正文 */}
        <div className="flex-1 overflow-y-auto px-6 py-6 max-w-4xl">
          <h1 className="text-2xl font-bold mb-1">{article.title}</h1>
          <p className="text-xs text-gray-400 mb-6">
            {article.source} · {article.date}
          </p>
          <ArticleReader content={article.content} />
        </div>
      </div>

      {/* 右侧面板 */}
      <aside className="w-[220px] shrink-0 border-l border-gray-200 bg-gray-50 overflow-y-auto">
        <WordPanelWrapper content={article.content} />
      </aside>
    </div>
  );
}
