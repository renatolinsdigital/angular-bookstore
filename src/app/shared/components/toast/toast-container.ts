import { Component, inject } from '@angular/core';
import { Toast, ToastService } from '../../../domain/services/toast.service';
import { AppButtonComponent } from '../button/button';

@Component({
  selector: 'app-toast-container',
  imports: [AppButtonComponent],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  trackById(_: number, toast: Toast): string {
    return toast.id;
  }
}
