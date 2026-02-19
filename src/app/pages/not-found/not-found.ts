import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageContainerComponent } from '../../domain/components/page-container/page-container';
import { AppButtonComponent } from '../../shared/components/button/button';

@Component({
  selector: 'app-not-found',
  imports: [PageContainerComponent, AppButtonComponent],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFoundComponent {
  protected readonly router = inject(Router);

  protected goToHome(): void {
    this.router.navigate(['/store']);
  }
}
