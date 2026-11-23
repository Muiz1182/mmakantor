import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ============================================================================
// KOORDINAT SEKAT DENAH ARSITEKTUR KANTOR MEWAH (Isometric Office Plan)
// ============================================================================
const ROOM_DEFS = {
  // 1. Ruang Kerja Eksekutif & Studio
  ceo:      { id: 'ceo',      label: 'Ruang CEO',            x0: -26, x1: -14, z0: -21, z1: -10, floor: 'wood',   door: { x: -14, z: -15, axis: 'x' } },
  meeting:  { id: 'meeting',  label: 'Ruang Meeting Kaca',   x0: -12, x1: 0,   z0: -21, z1: -10, floor: 'wood',   door: { x: -6,  z: -10, axis: 'z' }, isGlass: true },
  plan:     { id: 'plan',     label: 'Ruang Strategi & Ide', x0: 2,   x1: 13,  z0: -21, z1: -10, floor: 'wood',   door: { x: 7.5, z: -10, axis: 'z' } },
  prod:     { id: 'prod',     label: 'Studio Multimedia',    x0: 15,  x1: 27,  z0: -21, z1: -10, floor: 'studio', door: { x: 15,  z: -15, axis: 'x' } },

  // 2. Ruang Kerja Terbuka (Pilar Edukasi: Multimedia, Design, Web Dev)
  pub:      { id: 'pub',      label: 'Workstations Edukasi', x0: -11, x1: 11,  z0: 12,  z1: 22,  floor: 'wood',   door: { x: 0,   z: 12,  axis: 'z' } },

  // 3. Ruang Santai & Fasilitas Kantor Lengkap
  lunch:    { id: 'lunch',    label: 'Cafe & Bar Terrace',   x0: 14,  x1: 27,  z0: -7,  z1: 2,   floor: 'cafe',   door: { x: 14,  z: -2.5,axis: 'x' } },
  ps:       { id: 'ps',       label: 'Billiard & Lounge',    x0: 14,  x1: 27,  z0: 4,   z1: 12,  floor: 'ps',     door: { x: 14,  z: 8,   axis: 'x' } },
  pool:     { id: 'pool',     label: 'Kolam Renang & Deck',  x0: -8,  x1: 8,   z0: -4,  z1: 7,   floor: 'pool',   door: { x: 0,   z: -4,  axis: 'z' }, isGlass: true },
  musholla: { id: 'musholla', label: 'Musholla',             x0: -26, x1: -14, z0: 12,  z1: 22,  floor: 'musholla',door: { x: -14, z: 17, axis: 'x' } },
  gym:      { id: 'gym',      label: 'Gym & Fitness',        x0: 14,  x1: 27,  z0: 14,  z1: 22,  floor: 'gym',    door: { x: 14,  z: 18,  axis: 'x' } },
  dorm:     { id: 'dorm',     label: 'Asrama Karyawan',      x0: -26, x1: -14, z0: -7,  z1: 6,   floor: 'dorm',   door: { x: -14, z: -0.5,axis: 'x' } }
};

// Spot posisi per ruangan (kursi, ranjang, karpet, dll.)
const ROOM3 = {
  meeting: {
    dx: -6,
    entry: [[-6, -7], [-6, -11]],
    spots: [
      [-8.5, -14, 's', -6, -15.5, 0],
      [-8.5, -17, 's', -6, -15.5, 0],
      [-3.5, -14, 's', -6, -15.5, 0],
      [-3.5, -17, 's', -6, -15.5, 0],
      [-6, -12.5, 's', -6, -15.5, 0],
      [-6, -18.5, 's', -6, -15.5, 0]
    ]
  },
  lunch: {
    dx: 14,
    entry: [[11, -2.5], [16, -2.5]],
    spots: [
      [17, -1, 's', 17, -4, 0],
      [21, -1, 's', 21, -4, 0],
      [17, -4.5, 's', 17, -1, 0],
      [21, -4.5, 's', 21, -1, 0],
      [24, -2.5, 's', 20, -2.5, 0]
    ]
  },
  ps: {
    dx: 14,
    entry: [[11, 8], [16, 8]],
    spots: [
      [18, 6, 's', 20, 8, 0],
      [22, 6, 's', 20, 8, 0],
      [18, 10, 's', 20, 8, 0],
      [22, 10, 's', 20, 8, 0],
      [20, 8, 's', 20, 11, 0]
    ]
  },
  pool: {
    dx: 0,
    entry: [[0, -6], [0, -3]],
    spots: [
      [-4.5, -1, 'w', 0, -1, 0.2],
      [4.5, -1, 'w', 0, -1, 0.2],
      [-4.5, 4, 'w', 0, 4, 0.2],
      [4.5, 4, 'w', 0, 4, 0.2],
      [0, 1.5, 'w', 0, 1.5, 0.2]
    ]
  },
  musholla: {
    dx: -14,
    entry: [[-11, 17], [-16, 17]],
    spots: [
      [-22, 14.5, 's', -25, 17, 0],
      [-18, 14.5, 's', -25, 17, 0],
      [-22, 19.5, 's', -25, 17, 0],
      [-18, 19.5, 's', -25, 17, 0]
    ]
  },
  gym: {
    dx: 14,
    entry: [[11, 18], [16, 18]],
    spots: [
      [17, 16, 'w', 17, 21, 0.2],
      [20, 16, 'w', 20, 21, 0.2],
      [23, 16, 'w', 23, 21, 0.2],
      [19, 19.5, 's', 19, 16, 0]
    ]
  },
  dorm: {
    dx: -14,
    entry: [[-11, -0.5], [-16, -0.5]],
    spots: [
      [-21.5, -3.5, 'l', -22.5, -3.5, 0.78],
      [-16.5, -3.5, 'l', -17.5, -3.5, 0.78],
      [-21.5, 2.5, 'l', -22.5, 2.5, 0.78],
      [-16.5, 2.5, 'l', -17.5, 2.5, 0.78]
    ]
  }
};

function wrapAngle(a) {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
}

function roundRect(ctx, px, py, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(px + r, py);
  ctx.lineTo(px + w - r, py);
  ctx.quadraticCurveTo(px + w, py, px + w, py + r);
  ctx.lineTo(px + w, py + h - r);
  ctx.quadraticCurveTo(px + w, py + h, px + w - r, py + h);
  ctx.lineTo(px + r, py + h);
  ctx.quadraticCurveTo(px, py + h, px, py + h - r);
  ctx.lineTo(px, py + r);
  ctx.quadraticCurveTo(px, py + r, px, py);
  ctx.closePath();
}

