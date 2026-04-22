import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/admin');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل تسجيل الدخول';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container-saqer min-h-[80vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-2xl bg-saqer-500/10 text-saqer-600 dark:text-saqer-400 grid place-items-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">تسجيل دخول المشرف</h1>
              <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400">
                مخصص لإدارة المتجر فقط
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium mb-1 block">البريد الإلكتروني</span>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 py-2.5 pr-10 pl-3 text-sm outline-none focus:ring-2 focus:ring-saqer-500/40"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium mb-1 block">كلمة المرور</span>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 py-2.5 pr-10 pl-3 text-sm outline-none focus:ring-2 focus:ring-saqer-500/40"
                  placeholder="••••••••"
                />
              </div>
            </label>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              دخول
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-ink-500 dark:text-ink-400">
            <Link to="/" className="link-underline">العودة للمتجر</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
