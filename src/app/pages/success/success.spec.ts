import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import confetti from 'canvas-confetti';
import { SuccessComponent } from './success';
import { DownloadService } from '../../domain/services/download.service';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { CartItem } from '../../domain/models/cart-item.model';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const mockDownloadItems: CartItem[] = [
  {
    id: '1',
    title: 'Test Book',
    price: 20,
    quantity: 1,
    downloadUrl: 'https://example.com/book.pdf',
  },
];

const mockDownloadService = {
  downloadItems: signal<CartItem[]>(mockDownloadItems),
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

describe('SuccessComponent', () => {
  let component: SuccessComponent;
  let fixture: ComponentFixture<SuccessComponent>;
  let router: Router;

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [SuccessComponent],
      providers: [
        provideRouter([]),
        { provide: DownloadService, useValue: mockDownloadService },
        { provide: ResponsiveService, useValue: mockResponsiveService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should launch confetti on init', () => {
    expect(confetti).toHaveBeenCalled();
  });

  it('should navigate to /store when goToHome() is called', () => {
    const spy = vi.spyOn(router, 'navigate');
    (component as unknown as { goToHome(): void }).goToHome();
    expect(spy).toHaveBeenCalledWith(['/store']);
  });

  it('should do nothing in downloadItem() when no URL is provided', () => {
    const spy = vi.spyOn(document.body, 'appendChild');
    (component as unknown as { downloadItem(url?: string): void }).downloadItem(undefined);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should trigger download link when downloadItem() is called with a URL', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => ({}) as Node);
    const removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => ({}) as Node);
    (component as unknown as { downloadItem(url: string): void }).downloadItem(
      'https://example.com/book.pdf',
    );
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });
});
