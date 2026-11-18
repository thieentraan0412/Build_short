// Đạo cụ của SHORT-016 (Khối Kẹo Phẳng: khối phẳng, không gradient). Kỹ thuật vẽ tuyết, tổ ong nhiệt, đống lá, bọ rùa ngủ học từ
// films/long-001/props.js; dàn cảnh, bản đồ, bướm vua, đám ong và đám bọ rùa là của tập này.
// Toạ độ cảnh: sân khấu vườn tuyết, mặt đất GY = 1400 (khung 1080×1920 ở z = 1).
import { C, circle, ell, capsule, rrect, poly, popText, subFont, lerp, clamp, seg, TAU } from '/_shared/kit.js';
import { ss } from '/core/lib.js';

export const W = {
  sky: '#5EC4FF', skyHi: '#9ADCFF', hill: '#BCE6FF', hillD: '#9FD5F7', snow: '#EAF6FF', snowS: '#C6E5FA', snowD: '#A9D6F2',
  trunk: '#6B4A8F', trunkD: '#553A75', wood: '#C9773A', woodD: '#9E5426', woodL: '#E39652',
  rock: '#8E86A8', rockL: '#A79FC0', leaf: '#E8871E', leafD: '#9E5426', leafL: '#F2A33A',
  coldA: '#2E2482', coldB: '#4B40BE', coldC: '#6C63DA', hot0: '#FF4E2A', hot1: '#FF8A2F', hot2: '#FFC43D', hot3: '#FFF1A6',
  paper: '#FFF4DA', paperD: '#EBDDBC', sea: '#9BD9FF', land: '#7CD69A', landD: '#56B97C', mtn: '#9C8BC9', fir: '#2E8F5A', firD: '#1F6E44',
  mon: '#FF8A1E', monD: '#E0650F',
};
export const GY = 1400;
const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };

/* ---------- chữ to bật lên (toạ độ khung), dấu hỏi, vòng gợn ---------- */
export function bigWord(c, s, x, y, px, fill, t, t0, t1, o = {}) {
  if (t < t0 || t > t1) return;
  const pu = 1 + .14 * Math.sin(Math.PI * seg(t, t0, t0 + .25)), fade = 1 - ss(seg(t, t1 - .2, t1));
  c.save(); c.globalAlpha *= fade; c.translate(x, y); c.rotate(o.rot || 0); c.scale(pu, pu); c.translate(-x, -y);
  popText(c, s, x, y, px, fill, C.ink, t, t0, { step: .03, sh: px * .075 }); c.restore();
}
export function qmark(c, x, y, s, a) {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= a; popText(c, '?', x, y, 70 * s, C.cream, C.ink, -1, -1, { read: false, sh: 5 }); c.restore();
}
export function ripple(c, x, y, r, p, col = C.mint, n = 3) {
  if (p <= 0 || p >= 1) return;
  for (let i = 0; i < n; i++) {
    const q = p * 1.4 - i * .2; if (q <= 0 || q >= 1) continue;
    c.save(); c.globalAlpha *= 1 - q; c.strokeStyle = col; c.lineWidth = Math.max(2, r * .16 * (1 - q)); c.beginPath(); c.arc(x, y, r * (1 + 1.6 * q), 0, TAU); c.stroke(); c.restore();
  }
}

/* ---------- bông tuyết sáu cánh ---------- */
export function snowflake(c, x, y, r, rot = 0, col = C.white) {
  c.save(); c.translate(x, y); c.rotate(rot);
  const w = r * .14;
  for (let i = 0; i < 6; i++) {
    c.save(); c.rotate(i * TAU / 6);
    capsule(c, 0, 0, 0, -r, w, col);
    for (const [d, l] of [[.42, .32], [.7, .24]]) { capsule(c, 0, -r * d, -r * l, -r * (d + l * .7), w * .8, col); capsule(c, 0, -r * d, r * l, -r * (d + l * .7), w * .8, col); }
    c.restore();
  }
  circle(c, 0, 0, r * .22, col); circle(c, 0, 0, r * .1, W.snowD);
  c.restore();
}
// tuyết rơi (toạ độ khung hoặc cảnh): ba lớp, lớp gần to và nhanh; heat: trong kính nhiệt, tuyết thành chấm tím nhạt
export function snowfall(c, t, o = {}) {
  const x0 = o.x0 ?? -200, x1 = o.x1 ?? 1300, y0 = o.y0 ?? -100, h = o.h ?? 2100, n = o.n ?? 60, k = o.k ?? 1, col = o.col || 'rgba(255,255,255,.92)';
  for (let i = 0; i < n; i++) {
    const layer = i % 3, sp = (40 + 30 * layer + hash(i + 2) * 30) * k, sx = x0 + hash(i) * (x1 - x0) + Math.sin(t * (.6 + .3 * layer) + i) * 26 * k;
    const sy = y0 + ((hash(i + 9) * h + t * sp) % h), r = (3 + 3 * layer + hash(i + 4) * 3) * k;
    circle(c, sx, sy, r, col);
  }
}

