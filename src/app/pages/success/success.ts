import { Component, AfterViewInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { DownloadService } from '../../domain/services/download.service';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { PageContainerComponent } from '../../shared/components/page-container/page-container';
import { AppButtonComponent } from '../../shared/components/button/button';

@Component({
  selector: 'app-success',
  imports: [PageContainerComponent, AppButtonComponent],
  templateUrl: './success.html',
  styleUrl: './success.scss',
})
export class SuccessComponent implements AfterViewInit {
  protected readonly router = inject(Router);
  protected readonly downloadService = inject(DownloadService);
  protected readonly responsive = inject(ResponsiveService);

  ngAfterViewInit(): void {
    this.launchConfetti();
  }

  private launchConfetti(): void {
    const end = Date.now() + 1000;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0, y: 0.65 } });
      confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1, y: 0.65 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }

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
