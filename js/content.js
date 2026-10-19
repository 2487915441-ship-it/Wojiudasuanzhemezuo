/* ============================================================
   头顶的网 The Net Above Us —— 全部双语内容数据
   内容来源：《头顶的网-网站呈现信息总清单.xlsx》（作者提供）
   证据分级：evidence 证据(绿) · inference 推测/待核实(橙) · simulation 模拟(红)
   ============================================================ */

export const GRADE = {
  evidence:   { zh: '证据', en: 'EVIDENCE',   color: '#5d8a54' },
  inference:  { zh: '推测·待核实', en: 'INFERENCE', color: '#c07a2a' },
  simulation: { zh: '模拟', en: 'SIMULATION', color: '#b13a2f' },
};

export const I18N = {
  siteTitle:   { zh: '头顶的网', en: 'The Net Above Us' },
  siteSub:     { zh: 'THE NET ABOVE US · 武汉民主路社区', en: '武汉民主路社区 · MINZHU RD COMMUNITY, WUHAN' },
  tagline:     { zh: '一根电线杆，如何串起三十年的「头顶的网」', en: 'One pole, and the thirty-year net above us' },
  enter:       { zh: '进入巷子', en: 'Enter the alley' },
  enterHint:   { zh: '建议开启声音 · 全程约 3–5 分钟', en: 'Sound recommended · ~3–5 min' },
  statement: {
    zh: '我以巷道上空的电线电缆为切入点，关注它从电线杆时代到密集架空网、再到入地改造的三十年变化，通过照片、计数、访谈与政策文本，结合空中—地面—地下的空间与权属关系，呈现这张看不见的网如何支撑社区日常。',
    en: 'Overhead cables in Minzhu Road Community, Wuhan, are my entry point. I trace how they changed over thirty years — from the telephone-pole era to today\'s dense aerial net, and now toward underground burial. Using photographs, on-site counting, resident interviews and policy documents, and reading the vertical relations between sky, street and underground, I show how this invisible net quietly sustains everyday community life.',
  },
  keyNums: { zh: '一杆约 12 根 · 离地约 3 m · 大多 20–35 年 · 跨度约 40 年', en: '~12 cables/pole · ~3 m high · mostly 20–35 yrs · ~40 yrs span' },
  howTitle: { zh: '操作', en: 'HOW TO EXPLORE' },
  how: {
    zh: '拖拽环视 · 滚轮或 ← → 沿巷前后移动 · 点击亮点看证据 · 拖动年份滑块 · 切换日/夜 · ESC 返回巷口',
    en: 'Drag to look around · scroll or ← → to walk the alley · click glowing dots for evidence · drag the year slider · toggle day/night · ESC returns to the entrance',
  },
  pathTitle: { zh: '阅读路径', en: 'READING PATH' },
  path: { zh: '入口 → 探索 → 总结 → 返回/重置', en: 'Entry → explore → summary → return/reset' },
  legendGrade: { zh: '证据分级', en: 'EVIDENCE GRADES' },
  legendVisual: { zh: '视觉编码：颜色＝权属 · 高度＝空间 · 图层＝年代 · 动效＝变化', en: 'ENCODING: colour = ownership · height = space · layer = era · motion = change' },
  aiNote: {
    zh: '本页 3D 场景为 AI 辅助模拟（示意），并非现场照片；所有「模拟」内容不充当田野证据。',
    en: 'The 3D scene on this page is an AI-assisted simulation (schematic), not site photography; nothing marked “simulation” serves as field evidence.',
  },
  // 顶部按钮
  btnDay:   { zh: '日 / 夜', en: 'DAY / NIGHT' },
  btnOwn:   { zh: '权属', en: 'OWNERSHIP' },
  btnView:  { zh: '视角', en: 'VIEWPOINT' },
  btnSum:   { zh: '收束', en: 'TENSIONS' },
  btnSound: { zh: '声音', en: 'SOUND' },
  btnInfo:  { zh: '关于', en: 'ABOUT' },
  btnRef:   { zh: '依据', en: 'EVIDENCE' },
  btnLang:  { zh: 'EN', en: '中' },
  // 底部
  yearNow: { zh: '现在 · 2026', en: 'Now · 2026' },
  hintDefault: { zh: '拖拽环视 · 滚轮前后 · 点击线缆或发光热点看证据', en: 'Drag to look · scroll to walk · click cables or glowing hotspots' },
  hintCard: { zh: 'ESC 关闭并返回 · 继续拖拽环视', en: 'ESC to close & return · drag to keep looking' },
  hintNightOn: { zh: '夜晚：灯亮起，网显形', en: 'Night: lamps on, the net shows' },
  hintDayOn: { zh: '白天：网隐形于日常', en: 'Day: the net dissolves into routine' },
  escBack: { zh: '已返回巷口', en: 'Back at the entrance' },
  // 面板
  srcLabel: { zh: '来源', en: 'SOURCE' },
  chainTitle: { zh: '传导链 · 空中 → 杆 → 墙 → 入户', en: 'PATH · aerial → pole → wall → home' },
  closeCard: { zh: '关闭', en: 'CLOSE' },
  ovClose: { zh: 'ESC · 关闭', en: 'ESC · CLOSE' },
  // 收束
  sumTitle: { zh: '张力 · 收束', en: 'TENSIONS' },
  sumNote: { zh: '同一张网的三对矛盾', en: 'Three contradictions of the same net' },
  // 视角
  viewTitle: { zh: '同一张网的三张面孔', en: 'Three faces of the same net' },
  viewNote: { zh: '视角是「可见性机制」的三个样本，主线仍锁定社区居民。', en: 'Viewpoints are three samples of the visibility mechanism; the main line stays with residents.' },
  // 权属
  ownTitle: { zh: '权属 · 多方共杆', en: 'OWNERSHIP · one pole, many owners' },
  ownNote: { zh: '多方共杆 → 权责稀释 → 废弃线无人拆 → 越挂越密', en: 'Shared pole → diluted duty → dead cables never removed → denser and denser' },
  ownOff: { zh: '关闭权属着色', en: 'Clear ownership colours' },
  ownAll: { zh: '全部', en: 'ALL' },
  // CREDITS
  creditsTitle: { zh: '关于 · CREDITS', en: 'ABOUT · CREDITS' },
  audience: { zh: '核心受众：社区居民（尤其老人，承担风险却最少了解）；对照：租住学生、游客/城市观察者。', en: 'Primary audience: residents (esp. the elderly, who bear the risk yet know it least); secondary: student tenants & passers-by.' },
  designQ: { zh: '核心设计问题：如何让一个沉默的支撑系统持续可读——不必等到失效，也不制造恐慌。', en: 'Design question: how can a silent support system stay legible — without waiting for failure, and without alarm?' },
  setupTitle: { zh: '运行说明', en: 'HOW TO RUN' },
  setup: { zh: '主流桌面浏览器打开即运行，兼容不同窗口宽度；本地启动：在本文件夹运行任意静态服务器（如 python3 -m http.server）后访问。', en: 'Runs in any mainstream desktop browser and adapts to window width; locally, serve this folder with any static server (e.g. python3 -m http.server).' },
  aiTitle: { zh: 'AI 使用声明', en: 'AI USE STATEMENT' },
  aiStatement: { zh: '本网站的 3D 场景、界面代码与部分文案由 AI（Kimi）辅助生成；3D 场景为 AI 辅助模拟，仅作示意，不充当现场证据；AI 提出的事实与数据均已对照原始来源核查；访谈内容经同意并去标识化。', en: 'The 3D scene, interface code and part of the copy were AI-assisted (Kimi). The scene is a schematic simulation, not field evidence; facts and figures suggested by AI were checked against original sources; interviews were consented and de-identified.' },
  srcTitle: { zh: '来源与证据', en: 'SOURCES & EVIDENCE' },
  thanksTitle: { zh: '致谢', en: 'THANKS' },
  thanks: { zh: '感谢民主路社区受访居民（W婆婆等）与路过拍下这张照片的人们。', en: 'Thanks to the interviewed residents of Minzhu Road Community (Granny W and others), and to the passers-by who looked up.' },
  courseLine: { zh: 'VIS5027 视觉设计语境 · 中期（Route C 互动 HTML 网站）· 2026.10', en: 'VIS5027 Visual Design Context · Midterm (Route C · interactive HTML site) · 2026.10' },
  // 创作依据
  refTitle: { zh: '创作依据 · FIELD MATERIAL', en: 'FIELD MATERIAL' },
  refNote: { zh: '3D 场景并非凭空生成：巷子尺度、折线走向、楼高与线缆分层，全部依据以下现场实拍与估算复原图重建。', en: 'The 3D scene is not invented: the alley’s width, its zigzag path, building heights and cable layers are all reconstructed from the field photos and estimated drawings below.' },
  refPlanT: { zh: '巷道剖面与俯视图（估算复原）', en: 'Cross-section & plan (estimated reconstruction)' },
  refPlanC: { zh: '宽高比 ≈1:3 的握手楼剖面；折线形窄巷，路灯间距约 25–35 m。', en: 'A “handshake-building” section with ~1:3 width-height ratio; a zigzag alley, lamps every ~25–35 m.' },
  refPhotosT: { zh: '现场实拍（夜拍 · 本人拍摄）', en: 'Field photos (night · shot by the author)' },
  refTip: { zh: '点击图片放大', en: 'Click to enlarge' },
  // 线缆卡
  cableTitle: { zh: '线缆 · ', en: 'Cable · ' },
  cableDrop: { zh: '入户下线', en: 'service drop' },
  cableTrunk: { zh: '主干线缆', en: 'trunk cable' },
  cableEra: { zh: '架设年代', en: 'Laid in' },
  cableSimNote: { zh: '3D 场景为模拟示意（红标）；下方照片为现场证据（绿标）。', en: 'The 3D scene is a simulation (red); the photo below is field evidence (green).' },
  photoSrc: { zh: '现场照片 · 夜拍（本人拍摄）', en: 'Field photo · night (shot by the author)' },
  // 日夜提示卡（机制·可见性）
  visDay: { zh: '白天 / 正常＝隐形：正常供电时，线缆隐形于日常。', en: 'Day / working = invisible: when power works, cables dissolve into routine.' },
  visNight: { zh: '夜晚 / 故障 / 雨天＝显形：被看见，往往就是出事。', en: 'Night / fault / rain = visible: to be seen is often to have failed.' },
};

