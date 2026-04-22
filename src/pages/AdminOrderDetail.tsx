import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  Phone,
  StickyNote,
  Trash2,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  adminDeleteOrder,
  adminGetOrder,
  adminUpdateOrderStatus,
  type OrderDTO,
  type OrderStatus,
} from '../lib/api';
import { CURRENCY_LABEL, formatIQD } from '../lib/format';
import { productImageSrc, productPrimaryImage } from '../lib/imageUrl';
import { ORDER_STATUS_OPTIONS, statusMeta } from '../lib/adminOrderStatus';
import type { AdminOutletContext } from '../lib/adminOutletContext';
import { Skeleton } from '../components/Skeleton';

const STATUS_ICON: Record<OrderStatus, typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle2,
  shipped: Truck,
  delivered: PackageCheck,
  cancelled: XCircle,
};

const STATUS_TONE: Record<
  OrderStatus,
  { soft: string; ring: string; iconBg: string; text: string }
> = {
  pending: {
    soft: 'bg-amber-50 dark:bg-amber-900/20',
    ring: 'ring-amber-200 dark:ring-amber-900/40',
    iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200',
    text: 'text-amber-800 dark:text-amber-200',
  },
  confirmed: {
    soft: 'bg-blue-50 dark:bg-blue-900/20',
    ring: 'ring-blue-200 dark:ring-blue-900/40',
    iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200',
    text: 'text-blue-800 dark:text-blue-200',
  },
  shipped: {
    soft: 'bg-indigo-50 dark:bg-indigo-900/20',
    ring: 'ring-indigo-200 dark:ring-indigo-900/40',
    iconBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200',
    text: 'text-indigo-800 dark:text-indigo-200',
  },
  delivered: {
    soft: 'bg-emerald-50 dark:bg-emerald-900/20',
    ring: 'ring-emerald-200 dark:ring-emerald-900/40',
    iconBg:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200',
    text: 'text-emerald-800 dark:text-emerald-200',
  },
  cancelled: {
    soft: 'bg-rose-50 dark:bg-rose-900/20',
    ring: 'ring-rose-200 dark:ring-rose-900/40',
    iconBg: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200',
    text: 'text-rose-800 dark:text-rose-200',
  },
};

function toWhatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('964')) return digits;
  if (digits.startsWith('0')) return `964${digits.slice(1)}`;
  return `964${digits}`;
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminReloadKey = 0 } = useOutletContext<AdminOutletContext>() ?? {};
  const { getProduct } = useStore();
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<OrderStatus | null>(null);
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);

  const showToast = (kind: 'ok' | 'err', msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 2500);
  };

  const load = useCallback(async () => {
    if (!id) return;
    setLoadingOrder(true);
    setErr(null);
    try {
      const o = await adminGetOrder(Number(id));
      setOrder(o);
    } catch (e) {
      setOrder(null);
      setErr(e instanceof Error ? e.message : 'تعذّر تحميل الطلب');
    } finally {
      setLoadingOrder(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load, adminReloadKey]);

  const changeStatus = async (status: OrderStatus) => {
    if (!order || order.status === status) return;
    setUpdatingStatus(status);
    try {
      await adminUpdateOrderStatus(order.id, status);
      setOrder((prev) => (prev ? { ...prev, status } : null));
      showToast('ok', 'تم تحديث الحالة');
    } catch (e) {
      showToast('err', e instanceof Error ? e.message : 'فشل التحديث');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const removeOrder = async () => {
    if (!order) return;
    if (!confirm(`حذف الطلب #${order.id} نهائيًا؟`)) return;
    try {
      await adminDeleteOrder(order.id);
      navigate('/admin/orders', { replace: true });
    } catch (e) {
      showToast('err', e instanceof Error ? e.message : 'فشل الحذف');
    }
  };

  const copyAddress = async () => {
    if (!order) return;
    const text = [order.customerName, order.governorate, order.customerAddress]
      .filter(Boolean)
      .join(' — ');
    try {
      await navigator.clipboard.writeText(text);
      showToast('ok', 'تم نسخ العنوان');
    } catch {
      showToast('err', 'تعذّر النسخ');
    }
  };

  const meta = order ? statusMeta(order.status) : null;
  const tone = order ? STATUS_TONE[order.status] : null;
  const StatusIcon = order ? STATUS_ICON[order.status] : Clock;

  const totalItems = useMemo(
    () => (order ? order.items.reduce((s, i) => s + i.quantity, 0) : 0),
    [order],
  );

  return (
    <>
      <nav className="mb-3 flex items-center justify-between sm:mb-4">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-bold text-ink-700/85 transition hover:bg-ink-100 hover:text-saqer-600 dark:text-ink-200/90 dark:hover:bg-ink-800 dark:hover:text-saqer-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>العودة للطلبات</span>
        </Link>
      </nav>

      {loadingOrder && (
        <div className="space-y-3 pb-6 sm:space-y-4">
          <Skeleton rounded="rounded-2xl" className="h-28 w-full" />
          <Skeleton rounded="rounded-2xl" className="h-20 w-full" />
          <Skeleton rounded="rounded-2xl" className="h-24 w-full" />
          <Skeleton rounded="rounded-2xl" className="h-40 w-full" />
          <Skeleton rounded="rounded-2xl" className="h-64 w-full" />
        </div>
      )}

      {err && !loadingOrder && (
        <div className="card border-rose-200 p-6 text-center dark:border-rose-900/40">
          <p className="font-bold text-rose-600 dark:text-rose-400">{err}</p>
          <Link
            to="/admin/orders"
            className="mt-4 inline-block font-bold text-saqer-700 dark:text-saqer-300"
          >
            العودة للقائمة
          </Link>
        </div>
      )}

      {order && meta && tone && !err && !loadingOrder && (
        <div className="space-y-3 pb-6 sm:space-y-4">
          <header
            className={`relative overflow-hidden rounded-2xl p-4 ring-1 ring-inset sm:p-5 ${tone.soft} ${tone.ring}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl sm:h-12 sm:w-12 ${tone.iconBg}`}
              >
                <StatusIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-ink-500 dark:text-ink-400">
                    رقم الطلب
                  </span>
                  <span className="text-lg font-black tabular-nums text-ink-900 dark:text-white sm:text-xl">
                    #{order.id}
                  </span>
                </div>
                <p className={`mt-0.5 text-sm font-black sm:text-base ${tone.text}`}>
                  {meta.label}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-500 dark:text-ink-400 sm:text-xs">
                  {new Date(order.createdAt).toLocaleString('ar-IQ', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              <div className="shrink-0 text-left">
                <div className="text-lg font-black tabular-nums text-ink-900 dark:text-white sm:text-2xl">
                  {formatIQD(order.total)}
                </div>
                <div className="mt-0.5 text-[10px] font-bold text-ink-500 sm:text-xs">
                  {CURRENCY_LABEL}
                </div>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-white/60 pt-3 text-center dark:border-white/10">
              <Stat label="العميل" value={order.customerName} />
              <Stat label="القطع" value={`${totalItems}`} />
              <Stat
                label="المحافظة"
                value={order.governorate ?? '—'}
              />
            </dl>
          </header>

          <section className="card border-ink-200 p-3 dark:border-ink-700 sm:p-4">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wide text-ink-500 dark:text-ink-400 sm:text-xs">
                إجراءات سريعة
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <QuickAction
                href={`tel:${order.customerPhone}`}
                icon={<Phone className="h-4 w-4" />}
                label="اتصال"
              />
              <QuickAction
                href={`https://wa.me/${toWhatsappNumber(order.customerPhone)}`}
                target="_blank"
                rel="noopener noreferrer"
                icon={<MessageCircle className="h-4 w-4" />}
                label="واتساب"
              />
              <QuickAction
                onClick={() => void copyAddress()}
                icon={<Copy className="h-4 w-4" />}
                label="نسخ العنوان"
              />
            </div>
          </section>

          <section className="card border-ink-200 p-3 dark:border-ink-700 sm:p-4">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <span className="text-[11px] font-black uppercase tracking-wide text-ink-500 dark:text-ink-400 sm:text-xs">
                تحديث الحالة
              </span>
            </div>
            <div
              className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {ORDER_STATUS_OPTIONS.map((opt) => {
                const active = order.status === opt.value;
                const busy = updatingStatus === opt.value;
                const Icon = STATUS_ICON[opt.value];
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => void changeStatus(opt.value)}
                    disabled={updatingStatus !== null}
                    className={`inline-flex shrink-0 snap-start items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-extrabold transition-all active:scale-[0.97] disabled:opacity-60 sm:text-sm ${
                      active
                        ? 'border-saqer-500 bg-saqer-50 text-saqer-900 shadow-sm dark:border-saqer-500/70 dark:bg-saqer-900/30 dark:text-saqer-100'
                        : 'border-ink-200 bg-white text-ink-700 hover:border-saqer-400 hover:text-saqer-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200'
                    } ${busy ? 'animate-pulse' : ''}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {opt.label}
                    {active && (
                      <span className="mr-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-saqer-600 dark:bg-saqer-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="card border-ink-200 p-4 dark:border-ink-700 sm:p-5">
            <h2 className="mb-3 text-[11px] font-black uppercase tracking-wide text-ink-500 dark:text-ink-400 sm:text-xs">
              معلومات المستلم
            </h2>
            <ul className="divide-y divide-ink-100 dark:divide-ink-800">
              <InfoRow
                icon={<User className="h-4 w-4" />}
                label="الاسم"
                value={order.customerName}
              />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="الهاتف"
                value={
                  <a
                    href={`tel:${order.customerPhone}`}
                    dir="ltr"
                    className="font-black tabular-nums text-saqer-700 hover:underline dark:text-saqer-300"
                  >
                    {order.customerPhone}
                  </a>
                }
              />
              {order.governorate && (
                <InfoRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="المحافظة"
                  value={order.governorate}
                />
              )}
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="العنوان"
                value={
                  <span className="leading-relaxed text-ink-900 dark:text-ink-100">
                    {order.customerAddress}
                  </span>
                }
              />
              {order.notes && (
                <InfoRow
                  icon={<StickyNote className="h-4 w-4" />}
                  label="ملاحظات"
                  value={
                    <span className="text-ink-700 dark:text-ink-200">{order.notes}</span>
                  }
                />
              )}
            </ul>
          </section>

          <section className="card overflow-hidden border-ink-200 dark:border-ink-700">
            <header className="flex items-center justify-between gap-2 border-b border-ink-100 bg-ink-50/70 px-4 py-2.5 dark:border-ink-800 dark:bg-ink-800/40">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-ink-500 dark:text-ink-400" />
                <h2 className="text-sm font-black text-ink-900 dark:text-white">المنتجات</h2>
              </div>
              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-black text-ink-700 shadow-sm dark:bg-ink-900 dark:text-ink-200">
                {order.items.length}
              </span>
            </header>

            <ul className="divide-y divide-ink-100 dark:divide-ink-800">
              {order.items.map((it, idx) => {
                const prod = it.productId ? getProduct(it.productId) : undefined;
                const lineTotal = (it.price ?? 0) * it.quantity;
                return (
                  <li key={idx} className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-ink-100 bg-ink-50 sm:h-20 sm:w-20 dark:border-ink-700 dark:bg-ink-800">
                      {prod && productPrimaryImage(prod) ? (
                        <img
                          src={productImageSrc(productPrimaryImage(prod))}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-xl">📦</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-black leading-snug text-ink-900 dark:text-white sm:text-base">
                        {it.name ?? it.productId}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-ink-500 dark:text-ink-400 sm:text-xs">
                        <span className="rounded-md bg-ink-100 px-1.5 py-0.5 font-bold text-ink-700 dark:bg-ink-800 dark:text-ink-200">
                          × {it.quantity}
                        </span>
                        {it.price != null && (
                          <span className="tabular-nums">
                            {formatIQD(it.price)} / قطعة
                          </span>
                        )}
                      </div>
                    </div>
                    {it.price != null && (
                      <div className="shrink-0 text-left">
                        <div className="text-sm font-black tabular-nums text-ink-900 dark:text-white sm:text-base">
                          {formatIQD(lineTotal)}
                        </div>
                        <div className="text-[9px] font-bold text-ink-500 sm:text-[10px]">
                          {CURRENCY_LABEL}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="space-y-1.5 border-t border-ink-100 bg-ink-50/40 p-4 text-sm dark:border-ink-800 dark:bg-ink-900/40 sm:p-5">
              <SummaryRow label="المجموع الفرعي" value={formatIQD(order.subtotal)} />
              <SummaryRow
                label="الشحن"
                value={order.shipping === 0 ? 'مجاني' : formatIQD(order.shipping)}
                accent={order.shipping === 0 ? 'text-emerald-700 dark:text-emerald-400' : ''}
              />
              <div className="mt-2 flex items-center justify-between border-t border-ink-200 pt-3 dark:border-ink-700">
                <span className="text-base font-black text-ink-900 dark:text-white">
                  الإجمالي
                </span>
                <span className="text-xl font-black tabular-nums text-saqer-700 dark:text-saqer-300 sm:text-2xl">
                  {formatIQD(order.total)} {CURRENCY_LABEL}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 p-3 dark:border-rose-900/40 dark:bg-rose-950/20 sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-bold text-rose-800 dark:text-rose-200">
                حذف هذا الطلب نهائيًا من قاعدة البيانات
              </p>
              <button
                type="button"
                onClick={() => void removeOrder()}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-300 bg-white px-3 py-2 text-xs font-black text-rose-700 transition hover:bg-rose-100 active:scale-[0.98] dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-900/30 sm:text-sm"
              >
                <Trash2 className="h-4 w-4" />
                حذف الطلب
              </button>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 animate-fade-up rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg sm:bottom-6 ${
            toast.kind === 'ok' ? 'bg-saqer-600' : 'bg-rose-600'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-bold text-ink-500 dark:text-ink-400 sm:text-[11px]">
        {label}
      </div>
      <div className="truncate text-xs font-black text-ink-900 dark:text-white sm:text-sm">
        {value}
      </div>
    </div>
  );
}

function QuickAction({
  href,
  onClick,
  icon,
  label,
  target,
  rel,
}: {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  target?: string;
  rel?: string;
}) {
  const cls =
    'inline-flex min-h-[44px] w-full flex-col items-center justify-center gap-1 rounded-xl border border-ink-200 bg-white px-2 py-2 text-[11px] font-bold text-ink-800 transition hover:border-ink-400 hover:bg-ink-50 active:scale-[0.97] dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:hover:border-ink-500 dark:hover:bg-ink-800 sm:flex-row sm:gap-1.5 sm:text-xs';
  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={cls}>
        {icon}
        <span className="truncate">{label}</span>
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <dt className="text-[10px] font-bold text-ink-500 dark:text-ink-400 sm:text-[11px]">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-bold text-ink-900 dark:text-white">{value}</dd>
      </div>
    </li>
  );
}

function SummaryRow({
  label,
  value,
  accent = '',
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-600 dark:text-ink-300">{label}</span>
      <span className={`font-black tabular-nums text-ink-900 dark:text-white ${accent}`}>
        {value}
      </span>
    </div>
  );
}
