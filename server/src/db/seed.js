import { pool } from './index.js';
import { runMigration } from './migrate.js';

export const SEED_AGENTS = [
  {
    id: 'ceo',
    nama: 'CEO',
    peran: 'Anda',
    zona: 'ceo',
    status: 'waiting',
    ruangSantai: 'auto',
    urutan: 0,
    warna: '#3b82f6',
    ringkasan: 'Anda menentukan arah dan menyetujui semua yang akan tayang atau terkirim.',
    sedangKerja: 'Memeriksa antrean persetujuan dan menentukan fokus konten minggu depan.',
    batasAi: 'Pengguna utama (bukan AI). Semua persetujuan akhir berada di tangan Anda.',
    alurDari: 'naskah, caption, carousel, dm',
    alurKe: 'analis, perencana',
    tasks: [
      { judul: 'Setujui item di antrean persetujuan', selesai: false },
      { judul: 'Pilih fokus konten minggu depan', selesai: false },
      { judul: 'Tentukan tema bulan Desember', selesai: true }
    ],
    outputs: []
  },
  {
    id: 'auditor',
    nama: 'Auditor Profil',
    peran: 'Audit & Konsistensi Profil',
    zona: 'plan',
    status: 'working',
    ruangSantai: 'auto',
    urutan: 1,
    warna: '#06b6d4',
    ringkasan: 'Memeriksa bio, tampilan, dan konsistensi akun Instagram, TikTok, dan YouTube.',
    sedangKerja: 'Membandingkan gaya visual 12 postingan terakhir di tiga akun.',
    batasAi: 'Hanya membaca profil publik. Perubahan profil dilakukan Anda setelah hasil audit disetujui.',
    alurDari: 'ceo',
    alurKe: 'analis',
    tasks: [
      { judul: 'Cek bio dan tautan di Instagram, TikTok, YouTube', selesai: true },
      { judul: 'Bandingkan gaya visual 12 postingan terakhir', selesai: false },
      { judul: 'Susun daftar perbaikan profil', selesai: false }
    ],
    outputs: [
      {
        judul: 'Temuan audit profil akun',
        isi: '1. Bio Instagram belum menyebut apa yang ditawarkan dan untuk siapa.\n2. Sampul highlight memakai tiga gaya yang berbeda.\n3. Nama pengguna di TikTok dan YouTube tidak sama.'
      }
    ]
  },
  {
    id: 'analis',
    nama: 'Content Analyst',
    peran: 'Analisis Performa Konten',
    zona: 'plan',
    status: 'working',
    ruangSantai: 'auto',
    urutan: 2,
    warna: '#14b8a6',
    ringkasan: 'Membaca performa konten lama untuk menemukan pola yang berhasil.',
    sedangKerja: 'Membaca retensi, simpan, dan bagikan dari 20 konten terakhir.',
    batasAi: 'Angkanya baru nyata jika data statistik diunggah. Tanpa itu, agent membaca estimasi.',
    alurDari: 'auditor, ceo, upload, komentar, dm',
    alurKe: 'ide',
    tasks: [
      { judul: 'Ambil data 20 konten terakhir (retensi, simpan, bagikan)', selesai: true },
      { judul: 'Kelompokkan konten menurut format', selesai: false },
      { judul: 'Tulis tiga pola yang paling jelas', selesai: false }
    ],
    outputs: [
      {
        judul: 'Pola performa konten terbaik',
        isi: '1. Video di bawah 30 detik bertahan lebih lama daripada yang 60 detik.\n2. Carousel berisi daftar tips paling sering disimpan.\n3. Unggahan malam hari mendapat lebih banyak komentar.'
      }
    ]
  },
  {
    id: 'ide',
    nama: 'Brainstorming',
    peran: 'Pengembang Ide Konten',
    zona: 'plan',
    status: 'working',
    ruangSantai: 'auto',
    urutan: 3,
    warna: '#f59e0b',
    ringkasan: 'Mengubah pola performa menjadi ide konten baru.',
    sedangKerja: 'Menulis 10 ide mentah dari tiga pola yang berhasil.',
    batasAi: 'Bisa menghasilkan banyak variasi, namun membutuhkan kurasi relevansi topik dari Anda.',
    alurDari: 'analis',
    alurKe: 'perencana',
    tasks: [
      { judul: 'Baca pola dari Content Analyst', selesai: true },
      { judul: 'Tulis 10 ide mentah', selesai: false },
      { judul: 'Pilih 5 terbaik untuk Perencana Konten', selesai: false }
    ],
    outputs: [
      {
        judul: 'Daftar ide konten terkurasi',
        isi: '1. Reels: satu kesalahan umum produksi video, 20 detik.\n2. Carousel 7 slide: panduan langkah demi langkah color grading.\n3. YouTube: proses di balik layar syuting iklan 1 hari.'
      }
    ]
  },
  {
    id: 'perencana',
    nama: 'Perencana Konten',
    peran: 'Penyusun Kalender & Jadwal',
    zona: 'plan',
    status: 'working',
    ruangSantai: 'auto',
    urutan: 4,
    warna: '#6366f1',
    ringkasan: 'Menentukan kalender konten: format, platform, dan jam tayang.',
    sedangKerja: 'Menyusun jadwal posting 7 hari ke depan.',
    batasAi: 'Hanya menyusun rencana. Penyesuaian momen mendadak tetap ditentukan oleh CEO.',
    alurDari: 'ide, ceo',
    alurKe: 'naskah',
    tasks: [
      { judul: 'Petakan 5 ide ke kalender seminggu', selesai: true },
      { judul: 'Pilih jam tayang berdasarkan data audiens', selesai: false },
      { judul: 'Serahkan daftar topik ke Penulis Naskah', selesai: false }
    ],
    outputs: [
      {
        judul: 'Kalender konten minggu ini',
        isi: 'Senin 19.00: Reels Hook Singkat\nRabu 18.30: Carousel Edukasi 7 Slide\nJumat 20.00: YouTube Full Breakdown Studio Setup'
      }
    ]
  },
  {
    id: 'naskah',
    nama: 'Penulis Naskah',
    peran: 'Hook & Naskah Narasi',
    zona: 'write',
    status: 'attention',
    ruangSantai: 'auto',
    urutan: 5,
    warna: '#8b5cf6',
    ringkasan: 'Menulis hook penarik perhatian dan naskah lengkap per format.',
    sedangKerja: 'Draf 2 naskah YouTube menunggu persetujuan Anda.',
    batasAi: 'Naskah yang dihasilkan butuh sentuhan gaya bicara alami dari pembicara.',
    alurDari: 'perencana',
    alurKe: 'kamera, ceo',
    tasks: [
      { judul: 'Tulis hook 3 detik pertama untuk video pendek', selesai: true },
      { judul: 'Selesaikan naskah YouTube 8 menit', selesai: true },
      { judul: 'Ajukan ke antrean persetujuan CEO', selesai: true }
    ],
    outputs: [
      {
        judul: 'Naskah YouTube 8 Menit (Draf 2)',
        isi: 'Hook (0-30s): "Tiga kesalahan pencahayaan yang merusak hasil rekaman Anda..."\nIsi: Key light positioning, fill light ratio, dan backlight separation.'
      }
    ]
  },
  {
    id: 'kamera',
    nama: 'Videographer / Fotografer',
    peran: 'Shot List & Arahan Visual',
    zona: 'prod',
    status: 'waiting',
    ruangSantai: 'pool',
    urutan: 6,
    warna: '#10b981',
    ringkasan: 'Menyiapkan shot list, storyboard, dan arahan visual sebelum syuting.',
    sedangKerja: 'Menunggu naskah disetujui CEO sebelum menyusun daftar bidikan.',
    batasAi: 'Hanya membuat shot list dan arahan. Perekaman di dunia nyata dilakukan oleh tim manusia.',
    alurDari: 'naskah',
    alurKe: 'editor',
    tasks: [
      { judul: 'Pelajari naskah yang sudah disetujui', selesai: false },
      { judul: 'Susun shot list 12 bidikan utama', selesai: false },
      { judul: 'Siapkan panduan framing dan properti', selesai: false }
    ],
    outputs: [
      {
        judul: 'Shot list draf awal',
        isi: 'Bidang A: Wide shot setup studio.\nBidang B: Close-up pergerakan tangan pada lensa kamera.'
      }
    ]
  },
  {
    id: 'editor',
    nama: 'Editor',
    peran: 'Cut List & Format Ekspor',
    zona: 'prod',
    status: 'waiting',
    ruangSantai: 'dorm',
    urutan: 7,
    warna: '#ec4899',
    ringkasan: 'Membuat daftar potongan, teks layar, subtitle, dan ukuran ekspor per platform.',
    sedangKerja: 'Menunggu rekaman mentah dari tim produksi lapangan.',
    batasAi: 'Menyiapkan panduan potong dan teks layar. Perenderan aktual dilakukan di aplikasi editing video.',
    alurDari: 'kamera',
    alurKe: 'caption, carousel, upload',
    tasks: [
      { judul: 'Susun instruksi potongan ritme cepat', selesai: false },
      { judul: 'Tulis draf subtitle otomatis', selesai: false },
      { judul: 'Tentukan ukuran ekspor: 9:16 dan 16:9', selesai: false }
    ],
    outputs: [
      {
        judul: 'Spesifikasi ekspor video',
        isi: 'Instagram & TikTok: 1080x1920 (9:16), 30fps, Bitrate 15Mbps.\nYouTube: 3840x2160 (16:9), 4K UHD.'
      }
    ]
  },
  {
    id: 'caption',
    nama: 'Caption',
    peran: 'Teks Postingan & Tagar',
    zona: 'pub',
    status: 'attention',
    ruangSantai: 'auto',
    urutan: 8,
    warna: '#3b82f6',
    ringkasan: 'Menulis caption penjelas, pilihan hashtag yang relevan, dan kalimat ajakan bertindak.',
    sedangKerja: 'Draf caption Reels Kamis 19.00 menunggu persetujuan Anda.',
    batasAi: 'Caption tidak akan terunggah otomatis sebelum Anda menekan Setujui.',
    alurDari: 'editor',
    alurKe: 'ceo, upload',
    tasks: [
      { judul: 'Tulis caption pendek dua kalimat', selesai: true },
      { judul: 'Riset 5 tagar berkinerja tinggi', selesai: true },
      { judul: 'Kirim draf ke antrean persetujuan', selesai: true }
    ],
    outputs: [
      {
        judul: 'Draf Caption Reels Kamis',
        isi: '"Setup lighting sederhana tapi bikin hasil rekaman naik kelas! Simpan video ini buat referensi syuting berikutnya!\n#videoproduction #filmmaking #contentcreator"'
      }
    ]
  },
  {
    id: 'carousel',
    nama: 'Carousel',
    peran: 'Penyusun Slide 1080x1350',
    zona: 'pub',
    status: 'working',
    ruangSantai: 'auto',
    urutan: 9,
    warna: '#0284c7',
    ringkasan: 'Menyusun materi slide demi slide ukuran 1080 x 1350 piksel.',
    sedangKerja: 'Menyusun teks untuk 7 slide Carousel panduan color grading.',
    batasAi: 'Menyiapkan naskah slide dan tata letak teks. Desain akhir diekspor via Canva atau Figma.',
    alurDari: 'editor',
    alurKe: 'ceo, upload',
    tasks: [
      { judul: 'Tentukan judul slide pembuka (Hook)', selesai: true },
      { judul: 'Tulis 5 poin inti di slide 2 sampai 6', selesai: false },
      { judul: 'Tulis slide penutup dengan ajakan simpan', selesai: false }
    ],
    outputs: [
      {
        judul: 'Naskah Carousel 7 Slide',
        isi: 'Slide 1: 3 Langkah Color Grading Tanpa Ribet\nSlide 2: Koreksi Exposure\nSlide 3: White Balance Kunci Utama\nSlide 7: Simpan postingan ini!'
      }
    ]
  },
  {
    id: 'upload',
    nama: 'Upload Video',
    peran: 'Jadwal & File Publikasi',
    zona: 'pub',
    status: 'working',
    ruangSantai: 'auto',
    urutan: 10,
    warna: '#0d9488',
    ringkasan: 'Memastikan file video, thumbnail, dan jadwal posting sudah lengkap dan siap tayang.',
    sedangKerja: 'Memeriksa resolusi dan kelengkapan metadata file untuk jadwal besok.',
    batasAi: 'Jika integrasi API belum aktif, agen menyiapkan paket lengkap untuk Anda unggah secara manual.',
    alurDari: 'caption, carousel, editor',
    alurKe: 'story, analis',
    tasks: [
      { judul: 'Periksa kesesuaian format file 9:16', selesai: true },
      { judul: 'Verifikasi kesiapan cover thumbnail', selesai: false },
      { judul: 'Kunci waktu jadwal tayang', selesai: false }
    ],
    outputs: [
      {
        judul: 'Paket publikasi siap tayang',
        isi: 'File: reels_lighting_v2.mp4 (48MB)\nThumbnail: cover_lighting.jpg\nJadwal: Kamis 19.00 WIB'
      }
    ]
  },
  {
    id: 'story',
    nama: 'Story',
    peran: 'Cuplikan & Polling Interaktif',
    zona: 'pub',
    status: 'waiting',
    ruangSantai: 'dorm',
    urutan: 11,
    warna: '#d97706',
    ringkasan: 'Menyiapkan materi Story: cuplikan, stiker pertanyaan, dan ajakan menonton konten utama.',
    sedangKerja: 'Menunggu video utama tayang untuk membuat story promosi lanjutan.',
    batasAi: 'Materi story dibuat untuk mendorong interaksi real-time pengikut.',
    alurDari: 'upload',
    alurKe: 'komentar',
    tasks: [
      { judul: 'Rancang cuplikan teaser 5 detik', selesai: false },
      { judul: 'Buat stiker polling pertanyaan penonton', selesai: false },
      { judul: 'Pasang stiker tautan langsung ke postingan', selesai: false }
    ],
    outputs: [
      {
        judul: 'Konsep Story Interaktif',
        isi: 'Slide 1: Teaser bts syuting.\nSlide 2: Polling "Kalian lebih suka natural light atau studio light?"'
      }
    ]
  },
  {
    id: 'komentar',
    nama: 'Balas Komentar',
    peran: 'Draf Tanggapan Audiens',
    zona: 'pub',
    status: 'working',
    ruangSantai: 'auto',
    urutan: 12,
    warna: '#7c3aed',
    ringkasan: 'Membaca komentar audiens dan menyiapkan draf balasan yang ramah dan relevan.',
    sedangKerja: 'Memeriksa komentar baru pada video terbaru.',
    batasAi: 'Balasan berupa draf. Tidak ada komentar terkirim tanpa persetujuan Anda.',
    alurDari: 'story',
    alurKe: 'dm, analis',
    tasks: [
      { judul: 'Pindai komentar baru di Instagram & TikTok', selesai: true },
      { judul: 'Kelompokkan pertanyaan teknis dan apresiasi', selesai: false },
      { judul: 'Siapkan draf balasan untuk diajukan', selesai: false }
    ],
    outputs: [
      {
        judul: 'Draf Balasan Komentar',
        isi: 'Komentar @adi_visual: "Pakai lampu apa ini mas?"\nDraf balasan: "Halo Adi! Kami pakai LED panel 60W dengan softbox bulat ya."'
      }
    ]
  },
  {
    id: 'dm',
    nama: 'DM',
    peran: 'Draf Pesan Langsung & Leads',
    zona: 'pub',
    status: 'attention',
    ruangSantai: 'auto',
    urutan: 13,
    warna: '#4f46e5',
    ringkasan: 'Menyiapkan draf balasan pesan langsung dari penonton dan calon klien.',
    sedangKerja: 'Draf balasan pertanyaan harga menunggu persetujuan Anda.',
    batasAi: 'Semua balasan berupa draf sampai Anda setujui. Pesan sensitif langsung diteruskan ke Anda.',
    alurDari: 'komentar, ceo',
    alurKe: 'analis',
    tasks: [
      { judul: 'Tulis draf balasan pertanyaan harga', selesai: true },
      { judul: 'Susun jawaban untuk pertanyaan yang sering muncul', selesai: false },
      { judul: 'Tandai pesan yang harus Anda tangani sendiri', selesai: false }
    ],
    outputs: [
      {
        judul: 'Draf DM Calon Klien',
        isi: '"Terima kasih sudah menghubungi MMA Production! Untuk daftar paket produksi video lengkap, Anda dapat melihat rincian di tautan profil kami atau kami jadwalkan sesi diskusi singkat."'
      }
    ]
  }
];