/* ---------- 年代滑块（生命史） ---------- */
export const ERAS = [
  { id: '1980', label: { zh: '1980s · 电线杆时代', en: '1980s · Pole era' }, grade: 'inference',
    text: { zh: '约 1980s：架设＝解决当下问题，巷子上空一度清亮。', en: 'c.1980s: wiring solved the problem at hand; the sky above the alley was still clear.' },
    src: { zh: '文献 / 老住户回忆（晋中报道参照）· 待本地核实', en: 'Literature / elders\' recall (Jinzhong report as reference) · to be verified locally' } },
  { id: '1990', label: { zh: '1990s · 电器时代', en: '1990s · Appliance era' }, grade: 'inference',
    text: { zh: '1990s–2000s：空调入户，线缆层层加挂，「线」开始成「网」。', en: '1990s–2000s: air conditioners arrive; cables stack layer by layer — lines become a net.' },
    src: { zh: '文献＋现场「20–35 年」吻合 · 部分印证', en: 'Literature + on-site “20–35 yrs” estimate · partially corroborated' } },
  { id: '2000', label: { zh: '2000s · 网络入户', en: '2000s · Network era' }, grade: 'inference',
    text: { zh: '2000s：网络入户，通信线缆加速叠加。', en: '2000s: internet reaches every home; communication cables pile on.' },
    src: { zh: '行业资料 · 待核实', en: 'Industry sources · to be verified' } },
  { id: '2010', label: { zh: '2010s · 光纤入户', en: '2010s · Fiber era' }, grade: 'inference',
    text: { zh: '2000s–2010s：多家运营商入场，强弱电混杂，电力 / 通信外观难分。', en: '2000s–2010s: multiple carriers move in; power and signal tangle, indistinguishable from below.' },
    src: { zh: '行业资料 · 待核实', en: 'Industry sources · to be verified' } },
  { id: '2026', label: { zh: '2026 · 超龄服役', en: '2026 · Over-age now' }, grade: 'evidence',
    text: { zh: '现在 · 2026：大多线缆超龄，断线残留在杆上。', en: 'Now, 2026: most cables are past their design life; broken lines remain on the poles.' },
    src: { zh: '现场一手记录', en: 'First-hand field record' } },
  { id: 'future', label: { zh: '入地 · 未来', en: 'Future · Going underground' }, grade: 'evidence',
    text: { zh: '未来：政策导向管线入地，这张「网」第一次被整体改写。（本巷是否列入 · 待核实）', en: 'Future: policy directs cables underground — the first wholesale rewrite of this net. (Whether this alley is listed · to be verified)' },
    src: { zh: '《武汉市人民政府公报》2022 第 8 期 · 《武汉市老旧小区改造技术导则》2023', en: 'Wuhan Municipal Government Gazette 2022 No.8 · Wuhan Old-community Renovation Technical Guidelines 2023' } },
];

