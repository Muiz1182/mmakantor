import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ZONES, LOUNGE_ROOMS } from '../constants/roomsData';

const LAYOUT = {
  ceo:   { cx: -10.5, cz: -7.5, w: 9,  d: 7 },
  plan:  { cx: 5,     cz: -7.5, w: 20, d: 7 },
  write: { cx: -10.5, cz: 0,    w: 9,  d: 6 },
  prod:  { cx: 5,     cz: 0,    w: 20, d: 6 },
  pub:   { cx: 0,     cz: 7.5,  w: 30, d: 7 }
};

const RC = {
  lunch: { cx: -11.75, w: 7.5, dx: -11.75 },
  ps:    { cx: -4,     w: 7,   dx: -5.9 },
  pool:  { cx: 4.25,   w: 8.5, dx: 1.2 },
  dorm:  { cx: 12.5,   w: 7,   dx: 10.6 }
};

const ROOM3 = {
  lunch: {
    dx: -11.75,
    entry: [[-11.75, 12.8], [-11.75, 13.4]],
    spots: [
      [-13.2, 15.1, 's', -13.2, 17, -0.05],
      [-11.75, 15.1, 's', -11.75, 17, -0.05],
      [-10.3, 15.1, 's', -10.3, 17, -0.05],
      [-14.9, 16.6, 's', -12, 16.6, -0.05, [[-14.9, 14]]],
      [-8.6, 16.6, 's', -11.5, 16.6, -0.05, [[-8.6, 14]]]
    ]
  },
  ps: {
    dx: -5.9,
    entry: [[-5.9, 12.8], [-5.9, 16]],
    spots: [
      [-4.9, 17.9, 's', -4.9, 12, -0.12],
      [-3.6, 17.9, 's', -3.6, 12, -0.12],
      [-2.3, 17.9, 's', -2.3, 12, -0.12],
      [-6.4, 17.4, 's', -4, 12, -0.3],
      [-1.2, 16.4, 's', -3.5, 12, -0.3]
    ]
  },
  pool: {
    dx: 1.2,
    entry: [[1.2, 12.8], [1.2, 13.6], [2.1, 16.4], [3.4, 16.4]],
    spots: [
      [4, 15.5, 'w', 4, 14, -0.5],
      [5.5, 16.4, 'w', 5.5, 14, -0.5],
      [7, 15.5, 'w', 7, 14, -0.5],
      [4.5, 17.4, 'w', 4.5, 14, -0.5],
      [6.5, 17.4, 'w', 6.5, 14, -0.5]
    ]
  },
  dorm: {
    dx: 10.6,
    entry: [[10.6, 12.8], [10.6, 13.9]],
    spots: [10.4, 11.8, 13.2, 14.6].map(x => [x, 14.9, 'l', x, 13.9, 0.9])
  }
};

