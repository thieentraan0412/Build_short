// Đạo cụ và bối cảnh của SHORT-013: bãi cỏ khô vàng nắng giữa trưa (nền ấm, ít xanh lá, để Hop xanh lá đậm và Chirp xanh chanh nổi lên),
// gốc cây làm "sân khấu", cỏ cao có bông, hoa cúc, bồ công anh bay; nốt nhạc của song tấu, vòng âm thanh, lò xo, dấu X, chữ to.
// Nền phẳng, mềm, viền mảnh hơn nhân vật (nhân vật dùng phong cách v2 "Kẹo Phẳng Viền").
import { C, circle, ell, rrect, poly, capsule, popText, TAU } from '/_shared/kit.js';
import { hash, lerp, clamp, seg, ss, eo, back } from '/core/lib.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { ex } from '/_shared/episode.js';

export const N = {
  sky0: '#9EE3FF', sky1: '#FFF1C9', sun: '#FFD84A', sunL: '#FFF0A0', ray: 'rgba(255,240,150,.25)',
  hillF: '#C9C4F2', hillF2: '#B3ADEA',                                  // đồi rất xa: tím hoa oải hương nhạt (không xanh, để nhân vật xanh nổi)
  hay0: '#F6D77E', hay1: '#EDC25A', hayD: '#D9A443', hayL: '#FBE7A8', // cỏ khô vàng
  stem: '#E3B04F', stemD: '#C4903A', seed: '#F2C66A', sage: '#9FCFA0', sageD: '#7FB88A',
  bark: '#B87A4A', barkD: '#93603A', barkL: '#D39A62', top: '#F3D29A', ring: '#DDB277', ringD: '#C99A5E',
  daisy: '#FFFFFF', clover: '#C58BE6', poppy: '#FF8A4C', note1: '#E8A93A', note2: '#B7F04A',
  line: 'rgba(30,27,58,.55)',
};
// mặt đất (toạ độ cảnh) và gốc cây sân khấu
export const groundY = x => 1192 + .00005 * (x - 560) ** 2;
export const STUMP = { x: 690, top: 1100, rx: 172, ry: 33 };
export const SUN = { x: 900, y: 380, r: 96 };

// dây viền mảnh cho nền (nhạt hơn nhân vật)
function edge(c, w = 4) { c.strokeStyle = N.line; c.lineWidth = w; c.lineJoin = c.lineCap = 'round'; c.stroke(); }

