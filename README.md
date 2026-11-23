# Kantor MMA Production

Aplikasi web visual kantor karyawan AI yang mengelola siklus produksi konten Instagram, TikTok, dan YouTube untuk brand **MMA PRODUCTION**.
Pengguna bertindak sebagai **CEO** yang memberikan arahan strategis dan memegang hak persetujuan akhir sebelum konten tayang atau balasan dikirimkan.

---

## Prasyarat Sistem

1. **Node.js**: Versi LTS (v18 ke atas disarankan, teruji pada Node v24).
2. **PostgreSQL**: Terpasang secara lokal untuk tahap backend database (Tahap 3).
3. **Web Browser Modern**: Mendukung HTML5, CSS Grid, dan WebGL (Chrome, Edge, Firefox, Safari).

---

## Panduan Instalasi & Menjalankan Proyek

### 1. Menjalankan Frontend (Client)
Masuk ke folder `client/` dan pasang dependensi:
```bash
cd client
npm install
npm run dev
```
Buka tautan lokal yang tampil di terminal (default `http://localhost:5173`) di browser Anda.

### 2. Menjalankan Backend (Server) & Database PostgreSQL
Masuk ke folder `server/` dan pasang dependensi:
```bash
cd server
npm install
```

#### Menyiapkan Database PostgreSQL:
1. Pastikan layanan PostgreSQL lokal aktif (default port `5432`).
2. Buat database bernama `kantor_mma` jika belum ada (atau jalankan script otomatis `node scripts/init-db.js`).
3. Jalankan migrasi 8 tabel dan seed data awal:
```bash
npm run db:seed
```
4. Jalankan backend server Express:
```bash
npm run dev
# atau: node src/index.js
```
Server akan aktif di `http://localhost:3001/api`.

> **Catatan Mode Cadangan (Fail-Safe)**: Jika PostgreSQL belum dinyalakan, backend tetap dapat berjalan normal menggunakan *in-memory cache*, sehingga frontend tidak pernah blank atau terganggu.

### 3. Konfigurasi Lingkungan (.env)
Salin contoh konfigurasi lingkungan ke file `.env` di root dan folder `server/`:
```bash
cp .env.example .env
```
Isi konfigurasi database:
```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kantor_mma
```

---

## Dokumentasi REST API Backend

- `GET /api/health`: Status kesehatan server dan koneksi PostgreSQL.
- `GET /api/stats`: Ringkasan jumlah karyawan, status kerja, dan antrean persetujuan.
- `GET /api/agents`: Mengambil seluruh 14 karyawan beserta daftar tugas dan output terbaru.
- `GET /api/agents/:id`: Mengambil detail satu karyawan spesifik.
- `PATCH /api/agents/:id`: Memperbarui status kerja atau ruang santai favorit karyawan.
- `POST /api/agents/:id/tasks`: Menambahkan tugas baru untuk karyawan.
- `PATCH /api/tasks/:id`: Mengubah status selesai tugas (centang / batal centang).
- `GET /api/approvals`: Mengambil daftar antrean persetujuan CEO.
- `POST /api/approvals/:id/decision`: Memberikan keputusan CEO (`decision: 'approve'` atau `'revise'` beserta catatan revisi).
- `GET /api/contents`: Mengambil daftar konten media sosial.
- `POST /api/contents`: Menambahkan draf konten baru.

---

## Struktur Tahap Pembangunan

- **Tahap 1 (Selesai)**:
  - Kerangka proyek modular (`client/` dan `server/`).
  - Denah 2D interaktif (5 ruang kerja + 4 ruang santai).
  - 14 profil lengkap (CEO + 13 Agen AI) dengan checklist tugas, hasil terbaru, alur kerja berantai, dan batas kapabilitas AI.
  - Antrean persetujuan CEO (Setujui / Minta Revisi).
  - Alur produksi 14 langkah di bagian atas halaman.
  - Dukungan mode terang dan gelap dengan rasio kontras WCAG AA.
- **Tahap 2 (Selesai)**:
  - Denah 3D Three.js isometrik layar penuh dengan sekat dinding arsitektural.
  - Animasi perpindahan agen antar ruangan melalui pintu dan lorong (anti-tembus dinding).
  - 4 zona santai lengkap: Ruang Makan (Lunch), Ruang PlayStation, Kolam Renang, dan Asrama (4 tempat tidur presisi telentang).
- **Tahap 3 (Selesai)**:
  - Backend Express di `http://localhost:3001/api`.
  - Database PostgreSQL lokal dengan Drizzle ORM (8 tabel terstruktur).
  - Skrip migrasi (`db:migrate`) dan seeder data awal (`db:seed`).
  - Endpoint REST API lengkap untuk Karyawan, Tugas, Antrean Persetujuan, Konten, dan Status.
  - Integrasi live API ke antarmuka frontend dengan indikator status database realtime.
- **Tahap 4 (Berikutnya)**: Penyambungan AI per agen (system prompt dan pengaliran otomatis ke antrean persetujuan).
- **Tahap 5**: Integrasi API media sosial dan mode cadangan (fallback manual).
