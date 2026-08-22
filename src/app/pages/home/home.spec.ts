import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { HomeComponent } from './home';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { BooksApiService } from '../../domain/services/books-api.service';
import { DownloadService } from '../../domain/services/download.service';
import { ToastService } from '../../domain/services/toast.service';
import { Product } from '../../domain/models/product.model';

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

const freeBook: Product = {
  id: '4',
  title: 'Deep Focus',
  price: 0,
  author: 'Cal R. Newport',
  quickDescription: 'Proven techniques to eliminate distraction.',
  downloadUrl: 'data/books/example.pdf',
};

const mockBooksApiService = {
  fetchFreeBooks: vi.fn(() => of([freeBook])),
  fetchPage: vi.fn(),
  fetchCategories: vi.fn(() => of([])),
};

const mockResponsiveService = {
  youJokingRight: signal(false),
  isSmaller: signal(false),
  isSmall: signal(false),
  isSuperSmall: signal(false),
  isDesktopBigScreen: signal(true),
  isDesktopSmallScreen: signal(false),
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: ResponsiveService, useValue: mockResponsiveService },
        { provide: BooksApiService, useValue: mockBooksApiService },
        { provide: DownloadService, useValue: mockDownloadService },
        { provide: ToastService, useValue: mockToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /store when browse() is called', () => {
    const spy = vi.spyOn(router, 'navigate');
    (component as unknown as { browse(): void }).browse();
    expect(spy).toHaveBeenCalledWith(['/store']);
  });

  it('should render the CTA button', () => {
    const btn = fixture.nativeElement.querySelector('.app-btn--cta');
    expect(btn).not.toBeNull();
  });

  it('should render at least one feature card', () => {
    const cards = fixture.nativeElement.querySelectorAll('.home__feature');
    expect(cards.length).toBeGreaterThan(0);
  });

  describe('free book downloads', () => {
    it('should render a card for each free book', () => {
      const cards = fixture.nativeElement.querySelectorAll('.home__free-card');
      expect(cards.length).toBe(1);
      expect(cards[0].textContent).toContain('Deep Focus');
      expect(cards[0].textContent).toContain('Cal R. Newport');
    });

    it('should download the book and toast on success', () => {
      (component as unknown as { downloadFreeBook(b: Product): void }).downloadFreeBook(freeBook);
      expect(mockDownloadService.downloadFile).toHaveBeenCalledWith('data/books/example.pdf');
      expect(mockToastService.success).toHaveBeenCalledWith('"Deep Focus" downloaded.');
    });
  });
});