// trời, mặt trời, mây, đồi xa, bãi cỏ (toạ độ cảnh). o.far: hai châu chấu tí hon đang hát trên ngọn cỏ xa (bí mật 1, song tấu)
export function meadowSky(c, t, o = {}) {
  const g = c.createLinearGradient(0, -400, 0, 1000); g.addColorStop(0, N.sky0); g.addColorStop(1, N.sky1);
  c.fillStyle = g; c.fillRect(-1800, -1800, 4800, 3900);
  c.save(); c.translate(SUN.x, SUN.y); c.rotate(t * .05);
  c.fillStyle = N.ray; c.beginPath(); for (let i = 0; i < 12; i++) { const a = i * TAU / 12, b = a + TAU / 24; c.moveTo(0, 0); c.lineTo(Math.cos(a) * 900, Math.sin(a) * 900); c.lineTo(Math.cos(b) * 900, Math.sin(b) * 900); c.closePath(); } c.fill();
  c.restore();
  circle(c, SUN.x, SUN.y, SUN.r * 1.35, 'rgba(255,240,150,.35)'); c.fillStyle = N.sun; c.beginPath(); c.arc(SUN.x, SUN.y, SUN.r, 0, TAU); c.fill(); edge(c, 3); circle(c, SUN.x - 28, SUN.y - 30, SUN.r * .36, N.sunL);
  for (const [x, y, s] of [[160, 320, 1], [600, 210, .75], [1150, 560, .9], [-280, 600, 1.1], [420, 470, .55]]) {
    const dx = 12 * Math.sin(t * .18 + x);
    c.fillStyle = C.cream; c.beginPath(); for (const [a, b, r] of [[-70, 10, 52], [0, -14, 70], [74, 8, 50], [20, 22, 56]]) { c.moveTo(x + dx + a * s + r * s, y + b * s); c.arc(x + dx + a * s, y + b * s, r * s, 0, TAU); } c.fill();
  }
  // đồi xa tím nhạt, rồi dải cỏ khô xa
  ell(c, 60, 975, 760, 190, 0, N.hillF2); ell(c, 980, 985, 860, 220, 0, N.hillF);
  c.fillStyle = N.hay1; c.beginPath(); c.moveTo(-1800, 990); for (let x = -1800; x <= 3000; x += 60) c.lineTo(x, 975 + 14 * Math.sin(x * .011)); c.lineTo(3000, 3000); c.lineTo(-1800, 3000); c.fill();
  // cỏ xa đung đưa (mảnh, vàng), vài bông cỏ
  for (let i = 0; i < 46; i++) {
    const x = -500 + i * 45 + 20 * hash(i + 3), y = 1000 + 30 * hash(i + 4), h = 70 + 90 * hash(i + 5), sw = 7 * Math.sin(t * 1.3 + i * .7);
    c.strokeStyle = i % 3 ? N.stemD : N.stem; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + sw * .4, y - h * .6, x + sw, y - h); c.stroke();
    if (i % 3 === 0) ell(c, x + sw, y - h - 8, 6, 16, sw * .02, N.seed);
  }
  if (o.far) farSingers(c, t, o.far);
}
// hai châu chấu tí hon hát trên ngọn cỏ xa (toạ độ cảnh): o = { on 0..1, saw (độ kéo chân) }
export const FAR = [{ x: 902, y: 952, k: 26, yaw: -.95 }, { x: 965, y: 915, k: 22, yaw: -1.05 }];
function farSingers(c, t, o) {
  if (!(o.on > 0)) return;
  for (const [i, F] of FAR.entries()) {
    const sw = 4 * Math.sin(t * 1.3 + i * 2), top = [F.x + sw, F.y];
    c.strokeStyle = N.stemD; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(F.x - 10, 1010); c.quadraticCurveTo(F.x - 4, (F.y + 1010) / 2, top[0], top[1] + 4); c.stroke();
    c.save(); c.globalAlpha *= o.on;
    drawChar(c, BY.hop, { x: top[0], y: top[1], k: F.k, yaw: F.yaw, showFx: false, expr: ex(BY.hop, 'happy', { closed: 'happy' }), pose: { fiddle: o.saw || 0, bow: t * 9 + i * 1.7 } });
    c.restore();
  }
}
// bãi cỏ gần: nền cỏ khô, mảng sáng, hoa, gốc cây sân khấu (toạ độ cảnh)
export function meadowGround(c, t, o = {}) {
  c.fillStyle = N.hay0; c.beginPath(); c.moveTo(-1800, 1180); for (let x = -1800; x <= 3000; x += 40) c.lineTo(x, groundY(x) - 6 + 5 * Math.sin(x * .03)); c.lineTo(3000, 3200); c.lineTo(-1800, 3200); c.fill();
  c.fillStyle = N.hay1; c.fillRect(-1800, 1440, 4800, 2000);
  c.fillStyle = N.hayL; for (let i = 0; i < 46; i++) { const x = -500 + hash(i + 70) * 2200, y = groundY(x) + 30 + hash(i + 71) * 220; c.beginPath(); c.ellipse(x, y, 30, 8, 0, 0, TAU); c.fill(); }
  c.fillStyle = N.hayD; for (let i = 0; i < 26; i++) { const x = -500 + hash(i + 170) * 2200, y = groundY(x) + 60 + hash(i + 171) * 260; c.beginPath(); c.ellipse(x, y, 22, 6, 0, 0, TAU); c.fill(); }
  // hoa nhỏ trên bãi
  for (let i = 0; i < 16; i++) { const x = -300 + hash(i + 300) * 1700, y = groundY(x) + 40 + hash(i + 301) * 250, k = i % 3; flower(c, x, y + 2 * Math.sin(t * 1.4 + i), 11 + 4 * hash(i + 302), k === 0 ? N.daisy : k === 1 ? N.clover : N.poppy); }
  if (o.rollo != null && o.rollo > 0 && o.rollo < 1) rolloTiny(c, lerp(-80, 1200, o.rollo), 1060, o.rollo);
  if (!o.noStump) stump(c);
}
export function flower(c, x, y, r, col) {
  c.strokeStyle = N.sageD; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y + r * 2.4); c.lineTo(x, y); c.stroke();
  for (let i = 0; i < 6; i++) { const a = i * TAU / 6; c.fillStyle = col; c.beginPath(); c.ellipse(x + Math.cos(a) * r * .62, y + Math.sin(a) * r * .62, r * .48, r * .3, a, 0, TAU); c.fill(); }
  circle(c, x, y, r * .36, C.mango);
}
// gốc cây: thân nâu ấm, mặt cắt sáng có vân tròn (sân khấu của Chirp và Hop)
export function stump(c) {
  const { x, top, rx, ry } = STUMP, gy = groundY(x);
  ell(c, x + 14, gy + 8, rx * 1.12, 22, 0, 'rgba(30,27,58,.14)');
  // rễ
  for (const [dx, w] of [[-rx * .95, 40], [rx * .9, 46], [-rx * .3, 30]]) { c.fillStyle = N.barkD; c.beginPath(); c.ellipse(x + dx, gy - 6, w, 16, 0, Math.PI, TAU); c.fill(); }
  c.fillStyle = N.bark; c.beginPath(); c.moveTo(x - rx, top); c.lineTo(x - rx * 1.02, gy - 4); c.quadraticCurveTo(x, gy + 22, x + rx * 1.02, gy - 4); c.lineTo(x + rx, top); c.closePath(); c.fill(); edge(c);
  c.fillStyle = N.barkD; for (const dx of [-.62, -.2, .28, .7]) { c.beginPath(); c.moveTo(x + dx * rx - 6, top + 22); c.quadraticCurveTo(x + dx * rx + 8, (top + gy) / 2, x + dx * rx - 2, gy - 6); c.lineTo(x + dx * rx + 6, gy - 6); c.quadraticCurveTo(x + dx * rx + 14, (top + gy) / 2, x + dx * rx + 4, top + 22); c.fill(); }
  c.fillStyle = N.barkL; c.beginPath(); c.ellipse(x - rx * .55, (top + gy) / 2, 14, 30, 0, 0, TAU); c.fill();
  c.fillStyle = N.top; c.beginPath(); c.ellipse(x, top, rx, ry, 0, 0, TAU); c.fill(); edge(c);
  c.strokeStyle = N.ring; c.lineWidth = 4; for (const k of [.25, .5, .75]) { c.beginPath(); c.ellipse(x + 6, top + 2, rx * k, ry * k, 0, 0, TAU); c.stroke(); }
  circle(c, x + 6, top + 2, 6, N.ringD);
}
// cỏ tiền cảnh: lá to đung đưa nhanh hơn máy (chiều sâu), không che nhân vật: chỉ vẽ ở mép trái / phải (toạ độ cảnh)
export function foreGrass(c, t) {
  for (const [x0, n, s] of [[205, 5, 1], [905, 5, 1.1]]) for (let i = 0; i < n; i++) {
    const x = x0 + i * 22 * s, y = 1640, h = (230 + 90 * hash(i + x0)) * s, sw = 16 * Math.sin(t * 1.5 + i + x0);
    c.strokeStyle = i % 2 ? N.stem : N.sage; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + sw * .4, y - h * .55, x + sw - 20 * s, y - h); c.stroke();
  }
}
// hạt bồ công anh bay chậm (chi tiết nhỏ chuyển động), toạ độ khung
export function seeds(c, t, n = 7) {
  for (let i = 0; i < n; i++) {
    const p = (t * .045 + hash(i + 40)) % 1, x = lerp(-60, 1140, p) + 40 * Math.sin(t * .8 + i), y = 760 - 520 * hash(i + 41) + 30 * Math.sin(t * 1.1 + i * 2);
    c.save(); c.globalAlpha = .75; c.strokeStyle = C.white; c.lineWidth = 2;
    for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * .4; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14); c.stroke(); }
    c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 12); c.stroke(); circle(c, x, y + 13, 2.5, N.stemD); c.restore();
  }
}
// Mr. Rollo lăn viên tròn trên bãi cỏ xa (trứng phục sinh)
function rolloTiny(c, x, y, u) {
  const sp = u * 30; circle(c, x + 16, y - 10, 13, C.honeyD); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; c.beginPath(); c.arc(x + 16, y - 10, 8, sp, sp + 1.5); c.stroke();
  ell(c, x - 4, y - 8, 12, 8, -.5, C.ink); c.strokeStyle = C.ink; c.lineWidth = 3; for (let k = 0; k < 3; k++) { const a = sp + k * 2.1; c.beginPath(); c.moveTo(x - 4, y - 6); c.lineTo(x - 12 + 4 * Math.cos(a), y + 2 + 3 * Math.sin(a)); c.stroke(); }
}

