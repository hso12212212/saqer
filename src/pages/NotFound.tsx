import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-saqer grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <div className="text-8xl font-black text-saqer-600 dark:text-saqer-400">
          404
        </div>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">
          الصفحة غير موجودة
        </h1>
        <p className="mt-2 text-ink-700/70 dark:text-ink-50/60">
          ربما تاهت في الصحراء — لا تقلق، سنرشدك للعودة.
        </p>
        <Link to="/" className="mt-6 inline-flex btn-primary">
          <Home className="h-4 w-4" />
          العودة للرئيسية
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
