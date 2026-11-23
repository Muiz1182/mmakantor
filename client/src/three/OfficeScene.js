import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Koordinat batas & pusat tiap ruangan (Sekat-sekat denah arsitektur)
const ROOM_DEFS = {
  // Ruang Kerja
  ceo:      { id: 'ceo',      label: 'Ruang CEO',            x0: -24, x1: -13, z0: -19, z1: -9, floor: 'wood',   door: { x: -13, z: -14, axis: 'x' } },
  plan:     { id: 'plan',     label: 'Ruang Strategi',       x0: -11, x1: 7,   z0: -19, z1: -9, floor: 'wood',   door: { x: -2,  z: -9,  axis: 'z' } },
  prod:     { id: 'prod',     label: 'Studio Produksi',      x0: 9,   x1: 24,  z0: -19, z1: -9, floor: 'studio', door: { x: 9,   z: -14, axis: 'x' } },
  write:    { id: 'write',    label: 'Meja Naskah',          x0: -24, x1: -11, z0: -7,  z1: 1,  floor: 'wood',   door: { x: -11, z: -3,  axis: 'x' } },
  pub:      { id: 'pub',      label: 'Meja Publikasi',       x0: -16, x1: 16,  z0: 12,  z1: 21, floor: 'wood',   door: { x: 0,   z: 12,  axis: 'z' } },

  // Ruang Santai
  dorm:     { id: 'dorm',     label: 'Asrama Karyawan',      x0: -24, x1: -11, z0: 3,   z1: 11, floor: 'dorm',   door: { x: -11, z: 7,   axis: 'x' } },
  lunch:    { id: 'lunch',    label: 'Ruang Lunch / Cafe',   x0: 11,  x1: 24,  z0: -7,  z1: 1,  floor: 'cafe',   door: { x: 11,  z: -3,  axis: 'x' } },
  ps:       { id: 'ps',       label: 'Ruang PlayStation',    x0: 11,  x1: 24,  z0: 3,   z1: 11, floor: 'ps',     door: { x: 11,  z: 7,   axis: 'x' } },
  pool:     { id: 'pool',     label: 'Kolam Renang',         x0: -8,  x1: 8,   z0: -3,  z1: 7,  floor: 'pool',   door: { x: 0,   z: -3,  axis: 'z' } }
};

