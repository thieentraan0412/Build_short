// Bí Mật Tí Hon: mọi khung hình là hàm thuần của t.
import { C, REC, circle, ell, capsule, path, rrect, poly, ground, rays, hexes, popText, subtitle, sticker, nope, rings, subFont, clamp, lerp, seg, back, eo, TAU } from './kit.js';
import { lup, butterfly, BF, cricket, cricketEar, bee, flower, cloud, sun, iceCream, bareFoot } from './cast.js';
import { at, BEAT, SECS, IRIS, LINES, CARDS, WAGGLE_DEG, DUR } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';

const secBy = id => SECS.find(s => s.id === id);
const K = keys => { const f = track(keys); return t => f(t); };
const flutter = t => Math.abs(Math.sin(t * TAU * 3.2));
// khẩu hình: độ mở miệng theo âm lượng thật của từng câu (voice/env.json, 24 giá trị mỗi giây); thiếu file thì nhép đều
let ENV = null;
export const setEnv = e => { ENV = e; };
const talkAt = t => {
  for (const l of LINES) if (t >= l.t && t < l.t + l.dur) {
    const e = ENV && ENV[l.id]; if (e) return e[Math.min(e.length - 1, Math.floor((t - l.t) * 24))];
    return .35 + .65 * Math.abs(Math.sin((t - l.t) * Math.PI * 5.5));
  }
  return 0;
};
const blinkAt = t => { const p = (t * .31) % 1; return p > .96 ? 1 : 0; };
const LX = 540, LY = 860;                                     // nơi kính đứng trước mỗi lần chuyển cảnh

function lensView(c, lx, ly, r, mag, wx, wy, draw) {
  c.save(); c.beginPath(); c.arc(lx, ly, r * .86, 0, TAU); c.clip();
  c.translate(lx, ly); c.scale(mag, mag); c.translate(-wx, -wy); REC.mute++; draw(); REC.mute--; c.restore();
}
function camera(c, cx, cy, z, fn) { c.save(); c.translate(cx, cy); c.scale(z, z); c.translate(-cx, -cy); fn(); c.restore(); }

/* ---------- MỞ: bàn chân giẫm kem ---------- */
const stomp = at(0, 3);
function sHook(c, t, o = {}) {
  ground(c, C.mango); rays(c, 540, 1040, C.mangoL, t * .1);
  rrect(c, -40, 1330, 1160, 700, 0, C.tang);
  const sq = ss(seg(t, stomp, stomp + .1));
  c.save(); if (t > stomp && t < stomp + .3) c.translate(0, Math.sin((t - stomp) * 60) * 10 * (1 - (t - stomp) / .3));
  iceCream(c, 540, 960 + sq * 92, 1.65, sq);
  if (t >= stomp) for (let i = 0; i < 9; i++) { const a = -2.9 + i * .34, p = seg(t, stomp, stomp + .5); if (p < 1) circle(c, 540 + Math.cos(a) * (150 + 300 * eo(p)), 900 + Math.sin(a) * (120 + 280 * eo(p)) + 300 * p * p, 26 * (1 - p), C.pink); }
  const fy = K([[0, [210]], [.9, [250]], [1.3, [120]], [stomp, [952]], [2.2, [952]], [2.6, [900]], [3.1, [-300]], [9, [-300]]])(t)[0];
  bareFoot(c, 410, fy, 1.05, t > stomp ? seg(t, stomp, stomp + .4) * (1 - seg(t, 2.2, 2.6)) : 0);
  c.restore();
  const wob = t > stomp ? Math.sin((t - stomp) * 14) * Math.exp(-(t - stomp) * 5) * .05 : 0;
  c.save(); c.translate(540, 340); c.rotate(-.03 + wob); c.translate(-540, -340);
  popText(c, 'TASTE WITH', 540, 290, 140, C.grape, C.cream, t, -.5, { sh: 9 });
  popText(c, 'FEET?!', 540, 500, 230, C.berry, C.cream, t, .55, { sh: 10 });
  c.restore();
  if (!o.noLup && t > 2.2) {
    const [x, y, r] = K([[2.2, [1320, 1180, 200]], [2.75, [790, 1060, 220]], [3.5, [LX, LY, 240]]])(t);
    lensView(c, x, y, r, 1.5, x, y, () => sHook(c, t, { noLup: true }));
    lup(c, x, y, r, { expr: t < 3 ? 'wow' : 'laugh', talk: talkAt(t), rot: -.2 });
  }
  if (t > 2.9) { const p = seg(t, 2.9, 3.6); butterfly(c, lerp(-140, 760, p), 640 + Math.sin(p * 9) * 70, 86, { flap: flutter(t), wingA: C.grape, rot: -.1 }); }
}

