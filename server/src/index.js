import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pool, query } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const DIST_DIR = path.join(ROOT, 'dist');
const UPLOADS_DIR = path.join(ROOT, 'public', 'uploads', 'products');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hswnbrys@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12341234hh';
const JWT_SECRET = process.env.JWT_SECRET || 'al-saqer-secret-change-me';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
/** منع تخزين مخرجات الـ API في الكاش (تجنّب ظهور منتجات قديمة/افتراضية بعد خروج ودخول المشرف) */
app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  next();
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = (path.extname(file.originalname || '') || '.jpg').toLowerCase();
      const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const extOut = allowed.includes(ext) ? ext : '.jpg';
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}${extOut}`;
      cb(null, name);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/i.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('يُقبل صور فقط: JPEG, PNG, WebP, GIF'));
    }
  },
});

function rowProductImages(row) {
  let arr = row.images;
  if (arr == null) return row.image ? [row.image] : [];
  if (typeof arr === 'string') {
    try {
      arr = JSON.parse(arr);
    } catch {
      return row.image ? [row.image] : [];
    }
  }
  if (!Array.isArray(arr)) return row.image ? [row.image] : [];
  const out = arr.map((s) => String(s).trim()).filter(Boolean).slice(0, 5);
  if (out.length > 0) return out;
  return row.image ? [row.image] : [];
}

const toCamel = (row) => {
  const images = rowProductImages(row);
  const image = images[0] || row.image || '';
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    image,
    images: images.length > 0 ? images : image ? [image] : [],
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    stock: Number(row.stock),
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
    description: row.description,
    features: row.features ?? [],
    colors: row.colors ?? [],
  };
};

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'غير مصرح' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload?.admin) return res.status(403).json({ error: 'ليست صلاحية مشرف' });
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: 'الجلسة غير صالحة' });
  }
}

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'البريد وكلمة المرور مطلوبان' });
  }
  if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'البريد أو كلمة المرور غير صحيحة' });
  }
  const token = jwt.sign({ admin: true, email: ADMIN_EMAIL }, JWT_SECRET, {
    expiresIn: '30d',
  });
  res.json({ token, email: ADMIN_EMAIL });
});

app.get('/api/auth/me', requireAdmin, (req, res) => {
  res.json({ admin: true, email: req.admin.email });
});

app.get('/api/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/categories', async (_req, res) => {
  try {
    const { rows } = await query(
      'SELECT key, label, emoji, description, image FROM categories ORDER BY created_at ASC',
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل جلب الفئات' });
  }
});

app.get('/api/categories/:key', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT key, label, emoji, description, image FROM categories WHERE key = $1',
      [req.params.key],
    );
    if (rows.length === 0) return res.status(404).json({ error: 'الفئة غير موجودة' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل جلب الفئة' });
  }
});

app.post('/api/admin/categories', requireAdmin, async (req, res) => {
  try {
    const { key, label, emoji, description, image } = req.body ?? {};
    if (!key || !label) return res.status(400).json({ error: 'key و label مطلوبان' });
    await query(
      `INSERT INTO categories (key, label, emoji, description, image)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (key) DO UPDATE SET
         label = EXCLUDED.label,
         emoji = EXCLUDED.emoji,
         description = EXCLUDED.description,
         image = EXCLUDED.image`,
      [key, label, emoji ?? '📦', description ?? null, image ?? null],
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل حفظ الفئة' });
  }
});

app.delete('/api/admin/categories/:key', requireAdmin, async (req, res) => {
  try {
    const inUse = await query('SELECT COUNT(*)::int AS c FROM products WHERE category = $1', [
      req.params.key,
    ]);
    if (inUse.rows[0].c > 0) {
      return res.status(400).json({ error: 'لا يمكن حذف فئة بها منتجات' });
    }
    await query('DELETE FROM categories WHERE key = $1', [req.params.key]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل حذف الفئة' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { category, q } = req.query;
    const clauses = [];
    const params = [];
    if (category) {
      params.push(category);
      clauses.push(`category = $${params.length}`);
    }
    if (q) {
      params.push(`%${q}%`);
      clauses.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await query(
      `SELECT * FROM products ${where} ORDER BY is_best_seller DESC, created_at DESC`,
      params,
    );
    res.json(result.rows.map(toCamel));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل جلب المنتجات' });
  }
});

app.get('/api/products/:slug', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM products WHERE slug = $1', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'المنتج غير موجود' });
    res.json(toCamel(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل جلب المنتج' });
  }
});

function productFromBody(body) {
  const fromList = Array.isArray(body.images)
    ? body.images.map((s) => String(s).trim()).filter(Boolean).slice(0, 5)
    : [];
  const single = body.image != null && body.image !== '' ? String(body.image).trim() : '';
  const images = fromList.length > 0 ? fromList : single ? [single] : [];
  const image = images[0] || '';
  return {
    id: body.id,
    name: body.name,
    slug: body.slug,
    category: body.category,
    price: Number(body.price),
    old_price: body.oldPrice != null && body.oldPrice !== '' ? Number(body.oldPrice) : null,
    image,
    images,
    rating: body.rating != null ? Number(body.rating) : 0,
    reviews: body.reviews != null ? Number(body.reviews) : 0,
    stock: body.stock != null ? Number(body.stock) : 0,
    is_new: !!body.isNew,
    is_best_seller: !!body.isBestSeller,
    description: body.description ?? '',
    features: Array.isArray(body.features) ? body.features : [],
    colors: Array.isArray(body.colors) ? body.colors : [],
  };
}

app.post('/api/admin/products', requireAdmin, async (req, res) => {
  try {
    const p = productFromBody(req.body);
    if (!p.id) p.id = `p_${Date.now()}`;
    if (!p.name || !p.slug || !p.category || !p.price || !p.image) {
      return res.status(400).json({ error: 'بيانات المنتج ناقصة' });
    }
    await query(
      `INSERT INTO products (
        id, name, slug, category, price, old_price, image,
        rating, reviews, stock, is_new, is_best_seller,
        description, features, colors, images
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [
        p.id, p.name, p.slug, p.category, p.price, p.old_price, p.image,
        p.rating, p.reviews, p.stock, p.is_new, p.is_best_seller,
        p.description, JSON.stringify(p.features), JSON.stringify(p.colors),
        JSON.stringify(p.images.length > 0 ? p.images : [p.image]),
      ],
    );
    res.status(201).json({ id: p.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'فشل إضافة المنتج' });
  }
});

