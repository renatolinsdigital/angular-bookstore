import { Component, OnInit, Signal, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../domain/services/cart.service';
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
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly cartService = inject(CartService);

  readonly searchQuery = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = inject(PAGE_SIZE);
  readonly isLoading = signal(true);
  readonly activeCategory = signal<string | null>(null);
  /** Placeholder array used to render skeleton cards while a fetch is in-flight. */
  readonly skeletonRange: readonly unknown[];

  /** All unique categories derived from the catalogue — loaded once. */
  readonly categories: Signal<string[]>;

  /** Populated reactively via BooksApiService — reacts to page, query and category changes. */
  readonly pageResult: Signal<PagedResult>;

  constructor() {
    this.skeletonRange = Array.from({ length: this.pageSize });

    this.categories = toSignal(this.booksApi.fetchCategories(), { initialValue: [] });

    const params$ = combineLatest({
      page: toObservable(this.currentPage),
      query: toObservable(this.searchQuery),
      category: toObservable(this.activeCategory),
    });

    this.pageResult = toSignal(
      params$.pipe(
        tap(() => this.isLoading.set(true)),
        switchMap(({ page, query, category }) =>
          this.booksApi.fetchPage(page, query, this.pageSize, category ?? undefined),
        ),
        tap(() => this.isLoading.set(false)),
      ),
      { initialValue: EMPTY_PAGE },
    );
  }

  ngOnInit(): void {
    // Keep all products loaded in CartService so the details page can look them up.
    this.cartService.loadProducts();
    // Seed active category from URL query param (e.g. navigated from details page).
    const cat = this.route.snapshot.queryParamMap.get('category');
    if (cat) this.activeCategory.set(cat);
  }

  onSearch(event: Event): void {
    this.currentPage.set(1);
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onCategoryToggle(cat: string): void {
    this.currentPage.set(1);
    const next = !cat || this.activeCategory() === cat ? null : cat;
    this.activeCategory.set(next);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: next ?? undefined },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
