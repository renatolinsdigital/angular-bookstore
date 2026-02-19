import { Component, OnInit, Signal, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, switchMap, tap } from 'rxjs';
import { CartService } from '../../domain/services/cart.service';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { BooksApiService, PagedResult } from '../../domain/services/books-api.service';
import { PageContainerComponent } from '../../domain/components/page-container/page-container';
import { ProductCardComponent } from '../../domain/components/product-card/product-card';
import { PaginatorComponent } from '../../shared/components/paginator/paginator';
import { PAGE_SIZE } from '../../app.tokens';

const EMPTY_PAGE: PagedResult = { products: [], totalItems: 0, totalPages: 1, page: 1 };

@Component({
  selector: 'app-store',
  imports: [PageContainerComponent, ProductCardComponent, PaginatorComponent],
  templateUrl: './store.html',
  styleUrl: './store.scss',
})
export class StoreComponent implements OnInit {
  private readonly booksApi = inject(BooksApiService);
  protected readonly cartService = inject(CartService);
  protected readonly responsive = inject(ResponsiveService);

  readonly searchQuery = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = inject(PAGE_SIZE);
  readonly isLoading = signal(true);

  /** Populated reactively via BooksApiService — reacts to page and query changes. */
  readonly pageResult: Signal<PagedResult>;

  readonly gridColumns = computed(() => {
    if (this.responsive.isSmaller()) return '1fr';
    if (this.responsive.isSmall()) return '1fr 1fr';
    return '1fr 1fr 1fr';
  });

  constructor() {
    const params$ = combineLatest({
      page: toObservable(this.currentPage),
      query: toObservable(this.searchQuery),
    });

    this.pageResult = toSignal(
      params$.pipe(
        tap(() => this.isLoading.set(true)),
        switchMap(({ page, query }) => this.booksApi.fetchPage(page, query, this.pageSize)),
        tap(() => this.isLoading.set(false)),
      ),
      { initialValue: EMPTY_PAGE },
    );
  }

  ngOnInit(): void {
    // Keep all products loaded in CartService so the details page can look them up.
    this.cartService.loadProducts();
  }

  onSearch(event: Event): void {
    this.currentPage.set(1); // reset to first page on new search
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
