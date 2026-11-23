import { pool } from './index.js';

export async function runMigration() {
  console.log('🔄 Memulai migrasi database PostgreSQL kantor_mma...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Tabel agents
    await client.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        nama TEXT NOT NULL,
        peran TEXT NOT NULL,
        zona TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'working',
        ruang_santai TEXT NOT NULL DEFAULT 'auto',
        urutan INTEGER NOT NULL DEFAULT 0,
        warna TEXT NOT NULL DEFAULT '#3b82f6',
        ringkasan TEXT,
        sedang_kerja TEXT,
        batas_ai TEXT,
        alur_dari TEXT,
        alur_ke TEXT,
        diperbarui TIMESTAMP DEFAULT NOW()
      );
    `);

    // 2. Tabel contents
    await client.query(`
      CREATE TABLE IF NOT EXISTS contents (
        id SERIAL PRIMARY KEY,
        judul TEXT NOT NULL,
        format TEXT NOT NULL DEFAULT 'Reels / TikTok',
        platform TEXT NOT NULL DEFAULT 'Instagram',
        status TEXT NOT NULL DEFAULT 'draft',
        jadwal_tayang TIMESTAMP,
        dibuat TIMESTAMP DEFAULT NOW()
      );
    `);

    // 3. Tabel tasks
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
        judul TEXT NOT NULL,
        selesai BOOLEAN NOT NULL DEFAULT FALSE,
        dibuat TIMESTAMP DEFAULT NOW()
      );
    `);

    // 4. Tabel outputs
    await client.query(`
      CREATE TABLE IF NOT EXISTS outputs (
        id SERIAL PRIMARY KEY,
        agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
        content_id INTEGER REFERENCES contents(id) ON DELETE SET NULL,
        judul TEXT NOT NULL,
        isi TEXT NOT NULL,
        meta JSONB,
        dibuat TIMESTAMP DEFAULT NOW()
      );
    `);

    // 5. Tabel approvals
    await client.query(`
      CREATE TABLE IF NOT EXISTS approvals (
        id SERIAL PRIMARY KEY,
        agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
        content_id INTEGER REFERENCES contents(id) ON DELETE SET NULL,
        tipe TEXT NOT NULL DEFAULT 'konten',
        judul TEXT NOT NULL,
        ringkasan TEXT NOT NULL,
        detail TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        catatan_revisi TEXT,
        dibuat TIMESTAMP DEFAULT NOW(),
        diputuskan TIMESTAMP
      );
    `);

    // 6. Tabel comments
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        platform TEXT NOT NULL DEFAULT 'Instagram',
        content_id INTEGER REFERENCES contents(id) ON DELETE SET NULL,
        pengirim TEXT NOT NULL DEFAULT '@pengguna',
        isi TEXT NOT NULL,
        kategori TEXT NOT NULL DEFAULT 'Pertanyaan',
        draf_balasan TEXT,
        status TEXT NOT NULL DEFAULT 'pending_approval',
        dibuat TIMESTAMP DEFAULT NOW()
      );
    `);

    // 7. Tabel messages
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        platform TEXT NOT NULL DEFAULT 'Instagram',
        dari TEXT NOT NULL DEFAULT '@klien_potensial',
        isi TEXT NOT NULL,
        draf_balasan TEXT,
        sensitif BOOLEAN NOT NULL DEFAULT FALSE,
        status TEXT NOT NULL DEFAULT 'pending_approval',
        dibuat TIMESTAMP DEFAULT NOW()
      );
    `);

    // 8. Tabel agent_runs
    await client.query(`
      CREATE TABLE IF NOT EXISTS agent_runs (
        id SERIAL PRIMARY KEY,
        agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
        input TEXT NOT NULL,
        output TEXT NOT NULL,
        model TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
        token_pakai INTEGER DEFAULT 0,
        dibuat TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
    console.log('✅ Migrasi 8 tabel berhasil diselesaikan!');
    return { success: true };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Gagal menjalankan migrasi:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// Jalankan otomatis jika dipanggil langsung via CLI
if (process.argv[1]?.includes('migrate.js')) {
  runMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
