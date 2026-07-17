import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const readingState = vi.hoisted(() => ({ ready: true, read: true }));

vi.mock('@/context/ReadingContext', () => ({
  useReading: () => ({
    ready: readingState.ready,
    isArticleRead: () => readingState.read,
    markArticleRead: vi.fn(),
    unmarkArticleRead: vi.fn(),
  }),
}));

import ArticleReadMarker from './ArticleReadMarker';

describe('ArticleReadMarker', () => {
  beforeEach(() => {
    readingState.ready = true;
    readingState.read = true;
  });

  it('shows the action that will be performed for a read article', () => {
    const markup = renderToStaticMarkup(
      React.createElement(ArticleReadMarker, { slug: 'example' }),
    );

    expect(markup).toContain('标为未读');
    expect(markup).not.toContain('>已读</button>');
    expect(markup).not.toContain('aria-pressed');
  });

  it('shows the action that will be performed for an unread article', () => {
    readingState.read = false;
    const markup = renderToStaticMarkup(
      React.createElement(ArticleReadMarker, { slug: 'example' }),
    );

    expect(markup).toContain('标为已读');
  });

  it('does not expose a false unread action before local reading state is ready', () => {
    readingState.ready = false;
    const markup = renderToStaticMarkup(
      React.createElement(ArticleReadMarker, { slug: 'example' }),
    );

    expect(markup).not.toContain('标为已读');
    expect(markup).not.toContain('标为未读');
  });
});
