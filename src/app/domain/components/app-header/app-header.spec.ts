import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppHeaderComponent } from './app-header';
import { CartService } from '../../services/cart.service';
import { ResponsiveService } from '../../services/responsive.service';
import { provideHttpClient } from '@angular/common/http';

const mockCartService = {
  totalItemsInCart: signal(0),
  cartItems: signal([]),
  products: signal([]),
  status: signal<'idle' | 'loading' | 'succeeded' | 'failed'>('idle'),
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

describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHeaderComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: CartService, useValue: mockCartService },
        { provide: ResponsiveService, useValue: mockResponsiveService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to / on goToHome()', () => {
    const spy = vi.spyOn(router, 'navigate');
    (component as unknown as { goToHome(): void }).goToHome();
    expect(spy).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to /store on goToStore()', () => {
    const spy = vi.spyOn(router, 'navigate');
    (component as unknown as { goToStore(): void }).goToStore();
    expect(spy).toHaveBeenCalledWith(['/store']);
  });

  it('should navigate to /cart on goToCart()', () => {
    const spy = vi.spyOn(router, 'navigate');
    (component as unknown as { goToCart(): void }).goToCart();
    expect(spy).toHaveBeenCalledWith(['/cart']);
  });

  it('should not show badge when cart is empty', () => {
    mockCartService.totalItemsInCart.set(0);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.app-header__cart-badge');
    expect(badge).toBeNull();
  });

  it('should show badge with item count when cart has items', () => {
    mockCartService.totalItemsInCart.set(3);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.app-header__cart-badge');
    expect(badge).not.toBeNull();
    expect(badge.textContent.trim()).toBe('3');
  });
});
