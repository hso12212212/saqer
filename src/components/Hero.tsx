import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Sparkles, TentTree } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-10 pt-6 sm:pb-16 sm:pt-10 lg:pb-24 lg:pt-14">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-bl from-saqer-50/70 via-white to-sand-50/40 dark:from-ink-900 dark:via-ink-950 dark:to-ink-900" />
        <div className="absolute inset-0 bg-hero-pattern opacity-60" />
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-saqer-300/20 blur-3xl dark:bg-saqer-500/10" />
        <div className="absolute -right-10 bottom-10 h-96 w-96 rounded-full bg-sand-300/20 blur-3xl dark:bg-sand-500/10" />
      </div>

      <div className="container-saqer grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="animate-fade-up text-center lg:text-right">
          <span className="chip mb-4 gap-1.5 bg-saqer-100 text-saqer-800 dark:bg-saqer-900/40 dark:text-saqer-200">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="text-[10px] sm:text-xs">جديد — عروض موسم التخييم</span>
          </span>

          <h1 className="text-balance text-3xl font-black leading-[1.15] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl dark:text-white">
            مغامرتك تبدأ مع
            <span className="relative mx-2 whitespace-nowrap">
              <span className="relative z-10 bg-gradient-to-l from-saqer-600 to-saqer-400 bg-clip-text text-transparent">
                الصقر
              </span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-2.5 bg-sand-300/60 sm:bottom-2 sm:h-3 dark:bg-sand-500/30" />
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink-700/80 sm:mt-5 sm:text-lg sm:leading-8 lg:mx-0 dark:text-ink-50/70">
            خيام، كراسي، طاولات، إضاءة وكل تجهيزات الرحلات البرية — بجودة
            عالية وسعر يناسبك.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:mt-8 sm:gap-3 lg:justify-start">
            <Link to="/products" className="btn-primary !px-4 !py-2.5 text-sm sm:!px-5 sm:!py-3 sm:text-base">
              تسوق الآن
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link to="/about" className="btn-outline !px-4 !py-2.5 text-sm sm:!px-5 sm:!py-3 sm:text-base">
              تعرّف علينا
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs sm:max-w-lg lg:max-w-none">
          <div className="relative aspect-square">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-saqer shadow-2xl shadow-saqer-900/30" />
            <div className="absolute inset-0 rounded-[2rem] bg-topo-pattern opacity-50 mix-blend-overlay" />

            <div className="absolute inset-3 overflow-hidden rounded-[1.5rem] bg-black/10 sm:inset-4 sm:rounded-[1.6rem]">
              <img
                src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200&auto=format&fit=crop"
                alt="خيمة في الصحراء"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-saqer-900/60 via-transparent to-transparent" />
            </div>

            <div className="absolute -right-3 top-6 hidden animate-float rounded-2xl border border-white/20 bg-white/90 p-2.5 shadow-xl backdrop-blur sm:flex sm:p-3 lg:-right-4 lg:top-10 dark:bg-ink-900/90">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-saqer-600 text-white">
                  <TentTree className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <div className="text-xs text-ink-700/60 dark:text-ink-50/60">
                    خيام مقاومة
                  </div>
                  <div className="text-sm font-black text-ink-900 dark:text-white">
                    للماء والرياح
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute -left-3 bottom-10 hidden animate-float rounded-2xl border border-white/20 bg-white/90 p-2.5 shadow-xl backdrop-blur sm:flex sm:p-3 lg:-left-4 lg:bottom-14 dark:bg-ink-900/90"
              style={{ animationDelay: '1.2s' }}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-sand-500 text-white">
                  <Compass className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <div className="text-xs text-ink-700/60 dark:text-ink-50/60">
                    توصيل موثوق
                  </div>
                  <div className="text-sm font-black text-ink-900 dark:text-white">
                    لكل المحافظات
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