app.put('/api/admin/products/:id', requireAdmin, async (req, res) => {
  try {
    const p = productFromBody(req.body);
    const { rowCount } = await query(
      `UPDATE products SET
        name=$1, slug=$2, category=$3, price=$4, old_price=$5, image=$6,
        rating=$7, reviews=$8, stock=$9, is_new=$10, is_best_seller=$11,
        description=$12, features=$13, colors=$14, images=$15
       WHERE id=$16`,
      [
        p.name, p.slug, p.category, p.price, p.old_price, p.image,
        p.rating, p.reviews, p.stock, p.is_new, p.is_best_seller,
        p.description, JSON.stringify(p.features), JSON.stringify(p.colors),
        JSON.stringify(p.images.length > 0 ? p.images : [p.image]),
        req.params.id,
      ],
    );
    if (rowCount === 0) return res.status(404).json({ error: 'المنتج غير موجود' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'فشل تحديث المنتج' });
  }
});

app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
  try {
    const { rowCount } = await query('DELETE FROM products WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'المنتج غير موجود' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل حذف المنتج' });
  }
});

const orderToCamel = (row) => ({
  id: row.id,
  customerName: row.customer_name,
  customerPhone: row.customer_phone,
  customerAddress: row.customer_address,
  governorate: row.governorate ?? null,
  notes: row.notes ?? null,
  items: row.items ?? [],
  subtotal: Number(row.subtotal),
  shipping: Number(row.shipping),
  total: Number(row.total),
  status: row.status,
  createdAt: row.created_at,
});

app.get('/api/admin/orders', requireAdmin, async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 500');
    res.json(rows.map(orderToCamel));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل جلب الطلبات' });
  }
});

app.get('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'الطلب غير موجود' });
    res.json(orderToCamel(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل جلب الطلب' });
  }
});

app.patch('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body ?? {};
    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'حالة غير صالحة' });
    }
    const { rowCount } = await query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      [status, req.params.id],
    );
    if (rowCount === 0) return res.status(404).json({ error: 'الطلب غير موجود' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل تحديث الحالة' });
  }
});

