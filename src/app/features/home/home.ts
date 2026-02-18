import { Component, OnInit, computed, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ResponsiveService } from '../../core/services/responsive.service';
import { PageContainerComponent } from '../layout/page-container/page-container';
import { ProductCardComponent } from '../products/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [PageContainerComponent, ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  protected readonly cartService = inject(CartService);
  protected readonly responsive = inject(ResponsiveService);

  readonly gridColumns = computed(() => {
    if (this.responsive.isSmaller()) return '1fr';
    if (this.responsive.isSmall()) return '1fr 1fr';
    return '1fr 1fr 1fr';
  });

  ngOnInit(): void {
    this.cartService.loadProducts();
  }
}
