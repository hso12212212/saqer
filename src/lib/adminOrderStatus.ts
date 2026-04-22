import type { OrderStatus } from './api';

export const ORDER_STATUS_OPTIONS: {
  value: OrderStatus;
  label: string;
  color: string;
}[] = [
  { value: 'pending', label: 'بانتظار التأكيد', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' },
  { value: 'confirmed', label: 'تم التأكيد', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' },
  { value: 'shipped', label: 'جارٍ التوصيل', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200' },
  { value: 'delivered', label: 'تم التوصيل', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200' },
  { value: 'cancelled', label: 'ملغي', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200' },
];

export const statusMeta = (s: OrderStatus) =>
  ORDER_STATUS_OPTIONS.find((o) => o.value === s) ?? ORDER_STATUS_OPTIONS[0];