/* ---------- 热点（点·征候 + 传导链风险端） ---------- */
export const HOTSPOTS = [
  { id: 'H1', photos: ['p01','p08'], anchor: 'pole1_top',
    title: { zh: '密度 · 一杆约 12 根', en: 'Density · ~12 cables on one pole' }, grade: 'evidence',
    body: { zh: '一根电线杆上架着约 12 根线缆（逐根计数 · 估算），电力 / 通信 / 监控层层加挂的直接结果——「网」不是一次规划，是一次次「先解决眼前」叠出来的。', en: 'Roughly twelve cables ride on a single pole (counted one by one · estimate) — the direct result of layer-upon-layer additions. The “net” was never planned once; it accreted, one urgent fix at a time.' },
    src: { zh: '现场计数（白天 · 逐根放大估算）', en: 'On-site count (daylight, cable-by-cable estimate)' } },
  { id: 'H2', photos: ['p12','p04'], anchor: 'low_cable',
    title: { zh: '高度 · 离地约 3 m', en: 'Height · ~3 m above ground' }, grade: 'inference',
    body: { zh: '最低线缆离地约 3 m，逼近 / 低于安全距离；疑为通信线或老化下垂（电力或通信、是否达标，待核实）。', en: 'The lowest cable hangs ~3 m above ground, near or below the safe clearance; likely a communication line or aged sagging (ownership and compliance to be verified).' },
    src: { zh: '现场估测 + 与导则安全距离比对', en: 'On-site estimate + comparison with guideline clearance' } },
  { id: 'H3', photos: ['p06','p09'], anchor: 'pole2_top',
    title: { zh: '年龄 · 大多 20–35 年', en: 'Age · mostly 20–35 yrs' }, grade: 'evidence',
    body: { zh: '多数线缆铺设约 20–35 年；对照行业寿命（国标电力电缆 ≥30 年 / PVC 约 20–30 年），不少已超龄服役。', en: 'Most cables were laid some 20–35 years ago; against design lives (national-standard power cable ≥30 yrs / PVC ~20–30 yrs), many are serving past their age.' },
    src: { zh: '现场记录 + 行业寿命资料印证', en: 'Field record + industry lifespan data' } },
  { id: 'H4', photos: ['p10','p04'], anchor: 'wall_coil',
    title: { zh: '损伤 · 断线 / 老化 / 盘卷', en: 'Damage · breakage / aging / coils' }, grade: 'inference',
    body: { zh: '老化、盘卷冗余（外墙盘卷 E-2）是「层层加挂」的物证。⚠ 断线记录原引自组员田野笔记，尚待本人补拍核实。', en: 'Aging and coiled slack (wall coil E-2) are physical evidence of layer-upon-layer additions. ⚠ The breakage record was originally quoted from a teammate\'s notes and awaits first-hand re-verification.' },
    src: { zh: '夜拍 E-2（盘卷）＋ 断线记录（待核实）', en: 'Night photo E-2 (coil) + breakage record (to be verified)' } },
  { id: 'H5', photos: ['p03','p06'], anchor: 'cctv', chain: true,
    title: { zh: '负载 · 不止供电', en: 'Load · more than power' }, grade: 'evidence',
    body: { zh: '线缆承载的不只是电：监控共杆（E-1）、路灯照明、电表箱入户（E-3）——安全治理也挂在这张网上。', en: 'The cables carry more than electricity: CCTV shares the pole (E-1), street lamps hang from it, meter boxes feed every home (E-3) — governance itself rides on this net.' },
    src: { zh: '夜拍', en: 'Night photography' } },
  { id: 'H6', photos: ['p05','p11'], anchor: 'window',
    title: { zh: '人的直觉 · W 婆婆', en: 'A resident\'s intuition · Granny W' }, grade: 'evidence',
    body: { zh: '「架的不是很高，感觉蛮危险的」「附近也没什么灭火器」（灭火器巷口才见 E-4）——居民对风险的直觉先于任何数据。', en: '“They didn\'t hang them very high — it feels quite dangerous.” “There are hardly any fire extinguishers around.” (One appears only at the alley entrance, E-4.) Residents sense the risk before any data does.' },
    src: { zh: 'W 婆婆访谈原话（同意 · 去标识化）', en: 'Interview with Granny W (consented · de-identified)' } },
  { id: 'L25', photos: ['p08','p14'], anchor: 'extinguisher',
    title: { zh: '风险端 · 老化 → 火灾 → 缺位', en: 'Risk end · aging → fire → absence' }, grade: 'inference',
    body: { zh: '老化 → 火花 → 火灾 → 灭火器缺位（E-4）；因果链后半为推测。灭火器只在巷口——巷内深处没有。', en: 'Aging → sparks → fire → no extinguisher at hand (E-4); the latter half of this chain is inference. The only extinguisher stands at the entrance — none deep inside.' },
    src: { zh: '夜拍 E-4 ＋ 访谈', en: 'Night photo E-4 + interview' } },
];