/* ---------- vườn tuyết: trời, đồi xa, hàng cây, người tuyết hình Miss Loupe (trứng phục sinh), mặt tuyết ---------- */
export function winterSky(c, t, o = {}) {
  c.fillStyle = o.heat ? W.coldA : W.sky; c.fillRect(-3000, -2000, 9000, 6000);
  if (!o.heat) { ell(c, 200, 330, 260, 70, 0, W.skyHi); ell(c, 900, 470, 320, 80, 0, W.skyHi); circle(c, 880, 300, 70, '#FFF6C9'); }
}
export function winterGround(c, t, o = {}) {
  const heat = o.heat || 0, hill = heat ? W.coldB : W.hill, hillD = heat ? W.coldB : W.hillD, snow = heat ? W.coldC : W.snow, snowS = heat ? W.coldB : W.snowS;
  ell(c, 120, GY - 140, 700, 230, 0, hillD); ell(c, 980, GY - 170, 760, 260, 0, hill); ell(c, 1700, GY - 120, 700, 200, 0, hillD);
  for (const [fx, h, s] of [[-120, 430, 1], [60, 360, .85], [1260, 470, 1.05], [1480, 380, .9]]) pine(c, fx, GY - 80, h, s, heat);
  if (!o.noSnowman) snowLoupe(c, 640, GY - 150, .5, t, heat);                       // trứng phục sinh: người tuyết hình Miss Loupe trên đồi
  c.fillStyle = snow; c.fillRect(-3000, GY - 20, 9000, 3000);
  for (let i = -16; i < 30; i++) ell(c, i * 150, GY - 16 + (i % 3) * 7, 120, 34, 0, snow);
  for (let i = -8; i < 16; i++) ell(c, i * 210 + 40, GY + 120 + (i % 2) * 60, 90, 18, 0, snowS);
}
function pine(c, x, y, h, s, heat) {
  const tr = heat ? W.coldB : W.trunk, sn = heat ? W.coldC : W.snow;
  rrect(c, x - 14 * s, y - h, 28 * s, h + 30, 14 * s, tr);
  for (const [dy, dx, sd] of [[.62, 92, 1], [.44, 80, -1], [.8, 70, -1]]) {
    capsule(c, x, y - h * dy, x + sd * dx * s, y - h * dy - 40 * s, 13 * s, tr);
    ell(c, x + sd * dx * s * .85, y - h * dy - 46 * s, 40 * s, 12 * s, -sd * .35, sn);
  }
  ell(c, x, y - h - 6, 26 * s, 12 * s, 0, sn);
}
// người tuyết hình Miss Loupe: vòng tuyết tròn (kính), thân tuyết, khăn xanh
function snowLoupe(c, x, y, s, t, heat) {
  const sn = heat ? W.coldC : W.snow, sd = heat ? W.coldB : W.snowS;
  c.save(); c.translate(x, y); c.scale(s, s);
  ell(c, 0, 0, 70, 22, 0, sd);
  rrect(c, -34, -150, 68, 150, 34, sn);
  c.strokeStyle = sn; c.lineWidth = 26; c.beginPath(); c.arc(0, -250, 78, 0, TAU); c.stroke();
  if (!heat) { rrect(c, -40, -150, 80, 22, 11, C.sky); capsule(c, 20, -140, 34, -96, 16, C.skyL); circle(c, -14, -110, 7, C.ink); circle(c, 14, -110, 7, C.ink); }
  c.restore();
}

