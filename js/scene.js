/* ============================================================
   场景构建：民主路社区巷子（折线形窄巷）
   巷道中线为折线（参照俯视估算复原图：两个折角），
   一切对象以「沿巷弧长 s + 横向偏移 x」定位。
   巷宽 ≈3.2–4.0m（两侧握手楼进深错动），地面 y=0。
   依据：《巷子空间分析》+ 巷道剖面与俯视图（估算复原）。
   ============================================================ */
import * as THREE from 'three';

/* ---------------- 折线路径 ----------------
   段 0：s 0–14，朝向 0°
   段 1：s 14–31，朝向 +20°（右转）
   段 2：s 31–48，朝向 −8°（回折约 28°） */
const SEGS = [
  { h: 0, len: 14 },
  { h: 20 * Math.PI / 180, len: 17 },
  { h: -8 * Math.PI / 180, len: 17 },
];
{
  let s0 = 0, ox = 0, oz = 0;
  SEGS.forEach(sg => {
    sg.s0 = s0; sg.ox = ox; sg.oz = oz;
    s0 += sg.len;
    ox += Math.sin(sg.h) * sg.len;
    oz += Math.cos(sg.h) * sg.len;
  });
}
const PATH_LEN = SEGS.reduce((a, s) => a + s.len, 0); // 48

function segIdxAt(s) {
  if (s <= 0) return 0;
  for (let i = 0; i < SEGS.length; i++) if (s < SEGS[i].s0 + SEGS[i].len) return i;
  return SEGS.length - 1;
}
/* 弧长 s + 横向 x（右正左负）+ 高度 y → 世界坐标 */
function pathPoint(s, x = 0, y = 0) {
  const sg = SEGS[segIdxAt(s)];
  const zl = s - sg.s0;
  const c = Math.cos(sg.h), sn = Math.sin(sg.h);
  return new THREE.Vector3(sg.ox + x * c + zl * sn, y, sg.oz - x * sn + zl * c);
}
const headingAt = (s) => SEGS[segIdxAt(s)].h;

export const ALLEY = {
  sMin: 1.2, sMax: 45.5,           // 相机活动范围（弧长）
  entranceS: 2.2,                  // 入口站位
  eyeY: 1.6,                       // 恒定眼高
  poleX: 0.85,                     // 电杆横向偏移（路中偏东）
  poles: [5, 17, 29, 41],          // P1–P4 的弧长 s
  poleH: 9,
  length: PATH_LEN,
};
export const PATH = {
  point: pathPoint,
  heading: headingAt,
  baseYaw: (s) => Math.PI + headingAt(s),   // 面向巷子前进方向的相机 yaw
  length: PATH_LEN,
};

/* ---------------- 工具 ---------------- */
function catenary(p0, p1, sag, n = 24) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push(new THREE.Vector3(
      p0.x + (p1.x - p0.x) * t,
      p0.y + (p1.y - p0.y) * t - sag * 4 * t * (1 - t),
      p0.z + (p1.z - p0.z) * t,
    ));
  }
  return pts;
}
function tube(pts, r, mat, radial = 5) {
  const curve = new THREE.CatmullRomCurve3(pts);
  const geo = new THREE.TubeGeometry(curve, Math.max(12, pts.length * 2), r, radial, false);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = true;
  return mesh;
}
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/* ---------------- 材质库 ---------------- */
export function makeMats() {
  return {
    pole: new THREE.MeshStandardMaterial({ color: 0x8a847c, roughness: 0.92 }),
    poleDark: new THREE.MeshStandardMaterial({ color: 0x6e6960, roughness: 0.95 }),
    device: new THREE.MeshStandardMaterial({ color: 0x7d766b, roughness: 0.7, metalness: 0.35 }),
    meter: new THREE.MeshStandardMaterial({ color: 0xb9b2a4, roughness: 0.65, metalness: 0.25 }),
    camBody: new THREE.MeshStandardMaterial({ color: 0xd8d4cc, roughness: 0.5, metalness: 0.3 }),
    lampHead: new THREE.MeshStandardMaterial({ color: 0x3c3a36, roughness: 0.6 }),
    lampGlow: new THREE.MeshBasicMaterial({ color: 0xffd9a0 }),
    cctvDot: new THREE.MeshBasicMaterial({ color: 0xff2a1e }),
    extinguisher: new THREE.MeshStandardMaterial({ color: 0xb13a2f, roughness: 0.5, metalness: 0.3 }),
    bin: new THREE.MeshStandardMaterial({ color: 0x4f7d7a, roughness: 0.8 }),
    scooter: new THREE.MeshStandardMaterial({ color: 0x5d6d7e, roughness: 0.6 }),
    car: new THREE.MeshStandardMaterial({ color: 0x596067, roughness: 0.6, metalness: 0.35 }),
    asphalt: null,
  };
}

