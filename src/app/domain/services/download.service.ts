import { Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  readonly downloadItems = signal<CartItem[]>([]);

  proceedToDownload(items: CartItem[]): void {
    this.downloadItems.update((existing) => {
      const toAdd = items.filter((item) => !existing.some((e) => e.id === item.id));
      return [...existing, ...toAdd];
    });
  }
}
