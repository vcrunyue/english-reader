'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpenText, ListChecks, X } from 'lucide-react';
import type { SentencePair } from '@/types';
import { useReading } from '@/context/ReadingContext';
import CloseReadingPanel from '@/components/reader/CloseReadingPanel';
import WordPanelWrapper from './WordPanelWrapper';
import {
  getNextDrawer,
  isDialogBackdropClick,
  type MobileReaderDrawer,
} from './mobile-reader-tools-state';

interface MobileReaderToolsProps {
  content: string;
  translations: SentencePair[][];
}

const DRAWER_IDS: Record<MobileReaderDrawer, string> = {
  vocabulary: 'mobile-reader-vocabulary',
  'close-reading': 'mobile-reader-close-reading',
};

export default function MobileReaderTools({
  content,
  translations,
}: MobileReaderToolsProps) {
  const { selectedParagraph } = useReading();
  const [openDrawer, setOpenDrawer] = useState<MobileReaderDrawer | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Record<MobileReaderDrawer, HTMLButtonElement | null>>({
    vocabulary: null,
    'close-reading': null,
  });

  const closeDrawer = useCallback(() => {
    const drawerToRestore = openDrawer;
    setOpenDrawer(null);
    if (drawerToRestore) {
      requestAnimationFrame(() => triggerRefs.current[drawerToRestore]?.focus());
    }
  }, [openDrawer]);

  useEffect(() => {
    if (!openDrawer) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousBodyOverflow = document.body.style.overflow;
    const scrollContainer = dialog.closest('main') as HTMLElement | null;
    const previousScrollContainerOverflow = scrollContainer?.style.overflow ?? '';
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    if (scrollContainer) scrollContainer.style.overflow = 'hidden';

    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeDrawer();
    };
    desktopQuery.addEventListener('change', handleBreakpointChange);

    return () => {
      cancelAnimationFrame(focusFrame);
      desktopQuery.removeEventListener('change', handleBreakpointChange);
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousBodyOverflow;
      if (scrollContainer) scrollContainer.style.overflow = previousScrollContainerOverflow;
    };
  }, [closeDrawer, openDrawer]);

  const toggleDrawer = (requested: MobileReaderDrawer) => {
    setOpenDrawer(current => getNextDrawer(current, requested));
  };

  const title = openDrawer === 'vocabulary' ? '本文词汇' : '精读面板';

  return (
    <div className="order-4 flex w-full gap-2 lg:hidden">
      <button
        ref={node => { triggerRefs.current.vocabulary = node; }}
        type="button"
        onClick={() => toggleDrawer('vocabulary')}
        aria-expanded={openDrawer === 'vocabulary'}
        aria-controls={DRAWER_IDS.vocabulary}
        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[#D8D2C8] bg-[#F7F5F0] px-3 text-sm font-semibold text-[#5C3D2E] transition-colors hover:bg-[#EDE9E0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C4A]"
      >
        <ListChecks size={18} />
        词汇
      </button>
      <button
        ref={node => { triggerRefs.current['close-reading'] = node; }}
        type="button"
        onClick={() => toggleDrawer('close-reading')}
        aria-expanded={openDrawer === 'close-reading'}
        aria-controls={DRAWER_IDS['close-reading']}
        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[#D8D2C8] bg-[#F7F5F0] px-3 text-sm font-semibold text-[#5C3D2E] transition-colors hover:bg-[#EDE9E0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C4A]"
      >
        <BookOpenText size={18} />
        精读
      </button>

      {openDrawer && (
        <dialog
          ref={dialogRef}
          id={DRAWER_IDS[openDrawer]}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${DRAWER_IDS[openDrawer]}-title`}
          onCancel={event => {
            event.preventDefault();
            closeDrawer();
          }}
          onClick={event => {
            if (isDialogBackdropClick(event.target, event.currentTarget)) closeDrawer();
          }}
          className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-visible border-0 bg-transparent p-0 text-inherit backdrop:bg-[#2D2B28]/30 lg:hidden"
        >
          <section
            className="absolute inset-x-0 bottom-0 flex h-[70dvh] max-h-[70dvh] flex-col overflow-y-auto rounded-t-2xl border-t border-[#E8E4DD] bg-[#F7F5F0] shadow-2xl"
          >
            <div className="flex min-h-14 shrink-0 items-center justify-between border-b border-[#E8E4DD] px-4">
              <h2
                id={`${DRAWER_IDS[openDrawer]}-title`}
                className="font-display text-xl text-[#2D2B28]"
              >
                {title}
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                aria-label={`关闭${title}`}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#78716C] transition-colors hover:bg-[#EDE9E0] hover:text-[#5C3D2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C4A]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {openDrawer === 'vocabulary' ? (
                <WordPanelWrapper content={content} />
              ) : (
                <CloseReadingPanel
                  translations={translations}
                  selectedParagraph={selectedParagraph}
                />
              )}
            </div>
          </section>
        </dialog>
      )}
    </div>
  );
}
