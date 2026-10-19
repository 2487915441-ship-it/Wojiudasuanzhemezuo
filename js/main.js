/* ============================================================
   头顶的网 The Net Above Us —— 主程序
   相机约束：眼高 1.6m 恒定 · 始终贴在折线巷道中线 · 仅沿弧长 s 前后
   ============================================================ */
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ALLEY, PATH, buildAlley } from './scene.js?v=net4';
import { GRADE, I18N, ERAS, HOTSPOTS, CHAIN, OWNERS, VIEWS, VIEW_SUM, TENSIONS, TENSION_CONCLUSION, TENSION_QUESTION, SOURCES, PHOTOS } from './content.js?v=net4';

const $ = (id) => document.getElementById(id);
gsap.defaults({ overwrite: 'auto' });
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (isTouch) document.body.classList.add('touch');

let lang = 'zh';
const T = (k) => I18N[k] ? (I18N[k][lang] ?? I18N[k].zh) : k;
const TL = (o) => o ? (o[lang] ?? o.zh) : '';

/* ---------------- 渲染器 ---------------- */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true });
} catch (e) {
  $('loading').remove(); $('fallback').style.display = 'grid'; throw e;
}
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const DAY_BG = new THREE.Color(0xd9dfd2), NIGHT_BG = new THREE.Color(0x0b1118);
scene.background = DAY_BG.clone();
scene.fog = new THREE.Fog(DAY_BG.clone(), 26, 95);

const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.08, 220);
camera.rotation.order = 'YXZ';

const world = buildAlley(scene);
const { cables, cableMats, rig, cctvDots, litWins, hotspotAnchors, stars, eraGates } = world;

/* 线缆独立材质（便于逐根做年代/权属/日夜控制） */
cables.forEach(m => {
  m.material = cableMats.net.clone();
  m.userData.baseOpacity = 0.9;
});

/* ---------------- 相机约束控制（沿折线中线） ---------------- */
// yaw 存的是「相对巷道朝向」的偏航偏移，过弯时视线随巷子转向
const cam = { s: 0.6, yawOff: 0, pitch: 0.06 };        // 目标值
const camCur = { s: 0.6, yawOff: 0, pitch: 0.06 };     // 当前（阻尼插值）
function applyCam() {
  const p = PATH.point(camCur.s, 0, ALLEY.eyeY);
  camera.position.copy(p);
  camera.rotation.set(camCur.pitch, PATH.baseYaw(camCur.s) + camCur.yawOff, 0);
}
function lookAtFrom(s, target) {
  const cp = PATH.point(s, 0, ALLEY.eyeY);
  const dx = target.x - cp.x, dy = target.y - cp.y, dz = target.z - cp.z;
  const yaw = Math.atan2(-dx, -dz);
  return { yawOff: yaw - PATH.baseYaw(s), pitch: Math.atan2(dy, Math.hypot(dx, dz)) };
}
function flyTo(s, target, dur = 1.4) {
  const look = lookAtFrom(s, target);
  gsap.to(cam, { s, yawOff: look.yawOff, pitch: look.pitch, duration: reducedMotion ? 0 : dur, ease: 'power2.inOut' });
}
function flyEntrance(dur = 1.5) {
  gsap.to(cam, { s: ALLEY.entranceS, yawOff: 0, pitch: 0.06, duration: reducedMotion ? 0 : dur, ease: 'power2.inOut' });
}

/* 拖拽环视 + 点击 + 滚轮前后 */
const ray = new THREE.Raycaster();
const ptr = new THREE.Vector2();
let dragging = false, dragMoved = 0, lastX = 0, lastY = 0, downT = 0;
const el = renderer.domElement;
el.style.touchAction = 'none';
el.addEventListener('pointerdown', (e) => {
  dragging = true; dragMoved = 0; lastX = e.clientX; lastY = e.clientY; downT = performance.now();
  el.setPointerCapture(e.pointerId);
});
el.addEventListener('pointermove', (e) => {
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  if (dragging) {
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    dragMoved += Math.abs(dx) + Math.abs(dy);
    lastX = e.clientX; lastY = e.clientY;
    cam.yawOff -= dx * 0.0031;
    cam.pitch = THREE.MathUtils.clamp(cam.pitch - dy * 0.0031, -0.5, 1.3);
  }
  hoverDirty = true;
});
el.addEventListener('pointerup', (e) => {
  dragging = false;
  if (dragMoved < 7 && performance.now() - downT < 500) {
    ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    tryPick();
  }
});
el.addEventListener('wheel', (e) => {
  e.preventDefault();
  cam.s = THREE.MathUtils.clamp(cam.s + e.deltaY * 0.011, ALLEY.sMin, ALLEY.sMax);
}, { passive: false });

addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { onEsc(); return; }
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowRight') cam.s = THREE.MathUtils.clamp(cam.s + 1.1, ALLEY.sMin, ALLEY.sMax);
  if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === 'ArrowLeft') cam.s = THREE.MathUtils.clamp(cam.s - 1.1, ALLEY.sMin, ALLEY.sMax);
});
/* 移动端行走按钮 */
function bindWalk(id, dir) {
  const b = $(id); let iv = null;
  const start = (e) => { e.preventDefault(); iv = setInterval(() => { cam.s = THREE.MathUtils.clamp(cam.s + dir * 0.16, ALLEY.sMin, ALLEY.sMax); }, 30); };
  const stop = () => { clearInterval(iv); iv = null; };
  b.addEventListener('pointerdown', start);
  b.addEventListener('pointerup', stop); b.addEventListener('pointerleave', stop); b.addEventListener('pointercancel', stop);
}
bindWalk('walkFwd', 1); bindWalk('walkBack', -1);

/* ---------------- 热点 ---------------- */
const hsGroup = new THREE.Group(); scene.add(hsGroup);
const hsMarkers = [], hsProxies = [];
const markerGeo = new THREE.OctahedronGeometry(0.09);
HOTSPOTS.forEach(h => {
  const pos = hotspotAnchors[h.anchor];
  if (!pos) return;
  const mat = new THREE.MeshBasicMaterial({ color: 0xd9b45c, transparent: true, opacity: 0.95 });
  const mk = new THREE.Mesh(markerGeo, mat);
  mk.position.copy(pos); mk.userData.hid = h.id;
  hsGroup.add(mk); hsMarkers.push(mk);
  const proxy = new THREE.Mesh(new THREE.SphereGeometry(0.95, 8, 8),
    new THREE.MeshBasicMaterial({ visible: false }));
  proxy.position.copy(pos); proxy.userData.hid = h.id;
  hsGroup.add(proxy); hsProxies.push(proxy);
});

const hsLabel = document.createElement('div');
hsLabel.className = 'hslabel'; document.body.appendChild(hsLabel);
let hoverDirty = false, hoverId = null;
function pick() {
  ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(hsProxies, false);
  return hits.length ? hits[0].object.userData.hid : null;
}
function pickCable() {
  ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(cables.filter(m => m.visible), false);
  return hits.length ? hits[0].object : null;
}
function tryPick() {
  const hid = pick();
  if (hid) { openCard(hid); return; }
  const cm = pickCable();
  if (cm) openCableCard(cm);
}

