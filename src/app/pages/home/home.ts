import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { AppButtonComponent } from '../../shared/components/button/button';

@Component({
  selector: 'app-home',
  imports: [AppButtonComponent],
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
