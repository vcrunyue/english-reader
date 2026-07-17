import { getAllArticleMetas } from '@/lib/articles';
import { PageState } from '@/components/feedback/PageState';
import FilterableGallery from './FilterableGallery';

export default function HomePage() {
  const articles = getAllArticleMetas();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-10">
      <h1 className="font-display text-3xl sm:text-4xl text-[#2D2B28] mb-6 sm:mb-10">发现文章</h1>
      {articles.length === 0 ? (
        <PageState
          title="内容库还是空的"
          description="当前没有可阅读的本地文章。阶段 1 会提供本地文章导入能力。"
          tone="empty"
        />
      ) : (
        <FilterableGallery articles={articles} />
      )}
    </div>
  );
}