/* ---------------- 证据卡 ---------------- */
let openCardId = null, lastCableMesh = null;
function badgeHTML(g) {
  const G = GRADE[g];
  return `<i></i>${lang === 'zh' ? G.zh : G.en}`;
}
function photoFigure(pid) {
  const ph = PHOTOS.find(x => x.id === pid);
  if (!ph) return '';
  return `<figure class="ph" data-pid="${pid}">
    <img src="./assets/photos/${pid}.jpg" alt="${TL(ph.cap)}" loading="lazy">
    <figcaption class="cap"><i>●</i> ${TL(ph.cap)} · ${T('photoSrc')}</figcaption>
  </figure>`;
}
function fillPhotos(ids, simNote = false) {
  const elp = $('cardPhotos');
  if (!ids || !ids.length) { elp.classList.remove('show'); elp.innerHTML = ''; return; }
  elp.innerHTML = (simNote ? `<div class="simNote">${T('cableSimNote')}</div>` : '') + ids.map(photoFigure).join('');
  elp.classList.add('show');
  elp.querySelectorAll('.ph').forEach(f => f.addEventListener('click', () => openLightbox(f.dataset.pid)));
}
function openCard(hid) {
  const h = HOTSPOTS.find(x => x.id === hid);
  if (!h) return;
  openCardId = hid;
  $('cardId').textContent = `${h.id} · HOTSPOT`;
  $('cardTitle').textContent = TL(h.title);
  $('cardTitleEn').textContent = h.title[lang === 'zh' ? 'en' : 'zh'];
  const badge = $('cardBadge');
  badge.style.color = GRADE[h.grade].color;
  badge.innerHTML = badgeHTML(h.grade);
  $('cardBody').textContent = TL(h.body);
  $('cardSrc').innerHTML = `<b>${T('srcLabel')}</b> · ${TL(h.src)}`;
  const chainEl = $('chain');
  if (h.chain) {
    chainEl.innerHTML = `<h3>${T('chainTitle')}</h3>` + CHAIN.map(c =>
      `<div class="chainRow"><span class="nm">${TL(c.name)}</span><span class="tx">${TL(c.text)}</span>
       <span class="badge" style="color:${GRADE[c.grade].color};font-size:9px"><i></i>${lang === 'zh' ? GRADE[c.grade].zh : GRADE[c.grade].en}</span></div>`).join('');
    chainEl.style.display = 'block';
  } else chainEl.style.display = 'none';
  fillPhotos(h.photos);
  $('card').classList.add('show');
  setHint(T('hintCard'));
  // 相机飞到热点附近（眼高不变、贴中线，仅沿弧长移动并抬头）
  const pos = hotspotAnchors[h.anchor];
  let s = cam.s <= pos.s ? pos.s - 3.2 : pos.s + 3.2;
  s = THREE.MathUtils.clamp(s, ALLEY.sMin, ALLEY.sMax);
  flyTo(s, pos);
}
/* 线缆卡：点击任意线缆 → 权属说明 + 对应实拍 */
function openCableCard(mesh) {
  lastCableMesh = mesh;
  const u = mesh.userData;
  const o = OWNERS.find(x => x.id === u.owner) || OWNERS[1];
  const era = ERAS[u.eraIdx] || ERAS[4];
  openCardId = 'CABLE';
  $('cardId').textContent = lang === 'zh' ? '线缆 · CABLE' : 'CABLE';
  $('cardTitle').textContent = T('cableTitle') + TL(o.name);
  $('cardTitleEn').textContent = (u.isDrop ? T('cableDrop') : T('cableTrunk')) + ' · ' + (lang === 'zh' ? era.label.en : era.label.zh);
  const badge = $('cardBadge');
  badge.style.color = o.color;
  badge.innerHTML = `<i style="background:${o.color}"></i>${TL(o.name)} · ${lang === 'zh' ? GRADE[o.grade].zh : GRADE[o.grade].en}`;
  $('cardBody').textContent = TL(o.desc || o.text);
  $('chain').style.display = 'none';
  $('cardSrc').innerHTML = `<b>${T('cableEra')}</b> · ${TL(era.label)} <span style="opacity:.6">(${lang === 'zh' ? GRADE.simulation.zh : GRADE.simulation.en})</span>`;
  fillPhotos(o.photoId ? [o.photoId] : [], true);
  $('card').classList.add('show');
  setHint(T('hintCard'));
}
function closeCard(returnHome = false) {
  $('card').classList.remove('show');
  openCardId = null;
  setHint(T('hintDefault'));
  if (returnHome) flyEntrance();
}

/* ---------------- 年代滑块 ---------------- */
let eraIdx = 4;
function setEra(idx, animate = true) {
  eraIdx = idx;
  const underground = idx === 5;
  cables.forEach(m => {
    const show = !underground && m.userData.eraIdx <= idx;
    const mat = m.material;
    gsap.killTweensOf(mat);
    if (show) {
      if (!m.visible) { m.visible = true; mat.opacity = 0; }
      gsap.to(mat, { opacity: targetCableOpacity(m), duration: animate && !reducedMotion ? 0.9 : 0, delay: animate && !reducedMotion ? Math.random() * 0.5 : 0 });
    } else {
      gsap.to(mat, { opacity: 0, duration: animate && !reducedMotion ? 0.5 : 0, onComplete: () => { m.visible = false; } });
    }
  });
  // 设备年代门槛（入地后设备保留：杆还在，网没了）
  eraGates.forEach(({ obj, minEra }) => { obj.visible = idx >= minEra; });
  const era = ERAS[idx];
  $('yearSlider').value = idx;
  $('eraLabel').innerHTML = `${TL(era.label)} <span class="badge" style="color:${GRADE[era.grade].color}"><i></i>${lang === 'zh' ? GRADE[era.grade].zh : GRADE[era.grade].en}</span>`;
  $('eraText').textContent = TL(era.text);
  [...$('ticks').children].forEach((s, i) => s.classList.toggle('active', i === idx));
}
function targetCableOpacity(m) {
  const dayFade = isNight ? 0.95 : 0.5;
  if (ownMode && ownMode !== 'all') return m.userData.owner === ownMode ? dayFade : 0.1;
  return dayFade;
}
$('yearSlider').addEventListener('input', (e) => setEra(+e.target.value));

