import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ResponsiveService } from '../../core/services/responsive.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {
  protected readonly router = inject(Router);
  protected readonly responsive = inject(ResponsiveService);

  protected browse(): void {
    this.router.navigate(['/store']);
  }
}
