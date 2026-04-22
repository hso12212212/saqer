import type { CSSProperties } from 'react';

export function Skeleton({
  className = '',
  style,
  rounded = 'rounded-xl',
}: {
  className?: string;
  style?: CSSProperties;
  rounded?: string;
}) {
  return (
    <div
      aria-hidden
      className={`shimmer ${rounded} ${className}`}
      style={style}
    />
  );
}

export function SkeletonText({
  lines = 1,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          rounded="rounded-md"
          className="h-3 w-full"
          style={i === lines - 1 && lines > 1 ? { width: '70%' } : undefined}
        />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <article className="flex h-full flex-col text-start" aria-hidden>
      <Skeleton rounded="rounded-none" className="aspect-[3/4] w-full" />
      <div className="mt-2 flex flex-1 flex-col gap-2 sm:mt-2.5">
        <Skeleton rounded="rounded-md" className="h-3 w-[85%]" />
        <Skeleton rounded="rounded-md" className="h-3 w-[60%]" />
        <div className="mt-auto space-y-2 pt-1.5 sm:pt-2">
          <Skeleton rounded="rounded-md" className="h-4 w-24" />
          <Skeleton rounded="rounded-lg" className="h-10 w-full" />
        </div>
      </div>
    </article>
  );
}

export function CategoryCircleSkeleton() {
  return (
    <div
      className="flex w-[4.75rem] shrink-0 flex-col items-center gap-2 sm:w-[5.75rem] sm:gap-2.5"
      aria-hidden
    >
      <Skeleton rounded="rounded-full" className="h-20 w-20 sm:h-24 sm:w-24" />
      <Skeleton rounded="rounded-md" className="h-3 w-[85%]" />
    </div>
  );
}

export function OrderRowSkeleton() {
  return (
    <div
      className="card flex items-start gap-3 border-ink-200 p-3 dark:border-ink-600 sm:p-4"
      aria-hidden
    >
      <Skeleton rounded="rounded-xl" className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-1.5">
          <Skeleton rounded="rounded-md" className="h-3.5 w-20" />
          <Skeleton rounded="rounded-full" className="h-3.5 w-14" />
        </div>
        <Skeleton rounded="rounded-md" className="h-3 w-[55%]" />
        <Skeleton rounded="rounded-md" className="h-3 w-[40%]" />
      </div>
      <div className="shrink-0 space-y-1.5 text-left">
        <Skeleton rounded="rounded-md" className="ml-auto h-4 w-16" />
        <Skeleton rounded="rounded-md" className="ml-auto h-2.5 w-10" />
      </div>
    </div>
  );
}

export function LineItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4" aria-hidden>
      <Skeleton className="h-16 w-16 shrink-0 sm:h-20 sm:w-20" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton rounded="rounded-md" className="h-4 w-[80%]" />
        <Skeleton rounded="rounded-md" className="h-3 w-[45%]" />
      </div>
      <Skeleton rounded="rounded-md" className="h-4 w-16 shrink-0" />
    </div>
  );
}

export function CenterSpinner({ label = 'جارٍ التحميل...' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-16 text-ink-500"
    >
      <div className="grid h-10 w-10 place-items-center">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-ink-200 border-t-saqer-600 dark:border-ink-700 dark:border-t-saqer-400" />
      </div>
      <span className="text-sm font-bold">{label}</span>
    </div>
  );
}
