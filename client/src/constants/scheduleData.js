// ============================================================================
// KALENDER OPERASIONAL KANTOR & JADWAL KONTEN MEDSOS MMA PRODUCTION
// ============================================================================
// Setiap hari (Senin s/d Minggu) memiliki jadwal operasional kantor yang BERBEDA-BEDA,
// dan jadwal konten medsos (jam tayang & fase produksi) diselaraskan penuh
// dengan jadwal operasional harian tersebut.
// ============================================================================

export const WEEKLY_SCHEDULE = [
  // --------------------------------------------------------------------------
  // SENIN: MULTIMEDIA DAY (Kickoff Pekanan & Riset Tren Video)
  // Jam Operasional Kantor: 07.00 - 23.00 WIB
  // --------------------------------------------------------------------------
  {
    dayIndex: 1,
    dayName: 'Senin',
    theme: 'Multimedia Day',
    pilar: 'Multimedia',
    officeHours: '07:00 - 23:00 WIB',
    desc: 'Fokus awal pekan: Riset tren audio-visual, kickoff koordinasi alat studio, dan eksekusi video edukasi pencahayaan & shortcut editing.',
    routines: [
      {
        id: 'mon-r1',
        timeStart: '07:00',
        timeEnd: '08:30',
        title: 'Jam Kerja Pagi: Monitoring Tren Audio-Visual & Kalibrasi',
        locationId: 'desk',
        locationLabel: 'Meja Kerja & Studio',
        category: 'work',
        icon: '📊',
        desc: 'Seluruh tim menganalisa tren audio-visual viral di TikTok & Reels, serta menyiapkan daftar topik edukasi mingguan.'
      },
      {
        id: 'mon-r2',
        timeStart: '08:30',
        timeEnd: '09:30',
        title: 'Rapat Koordinasi Kickoff Awal Pekan bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'Pertemuan resmi seluruh tim inti dengan CEO di Ruang Meeting Kaca untuk persetujuan roadmap konten dan target retensi pekan ini.'
      },
      {
        id: 'mon-r3',
        timeStart: '09:30',
        timeEnd: '11:00',
        title: 'Deep Work: Penulisan Naskah Hook 3 Detik & Storyboard Lighting',
        locationId: 'desk',
        locationLabel: 'Meja Penulis & Riset',
        category: 'work',
        icon: '✍️',
        desc: 'Menulis naskah video Reels 30 detik trik pencahayaan studio murah, storyboard sudut kamera 35mm, dan subtitle punchline.'
      },
      {
        id: 'mon-r4',
        timeStart: '11:00',
        timeEnd: '12:00',
        title: 'Publikasi Medsos Slot 1 & Monitoring Respons Awal',
        locationId: 'desk',
        locationLabel: 'Meja Publikasi & Editor',
        category: 'work',
        icon: '🚀',
        desc: 'Tayang otomatis Slot 1 (11:00 WIB) di Reels & TikTok: "3 Trik Lighting Studio Modal 100 Ribuan", dilanjutkan respons komentar.',
        linkedSlotTime: '11:00'
      },
      {
        id: 'mon-r5',
        timeStart: '12:00',
        timeEnd: '13:00',
        title: 'Istirahat Makan Siang & Sholat Dzuhur',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Musholla',
        category: 'break',
        icon: '🍱',
        desc: 'Istirahat resmi kantor MMA: santap siang di area Cafe dan waktu sholat Dzuhur bagi seluruh karyawan.'
      },
      {
        id: 'mon-r6',
        timeStart: '13:00',
        timeEnd: '16:30',
        title: 'Produksi Studio Green Screen & Editing 4K 60fps',
        locationId: 'desk',
        locationLabel: 'Studio Green Screen & Meja Editor',
        category: 'work',
        icon: '🎬',
        desc: 'Perekaman adegan shortcut CapCut PC di studio, color grading DaVinci Resolve Rec.709, dan pemotongan timeline ritmis.'
      },
      {
        id: 'mon-r7',
        timeStart: '16:30',
        timeEnd: '17:30',
        title: 'Rapat Review Pra-Publikasi Sore bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'Quality Control materi video malam bersama CEO di Ruang Meeting Kaca sebelum final rendering dan penjadwalan.'
      },
      {
        id: 'mon-r8',
        timeStart: '17:30',
        timeEnd: '18:30',
        title: 'Rehat Sore, Sholat Maghrib & Coffee Break',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Lounge',
        category: 'break',
        icon: '☕',
        desc: 'Relaksasi sejenak setelah sesi syuting studio intensif dan waktu ibadah Maghrib.'
      },
      {
        id: 'mon-r9',
        timeStart: '18:30',
        timeEnd: '21:30',
        title: 'Prime Time Publikasi Slot 2 (19:00 WIB) & Live Engagement',
        locationId: 'desk',
        locationLabel: 'Meja Publikasi & Interaksi',
        category: 'work',
        icon: '🔥',
        desc: 'Rilis otomatis Slot 2 (19:00 WIB): "Shortcut Rahasia CapCut PC" dan pemantauan rasio simpan/share di 60 menit pertama.',
        linkedSlotTime: '19:00'
      },
      {
        id: 'mon-r10',
        timeStart: '21:30',
        timeEnd: '23:00',
        title: 'Sinkronisasi Database Analitik & Penataan Studio',
        locationId: 'desk',
        locationLabel: 'Meja Kerja & Studio',
        category: 'work',
        icon: '📁',
        desc: 'Menyimpan metrik performa video ke database PostgreSQL dan merapikan peralatan studio sebelum kantor tutup.'
      },
      {
        id: 'mon-r11',
        timeStart: '23:00',
        timeEnd: '07:00',
        title: 'Kantor Tutup & Jam Istirahat Malam',
        locationId: 'dorm',
        locationLabel: 'Asrama Karyawan',
        category: 'sleep',
        icon: '🛏️',
        desc: 'Di luar jam operasional kantor (07.00 - 23.00 WIB). Seluruh karyawan beristirahat tidur di asrama.'
      }
    ],
    slots: [
      {
        id: 'mon-1',
        time: '11:00',
        pilar: 'Multimedia',
        platform: 'Instagram Reels & TikTok',
        format: 'Reels 30s',
        title: '3 Trik Lighting Studio Modal 100 Ribuan',
        hook: 'Jangan beli lampu mahal sebelum tahu trik pantulan dinding ini!',
        status: 'scheduled',
        operationalPhase: 'Diriset pada jam 07:30 WIB, naskah disetujui pada Rapat Kickoff CEO 08:30 WIB, rilis otomatis jam 11:00 WIB.'
      },
      {
        id: 'mon-2',
        time: '19:00',
        pilar: 'Multimedia',
        platform: 'TikTok & Reels',
        format: 'Reels 25s',
        title: 'Shortcut Rahasia CapCut PC: Editing 2x Lebih Cepat',
        hook: 'Trik potong ritme cepat yang dipakai editor pro.',
        status: 'scheduled',
        operationalPhase: 'Diproduksi di Studio 13:00 - 16:30 WIB, lolos QC Rapat CEO 16:30 WIB, rilis prime time jam 19:00 WIB.'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // SELASA: DESIGN DAY (Hierarki Visual, Microblog & Tipografi)
  // Jam Operasional Kantor: 07.00 - 23.00 WIB
  // --------------------------------------------------------------------------
  {
    dayIndex: 2,
    dayName: 'Selasa',
    theme: 'Design Day',
    pilar: 'Design',
    officeHours: '07:00 - 23:00 WIB',
    desc: 'Fokus hari kedua: Standar desain grafis, layout carousel 1080x1350, hierarki tipografi kontras tinggi, dan redesign logo UMKM.',
    routines: [
      {
        id: 'tue-r1',
        timeStart: '07:00',
        timeEnd: '09:00',
        title: 'Jam Kerja Pagi: Audit Feed & Riset Tren Microblog Desain',
        locationId: 'desk',
        locationLabel: 'Meja Desain & UI/UX',
        category: 'work',
        icon: '🎨',
        desc: 'Menganalisis performa carousel kompetitor, rasio simpan infografis, dan kurasi font pairing modern.'
      },
      {
        id: 'tue-r2',
        timeStart: '09:00',
        timeEnd: '10:00',
        title: 'Rapat Kurasi Desain & Palet Warna bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'Review slide cover carousel bersama CEO di Ruang Meeting Kaca: memastikan rule 60-30-10 dan teks cover maksimal 4 kata.'
      },
      {
        id: 'tue-r3',
        timeStart: '10:00',
        timeEnd: '12:00',
        title: 'Produksi Slide Carousel 7-Slide & Copywriting Edukasi',
        locationId: 'desk',
        locationLabel: 'Meja Desainer Carousel & Penulis',
        category: 'work',
        icon: '📐',
        desc: 'Layouting 7 slide resolusi 1080x1350 format PNG uncompressed, pembuatan negative space nyaman untuk layar smartphone.'
      },
      {
        id: 'tue-r4',
        timeStart: '12:00',
        timeEnd: '13:00',
        title: 'Publikasi Medsos Slot 1 (12:00 WIB) & Makan Siang Tim',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Meja Publikasi',
        category: 'work',
        icon: '🚀',
        desc: 'Rilis otomatis Slot 1 (12:00 WIB): Carousel "Kesalahan Tipografi Pemula" bersamaan dengan jadwal makan siang tim secara bergiliran.',
        linkedSlotTime: '12:00'
      },
      {
        id: 'tue-r5',
        timeStart: '13:00',
        timeEnd: '13:30',
        title: 'Relaksasi Singkat & Santai Siang',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Area Santai',
        category: 'break',
        icon: '☕',
        desc: 'Waktu relaksasi mata setelah 3 jam fokus di depan monitor grafis sebelum melanjutkan sesi video screen capture.'
      },
      {
        id: 'tue-r6',
        timeStart: '13:30',
        timeEnd: '16:30',
        title: 'Screen Capture Figma & Animasi Vector Redesign',
        locationId: 'desk',
        locationLabel: 'Meja Desainer UI & Video Editor',
        category: 'work',
        icon: '💻',
        desc: 'Perekaman layar proses redesign logo dalam Figma, kinetic speed-up video, dan audio sound effect klik yang satisfying.'
      },
      {
        id: 'tue-r7',
        timeStart: '16:30',
        timeEnd: '17:30',
        title: 'Rapat Review Visual & Hook Thumbnail bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'Presentasi hasil animasi redesign logo dan pengujian kontras thumbnail di hadapan CEO di Ruang Meeting Kaca.'
      },
      {
        id: 'tue-r8',
        timeStart: '17:30',
        timeEnd: '18:30',
        title: 'Rehat Sore, Sholat Maghrib & Diskusi Desain Santai',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Musholla',
        category: 'break',
        icon: '🌙',
        desc: 'Istirahat sore dan sholat Maghrib bagi seluruh tim kantor MMA.'
      },
      {
        id: 'tue-r9',
        timeStart: '18:30',
        timeEnd: '21:30',
        title: 'Prime Time Publikasi Slot 2 (19:30 WIB) & Feedback Komunitas',
        locationId: 'desk',
        locationLabel: 'Meja Publikasi & Interaksi',
        category: 'work',
        icon: '🔥',
        desc: 'Tayang otomatis Slot 2 (19:30 WIB): Reels "Redesign Logo UMKM dalam 30 Detik" dan pemantauan interaksi desainer di komentar.',
        linkedSlotTime: '19:30'
      },
      {
        id: 'tue-r10',
        timeStart: '21:30',
        timeEnd: '23:00',
        title: 'Arsip Asset Desain Cloud & Export Master File',
        locationId: 'desk',
        locationLabel: 'Meja Kerja Desainer',
        category: 'work',
        icon: '💾',
        desc: 'Mengorganisir folder aset Figma, font license, dan file master ke PostgreSQL sebelum waktu tutup kantor.'
      },
      {
        id: 'tue-r11',
        timeStart: '23:00',
        timeEnd: '07:00',
        title: 'Kantor Tutup & Jam Istirahat Malam',
        locationId: 'dorm',
        locationLabel: 'Asrama Karyawan',
        category: 'sleep',
        icon: '🛏️',
        desc: 'Di luar jam operasional kantor (07.00 - 23.00 WIB). Karyawan beristirahat tidur di asrama.'
      }
    ],
    slots: [
      {
        id: 'tue-1',
        time: '12:00',
        pilar: 'Design',
        platform: 'Instagram',
        format: 'Carousel 7 Slide',
        title: 'Kesalahan Tipografi Pemula yang Bikin Desain Murahan',
        hook: 'Desain kamu kelihatan murah? Cek 3 kesalahan font ini!',
        status: 'scheduled',
        operationalPhase: 'Slide cover disetujui pada Rapat CEO 09:00 WIB, layouting selesai 12:00 WIB, rilis otomatis jam makan siang 12:00 WIB.'
      },
      {
        id: 'tue-2',
        time: '19:30',
        pilar: 'Design',
        platform: 'TikTok & Reels',
        format: 'Reels 30s',
        title: 'Redesign Logo UMKM dalam 30 Detik di Figma',
        hook: 'Mengubah logo jadul jadi modern minimalis.',
        status: 'scheduled',
        operationalPhase: 'Diproduksi lewat Screen Capture Figma 13:30 WIB, ACC final Rapat CEO 16:30 WIB, tayang prime time 19:30 WIB.'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // RABU: WEB DEVELOPMENT DAY (Full-Stack, Three.js 60fps & CSS Modern)
  // Jam Operasional Kantor: 07.00 - 23.00 WIB
  // --------------------------------------------------------------------------
  {
    dayIndex: 3,
    dayName: 'Rabu',
    theme: 'Web Development Day',
    pilar: 'Web Development',
    officeHours: '07:00 - 23:00 WIB',
    desc: 'Fokus tengah pekan: Edukasi coding praktis, demo arsitektur web modern (React + Express + PostgreSQL), optimasi visual 3D, dan tips CSS terkini.',
    routines: [
      {
        id: 'wed-r1',
        timeStart: '07:00',
        timeEnd: '09:00',
        title: 'Jam Kerja Pagi: Standup Teknis & Review Arsitektur Web',
        locationId: 'desk',
        locationLabel: 'Meja Web Developer & Tech Lead',
        category: 'work',
        icon: '💻',
        desc: 'Testing performa rendering Three.js 60fps, memeriksa kecepatan query PostgreSQL, dan merangkum topik edukasi coding viral.'
      },
      {
        id: 'wed-r2',
        timeStart: '09:00',
        timeEnd: '10:00',
        title: 'Rapat Teknis Arsitektur & Performa 60fps bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'Sesi evaluasi teknis bersama CEO di Ruang Meeting Kaca: bedah demonstrasi visual 3D kantor dan kurasi code snippet edukasi.'
      },
      {
        id: 'wed-r3',
        timeStart: '10:00',
        timeEnd: '12:00',
        title: 'Coding Live Sandbox, Snippet CSS & Screen Recording',
        locationId: 'desk',
        locationLabel: 'Meja Web Developer & Editor',
        category: 'work',
        icon: '⚡',
        desc: 'Membuat live demo efek CSS modern tanpa JavaScript berat, merekam visual terminal, dan menambahkan subtitle penjelasan kode.'
      },
      {
        id: 'wed-r4',
        timeStart: '12:00',
        timeEnd: '13:00',
        title: 'Istirahat Makan Siang & Sholat Dzuhur',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Musholla',
        category: 'break',
        icon: '🍱',
        desc: 'Santap siang bersama di Cafe kantor dan ibadah Dzuhur sebelum publikasi konten teknis siang.'
      },
      {
        id: 'wed-r5',
        timeStart: '13:00',
        timeEnd: '14:00',
        title: 'Publikasi Medsos Slot 1 (13:00 WIB) & Diskusi Teknis',
        locationId: 'desk',
        locationLabel: 'Meja Publikasi & Web Dev',
        category: 'work',
        icon: '🚀',
        desc: 'Rilis otomatis Slot 1 (13:00 WIB): Reels "Full-Stack Web Dev: Arsitektur React + Express + PostgreSQL Zero Latency", monitoring tanggapan developer.',
        linkedSlotTime: '13:00'
      },
      {
        id: 'wed-r6',
        timeStart: '14:00',
        timeEnd: '16:30',
        title: 'Desain Infografis Carousel "5 Trik CSS Modern" & Testing',
        locationId: 'desk',
        locationLabel: 'Meja Desainer & Web Dev',
        category: 'work',
        icon: '🧩',
        desc: 'Mengubah kode CSS menjadi infografis visual yang mudah dipahami pemula: nesting CSS murni, subgrid, dan animasi view-transition.'
      },
      {
        id: 'wed-r7',
        timeStart: '16:30',
        timeEnd: '17:30',
        title: 'Rapat Evaluasi Deploy & Code Quality bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'Validasi akurasi teknis slide CSS dan preview konten malam bersama CEO di Ruang Meeting Kaca.'
      },
      {
        id: 'wed-r8',
        timeStart: '17:30',
        timeEnd: '18:30',
        title: 'Rehat Sore & Sholat Maghrib',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Musholla',
        category: 'break',
        icon: '☕',
        desc: 'Istirahat sore dan santai kopi sejenak menjelang jam tayang prime time malam.'
      },
      {
        id: 'wed-r9',
        timeStart: '18:30',
        timeEnd: '21:30',
        title: 'Prime Time Publikasi Slot 2 (19:00 WIB) & Code Q&A',
        locationId: 'desk',
        locationLabel: 'Meja Publikasi & Interaksi',
        category: 'work',
        icon: '🔥',
        desc: 'Tayang otomatis Slot 2 (19:00 WIB): Carousel "5 Trik CSS Modern yang Wajib Diketahui", menjawab pertanyaan coding di kolom komentar.',
        linkedSlotTime: '19:00'
      },
      {
        id: 'wed-r10',
        timeStart: '21:30',
        timeEnd: '23:00',
        title: 'Git Commit, CI/CD Maintenance & Sinkronisasi DB',
        locationId: 'desk',
        locationLabel: 'Meja Web Developer',
        category: 'work',
        icon: '🛠️',
        desc: 'Penyelarasan repositori git, pengecekan build Vite, dan pengarsipan data ke database PostgreSQL sebelum kantor tutup.'
      },
      {
        id: 'wed-r11',
        timeStart: '23:00',
        timeEnd: '07:00',
        title: 'Kantor Tutup & Jam Istirahat Malam',
        locationId: 'dorm',
        locationLabel: 'Asrama Karyawan',
        category: 'sleep',
        icon: '🛏️',
        desc: 'Di luar jam operasional kantor (07.00 - 23.00 WIB). Karyawan beristirahat tidur di asrama.'
      }
    ],
    slots: [
      {
        id: 'wed-1',
        time: '13:00',
        pilar: 'Web Development',
        platform: 'Instagram Reels & TikTok',
        format: 'Reels 30s',
        title: 'Full-Stack Web Dev: Arsitektur React + Express + PostgreSQL Zero Latency',
        hook: 'Bikin web app bisnis yang responsif dan scalable dalam waktu singkat!',
        status: 'scheduled',
        operationalPhase: 'Standup teknis 07:00 WIB, disetujui Rapat CEO 09:00 WIB, rilis otomatis jam 13:00 WIB.'
      },
      {
        id: 'wed-2',
        time: '19:00',
        pilar: 'Web Development',
        platform: 'Instagram',
        format: 'Carousel 7 Slide',
        title: '5 Trik CSS Modern yang Wajib Diketahui Frontend Dev',
        hook: 'Fitur CSS baru yang bikin animasi tanpa library berat.',
        status: 'scheduled',
        operationalPhase: 'Dirancang 14:00 - 16:30 WIB, lolos QC Rapat CEO 16:30 WIB, rilis prime time jam 19:00 WIB.'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // KAMIS: MULTIMEDIA & PRODUCTION DAY (Setup Audio & Color Grading Teal-Orange)
  // Jam Operasional Kantor: 07.00 - 23.00 WIB
  // --------------------------------------------------------------------------
  {
    dayIndex: 4,
    dayName: 'Kamis',
    theme: 'Multimedia & Production Day',
    pilar: 'Multimedia',
    officeHours: '07:00 - 23:00 WIB',
    desc: 'Fokus produksi lanjutan: Kualitas audio podcast anti-bocor, simulasi studio rekaman, teknik color grading sinematik HP, dan ritme video dinamis.',
    routines: [
      {
        id: 'thu-r1',
        timeStart: '07:00',
        timeEnd: '09:00',
        title: 'Jam Kerja Pagi: Kalibrasi Audio Studio & Kurasi Sound FX',
        locationId: 'desk',
        locationLabel: 'Studio & Meja Sound Engineer',
        category: 'work',
        icon: '🎙️',
        desc: 'Uji mikrofon shotgun, noise-reduction audio profile, dan kurasi sound effect woosh/hit untuk materi video hari ini.'
      },
      {
        id: 'thu-r2',
        timeStart: '09:00',
        timeEnd: '10:00',
        title: 'Rapat Koordinasi Audio-Visual bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'Penyelarasan standar audio dan visual bersama CEO di Ruang Meeting Kaca: memastikan kejernihan suara di volume smartphone.'
      },
      {
        id: 'thu-r3',
        timeStart: '10:00',
        timeEnd: '11:30',
        title: 'Desain Carousel Setup Audio Jernih & Diagram Akustik',
        locationId: 'desk',
        locationLabel: 'Meja Desainer & Videographer',
        category: 'work',
        icon: '🎧',
        desc: 'Membuat diagram tata letak peredam suara kamar murah dan setting gain mikrofon yang tepat dalam format 7 slide carousel.'
      },
      {
        id: 'thu-r4',
        timeStart: '11:30',
        timeEnd: '12:30',
        title: 'Publikasi Medsos Slot 1 (11:30 WIB) & Penjadwalan Siang',
        locationId: 'desk',
        locationLabel: 'Meja Publikasi',
        category: 'work',
        icon: '🚀',
        desc: 'Tayang otomatis Slot 1 (11:30 WIB): Carousel "Panduan Setup Audio Jernih Anti-Bocor untuk Podcast", memantau simpan konten.',
        linkedSlotTime: '11:30'
      },
      {
        id: 'thu-r5',
        timeStart: '12:30',
        timeEnd: '13:30',
        title: 'Istirahat Makan Siang & Sholat Dzuhur',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Musholla',
        category: 'break',
        icon: '🍱',
        desc: 'Santap siang tim dan istirahat ibadah Dzuhur di Cafe & Musholla.'
      },
      {
        id: 'thu-r6',
        timeStart: '13:30',
        timeEnd: '16:30',
        title: 'Shooting Praktik Color Grading Teal-Orange Smartphone',
        locationId: 'desk',
        locationLabel: 'Studio Green Screen & Meja Editor',
        category: 'work',
        icon: '🎥',
        desc: 'Pengambilan footage sebelum dan sesudah grading, pengaturan kurva warna HSL, dan penambahan musik sinematik tanpa copyright.'
      },
      {
        id: 'thu-r7',
        timeStart: '16:30',
        timeEnd: '17:30',
        title: 'Rapat QC Konten Sore & Validasi LUT bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'Screening video color grading di berbagai layar smartphone bersama CEO di Ruang Meeting Kaca untuk menjamin akurasi warna.'
      },
      {
        id: 'thu-r8',
        timeStart: '17:30',
        timeEnd: '18:30',
        title: 'Rehat Sore, Sholat Maghrib & Coffee Break',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Lounge',
        category: 'break',
        icon: '☕',
        desc: 'Relaksasi sore tim kantor MMA sebelum rilis video Reels prime time.'
      },
      {
        id: 'thu-r9',
        timeStart: '18:30',
        timeEnd: '21:30',
        title: 'Prime Time Publikasi Slot 2 (19:30 WIB) & Pantau Viralitas',
        locationId: 'desk',
        locationLabel: 'Meja Publikasi & Interaksi',
        category: 'work',
        icon: '🔥',
        desc: 'Rilis otomatis Slot 2 (19:30 WIB): Reels "Color Grading Sinematik Teal & Orange Cuma Pakai HP", membalas komentar penonton.',
        linkedSlotTime: '19:30'
      },
      {
        id: 'thu-r10',
        timeStart: '21:30',
        timeEnd: '23:00',
        title: 'Penataan Studio & Antrean Render Video Malam',
        locationId: 'desk',
        locationLabel: 'Studio & Meja Editor',
        category: 'work',
        icon: '📁',
        desc: 'Menata kembali lighting studio, meletakkan kamera pada docking, dan memproses render batch sebelum kantor tutup.'
      },
      {
        id: 'thu-r11',
        timeStart: '23:00',
        timeEnd: '07:00',
        title: 'Kantor Tutup & Jam Istirahat Malam',
        locationId: 'dorm',
        locationLabel: 'Asrama Karyawan',
        category: 'sleep',
        icon: '🛏️',
        desc: 'Di luar jam operasional kantor (07.00 - 23.00 WIB). Karyawan beristirahat tidur di asrama.'
      }
    ],
    slots: [
      {
        id: 'thu-1',
        time: '11:30',
        pilar: 'Multimedia',
        platform: 'Instagram',
        format: 'Carousel 7 Slide',
        title: 'Panduan Setup Audio Jernih Anti-Bocor untuk Podcast',
        hook: 'Kualitas video 4K percuma kalau suaranya mendem!',
        status: 'scheduled',
        operationalPhase: 'Diriset pada sesi pagi 07:00 WIB, disetujui Rapat CEO 09:00 WIB, terbit otomatis jam 11:30 WIB.'
      },
      {
        id: 'thu-2',
        time: '19:30',
        pilar: 'Multimedia',
        platform: 'TikTok & Reels',
        format: 'Reels 25s',
        title: 'Color Grading Sinematik Teal & Orange Cuma Pakai HP',
        hook: 'Ubah video pucat jadi ala film bioskop dalam 15 detik.',
        status: 'scheduled',
        operationalPhase: 'Syuting studio 13:30 - 16:30 WIB, evaluasi warna Rapat CEO 16:30 WIB, tayang prime time jam 19:30 WIB.'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // JUMAT: DESIGN & FULLSTACK FRIDAY (Spesial Sholat Jumat & Retrospektif)
  // Jam Operasional Kantor: 07.00 - 23.00 WIB (Jeda Ibadah Panjang 11.30 - 13.30)
  // --------------------------------------------------------------------------
  {
    dayIndex: 5,
    dayName: 'Jumat',
    theme: 'Design & Fullstack Friday',
    pilar: 'Design',
    officeHours: '07:00 - 23:00 WIB (Jeda Sholat Jumat 11.30 - 13.30 WIB)',
    desc: 'Hari Jumat berkah: Penyesuaian jadwal operasional dengan jeda Sholat Jumat panjang (11.30 - 13.30 WIB), publikasi pasca-Jumatan (14.00 WIB), video panjang YouTube 3D kantor malam hari.',
    routines: [
      {
        id: 'fri-r1',
        timeStart: '07:00',
        timeEnd: '09:00',
        title: 'Jam Kerja Pagi: Rekap Metrik Retensi Mingguan',
        locationId: 'desk',
        locationLabel: 'Meja Auditor & Analis Konten',
        category: 'work',
        icon: '📊',
        desc: 'Merekap konten paling viral dari Senin sampai Kamis, menghitung rasio konversi klik, dan menyiapkan bahan evaluasi mingguan.'
      },
      {
        id: 'fri-r2',
        timeStart: '09:00',
        timeEnd: '10:00',
        title: 'Rapat Retrospektif Mingguan bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'Rapat formal mingguan bersama CEO di Ruang Meeting Kaca: evaluasi performa seluruh tim, bonus performa konten viral, dan arahan konten weekend.'
      },
      {
        id: 'fri-r3',
        timeStart: '10:00',
        timeEnd: '11:30',
        title: 'Penyusunan Materi Carousel Landing Page Konversi Tinggi',
        locationId: 'desk',
        locationLabel: 'Meja Desainer UI & Penulis Naskah',
        category: 'work',
        icon: '📐',
        desc: 'Menyiapkan slide carousel edukasi visual hierarchy landing page sebelum jeda ibadah Sholat Jumat dimulai.'
      },
      {
        id: 'fri-r4',
        timeStart: '11:30',
        timeEnd: '13:30',
        title: 'Istirahat Panjang, Sholat Jumat Berjamaah & Makan Siang',
        locationId: 'lunch',
        locationLabel: 'Musholla & Ruang Cafe',
        category: 'break',
        icon: '🕌',
        desc: 'Jadwal operasional khusus Jumat: Seluruh aktivitas kantor dijeda untuk persiapan, pelaksanaan Sholat Jumat berjamaah di Musholla, dan santap siang bersama.'
      },
      {
        id: 'fri-r5',
        timeStart: '13:30',
        timeEnd: '14:30',
        title: 'Publikasi Pasca-Jumatan Slot 1 (14:00 WIB) & Respons Audiens',
        locationId: 'desk',
        locationLabel: 'Meja Publikasi & Interaksi',
        category: 'work',
        icon: '🚀',
        desc: 'Tayang otomatis Slot 1 tepat pukul 14:00 WIB: Carousel "Bedah Layout Landing Page Konversi Tinggi", menangkap audiens yang aktif setelah jam ibadah.',
        linkedSlotTime: '14:00'
      },
      {
        id: 'fri-r6',
        timeStart: '14:30',
        timeEnd: '16:30',
        title: 'Produksi Video Spesial YouTube: Membangun Kantor 3D Interaktif',
        locationId: 'desk',
        locationLabel: 'Meja Editor & Web Developer',
        category: 'work',
        icon: '🎥',
        desc: 'Merangkai tutorial mendalam 10 menit pembuatan web app kantor 3D berbasis React, Three.js, dan PostgreSQL lokal.'
      },
      {
        id: 'fri-r7',
        timeStart: '16:30',
        timeEnd: '17:30',
        title: 'Rapat Approval Final Video YouTube bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'Pengecekan thumbnail YouTube, judul SEO, dan alur video bersama CEO di Ruang Meeting Kaca sebelum render akhir.'
      },
      {
        id: 'fri-r8',
        timeStart: '17:30',
        timeEnd: '18:30',
        title: 'Rehat Sore & Sholat Maghrib',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Musholla',
        category: 'break',
        icon: '☕',
        desc: 'Istirahat sore dan sholat Maghrib menjelang peluncuran video panjang di YouTube.'
      },
      {
        id: 'fri-r9',
        timeStart: '18:30',
        timeEnd: '21:30',
        title: 'Prime Time Publikasi Slot 2 (20:00 WIB) & Live Chat YouTube',
        locationId: 'desk',
        locationLabel: 'Meja Publikasi & Komunitas',
        category: 'work',
        icon: '🔥',
        desc: 'Tayang otomatis Slot 2 (20:00 WIB): Video YouTube "Membangun Kantor 3D Interaktif: Full Stack + Three.js" dan interaksi live chat.',
        linkedSlotTime: '20:00'
      },
      {
        id: 'fri-r10',
        timeStart: '21:30',
        timeEnd: '23:00',
        title: 'Laporan Finansial Konten & Penutupan Pekan Kerja',
        locationId: 'desk',
        locationLabel: 'Meja Administrasi & Database',
        category: 'work',
        icon: '📁',
        desc: 'Rekap database kinerja mingguan penuh dan persiapan mode operasional akhir pekan.'
      },
      {
        id: 'fri-r11',
        timeStart: '23:00',
        timeEnd: '07:00',
        title: 'Kantor Tutup & Jam Istirahat Malam',
        locationId: 'dorm',
        locationLabel: 'Asrama Karyawan',
        category: 'sleep',
        icon: '🛏️',
        desc: 'Di luar jam operasional kantor (07.00 - 23.00 WIB). Karyawan beristirahat tidur di asrama.'
      }
    ],
    slots: [
      {
        id: 'fri-1',
        time: '14:00',
        pilar: 'Design',
        platform: 'Instagram',
        format: 'Carousel 7 Slide',
        title: 'Bedah Layout Landing Page Konversi Tinggi',
        hook: 'Rahasia visual hierarchy yang bikin tombol CTA diklik.',
        status: 'scheduled',
        operationalPhase: 'Diproduksi sebelum Jumatan (10:00 WIB), terbit otomatis setelah Sholat Jumat (14:00 WIB).'
      },
      {
        id: 'fri-2',
        time: '20:00',
        pilar: 'Web Development',
        platform: 'YouTube',
        format: 'Video Panjang 10m',
        title: 'Membangun Kantor 3D Interaktif: Full Stack + Three.js',
        hook: 'Proses lengkap membuat kantor virtual AI dari nol.',
        status: 'scheduled',
        operationalPhase: 'Diedit 14:30 - 16:30 WIB, ACC Rapat CEO 16:30 WIB, premiere YouTube tepat jam 20:00 WIB.'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // SABTU: WEEKEND VIRAL TRICKS (Fleksibel, Jam Buka 08.00 WIB & Praktik Cepat)
  // Jam Operasional Kantor: 08.00 - 23.00 WIB
  // --------------------------------------------------------------------------
  {
    dayIndex: 6,
    dayName: 'Sabtu',
    theme: 'Weekend Viral Tricks',
    pilar: 'Multimedia',
    officeHours: '08:00 - 23:00 WIB',
    desc: 'Jadwal akhir pekan lebih santai: Kantor buka jam 08.00 WIB, fokus konten tips cepat 15 detik yang shareable, trik auto-layout Figma, dan checklist syuting.',
    routines: [
      {
        id: 'sat-r1',
        timeStart: '08:00',
        timeEnd: '09:30',
        title: 'Jam Buka Weekend: Santai Pagi di Cafe & Bedah FYP',
        locationId: 'desk',
        locationLabel: 'Meja Kerja & Cafe',
        category: 'work',
        icon: '🥐',
        desc: 'Kantor Sabtu buka jam 08.00 WIB. Mengamati tren FYP akhir pekan sambil menikmati kopi pagi.'
      },
      {
        id: 'sat-r2',
        timeStart: '09:30',
        timeEnd: '10:30',
        title: 'Rapat Santai Strategi Weekend bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'Diskusi taktis konten santai akhir pekan bersama CEO di Ruang Meeting Kaca: memilih topik tips ringkas yang mudah viral.'
      },
      {
        id: 'sat-r3',
        timeStart: '10:30',
        timeEnd: '12:30',
        title: 'Publikasi Slot 1 (10:30 WIB) & Pembuatan Checklist Syuting',
        locationId: 'desk',
        locationLabel: 'Meja Publikasi & Desain',
        category: 'work',
        icon: '🚀',
        desc: 'Tayang otomatis Slot 1 (10:30 WIB): Reels "Trik Auto-Layout Figma", dilanjutkan desain infografis checklist syuting klien.',
        linkedSlotTime: '10:30'
      },
      {
        id: 'sat-r4',
        timeStart: '12:30',
        timeEnd: '13:30',
        title: 'Istirahat Makan Siang Santai',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Game Corner',
        category: 'break',
        icon: '🍱',
        desc: 'Makan siang santai akhir pekan dan relaksasi di game corner kantor.'
      },
      {
        id: 'sat-r5',
        timeStart: '13:30',
        timeEnd: '16:30',
        title: 'Eksperimen Visual Kreatif & Video Tips Praktis',
        locationId: 'desk',
        locationLabel: 'Studio & Meja Editor',
        category: 'work',
        icon: '🎨',
        desc: 'Eksperimen transisi video baru, preset CapCut/Premiere, dan finalisasi slide carousel checklist syuting.'
      },
      {
        id: 'sat-r6',
        timeStart: '16:30',
        timeEnd: '17:30',
        title: 'Briefing Cepat Konten Sore bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'Pengecekan slide carousel malam minggu bersama CEO di Ruang Meeting Kaca.'
      },
      {
        id: 'sat-r7',
        timeStart: '17:30',
        timeEnd: '18:30',
        title: 'Rehat Sore & Sholat Maghrib',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Musholla',
        category: 'break',
        icon: '☕',
        desc: 'Istirahat sore dan santai kopi menikmati suasana malam minggu.'
      },
      {
        id: 'sat-r8',
        timeStart: '18:30',
        timeEnd: '21:30',
        title: 'Prime Time Publikasi Slot 2 (18:30 WIB) & Live Q&A',
        locationId: 'desk',
        locationLabel: 'Meja Publikasi',
        category: 'work',
        icon: '🔥',
        desc: 'Tayang otomatis Slot 2 (18:30 WIB): Carousel "Checklist Wajib Sebelum Syuting Video Klien", interaksi live di stories.',
        linkedSlotTime: '18:30'
      },
      {
        id: 'sat-r9',
        timeStart: '21:30',
        timeEnd: '23:00',
        title: 'Creative Jamming & Relaksasi Akhir Pekan',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Lounge',
        category: 'break',
        icon: '🎮',
        desc: 'Sesi santai tim bermain game atau menonton referensi film di ruang lounge sebelum jam tidur.'
      },
      {
        id: 'sat-r10',
        timeStart: '23:00',
        timeEnd: '08:00',
        title: 'Kantor Tutup & Jam Istirahat Malam',
        locationId: 'dorm',
        locationLabel: 'Asrama Karyawan',
        category: 'sleep',
        icon: '🛏️',
        desc: 'Di luar jam operasional kantor akhir pekan (08.00 - 23.00 WIB). Karyawan beristirahat tidur di asrama.'
      }
    ],
    slots: [
      {
        id: 'sat-1',
        time: '10:30',
        pilar: 'Design',
        platform: 'TikTok & Reels',
        format: 'Reels 25s',
        title: 'Trik Auto-Layout Figma: Bikin UI Rapi Sekejap',
        hook: 'Stop atur jarak elemen manual satu per satu!',
        status: 'scheduled',
        operationalPhase: 'Disiapkan pada sesi pagi santai 08:30 WIB, terbit otomatis jam 10:30 WIB.'
      },
      {
        id: 'sat-2',
        time: '18:30',
        pilar: 'Multimedia',
        platform: 'Instagram',
        format: 'Carousel 7 Slide',
        title: 'Checklist Wajib Sebelum Syuting Video Klien',
        hook: 'Hal kecil yang sering kelupaan tapi bikin syuting gagal total.',
        status: 'scheduled',
        operationalPhase: 'Diproduksi 13:30 - 16:30 WIB, di-ACC Rapat CEO 16:30 WIB, terbit prime time malam minggu jam 18:30 WIB.'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MINGGU: COMMUNITY & RECAP DAY (Tutup Lebih Awal 22.30 WIB & Story Interaktif)
  // Jam Operasional Kantor: 08.00 - 22.30 WIB
  // --------------------------------------------------------------------------
  {
    dayIndex: 0,
    dayName: 'Minggu',
    theme: 'Community & Recap Day',
    pilar: 'Web Development',
    officeHours: '08:00 - 22:30 WIB (Tutup Lebih Awal)',
    desc: 'Fokus hari Minggu: Keterlibatan komunitas, story polling & kuis interaktif, behind-the-scenes kantor MMA, dan perencanaan jadwal sepekan ke depan. Tutup lebih awal pukul 22.30 WIB.',
    routines: [
      {
        id: 'sun-r1',
        timeStart: '08:00',
        timeEnd: '10:00',
        title: 'Jam Buka Hari Minggu: Monitoring Polling & Kuis Story',
        locationId: 'desk',
        locationLabel: 'Meja Story & Komunitas',
        category: 'work',
        icon: '☕',
        desc: 'Kantor Minggu buka jam 08.00 WIB. Mengumpulkan pertanyaan audiens dari story box seputar karir Multimedia, Desain, dan Web Dev.'
      },
      {
        id: 'sun-r2',
        timeStart: '10:00',
        timeEnd: '11:00',
        title: 'Rapat Evaluasi Mingguan Santai bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'Review ringkas performa akun seminggu penuh bersama CEO di Ruang Meeting Kaca dan penentuan arah konten pekan berikutnya.'
      },
      {
        id: 'sun-r3',
        timeStart: '11:00',
        timeEnd: '12:30',
        title: 'Publikasi Slot 1 (12:00 WIB) & Interaksi Story Q&A',
        locationId: 'desk',
        locationLabel: 'Meja Story & Komunitas',
        category: 'work',
        icon: '🚀',
        desc: 'Tayang otomatis Slot 1 (12:00 WIB): Story Polling & Kuis "Q&A Karir Industri Kreatif", membalas DM yang masuk.',
        linkedSlotTime: '12:00'
      },
      {
        id: 'sun-r4',
        timeStart: '12:30',
        timeEnd: '13:30',
        title: 'Istirahat Makan Siang Santai',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe',
        category: 'break',
        icon: '🍱',
        desc: 'Santap siang tim MMA Production di ruang cafe kantor.'
      },
      {
        id: 'sun-r5',
        timeStart: '13:30',
        timeEnd: '16:30',
        title: 'Dokumentasi BTS Kantor & Penyusunan Kalender Pekan Depan',
        locationId: 'desk',
        locationLabel: 'Studio & Meja Editor',
        category: 'work',
        icon: '🎬',
        desc: 'Editing video Behind The Scenes (BTS) ritme cepat: memperlihatkan bagaimana kantor MMA beroperasi menghasilkan konten edukasi viral.'
      },
      {
        id: 'sun-r6',
        timeStart: '16:30',
        timeEnd: '17:30',
        title: 'Rapat Finalisasi Jadwal Pekan Depan bersama CEO',
        locationId: 'meeting',
        locationLabel: 'Ruang Meeting Kaca (Khusus Rapat CEO)',
        category: 'meeting',
        icon: '💼',
        desc: 'CEO mengunci kalender konten Senin-Minggu depan di Ruang Meeting Kaca: memastikan kesiapan pilar Multimedia, Desain, dan Web Dev.'
      },
      {
        id: 'sun-r7',
        timeStart: '17:30',
        timeEnd: '18:30',
        title: 'Rehat Sore & Sholat Maghrib',
        locationId: 'lunch',
        locationLabel: 'Ruang Cafe & Musholla',
        category: 'break',
        icon: '☕',
        desc: 'Istirahat sore dan sholat Maghrib bagi seluruh tim kantor.'
      },
      {
        id: 'sun-r8',
        timeStart: '18:30',
        timeEnd: '21:00',
        title: 'Prime Time Publikasi Slot 2 (19:00 WIB) & BTS Showcase',
        locationId: 'desk',
        locationLabel: 'Meja Publikasi',
        category: 'work',
        icon: '🔥',
        desc: 'Tayang otomatis Slot 2 (19:00 WIB): Reels "Behind The Scenes: Kantor MMA Production Menghasilkan Konten Seminggu".',
        linkedSlotTime: '19:00'
      },
      {
        id: 'sun-r9',
        timeStart: '21:00',
        timeEnd: '22:30',
        title: 'Rekap Insight Pekanan Penuh & Penutupan Operasional Lebih Awal',
        locationId: 'desk',
        locationLabel: 'Meja Kerja & Database',
        category: 'work',
        icon: '📁',
        desc: 'Menyimpan seluruh metrik engagement mingguan ke PostgreSQL. Kantor tutup lebih awal pukul 22.30 WIB agar tim siap fresh di hari Senin.'
      },
      {
        id: 'sun-r10',
        timeStart: '22:30',
        timeEnd: '07:00',
        title: 'Kantor Tutup (Lebih Awal 22.30 WIB) & Jam Istirahat Malam',
        locationId: 'dorm',
        locationLabel: 'Asrama Karyawan',
        category: 'sleep',
        icon: '🛏️',
        desc: 'Di luar jam operasional hari Minggu (08.00 - 22.30 WIB). Seluruh karyawan beristirahat tidur lebih awal di asrama.'
      }
    ],
    slots: [
      {
        id: 'sun-1',
        time: '12:00',
        pilar: 'Multimedia',
        platform: 'Instagram Story',
        format: 'Story Polling & Kuis',
        title: 'Q&A Karir: Multimedia, Design & Web Development',
        hook: 'Tanya jawab langsung seputar industri kreatif.',
        status: 'scheduled',
        operationalPhase: 'Dikurasi sejak pagi 08:00 WIB, lolos review Rapat CEO 10:00 WIB, rilis interaktif siang 12:00 WIB.'
      },
      {
        id: 'sun-2',
        time: '19:00',
        pilar: 'Web Development',
        platform: 'TikTok & Reels',
        format: 'Reels 30s',
        title: 'Behind The Scenes: Kantor MMA Production Menghasilkan Konten Seminggu',
        hook: 'Intip cara kami memproduksi konten konsisten setiap hari.',
        status: 'scheduled',
        operationalPhase: 'Diproduksi 13:30 - 16:30 WIB, final approval Rapat CEO 16:30 WIB, rilis prime time jam 19:00 WIB.'
      }
    ]
  }
];

// ============================================================================
// FUNGSI HELPER JADWAL & RUTINITAS
// ============================================================================

export function getTodaySchedule(dayIndex) {
  return WEEKLY_SCHEDULE.find(d => d.dayIndex === dayIndex) || WEEKLY_SCHEDULE[0];
}

export function getRoutinesForDay(dayIndex) {
  const day = getTodaySchedule(dayIndex);
  return day.routines || [];
}

// Rutinitas default untuk backward-compatibility
export const DAILY_ROUTINES = WEEKLY_SCHEDULE[0].routines;

/**
 * Mengambil rutinitas operasional yang sedang aktif berdasarkan jam, menit, dan hari (dayIndex).
 * Mendukung jadwal operasional yang BERBEDA-BEDA untuk setiap hari dalam sepekan.
 */
export function getCurrentRoutine(hour, minute, dayIndex = 1) {
  const currentTotalMins = hour * 60 + minute;
  const dayRoutines = getRoutinesForDay(dayIndex);

  for (const r of dayRoutines) {
    const [startH, startM] = r.timeStart.split(':').map(Number);
    const [endH, endM] = r.timeEnd.split(':').map(Number);
    const startMins = startH * 60 + startM;
    let endMins = endH * 60 + endM;

    // Menangani rutinitas malam yang melewati tengah malam (misal 23:00 - 07:00 atau 22:30 - 07:00)
    if (endMins < startMins) {
      if (currentTotalMins >= startMins || currentTotalMins < endMins) {
        return r;
      }
    } else {
      if (currentTotalMins >= startMins && currentTotalMins < endMins) {
        return r;
      }
    }
  }

  return dayRoutines[0] || DAILY_ROUTINES[0];
}
