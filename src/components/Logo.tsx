import { Link } from 'react-router-dom';

export default function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-saqer shadow-glow transition-transform group-hover:-rotate-6">
        <svg
          viewBox="0 0 64 64"
          className="h-6 w-6"
          fill="none"
          stroke="white"
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path d="M32 10 L56 52 H8 Z" />
          <path d="M32 26 L46 52 H18 Z" fill="white" />
          <circle cx="32" cy="52" r="3" fill="#d97706" stroke="none" />
        </svg>
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-sand-500" />
      </span>

      {withText && (
        <span className="flex flex-col leading-none">
          <span className="text-xl font-black tracking-tight text-ink-900 dark:text-white">
            الصقر
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-saqer-600 dark:text-saqer-300">
            AL&nbsp;SAQER
          </span>
        </span>
      )}
    </Link>
  );
}