/* ---------- TỰA: "of tiny bugs" viết tí hon, chỉ kính mới đọc được ---------- */
function titleWorld(c, t) {
  ground(c, C.grape); rays(c, 540, 600, C.nightL, -t * .12);
  popText(c, 'BIG', 540, 440, 200, C.lemon, C.night, t, at(2), { step: .07 });
  popText(c, 'SECRETS', 540, 650, 200, C.lemon, C.night, t, at(2) - .04, { step: .05 });
  // chữ tí hon là trò đùa thị giác, lời dẫn đọc to đúng câu này cùng lúc: không tính vào readcheck
  popText(c, 'of tiny bugs', 540, LY + 12, 34, C.cream, null, t, at(2, 1), { font: subFont, step: .015, read: false });
}
function sTitle(c, t, o = {}) {
  titleWorld(c, t);
  if (o.noLup) return;
  const [x, y] = K([[at(2), [-300, 940]], [at(2, 1.4), [300, 870]], [at(2, 2.6), [LX, LY]], [at(3), [LX, LY]]])(t);
  lensView(c, x, y, 240, 1.9, x, LY, () => titleWorld(c, t));
  lup(c, x, y, 240, { expr: 'laugh', talk: talkAt(t), rot: -.1 });
}

/* ---------- BÍ MẬT 1: BƯỚM ---------- */
const FL = { x: 560, y: 820, r: 225 }, BFS = 190, BFX = 560, BFY = FL.y - BF.ground * BFS - 12;
const FOOT = [BFX + BF.foot[0] * BFS, BFY + .63 * BFS];
function bfWorld(c, t, detail) {
  const u = t - at(3), landed = u >= 2, glow = ss(seg(u, 3.4, 4.2)) * (1 - seg(u, 6.4, 7));
  ground(c, C.mint);
  ell(c, 160, 1500, 760, 360, 0, C.mintL); ell(c, 1000, 1560, 640, 340, 0, C.mintL);
  rrect(c, -40, 1400, 1160, 700, 0, C.leaf);
  cloud(c, 830, 270, 140); cloud(c, 170, 430, 96);
  flower(c, 150, 1180, 90, { petal: C.tang, heart: C.cream, stem: 300, sway: Math.sin(t) * 12 });
  flower(c, 950, 1110, 110, { petal: C.grape, heart: C.lemon, stem: 380, sway: Math.sin(t + 1) * 12 });
  const dip = landed ? Math.exp(-(u - 2) * 7) * Math.sin((u - 2) * 22) * 14 : 0;
  flower(c, FL.x, FL.y + dip, FL.r, { petal: C.berry, heart: C.lemon, stem: 640, n: 7 });
  if (detail && glow > 0) for (let i = 0; i < 10; i++) {           // giọt mật dâng lên chân
    const ph = ((u * .8 + i * .1) % 1), fx = FOOT[0] - 34 + (i * 29) % 76, fy = FOOT[1] + 40 - ph * 36;
    circle(c, fx, fy, 5.5 * (1 - ph * .5) * glow, C.tang);
  }
  const p = ss(seg(u, 0, 2));
  const x = lerp(-140, BFX, p) + (landed ? 0 : Math.sin(u * 3.4) * 60 * (1 - p)), y = lerp(260, BFY, p) + (landed ? dip : Math.sin(u * 6) * 36 * (1 - p));
  const flap = landed ? .16 + .16 * Math.sin(t * 2.4) : flutter(t);
  butterfly(c, x, y, BFS, { flap, wingA: C.grape, rot: landed ? 0 : -.14, detail, glow, tongue: ss(seg(u, 6, 7.2)), look: u > 6 ? [.6, .4] : [.3, .1] });
}
function sButterfly(c, t, o = {}) {
  const u = t - at(3), z = 1 + .2 * ss(seg(u, 5.8, 7)) * (1 - ss(seg(u, 7.6, 8.4)));
  camera(c, 700, 720, z, () => bfWorld(c, t, 0));
  sticker(c, 'SECRET 1', 60, 170, C.berry, C.cream, seg(t, at(3), at(3, .6)));
  if (!o.noLup && u >= 2.2) {
    const [x, y] = K([[2.2, [1320, 1150]], [3, [FOOT[0] + 10, FOOT[1] + 50]], [5.6, [FOOT[0] + 10, FOOT[1] + 50]], [6.1, [120, 1200]], [8.6, [120, 1200]], [9, [LX, LY]]])(u);
    const r = K([[2.2, [200]], [3, [250]], [5.6, [250]], [6.1, [160]], [8.6, [160]], [9, [240]]])(u)[0];
    const m = ss(seg(u, 2.6, 3.2)) * (1 - ss(seg(u, 5.6, 6.1))), mag = lerp(1.4, 3.4, m);
    lensView(c, x, y, r, mag, lerp(x, FOOT[0] + 6, m), lerp(y, FOOT[1] - 4, m), () => bfWorld(c, t, m > .3 ? 1 : 0));
    lup(c, x, y, r, { expr: u < 3 ? 'happy' : u < 5.8 ? 'wow' : 'laugh', look: [-.3, -.5], rot: u < 5.8 ? -.3 : -.1, talk: u < 3 ? talkAt(t) : 0, armR: [.46, -.2] });
  }
  if (u > 6.2 && u < 8.6) { c.save(); c.translate(690, 1250); c.rotate(-.05); popText(c, 'SWEET!', 0, 0, 170, C.berry, C.cream, t, at(6, .5), { step: .05, sh: 9 }); c.restore(); }
}

