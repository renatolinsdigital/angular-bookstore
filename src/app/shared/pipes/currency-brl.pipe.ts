import { Pipe, PipeTransform } from '@angular/core';
import { formatToBRL } from '../helpers/currency.helper';

@Pipe({ name: 'currencyBrl', standalone: true })
export class CurrencyBrlPipe implements PipeTransform {
  transform(value: number): string {
    return formatToBRL(value);
  }
}
