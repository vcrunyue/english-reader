import type { Difficulty } from '@/types';

interface DifficultyStyle {
  label: string;
  /** Inline text highlight background (Tailwind classes) */
  highlightBg: string;
  /** Inline text highlight hover background */
  highlightHoverBg: string;
  /** Small dot/indicator color */
  dotColor: string;
  /** Pill/badge background */
  badgeBg: string;
  /** Pill/badge text color */
  badgeText: string;
  /** Legend description */
  description: string;
}

export const DIFFICULTY_STYLE: Record<Difficulty, DifficultyStyle> = {
  cet4: {
    label: '四级',
    highlightBg: 'bg-[#C8E4C0]',
    highlightHoverBg: 'hover:bg-[#A8D4A0]',
    dotColor: 'bg-[#7CB868]',
    badgeBg: 'bg-[#D4E8D0]',
    badgeText: 'text-[#3A5C34]',
    description: '大学英语四级范围',
  },
  cet6: {
    label: '六级',
    highlightBg: 'bg-[#EFDCA8]',
    highlightHoverBg: 'hover:bg-[#E8D08A]',
    dotColor: 'bg-[#D4A84C]',
    badgeBg: 'bg-[#F5E6C8]',
    badgeText: 'text-[#5C4A1E]',
    description: '大学英语六级范围',
  },
  postgrad: {
    label: '考研',
    highlightBg: 'bg-[#ECC8C8]',
    highlightHoverBg: 'hover:bg-[#E0A8A8]',
    dotColor: 'bg-[#C86868]',
    badgeBg: 'bg-[#F0D3D3]',
    badgeText: 'text-[#5C2A2A]',
    description: '考研及以上难度',
  },
};

/** Full highlight class for inline text: background + hover + padding */
export function getHighlightClass(d: Difficulty): string {
  const s = DIFFICULTY_STYLE[d];
  return `${s.highlightBg} ${s.highlightHoverBg} px-px`;
}

export function getDotColor(d: Difficulty): string {
  return DIFFICULTY_STYLE[d].dotColor;
}

export function getDifficultyLabel(d: Difficulty): string {
  return DIFFICULTY_STYLE[d].label;
}

export function getBadgeClass(d: Difficulty): string {
  const s = DIFFICULTY_STYLE[d];
  return `${s.badgeBg} ${s.badgeText}`;
}

/** Difficulty filter button options (including "all") */
export interface FilterOption {
  key: Difficulty | 'all';
  label: string;
  activeClass: string;
}

const ALL_FILTER: FilterOption = {
  key: 'all',
  label: '全部',
  activeClass: 'bg-[#EDE9E0] text-[#5C3D2E]',
};

export const DIFFICULTY_FILTERS: FilterOption[] = [
  ALL_FILTER,
  ...(['cet4', 'cet6', 'postgrad'] as const).map((key) => ({
    key,
    label: DIFFICULTY_STYLE[key].label,
    activeClass: getBadgeClass(key),
  })),
];
