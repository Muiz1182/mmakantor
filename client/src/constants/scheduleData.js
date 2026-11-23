// Jadwal Publikasi Konten Harian MMA PRODUCTION (Senin - Minggu)
// Fokus Edukasi Viral: Multimedia, Design, Web Development
export const WEEKLY_SCHEDULE = [
  {
    dayIndex: 1,
    dayName: 'Senin',
    theme: 'Multimedia Day',
    slots: [
      {
        id: 'mon-1',
        time: '11:00',
        pilar: 'Multimedia',
        platform: 'Instagram Reels & TikTok',
        format: 'Reels 30s',
        title: '3 Trik Lighting Studio Modal 100 Ribuan',
        hook: 'Jangan beli lampu mahal sebelum tahu trik pantulan dinding ini!',
        status: 'scheduled'
      },
      {
        id: 'mon-2',
        time: '19:00',
        pilar: 'Multimedia',
        platform: 'TikTok & Reels',
        format: 'Reels 25s',
        title: 'Shortcut Rahasia CapCut PC: Editing 2x Lebih Cepat',
        hook: 'Trik potong ritme cepat yang dipakai editor pro.',
        status: 'scheduled'
      }
    ]
  },
  {
    dayIndex: 2,
    dayName: 'Selasa',
    theme: 'Design Day',
    slots: [
      {
        id: 'tue-1',
        time: '12:00',
        pilar: 'Design',
        platform: 'Instagram',
        format: 'Carousel 7 Slide',
        title: 'Kesalahan Tipografi Pemula yang Bikin Desain Murahan',
        hook: 'Desain kamu kelihatan murah? Cek 3 kesalahan font ini!',
        status: 'scheduled'
      },
      {
        id: 'tue-2',
        time: '19:30',
        pilar: 'Design',
        platform: 'TikTok & Reels',
        format: 'Reels 30s',
        title: 'Redesign Logo UMKM dalam 30 Detik di Figma',
        hook: 'Mengubah logo jadul jadi modern minimalis.',
        status: 'scheduled'
      }
    ]
  },
  {
    dayIndex: 3,
    dayName: 'Rabu',
    theme: 'Web Development Day',
    slots: [
      {
        id: 'wed-1',
        time: '13:00',
        pilar: 'Web Development',
        platform: 'Instagram Reels & TikTok',
        format: 'Reels 28s',
        title: 'Cara Bikin Website 3D Interaktif Tanpa Lag',
        hook: 'Website kamu masih 2D membosankan? Coba teknik Three.js ini.',
        status: 'scheduled'
      },
      {
        id: 'wed-2',
        time: '19:00',
        pilar: 'Web Development',
        platform: 'Instagram',
        format: 'Carousel 7 Slide',
        title: '5 Trik CSS Modern yang Wajib Diketahui Frontend Dev',
        hook: 'Fitur CSS baru yang bikin animasi tanpa library berat.',
        status: 'scheduled'
      }
    ]
  },
  {
    dayIndex: 4,
    dayName: 'Kamis',
    theme: 'Multimedia & Production Day',
    slots: [
      {
        id: 'thu-1',
        time: '11:30',
        pilar: 'Multimedia',
        platform: 'Instagram',
        format: 'Carousel 7 Slide',
        title: 'Panduan Setup Audio Jernih Anti-Bocor untuk Podcast',
        hook: 'Kualitas video 4K percuma kalau suaranya mendem!',
        status: 'scheduled'
      },
      {
        id: 'thu-2',
        time: '19:30',
        pilar: 'Multimedia',
        platform: 'TikTok & Reels',
        format: 'Reels 25s',
        title: 'Color Grading Sinematik Teal & Orange Cuma Pakai HP',
        hook: 'Ubah video pucat jadi ala film bioskop dalam 15 detik.',
        status: 'scheduled'
      }
    ]
  },
  {
    dayIndex: 5,
    dayName: 'Jumat',
    theme: 'Design & Fullstack Friday',
    slots: [
      {
        id: 'fri-1',
        time: '14:00',
        pilar: 'Design',
        platform: 'Instagram',
        format: 'Carousel 7 Slide',
        title: 'Bedah Layout Landing Page Konversi Tinggi',
        hook: 'Rahasia visual hierarchy yang bikin tombol CTA diklik.',
        status: 'scheduled'
      },
      {
        id: 'fri-2',
        time: '20:00',
        pilar: 'Web Development',
        platform: 'YouTube',
        format: 'Video Panjang 10m',
        title: 'Membangun Kantor 3D Interaktif: Full Stack + Three.js',
        hook: 'Proses lengkap membuat kantor virtual AI dari nol.',
        status: 'scheduled'
      }
    ]
  },
  {
    dayIndex: 6,
    dayName: 'Sabtu',
    theme: 'Weekend Viral Tricks',
    slots: [
      {
        id: 'sat-1',
        time: '10:30',
        pilar: 'Design',
        platform: 'TikTok & Reels',
        format: 'Reels 25s',
        title: 'Trik Auto-Layout Figma: Bikin UI Rapi Sekejap',
        hook: 'Stop atur jarak elemen manual satu per satu!',
        status: 'scheduled'
      },
      {
        id: 'sat-2',
        time: '18:30',
        pilar: 'Multimedia',
        platform: 'Instagram',
        format: 'Carousel 7 Slide',
        title: 'Checklist Wajib Sebelum Syuting Video Klien',
        hook: 'Hal kecil yang sering kelupaan tapi bikin syuting gagal total.',
        status: 'scheduled'
      }
    ]
  },
  {
    dayIndex: 0,
    dayName: 'Minggu',
    theme: 'Community & Recap Day',
    slots: [
      {
        id: 'sun-1',
        time: '12:00',
        pilar: 'Multimedia',
        platform: 'Instagram Story',
        format: 'Story Polling & Kuis',
        title: 'Q&A Karir: Multimedia, Design & Web Development',
        hook: 'Tanya jawab langsung seputar industri kreatif.',
        status: 'scheduled'
      },
      {
        id: 'sun-2',
        time: '19:00',
        pilar: 'Web Development',
        platform: 'TikTok & Reels',
        format: 'Reels 30s',
        title: 'Behind The Scenes: Kantor MMA Production Menghasilkan Konten Seminggu',
        hook: 'Intip cara kami memproduksi konten konsisten setiap hari.',
        status: 'scheduled'
      }
    ]
  }
];

