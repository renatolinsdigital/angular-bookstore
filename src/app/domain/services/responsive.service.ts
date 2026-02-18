import { Injectable, Signal, computed, signal } from '@angular/core';
import { BreakPoint } from '../models/breakpoints.model';

function getBreakPoint(value: number): BreakPoint {
  if (value <= 330) return 'jk';
  if (value <= 480) return 'ss';
  if (value < 768) return 'xs';
  if (value < 960) return 'sm';
  if (value < 1280) return 'md';
  if (value < 1920) return 'lg';
  return 'xl';
}

@Injectable({ providedIn: 'root' })
export class ResponsiveService {
  private readonly windowWidth = signal<BreakPoint>(
    getBreakPoint(typeof window !== 'undefined' ? window.innerWidth : 1280),
  );
  private readonly windowHeight = signal<BreakPoint>(
    getBreakPoint(typeof window !== 'undefined' ? window.innerHeight : 900),
  );

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  private onResize(): void {
    this.windowWidth.set(getBreakPoint(window.innerWidth));
    this.windowHeight.set(getBreakPoint(window.innerHeight));
  }

  /** Width <= 768px */
  readonly isSmaller: Signal<boolean> = computed(() =>
    ['jk', 'ss', 'xs'].includes(this.windowWidth()),
  );

  /** Width < 960px (includes mobile) */
  readonly isSmall: Signal<boolean> = computed(() =>
    ['jk', 'ss', 'xs', 'sm'].includes(this.windowWidth()),
  );

  /** Very small screen (w or h <= 480) */
  readonly isSuperSmall: Signal<boolean> = computed(
    () =>
      (!this.isSmaller() && this.windowHeight() === 'ss') ||
      (this.isSmaller() && this.windowWidth() === 'ss'),
  );

  /** Extreme tiny viewport */
  readonly youJokingRight: Signal<boolean> = computed(
    () =>
      (!this.isSmaller() && this.windowHeight() === 'jk') ||
      (this.isSmaller() && this.windowWidth() === 'jk'),
  );

  /** Width >= 1280 */
  readonly isDesktopBigScreen: Signal<boolean> = computed(() => !this.isSmall());

  /** 960 <= width < 1280 */
  readonly isDesktopSmallScreen: Signal<boolean> = computed(
    () => !this.isSmaller() && ['sm', 'md'].includes(this.windowWidth()),
  );
}
