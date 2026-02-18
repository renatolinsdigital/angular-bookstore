import { Component, inject, input } from '@angular/core';
import { Toast, ToastService } from '../../../domain/services/toast.service';
import { AppButtonComponent } from '../button/button';

export type ToastPosition = 'top' | 'bottom';

@Component({
  selector: 'app-toast-container',
  imports: [AppButtonComponent],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
  readonly position = input<ToastPosition>('top');

  trackById(_: number, toast: Toast): string {
    return toast.id;
  }
}
