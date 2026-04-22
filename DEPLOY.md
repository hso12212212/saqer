# 🚀 دليل رفع متجر الصقر إلى GitHub و Railway

هذا الدليل يشرح خطوة بخطوة كيفية:
1. رفع المشروع إلى **GitHub**
2. إنشاء قاعدة بيانات **PostgreSQL** على **Railway**
3. نشر **الـ Backend** (Express API)
4. نشر **الفرونت-إند** (React + Vite)

---

## 📦 المتطلبات

- حساب على [GitHub](https://github.com)
- حساب على [Railway](https://railway.app) (سجّل بـ GitHub مباشرة)
- تثبيت **Git** على جهازك: [git-scm.com](https://git-scm.com/downloads)

---

## 1️⃣ رفع المشروع إلى GitHub

### أ. إنشاء مستودع جديد
1. افتح [github.com/new](https://github.com/new).
2. اسم المستودع: `al-saqer`
3. **لا تضف** `README` أو `.gitignore` (موجودان بالفعل).
4. اضغط **Create repository**.

### ب. رفع المشروع من الجهاز
افتح PowerShell داخل مجلد المشروع ثم:

```powershell
git init
git branch -M main
git add .
git commit -m "initial: متجر الصقر — واجهة + API"
git remote add origin https://github.com/<اسم-حسابك>/al-saqer.git
git push -u origin main
```

> استبدل `<اسم-حسابك>` باسم مستخدم GitHub الخاص بك.

---

## 2️⃣ إنشاء قاعدة بيانات PostgreSQL على Railway

1. ادخل [railway.app/new](https://railway.app/new).
2. اختر **Deploy PostgreSQL** → سيتم إنشاء قاعدة البيانات خلال ثوانٍ.
3. اضغط على الـ PostgreSQL service → تبويب **Variables**.
4. انسخ قيمة `DATABASE_URL` (تبدأ بـ `postgresql://...`).

---

## 3️⃣ نشر الـ Backend على Railway

### أ. إضافة خدمة جديدة من GitHub
1. داخل نفس المشروع على Railway، اضغط **+ New** → **GitHub Repo**.
2. اختر مستودع `al-saqer` الذي رفعته.
3. Railway سيرصد الـ repo — اضغط **Deploy**.

### ب. تحديد مجلد الـ Backend
1. ادخل إلى الـ service الجديد → **Settings**.
2. في خانة **Root Directory** ضع: `server`
3. احفظ التعديلات.

### ج. إضافة متغيرات البيئة
في تبويب **Variables** أضف:

| المفتاح         | القيمة                                    |
| --------------- | ----------------------------------------- |
| `DATABASE_URL`  | انسخها من Postgres service (أو اربطها تلقائياً) |
| `FRONTEND_URL`  | `*` مؤقتاً، وبعد نشر الفرونت ضع رابطه      |
| `PORT`          | `3000`                                    |

> **ربط DATABASE_URL تلقائياً:** داخل Variables اضغط **+ New Variable** ثم **Add Reference** → اختر `Postgres.DATABASE_URL`.

### د. إعدادات النشر (تلقائية)
الملف `server/railway.json` يحتوي على:
```json
{
  "deploy": {
    "startCommand": "npm run setup && npm start"
  }
}
```
هذا الأمر سيقوم تلقائياً بـ:
1. إنشاء الجداول (`migrate`)
2. إدخال المنتجات الابتدائية (`seed`)
3. تشغيل السيرفر

### هـ. الحصول على رابط الـ API
1. في تبويب **Settings** → **Networking** → **Generate Domain**.
2. سيعطيك رابط مثل: `https://al-saqer-server.up.railway.app`.
3. جرّب `https://<رابطك>/api/health` — يجب أن ترى `{"ok": true, "db": "connected"}`.

---

## 4️⃣ نشر الفرونت-إند على Railway

### أ. إضافة خدمة للفرونت
1. داخل نفس المشروع على Railway، اضغط **+ New** → **GitHub Repo** → `al-saqer`.
2. ادخل إلى الـ service الجديد → **Settings**.
3. **Root Directory:** اتركه فارغاً (أو `/`).
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `npx serve -s dist -l $PORT`

### ب. إضافة متغير بيئة للـ API
في **Variables** أضف:

| المفتاح           | القيمة                                      |
| ----------------- | ------------------------------------------- |
| `VITE_API_URL`    | رابط الـ Backend الذي حصلت عليه (خطوة 3-هـ) |

### ج. إضافة `serve` كـ dependency (اختياري)
لتبسيط الأمور، شغّل محلياً:
```powershell
npm install --save-dev serve
git add . ; git commit -m "add: serve for static hosting" ; git push
```
أو استبدل `Start Command` بـ:
```
npx --yes serve -s dist -l $PORT
```

### د. الحصول على رابط الموقع
1. **Settings** → **Networking** → **Generate Domain**.
2. الرابط سيكون شيء مثل: `https://al-saqer.up.railway.app`.
3. ارجع إلى service الـ Backend وحدّث `FRONTEND_URL` بهذا الرابط.

---

## 5️⃣ تجربة محلية قبل النشر (اختياري)

### تشغيل الـ Backend محلياً
```powershell
cd server
Copy-Item .env.example .env
# حرّر .env وضع DATABASE_URL (يمكنك استخدام Postgres من Railway أو محلي)
npm install
npm run setup
npm run dev
```

### تشغيل الفرونت-إند
```powershell
# في نافذة أخرى، داخل جذر المشروع
Copy-Item .env.example .env
# تأكد أن VITE_API_URL=http://localhost:3000
npm run dev
```

افتح [http://localhost:5173](http://localhost:5173) — ستحصل على المتجر بالكامل مع البيانات من قاعدة البيانات!

---

## 📡 مخطط النهائي

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  Vite/React  │  HTTP  │  Express API │  SQL   │  PostgreSQL  │
│   (Railway)  │ ─────> │   (Railway)  │ ─────> │   (Railway)  │
└──────────────┘        └──────────────┘        └──────────────┘
      ↑                         ↑                       ↑
      └─────── كلهم في نفس مشروع Railway واحد ──────────┘
```

---

## 🧪 اختبار الـ API

بعد نشر الـ Backend جرّب هذه الروابط في المتصفح:

| المسار                         | النتيجة المتوقّعة                  |
| ------------------------------ | ----------------------------------- |
| `GET /api/health`              | `{"ok": true, "db": "connected"}`   |
| `GET /api/products`            | مصفوفة بكل المنتجات                 |
| `GET /api/products/:slug`      | بيانات منتج واحد                     |
| `POST /api/orders`             | إنشاء طلب جديد                      |

---

## ⚙️ إدارة قاعدة البيانات

للدخول على Postgres من Railway:
1. PostgreSQL service → تبويب **Data**.
2. تستطيع تنفيذ SQL مباشرة من المتصفح.

مثال لعرض كل الطلبات:
```sql
SELECT id, customer_name, total, status, created_at
FROM orders
ORDER BY created_at DESC;
```

---

## 🆘 حلول لمشاكل شائعة

| المشكلة                                     | الحل                                              |
| -------------------------------------------- | -------------------------------------------------- |
| `DATABASE_URL غير معرّف`                    | تأكد من إضافة المتغير في Railway Variables         |
| `CORS error` في المتصفح                     | حدّث `FRONTEND_URL` في Backend بالدومين الصحيح     |
| الصور لا تظهر                                | تحقق من روابط Unsplash أو استبدلها بصور محلية     |
| `404 Not Found` لكل الصفحات بعد تحديث        | أضف ملف `public/_redirects` = `/* /index.html 200` |

---

## 🦅 انتهيت!

مبروك! متجر الصقر الآن حي على الإنترنت مع قاعدة بيانات كاملة.

**تم التطوير بواسطة: حسين سعد**
