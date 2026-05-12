import { getAllArticleMetas } from '@/lib/articles';
import FilterableGallery from './FilterableGallery';

export default function HomePage() {
  const articles = getAllArticleMetas();

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <h1 className="font-display text-4xl text-[#2D2B28] mb-10">发现文章</h1>
      <FilterableGallery articles={articles} />
    </div>
  );
}
