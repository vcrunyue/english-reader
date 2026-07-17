import { describe, expect, it } from 'vitest';
import {
  getNextDrawer,
  isDialogBackdropClick,
} from './mobile-reader-tools-state';

describe('getNextDrawer', () => {
  it('opens the requested drawer and replaces the current drawer', () => {
    expect(getNextDrawer(null, 'vocabulary')).toBe('vocabulary');
    expect(getNextDrawer('vocabulary', 'close-reading')).toBe('close-reading');
  });

  it('closes a drawer when its trigger is pressed again', () => {
    expect(getNextDrawer('vocabulary', 'vocabulary')).toBeNull();
  });
});

describe('isDialogBackdropClick', () => {
  it('only accepts a click whose target is the dialog itself', () => {
    const dialog = {};
    const child = {};

    expect(isDialogBackdropClick(dialog, dialog)).toBe(true);
    expect(isDialogBackdropClick(child, dialog)).toBe(false);
  });
});