/* ---------------- 日 / 夜 ---------------- */
let isNight = false;
function setNight(night, animate = true) {
  isNight = night;
  const d = animate && !reducedMotion ? 1.2 : 0;
  const bg = night ? NIGHT_BG : DAY_BG;
  gsap.to(scene.background, { r: bg.r, g: bg.g, b: bg.b, duration: d });
  gsap.to(scene.fog.color, { r: bg.r, g: bg.g, b: bg.b, duration: d });
  scene.fog.near = night ? 12 : 26; scene.fog.far = night ? 62 : 95;
  gsap.to(rig.hemi, { intensity: night ? 0.14 : 0.85, duration: d });
  rig.hemi.color.set(night ? 0x223048 : 0xfff3e0);
  rig.hemi.groundColor.set(night ? 0x1a1410 : 0x8a8378);
  gsap.to(rig.sun, { intensity: night ? 0.0 : 2.0, duration: d });
  rig.lamps.forEach(({ pt, cone, pool, glow }) => {
    gsap.to(pt, { intensity: night ? 30 : 0, duration: d });
    gsap.to(cone.material, { opacity: night ? 0.09 : 0, duration: d });
    gsap.to(pool.material, { opacity: night ? 0.16 : 0, duration: d });
    gsap.to(glow.material, { opacity: night ? 1 : 0, duration: d });
  });
  litWins.forEach(w => gsap.to(w.material, { opacity: night ? 0.9 : 0, duration: d }));
  gsap.to(stars.material, { opacity: night ? 0.85 : 0, duration: d });
  // 白天隐形 / 夜晚显形
  cables.forEach(m => { if (m.visible) gsap.to(m.material, { opacity: targetCableOpacity(m), duration: d }); });
  applyOwnership(); // 同步夜间自发光
  $('btnDay').classList.toggle('on', night);
  $('btnDay').setAttribute('aria-pressed', String(night));
  setHint(TL(night ? I18N.visNight : I18N.visDay));
  swapAmbience();
}

/* ---------------- 权属 ---------------- */
let ownMode = null; // null | 'all' | ownerId
function applyOwnership() {
  cables.forEach(m => {
    const mat = m.material, o = m.userData.owner;
    if (!ownMode) {
      mat.color.set(0x26251f);
      // 夜晚：给线缆一点暖色自发光，使其在夜空下仍可辨（显形）
      mat.emissive.set(isNight ? 0x4a4232 : 0x000000);
      mat.emissiveIntensity = 1;
    } else {
      const C = { power: 0xd95f43, comm: 0x4a7fa5, cctv: 0xb39c4f, private: 0x7d9b6a }[o];
      mat.color.set(C); mat.emissive.set(C); mat.emissiveIntensity = 0.18;
    }
    if (m.visible) mat.opacity = targetCableOpacity(m);
  });
  $('ownLegend').classList.toggle('show', !!ownMode);
}

/* ---------------- 视角 ---------------- */
let viewId = 'resident';
function applyView(id) {
  viewId = id;
  applyOwnership(); // 先按当前权属模式重置线缆颜色/发光
  if (id === 'student') {
    cables.forEach(m => { if (m.userData.isDrop && m.visible) { m.material.emissive.set(0xb13a2f); m.material.emissiveIntensity = 0.55; } });
  } else if (id === 'visitor') {
    gsap.to(cam, { pitch: 0.55, duration: reducedMotion ? 0 : 1.2, ease: 'power2.inOut' });
  } else if (id === 'resident') {
    litWins.forEach(w => { if (isNight) gsap.to(w.material, { opacity: 1, duration: 0.8, yoyo: true, repeat: 1 }); });
  }
  $('viewText').textContent = TL(VIEWS.find(v => v.id === id).text);
  [...$('viewPanel').querySelectorAll('.vbtns button')].forEach(b => b.classList.toggle('on', b.dataset.vid === id));
}

