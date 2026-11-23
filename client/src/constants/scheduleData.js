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
