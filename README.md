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
Buka tautan lokal yang tampil di terminal (biasanya `http://localhost:5173`) di browser Anda.

### 2. Konfigurasi Lingkungan (.env)
Salin contoh konfigurasi lingkungan:
```bash
cp .env.example .env
```
Isi konfigurasi database dan API key AI sesuai kebutuhan. Jangan pernah mempublikasikan file `.env` ke repositori publik.

---

## Struktur Tahap Pembangunan

- **Tahap 1 (Selesai)**:
  - Kerangka proyek modular (`client/` dan `server/`).
  - Denah 2D interaktif (5 ruang kerja + 4 ruang santai).
  - 14 profil lengkap (CEO + 13 Agen AI) dengan checklist tugas, hasil terbaru, alur kerja berantai, dan batas kapabilitas AI.
  - Antrean persetujuan CEO (Setujui / Minta Revisi).
  - Alur produksi 14 langkah di bagian atas halaman.
  - Dukungan mode terang dan gelap dengan rasio kontras WCAG AA.
- **Tahap 2**: Denah 3D Three.js dan animasi perpindahan agen lewat lorong (anti-tembus dinding).
- **Tahap 3**: Backend Express + PostgreSQL (migrasi 8 tabel Drizzle ORM, seed data prototipe, REST API).
- **Tahap 4**: Penyambungan AI per agen (system prompt dan pengaliran otomatis ke antrean persetujuan).
- **Tahap 5**: Integrasi API media sosial dan mode cadangan (fallback manual).
