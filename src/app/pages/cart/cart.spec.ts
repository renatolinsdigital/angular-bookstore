import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartComponent } from './cart';
import { CartService } from '../../domain/services/cart.service';
import { DownloadService } from '../../domain/services/download.service';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { CartItem } from '../../domain/models/cart-item.model';
import { provideHttpClient } from '@angular/common/http';

const mockCartItems: CartItem[] = [{ id: '1', title: 'Test Book', price: 20, quantity: 1 }];

const mockCartService = {
  totalItemsInCart: signal(1),
  cartItems: signal<CartItem[]>(mockCartItems),
  products: signal([]),
  status: signal<'idle' | 'loading' | 'succeeded' | 'failed'>('succeeded'),
  error: signal<string | null>(null),
  cartTotal: signal(20),
  loadProducts: vi.fn(),
  addToCart: vi.fn(),
  subtractFromCart: vi.fn(),
  removeFromCart: vi.fn(),
  emptyCart: vi.fn(),
  setQuantity: vi.fn(),
  getQuantityById: vi.fn().mockReturnValue(1),
};

const mockDownloadService = {
  downloadItems: signal<CartItem[]>([]),
  proceedToDownload: vi.fn(),
};

const mockResponsiveService = {
  youJokingRight: signal(false),
  isSmaller: signal(false),
  isSmall: signal(false),
  isSuperSmall: signal(false),
  isDesktopBigScreen: signal(true),
  isDesktopSmallScreen: signal(false),
};

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let router: Router;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: CartService, useValue: mockCartService },
        { provide: DownloadService, useValue: mockDownloadService },
        { provide: ResponsiveService, useValue: mockResponsiveService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /store when goToHome() is called', () => {
    const spy = vi.spyOn(router, 'navigate');
    (component as unknown as { goToHome(): void }).goToHome();
    expect(spy).toHaveBeenCalledWith(['/store']);
  });

  it('should call proceedToDownload with current cart items on purchase', () => {
    (component as unknown as { onPurchase(): void }).onPurchase();
    expect(mockDownloadService.proceedToDownload).toHaveBeenCalledWith(mockCartItems);
  });

  it('should empty cart on purchase', () => {
    (component as unknown as { onPurchase(): void }).onPurchase();
    expect(mockCartService.emptyCart).toHaveBeenCalled();
  });

  it('should navigate to /success on purchase', () => {
    const spy = vi.spyOn(router, 'navigate');
    (component as unknown as { onPurchase(): void }).onPurchase();
    expect(spy).toHaveBeenCalledWith(['/success']);
  });
});
