// LONG-003 · các cảnh. Mỗi hàm vẽ một cảnh ở khung 1920×1080 theo t (hàm thuần của t). Mốc thời gian ở timeline.js (H).
import { C, circle, ell, capsule, rrect, poly, popText, subFont, clamp, lerp, seg, back, eo, TAU, star, ss, ei, rigPt, ARM, albiePageTip,
  H, LINES, talkAt, L0, Ld, pulse, hold, after, hash, cam, camLerp, drift, shake, camPath, big, countPop, countTimes, inked,
  crumbAt, crumbE, crumbWalk, UP_ARMS, WAVE_ARMS, POINT_ARMS, HUG_ARMS, albieN, loupeN, lpY, loupeOnBall, dotAt, DOT_COUNT, blinkN, waggleAt, rolloAt, tellyAt, giantHand, spindleAt,
  sparkles, glints, ex, BY, drawChar } from './lib16.js';
import { N, HZ, GY, starSky, clouds, garden, gardenPath, tuft, flowerBud, mushroom, pebble, bigLeaf, HOME, homeStone, CRACK, edgeStones, fencePost, tinyWeb,
  ballProp, scentTrail, sniffFrame, workerAnt, desertAnt, thoughtBubble, NEST, OUTWARD, desertScene, MAP, SPOTS, mapPage, TRIP,
  topGrass, trackLine, cloudShadow, binoMask, pondPage } from './props.js';
import { hookTitle } from '/_shared/episode.js';

/* ================= nền: trời sao sau thế giới (trôi chậm hơn máy: chiều sâu) ================= */
export function skyBg(c, t, k, o = {}) {
  c.fillStyle = N.grassN; c.fillRect(0, 0, 1920, 1080);
  const par = o.par ?? .15; c.save(); c.translate(-(k.cx - 960) * par, -(k.cy - 540) * par);
  starSky(c, t, { x0: -900, x1: 2900, y0: -1600, y1: 1700, ...o }); c.restore();
}
const ON_STONE = 650;                                             // chỗ đứng trên phiến đá ở rìa vườn

/* ================= MÓC: Miss Loupe chạy trên viên tròn của Rollo, máy chạy theo ================= */
export const HOOK_TITLE = [{ text: 'LOST', y: 210, px: 200, fill: C.lemon, shadow: C.berry, t0: 0 }, { text: 'AT NIGHT!', y: 380, px: 150, fill: C.cream, shadow: C.grape, t0: .12 }];
const RV = 230, RX0 = 560;                                        // tốc độ và chỗ xuất phát của Rollo
const rolloX = t => RX0 + RV * Math.min(t, H.bump + 2.5);
const hookCam = t => ({ cx: rolloX(Math.min(t, H.bump + .2)) + 40, cy: 620, z: 1.18 });
export const SP_HOOK = { x: 1990, y: 520 };                       // Spindle treo trên cành hoa (chỗ trốn 1)
export function hookScene(c, t, o = {}) {
  const k = hookCam(t);
  skyBg(c, t, k);
  cam(c, k, () => {
    garden(c, t, { x0: -400, x1: 4200, fence: true, houseX: 2700, seed: 3, tufts: 0, flowers: 0 });
    for (let i = 0; i < 14; i++) flowerBud(c, 300 + i * 290 + (i % 3) * 40, HZ + 140 + (i % 2) * 60, .9, [C.pink, C.lemon, C.mint, C.skyL][i % 4], t + i);
    // Spindle (chỗ trốn 1): treo trên tơ dưới một cành hoa cao
    capsule(c, SP_HOOK.x + 40, HZ + 210, SP_HOOK.x + 40, 300, 9, N.grassN); inked(c, cc => cc.ellipse(SP_HOOK.x + 40, 300, 46, 26, 0, 0, TAU), C.pink, 5);
    spindleAt(c, SP_HOOK.x, SP_HOOK.y + 8 * Math.sin(t * 2), 34, t, { name: 'happy', look: [-.5, .2] });
    // hòn sỏi làm viên tròn nảy
    const bx = rolloX(H.bump) + 230; pebble(c, bx + 60, GY + 6, .8);
    // Rollo đẩy viên tròn (đi giật lùi, chân sau đẩy: đúng cách bọ hung lăn)
    const rx = rolloX(t), bounce = pulse(t, H.bump, .5);
    const ball = rolloAt(c, rx, GY, 150, t, rx, { yaw: -1.4, name: t > H.bump ? 'surprised' : 'happy', look: [.6, -.3], lift: .25 * bounce });
    // Miss Loupe trên đỉnh viên tròn → bay vèo vào bóng tối
    if (t < H.bump + .05) loupeOnBall(c, ball.c[0], ball.c[1], ball.R, 58, t, { run: 1, wob: Math.sin(t * 7) * .14, name: talkAt(t, 'loupe') ? 'excited' : 'surprised', look: [-.3, -.2] });
    else {
      const u = seg(t, H.bump, H.bump + 1.0), x = ball.c[0] + lerp(0, 980, u), y = ball.c[1] - ball.R - 130 - Math.sin(Math.PI * Math.min(1, u * 1.3)) * 360 + u * 120;
      if (u < 1) { for (let i = 1; i < 6; i++) star(c, x - i * 50, y + i * 18, 16 - i * 2, `rgba(255,227,77,${.8 - i * .14})`); loupeN(c, x, y, 46 * (1 - .5 * u), t, { name: 'excited', rot: u * 9, pose: ARM.up }); }
      if (u >= .9) sparkles(c, ball.c[0] + 980, ball.c[1] - 380, 60, seg(t, H.bump + .9, H.bump + 1.6), 6, C.lemon, 16);
    }
    // Crumb chạy theo bên cạnh, hỏi xin cầm kính
    if (t > H.crumbRun - .4) { const u = eo(seg(t, H.crumbRun - .4, H.crumbRun + .2)), cx = rolloX(t) - lerp(700, 330, u);
      crumbWalk(c, cx, GY, 60, t, { yaw: .8, name: 'excited', look: [.7, -.6], arms: talkAt(t, 'crumb') ? WAVE_ARMS : UP_ARMS }); }
    // phía trước: cỏ lướt qua (chiều sâu)
    for (let i = 0; i < 22; i++) tuft(c, -200 + i * 230 + (i % 2) * 80, 1090, 2.2, t + i, i % 2 ? N.grassL : N.tall);
  });
  if (!o.noTitle) hookTitle(c, HOOK_TITLE, t, { cx: 470, cy: 300, rot: -.05, gone: ss(seg(t, 2.6, 3.1)) });
}
export const hookSpindleScreen = t => { const k = hookCam(t); return [960 + (SP_HOOK.x - k.cx) * k.z, 540 + (SP_HOOK.y - 60 - k.cy) * k.z]; };

/* ================= cả đội trên lối đi: "Miss Loupe is lost... at NIGHT!" — Rollo lăn về, viên tròn nhẹ hẳn ================= */
const AL = { x: 300, y: GY - 62, k: 118 };
export function sTeam(c, t) {
  const k = drift(camLerp({ cx: 880, cy: 640, z: 1.3 }, { cx: 1000, cy: 640, z: 1.22 }, ss(seg(t, H.rolloBack - .3, H.rolloBack + .6))), t);
  skyBg(c, t, k);
  cam(c, k, () => {
    garden(c, t, { home: [AL.x + 20, GY], tufts: 18, seed: 1 });
    const lost = L0('albie', 'Miss Loupe is lost... at NIGHT!');
    albieN(c, AL.x, AL.y, AL.k, t, { name: 'excited', yaw: .3, look: [.7, -.1], tabsUp: hold(t, lost, lost + 2.2, .2, .4), hop: .2 * pulse(t, lost, .4) });
    blinkN(c, 820, GY + 10, 62, t, { glow: .9, look: [.7, -.2] });
    waggleAt(c, 640, 690 + 10 * Math.sin(t * 3), 58, t, { yaw: .7, look: [.7, -.1] });
    dotAt(c, 660, GY + 20, 80, t, { look: [.7, -.2] });
    const cu = eo(seg(t, H.s_team - .1, H.s_team + .6)), q = L0('crumb', 'How do we find her... with no sun?');
    crumbAt(c, lerp(1400, 1040, cu), GY + 14, 66, { E: crumbE(t > q - .1 && t < q + 2.6 ? 'curious' : 'excited', t, { look: [-.6, -.2] }), yaw: -.7, walk: 1 - cu, ph: t * 2.4, q: hold(t, q, q + 2.6) });
    // Rollo lăn về từ bên phải: viên tròn có vết lõm trống
    if (t > H.rolloBack) { const u = eo(seg(t, H.rolloBack, H.rolloBack + .9)), x = lerp(2000, 1390, u);
      const b = rolloAt(c, x, GY + 20, 100, t, -x, { yaw: 1.4, name: talkAt(t, 'rollo') ? 'talk' : 'curious', look: [.6, -.3] });
      ell(c, b.c[0] + b.R * .1, b.c[1] - b.R * .82, b.R * .34, b.R * .13, 0, N.ballD); }
  });
}

/* ================= TỰA: nhạc hiệu 2 s; Miss Loupe nhỏ xíu bay ngang bầu trời sao ================= */
export function sTitle(c, t) {
  c.fillStyle = C.grape; c.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 16; i++) { const a = -t * .12 + i * TAU / 16; c.fillStyle = C.nightL; c.beginPath(); c.moveTo(960, 540); c.lineTo(960 + Math.cos(a) * 2400, 540 + Math.sin(a) * 2400); c.lineTo(960 + Math.cos(a + TAU / 32) * 2400, 540 + Math.sin(a + TAU / 32) * 2400); c.fill(); }
  for (let i = 0; i < 26; i++) { const u = i / 25; ell(c, lerp(-100, 2020, u), lerp(980, 60, u), 200, 70, -.42, 'rgba(255,248,231,.10)'); }
  for (let i = 0; i < 90; i++) { const u = hash(i), d = (hash(i + 4) - .5) * 200; circle(c, lerp(-100, 2020, u) + d * .4, lerp(980, 60, u) + d, 2 + 2 * hash(i + 2), C.cream); }
  popText(c, 'BIG', 960, 420, 190, C.lemon, C.night, t, H.jingle, { step: .07 });
  popText(c, 'SECRETS', 960, 630, 190, C.lemon, C.night, t, H.jingle - .1, { step: .04 });
  popText(c, 'of tiny bugs', 960, 720, 46, C.cream, null, t, H.jingle + 1.0, { font: subFont, step: .015, read: false });
  const u = seg(t, H.s_title, H.titleEnd + .2), x = lerp(-100, 2000, u), y = 150 + Math.sin(Math.PI * u) * 40;
  for (let i = 1; i < 7; i++) star(c, x - i * 46, y + i * 6, 16 - i * 2, `rgba(255,227,77,${.8 - i * .12})`);
  loupeN(c, x, y, 52, t, { name: 'excited', rot: -.2 + Math.sin(t * 6) * .1, pose: ARM.up, look: [.5, -.3] });
}

