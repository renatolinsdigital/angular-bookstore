import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ResponsiveService } from '../../domain/services/responsive.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  protected readonly router = inject(Router);
  protected readonly responsive = inject(ResponsiveService);

  protected browse(): void {
    this.router.navigate(['/store']);
  }
}
