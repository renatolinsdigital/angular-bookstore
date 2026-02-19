import { InjectionToken } from '@angular/core';

/**
 * When `true`, each product can only appear once per purchase — quantity
 * controls are hidden in the cart and `addToCart` will not increment beyond 1.
 * Set to `false` to allow customers to purchase multiple copies of the same item.
 *
 * Configure this value in `app.config.ts`:
 * ```ts
 * { provide: UNIQUE_PURCHASE, useValue: true }
 * ```
 */
export const UNIQUE_PURCHASE = new InjectionToken<boolean>('UNIQUE_PURCHASE', {
  providedIn: 'root',
  factory: () => true,
});

/**
 * Display currency for all prices throughout the app.
 * Accepted values: `'usd'` (default, e.g. $9.99) or `'brl'` (e.g. R$\u00a09,99).
 * Override in `app.config.ts` via `{ provide: CURRENCY, useValue: 'brl' }`.
 */
export const CURRENCY = new InjectionToken<'usd' | 'brl'>('CURRENCY', {
  providedIn: 'root',
  factory: () => 'usd',
});