/* ---------------- 面板构建 ---------------- */
function buildPanels() {
  $('viewPanel').innerHTML = `<h3>${T('viewTitle')}</h3>
    <div class="vbtns">${VIEWS.map(v => `<button data-vid="${v.id}">${TL(v.name)}</button>`).join('')}</div>
    <div id="viewText"></div><div id="viewSum">${TL(VIEW_SUM)}</div>`;
  $('viewPanel').querySelectorAll('.vbtns button').forEach(b =>
    b.addEventListener('click', () => applyView(b.dataset.vid)));
  $('ownPanel').innerHTML = `<h3>${T('ownTitle')}</h3><div class="note">${T('ownNote')}</div>
    <div class="obtns">
      <button data-oid="all">${T('ownAll')}</button>
      ${OWNERS.map(o => `<button data-oid="${o.id}"><i style="background:${o.color}"></i>${TL(o.name)}</button>`).join('')}
    </div><div id="ownText"></div>`;
  $('ownPanel').querySelectorAll('.obtns button').forEach(b =>
    b.addEventListener('click', () => {
      const id = b.dataset.oid;
      ownMode = (ownMode === id) ? null : id;
      [...$('ownPanel').querySelectorAll('.obtns button')].forEach(x => x.classList.toggle('on', x.dataset.oid === ownMode));
      const o = OWNERS.find(x => x.id === ownMode);
      $('ownText').textContent = o ? TL(o.text) : '';
      applyOwnership();
    }));
  $('ownLegend').innerHTML = `<b style="display:block;margin-top:6px">${T('ownTitle')}</b>` +
    OWNERS.map(o => `<span class="gdot" style="background:${o.color}"></span>${TL(o.name)}`).join('<br>');
  // 张力
  $('tensionRows').innerHTML = TENSIONS.map(t =>
    `<div class="trow"><div class="a">${TL(t.a)}</div><div class="vs">VS</div><div class="b">${TL(t.b)}</div><div class="tx">${TL(t.text)}</div></div>`).join('');
  $('sumConcl').textContent = TL(TENSION_CONCLUSION);
  $('sumQ').textContent = TL(TENSION_QUESTION);
  // 来源
  $('srcList').innerHTML = SOURCES.map(s =>
    `<li><span class="sid">${s.id}</span><span>${TL(s.text)}</span>
     <span class="badge" style="color:${GRADE[s.grade].color}"><i></i>${lang === 'zh' ? GRADE[s.grade].zh : GRADE[s.grade].en}</span></li>`).join('');
  // 提示条
  $('ticks').innerHTML = ERAS.map((e, i) => `<span data-era="${i}">${lang === 'zh' ? e.label.zh.split(' · ')[0] : e.label.en.split(' · ')[0]}</span>`).join('');
  $('ticks').querySelectorAll('span').forEach(sp =>
    sp.addEventListener('click', () => setEra(+sp.dataset.era)));
  $('introGrades').innerHTML = `<b style="letter-spacing:.14em;font-size:10.5px;color:var(--ochre)">${T('legendGrade')}</b><br>` +
    Object.entries(GRADE).map(([k, G]) =>
      `<span class="gdot" style="background:${G.color}"></span>${lang === 'zh' ? G.zh : G.en}${k === 'evidence' ? '（现场/文件 field/documents）' : k === 'inference' ? '（待核实 to be verified）' : '（AI 辅助场景，须标注 ≠ 事实）'}`).join('<br>');
}

