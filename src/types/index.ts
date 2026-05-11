export type Difficulty = 'cet4' | 'cet6' | 'postgrad';

export interface ArticleMeta {
  slug: string;
  title: string;
  source: string;
  difficulty: Difficulty;
  topic: string;
  coverImage?: string;
  date: string;
}

export interface Article extends ArticleMeta {
  content: string;
}

export interface VocabEntry {
  word: string;
  definition: string;
  pos: string;
  difficulty: Difficulty;
}

export type VocabMap = Record<string, VocabEntry>;

export interface SavedWord {
  word: string;
  definition: string;
  difficulty: Difficulty;
  date: string;
  articleTitle: string;
}

export interface AppState {
  knownWords: string[];
  savedWords: Record<string, SavedWord>;
  highlightEnabled: boolean;
}