/* ================= BẢN ĐỒ VƯỜN của Albie ================= */
// dàn nhân vật trước trang bản đồ: Albie góc phải (có lời), Rollo + Crumb góc trái
function mapCast(c, t, o = {}) {
  const at = talkAt(t, 'albie') > 0;
  if (o.albie !== false) albieN(c, 1790, 1150, 175, t, { name: at ? 'excited' : 'happy', yaw: -.5, look: [-.8, -.3], tabsUp: o.tabs || 0, hop: o.hop || 0, page: o.page || null });
  let ball = null;
  if (o.rollo !== false) { const pt = o.point || 0; ball = rolloAt(c, 300, 1075, 112, t, 0, { yaw: 1.3, look: [.7, -.4], legsUp: pt > 0 ? [0, 0, 0, [.5 + .3 * pt, -.6 - .5 * pt, 1.05], 0, 0] : null }); }
  if (o.crumb !== false) crumbAt(c, ball ? ball.c[0] : 200, ball ? ball.c[1] - ball.R + 6 : 1075, 62, { E: crumbE(o.cname || 'curious', t, { look: [.6, -.5] }), yaw: .7, q: o.q || 0, arms: o.carms });
}
export function sMap(c, t) {
  const k = drift({ cx: 960, cy: 510, z: 1.04 }, t, .4);
  c.fillStyle = N.sky1; c.fillRect(0, 0, 1920, 1080);
  cam(c, k, () => mapPage(c, t, { home: after(t, 'mapOpen', .5), arrow: seg(t, H.mapArrow, H.mapArrow + 1.0) }));
  const off = L0('albie', 'Off my map?!'), qq = L0('crumb', 'And Miss Loupe?');
  mapCast(c, t, { tabs: hold(t, off, off + 1.4, .1, .3), hop: .2 * pulse(t, off, .4), point: hold(t, H.rolloPoint, H.mapArrow + 1.6, .3, .3), q: hold(t, qq, qq + 1.8) });
}
// lập đội: Crumb đứng đầu, cả đội xếp hàng; Dot điểm danh 1–5; Blink bật đèn; Albie ở lại giữ bản đồ
const CREW = { crumb: 1250, dot: 1060, blink: 900, waggle: 740, rollo: 530 };
export function crewLine(c, t, o = {}) {
  const lu = eo(seg(t, H.lineUp, H.lineUp + 1.0)), g = o.glow ?? lerp(.25, 1, ss(seg(t, H.blinkOn, H.blinkOn + .4)));
  const X = id => lerp({ crumb: 1250, dot: 700, blink: 1500, waggle: 1700, rollo: 1900 }[id], CREW[id], id === 'crumb' ? 1 : lu);
  if (g > .4) circle(c, X('blink'), GY - 60, 380 * g, `rgba(255,227,77,${.08 * g})`);
  rolloAt(c, X('rollo'), GY + 10, 92, t, X('rollo'), { yaw: -1.4, look: [.6, -.2] });
  waggleAt(c, X('waggle'), 700 + 12 * Math.sin(t * 3), 56, t, { yaw: .7, look: [.6, 0] });
  blinkN(c, X('blink'), GY + 12, 62, t, { glow: g, look: [.6, -.2], name: talkAt(t, 'blink') ? 'talk' : 'happy' });
  dotAt(c, X('dot'), GY + 18, 80, t, { look: [.6, -.2], legsUp: talkAt(t, 'dot') ? DOT_COUNT : null });
  crumbAt(c, X('crumb'), GY + 12, 68, { E: crumbE('excited', t, { look: [.7, -.4] }), yaw: .7, arms: talkAt(t, 'crumb') ? POINT_ARMS : UP_ARMS, hop: .15 * pulse(t, H.s_crew + .1, .4) });
  // Dot điểm danh: số nảy trên đầu từng người
  const [a, b] = Ld('dot', 'Team, count off! One, two, three, four, five!'), ts = countTimes(a + (b - a) * .35, b, 5);
  [['crumb', 730], ['dot', 760], ['blink', 700], ['waggle', 560], ['rollo', 700]].forEach(([id, y], i) => countPop(c, i + 1, X(id), y - 130, t, ts[i], { r: 34, life: 3.2 }));
}
export function sCrew(c, t) {
  const k = drift(camPath(t, [[H.s_crew, { cx: 1180, cy: 650, z: 1.45 }], [H.lineUp, { cx: 860, cy: 640, z: 1.12 }]]), t);
  skyBg(c, t, k);
  cam(c, k, () => {
    garden(c, t, { home: [AL.x + 20, GY], tufts: 16, seed: 1 });
    const bye = L0('albie', 'I\'ll keep the map. Come home safe!');
    albieN(c, AL.x, AL.y, AL.k, t, { name: t > bye ? 'excited' : 'happy', yaw: .3, look: [.8, -.1], page: t > bye - .2 ? [.8, -1.5 - .25 * Math.sin(t * 8), -.4] : null, tabsUp: t > bye ? .5 : 0 });
    crewLine(c, t);
  });
}

