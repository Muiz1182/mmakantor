export const INITIAL_AGENTS = [
  {
    id: 'ceo',
    zone: 'ceo',
    nama: 'CEO',
    sub: 'Anda',
    hue: 215,
    ringkas: 'Anda menentukan arah dan menyetujui semua yang akan tayang.',
    now: 'Memeriksa antrean persetujuan dan menentukan fokus konten minggu depan.',
    tugas: [
      { t: 'Setujui item di antrean persetujuan', d: false },
      { t: 'Pilih fokus konten minggu depan', d: false },
      { t: 'Tentukan tema bulan Desember', d: true }
    ],
    terima: ['naskah', 'caption', 'carousel', 'dm'],
    kirim: ['analis', 'perencana']
  },
  {
    id: 'auditor',
    zone: 'plan',
    nama: 'Auditor Profil',
    hue: 195,
    status: 'working',
    sLabel: 'Bekerja',
    ringkas: 'Memeriksa bio, tampilan, dan konsistensi akun Instagram, TikTok, dan YouTube.',
    now: 'Membandingkan gaya visual 12 postingan terakhir di tiga akun.',
    tugas: [
      { t: 'Cek bio dan tautan di Instagram, TikTok, YouTube', d: true },
      { t: 'Bandingkan gaya visual 12 postingan terakhir', d: false },
      { t: 'Susun daftar perbaikan profil', d: false }
    ],
    out: {
      t: 'Temuan audit (contoh)',
      items: [
        'Bio Instagram belum menyebut apa yang ditawarkan dan untuk siapa.',
        'Sampul highlight memakai tiga gaya yang berbeda.',
        'Nama pengguna di TikTok dan YouTube tidak sama.'
      ]
    },
    terima: ['ceo'],
    kirim: ['analis'],
    batas: 'Hanya membaca profil publik. Perubahan profil dilakukan Anda setelah hasil audit disetujui.'
  },
  {
    id: 'analis',
    zone: 'plan',
    nama: 'Content Analyst',
    hue: 170,
    status: 'working',
    sLabel: 'Bekerja',
    ringkas: 'Membaca performa konten lama untuk menemukan pola yang berhasil.',
    now: 'Membaca retensi, simpan, dan bagikan dari 20 konten terakhir.',
    tugas: [
      { t: 'Ambil data 20 konten terakhir (retensi, simpan, bagikan)', d: true },
      { t: 'Kelompokkan konten menurut format', d: false },
      { t: 'Tulis tiga pola yang paling jelas', d: false }
    ],
    out: {
      t: 'Pola performa (contoh)',
      items: [
        'Video di bawah 30 detik bertahan lebih lama daripada yang 60 detik.',
        'Carousel berisi daftar paling sering disimpan.',
        'Unggahan malam hari mendapat lebih banyak komentar.'
      ]
    },
    terima: ['auditor', 'ceo', 'upload', 'komentar', 'dm'],
    kirim: ['ide'],
    batas: 'Angkanya baru nyata jika Anda mengekspor data statistik dari akun. Tanpa itu, agent hanya bisa menebak.'
  },
  {
    id: 'ide',
    zone: 'plan',
    nama: 'Brainstorming',
    hue: 38,
    status: 'working',
    sLabel: 'Bekerja',
    ringkas: 'Mengubah pola performa menjadi ide konten baru.',
    now: 'Menulis 10 ide mentah dari tiga pola yang berhasil.',
    tugas: [
      { t: 'Baca pola dari Content Analyst', d: true },
      { t: 'Tulis 10 ide mentah', d: false },
      { t: 'Pilih 5 terbaik untuk Perencana Konten', d: false }
    ],
    out: {
      t: 'Daftar ide (contoh)',
      items: [
        'Reels: satu kesalahan umum, satu perbaikan, 20 detik.',
        'Carousel 7 slide: panduan langkah demi langkah.',
        'YouTube: proses dari awal sampai jadi dalam satu hari.'
      ]
    },
    terima: ['analis'],
    kirim: ['perencana']
  },
  {
    id: 'perencana',
    zone: 'plan',
    nama: 'Perencana Konten',
    hue: 230,
    status: 'working',
    sLabel: 'Bekerja',
    ringkas: 'Menyusun kalender: format, platform, dan jam tayang.',
    now: 'Mengisi kalender dua minggu: 3 Reels, 2 carousel, 1 video panjang.',
    tugas: [
      { t: 'Tetapkan komposisi: 3 Reels, 2 carousel, 1 video panjang', d: true },
      { t: 'Isi kalender dua minggu', d: false },
      { t: 'Cocokkan jadwal dengan jam aktif penonton', d: false }
    ],
    out: {
      t: 'Kalender pekan ini (contoh)',
      items: [
        'Senin: Carousel Instagram, 19.00',
        'Kamis: Reels Instagram dan TikTok, 19.00',
        'Sabtu: Video YouTube, 10.00'
      ]
    },
    terima: ['ide', 'ceo'],
    kirim: ['naskah', 'carousel']
  },
  {
    id: 'naskah',
    zone: 'write',
    nama: 'Penulis Naskah',
    hue: 28,
    status: 'attention',
    sLabel: 'Menunggu persetujuan',
    ringkas: 'Menulis alur story writing, hook emosional, narasi vokal penonton, dan storytelling video viral 9:16.',
    now: 'Menulis alur story writing 4 adegan: hook kaget, empati masalah, demonstrasi trik, dan CTA bookmark.',
    nowAfter: 'Mengonversi ide mentah menjadi naskah dialog bertutur penonton yang relatable.',
    tugas: [
      { t: 'Tulis Hook 3s emosional scroll stopper', d: true },
      { t: 'Rangkai narasi bertutur Masalah & Solusi (Story Writing)', d: true },
      { t: 'Finalisasi punchline CTA persuasif', d: false }
    ],
    out: {
      t: 'Naskah Story Writing (Narasi Bertutur)',
      items: [
        'Hook (0-3s): "Stop! Jangan buru-buru beli lampu studio mahal kalau videomu masih kusam kayak gini!"',
        'Masalah (4-11s): "Banyak kreator salah fokus di kamera mahal, padahal bayangan kasar lampu plafon yang bikin muka kusam."',
        'Solusi (11-22s): "Ambil styrofoam 15 ribuan dari warung, pantulin senter HP kamu. Seketika wajahmu dapet soft glow sinematik!"',
        'CTA (22-30s): "Praktekin trik ini sekarang di kamar kamu, dan simpan video ini biar nggak lupa!"'
      ]
    },
    terima: ['ide', 'perencana'],
    kirim: ['kamera', 'editor']
  },
  {
    id: 'kamera',
    zone: 'prod',
    nama: 'Videographer / Fotografer',
    hue: 155,
    status: 'attention',
    sLabel: 'Perlu orang lapangan',
    ringkas: 'Menyiapkan shot list, storyboard, dan arahan pengambilan gambar.',
    now: 'Shot list siap. Menunggu orang yang merekam di lapangan.',
    tugas: [
      { t: 'Susun shot list 12 adegan', d: true },
      { t: 'Tentukan rasio: 9:16 untuk Reels, TikTok, Shorts; 16:9 untuk YouTube', d: true },
      { t: 'Daftar properti dan lokasi', d: false },
      { t: 'Rekam di lapangan (dikerjakan orang)', d: false }
    ],
    out: {
      t: 'Shot list (contoh)',
      items: [
        '1. Pembuka lebar, 3 detik.',
        '2. Close-up tangan saat proses berjalan.',
        '3. Penutup menghadap kamera.'
      ]
    },
    terima: ['naskah'],
    kirim: ['editor'],
    batas: 'AI tidak merekam di lapangan. Agent ini membuat shot list, storyboard, dan arahan. Yang mengambil gambar tetap orang.',
    aksi: { label: 'Tandai footage sudah masuk', run: 'footage' }
  },
  {
    id: 'editor',
    zone: 'prod',
    nama: 'Editor',
    hue: 120,
    status: 'waiting',
    sLabel: 'Menunggu footage',
    ringkas: 'Menyusun potongan, teks layar, subtitle, dan ukuran ekspor per platform.',
    now: 'Menunggu footage dari lapangan.',
    tugas: [
      { t: 'Terima shot list dan naskah', d: true },
      { t: 'Potong dan susun footage', d: false },
      { t: 'Tambah teks layar dan subtitle', d: false },
      { t: 'Ekspor sesuai rasio tiap platform', d: false }
    ],
    out: {
      t: 'Catatan edit (contoh)',
      items: [
        'Potong jeda di awal, taruh teks hook besar di detik 0 sampai 3.',
        'Buat subtitle otomatis, lalu koreksi manual.',
        'Ekspor 9:16 dengan ukuran 1080 x 1920.'
      ]
    },
    terima: ['kamera'],
    kirim: ['caption'],
    batas: 'AI menyusun daftar potongan dan teks layar. Render akhir tetap lewat aplikasi edit video seperti CapCut.'
  },
  {
    id: 'upload',
    zone: 'pub',
    nama: 'Upload Video',
    sub: 'Tim Pemegang Medsos',
    hue: 60,
    status: 'waiting',
    sLabel: 'Menunggu konten',
    ringkas: 'Mengunggah video ke Instagram, TikTok, dan YouTube sesuai jadwal.',
    now: 'Menunggu video dan caption yang sudah disetujui.',
    nowAfter: 'Menyiapkan unggahan Kamis 19.00 di Instagram dan TikTok.',
    tugas: [
      { t: 'Siapkan judul dan thumbnail', d: false },
      { t: 'Cek rasio dan durasi untuk tiap platform', d: false },
      { t: 'Unggah sesuai jadwal', d: false },
      { t: 'Catat tautan setelah tayang', d: false }
    ],
    out: {
      t: 'Daftar unggahan (contoh)',
      items: [
        'Instagram Reels: Kamis 19.00',
        'TikTok: Kamis 19.00',
        'YouTube Shorts: Jumat 12.00'
      ]
    },
    terima: ['editor', 'caption', 'ceo'],
    kirim: ['story', 'analis'],
    batas: 'Unggah otomatis butuh akses resmi dari tiap platform. Selama belum tersambung, agent menyiapkan file, judul, dan jadwal, lalu Anda yang menekan tayang.'
  },
  {
    id: 'caption',
    zone: 'pub',
    nama: 'Caption',
    sub: 'Tim Pemegang Medsos',
    hue: 335,
    status: 'attention',
    sLabel: 'Menunggu persetujuan',
    ringkas: 'Menulis caption, hashtag, dan ajakan bertindak untuk tiap platform.',
    now: 'Caption Reels dan jadwal Kamis 19.00 menunggu persetujuan Anda.',
    nowAfter: 'Menulis caption untuk konten berikutnya.',
    unlock: 'upload',
    tugas: [
      { t: 'Tulis caption Reels', d: true },
      { t: 'Pilih hashtag dan ajakan menyimpan', d: true },
      { t: 'Sesuaikan versi TikTok dan YouTube', d: false }
    ],
    out: {
      t: 'Caption Reels (contoh)',
      items: [
        '"Satu kebiasaan kecil yang diam-diam menghemat waktu kerja. Simpan untuk nanti."',
        'Jadwal: Kamis 19.00 di Instagram Reels dan TikTok.'
      ]
    },
    terima: ['editor', 'perencana'],
    kirim: ['ceo', 'upload']
  },
  {
    id: 'carousel',
    zone: 'pub',
    nama: 'Carousel',
    sub: 'Tim Pemegang Medsos',
    hue: 355,
    status: 'working',
    sLabel: 'Bekerja',
    ringkas: 'Merancang isi carousel slide demi slide, ukuran 1080 x 1350 (rasio 4:5).',
    now: 'Menyusun 7 slide: satu langkah per slide.',
    tugas: [
      { t: 'Tentukan judul dan struktur 7 slide', d: true },
      { t: 'Tulis teks tiap slide', d: false },
      { t: 'Susun tata letak 1080 x 1350', d: false }
    ],
    out: {
      t: 'Struktur carousel (contoh)',
      items: [
        'Slide 1: judul yang menjanjikan hasil.',
        'Slide 2 sampai 6: satu langkah per slide.',
        'Slide 7: ringkasan dan ajakan menyimpan.'
      ]
    },
    terima: ['ide', 'perencana'],
    kirim: ['ceo', 'upload'],
    batas: 'AI menulis isi dan menata slide. Foto dan elemen visual memakai aset milik Anda.'
  },
  {
    id: 'story',
    zone: 'pub',
    nama: 'Story',
    sub: 'Tim Pemegang Medsos',
    hue: 275,
    status: 'waiting',
    sLabel: 'Menunggu video tayang',
    ringkas: 'Membuat story pendukung: cuplikan, ajakan menonton, dan polling.',
    now: 'Menunggu video tayang untuk dibuatkan story.',
    tugas: [
      { t: 'Pilih cuplikan 10 detik dari video', d: false },
      { t: 'Tambah stiker polling atau pertanyaan', d: false },
      { t: 'Jadwalkan story setelah video tayang', d: false }
    ],
    out: {
      t: 'Rancangan story (contoh)',
      items: [
        'Cuplikan 10 detik dengan teks "Baru tayang".',
        'Stiker pertanyaan: "Mau bahas apa lagi?"'
      ]
    },
    terima: ['upload'],
    kirim: ['komentar']
  },
  {
    id: 'komentar',
    zone: 'pub',
    nama: 'Balas Komentar',
    sub: 'Tim Pemegang Medsos',
    hue: 85,
    status: 'working',
    sLabel: 'Bekerja',
    ringkas: 'Memantau komentar dan menyiapkan draf balasan.',
    now: 'Menyortir komentar baru: pertanyaan, pujian, dan keluhan.',
    tugas: [
      { t: 'Kumpulkan komentar baru', d: true },
      { t: 'Kelompokkan: pertanyaan, pujian, keluhan', d: false },
      { t: 'Tulis draf balasan', d: false }
    ],
    out: {
      t: 'Draf balasan (contoh)',
      items: [
        'Pertanyaan: jawaban singkat, lalu arahkan ke video terkait.',
        'Pujian: ucapan terima kasih yang tidak seragam.',
        'Keluhan: minta maaf, lalu teruskan ke Anda.'
      ]
    },
    terima: ['upload', 'story'],
    kirim: ['dm', 'analis'],
    batas: 'Semua balasan berupa draf sampai Anda setujui. Balasan otomatis yang berlebihan berisiko bagi akun.'
  },
  {
    id: 'dm',
    zone: 'pub',
    nama: 'DM',
    sub: 'Tim Pemegang Medsos',
    hue: 245,
    status: 'attention',
    sLabel: 'Menunggu persetujuan',
    ringkas: 'Menyiapkan draf balasan pesan langsung dari penonton dan calon klien.',
    now: 'Draf balasan pertanyaan harga menunggu persetujuan Anda.',
    nowAfter: 'Menyiapkan draf balasan untuk pesan berikutnya.',
    tugas: [
      { t: 'Tulis draf balasan pertanyaan harga', d: true },
      { t: 'Susun jawaban untuk pertanyaan yang sering muncul', d: false },
      { t: 'Tandai pesan yang harus Anda tangani sendiri', d: false }
    ],
    out: {
      t: 'Draf DM (contoh)',
      items: [
        '"Terima kasih sudah bertanya. Daftar layanan lengkap ada di tautan profil kami."'
      ]
    },
    terima: ['komentar', 'ceo'],
    kirim: ['analis'],
    batas: 'Semua balasan berupa draf sampai Anda setujui. Pesan yang sensitif diteruskan ke Anda.'
  }
];