/* ---------- 传导链（H5 卡内小图） ---------- */
export const CHAIN = [
  { id: 'L2-1', name: { zh: '空中段', en: 'Aerial' }, grade: 'evidence',  text: { zh: '线缆悬空约 3 m，层层叠加。', en: 'Cables hang ~3 m up, stacked in layers.' } },
  { id: 'L2-2', name: { zh: '杆段', en: 'Pole' },   grade: 'inference', text: { zh: '断线 / 故障发生在杆上节点。', en: 'Breakage and faults happen at pole nodes.' } },
  { id: 'L2-3', name: { zh: '墙段', en: 'Wall' },   grade: 'evidence',  text: { zh: '外墙盘卷冗余（E-2），新旧两层叠加。', en: 'Coiled slack on outer walls (E-2), old and new stacked.' } },
  { id: 'L2-4', name: { zh: '入户段', en: 'Home' }, grade: 'evidence',  text: { zh: '电表箱入户（E-3），空中—地面—入户路径闭合。', en: 'Meter boxes feed homes (E-3); the aerial-street-home path closes.' } },
  { id: 'L2-5', name: { zh: '风险端', en: 'Risk end' }, grade: 'inference', text: { zh: '老化 → 火灾 → 灭火器缺位（E-4）。', en: 'Aging → fire → extinguisher absent (E-4).' } },
];