/* ================= CÁCH 1 · Waggle nhảy chỉ đường — nhưng không có mặt trời ================= */
const DANCE = { x: 1180, y: 520, w: 230, h: 120 };
const eight = u => { const a = u * TAU; return [DANCE.x + Math.sin(a) * DANCE.w, DANCE.y + Math.sin(2 * a) * DANCE.h * .5]; };   // hình số 8 nằm ngang
export function sSun(c, t) {
  const tu = H.tiltUp, back0 = L0('blink', 'Nope!') + .7;
  const k = drift(camPath(t, [[H.s_sun, { cx: 980, cy: 600, z: 1.3 }], [tu, { cx: 1000, cy: -420, z: 1.1 }], [back0, { cx: 860, cy: 640, z: 1.3 }]], .2, .9), t, .6);
  skyBg(c, t, k, { par: .55 });
  cam(c, k, () => {
    garden(c, t, { tufts: 14, seed: 4 });
    const dz = H.dizzy, landX = 300 + 1.5 * 92, landY = GY - 2 * .72 * 92 - 10;
    const b = rolloAt(c, 300, GY + 10, 92, t, 0, { yaw: -1.3, look: [.6, -.5], name: talkAt(t, 'rollo') ? 'talk' : 'happy' });
    crumbAt(c, 760, GY + 12, 68, { E: crumbE(talkAt(t, 'crumb') ? 'excited' : 'happy', t, { look: [.7, -.5] }), yaw: .7, arms: t > L0('crumb', 'Then I\'ll use my antennae!') ? UP_ARMS : talkAt(t, 'crumb') ? POINT_ARMS : null });
    dotAt(c, 600, GY + 20, 78, t, { look: [.7, -.4] });
    if (t < tu) blinkN(c, 470, GY - 170 + 10 * Math.sin(t * 2.4), 56, t, { fly: 1, glow: .9, look: [.7, -.4] });
    // Waggle: vọt lên → nhảy số 8 (vệt sáng) → chóng mặt xoay vòng → đáp lên viên tròn của Rollo
    const d = seg(t, H.dance, H.dance + 4.2), up = eo(seg(t, H.waggleUp, H.waggleUp + .6));
    if (t > H.dance) { c.setLineDash([16, 14]); c.lineWidth = 9; c.strokeStyle = 'rgba(255,227,77,.85)'; c.lineCap = 'round'; c.beginPath(); for (let i = 0; i <= 80 * Math.min(1, d * 1.2); i++) { const p = eight(i / 80); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke(); c.setLineDash([]);
      // giữa hình số 8: đoạn "lắc mông" thẳng
      capsule(c, DANCE.x - 70, DANCE.y + 50, DANCE.x + 70, DANCE.y - 50, 6, 'rgba(255,248,231,.5)'); }
    let wx = lerp(900, DANCE.x, up), wy = lerp(GY - 60, DANCE.y, up), wl = 0, wag = 0;
    if (t > H.dance && t < dz) { const p = eight((t - H.dance) * .45); wx = p[0]; wy = p[1]; wag = Math.abs(Math.cos((t - H.dance) * .45 * TAU)) > .8 ? Math.sin(t * 30) : 0; }
    if (t >= dz) { const u = seg(t, dz, dz + 1.2), sp = (1 - u) * 160; const p = eight((dz - H.dance) * .45); wx = lerp(p[0], landX, eo(u)) + Math.cos(t * 12) * sp; wy = lerp(p[1], landY, eo(u)) + Math.sin(t * 12) * sp * .5; wl = (1 - u) * t * 10; }
    if (t > tu - .3 && t < back0 + .4) { wx = lerp(wx, 1100, .5); }
    waggleAt(c, wx, wy, 60, t, { yaw: t >= dz && t < dz + 1.2 ? Math.sin(t * 12) * 1.4 : .6, lean: wl % TAU, wag, name: t >= dz && t < dz + 1.4 ? 'silly' : 'excited', look: [.4, .1] });
    // hỏi trẻ: "Can you find the sun?" — biểu tượng mặt trời có dấu hỏi trên hình số 8
    const qs = L0('crumb', 'using the sun!');
    if (t > qs) { const p = back(seg(t, qs, qs + .3), 2) * (1 - ss(seg(t, tu, tu + .3))); if (p > 0) { c.save(); c.translate(DANCE.x, DANCE.y - 230); c.scale(p, p); for (let i = 0; i < 10; i++) { const a = i * TAU / 10 + t; capsule(c, Math.cos(a) * 66, Math.sin(a) * 66, Math.cos(a) * 92, Math.sin(a) * 92, 12, C.mango); } inked(c, cc => cc.arc(0, 0, 56, 0, TAU), C.lemon, 6); popText(c, '?', 0, 30, 80, C.berry, null, -1, 0, { read: false }); c.restore(); } }
    // máy ngửa lên trời: chỉ có sao. Blink bay lên: "Nope!"
    if (t > tu && t < back0 + .6) { const u = eo(seg(t, tu + .3, tu + 1.0)); blinkN(c, lerp(520, 980, u), lerp(GY, -380, u), 70, t, { fly: 1, lift: .3, glow: 1, name: talkAt(t, 'blink') ? 'excited' : 'happy', look: [0, -.3] }); }
  });
  const np = L0('blink', 'Nope!'); if (t > np - .05 && t < np + 2.0) big(c, 'NOPE!', 960, 330, 170, C.berry, C.cream, t, np);
  if (t > tu + .2 && t < np) big(c, 'NO SUN?', 960, 760, 110, C.lemon, C.grape, t, tu + .2);
}

/* ================= Miss Loupe ở rìa vườn: kẹt trong khe đá, vẫn cười ================= */
export const SP_EDGE = { x: 1480, y: 470 };                       // Spindle trên mạng nhện giữa hai ngọn cỏ (chỗ trốn 2)
export function edgeWorld(c, t, o = {}) {
  edgeStones(c, t, { post: o.post, postX: 1900 });
  capsule(c, SP_EDGE.x - 110, 640, SP_EDGE.x - 60, 330, 10, N.tallD); capsule(c, SP_EDGE.x + 110, 640, SP_EDGE.x + 70, 330, 10, N.tallD);
  tinyWeb(c, SP_EDGE.x, SP_EDGE.y - 40, 80, t); spindleAt(c, SP_EDGE.x, SP_EDGE.y + 20, 30, t, { thread: false, look: [-.6, .3], name: 'happy' });
  if (o.telly) o.telly(c);
}
// Miss Loupe kẹt trong khe: vẽ cô trước, rồi mép đá phía trước che phần dưới
export function loupeStuck(c, t, o = {}) {
  const r = o.r ?? 84, tilt = o.tilt ?? .28, feet = CRACK.y - 120 + .45 * r, lx = CRACK.x + Math.sin(tilt) * 2.73 * r, ly = feet - Math.cos(tilt) * 2.73 * r, edge = CRACK.y - 120;
  c.save(); c.beginPath(); c.rect(-4000, -4000, 9000, edge + 4000); c.clip();
  loupeN(c, lx, ly, r, t, { name: o.name || 'happy', rot: tilt + (o.wob || 0), look: o.look || [.2, -.6], pose: o.pose || ARM.up, inside: o.inside });
  c.restore();
  ell(c, CRACK.x + 8, edge + 3, 52, 7, 0, N.crack);   // miệng khe ôm lấy cán kính
  return [lx, ly];
}
export const lp1Cam = t => drift({ cx: CRACK.x + 60, cy: 470, z: 1.4 }, t, .6);
export function sLp1(c, t) {
  const k = lp1Cam(t);
  skyBg(c, t, k);
  cam(c, k, () => { edgeWorld(c, t, { post: false }); loupeStuck(c, t, { look: [.1, -.7], pose: talkAt(t, 'loupe') ? ARM.shrug : ARM.peer, wob: .04 * Math.sin(t * 2) }); });
}

/* ================= CÁCH 2 · đường mùi của kiến ================= */
const TRAIL = [[1950, GY + 40], [1600, GY + 30], [1300, GY + 50], [1000, GY + 40], [820, GY + 40]];
export function sAnts(c, t) {
  const k = drift({ cx: 1000, cy: 640, z: 1.25 }, t, .6);
  skyBg(c, t, k);
  const sn = hold(t, H.sniff, H.antsCome + .5, .4, .4);
  cam(c, k, () => {
    garden(c, t, { tufts: 12, seed: 6, path: false });
    // gia đình kiến bò tới theo đường mùi (hàng dọc), chạm râu chào Crumb
    const ac = seg(t, H.antsCome, H.antsCome + 3.2);
    for (let i = 0; i < 6; i++) { const x = lerp(2050 + i * 150, 900 + i * 150, eo(clamp(ac * 1.15 - i * .04))), stop = ac > .9; workerAnt(c, x, GY + 46, 70, stop ? 0 : t * 2 + i * .3, { dir: -1, tap: stop ? .5 + .5 * Math.sin(t * 6 + i) : 0 }); }
    const [a, b] = Ld('dot', 'One, two, three, four, five, six ants!'), ts = countTimes(a, b, 6);
    for (let i = 0; i < 6; i++) countPop(c, i + 1, 900 + i * 150, GY - 70, t, ts[i], { r: 30, life: 2.6 });
    dotAt(c, 520, GY + 20, 80, t, { look: [.7, -.2], legsUp: talkAt(t, 'dot') ? DOT_COUNT : null });
    rolloAt(c, 300, GY + 10, 86, t, 0, { yaw: -1.3, look: [.6, -.3] });
    blinkN(c, 430, GY - 230 + 14 * Math.sin(t * 2.4), 56, t, { fly: 1, glow: .9, look: [.6, .3] });
    const sniffing = t < H.antsCome;
    crumbAt(c, 720, GY + 14, 74, { E: crumbE(sniffing ? 'curious' : 'excited', t, { look: sniffing ? [.6, .7] : [.7, -.2] }), yaw: .7, lean: sniffing ? .35 + .05 * Math.sin(t * 8) : 0, arms: t > H.antsCome ? WAVE_ARMS : UP_ARMS });
  });
  // khung "ngửi": chấm mùi hồng chạy trên mặt đất (người không thấy mùi; khung chỉ có khi Crumb ngửi)
  sniffFrame(c, 1290, 420, 250, t, cc => { cc.fillStyle = N.grassD; cc.fillRect(1000, 140, 600, 600); for (let i = 0; i < 40; i++) capsule(cc, 1040 + hash(i) * 520, 200 + hash(i + 3) * 460, 1060 + hash(i) * 520, 180 + hash(i + 3) * 460, 8, N.grass); scentTrail(cc, [[1560, 300], [1420, 380], [1300, 420], [1180, 480], [1060, 520]], t, seg(t, H.sniff + .2, H.sniff + 1.4), { r: 14, step: 40 }); }, sn);
}
// đi theo đường mùi: qua cây nấm, dưới chiếc lá, qua hòn sỏi (máy dolly ngang)
const MARCH = { mush: 900, leaf: 1750, peb: 2550 };
const antY = x => GY + 40 - (Math.abs(x - MARCH.peb) < 120 ? Math.cos((x - MARCH.peb) / 120 * Math.PI / 2) * 60 : 0);
export function sMarch(c, t) {
  const u = seg(t, H.s_march, H.s_edge0), head = lerp(500, 3000, u);
  const k = drift({ cx: head - 260, cy: 640, z: 1.25 }, t, .5);
  skyBg(c, t, k, { par: .1 });
  cam(c, k, () => {
    garden(c, t, { x0: -200, x1: 3800, tufts: 30, seed: 8, path: false });
    mushroom(c, MARCH.mush, GY + 30, 1.3); pebble(c, MARCH.peb, GY + 60, 1.4);
    scentTrail(c, [[head + 700, GY + 40], [head - 900, GY + 40]], t, 1, { r: 6, a: .35, step: 46 });
    for (let i = 0; i < 6; i++) { const x = head - i * 120; workerAnt(c, x, antY(x) + 4, 60, t * 2.2 + i * .3, { dir: 1 }); }
    const cx = head - 820; crumbWalk(c, cx, antY(cx), 66, t, { yaw: .8, name: talkAt(t, 'crumb') ? 'excited' : 'happy', look: [.7, -.2], arms: talkAt(t, 'crumb') ? POINT_ARMS : null });
    dotAt(c, head - 1010, GY + 20, 72, t, { look: [.7, -.2], lift: .05 * Math.abs(Math.sin(t * 5)) });
    blinkN(c, head - 1160, GY - 200 + 14 * Math.sin(t * 2.4), 52, t, { fly: 1, glow: .9 });
    waggleAt(c, head - 1300, 640 + 10 * Math.sin(t * 3), 50, t, { yaw: .7 });
    // chiếc lá cong làm mái vòm: vẽ sau cùng để kiến chui dưới lá
    bigLeaf(c, MARCH.leaf, GY - 120, 1.3, Math.PI + .05, C.leaf);
    capsule(c, MARCH.leaf - 200, GY - 110, MARCH.leaf - 230, GY + 50, 10, C.leafD); capsule(c, MARCH.leaf + 200, GY - 110, MARCH.leaf + 230, GY + 50, 10, C.leafD);
  });
  // chữ chỉ đường nhỏ theo từng nhịp
  [['UNDER!', L0('crumb', 'under the leaf...'), 620, C.lemon], ['OVER!', L0('crumb', 'over the pebble!'), 1340, C.cream]].forEach(([s, t0, x, col]) => { if (t > t0) big(c, s, x, 240, 110, col, C.berry, t, t0); });
}
// cỏ cao như bức tường ở rìa vườn
function grassWall(c, t, x0, x1, y = GY + 60, hgt = 520) { for (let x = x0, i = 0; x < x1; x += 46, i++) { const h = hgt * (.75 + .35 * hash(i + 77)), sw = Math.sin(t * 1.2 + i * .7) * 14; inked(c, cc => { cc.moveTo(x - 22, y); cc.quadraticCurveTo(x + sw, y - h * .6, x + sw * 2 + 8, y - h); cc.quadraticCurveTo(x + 8, y - h * .5, x + 22, y); cc.closePath(); }, i % 2 ? N.tall : N.tallD, 4); } }
export function sEdge0(c, t) {
  const k = drift({ cx: 900, cy: 600, z: 1.12 }, t, .6);
  skyBg(c, t, k);
  cam(c, k, () => {
    garden(c, t, { tufts: 8, seed: 9, path: false, house: false });
    pebble(c, 1500, GY + 30, 1.6, N.stoneD); pebble(c, 1750, GY + 10, 1.2);
    grassWall(c, t, 1280, 2700, GY + 40, 560);
    const bye = seg(t, H.antsBye, H.antsBye + 2.2);
    for (let i = 0; i < 6; i++) { const x = lerp(1180 - i * 110, 300 - i * 110, eo(clamp(bye * 1.2 - i * .03))); workerAnt(c, x, GY + 46, 62, bye > 0 ? t * 2 + i : 0, { dir: bye > 0 ? -1 : 1, tap: bye > 0 ? 0 : .5 + .5 * Math.sin(t * 6 + i) }); }
    if (bye > 0 && bye < .6) popText(c, 'bye!', 1000, GY - 110, 50, C.cream, C.grape, -1, 0, { font: subFont, read: false });
    rolloAt(c, 420, GY + 10, 90, t, 0, { yaw: -1.3, look: [.7, -.3] });
    dotAt(c, 640, GY + 20, 78, t, { look: [.7, -.3] });
    blinkN(c, 520, GY - 210 + 12 * Math.sin(t * 2.4), 54, t, { fly: 1, glow: .9 });
    waggleAt(c, 780, 640 + 10 * Math.sin(t * 3), 52, t, { yaw: .7 });
    crumbAt(c, 900, GY + 14, 72, { E: crumbE('curious', t, { look: [.7, -.4] }), yaw: .7, arms: talkAt(t, 'crumb') ? POINT_ARMS : null });
  });
  const e = L0('crumb', 'The trail ends here!'); if (t > e && t < e + 2.5) big(c, 'THE END?', 1300, 260, 120, C.lemon, C.berry, t, e);
}

/* ================= CÁCH 3 · bóng nghĩ: kiến sa mạc giữ số bước để đi thẳng về tổ ================= */
export function sThink(c, t) {
  const k = drift({ cx: 820, cy: 640, z: 1.6 }, t, .5);
  skyBg(c, t, k);
  cam(c, k, () => {
    garden(c, t, { tufts: 6, seed: 9, path: false, house: false }); grassWall(c, t, 1100, 2500, GY + 40, 560);
    crumbAt(c, 700, GY + 14, 92, { E: crumbE(talkAt(t, 'crumb') ? 'talk' : 'curious', t, { look: [.5, -.8] }), yaw: .5, q: 1, arms: { armL: [-.32, -2.5, .25], armR: [.45, -2.75, .55] } });
  });
  const p = seg(t, H.thinkPop, H.thinkPop + .6);
  thoughtBubble(c, 1260, 380, 300, p, [880, 500]);
  if (p > .5) { c.save(); c.beginPath(); c.ellipse(1260, 380, 280, 220, 0, 0, TAU); c.clip(); c.translate(1260, 380); c.scale(.3, .3); c.translate(-960, -600); desertScene(c, t); desertAnt(c, NEST.x + 60, NEST.y, 120, t * 2); c.restore(); }
}
// vị trí kiến sa mạc theo thời gian: đi ngoằn ngoèo ra (dOut), nhặt hạt (dSeed), đi thẳng về (dHome)
const SEED = OUTWARD[OUTWARD.length - 1];
function desertAntPos(t) {
  if (t < H.dSeed) { const u = seg(t, H.dOut, H.dSeed) * (OUTWARD.length - 1), i = Math.min(OUTWARD.length - 2, Math.floor(u)), f = u - i; return { p: [lerp(OUTWARD[i][0], OUTWARD[i + 1][0], f), lerp(OUTWARD[i][1], OUTWARD[i + 1][1], f)], dir: 1, walk: u < OUTWARD.length - 1 }; }
  if (t < H.dHome) return { p: SEED, dir: 1, walk: false };
  const u = ss(seg(t, H.dHome, H.dHome + 3.2)); return { p: [lerp(SEED[0], NEST.x + 40, u), lerp(SEED[1], NEST.y, u)], dir: -1, walk: u < 1, home: u };
}
export function sDesert(c, t) {
  const k = drift({ cx: 920, cy: 600, z: 1.0 }, t, .4);
  cam(c, k, () => {
    desertScene(c, t, { path: cc => {
      // vệt đi ra ngoằn ngoèo (chấm mờ) và đường về thẳng tắp (vạch bước sáng dần)
      cc.setLineDash([6, 22]); cc.lineWidth = 8; cc.lineCap = 'round'; cc.strokeStyle = 'rgba(184,101,43,.55)'; cc.beginPath(); OUTWARD.forEach((p, i) => i ? cc.lineTo(p[0], p[1]) : cc.moveTo(p[0], p[1])); cc.stroke(); cc.setLineDash([]);
      const s = desertAntPos(t);
      if (s.home > 0) { const n = 12; for (let i = 0; i < n * s.home; i++) { const f = i / n; const x = lerp(SEED[0], NEST.x + 40, f), y = lerp(SEED[1], NEST.y, f); capsule(cc, x - 10, y - 14, x + 10, y + 14, 8, C.lemon); } }
    } });
    const s = desertAntPos(t), seedHeld = t > H.dSeed;
    if (!seedHeld) { inked(c, cc => cc.ellipse(SEED[0] + 30, SEED[1] - 10, 18, 12, .3, 0, TAU), C.honeyL, 4); }
    desertAnt(c, s.p[0], s.p[1], 150, s.walk ? t * 2.6 : 0, { dir: s.dir });
    if (seedHeld) inked(c, cc => cc.ellipse(s.p[0] + s.dir * 140, s.p[1] - 175, 22, 14, .3, 0, TAU), C.honeyL, 4);
    if (s.home >= 1) sparkles(c, NEST.x, NEST.y - 40, 120, seg(t, H.dHome + 3.2, H.dHome + 3.9), 8, C.berry, 20);
  });
  // viền bóng nghĩ ở mép khung, Crumb (người kể) ló ở góc trái dưới, Dot ló ở góc phải khi nói
  c.save(); c.lineWidth = 60; c.strokeStyle = C.cream; c.beginPath(); for (let i = 0; i < 26; i++) { const a = i * TAU / 26; c.moveTo(960 + Math.cos(a) * 1180 + 140, 540 + Math.sin(a) * 760); c.arc(960 + Math.cos(a) * 1180, 540 + Math.sin(a) * 760, 140, 0, TAU); } c.stroke(); c.restore();
  crumbAt(c, 190, 1160, 120, { E: crumbE(talkAt(t, 'crumb') ? 'talk' : 'happy', t, { look: [.7, -.6] }), yaw: .6, arms: UP_ARMS });
  const ds = L0('dot', 'I count steps too!'); if (t > ds - .4) { const u = eo(seg(t, ds - .4, ds)); dotAt(c, lerp(2100, 1760, u), 1075, 140, t, { yaw: -.4, look: [-.6, -.5], name: 'excited', legsUp: talkAt(t, 'dot') ? DOT_COUNT : null }); }
  if (t > L0('crumb', 'Out... and straight back home!') + .4 && t < H.s_count) { const s = desertAntPos(t); if (s.home > .2) big(c, 'STRAIGHT HOME!', 960, 200, 110, C.berry, C.cream, t, H.dHome + .6); }
}
// Dot đếm bước khi cả đội bước vào bãi cỏ cao
export function sCount(c, t) {
  const [a1, b1] = Ld('dot', 'One, two, three, four, five...'), [a2, b2] = Ld('dot', 'six, seven, eight, nine, ten!');
  const ts = [...countTimes(a1, b1, 5), ...countTimes(a2, b2, 5)], n = ts.filter(x => t >= x).length;
  const dx = 640 + n * 120 + (n < 10 ? 120 * ss(clamp((t - (ts[n - 1] ?? a1)) / .35)) : 0);
  const k = drift({ cx: lerp(900, 1700, seg(t, H.s_count, b2)), cy: 640, z: 1.2 }, t, .5);
  skyBg(c, t, k, { par: .1 });
  cam(c, k, () => {
    garden(c, t, { x0: -400, x1: 3800, tufts: 30, seed: 10, path: false, house: false });
    for (let i = 0; i < 10; i++) { const x = 760 + i * 120; if (t >= ts[i]) { ell(c, x, GY + 50, 26, 12, 0, 'rgba(30,27,58,.3)'); countPop(c, i + 1, x, GY - 150, t, ts[i], { r: 32 }); } }
    rolloAt(c, dx - 760, GY + 10, 84, t, dx, { yaw: -1.3, look: [.6, -.2] });
    waggleAt(c, dx - 600, 650 + 10 * Math.sin(t * 3), 50, t, { yaw: .7 });
    blinkN(c, dx - 470, GY - 200 + 12 * Math.sin(t * 2.4), 52, t, { fly: 1, glow: .9 });
    crumbWalk(c, dx - 300, GY + 14, 66, t, { yaw: .8, name: talkAt(t, 'crumb') ? 'excited' : 'happy', look: [.7, -.3] });
    dotAt(c, dx, GY + 20, 84, t, { look: [.7, -.3], name: talkAt(t, 'dot') ? 'talk' : 'happy', lift: .06 * Math.abs(Math.sin(t * 6)), legsUp: talkAt(t, 'dot') ? DOT_COUNT : null });
    grassWall(c, t, -400, 3800, 1140, 300);                         // cỏ cao phía trước (tiền cảnh)
  });
  const tt = L0('dot', 'Ten steps from the trail!'); if (t > tt) big(c, '10 STEPS!', 960, 250, 140, C.lemon, C.berry, t, tt);
}

/* ================= Miss Loupe lần 2: nhìn xa không rõ (gài trước Uncle Telly) ================= */
export function sLp2(c, t) {
  const k = drift({ cx: CRACK.x + 140, cy: 430, z: 1.5 }, t, .5);
  skyBg(c, t, k);
  const far = hold(t, H.lp2, L0('loupe', 'I wish cousin Telly were here!'), .5, .4);
  cam(c, k, () => {
    edgeWorld(c, t, { post: true });
    const hint = H.tellyHint; if (t > hint) { const p = pulse(t, hint, .5); if (p > 0) star(c, 1900, 120, 30 * p, C.lemon); }
    loupeStuck(c, t, { tilt: .28 - .35 * far, look: far > .5 ? [.6, -.8] : [.3, -.4], name: far > .5 ? 'curious' : 'happy', pose: far > .5 ? ARM.peer : ARM.shrug,
      inside: far > .3 ? cc => { cc.fillStyle = N.sky1; cc.fillRect(CRACK.x - 600, -400, 1400, 1300); for (let i = 0; i < 10; i++) circle(cc, CRACK.x - 200 + hash(i) * 600, 0 + hash(i + 1) * 500, 30 + 20 * hash(i + 2), 'rgba(255,248,231,.35)'); } : null });
  });
  if (far > .5) big(c, 'BLURRY!', 760, 230, 100, C.cream, C.grape, t, H.lp2 + .5);
}

/* ================= CÁCH 4 · Rollo và Dải Ngân Hà ================= */
const ROLLO_BALL = { x: 980, R: 70 };
export function sStars(c, t) {
  const k = drift({ cx: 980, cy: 640, z: 1.3 }, t, .6);
  skyBg(c, t, k);
  cam(c, k, () => {
    garden(c, t, { tufts: 6, seed: 11, path: false, house: false, fence: false });
    grassWall(c, t, -500, 560, GY + 40, 600); grassWall(c, t, 1420, 2500, GY + 40, 600);
    rolloClimb(c, t);
    const look = Math.sin(t * 2.5);
    crumbAt(c, 1260, GY + 14, 72, { E: crumbE('curious', t, { look: talkAt(t, 'crumb') ? [look, -.3] : [-.7, -.4] }), yaw: talkAt(t, 'crumb') ? look * .8 : -.6, q: hold(t, H.s_stars, L0('rollo', 'Leave that to me.')) });
    dotAt(c, 700, GY + 20, 76, t, { look: [.3, -.5] });
    blinkN(c, 1180, 580 + 12 * Math.sin(t * 2.4), 54, t, { fly: 1, glow: .9, look: [-.5, .3] });
    waggleAt(c, 600, 620 + 10 * Math.sin(t * 3), 50, t, { yaw: .7, look: [.5, -.2] });
  });
}
// Rollo trèo lên đỉnh viên tròn, xoay một vòng, ngước nhìn trời
function rolloClimb(c, t, o = {}) {
  const B = ROLLO_BALL, by = GY - B.R + 10, u = eo(seg(t, H.climb, H.climb + .8)), spin = seg(t, H.climb + .8, H.climb + 1.6);
  ballProp(c, B.x, by, B.R, 0);
  const x = lerp(B.x - 150, B.x, u), y = lerp(GY + 10, by - B.R + 4, u) - Math.sin(Math.PI * u) * 40;
  rolloAt(c, x, y, o.k || 84, t, 0, { yaw: u < 1 ? -1.3 : -1.3 + spin * TAU * (spin < 1 ? 1 : 0), showBall: false, look: u >= 1 ? [0, -1] : [.6, -.3], name: talkAt(t, 'rollo') ? 'talk' : 'happy' });
}
export function sSky(c, t) {
  // góc máy thấp nhìn ngửa: mặt đất tụt xuống đáy khung, bầu trời mở ra; Dải Ngân Hà to dần và sáng lên chéo khung
  const u = ei(seg(t, H.crane, H.crane + 2.4)), gy = lerp(560, 890, u);
  c.fillStyle = N.sky1; c.fillRect(0, 0, 1920, 1080);
  c.save(); c.translate(960, 540); c.scale(lerp(1.35, 1.0, u), lerp(1.35, 1.0, u)); c.translate(-960, -540 + lerp(260, 0, u));
  starSky(c, t, { x0: -600, x1: 2600, y0: -600, y1: 1500, band: .6 + .7 * u }); c.restore();
  for (let i = 0; i < 3; i++) { const p = (t * .35 + i / 3) % 1; star(c, lerp(300, 1700, (i * .37 + .2) % 1), lerp(120, 420, (i * .53) % 1), 18 * Math.sin(Math.PI * p), C.cream); }
  // mặt đất và cỏ cao viền hai bên (khung hình như nhìn từ dưới chân cỏ)
  c.fillStyle = N.hillD; c.fillRect(0, gy - 40, 1920, 1200); ell(c, 500, gy - 30, 700, 90, 0, N.hill); ell(c, 1500, gy - 20, 640, 80, 0, N.hill);
  c.fillStyle = N.grass; c.fillRect(0, gy + 40, 1920, 1200);
  grassWall(c, t, -60, 380, 1120, 900); grassWall(c, t, 1560, 2000, 1120, 900);
  // Rollo đứng trên viên tròn, ngước nhìn; Crumb bên cạnh
  ballProp(c, 900, gy + 30, 78, 0);
  rolloAt(c, 900, gy - 44, 96, t, 0, { yaw: -.4, showBall: false, look: [0, -1], name: talkAt(t, 'rollo') ? 'talk' : 'happy' });
  crumbAt(c, 1180, gy + 110, 92, { E: crumbE(talkAt(t, 'crumb') ? 'excited' : 'happy', t, { look: [-.2, -.95] }), yaw: -.3, arms: UP_ARMS });
  if (u > .7) { const lp = back(seg(t, H.crane + 1.6, H.crane + 2.0), 2); c.save(); c.translate(1300, 240); c.rotate(-.33); c.scale(lp, lp); popText(c, 'MILKY WAY', 0, 0, 100, C.lemon, C.grape, -1, 0); c.restore(); }
  const rv = L0('crumb', 'Wow... a river of stars!'); if (t > rv + .3) big(c, 'A RIVER OF STARS!', 560, 300, 84, C.cream, C.grape, t, rv + .3, { font: subFont });
}
// nhìn thẳng từ trên xuống: vệt lăn thẳng → mây che → ngoằn ngoèo → mây qua → thẳng lại
const TX0 = 180, TY = 560;
const cover = t => hold(t, H.clouds, H.clear + 1.2, 1.2, 1.0);
const trackX = t => lerp(TX0, 1800, seg(t, H.straight, H.clear + 3.0));
function trackY(x, t) {
  // biên độ ngoằn ngoèo theo độ phủ mây lúc Rollo đi qua chỗ đó (ước theo thời gian ứng với x)
  const tx = lerp(H.straight, H.clear + 3.0, (x - TX0) / (1800 - TX0)), a = cover(tx);
  return TY + a * (110 * Math.sin((x - TX0) * .028) + 50 * Math.sin((x - TX0) * .071));
}
export function sTrack(c, t) {
  const k = drift({ cx: 960, cy: 540, z: 1.0 }, t, .3);
  cam(c, k, () => {
    topGrass(c, t);
    const hx = trackX(t), pts = []; for (let x = TX0; x <= hx; x += 8) pts.push([x, trackY(x, t)]);
    trackLine(c, pts, 34);
    // nhân vật nhìn nghiêng nhỏ, chạy theo vệt (quy ước "bàn cờ" cho trẻ dễ đọc)
    const at = (lag) => { const x = Math.max(TX0 - 300, hx - lag); return [x, x < TX0 ? TY : trackY(x, t)]; };
    const fol = [['waggle', 640], ['blink', 520], ['dot', 400], ['crumb', 270]];
    fol.forEach(([id, lag]) => { const [x, y] = at(lag);
      if (id === 'crumb') crumbWalk(c, x, y + 30, 60, t, { yaw: .8, name: talkAt(t, 'crumb') ? 'excited' : 'happy' });
      if (id === 'dot') dotAt(c, x, y + 30, 72, t, { look: [.6, 0], lift: .05 * Math.abs(Math.sin(t * 6)) });
      if (id === 'blink') blinkN(c, x, y - 40, 52, t, { fly: 1, glow: .9 });
      if (id === 'waggle') waggleAt(c, x, y - 70, 48, t, { yaw: .7 }); });
    const ry = trackY(hx, t), ry2 = trackY(hx + 8, t), ang = Math.atan2(ry2 - ry, 8);
    rolloAt(c, hx - 80, ry + 34, 80, t, hx, { yaw: -1.4, look: cover(t) > .4 ? [Math.sin(t * 4) * .6, -.6] : [0, -.8], name: talkAt(t, 'rollo') ? 'talk' : cover(t) > .4 ? 'curious' : 'happy' });
    // bóng mây trôi ngang mặt đất
    const cv = cover(t); if (cv > 0) { cloudShadow(c, lerp(-700, 2600, seg(t, H.clouds - .5, H.clear + 2.2)), 420, 1.4); cloudShadow(c, lerp(-1300, 2300, seg(t, H.clouds - .5, H.clear + 2.2)), 760, 1.2); }
  });
  // ô trời nhỏ (góc phải trên): Dải Ngân Hà, mây che rồi tan
  const R = 170, x = 1700, y = 220;
  c.save(); c.beginPath(); c.arc(x, y, R, 0, TAU); c.clip(); c.translate(x - 960 * .35, y - 300 * .35); c.scale(.35, .35); starSky(c, t, { x0: -800, x1: 2800, y0: -600, y1: 1200, cloud: cover(t), cx: 0 }); c.restore();
  c.lineWidth = 14; c.strokeStyle = C.cream; c.beginPath(); c.arc(x, y, R + 7, 0, TAU); c.stroke(); c.lineWidth = 5; c.strokeStyle = C.ink; c.beginPath(); c.arc(x, y, R + 15, 0, TAU); c.stroke();
  popText(c, 'SKY', x, y + R + 52, 38, C.cream, null, -1, 0, { font: subFont, read: false });
  const ss1 = L0('dot', 'So straight!'); if (t > ss1 && t < H.clouds + .5) big(c, 'STRAIGHT!', 760, 210, 120, C.lemon, C.berry, t, ss1);
  const w = L0('crumb', 'Rollo is rolling in wiggles!'); if (t > w && t < H.clear + .4) big(c, 'WIGGLES!', 760, 210, 130, C.pink, C.grape, t, w, { wob: true });
}

/* ================= CÁCH 5 · Uncle Telly trên cọc hàng rào, nhìn qua ống nhòm, ánh lóe, mật mã của Blink ================= */
const POST = { x: 1660, y: HZ + 120, h: 520 };
function tellyOnPost(c, t, o = {}) {
  fencePost(c, POST.x, POST.y, POST.h);
  tellyAt(c, POST.x, POST.y - POST.h - 34, o.k || 64, t, { pitch: o.pitch ?? .25 * Math.sin(t * 1.3), glint: o.glint || 0, look: o.look || [-.5, .2], name: o.name || 'happy', yaw: o.yaw ?? -.4 });
  const g = o.glint || 0; if (g > .05) { for (let i = 3; i > 0; i--) circle(c, POST.x - 50, POST.y - POST.h - 34 - 3.5 * (o.k || 64), 40 * i * g, `rgba(255,248,231,${.12 * g})`); }
}
const flashAt = (t, ts, d = .35) => Math.max(0, ...ts.map(t0 => pulse(t, t0, d)));
export function sTelly(c, t) {
  const k = drift({ cx: POST.x - 420, cy: 360, z: .78 }, t, .4);   // Mùa 1: Uncle Telly chỉ xuất hiện từ xa (DE-CUONG §2.2)
  skyBg(c, t, k);
  cam(c, k, () => { c.fillStyle = N.grassN; c.fillRect(-800, HZ + 60, 4000, 2000); grassWall(c, t, 600, 2600, HZ + 260, 300); tellyOnPost(c, t, { pitch: .2 + .2 * Math.sin((t - H.tellyLook) * 2), look: [-.6, .3] }); });
}
export function sBino(c, t) {
  if (t < H.tellyFlash) {
    binoMask(c, t, 1, cc => { const k = { cx: CRACK.x + 30, cy: 540 + 40 * Math.sin((t - H.binoFind) * 1.5) * (1 - ss(seg(t, H.binoFind, H.binoFind + .8))), z: 1.5 };
      skyBg(cc, t, k); cam(cc, k, () => { edgeWorld(cc, t, { post: false }); loupeStuck(cc, t, { pose: ARM.wave, name: talkAt(t, 'loupe') ? 'excited' : 'happy', look: [-.2, -.5] }); }); });
    return;
  }
  // Uncle Telly nháy tròng kính ba lần (chậm, ≤ 2 lần/giây)
  const g = flashAt(t, [H.tellyFlash + .1, H.tellyFlash + .7, H.tellyFlash + 1.3]);
  const k = drift({ cx: POST.x - 380, cy: 330, z: .82 }, t, .4);
  skyBg(c, t, k);
  cam(c, k, () => { c.fillStyle = N.grassN; c.fillRect(-800, HZ + 60, 4000, 2000); grassWall(c, t, 600, 2600, HZ + 260, 300); tellyOnPost(c, t, { pitch: .05, glint: g, look: [-.7, .4], name: 'excited' }); });
}
export function sSignal(c, t) {
  const far = [H.s_signal + .15, H.s_signal + .75, H.s_signal + 1.35, ...countTimes(...Ld('dot', 'One, two, three flashes!'), 3)];
  const ans = [H.tellyAns + .1, H.tellyAns + .6, H.tellyAns + 1.1];
  const [b0, b1] = Ld('blink', 'Blink! Blink! Blink!'), bt = countTimes(b0, b1 + .2, 3);
  const k = drift({ cx: 900, cy: 560, z: 1.15 }, t, .5);
  skyBg(c, t, k);
  cam(c, k, () => {
    garden(c, t, { tufts: 8, seed: 12, path: false, house: false, fence: false });
    grassWall(c, t, 1150, 2600, GY + 40, 360);
    // cọc hàng rào xa xa, ánh lóe nhỏ
    const fx = 1650, fy = 330; rrect(c, fx - 10, fy, 20, HZ + 140 - fy, 6, N.woodD);
    const g = flashAt(t, far) + flashAt(t, ans);
    if (g > 0) { circle(c, fx, fy - 10, 60 * g, 'rgba(255,248,231,.35)'); star(c, fx, fy - 10, 34 * g, C.cream); } else circle(c, fx, fy - 10, 6, C.leaf);
    // Uncle Telly chỉ chỗ: vệt sáng chấm từ cọc xuống bãi cỏ
    const beam = seg(t, H.tellyAns + 1.2, H.tellyAns + 2.0); if (beam > 0) { c.setLineDash([14, 14]); c.lineDashOffset = -t * 60; c.lineWidth = 8; c.strokeStyle = 'rgba(255,227,77,.9)'; c.beginPath(); c.moveTo(fx, fy); c.lineTo(lerp(fx, 1900, beam), lerp(fy, GY - 40, beam)); c.stroke(); c.setLineDash([]); }
    dotAt(c, 620, GY + 20, 80, t, { look: [.7, -.6], legsUp: talkAt(t, 'dot') ? DOT_COUNT : null });
    for (let i = 0; i < 3; i++) countPop(c, i + 1, 1480 + i * 120, 180, t, far[3 + i], { r: 34, life: 1.8 });
    rolloAt(c, 380, GY + 10, 86, t, 0, { yaw: -1.3, look: [.7, -.6] });
    waggleAt(c, 500, 600 + 10 * Math.sin(t * 3), 50, t, { yaw: .7, look: [.7, -.4] });
    const bg = Math.max(.35, flashAt(t, bt, .4));
    blinkN(c, 1040, 560 + 10 * Math.sin(t * 2), 70, t, { fly: 1, glow: bg, look: [.7, -.6], name: talkAt(t, 'blink') ? 'excited' : 'happy', tailUp: bg > .5 ? .6 : 0 });
    const go = L0('crumb', 'She\'s over there! Let\'s go!');
    crumbAt(c, 820, GY + 14, 72, { E: crumbE('excited', t, { look: [.7, -.6] }), yaw: .7, arms: talkAt(t, 'crumb') || t > go ? POINT_ARMS : UP_ARMS, hop: .15 * pulse(t, go, .4) });
  });
  if (t > b0 - .1 && t < H.tellyAns + 1.8) big(c, 'BLINK! BLINK! BLINK!', 960, 220, 90, C.lemon, C.grape, t, b0, { font: subFont });
}

/* ================= CAO TRÀO · rìa vườn: Crumb tự tìm ra, The Giant giúp ================= */
const TEAM_E = { crumb: 980, dot: 800, blink: 640, waggle: 520, rollo: 330 };
export function sEdge(c, t) {
  const th = H.thump, sh = shake(t, th, .5, 14), shade = hold(t, th, H.lift + .8, .4, .6);
  const k0 = drift(camPath(t, [[H.s_edge, { cx: 720, cy: 560, z: 1.25 }], [H.sparkle, { cx: 1020, cy: 520, z: 1.35 }], [th, { cx: 1000, cy: 430, z: 1.0 }], [H.hand, { cx: 1080, cy: 470, z: 1.05 }]]), t, .5);
  const k = { ...k0, cy: k0.cy + sh };
  skyBg(c, t, k);
  cam(c, k, () => {
    edgeWorld(c, t, { post: false });
    // Miss Loupe trong khe; bật ra khi ngón tay The Giant nghiêng phiến đá, đứng lên ngón tay, được nâng lên
    const pop = seg(t, H.hand + .9, H.hand + 1.4), lift = ei(seg(t, H.lift, H.lift + 1.0));
    const hx = lerp(2300, 1200, eo(seg(t, H.hand, H.hand + .9))) + lift * 300, hy = ON_STONE - 40 - lift * 700;
    if (pop <= 0) loupeStuck(c, t, { name: talkAt(t, 'loupe') ? 'excited' : t > th ? 'surprised' : 'happy', pose: t > H.sparkle ? ARM.wave : ARM.peer, look: [-.6, -.2], wob: t > H.pull && t < th ? .06 * Math.sin(t * 9) : 0 });
    else { const sx = CRACK.x + 30, sy = CRACK.y - 80, ex = hx + 124, ey = hy + 50, x = lerp(sx, ex, eo(pop)), y = lerp(sy, ey, eo(pop)) - Math.sin(Math.PI * pop) * 160;
      loupeN(c, x, lpY(y, 64), 64, t, { name: 'excited', pose: ARM.up, look: [-.5, .3], rot: (1 - pop) * .3 }); }
    // bàn tay The Giant: vào từ phải, ngón chỉ sang trái, lòng bàn tay ngửa; cổ tay luôn ngoài khung
    if (t > H.hand) giantHand(c, hx + 520, hy + 170, 120, { lean: -Math.PI / 2 + .12 - .1 * pulse(t, H.hand + .8, .5), gesture: 'soft', rot: [0, 0, 0] });
    // cả đội: đi tới, soi kỹ; nối thành chuỗi kéo; ngước nhìn bóng lớn
    const arrive = eo(seg(t, H.s_edge, H.s_edge + 1.6)), pull = hold(t, H.pull, th + .2, .3, .2), heave = pull * Math.sin((t - H.pull) * 7) * .08;
    const X = id => lerp(TEAM_E[id] - 500, TEAM_E[id], arrive) + (pull > 0 && id !== 'crumb' ? (TEAM_E.crumb - TEAM_E[id]) * .35 * pull : 0) + (id === 'crumb' ? 40 * pull : 0);
    const up = t > th, lk = up ? [.3, -.9] : [.7, -.2];
    rolloAt(c, X('rollo'), ON_STONE + 10, 84, t, X('rollo'), { yaw: -1.3, look: up ? [.4, -.8] : [.7, -.3], name: talkAt(t, 'rollo') ? 'talk' : up ? 'surprised' : 'happy' });
    waggleAt(c, X('waggle'), ON_STONE - 220 + 10 * Math.sin(t * 3), 50, t, { yaw: .7, look: lk, lean: heave });
    blinkN(c, X('blink'), ON_STONE + 12, 58, t, { glow: .95, look: lk, lean: -heave, name: up && t < H.hand ? 'surprised' : 'happy' });
    dotAt(c, X('dot'), ON_STONE + 18, 76, t, { look: lk, name: talkAt(t, 'dot') ? 'excited' : up && t < H.hand ? 'surprised' : 'happy' });
    const lc = t < H.sparkle ? [Math.sin(t * 2.2), .4] : lk;
    crumbAt(c, X('crumb'), ON_STONE + 14, 74, { E: crumbE(talkAt(t, 'crumb') ? 'excited' : up && t < H.hand ? 'surprised' : 'curious', t, { look: lc }), yaw: t < H.sparkle ? Math.sin(t * 2.2) * .7 : .7, lean: t < H.sparkle ? .25 : -heave * 3 - .15 * pull, arms: pull > 0 ? { armL: [.6, -1.9, .4], armR: [.9, -1.9, .3] } : t > H.sparkle ? POINT_ARMS : null, fx: up && t < th + .8 });
    if (t > H.sparkle && t < H.pull) sparkles(c, CRACK.x + 30, CRACK.y - 260, 90, seg(t, H.sparkle, H.sparkle + .8), 8, C.lemon, 22);
  });
  // bóng lớn phủ lên cả đội: mềm, không đáng sợ (màu mực trong suốt, đổ từ phải)
  if (shade > 0) { c.save(); c.globalAlpha = shade * .2; c.fillStyle = C.ink; c.fillRect(0, 0, 1920, 1080); c.globalAlpha = shade * .14; c.beginPath(); c.ellipse(1500, 300, 1000, 640, -.2, 0, TAU); c.fill(); c.restore(); }
  if (t > H.pull && t < th) big(c, 'HEAVE!', 760, 240, 110, C.lemon, C.berry, t, H.pull + .2, { font: subFont });
  if (t > th && t < th + 2.1) big(c, 'THUMP!', 1300, 200, 150, C.cream, C.grape, t, th);
  const np = L0('dot', 'Nope!'); if (t > np - .05 && t < np + 1.4) big(c, 'NOPE!', 760, 230, 170, C.berry, C.cream, t, np);
}
// góc nhìn của The Giant qua chính Miss Loupe: kính đầy khung, cả đội phóng to vẫy chào; ngón tay mũm mĩm giữ cán ở đáy khung
export const POV_LENS = { x: 960, y: 470, r: 380 };
export function sPov(c, t) {
  const L = POV_LENS, z = ss(seg(t, H.pov, H.pov + .8)), R = lerp(160, L.r, z), wave = seg(t, H.waveAll, H.waveAll + 1.6);
  // nền ngoài kính: vườn nhoè (nhìn từ trên cao, phóng to, mờ)
  c.fillStyle = N.grassD; c.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 30; i++) circle(c, hash(i) * 1920, hash(i + 9) * 1080, 60 + 60 * hash(i + 3), i % 3 ? 'rgba(60,203,146,.35)' : 'rgba(167,155,224,.35)');
  // trong kính: cả đội trên phiến đá, phóng to
  c.save(); c.beginPath(); c.arc(L.x, L.y, R, 0, TAU); c.clip();
  c.fillStyle = N.stone; c.fillRect(0, 0, 1920, 1080); for (let i = 0; i < 6; i++) ell(c, 700 + i * 120, 760 + (i % 2) * 60, 70, 20, .2, N.stoneD);
  const wv = Math.sin(t * 9) * wave * (1 - wave) * 4;
  rolloAt(c, 640, 780, 110, t, 0, { yaw: -.9, look: [.2, -.9], name: 'laugh' });
  blinkN(c, 1240, 520, 70, t, { fly: 1, glow: 1, look: [-.2, -.9], name: 'laugh' });
  waggleAt(c, 780, 420, 66, t, { yaw: .3, look: [.2, -.9], name: 'excited' });
  dotAt(c, 1120, 800, 110, t, { yaw: .1, look: [0, -.9], name: 'laugh', legsUp: wave > 0 ? [[.3, -.9 + .2 * Math.sin(t * 9), .5]] : null });
  crumbAt(c, 900, 830, 110, { E: crumbE(talkAt(t, 'crumb') ? 'excited' : 'laugh', t, { look: [0, -.9] }), yaw: .1, arms: { armL: [-.32, -2.5, .25], armR: [.7 + .15 * Math.sin(t * 9), -2.95, .3] } });
  // Spindle (chỗ trốn 3): treo ở mép kính
  spindleAt(c, 1260, 300 + 10 * Math.sin(t * 2), 40, t, { look: [-.3, -.6] });
  c.restore();
  // vành kính của Miss Loupe (đỏ quả mọng), vệt sáng; mặt cô trên cán, ngón tay The Giant ở đáy khung
  c.lineWidth = 46; c.strokeStyle = C.berry; c.beginPath(); c.arc(L.x, L.y, R + 23, 0, TAU); c.stroke(); c.lineWidth = 7; c.strokeStyle = C.ink; c.beginPath(); c.arc(L.x, L.y, R + 46, 0, TAU); c.stroke();
  c.save(); c.globalAlpha = .45; c.lineWidth = 18; c.strokeStyle = C.white; c.beginPath(); c.arc(L.x, L.y, R - 40, -2.7, -2.0); c.stroke(); c.restore();
  inked(c, cc => cc.roundRect(L.x - 70, L.y + R + 40, 140, 400, 60), C.berry, 7);
  giantHand(c, L.x - 130, 1250, 72, { lean: .45, gesture: 'curl' });
  giantHand(c, L.x + 140, 1260, 72, { lean: -.45, gesture: 'curl' });
  if (wave > 0) big(c, 'HELLO!', 1560, 200, 110, C.lemon, C.berry, t, H.waveAll);
}
export const SP_POV = { x: 1260, y: 260 };
// bàn tay đặt Miss Loupe xuống lối đi, gạt chiếc lá to mở đường về, vẫy chào rồi rời khung
export function sPlace(c, t) {
  const k = drift({ cx: 900, cy: 560, z: 1.12 }, t, .5);
  skyBg(c, t, k);
  const down = ei(seg(t, H.place, H.place + 1.2)), sweep = ei(seg(t, H.leafSweep, H.leafSweep + 1.2)), bye = seg(t, H.handBye, H.handBye + 1.4);
  cam(c, k, () => {
    edgeWorld(c, t, { post: false });
    // lối về: chiếc lá to chắn đường bị gạt sang, lộ dải đá dẫn về vườn (sao sáng trên đầu)
    if (sweep > 0) { c.save(); c.globalAlpha = sweep; for (let i = 0; i < 6; i++) star(c, 200 + i * 120, ON_STONE - 20 - (i % 2) * 30, 14, C.lemon); c.restore(); }
    bigLeaf(c, lerp(330, -200, sweep), ON_STONE - 140, 1.5, lerp(-.2, -1.1, sweep), C.leaf);
    ['rollo', 'waggle', 'blink', 'dot', 'crumb'].forEach(id => {
      const x = TEAM_E[id] - 100;
      if (id === 'rollo') rolloAt(c, x, ON_STONE + 10, 84, t, 0, { yaw: -1.3, look: [.6, -.5] });
      if (id === 'waggle') waggleAt(c, x, ON_STONE - 220 + 10 * Math.sin(t * 3), 50, t, { yaw: .7, look: [.6, -.4] });
      if (id === 'blink') blinkN(c, x, ON_STONE + 12, 58, t, { glow: .95, look: [.6, -.4] });
      if (id === 'dot') dotAt(c, x, ON_STONE + 18, 76, t, { look: [.6, -.4] });
      if (id === 'crumb') crumbAt(c, x, ON_STONE + 14, 74, { E: crumbE('excited', t, { look: [.6, -.4] }), yaw: .7, arms: WAVE_ARMS });
    });
    // 1 · bàn tay (ngón chỉ sang trái, lòng tay ngửa) chở Miss Loupe từ trên phải xuống, đặt cô cạnh cả đội rồi rút lên
    const LX = 1180, ret = ei(seg(t, H.place + 1.1, H.place + 1.6));
    const ax = lerp(2400, LX + 396, down) + ret * 900, ay = lerp(-260, ON_STONE + 120, down) - ret * 900;
    const onHand = down < 1, lx = onHand ? ax - 396 : LX, ly = onHand ? ay - 120 : ON_STONE;
    loupeN(c, lx, lpY(ly, 70), 70, t, { name: talkAt(t, 'loupe') ? 'excited' : 'happy', pose: t > L0('loupe', 'Thank you, friend!') ? ARM.wave : ARM.up, look: [.6, -.5] });
    if (ret < 1) giantHand(c, ax, ay, 120, { lean: -Math.PI / 2 + .08, gesture: 'soft' });
    // 2 · bàn tay thò xuống từ trên (ngón chúc xuống), gạt chiếc lá sang trái rồi rút lên
    const sIn = ei(seg(t, H.leafSweep - .3, H.leafSweep + .1)), sOut = ei(seg(t, H.leafSweep + 1.1, H.leafSweep + 1.5));
    if (sIn > 0 && sOut < 1) giantHand(c, lerp(560, 120, sweep), lerp(-700, -60, sIn) - sOut * 800, 120, { lean: Math.PI - .25 * sweep, gesture: 'open' });
    // 3 · vẫy chào từ góc phải dưới rồi rời khung
    if (bye > 0) giantHand(c, lerp(1700, 2000, ei(seg(bye, .6, 1))), lerp(1500, ON_STONE + 520, ei(seg(bye, 0, .3))) + ei(seg(bye, .6, 1)) * 700, 120, { lean: -.2 + .25 * Math.sin(t * 8), gesture: 'wave' });
  });
}
// "Crumb, you looked closely... all by yourself!" — "Can I hold the lens... NOW?" — "Yes! NOW!"
export function sFound(c, t) {
  const k = drift({ cx: 980, cy: 520, z: 1.7 }, t, .4);
  skyBg(c, t, k);
  const hd = eo(seg(t, H.hold, H.hold + .7));
  cam(c, k, () => {
    edgeWorld(c, t, { post: false });
    const lx = 1060, ly = lpY(ON_STONE, 82);
    loupeN(c, lx, ly, 82, t, { name: talkAt(t, 'loupe') ? 'excited' : t > H.hold ? 'laugh' : 'happy', look: [-.6, .3], pose: t > H.hold ? ARM.up : ARM.point, rot: -.1 + .06 * hd,
      inside: hd > .3 ? cc => { cc.fillStyle = N.sky2; cc.fillRect(lx - 300, ly - 300, 600, 600); crumbAt(cc, lx - 10, ly + 210, 115, { E: crumbE('excited', t, { look: [0, 0] }), yaw: 0, arms: HUG_ARMS }); } : null });
    const q = L0('crumb', 'Can I hold the lens... NOW?');
    crumbAt(c, lerp(820, 1000, hd), ON_STONE + 14, 80, { E: crumbE(t > q - .1 && t < H.hold ? 'hopeful' : 'excited', t, { look: [.6, -.6] }), yaw: lerp(.7, .2, hd), arms: hd > .2 ? HUG_ARMS : t > q ? UP_ARMS : null, hop: .2 * pulse(t, L0('loupe', 'Yes! NOW!') + .3, .4) });
  });
  if (t > L0('loupe', 'Yes! NOW!')) big(c, 'NOW!', 1480, 260, 160, C.lemon, C.berry, t, L0('loupe', 'Yes! NOW!'));
}