/* ---------------- 语言 ---------------- */
function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(elm => { elm.textContent = T(elm.dataset.i18n); });
  document.querySelectorAll('[data-i18n-g]').forEach(elm => {
    const G = GRADE[elm.dataset.i18nG]; if (G) elm.textContent = lang === 'zh' ? G.zh : G.en;
  });
  hoverId = null; hoverDirty = true; hsLabel.style.opacity = 0;
  $('btnLang').textContent = T('btnLang');
  buildPanels();
  buildRefs();
  setEra(eraIdx, false);
  applyView(viewId);
  if (openCardId) {
    const id = openCardId; openCardId = null; $('card').classList.remove('show');
    if (id === 'CABLE') { if (lastCableMesh) openCableCard(lastCableMesh); }
    else openCard(id);
  }
  setHint(T('hintDefault'));
}

/* ---------------- 提示条 ---------------- */
let hintTimer = null;
function setHint(txt, hold = 4200) {
  $('hint').textContent = txt;
  clearTimeout(hintTimer);
  if (txt !== T('hintDefault') && txt !== T('hintCard')) {
    hintTimer = setTimeout(() => { $('hint').textContent = openCardId ? T('hintCard') : T('hintDefault'); }, hold);
  }
}

/* ---------------- 声音 ---------------- */
let audDay = null, audNight = null, soundOn = false, entered = false;
function initAudio() {
  if (audDay) return;
  audDay = new Audio('./assets/audio/day.mp3'); audDay.loop = true; audDay.volume = 0;
  audNight = new Audio('./assets/audio/night.mp3'); audNight.loop = true; audNight.volume = 0;
}
function swapAmbience() {
  if (!soundOn || !entered) return;
  initAudio();
  const onA = isNight ? audNight : audDay, offA = isNight ? audDay : audNight;
  onA.play().catch(() => {});
  gsap.to(onA, { volume: 0.7, duration: 1.5 });
  gsap.to(offA, { volume: 0, duration: 1.2, onComplete: () => offA.pause() });
}
$('btnSound').addEventListener('click', () => {
  soundOn = !soundOn;
  $('btnSound').classList.toggle('on', soundOn);
  $('btnSound').setAttribute('aria-pressed', String(soundOn));
  if (soundOn) swapAmbience();
  else if (audDay) { gsap.to([audDay, audNight], { volume: 0, duration: 0.6, onComplete: () => { audDay.pause(); audNight.pause(); } }); }
});

/* ---------------- 顶部按钮 / 覆盖层 ---------------- */
$('btnDay').addEventListener('click', () => setNight(!isNight));
$('btnOwn').addEventListener('click', () => {
  $('ownPanel').classList.toggle('show'); $('viewPanel').classList.remove('show');
  $('btnOwn').classList.toggle('on', $('ownPanel').classList.contains('show'));
  $('btnView').classList.remove('on');
});
$('btnView').addEventListener('click', () => {
  $('viewPanel').classList.toggle('show'); $('ownPanel').classList.remove('show');
  $('btnView').classList.toggle('on', $('viewPanel').classList.contains('show'));
  $('btnOwn').classList.remove('on');
});
$('btnSum').addEventListener('click', () => $('summary').classList.add('show'));
$('btnAbout').addEventListener('click', () => $('about').classList.add('show'));
$('btnRef').addEventListener('click', () => { $('refs').classList.add('show'); });

/* ---------------- 创作依据：图集 + 灯箱 ---------------- */
function buildRefs() {
  $('phGrid').innerHTML = PHOTOS.map(ph =>
    `<div class="cell" data-pid="${ph.id}"><img src="./assets/photos/${ph.id}.jpg" alt="${TL(ph.cap)}" loading="lazy"><div class="c">${TL(ph.cap)}</div></div>`).join('');
  $('phGrid').querySelectorAll('.cell').forEach(c =>
    c.addEventListener('click', () => openLightbox(c.dataset.pid)));
  document.querySelector('#refs .planFig img').addEventListener('click', (e) =>
    openLightbox(null, e.currentTarget.dataset.zoom, T('refPlanT')));
}
function openLightbox(pid, src, cap) {
  const ph = pid ? PHOTOS.find(x => x.id === pid) : null;
  $('lbImg').src = src || `./assets/photos/${pid}.jpg`;
  $('lbCap').textContent = cap || (ph ? `${TL(ph.cap)} · ${T('photoSrc')}` : '');
  $('lightbox').classList.add('show');
}
$('lightbox').addEventListener('click', () => $('lightbox').classList.remove('show'));
$('btnLang').addEventListener('click', () => { lang = lang === 'zh' ? 'en' : 'zh'; applyLang(); });
$('cardClose').addEventListener('click', () => closeCard(true));
document.querySelectorAll('[data-close]').forEach(b =>
  b.addEventListener('click', () => $(b.dataset.close).classList.remove('show')));
