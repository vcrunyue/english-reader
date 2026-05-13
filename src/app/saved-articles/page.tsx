import { getAllArticleMetas } from '@/lib/articles';
import SavedArticlesContent from './SavedArticlesContent';

export default function SavedArticlesPage() {
  const allMetas = getAllArticleMetas();
  return <SavedArticlesContent allMetas={allMetas} />;
}