/* ---------- BÍ MẬT 2: DẾ ---------- */
const CX = 430, CY = 720, CS = 215;
const earW = l => { const e = cricketEar(l); return [CX + e[0] * CS, CY + e[1] * CS]; };
function ckWorld(c, t, detail) {
  const u = t - at(8), silent = u >= 5 && u < 6, glow = ss(seg(u, 6, 6.3)), lift = ss(seg(u, 8, 8.6));
  ground(c, C.night);
  for (let i = 0; i < 22; i++) { const x = (i * 197 + 80) % 1080, y = 90 + (i * 311) % 560; circle(c, x, y, 5 + (i % 3) * 2, C.grape); }
  circle(c, 930, 610, 78, C.cream); circle(c, 960, 590, 64, C.night);
  ell(c, 240, 1420, 800, 400, 0, C.nightL); ell(c, 980, 1520, 640, 420, 0, C.grape);
  ell(c, 520, 1240, 760, 170, -.02, C.leaf); ell(c, 500, 1270, 640, 90, -.02, C.leafD);
  for (let i = 0; i < 9; i++) { const x = 40 + i * 128; capsule(c, x, 1400, x + Math.sin(t + i) * 10 + 20, 1190 - (i % 3) * 40, 22, C.leafD); }
  const beat = (t / BEAT) % 1, chirp = silent ? 0 : (beat < .5 ? Math.abs(Math.sin(beat * TAU * 3)) : 0);
  if (!silent && u < 6) rings(c, CX - 60, CY - 110, 60, 360, 3, u * .9, C.lime, 12, -2.4, -.8);
  cricket(c, CX, CY, CS, { chirp, detail, glow, legLift: lift, ant: t * 2.2, look: u >= 8 ? [.1, .15] : [.5, -.1] });
  if (detail && glow > 0 && u < 8) { const [ex, ey] = earW(lift); rings(c, ex, ey, 12, 90, 3, 1 - ((u * .9) % 1), C.mint, 5); }
}
function sCricket(c, t, o = {}) {
  const u = t - at(8), punch = 1 + (u >= 6 ? .03 * Math.exp(-(u - 6) * 8) : 0);
  camera(c, 540, 900, punch, () => ckWorld(c, t, 0));
  sticker(c, 'SECRET 2', 60, 170, C.lime, C.ink, seg(t, at(8), at(8, .6)));
  const [q1, q2, q0] = u < 6 ? ['WHERE ARE', 'ITS EARS?', at(8, 2)] : ['EARS ON', 'ITS LEGS!', at(11)];
  popText(c, q1, 540, 310, 104, C.lemon, C.grape, t, q0); popText(c, q2, 540, 420, 104, C.lemon, C.grape, t, q0 + .3);
  if (o.noLup || u < 2) return;
  const E = earW(0), H = [CX + 1.02 * CS, CY - .1 * CS], B = [CX - .25 * CS, CY];
  const [x, y] = K([[2, [1320, 1100]], [2.8, H], [3.9, H], [4.2, B], [5, B], [5.95, E], [7.9, E], [8.4, [180, 1130]], [8.8, [180, 1130]], [9, [LX, LY]]])(u);
  const r = K([[2, [190]], [2.8, [220]], [5.95, [220]], [6.1, [250]], [7.9, [250]], [8.4, [180]], [8.8, [180]], [9, [240]]])(u)[0];
  const mag = u < 5.9 ? 1.7 : lerp(1.7, 4.2, eo(seg(u, 5.9, 6.1))) * (1 - .6 * ss(seg(u, 7.9, 8.3)));
  lensView(c, x, y, r, mag, x, y, () => ckWorld(c, t, u > 5.8 && u < 8.1 ? 1 : 0));
  lup(c, x, y, r, { expr: u < 3.3 ? 'happy' : u < 5 ? 'shock' : u < 6 ? 'happy' : u < 7.8 ? 'wow' : 'laugh', look: [-.2, -.5], rot: -.24, armR: [.5, -.1] });
  if (u > 3.4 && u < 5.4) nope(c, H[0] + 200, H[1] - 90, 74, seg(u, 3.4, 3.6));
  if (u > 4.5 && u < 5.4) nope(c, B[0] - 150, B[1] - 200, 74, seg(u, 4.5, 4.7));
}