$('enterBtn').addEventListener('click', enter);

function enter() {
  $('intro').classList.remove('show');
  ['topbar', 'dock', 'legend'].forEach(id => $(id).hidden = false);
  if (!entered) {
    entered = true;
    soundOn = true; $('btnSound').classList.add('on');
    swapAmbience();
    flyEntrance(2.2);
  }
}
function onEsc() {
  if ($('lightbox').classList.contains('show')) return $('lightbox').classList.remove('show');
  if ($('refs').classList.contains('show')) return $('refs').classList.remove('show');
  if ($('about').classList.contains('show')) return $('about').classList.remove('show');
  if ($('summary').classList.contains('show')) return $('summary').classList.remove('show');
  if ($('intro').classList.contains('show')) return enter();
  if ($('ownPanel').classList.contains('show') || $('viewPanel').classList.contains('show')) {
    $('ownPanel').classList.remove('show'); $('viewPanel').classList.remove('show');
    $('btnOwn').classList.remove('on'); $('btnView').classList.remove('on');
    return;
  }
  closeCard(true);
  setHint(T('escBack'));
}

/* ---------------- 主循环 ---------------- */
const clock = new THREE.Clock();
function loop() {
  requestAnimationFrame(loop);
  const t = clock.getElapsedTime();
  // 相机阻尼
  const k = reducedMotion ? 1 : 0.12;
  camCur.s += (cam.s - camCur.s) * k;
  camCur.yawOff += (cam.yawOff - camCur.yawOff) * k;
  camCur.pitch += (cam.pitch - camCur.pitch) * k;
  applyCam();
  // 热点标记脉动
  hsMarkers.forEach((m, i) => {
    const s = 1 + Math.sin(t * 2.4 + i * 1.7) * 0.28;
    m.scale.setScalar(s);
    m.material.opacity = 0.7 + Math.sin(t * 2.4 + i * 1.7) * 0.25;
  });
  // 监控红点闪烁（夜）
  cctvDots.forEach((d, i) => {
    d.material.opacity = isNight ? (Math.sin(t * 3.2 + i * 2.1) > 0.2 ? 1 : 0.05) : 0;
  });
  // 悬停标签
  if (hoverDirty && !dragging) {
    hoverDirty = false;
    const hid = pick();
    if (hid !== hoverId) {
      hoverId = hid;
      el.style.cursor = hid ? 'pointer' : 'grab';
      if (hid) {
        const h = HOTSPOTS.find(x => x.id === hid);
        hsLabel.textContent = TL(h.title);
        hsLabel.style.opacity = 1;
      } else hsLabel.style.opacity = 0;
    }
    if (hoverId) {
      const pos = hotspotAnchors[HOTSPOTS.find(x => x.id === hoverId).anchor].clone().project(camera);
      hsLabel.style.left = `${(pos.x * 0.5 + 0.5) * innerWidth}px`;
      hsLabel.style.top = `${(-pos.y * 0.5 + 0.5) * innerHeight}px`;
    }
  }
  renderer.render(scene, camera);
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

/* ---------------- 启动 ---------------- */
buildPanels();
buildRefs();
applyLang();
setEra(4, false);          // 默认 2026
setNight(false, false);    // 默认白天
applyCam();
loop();
window.__dbg = { cam, camCur, camera, PATH, ALLEY, scene, renderer, openCard,
  testPickAt: (x, y) => { ptr.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1); tryPick(); },
  whatAt: (x, y) => {
    ray.setFromCamera(new THREE.Vector2((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1), camera);
    return ray.intersectObjects(scene.children, true).slice(0, 8).map(h => ({
      t: h.object.type, n: h.object.name || '', o: h.object.userData.owner || '',
      d: +h.distance.toFixed(2), geo: h.object.geometry && h.object.geometry.type,
    }));
  } };
clearTimeout(window.__ldTimer); $('loading').remove();
window.__ready = Promise.resolve();
