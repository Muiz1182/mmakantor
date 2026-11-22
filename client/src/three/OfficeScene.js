import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Layout posisi zona kerja (koordinat meja utama)
const LAYOUT = {
  ceo:   { cx: -18, cz: -14, w: 10, d: 8, label: 'Ruang CEO' },
  plan:  { cx: -2,  cz: -14, w: 18, d: 8, label: 'Ruang Strategi & Analis' },
  write: { cx: -18, cz: -3,  w: 10, d: 8, label: 'Meja Naskah' },
  prod:  { cx: 16,  cz: -10, w: 14, d: 10, label: 'Studio Produksi & Editor' },
  pub:   { cx: -4,  cz: 12,  w: 22, d: 10, label: 'Meja Publikasi Medsos' }
};

// Ruang Santai & Fasilitas (Lunch Cafe, PS/Billiard, Pool, Musholla & Gym)
const ROOM3 = {
  lunch: {
    dx: 6,
    entry: [[6, -4], [6, -1]],
    spots: [
      [8, -2, 's', 8, -4, 0],
      [11, -2, 's', 11, -4, 0],
      [14, -2, 's', 14, -4, 0],
      [8, 2, 's', 8, 0, 0],
      [11, 2, 's', 11, 0, 0]
    ]
  },
  ps: {
    dx: -16,
    entry: [[-16, 5], [-16, 8]],
    spots: [
      [-19, 9, 's', -16, 9, 0],
      [-19, 12, 's', -16, 12, 0],
      [-13, 9, 's', -16, 9, 0],
      [-13, 14, 's', -16, 14, 0],
      [-18, 15, 's', -18, 12, 0]
    ]
  },
  pool: {
    dx: 0,
    entry: [[0, -4], [0, -2], [0, 0]],
    // Berada di panggung terangkat (y = 1.2), perenang di y = 0.8
    spots: [
      [-2, 1, 'w', 0, 1, 0.7],
      [2, 1, 'w', 0, 1, 0.7],
      [-2, 3, 'w', 0, 3, 0.7],
      [2, 3, 'w', 0, 3, 0.7],
      [0, 2, 'w', 0, 2, 0.7]
    ]
  },
  dorm: {
    // Area Istirahat / Musholla & Gym
    dx: -18,
    entry: [[-18, -4], [-18, -2]],
    spots: [
      [-20, 2, 'l', -20, 0, 0.3],
      [-22, 2, 'l', -22, 0, 0.3],
      [-20, 5, 'l', -20, 3, 0.3],
      [-22, 5, 'l', -22, 3, 0.3]
    ]
  }
};

const POOL_BOUNDS = [-4.5, 4.5, -0.5, 4.5];

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
  ctx.quadraticCurveTo(px, py, px + r, py);
  ctx.closePath();
}

