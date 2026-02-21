import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../domain/services/cart.service';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { ToastService } from '../../domain/services/toast.service';
import { AppCurrencyPipe } from '../../shared/pipes/app-currency.pipe';
import { AppButtonComponent } from '../../shared/components/button/button';
import { PageContainerComponent } from '../../shared/components/page-container/page-container';
import { MetaChipComponent } from '../../shared/components/meta-chip/meta-chip';
import { UNIQUE_PURCHASE } from '../../app.tokens';

@Component({
  selector: 'app-details',
  imports: [AppCurrencyPipe, AppButtonComponent, PageContainerComponent, MetaChipComponent],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class DetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly cartService = inject(CartService);
  protected readonly responsive = inject(ResponsiveService);
  private readonly toast = inject(ToastService);
  protected readonly uniquePurchase = inject(UNIQUE_PURCHASE);

  protected readonly productId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');

  protected readonly product = computed(() =>
    this.cartService.products().find((p) => p.id === this.productId()),
  );

  protected readonly quantityInCart = computed(() =>
    this.cartService.getQuantityById(this.productId()),
  );

  protected readonly isLoading = signal(false);

  ngOnInit(): void {
    this.cartService.loadProducts();
  }

  protected async handleAddToCart(): Promise<void> {
    if (this.uniquePurchase && this.quantityInCart() > 0) {
      this.router.navigate(['/cart']);
      return;
    }
    if (this.quantityInCart() >= 999) return;
    this.isLoading.set(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.cartService.addToCart(this.productId());
    this.toast.success(`"${this.product()?.title}" added to cart.`);
    this.isLoading.set(false);
  }

  protected goToStore(): void {
    this.router.navigate(['/store']);
  }

  protected goToCart(): void {
    this.router.navigate(['/cart']);
  }

  protected goToStoreWithCategory(category: string): void {
    this.router.navigate(['/store'], { queryParams: { category } });
  }
}
