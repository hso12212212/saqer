import { Link } from 'react-router-dom';

export default function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2 sm:gap-2.5">
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-black tracking-tight text-ink-900 sm:text-xl dark:text-white">
            الصقر
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-saqer-600 sm:text-[10px] dark:text-saqer-300">
            AL&nbsp;SAQER
          </span>
        </span>
      )}
    </Link>
  );
}
