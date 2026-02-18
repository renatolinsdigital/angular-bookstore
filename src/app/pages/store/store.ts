import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CartService } from '../../domain/services/cart.service';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { PageContainerComponent } from '../../domain/components/page-container/page-container';
import { ProductCardComponent } from '../../domain/components/product-card/product-card';

@Component({
  selector: 'app-store',
  imports: [PageContainerComponent, ProductCardComponent],
  templateUrl: './store.html',
  styleUrl: './store.scss',
})
export class StoreComponent implements OnInit {
  protected readonly cartService = inject(CartService);
  protected readonly responsive = inject(ResponsiveService);

  readonly searchQuery = signal('');

  readonly filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.cartService.products();
    return this.cartService.products().filter((p) => p.title.toLowerCase().includes(query));
  });

  readonly gridColumns = computed(() => {
    if (this.responsive.isSmaller()) return '1fr';
    if (this.responsive.isSmall()) return '1fr 1fr';
    return '1fr 1fr 1fr';
  });

  ngOnInit(): void {
    this.cartService.loadProducts();
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }
}
