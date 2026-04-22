import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 dark:border-ink-800">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-bl from-saqer-50/70 via-white to-sand-50/40 dark:from-ink-900 dark:via-ink-950 dark:to-ink-900" />
        <div className="absolute inset-0 bg-hero-pattern opacity-60" />
      </div>

      <div className="container-saqer py-4 sm:py-6">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-ink-100/80 bg-white/40 shadow-sm dark:border-ink-800 dark:bg-ink-900/40 sm:max-w-4xl sm:rounded-3xl">
          <div className="border-b border-ink-100/80 bg-white/80 px-4 py-3 text-center dark:border-ink-800 dark:bg-ink-950/80 sm:py-4">
            <h1 className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xl font-black leading-tight sm:text-2xl md:text-3xl">
              <span className="text-ink-700 dark:text-ink-50/90">متجر</span>
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-l from-saqer-600 to-saqer-400 bg-clip-text text-transparent">
                  الصقر
                </span>
                <span className="absolute inset-x-0 bottom-0.5 -z-0 h-1.5 bg-sand-300/60 dark:bg-sand-500/30 sm:bottom-1 sm:h-2" />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-saqer-600 sm:text-sm dark:text-saqer-300">
                AL&nbsp;SAQER
              </span>
            </h1>
          </div>

          <div className="relative aspect-[16/9] max-h-[220px] w-full sm:max-h-[320px] md:max-h-[380px]">
            <img
              src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1400&auto=format&fit=crop"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-ink-950/20" />
            <div className="absolute bottom-3 start-3 end-3 sm:bottom-4 sm:start-4 sm:end-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2 text-sm font-black text-ink-900 shadow-md backdrop-blur-sm transition hover:bg-saqer-600 hover:text-white dark:bg-ink-900/95 dark:text-ink-50 dark:hover:bg-saqer-600 dark:hover:text-white"
              >
                تصفح المنتجات
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