export const SEED_APPROVALS = [
  {
    agentId: 'naskah',
    tipe: 'Multimedia',
    judul: '[Multimedia] Hook 3s: 3 Trik Lighting Studio Modal 100 Ribuan',
    ringkasan: 'Edukasi video: membandingkan setup pencahayaan sebelum dan sesudah dalam 3 detik pertama.',
    detail: 'Hook (0-3s): Jangan beli lampu mahal sebelum tahu trik pantulan dinding ini!\nIsi: Key light diffuser plastik, fill light styrofoam, backlight senter HP.\nSkor FYP: 94/100 (Hook visual rasa penasaran instan).',
    status: 'pending'
  },
  {
    agentId: 'caption',
    tipe: 'Design',
    judul: '[Design] Carousel 7 Slide: Kesalahan Tipografi yang Bikin Desain Murahan',
    ringkasan: 'Edukasi desain grafis: 7 slide studi kasus font pairing dan hirarki visual.',
    detail: 'Slide 1: Desain kamu kelihatan murah? Cek 3 kesalahan font ini!\nSlide 2-6: Studi kasus font gratis vs font premium, leading, tracking.\nSkor FYP: 88/100 (Format carousel edukasi daftar memiliki rasio save tinggi).',
    status: 'pending'
  },
  {
    agentId: 'carousel',
    tipe: 'Web Development',
    judul: '[Web Dev] Reels 25s: Cara Bikin Animasi 3D di Website Tanpa Lag',
    ringkasan: 'Edukasi coding: tutorial integrasi Three.js ringan untuk landing page interaktif.',
    detail: 'Pembuka: Website kamu masih 2D membosankan? Coba tambahkan 3D interaktif ini.\nIsi: Optimasi Three.js mesh polygon rendah, lighting hemat GPU.\nSkor FYP: 68/100 (Pembuka masih agak teknis, perlu hook visual lebih atraktif).',
    status: 'pending'
  }
];

