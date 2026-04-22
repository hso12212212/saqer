import { Award, Leaf, Target, Users } from 'lucide-react';

const values = [
  {
    icon: Award,
    title: 'جودة لا تتنازل عنها',
    desc: 'كل منتج في الصقر يمر بفحص دقيق قبل وصوله إليك.',
  },
  {
    icon: Users,
    title: 'مجتمع من المغامرين',
    desc: 'نسعى لبناء مجتمع شغوف بالرحلات والطبيعة.',
  },
  {
    icon: Leaf,
    title: 'صديق للبيئة',
    desc: 'نختار منتجات تحترم الطبيعة ولا تُرهقها.',
  },
  {
    icon: Target,
    title: 'هدفنا رضاك',
    desc: 'نقدم دعم متواصل قبل وبعد الشراء لضمان تجربة مثالية.',
  },
];

export default function About() {
  return (
    <div className="container-saqer py-10 sm:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <span className="chip bg-saqer-100 text-saqer-800 dark:bg-saqer-900/40 dark:text-saqer-200">
          من نحن
        </span>
        <h1 className="mt-4 text-balance text-3xl font-black leading-tight sm:text-5xl">
          قصتنا بدأت من{' '}
          <span className="bg-gradient-to-l from-saqer-600 to-saqer-400 bg-clip-text text-transparent">
            شغف الطبيعة
          </span>
        </h1>
        <p className="mt-4 text-sm leading-7 text-ink-700/80 sm:text-lg sm:leading-8 dark:text-ink-50/70">
          في متجر الصقر، نؤمن أن المغامرة حق للجميع. نوفر تجهيزات تخييم عالية
          الجودة بأسعار مناسبة وتوصيل موثوق. اختر ما يناسب رحلتك القادمة وابدأ
          مغامرتك بثقة.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
        {values.map((v) => (
          <div
            key={v.title}
            className="card p-5 transition-all hover:-translate-y-1 hover:shadow-glow sm:p-6"
          >
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-saqer text-white shadow-glow sm:mb-4 sm:h-12 sm:w-12">
              <v.icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-base font-black sm:text-lg">{v.title}</h3>
            <p className="mt-2 text-xs leading-6 text-ink-700/70 sm:text-sm sm:leading-7 dark:text-ink-50/60">
              {v.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