/* ---------- âm thanh thấy được ---------- */
// vòng sóng âm đi từ a tới b (toạ độ đang vẽ): các cung tròn lớn dần, trôi theo hướng a→b. p: 0..1 tiến trình, n cung
export function soundWaves(c, a, b, p, col = C.cream, w = 8, n = 3) {
  if (p <= 0 || p >= 1) return;
  const dx = b[0] - a[0], dy = b[1] - a[1], ang = Math.atan2(dy, dx), d = Math.hypot(dx, dy);
  for (let i = 0; i < n; i++) {
    const q = p * 1.25 - i * .12; if (q <= 0 || q >= 1) continue;
    const x = a[0] + dx * q, y = a[1] + dy * q, r = 14 + d * .1 * (1 + q);
    c.save(); c.globalAlpha *= Math.sin(Math.PI * q); c.strokeStyle = C.ink; c.lineCap = 'round'; c.lineWidth = w + 5;
    c.beginPath(); c.arc(x, y, r, ang - .75, ang + .75); c.stroke(); c.strokeStyle = col; c.lineWidth = w; c.stroke(); c.restore();
  }
}
// gợn tròn quanh một điểm (màng nhĩ rung, kính rung): p 0..1
export function ripple(c, x, y, r, p, col = C.mint, n = 3) {
  if (p <= 0 || p >= 1) return;
  for (let i = 0; i < n; i++) {
    const q = p * 1.4 - i * .2; if (q <= 0 || q >= 1) continue;
    c.save(); c.globalAlpha *= 1 - q; c.strokeStyle = col; c.lineWidth = Math.max(2, r * .16 * (1 - q)); c.beginPath(); c.arc(x, y, r * (1 + 1.6 * q), 0, TAU); c.stroke(); c.restore();
  }
}

