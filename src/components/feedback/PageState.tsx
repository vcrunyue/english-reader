'use client';

import Link from 'next/link';

type PageStateAction =
  | { label: string; href: string; onClick?: never }
  | { label: string; onClick: () => void; href?: never };

interface PageStateProps {
  title: string;
  description: string;
  action?: PageStateAction;
  tone?: 'loading' | 'empty' | 'error';
}

const TONE_STYLES: Record<NonNullable<PageStateProps['tone']>, string> = {
  loading: 'border-[#DED8CF] bg-white/55',
  empty: 'border-[#DED8CF] bg-[#F7F3EB]/80',
  error: 'border-[#D9A7A0] bg-[#FFF7F5]',
};

export function PageState({
  title,
  description,
  action,
  tone = 'empty',
}: PageStateProps) {
  const accessibilityProps =
    tone === 'error'
      ? ({ role: 'alert' } as const)
      : tone === 'loading'
        ? ({ 'aria-live': 'polite' } as const)
        : {};
  const actionClassName =
    'inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2D2B28] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C88C4A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C4A] focus-visible:ring-offset-2';

  return (
    <section
      {...accessibilityProps}
      className={`mx-auto flex w-full max-w-xl flex-col items-center rounded-2xl border px-6 py-10 text-center ${TONE_STYLES[tone]}`}
    >
      <h2 className="font-display text-2xl text-[#2D2B28]">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#78716C]">{description}</p>
      {action?.href ? (
        <Link href={action.href} className={`mt-6 ${actionClassName}`}>
          {action.label}
        </Link>
      ) : action?.onClick ? (
        <button
          type="button"
          onClick={action.onClick}
          className={`mt-6 ${actionClassName}`}
        >
          {action.label}
        </button>
      ) : null}
    </section>
  );
}
