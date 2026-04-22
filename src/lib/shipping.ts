/** تكلفة التوصيل العادية (دينار عراقي) */
export const SHIPPING_COST_IQD = 5000;

export function shippingForSubtotal(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return SHIPPING_COST_IQD;
}
