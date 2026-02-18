import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { DownloadService } from '../../core/services/download.service';
import { ResponsiveService } from '../../core/services/responsive.service';
import { PageContainerComponent } from '../layout/page-container/page-container';
import { CartItemCardComponent } from './cart-item-card/cart-item-card';
import { CurrencyBrlPipe } from '../../shared/pipes/currency-brl.pipe';

@Component({
  selector: 'app-cart',
  imports: [PageContainerComponent, CartItemCardComponent, CurrencyBrlPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent {
  protected readonly router = inject(Router);
  protected readonly cartService = inject(CartService);
  protected readonly downloadService = inject(DownloadService);
  protected readonly responsive = inject(ResponsiveService);

  protected goToHome(): void {
    this.router.navigate(['/']);
  }

  protected onPurchase(): void {
    this.downloadService.proceedToDownload(this.cartService.cartItems());
    this.cartService.emptyCart();
    this.router.navigate(['/success']);
  }
}
