import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StoreComponent } from './store';
import { CartService } from '../../domain/services/cart.service';
import { BooksApiService, PagedResult } from '../../domain/services/books-api.service';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { provideHttpClient } from '@angular/common/http';
import { Product } from '../../domain/models/product.model';
import { PAGE_SIZE } from '../../app.tokens';

const mockProducts: Product[] = [
  { id: '1', title: 'Angular Deep Dive', price: 29.99 },
  { id: '2', title: 'TypeScript Essentials', price: 19.99 },
  { id: '3', title: 'RxJS in Practice', price: 24.99 },
];

const makePage = (products: Product[], page = 1, totalPages = 1): PagedResult => ({
  products,
  totalItems: products.length,
  totalPages,
  page,
});

const mockCartService = {
  totalItemsInCart: signal(0),
  cartItems: signal([]),
  products: signal<Product[]>([]),
  status: signal<'idle' | 'loading' | 'succeeded' | 'failed'>('succeeded'),
  error: signal<string | null>(null),
  cartTotal: signal(0),
  loadProducts: vi.fn(),
  addToCart: vi.fn(),
  subtractFromCart: vi.fn(),
  removeFromCart: vi.fn(),
  emptyCart: vi.fn(),
  setQuantity: vi.fn(),
  getQuantityById: vi.fn().mockReturnValue(0),
};

const mockBooksApiService = {
  fetchPage: vi.fn().mockImplementation((page: number, query: string) => {
    const filtered = query
      ? mockProducts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
      : mockProducts;
    return of(makePage(filtered, page, Math.ceil(filtered.length / 10) || 1));
  }),
};

const mockResponsiveService = {
  youJokingRight: signal(false),
  isSmaller: signal(false),
  isSmall: signal(false),
  isSuperSmall: signal(false),
  isDesktopBigScreen: signal(true),
  isDesktopSmallScreen: signal(false),
};

describe('StoreComponent', () => {
  let component: StoreComponent;
  let fixture: ComponentFixture<StoreComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockBooksApiService.fetchPage.mockImplementation((page: number, query: string) => {
      const filtered = query
        ? mockProducts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
        : mockProducts;
      return of(makePage(filtered, page, Math.ceil(filtered.length / 10) || 1));
    });

    await TestBed.configureTestingModule({
      imports: [StoreComponent],
      providers: [
        provideHttpClient(),
        { provide: CartService, useValue: mockCartService },
        { provide: BooksApiService, useValue: mockBooksApiService },
        { provide: ResponsiveService, useValue: mockResponsiveService },
        { provide: PAGE_SIZE, useValue: 10 },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadProducts on init', () => {
    expect(mockCartService.loadProducts).toHaveBeenCalled();
  });

  it('should call fetchPage on init with page 1, empty query and configured page size', () => {
    expect(mockBooksApiService.fetchPage).toHaveBeenCalledWith(1, '', 10);
  });

  it('should update searchQuery and reset page to 1 on onSearch()', () => {
    component.currentPage.set(3);
    const event = { target: { value: 'angular' } } as unknown as Event;
    component.onSearch(event);
    expect(component.searchQuery()).toBe('angular');
    expect(component.currentPage()).toBe(1);
  });

  it('should update currentPage on onPageChange()', () => {
    component.onPageChange(2);
    expect(component.currentPage()).toBe(2);
  });

  it('should compute 3-column grid on large screen', () => {
    mockResponsiveService.isSmaller.set(false);
    mockResponsiveService.isSmall.set(false);
    expect(component.gridColumns()).toBe('1fr 1fr 1fr');
  });

  it('should compute 2-column grid on small screen', () => {
    mockResponsiveService.isSmaller.set(false);
    mockResponsiveService.isSmall.set(true);
    fixture.detectChanges();
    expect(component.gridColumns()).toBe('1fr 1fr');
  });

  it('should compute 1-column grid on smaller screen', () => {
    mockResponsiveService.isSmaller.set(true);
    fixture.detectChanges();
    expect(component.gridColumns()).toBe('1fr');
  });
});
