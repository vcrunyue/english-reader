import { describe, expect, it } from 'vitest';
import { extractTranslations, stripTranslationLines } from './articles';

describe('article content normalization', () => {
  const crlfContent = [
    'First English paragraph.',
    '§ 第一段。',
    '',
    'Second English paragraph.',
    '§ 第二段。',
  ].join('\r\n');

  it('preserves paragraph breaks when translation lines are stripped from CRLF content', () => {
    expect(stripTranslationLines(crlfContent)).toBe(
      'First English paragraph.\n\nSecond English paragraph.',
    );
  });

  it('extracts CRLF content as separate translated paragraphs', () => {
    expect(extractTranslations(crlfContent)).toEqual([
      [{ en: 'First English paragraph.', zh: '第一段。' }],
      [{ en: 'Second English paragraph.', zh: '第二段。' }],
    ]);
  });

  it('consumes consecutive whitespace-only blank lines between paragraphs', () => {
    const content = [
      'First paragraph.',
      '§ 第一段。',
      '   ',
      '\t',
      'Second paragraph.',
      '§ 第二段。',
    ].join('\r\n');

    expect(extractTranslations(content)).toHaveLength(2);
  });

  it('keeps Markdown headings out of the readable paragraph index without dropping adjacent text', () => {
    const content = [
      '# Section heading',
      'First paragraph.',
      '§ 第一段。',
      '',
      'Second paragraph.',
      '§ 第二段。',
    ].join('\r\n');

    expect(extractTranslations(content)).toEqual([
      [{ en: 'First paragraph.', zh: '第一段。' }],
      [{ en: 'Second paragraph.', zh: '第二段。' }],
    ]);
  });

  it('recognizes Markdown headings anywhere without requiring surrounding blank lines', () => {
    const content = [
      'First paragraph.',
      '§ 第一段。',
      '## Second section',
      'Second paragraph.',
      '§ 第二段。',
      '### Third section',
      'Third paragraph.',
      '§ 第三段。',
    ].join('\r\n');

    expect(extractTranslations(content)).toEqual([
      [{ en: 'First paragraph.', zh: '第一段。' }],
      [{ en: 'Second paragraph.', zh: '第二段。' }],
      [{ en: 'Third paragraph.', zh: '第三段。' }],
    ]);
  });
});
