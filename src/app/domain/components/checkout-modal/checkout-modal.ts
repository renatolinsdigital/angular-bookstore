import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCurrencyPipe } from '../../../shared/pipes/app-currency.pipe';
import { AppButtonComponent } from '../../../shared/components/button/button';
import { ResponsiveService } from '../../services/responsive.service';

export type PaymentMethod = 'card' | 'paypal' | 'pix';

@Component({
  selector: 'app-checkout-modal',
  imports: [AppCurrencyPipe, AppButtonComponent, FormsModule],
  templateUrl: './checkout-modal.html',
  styleUrl: './checkout-modal.scss',
})
export class CheckoutModalComponent {
  protected readonly responsive = inject(ResponsiveService);

  readonly total = input<number>(0);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected selectedMethod = signal<PaymentMethod>('card');
  protected processing = signal(false);
  protected pixCopied = signal(false);

  // Card fields
  protected cardName = '';
  protected cardNumber = '';
  protected expiryDate = '';
  protected cvv = '';

  // PayPal fields
  protected paypalEmail = '';
  protected paypalPassword = '';

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

  protected copyPixKey(): void {
    navigator.clipboard.writeText('12.345.678/0001-99').catch(() => undefined);
    this.pixCopied.set(true);
    setTimeout(() => this.pixCopied.set(false), 2000);
  }

  protected cancel(): void {
    if (this.processing()) return;
    this.cancelled.emit();
  }
}
