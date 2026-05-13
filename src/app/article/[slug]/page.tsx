import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/articles';
import HighlightToggle from '@/components/reader/HighlightToggle';
import DifficultyLegend from '@/components/reader/DifficultyLegend';
import { getDifficultyLabel } from '@/lib/vocab';
import ArticleReader from './ArticleReader';
import PanelContainer from './PanelContainer';

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
          <a href="/" className="text-sm text-[#78716C] hover:text-[#C88C4A] transition-colors font-zh-serif">
            ← 返回
          </a>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-[#78716C] font-zh-serif">高亮</span>
            <DifficultyLegend />
            <HighlightToggle />
          </div>
          <span className={`text-sm px-2.5 py-1 rounded-md font-zh-serif ${
            article.difficulty === 'cet4' ? 'bg-[#D4E8D0] text-[#3A5C34]' :
            article.difficulty === 'cet6' ? 'bg-[#F5E6C8] text-[#5C4A1E]' :
            'bg-[#F0D3D3] text-[#5C2A2A]'
          }`}>
            {getDifficultyLabel(article.difficulty)}
          </span>
        </header>

        {/* 正文 */}
        <div className="flex-1 overflow-y-auto px-8 py-8 max-w-4xl relative">
          {/* 顶部毛玻璃渐变 */}
          <div className="sticky top-0 -mt-8 pt-8 z-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FEFCF5] via-[#FEFCF5]/80 to-transparent h-16 backdrop-blur-[2px]" />
          </div>
          <h1 className="font-display text-2xl text-[#2D2B28] mb-2">{article.title}</h1>
          <p className="text-[13px] text-[#78716C] mb-8">
            {article.source} · {article.date}
          </p>
          <ArticleReader content={article.content} />
          {/* 底部毛玻璃渐变 */}
          <div className="sticky bottom-0 z-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-[#FEFCF5] via-[#FEFCF5]/80 to-transparent h-16 -top-16 backdrop-blur-[2px]" />
          </div>
        </div>
      </div>

      {/* 右侧面板 */}
      <PanelContainer content={article.content} />
    </div>
  );
}