app.delete('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { rowCount } = await query('DELETE FROM orders WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'الطلب غير موجود' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل حذف الطلب' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const {
      customerName, customerPhone, customerAddress, governorate, notes,
      items, subtotal, shipping, total,
    } = req.body ?? {};

    if (!customerName || !customerPhone || !customerAddress || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'بيانات الطلب غير مكتملة' });
    }

    const { rows } = await query(
      `INSERT INTO orders (
        customer_name, customer_phone, customer_address, governorate, notes,
        items, subtotal, shipping, total
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, created_at, status`,
      [
        customerName, customerPhone, customerAddress, governorate ?? null, notes ?? null,
        JSON.stringify(items), subtotal ?? 0, shipping ?? 0, total ?? 0,
      ],
    );

    res.status(201).json({
      id: rows[0].id,
      createdAt: rows[0].created_at,
      status: rows[0].status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل إنشاء الطلب' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'الطلب غير موجود' });
    const { phone } = req.query;
    const row = rows[0];
    if (phone && String(phone).trim() !== row.customer_phone) {
      return res.status(403).json({ error: 'رقم الهاتف غير مطابق' });
    }
    res.json(orderToCamel(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل جلب الطلب' });
  }
});

app.post('/api/admin/upload', requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'حجم الصورة كبير (الحد 5 ميجا بايت)' });
      }
      return res.status(400).json({ error: err?.message || 'فشل رفع الملف' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'اختر صورة من الاستديو' });
    }
    res.json({ url: `/uploads/products/${req.file.filename}` });
  });
});

app.use('/uploads', express.static(path.join(ROOT, 'public', 'uploads')));

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (_req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));
  console.log(`🌐 يتم تقديم الواجهة من: ${DIST_DIR}`);
} else {
  app.get('/', (_req, res) => {
    res.json({ name: 'Al Saqer API', version: '1.1.0', note: 'dist not built' });
  });
}

async function autoSetup() {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL غير معرّف، تم تجاوز الإعداد التلقائي.');
    return;
  }
  try {
    console.log('🚧 تطبيق الـ schema ...');
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await query(sql);

    try {
      await query(
        `UPDATE products
         SET images = jsonb_build_array(image)
         WHERE coalesce(jsonb_array_length(images), 0) = 0`,
      );
    } catch (e) {
      /* عمود images قد يكون جديداً */
    }

    const { rows: catCount } = await query('SELECT COUNT(*)::int AS c FROM categories');
    if (catCount[0].c === 0) {
      const { categoriesSeed } = await import('./seed-data.js');
      for (const c of categoriesSeed) {
        await query(
          `INSERT INTO categories (key, label, emoji, description) VALUES ($1,$2,$3,$4) ON CONFLICT (key) DO NOTHING`,
          [c.key, c.label, c.emoji, c.description],
        );
      }
      console.log(`✅ أُدخلت ${categoriesSeed.length} فئة.`);
    }

    const { rows: count } = await query('SELECT COUNT(*)::int AS c FROM products');
    if (count[0].c === 0) {
      console.log('🌱 إدخال المنتجات الابتدائية ...');
      const { products } = await import('./seed-data.js');
      for (const p of products) {
        await query(
          `INSERT INTO products (
            id, name, slug, category, price, old_price, image,
            rating, reviews, stock, is_new, is_best_seller,
            description, features, colors, images
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
          ON CONFLICT (id) DO NOTHING`,
          [
            p.id, p.name, p.slug, p.category, p.price, p.old_price, p.image,
            p.rating, p.reviews, p.stock, p.is_new, p.is_best_seller,
            p.description, JSON.stringify(p.features), JSON.stringify(p.colors),
            JSON.stringify([p.image]),
          ],
        );
      }
      console.log(`✅ أُدخل ${products.length} منتج.`);
    }
  } catch (err) {
    console.error('⚠️  فشل الإعداد التلقائي:', err.message);
  }
}

app.listen(PORT, async () => {
  console.log(`🦅 الصقر يعمل على المنفذ ${PORT}`);
  console.log(`👤 بريد المشرف: ${ADMIN_EMAIL}`);
  await autoSetup();
});

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