/* ---------- 权属 ---------- */
export const OWNERS = [
  { id: 'power', name: { zh: '电力', en: 'Power' }, grade: 'inference', color: '#d95f43', photoId: 'p01',
    text: { zh: '供电主干线。', en: 'The power mains.' },
    desc: { zh: '横担最上层的供电主干。架空线缆无标识，电力与通信从外观上难以分辨——权属需逐段核实。', en: 'The power mains on the top crossarm. Aerial cables carry no markings; power and signal look alike from below — ownership must be verified span by span.' } },
  { id: 'comm', name: { zh: '通信', en: 'Communication' }, grade: 'inference', color: '#4a7fa5', photoId: 'p08',
    text: { zh: '宽带 / 光纤，多家运营商。', en: 'Broadband / fiber, multiple carriers.' },
    desc: { zh: '宽带与光纤，多家运营商先后进场、层层加挂；废弃线无人拆，越挂越密。', en: 'Broadband and fiber from successive carriers, layered one upon another; dead lines are never removed, so the net keeps thickening.' } },
  { id: 'cctv', name: { zh: '监控 / 照明', en: 'CCTV & lighting' }, grade: 'evidence', color: '#b39c4f', photoId: 'p03',
    text: { zh: '监控（E-1）、路灯——治理也挂在网上。', en: 'CCTV (E-1) and street lamps — governance rides the net too.' },
    desc: { zh: '监控与路灯（E-1）共杆取电，安全治理本身也挂在这张网上。', en: 'CCTV and street lamps (E-1) draw power from the same pole — governance itself rides on this net.' } },
  { id: 'private', name: { zh: '居民私拉', en: 'Private' }, grade: 'inference', color: '#7d9b6a', photoId: 'p10',
    text: { zh: '私拉乱接。', en: 'Informal, resident-run lines.' },
    desc: { zh: '居民自拉的跨巷飞线与插线板延长线，是最低、最乱、也最难追责的一层。', en: 'Resident-run spanning lines and extension cords — the lowest, messiest, least accountable layer.' } },
];