// Spot posisi istirahat per ruang santai
const ROOM3 = {
  lunch: {
    dx: 11,
    entry: [[8, -3], [13, -3]],
    spots: [
      [14, -1, 's', 14, -4, 0],
      [17, -1, 's', 17, -4, 0],
      [20, -1, 's', 20, -4, 0],
      [16, -5, 's', 16, -2, 0],
      [19, -5, 's', 19, -2, 0]
    ]
  },
  ps: {
    dx: 11,
    entry: [[8, 7], [13, 7]],
    spots: [
      [14, 5, 's', 18, 5, 0],
      [14, 9, 's', 18, 9, 0],
      [18, 5, 's', 14, 5, 0],
      [21, 5, 's', 18, 5, 0],
      [21, 9, 's', 18, 9, 0]
    ]
  },
  pool: {
    dx: 0,
    entry: [[0, -6], [0, -4]],
    spots: [
      [-3, 1, 'w', 0, 1, 0.2],
      [3, 1, 'w', 0, 1, 0.2],
      [-3, 4, 'w', 0, 4, 0.2],
      [3, 4, 'w', 0, 4, 0.2],
      [0, 2.5, 'w', 0, 2.5, 0.2]
    ]
  },
  dorm: {
    // 4 Tempat Tidur Lengkap di Asrama (Pusat ranjang di bx: -19.5 & -14.5, bz: 5 & 9)
    // Posisi tidur: kaki di bx + 1.0, kepala di bx - 1.05 (di atas bantal)
    dx: -11,
    entry: [[-8, 7], [-12, 7]],
    spots: [
      [-18.5, 5, 'l', -19.5, 5, 0.78],
      [-13.5, 5, 'l', -14.5, 5, 0.78],
      [-18.5, 9, 'l', -19.5, 9, 0.78],
      [-13.5, 9, 'l', -14.5, 9, 0.78]
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

  // Kamera Isometrik Arsitektur (~32 deg FOV, miring 45 derajat)
  const camera = new THREE.PerspectiveCamera(34, 1, 1, 500);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.screenSpacePanning = true;
  controls.minPolarAngle = 0.3;
  controls.maxPolarAngle = 1.35;
  controls.minDistance = 15;
  controls.maxDistance = 130;

  // Pencahayaan Lembut & Berbayang
  const hemi = new THREE.HemisphereLight(0xf0f6fc, 0x1e293b, 0.7);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfffbf2, 0.85);
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

  const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.35);
  fillLight.position.set(30, 40, -30);
  scene.add(fillLight);

  const lam = (color, opts = {}) => new THREE.MeshLambertMaterial({ color, ...opts });
  const bxg = (w, h, d) => new THREE.BoxGeometry(w, h, d);

  // Material Library
  const M = {
    floorHall:   lam(0x1e293b), // Lorong abu-abu modern
    floorWood:   lam(0xb08968), // Lantai kayu hangat
    floorDorm:   lam(0x9c7853), // Lantai asrama kayu
    floorStudio: lam(0x111827), // Studio lantai hitam
    floorCafe:   lam(0xd4a373), // Cafe ubin kayu
    floorPS:     lam(0x2d2a4a), // PS lounge karpet gelap
    floorPool:   lam(0x60a5fa), // Deck kolam renang
    wall:        lam(0x475569), // Sekat dinding utama
    wallGlass:   new THREE.MeshPhysicalMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.35, roughness: 0.1 }),
    woodDesk:    lam(0xc79d6e),
    woodDark:    lam(0x4a3424),
    metalChrome: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.7 }),
    blackLeather: lam(0x1e293b),
    water:       new THREE.MeshPhysicalMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.8, roughness: 0.1 }),
    greenScreen: lam(0x10b981),
    bedSheet:    lam(0xf8fafc),
    pillow:      lam(0x38bdf8),
    billiard:    lam(0x15803d)
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

  // 1. LANTAI DASAR LORONG UTAMA
  mk(bxg(56, 0.5, 46), M.floorHall, 0, -0.25, 0, scene, true);

  // 2. LANTAI PER RUANGAN
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

    mk(bxg(w, 0.08, d), mat, cx, 0.04, cz, scene, true);
  });

  // 3. SEKAT-SEKAT DINDING ARSITEKTUR LENGKAP DENGAN PINTU (Wall Partitions with Doors)
  const WALL_H = 2.0;
  const WALL_T = 0.28;
  const DOOR_W = 2.2;

  function buildWalledRoom(r, isGlass = false) {
    const mat = isGlass ? M.wallGlass : M.wall;
    const w = r.x1 - r.x0;
    const d = r.z1 - r.z0;
    const cx = (r.x0 + r.x1) / 2;
    const cz = (r.z0 + r.z1) / 2;
    const y = WALL_H / 2 + 0.04;

    // Dinding Utara (z0)
    if (r.door.axis === 'z' && Math.abs(r.door.z - r.z0) < 0.5) {
      // Pintu di Utara
      const w1 = r.door.x - r.x0 - DOOR_W / 2;
      const w2 = r.x1 - (r.door.x + DOOR_W / 2);
      if (w1 > 0.1) B(w1, WALL_H, WALL_T, mat, r.x0 + w1 / 2, y, r.z0);
      if (w2 > 0.1) B(w2, WALL_H, WALL_T, mat, r.x1 - w2 / 2, y, r.z0);
    } else {
      B(w, WALL_H, WALL_T, mat, cx, y, r.z0);
    }

    // Dinding Selatan (z1)
    if (r.door.axis === 'z' && Math.abs(r.door.z - r.z1) < 0.5) {
      // Pintu di Selatan
      const w1 = r.door.x - r.x0 - DOOR_W / 2;
      const w2 = r.x1 - (r.door.x + DOOR_W / 2);
      if (w1 > 0.1) B(w1, WALL_H, WALL_T, mat, r.x0 + w1 / 2, y, r.z1);
      if (w2 > 0.1) B(w2, WALL_H, WALL_T, mat, r.x1 - w2 / 2, y, r.z1);
    } else {
      B(w, WALL_H, WALL_T, mat, cx, y, r.z1);
    }

    // Dinding Barat (x0)
    if (r.door.axis === 'x' && Math.abs(r.door.x - r.x0) < 0.5) {
      // Pintu di Barat
      const d1 = r.door.z - r.z0 - DOOR_W / 2;
      const d2 = r.z1 - (r.door.z + DOOR_W / 2);
      if (d1 > 0.1) B(WALL_T, WALL_H, d1, mat, r.x0, y, r.z0 + d1 / 2);
      if (d2 > 0.1) B(WALL_T, WALL_H, d2, mat, r.x0, y, r.z1 - d2 / 2);
    } else {
      B(WALL_T, WALL_H, d, mat, r.x0, y, cz);
    }

    // Dinding Timur (x1)
    if (r.door.axis === 'x' && Math.abs(r.door.x - r.x1) < 0.5) {
      // Pintu di Timur
      const d1 = r.door.z - r.z0 - DOOR_W / 2;
      const d2 = r.z1 - (r.door.z + DOOR_W / 2);
      if (d1 > 0.1) B(WALL_T, WALL_H, d1, mat, r.x1, y, r.z0 + d1 / 2);
      if (d2 > 0.1) B(WALL_T, WALL_H, d2, mat, r.x1, y, r.z1 - d2 / 2);
    } else {
      B(WALL_T, WALL_H, d, mat, r.x1, y, cz);
    }

    // Plakat Nama Ruangan di Lantai Depan Pintu
    const c = document.createElement('canvas');
    c.width = 380; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 380, 64);
    ctx.font = '700 24px "IBM Plex Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(r.label.toUpperCase(), 190, 32);

    const tex = new THREE.CanvasTexture(c);
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.55), new THREE.MeshBasicMaterial({ map: tex }));
    pl.rotation.x = -Math.PI / 2;
    pl.position.set(cx, 0.09, r.z1 - 0.5);
    scene.add(pl);
  }

  // Bangun sekat seluruh ruangan
  Object.values(ROOM_DEFS).forEach(r => {
    buildWalledRoom(r, r.id === 'ceo');
  });

  // =========================================================================
  // 4. FURNITUR ASRAMA (4 TEMPAT TIDUR LENGKAP DENGAN KASUR & BANTAL)
  // =========================================================================
  function createBed(bx, bz, label) {
    // Rangka ranjang kayu kokoh
    B(3.4, 0.42, 1.9, M.woodDark, bx, 0.21, bz);
    // Sandaran kepala ranjang (Headboard) di sebelah kiri (X negatif)
    B(0.18, 1.15, 1.9, M.woodDark, bx - 1.6, 0.58, bz);
    // Sandaran kaki ranjang (Footboard) di sebelah kanan (X positif)
    B(0.18, 0.55, 1.9, M.woodDark, bx + 1.6, 0.28, bz);
    // Kasur empuk putih
    B(3.0, 0.26, 1.75, M.bedSheet, bx, 0.52, bz);
    // Selimut biru rapi menutupi setengah badan (dari tengah ke kaki)
    B(1.6, 0.28, 1.78, lam(0x38bdf8), bx + 0.65, 0.54, bz);
    // Bantal empuk di posisi kepala
    B(0.65, 0.16, 1.2, M.pillow, bx - 1.05, 0.7, bz);
    // Meja samping ranjang & lampu tidur kecil
    B(0.6, 0.5, 0.6, M.woodDesk, bx - 1.6, 0.25, bz + 1.25);
    B(0.25, 0.35, 0.25, lam(0xfef08a), bx - 1.6, 0.68, bz + 1.25);
  }

  // Pasang 4 Tempat Tidur di Asrama (Pusat ranjang di X: -19.5 dan -14.5, Z: 5 dan 9)
  createBed(-19.5, 5, 'Bed 1');
  createBed(-14.5, 5, 'Bed 2');
  createBed(-19.5, 9, 'Bed 3');
  createBed(-14.5, 9, 'Bed 4');
  // Lemari pakaian asrama di dinding barat
  B(0.8, 2.0, 3.6, M.woodDark, -23.5, 1.0, 7);

  // =========================================================================
  // 5. FURNITUR RUANG CEO (Executive Suite)
  // =========================================================================
  B(4.2, 0.16, 1.8, M.woodDark, -18.5, 1.0, -15);
  B(0.2, 0.9, 1.6, M.metalChrome, -20.4, 0.45, -15);
  B(0.2, 0.9, 1.6, M.metalChrome, -16.6, 0.45, -15);
  B(1.2, 1.6, 1.0, M.blackLeather, -18.5, 1.2, -16.5);
  B(6.0, 2.6, 0.5, M.woodDark, -18.5, 1.3, -18.6);

  // =========================================================================
  // 6. FURNITUR RUANG STRATEGI (Whiteboard & Meeting Table)
  // =========================================================================
  B(8.0, 2.2, 0.1, lam(0xf8fafc), -2, 2.0, -18.8);
  const noteColors = [0xffd166, 0xef8354, 0x8ecae6, 0xb7e4c7];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 6; c++) {
      const np = mk(new THREE.PlaneGeometry(0.75, 0.75), lam(noteColors[(r * 3 + c) % noteColors.length]));
      np.position.set(-4.5 + c * 1.2, 2.4 - r * 0.8, -18.74);
      scene.add(np);
    }
  }

  // =========================================================================
  // 7. STUDIO PRODUKSI (Green Screen & Kamera)
  // =========================================================================
  B(7.0, 2.8, 0.1, M.greenScreen, 16.5, 1.4, -18.8);
  B(7.0, 0.05, 3.5, M.greenScreen, 16.5, 0.07, -17.0);

  // Kamera studio & softbox
  function createSoftbox(x, z) {
    B(0.1, 2.4, 0.1, M.metalChrome, x, 1.2, z);
    B(1.4, 1.6, 0.3, lam(0x18181b), x, 2.4, z);
    B(1.2, 1.4, 0.05, lam(0xffffff), x - 0.1, 2.4, z + 0.15);
  }
  createSoftbox(13, -15);
  createSoftbox(20, -15);

  // =========================================================================
  // 8. RUANG LUNCH / CAFE
  // =========================================================================
  B(6.0, 1.05, 1.2, M.woodDark, 17.5, 0.525, -5.5);
  B(0.9, 0.6, 0.5, M.metalChrome, 15.5, 1.35, -5.5); // Mesin Espresso
  B(0.8, 1.8, 0.7, lam(0xe2e8f0), 20, 0.9, -5.5);    // Kulkas
  // Meja makan & bangku
  B(5.0, 0.85, 1.6, M.woodDesk, 17.5, 0.425, -2);
  B(4.6, 0.45, 0.6, M.woodDark, 17.5, 0.225, -3.2);
  B(4.6, 0.45, 0.6, M.woodDark, 17.5, 0.225, -0.8);

  // =========================================================================
  // 9. RUANG PLAYSTATION & BILLIARD
  // =========================================================================
  B(4.2, 0.75, 2.4, M.woodDark, 17.5, 0.375, 7);
  B(3.8, 0.08, 2.0, M.billiard, 17.5, 0.78, 7);
  // Sofa game & TV besar
  B(4.0, 0.6, 1.2, lam(0x334155), 17.5, 0.3, 10.2);
  B(3.6, 1.6, 0.1, lam(0x0f172a), 17.5, 1.6, 3.2);
  B(3.4, 1.4, 0.05, lam(0x38bdf8), 17.5, 1.6, 3.26);

  // =========================================================================
  // 10. KOLAM RENANG
  // =========================================================================
  mk(bxg(12, 0.6, 8), M.water, 0, 0.1, 2, scene, true);
  // Tepian ubin kolam
  B(13, 0.2, 0.6, 0xffffff, 0, 0.2, -1.8);
  B(13, 0.2, 0.6, 0xffffff, 0, 0.2, 5.8);
  B(0.6, 0.2, 8, 0xffffff, -6.2, 0.2, 2);
  B(0.6, 0.2, 8, 0xffffff, 6.2, 0.2, 2);

  // Loungers santai tepi kolam
  [[-4.5, -0.5], [4.5, -0.5], [-4.5, 4.5], [4.5, 4.5]].forEach(([lx, lz]) => {
    B(2.2, 0.25, 0.9, 0xffffff, lx, 0.25, lz);
    B(0.7, 0.4, 0.85, lam(0x38bdf8), lx + (lx > 0 ? -0.7 : 0.7), 0.45, lz);
  });

  // =========================================================================
  // 11. MEJA DAN KARAKTER 14 ORANG (CEO + 13 AI)
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
  nodes['ceo'] = buildAgent(initialAgents.find(a => a.id === 'ceo'), -18.5, -13.5, 0);
  nodes['ceo'].zone = 'ceo';
  nodes['ceo'].lane = -13.5;

  // 2. Ruang Strategi & Analis (4 orang)
  const stratAgents = ['auditor', 'analis', 'ide', 'perencana'];
  stratAgents.forEach((id, i) => {
    const ag = initialAgents.find(a => a.id === id);
    nodes[id] = buildAgent(ag, -8 + i * 4.2, -14, i + 1);
    nodes[id].zone = 'plan';
    nodes[id].lane = -14;
  });

  // 3. Meja Naskah (1 orang)
  nodes['naskah'] = buildAgent(initialAgents.find(a => a.id === 'naskah'), -17.5, -3, 5);
  nodes['naskah'].zone = 'write';
  nodes['naskah'].lane = -3;

  // 4. Studio Produksi (2 orang: Kamera, Editor)
  const prodAgents = ['kamera', 'editor'];
  prodAgents.forEach((id, i) => {
    const ag = initialAgents.find(a => a.id === id);
    nodes[id] = buildAgent(ag, 14 + i * 5, -13, i + 6);
    nodes[id].zone = 'prod';
    nodes[id].lane = -13;
  });

  // 5. Meja Publikasi Medsos (6 orang)
  const pubAgents = ['upload', 'caption', 'carousel', 'story', 'komentar', 'dm'];
  pubAgents.forEach((id, i) => {
    const ag = initialAgents.find(a => a.id === id);
    nodes[id] = buildAgent(ag, -12.5 + i * 5, 16.5, i + 8);
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
  // 12. NAVIGASI LEWAT PINTU & LORONG (Anti-Tembus Dinding Sekat)
  // =========================================================================
  function snapAgent(o, at, sl, instant) {
    const q = at === 'desk' ? null : ROOM3[at].spots[sl];
    o.at = at;
    o.sl = sl;
    o.mode = q ? 'rest' : 'seat';
    o.pose = q ? q[2] : 'd';
    // Untuk pose tidur telentang di ranjang asrama: ry harus -Math.PI / 2 agar kepala ke -X (bantal) dan dada ke +Y (langit-langit)
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

  function getWaypoints(o, at, sl) {
    if (at === 'desk') {
      const sx = o.sx + 1;
      const c = [[o.sx, o.sz], [sx, o.sz]];
      // Keluar lewat pintu zona masing-masing ke lorong
      if (o.zone === 'ceo') c.push([-13, -14], [-9, -14], [-9, -6]);
      else if (o.zone === 'plan') c.push([-2, -9], [-2, -6]);
      else if (o.zone === 'prod') c.push([9, -14], [9, -6]);
      else if (o.zone === 'write') c.push([-11, -3], [-9, -3], [-9, -6]);
      else if (o.zone === 'pub') c.push([0, 12], [0, 8]);
      return c;
    }
    const r = ROOM3[at];
    const q = r.spots[sl];
    return [[r.dx, -6], ...r.entry, [q[0], q[1]]];
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
      // Posisi label dan cincin pas di tengah ranjang (bx) dengan ketinggian nyaman
      o.tag.position.set(o.x - 1.0, 0, o.z);
      if (o.mk) o.mk.position.set(0, 2.0, 0);
      if (o.sp) o.sp.position.set(0, 2.6, 0);
    } else {
      o.tag.position.set(o.x, o.y, o.z);
      if (o.mk) o.mk.position.set(0, 3.2, 0);
      if (o.sp) o.sp.position.set(0, 4.0, 0);
    }

    const off = o.mode !== 'seat';
    o.ring.position.z = o.hov.position.z = off ? 0 : -0.7;
    o.ring.scale.setScalar(off ? 0.5 : 1);
    o.hov.scale.setScalar(off ? 0.5 : 1);
  }

  // =========================================================================
  // 13. KAMERA & KONTROL INTERAKTIF
  // =========================================================================
  let glide = null;

  function resetCamera() {
    controls.target.set(0, 0, 0);
    camera.position.set(36, 44, 48);
    camera.lookAt(controls.target);
    controls.update();
    glide = null;
  }

  function focusAgent(id) {
    const o = nodes[id];
    if (!o) return;
    const tgt = new THREE.Vector3(o.x, 1.2, o.z + (o.mode === 'seat' ? -0.5 : 0.3));
    const off = camera.position.clone().sub(controls.target);
    off.setLength(Math.min(off.length(), 30));
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
        aL = aR = -Math.PI / 2; // Lengan lurus santai di samping badan
        bob = 0;
        hr = 0;
        lg = 0;
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
