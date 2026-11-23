import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/kantor_mma';

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 3000,
});

pool.on('connect', (client) => {
  client.query("SET client_encoding = 'UTF8'");
});

export const db = drizzle(pool, { schema });

// Helper untuk memeriksa status koneksi ke PostgreSQL
export async function checkDatabaseConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    client.release();
    return { connected: true, timestamp: res.rows[0].now };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
      hint: 'Pastikan PostgreSQL aktif di localhost:5432 dan database kantor_mma sudah dibuat.',
    };
  }
}