export function initOfficeScene(canvas, { onSelectAgent, getAgentsData, getThemeTokens, onPipelineEvent, getOfficeContext }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (err) {
    console.warn('WebGLRenderer initialization failed:', err);
    return null;
  }

  // ============================================================================
  // GENERATOR OBROLAN DINAMIS KANTOR MMA (Kontekstual, Anti-Monoton & Anti-Slop)
  // Menyesuaikan dengan keadaan nyata kantor: pekerjaan a.now, jam kerja, antrean, pilar edukasi
  // ============================================================================
  function getDynamicDialogue(agentId, contextType = 'idle', targetId = null) {
    const allAgents = getAgentsData ? getAgentsData() : [];
    const agent = allAgents.find(a => a.id === agentId);
    const targetAgent = targetId ? allAgents.find(a => a.id === targetId) : null;
    const ctx = getOfficeContext ? getOfficeContext() : {};
    const todayTheme = ctx.todayTheme || 'Multimedia & Visual AI';

    // 1. Serah terima materi pipeline estafet antar divisi (Handover Sender)
    if (contextType === 'handover_sender' && targetAgent) {
      const senderLines = {
        analis: [
          `${targetAgent.nama}, data retensi konten ${todayTheme} sudah saya petakan. Hook 3 detik awal paling tinggi angka simpan dan bagikannya!`,
          `Pola performa 20 konten terakhir sudah siap. Penonton suka konten ringkas to-the-point, tolong olah jadi ide ya!`,
          `Analisa retensi penonton baru beres. Ada peluang viral besar di topik hari ini, silakan diracik konsepnya!`
        ],
        ide: [
          `${targetAgent.nama}, 3 konsep hook viral untuk ${todayTheme} sudah saya susun. Tolong tuangkan ke naskah dan shot list ya!`,
          `Ini daftar sudut pandang konten edukasi hari ini. Sudut masalahnya relevan banget, tolong tulis draf script-nya!`,
          `Konsep ide edukasi praktis sudah siap. Formatnya kita buat 30 detik padat isi, silakan dibuatkan naskahnya!`
        ],
        naskah: [
          `${targetAgent.nama}, naskah 30 detik dan breakdown shot list sudah selesai. Studio green screen bisa langsung take!`,
          `Naskah edukasi ${todayTheme} sudah matang dengan hook provokatif di 2 detik awal. Siap untuk pengambilan gambar di studio!`,
          `Shot list 3 adegan dan naskah presenter sudah ready. Peralatan dan lighting studio sudah bisa disesuaikan!`
        ],
        kamera: [
          `${targetAgent.nama}, rekaman footage 4K 60fps dan audio studio sudah siap. File sudah masuk ke folder produksi, silakan dipotong!`,
          `Take rekaman di studio green screen selesai, lighting 3-point dan audio sudah bersih. Tolong dieksekusi di timeline!`,
          `Footage kamera sinematik sudah lengkap sesuai storyboard. Silakan pasang cut list dan ritme potongan dinamis!`
        ],
        editor: targetId === 'upload' ? [
          `Halo tim medsos! Master video 4K 60fps untuk jadwal upload sudah selesai di-render dan lulus QC. Tolong segera dikelola dan diunggah ke Reels & TikTok!`,
          `Tim Medsos, master video edukasi ${todayTheme} sudah rampung lengkap dengan kinetic subtitle & audio jernih. Silakan diproses untuk rilis sekarang!`,
          `Master video sudah siap di folder sharing! Tolong tim medsos koordinasikan caption, cover, dan publish ke semua platform!`
        ] : [
          `${targetAgent.nama}, video Reels 4K selesai di-render dengan kinetic subtitle. Tolong buatkan cover thumbnail kontras tinggi dan carousel pendukung!`,
          `Timeline video sudah rampung dengan color grading Rec.709. Tolong rancang thumbnail 9:16 dan slide edukasi 7 halaman!`,
          `Render final video edukasi sudah beres. Visual carousel pendukung dan cover eye-catching tolong disiapkan!`
        ],
        carousel: [
          `Pak CEO, seluruh paket materi edukasi ${todayTheme} sudah lengkap. Draf video dan desain slide siap direview di antrean persetujuan!`,
          `Pak CEO, materi konten hari ini sudah selesai dirancang dengan visual bersih. Mohon ditinjau kelayakannya untuk jadwal prime time!`,
          `Pak CEO, paket konten siap publish: video 4K, thumbnail CTR tinggi, dan carousel edukasi sudah masuk di dashboard persetujuan!`
        ],
        ceo: [
          `${targetAgent.nama}, konten edukasi hari ini sudah saya setujui. Tolong jadwalkan tayang otomatis di jam prime time 19.00 WIB!`,
          `Materi sangat tajam dan edukatif. Sudah saya approve, segera koordinasikan jadwal rilis ke seluruh platform medsos!`,
          `Persetujuan selesai. Pastikan caption, tagar, dan thumbnail terpasang sempurna untuk rilis malam nanti!`
        ]
      };

      const lines = senderLines[agentId];
      if (lines && lines.length > 0) {
        return lines[Math.floor(Math.random() * lines.length)];
      }
    }

    // 2. Respon penerima serah terima estafet (Handover Target)
    if (contextType === 'handover_target' && targetAgent) {
      const targetLines = {
        ide: [
          `Siap ${targetAgent.nama}! Langsung saya olah jadi konsep konten yang segar dan mudah dipahami penonton.`,
          `Diterima! Data ini pas banget buat bikin hook edukasi yang relevan dengan tren saat ini.`,
          `Sip! Segera saya rumuskan 3 angle ide terbaik untuk dieksekusi tim produksi.`
        ],
        naskah: [
          `Mantap ${targetAgent.nama}! Langsung saya tulis naskah padat isi dengan hook 2 detik pertama yang nampol.`,
          `Oke, naskah 30 detik segera saya selesaikan lengkap dengan panduan intonasi presenter.`,
          `Siap! Saya pastikan alur naskahnya mengalir tanpa kalimat bertele-tele.`
        ],
        kamera: [
          `Keren ${targetAgent.nama}! Studio green screen, lensa 35mm, dan lighting 3-point sudah ready, langsung take!`,
          `Siap! Framing kamera dan mikrofon clip-on sudah diset, pengambilan gambar segera dimulai.`,
          `Sip, storyboard-nya jelas banget. Kami eksekusi adegannya di studio sekarang.`
        ],
        editor: [
          `Diterima ${targetAgent.nama}! Langsung saya import ke timeline, pasang cut list cepat, dan grading warna sinematik.`,
          `Mantap! Saya racik transisi ritmis dan sound effect pas agar retensi penonton terjaga sampai akhir.`,
          `Sip! Saya selesaikan potongan video 4K 60fps ini agar siap tepat waktu.`
        ],
        carousel: [
          `Siap ${targetAgent.nama}! Saya buatkan cover thumbnail dengan hierarki teks tegas dan carousel 7 slide yang rapi.`,
          `Diterima! Saya gunakan format 1080x1350 dengan negative space lega agar nyaman dibaca di layar smartphone.`,
          `Oke! Visual pendukungnya segera saya selesaikan dengan gaya visual konsisten.`
        ],
        ceo: [
          `Terima kasih! Saya evaluasi draf konten dan potensi skor FYP-nya di antrean persetujuan sekarang.`,
          `Bagus sekali! Saya periksa kelengkapan pesan edukasinya sebelum disetujui tayang.`,
          `Materi saya terima. Segera saya tinjau kualitasnya di dashboard persetujuan.`
        ],
        upload: targetAgent?.id === 'editor' ? [
          `Siap Tim Editing! Master video 4K 60fps kami terima. Langsung kami pasang cover thumbnail CTR tinggi, caption SEO, dan jadwalkan rilis sekarang!`,
          `Mantap Tim Editing! File video sudah masuk sistem publikasi multi-platform (Instagram, TikTok, YouTube).`,
          `Diterima! Tim medsos langsung bergerak mengelola postingan dan menyiapkan teaser story!`
        ] : [
          `Siap Pak CEO! Metadata, cover, caption, dan jam tayang jadwal operasional langsung dikunci di sistem publikasi.`,
          `Laksanakan Pak CEO! Semua aset konten sudah ready untuk dipublikasikan otomatis.`,
          `Siap! Kami pantau interaksi awal dan performa retensinya begitu konten mengudara.`
        ]
      };

      const lines = targetLines[agentId];
      if (lines && lines.length > 0) {
        return lines[Math.floor(Math.random() * lines.length)];
      }
    }

    // 3. Obrolan Rapat Resmi CEO di Ruang Meeting (Meeting Dialogues)
    if (contextType === 'meeting') {
      const meetingReports = {
        ceo: [
          `Evaluasi performa konten: pastikan pesan edukasi kita tetap padat, praktis, dan mudah dipraktekkan audiens.`,
          `Bagaimana progres kesiapan paket konten edukasi ${todayTheme} untuk rilis prime time hari ini?`,
          `Fokus kita menjaga kualitas hook dan visual di level tertinggi tanpa ada detail yang terlewat.`
        ],
        analis: [
          `Data analitik: video edukasi dengan hook langsung di 3 detik awal mempertahankan 68% audiens sampai akhir.`,
          `Rasio simpan carousel tips minggu ini naik 35%, audiens paling menyukai format panduan langkah demi langkah.`,
          `Pola waktu unggah terbaik tetap di jam 19.00 WIB saat audiens aktif beristirahat malam.`
        ],
        ide: [
          `Tim riset menyiapkan turunan topik ${todayTheme} dengan pendekatan komparasi visual sebelum dan sesudah.`,
          `Kami menyaring 10 ide mentah menjadi 3 konsep terkuat yang paling relevan dengan masalah audiens.`,
          `Setiap konsep edukasi dirancang memiliki 1 pesan kunci yang tajam dan mudah diingat.`
        ],
        kamera: [
          `Peralatan studio green screen, pencahayaan 3-point, dan mikrofon studio sudah dikalibrasi optimal.`,
          `Sudut pengambilan gambar lensa 35mm menghasilkan kedalaman visual yang fokus dan profesional.`,
          `Jadwal rekaman presenter sudah disinkronkan dengan kesiapan naskah dari tim penulisan.`
        ],
        editor: [
          `Standar editing 4K 60fps dengan ritme potongan cepat dan kinetic subtitle sudah diterapkan konsisten.`,
          `Color grading Rec.709 memastikan warna tetap natural dan kontras di semua tipe layar smartphone.`,
          `Transisi ritmis di beat musik terbukti menjaga tempo video tetap dinamis dari awal hingga penutup.`
        ],
        carousel: [
          `Hierarki visual 60-30-10 dan format 1080x1350 memastikan kenyamanan membaca di mobile.`,
          `Cover slide dengan kontras tinggi dan teks maksimal 4 kata terbukti mendongkrak rasio klik (CTR).`,
          `Slide penutup selalu dilengkapi ajakan menyimpan referensi yang jelas dan elegan.`
        ]
      };

      const lines = meetingReports[agentId] || meetingReports.analis;
      return lines[Math.floor(Math.random() * lines.length)];
    }

    // 4. Tanggapan Rekan Kerja di Meja (Desk Reply)
    if (contextType === 'desk_reply') {
      const replies = [
        `Bener banget, formula itu terbukti paling konsisten performanya di akun kita.`,
        `Setuju, nanti kita sinkronkan lagi pas review materi sebelum rilis malam.`,
        `Mantap, hasilnya kelihatan rapi dan profesional banget.`,
        `Sip, nanti pas rilis jam 19.00 WIB kita pantau bareng respon di 10 menit pertama.`,
        `Keren, ritme kerja tim hari ini beneran solid dan terstruktur.`
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    // 5. Obrolan Spontan Nyata Sesuai Pekerjaan Karyawan Saat Ini (Desk Chat)
    if (agent) {
      if (agent.now && agent.now.length > 15 && Math.random() < 0.45) {
        return `Sedang fokus: ${agent.now}`;
      }

      const roleThoughts = {
        auditor: [
          `Lagi cek keselarasan palet warna feed: konsistensi visual terbukti bikin akun kelihatan jauh lebih kredibel.`,
          `Bio akun perlu dibuat lebih to-the-point: sebutkan solusi apa yang kita tawarkan dalam 5 kata pertama.`,
          `Gaya sampul highlight sudah diseragamkan dengan tema ${todayTheme} agar profil terlihat rapi.`
        ],
        analis: [
          `Grafik retensi membuktikan: 3 detik pertama menentukan 70% keberhasilan video edukasi.`,
          `Konten format komparasi visual paling banyak disimpan audiens minggu ini.`,
          `Rasio share konten melonjak saat kita membahas solusi praktis yang langsung bisa dicoba.`
        ],
        ide: [
          `Fokus kita hari ini: 1 video, 1 masalah spesifik, 1 langkah solusi konkret tanpa basa-basi.`,
          `Format micro-learning 20-30 detik sedang jadi format yang paling disukai algoritma.`,
          `Lagi godok topik edukasi ${todayTheme} dengan studi kasus nyata yang sering dialami kreator.`
        ],
        perencana: [
          `Jadwal konten pekan ini sudah dipetakan rapi agar audiens mendapatkan insight rutin setiap hari.`,
          `Jam tayang prime time 19.00 WIB di Instagram dan TikTok tetap jadi jendela rilis paling efektif.`,
          `Variasi topik harian Multimedia, Design, dan Web Dev menjaga channel tetap variatif dan mendidik.`
        ],
        naskah: [
          `Lagi poles hook kalimat pembuka: buang intro klise, langsung tembak inti masalah di detik ke-2.`,
          `Naskah edukasi yang bagus itu padat, renyah, dan memakai bahasa sehari-hari yang santai tapi berbobot.`,
          `Struktur naskah 3 bagian: hook rasa penasaran, demonstrasi solusi, dan call to action to-the-point.`
        ],
        kamera: [
          `Lighting 3-point di studio sudah optimal: bayangan halus bikin subjek presenter berdimensi.`,
          `Sudut kamera 45 derajat dengan lensa fixed 35mm menghasilkan kedalaman ruang yang sinematik.`,
          `Perekaman green screen butuh pencahayaan latar yang rata agar proses chroma key di editing zero noise.`
        ],
        editor: [
          `Editing video ritme cepat: potong jeda nafas presenter agar tempo video tidak drop di tengah jalan.`,
          `Grading warna LUT Rec.709 sudah pas di layar smartphone, kontras dan saturasi kulit terlihat alami.`,
          `Kinetic subtitle dengan font Sans-Serif tebal memudahkan audiens yang menonton tanpa menyalakan suara.`
        ],
        carousel: [
          `Hierarki visual 60-30-10: dominasi ruang bersih agar pesan utama langsung tertangkap mata pembaca.`,
          `Tata letak 1080x1350 rasio 4:5 memanfaatkan area layar HP secara maksimal dibanding format kotak 1:1.`,
          `Desain slide edukasi harus memandu mata pembaca secara berurutan dari judul ke poin utama.`
        ],
        caption: [
          `Paragraf pertama caption berfungsi sebagai hook kedua setelah video: harus memancing orang membaca tuntas.`,
          `Pilihan 5 tagar relevan terbukti lebih efektif menjangkau audiens tepat dibanding menumpuk 30 tagar acak.`,
          `Ajakan menyimpan referensi di penutup caption terbukti mendongkrak algoritma save.`
        ],
        upload: [
          `Pengecekan resolusi file 1080x1920 dan framerate 60fps sudah sesuai standar kualitas tayang.`,
          `Integrasi sistem otomatis memastikan konten mengudara tepat waktu sesuai jadwal operasional kantor.`,
          `Seluruh aset rilis konten malam ini sudah terverifikasi di folder publikasi.`
        ],
        story: [
          `Teaser story 10 detik dengan stiker pertanyaan interaktif disiapkan untuk mendongkrak engagement awal.`,
          `Polling sederhana di story efektif memancing pengikut untuk ikut berpendapat sebelum video utama rilis.`,
          `Interaksi story menjaga hubungan dua arah yang hangat dengan audiens MMA Production.`
        ],
        komentar: [
          `Menjawab pertanyaan teknis audiens di kolom komentar dengan ramah membangun komunitas yang loyal.`,
          `Feedback dan pertanyaan di komentar sering kali jadi sumber ide konten edukasi berikutnya.`,
          `Draf tanggapan untuk komentar masuk sudah disusun rapi dan menunggu kurasi.`
        ],
        dm: [
          `Menyusun draf balasan pesan langsung dengan informasi layanan yang jelas dan profesional.`,
          `Pertanyaan calon klien seputar kerjasama produksi langsung diteruskan ke CEO untuk follow-up.`,
          `Respon cepat pada pesan masuk mencerminkan profesionalitas agensi kreatif modern.`
        ],
        ceo: [
          `Fokus kita di MMA Production adalah konsistensi value edukasi berkualitas tinggi yang berdampak nyata.`,
          `Antrean persetujuan selalu saya tinjau dari sudut pandang kemanfaatan konten bagi audiens.`,
          `Kolaborasi antar divisi berjalan solid dan sistematis, target rilis hari ini siap tercapai.`
        ]
      };

      const lines = roleThoughts[agentId];
      if (lines && lines.length > 0) {
        return lines[Math.floor(Math.random() * lines.length)];
      }
    }

    return `Fokus menyelesaikan tugas ${todayTheme} tepat waktu.`;
  }
  renderer.setClearColor(0x0e1726, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();

  // Kamera Isometrik Arsitektur (~32 deg FOV, miring 45 derajat)
  const camera = new THREE.PerspectiveCamera(34, 1, 1, 500);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.screenSpacePanning = true;
  controls.minPolarAngle = 0.3;
  controls.maxPolarAngle = 1.35;
  controls.minDistance = 15;
  controls.maxDistance = 140;

  // Pencahayaan Hangat Arsitektural (Warm Sunlight & Sky Bounce)
  const hemi = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.85);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfffaec, 1.35);
  sun.position.set(-38, 55, 38);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0003;
  const sc = sun.shadow.camera;
  sc.left = -42; sc.right = 42; sc.top = 42; sc.bottom = -42; sc.near = 10; sc.far = 150;
  sc.updateProjectionMatrix();
  scene.add(sun);
  scene.add(sun.target);
  sun.target.position.set(0, 0, 0);

  const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.45);
  fillLight.position.set(32, 42, -32);
  scene.add(fillLight);

  // Lampu Interior Ruangan
  const interiorLights = [];
  function addRoomLight(color, intensity, x, y, z, dist = 24) {
    const pl = new THREE.PointLight(color, intensity, dist, 1.8);
    pl.position.set(x, y, z);
    scene.add(pl);
    interiorLights.push({ light: pl, baseIntensity: intensity });
    return pl;
  }

  addRoomLight(0xfef08a, 0.95, -20, 4.5, -15, 24);   // Ruang CEO hangat
  addRoomLight(0x38bdf8, 0.95, -6, 4.5, -15, 24);    // Ruang Meeting Kaca
  addRoomLight(0xf8fafc, 0.85, 7.5, 4.5, -15, 24);   // Ruang Strategi & Ide
  addRoomLight(0x10b981, 1.1, 21, 4.5, -15, 26);     // Studio Multimedia Green Screen
  addRoomLight(0xfdba74, 0.85, 20, 4.0, -2.5, 24);   // Cafe & Bar Terrace
  addRoomLight(0xc084fc, 0.95, 20, 4.0, 8, 22);      // Billiard & Lounge
  addRoomLight(0x06b6d4, 1.2, 0, 2.0, 1.5, 26);      // Kolam renang glow
  addRoomLight(0x34d399, 0.95, -20, 4.0, 17, 24);    // Musholla
  addRoomLight(0xf59e0b, 0.95, 20, 4.0, 18, 24);     // Gym & Fitness
  addRoomLight(0xfef08a, 0.7, -20, 3.8, -0.5, 22);   // Asrama tidur
  addRoomLight(0x38bdf8, 0.85, 0, 4.2, 17, 26);      // Workstations Terbuka

  // Konfigurasi Siklus Waktu (Pagi, Siang, Sore, Malam, Jam Tidur)
  const TIME_CONFIGS = {
    morning: {
      clearColor: 0x111c2e,
      hemiSky: 0xdbeafe,
      hemiGround: 0x1e293b,
      hemiInt: 0.85,
      sunCol: 0xfff5e6,
      sunInt: 1.25,
      sunPos: [-38, 52, 38],
      fillCol: 0xfef08a,
      fillInt: 0.45,
      roomIntMul: 0.55
    },
    day: {
      clearColor: 0x13233c,
      hemiSky: 0xffffff,
      hemiGround: 0x334155,
      hemiInt: 0.95,
      sunCol: 0xffffff,
      sunInt: 1.4,
      sunPos: [-20, 65, 20],
      fillCol: 0x93c5fd,
      fillInt: 0.5,
      roomIntMul: 0.4
    },
    dusk: {
      clearColor: 0x221730,
      hemiSky: 0xf472b6,
      hemiGround: 0x1e1b4b,
      hemiInt: 0.7,
      sunCol: 0xfb923c,
      sunInt: 1.15,
      sunPos: [45, 28, -20],
      fillCol: 0xfdba74,
      fillInt: 0.5,
      roomIntMul: 1.1
    },
    night: {
      clearColor: 0x090e18,
      hemiSky: 0x1e293b,
      hemiGround: 0x030712,
      hemiInt: 0.4,
      sunCol: 0x60a5fa,
      sunInt: 0.4,
      sunPos: [-30, 45, -30],
      fillCol: 0x3b82f6,
      fillInt: 0.25,
      roomIntMul: 1.5
    },
    sleep: {
      clearColor: 0x05080f,
      hemiSky: 0x0f172a,
      hemiGround: 0x020617,
      hemiInt: 0.22,
      sunCol: 0x1e3a8a,
      sunInt: 0.2,
      sunPos: [-20, 40, -20],
      fillCol: 0x172554,
      fillInt: 0.12,
      roomIntMul: 0.25
    }
  };

  let currentPhase = 'morning';

  function setTimePhase(phase) {
    const cfg = TIME_CONFIGS[phase] || TIME_CONFIGS.morning;
    currentPhase = phase;
    renderer.setClearColor(cfg.clearColor, 1);
    hemi.color.setHex(cfg.hemiSky);
    hemi.groundColor.setHex(cfg.hemiGround);
    hemi.intensity = cfg.hemiInt;

    sun.color.setHex(cfg.sunCol);
    sun.intensity = cfg.sunInt;
    sun.position.set(cfg.sunPos[0], cfg.sunPos[1], cfg.sunPos[2]);

    fillLight.color.setHex(cfg.fillCol);
    fillLight.intensity = cfg.fillInt;

    interiorLights.forEach(({ light, baseIntensity }) => {
      light.intensity = baseIntensity * cfg.roomIntMul;
    });
  }

  const lam = (color, opts = {}) => new THREE.MeshLambertMaterial({ color, ...opts });
  const bxg = (w, h, d) => new THREE.BoxGeometry(w, h, d);

  // Material Library
  const M = {
    floorHall:    lam(0xf1f5f9), // Ubin marmer koridor terang mewah
    floorWood:    lam(0x9a6b43), // Lantai kayu parquet hangat alami
    floorDorm:    lam(0x8f6542), // Lantai asrama kayu
    floorStudio:  lam(0x18181b), // Studio lantai hitam doff
    floorCafe:    lam(0xb47948), // Cafe ubin kayu jati
    floorPS:      lam(0x2d2a4a), // PS lounge karpet gelap
    floorPool:    lam(0x38bdf8), // Deck kolam renang
    floorMusholla:lam(0x0f5132), // Karpet hijau musholla saf islami
    floorGym:     lam(0x1e2229), // Lantai karet gym gelap
    wall:         lam(0x475569), // Sekat dinding arsitektural
    wallGlass:    new THREE.MeshPhysicalMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.38, roughness: 0.08, transmission: 0.85 }),
    woodDesk:     lam(0x8a5a36),
    woodDark:     lam(0x3e271a),
    metalChrome:  new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2, metalness: 0.8 }),
    blackLeather: lam(0x1e293b),
    water:        new THREE.MeshPhysicalMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.82, roughness: 0.1 }),
    greenScreen:  lam(0x10b981),
    bedSheet:     lam(0xf8fafc),
    pillow:       lam(0x38bdf8),
    billiard:     lam(0x15803d),
    plantGreen:   lam(0x15803d)
  };

  function mk(geo, mat, x, y, z, parent = scene, noShadow = false) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    if (!noShadow) m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  function B(w, h, d, colOrMat, x, y, z, parent = scene, noShadow = false) {
    const mat = typeof colOrMat === 'number' ? lam(colOrMat) : colOrMat;
    return mk(bxg(w, h, d), mat, x, y, z, parent, noShadow);
  }

  const nodes = {};
  const pickables = [];
  let hoverId = null;
  let selectedId = 'ceo';
  let chatActive = true;

  // =========================================================================
  // 1. LANTAI DASAR PLATFORM ARSITEKTURAL MEWAH (Expanded Architectural Base)
  // =========================================================================
  // Pondasi bawah beton
  mk(bxg(64, 0.6, 54), lam(0x0f172a), 0, -0.35, 0, scene, true);
  // Marmer koridor utama
  mk(bxg(62, 0.1, 52), M.floorHall, 0, 0.0, 0, scene, true);

  // Border list kayu elegan di sekeliling pinggiran denah
  B(62.4, 0.18, 0.4, M.woodDark, 0, 0.06, -26);
  B(62.4, 0.18, 0.4, M.woodDark, 0, 0.06, 26);
  B(0.4, 0.18, 52.4, M.woodDark, -31, 0.06, 0);
  B(0.4, 0.18, 52.4, M.woodDark, 31, 0.06, 0);

  // =========================================================================
  // 2. LANTAI TIAP RUANGAN (Parquet, Karpet, Ubin)
  // =========================================================================
  Object.values(ROOM_DEFS).forEach(r => {
    const w = r.x1 - r.x0;
    const d = r.z1 - r.z0;
    const cx = (r.x0 + r.x1) / 2;
    const cz = (r.z0 + r.z1) / 2;

    let mat = M.floorWood;
    if (r.floor === 'dorm') mat = M.floorDorm;
    else if (r.floor === 'studio') mat = M.floorStudio;
    else if (r.floor === 'cafe') mat = M.floorCafe;
    else if (r.floor === 'ps') mat = M.floorPS;
    else if (r.floor === 'pool') mat = M.floorPool;
    else if (r.floor === 'musholla') mat = M.floorMusholla;
    else if (r.floor === 'gym') mat = M.floorGym;

    mk(bxg(w, 0.08, d), mat, cx, 0.04, cz, scene, true);
  });

  // =========================================================================
  // 3. SEKAT DINDING ARSITEKTUR & PINTU (Wall Partitions & Glass Mullions)
  // =========================================================================
  const WALL_H = 2.1;
  const WALL_T = 0.28;
  const DOOR_W = 2.4;

  function buildWalledRoom(r, isGlass = false) {
    const mat = isGlass ? M.wallGlass : M.wall;
    const w = r.x1 - r.x0;
    const d = r.z1 - r.z0;
    const cx = (r.x0 + r.x1) / 2;
    const cz = (r.z0 + r.z1) / 2;
    const y = WALL_H / 2 + 0.04;

    // Dinding Utara (z0)
    if (r.door.axis === 'z' && Math.abs(r.door.z - r.z0) < 0.5) {
      const w1 = r.door.x - r.x0 - DOOR_W / 2;
      const w2 = r.x1 - (r.door.x + DOOR_W / 2);
      if (w1 > 0.1) B(w1, WALL_H, WALL_T, mat, r.x0 + w1 / 2, y, r.z0);
      if (w2 > 0.1) B(w2, WALL_H, WALL_T, mat, r.x1 - w2 / 2, y, r.z0);
    } else {
      B(w, WALL_H, WALL_T, mat, cx, y, r.z0);
    }

    // Dinding Selatan (z1)
    if (r.door.axis === 'z' && Math.abs(r.door.z - r.z1) < 0.5) {
      const w1 = r.door.x - r.x0 - DOOR_W / 2;
      const w2 = r.x1 - (r.door.x + DOOR_W / 2);
      if (w1 > 0.1) B(w1, WALL_H, WALL_T, mat, r.x0 + w1 / 2, y, r.z1);
      if (w2 > 0.1) B(w2, WALL_H, WALL_T, mat, r.x1 - w2 / 2, y, r.z1);
    } else {
      B(w, WALL_H, WALL_T, mat, cx, y, r.z1);
    }

    // Dinding Barat (x0)
    if (r.door.axis === 'x' && Math.abs(r.door.x - r.x0) < 0.5) {
      const d1 = r.door.z - r.z0 - DOOR_W / 2;
      const d2 = r.z1 - (r.door.z + DOOR_W / 2);
      if (d1 > 0.1) B(WALL_T, WALL_H, d1, mat, r.x0, y, r.z0 + d1 / 2);
      if (d2 > 0.1) B(WALL_T, WALL_H, d2, mat, r.x0, y, r.z1 - d2 / 2);
    } else {
      B(WALL_T, WALL_H, d, mat, r.x0, y, cz);
    }

    // Dinding Timur (x1)
    if (r.door.axis === 'x' && Math.abs(r.door.x - r.x1) < 0.5) {
      const d1 = r.door.z - r.z0 - DOOR_W / 2;
      const d2 = r.z1 - (r.door.z + DOOR_W / 2);
      if (d1 > 0.1) B(WALL_T, WALL_H, d1, mat, r.x1, y, r.z0 + d1 / 2);
      if (d2 > 0.1) B(WALL_T, WALL_H, d2, mat, r.x1, y, r.z1 - d2 / 2);
    } else {
      B(WALL_T, WALL_H, d, mat, r.x1, y, cz);
    }

    // List Kusen Pintu & Plakat Lantai
    const c = document.createElement('canvas');
    c.width = 380; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 380, 64);
    ctx.font = '700 24px "IBM Plex Mono", monospace';
    ctx.fillStyle = isGlass ? '#38bdf8' : '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(r.label.toUpperCase(), 190, 32);

    const tex = new THREE.CanvasTexture(c);
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.5), new THREE.MeshBasicMaterial({ map: tex }));
    pl.rotation.x = -Math.PI / 2;
    pl.position.set(cx, 0.09, r.door.axis === 'z' ? r.door.z : r.z1 - 0.4);
    scene.add(pl);
  }

  Object.values(ROOM_DEFS).forEach(r => {
    buildWalledRoom(r, r.id === 'ceo' || r.isGlass);
  });

  // =========================================================================
  // 4. TANAMAN HIAS & POT PEMISAH KORIDOR (Lush Planter Boxes & Hedges)
  // =========================================================================
  function createPlanterHedge(x, z, len, axis = 'x') {
    const isX = axis === 'x';
    const pw = isX ? len : 0.7;
    const pd = isX ? 0.7 : len;
    // Kotak kayu planter
    B(pw, 0.45, pd, M.woodDark, x, 0.22, z);
    // Daun tanaman rimbun hijau
    B(pw - 0.1, 0.55, pd - 0.1, M.plantGreen, x, 0.65, z);
  }

  createPlanterHedge(-6, 11, 8, 'x');
  createPlanterHedge(6, 11, 8, 'x');
  createPlanterHedge(13, -2.5, 5, 'z');
  createPlanterHedge(-13, 11, 5, 'z');

  // =========================================================================
  // 5. FASILITAS PUSAT: KOLAM RENANG & TEAK DECK & CAFE
  // =========================================================================
  // Cekungan air kolam toska jernih berkilau
  const poolWater = mk(bxg(13, 0.45, 9), M.water, 0, 0.15, 1.5, scene, true);
  // Pinggiran ubin marmer putih kolam
  B(14.2, 0.22, 0.6, 0xffffff, 0, 0.22, -3.2);
  B(14.2, 0.22, 0.6, 0xffffff, 0, 0.22, 6.2);
  B(0.6, 0.22, 9.6, 0xffffff, -6.8, 0.22, 1.5);
  B(0.6, 0.22, 9.6, 0xffffff, 6.8, 0.22, 1.5);

  // Kursi santai berjemur (Sun Loungers) + Meja Minuman di tepi kolam
  [[-4.8, -1], [4.8, -1], [-4.8, 4], [4.8, 4]].forEach(([lx, lz]) => {
    // Rangka lounger kayu
    B(2.4, 0.22, 0.95, M.woodDark, lx, 0.22, lz);
    // Bantalan kasur lounger putih
    B(2.2, 0.12, 0.9, M.bedSheet, lx, 0.38, lz);
    // Handuk toska resort
    B(0.8, 0.14, 0.88, lam(0x06b6d4), lx + (lx > 0 ? -0.7 : 0.7), 0.42, lz);
    // Meja cocktail kecil & gelas
    B(0.5, 0.45, 0.5, M.woodDark, lx, 0.225, lz + (lz > 1.5 ? 0.9 : -0.9));
    B(0.12, 0.2, 0.12, lam(0xfef08a), lx, 0.55, lz + (lz > 1.5 ? 0.9 : -0.9));
  });

  // Cafe & Bar: Meja Bar Kayu Panjang + 3 Kursi Bar Tinggi + Mesin Espresso
  B(7.0, 1.1, 1.2, M.woodDark, 20.5, 0.55, -5.5);
  B(7.0, 0.1, 1.3, M.woodDesk, 20.5, 1.15, -5.5); // Top meja marmer/kayu
  // Mesin Espresso Chrome & Kulkas Minuman
  B(1.0, 0.65, 0.6, M.metalChrome, 18, 1.5, -5.5);
  B(0.9, 2.0, 0.8, lam(0x334155), 23, 1.0, -5.5);
  // Kursi Bar Tinggi Chrome
  [17.5, 20.5, 23.5].forEach(bx => {
    B(0.45, 0.08, 0.45, M.blackLeather, bx, 0.75, -4.2);
    B(0.08, 0.72, 0.08, M.metalChrome, bx, 0.36, -4.2);
  });

  // =========================================================================
  // 6. MUSHOLLA (Ruang Ibadah Karpet Hijau Saf, Mihrab Lengkung & Minbar)
  // =========================================================================
  // Saf garis emas di atas karpet hijau
  for (let sz = 13.5; sz <= 20.5; sz += 2.2) {
    B(11.5, 0.02, 0.15, lam(0xd4af37), -20, 0.09, sz);
  }
  // Mihrab ceruk lengkung kiblat di dinding barat
  B(0.3, 1.9, 2.6, lam(0xd4af37), -25.8, 1.0, 17);
  B(0.2, 1.8, 2.4, lam(0x0f5132), -25.7, 1.0, 17);
  // Minbar kayu khutbah bertingkat
  B(1.2, 0.5, 1.0, M.woodDark, -24.8, 0.25, 14.5);
  B(1.0, 0.9, 0.8, M.woodDark, -24.8, 0.65, 14.2);
  // Rak Al-Qur'an dan partisi pembatas sandal di pintu
  B(0.5, 1.2, 2.0, M.woodDark, -25.5, 0.6, 20.5);
  B(0.6, 0.4, 1.8, M.woodDark, -14.5, 0.2, 14.5);

  // =========================================================================
  // 7. GYM & FITNESS (Treadmill Digital, Spin Bike, Matras & Dumbbell)
  // =========================================================================
  // Matras senam kuning cerah di lantai karet
  B(9.0, 0.02, 3.5, lam(0xeab308), 20.5, 0.09, 19.5);
  // 3 Unit Treadmill Modern Berlayar Digital
  function createTreadmill(tx, tz) {
    // Sabuk lari miring
    B(1.1, 0.22, 2.4, lam(0x18181b), tx, 0.15, tz);
    // Tiang penyangga konsol
    B(0.08, 1.2, 0.08, M.metalChrome, tx - 0.45, 0.7, tz + 0.9);
    B(0.08, 1.2, 0.08, M.metalChrome, tx + 0.45, 0.7, tz + 0.9);
    // Pegangan tangan & Layar digital
    B(1.0, 0.08, 0.35, lam(0x334155), tx, 1.28, tz + 0.9);
    B(0.6, 0.35, 0.05, lam(0x38bdf8), tx, 1.48, tz + 0.92);
  }
  createTreadmill(17, 16);
  createTreadmill(20.5, 16);
  createTreadmill(24, 16);
  // Rak Beban Dumbbell
  B(0.5, 0.85, 3.0, M.metalChrome, 26, 0.45, 19.5);

  // =========================================================================
  // 8. RUANG BILLIARD & LOUNGE (Tournament Billiard, Sofa & 85" OLED)
  // =========================================================================
  // Meja Billiard Profesional Karpet Hijau
  B(4.4, 0.75, 2.5, M.woodDark, 20.5, 0.38, 7.5);
  B(4.0, 0.1, 2.1, M.billiard, 20.5, 0.8, 7.5);
  // Bola-bola billiard & stik
  B(0.25, 0.08, 0.25, lam(0xffffff), 21.2, 0.88, 7.5);
  B(0.05, 0.05, 2.6, lam(0xd4a373), 20.5, 0.87, 8.8);
  // Sofa empuk & TV OLED besar
  B(4.2, 0.65, 1.4, lam(0x1e293b), 20.5, 0.35, 11);
  B(3.8, 1.8, 0.1, lam(0x0f172a), 20.5, 1.8, 4.2);
  B(3.6, 1.6, 0.04, lam(0x38bdf8), 20.5, 1.8, 4.26);

  // =========================================================================
  // 9. RUANG MEETING KACA (Meja Rapat Konferensi, 6 Kursi, Layar Smart TV)
  // =========================================================================
  B(5.4, 0.76, 2.4, M.woodDark, -6, 0.38, -15.5);
  B(4.6, 0.04, 1.8, M.blackLeather, -6, 0.77, -15.5);
  B(0.35, 0.74, 1.6, M.metalChrome, -8, 0.37, -15.5);
  B(0.35, 0.74, 1.6, M.metalChrome, -4, 0.37, -15.5);
  // Layar Smart TV Presentasi KPI Edukasi & Jadwal Rapat CEO
  B(4.6, 2.4, 0.1, lam(0x0f172a), -6, 2.2, -20.88);
  
  function createMeetingScreenTexture(isMeetingActive) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext('2d');

    if (isMeetingActive) {
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#0c4a6e';
      ctx.fillRect(12, 12, 488, 232);

      ctx.font = '700 24px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('RAPAT KOORDINASI DENGAN CEO', 30, 48);

      ctx.font = '600 16px "Inter", sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('EVALUASI VIRAL: MULTIMEDIA, DESIGN, WEB DEV', 30, 78);

      const bars = [
        { label: 'Multimedia', val: 180, col: '#38bdf8' },
        { label: 'Design', val: 210, col: '#a855f7' },
        { label: 'Web Dev', val: 155, col: '#34d399' }
      ];
      bars.forEach((b, i) => {
        const x = 30 + i * 160;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, 105, 130, 105);
        ctx.fillStyle = b.col;
        const h = (b.val / 250) * 80;
        ctx.fillRect(x + 10, 195 - h, 110, h);
        ctx.font = '700 14px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(b.label, x + 20, 222);
      });
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(16, 16, 480, 224);

      ctx.font = '700 22px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText('RUANG MEETING KACA (STANDBY)', 256, 105);

      ctx.font = '500 15px "Inter", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Khusus Agenda Rapat Resmi Bersama CEO', 256, 140);
      ctx.fillText('Bukan Area Santai Karyawan', 256, 168);
    }
    return new THREE.CanvasTexture(c);
  }

  const meetingScreenMat = new THREE.MeshBasicMaterial({ map: createMeetingScreenTexture(false) });
  const meetingScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 2.1), meetingScreenMat);
  meetingScreenMesh.position.set(-6, 2.2, -20.82);
  scene.add(meetingScreenMesh);
  // 6 Kursi Eksekutif di Sekeliling Meja Rapat
  function createMeetingChair(x, z, ry) {
    const cg = new THREE.Group();
    cg.position.set(x, 0, z);
    cg.rotation.y = ry;
    scene.add(cg);
    B(0.75, 0.1, 0.75, M.blackLeather, 0, 0.45, 0, cg);
    B(0.75, 0.8, 0.1, M.blackLeather, 0, 0.85, 0.35, cg);
    B(0.1, 0.45, 0.1, M.metalChrome, 0, 0.22, 0, cg);
    B(0.6, 0.05, 0.6, M.metalChrome, 0, 0.02, 0, cg);
  }
  createMeetingChair(-8.5, -14, Math.PI / 2);
  createMeetingChair(-8.5, -17, Math.PI / 2);
  createMeetingChair(-3.5, -14, -Math.PI / 2);
  createMeetingChair(-3.5, -17, -Math.PI / 2);
  createMeetingChair(-6, -12.5, Math.PI);
  createMeetingChair(-6, -18.5, 0);

  // =========================================================================
  // 10. STUDIO MULTIMEDIA (Cyclorama Green Screen, Kamera Sinema & Softbox)
  // =========================================================================
  B(9.0, 2.8, 0.1, M.greenScreen, 21, 1.4, -20.88);
  B(9.0, 0.05, 4.5, M.greenScreen, 21, 0.07, -18.5);
  function createSoftbox(x, z) {
    B(0.1, 2.5, 0.1, M.metalChrome, x, 1.25, z);
    B(1.5, 1.8, 0.35, lam(0x18181b), x, 2.5, z);
    B(1.3, 1.6, 0.05, lam(0xffffff), x - 0.1, 2.5, z + 0.18);
  }
  createSoftbox(17, -17);
  createSoftbox(25, -17);
  // Kamera Sinema di Atas Tripod
  B(0.1, 1.5, 0.1, M.metalChrome, 21, 0.75, -14);
  B(0.5, 0.35, 0.7, lam(0x18181b), 21, 1.6, -14);
  B(0.2, 0.2, 0.4, M.metalChrome, 21, 1.6, -14.4); // Lensa

  // =========================================================================
  // 11. ASRAMA KARYAWAN (4 Tempat Tidur Kayu, Kasur, Bantal & Lemari)
  // =========================================================================
  function createBed(bx, bz) {
    B(3.4, 0.42, 1.9, M.woodDark, bx, 0.21, bz);
    B(0.18, 1.15, 1.9, M.woodDark, bx - 1.6, 0.58, bz); // Headboard
    B(0.18, 0.55, 1.9, M.woodDark, bx + 1.6, 0.28, bz); // Footboard
    B(3.0, 0.26, 1.75, M.bedSheet, bx, 0.52, bz);      // Kasur
    B(1.6, 0.28, 1.78, lam(0x38bdf8), bx + 0.65, 0.54, bz); // Selimut biru
    B(0.65, 0.16, 1.2, M.pillow, bx - 1.05, 0.7, bz);  // Bantal
    B(0.6, 0.5, 0.6, M.woodDesk, bx - 1.6, 0.25, bz + 1.25); // Nakas
    B(0.25, 0.35, 0.25, lam(0xfef08a), bx - 1.6, 0.68, bz + 1.25); // Lampu tidur
  }
  createBed(-22.5, -3.5);
  createBed(-17.5, -3.5);
  createBed(-22.5, 2.5);
  createBed(-17.5, 2.5);
  B(0.8, 2.1, 4.0, M.woodDark, -25.5, 1.05, -0.5); // Lemari pakaian asrama

  // =========================================================================
  // 12. RUANG CEO (Meja Kayu Eksekutif, Sofa Tamu, Rak Buku)
  // =========================================================================
  B(4.6, 0.16, 2.0, M.woodDark, -20, 1.0, -15);
  B(0.2, 0.9, 1.8, M.metalChrome, -22, 0.45, -15);
  B(0.2, 0.9, 1.8, M.metalChrome, -18, 0.45, -15);
  B(1.2, 1.6, 1.0, M.blackLeather, -20, 1.2, -16.6); // Kursi CEO
  B(6.0, 2.6, 0.5, M.woodDark, -20, 1.3, -20.6);     // Rak buku eksekutif
  // Sofa tamu kulit hitam di ruang CEO
  B(3.2, 0.65, 1.2, M.blackLeather, -17, 0.35, -12);

  // =========================================================================
  // 13. MEJA DAN KARAKTER 14 ORANG (CEO + 13 AI DENGAN BALON OBROLAN 3D)
  // =========================================================================
  function getScreenTexture(kind) {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 80;
    const x = c.getContext('2d');
    const bg = { working: '#042f2e', waiting: '#1e293b', attention: '#451a03' }[kind] || '#1e293b';
    const fg = { working: '#2dd4bf', waiting: '#94a3b8', attention: '#fb923c' }[kind] || '#94a3b8';
    x.fillStyle = bg;
    x.fillRect(0, 0, 128, 80);
    x.fillStyle = fg;
    [[10, 12, 70], [10, 24, 98], [10, 36, 54], [10, 48, 86], [10, 60, 40]].forEach(q => {
      x.fillRect(q[0], q[1], q[2], 6);
    });
    return new THREE.CanvasTexture(c);
  }

  // Pembuat Sprite Balon Obrolan 3D Interaktif
  function createBubbleTexture(text, speakerName, colorHex = '#38bdf8') {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 180;
    const ctx = c.getContext('2d');

    ctx.clearRect(0, 0, 512, 180);

    // Bayangan balon
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    // Balon percakapan rounded
    roundRect(ctx, 16, 12, 480, 130, 22);
    ctx.fillStyle = '#0f172ae8';
    ctx.fill();

    // Ekor balon percakapan menunjuk ke kepala karakter
    ctx.beginPath();
    ctx.moveTo(240, 142);
    ctx.lineTo(256, 168);
    ctx.lineTo(272, 142);
    ctx.closePath();
    ctx.fillStyle = '#0f172ae8';
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = colorHex;
    roundRect(ctx, 16, 12, 480, 130, 22);
    ctx.stroke();

    // Header badge nama pembicara
    ctx.font = '700 22px "Space Grotesk", Inter, sans-serif';
    ctx.fillStyle = colorHex;
    ctx.textBaseline = 'top';
    ctx.fillText(speakerName.toUpperCase(), 36, 24);

    // Isi obrolan dengan auto word-wrap
    ctx.font = '500 23px "Inter", system-ui, sans-serif';
    ctx.fillStyle = '#f8fafc';

    const words = text.split(' ');
    let line = '';
    let y = 60;
    const maxW = 440;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxW && i > 0) {
        ctx.fillText(line, 36, y);
        line = words[i] + ' ';
        y += 32;
        if (y > 110) break; // batas 2-3 baris
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 36, y);

    return new THREE.CanvasTexture(c);
  }

  function buildAgent(a, x, z, idx) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    scene.add(g);
    const o = { id: a.id, nama: a.nama, x, z, ph: idx * 1.7 + 0.5, kind: null, text: null };

    function reg(mesh) {
      mesh.userData.agentId = a.id;
      pickables.push(mesh);
      return mesh;
    }

    // Meja Kerja
    reg(mk(bxg(2.5, 0.12, 1.3), M.woodDesk, 0, 1.0, 0, g));
    reg(mk(bxg(0.12, 0.94, 1.2), M.metalChrome, -1.15, 0.47, 0, g));
    reg(mk(bxg(0.12, 0.94, 1.2), M.metalChrome, 1.15, 0.47, 0, g));

    // Monitor Ganda
    [-0.5, 0.5].forEach(mx => {
      reg(mk(bxg(0.08, 0.28, 0.08), M.metalChrome, mx, 1.2, -0.25, g));
      reg(mk(bxg(0.95, 0.62, 0.06), M.blackLeather, mx, 1.62, -0.25, g));
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.54), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      scr.position.set(mx, 1.62, -0.215);
      g.add(scr);
      reg(scr);
      if (mx < 0) o.scr = scr;
    });

    // Kursi Kerja
    reg(mk(bxg(0.85, 0.12, 0.85), M.blackLeather, 0, 0.62, 1.3, g));
    reg(mk(bxg(0.85, 0.85, 0.12), M.blackLeather, 0, 1.12, 1.75, g));
    reg(mk(new THREE.CylinderGeometry(0.08, 0.08, 0.55, 8), M.metalChrome, 0, 0.3, 1.3, g));
    reg(mk(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 12), M.metalChrome, 0, 0.05, 1.3, g));

    // Badan Karakter 3D
    const hue = a.hue / 360;
    const shirt = lam(new THREE.Color().setHSL(hue, 0.55, 0.48));
    const skin = lam(new THREE.Color().setHSL(hue, 0.25, 0.78));
    const hair = lam(new THREE.Color().setHSL(hue, 0.35, 0.2));

    const pg = new THREE.Group();
    pg.rotation.order = 'YXZ';
    pg.position.set(x, 0, z + 1.3);
    scene.add(pg);

    o.pg = pg;
    o.sx = x;
    o.sz = z + 1.3;
    o.x = o.sx;
    o.z = o.sz;
    o.y = 0;
    o.rx = 0;
    o.ry = 0;

    reg(mk(new THREE.CylinderGeometry(0.32, 0.36, 0.92, 12), shirt, 0, 1.3, 0, pg));

    // Kaki Duduk vs Berdiri
    o.seat = new THREE.Group();
    pg.add(o.seat);
    reg(mk(bxg(0.5, 0.2, 0.85), M.blackLeather, 0, 0.88, -0.4, o.seat));
    reg(mk(bxg(0.38, 0.72, 0.2), M.blackLeather, 0, 0.45, -0.8, o.seat));

    o.stand = new THREE.Group();
    o.stand.visible = false;
    pg.add(o.stand);
    o.legs = [-0.14, 0.14].map(sx => {
      const p = new THREE.Group();
      p.position.set(sx, 0.82, 0);
      o.stand.add(p);
      reg(mk(bxg(0.2, 0.82, 0.22), M.blackLeather, 0, -0.41, 0, p));
      return p;
    });

    // Kepala
    o.headG = new THREE.Group();
    o.headG.position.set(0, 2.05, 0);
    pg.add(o.headG);
    reg(mk(new THREE.SphereGeometry(0.3, 16, 12), skin, 0, 0, 0, o.headG));
    reg(mk(new THREE.SphereGeometry(0.33, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), hair, 0, 0.03, 0.04, o.headG));

    // Lengan
    function arm(sx) {
      const p = new THREE.Group();
      p.position.set(sx, 1.6, -0.15);
      pg.add(p);
      reg(mk(bxg(0.16, 0.16, 0.75), shirt, 0, 0, -0.38, p));
      reg(mk(new THREE.SphereGeometry(0.1, 8, 6), skin, 0, 0, -0.78, p));
      return p;
    }
    o.armL = arm(-0.42);
    o.armR = arm(0.42);

    // Penanda Status & Label Melayang
    o.tag = new THREE.Group();
    scene.add(o.tag);

    o.mk = new THREE.Group();
    o.mk.position.set(0, 3.2, 0);
    o.tag.add(o.mk);

    o.mOk = reg(new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), new THREE.MeshBasicMaterial({ color: 0x10b981 })));
    o.mIdle = reg(new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.06, 8, 20), new THREE.MeshBasicMaterial({ color: 0x94a3b8 })));
    o.mSig = reg(new THREE.Mesh(new THREE.OctahedronGeometry(0.28), new THREE.MeshBasicMaterial({ color: 0xf97316 })));
    o.mk.add(o.mOk);
    o.mk.add(o.mIdle);
    o.mk.add(o.mSig);

    o.lc = document.createElement('canvas');
    o.lc.width = 400; o.lc.height = 88;
    o.lt = new THREE.CanvasTexture(o.lc);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: o.lt, transparent: true, depthTest: false }));
    sp.position.set(0, 4.0, 0);
    sp.scale.set(4.8, 1.05, 1);
    sp.renderOrder = 10;
    o.tag.add(sp);
    o.sp = sp;
    reg(sp);

    // BALON OBROLAN 3D (Speech Bubble Sprite)
    o.bubbleSprite = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthTest: false }));
    o.bubbleSprite.position.set(0, 5.2, 0);
    o.bubbleSprite.scale.set(0.001, 0.001, 1);
    o.bubbleSprite.renderOrder = 15;
    o.bubbleSprite.visible = false;
    o.tag.add(o.bubbleSprite);
    o.chatTimer = 0;
    o.chatDuration = 0;

    o.say = (text, duration = 6) => {
      if (!chatActive) return;
      const speaker = a.id === 'ceo' ? 'Anda (CEO)' : (a.nama === 'Videographer / Fotografer' ? 'Videographer' : a.nama);
      const col = a.id === 'ceo' ? '#f59e0b' : (a.hue > 180 ? '#38bdf8' : '#10b981');
      if (o.bubbleSprite.material.map) {
        o.bubbleSprite.material.map.dispose();
      }
      o.bubbleSprite.material.map = createBubbleTexture(text, speaker, col);
      o.bubbleSprite.material.needsUpdate = true;
      o.bubbleSprite.visible = true;
      o.bubbleSprite.scale.set(5.2, 1.8, 1);
      o.chatTimer = duration;
      o.chatDuration = duration;
    };

    // Cincin Seleksi & Hover
    o.ring = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 2.1, 48),
      new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.95, side: THREE.DoubleSide, depthWrite: false })
    );
    o.ring.rotation.x = -Math.PI / 2;
    o.ring.position.set(0, 0.12, 0);
    o.ring.visible = false;
    o.tag.add(o.ring);

    o.hov = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 1.95, 48),
      new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false })
    );
    o.hov.rotation.x = -Math.PI / 2;
    o.hov.position.set(0, 0.12, 0);
    o.hov.visible = false;
    o.tag.add(o.hov);

    return o;
  }

  // Tempatkan Karyawan di Ruang Kerja Masing-masing
  const initialAgents = getAgentsData();

  // 1. Ruang CEO (1 orang)
  nodes['ceo'] = buildAgent(initialAgents.find(a => a.id === 'ceo'), -20, -15, 0);
  nodes['ceo'].zone = 'ceo';
  nodes['ceo'].lane = -15;

  // 2. Ruang Strategi & Ide (4 orang)
  const stratAgents = ['auditor', 'analis', 'ide', 'perencana'];
  const stratCoords = [
    { x: 4.5, z: -17 },
    { x: 8.5, z: -17 },
    { x: 4.5, z: -13 },
    { x: 8.5, z: -13 }
  ];
  stratAgents.forEach((id, i) => {
    const ag = initialAgents.find(a => a.id === id);
    const pos = stratCoords[i] || { x: 6.5, z: -15 };
    nodes[id] = buildAgent(ag, pos.x, pos.z, i + 1);
    nodes[id].zone = 'plan';
    nodes[id].lane = pos.z;
  });

  // 3. Meja Naskah (1 orang)
  nodes['naskah'] = buildAgent(initialAgents.find(a => a.id === 'naskah'), 10.5, -13, 5);
  nodes['naskah'].zone = 'plan';
  nodes['naskah'].lane = -13;

  // 4. Studio Produksi (2 orang: Kamera, Editor)
  const prodAgents = ['kamera', 'editor'];
  prodAgents.forEach((id, i) => {
    const ag = initialAgents.find(a => a.id === id);
    nodes[id] = buildAgent(ag, 18 + i * 5, -13, i + 6);
    nodes[id].zone = 'prod';
    nodes[id].lane = -13;
  });

  // 5. Workstations Terbuka Medsos & Web Dev (6 orang)
  const pubAgents = ['upload', 'caption', 'carousel', 'story', 'komentar', 'dm'];
  pubAgents.forEach((id, i) => {
    const ag = initialAgents.find(a => a.id === id);
    nodes[id] = buildAgent(ag, -8 + (i % 3) * 6, 14 + Math.floor(i / 3) * 5, i + 8);
    nodes[id].zone = 'pub';
    nodes[id].lane = 16.5;
  });

  function drawAgentLabel(o, a, themeTokens) {
    const c = o.lc;
    const x = c.getContext('2d');
    const W = c.width;
    const H = c.height;
    x.clearRect(0, 0, W, H);
    roundRect(x, 4, 4, W - 8, H - 8, 24);
    x.fillStyle = themeTokens.surface || '#18222c';
    x.fill();
    x.lineWidth = 4;
    x.strokeStyle = o.kind === 'attention' ? (themeTokens.signal || '#f97316') : (themeTokens.line || '#334155');
    x.stroke();

    const col = o.kind === 'working' ? (themeTokens.ok || '#10b981') : (o.kind === 'attention' ? (themeTokens.signal || '#f97316') : (themeTokens.idle || '#94a3b8'));
    x.fillStyle = col;
    x.strokeStyle = col;

    if (o.kind === 'working') {
      x.beginPath();
      x.arc(40, H / 2, 12, 0, Math.PI * 2);
      x.fill();
    } else if (o.kind === 'waiting') {
      x.lineWidth = 6;
      x.beginPath();
      x.arc(40, H / 2, 10, 0, Math.PI * 2);
      x.stroke();
    } else {
      x.beginPath();
      x.moveTo(40, H / 2 - 14);
      x.lineTo(54, H / 2);
      x.lineTo(40, H / 2 + 14);
      x.lineTo(26, H / 2);
      x.closePath();
      x.fill();
    }

    const title = a.id === 'ceo' ? 'Anda (CEO)' : (a.nama === 'Videographer / Fotografer' ? 'Videographer' : a.nama);
    let fs = 36;
    x.font = `700 ${fs}px "Space Grotesk", Inter, system-ui, sans-serif`;
    while (x.measureText(title).width > W - 96 && fs > 20) {
      fs -= 2;
      x.font = `700 ${fs}px "Space Grotesk", Inter, system-ui, sans-serif`;
    }
    x.fillStyle = themeTokens.ink || '#f8fafc';
    x.textBaseline = 'middle';
    x.fillText(title, 70, H / 2 + 2);
    o.lt.needsUpdate = true;
  }

  function paintAgent(o, a, themeTokens) {
    const sKind = a.id === 'ceo' ? 'waiting' : a.status;
    const sLabel = a.id === 'ceo' ? 'CEO' : a.sLabel;

    if (o.kind !== sKind || o.text !== sLabel) {
      o.kind = sKind;
      o.text = sLabel;
      if (o.scr) {
        o.scr.material.map = getScreenTexture(sKind);
        o.scr.material.needsUpdate = true;
      }
      o.mOk.visible = sKind === 'working';
      o.mIdle.visible = sKind === 'waiting';
      o.mSig.visible = sKind === 'attention';
      drawAgentLabel(o, a, themeTokens);
    }
  }

  function applyTheme() {
    const T = getThemeTokens();
    const currentAgents = getAgentsData();
    currentAgents.forEach(a => {
      const o = nodes[a.id];
      if (!o) return;
      paintAgent(o, a, T);
    });
  }

  // =========================================================================
  // 14. NAVIGASI JALAN LEWAT PINTU & LORONG TERBUKA (Anti Tembus Dinding/Sekat)
  // Menghubungkan seluruh ruangan strictly lewat kusen pintu & koridor keliling
  // =========================================================================
  const ZONE_GATES = {
    ceo: {
      door: [-14.0, -15.0],
      inside: [-16.5, -15.0],
      exterior: [-11.5, -15.0],
      ringAlley: [[-11.5, -8.0]] // NW
    },
    meeting: {
      door: [-6.0, -10.0],
      inside: [-6.0, -12.0],
      exterior: [-6.0, -8.0],
      ringAlley: []
    },
    plan: {
      door: [7.5, -10.0],
      inside: [7.5, -12.0],
      exterior: [7.5, -8.0],
      ringAlley: []
    },
    prod: {
      door: [15.0, -15.0],
      inside: [17.0, -15.0],
      exterior: [13.5, -15.0],
      ringAlley: [[13.5, -8.0], [11.5, -8.0]] // NE
    },
    pub: {
      door: [0.0, 12.0],
      inside: [1.0, 13.5],
      exterior: [0.0, 9.2],
      ringAlley: []
    },
    lunch: {
      door: [14.0, -2.5],
      inside: [16.5, -2.5],
      exterior: [11.5, -2.5],
      ringAlley: []
    },
    ps: {
      door: [14.0, 8.0],
      inside: [16.5, 8.0],
      exterior: [11.5, 8.0],
      ringAlley: []
    },
    gym: {
      door: [14.0, 18.0],
      inside: [16.5, 18.0],
      exterior: [11.5, 18.0],
      ringAlley: [[11.5, 9.2]] // SE
    },
    dorm: {
      door: [-14.0, -0.5],
      inside: [-16.0, -0.5],
      exterior: [-11.5, -0.5],
      ringAlley: []
    },
    musholla: {
      door: [-14.0, 17.0],
      inside: [-16.0, 17.0],
      exterior: [-11.5, 17.0],
      ringAlley: [[-11.5, 9.2]] // SW
    },
    pool: {
      door: [0.0, -4.0],
      inside: [0.0, -2.0],
      exterior: [0.0, -8.0],
      ringAlley: []
    }
  };

  function cleanPath(pts) {
    const res = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (!p || typeof p[0] !== 'number' || typeof p[1] !== 'number') continue;
      const prev = res[res.length - 1];
      if (prev) {
        const dx = p[0] - prev[0];
        const dz = p[1] - prev[1];
        if (Math.hypot(dx, dz) < 0.1) continue;
      }
      res.push([Number(p[0].toFixed(2)), Number(p[1].toFixed(2))]);
    }
    return res;
  }

  function getRingEdge(p) {
    const x = p[0];
    const z = p[1];
    if (Math.abs(z - (-8.0)) < 0.6) return 'N';
    if (Math.abs(x - 11.5) < 0.6) return 'E';
    if (Math.abs(z - 9.2) < 0.6) return 'S';
    if (Math.abs(x - (-11.5)) < 0.6) return 'W';
    // Fallback berdasarkan posisi terdekat
    const dN = Math.abs(z - (-8.0));
    const dE = Math.abs(x - 11.5);
    const dS = Math.abs(z - 9.2);
    const dW = Math.abs(x - (-11.5));
    const minD = Math.min(dN, dE, dS, dW);
    if (minD === dN) return 'N';
    if (minD === dE) return 'E';
    if (minD === dS) return 'S';
    return 'W';
  }

  function routeOnCorridorRing(pA, pB) {
    const edgeA = getRingEdge(pA);
    const edgeB = getRingEdge(pB);

    if (edgeA === edgeB) {
      return [pB];
    }

    const corners = {
      NE: [11.5, -8.0],
      SE: [11.5, 9.2],
      SW: [-11.5, 9.2],
      NW: [-11.5, -8.0]
    };

    // Sisi bersebelahan
    if ((edgeA === 'N' && edgeB === 'E') || (edgeA === 'E' && edgeB === 'N')) {
      return [corners.NE, pB];
    }
    if ((edgeA === 'E' && edgeB === 'S') || (edgeA === 'S' && edgeB === 'E')) {
      return [corners.SE, pB];
    }
    if ((edgeA === 'S' && edgeB === 'W') || (edgeA === 'W' && edgeB === 'S')) {
      return [corners.SW, pB];
    }
    if ((edgeA === 'W' && edgeB === 'N') || (edgeA === 'N' && edgeB === 'W')) {
      return [corners.NW, pB];
    }

    // Sisi berhadapan: North vs South
    if ((edgeA === 'N' && edgeB === 'S') || (edgeA === 'S' && edgeB === 'N')) {
      const distEast = Math.abs(11.5 - pA[0]) + 17.2 + Math.abs(11.5 - pB[0]);
      const distWest = Math.abs(pA[0] - (-11.5)) + 17.2 + Math.abs(pB[0] - (-11.5));
      if (distEast <= distWest) {
        return edgeA === 'N' ? [corners.NE, corners.SE, pB] : [corners.SE, corners.NE, pB];
      } else {
        return edgeA === 'N' ? [corners.NW, corners.SW, pB] : [corners.SW, corners.NW, pB];
      }
    }

    // Sisi berhadapan: East vs West
    if ((edgeA === 'E' && edgeB === 'W') || (edgeA === 'W' && edgeB === 'E')) {
      const distNorth = Math.abs(pA[1] - (-8.0)) + 23.0 + Math.abs(pB[1] - (-8.0));
      const distSouth = Math.abs(9.2 - pA[1]) + 23.0 + Math.abs(9.2 - pB[1]);
      if (distNorth <= distSouth) {
        return edgeA === 'E' ? [corners.NE, corners.NW, pB] : [corners.NW, corners.NE, pB];
      } else {
        return edgeA === 'E' ? [corners.SE, corners.SW, pB] : [corners.SW, corners.SE, pB];
      }
    }

    return [pB];
  }

  function getRoomExitWaypoints(fromZone, fromX, fromZ) {
    const gate = ZONE_GATES[fromZone];
    if (!gate) return [[fromX, fromZ]];
    const pts = [];
    pts.push([fromX, fromZ]);

    if (fromZone === 'plan') {
      pts.push([fromX, -15.0]);
      pts.push([7.5, -15.0]);
      pts.push([7.5, -12.0]);
    } else if (fromZone === 'prod') {
      pts.push([fromX, -15.0]);
      pts.push([17.0, -15.0]);
    } else if (fromZone === 'pub') {
      const aisleZ = fromZ < 16.5 ? 15.5 : 17.5;
      pts.push([fromX, aisleZ]);
      pts.push([1.0, aisleZ]);
      pts.push([1.0, 13.5]);
    } else if (fromZone === 'ceo') {
      pts.push([-16.5, -15.0]);
    } else if (fromZone === 'meeting') {
      pts.push([-6.0, fromZ]);
      pts.push([-6.0, -12.0]);
    } else if (fromZone === 'dorm') {
      pts.push([-16.0, -0.5]);
    } else if (fromZone === 'lunch') {
      pts.push([16.5, -2.5]);
    } else if (fromZone === 'ps') {
      pts.push([16.5, 8.0]);
    } else if (fromZone === 'gym') {
      pts.push([16.5, 18.0]);
    } else if (fromZone === 'musholla') {
      pts.push([-16.0, 17.0]);
    } else if (fromZone === 'pool') {
      pts.push([0.0, -2.0]);
    }

    pts.push(gate.door);
    pts.push(gate.exterior);
    if (gate.ringAlley && gate.ringAlley.length > 0) {
      gate.ringAlley.forEach(pt => pts.push(pt));
    }
    return pts;
  }

  function buildCollisionFreePath(fromZone, [fromX, fromZ], toZone, [toX, toZ]) {
    // 1. Jika bergerak di dalam ruangan yang sama
    if (fromZone && toZone && fromZone === toZone) {
      const sameRoomPath = [];
      sameRoomPath.push([fromX, fromZ]);
      if (fromZone === 'plan') {
        sameRoomPath.push([fromX, -15.0], [toX, -15.0], [toX, toZ]);
      } else if (fromZone === 'prod') {
        sameRoomPath.push([fromX, -15.0], [toX, -15.0], [toX, toZ]);
      } else if (fromZone === 'pub') {
        const fromAisleZ = fromZ < 16.5 ? 15.5 : 17.5;
        const toAisleZ = toZ < 16.5 ? 15.5 : 17.5;
        sameRoomPath.push([fromX, fromAisleZ], [1.0, fromAisleZ]);
        if (fromAisleZ !== toAisleZ) sameRoomPath.push([1.0, toAisleZ]);
        sameRoomPath.push([toX, toAisleZ], [toX, toZ]);
      } else if (fromZone === 'meeting') {
        sameRoomPath.push([-6.0, fromZ], [-6.0, toZ], [toX, toZ]);
      } else {
        sameRoomPath.push([toX, toZ]);
      }
      return cleanPath(sameRoomPath);
    }

    // 2. Keluar dari ruangan asal melewati pintu & lorong kosong
    const exitPoints = getRoomExitWaypoints(fromZone, fromX, fromZ);
    const ringStartPoint = exitPoints[exitPoints.length - 1];

    // 3. Masuk ke ruangan tujuan (kebalikan dari rute keluar ruangan tujuan)
    const enterPointsReversed = getRoomExitWaypoints(toZone, toX, toZ);
    enterPointsReversed.reverse();
    const ringEndPoint = enterPointsReversed[0];

    // 4. Rute di koridor keliling (Highway Ring) mengitari kolam renang tanpa menembus dinding/sekat
    const ringPath = routeOnCorridorRing(ringStartPoint, ringEndPoint);

    const full = [...exitPoints, ...ringPath, ...enterPointsReversed];
    return cleanPath(full);
  }

  function snapAgent(o, at, sl, instant) {
    const q = at === 'desk' ? null : ROOM3[at].spots[sl];
    o.at = at;
    o.sl = sl;
    o.mode = q ? 'rest' : 'seat';
    o.pose = q ? q[2] : 'd';
    o.fy = q ? (q[2] === 'l' ? -Math.PI / 2 : Math.atan2(-(q[3] - q[0]), -(q[4] - q[1]))) : 0;
    o.ty = q ? q[5] : 0;
    if (instant) {
      o.x = q ? q[0] : o.sx;
      o.z = q ? q[1] : o.sz;
      o.ry = o.fy;
      o.y = o.ty;
      o.rx = o.pose === 'l' ? Math.PI / 2 : 0;
    }
  }

  // Generator lintasan jalan antar-ruangan menghindari dinding
  function generateAgentWalkPath(fromX, fromZ, toX, toZ, fromZone, toZone) {
    return buildCollisionFreePath(fromZone, [fromX, fromZ], toZone, [toX, toZ]);
  }

  function getWaypoints(o, at, sl) {
    const fromZone = o.at === 'desk' ? o.zone : o.at;
    const fromPos = [o.x, o.z];
    const toZone = at === 'desk' ? o.zone : at;
    let toPos;
    if (at === 'desk') {
      toPos = [o.sx, o.sz];
    } else {
      const r = ROOM3[at];
      const q = r ? (r.spots[sl] || r.spots[0]) : [0, 0];
      toPos = [q[0], q[1]];
    }
    return buildCollisionFreePath(fromZone, fromPos, toZone, toPos);
  }

  function steerAgent(o, a, dt) {
    // Jika karakter sedang dalam misi berjalan mandiri (Estafet Alur Agensi)
    if (o.isMissionWalk) {
      if (o.mode === 'walk') {
        const w = o.path[0];
        if (!w) {
          o.mode = 'stand';
          o.stand.visible = true;
          o.seat.visible = false;
          if (o.onMissionArrive) {
            const cb = o.onMissionArrive;
            o.onMissionArrive = null;
            cb();
          }
        } else {
          const dx = w[0] - o.x;
          const dz = w[1] - o.z;
          const dd = Math.sqrt(dx * dx + dz * dz);
          const st = 5.5 * dt;
          if (dd <= st) {
            o.x = w[0];
            o.z = w[1];
            o.path.shift();
          } else {
            o.x += (dx / dd) * st;
            o.z += (dz / dd) * st;
            o.ry += wrapAngle(Math.atan2(-dx, -dz) - o.ry) * Math.min(1, dt * 10);
          }
        }
      }
      o.pg.position.set(o.x, o.y, o.z);
      o.pg.rotation.set(o.rx, o.ry, 0);
      o.tag.position.set(o.x, o.y, o.z);
      return;
    }

    const at = a.at || 'desk';
    const sl = a.slot || 0;
    const k = `${at}:${sl}`;
    const k1 = Math.min(1, dt * 7);

    if (o.key === undefined) {
      o.key = k;
      snapAgent(o, at, sl, true);
    }

    if (o.mode !== 'walk' && o.key !== k && o.rx < 0.2) {
      const fromZone = o.at === 'desk' ? o.zone : o.at;
      const fromPos = [o.x, o.z];
      const toZone = at === 'desk' ? o.zone : at;
      let toPos;
      if (at === 'desk') {
        toPos = [o.sx, o.sz];
      } else {
        const r = ROOM3[at];
        const q = r ? (r.spots[sl] || r.spots[0]) : [0, 0];
        toPos = [q[0], q[1]];
      }
      o.path = buildCollisionFreePath(fromZone, fromPos, toZone, toPos);
      o.mode = 'walk';
      o.pose = 'x';
      o.key = k;
      o.to = { at, sl };
      o.ty = 0;
      o.fy = o.ry;
    }

    if (o.mode === 'walk') {
      const w = o.path[0];
      if (!w) {
        snapAgent(o, o.to.at, o.to.sl, false);
      } else {
        const dx = w[0] - o.x;
        const dz = w[1] - o.z;
        const dd = Math.sqrt(dx * dx + dz * dz);
        const st = 5.5 * dt;
        if (dd <= st) {
          o.x = w[0];
          o.z = w[1];
          o.path.shift();
        } else {
          o.x += (dx / dd) * st;
          o.z += (dz / dd) * st;
          o.ry += wrapAngle(Math.atan2(-dx, -dz) - o.ry) * Math.min(1, dt * 10);
        }
      }
    } else {
      o.ry += wrapAngle(o.fy - o.ry) * k1;
    }

    o.y += (o.ty - o.y) * k1;
    const isLying = o.mode === 'rest' && o.pose === 'l';
    const targetRx = isLying ? Math.PI / 2 : 0;
    o.rx += (targetRx - o.rx) * Math.min(1, dt * 6);

    const sit = o.mode === 'seat' || (o.mode === 'rest' && o.pose === 's');
    o.seat.visible = sit;
    o.stand.visible = !sit;

    o.pg.position.set(o.x, o.y, o.z);
    o.pg.rotation.set(o.rx, o.ry, 0);

    if (isLying) {
      o.tag.position.set(o.x - 1.0, 0, o.z);
      if (o.mk) o.mk.position.set(0, 2.0, 0);
      if (o.sp) o.sp.position.set(0, 2.6, 0);
      if (o.bubbleSprite) o.bubbleSprite.position.set(0, 3.8, 0);
    } else {
      o.tag.position.set(o.x, o.y, o.z);
      if (o.mk) o.mk.position.set(0, 3.2, 0);
      if (o.sp) o.sp.position.set(0, 4.0, 0);
      if (o.bubbleSprite) o.bubbleSprite.position.set(0, 5.2, 0);
    }

    const off = o.mode !== 'seat';
    o.ring.position.z = o.hov.position.z = off ? 0 : -0.7;
    o.ring.scale.setScalar(off ? 0.5 : 1);
    o.hov.scale.setScalar(off ? 0.5 : 1);
  }

  // =========================================================================
  // 14B. ESTAFET ALUR AGENSI KREATIF MANDIRI (Autonomous Creative Agency)
  // Alur estafet kerja berjalan mandiri antar meja/ruangan: Analis -> Ide -> Naskah -> Kamera -> Editor -> Carousel -> CEO -> Upload
  // =========================================================================
  const AGENCY_PIPELINE_STEPS = [
    {
      step: 1,
      title: 'Analisa Data & Retensi Viral',
      senderId: 'analis',
      targetId: 'ide',
      pilar: 'Multimedia & Web Dev',
      dialogueSender: 'Pola retensi hook 3 detik video edukasi naik 45%, ini data tren terbarunya!',
      dialogueTarget: 'Siap! Saya olah jadi 3 konsep ide konten edukasi viral hari ini!',
      summary: 'Content Analyst menyerahkan insight retensi penonton ke Brainstorming'
    },
    {
      step: 2,
      title: 'Penyusunan Naskah & Hook Viral',
      senderId: 'ide',
      targetId: 'naskah',
      pilar: 'Design & Multimedia',
      dialogueSender: 'Ini 3 ide terpilih: lighting studio hemat, hierarki visual UI, & Three.js 60 FPS!',
      dialogueTarget: 'Keren! Langsung saya tulis script 30 detik + shot list adegan!',
      summary: 'Brainstorming menyerahkan konsep ide ke Penulis Naskah'
    },
    {
      step: 3,
      title: 'Eksekusi Studio & Shot List',
      senderId: 'naskah',
      targetId: 'kamera',
      pilar: 'Multimedia',
      dialogueSender: 'Naskah edukasi & shot list 3 adegan siap dieksekusi di studio!',
      dialogueTarget: 'Studio green screen & lighting 3-point sudah ready, langsung take!',
      summary: 'Penulis Naskah menyerahkan naskah ke Videographer di Studio'
    },
    {
      step: 4,
      title: 'Editing & Motion Subtitle',
      senderId: 'kamera',
      targetId: 'editor',
      pilar: 'Multimedia',
      dialogueSender: 'Footage 4K 60fps & audio studio siap dipotong dan di-grade!',
      dialogueTarget: 'Sip! Saya pasang sound effect ritmis, LUT sinematik, & kinetic subtitle!',
      summary: 'Videographer menyerahkan footage ke Video Editor'
    },
    {
      step: 5,
      id: 'step-editor-carousel',
      title: 'Desain Carousel & Thumbnail',
      senderId: 'editor',
      targetId: 'carousel',
      pilar: 'Design',
      dialogueSender: 'Render video final selesai! Tolong buatkan thumbnail CTR tinggi & carousel 7 slide!',
      dialogueTarget: 'Siap! Saya buatkan slide estetis 1080x1350 dengan hierarki visual rapi!',
      summary: 'Video Editor menyerahkan materi ke Desainer Carousel'
    },
    {
      step: 6,
      id: 'step-editor-upload',
      title: 'Serah Terima Video (Editing ➔ Medsos)',
      senderId: 'editor',
      targetId: 'upload',
      pilar: 'Multimedia & Medsos',
      dialogueSender: 'Tim Medsos, ini master video 4K 60fps untuk jadwal upload sudah lulus QC dan siap tayang!',
      dialogueTarget: 'Siap! Master video kami terima. Langsung kami pasang cover thumbnail, siapkan caption, dan publish!',
      summary: 'Tim Editing membawa master video 4K 60fps dari Studio ke Tim Medsos di Meja Publikasi untuk diunggah',
      isUploadHandover: true
    },
    {
      step: 7,
      id: 'step-upload-caption',
      title: 'Penyelarasan Caption & SEO Medsos',
      senderId: 'upload',
      targetId: 'caption',
      pilar: 'Medsos & SEO',
      dialogueSender: 'Master video sudah masuk sistem upload, tolong sematkan caption dan 7 hashtag SEO terkurasi ya!',
      dialogueTarget: 'Beres! Caption persuasif dan hashtag pilar edukasi sudah siap tayang bareng video!',
      summary: 'Tim Upload berkoordinasi dengan Penulis Caption untuk penyematan copy'
    },
    {
      step: 8,
      id: 'step-carousel-ceo',
      title: 'Review Final & Approval CEO',
      senderId: 'carousel',
      targetId: 'ceo',
      pilar: 'Semua Pilar',
      dialogueSender: 'Pak CEO, seluruh materi paket konten edukasi viral siap di antrean persetujuan!',
      dialogueTarget: 'Bagus sekali! Skor potensi FYP 96%, saya setujui untuk jadwal prime time!',
      summary: 'Desainer menyerahkan paket konten ke Ruang CEO untuk persetujuan'
    },
    {
      step: 9,
      id: 'step-ceo-upload',
      title: 'Mandat Publikasi dari CEO',
      senderId: 'ceo',
      targetId: 'upload',
      pilar: 'Web Dev & Sosmed',
      dialogueSender: 'Konten sudah disetujui! Tim Medsos, eksekusi tayang otomatis sesuai jam jadwal operasional!',
      dialogueTarget: 'Siap Pak CEO! Metadata, thumbnail, & jadwal tayang sudah terprogram otomatis!',
      summary: 'CEO memberikan mandat ke Tim Medsos untuk publikasi otomatis'
    }
  ];

  let currentAgencyStepIdx = 0;
  let isAgencyStepRunning = false;
  let agencyStepTimer = 8.0;

  function runAgencyStep(stepIdx) {
    if (isAgencyStepRunning) return;
    const meetingAgents = Object.values(nodes).filter(o => o.at === 'meeting');
    if (meetingAgents.length > 0) return;

    const idx = stepIdx !== undefined ? stepIdx : currentAgencyStepIdx;
    const step = AGENCY_PIPELINE_STEPS[idx % AGENCY_PIPELINE_STEPS.length];
    const sender = nodes[step.senderId];
    const target = nodes[step.targetId];

    if (!sender || !target) {
      currentAgencyStepIdx = (idx + 1) % AGENCY_PIPELINE_STEPS.length;
      return;
    }

    isAgencyStepRunning = true;
    if (onPipelineEvent) {
      onPipelineEvent({ type: 'start', stepIndex: idx, step });
    }

    const targetSpot = [target.sx, target.sz + 1.2];
    const walkPath = generateAgentWalkPath(sender.sx, sender.sz, targetSpot[0], targetSpot[1], sender.zone, target.zone);

    sender.isMissionWalk = true;
    sender.mode = 'walk';
    sender.stand.visible = true;
    sender.seat.visible = false;
    sender.path = walkPath;

    sender.onMissionArrive = () => {
      const dx = target.sx - sender.x;
      const dz = target.sz - sender.z;
      sender.ry = Math.atan2(-dx, -dz);
      target.ry = Math.atan2(dx, dz);

      const senderText = getDynamicDialogue(step.senderId, 'handover_sender', step.targetId);
      const targetText = getDynamicDialogue(step.targetId, 'handover_target', step.senderId);

      sender.say(senderText, 5.2);
      if (onPipelineEvent) {
        onPipelineEvent({
          type: 'dialogue',
          stepIndex: idx,
          step: {
            ...step,
            dialogueSender: senderText,
            dialogueTarget: targetText
          }
        });
      }

      setTimeout(() => {
        if (!isRunning) return;
        target.say(targetText, 4.8);

        // Jika ini adalah serah terima video ke tim medsos, tim caption & story ikut merespon aktif!
        if (step.senderId === 'editor' && step.targetId === 'upload') {
          setTimeout(() => {
            if (!isRunning) return;
            if (nodes['caption']) {
              nodes['caption'].say('Caption persuasif dan 7 hashtag SEO sudah siap disematkan!', 4.5);
            }
          }, 1500);

          setTimeout(() => {
            if (!isRunning) return;
            if (nodes['story']) {
              nodes['story'].say('Teaser & stiker link di Story langsung kami publish sekarang!', 4.5);
            }
          }, 3000);
        }

        setTimeout(() => {
          if (!isRunning) return;
          const returnPath = generateAgentWalkPath(sender.x, sender.z, sender.sx, sender.sz, target.zone, sender.zone);
          sender.path = returnPath;
          sender.mode = 'walk';
          sender.stand.visible = true;
          sender.seat.visible = false;

          sender.onMissionArrive = () => {
            sender.isMissionWalk = false;
            sender.mode = 'seat';
            sender.seat.visible = true;
            sender.stand.visible = false;
            sender.x = sender.sx;
            sender.z = sender.sz;
            sender.ry = 0;
            sender.pg.position.set(sender.sx, 0, sender.sz);
            sender.pg.rotation.set(0, 0, 0);
            sender.tag.position.set(sender.sx, 0, sender.sz);

            isAgencyStepRunning = false;
            currentAgencyStepIdx = (idx + 1) % AGENCY_PIPELINE_STEPS.length;
            agencyStepTimer = 16.0;
            if (onPipelineEvent) {
              onPipelineEvent({ type: 'complete', stepIndex: currentAgencyStepIdx, nextStep: AGENCY_PIPELINE_STEPS[currentAgencyStepIdx] });
            }
          };
        }, 3600);
      }, 2200);
    };
  }

  // =========================================================================
  // 15. SIMULASI OTOMATIS: KARYAWAN JALAN & OBROLAN INTERAKTIF
  // =========================================================================
  let wanderCountdown = 9.0;
  let lastPublishHandoverSlot = null;
  let publishCheckCountdown = 1.0;
  const roamingAgentKeys = ['editor', 'kamera', 'carousel', 'ide', 'analis', 'caption'];

  function tickSocialSimulation(dt) {
    if (!chatActive) return;

    // Hitung mundur obrolan aktif per agent
    Object.values(nodes).forEach(o => {
      if (o.chatTimer > 0) {
        o.chatTimer -= dt;
        if (o.chatTimer <= 0) {
          o.bubbleSprite.visible = false;
        }
      }
    });

    // Cek apakah sesi rapat resmi dengan CEO sedang berlangsung di Ruang Meeting
    const meetingAgents = Object.values(nodes).filter(o => o.at === 'meeting');
    if (meetingAgents.length > 0) {
      wanderCountdown -= dt;
      if (wanderCountdown <= 0) {
        wanderCountdown = 7.0 + Math.random() * 4.0;
        const speaker = meetingAgents[Math.floor(Math.random() * meetingAgents.length)];
        if (speaker && speaker.say) {
          speaker.say(getDynamicDialogue(speaker.id, 'meeting'), 6.0);
        }
      }
      return;
    }

    // 1. Deteksi Otomatis Jadwal Pengunggahan / Publikasi Konten Medsos
    // Jika jam publikasi tiba (misal jam 11:00 atau jam 19:00 WIB),
    // Tim Editing (Editor) OTOMATIS berdiri dan berjalan ke Tim Medsos (Upload Video) untuk menyerahkan video!
    publishCheckCountdown -= dt;
    if (publishCheckCountdown <= 0 && !isAgencyStepRunning) {
      publishCheckCountdown = 4.0;
      const ctx = getOfficeContext ? getOfficeContext() : {};
      const clockTime = ctx.clockTime;
      if (clockTime) {
        const h = clockTime.h;
        // Jam-jam publikasi medsos operasional (Slot Siang 11.00 - 14.00, Slot Prime Time Malam 18.30 - 21.30)
        const isPublishHour = (h === 11) || (h === 12) || (h === 13) || (h === 14) || (h >= 18 && h <= 21);
        const slotKey = `${clockTime.dayIndex}-${h}`;

        if (isPublishHour && lastPublishHandoverSlot !== slotKey) {
          lastPublishHandoverSlot = slotKey;
          const uploadStepIdx = AGENCY_PIPELINE_STEPS.findIndex(s => s.senderId === 'editor' && s.targetId === 'upload');
          if (uploadStepIdx !== -1) {
            runAgencyStep(uploadStepIdx);
            return;
          }
        }
      }
    }

    // 2. Estafet Alur Agensi Mandiri (Autonomous Creative Agency Pipeline)
    // Agen berdiri, berjalan antar ruangan, serah terima materi naskah, video, desain & persetujuan CEO
    if (!isAgencyStepRunning) {
      agencyStepTimer -= dt;
      if (agencyStepTimer <= 0) {
        runAgencyStep(currentAgencyStepIdx);
      }
    }

    // Jika di luar jam rapat: Ruang meeting formal tertutup, bukan tempat santai!
    // Pemicu dinamis karyawan mengobrol kontekstual sesuai pekerjaan riil mereka
    wanderCountdown -= dt;
    if (wanderCountdown <= 0) {
      wanderCountdown = 12.0 + Math.random() * 8.0;

      const randomKey = roamingAgentKeys[Math.floor(Math.random() * roamingAgentKeys.length)];
      const speaker = nodes[randomKey];
      if (speaker && speaker.mode !== 'walk') {
        const text = getDynamicDialogue(randomKey, 'desk_chat');
        speaker.say(text, 6.0);

        // Rekan kerja merespon secara kontekstual 2.5 detik kemudian
        setTimeout(() => {
          const partnerKey = roamingAgentKeys.find(k => k !== randomKey);
          const partner = nodes[partnerKey];
          if (partner && partner.mode !== 'walk') {
            const replyText = getDynamicDialogue(partnerKey, 'desk_reply', randomKey);
            partner.say(replyText, 5.5);
          }
        }, 2800);
      }
    }
  }

  // =========================================================================
  // 16. KAMERA & KONTROL INTERAKTIF
  // =========================================================================
  let glide = null;

  function resetCamera() {
    controls.target.set(0, 0, 0);
    camera.position.set(38, 46, 50);
    camera.lookAt(controls.target);
    controls.update();
    glide = null;
  }

  function focusAgent(id) {
    const o = nodes[id];
    if (!o) return;
    const tgt = new THREE.Vector3(o.x, 1.2, o.z + (o.mode === 'seat' ? -0.5 : 0.3));
    const off = camera.position.clone().sub(controls.target);
    off.setLength(Math.min(off.length(), 28));
    glide = { t: tgt, p: tgt.clone().add(off) };
  }

  controls.addEventListener('start', () => { glide = null; });

  const ray = new THREE.Raycaster();
  const mv = new THREE.Vector2();

  function pickAt(ev) {
    const r = canvas.getBoundingClientRect();
    mv.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mv, camera);
    const hits = ray.intersectObjects(pickables, false);
    return hits.length ? hits[0].object.userData.agentId : null;
  }

  function setHover(id) {
    hoverId = id;
    const currentAgents = getAgentsData();
    currentAgents.forEach(a => {
      const o = nodes[a.id];
      if (o) o.hov.visible = (id === a.id && selectedId !== a.id);
    });
  }

  let pointerDownState = null;

  const onPointerDown = (e) => {
    pointerDownState = { x: e.clientX, y: e.clientY, t: performance.now() };
  };

  const onPointerUp = (e) => {
    if (!pointerDownState) return;
    const dx = e.clientX - pointerDownState.x;
    const dy = e.clientY - pointerDownState.y;
    const dt = performance.now() - pointerDownState.t;
    pointerDownState = null;
    if (dx * dx + dy * dy > 36 || dt > 700) return;

    const id = pickAt(e);
    if (id) {
      if (nodes[id]) {
        nodes[id].say(getDynamicDialogue(id, 'desk_chat'), 6.0);
      }
      if (onSelectAgent) {
        onSelectAgent(id);
      }
    }
  };

  const onPointerMove = (e) => {
    if (e.buttons) return;
    const id = pickAt(e);
    setHover(id);
    canvas.style.cursor = id ? 'pointer' : 'grab';
  };

  const onPointerLeave = () => {
    setHover(null);
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerleave', onPointerLeave);

  function resize() {
    const w = canvas.parentElement ? canvas.parentElement.clientWidth : canvas.clientWidth;
    const h = canvas.parentElement ? canvas.parentElement.clientHeight : canvas.clientHeight;
    if (!w || !h) return false;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    return true;
  }

  let isRunning = true;
  let t0 = performance.now();
  let last = 0;

  function animate() {
    if (!isRunning) return;
    requestAnimationFrame(animate);

    const time = (performance.now() - t0) / 1000;
    const dt = Math.min(0.1, time - last);
    last = time;

    // Simulasi obrolan & interaksi mandiri
    tickSocialSimulation(dt);

    // Animasi riak air kolam renang halus
    if (poolWater) {
      poolWater.position.y = 0.15 + Math.sin(time * 2.0) * 0.02;
    }

    const currentAgents = getAgentsData();
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const amp = reduceMotion ? 0 : 1;

    currentAgents.forEach(a => {
      const o = nodes[a.id];
      if (!o) return;
      steerAgent(o, a, dt);

      const p = o.ph;
      let aL = -0.5, aR = -0.5, bob = 0.06, hr = 0, lg = 0;

      if (o.mode === 'walk') {
        lg = Math.sin(time * 9 + p) * 0.6 * amp;
        aL += lg * 0.8;
        aR -= lg * 0.8;
      } else if (o.pose === 'l') {
        aL = aR = -Math.PI / 2;
        bob = 0;
        hr = 0;
        lg = 0;
      } else if (o.pose === 'w') {
        aL += Math.sin(time * 3 + p) * 0.9 * amp;
        aR += Math.sin(time * 3 + p + 3) * 0.9 * amp;
        lg = Math.sin(time * 5 + p) * 0.4 * amp;
      } else if (o.chatTimer > 0) {
        // Gerakan saat sedang berbicara / mengobrol
        hr = Math.sin(time * 4 + p) * 0.09 * amp;
        aR += Math.sin(time * 5 + p) * 0.35 * amp;
      } else if (o.kind === 'working') {
        aL += Math.sin(time * 11 + p) * 0.07 * amp;
        aR += Math.sin(time * 11 + p + 2) * 0.07 * amp;
        hr = Math.sin(time * 1.6 + p) * 0.05 * amp;
      } else if (o.kind === 'attention') {
        aR = 1.6 + Math.sin(time * 6 + p) * 0.35 * amp;
        bob = 0.14;
        hr = Math.sin(time * 2 + p) * 0.08 * amp;
      } else {
        hr = Math.sin(time * 0.8 + p) * 0.05 * amp;
      }

      o.armL.rotation.x = aL;
      o.armR.rotation.x = aR;
      o.legs[0].rotation.x = lg;
      o.legs[1].rotation.x = -lg;
      o.headG.rotation.x = hr;
      o.mk.position.y = 3.2 + Math.sin(time * 3 + p) * bob * amp;
      o.mk.rotation.y = time * 1.4 * amp;
    });

    if (glide) {
      controls.target.lerp(glide.t, 0.12);
      camera.position.lerp(glide.p, 0.12);
      if (controls.target.distanceTo(glide.t) < 0.02) glide = null;
    }

    controls.target.x = Math.max(-30, Math.min(30, controls.target.x));
    controls.target.z = Math.max(-26, Math.min(26, controls.target.z));
    controls.update();

    renderer.render(scene, camera);
  }

  let lastMeetingState = null;

  function sync(currentAgents, selId, timePhase) {
    selectedId = selId;
    if (timePhase && timePhase !== currentPhase) {
      setTimePhase(timePhase);
    }

    // Perbarui layar presentasi Ruang Meeting Kaca secara dinamis sesuai status rapat
    const isMeetingNow = currentAgents.some(a => a.at === 'meeting');
    if (isMeetingNow !== lastMeetingState) {
      lastMeetingState = isMeetingNow;
      if (meetingScreenMat) {
        if (meetingScreenMat.map) meetingScreenMat.map.dispose();
        meetingScreenMat.map = createMeetingScreenTexture(isMeetingNow);
        meetingScreenMat.needsUpdate = true;
      }
    }

    const T = getThemeTokens();
    currentAgents.forEach(a => {
      const o = nodes[a.id];
      if (!o) return;
      paintAgent(o, a, T);
      o.ring.visible = (a.id === selectedId);
      o.hov.visible = (hoverId === a.id && selectedId !== a.id);
    });
  }

  applyTheme();
  setTimePhase('morning');
  resize();
  resetCamera();
  requestAnimationFrame(animate);

  return {
    sync,
    focus: focusAgent,
    resetCamera,
    applyTheme,
    setTimePhase,
    resize,
    setChatActive: (val) => { chatActive = val; },
    triggerNextAgencyStep: (targetStepId) => {
      if (isAgencyStepRunning) return;
      if (targetStepId) {
        const found = AGENCY_PIPELINE_STEPS.findIndex(s =>
          s.id === targetStepId || s.senderId === targetStepId || s.targetId === targetStepId
        );
        if (found !== -1) {
          runAgencyStep(found);
          return;
        }
      }
      runAgencyStep(currentAgencyStepIdx);
    },
    getCurrentAgencyStep: () => AGENCY_PIPELINE_STEPS[currentAgencyStepIdx],
    triggerAgentChat: (id, text) => {
      if (nodes[id]) {
        nodes[id].say(text || getDynamicDialogue(id, 'desk_chat'), 6.5);
      }
    },
    destroy: () => {
      isRunning = false;
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      controls.dispose();
      renderer.dispose();
    }
  };
}
