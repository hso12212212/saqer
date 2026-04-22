import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn(
    '⚠️  DATABASE_URL غير معرّف. أضفه في .env أو متغيرات Railway.',
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway')
    ? { rejectUnauthorized: false }
    : false,
});

export const query = (text, params) => pool.query(text, params);
