import { getAllArticleMetas } from '@/lib/articles';
import FilterableGallery from './FilterableGallery';

export default function HomePage() {
  const articles = getAllArticleMetas();

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">发现文章</h1>
      <FilterableGallery articles={articles} />
    </div>
  );
}