/* ================= ĐƯỜNG VỀ · ôn bài (trẻ trả lời) ================= */
const QUIZ = [['crumb', 'Smell trails!', 'trail'], ['rollo', 'The stars!', 'stars'], ['dot', 'The sun!', 'sun']];
export function quizIcon(c, id, x, y, r, t) {
  inked(c, cc => cc.arc(x, y, r, 0, TAU), { sun: C.skyL, stars: C.night, trail: C.mintL, steps: C.cream, flash: C.grape }[id], Math.max(4, r * .07));
  if (id === 'trail') { for (let i = 0; i < 5; i++) circle(c, x - r * .6 + i * r * .3, y + Math.sin(i) * r * .2, r * .1, C.pink); workerAnt(c, x + r * .15, y + r * .45, r * .55, t * 2, {}); }
  if (id === 'stars') { for (let i = 0; i < 7; i++) star(c, x + Math.cos(i * 2.4) * r * .55, y + Math.sin(i * 2.4) * r * .55, r * .16, C.cream); ell(c, x, y, r * .8, r * .25, -.4, 'rgba(255,248,231,.3)'); }
  if (id === 'steps') { for (let i = 0; i < 4; i++) ell(c, x - r * .45 + i * r * .3, y + (i % 2 ? -r * .18 : r * .18), r * .12, r * .08, 0, C.ink); popText(c, '10', x, y + r * .62, r * .5, C.berry, null, -1, 0, { font: subFont, read: false }); }
  if (id === 'flash') { circle(c, x, y, r * .5, 'rgba(255,227,77,.5)'); star(c, x, y, r * .45, C.lemon); }
  if (id === 'sun') { for (let i = 0; i < 10; i++) { const a = i * TAU / 10; capsule(c, x + Math.cos(a) * r * .45, y + Math.sin(a) * r * .45, x + Math.cos(a) * r * .7, y + Math.sin(a) * r * .7, r * .1, C.mango); } circle(c, x, y, r * .38, C.lemon); }
}
export function sWay(c, t) {
  const head = lerp(1500, 600, seg(t, H.s_way, H.s_home));
  const k = drift({ cx: head + 120, cy: 600, z: 1.15 }, t, .4);
  skyBg(c, t, k, { par: .1 });
  cam(c, k, () => {
    garden(c, t, { x0: -800, x1: 3200, tufts: 20, seed: 14 });
    // về nhà: đi sang trái, Crumb ôm kính đi đầu cạnh Miss Loupe
    loupeN(c, head - 40, lpY(GY + 10, 66) - 10 * Math.abs(Math.sin(t * 4)), 66, t, { name: talkAt(t, 'loupe') ? 'explaining' : 'happy', look: [.6, -.2], pose: ARM.point, rot: .05 });
    crumbWalk(c, head + 140, GY + 14, 66, t, { yaw: -.8, name: talkAt(t, 'crumb') ? 'excited' : 'happy', look: [-.6, -.3], arms: HUG_ARMS });
    dotAt(c, head + 300, GY + 20, 76, t, { yaw: -.4, look: [-.6, -.2], lift: .05 * Math.abs(Math.sin(t * 6)) });
    blinkN(c, head + 430, GY - 200 + 12 * Math.sin(t * 2.4), 52, t, { fly: 1, glow: .9, yaw: -.6 });
    waggleAt(c, head + 560, 640 + 10 * Math.sin(t * 3), 50, t, { yaw: -.7 });
    rolloAt(c, head + 740, GY + 10, 86, t, head, { yaw: 1.4, look: [-.6, -.3] });
  });
  QUIZ.forEach(([who, text, id], i) => { const t0 = L0(who, text); if (t < t0 - .05) return; const p = back(seg(t, t0 - .05, t0 + .25), 2); c.save(); c.translate(560 + i * 400, 210); c.scale(p, p); quizIcon(c, id, 0, 0, 110, t); c.restore(); });
}

