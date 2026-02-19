import { inject, Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '../helpers/currency.helper';
import { CURRENCY } from '../../app.tokens';

@Pipe({ name: 'appCurrency', standalone: true })
export class AppCurrencyPipe implements PipeTransform {
  private readonly currency = inject(CURRENCY);

  transform(value: number): string {
    return formatCurrency(value, this.currency);
  }
}
