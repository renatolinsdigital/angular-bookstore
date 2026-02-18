import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ToastContainerComponent } from './toast-container';
import { Toast, ToastService } from '../../../domain/services/toast.service';

const mockToasts: Toast[] = [
  { id: '1', message: 'Item added to cart', type: 'success', duration: 3000 },
  { id: '2', message: 'Something went wrong', type: 'error', duration: 3000 },
];

const mockToastService = {
  toasts: signal<Toast[]>([]),
  show: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  dismiss: vi.fn(),
};

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockToastService.toasts.set([]);

    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
      providers: [{ provide: ToastService, useValue: mockToastService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render no toast items when toasts list is empty', () => {
    const toasts = fixture.nativeElement.querySelectorAll('.toast');
    expect(toasts.length).toBe(0);
  });

  it('should render a toast item for each toast in the list', () => {
    mockToastService.toasts.set(mockToasts);
    fixture.detectChanges();
    const toasts = fixture.nativeElement.querySelectorAll('.toast');
    expect(toasts.length).toBe(2);
  });

  it('should display the toast message text', () => {
    mockToastService.toasts.set(mockToasts);
    fixture.detectChanges();
    const messages = fixture.nativeElement.querySelectorAll('.toast__message');
    expect(messages[0].textContent.trim()).toBe('Item added to cart');
  });

  it('should apply the correct type modifier class', () => {
    mockToastService.toasts.set(mockToasts);
    fixture.detectChanges();
    const first = fixture.nativeElement.querySelector('.toast');
    expect(first.classList.contains('toast--success')).toBe(true);
  });

  it('should call toastService.dismiss when close button is clicked', () => {
    mockToastService.toasts.set([mockToasts[0]]);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.toast__close');
    btn.click();
    expect(mockToastService.dismiss).toHaveBeenCalledWith('1');
  });

  it('trackById should return the toast id', () => {
    const id = component.trackById(0, mockToasts[0]);
    expect(id).toBe('1');
  });

  it('should render an icon for each toast', () => {
    mockToastService.toasts.set(mockToasts);
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelectorAll('.toast__icon');
    expect(icons.length).toBe(2);
  });

  it('should render an svg inside the icon', () => {
    mockToastService.toasts.set([mockToasts[0]]);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('.toast__icon svg');
    expect(svg).not.toBeNull();
  });

  it('should render a progress bar for each toast', () => {
    mockToastService.toasts.set(mockToasts);
    fixture.detectChanges();
    const bars = fixture.nativeElement.querySelectorAll('.toast__progress-bar');
    expect(bars.length).toBe(2);
  });

  it('should set the progress bar animation-duration to match toast.duration', () => {
    mockToastService.toasts.set([mockToasts[0]]);
    fixture.detectChanges();
    const bar = fixture.nativeElement.querySelector('.toast__progress-bar') as HTMLElement;
    expect(bar.style.animationDuration).toBe('3000ms');
  });
});
