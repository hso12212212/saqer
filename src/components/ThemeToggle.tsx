import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
      title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
      className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg
                 border border-ink-100 bg-white text-ink-700 transition-colors
                 hover:bg-saqer-50 hover:text-saqer-700 sm:h-10 sm:w-10 sm:rounded-xl
                 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50 dark:hover:bg-ink-800"
    >
      <Sun
        className={`absolute h-4 w-4 transition-all duration-300 sm:h-5 sm:w-5 ${
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 sm:h-5 sm:w-5 ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`}
      />
    </button>
  );
}
