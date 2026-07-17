import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_VOCAB = join(__dirname, '..', 'public', 'vocab');

// Common part-of-speech prefixes in Chinese-English dictionary definitions
const POS_RE = /^(n\.|vt\.|vi\.|v\.|adj\.|a\.|adv\.|ad\.|prep\.|pron\.|conj\.|det\.|art\.|num\.|int\.|interj\.|aux\.|aux v\.|modal\.|modal verb\.|convention\.)\s+/;

function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const tabIdx = trimmed.indexOf('\t');
  if (tabIdx === -1) return null;

  const word = trimmed.slice(0, tabIdx).trim().toLowerCase();
  const rawDef = trimmed.slice(tabIdx + 1).trim();

  if (!word || !rawDef) return null;

  // Normalize data quirks: double dots, comma/ampersand-separated compound POS
  let def = rawDef.replace(/\.\./g, '.').replace(/([a-z]+)[,&]([a-z]+\.)/g, '$1. $2');

  // Normalize Chinese punctuation spacing: no space after ，、；、。and between CJK chars
  def = def.replace(/([，、；。])\s+/g, '$1');
  def = def.replace(/([一-鿿])\s+([一-鿿])/g, '$1$2');

  const posMatch = def.match(POS_RE);
  const pos = posMatch ? posMatch[1] : '';
  const definition = posMatch ? def.slice(posMatch[0].length) : def;

  return { word, pos, definition };
}

function buildVocab(rawFile, difficulty) {
  const raw = readFileSync(join(__dirname, rawFile), 'utf-8');
  const lines = raw.split(/\r?\n/);
  const vocab = {};

  for (const line of lines) {
    const parsed = parseLine(line);
    if (!parsed) continue;
    vocab[parsed.word] = {
      word: parsed.word,
      definition: parsed.definition,
      pos: parsed.pos,
      difficulty,
    };
  }

  return vocab;
}

// Deduplicate: remove words that appear in earlier levels
function deduplicate(vocab, ...excludes) {
  const cleaned = { ...vocab };
  for (const word of Object.keys(cleaned)) {
    if (excludes.some(ex => word in ex)) {
      delete cleaned[word];
    }
  }
  return cleaned;
}

// -- Main ----------------------------------------------------------------

mkdirSync(PUBLIC_VOCAB, { recursive: true });

const cet4 = buildVocab('cet4_raw.txt', 'cet4');
const cet6Raw = buildVocab('cet6_raw.txt', 'cet6');
const postgradRaw = buildVocab('postgrad_raw.txt', 'postgrad');

// Remove words already in lower levels
const cet6 = deduplicate(cet6Raw, cet4);
const postgrad = deduplicate(postgradRaw, cet4, cet6);

const outputs = [
  { name: 'cet4.json', data: cet4 },
  { name: 'cet6.json', data: cet6 },
  { name: 'postgrad.json', data: postgrad },
];

for (const { name, data } of outputs) {
  writeFileSync(join(PUBLIC_VOCAB, name), JSON.stringify(data, null, 2));
  const count = Object.keys(data).length;
  const kb = (Buffer.byteLength(JSON.stringify(data)) / 1024).toFixed(1);
  console.log(`${name}: ${count} 词条, ${kb} KB`);
}

const total = Object.keys(cet4).length + Object.keys(cet6).length + Object.keys(postgrad).length;
console.log(`合计: ${total} 词条 (去重后)`);