const WATER = [3, 8, 14.6, 18.2];

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
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 300);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.screenSpacePanning = false;
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = 1.35;
  controls.minDistance = 8;
  controls.maxDistance = 85;

  const hemi = new THREE.HemisphereLight(0xffffff, 0xaab4be, 0.55);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffffff, 0.5);
  sun.position.set(-14, 34, 22);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0006;
  const sc = sun.shadow.camera;
  sc.left = -26; sc.right = 26; sc.top = 26; sc.bottom = -26; sc.near = 5; sc.far = 90;
  sc.updateProjectionMatrix();
  scene.add(sun);
  scene.add(sun.target);
  sun.target.position.set(0, 0, 4);

  const lam = (color) => new THREE.MeshLambertMaterial(color === undefined ? {} : { color });
  const bxg = (w, h, d) => new THREE.BoxGeometry(w, h, d);

  const M = {
    slab: lam(),
    wood: lam(),
    chair: lam(),
    dark: lam(0x1b2630),
    key: lam(0x2b3640),
    pants: lam(0x2f3b48),
    pot: lam(0x8a5a3c),
    leaf: lam(0x3e9a5e),
    board: lam(0xf4f6f8),
    metal: lam(0x8a96a3),
    light: new THREE.MeshBasicMaterial({ color: 0xfff6d8 }),
    wall: new THREE.MeshLambertMaterial({ transparent: true, opacity: 0.7 })
  };

  const ZM = {};
  ZONES.forEach(z => { ZM[z.id] = lam(); });
  LOUNGE_ROOMS.forEach(r => { ZM[r.id] = lam(); });

  function mk(geo, mat, x, y, z, parent = scene, noShadow = false) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    if (!noShadow) m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  function B(w, h, d, col, x, y, z) {
    return mk(bxg(w, h, d), lam(col), x, y, z);
  }

  const roomLabels = [];
  const nodes = {};
  const pickables = [];
  let hoverId = null;
  let selectedId = 'ceo';

  // 1. Base floor slab
  mk(bxg(34, 0.4, 34), M.slab, 0, -0.2, 5, scene, true);

  // 2. Work rooms
  ZONES.forEach(z => {
    const L = LAYOUT[z.id];
    mk(bxg(L.w, 0.1, L.d), ZM[z.id], L.cx, 0.05, L.cz, scene, true);
    mk(bxg(L.w, 1.8, 0.25), M.wall, L.cx, 0.9, L.cz - L.d / 2 + 0.125, scene, true);
    mk(bxg(0.25, 1.8, L.d), M.wall, L.cx - L.w / 2 + 0.125, 0.9, L.cz, scene, true);
    mk(bxg(0.25, 1.8, L.d), M.wall, L.cx + L.w / 2 - 0.125, 0.9, L.cz, scene, true);

    const c = document.createElement('canvas');
    c.width = 512; c.height = 64;
    const tex = new THREE.CanvasTexture(c);
    const pl = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 0.75),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
    );
    pl.rotation.x = -Math.PI / 2;
    pl.position.set(L.cx - L.w / 2 + 3.6, 0.12, L.cz + L.d / 2 - 0.6);
    scene.add(pl);
    roomLabels.push({ canvas: c, tex, text: z.label });
  });

  // 3. Props: Plants, Whiteboard, Studio Tripod
  function createPlant(x, z) {
    mk(new THREE.CylinderGeometry(0.35, 0.28, 0.5, 10), M.pot, x, 0.35, z);
    mk(new THREE.SphereGeometry(0.5, 10, 8), M.leaf, x, 1.05, z);
    mk(new THREE.SphereGeometry(0.38, 10, 8), M.leaf, x + 0.18, 1.4, z + 0.05);
    mk(new THREE.SphereGeometry(0.34, 10, 8), M.leaf, x - 0.15, 1.35, z - 0.1);
  }
  createPlant(-14, -10);
  createPlant(14.2, -10.2);
  createPlant(-14, 2.2);
  createPlant(14.2, 2.2);
  createPlant(14.3, 10.2);
  createPlant(-14.3, 10.2);

  // Whiteboard in Strategy Room
  mk(bxg(8, 2.4, 0.1), M.board, 5, 2.4, -10.6);
  mk(bxg(0.1, 1.2, 0.1), M.metal, 1.2, 0.6, -10.6);
  mk(bxg(0.1, 1.2, 0.1), M.metal, 8.8, 0.6, -10.6);
  const noteColors = [0xffd166, 0xef8354, 0x8ecae6, 0xb7e4c7];
  for (let r = 0; r < 3; r++) {
    for (let cI = 0; cI < 6; cI++) {
      if ((r * 6 + cI) % 7 === 3) continue;
      const note = new THREE.Mesh(
        new THREE.PlaneGeometry(0.8, 0.8),
        new THREE.MeshBasicMaterial({ color: noteColors[(r + cI) % 4] })
      );
      note.position.set(5 + (cI - 2.5) * 1.15, 3.0 - r * 0.7, -10.54);
      scene.add(note);
    }
  }

  // Camera Tripod & Lighting in Studio
  function createTripod(x, z) {
    [0, 2.094, 4.188].forEach(ang => {
      const dv = new THREE.Vector3(Math.sin(ang) * 0.7, -1.7, Math.cos(ang) * 0.7);
      const leg = mk(new THREE.CylinderGeometry(0.04, 0.04, dv.length(), 6), M.metal, x + dv.x / 2, 1.7 + dv.y / 2, z + dv.z / 2);
      leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dv.clone().normalize().negate());
    });
    mk(bxg(0.8, 0.5, 0.55), M.dark, x, 1.95, z);
    const lens = mk(new THREE.CylinderGeometry(0.18, 0.2, 0.4, 12), M.dark, x, 1.95, z + 0.45);
    lens.rotation.x = Math.PI / 2;
    mk(bxg(1.4, 1.6, 0.15), M.light, x + 2.4, 1.6, z - 0.4, scene, true);
    mk(bxg(0.08, 0.8, 0.08), M.metal, x + 2.4, 0.4, z - 0.4);
  }
  createTripod(5, 0.2);

  // 4. Lounge Rooms
  LOUNGE_ROOMS.forEach(r => {
    const c = RC[r.id];
    const x0 = c.cx - c.w / 2;
    const x1 = c.cx + c.w / 2;
    mk(bxg(c.w, 0.1, 7), ZM[r.id], c.cx, 0.05, 15.5, scene, true);
    mk(bxg(0.25, 1.8, 7), M.wall, x0 + 0.125, 0.9, 15.5, scene, true);
    mk(bxg(0.25, 1.8, 7), M.wall, x1 - 0.125, 0.9, 15.5, scene, true);

    [[x0, c.dx - 1.2], [c.dx + 1.2, x1]].forEach(q => {
      if (q[1] - q[0] > 0.1) {
        mk(bxg(q[1] - q[0], 1.8, 0.25), M.wall, (q[0] + q[1]) / 2, 0.9, 12.125, scene, true);
      }
    });

    const cn = document.createElement('canvas');
    cn.width = 512; cn.height = 64;
    const tx = new THREE.CanvasTexture(cn);
    const pl2 = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 0.75),
      new THREE.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false })
    );
    pl2.rotation.x = -Math.PI / 2;
    pl2.position.set(x0 + 3.4, 0.12, 19.6);
    scene.add(pl2);
    roomLabels.push({ canvas: cn, tex: tx, text: r.label });
  });

  // Furniture: Lunch Room
  B(2.2, 1, 0.7, 0xb08968, -14.2, 0.5, 12.7);
  B(0.5, 0.4, 0.4, 0x222a30, -14.6, 1.2, 12.7);
  B(1.6, 2, 0.8, 0xe5e9ee, -9.2, 1, 12.8);
  mk(bxg(4.6, 0.08, 1.4), M.wood, -11.75, 1.05, 16.6);
  B(0.2, 1.05, 1, 0x3a444e, -13.4, 0.5, 16.6);
  B(0.2, 1.05, 1, 0x3a444e, -10.1, 0.5, 16.6);
  [-13.2, -11.75, -10.3].forEach(x => { B(0.5, 0.06, 0.5, 0xffffff, x, 1.12, 16.1); });
  ROOM3.lunch.spots.forEach(q => {
    mk(new THREE.CylinderGeometry(0.32, 0.32, 0.62, 10), M.chair, q[0], 0.31, q[1]);
  });

  // Furniture: PlayStation Room
  B(4.4, 0.5, 1.1, 0x4a5a88, -3.6, 0.25, 18);
  B(4.4, 1, 0.25, 0x3c4a73, -3.6, 0.75, 18.6);
  B(2.2, 0.9, 0.9, 0x1f2430, -2.8, 0.45, 12.6);
  B(3, 1.7, 0.12, 0x0b0e14, -2.8, 2.3, 12.3);
  B(0.5, 0.12, 0.4, 0xf2f2f2, -2.8, 0.96, 12.6);
  mk(new THREE.PlaneGeometry(2.8, 1.5), new THREE.MeshBasicMaterial({ color: 0x3a7bff }), -2.8, 2.3, 12.37, scene, true);
  B(2.2, 0.5, 0.9, 0x6b4f3a, -3.6, 0.25, 15.15);
  mk(new THREE.CylinderGeometry(0.5, 0.5, 0.55, 12), lam(0xe05d5d), -6.4, 0.27, 17.4);
  mk(new THREE.CylinderGeometry(0.5, 0.5, 0.55, 12), lam(0x5db0e0), -1.2, 0.27, 16.4);

  // Furniture: Pool
  mk(bxg(5, 0.8, 3.6), new THREE.MeshLambertMaterial({ color: 0x4fb8e8, transparent: true, opacity: 0.6 }), 5.5, 0.4, 16.4, scene, true);
  [
    [5.5, 14.5, 5.4, 0.2],
    [5.5, 18.3, 5.4, 0.2],
    [8.1, 16.4, 0.2, 3.8],
    [3, 14.95, 0.2, 0.9],
    [3, 17.85, 0.2, 0.9]
  ].forEach(q => {
    B(q[2], 0.95, q[3], 0xd5dbe0, q[0], 0.475, q[1]);
  });
  mk(new THREE.CylinderGeometry(0.05, 0.05, 2.6, 6), M.metal, 7.6, 1.3, 13.3);
  mk(new THREE.ConeGeometry(1.2, 0.5, 12), lam(0xe56b6f), 7.6, 2.7, 13.3);
  B(1.8, 0.3, 0.8, 0xf3e9d2, 6.6, 0.2, 13.3);
  B(1.8, 0.3, 0.8, 0xf3e9d2, 4.6, 0.2, 13.3);
  const ring = mk(new THREE.TorusGeometry(0.35, 0.12, 8, 16), lam(0xffd166), 7.3, 0.85, 16.4, scene, true);
  ring.rotation.x = Math.PI / 2;

  // Furniture: Dormitory
  ROOM3.dorm.spots.forEach(q => {
    const x = q[0];
    B(1.2, 0.3, 2.4, 0xcfd8e3, x, 0.4, 15.9);
    B(1.2, 1.1, 0.12, 0x7a5c3e, x, 0.65, 17.2);
    B(0.8, 0.14, 0.5, 0xffffff, x, 0.62, 16.85);
  });
  B(5.6, 2.2, 0.7, 0x8a6a4a, 12.5, 1.1, 18.5);

  // Monitor Screens
  const SCR = {};
  function getScreenTexture(kind) {
    if (SCR[kind]) return SCR[kind];
    const c = document.createElement('canvas');
    c.width = 128; c.height = 80;
    const x = c.getContext('2d');
    const bg = { working: '#12342a', waiting: '#1c2833', attention: '#3a1d10' }[kind] || '#1c2833';
    const fg = { working: '#5fd3a0', waiting: '#6b7885', attention: '#ff9a66' }[kind] || '#6b7885';
    x.fillStyle = bg;
    x.fillRect(0, 0, 128, 80);
    x.fillStyle = fg;
    [[10, 12, 70], [10, 24, 98], [10, 36, 54], [10, 48, 86], [10, 60, 40]].forEach(q => {
      x.fillRect(q[0], q[1], q[2], 6);
    });
    SCR[kind] = new THREE.CanvasTexture(c);
    return SCR[kind];
  }

  // 5. Build Agent Mesh
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
    function bx(w, h, d, mat, px, py, pz) {
      return reg(mk(bxg(w, h, d), mat, px, py, pz, g));
    }

    // Desk & Computer
    bx(2.8, 0.12, 1.4, M.wood, 0, 1.0, 0);
    bx(0.12, 0.94, 1.3, M.wood, -1.3, 0.47, 0);
    bx(0.12, 0.94, 1.3, M.wood, 1.3, 0.47, 0);
    bx(2.5, 0.6, 0.08, M.wood, 0, 0.7, -0.6);
    bx(0.12, 0.3, 0.12, M.dark, 0, 1.21, -0.25);
    bx(1.3, 0.8, 0.08, M.dark, 0, 1.76, -0.25);

    o.scr = new THREE.Mesh(
      new THREE.PlaneGeometry(1.18, 0.68),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    o.scr.position.set(0, 1.76, -0.205);
    g.add(o.scr);
    reg(o.scr);
    bx(0.9, 0.04, 0.32, M.key, 0, 1.08, 0.3);

    // Chair
    bx(1.0, 0.14, 1.0, M.chair, 0, 0.62, 1.45);
    bx(1.0, 1.0, 0.14, M.chair, 0, 1.2, 2.0);
    reg(mk(new THREE.CylinderGeometry(0.09, 0.09, 0.55, 8), M.dark, 0, 0.3, 1.45, g));
    reg(mk(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 12), M.dark, 0, 0.05, 1.45, g));

    // Person
    const hue = a.hue / 360;
    const shirt = lam(new THREE.Color().setHSL(hue, 0.5, 0.45));
    const skin = lam(new THREE.Color().setHSL(hue, 0.3, 0.78));
    const hair = lam(new THREE.Color().setHSL(hue, 0.3, 0.22));

    const pg = new THREE.Group();
    pg.rotation.order = 'YXZ';
    pg.position.set(x, 0, z + 1.4);
    scene.add(pg);

    o.pg = pg;
    o.sx = x;
    o.sz = z + 1.4;
    o.x = o.sx;
    o.z = o.sz;
    o.y = 0;
    o.rx = 0;
    o.ry = 0;

    function pb(w, h, d, mat, px, py, pz, par) {
      return reg(mk(bxg(w, h, d), mat, px, py, pz, par || pg));
    }

    reg(mk(new THREE.CylinderGeometry(0.34, 0.38, 0.95, 12), shirt, 0, 1.3, 0, pg));

    // Seat pose vs standing legs
    o.seat = new THREE.Group();
    pg.add(o.seat);
    pb(0.55, 0.22, 0.95, M.pants, 0, 0.88, -0.45, o.seat);
    pb(0.4, 0.75, 0.22, M.pants, 0, 0.45, -0.9, o.seat);

    o.stand = new THREE.Group();
    o.stand.visible = false;
    pg.add(o.stand);
    o.legs = [-0.14, 0.14].map(sx => {
      const p = new THREE.Group();
      p.position.set(sx, 0.82, 0);
      o.stand.add(p);
      pb(0.22, 0.82, 0.24, M.pants, 0, -0.41, 0, p);
      return p;
    });

    // Head
    o.headG = new THREE.Group();
    o.headG.position.set(0, 2.05, 0);
    pg.add(o.headG);
    reg(mk(new THREE.SphereGeometry(0.3, 16, 12), skin, 0, 0, 0, o.headG));
    reg(mk(new THREE.SphereGeometry(0.33, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), hair, 0, 0.03, 0.04, o.headG));

    // Arms
    function arm(sx) {
      const p = new THREE.Group();
      p.position.set(sx, 1.6, -0.15);
      pg.add(p);
      reg(mk(bxg(0.17, 0.17, 0.8), shirt, 0, 0, -0.4, p));
      reg(mk(new THREE.SphereGeometry(0.11, 8, 6), skin, 0, 0, -0.82, p));
      return p;
    }
    o.armL = arm(-0.45);
    o.armR = arm(0.45);

    // Overhead indicator and label
    o.tag = new THREE.Group();
    scene.add(o.tag);

    o.mk = new THREE.Group();
    o.mk.position.set(0, 3.2, 0);
    o.tag.add(o.mk);

    o.mOk = reg(new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), new THREE.MeshBasicMaterial()));
    o.mIdle = reg(new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.06, 8, 20), new THREE.MeshBasicMaterial()));
    o.mSig = reg(new THREE.Mesh(new THREE.OctahedronGeometry(0.3), new THREE.MeshBasicMaterial()));
    o.mk.add(o.mOk);
    o.mk.add(o.mIdle);
    o.mk.add(o.mSig);

    o.lc = document.createElement('canvas');
    o.lc.width = 400; o.lc.height = 88;
    o.lt = new THREE.CanvasTexture(o.lc);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: o.lt, transparent: true, depthTest: false }));
    sp.position.set(0, 4.1, 0);
    sp.scale.set(5, 1.1, 1);
    sp.renderOrder = 10;
    o.tag.add(sp);
    reg(sp);

    // Selection ring & hover ring
    o.ring = new THREE.Mesh(
      new THREE.RingGeometry(2.0, 2.3, 48),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.95, side: THREE.DoubleSide, depthWrite: false })
    );
    o.ring.rotation.x = -Math.PI / 2;
    o.ring.position.set(0, 0.14, 0);
    o.ring.visible = false;
    o.tag.add(o.ring);

    o.hov = new THREE.Mesh(
      new THREE.RingGeometry(2.0, 2.15, 48),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false })
    );
    o.hov.rotation.x = -Math.PI / 2;
    o.hov.position.set(0, 0.14, 0);
    o.hov.visible = false;
    o.tag.add(o.hov);

    return o;
  }

  // Populate agents into work zones
  const initialAgents = getAgentsData();
  ZONES.forEach(z => {
    const L = LAYOUT[z.id];
    const list = initialAgents.filter(a => a.zone === z.id);
    list.forEach((a, i) => {
      nodes[a.id] = buildAgent(a, L.cx - L.w / 2 + (L.w / list.length) * (i + 0.5), L.cz - 0.8, i);
      nodes[a.id].zone = z.id;
      nodes[a.id].lane = L.cz + L.d / 2 + 0.5;
    });
  });

  // Canvas Label Drawer
  function drawAgentLabel(o, a, themeTokens) {
    const c = o.lc;
    const x = c.getContext('2d');
    const W = c.width;
    const H = c.height;
    x.clearRect(0, 0, W, H);
    roundRect(x, 4, 4, W - 8, H - 8, 24);
    x.fillStyle = themeTokens.surface || '#ffffff';
    x.fill();
    x.lineWidth = 4;
    x.strokeStyle = o.kind === 'attention' ? themeTokens.signal : themeTokens.line;
    x.stroke();

    const col = o.kind === 'working' ? themeTokens.ok : o.kind === 'attention' ? themeTokens.signal : themeTokens.idle;
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
    let fs = 38;
    x.font = `700 ${fs}px "Space Grotesk", Inter, system-ui, sans-serif`;
    while (x.measureText(title).width > W - 96 && fs > 20) {
      fs -= 2;
      x.font = `700 ${fs}px "Space Grotesk", Inter, system-ui, sans-serif`;
    }
    x.fillStyle = themeTokens.ink || '#13202c';
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
      o.scr.material.map = getScreenTexture(sKind);
      o.scr.material.needsUpdate = true;
      o.mOk.visible = sKind === 'working';
      o.mIdle.visible = sKind === 'waiting';
      o.mSig.visible = sKind === 'attention';
      drawAgentLabel(o, a, themeTokens);
    }
  }

  function drawRoomLabel(rl, themeTokens) {
    const x = rl.canvas.getContext('2d');
    x.clearRect(0, 0, 512, 64);
    x.font = '500 30px "IBM Plex Mono", ui-monospace, monospace';
    x.fillStyle = themeTokens.ink || '#13202c';
    x.textBaseline = 'middle';
    x.fillText(rl.text.toUpperCase(), 6, 32);
    rl.tex.needsUpdate = true;
  }

  function applyTheme() {
    const T = getThemeTokens();
    const dark = new THREE.Color(T.bg).getHSL({}).l < 0.4;

    M.slab.color.set(T.surface);
    ZONES.forEach(z => {
      if (T[`z-${z.id}`]) ZM[z.id].color.set(T[`z-${z.id}`]);
    });
    LOUNGE_ROOMS.forEach(r => {
      if (T[`z-${r.id}`]) ZM[r.id].color.set(T[`z-${r.id}`]);
    });

    M.wall.color.set(T.wall);
    M.wall.opacity = dark ? 0.55 : 0.7;
    M.wood.color.set(dark ? '#6f5e49' : '#c8b494');
    M.chair.color.set(dark ? '#3a4652' : '#55636f');
    M.dark.color.set(dark ? '#0b1117' : '#1b2630');

    hemi.color.set(dark ? '#9fb4d0' : '#ffffff');
    hemi.groundColor.set(dark ? '#2a3440' : '#aab4be');
    hemi.intensity = dark ? 0.5 : 0.55;
    sun.intensity = dark ? 0.42 : 0.5;

    const currentAgents = getAgentsData();
    currentAgents.forEach(a => {
      const o = nodes[a.id];
      if (!o) return;
      o.mOk.material.color.set(T.ok);
      o.mIdle.material.color.set(T.idle);
      o.mSig.material.color.set(T.signal);
      o.ring.material.color.set(T.accent);
      o.hov.material.color.set(T.ink2);
      paintAgent(o, a, T);
    });

    roomLabels.forEach(rl => drawRoomLabel(rl, T));
  }

  // 6. Pathfinding & Movement (Anti-tembus dinding)
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
        const ax = o.sx < 0 ? -15.5 : 15.5;
        c.push([ax, o.lane], [ax, 11.5]);
      }
      return c;
    }
    const r = ROOM3[at];
    const q = r.spots[sl];
    return [[r.dx, 11.5], ...r.entry, ...(q[6] || []), [q[0], q[1]]];
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
        path = [...ROOM3[at].entry.slice(-1), ...(ROOM3[at].spots[sl][6] || []), Bc[Bc.length - 1]];
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
        o.ty = (o.x > WATER[0] && o.x < WATER[1] && o.z > WATER[2] && o.z < WATER[3]) ? -0.5 : 0;
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
    o.tag.position.set(o.x, 0, o.z + (o.pose === 'l' ? 1 : 0));

    const off = o.mode !== 'seat';
    o.ring.position.z = o.hov.position.z = off ? 0 : -0.7;
    o.ring.scale.setScalar(off ? 0.5 : 1);
    o.hov.scale.setScalar(off ? 0.5 : 1);
  }

  // 7. Camera glide & reset
  let glide = null;

  function resetCamera() {
    const t = Math.tan((camera.fov * Math.PI / 180) / 2);
    const dist = Math.max(18.5 / (t * camera.aspect), 16 / t);
    const dir = new THREE.Vector3(0, 0.8, 0.62).normalize();
    controls.target.set(0, 0, 4);
    camera.position.copy(controls.target).addScaledVector(dir, Math.min(dist, 80));
    camera.lookAt(controls.target);
    controls.update();
    glide = null;
  }

  function focusAgent(id) {
    const o = nodes[id];
    if (!o) return;
    const tgt = new THREE.Vector3(o.x, 1.2, o.z + (o.mode === 'seat' ? -0.5 : 0.3));
    const off = camera.position.clone().sub(controls.target);
    off.setLength(Math.min(off.length(), 26));
    glide = { t: tgt, p: tgt.clone().add(off) };
  }

  controls.addEventListener('start', () => { glide = null; });

  // 8. Raycasting & User Interaction
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

  // 9. Resize Handling
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

  // 10. Animation Loop
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

    controls.target.x = Math.max(-16, Math.min(16, controls.target.x));
    controls.target.z = Math.max(-12, Math.min(20, controls.target.z));
    controls.update();

    renderer.render(scene, camera);
  }

  // Sync state method
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

  // Initial setup
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
