/** أرقام لاتينية 0-9 (واضحة وموحّدة) */
export function formatIQD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export const CURRENCY_LABEL = 'د.ع';
