const ABBREVIATIONS = /(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc|i\.e|e\.g|U\.S|U\.K|E\.U|U\.N)\.$/;

export function splitEnglishSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const sentences: string[] = [];
  let current = '';

  const tokens = trimmed.split(/(\s+)/);

  for (const token of tokens) {
    current += token;

    if (/[.!?]$/.test(token) && !ABBREVIATIONS.test(token)) {
      sentences.push(current.trim());
      current = '';
    }
  }

  if (current.trim()) {
    sentences.push(current.trim());
  }

  return sentences;
}
