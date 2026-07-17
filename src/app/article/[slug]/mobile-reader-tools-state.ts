export type MobileReaderDrawer = 'vocabulary' | 'close-reading';

export function getNextDrawer(
  current: MobileReaderDrawer | null,
  requested: MobileReaderDrawer,
): MobileReaderDrawer | null {
  return current === requested ? null : requested;
}

export function isDialogBackdropClick(
  target: unknown,
  currentTarget: unknown,
): boolean {
  return target === currentTarget;
}
