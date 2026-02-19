import { Component, input, output, signal } from '@angular/core';
import { CurrencyBrlPipe } from '../../../shared/pipes/currency-brl.pipe';
import { AppButtonComponent } from '../../../shared/components/button/button';

export type PaymentMethod = 'card' | 'paypal' | 'pix';

@Component({
  selector: 'app-checkout-modal',
  imports: [CurrencyBrlPipe, AppButtonComponent],
  templateUrl: './checkout-modal.html',
  styleUrl: './checkout-modal.scss',
})
export class CheckoutModalComponent {
  readonly total = input<number>(0);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected selectedMethod = signal<PaymentMethod>('card');
  protected processing = signal(false);

  protected selectMethod(method: PaymentMethod): void {
    if (this.processing()) return;
    this.selectedMethod.set(method);
  }

  protected async confirmPayment(): Promise<void> {
    if (this.processing()) return;
    this.processing.set(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1400));
    this.processing.set(false);
    this.confirmed.emit();
  }

  protected cancel(): void {
    if (this.processing()) return;
    this.cancelled.emit();
  }
}
