import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.ComponentProps<'a'>) =>
    React.createElement('a', { href, ...props }, children),
}));

vi.mock('@/context/CollectionContext', () => ({
  useCollection: () => ({
    isArticleInCollection: () => false,
    saveArticleToCollection: vi.fn(),
    removeArticleFromCollection: vi.fn(),
  }),
}));

vi.mock('@/context/ReadingContext', () => ({
  useReading: () => ({
    isArticleRead: () => readingState.read,
  }),
}));

const readingState = vi.hoisted(() => ({ read: true }));

import ArticleCard from './ArticleCard';

describe('ArticleCard read status', () => {
  it('renders read as a status rather than an interactive control nested in the article link', () => {
    readingState.read = true;
    const markup = renderToStaticMarkup(
      React.createElement(ArticleCard, {
        article: {
          slug: 'example',
          title: 'Example',
          source: 'Source',
          difficulty: 'cet4',
          topic: 'technology',
          date: '2026-07-17',
          wordCount: 100,
        },
      }),
    );

    expect(markup).toContain('已读');
    expect(markup).not.toContain('aria-label="标为未读"');
  });

  it('does not render a read status for an unread article', () => {
    readingState.read = false;
    const markup = renderToStaticMarkup(
      React.createElement(ArticleCard, {
        article: {
          slug: 'example',
          title: 'Example',
          source: 'Source',
          difficulty: 'cet4',
          topic: 'technology',
          date: '2026-07-17',
          wordCount: 100,
        },
      }),
    );

    expect(markup).not.toContain('已读');
  });
});
