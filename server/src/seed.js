import { pool } from './db.js';
import { products } from './seed-data.js';

async function seed() {
  console.log('🌱 بدء إدخال البيانات الابتدائية ...');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const p of products) {
      await client.query(
        `INSERT INTO products (
          id, name, slug, category, price, old_price, image,
          rating, reviews, stock, is_new, is_best_seller,
          description, features, colors
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          category = EXCLUDED.category,
          price = EXCLUDED.price,
          old_price = EXCLUDED.old_price,
          image = EXCLUDED.image,
          rating = EXCLUDED.rating,
          reviews = EXCLUDED.reviews,
          stock = EXCLUDED.stock,
          is_new = EXCLUDED.is_new,
          is_best_seller = EXCLUDED.is_best_seller,
          description = EXCLUDED.description,
          features = EXCLUDED.features,
          colors = EXCLUDED.colors`,
        [
          p.id,
          p.name,
          p.slug,
          p.category,
          p.price,
          p.old_price,
          p.image,
          p.rating,
          p.reviews,
          p.stock,
          p.is_new,
          p.is_best_seller,
          p.description,
          JSON.stringify(p.features),
          JSON.stringify(p.colors),
        ],
      );
    }

    await client.query('COMMIT');
    console.log(`✅ تم إدخال ${products.length} منتج بنجاح.`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('❌ فشل الـ seed:', err);
  process.exit(1);
});
