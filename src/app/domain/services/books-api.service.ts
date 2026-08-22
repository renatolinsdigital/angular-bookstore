import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map, shareReplay } from 'rxjs';
import { Product } from '../models/product.model';

export interface PagedResult {
  products: Product[];
  totalItems: number;
  totalPages: number;
  page: number;
}

@Injectable({ providedIn: 'root' })
export class BooksApiService {
  private readonly http = inject(HttpClient);

  /** Cached full catalogue (loaded once, then served from memory). */
  private catalogue$: Observable<Product[]> | null = null;

  private getCatalogue(): Observable<Product[]> {
    if (!this.catalogue$) {
      this.catalogue$ = this.http.get<{ products: Product[] }>('data/books.json').pipe(
        map((r) => r.products),
        shareReplay(1),
      );
    }
    return this.catalogue$;
  }

  /**
   * Simulates a paginated back-end endpoint.
   * Returns the requested page of (optionally filtered) products
   * along with total page count and item count.
   */
  fetchPage(
    page: number,
    query: string,
    pageSize = 10,
    category?: string,
  ): Observable<PagedResult> {
    return this.getCatalogue().pipe(
      delay(500),
      map((books) => {
        const q = query.trim().toLowerCase();
        let filtered = q ? books.filter((b) => b.title.toLowerCase().includes(q)) : books;
        if (category) {
          filtered = filtered.filter((b) => b.categories?.includes(category));
        }

        const totalItems = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        const safePage = Math.min(Math.max(1, page), totalPages);
        const start = (safePage - 1) * pageSize;

        return {
          products: filtered.slice(start, start + pageSize),
          totalItems,
          totalPages,
          page: safePage,
        };
      }),
    );
  }

  /** Returns every zero-priced book, for the featured free shelf on the home page. */
  fetchFreeBooks(): Observable<Product[]> {
    return this.getCatalogue().pipe(
      delay(500),
      map((books) => books.filter((b) => b.price === 0)),
    );
  }

  /** Returns all unique categories sorted alphabetically. */
  fetchCategories(): Observable<string[]> {
    return this.getCatalogue().pipe(
      map((books) => {
        const set = new Set<string>();
        books.forEach((b) => b.categories?.forEach((c) => set.add(c)));
        return Array.from(set).sort();
      }),
    );
  }
}
