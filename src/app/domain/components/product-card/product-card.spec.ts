import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductCardComponent } from './product-card';
import { CartService } from '../../services/cart.service';
import { DownloadService } from '../../services/download.service';
import { ToastService } from '../../services/toast.service';
import { ResponsiveService } from '../../services/responsive.service';
import { UNIQUE_PURCHASE } from '../../../app.tokens';

// Backing signal so getQuantityById is reactive inside computed() in the component
const mockQty = signal(0);

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
  getQuantityById: vi.fn().mockImplementation(() => mockQty()),
};

const mockResponsiveService = {
  youJokingRight: signal(false),
  isSmaller: signal(false),
  isSmall: signal(false),
  isSuperSmall: signal(false),
  isDesktopBigScreen: signal(true),
  isDesktopSmallScreen: signal(false),
};

const mockDownloadService = {
  downloadItems: signal([]),
  proceedToDownload: vi.fn(),
  downloadFile: vi.fn(),
};

const mockToastService = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  show: vi.fn(),
  dismiss: vi.fn(),
};

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    mockQty.set(0);
    vi.clearAllMocks();
    // Restore implementation after clearAllMocks resets it
    mockCartService.getQuantityById.mockImplementation(() => mockQty());

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: mockCartService },
        { provide: DownloadService, useValue: mockDownloadService },
        { provide: ToastService, useValue: mockToastService },
        { provide: ResponsiveService, useValue: mockResponsiveService },
        { provide: UNIQUE_PURCHASE, useValue: true },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('productId', 'p1');
    fixture.componentRef.setInput('title', 'Test Book');
    fixture.componentRef.setInput('price', 19.99);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the book title', () => {
    const title = fixture.nativeElement.querySelector('.product-card__title');
    expect(title.textContent.trim()).toBe('Test Book');
  });

  it('should show ADD TO CART label when item is not in cart', () => {
    const label = fixture.nativeElement.querySelector('.product-card__btn-label');
    expect(label.textContent.trim()).toBe('ADD TO CART');
  });

  it('should show VIEW IN CART label when item is already in cart (unique purchase mode)', () => {
    mockQty.set(2);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.product-card__btn-label');
    expect(label.textContent.trim()).toBe('VIEW IN CART');
  });

  it('should navigate to /cart when VIEW IN CART is clicked (unique purchase mode)', async () => {
    mockQty.set(1);
    fixture.detectChanges();
    const routerSpy = vi.spyOn(TestBed.inject(Router), 'navigate');
    const btn = fixture.nativeElement.querySelector('.product-card__btn');
    btn.click();
    await new Promise((r) => setTimeout(r, 300));
    expect(routerSpy).toHaveBeenCalledWith(['/cart']);
    expect(mockCartService.addToCart).not.toHaveBeenCalled();
  });

  it('should call cartService.addToCart when button is clicked', async () => {
    const btn = fixture.nativeElement.querySelector('.product-card__btn');
    btn.click();
    await new Promise((r) => setTimeout(r, 300));
    expect(mockCartService.addToCart).toHaveBeenCalledWith('p1');
  });

  it('should show a success toast after adding to cart', async () => {
    const btn = fixture.nativeElement.querySelector('.product-card__btn');
    btn.click();
    await new Promise((r) => setTimeout(r, 300));
    expect(mockToastService.success).toHaveBeenCalledWith('"Test Book" added to cart.');
  });

  it('should disable button when quantity is at 999', () => {
    mockQty.set(999);
    fixture.detectChanges();
    // The native <button> is the inner .app-btn inside <app-button>
    const btn = fixture.nativeElement.querySelector('.product-card__btn .app-btn');
    expect(btn.disabled).toBe(true);
  });

  describe('free books', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('price', 0);
      fixture.componentRef.setInput('downloadUrl', 'data/books/example.pdf');
      fixture.detectChanges();
    });

    it('should show Free instead of a price', () => {
      const price = fixture.nativeElement.querySelector('.product-card__price');
      expect(price.textContent.trim()).toBe('Free');
    });

    it('should show a DOWNLOAD label', () => {
      const label = fixture.nativeElement.querySelector('.product-card__btn-label');
      expect(label.textContent.trim()).toBe('DOWNLOAD');
    });

    it('should download instead of adding to cart', async () => {
      const btn = fixture.nativeElement.querySelector('.product-card__btn');
      btn.click();
      await new Promise((r) => setTimeout(r, 300));
      expect(mockDownloadService.downloadFile).toHaveBeenCalledWith('data/books/example.pdf');
      expect(mockCartService.addToCart).not.toHaveBeenCalled();
    });

    it('should stay enabled even when the cart quantity is at 999', () => {
      mockQty.set(999);
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('.product-card__btn .app-btn');
      expect(btn.disabled).toBe(false);
    });
  });
});
