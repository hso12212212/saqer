import { NavLink, useLocation } from 'react-router-dom';
import { ClipboardList, Package, Tag } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type NavCounts = {
  products: number;
  categories: number;
  orders: number;
};

const badgeClass = (active: boolean) =>
  `rounded-full px-2 py-0.5 text-[10px] font-black ${
    active ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-200'
  }`;

function linkBase(active: boolean, extra = '') {
  return `flex min-h-[44px] items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs font-extrabold transition-colors sm:text-sm ${extra} ${
    active
      ? 'bg-saqer-600 text-white shadow-sm dark:bg-saqer-600 dark:text-white'
      : 'text-ink-600 hover:bg-ink-50 active:bg-ink-100/80 dark:text-ink-200 dark:hover:bg-ink-800'
  }`;
}

function MobileCell({
  to,
  end,
  label,
  count,
  icon: Icon,
}: {
  to: string;
  end?: boolean;
  label: string;
  count: number;
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        linkBase(
          isActive,
          'min-h-[4.5rem] flex-col justify-center gap-1 py-2.5 min-[480px]:min-h-[4rem]',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="h-5 w-5 shrink-0 opacity-90" />
          <span className="text-center text-[11px] font-extrabold leading-tight">{label}</span>
          <span className={badgeClass(isActive)}>{count}</span>
        </>
      )}
    </NavLink>
  );
}

export default function MushrifSideNav({ counts }: { counts: NavCounts }) {
  const { pathname } = useLocation();
  const ordersPathActive =
    pathname === '/admin/orders' || /^\/admin\/orders\/[0-9]+/.test(pathname);

  return (
    <aside className="w-full shrink-0 lg:w-52">
      {/* —— الجوال: شبكة 2+1 + لمس واضح —— */}
      <div className="space-y-2 lg:hidden">
        <p className="px-0.5 text-[10px] font-black uppercase tracking-wide text-ink-400 dark:text-ink-500">
          التنقّل
        </p>
        <nav
          className="grid grid-cols-2 grid-rows-[auto_auto] gap-2 rounded-2xl border border-ink-200 bg-white p-2 shadow-sm dark:border-ink-600 dark:bg-ink-900"
          style={{ WebkitOverflowScrolling: 'touch' }}
          aria-label="قائمة المشرف"
        >
          <MobileCell
            to="/admin"
            end
            label="المنتجات"
            count={counts.products}
            icon={Package}
          />
          <MobileCell
            to="/admin/categories"
            label="الفئات"
            count={counts.categories}
            icon={Tag}
          />
          <div className="col-span-2">
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                linkBase(
                  isActive || ordersPathActive,
                  'min-h-[3.5rem] w-full flex-row justify-between gap-3 px-4',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <ClipboardList className="h-5 w-5 shrink-0 opacity-90" />
                    <span className="text-sm font-extrabold">الطلبات</span>
                  </span>
                  <span className={badgeClass(isActive || ordersPathActive)}>{counts.orders}</span>
                </>
              )}
            </NavLink>
          </div>
        </nav>
      </div>

      {/* —— سطح المكتب: تجميع كما سبق —— */}
      <div className="hidden space-y-2 lg:block">
        <p className="px-1 text-[10px] font-black uppercase tracking-wide text-ink-400 dark:text-ink-500">
          لوحة التحكم
        </p>
        <nav
          className="flex flex-col gap-1 overflow-x-auto rounded-2xl border border-ink-200 bg-white p-2 dark:border-ink-600 dark:bg-ink-900"
          style={{ WebkitOverflowScrolling: 'touch' }}
          aria-label="لوحة التحكم"
        >
          <NavLink to="/admin" end className={({ isActive }) => linkBase(isActive, 'w-full')}>
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4 shrink-0 opacity-90" />
                  المنتجات
                </span>
                <span className={badgeClass(isActive)}>{counts.products}</span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) => linkBase(isActive, 'w-full')}
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-2">
                  <Tag className="h-4 w-4 shrink-0 opacity-90" />
                  الفئات
                </span>
                <span className={badgeClass(isActive)}>{counts.categories}</span>
              </>
            )}
          </NavLink>
        </nav>
      </div>

      <div className="mt-0 hidden border-t border-ink-200 pt-4 dark:border-ink-700 lg:block">
        <nav
          className="flex flex-col gap-1 overflow-x-auto rounded-2xl border border-ink-200 bg-white p-2 dark:border-ink-600 dark:bg-ink-900"
          style={{ WebkitOverflowScrolling: 'touch' }}
          aria-label="الطلبات"
        >
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => linkBase(isActive || ordersPathActive, 'w-full')}
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 shrink-0 opacity-90" />
                  الطلبات
                </span>
                <span className={badgeClass(isActive || ordersPathActive)}>{counts.orders}</span>
              </>
            )}
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
