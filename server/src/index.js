import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool, query } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',')
      : '*',
  }),
);
app.use(express.json({ limit: '1mb' }));

const toCamel = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  category: row.category,
  price: Number(row.price),
  oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
  image: row.image,
  rating: Number(row.rating),
  reviews: Number(row.reviews),
  stock: Number(row.stock),
  isNew: row.is_new,
  isBestSeller: row.is_best_seller,
  description: row.description,
  features: row.features ?? [],
  colors: row.colors ?? [],
});

app.get('/api/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
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
      clauses.push(
        `(name ILIKE $${params.length} OR description ILIKE $${params.length})`,
      );
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
    const { rows } = await query('SELECT * FROM products WHERE slug = $1', [
      req.params.slug,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'المنتج غير موجود' });
    }
    res.json(toCamel(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل جلب المنتج' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerAddress,
      notes,
      items,
      subtotal,
      shipping,
      total,
    } = req.body ?? {};

    if (!customerName || !customerPhone || !customerAddress || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'بيانات الطلب غير مكتملة' });
    }

    const { rows } = await query(
      `INSERT INTO orders (
        customer_name, customer_phone, customer_address, notes,
        items, subtotal, shipping, total
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, created_at`,
      [
        customerName,
        customerPhone,
        customerAddress,
        notes ?? null,
        JSON.stringify(items),
        subtotal ?? 0,
        shipping ?? 0,
        total ?? 0,
      ],
    );

    res.status(201).json({ id: rows[0].id, createdAt: rows[0].created_at });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل إنشاء الطلب' });
  }
});

app.get('/', (_req, res) => {
  res.json({
    name: 'Al Saqer API',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/products',
      'GET /api/products/:slug',
      'POST /api/orders',
    ],
  });
});

app.listen(PORT, () => {
  console.log(`🦅 الصقر API يعمل على المنفذ ${PORT}`);
});

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
