import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StoreComponent } from './store';
import { CartService } from '../../domain/services/cart.service';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { provideHttpClient } from '@angular/common/http';
import { Product } from '../../domain/models/product.model';

const mockProducts: Product[] = [
  { id: '1', title: 'Angular Deep Dive', price: 29.99 },
  { id: '2', title: 'TypeScript Essentials', price: 19.99 },
  { id: '3', title: 'RxJS in Practice', price: 24.99 },
];

const mockCartService = {
  totalItemsInCart: signal(0),
  cartItems: signal([]),
  products: signal<Product[]>(mockProducts),
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
    mockCartService.products.set(mockProducts);
    mockCartService.status.set('succeeded');

    await TestBed.configureTestingModule({
      imports: [StoreComponent],
      providers: [
        provideHttpClient(),
        { provide: CartService, useValue: mockCartService },
        { provide: ResponsiveService, useValue: mockResponsiveService },
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

  it('should return all products when searchQuery is empty', () => {
    expect(component.filteredProducts().length).toBe(3);
  });

  it('should filter products by title (case-insensitive)', () => {
    component.searchQuery.set('angular');
    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].title).toBe('Angular Deep Dive');
  });

  it('should return empty array when no product matches query', () => {
    component.searchQuery.set('nonexistent book title');
    expect(component.filteredProducts().length).toBe(0);
  });

  it('should update searchQuery on onSearch()', () => {
    const event = { target: { value: 'rxjs' } } as unknown as Event;
    component.onSearch(event);
    expect(component.searchQuery()).toBe('rxjs');
  });

  it('should compute 3-column grid on large screen', () => {
    mockResponsiveService.isSmaller.set(false);
    mockResponsiveService.isSmall.set(false);
    expect(component.gridColumns()).toBe('1fr 1fr 1fr');
  });

  it('should compute 1-column grid on small screen', () => {
    mockResponsiveService.isSmaller.set(true);
    expect(component.gridColumns()).toBe('1fr');
  });
});