/* ================= VỀ NHÀ · bản đồ sáng lên ================= */
export function sHome(c, t) {
  const k = drift({ cx: 760, cy: 640, z: 1.2 }, t, .5);
  skyBg(c, t, k);
  cam(c, k, () => {
    garden(c, t, { home: [AL.x + 20, GY], tufts: 14, seed: 1 });
    albieN(c, AL.x, AL.y, AL.k, t, { name: 'excited', yaw: .35, look: [.8, -.1], tabsUp: .4 + .5 * Math.abs(Math.sin(t * 5)), hop: .3 * Math.abs(Math.sin((t - H.albieHop) * 5)) * (1 - seg(t, H.albieHop + 1.6, H.albieHop + 2.4)) });
    crewLine(c, H.lineUp + 2, { glow: 1 });
    loupeN(c, 1450, lpY(GY + 10, 70), 70, t, { name: 'laugh', look: [-.7, -.2], pose: ARM.up });
  });
}
export function sGlow(c, t) {
  const k = drift({ cx: 980, cy: 510, z: 1.0 + .04 * seg(t, H.s_glow, H.s_glow + 8) }, t, .4);
  c.fillStyle = N.sky1; c.fillRect(0, 0, 1920, 1080);
  cam(c, k, () => mapPage(c, t, { glow: i => ss(seg(t, H.glow + i * .28, H.glow + i * .28 + .5)), trip: seg(t, H.glow + 2.4, H.glow + 3.6), corner: seg(t, H.newCorner, H.newCorner + .6) }));
  mapCast(c, t, { rollo: false, crumb: false, tabs: .4, hop: .15 * pulse(t, H.newCorner, .4), page: t > H.newCorner - .3 && t < H.newCorner + 1.2 ? [.9, -1.4, -.3] : null });
  for (let i = 0; i < SPOTS.length; i++) { const t0 = H.glow + i * .28; if (t > t0 && t < t0 + .6) sparkles(c, 960 + (SPOTS[i][0] - k.cx) * k.z, 540 + (SPOTS[i][1] - k.cy) * k.z, 90, seg(t, t0, t0 + .6), 6, C.lemon, 16); }
}