/* ---------- tổ ong gỗ phủ tuyết; heat 0..1: kính ấm (vách tổ tím lạnh, quả bóng ong rực cam ở giữa) ---------- */
export const HIVE = { x: 300, y: GY + 4, s: .5 };
export const ballCenter = () => [HIVE.x, HIVE.y - 220 * HIVE.s];
export function hiveBox(c, x, y, s, heat = 0, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const wd = heat ? W.coldB : W.woodD, w1 = heat ? W.coldB : W.wood, w2 = heat ? W.coldC : W.woodL, sn = heat ? W.coldC : W.snow;
  rrect(c, -160, -20, 320, 40, 8, wd);
  for (let i = 0; i < 3; i++) rrect(c, -140, -150 - i * 130, 280, 128, 8, i % 2 ? w1 : w2);
  rrect(c, -170, -540, 340, 60, 10, wd); ell(c, 0, -548, 180, 40, 0, sn); ell(c, -90, -560, 70, 22, 0, sn);
  rrect(c, -50, -36, 100, 16, 8, heat ? W.coldA : '#3A1E0A');
  c.restore();
}
// quả bóng ong (toạ độ cảnh, tâm cx, cy, bán kính R): các vòng nhiệt phẳng, sáng nhất ở tâm; ong nhỏ bám sát nhau thành lớp
export function beeBall(c, cx, cy, R, t, o = {}) {
  const heat = o.heat ?? 1, pulse = 1 + .035 * Math.sin(t * 4) + .05 * (o.beat || 0), detail = o.detail || 0;
  if (heat <= 0) return;
  c.save(); c.globalAlpha *= heat;
  circle(c, cx, cy, R * 1.28 * pulse, 'rgba(255,78,42,.35)');
  circle(c, cx, cy, R * pulse, W.hot0); circle(c, cx, cy, R * .74 * pulse, W.hot1); circle(c, cx, cy, R * .48 * pulse, W.hot2);
  circle(c, cx, cy, R * .24 * pulse * (1 + .25 * (o.beat || 0)), W.hot3);
  // ong nhỏ: xoắn ốc từ ngoài vào, mỗi con một hình bầu dục có sọc (detail > 0: thêm cánh và đầu)
  const n = o.n ?? 46;
  for (let i = 0; i < n; i++) {
    const u = (i + .5) / n, rr = R * (.18 + .8 * Math.sqrt(1 - u)), a = i * 2.39996 + .08 * Math.sin(t * 3 + i);
    if (o.hole && rr < o.hole) continue;
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * .92, bw = R * .085, rot = a + Math.PI / 2;
    c.save(); c.translate(x, y); c.rotate(rot);
    ell(c, 0, 0, bw, bw * .66, 0, rr > R * .7 ? '#FFB13A' : C.lemon);
    c.fillStyle = 'rgba(30,27,58,.55)'; c.fillRect(-bw * .2, -bw * .62, bw * .16, bw * 1.24); c.fillRect(bw * .25, -bw * .55, bw * .14, bw * 1.1);
    if (detail > 0) { c.globalAlpha *= detail; circle(c, -bw * .95, 0, bw * .42, C.ink); ell(c, 0, -bw * .7, bw * .55, bw * .3, -.3, 'rgba(239,255,250,.8)'); }
    c.restore();
  }
  c.restore();
}
// vòng hơi ấm toả ra từ tâm (p 0..1)
export function heatWave(c, x, y, r, p) {
  if (p <= 0 || p >= 1) return;
  c.save(); c.globalAlpha *= (1 - p) * .9; c.strokeStyle = W.hot3; c.lineWidth = Math.max(3, r * .12 * (1 - p)); c.beginPath(); c.arc(x, y, r * (1 + 2.2 * p), 0, TAU); c.stroke(); c.restore();
}