/* ---------- nốt nhạc: Hop (nâu vàng như cánh), Chirp (xanh chanh) ---------- */
export function note(c, x, y, s, col, rot = 0, kind = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  c.lineJoin = c.lineCap = 'round';
  const pathNote = () => {
    c.beginPath();
    if (kind === 0) { c.ellipse(-8, 16, 11, 8, -.4, 0, TAU); c.moveTo(1, 14); c.lineTo(1, -22); c.quadraticCurveTo(14, -16, 14, -2); }
    else { c.ellipse(-16, 18, 10, 7, -.4, 0, TAU); c.moveTo(14, 12); c.ellipse(6, 14, 10, 7, -.4, 0, TAU); c.moveTo(-8, 16); c.lineTo(-8, -20); c.lineTo(14, -26); c.lineTo(14, 10); c.moveTo(-8, -10); c.lineTo(14, -16); }
  };
  pathNote(); c.strokeStyle = C.ink; c.lineWidth = 10; c.stroke(); c.fillStyle = C.ink; c.fill();
  pathNote(); c.strokeStyle = col; c.lineWidth = 5; c.stroke(); c.fillStyle = col; c.fill();
  c.restore();
}
// hình mà các nốt xếp thành (toạ độ khung, tâm cx, cy, cỡ R): trả về điểm thứ i trong n điểm
export function shapePt(kind, i, n, cx, cy, R) {
  const u = i / n;
  if (kind === 'heart') { const a = u * TAU; return [cx + R * .95 * Math.pow(Math.sin(a), 3), cy - R * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 16]; }
  if (kind === 'star') {
    const k = u * 10, j = Math.floor(k), f = k - j, P = q => { const a = -Math.PI / 2 + q * Math.PI / 5, r = q % 2 ? R * .45 : R; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
    const A = P(j), B = P(j + 1); return [lerp(A[0], B[0], f), lerp(A[1], B[1], f)];
  }
  // smile: vành mặt + hai mắt + miệng
  if (i < n * .55) { const a = u / .55 * TAU; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; }
  if (i < n * .65) return [cx - R * .38 + (i % 2) * 8, cy - R * .3];
  if (i < n * .75) return [cx + R * .38 - (i % 2) * 8, cy - R * .3];
  const v = (u - .75) / .25; return [cx + R * .55 * Math.cos(Math.PI * (1 - v)) * -1, cy + R * .18 + R * .38 * Math.sin(Math.PI * v)];
}

/* ---------- lò xo cạnh chân sau (bí mật 3): nén lại khi Hop co chân, bật ra khi nhảy ---------- */
export function coil(c, x, y, w, h, sq, a = 1) {
  if (a <= 0) return;
  const hh = h * (1 - .55 * sq), n = 6;
  c.save(); c.globalAlpha *= a; c.lineJoin = c.lineCap = 'round';
  const pts = [[x, y]]; for (let i = 0; i < n; i++) pts.push([x + (i % 2 ? -w / 2 : w / 2), y - hh * (i + .5) / n]); pts.push([x, y - hh]);
  for (const [col, lw] of [[C.ink, 14], [C.lemon, 8]]) { c.strokeStyle = col; c.lineWidth = lw; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); }
  for (const yy of [y, y - hh]) { rrect(c, x - w * .6, yy - 5, w * 1.2, 10, 5, C.ink); rrect(c, x - w * .55, yy - 3, w * 1.1, 6, 3, C.tang); }
  c.restore();
}

