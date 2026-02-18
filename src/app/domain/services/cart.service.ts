import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';
import { ToastService } from './toast.service';

export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  // ── State ────────────────────────────────────────────────────────────────────
  readonly products = signal<Product[]>([]);
  readonly cartItems = signal<CartItem[]>([]);
  readonly status = signal<LoadStatus>('idle');
  readonly error = signal<string | null>(null);

  // ── Derived state (computed signals) ─────────────────────────────────────────
  readonly cartTotal: Signal<number> = computed(() =>
    this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0),
  );

  readonly totalItemsInCart: Signal<number> = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0),
  );

  // ── Actions ───────────────────────────────────────────────────────────────────
  loadProducts(): void {
    if (this.status() !== 'idle') return;
    this.status.set('loading');
    this.http.get<{ products: Product[] }>('data/books.json').subscribe({
      next: ({ products }) => {
        this.products.set(products);
        this.status.set('succeeded');
      },
      error: (err: Error) => {
        this.status.set('failed');
        this.error.set(err?.message ?? 'Failed to load products');
        this.toast.error('Failed to load products. Please try again.');
      },
    });
  }

  addToCart(productId: string): void {
    const product = this.products().find((p) => p.id === productId);
    if (!product) return;

    this.cartItems.update((items) => {
      const idx = items.findIndex((i) => i.id === productId);
      if (idx !== -1) {
        return items.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });

    this.toast.success(`"${product.title}" added to cart.`);
  }

  subtractFromCart(productId: string): void {
    this.cartItems.update((items) => {
      const idx = items.findIndex((i) => i.id === productId);
      if (idx === -1) return items;
      const item = items[idx];
      if (item.quantity <= 1) {
        return items.filter((_, i) => i !== idx);
      }
      return items.map((it, i) => (i === idx ? { ...it, quantity: it.quantity - 1 } : it));
    });
  }

  removeFromCart(productId: string): void {
    this.cartItems.update((items) => items.filter((i) => i.id !== productId));
  }

  emptyCart(): void {
    this.cartItems.set([]);
  }

  setQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update((items) => {
      const idx = items.findIndex((i) => i.id === productId);
      if (idx !== -1) {
        return items.map((item, i) => (i === idx ? { ...item, quantity } : item));
      }
      const product = this.products().find((p) => p.id === productId);
      if (product) return [...items, { ...product, quantity }];
      return items;
    });
  }

  getQuantityById(productId: string): number {
    const item = this.cartItems().find((i) => i.id === productId);
    return item?.quantity ?? 0;
  }
}
