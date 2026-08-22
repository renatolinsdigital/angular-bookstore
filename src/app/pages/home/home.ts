import { Component, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BooksApiService } from '../../domain/services/books-api.service';
import { DownloadService } from '../../domain/services/download.service';
import { ResponsiveService } from '../../domain/services/responsive.service';
import { ToastService } from '../../domain/services/toast.service';
import { Product } from '../../domain/models/product.model';
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
  private readonly booksApi = inject(BooksApiService);
  private readonly downloadService = inject(DownloadService);
  private readonly toast = inject(ToastService);

  protected readonly freeBooks: Signal<Product[]> = toSignal(this.booksApi.fetchFreeBooks(), {
    initialValue: [],
  });

  protected browse(): void {
    this.router.navigate(['/store']);
  }

  protected goToDetails(productId: string): void {
    this.router.navigate(['/details', productId]);
  }

  protected downloadFreeBook(book: Product): void {
    this.downloadService.downloadFile(book.downloadUrl);
    this.toast.success(`"${book.title}" downloaded.`);
  }
}