/* ---------- 视角 ---------- */
export const VIEWS = [
  { id: 'resident', name: { zh: '居民 · 长期依赖者', en: 'Resident · long-term dependent' }, grade: 'evidence',
    text: { zh: '网＝功能服务（电 / 网 / 照明 / 监控）；越可靠越忽视；雨天 / 停电才想起它（W 婆婆：「蛮危险的」「没什么灭火器」）。', en: 'The net = service (power / internet / light / CCTV). The more reliable, the more ignored; only rain or a blackout recalls it. (“Quite dangerous.” “Hardly any extinguishers.” — Granny W)' } },
  { id: 'student', name: { zh: '租住学生 · 短暂停留者', en: 'Student tenant · temporary stay' }, grade: 'inference',
    text: { zh: '网＝背景里的隐患；高强度依赖电 / 网，却因暂住无归属感——看见了，也不觉得归自己管。', en: 'The net = a hazard in the background. Heavy dependence on power and Wi-Fi, yet no belonging in a temporary stay — seen, but never one\'s own business.' } },
  { id: 'visitor', name: { zh: '游客 / 路过者 · 观看者', en: 'Visitor · passer-by' }, grade: 'inference',
    text: { zh: '网＝分割天空的风景；拍照打卡 / 构图 / 市井烟火气——可见，却无关。', en: 'The net = a scenery that slices the sky; a photo, a composition, a whiff of street life — visible, yet irrelevant.' } },
];
export const VIEW_SUM = { zh: '同一张网，是居民的服务、学生的背景、游客的滤镜；风险对所有人无声。', en: 'The same net is the resident\'s service, the student\'s background, the visitor\'s filter — and its risk is silent to all.' };

/* ---------- 张力 ---------- */
export const TENSIONS = [
  { a: { zh: '可靠', en: 'Reliable' }, b: { zh: '可见', en: 'Visible' },
    text: { zh: '越可靠越隐形；被看见往往就是出事。', en: 'The more reliable, the more invisible; to be seen is often to have failed.' } },
  { a: { zh: '临时', en: 'Temporary' }, b: { zh: '永久', en: 'Permanent' },
    text: { zh: '每根线都是临时方案，叠加成永久杂乱；入地是第一次整体改写。', en: 'Every cable was a temporary fix, stacked into permanent clutter; going underground is the first wholesale rewrite.' } },
  { a: { zh: '安全', en: 'Safety' }, b: { zh: '沉默', en: 'Silence' },
    text: { zh: '风险不断累积，系统却保持沉默（无标识 / 无人认领），直到失效。', en: 'Risk keeps accumulating while the system stays silent (unmarked, unclaimed) — until failure.' } },
];
export const TENSION_CONCLUSION = { zh: '民主路这样的 1980s 老社区，头顶叠着约 40 年的「临时」；入地改造是第一次整体改写。', en: 'Above a 1980s community like Minzhu Road hangs some forty years of “temporary”; going underground is its first wholesale rewrite.' };
export const TENSION_QUESTION = { zh: '如何让一个沉默的支撑系统持续可读——不必等到失效，也不制造恐慌。', en: 'How can a silent support system stay legible — without waiting for failure, and without alarm?' };

