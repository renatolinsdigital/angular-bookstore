import { Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../domain/services/cart.service';
import { ToastService } from '../../../domain/services/toast.service';
import { ResponsiveService } from '../../../domain/services/responsive.service';
import { AppCurrencyPipe } from '../../../shared/pipes/app-currency.pipe';
import { AppButtonComponent } from '../../../shared/components/button/button';
import { UNIQUE_PURCHASE } from '../../../app.tokens';

@Component({
  selector: 'app-product-card',
  imports: [AppCurrencyPipe, AppButtonComponent],
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
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  protected readonly uniquePurchase = inject(UNIQUE_PURCHASE);
  protected readonly isLoading = signal(false);

  protected readonly quantityInCart = computed(() =>
    this.cartService.getQuantityById(this.productId()),
  );

  protected goToDetails(): void {
    this.router.navigate(['/details', this.productId()]);
  }

  protected async handleAddToCart(): Promise<void> {
    if (this.uniquePurchase && this.quantityInCart() > 0) return;
    if (this.quantityInCart() >= 999) return;
    this.isLoading.set(true);
    // Simulate a short network delay (mirrors the React version)
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.cartService.addToCart(this.productId());
    this.toast.success(`"${this.title()}" added to cart.`);
    this.isLoading.set(false);
  }
}
