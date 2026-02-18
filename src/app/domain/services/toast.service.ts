import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

const DEFAULT_DURATION = 4000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', duration = DEFAULT_DURATION): void {
    const id = crypto.randomUUID();
    this.toasts.update((list) => [...list, { id, message, type, duration }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  dismiss(id: string): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