/* 线缆材质：默认「网」深色 + 权属四色 */
export function makeCableMats() {
  const base = { roughness: 0.55, metalness: 0.1, transparent: true, opacity: 0.9 };
  return {
    net:     new THREE.MeshStandardMaterial({ ...base, color: 0x26251f }),
    power:   new THREE.MeshStandardMaterial({ ...base, color: 0xd95f43, emissive: 0x3a0f06 }),
    comm:    new THREE.MeshStandardMaterial({ ...base, color: 0x4a7fa5, emissive: 0x08131d }),
    cctv:    new THREE.MeshStandardMaterial({ ...base, color: 0xb39c4f, emissive: 0x241c07 }),
    private: new THREE.MeshStandardMaterial({ ...base, color: 0x7d9b6a, emissive: 0x101a0c }),
  };
}

/* ---------------- 立面纹理 ---------------- */
function facadeTex({ w = 512, h = 1024, floors = 6, cols = 4, base = '#cfc6b8', grime = 0.35 }) {
  return canvasTex(w, h, (g) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 90; i++) {
      g.fillStyle = `rgba(90,80,66,${0.03 + rnd() * 0.08 * grime})`;
      const sw = 20 + rnd() * 90, sh = 8 + rnd() * 60;
      g.fillRect(rnd() * w, rnd() * h, sw, sh);
    }
    for (let i = 0; i < 14; i++) {
      const x = rnd() * w;
      g.fillStyle = `rgba(70,62,52,${0.05 + rnd() * 0.06})`;
      g.fillRect(x, rnd() * h * 0.4, 3 + rnd() * 5, h * (0.3 + rnd() * 0.5));
    }
    const winW = w / (cols * 1.9), winH = h / (floors * 2.6);
    for (let f = 0; f < floors; f++) {
      for (let c = 0; c < cols; c++) {
        const x = (c + 0.55) * (w / cols) - winW / 2 + (rnd() - 0.5) * 6;
        const y = h - (f + 0.82) * (h / floors) + (rnd() - 0.5) * 5;
        g.fillStyle = 'rgba(38,36,32,0.92)';
        g.fillRect(x - 3, y - 3, winW + 6, winH + 6);
        g.fillStyle = 'rgba(70,74,80,0.85)';
        g.fillRect(x, y, winW, winH);
        g.strokeStyle = 'rgba(160,152,138,0.9)'; g.lineWidth = 2;
        for (let b = 1; b < 5; b++) {
          g.beginPath(); g.moveTo(x + (winW / 5) * b, y - 4); g.lineTo(x + (winW / 5) * b, y + winH + 4); g.stroke();
        }
        g.strokeRect(x, y, winW, winH);
        if (rnd() < 0.5) {
          g.fillStyle = 'rgba(150,146,136,0.95)';
          g.fillRect(x + winW * 0.1, y + winH + 8, winW * 0.55, winH * 0.4);
          g.strokeStyle = 'rgba(90,86,78,0.8)'; g.lineWidth = 1.5;
          g.strokeRect(x + winW * 0.1, y + winH + 8, winW * 0.55, winH * 0.4);
        }
      }
    }
  });
}

/* 红瓦坡屋顶纹理 */
function tileTex() {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#9c5f47'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 16) {
      g.fillStyle = 'rgba(60,30,22,0.35)'; g.fillRect(0, y, w, 3);
      for (let x = ((y / 16) % 2) * 12; x < w; x += 24) {
        g.fillStyle = 'rgba(120,66,48,0.5)'; g.fillRect(x, y + 3, 2, 13);
      }
    }
  });
}

/* 沥青地面 */
function asphaltTex() {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#77716a'; g.fillRect(0, 0, w, h);
    let seed = 3;
    const rnd = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = `rgba(${40 + rnd() * 40},${38 + rnd() * 36},${34 + rnd() * 32},${0.12 + rnd() * 0.2})`;
      g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2);
    }
    for (let i = 0; i < 12; i++) {
      g.strokeStyle = 'rgba(50,46,42,0.35)'; g.lineWidth = 1 + rnd();
      g.beginPath(); g.moveTo(rnd() * w, rnd() * h);
      g.lineTo(rnd() * w, rnd() * h); g.stroke();
    }
  });
}

/* ============================================================
   主构建
   ============================================================ */
