# 🦅 متجر الصقر | Al Saqer Store

متجر إلكتروني عربي لتجهيزات التخييم والرحلات البرية — خيام، كراسي، طاولات،
إضاءة، أدوات طبخ، وكل لوازم المغامرة. تصميم فريد متجاوب مع وضع داكن كامل.

> تم التطوير بواسطة **حسين سعد**

## 🧱 التقنيات

### الفرونت-إند
- **React 19** + **TypeScript**
- **Vite** كأداة بناء
- **Tailwind CSS v3** (وضع داكن `class`)
- **React Router DOM v6**
- **Lucide React** للأيقونات
- **Tajawal Font**

### الباك-إند
- **Node.js** + **Express**
- **PostgreSQL** (عبر `pg`)
- **Railway** للنشر

## 📁 هيكل المشروع

```
al-saqer/
├── src/                 # الفرونت-إند (Vite + React)
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── lib/
│   ├── pages/
│   └── ...
├── server/              # الباك-إند (Express + pg)
│   ├── src/
│   │   ├── index.js     # نقطة الدخول
│   │   ├── db.js        # pool PostgreSQL
│   │   ├── schema.sql   # الـ migrations
│   │   ├── migrate.js
│   │   ├── seed.js
│   │   └── seed-data.js
│   └── package.json
├── DEPLOY.md            # دليل النشر على Railway
└── README.md
```

## 🚀 التشغيل السريع

### 1) الفرونت-إند
```powershell
npm install
npm run dev
```
افتح [http://localhost:5173](http://localhost:5173).

### 2) الباك-إند (اختياري)
```powershell
cd server
Copy-Item .env.example .env
# حرّر .env وضع DATABASE_URL
npm install
npm run setup   # إنشاء الجداول + إدخال البيانات
npm run dev
```
يعمل على [http://localhost:3000](http://localhost:3000).

### 3) ربط الفرونت بالـ API
```powershell
Copy-Item .env.example .env
# VITE_API_URL=http://localhost:3000
```

> بدون `VITE_API_URL`، يعمل الفرونت ببيانات محلية تلقائياً.

## ☁️ النشر على Railway

اقرأ [**DEPLOY.md**](./DEPLOY.md) للخطوات الكاملة.

## ✨ المميزات

- واجهة عربية RTL مع خط Tajawal
- وضع داكن/فاتح مع حفظ الاختيار
- لوحة ألوان مخصصة `الصقر` (أخضر زمردي + رمل)
- سلة تسوّق كاملة مع `localStorage`
- بحث وفلترة وفرز للمنتجات
- صفحة تفاصيل منتج مع ألوان ومميزات
- تصميم متجاوب جوال/تابلت/ديسكتوب
- أسعار **الدينار العراقي** مع تنسيق محلي
- API جاهز: منتجات + طلبات

## 🎨 لوحة الألوان `الصقر`

| الدرجة | القيمة     | الاستخدام         |
| ------ | ---------- | ----------------- |
| 500    | `#10b981`  | أساسي             |
| 600    | `#059669`  | أزرار             |
| 900    | `#064e3b`  | تدرّجات داكنة     |

مع `sand` للون الرمل و`ink` للخلفيات الداكنة.

## 📜 الرخصة

MIT © 2026 — حسين سعد
