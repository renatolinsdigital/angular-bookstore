import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class PaginatorComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();

  readonly pageChange = output<number>();

  /**
   * Builds the array of page tokens to display.
   * Numbers are actual page indices; `null` represents an ellipsis gap.
   */
  readonly pages = computed<(number | null)[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const items: (number | null)[] = [1];
    const windowStart = Math.max(2, current - 1);
    const windowEnd = Math.min(total - 1, current + 1);

    if (windowStart > 2) items.push(null); // leading ellipsis
    for (let i = windowStart; i <= windowEnd; i++) items.push(i);
    if (windowEnd < total - 1) items.push(null); // trailing ellipsis

    items.push(total);
    return items;
  });

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.pageChange.emit(page);
  }
}
