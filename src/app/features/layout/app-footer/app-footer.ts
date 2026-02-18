import { Component, inject } from '@angular/core';
import { ResponsiveService } from '../../../core/services/responsive.service';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.html',
  styleUrl: './app-footer.scss',
})
export class AppFooterComponent {
  protected readonly responsive = inject(ResponsiveService);
}
