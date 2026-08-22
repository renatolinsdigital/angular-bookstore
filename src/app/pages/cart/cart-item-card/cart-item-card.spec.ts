import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritableSignal, signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartItemCardComponent } from './cart-item-card';

interface CartItemCardInternal {
  formQuantity: WritableSignal<string>;
  subtract(): void;
  add(): void;
  remove(): void;
  onQuantityBlur(): void;
}
import { CartService } from '../../../domain/services/cart.service';
import { ResponsiveService } from '../../../domain/services/responsive.service';
import { provideHttpClient } from '@angular/common/http';
import { UNIQUE_PURCHASE } from '../../../app.tokens';

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
  getQuantityById: vi.fn().mockReturnValue(1),
};

const mockResponsiveService = {
  youJokingRight: signal(false),
  isSmaller: signal(false),
  isSmall: signal(false),
  isSuperSmall: signal(false),
  isDesktopBigScreen: signal(true),
  isDesktopSmallScreen: signal(false),
};

describe('CartItemCardComponent', () => {
  let component: CartItemCardComponent;
  let fixture: ComponentFixture<CartItemCardComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [CartItemCardComponent],
      providers: [
        provideHttpClient(),
        { provide: CartService, useValue: mockCartService },
        { provide: ResponsiveService, useValue: mockResponsiveService },
        { provide: UNIQUE_PURCHASE, useValue: true },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('itemId', 'p1');
    fixture.componentRef.setInput('itemName', 'Test Book');
    fixture.componentRef.setInput('itemPrice', 29.99);
    fixture.componentRef.setInput('quantity', 2);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sync formQuantity with quantity input on ngOnChanges', () => {
    fixture.componentRef.setInput('quantity', 5);
    component.ngOnChanges();
    expect((component as unknown as CartItemCardInternal).formQuantity()).toBe('5');
  });

  it('should call subtractFromCart when subtract() is called with quantity > 0', () => {
    (component as unknown as CartItemCardInternal).subtract();
    expect(mockCartService.subtractFromCart).toHaveBeenCalledWith('p1');
  });

  it('should not call subtractFromCart when quantity is 0', () => {
    fixture.componentRef.setInput('quantity', 0);
    fixture.detectChanges();
    (component as unknown as CartItemCardInternal).subtract();
    expect(mockCartService.subtractFromCart).not.toHaveBeenCalled();
  });

  it('should call addToCart when add() is called', () => {
    (component as unknown as CartItemCardInternal).add();
    expect(mockCartService.addToCart).toHaveBeenCalledWith('p1');
  });

  it('should not call addToCart when quantity is at 999', () => {
    fixture.componentRef.setInput('quantity', 999);
    fixture.detectChanges();
    (component as unknown as CartItemCardInternal).add();
    expect(mockCartService.addToCart).not.toHaveBeenCalled();
  });

  it('should call removeFromCart when remove() is called', () => {
    (component as unknown as CartItemCardInternal).remove();
    expect(mockCartService.removeFromCart).toHaveBeenCalledWith('p1');
  });

  it('should call setQuantity on blur with parsed numeric value', () => {
    (component as unknown as CartItemCardInternal).formQuantity.set('7');
    (component as unknown as CartItemCardInternal).onQuantityBlur();
    expect(mockCartService.setQuantity).toHaveBeenCalledWith('p1', 7);
  });

  it('should call setQuantity with 0 when blur value is NaN', () => {
    (component as unknown as CartItemCardInternal).formQuantity.set('abc');
    (component as unknown as CartItemCardInternal).onQuantityBlur();
    expect(mockCartService.setQuantity).toHaveBeenCalledWith('p1', 0);
  });
});
