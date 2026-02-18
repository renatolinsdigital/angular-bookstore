import { Component, inject, input, signal } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { ResponsiveService } from '../../../core/services/responsive.service';
import { CurrencyBrlPipe } from '../../../shared/pipes/currency-brl.pipe';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyBrlPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {
  readonly productId = input.required<string>();
  readonly title = input.required<string>();
  readonly price = input.required<number>();
  readonly imageUrl = input<string | undefined>(undefined);

  protected readonly cartService = inject(CartService);
  protected readonly responsive = inject(ResponsiveService);
  protected readonly isLoading = signal(false);

  protected get quantityInCart(): number {
    return this.cartService.getQuantityById(this.productId());
  }

  protected async handleAddToCart(): Promise<void> {
    if (this.quantityInCart >= 999) return;
    this.isLoading.set(true);
    // Simulate a short network delay (mirrors the React version)
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.cartService.addToCart(this.productId());
    this.isLoading.set(false);
  }
}