export function getTodaySchedule(dayIndex) {
  return WEEKLY_SCHEDULE.find(d => d.dayIndex === dayIndex) || WEEKLY_SCHEDULE[0];
}

// ============================================================================
// RUTINITAS HARIAN KANTOR MMA PRODUCTION (07.00 - 23.00 WIB)
// ============================================================================
export const DAILY_ROUTINES = [
  {
    id: 'r-morning-prep',
    timeStart: '07:00',
    timeEnd: '08:30',
    title: 'Morning Coffee & Analytics Check',
    locationId: 'lunch',
    locationLabel: 'Ruang Lunch / Cafe',
    category: 'break',
    icon: '☕',
    desc: 'Karyawan tiba di kantor, cek analitik konten semalam sambil ngopi pagi santai.'
  },
  {
    id: 'r-standup',
    timeStart: '08:30',
    timeEnd: '09:30',
    title: 'Daily Morning Standup Meeting',
    locationId: 'meeting',
    locationLabel: 'Ruang Meeting',
    category: 'meeting',
    icon: '💼',
    desc: 'Rapat koordinasi harian tim Multimedia, Design, dan Web Dev. Sinkronisasi target konten hari ini.'
  },
  {
    id: 'r-focus-1',
    timeStart: '09:30',
    timeEnd: '12:00',
    title: 'Deep Work 1: Naskah & Ide Edukasi',
    locationId: 'desk',
    locationLabel: 'Meja Kerja Masing-masing',
    category: 'work',
    icon: '💻',
    desc: 'Penulisan hook naskah 3 detik, riset topik trending, dan penyusunan slide visual carousel.'
  },
  {
    id: 'r-lunch',
    timeStart: '12:00',
    timeEnd: '13:30',
    title: 'Istirahat Siang & Lunch Break',
    locationId: 'lunch',
    locationLabel: 'Ruang Lunch & Kolam Renang',
    category: 'break',
    icon: '🍱',
    desc: 'Jam makan siang bersama karyawan, santai di cafe, atau relaksasi di tepi kolam renang.'
  },
  {
    id: 'r-focus-2',
    timeStart: '13:30',
    timeEnd: '16:00',
    title: 'Deep Work 2: Syuting Studio & Video Editing',
    locationId: 'desk',
    locationLabel: 'Studio & Meja Editor',
    category: 'work',
    icon: '🎬',
    desc: 'Perekaman di green screen studio, pemotongan video ritme cepat, dan color grading.'
  },
  {
    id: 'r-coffee-ps',
    timeStart: '16:00',
    timeEnd: '16:45',
    title: 'Coffee Break & Gaming Session',
    locationId: 'ps',
    locationLabel: 'Ruang PlayStation & Biliard',
    category: 'break',
    icon: '🎮',
    desc: 'Istirahat sore santai, main biliard atau PS, refresh pikiran agar ide tetap segar.'
  },
  {
    id: 'r-review',
    timeStart: '16:45',
    timeEnd: '18:30',
    title: 'Review Draf & Auto-Approval FYP',
    locationId: 'desk',
    locationLabel: 'Meja Publikasi & CEO',
    category: 'work',
    icon: '🔥',
    desc: 'Evaluasi skor potensi FYP oleh AI Chief Editor dan persiapan rilis konten malam.'
  },
  {
    id: 'r-dinner',
    timeStart: '18:30',
    timeEnd: '19:30',
    title: 'Istirahat Malam & Dinner Break',
    locationId: 'lunch',
    locationLabel: 'Ruang Cafe',
    category: 'break',
    icon: '🌙',
    desc: 'Istirahat makan malam dan waktu sholat Maghrib/Isya bagi tim.'
  },
  {
    id: 'r-eval-meeting',
    timeStart: '19:30',
    timeEnd: '20:30',
    title: 'Evening Meeting: Evaluasi Konten Tayang',
    locationId: 'meeting',
    locationLabel: 'Ruang Meeting',
    category: 'meeting',
    icon: '📊',
    desc: 'Rapat evaluasi performa konten yang baru rilis, membaca retensi penonton dan respon komentar.'
  },
  {
    id: 'r-engagement',
    timeStart: '20:30',
    timeEnd: '22:30',
    title: 'Live Engagement: Balas Komentar & DM',
    locationId: 'desk',
    locationLabel: 'Meja Publikasi',
    category: 'work',
    icon: '💬',
    desc: 'Tim Publikasi aktif membalas komentar masuk dan menyusun draf balasan DM calon klien.'
  },
  {
    id: 'r-wrapup',
    timeStart: '22:30',
    timeEnd: '23:00',
    title: 'Daily Wrap-up & Closing',
    locationId: 'desk',
    locationLabel: 'Meja Kerja',
    category: 'work',
    icon: '📁',
    desc: 'Menyimpan progres harian, backup data kerja ke PostgreSQL, persiapan jam istirahat.'
  },
  {
    id: 'r-sleep',
    timeStart: '23:00',
    timeEnd: '07:00',
    title: 'Kantor Tutup & Night Sleep',
    locationId: 'dorm',
    locationLabel: 'Asrama Karyawan',
    category: 'sleep',
    icon: '🛏️',
    desc: 'Di luar jam kerja kantor (07.00 - 23.00 WIB). Lampu dipadamkan dan karyawan tidur di asrama.'
  }
];

export function getCurrentRoutine(hour, minute) {
  const currentTotalMins = hour * 60 + minute;

  for (const r of DAILY_ROUTINES) {
    const [startH, startM] = r.timeStart.split(':').map(Number);
    const [endH, endM] = r.timeEnd.split(':').map(Number);
    const startMins = startH * 60 + startM;
    let endMins = endH * 60 + endM;

    // Khusus rutinitas malam yang melewati tengah malam (23:00 - 07:00)
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

  return DAILY_ROUTINES[0];
}
