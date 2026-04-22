export function formatIQD(amount: number): string {
  return new Intl.NumberFormat('ar-IQ', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export const CURRENCY_LABEL = 'د.ع';
