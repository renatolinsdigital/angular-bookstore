import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DownloadService } from '../../domain/services/download.service';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { PageContainerComponent } from '../../features/layout/page-container/page-container';

@Component({
  selector: 'app-success',
  imports: [PageContainerComponent],
  templateUrl: './success.html',
  styleUrl: './success.scss',
})
export class SuccessComponent {
  protected readonly router = inject(Router);
  protected readonly downloadService = inject(DownloadService);
  protected readonly responsive = inject(ResponsiveService);

  protected goToHome(): void {
    this.router.navigate(['/store']);
  }

  protected downloadItem(downloadUrl?: string): void {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