/* ---------- BÍ MẬT 3: ONG ---------- */
const DC = { x: 540, y: 880 }, A = WAGGLE_DEG * Math.PI / 180, DIR = [Math.sin(A), -Math.cos(A)], RUN = 200;
const NOR = [-DIR[1], DIR[0]];
function wagglePos(ph) {                                       // một vòng: chạy, vòng phải, chạy, vòng trái
  ph = ((ph % 1) + 1) % 1; const a = [DC.x - DIR[0] * RUN, DC.y - DIR[1] * RUN], b = [DC.x + DIR[0] * RUN, DC.y + DIR[1] * RUN];
  const heading = Math.atan2(DIR[1], DIR[0]);
  if (ph < .25 || (ph >= .5 && ph < .75)) { const q = (ph % .5) / .25, s = Math.sin(q * TAU * 7) * 24; return { p: [lerp(a[0], b[0], q) + NOR[0] * s, lerp(a[1], b[1], q) + NOR[1] * s], rot: heading + Math.sin(q * TAU * 7) * .3 }; }
  const side = ph < .5 ? 1 : -1, q = (ph % .5 - .25) / .25, ang = q * Math.PI;
  const x = DC.x + DIR[0] * RUN * Math.cos(ang) + NOR[0] * side * RUN * 1.05 * Math.sin(ang), y = DC.y + DIR[1] * RUN * Math.cos(ang) + NOR[1] * side * RUN * 1.05 * Math.sin(ang);
  return { p: [x, y], rot: heading + Math.PI + side * (Math.PI / 2 - ang) };
}
function hiveWorld(c, t, o = {}) {
  const u = t - at(13), dancing = u >= 2 || o.still;
  ground(c, C.honeyD); hexes(c, 92, C.honey, -300, -300, 1400, 2200);
  hexes(c, 92, C.honeyL, -300, 1180, 1400, 2200, .62);
  // "lên trên" trong tổ = hướng mặt trời ngoài vườn
  sun(c, DC.x, 330, 46, t * .3);
  c.setLineDash([4, 30]); path(c, [[DC.x, 420], [DC.x, DC.y]], 10, C.lemon); c.setLineDash([]);
  if (dancing) {
    c.fillStyle = 'rgba(255,248,231,.35)'; c.beginPath(); c.moveTo(DC.x, DC.y); c.arc(DC.x, DC.y, 230, -Math.PI / 2, -Math.PI / 2 + A); c.closePath(); c.fill();
    const pts = []; for (let i = 0; i <= 120; i++) pts.push(wagglePos(i / 120 + .25).p);
    c.setLineDash([2, 34]); path(c, pts, 16, C.cream); c.setLineDash([]);
    capsule(c, DC.x - DIR[0] * RUN, DC.y - DIR[1] * RUN, DC.x + DIR[0] * RUN, DC.y + DIR[1] * RUN, 18, C.lemon);
  }
  const ph = o.still ? .1 : (t - at(14)) / 4;
  if (dancing && !o.still) for (let i = 2; i >= 1; i--) { const w = wagglePos(ph - i * .2); bee(c, w.p[0], w.p[1], 58, { rot: w.rot, wing: Math.sin(t * 70 + i), look: [.5, 0] }); }
  const w = dancing ? wagglePos(ph) : { p: [540 + Math.sin(u * 3) * 40, 880 + Math.sin(u * 4.3) * 24], rot: 0 };
  bee(c, w.p[0], w.p[1], dancing ? 100 : 130, { rot: dancing ? w.rot : Math.sin(u * 2) * .06, wing: Math.sin(t * 80), mouth: dancing ? 'smile' : 'open', look: [.5, .1] });
  if (dancing) [[150, 1110], [930, 1090], [150, 560], [930, 590]].forEach((b, i) => bee(c, b[0], b[1] + Math.sin(t * 6 + i) * 8 - Math.abs(Math.sin((t + i * .25) * Math.PI / BEAT / 2)) * 26, 66, { flip: b[0] < 540 ? 1 : -1, wing: Math.sin(t * 60 + i), look: [.6, b[1] > 880 ? -.5 : .5] }));
}
function sBee(c, t, o = {}) {
  const u = t - at(13), z = 1 + .05 * seg(u, 0, 2) * (1 - seg(u, 2, 2.05));
  camera(c, 540, 880, z, () => hiveWorld(c, t));
  sticker(c, 'SECRET 3', 60, 170, C.lemon, C.ink, seg(t, at(13), at(13, .6)));
  if (u < 2 && u > .2) {                                       // bóng thoại rỗng: ong không nói được
    const p = back(seg(u, .2, .5), 2);
    c.save(); c.translate(700, 600); c.scale(p, p); circle(c, 0, 0, 130, C.cream); poly(c, [[-90, 76], [-164, 170], [-20, 120]], C.cream);
    for (let i = 0; i < 3; i++) circle(c, -60 + i * 60, -4 - Math.abs(Math.sin(u * 5 + i)) * 18, 18, C.ink); c.restore();
  }
  if (u >= 2) popText(c, 'DANCE!', 540, 1380, 220, C.lemon, C.honeyD, t, at(14), { step: .06, sh: 12 });
}

