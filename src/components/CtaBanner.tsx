import { Link } from 'react-router-dom';
import { Flame, Tent } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="container-saqer py-10 sm:py-16">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-saqer p-6 sm:rounded-3xl sm:p-10 lg:p-14">
        <div className="pointer-events-none absolute inset-0 bg-topo-pattern opacity-30" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-sand-400/30 blur-3xl sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-saqer-300/30 blur-3xl sm:h-80 sm:w-80" />

        <div className="relative grid items-center gap-6 sm:gap-8 md:grid-cols-[1fr_auto]">
          <div className="text-white">
            <span className="chip mb-3 gap-1.5 bg-white/15 text-sand-200 backdrop-blur">
              <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              عرض محدود
            </span>
            <h3 className="text-xl font-black leading-tight sm:text-3xl lg:text-4xl">
              احجز خيمتك الآن واحصل على
              <span className="mx-2 text-sand-300">خصم 20%</span>
              على الإكسسوارات
            </h3>
            <p className="mt-2 text-xs text-white/80 sm:mt-3 sm:text-base">
              عرض ينتهي قريباً — لا تفوّت فرصة تجهيز رحلتك القادمة بأفضل الأسعار.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              to="/products"
              className="btn bg-white text-saqer-800 hover:bg-sand-100 !px-4 !py-2.5 text-sm sm:!px-5 sm:!py-3 sm:text-base"
            >
              <Tent className="h-4 w-4" />
              ابدأ التسوق
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