/* ---------- lá cỏ thổi còi của Crumb (vẽ trong tay, toạ độ đang vẽ) ---------- */
export function blade(c, x, y, len, rot, a = 1) {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot);
  const o = len * .045;                                                          // viền mực theo cỡ lá (vẽ được cả trong rig lẫn toạ độ khung)
  c.fillStyle = C.ink; c.beginPath(); c.ellipse(0, 0, len * .5 + o, len * .1 + o, 0, 0, TAU); c.fill();
  c.fillStyle = N.sage; c.beginPath(); c.ellipse(0, 0, len * .5, len * .1, 0, 0, TAU); c.fill();
  c.strokeStyle = N.sageD; c.lineWidth = len * .02; c.beginPath(); c.moveTo(-len * .45, 0); c.lineTo(len * .45, 0); c.stroke();
  c.restore();
}

/* ---------- chữ to (toạ độ khung) ---------- */
export function bigWord(c, s, x, y, px, fill, t, t0, t1, o = {}) {
  if (t < t0 || t > t1) return;
  const pu = 1 + .14 * Math.sin(Math.PI * seg(t, t0, t0 + .25)), fade = 1 - ss(seg(t, t1 - .2, t1));
  c.save(); c.globalAlpha *= fade; c.translate(x, y); c.rotate(o.rot || 0); c.scale(pu, pu); c.translate(-x, -y);
  popText(c, s, x, y, px, fill, C.ink, t, t0, { step: .03, sh: px * .075 }); c.restore();
}
// dấu hỏi nhỏ nảy trên đầu (móc 2–3 s)
export function qmark(c, x, y, s, a) {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= a; popText(c, '?', x, y, 70 * s, C.cream, C.ink, -1, -1, { read: false, sh: 5 }); c.restore();
}
