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

  /** Triggers a browser download for a book file. */
  downloadFile(downloadUrl?: string): void {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
