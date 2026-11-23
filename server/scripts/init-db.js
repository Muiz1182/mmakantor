import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

async function init() {
  const defaultUrl = 'postgresql://postgres:postgres@localhost:5432/postgres';
  console.log('Mencoba menyambung ke default database postgres...');
  const client = new Client({ connectionString: defaultUrl });

  try {
    await client.connect();
    console.log('✅ Berhasil menyambung ke PostgreSQL!');

    const res = await client.query("SELECT datname FROM pg_database WHERE datname='kantor_mma'");
    if (res.rows.length === 0) {
      console.log('Membuat database kantor_mma...');
      await client.query('CREATE DATABASE kantor_mma');
      console.log('✅ Database kantor_mma berhasil dibuat!');
    } else {
      console.log('ℹ️ Database kantor_mma sudah ada.');
    }
  } catch (err) {
    console.log('⚠️ Info koneksi default postgres:postgres :', err.message);
  } finally {
    try { await client.end(); } catch (_) {}
  }
}

init();
