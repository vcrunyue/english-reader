import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  addKnownWord,
  getCloseReadingEnabled,
  getHighlightEnabled,
  getKnownWords,
} from './storage';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('storage getters', () => {
  it('converts the legacy known-word array without writing during read', () => {
    const setItem = vi.fn();
    vi.stubGlobal('window', {});
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => JSON.stringify(['Alpha', 'beta'])),
      setItem,
    });

    const words = getKnownWords();

    expect(Object.keys(words)).toEqual(['Alpha', 'beta']);
    expect(Object.values(words)).toEqual([
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    ]);
    expect(setItem).not.toHaveBeenCalled();
  });

  it('falls back to the normal defaults when reading a boolean preference throws', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => {
        throw new Error('storage unavailable');
      }),
    });

    expect(getHighlightEnabled()).toBe(true);
    expect(getCloseReadingEnabled()).toBe(false);
  });

  it('preserves legacy words when a new known word is added', () => {
    const setItem = vi.fn();
    vi.stubGlobal('window', {});
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => JSON.stringify(['alpha', 'beta'])),
      setItem,
    });

    addKnownWord('gamma');

    expect(setItem).toHaveBeenCalledOnce();
    const [key, raw] = setItem.mock.calls[0] as [string, string];
    expect(key).toBe('eng_known_words');
    expect(Object.keys(JSON.parse(raw) as Record<string, string>)).toEqual([
      'alpha',
      'beta',
      'gamma',
    ]);
  });
});