export function initOfficeScene(canvas, { onSelectAgent, getAgentsData, getThemeTokens }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (err) {
    console.warn('WebGLRenderer initialization failed:', err);
    return null;
  }

  renderer.setClearColor(0x0a0f16, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  // Kamera Isometrik Presisi (Sudut ~45 derajat atas khas denah arsitektur)
  const camera = new THREE.PerspectiveCamera(32, 1, 1, 500);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.screenSpacePanning = true;
  controls.minPolarAngle = 0.3;
  controls.maxPolarAngle = 1.35;
  controls.minDistance = 15;
  controls.maxDistance = 120;

  // Pencahayaan Arsitektural Mewah
  const hemi = new THREE.HemisphereLight(0xeef5fc, 0x1a2634, 0.65);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff8ee, 0.85);
  sun.position.set(-35, 60, 40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004;
  const sc = sun.shadow.camera;
  sc.left = -40; sc.right = 40; sc.top = 40; sc.bottom = -40; sc.near = 10; sc.far = 140;
  sc.updateProjectionMatrix();
  scene.add(sun);
  scene.add(sun.target);
  sun.target.position.set(0, 0, 0);

  // Lampu Aksen Lembut Tambahan untuk suasana malam / kontras
  const fillLight = new THREE.DirectionalLight(0x7aa2ff, 0.3);
  fillLight.position.set(30, 40, -30);
  scene.add(fillLight);

  const lam = (color, opts = {}) => new THREE.MeshLambertMaterial({ color, ...opts });
  const bxg = (w, h, d) => new THREE.BoxGeometry(w, h, d);

  // Material Library
  const M = {
    floorMarble: lam(0xf0ece1),
    floorWood:   lam(0xb58b5e),
    floorDeck:   lam(0x8c6239),
    floorCarpet: lam(0x274c3d),
    floorGym:    lam(0x36414c),
    wallGlass:   new THREE.MeshPhysicalMaterial({
      color: 0xcde7f5,
      transparent: true,
      opacity: 0.38,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 0.5
    }),
    wallHalf:    lam(0x2b3846),
    woodDark:    lam(0x4a3424),
    woodDesk:    lam(0xc79d6e),
    metalChrome: new THREE.MeshStandardMaterial({ color: 0xdde3ea, roughness: 0.25, metalness: 0.75 }),
    blackLeather: lam(0x181e24),
    water:       new THREE.MeshPhysicalMaterial({
      color: 0x1bb1e7,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
      transmission: 0.5
    }),
    billiardFelt: lam(0x1b7340),
    greenScreen: lam(0x00c853),
    plantPot:    lam(0x8a5a3c),
    plantLeaf:   lam(0x2e7d32),
    cushionYellow: lam(0xffb300),
    cushionOrange: lam(0xf4511e),
    cushionBlue:   lam(0x1e88e5),
    goldAccent:  lam(0xd4af37)
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

  // =========================================================================
  // 1. LANTAI DASAR DAN PEMBAGIAN ZONA (Base Floor Architecture)
  // =========================================================================
  // Lantai utama marmer luas
  mk(bxg(56, 0.6, 44), M.floorMarble, 0, -0.3, 0, scene, true);

  // Lantai Kayu Eksekutif (Sayap Kiri Atas: Ruang CEO & Naskah)
  mk(bxg(12, 0.1, 20), M.floorWood, -18, 0.05, -9, scene, true);

  // Lantai Kayu Strategi & Meeting (Atas Tengah)
  mk(bxg(20, 0.1, 12), M.floorWood, -2, 0.05, -13, scene, true);

  // Lantai Studio (Kanan Atas)
  mk(bxg(16, 0.1, 14), M.floorMarble, 16, 0.05, -9, scene, true);

  // Lantai Cafe / Lounge (Kanan Tengah)
  mk(bxg(16, 0.1, 12), M.floorWood, 11, 0.05, 0, scene, true);

  // Lantai Game / Billiard (Kiri Bawah)
  mk(bxg(12, 0.1, 14), M.floorWood, -18, 0.05, 11, scene, true);

  // Lantai Karpet Musholla (Kiri Bawah Sayap)
  mk(bxg(10, 0.1, 10), M.floorCarpet, -22, 0.05, 3, scene, true);
  // Garis shaf sajadah hijau
  for (let s = -1; s <= 3; s += 1.8) {
    B(9.2, 0.02, 0.1, 0xd4af37, -22, 0.11, s);
  }

  // Lantai Gym (Kanan Bawah)
  mk(bxg(14, 0.1, 10), M.floorGym, 14, 0.05, 12, scene, true);

  // =========================================================================
  // 2. PODIUM TENGAH & KOLAM RENANG BERTINGKAT (Elevated Central Pool)
  // =========================================================================
  // Podium kayu terangkat 1.2 unit di atas lantai utama
  const poolDeck = mk(bxg(16, 1.2, 12), M.floorDeck, 0, 0.6, 2, scene, true);

  // Tangga kayu naik ke podium kolam (depan dan belakang)
  [-4.5, 4.5].forEach(tz => {
    for (let st = 0; st < 3; st++) {
      B(4, 0.25, 0.6, M.floorDeck, 0, 0.125 + st * 0.25, tz + (tz > 0 ? (st + 1) * 0.5 : -(st + 1) * 0.5));
    }
  });

  // Lubang kolam renang (air transparan biru berkilau)
  const poolWater = mk(bxg(9, 0.8, 6), M.water, 0, 0.95, 2, scene, true);

  // Tepian ubin putih kolam renang
  B(10, 0.15, 0.6, 0xffffff, 0, 1.25, -1.2);
  B(10, 0.15, 0.6, 0xffffff, 0, 1.25, 5.2);
  B(0.6, 0.15, 7, 0xffffff, -4.8, 1.25, 2);
  B(0.6, 0.15, 7, 0xffffff, 4.8, 1.25, 2);

  // Pagar Kaca Pengaman di Sekeliling Podium Kolam
  [-7.8, 7.8].forEach(px => {
    B(0.1, 0.8, 11.6, M.wallGlass, px, 1.6, 2);
    // Tiang pagar chrome
    for (let pz = -3; pz <= 7; pz += 2.5) {
      B(0.12, 0.8, 0.12, M.metalChrome, px, 1.6, pz);
    }
  });

  // Kursi Santai Lounger di Tepi Kolam
  [[-6.2, 0], [-6.2, 3], [6.2, 0], [6.2, 3]].forEach(([lx, lz]) => {
    B(2.2, 0.25, 1.0, 0xffffff, lx, 1.35, lz);
    B(0.8, 0.45, 0.95, 0xffffff, lx + (lx > 0 ? -0.7 : 0.7), 1.55, lz);
    B(0.7, 0.1, 0.7, 0x3aa7ff, lx + (lx > 0 ? 0.7 : -0.7), 1.48, lz);
  });

  // =========================================================================
  // 3. RUANG CEO & RUANG MEETING BERDINDING KACA (Executive Suites)
  // =========================================================================
  // Dinding kaca Ruang CEO
  B(0.15, 3.2, 7.8, M.wallGlass, -13, 1.6, -14);
  B(9.8, 3.2, 0.15, M.wallGlass, -18, 1.6, -10);

  // Meja Eksekutif CEO
  B(4.0, 0.16, 1.8, M.woodDark, -18, 1.0, -15);
  B(0.2, 0.9, 1.6, M.metalChrome, -19.8, 0.45, -15);
  B(0.2, 0.9, 1.6, M.metalChrome, -16.2, 0.45, -15);
  // Kursi Direktur Kulit Hitam
  B(1.2, 1.6, 1.0, M.blackLeather, -18, 1.2, -16.4);
  // Rak buku mewah di belakang CEO
  B(7.0, 3.0, 0.6, M.woodDark, -18, 1.5, -17.6);
  // Tanaman pot hias eksekutif
  createPlant(-14, -14);
  createPlant(-22, -14);

  // =========================================================================
  // 4. RUANG STRATEGI & ANALIS (Open Trading / Strategy Desks)
  // =========================================================================
  // Whiteboard ide besar dengan sticky notes
  B(9, 2.6, 0.15, lam(0xf8fafc), -2, 2.2, -17.8);
  const noteColors = [0xffd166, 0xef8354, 0x8ecae6, 0xb7e4c7, 0xf72585];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 7; c++) {
      const np = mk(new THREE.PlaneGeometry(0.8, 0.8), lam(noteColors[(r * 3 + c) % noteColors.length]));
      np.position.set(-5 + c * 1.2, 2.7 - r * 0.7, -17.7);
      scene.add(np);
    }
  }

  // =========================================================================
  // 5. STUDIO PRODUKSI (Green Screen & Studio Rig)
  // =========================================================================
  // Green Screen Dinding Lengkung & Lantai
  const gsWall = B(8, 3.5, 0.15, M.greenScreen, 16, 1.75, -15.8);
  B(8, 0.05, 4, M.greenScreen, 16, 0.08, -13.8);

  // Lampu Softbox Studio
  function createSoftbox(x, z) {
    B(0.1, 2.6, 0.1, M.metalChrome, x, 1.3, z);
    const box = B(1.6, 1.8, 0.4, lam(0x1a1a1a), x, 2.5, z);
    box.rotation.y = 0.4;
    B(1.4, 1.6, 0.05, lam(0xffffff), x - 0.1, 2.5, z + 0.15);
  }
  createSoftbox(12, -12);
  createSoftbox(20, -12);

  // Tripod Kamera Video Profesional
  function createStudioCamera(x, z) {
    [0, 2.09, 4.18].forEach(ang => {
      const leg = B(0.06, 2.2, 0.06, M.metalChrome, x + Math.sin(ang) * 0.6, 1.1, z + Math.cos(ang) * 0.6);
      leg.rotation.x = Math.cos(ang) * 0.2;
      leg.rotation.z = Math.sin(ang) * 0.2;
    });
    B(0.9, 0.6, 0.7, lam(0x111827), x, 2.1, z);
    const lens = mk(new THREE.CylinderGeometry(0.2, 0.24, 0.6, 16), lam(0x111827), x, 2.1, z + 0.5);
    lens.rotation.x = Math.PI / 2;
    // Monitor layar kamera
    B(0.5, 0.35, 0.05, lam(0x38bdf8), x + 0.35, 2.3, z);
  }
  createStudioCamera(16, -10.5);

  // =========================================================================
  // 6. CAFE / COFFEE BAR / PANTRY (Dining & Coffee Lounge)
  // =========================================================================
  // Bar Counter Kayu Mewah
  B(8.0, 1.1, 1.2, M.woodDark, 11, 0.55, -4);
  B(8.2, 0.12, 1.4, M.woodDesk, 11, 1.12, -4);
  // Mesin Kopi Espresso Modern & Rak Minuman
  B(1.0, 0.7, 0.6, M.metalChrome, 8.5, 1.5, -4);
  B(0.8, 1.8, 0.7, lam(0xe2e8f0), 14, 1.0, -4);
  B(7.0, 2.4, 0.4, M.woodDark, 11, 1.8, -5.8);

  // Kursi Bar Tinggi Stool
  [8, 10, 12, 14].forEach(bx => {
    B(0.1, 0.7, 0.1, M.metalChrome, bx, 0.35, -2.6);
    B(0.6, 0.1, 0.6, M.woodDark, bx, 0.72, -2.6);
  });

  // Meja Bulat Cafe Santai
  function createCafeTable(x, z) {
    mk(new THREE.CylinderGeometry(0.8, 0.8, 0.08, 16), M.woodDesk, x, 0.85, z);
    mk(new THREE.CylinderGeometry(0.08, 0.08, 0.85, 8), M.metalChrome, x, 0.42, z);
    [[-0.9, 0], [0.9, 0], [0, -0.9], [0, 0.9]].forEach(([cx, cz]) => {
      mk(new THREE.CylinderGeometry(0.3, 0.3, 0.5, 12), lam(0x374151), x + cx, 0.25, z + cz);
    });
  }
  createCafeTable(9, 2);
  createCafeTable(13, 2);

  // =========================================================================
  // 7. RUANG GAME / BILLIARD & PLAYSTATION LOUNGE
  // =========================================================================
  // Meja Biliar Mewah (Green Felt & Wooden Body)
  function createBilliardTable(x, z) {
    B(4.8, 0.75, 2.8, M.woodDark, x, 0.4, z);
    B(4.4, 0.08, 2.4, M.billiardFelt, x, 0.8, z);
    // Bola biliar & stik
    B(0.18, 0.18, 0.18, lam(0xffffff), x, 0.88, z);
    B(0.18, 0.18, 0.18, lam(0xef4444), x + 0.4, 0.88, z + 0.2);
    B(0.18, 0.18, 0.18, lam(0xf59e0b), x + 0.5, 0.88, z - 0.2);
    // Lampu gantung meja biliar
    B(3.0, 0.3, 0.8, lam(0x1e293b), x, 2.4, z);
    B(0.04, 1.2, 0.04, M.metalChrome, x - 1.0, 3.0, z);
    B(0.04, 1.2, 0.04, M.metalChrome, x + 1.0, 3.0, z);
  }
  createBilliardTable(-16, 9);

  // Bean Bags Santai Warna-warni
  function createBeanBag(x, z, col) {
    const bb = mk(new THREE.SphereGeometry(0.55, 12, 10), lam(col), x, 0.35, z);
    bb.scale.set(1.1, 0.75, 1.1);
  }
  createBeanBag(-13, 7, 0xffb300);
  createBeanBag(-14.5, 6.5, 0xf4511e);
  createBeanBag(-13.5, 13, 0x1e88e5);

  // Sofa Game TV Besar
  B(4.0, 0.6, 1.4, lam(0x2d3748), -19, 0.3, 15);
  B(4.0, 1.0, 0.4, lam(0x1f2937), -19, 0.8, 15.6);
  // Layar TV Gaming Menyala
  B(3.4, 1.8, 0.1, lam(0x0f172a), -19, 1.8, 17.6);
  B(3.2, 1.6, 0.05, lam(0x38bdf8), -19, 1.8, 17.52);

  // =========================================================================
  // 8. GYM FITNESS & SERVER TECH HUB (Kanan Bawah)
  // =========================================================================
  // Treadmill Olahraga
  function createTreadmill(x, z) {
    B(1.8, 0.25, 0.9, lam(0x1f2937), x, 0.125, z);
    B(0.1, 1.1, 0.1, M.metalChrome, x - 0.7, 0.65, z - 0.38);
    B(0.1, 1.1, 0.1, M.metalChrome, x - 0.7, 0.65, z + 0.38);
    B(0.5, 0.3, 0.8, lam(0x374151), x - 0.7, 1.2, z);
  }
  createTreadmill(11, 14);
  createTreadmill(13.5, 14);
  createTreadmill(16, 14);

  // Rak Server Data Center Berdinding Kaca
  B(0.15, 3.0, 7.5, M.wallGlass, 18.5, 1.5, 9.5);
  [7, 9.5, 12].forEach(sz => {
    B(1.6, 2.5, 1.2, lam(0x0f172a), 20.5, 1.25, sz);
    // Lampu indikator server berkedip
    B(0.05, 0.1, 0.9, lam(0x22c55e), 19.68, 2.0, sz);
    B(0.05, 0.1, 0.9, lam(0x38bdf8), 19.68, 1.5, sz);
  });

  // Tanaman Pot Dekoratif Selasar
  function createPlant(x, z) {
    mk(new THREE.CylinderGeometry(0.4, 0.3, 0.6, 10), M.plantPot, x, 0.3, z);
    mk(new THREE.SphereGeometry(0.55, 10, 8), M.plantLeaf, x, 0.9, z);
    mk(new THREE.SphereGeometry(0.42, 10, 8), M.plantLeaf, x + 0.2, 1.25, z + 0.1);
    mk(new THREE.SphereGeometry(0.38, 10, 8), M.plantLeaf, x - 0.15, 1.2, z - 0.15);
  }
  createPlant(-9, -10);
  createPlant(7, -10);
  createPlant(-9, 6);
  createPlant(7, 6);
  createPlant(18, 5);
  createPlant(-11, 16);

  // =========================================================================
  // 9. MEJA & KARAKTER 3D KARYAWAN (14 Orang: CEO + 13 Agen AI)
  // =========================================================================
  function getScreenTexture(kind) {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 80;
    const x = c.getContext('2d');
    const bg = { working: '#0d3829', waiting: '#1e293b', attention: '#451a03' }[kind] || '#1e293b';
    const fg = { working: '#34d399', waiting: '#94a3b8', attention: '#fb923c' }[kind] || '#94a3b8';
    x.fillStyle = bg;
    x.fillRect(0, 0, 128, 80);
    x.fillStyle = fg;
    [[10, 12, 70], [10, 24, 98], [10, 36, 54], [10, 48, 86], [10, 60, 40]].forEach(q => {
      x.fillRect(q[0], q[1], q[2], 6);
    });
    return new THREE.CanvasTexture(c);
  }

  function buildAgent(a, x, z, idx) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    scene.add(g);
    const o = { id: a.id, x, z, ph: idx * 1.7 + 0.5, kind: null, text: null };

    function reg(mesh) {
      mesh.userData.agentId = a.id;
      pickables.push(mesh);
      return mesh;
    }

    // Meja Kerja Modern
    reg(mk(bxg(2.6, 0.12, 1.4), M.woodDesk, 0, 1.0, 0, g));
    reg(mk(bxg(0.12, 0.94, 1.3), M.metalChrome, -1.2, 0.47, 0, g));
    reg(mk(bxg(0.12, 0.94, 1.3), M.metalChrome, 1.2, 0.47, 0, g));

    // Monitor Ganda (Dual Screens)
    [-0.55, 0.55].forEach(mx => {
      reg(mk(bxg(0.08, 0.28, 0.08), M.metalChrome, mx, 1.2, -0.25, g));
      reg(mk(bxg(1.0, 0.65, 0.06), M.blackLeather, mx, 1.65, -0.25, g));
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 0.56), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      scr.position.set(mx, 1.65, -0.215);
      g.add(scr);
      reg(scr);
      if (mx < 0) o.scr = scr;
    });

    // Keyboard & Mousepad
    reg(mk(bxg(0.8, 0.03, 0.28), M.blackLeather, 0, 1.08, 0.25, g));

    // Kursi Ergonomis
    reg(mk(bxg(0.9, 0.12, 0.9), M.blackLeather, 0, 0.62, 1.35, g));
    reg(mk(bxg(0.9, 0.9, 0.12), M.blackLeather, 0, 1.15, 1.85, g));
    reg(mk(new THREE.CylinderGeometry(0.08, 0.08, 0.55, 8), M.metalChrome, 0, 0.3, 1.35, g));
    reg(mk(new THREE.CylinderGeometry(0.45, 0.45, 0.05, 12), M.metalChrome, 0, 0.05, 1.35, g));

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

    // Tubuh Silinder
    reg(mk(new THREE.CylinderGeometry(0.32, 0.36, 0.92, 12), shirt, 0, 1.3, 0, pg));

    // Kaki Duduk & Kaki Berdiri
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

    // Kepala & Rambut
    o.headG = new THREE.Group();
    o.headG.position.set(0, 2.05, 0);
    pg.add(o.headG);
    reg(mk(new THREE.SphereGeometry(0.3, 16, 12), skin, 0, 0, 0, o.headG));
    reg(mk(new THREE.SphereGeometry(0.33, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), hair, 0, 0.03, 0.04, o.headG));

    // Lengan Karakter
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

    // Penanda Status & Label Melayang di Atas Kepala
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
    reg(sp);

    // Cincin Seleksi & Hover di Lantai
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

  // Populate Agents ke Zona Masing-masing
  const initialAgents = getAgentsData();
  Object.keys(LAYOUT).forEach(zId => {
    const L = LAYOUT[zId];
    const list = initialAgents.filter(a => a.zone === zId);
    list.forEach((a, i) => {
      nodes[a.id] = buildAgent(a, L.cx - L.w / 2 + (L.w / (list.length + 1)) * (i + 1), L.cz, i);
      nodes[a.id].zone = zId;
      nodes[a.id].lane = L.cz + 4.5;
    });
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
  // 10. NAVIGASI LORONG ANTI-TEMBUS DINDING & PERPINDAHAN TEMPAT
  // =========================================================================
  function snapAgent(o, at, sl, instant) {
    const q = at === 'desk' ? null : ROOM3[at].spots[sl];
    o.at = at;
    o.sl = sl;
    o.mode = q ? 'rest' : 'seat';
    o.pose = q ? q[2] : 'd';
    o.fy = q ? Math.atan2(-(q[3] - q[0]), -(q[4] - q[1])) : 0;
    o.ty = q ? q[5] : 0;
    if (instant) {
      o.x = q ? q[0] : o.sx;
      o.z = q ? q[1] : o.sz;
      o.ry = o.fy;
      o.y = o.ty;
      o.rx = o.pose === 'l' ? 1.5708 : 0;
    }
  }

  function getWaypoints(o, at, sl) {
    if (at === 'desk') {
      const sx = o.sx + 1;
      const c = [[o.sx, o.sz], [sx, o.sz], [sx, o.lane]];
      if (o.zone !== 'pub') {
        const ax = o.sx < 0 ? -12 : 12;
        c.push([ax, o.lane], [ax, 0]);
      }
      return c;
    }
    const r = ROOM3[at];
    const q = r.spots[sl];
    return [[r.dx, 0], ...r.entry, [q[0], q[1]]];
  }

  function steerAgent(o, a, dt) {
    const at = a.at || 'desk';
    const sl = a.slot || 0;
    const k = `${at}:${sl}`;
    const k1 = Math.min(1, dt * 7);

    if (o.key === undefined) {
      o.key = k;
      snapAgent(o, at, sl, true);
    }

    if (o.mode !== 'walk' && o.key !== k && o.rx < 0.2) {
      const A = getWaypoints(o, o.at, o.sl);
      const Bc = getWaypoints(o, at, sl);
      let path;
      if (o.at !== 'desk' && o.at === at) {
        path = [...ROOM3[at].entry.slice(-1), Bc[Bc.length - 1]];
      } else {
        path = (o.at === 'desk' ? A : A.slice().reverse()).concat(at === 'desk' ? Bc.slice().reverse() : Bc);
      }
      o.path = path;
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
        const st = 6.0 * dt;
        if (dd <= st) {
          o.x = w[0];
          o.z = w[1];
          o.path.shift();
        } else {
          o.x += (dx / dd) * st;
          o.z += (dz / dd) * st;
          o.ry += wrapAngle(Math.atan2(-dx, -dz) - o.ry) * Math.min(1, dt * 10);
        }
        // Naik ke podium jika melewati kolam renang
        const inPoolArea = (o.x > POOL_BOUNDS[0] && o.x < POOL_BOUNDS[1] && o.z > POOL_BOUNDS[2] && o.z < POOL_BOUNDS[3]);
        o.ty = inPoolArea ? 0.7 : 0;
      }
    } else {
      o.ry += wrapAngle(o.fy - o.ry) * k1;
    }

    o.y += (o.ty - o.y) * k1;
    o.rx += ((o.mode === 'rest' && o.pose === 'l' ? 1.5708 : 0) - o.rx) * Math.min(1, dt * 5);

    const sit = o.mode === 'seat' || (o.mode === 'rest' && o.pose === 's');
    o.seat.visible = sit;
    o.stand.visible = !sit;

    o.pg.position.set(o.x, o.y, o.z);
    o.pg.rotation.set(o.rx, o.ry, 0);
    o.tag.position.set(o.x, o.y, o.z + (o.pose === 'l' ? 1 : 0));

    const off = o.mode !== 'seat';
    o.ring.position.z = o.hov.position.z = off ? 0 : -0.7;
    o.ring.scale.setScalar(off ? 0.5 : 1);
    o.hov.scale.setScalar(off ? 0.5 : 1);
  }

  // =========================================================================
  // 11. KONTROL KAMERA ISOMETRIK
  // =========================================================================
  let glide = null;

  function resetCamera() {
    controls.target.set(0, 0, 0);
    // Posisi isometrik diagonal dari sudut bawah-kanan/depan
    camera.position.set(38, 48, 52);
    camera.lookAt(controls.target);
    controls.update();
    glide = null;
  }

  function focusAgent(id) {
    const o = nodes[id];
    if (!o) return;
    const tgt = new THREE.Vector3(o.x, 1.2, o.z + (o.mode === 'seat' ? -0.5 : 0.3));
    const off = camera.position.clone().sub(controls.target);
    off.setLength(Math.min(off.length(), 32));
    glide = { t: tgt, p: tgt.clone().add(off) };
  }

  controls.addEventListener('start', () => { glide = null; });

  // Raycasting (Pilih Meja / Karakter)
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
    if (id && onSelectAgent) {
      onSelectAgent(id);
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
        aL = aR = -1.35;
      } else if (o.pose === 'w') {
        aL += Math.sin(time * 3 + p) * 0.9 * amp;
        aR += Math.sin(time * 3 + p + 3) * 0.9 * amp;
        lg = Math.sin(time * 5 + p) * 0.4 * amp;
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

    controls.target.x = Math.max(-28, Math.min(28, controls.target.x));
    controls.target.z = Math.max(-24, Math.min(24, controls.target.z));
    controls.update();

    renderer.render(scene, camera);
  }

  function sync(currentAgents, selId) {
    selectedId = selId;
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
  resize();
  resetCamera();
  requestAnimationFrame(animate);

  return {
    sync,
    focus: focusAgent,
    resetCamera,
    applyTheme,
    resize,
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
