import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { PageContainerComponent } from '../../domain/components/page-container/page-container';

@Component({
  selector: 'app-not-found',
  imports: [PageContainerComponent],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFoundComponent {
  protected readonly router = inject(Router);
  protected readonly responsive = inject(ResponsiveService);

  protected goToHome(): void {
    this.router.navigate(['/store']);
  }
}
