import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Article, ArticleMeta, SentencePair } from '@/types';
import { splitEnglishSentences } from './translate';
import { parseArticleContent } from './article-content';

export { stripTranslationLines } from './article-content';

const articlesDir = path.join(process.cwd(), 'content/articles');

function countWords(text: string): number {
  const words = text.match(/\b[a-zA-Z]+\b/g);
  return words ? words.length : 0;
}
export function getAllArticleMetas(): ArticleMeta[] {
  if (!fs.existsSync(articlesDir)) return [];
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  return files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(articlesDir, filename), 'utf-8');
    const { data, content } = matter(raw);
    const cleanContent = content
      .replace(/^#{1,3}\s+.+$/gm, '')
      .replace(/^§.*$/gm, '');
    return {
      slug,
      title: data.title ?? slug,
      source: data.source ?? '',
      difficulty: (['cet4', 'cet6', 'postgrad'].includes(data.difficulty) ? data.difficulty : 'cet4') as ArticleMeta['difficulty'],
      topic: data.topic ?? '',
      date: data.date ?? '',
      wordCount: countWords(cleanContent),
    };
  });
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(articlesDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const cleanContent = content
    .replace(/^#{1,3}\s+.+$/gm, '')
    .replace(/^§.*$/gm, '');
  return {
    slug,
    title: data.title ?? slug,
    source: data.source ?? '',
    difficulty: (['cet4', 'cet6', 'postgrad'].includes(data.difficulty) ? data.difficulty : 'cet4') as ArticleMeta['difficulty'],
    topic: data.topic ?? '',
    date: data.date ?? '',
    wordCount: countWords(cleanContent),
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
  const paragraphs = parseArticleContent(content)
    .filter(block => block.type === 'paragraph')
    .map(block => block.text);
  return paragraphs.map(para => {
    const lines = para.split(/\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'));
    const hasTranslations = lines.some(l => l.startsWith('§'));

    if (hasTranslations) {
      // Line-based: each English sentence on its own line, § for Chinese
      const pairs: SentencePair[] = [];
      for (const line of lines) {
        if (line.startsWith('§')) {
          const zh = line.replace(/^§\s*/, '');
          if (pairs.length > 0) {
            pairs[pairs.length - 1] = { ...pairs[pairs.length - 1], zh };
          }
        } else {
          pairs.push({ en: line, zh: '' });
        }
      }
      return pairs.filter(p => p.en);
    }

    // No translations: split joined text into sentences
    const text = lines.join(' ');
    return splitEnglishSentences(text).map(en => ({ en, zh: '' }));
  }).filter(para => para.length > 0);
}
