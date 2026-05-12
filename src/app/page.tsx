import { getAllArticleMetas } from '@/lib/articles';
import FilterableGallery from './FilterableGallery';

export default function HomePage() {
  const articles = getAllArticleMetas();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="font-display text-3xl text-[#2D2B28] mb-8">发现文章</h1>
      <FilterableGallery articles={articles} />
    </div>
  );
}