/* ---------- 现场实拍照片（夜拍，本人拍摄） ---------- */
export const PHOTOS = [
  { id: 'p01', cap: { zh: '巷口 · 电杆与多层线缆（夜）', en: 'Entrance · pole and layered cables (night)' } },
  { id: 'p02', cap: { zh: '巷内行进 · 线缆入户', en: 'Walking in · cables feeding homes' } },
  { id: 'p03', cap: { zh: '监控与路灯共杆（E-1）', en: 'CCTV and lamp sharing a pole (E-1)' } },
  { id: 'p04', cap: { zh: '跨巷飞线与低垂线缆', en: 'Spanning drops and sagging lines' } },
  { id: 'p05', cap: { zh: '夜巷 · 灯下居民', en: 'Night alley · residents under lamps' } },
  { id: 'p06', cap: { zh: '电杆近景 · 监控 / 路灯 / 线缆', en: 'Pole close-up · CCTV / lamp / cables' } },
  { id: 'p07', cap: { zh: '巷道夜景 · 杆线全景', en: 'Night view · poles and cables' } },
  { id: 'p08', cap: { zh: '院落立面 · 线缆密布（计数现场）', en: 'Courtyard facade · dense cables (counting site)' } },
  { id: 'p09', cap: { zh: '巷内仰视 · 杆线与防盗窗', en: 'Looking up · cables and barred windows' } },
  { id: 'p10', cap: { zh: '狭窄巷段 · 盘卷与私拉', en: 'Narrow stretch · coils and informal lines' } },
  { id: 'p11', cap: { zh: '夜巷纵深', en: 'The alley at night, in depth' } },
  { id: 'p12', cap: { zh: '低垂线缆掠过巷道上空', en: 'Low-sagging cables over the alley' } },
  { id: 'p13', cap: { zh: '调研现场 · 工作记录（不作证据引用）', en: 'Fieldwork · working record (not cited as evidence)' } },
  { id: 'p14', cap: { zh: '巷道口 · 院落', en: 'Alley junction · courtyard' } },
];

/* ---------- 来源（CREDITS） ---------- */
export const SOURCES = [
  { id: 'S1', grade: 'evidence', text: { zh: '现场照片 · 白天一组（本人拍摄）', en: 'Site photos, daytime set (shot by the author)' } },
  { id: 'S2', grade: 'evidence', text: { zh: '夜拍 19 张（本人拍摄）：监控共杆 / 盘卷 / 电表箱 / 灭火器 / 院落', en: '19 night photos (by the author): CCTV on poles / coils / meter boxes / extinguisher / courtyards' } },
  { id: 'S3', grade: 'evidence', text: { zh: '单杆线缆计数 · 约 12 根（逐根计数，估算）', en: 'Cable count on one pole · ~12 (counted one by one, estimate)' } },
  { id: 'S4', grade: 'inference', text: { zh: '离地高度 · 约 3 m（本人估测）', en: 'Clearance · ~3 m (author\'s estimate)' } },
  { id: 'S5', grade: 'evidence', text: { zh: 'W 婆婆访谈（本人访谈，同意 · 去标识化）', en: 'Interview with Granny W (consented, de-identified)' } },
  { id: 'S6', grade: 'evidence', text: { zh: '线缆年龄 20–35 年（现场观察＋行业寿命资料印证）', en: 'Cable age 20–35 yrs (field observation + industry lifespan data)' } },
  { id: 'S7', grade: 'evidence', text: { zh: '《武汉市老旧小区改造技术导则》2023', en: 'Wuhan Old-community Renovation Technical Guidelines, 2023' } },
  { id: 'S8', grade: 'evidence', text: { zh: '《武汉市人民政府公报》2022 第 8 期', en: 'Wuhan Municipal People\'s Government Gazette, 2022 No.8' } },
  { id: 'S9', grade: 'evidence', text: { zh: '苏建房管〔2021〕68 号（外地文件 · 仅参照）', en: 'Su-Jian-Fang-Guan [2021] No.68 (other province · reference only)' } },
  { id: 'S10', grade: 'evidence', text: { zh: '黄河新闻网 2019 晋中管线下地报道（外地案例 · 仅参照）', en: 'Huanghe News 2019 report on Jinzhong cable burial (other city · reference only)' } },
  { id: 'S11', grade: 'evidence', text: { zh: '电缆设计寿命行业资料：国标电力电缆 ≥30 年 / PVC 约 20–30 年', en: 'Industry lifespan data: national-standard power cable ≥30 yrs / PVC ~20–30 yrs' } },
  { id: 'S12', grade: 'inference', text: { zh: '断线记录（原引组员田野笔记 · 待本人补拍核实）', en: 'Breakage record (from a teammate\'s notes · pending first-hand verification)' } },
];
