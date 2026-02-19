import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DetailsComponent } from './details';
import { CartService } from '../../domain/services/cart.service';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { ToastService } from '../../domain/services/toast.service';
import { UNIQUE_PURCHASE } from '../../app.tokens';

const mockProduct = {
  id: '1',
  title: 'The First Book',
  price: 9.99,
  quickDescription: 'A quick summary.',
  fullDescription: 'A much longer and detailed description of the first book.',
  image: 'data/images/book1.png',
  downloadUrl: 'data/books/book1.pdf',
};

const mockCartService = {
  products: signal([mockProduct]),
  cartItems: signal([]),
  status: signal<'idle' | 'loading' | 'succeeded' | 'failed'>('succeeded'),
  loadProducts: vi.fn(),
  addToCart: vi.fn(),
  getQuantityById: vi.fn().mockReturnValue(0),
};

const mockResponsiveService = {
  youJokingRight: signal(false),
  isSmaller: signal(false),
  isSmall: signal(false),
};

const mockToastService = {
  success: vi.fn(),
  error: vi.fn(),
};

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        { provide: CartService, useValue: mockCartService },
        { provide: ResponsiveService, useValue: mockResponsiveService },
        { provide: ToastService, useValue: mockToastService },
        { provide: UNIQUE_PURCHASE, useValue: true },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product title', () => {
    const title = fixture.nativeElement.querySelector('.details__title');
    expect(title.textContent.trim()).toBe('The First Book');
  });

  it('should display the full description', () => {
    const desc = fixture.nativeElement.querySelector('.details__description');
    expect(desc.textContent.trim()).toBe(
      'A much longer and detailed description of the first book.',
    );
  });

  it('should navigate to /store when goToStore() is called', () => {
    const spy = vi.spyOn(router, 'navigate');
    (component as unknown as { goToStore(): void }).goToStore();
    expect(spy).toHaveBeenCalledWith(['/store']);
  });

  it('should navigate to /cart when goToCart() is called', () => {
    const spy = vi.spyOn(router, 'navigate');
    (component as unknown as { goToCart(): void }).goToCart();
    expect(spy).toHaveBeenCalledWith(['/cart']);
  });
});
