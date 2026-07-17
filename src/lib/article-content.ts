export type ArticleContentBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; paragraphIndex: number; text: string };

export function normalizeArticleContent(content: string): string {
  return content.replace(/\r\n?/g, '\n');
}

export function parseArticleContent(content: string): ArticleContentBlock[] {
  const blocks: ArticleContentBlock[] = [];
  let paragraphLines: string[] = [];
  let paragraphIndex = 0;

  const flushParagraph = () => {
    const text = paragraphLines.join('\n').trim();
    paragraphLines = [];
    if (!text) return;
    blocks.push({ type: 'paragraph', paragraphIndex, text });
    paragraphIndex += 1;
  };

  for (const line of normalizeArticleContent(content).split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})[\t ]+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length as 1 | 2 | 3,
        text: headingMatch[2].trim(),
      });
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  return blocks;
}

export function stripTranslationLines(content: string): string {
  return normalizeArticleContent(content)
    .split('\n')
    .filter(line => !line.trim().startsWith('§'))
    .join('\n');
}
