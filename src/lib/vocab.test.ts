import { afterEach, describe, expect, it, vi } from 'vitest';

import { analyzeText, lookupWord, tokenize } from '@/lib/vocab';
import type { VocabMap } from '@/types';

const vocab: VocabMap = {
  climate: {
    word: 'climate',
    definition: '气候',
    pos: 'n.',
    difficulty: 'cet4',
  },
  resilient: {
    word: 'resilient',
    definition: '有韧性的',
    pos: 'adj.',
    difficulty: 'cet6',
  },
};

describe('vocab helpers', () => {
  it('tokenizes lowercase words while preserving apostrophes', () => {
    expect(tokenize("Climate isn't static.").map(item => item.word)).toEqual([
      'climate',
      "isn't",
      'static',
    ]);
  });

  it('does not look up words the reader already knows', () => {
    expect(lookupWord('Climate', vocab, new Set(['climate']))).toBeNull();
  });

  it('deduplicates analyzed words and orders harder words first', () => {
    expect(
      analyzeText('Climate resilient climate', vocab, new Set()).map(item => item.word),
    ).toEqual(['resilient', 'climate']);
  });
});

describe('loadVocab', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('rejects non-success responses without caching the failure', async () => {
    vi.resetModules();
    const failedResponse = new Response(JSON.stringify({ message: 'not found' }), {
      status: 404,
      statusText: 'Not Found',
    });
    const failedResponseJson = vi.spyOn(failedResponse, 'json');
    const failedFetch = vi.fn(async (input: string | URL | Request) => {
      if (String(input).includes('cet6')) {
        return failedResponse;
      }

      return new Response('{}', { status: 200 });
    });
    vi.stubGlobal('fetch', failedFetch);

    const { loadVocab } = await import('@/lib/vocab');

    await expect(loadVocab()).rejects.toThrow('词表资源加载失败');
    expect(failedResponseJson).not.toHaveBeenCalled();

    const successFetch = vi.fn(async (input: string | URL | Request) =>
      new Response(JSON.stringify({
        [String(input)]: {
          word: String(input),
          definition: '测试',
          pos: 'n.',
          difficulty: 'cet4',
        },
      }), { status: 200 }),
    );
    vi.stubGlobal('fetch', successFetch);

    await expect(loadVocab()).resolves.toBeDefined();
    expect(successFetch).toHaveBeenCalledTimes(3);
  });
});