/* ---------- CẢNH ĐẶC TRƯNG: điệu nhảy là bản đồ thật ---------- */
const HIVE = { x: 232, y: 2640, s: 150 }, SUN = { x: 232, y: 230 };
const FLOWER = { x: HIVE.x + Math.tan(A) * 2330, y: 2640 - 2330 };
function mapCam(u) {
  const p = ss(seg(u, 0, 1)), tilt = ss(seg(u, 1, 2.4)), wide = ss(seg(u, 2.4, 3.2));
  let cx = lerp(HIVE.x, HIVE.x + 180, p), cy = lerp(HIVE.y, HIVE.y - 660, p);
  cx = lerp(cx, FLOWER.x, tilt); cy = lerp(cy, FLOWER.y + 300, tilt);
  cx = lerp(cx, (HIVE.x + FLOWER.x) / 2, wide); cy = lerp(cy, (HIVE.y + SUN.y) / 2 + 20, wide);
  return { cx, cy, z: Math.exp(lerp(Math.log(HIVE_Z0), 0, p)) * lerp(1, .6, wide) * (1 + .04 * ss(seg(u, 3.2, 5))) };
}
const HIVE_K = HIVE.s / 960 * 1.1, HIVE_Z0 = 1 / HIVE_K;     // ở u = 0 tổ ong hiện đúng tỉ lệ 1:1 như cảnh trước, cắt không giật
const toScreen = (m, x, y) => [540 + (x - m.cx) * m.z, 980 + (y - m.cy) * m.z];
function mapWorld(c, t, u) {
  c.fillStyle = C.leaf; c.fillRect(-1200, -600, 3600, 4400);
  for (let i = 0; i < 26; i++) { const x = (i * 263 + 40) % 1120, y = 120 + (i * 491) % 2500; ell(c, x, y, 120 + (i % 3) * 30, 62, .1 * (i % 4), C.leafD); }
  for (const [x, y, r, p] of [[880, 2260, 70, C.mango], [110, 1900, 60, C.pink], [960, 1560, 76, C.tang], [150, 1160, 66, C.grape], [960, 880, 60, C.mint]]) flower(c, x, y, r, { petal: p, heart: C.cream });
  ell(c, 760, 1990, 200, 110, .1, C.sky); ell(c, 730, 1970, 120, 60, .1, C.skyL);
  sun(c, SUN.x, SUN.y, 104, t * .3);
  c.setLineDash([8, 44]); path(c, [[HIVE.x, HIVE.y - 150], [SUN.x, SUN.y + 170]], 18, C.lemon); c.setLineDash([]);
  c.fillStyle = 'rgba(255,248,231,.4)'; c.beginPath(); c.moveTo(HIVE.x, HIVE.y - 40); c.arc(HIVE.x, HIVE.y - 40, 380, -Math.PI / 2, -Math.PI / 2 + A); c.closePath(); c.fill();
  const L = ss(seg(u, .7, 2.4));
  capsule(c, HIVE.x, HIVE.y - 40, lerp(HIVE.x, FLOWER.x, L), lerp(HIVE.y - 40, FLOWER.y, L), 26, C.cream);
  flower(c, FLOWER.x, FLOWER.y, 190, { petal: C.berry, heart: C.lemon, n: 7, open: Math.max(.4, back(seg(u, 2.2, 2.6), 2)) });
}
function mapHive(c, t) {                                       // tổ ong: bên trong là chính cảnh nhảy, thu nhỏ
  const s = HIVE.s;
  c.save(); c.beginPath(); c.roundRect(HIVE.x - s, HIVE.y - s * 1.3, s * 2, s * 2.6, s * .36); c.clip();
  c.translate(HIVE.x, HIVE.y); c.scale(HIVE_K, HIVE_K); c.translate(-540, -980);
  hiveWorld(c, t); c.restore();
}
function sMap(c, t) {
  const u = t - at(16), m = mapCam(u);
  c.save(); c.translate(540, 980); c.scale(m.z, m.z); c.translate(-m.cx, -m.cy);
  mapWorld(c, t, u); mapHive(c, t);
  const ang = Math.atan2(FLOWER.y - (HIVE.y - 40), FLOWER.x - HIVE.x);
  if (u > .8) for (let i = 0; i < 7; i++) { const s = ss(seg(u, .8 + i * .1, 2.4 + i * .06)); if (s > .01) bee(c, lerp(HIVE.x, FLOWER.x - 10, s) + Math.sin(t * 7 + i) * 14, lerp(HIVE.y - 40, FLOWER.y + 70, s), 42, { rot: ang, wing: Math.sin(t * 70 + i) }); }
  c.restore();
  if (u > 3.1) { popText(c, 'THE DANCE', 290, 500, 80, C.cream, C.leafD, t, at(16, 6.4), { step: .03 }); popText(c, 'IS A MAP!', 290, 590, 80, C.lemon, C.leafD, t, at(16, 6.8), { step: .03 }); }
}
const FL_END = toScreen(mapCam(5), FLOWER.x, FLOWER.y);

