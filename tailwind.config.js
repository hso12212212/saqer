/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Tajawal"', 'system-ui', 'sans-serif'],
        display: ['"Tajawal"', 'system-ui', 'sans-serif'],
      },
      colors: {
        الصقر: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        saqer: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        sand: {
          50: '#fdf8ef',
          100: '#faefd9',
          200: '#f4dcaf',
          300: '#ecc37c',
          400: '#e3a148',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        ink: {
          50: '#f4f5f7',
          100: '#e5e7eb',
          200: '#d1d5db',
          300: '#9ca3af',
          400: '#6b7280',
          500: '#4b5563',
          600: '#374151',
          700: '#1f2937',
          800: '#111827',
          900: '#0b0f14',
          950: '#05080c',
        },
      },
      backgroundImage: {
        'hero-pattern':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%2310b981' stroke-opacity='0.12' stroke-width='1'%3E%3Cpath d='M30 0 L60 52 L0 52 Z'/%3E%3C/g%3E%3C/svg%3E\")",
        'topo-pattern':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23059669' stroke-opacity='0.08' stroke-width='1'%3E%3Ccircle cx='60' cy='60' r='10'/%3E%3Ccircle cx='60' cy='60' r='22'/%3E%3Ccircle cx='60' cy='60' r='36'/%3E%3Ccircle cx='60' cy='60' r='52'/%3E%3C/g%3E%3C/svg%3E\")",
        'gradient-saqer':
          'linear-gradient(135deg, #064e3b 0%, #047857 45%, #10b981 100%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(16,185,129,.25), 0 10px 40px -10px rgba(16,185,129,.45)',
        card: '0 6px 30px -12px rgba(6, 78, 59, .25)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shine: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fade-up .6s ease-out both',
        shine: 'shine 2.2s linear infinite',
      },
    },
  },
  plugins: [],
}