/* ---------- bướm vua (không phải Flutter): cánh cam gân đen, viền đen chấm trắng, thân đen ---------- */
export function monarch(c, x, y, s, flap = 0, rot = 0, o = {}) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const k = .35 + .65 * Math.abs(Math.cos(flap * Math.PI));                     // vỗ cánh: cánh co ngang
  for (const sd of [-1, 1]) {
    c.save(); c.scale(sd * k, 1);
    // cánh trước
    c.fillStyle = C.ink; c.beginPath(); c.moveTo(0, -4); c.quadraticCurveTo(40, -62, 92, -48); c.quadraticCurveTo(84, -6, 6, 10); c.closePath(); c.fill();
    c.fillStyle = W.mon; c.beginPath(); c.moveTo(6, -4); c.quadraticCurveTo(40, -52, 80, -42); c.quadraticCurveTo(74, -10, 10, 6); c.closePath(); c.fill();
    // cánh sau
    c.fillStyle = C.ink; c.beginPath(); c.moveTo(2, 4); c.quadraticCurveTo(70, 8, 62, 54); c.quadraticCurveTo(28, 66, 0, 18); c.closePath(); c.fill();
    c.fillStyle = W.monD; c.beginPath(); c.moveTo(8, 8); c.quadraticCurveTo(60, 14, 54, 48); c.quadraticCurveTo(28, 56, 6, 18); c.closePath(); c.fill();
    c.strokeStyle = C.ink; c.lineWidth = 3; c.lineCap = 'round';
    for (const [ax, ay, bx, by] of [[8, -2, 60, -34], [8, 2, 66, -18], [8, 10, 46, 40], [8, 12, 28, 48]]) { c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); }
    for (const [dx, dy] of [[86, -46], [78, -30], [60, 50], [44, 56]]) circle(c, dx, dy, 3.4, C.white);
    c.restore();
  }
  capsule(c, 0, -14, 0, 26, 9, C.ink); circle(c, 0, -18, 8, C.ink);
  c.strokeStyle = C.ink; c.lineWidth = 3; for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(0, -22); c.quadraticCurveTo(sd * 8, -40, sd * 16, -44); c.stroke(); circle(c, sd * 16, -44, 4, C.ink); }
  if (o.eyes) { circle(c, -4, -20, 3.5, C.white); circle(c, 4, -20, 3.5, C.white); }
  c.restore();
}

