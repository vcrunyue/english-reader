import Link from 'next/link';
import type { ArticleMeta } from '@/types';
import { getDifficultyLabel } from '@/lib/vocab';

const DIFFICULTY_STYLES: Record<string, string> = {
  cet4: 'bg-[#D4E8D0] text-[#3A5C34]',
  cet6: 'bg-[#F5E6C8] text-[#5C4A1E]',
  postgrad: 'bg-[#F0D3D3] text-[#5C2A2A]',
};

const TOPIC_GRADIENTS: Record<string, string> = {
  technology: 'from-[#D4C8B8] to-[#C8B8A8]',
  environment: 'from-[#C0CFC0] to-[#B0C0A8]',
  science: 'from-[#C8C0D8] to-[#B8B0C8]',
};

function getGradient(topic: string): string {
  return TOPIC_GRADIENTS[topic] ?? 'from-[#D0C8C0] to-[#C0B8B0]';
}

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="block rounded-xl overflow-hidden border border-[#E8E4DD] hover:shadow-md hover:border-[#C88C4A]/40 transition-all duration-200 group bg-white/60"
    >
      <div
        className={`h-24 bg-gradient-to-br ${getGradient(article.topic)} flex items-center justify-center`}
      >
        <span className="text-white/70 text-2xl font-display">
          {article.source.slice(0, 2).toUpperCase()}
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-display text-base leading-snug line-clamp-2 text-[#2D2B28] group-hover:text-[#C88C4A] transition-colors">
          {article.title}
        </h3>
        <div className="text-[13px] text-[#78716C]">{article.source}</div>
        <span
          className={`inline-block text-xs px-2 py-0.5 rounded-md font-medium ${DIFFICULTY_STYLES[article.difficulty] ?? ''}`}
        >
          {getDifficultyLabel(article.difficulty)}
        </span>
      </div>
    </Link>
  );
}
