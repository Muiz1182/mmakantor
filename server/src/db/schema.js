import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

// 1. Tabel Karyawan (1 CEO + 13 Agen AI)
export const agents = pgTable('agents', {
  id: text('id').primaryKey(), // 'ceo', 'auditor', 'analis', dll.
  nama: text('nama').notNull(),
  peran: text('peran').notNull(),
  zona: text('zona').notNull(), // 'ceo', 'plan', 'write', 'prod', 'pub'
  status: text('status').notNull().default('working'), // 'working', 'waiting', 'attention'
  ruangSantai: text('ruang_santai').notNull().default('auto'), // 'auto', 'lunch', 'ps', 'pool', 'dorm'
  urutan: integer('urutan').notNull().default(0),
  warna: text('warna').notNull().default('#3b82f6'),
  ringkasan: text('ringkasan'),
  sedangKerja: text('sedang_kerja'),
  batasAi: text('batas_ai'),
  alurDari: text('alur_dari'),
  alurKe: text('alur_ke'),
  diperbarui: timestamp('diperbarui').defaultNow(),
});

// 2. Tabel Daftar Tugas per Karyawan
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  agentId: text('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  judul: text('judul').notNull(),
  selesai: boolean('selesai').notNull().default(false),
  dibuat: timestamp('dibuat').defaultNow(),
});

// 3. Tabel Konten Media Sosial
export const contents = pgTable('contents', {
  id: serial('id').primaryKey(),
  judul: text('judul').notNull(),
  format: text('format').notNull().default('Reels / TikTok'), // 'Reels / TikTok', 'Carousel', 'YouTube Video', 'Story'
  platform: text('platform').notNull().default('Instagram'), // 'Instagram', 'TikTok', 'YouTube'
  status: text('status').notNull().default('draft'), // 'draft', 'pending_approval', 'approved', 'scheduled', 'published'
  jadwalTayang: timestamp('jadwal_tayang'),
  dibuat: timestamp('dibuat').defaultNow(),
});

// 4. Tabel Hasil Kerja Karyawan (Outputs)
export const outputs = pgTable('outputs', {
  id: serial('id').primaryKey(),
  agentId: text('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  contentId: integer('content_id').references(() => contents.id, { onDelete: 'set null' }),
  judul: text('judul').notNull(),
  isi: text('isi').notNull(),
  meta: jsonb('meta'), // Metadata tambahan (misal ukuran ekspor, slide count, dll)
  dibuat: timestamp('dibuat').defaultNow(),
});

// 5. Tabel Antrian Persetujuan CEO (Gatekeeper Utama)
export const approvals = pgTable('approvals', {
  id: serial('id').primaryKey(),
  agentId: text('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  contentId: integer('content_id').references(() => contents.id, { onDelete: 'set null' }),
  tipe: text('tipe').notNull().default('konten'), // 'naskah', 'caption', 'carousel', 'upload', 'balasan_komentar', 'dm'
  judul: text('judul').notNull(),
  ringkasan: text('ringkasan').notNull(),
  detail: text('detail'),
  status: text('status').notNull().default('pending'), // 'pending', 'approved', 'rejected'
  catatanRevisi: text('catatan_revisi'),
  dibuat: timestamp('dibuat').defaultNow(),
  diputuskan: timestamp('diputuskan'),
});

// 6. Tabel Komentar Masuk & Draf Balasan
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull().default('Instagram'),
  contentId: integer('content_id').references(() => contents.id, { onDelete: 'set null' }),
  pengirim: text('pengirim').notNull().default('@pengguna'),
  isi: text('isi').notNull(),
  kategori: text('kategori').notNull().default('Pertanyaan'), // 'Pertanyaan', 'Apresiasi', 'Keluhan', 'Umum'
  drafBalasan: text('draf_balasan'),
  status: text('status').notNull().default('pending_approval'), // 'pending_approval', 'approved', 'sent'
  dibuat: timestamp('dibuat').defaultNow(),
});

// 7. Tabel Pesan Masuk / DM & Draf Balasan
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull().default('Instagram'),
  dari: text('dari').notNull().default('@klien_potensial'),
  isi: text('isi').notNull(),
  drafBalasan: text('draf_balasan'),
  sensitif: boolean('sensitif').notNull().default(false),
  status: text('status').notNull().default('pending_approval'), // 'pending_approval', 'approved', 'sent'
  dibuat: timestamp('dibuat').defaultNow(),
});

// 8. Tabel Log Pemanggilan Model AI
export const agentRuns = pgTable('agent_runs', {
  id: serial('id').primaryKey(),
  agentId: text('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  input: text('input').notNull(),
  output: text('output').notNull(),
  model: text('model').notNull().default('gemini-1.5-flash'),
  tokenPakai: integer('token_pakai').default(0),
  dibuat: timestamp('dibuat').defaultNow(),
});
