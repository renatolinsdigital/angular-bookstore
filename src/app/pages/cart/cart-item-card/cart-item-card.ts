import { Component, OnChanges, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../domain/services/cart.service';
import { ResponsiveService } from '../../../domain/services/responsive.service';
import { CurrencyBrlPipe } from '../../../shared/pipes/currency-brl.pipe';
import { AppButtonComponent } from '../../../shared/components/button/button';
import { UNIQUE_PURCHASE } from '../../../app.tokens';

@Component({
  selector: 'app-cart-item-card',
  imports: [FormsModule, CurrencyBrlPipe, AppButtonComponent],
  templateUrl: './cart-item-card.html',
  styleUrl: './cart-item-card.scss',
})
export class CartItemCardComponent implements OnChanges {
  readonly itemId = input.required<string>();
  readonly itemName = input.required<string>();
  readonly itemPrice = input.required<number>();
  readonly itemQuickDescription = input<string | undefined>(undefined);
  readonly quantity = input(0);
  readonly imageUrl = input<string | undefined>(undefined);
  readonly hasHeader = input(false);

  protected readonly cartService = inject(CartService);
  protected readonly responsive = inject(ResponsiveService);
  protected readonly uniquePurchase = inject(UNIQUE_PURCHASE);
  protected formQuantity = signal('0');

  ngOnChanges(): void {
    this.formQuantity.set(String(this.quantity()));
  }

  protected onQuantityInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formQuantity.set(value);
  }

  protected onQuantityBlur(): void {
    const qty = Number(this.formQuantity());
    this.cartService.setQuantity(this.itemId(), isNaN(qty) ? 0 : qty);
  }

  protected subtract(): void {
    if (this.quantity() <= 0) return;
    this.cartService.subtractFromCart(this.itemId());
  }

  protected add(): void {
    if (this.quantity() >= 999) return;
    this.cartService.addToCart(this.itemId());
  }

  protected remove(): void {
    this.cartService.removeFromCart(this.itemId());
  }
}
