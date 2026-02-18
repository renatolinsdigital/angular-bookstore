import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../domain/services/cart.service';
import { ResponsiveService } from '../../../domain/services/responsive.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeaderComponent {
  protected readonly router = inject(Router);
  protected readonly cartService = inject(CartService);
  protected readonly responsive = inject(ResponsiveService);

  protected goToHome(): void {
    this.router.navigate(['/']);
  }

  protected goToStore(): void {
    this.router.navigate(['/store']);
  }

  protected goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