export async function runSeed() {
  console.log('🌱 Memulai seeding data awal ke PostgreSQL...');
  await runMigration();

  const client = await pool.connect();
  try {
    await client.query("SET client_encoding = 'UTF8';");
    await client.query('BEGIN');

    // 1. Bersihkan tabel lama agar tidak duplikat
    await client.query('DELETE FROM approvals;');
    await client.query('DELETE FROM outputs;');
    await client.query('DELETE FROM tasks;');
    await client.query('DELETE FROM agents;');

    // 2. Masukkan Karyawan & Tugas & Output
    for (const a of SEED_AGENTS) {
      await client.query(
        `INSERT INTO agents (id, nama, peran, zona, status, ruang_santai, urutan, warna, ringkasan, sedang_kerja, batas_ai, alur_dari, alur_ke)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [a.id, a.nama, a.peran, a.zona, a.status, a.ruangSantai, a.urutan, a.warna, a.ringkasan, a.sedangKerja, a.batasAi, a.alurDari, a.alurKe]
      );

      for (const t of a.tasks) {
        await client.query(
          `INSERT INTO tasks (agent_id, judul, selesai) VALUES ($1, $2, $3)`,
          [a.id, t.judul, t.selesai]
        );
      }

      for (const o of a.outputs) {
        await client.query(
          `INSERT INTO outputs (agent_id, judul, isi) VALUES ($1, $2, $3)`,
          [a.id, o.judul, o.isi]
        );
      }
    }

    // 3. Masukkan Antrean Persetujuan Awal
    for (const app of SEED_APPROVALS) {
      await client.query(
        `INSERT INTO approvals (agent_id, tipe, judul, ringkasan, detail, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [app.agentId, app.tipe, app.judul, app.ringkasan, app.detail, app.status]
      );
    }

    await client.query('COMMIT');
    console.log(`✅ Sukses seeding 14 karyawan dan antrean persetujuan!`);
    return { success: true };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Gagal seeding data:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// Jalankan otomatis jika dipanggil langsung via CLI
if (process.argv[1]?.includes('seed.js')) {
  runSeed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
