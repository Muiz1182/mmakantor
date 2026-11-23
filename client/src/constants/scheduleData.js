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
        format: 'Reels 33s',
        title: 'Tutorial Bikin Kantor AI: 1-Command Installer Langsung Jadi',
        hook: 'Beli VPS → Paste 1 command → Isi wizard divisi → Kantor AI langsung jalan! Komen KIT buat coba.',
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
    id: 'r-morning-work',
    timeStart: '07:00',
    timeEnd: '09:00',
    title: 'Jam Kerja Pagi: Riset Tren & Analisa Konten',
    locationId: 'desk',
    locationLabel: 'Meja Kerja Masing-masing',
    category: 'work',
    icon: '📊',
    desc: 'Kantor MMA buka jam 07.00 WIB. Seluruh tim langsung bekerja di meja kerja menganalisa retensi & tren pilar edukasi.'
  },
  {
    id: 'r-focus-1',
    timeStart: '09:00',
    timeEnd: '12:00',
    title: 'Deep Work: Naskah, Studio Green Screen & Desain',
    locationId: 'desk',
    locationLabel: 'Meja Kerja Masing-masing',
    category: 'work',
    icon: '💻',
    desc: 'Penulisan hook naskah 3 detik, perekaman di studio green screen, dan pembuatan carousel 7 slide.'
  },
  {
    id: 'r-lunch',
    timeStart: '12:00',
    timeEnd: '13:00',
    title: 'Istirahat Siang & Makan Siang',
    locationId: 'lunch',
    locationLabel: 'Ruang Cafe & Area Santai',
    category: 'break',
    icon: '🍱',
    desc: 'Jam istirahat makan siang resmi dan sholat Dzuhur bagi seluruh karyawan.'
  },
  {
    id: 'r-focus-2',
    timeStart: '13:00',
    timeEnd: '17:30',
    title: 'Jam Kerja Siang: Produksi Studio & Editing Video 4K 60fps',
    locationId: 'desk',
    locationLabel: 'Studio & Meja Editor',
    category: 'work',
    icon: '🎬',
    desc: 'Eksekusi editing video ritme cepat, kinetic subtitle, sound design, dan finishing desain grafis.'
  },
  {
    id: 'r-coffee-ps',
    timeStart: '17:30',
    timeEnd: '18:00',
    title: 'Rehat Sore Sejenak & Sholat Ashar',
    locationId: 'lunch',
    locationLabel: 'Ruang Cafe & Lounge',
    category: 'break',
    icon: '☕',
    desc: 'Istirahat sore sejenak agar konsentrasi tim tetap prima menjelang jam prime time.'
  },
  {
    id: 'r-dinner',
    timeStart: '18:00',
    timeEnd: '18:45',
    title: 'Istirahat Maghrib & Makan Malam',
    locationId: 'lunch',
    locationLabel: 'Ruang Cafe & Musholla',
    category: 'break',
    icon: '🌙',
    desc: 'Istirahat makan malam dan waktu sholat Maghrib bagi tim.'
  },
  {
    id: 'r-engagement',
    timeStart: '18:45',
    timeEnd: '22:30',
    title: 'Prime Time Publikasi Medsos & Interaksi',
    locationId: 'desk',
    locationLabel: 'Meja Publikasi',
    category: 'work',
    icon: '🔥',
    desc: 'Rilis konten video reels/TikTok & carousel di jam prime time 19.00 WIB, monitoring performa & live interaction.'
  },
  {
    id: 'r-wrapup',
    timeStart: '22:30',
    timeEnd: '23:00',
    title: 'Daily Wrap-up & Sinkronisasi DB',
    locationId: 'desk',
    locationLabel: 'Meja Kerja',
    category: 'work',
    icon: '📁',
    desc: 'Menyimpan laporan harian dan data kinerja ke PostgreSQL sebelum kantor tutup.'
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
    desc: 'Di luar jam kerja kantor (07.00 - 23.00 WIB). Karyawan beristirahat tidur di asrama.'
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