/* ================= THE SIX LEGS SONG (chant theo nhịp) ================= */
const SONG = LINES.filter(l => l.chant);
export function sSong(c, t) {
  const k = drift({ cx: 960, cy: 520, z: 1.05 }, t, .3);
  c.fillStyle = N.sky1; c.fillRect(0, 0, 1920, 1080);
  cam(c, k, () => mapPage(c, t, { glow: () => 1, trip: 1, corner: 1, labels: false }));
  c.fillStyle = 'rgba(36,23,122,.45)'; c.fillRect(0, 0, 1920, 1080);
  // chữ của câu đang đọc: từng từ nảy theo nhịp
  const cur = [...SONG].reverse().find(l => t >= l.t - .1);
  if (cur) { const ws = cur.text.split(' '); c.font = subFont(88); const lw = ws.map(w => c.measureText(w + ' ').width), rows = [[]]; let acc = 0;
    ws.forEach((w, i) => { if (acc + lw[i] > 1500 && rows[rows.length - 1].length) { rows.push([]); acc = 0; } rows[rows.length - 1].push(i); acc += lw[i]; });
    rows.forEach((row, r) => { const tot = row.reduce((a, i) => a + lw[i], 0); let x = 960 - tot / 2;
      row.forEach(i => { const t0 = cur.t + i * cur.dur / ws.length; if (t > t0) popText(c, ws[i], x + lw[i] / 2, 250 + r * 110, 88, i % 2 ? C.lemon : C.cream, C.berry, t, t0, { font: subFont, read: false }); x += lw[i]; }); }); }
  const beat = Math.abs(Math.sin(t * Math.PI * 2)), bop = .1 * beat;
  // cả dàn nhảy theo nhịp trên mép trang
  const y = 1000;
  rolloAt(c, 230, y, 96, t, t * 100, { yaw: -1.2, lift: bop * .5 });
  albieN(c, 470, y + 10, 120, t, { name: talkAt(t, 'albie') ? 'excited' : 'happy', yaw: .2, hop: bop * 2, tabsUp: beat * .6 });
  crumbAt(c, 720, y, 76, { E: crumbE('excited', t, { look: [0, -.3] }), yaw: .2, hop: bop * 1.4, arms: beat > .5 ? UP_ARMS : WAVE_ARMS });
  dotAt(c, 900, y + 10, 92, t, { yaw: .1, lift: bop, look: [0, -.3], legsUp: talkAt(t, 'dot') ? [[.3, -.9, .5], [.25, -.85, .3], [.2, -.8, .1]] : null });
  loupeN(c, 1140, lpY(y + 10, 74) - bop * 40, 74, t, { name: talkAt(t, 'loupe') ? 'excited' : 'happy', pose: ARM.up, rot: Math.sin(t * Math.PI) * .12 });
  waggleAt(c, 1360, 760 + 20 * beat, 62, t, { yaw: .3, wag: Math.sin(t * 20), name: 'excited' });
  blinkN(c, 1540, 820 + 14 * Math.sin(t * 3), 64, t, { fly: 1, glow: .6 + .4 * beat, name: 'laugh' });
  // Spindle thả mình xuống giữa khung, vẫy chân; "BZZT!"
  const sd = H.spindleDrop; if (t > sd) { const d = eo(seg(t, sd, sd + .6)), up = ei(seg(t, H.songEnd + .4, H.songEnd + 1.2)); spindleAt(c, 1720, lerp(-200, 560, d) - up * 800, 70, t, { name: 'laugh', look: [-.4, .2], legs: [[-1.1, -1.3 + .3 * Math.sin(t * 9), .2], 0, 0, 0, [1.1, -1.3 - .3 * Math.sin(t * 9), .2], 0, 0, 0] }); }
  const bz = L0('albie', 'BZZT! Not you, Spindle!'); if (t > bz && t < bz + 2.3) big(c, 'BZZT!', 1500, 160, 130, C.berry, C.cream, t, bz);
}

