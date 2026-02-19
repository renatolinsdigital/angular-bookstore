import { InjectionToken } from '@angular/core';

/**
 * When `true` (default), each product can only appear once per purchase — quantity
 * controls are hidden in the cart and `addToCart` will not increment beyond 1.
 * Set to `false` to allow customers to purchase multiple copies of the same item.
 */
export const UNIQUE_PURCHASE = new InjectionToken<boolean>('UNIQUE_PURCHASE', {
  providedIn: 'root',
  factory: () => true,
});
