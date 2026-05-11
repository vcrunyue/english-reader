import Link from 'next/link';
import type { ArticleMeta } from '@/types';
import { getDifficultyLabel } from '@/lib/vocab';

const DIFFICULTY_STYLES: Record<string, string> = {
  cet4: 'bg-green-100 text-green-700',
  cet6: 'bg-yellow-100 text-yellow-700',
  postgrad: 'bg-red-100 text-red-700',
};

const TOPIC_GRADIENTS: Record<string, string> = {
  technology: 'from-blue-400 to-cyan-300',
  environment: 'from-emerald-400 to-green-300',
  science: 'from-purple-400 to-pink-300',
};

function getGradient(topic: string): string {
  return TOPIC_GRADIENTS[topic] ?? 'from-gray-400 to-gray-300';
}

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="block rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all group"
    >
      <div
        className={`h-36 bg-gradient-to-br ${getGradient(article.topic)} flex items-center justify-center`}
      >
        <span className="text-white text-3xl font-bold opacity-60">
          {article.source.slice(0, 2).toUpperCase()}
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        <div className="text-xs text-gray-500">{article.source}</div>
        <span
          className={`inline-block text-xs px-1.5 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[article.difficulty] ?? ''}`}
        >
          {getDifficultyLabel(article.difficulty)}
        </span>
      </div>
    </Link>
  );
}
