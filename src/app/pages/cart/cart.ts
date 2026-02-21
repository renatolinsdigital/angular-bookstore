import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../domain/services/cart.service';
import { DownloadService } from '../../domain/services/download.service';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { PageContainerComponent } from '../../shared/components/page-container/page-container';
import { CartItemCardComponent } from './cart-item-card/cart-item-card';
import { AppCurrencyPipe } from '../../shared/pipes/app-currency.pipe';
import { AppButtonComponent } from '../../shared/components/button/button';
import { CheckoutModalComponent } from '../../domain/components/checkout-modal/checkout-modal';

@Component({
  selector: 'app-cart',
  imports: [
    PageContainerComponent,
    CartItemCardComponent,
    AppCurrencyPipe,
    AppButtonComponent,
    CheckoutModalComponent,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent {
  protected readonly router = inject(Router);
  protected readonly cartService = inject(CartService);
  protected readonly downloadService = inject(DownloadService);
  protected readonly responsive = inject(ResponsiveService);

  protected readonly checkoutOpen = signal(false);

  protected goToHome(): void {
    this.router.navigate(['/store']);
  }

  protected onPurchase(): void {
    this.checkoutOpen.set(true);
  }

  protected onPaymentConfirmed(): void {
    this.checkoutOpen.set(false);
    this.downloadService.proceedToDownload(this.cartService.cartItems());
    this.cartService.emptyCart();
    this.router.navigate(['/success']);
  }

  protected onCheckoutCancelled(): void {
    this.checkoutOpen.set(false);
  }
}