/* ================= THÔNG ĐIỆP ================= */
export function sMsg(c, t) {
  const k = drift({ cx: 960, cy: 720 - 40 * seg(t, H.s_msg, H.s_spot), z: 1.3 + .1 * seg(t, H.s_msg, H.s_spot) }, t, .3);
  skyBg(c, t, k, { band: 1.2 });
  cam(c, k, () => {
    garden(c, t, { home: [AL.x + 20, GY], tufts: 10, seed: 1 });
    loupeN(c, 1060, lpY(GY + 10, 84), 84, t, { name: talkAt(t, 'loupe') ? 'explaining' : 'happy', look: [-.4, -.3], pose: ARM.up });
    crumbAt(c, 860, GY + 14, 74, { E: crumbE('laugh', t, { look: [.5, -.6] }), yaw: .5, arms: HUG_ARMS });
  });
  const m = L0('loupe', 'Look closely...'); if (t > m) big(c, 'LOOK CLOSELY!', 960, 230, 130, C.lemon, C.berry, t, m);
}

/* ================= "DID YOU SPOT SPINDLE?" ================= */
export function sSpot(c, t, minis) {
  c.fillStyle = C.grape; c.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 16; i++) { const a = -t * .1 + i * TAU / 16; c.fillStyle = C.nightL; c.beginPath(); c.moveTo(960, 540); c.lineTo(960 + Math.cos(a) * 2400, 540 + Math.sin(a) * 2400); c.lineTo(960 + Math.cos(a + TAU / 32) * 2400, 540 + Math.sin(a + TAU / 32) * 2400); c.fill(); }
  const W = 560, Hh = 315;
  minis.forEach((m, i) => {
    const t0 = H.e_spots + i * 1.2, p = back(seg(t, t0, t0 + .35), 1.8); if (p <= 0) return;
    const x = 360 + i * 600, y = 470;
    c.save(); c.translate(x, y); c.scale(p, p); c.rotate((i - 1) * .04);
    rrect(c, -W / 2 - 14, -Hh / 2 - 14, W + 28, Hh + 28, 22, C.cream);
    c.save(); c.beginPath(); c.roundRect(-W / 2, -Hh / 2, W, Hh, 14); c.clip(); c.translate(-W / 2, -Hh / 2); c.scale(W / 1920, W / 1920); m.draw(c); c.restore();
    const ring = seg(t, t0 + .5, t0 + .9); if (ring > 0) { c.lineWidth = 10; c.strokeStyle = C.berry; c.beginPath(); c.arc(-W / 2 + m.rx * W / 1920, -Hh / 2 + m.ry * W / 1920, 46 + 8 * Math.sin(t * 6), 0, TAU * ring); c.stroke(); }
    c.restore();
  });
  crumbAt(c, 330, 1060, 80, { E: crumbE('excited', t, { look: [.5, -.6] }), yaw: .4, arms: WAVE_ARMS });
  const sw = Math.sin(t * 1.6); spindleAt(c, 1620 + sw * 120, 820, 60, t, { name: 'laugh', look: [-.3, .2] });
}