/* ---------- trang bản đồ trong sổ Albie (toạ độ bản đồ: x 0..1080, y 0..2600, bắc ở trên): bờ biển, nhãn, đường bay, núi linh sam ---------- */
export const MAP = {
  path: [[800, 640], [760, 900], [690, 1160], [610, 1420], [540, 1660], [470, 1880], [430, 2040]],   // từ miền đông Bắc Mỹ xuống miền trung Mexico
  forest: { x: 430, y: 2110 },
};
export const mapPt = u => {                                                     // điểm trên đường bay, u 0..1 (nội suy tuyến tính theo đoạn)
  const P = MAP.path, f = clamp(u) * (P.length - 1), i = Math.min(P.length - 2, Math.floor(f)), v = f - i;
  return [lerp(P[i][0], P[i + 1][0], v), lerp(P[i][1], P[i + 1][1], v), Math.atan2(P[i + 1][1] - P[i][1], P[i + 1][0] - P[i][0])];
};
export function mapPage(c, t, o = {}) {
  const orange = o.orange || 0, dash = o.dash ?? 1;
  c.fillStyle = W.sea; c.fillRect(-600, -600, 2300, 3800);
  for (let i = 0; i < 14; i++) { const wx = hash(i) * 1080, wy = hash(i + 5) * 2600; c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.arc(wx, wy, 26, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
  c.fillStyle = W.landD; land(c, 12); c.fillStyle = W.land; land(c, 0);
  for (let i = 0; i < 10; i++) { const lx = 200 + hash(i + 11) * 760, ly = 500 + hash(i + 3) * 1000; if (lx > 900 && ly < 900) continue; ell(c, lx, ly, 40 + hash(i) * 40, 12, 0, W.landD); }
  // núi linh sam ở miền trung Mexico
  const F = MAP.forest;
  for (const [dx, h, w] of [[-130, 170, 130], [10, 230, 160], [140, 160, 120]]) poly(c, [[F.x + dx - w, F.y + 60], [F.x + dx, F.y + 60 - h], [F.x + dx + w, F.y + 60]], W.mtn);
  for (const [dx, h] of [[-120, 150], [10, 210], [140, 140]]) poly(c, [[F.x + dx - 34, F.y + 60 - h + 40], [F.x + dx, F.y + 60 - h], [F.x + dx + 34, F.y + 60 - h + 40]], W.snow);
  TREES.forEach(([dx, dy], i) => {
    const fx = F.x + dx, fy = F.y + dy, on = clamp(orange * 1.7 - i * .06);
    poly(c, [[fx - 30, fy], [fx, fy - 96], [fx + 30, fy]], W.fir); rrect(c, fx - 6, fy - 4, 12, 18, 4, W.trunk);
    if (on > 0) { c.save(); c.globalAlpha *= on; poly(c, [[fx - 33, fy + 2], [fx, fy - 100], [fx + 33, fy + 2]], W.mon); for (let k = 0; k < 6; k++) { const bx = fx - 14 + (k % 3) * 14, by = fy - 14 - Math.floor(k / 3) * 30 - (k % 2) * 8; circle(c, bx, by, 5, C.ink); } c.restore(); }
  });
  // đường bay chấm
  c.save(); c.strokeStyle = C.berry; c.lineWidth = 14; c.lineCap = 'round'; c.setLineDash([2, 34]); c.lineDashOffset = -t * 70;
  const P = MAP.path, end = mapPt(dash), nShow = Math.max(1, Math.ceil(clamp(dash) * (P.length - 1)));
  c.beginPath(); c.moveTo(P[0][0], P[0][1]); for (let i = 1; i <= nShow && i < P.length; i++) { const p = i === nShow ? end : P[i]; c.lineTo(p[0], p[1]); } c.stroke(); c.restore();
}
export const TREES = [[-190, 70], [-140, 40], [-90, 76], [-40, 46], [10, 80], [60, 44], [110, 78], [160, 48], [205, 76]];
function land(c, dy) {                                                          // khối đất cách điệu: Bắc Mỹ rộng phía trên, hẹp dần xuống Mexico
  c.beginPath(); c.moveTo(-80, 280 + dy); c.lineTo(1160, 300 + dy); c.lineTo(1160, 820 + dy); c.quadraticCurveTo(980, 880, 930, 1120 + dy);
  c.quadraticCurveTo(860, 1380, 760, 1500 + dy); c.quadraticCurveTo(660, 1620, 700, 1780 + dy); c.quadraticCurveTo(660, 2060, 580, 2200 + dy);
  c.quadraticCurveTo(460, 2330, 330, 2290 + dy); c.quadraticCurveTo(200, 2200, 170, 2000 + dy); c.quadraticCurveTo(120, 1680, 40, 1460 + dy); c.lineTo(-80, 1400 + dy); c.closePath(); c.fill();
}
export function labelTag(c, s, x, y, px, ink, bg) {
  c.save(); c.font = subFont(px); const w = c.measureText(s).width + px * .9, h = px * 1.35;
  rrect(c, x - w / 2 + 6, y - h / 2 + 8, w, h, h / 2, 'rgba(30,27,58,.25)'); rrect(c, x - w / 2, y - h / 2, w, h, h / 2, bg); c.restore();
  popText(c, s, x, y + px * .36, px, ink, null, -1, -1, { font: subFont });
}
// biển chỉ đường nhỏ trên bản đồ
export function signPost(c, x, y, s, p) {
  if (p <= 0) return;
  c.save(); c.translate(x, y); c.scale(p, p); capsule(c, 0, 0, 0, -90, 12, W.woodD); c.restore();
  if (p > .6) labelTag(c, s, x, y - 120 * p, 40, C.ink, C.lemon);
}

/* ---------- hòn đá, chiếc lá to (nhấc được), cành cây và cục tuyết ---------- */
export const ROCK = { x: 990, y: GY + 4 }, LEAF = { x: 900, y: GY - 4 };
export function rock(c, x, y, s, heat = 0) { c.save(); c.translate(x, y); c.scale(s, s); ell(c, 0, -60, 170, 90, 0, heat ? W.coldB : W.rock); ell(c, -30, -84, 110, 50, 0, heat ? W.coldC : W.rockL); ell(c, -10, -130, 130, 34, 0, heat ? W.coldC : W.snow); c.restore(); }
// lá khô to phủ tuyết; lift 0..1: lá nhấc lên, xoay về sau (khớp ở mép phải); toạ độ (x, y) là mép dưới giữa lá
export function bigLeaf(c, x, y, s, lift = 0, t = 0) {
  const u = ss(lift); c.save(); c.translate(x + 150 * s + 60 * s * u, y - 40 * s * u); c.rotate(-1.75 * u); c.translate(-150 * s, 0); c.scale(s, s);
  c.fillStyle = W.leafD; leafShape(c, 4); c.fillStyle = W.leaf; leafShape(c, 0);
  capsule(c, -140, -40, 130, -40, 7, W.leafD); for (const k of [-90, -30, 30, 90]) { capsule(c, k, -40, k + 34, -78, 5, W.leafD); capsule(c, k, -40, k + 34, -6, 5, W.leafD); }
  ell(c, -10, -82, 120, 22, -.05, W.snow); ell(c, 60, -74, 60, 16, .1, W.snow);
  c.restore();
}
function leafShape(c, dy) { c.beginPath(); c.moveTo(-150, -40 + dy); c.quadraticCurveTo(-10, -140, 150, -40 + dy); c.quadraticCurveTo(-10, 40, -150, -40 + dy); c.fill(); }
export function poof(c, x, y, r, p) {
  if (p <= 0 || p >= 1) return;
  for (let i = 0; i < 9; i++) { const a = -Math.PI * (i / 8), q = ss(p); c.save(); c.globalAlpha *= 1 - p; circle(c, x + Math.cos(a) * r * (.4 + 1.4 * q), y + Math.sin(a) * r * (.3 + .9 * q), r * (.32 - .18 * p), W.snow); c.restore(); }
}

/* ---------- bọ rùa ngủ đông (không phải Dot: không khăn, nhỏ hơn, nhắm mắt) ---------- */
export function sleepyLadybug(c, x, y, s, rot = 0, o = {}) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  ell(c, 0, 0, 1, .78, 0, o.heat ? W.coldC : C.tang); capsule(c, 0, -.76, 0, .76, .05, C.ink);
  for (const [dx, dy, r] of [[-.45, -.2, .17], [.45, -.2, .17], [-.4, .32, .14], [.4, .32, .14], [0, -.55, .12]]) circle(c, dx, dy, r, C.ink);
  ell(c, 0, -.82, .42, .26, 0, C.ink); c.strokeStyle = C.cream; c.lineWidth = .06; c.lineCap = 'round';
  for (const dx of [-.16, .16]) { c.beginPath(); c.arc(dx, -.86, .08, .2, Math.PI - .2); c.stroke(); }
  if (o.glow > 0) { c.save(); c.globalAlpha *= o.glow; c.strokeStyle = C.lemon; c.lineWidth = .12; c.beginPath(); c.ellipse(0, 0, 1.2, .98, 0, 0, TAU); c.stroke(); c.restore(); }
  c.restore();
}
// đám bọ rùa ngủ sát nhau dưới lá (toạ độ cảnh): danh sách vị trí, tỉ lệ; đếm (glow) theo chỉ số
export const PILE = [[-70, -18, 26, -.3], [-30, -30, 28, .2], [12, -22, 27, -.1], [52, -32, 26, .35], [88, -18, 24, -.2],
  [-92, -2, 24, .4], [-50, -4, 27, -.25], [-8, -6, 26, .15], [34, -8, 27, -.35], [74, -4, 25, .25], [-28, 10, 24, .1], [16, 12, 25, -.2], [58, 12, 23, .3], [-70, 14, 22, -.1]];
export function ladybugPile(c, x, y, k, t, o = {}) {
  const glow = o.glow || [], skip = o.skip ?? -1;
  PILE.forEach(([dx, dy, s, rot], i) => {
    if (i === skip) return;
    const br = 1 + .03 * Math.sin(t * 2.2 + i * 1.3);                              // ngủ: thở nhẹ
    sleepyLadybug(c, x + dx * k, y + dy * k, s * k * .9 * br, rot, { glow: glow[i] || 0 });
  });
}
export const pilePt = (x, y, k, i) => [x + PILE[i][0] * k, y + PILE[i][1] * k];