/* ---------- SỔ SƯU TẦM ---------- */
function sAlbum(c, t) {
  ground(c, C.sky); ell(c, 200, 1740, 900, 420, 0, C.skyL);
  rrect(c, 96, 288, 900, 1090, 54, C.grape); rrect(c, 84, 270, 900, 1090, 54, C.cream);
  const rows = [
    { y: 450, f: C.mint, t1: 'Taste', t2: 'with feet', col: C.berry, d: () => butterfly(c, -8, 38, 62, { wingA: C.grape, flap: .12 }) },
    { y: 815, f: C.night, t1: 'Hear', t2: 'with legs', col: C.grape, d: () => cricket(c, 10, 10, 62, { detail: 1, glow: 1 }) },
    { y: 1180, f: C.honey, t1: 'Talk', t2: 'by dancing', col: C.tang, d: () => bee(c, -6, 8, 76, {}) },
  ];
  rows.forEach((r, i) => {
    const t0 = at(19, 1 + i), p = back(seg(t, t0, t0 + .24), 2.6); if (p <= 0) return;
    c.save(); c.translate(280, r.y); c.rotate(-.05 + i * .05); c.scale(p, p); circle(c, 8, 10, 150, 'rgba(30,27,58,.18)'); circle(c, 0, 0, 150, r.f); r.d(); c.restore();
    popText(c, r.t1, 470, r.y - 6, 96, r.col, null, t, t0 + .1, { align: 'left', step: .02 });
    popText(c, r.t2, 470, r.y + 72, 62, C.ink, null, t, t0 + .2, { align: 'left', step: .012, font: subFont });
  });
}