/* ================= GAG CUỐI: Crumb chạy trên viên tròn (gợi lại móc) → mép trang → lật trang: "TÕM!" ao (Mùa 2) ================= */
const BYE_V = 260;
export function sBye(c, t) {
  const fl0 = H.flip, fl1 = H.flip + .8;
  const pageScene = cc => {
    const k = drift({ cx: 960, cy: 520, z: 1.05 }, t, .3);
    cc.fillStyle = N.sky1; cc.fillRect(0, 0, 1920, 1080);
    cam(cc, k, () => mapPage(cc, t, { glow: () => 1, trip: 1, corner: 0, labels: false }));
    const rx = Math.min(lerp(-250, 1500, seg(t, H.recall, H.pageEdge + .9)), 1620);
    const b = rolloAt(cc, rx, 960, 120, t, rx, { yaw: -1.4, look: [.6, -.2], name: 'happy' });
    crumbAt(cc, b.c[0], b.c[1] - b.R + 4, 52, { E: crumbE(talkAt(t, 'crumb') ? 'excited' : 'laugh', t, { look: [-.6, -.3] }), yaw: -.3 + Math.sin(t * 9) * .2, walk: 1, ph: t * 4, arms: UP_ARMS });
    const cb = L0('loupe', 'Crumb! Come back!');
    loupeN(cc, 230, lpY(1020, 92), 92, t, { name: 'excited', look: [.7, -.2], pose: t > cb ? ARM.point : ARM.up, rot: .05 });
    albieN(cc, 1790, 1150, 175, t, { name: talkAt(t, 'albie') ? 'excited' : 'happy', yaw: -.5, look: [-.8, -.3], tabsUp: hold(t, H.pageEdge, fl0, .2, .2), hop: .2 * pulse(t, L0('albie', 'Rollo! That\'s the END of the page!'), .4) });
  };
  const pond = cc => {
    pondPage(cc, t, { rx: 1000, ry: 700 });
    const sp = seg(t, H.splash, H.splash + .8);
    for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * .3, d = eo(sp) * 260; if (sp > 0 && sp < 1) circle(cc, 1000 + Math.cos(a) * d, 640 + Math.sin(a) * d + sp * sp * 200, 16 * (1 - sp) + 4, C.cream); }
    // lá súng: Rollo và Crumb ngồi trên lá, viên tròn nổi bập bềnh
    const bob = Math.sin(t * 2.4) * 8;
    inked(cc, k2 => { k2.moveTo(1000, 760 + bob); k2.ellipse(1000, 760 + bob, 260, 80, 0, .3, TAU - .3); k2.closePath(); }, C.leaf, 7);
    ballProp(cc, 1240, 760 + bob * .7, 60, t * .5);
    rolloAt(cc, 1000, 770 + bob, 110, t, 0, { yaw: -.6, look: [.3, -.3], showBall: false, name: talkAt(t, 'rollo') ? 'talk' : 'happy' });
    crumbAt(cc, 820, 770 + bob, 62, { E: crumbE('laugh', t, { look: [.3, -.4] }), yaw: .4, arms: WAVE_ARMS });
    if (t > H.s_end - .4) { const u = eo(seg(t, H.s_end - .4, H.s_end)); loupeN(cc, lerp(-150, 230, u), lpY(890 + bob * .5, 88), 88, t, { name: talkAt(t, 'loupe') ? 'explaining' : 'laugh', look: [.6, -.3], pose: ARM.point, rot: .08 });
      dotAt(cc, lerp(-100, 440, u), 895 + bob * .5, 96, t, { look: [.4, -.5], name: talkAt(t, 'dot') ? 'excited' : 'happy', legsUp: talkAt(t, 'dot') ? DOT_COUNT : null }); }
  };
  if (t < fl0) pageScene(c);
  else pageFlipLeft(c, t, fl0, fl1, pageScene, pond);
  if (t > H.splash && t < H.splash + 2.3) big(c, 'SPLASH!', 960, 260, 150, C.cream, N.pondD, t, H.splash);
  const st = L0('dot', 'The stars!'); if (t > st) { big(c, 'THE STARS!', 1240, 260, 130, C.lemon, C.grape, t, st); }
}
function pageFlipLeft(c, t, t0, t1, from, to) {
  const u = ss(seg(t, t0, t1)); to(c); if (u >= 1) return;
  c.save(); c.beginPath(); c.rect(0, 0, 1920 * (1 - u), 1080); c.clip(); from(c); c.restore();
  const x = 1920 * (1 - u); ell(c, x, 540, 60 * Math.sin(Math.PI * u) + 4, 620, 0, 'rgba(30,27,58,.22)'); rrect(c, x - 6, -20, 12, 1120, 6, C.cream);
}
