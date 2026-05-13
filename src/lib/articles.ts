import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Article, ArticleMeta, SentencePair } from '@/types';

const articlesDir = path.join(process.cwd(), 'content/articles');

export function getAllArticleMetas(): ArticleMeta[] {
  if (!fs.existsSync(articlesDir)) return [];
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  return files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(articlesDir, filename), 'utf-8');
    const { data } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      source: data.source ?? '',
      difficulty: data.difficulty ?? 'cet4',
      topic: data.topic ?? '',
      coverImage: data.coverImage ?? null,
      date: data.date ?? '',
    };
  });
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(articlesDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    source: data.source ?? '',
    difficulty: data.difficulty ?? 'cet4',
    topic: data.topic ?? '',
    coverImage: data.coverImage ?? null,
    date: data.date ?? '',
    content,
  };
}

export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDir)) return [];
  return fs
    .readdirSync(articlesDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}

export function extractTranslations(content: string): SentencePair[][] {
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
  return paragraphs.map(para => {
    const lines = para.split(/\n/);
    const pairs: SentencePair[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      if (line.startsWith('§')) {
        const zh = line.replace(/^§\s*/, '');
        const en = pairs.length > 0 ? pairs[pairs.length - 1].en : '';
        if (en) {
          pairs[pairs.length - 1] = { en, zh };
        }
      } else {
        pairs.push({ en: line, zh: '' });
      }
    }
    return pairs.filter(p => p.en);
  }).filter(para => para.length > 0);
}

export function stripTranslationLines(content: string): string {
  return content
    .split(/\n/)
    .filter(line => !line.trim().startsWith('§'))
    .join('\n');
}
