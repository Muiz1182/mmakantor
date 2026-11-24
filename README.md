# 🏢 Kantor MMA Production — Visual AI Office & Social Content Engine

Aplikasi web visual kantor karyawan AI interaktif yang mengelola seluruh siklus produksi, kurasi, dan publikasi konten multimedia edukasi viral untuk brand **MMA PRODUCTION**.

Pengguna bertindak sebagai **CEO (Chief Executive Officer)** yang memimpin rapat, memberikan ide konten viral, dan memegang hak persetujuan akhir (*Gate CEO Persetujuan*) sebelum materi video diterbitkan ke akun media sosial resmi.

---

## 🎯 Akun Media Sosial Resmi Terintegrasi

Sistem kantor ini dirancang khusus untuk memproduksi dan mendistribusikan konten ke 3 kanal resmi MMA Production:

* 🎵 **TikTok Official**: [@mma.production7](https://www.tiktok.com/@mma.production7) — *Format 9:16 Video Vertikal*
* 📸 **Instagram Reels**: [@mmadesain](https://www.instagram.com/mmadesain/) — *Format Reels 4K 60fps DaVinci Rec.709*
* 🔴 **YouTube Shorts**: [@Muiz1182](https://www.youtube.com/@Muiz1182) — *Format #Shorts Edukasi 30 Detik*

---

## ✨ Fitur-Fitur Utama

### 1. Simulasi Kantor 3D Interaktif (Three.js Engine)
* **Denah Arsitektural Lengkap**: Ruang Rapat Kaca CEO, Ruang Naskah, Ruang Studio & Editing, Ruang Desain Grafis & Web Dev, Ruang Server AI, Mushollah, Fitness Gym, Kolam Renang, Bar/Lounge & Meja Biliard, serta Asrama Karyawan.
* **Pergerakan Karakter Cerdas (Pathfinding)**: Karyawan berjalan melalui pintu dan koridor tanpa menembus dinding.
* **Animasi Realistis Sesuai Ruangan**:
  * 🏊 **Kolam Renang**: Karakter berenang berkeliling di dalam kolam.
  * 🕌 **Mushollah**: Karakter duduk rapi di atas lantai/sajadah untuk sholat dan rehat ibadah.
  * 🏋️ **Gym**: Gerakan latihan kebugaran jasmani.
  * 🎱 **Biliard & Lounge**: Karakter bermain biliard (tidak menduduki meja) dengan kursi santai di sekelilingnya.
  * 🛏️ **Asrama**: Karakter tidur telentang di atas tempat tidur saat jam istirahat malam.

### 2. Video QC & Verification Gate (Simulator 9:16)
* **Simulator Ponsel 9:16**: Menampilkan pratinjau vertikal ala TikTok dan Instagram Reels.
* **Karakter 3D Editor Animated**: Avatar 3D dengan studio headphone, animasi gestur tangan, dan pergerakan bibir (*lip-sync*) yang sinkron dengan dialog.
* **Split Slider Sebelum vs Sesudah**: Komparasi visual antara rekaman mentah lampu plafon kusam dengan hasil *Rec.709 color grading* sinematik.
* **Stiker Grafis Kreator Sinkron**: Menampilkan elemen HUD viewfinder kamera (`● 4K 60FPS REC`), stiker petir ⚡, perbandingan harga (`Rp 2.5jt ❌` vs `Rp 15rb ✅`), dan diagram pantulan styrofoam 15 ribuan.
* **Narasi Bertutur Murni (Story Writing)**:
  * *Scene 1 (Hook 0-4s)*: Scroll-stopper pemantik rasa penasaran.
  * *Scene 2 (Problem 4-11s)*: Empati masalah pencahayaan kusam.
  * *Scene 3 (Solution 11-22s)*: Demonstrasi trik praktis pantulan styrofoam & senter HP.
  * *Scene 4 (CTA 22-30s)*: Ajakan simpan video dan follow akun.
* **Bebas Jargon Internal**: Subtitle karaoke dan audio narasi vokal jernih tanpa mencantumkan metrik evaluasi internal.

### 3. Ekspor & Unduh Video Fisik (.MP4 1080x1920)
* Engine rendering internal berbasis FFmpeg yang memproduksi video fisik resolusi tinggi 1080x1920 (9:16) siap unggah.
* Tombol **`⬇️ Unduh File Video (.MP4)`** langsung di dalam modal review untuk memudahkan unggah mandiri tanpa hambatan.

### 4. Sistem Distribusi Multi-Platform
* **Mode Publikasi Fleksibel**:
  * 🚀 *Terbitkan Sekarang (Realtime)*: Langsung mengeksekusi pipeline pengunggahan dan menggerakkan tim medsos.
  * 🗓️ *Antrekan Jadwal Tayang*: Otomatis dijadwalkan pada jam prime time operasional kantor (12:00 & 18:00 WIB).
* **Dual Operation Mode**:
  * 🟡 **Mode Asisten Kreator (Creator Hub)**: Naskah, caption, dan tagar otomatis disalin ke clipboard; tombol 1-klik langsung membuka Creator Studio TikTok, Instagram, dan YouTube.
  * 🟢 **Mode Live API Penuh**: Pengunggahan otomatis *headless* langsung ke server TikTok, Instagram Graph API, dan YouTube Data API v3 saat token `.env` dikonfigurasi.

### 5. Jadwal Operasional & Rutinitas Nyata (WIB)
* Sinkronisasi jam kerja harian: waktu masuk kantor (08:00 WIB), rehat makan siang, sholat Ashar/Maghrib, hingga jam pulang.
* Agen AI berpindah ruangan secara mandiri mengikuti alur rutinitas operasional.

### 6. Arsitektur Database Fail-Safe
* Didukung PostgreSQL lokal dengan Drizzle ORM (8 tabel terstruktur).
* Dilengkapi *auto in-memory cache fallback* sehingga aplikasi tetap dapat berjalan normal 100% meskipun PostgreSQL belum dinyalakan.

---

## 🛠️ Prasyarat Sistem

1. **Node.js**: Versi LTS (v18.x ke atas, direkomendasikan Node.js v20+).
2. **PostgreSQL**: Terpasang secara lokal untuk penyimpanan data relasional.
3. **FFmpeg**: Terpasang di sistem untuk rendering video fisik `.mp4`.
4. **Browser Modern**: Mendukung HTML5 Canvas, WebGL, dan Web Audio API (Google Chrome, Microsoft Edge, Mozilla Firefox).

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Kloning Repositori
```bash
git clone https://github.com/Muiz1182/mmakantor.git
cd mmakantor
```

### 2. Konfigurasi Lingkungan (`.env`)
Salin file template `.env.example` menjadi `.env` di root proyek:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi database dan kredensial media sosial Anda:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kantor_mma

TIKTOK_ACCOUNT=@mma.production7
INSTAGRAM_ACCOUNT=@mmadesain
YOUTUBE_ACCOUNT=@Muiz1182

# Kredensial API (Opsional untuk Live Upload API)
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
TIKTOK_ACCESS_TOKEN=your_tiktok_token
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
YOUTUBE_API_KEY=your_youtube_key
```

### 3. Setup & Jalankan Server (Backend)
```bash
cd server
npm install

# Inisialisasi & seeder database PostgreSQL:
npm run db:seed

# Jalankan server Express (port 3001):
npm run dev
# atau: node src/index.js
```

### 4. Setup & Jalankan Klien (Frontend)
Buka terminal baru di folder utama proyek:
```bash
cd client
npm install

# Jalankan Vite development server:
npm run dev
```
Akses aplikasi melalui browser di **`http://localhost:5173`**.

---

## 📡 Dokumentasi Endpoint REST API

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Status kesehatan backend dan koneksi database PostgreSQL |
| `GET` | `/api/stats` | Ringkasan statistik operasional, karyawan, dan antrean CEO |
| `GET` | `/api/agents` | Mengambil seluruh 14 profil karyawan beserta daftar tugasnya |
| `GET` | `/api/approvals` | Mengambil antrean persetujuan materi konten untuk CEO |
| `POST` | `/api/approvals/:id/decision` | Keputusan CEO (`ok` untuk setuju, `rev` untuk minta revisi) |
| `GET` | `/api/contents` | Daftar konten yang telah diproduksi dan jadwal rilisnya |
| `POST` | `/api/contents/publish-socials` | Memublikasikan materi konten ke TikTok, Instagram, dan YouTube |
| `GET` | `/api/contents/social-status` | Cek status token API dan mode operasional media sosial |

---

## 📁 Struktur Direktori Proyek

```text
mma-kantor/
├── client/                     # Frontend SPA (React + Vite + Three.js)
│   ├── public/
│   │   ├── videos/             # Aset video MP4 1080x1920 yang dirender
│   │   └── mma-app-icon.png    # Icon resmi aplikasi MMA 1024x1024
│   └── src/
│       ├── components/         # Komponen UI (Stage3D, Plan2D, VideoReviewModal, dll)
│       ├── constants/          # Data flow, jadwal mingguan, dan script video review
│       ├── hooks/              # Custom hook alur kerja kantor (useOfficeState)
│       └── services/           # Penghubung API backend
├── server/                     # Backend API (Node.js + Express)
│   └── src/
│       ├── agents/             # Definisi karakter dan kepribadian agen AI
│       ├── db/                 # Skema Drizzle ORM, koneksi pool, dan seed data
│       ├── routes/             # Router REST API (agents, approvals, contents, stats)
│       └── services/           # Logika publikasi medsos dan store in-memory
├── .env.example                # Template konfigurasi environment
├── package.json                # Skrip manajemen root
└── README.md                   # Dokumentasi lengkap proyek
```

---

## 👥 Tim Karyawan AI MMA Production

1. **Anda (CEO)**: Pemimpin visi, pembuat ide viral, dan pemegang persetujuan akhir.
2. **Auditor Profil AI**: Menganalisis estetika bio, foto profil, dan highlight akun.
3. **Content Analyst AI**: Memantau metrik performa konten dan algoritma prime time.
4. **Brainstorming Ide AI**: Mengembangkan sudut pandang konten unik dan hook tajam.
5. **Perencana Konten AI**: Menyusun kalender editorial mingguan 3 pilar edukasi.
6. **Penulis Naskah AI**: Merancang naskah bertutur format Hook-Problem-Solution-CTA.
7. **Videographer AI**: Menentukan teknis pengambilan gambar, framing, dan pencahayaan studio.
8. **Editor Video AI**: Memotong ritme video, menambahkan sound effect, dan grading Rec.709.
9. **Caption & SEO AI**: Menulis copywriting persuasif, call to action, dan tagar viral.
10. **Desainer Grafis AI**: Memproduksi aset visual feed, cover Reels, dan slide carousel.
11. **Upload Video AI**: Mengeksekusi penayangan materi video ke TikTok, Reels, dan Shorts.
12. **IG Story & Teaser AI**: Menerbitkan teaser cerita harian dan tautan interaksi penonton.
13. **Manajer Komentar AI**: Membalas pertanyaan dan menjaga interaksi hangat di kolom komentar.
14. **Customer Service AI**: Melayani konsultasi dan calon klien melalui pesan langsung (DM).

---

## 📄 Lisensi

Hak Cipta © 2026 **MMA Production**. Dikembangkan untuk otomatisasi manajemen studio kreatif dan distribusi konten edukasi multimedia.
