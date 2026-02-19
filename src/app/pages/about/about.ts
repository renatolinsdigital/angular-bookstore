import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { AppButtonComponent } from '../../shared/components/button/button';

@Component({
  selector: 'app-about',
  imports: [AppButtonComponent],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {
  protected readonly router = inject(Router);
  protected readonly responsive = inject(ResponsiveService);

  protected goToStore(): void {
    this.router.navigate(['/store']);
  }
}