/* ---------- KẾT: bướm nếm lại Cô Lúp ---------- */
function sGag(c, t) {
  const u = t - at(21), land = 1, z = 1 + .05 * seg(u, 0, 4);
  camera(c, 540, 760, z, () => {
    ground(c, C.mint); rays(c, 540, 640, C.mintL, t * .1);
    const hop = u > 2.5 ? Math.abs(Math.sin((u - 2.5) * 8)) * 22 : 0, x = 540, y = 600, r = 320;
    circle(c, x, y - hop, r * .86, '#DFF9FF');
    lup(c, x, y, r, { rot: 0, hop, expr: u < .9 ? 'happy' : u < 2.5 ? 'cross' : 'laugh', talk: talkAt(t), blink: blinkAt(t), look: [0, -.2], armL: [-.5, .2], armR: [.5, .2] });
    const p = ss(seg(u, 0, land)), bx = lerp(1240, 560, p), by = lerp(170, y + 18 - hop, p) + (u < land ? Math.sin(u * 8) * 40 * (1 - p) : 0);
    butterfly(c, bx, by, 118, { flap: u < land ? flutter(t) : .16 + .14 * Math.sin(t * 2.4), wingA: C.grape, tongue: ss(seg(u, 2.1, 2.9)), look: [.4, .5], rot: u < land ? -.14 : 0 });
  });
}

const SC = { hook: sHook, title: sTitle, butterfly: sButterfly, cricket: sCricket, bee: sBee, map: sMap, album: sAlbum, gag: sGag };
const IRISES = [{ t0: at(1, 3), t1: at(2), from: 'hook', to: 'title', x: LX, y: LY },
  ...IRIS.map(i => i.from === 'map' ? { ...i, x: FL_END[0], y: FL_END[1], kind: 'flower' } : i)];
export function drawFilm(c, t) {
  t = clamp(t, 0, DUR - .001);
  const sec = SECS.find(s => t >= s.t0 && t < s.t1) || SECS[SECS.length - 1];
  const ir = IRISES.find(i => t >= i.t0 && t < i.t1);
  c.save();
  if (ir) {
    const u = ei(seg(t, ir.t0, ir.t1)), R = lerp(ir.kind === 'flower' ? 60 : 240, 2200, u);
    SC[ir.from](c, t, { noLup: true });
    if (ir.kind === 'flower') flower(c, ir.x, ir.y, R * 1.3, { petal: C.berry, heart: C.lemon, n: 7 });
    c.save(); c.beginPath(); c.arc(ir.x, ir.y, R * .86 * (ir.kind === 'flower' ? .5 : 1), 0, TAU); c.clip(); SC[ir.to](c, Math.max(t, secBy(ir.to).t0), { noLup: true }); c.restore();
    if (ir.kind !== 'flower') lup(c, ir.x, ir.y, R, { expr: 'wow', rot: -.14, look: [0, -.4] });
  } else SC[sec.id](c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l.text, seg(t, l.t0, l.t0 + .14));
  c.restore();
}
