import type { Category, Product } from '../types';

export const categories: { key: Category; label: string; desc: string; emoji: string }[] = [
  { key: 'خيام', label: 'الخيام', desc: 'خيام عائلية ومتينة لكل الأجواء', emoji: '⛺' },
  { key: 'كراسي', label: 'الكراسي', desc: 'كراسي مريحة قابلة للطي', emoji: '🪑' },
  { key: 'طاولات', label: 'الطاولات', desc: 'طاولات خفيفة وعملية', emoji: '🪵' },
  { key: 'إضاءة', label: 'الإضاءة', desc: 'فوانيس وإضاءات ليلية', emoji: '🏮' },
  { key: 'طبخ', label: 'الطبخ', desc: 'مواقد وأدوات الطهي', emoji: '🔥' },
  { key: 'نوم', label: 'النوم', desc: 'حقائب نوم ومراتب', emoji: '🛏️' },
  { key: 'إكسسوارات', label: 'إكسسوارات', desc: 'لوازم ومكملات الرحلة', emoji: '🎒' },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'خيمة الصقر العائلية 6 أشخاص',
    slug: 'saqer-family-tent-6',
    category: 'خيام',
    price: 450000,
    oldPrice: 560000,
    image:
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&auto=format&fit=crop',
    rating: 4.8,
    reviews: 214,
    stock: 18,
    isBestSeller: true,
    description:
      'خيمة فسيحة مقاومة للماء والرياح بتصميم جذاب، تتسع حتى 6 أشخاص بكل راحة مع تهوية ممتازة ونوافذ شبكية.',
    features: [
      'مقاومة للماء حتى 3000mm',
      'هيكل فايبرجلاس متين',
      'تهوية مزدوجة',
      'حقيبة حمل مع إعداد سريع',
    ],
    colors: ['#064e3b', '#d97706', '#1f2937'],
  },
  {
    id: 'p2',
    name: 'كرسي الرحالة القابل للطي',
    slug: 'camp-chair-rahhala',
    category: 'كراسي',
    price: 65000,
    oldPrice: 85000,
    image:
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=900&auto=format&fit=crop',
    rating: 4.7,
    reviews: 482,
    stock: 60,
    isBestSeller: true,
    description:
      'كرسي خفيف الوزن قابل للطي بإطار ألمنيوم قوي، مثالي لكل مغامرة — خفيف، مريح، وسريع الفرد.',
    features: ['حمولة حتى 130 كجم', 'وزن 1.3 كجم فقط', 'جيب جانبي للمشروبات', 'حقيبة حمل'],
    colors: ['#064e3b', '#111827', '#b45309'],
  },
  {
    id: 'p3',
    name: 'طاولة تخييم ألمنيوم قابلة للطي',
    slug: 'foldable-aluminum-table',
    category: 'طاولات',
    price: 85000,
    image:
      'https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?w=900&auto=format&fit=crop',
    rating: 4.6,
    reviews: 129,
    stock: 40,
    isNew: true,
    description:
      'طاولة متعددة الاستخدامات تتحمل حتى 40 كجم، تُطوى إلى حجم حقيبة صغيرة وسهلة التنظيف.',
    features: ['إطار ألمنيوم', 'أرجل قابلة للتعديل', 'سطح مقاوم للخدش', 'حقيبة تخزين'],
  },
  {
    id: 'p4',
    name: 'فانوس LED قابل للشحن',
    slug: 'led-lantern-rechargeable',
    category: 'إضاءة',
    price: 45000,
    oldPrice: 55000,
    image:
      'https://images.unsplash.com/photo-1521405617584-1d9a1f3b6774?w=900&auto=format&fit=crop',
    rating: 4.9,
    reviews: 640,
    stock: 120,
    description:
      'فانوس LED قوي 500 لومن بـ 4 أوضاع إضاءة، شحن USB-C، ويعمل كبنك طاقة للطوارئ.',
    features: ['500 لومن', 'بطارية 4000mAh', 'شحن USB-C', 'مقاوم للماء IPX4'],
  },
  {
    id: 'p5',
    name: 'موقد غاز محمول الصقر',
    slug: 'portable-gas-stove',
    category: 'طبخ',
    price: 105000,
    image:
      'https://images.unsplash.com/photo-1472152083436-a6b5b8281f50?w=900&auto=format&fit=crop',
    rating: 4.5,
    reviews: 98,
    stock: 25,
    isNew: true,
    description:
      'موقد غاز مزدوج الشعلة محمول، يعمل بكفاءة عالية في جميع الظروف الجوية. سهل النقل والاستخدام.',
    features: ['شعلتان قويتان', 'إشعال أوتوماتيكي', 'جسم مقاوم للصدأ', 'حقيبة حمل متينة'],
  },
  {
    id: 'p6',
    name: 'حقيبة نوم حرارية -5°',
    slug: 'thermal-sleeping-bag',
    category: 'نوم',
    price: 125000,
    oldPrice: 150000,
    image:
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=900&auto=format&fit=crop',
    rating: 4.8,
    reviews: 305,
    stock: 35,
    isBestSeller: true,
    description:
      'حقيبة نوم بعزل حراري ممتاز تناسب درجات الحرارة حتى -5°م، داخلية قطنية ناعمة وجسم خارجي مقاوم.',
    features: ['مقاومة حتى -5°م', 'داخلية قطنية', 'سحاب مزدوج', 'حقيبة ضغط'],
  },
  {
    id: 'p7',
    name: 'خيمة شخصية سريعة النصب',
    slug: 'pop-up-solo-tent',
    category: 'خيام',
    price: 175000,
    image:
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&auto=format&fit=crop',
    rating: 4.4,
    reviews: 77,
    stock: 22,
    description:
      'خيمة فردية تنصب خلال ثوانٍ، خفيفة الوزن جداً ومثالية للمشي الجبلي والمغامرات الفردية.',
    features: ['نصب بثانية واحدة', 'وزن 1.8 كجم', 'مقاومة للماء', 'تهوية علوية'],
  },
  {
    id: 'p8',
    name: 'ثلاجة يد كبيرة 45 لتر',
    slug: 'cooler-box-45l',
    category: 'إكسسوارات',
    price: 135000,
    image:
      'https://images.unsplash.com/photo-1530819568329-97653eafbbfa?w=900&auto=format&fit=crop',
    rating: 4.6,
    reviews: 156,
    stock: 30,
    description:
      'ثلاجة يد عازلة سعة 45 لتر تحافظ على البرودة حتى 48 ساعة، مقابض معدنية وعجلات للحمل.',
    features: ['سعة 45 لتر', 'عزل 48 ساعة', 'عجلات للحمل', 'فتّاحة داخلية'],
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getProductsByCategory = (cat: Category) =>
  products.filter((p) => p.category === cat);
