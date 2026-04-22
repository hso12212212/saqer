import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { ORDER_STATUS_OPTIONS, statusMeta } from '../lib/adminOrderStatus';
import { adminListOrders, type OrderDTO, type OrderStatus } from '../lib/api';
import { formatIQD, CURRENCY_LABEL } from '../lib/format';
import type { AdminOutletContext } from '../lib/adminOutletContext';
import { OrderRowSkeleton } from '../components/Skeleton';

export default function AdminOrdersList() {
  const { adminReloadKey = 0 } = useOutletContext<AdminOutletContext>() ?? {};
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const list = await adminListOrders();
      setOrders(list);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders, adminReloadKey]);

  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'all') return orders;
    return orders.filter((o) => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  return (
    <section className="space-y-3 sm:space-y-4">
      <h2 className="text-base font-black sm:text-lg">الطلبات</h2>

      <div
        className="-mx-0.5 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-pb-1 px-0.5 pb-2 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:thin] sm:mx-0 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:pb-1"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <button
          type="button"
          onClick={() => setOrderStatusFilter('all')}
          className={`flex min-h-11 shrink-0 snap-start items-center justify-center rounded-lg border px-3 py-2.5 text-xs font-extrabold transition-transform active:scale-[0.98] sm:min-h-0 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm ${
            orderStatusFilter === 'all'
              ? 'border-saqer-500 bg-saqer-50 text-saqer-900 dark:border-saqer-500 dark:bg-saqer-950/50 dark:text-saqer-100'
              : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300'
          }`}
        >
          الكل
          <span
            className={`mr-1 inline-block rounded-full px-1.5 text-[9px] font-black sm:mr-1.5 sm:text-[10px] ${
              orderStatusFilter === 'all'
                ? 'bg-saqer-200 text-saqer-900 dark:bg-saqer-800 dark:text-saqer-100'
                : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
            }`}
          >
            {orders.length}
          </span>
        </button>
        {ORDER_STATUS_OPTIONS.map((opt) => {
          const n = orders.filter((o) => o.status === opt.value).length;
          const active = orderStatusFilter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setOrderStatusFilter(opt.value)}
              className={`flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-extrabold transition-transform active:scale-[0.98] sm:min-h-0 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm ${
                active
                  ? 'border-saqer-500 bg-saqer-50 text-saqer-900 dark:border-saqer-500 dark:bg-saqer-950/50 dark:text-saqer-100'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`shrink-0 rounded-full px-1.5 text-[9px] font-black sm:text-[10px] ${
                  active
                    ? 'bg-saqer-200 text-saqer-900 dark:bg-saqer-800 dark:text-saqer-100'
                    : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
                }`}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {ordersLoading ? (
        <div className="space-y-2.5 sm:space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <OrderRowSkeleton key={i} />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card p-8 text-center sm:p-12">
          <div className="text-3xl sm:text-4xl">📋</div>
          <p className="mt-2 text-sm font-bold sm:mt-3 sm:text-base">
            لا توجد طلبات{orderStatusFilter !== 'all' ? ' بهذه الحالة' : ''}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {filteredOrders.map((order) => {
            const meta = statusMeta(order.status);
            return (
              <Link
                key={order.id}
                to={`/admin/orders/${order.id}`}
                className="group card flex border-ink-200 transition-all active:scale-[0.995] hover:border-saqer-500/50 hover:shadow-sm dark:border-ink-600"
              >
                <div className="flex w-full items-start gap-3 p-3 sm:p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-saqer-50 text-saqer-700 sm:h-12 sm:w-12 dark:bg-ink-800 dark:text-saqer-300">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-black sm:text-base group-hover:text-saqer-700 dark:group-hover:text-saqer-400">
                        #{order.id}
                      </span>
                      <span
                        className={`chip !px-2 !py-0.5 text-[10px] sm:text-[11px] ${meta.color}`}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-xs font-bold text-ink-800 sm:text-sm dark:text-ink-100">
                      {order.customerName}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-ink-500 sm:text-xs">
                      <span dir="ltr" className="tabular-nums">
                        {order.customerPhone}
                      </span>
                      {order.governorate && <span>• {order.governorate}</span>}
                      <span>• {new Date(order.createdAt).toLocaleDateString('ar-IQ')}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-left">
                    <div className="text-sm font-black tabular-nums text-saqer-700 sm:text-base dark:text-saqer-300">
                      {formatIQD(order.total)}
                    </div>
                    <div className="mt-0.5 text-[9px] font-bold text-ink-500 sm:text-[10px]">
                      {CURRENCY_LABEL}
                    </div>
                    <p className="mt-1 text-[10px] font-bold text-saqer-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-saqer-400 sm:text-xs">
                      عرض التفاصيل ←
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
