export function formatToBRL(value: number): string {
  const number = value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R$\u00a0${number}`;
}

export function formatToUSD(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatCurrency(value: number, currency: 'brl' | 'usd'): string {
  return currency === 'brl' ? formatToBRL(value) : formatToUSD(value);
}
