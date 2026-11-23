// ============================================================================
// DATA & PRESET REVIEW VIDEO PRE-UPLOAD (QC & VERIFIKASI KELAYAKAN MEDSOS)
// ============================================================================
// Mensimulasikan hasil video final 9:16 (Reels & TikTok) dari tim Editor & Videographer
// sebelum diteruskan ke Tim Medsos (Upload Video, Caption, Story).
// ============================================================================

export const VIDEO_REVIEW_PRESETS = [
  {
    id: 'a1',
    pilar: 'Multimedia',
    judul: '3 Trik Lighting Studio Modal 100 Ribuan',
    format: 'Reels / TikTok (9:16)',
    durasi: 30,
    resolusi: '4K 60fps (1080x1920)',
    editor: 'Mochammad (Editor AI)',
    videographer: 'Rian (Videographer AI)',
    audioProfile: '-14 LUFS (Vokal Jernih + Lo-Fi Beat Ritmis)',
    colorGrade: 'DaVinci Resolve Rec.709 (High Dynamic Range)',
    hook3sText: 'STOP! Jangan beli lampu mahal sebelum tahu trik pantulan dinding ini!',
    hookScore: 96,
    fypScore: 94,
    fypVerdict: 'SANGAT LAYAK UNGGAH (Peluang FYP 94%)',
    summary: 'Video perbandingan pencahayaan visual ekstrem modal hemat. Menggunakan trik pantulan styrofoam dan senter HP yang menghasilkan estetika sinematik.',
    subtitles: [
      { start: 0, end: 3, text: 'STOP! Jangan beli lampu studio mahal dulu...', highlight: 'STOP! Jangan beli' },
      { start: 3, end: 8, text: 'Ini perbandingan lampu 2 juta vs pantulan styrofoam 15 ribu!', highlight: 'styrofoam 15 ribu!' },
      { start: 8, end: 15, text: 'Trik 1: Tembakkan senter HP ke tembok putih untuk difusi lembut.', highlight: 'difusi lembut.' },
      { start: 15, end: 23, text: 'Trik 2: Pakai kantong kresek putih susu jadi softbox darurat.', highlight: 'softbox darurat.' },
      { start: 23, end: 30, text: 'Simpan video ini biar nggak boncos belanja alat studio!', highlight: 'Simpan video ini!' }
    ],
    beforeAfter: {
      beforeLabel: 'SEBELUM (Lampu Plafon Flat & Bayangan Kasar)',
      afterLabel: 'SESUDAH (Trik 100 Ribu Rec.709 Sinematik)',
      beforeColor: '#2b2a27',
      afterColor: '#ff9a3c'
    },
    qcChecklist: [
      { id: 'qc-hook', label: 'Hook Detik 0-3 (Scroll Stopper)', score: 96, status: 'pass', note: 'Ekspresi visual kaget dan teks kontras kuning-hitam menghentikan scroll seketika.' },
      { id: 'qc-color', label: 'Visual & Color Grading Rec.709', score: 94, status: 'pass', note: 'Grading warna kulit natural, bayangan lembut, bebas noise pada resolusi 4K 60fps.' },
      { id: 'qc-audio', label: 'Audio Loudness & Artikulasi (-14 LUFS)', score: 92, status: 'pass', note: 'Vokal narator jernih di atas BGM, sound effect transisi ritmis tanpa distorsi.' },
      { id: 'qc-safe', label: 'Safe Zone Instagram & TikTok', score: 95, status: 'pass', note: 'Subtitle dan elemen penting berada di zona aman, bebas dari tabrakan tombol like & komentar.' }
    ],
    socialStats: {
      likes: '142.8K',
      comments: '1,248',
      bookmarks: '48.9K',
      shares: '12.4K',
      sound: 'MMA Production • Sound Edukasi Asli',
      caption: '3 Trik lighting studio modal 100 ribu yang bikin video kamu kelihatan sinematik! 🎬 Cuma modal styrofoam dan kresek putih. #videocreator #lightingstudio #tipsediting #mmaproduction #fyp'
    }
  },
  {
    id: 'a2',
    pilar: 'Design',
    judul: '3 Kesalahan Tipografi yang Bikin Desain Kelihatan Murahan',
    format: 'Reels / TikTok (9:16)',
    durasi: 28,
    resolusi: '4K 60fps (1080x1920)',
    editor: 'Mochammad (Editor AI)',
    videographer: 'Rian (Videographer AI)',
    audioProfile: '-14 LUFS (Tempo Cepat + Sound Clicky)',
    colorGrade: 'Adobe Premiere Rec.709 Clean Modern',
    hook3sText: 'Desain kamu masih kelihatan amatir? Cek 3 kesalahan fatal ini!',
    hookScore: 92,
    fypScore: 89,
    fypVerdict: 'SANGAT LAYAK UNGGAH (Peluang FYP 89%)',
    summary: 'Bedah studi kasus font pairing Canva dan layout poster. Memberi solusi font gratis Google yang terlihat mewah seketika.',
    subtitles: [
      { start: 0, end: 3, text: 'Desain kamu masih kelihatan amatir? Cek 3 kesalahan ini!', highlight: 'kelihatan amatir?' },
      { start: 3, end: 9, text: 'Kesalahan 1: Memakai lebih dari 3 font berbeda dalam satu poster.', highlight: 'lebih dari 3 font' },
      { start: 9, end: 17, text: 'Kesalahan 2: Leading teks terlalu rapat sehingga sulit dibaca.', highlight: 'Leading terlalu rapat' },
      { start: 17, end: 23, text: 'Kesalahan 3: Kontras warna teks dan background terlalu tipis.', highlight: 'Kontras terlalu tipis' },
      { start: 23, end: 28, text: 'Gunakan kombinasi Serif + Sans-Serif ini. Share ke desainer!', highlight: 'Share ke desainer!' }
    ],
    beforeAfter: {
      beforeLabel: 'SEBELUM (Font Tabrakan & Leading Berantakan)',
      afterLabel: 'SESUDAH (Hirarki Tipografi Premium)',
      beforeColor: '#3d2525',
      afterColor: '#3b82f6'
    },
    qcChecklist: [
      { id: 'qc-hook', label: 'Hook Detik 0-3 (Scroll Stopper)', score: 92, status: 'pass', note: 'Visual poster perbandingan memicu rasa ingin tahu desainer pemula.' },
      { id: 'qc-color', label: 'Visual & Color Grading Rec.709', score: 90, status: 'pass', note: 'Palet warna kontras tinggi, elemen grafis tajam tanpa blur.' },
      { id: 'qc-audio', label: 'Audio Loudness & Artikulasi (-14 LUFS)', score: 89, status: 'pass', note: 'SFX pop dan whoosh selaras dengan animasi teks.' },
      { id: 'qc-safe', label: 'Safe Zone Instagram & TikTok', score: 94, status: 'pass', note: 'Slide desain tidak terpotong bezel layar ponsel.' }
    ],
    socialStats: {
      likes: '89.4K',
      comments: '874',
      bookmarks: '35.1K',
      shares: '8.9K',
      sound: 'MMA Design • Audio Tutorial Desain',
      caption: 'Stop bikin desain kamu kelihatan murahan cuma gara-gara salah pilih font! 🎨 Simpan rumus kombinasi tipografi ini. #desaincanva #tipografi #graphicdesign #desainmurah #fyp'
    }
  },
  {
    id: 'a3',
    pilar: 'Web Development',
    judul: 'Cara Bikin Animasi 3D di Website Tanpa Bikin Berat',
    format: 'Reels / TikTok (9:16)',
    durasi: 25,
    resolusi: '4K 60fps (1080x1920)',
    editor: 'Mochammad (Editor AI)',
    videographer: 'Rian (Videographer AI)',
    audioProfile: '-14 LUFS (Cyber Lo-Fi + Synth Wave)',
    colorGrade: 'Tech Cyber Grade (Cyan & Dark Indigo)',
    hook3sText: 'Website kamu masih flat 2D membosankan? Coba trik Three.js ini!',
    hookScore: 90,
    fypScore: 88,
    fypVerdict: 'LAYAK UNGGAH (Peluang FYP 88%)',
    summary: 'Tutorial visual singkat integrasi objek 3D low-poly ke website dengan optimasi lazy-loading agar browser tetap ngebut 60fps.',
    subtitles: [
      { start: 0, end: 3, text: 'Website kamu masih 2D membosankan? Coba trik ini!', highlight: '2D membosankan?' },
      { start: 3, end: 9, text: 'Export objek 3D dari Blender dengan kompresi Draco glTF.', highlight: 'kompresi Draco glTF' },
      { start: 9, end: 17, text: 'Gunakan Three.js dengan lazy-loading dan shadow map low-res.', highlight: 'Three.js lazy-loading' },
      { start: 17, end: 25, text: 'Hasilnya: Website interaktif 60fps tanpa nge-lag di HP kentang!', highlight: 'Website 60fps!' }
    ],
    beforeAfter: {
      beforeLabel: 'SEBELUM (Landing Page Flat 2D Statis)',
      afterLabel: 'SESUDAH (3D Interaktif 60fps Halus)',
      beforeColor: '#1e2430',
      afterColor: '#10b981'
    },
    qcChecklist: [
      { id: 'qc-hook', label: 'Hook Detik 0-3 (Scroll Stopper)', score: 90, status: 'pass', note: 'Gerakan objek 3D interaktif di awal video langsung menarik mata developer.' },
      { id: 'qc-color', label: 'Visual & Color Grading Rec.709', score: 92, status: 'pass', note: 'Tampilan teks kode syntax highlight terbaca sangat jernih.' },
      { id: 'qc-audio', label: 'Audio Loudness & Artikulasi (-14 LUFS)', score: 88, status: 'pass', note: 'Artikulasi penjelasan teknis padat dan mudah dipahami.' },
      { id: 'qc-safe', label: 'Safe Zone Instagram & TikTok', score: 93, status: 'pass', note: 'Potongan kode terhindar dari panel komentar kanan bawah.' }
    ],
    socialStats: {
      likes: '64.2K',
      comments: '512',
      bookmarks: '28.7K',
      shares: '6.3K',
      sound: 'MMA Tech • Synth Code Ambience',
      caption: 'Bikin website interaktif kelas dunia dengan 3D tanpa bikin laptop user ngebul! 💻 Tutorial Three.js tercepat. #webdevelopment #threejs #javascript #coding #fyp'
    }
  }
];

export function getVideoReviewPreset(idOrPilar) {
  if (!idOrPilar) return VIDEO_REVIEW_PRESETS[0];
  const foundById = VIDEO_REVIEW_PRESETS.find(p => p.id === idOrPilar);
  if (foundById) return foundById;
  const foundByPilar = VIDEO_REVIEW_PRESETS.find(p => p.pilar.toLowerCase() === String(idOrPilar).toLowerCase());
  return foundByPilar || VIDEO_REVIEW_PRESETS[0];
}