export const INITIAL_APPROVALS = [
  {
    id: 'a1',
    dari: 'naskah',
    kategori: 'Multimedia',
    judul: '[Multimedia] Naskah Video: 3 Trik Lighting Studio Modal 100 Ribuan',
    ringkas: 'Naskah story writing edukasi video: membedah rahasia pencahayaan sinematik modal hemat dengan teknik bertutur relatable.',
    detail: `Hook (0-3s): "Stop! Jangan buru-buru beli lampu studio mahal kalau video kamu masih kelihatan kusam kayak gini!"
Masalah (4-11s): "Banyak kreator salah fokus di kamera mahal, padahal bayangan kasar dari lampu plafon yang bikin muka kamu berminyak dan gelap."
Solusi (11-22s): "Ambil styrofoam 15 ribuan dari warung, pantulin senter HP kamu ke situ. Lihat, seketika wajahmu dapet soft glow sinematik ala film bioskop!"
CTA (22-30s): "Praktekin trik ini sekarang di kamar kamu, dan simpan video ini biar nggak lupa pas mau syuting!"`,
    naskahStory: {
      hook: "Stop! Jangan buru-buru beli lampu studio mahal kalau video kamu masih kelihatan kusam kayak gini!",
      problem: "Banyak kreator salah fokus di kamera mahal, padahal bayangan kasar dari lampu plafon yang bikin muka kamu berminyak dan gelap.",
      solution: "Ambil styrofoam 15 ribuan dari warung, pantulin senter HP kamu ke situ. Seketika wajahmu dapet soft glow sinematik ala film bioskop!",
      cta: "Praktekin trik ini sekarang di kamar kamu, dan simpan video ini biar nggak lupa pas mau syuting!"
    },
    fypScore: 94,
    alasanFyp: 'Peluang FYP Sangat Tinggi: Alur story writing mengalir tajam, memicu rasa penasaran instan, dan solusi mudah dipraktikkan seketika.',
    state: 'pending'
  },
  {
    id: 'a2',
    dari: 'naskah',
    kategori: 'Design',
    judul: '[Design] Naskah Video: 3 Kesalahan Tipografi yang Bikin Desain Murahan',
    ringkas: 'Naskah story writing edukasi desain grafis: bedah studi kasus font pairing dan hirarki visual yang sering bikin desain gagal estetik.',
    detail: `Hook (0-3s): "Pernah ngerasa desain poster kamu udah rapi, tapi entah kenapa masih kelihatan murahan dan kayak bikinan amatir?"
Masalah (4-11s): "Penyebab utamanya ada di font! Memakai lebih dari tiga jenis font berbeda dalam satu poster bikin mata audiens pusing dan gak fokus."
Solusi (11-22s): "Pakai aturan dua font ini: satu Sans-Serif tegas untuk judul, dan satu Serif elegan untuk isi. Jangan lupa beri ruang bernapas di tepi kanvas!"
CTA (22-30s): "Ketik 'FONT' di kolom komentar, nanti kita spill 5 kombinasi font gratis terbaik buat kamu!"`,
    naskahStory: {
      hook: "Pernah ngerasa desain poster kamu udah rapi, tapi entah kenapa masih kelihatan murahan dan kayak bikinan amatir?",
      problem: "Penyebab utamanya ada di font! Memakai lebih dari tiga jenis font berbeda dalam satu poster bikin mata audiens pusing dan gak fokus.",
      solution: "Pakai aturan dua font ini: satu Sans-Serif tegas untuk judul, dan satu Serif elegan untuk isi. Jangan lupa beri ruang bernapas di tepi kanvas!",
      cta: "Ketik 'FONT' di kolom komentar, nanti kita spill 5 kombinasi font gratis terbaik buat kamu!"
    },
    fypScore: 88,
    alasanFyp: 'Peluang FYP Tinggi: Story writing menyentuh keresahan nyata para desainer dan memiliki rasio komentar serta save yang tinggi.',
    state: 'pending'
  },
  {
    id: 'a3',
    dari: 'naskah',
    kategori: 'Web Development',
    judul: '[Web Dev] Naskah Video: Bikin Animasi 3D Website 60 FPS Tanpa Lag',
    ringkas: 'Naskah story writing coding Three.js: cara elegan menyulap website datar menjadi pengalaman interaktif 3D kelas dunia.',
    detail: `Hook (0-3s): "Jangan bikin website yang ngebosenin cuma berisi teks dan foto diam kalau kamu mau banjir klien!"
Masalah (4-11s): "Banyak developer takut pakai 3D karena mikir bikin laptop user ngehang dan kodingannya ribet setengah mati."
Solusi (11-22s): "Triknya pakai Three.js dengan teknik instanced mesh: performa tetap 60 FPS mulus dan ukuran filenya super ringan!"
CTA (22-30s): "Mau dibuatin website kelas dunia kayak gini? Klik link di bio buat konsultasi bareng tim MMA!"`,
    naskahStory: {
      hook: "Jangan bikin website yang ngebosenin cuma berisi teks dan foto diam kalau kamu mau banjir klien!",
      problem: "Banyak developer takut pakai 3D karena mikir bikin laptop user ngehang dan kodingannya ribet setengah mati.",
      solution: "Triknya pakai Three.js dengan teknik instanced mesh: performa tetap 60 FPS mulus dan ukuran filenya super ringan!",
      cta: "Mau dibuatin website kelas dunia kayak gini? Klik link di bio buat konsultasi bareng tim MMA!"
    },
    fypScore: 91,
    alasanFyp: 'Peluang FYP Sangat Tinggi: Naskah edukasi visual tech interaktif memiliki retensi tontonan tertinggi di segmen tech enthusiast.',
    state: 'pending'
  }
];