export function buildAlley(scene) {
  const mats = makeMats();
  const cableMats = makeCableMats();
  const root = new THREE.Group(); root.name = 'alley';
  scene.add(root);

  const cables = [];
  const eraGates = [];
  const lampHeads = [];
  const cctvDots = [];
  const litWins = [];
  const hotspotAnchors = {};

  /* ---------- 路段分组（每段一个局部坐标系，弯折在段间发生） ---------- */
  const segGroups = SEGS.map(sg => {
    const g = new THREE.Group();
    g.position.set(sg.ox, 0, sg.oz);
    g.rotation.y = sg.h;
    root.add(g);
    return g;
  });

  /* ---------- 地面（逐段铺设，伸出接缝避免裂缝） ---------- */
  const asphalt = asphaltTex();
  asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping;
  SEGS.forEach((sg, i) => {
    const t = asphalt.clone();
    t.needsUpdate = true;
    t.repeat.set(2, (sg.len + 5) / 2.2);
    const g = new THREE.Mesh(
      new THREE.PlaneGeometry(4.6, sg.len + 5),
      new THREE.MeshStandardMaterial({ map: t, roughness: 0.96 }));
    g.rotation.x = -Math.PI / 2;
    g.position.set(0, i * 0.002, sg.len / 2);
    g.receiveShadow = true;
    segGroups[i].add(g);
  });
  // 路外底衬
  const mid = pathPoint(24, 0, 0);
  const under = new THREE.Mesh(new THREE.PlaneGeometry(70, 90),
    new THREE.MeshStandardMaterial({ color: 0x5c574f, roughness: 1 }));
  under.rotation.x = -Math.PI / 2; under.position.set(mid.x, -0.02, mid.z);
  root.add(under);
  // 井盖（沿中线略偏）
  const manholeMat = new THREE.MeshStandardMaterial({ color: 0x4c4741, roughness: 0.85 });
  [7, 19, 31, 43].forEach(s => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.025, 20), manholeMat);
    const p = pathPoint(s, -0.25, 0.013);
    m.position.copy(p); root.add(m);
  });

  /* ---------- 建筑（沿弧长分布，两侧进深/退出错动，净宽 3.2–4.0m） ---------- */
  const buildings = new THREE.Group(); buildings.name = 'buildings'; root.add(buildings);
  const tile = tileTex();
  function addBuilding(group, { side, z0, z1, depth = 9, jut = 0, h, floors, base, slope = false }) {
    const w = z1 - z0;
    const face = side === 'L' ? -1 : 1;               // 朝巷方向（左楼在 -x）
    const wallOff = 1.75 + jut;                        // 墙面到中线的距离
    const cx = face * (wallOff + depth / 2);
    const cz = (z0 + z1) / 2;
    const geo = new THREE.BoxGeometry(depth, h, w);
    const ft = facadeTex({ floors, cols: Math.max(3, Math.round(w / 3.2)), base });
    const plain = new THREE.MeshStandardMaterial({ color: new THREE.Color(base).multiplyScalar(0.82), roughness: 0.95 });
    const faceMat = new THREE.MeshStandardMaterial({ map: ft, roughness: 0.95 });
    const arr = side === 'L'
      ? [faceMat, plain, plain, plain, plain, plain]
      : [plain, faceMat, plain, plain, plain, plain];
    const b = new THREE.Mesh(geo, arr);
    b.position.set(cx, h / 2, cz);
    b.castShadow = true; b.receiveShadow = true;
    group.add(b);
    if (slope) {
      const e = 0.25, rh = 1.7, rw = depth;
      const shape = new THREE.Shape();
      shape.moveTo(-rw / 2 - e, 0); shape.lineTo(rw / 2 + e, 0); shape.lineTo(0, rh); shape.closePath();
      const roofGeo = new THREE.ExtrudeGeometry(shape, { depth: w + 0.3, bevelEnabled: false });
      const roof = new THREE.Mesh(roofGeo, new THREE.MeshStandardMaterial({ color: 0x9c5f47, roughness: 0.9 }));
      roof.position.set(cx, h, z0 - 0.15);
      roof.castShadow = true;
      group.add(roof);
    }
  }

  // 楼按弧长定义；jut 为墙面进出（+ 退出 / − 吃进），制造「握手楼」错动
  const specs = [
    { side: 'L', s0: -3,  s1: 10,   h: 18.5, floors: 6, base: '#c9c0b0', jut: 0.10, depth: 9 },
    { side: 'L', s0: 10,  s1: 22.5, h: 21.5, floors: 7, base: '#beb5a6', jut: 0.25, depth: 10 },
    { side: 'L', s0: 22.5, s1: 34,  h: 12.5, floors: 4, base: '#cfc6b4', jut: -0.05, depth: 8.5, slope: true },
    { side: 'L', s0: 34,  s1: 48.5, h: 18.5, floors: 6, base: '#c5bcab', jut: 0.05, depth: 9 },
    { side: 'R', s0: -3,  s1: 12,   h: 18.5, floors: 6, base: '#c2b9aa', jut: 0.0, depth: 9 },
    { side: 'R', s0: 12,  s1: 30,   h: 10,   floors: 3, base: '#ccc3b2', jut: 0.20, depth: 8, slope: true },
    { side: 'R', s0: 30,  s1: 48.5, h: 15.5, floors: 5, base: '#bfb6a6', jut: -0.10, depth: 9.5 },
  ];
  // 按楼的中点分配到所在路段；段内首末楼外伸 1.8m 盖住转角楔形
  const rows = SEGS.map(() => ({ L: [], R: [] }));
  specs.forEach(sp => rows[segIdxAt((sp.s0 + sp.s1) / 2)][sp.side].push(sp));
  rows.forEach((row, i) => {
    ['L', 'R'].forEach(side => {
      const arr = row[side].sort((a, b) => a.s0 - b.s0);
      if (!arr.length) return;
      arr[0] = { ...arr[0], s0: Math.min(arr[0].s0, SEGS[i].s0 - 1.8) };
      const li = arr.length - 1;
      arr[li] = { ...arr[li], s1: Math.max(arr[li].s1, SEGS[i].s0 + SEGS[i].len + 1.8) };
      arr.forEach(sp => addBuilding(segGroups[i], { ...sp, z0: sp.s0 - SEGS[i].s0, z1: sp.s1 - SEGS[i].s0 }));
    });
  });
  // 某弧长处的墙面横向距离（用于贴墙物件/线缆落点）
  function wallXAt(s, side) {
    const sp = specs.find(x => x.side === side && s >= x.s0 && s <= x.s1);
    return 1.75 + (sp ? sp.jut : 0);
  }
  // 巷尽头封口楼（随末段朝向）
  {
    const sg = SEGS[SEGS.length - 1];
    const endWall = new THREE.Mesh(new THREE.BoxGeometry(22, 16, 0.5),
      new THREE.MeshStandardMaterial({ map: facadeTex({ floors: 5, cols: 6, base: '#c4bbaa' }), roughness: 0.95 }));
    endWall.position.set(0, 8, sg.len + 0.2);
    endWall.castShadow = true;
    segGroups[SEGS.length - 1].add(endWall);
  }

  /* ---------- 亮窗（夜间发光；H6 锚点窗为 3F 左侧） ---------- */
  function litWindow(s, side, y, warm = 0xffc78a) {
    const x = (side === 'L' ? -1 : 1) * (wallXAt(s, side) - 0.01);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.3),
      new THREE.MeshBasicMaterial({ color: warm, transparent: true, opacity: 0 }));
    m.position.copy(pathPoint(s, x, y));
    m.rotation.y = headingAt(s) + (side === 'L' ? Math.PI / 2 : -Math.PI / 2);
    root.add(m); litWins.push(m);
    return m;
  }
  const h6win = litWindow(12, 'L', 7.9);   // H6 主窗（左侧 3F）
  litWindow(7.2, 'L', 10.8);
  litWindow(27.5, 'L', 4.9);
  litWindow(40, 'L', 13.6);
  litWindow(6.4, 'R', 7.8);
  litWindow(19, 'R', 4.7);
  litWindow(33, 'R', 10.9);
  litWindow(44, 'R', 7.6);

  /* ---------- 阳台（左侧悬挑铁栅栏） ---------- */
  const balcMat = new THREE.MeshStandardMaterial({ color: 0x8f887c, roughness: 0.8 });
  [[7.4, 8.2], [13.2, 18.6]].forEach(([y, s]) => {
    const g = new THREE.Group();
    g.position.copy(pathPoint(s, 0, 0));
    g.rotation.y = headingAt(s);
    const wx = wallXAt(s, 'L');
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.75, 2.1, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x9b948a, roughness: 0.7, transparent: true, opacity: 0.25 }));
    frame.position.set(-(wx - 0.35), y, 0);
    g.add(frame);
    for (let i = 0; i < 5; i++) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.1, 4), balcMat);
      bar.position.set(-(wx - 0.7), y, -0.9 + i * 0.45);
      g.add(bar);
    }
    root.add(g);
  });

  /* ---------- 太阳能热水器（左屋顶） ---------- */
  {
    const heater = new THREE.Group();
    heater.position.copy(pathPoint(15, 0, 0));
    heater.rotation.y = headingAt(15);
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.7, 12), mats.meter);
    tank.rotation.z = Math.PI / 2; tank.position.set(-(wallXAt(15, 'L') + 1.6), 19.6, 0);
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x51626e, roughness: 0.35, metalness: 0.5 }));
    panel.position.set(-(wallXAt(15, 'L') + 1.6), 19.15, 0); panel.rotation.x = -Math.PI / 3;
    heater.add(tank, panel); root.add(heater);
  }

  /* ---------- 电杆 P1–P4（立在折线旁，横担垂直于所在段） ---------- */
  const polesG = new THREE.Group(); polesG.name = 'poles'; root.add(polesG);

  function addPole(s, withTransformer = false, withCctvBar = false, withLamp = false, withMeter = false) {
    const g = new THREE.Group();
    g.position.copy(pathPoint(s, ALLEY.poleX, 0));
    g.rotation.y = headingAt(s);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, ALLEY.poleH, 10), mats.pole);
    pole.position.y = ALLEY.poleH / 2; pole.castShadow = true;
    g.add(pole);
    const armP = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.09, 0.12), mats.poleDark);
    armP.position.y = 8.35; g.add(armP);
    [-0.85, -0.45, 0.45, 0.85].forEach(dx => {
      const ins = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.14, 6), mats.poleDark);
      ins.position.set(dx, 8.47, 0); g.add(ins);
    });
    const armC = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.07, 0.1), mats.poleDark);
    armC.position.y = 6.92; g.add(armC);
    if (withTransformer) {
      const tg = new THREE.Group();
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.0, 0.5), mats.device);
      t.position.set(0, 4.1, 0.3); t.castShadow = true; tg.add(t);
      const bush = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.25, 6), mats.poleDark);
      bush.position.set(-0.2, 4.7, 0.3); tg.add(bush);
      const bush2 = bush.clone(); bush2.position.x = 0.2; tg.add(bush2);
      g.add(tg); eraGates.push({ obj: tg, minEra: 1 });
    }
    if (withMeter) {
      const mb = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.28), mats.meter);
      mb.position.set(0, 2.6, 0.22); mb.castShadow = true; g.add(mb);
      for (let i = 0; i < 3; i++) {
        const d = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.02),
          new THREE.MeshBasicMaterial({ color: 0x2a2f35 }));
        d.position.set(-0.16 + i * 0.16, 2.68, 0.37); g.add(d);
      }
    }
    if (withLamp) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.5, 6), mats.poleDark);
      arm.rotation.z = Math.PI / 2 - 0.12;
      arm.position.set(-0.72, 6.05, 0); g.add(arm);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.2), mats.lampHead);
      head.position.set(-1.42, 5.95, 0); g.add(head);
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.14), mats.lampGlow.clone());
      glow.rotation.x = Math.PI / 2; glow.position.set(-1.42, 5.88, 0);
      glow.material.transparent = true; glow.material.opacity = 0;
      g.add(glow);
      lampHeads.push({ glow, at: pathPoint(s, ALLEY.poleX - 1.42, 5.9) });
    }
    if (withCctvBar) {
      const cg = new THREE.Group();
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.4, 6), mats.poleDark);
      bar.rotation.z = Math.PI / 2; bar.position.set(0, 5.2, 0); cg.add(bar);
      [[-1.0, 1], [-0.55, 1], [0.55, -1], [1.0, -1]].forEach(([dx, dir]) => {
        const cam = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.34), mats.camBody);
        body.castShadow = true;
        cam.add(body);
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), mats.cctvDot.clone());
        dot.position.set(0, -0.02, dir * 0.19); dot.material.transparent = true; dot.material.opacity = 0;
        cam.add(dot); cctvDots.push(dot);
        cam.position.set(dx, 5.13, 0);
        cam.rotation.y = dir > 0 ? 0 : Math.PI;
        cg.add(cam);
      });
      g.add(cg); eraGates.push({ obj: cg, minEra: 3 });
    }
    polesG.add(g);
    return g;
  }
  addPole(5,  false, true,  true,  true);   // P1 巷口杆：表箱+路灯+四头监控
  addPole(17, true,  true,  false, false);  // P2：变压器+监控（转角内侧）
  addPole(29, false, false, true,  false);  // P3 转角杆：路灯
  addPole(41, false, false, false, false);  // P4 末端杆

  const anchor = (id, s, x, y) => {
    const p = pathPoint(s, x, y); p.s = s;
    hotspotAnchors[id] = p;
  };
  anchor('pole1_top', 5, ALLEY.poleX, 8.0);
  anchor('pole2_top', 17, ALLEY.poleX, 8.0);
  anchor('cctv', 5, ALLEY.poleX - 0.6, 5.2);
  hotspotAnchors['window'] = h6win.position.clone(); hotspotAnchors['window'].s = 12;

  /* ---------- 线缆网络（年代 × 权属；档间按世界坐标拉弧垂） ---------- */
  const cablesG = new THREE.Group(); cablesG.name = 'cables'; root.add(cablesG);
  const rnd = (() => { let s = 11; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

  function addCable(pts, { r = 0.028, owner = 'comm', eraIdx = 0, aerial = true }) {
    const mesh = tube(pts, r, cableMats.net);
    mesh.userData = { owner, eraIdx, aerial };
    cablesG.add(mesh);
    cables.push(mesh);
    return mesh;
  }
  const P = ALLEY.poles, X = ALLEY.poleX;
  // ① 电力主干（1980，power，顶部横担 4 根）
  const pwrX = [X - 0.85, X - 0.45, X + 0.45, X + 0.85];
  for (let s = 0; s < P.length - 1; s++) {
    pwrX.forEach((x, i) => {
      addCable(catenary(pathPoint(P[s], x, 8.52), pathPoint(P[s + 1], x, 8.52), 0.55 + i * 0.05),
        { r: 0.035, owner: 'power', eraIdx: 0 });
    });
  }
  // 引出段（入口外 + 末端延伸）
  pwrX.forEach((x, i) => {
    addCable(catenary(pathPoint(-3, x, 8.52), pathPoint(P[0], x, 8.52), 0.4 + i * 0.04), { r: 0.035, owner: 'power', eraIdx: 0 });
    addCable(catenary(pathPoint(P[3], x, 8.52), pathPoint(48.5, x, 8.52), 0.4 + i * 0.04), { r: 0.035, owner: 'power', eraIdx: 0 });
  });
  // ② 通信一层（1990，comm，6 根）
  for (let s = 0; s < P.length - 1; s++) {
    for (let i = 0; i < 6; i++) {
      const x = X - 0.6 + i * 0.24, y = 7.0 + (i % 2) * 0.1;
      addCable(catenary(pathPoint(P[s], x, y), pathPoint(P[s + 1], x, y), 0.75 + rnd() * 0.3),
        { r: 0.022, owner: 'comm', eraIdx: 1 });
    }
  }
  // ③ 通信二层（2000，comm）
  for (let s = 0; s < P.length - 1; s++) {
    for (let i = 0; i < 4; i++) {
      const x = X - 0.45 + i * 0.3, y = 6.62;
      addCable(catenary(pathPoint(P[s], x, y), pathPoint(P[s + 1], x, y), 0.85 + rnd() * 0.35),
        { r: 0.018, owner: 'comm', eraIdx: 2 });
    }
  }
  // ④ 光纤束 + 监控/照明线路（2010）
  for (let s = 0; s < P.length - 1; s++) {
    addCable(catenary(pathPoint(P[s], X, 6.35), pathPoint(P[s + 1], X, 6.35), 0.9),
      { r: 0.05, owner: 'comm', eraIdx: 3 });
    addCable(catenary(pathPoint(P[s], X + 0.15, 5.25), pathPoint(P[s + 1], X + 0.15, 5.25), 0.5),
      { r: 0.014, owner: 'cctv', eraIdx: 3 });
  }
  // ⑤ 入户下线（杆→两侧墙；权属混合）
  const dropOwners = ['power', 'comm', 'comm', 'private', 'comm', 'power'];
  let di = 0;
  let lowestMid = null, lowestS = 11;
  for (let s = 2.4; s < 46; s += 2.9) {
    const fromPole = P.reduce((a, b) => Math.abs(b - s) < Math.abs(a - s) ? b : a);
    const left = (di % 2 === 0);
    const side = left ? 'L' : 'R';
    const wallX = (left ? -1 : 1) * (wallXAt(s, side) - 0.03);
    const y0 = 5.4 + rnd() * 1.2, y1 = 3.1 + rnd() * 1.3;
    const owner = dropOwners[di % dropOwners.length];
    const eraIdx = owner === 'power' ? (di % 3) : 1 + (di % 3);
    const sag = 0.7 + rnd() * 0.9;
    const pts = catenary(pathPoint(fromPole + (rnd() - 0.5) * 0.4, X + (rnd() - 0.5) * 0.3, y0),
                         pathPoint(s, wallX, y1), sag);
    const m = addCable(pts, { r: 0.016, owner, eraIdx: Math.min(eraIdx, 3) });
    const midp = pts[Math.floor(pts.length / 2)];
    if (!lowestMid || midp.y < lowestMid.y) { lowestMid = midp.clone(); lowestS = s; }
    m.userData.isDrop = true;
    di++;
  }
  if (lowestMid) { lowestMid.s = lowestS; hotspotAnchors['low_cable'] = lowestMid; }
  else anchor('low_cable', 11, 0, 3.1);

  // ⑥ 墙面盘留（2000+，comm）
  const coilSpecs = [[12.5, 'L', 4.1], [21, 'R', 4.5], [37, 'L', 3.8], [40.5, 'R', 4.2]];
  coilSpecs.forEach(([s, side, y], ci) => {
    const g = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const pts = [];
      for (let a = 0; a <= 40; a++) {
        const t = a / 40 * Math.PI * 2 * (1.6 + i * 0.3);
        const r = 0.32 - i * 0.07;
        pts.push(new THREE.Vector3(0, Math.sin(t) * r, Math.cos(t) * r));
      }
      const ring = tube(pts, 0.02, cableMats.net, 4);
      ring.position.x = 0.02 * i;
      ring.userData = { owner: 'comm', eraIdx: 2, aerial: true };
      g.add(ring); cables.push(ring);
    }
    const x = (side === 'L' ? -1 : 1) * (wallXAt(s, side) - 0.02);
    g.position.copy(pathPoint(s, x, y));
    g.rotation.y = headingAt(s);
    root.add(g);
    if (ci === 0) { const p = pathPoint(s, x, y); p.s = s; hotspotAnchors['wall_coil'] = p; }
  });
  // ⑦ 断线残留（2026，P3 垂下）
  {
    addCable(catenary(pathPoint(29, X, 6.9), pathPoint(29.3, X - 0.5, 4.6), -0.1), { r: 0.02, owner: 'comm', eraIdx: 4 });
    addCable(catenary(pathPoint(29.1, X + 0.2, 6.35), pathPoint(29.5, X + 0.55, 5.0), -0.05), { r: 0.018, owner: 'private', eraIdx: 4 });
  }

  /* ---------- 道具 ---------- */
  // 灭火器（巷口左墙）
  {
    const ext = new THREE.Group();
    const extBody = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.42, 10), mats.extinguisher);
    extBody.position.y = 0.21; extBody.castShadow = true;
    const extTop = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 6), mats.device);
    extTop.position.y = 0.47;
    ext.add(extBody, extTop);
    ext.position.copy(pathPoint(0.8, -(wallXAt(0.8, 'L') - 0.25), 0.55));
    const extShelf = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.3), mats.poleDark);
    extShelf.position.copy(pathPoint(0.8, -(wallXAt(0.8, 'L') - 0.2), 0.53));
    root.add(ext, extShelf);
    anchor('extinguisher', 0.8, -(wallXAt(0.8, 'L') - 0.25), 0.8);
  }
  // 回收箱（P1 旁）
  {
    const bin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.72, 0.5), mats.bin);
    bin.position.copy(pathPoint(3.4, wallXAt(3.4, 'R') - 0.3, 0.36));
    bin.rotation.y = headingAt(3.4);
    bin.castShadow = true; root.add(bin);
  }
  // 电动车（巷口左墙）
  {
    const scooter = new THREE.Group();
    const sBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 1.5), mats.scooter);
    sBody.position.y = 0.55; sBody.castShadow = true;
    const sW1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 12), mats.poleDark);
    sW1.rotation.z = Math.PI / 2; sW1.position.set(0, 0.18, 0.55);
    const sW2 = sW1.clone(); sW2.position.z = -0.55;
    scooter.add(sBody, sW1, sW2);
    scooter.position.copy(pathPoint(1.8, -(wallXAt(1.8, 'L') - 0.45), 0));
    scooter.rotation.y = headingAt(1.8);
    root.add(scooter);
  }
  // 停放轿车（右侧 s≈36，贴墙停，夜间通道变窄）
  {
    const car = new THREE.Group();
    const cBody = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.75, 3.4), mats.car);
    cBody.position.y = 0.55; cBody.castShadow = true;
    const cTop = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.5, 1.9), mats.car);
    cTop.position.set(0, 1.15, -0.2);
    car.add(cBody, cTop);
    [[-0.65, 1.1], [0.65, 1.1], [-0.65, -1.1], [0.65, -1.1]].forEach(([dx, dz]) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 12), mats.poleDark);
      w.rotation.z = Math.PI / 2; w.position.set(dx, 0.28, dz); car.add(w);
    });
    car.position.copy(pathPoint(36, 0.95, 0));
    car.rotation.y = headingAt(36);
    root.add(car);
  }
  // 花店招牌（右，巷口）+ 蓝色提示牌（左）
  {
    const signCanvas = canvasTex(256, 96, (g, w, h) => {
      g.fillStyle = '#f2ede2'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#7a4a3a'; g.font = 'bold 44px "Noto Serif SC", serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('屿礼花店', w / 2, h / 2);
    });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.6),
      new THREE.MeshStandardMaterial({ map: signCanvas, roughness: 0.8 }));
    sign.position.copy(pathPoint(2.2, wallXAt(2.2, 'R') - 0.03, 3.1));
    sign.rotation.y = headingAt(2.2) - Math.PI / 2;
    root.add(sign);
    const blueCanvas = canvasTex(256, 128, (g, w, h) => {
      g.fillStyle = '#2b5aa8'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#fff'; g.font = 'bold 30px sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('居民出行通道', w / 2, h / 2 - 20);
      g.fillText('请勿停车', w / 2, h / 2 + 24);
    });
    const blueSign = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.45),
      new THREE.MeshStandardMaterial({ map: blueCanvas, roughness: 0.8 }));
    blueSign.position.copy(pathPoint(4.2, -(wallXAt(4.2, 'L') - 0.03), 2.6));
    blueSign.rotation.y = headingAt(4.2) + Math.PI / 2;
    root.add(blueSign);
  }

  // 晾晒（绳 + 衣物色块，跨巷）
  const laundry = new THREE.Group();
  [[9.5, 7.5], [25, 6.8]].forEach(([s, y], li) => {
    const a = pathPoint(s, -(wallXAt(s, 'L') - 0.02), y);
    const b = pathPoint(s + 0.3, wallXAt(s, 'R') - 0.02, y);
    const line = tube(catenary(a, b, 0.18), 0.008, mats.poleDark, 3);
    laundry.add(line);
    for (let i = 0; i < 4; i++) {
      const cl = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.6),
        new THREE.MeshStandardMaterial({ color: [0xc9d4d8, 0xd8c9c0, 0x9fb4bd, 0xd8d3c5][(li + i) % 4], side: THREE.DoubleSide, roughness: 1 }));
      const t = 0.25 + i * 0.17;
      cl.position.lerpVectors(a, b, t); cl.position.y = y - 0.5;
      laundry.add(cl);
    }
  });
  root.add(laundry);

  /* ---------- 日夜光照 ---------- */
  const rig = {
    hemi: new THREE.HemisphereLight(0xfff3e0, 0x8a8378, 0.85),
    sun: new THREE.DirectionalLight(0xffe7c4, 2.0),
    lamps: [],
  };
  rig.sun.position.set(14, 26, -6);
  rig.sun.castShadow = true;
  rig.sun.shadow.mapSize.set(2048, 2048);
  Object.assign(rig.sun.shadow.camera, { left: -22, right: 22, top: 36, bottom: -10, near: 4, far: 90 });
  rig.sun.shadow.bias = -0.0004; rig.sun.shadow.normalBias = 0.03;
  rig.sun.target.position.set(mid.x, 0, mid.z);
  root.add(rig.hemi, rig.sun, rig.sun.target);
  lampHeads.forEach(({ glow, at }) => {
    const pt = new THREE.PointLight(0xffb45c, 0, 14, 1.8);
    pt.position.copy(at); root.add(pt);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(2.1, 6.2, 20, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffb45c, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
    cone.position.set(at.x, at.y - 3.1, at.z);
    root.add(cone);
    const pool = new THREE.Mesh(new THREE.CircleGeometry(2.0, 24),
      new THREE.MeshBasicMaterial({ color: 0xffb45c, transparent: true, opacity: 0, depthWrite: false }));
    pool.rotation.x = -Math.PI / 2; pool.position.set(at.x, 0.02, at.z);
    root.add(pool);
    rig.lamps.push({ pt, cone, pool, glow });
  });

  /* ---------- 天空 ---------- */
  const stars = (() => {
    const n = 350, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const th = Math.random() * Math.PI * 2, ph = Math.random() * 0.5;
      pos[i * 3] = mid.x + Math.cos(th) * Math.cos(ph) * 90;
      pos[i * 3 + 1] = 20 + Math.sin(ph) * 70;
      pos[i * 3 + 2] = mid.z + Math.sin(th) * Math.cos(ph) * 90;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({ color: 0xcfd8e8, size: 0.14, transparent: true, opacity: 0 });
    const p = new THREE.Points(g, m);
    root.add(p);
    return p;
  })();

  return {
    root, cables, cableMats, rig, lampHeads, cctvDots, litWins, hotspotAnchors, laundry, stars, eraGates,
  };
}
