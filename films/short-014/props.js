// Đạo cụ và bối cảnh của SHORT-014: khoảng trống bồ công anh lúc chiều vàng (trời xanh hoa ngô nhạt dần về dải vàng ở chân trời,
// mặt trời thấp bên phải, đồi xa, bông bồ công anh và hạt bay, cỏ cao xa), hòn đá phẳng màu oải hương làm "sân khấu",
// vụn bánh của Crumb (đạo cụ của gag), màng nhĩ vẽ to của Hop (đặt vào rig qua drawChar extra), vòng sóng âm, sóng "ục ục" của bụng.
// Nền phẳng, dịu, ít chi tiết để nhân vật viền mực (LOOK.v = 2) nổi lên; đạo cụ gần nhân vật có viền mực mảnh cho hợp với nhân vật.
import { C, circle, ell, rrect, poly, capsule, popText, TAU } from '/_shared/kit.js';
import { hash, lerp, clamp, seg, ss, eo, back } from '/core/lib.js';
import { HOP_COL } from '/_shared/characters/cast/hop.js';
import { DUR } from './timeline.js';
// mọi chuyển động nền tuần hoàn theo độ dài phim, để khung cuối khớp khung đầu (vòng lặp)
const W = n => n * TAU / DUR;

export const D = {
  sky0: '#6A9FEE', sky1: '#88B5F3', sky2: '#AECBF2', gold0: '#FFE2A2', gold1: '#FFCF78', gold2: '#FFBD5C',
  sun: '#FFF1BF', sunL: '#FFFBE6', hill0: '#B2D97E', hill1: '#9BCB68', hill2: '#86BE5A',
  grassF: '#86BE63', grassD: '#6EAA52', stem: '#7DB05A', puff: '#FFFDF4', puffD: '#E9E4F3',
  stone: '#D3C3F0', stoneT: '#E2D6F6', stoneS: '#B4A0E0', stoneD: '#9580CF', rim: '#FFE09A',
  ground: '#5DB35E', groundD: '#479B4D', groundL: '#77C46F', clover: '#3E9147', flower: '#FFC32B', flowerD: '#F0A616',
  ink: '#1E1B3A', rumble: '#FF9A3C', ring: '#FFE34D',
};
export const GY = 1195;                       // mặt hòn đá nơi nhân vật đứng (toạ độ cảnh)

/* ---------- trời chiều vàng: dải phẳng, mặt trời thấp, đồi xa, bông bồ công anh xa ---------- */
export const SUN = { x: 830, y: 905, r: 120 };
export function sky(c, t, o = {}) {
  c.fillStyle = D.sky0; c.fillRect(-1600, -1600, 4300, 3800);
  for (const [y, h, col] of [[640, 1200, D.sky1], [820, 1000, D.sky2], [930, 820, D.gold0], [1010, 640, D.gold1], [1070, 480, D.gold2]]) ell(c, 560, y + h * .5, 2100, h * .5, 0, col);
  if (!o.noSun) { for (const [m, a] of [[2.3, .16], [1.6, .26]]) circle(c, SUN.x, SUN.y, SUN.r * m, `rgba(255,248,210,${a})`); circle(c, SUN.x, SUN.y, SUN.r, D.sun); circle(c, SUN.x - 18, SUN.y - 16, SUN.r * .62, D.sunL); }
  // hai đám mây dẹt trôi rất chậm (chiều sâu)
  for (const [x0, y0, s] of [[120, 520, 1], [760, 430, .8]]) { const x = x0 + 50 * Math.sin(W(1) * t + x0); for (const [dx, dy, r] of [[0, 0, 70], [70, -26, 60], [140, 0, 62], [70, 14, 64]]) circle(c, x + dx * s, y0 + dy * s, r * s, 'rgba(255,253,244,.72)'); }
  ell(c, 60, 1110, 820, 150, 0, D.hill0); ell(c, 1060, 1120, 820, 170, 0, D.hill1); ell(c, 560, 1160, 1300, 120, 0, D.hill2);
  // cỏ cao xa và bồ công anh xa (lắc nhẹ)
  for (let i = 0; i < 46; i++) { const gx = -420 + i * 44, h = 60 + hash(i + 33) * 120, sw = Math.sin(W(5) * t + i * .7) * 6; poly(c, [[gx - 11, 1185], [gx + 11, 1185], [gx + sw, 1185 - h]], i % 3 ? D.grassF : D.grassD); }
  for (let i = 0; i < 9; i++) { const x = -260 + i * 190 + hash(i + 7) * 60, h = 130 + hash(i + 70) * 120, sw = Math.sin(W(4) * t + i) * 8; capsule(c, x, 1185, x + sw, 1185 - h, 5, D.stem); puffball(c, x + sw, 1185 - h, 26 + hash(i + 9) * 10, Math.sin(W(3) * t + i), .9); }
}
// bông bồ công anh đã thành hạt: chấm giữa + tia hạt + vòng hạt
export function puffball(c, x, y, r, t, a = 1) {
  c.save(); c.globalAlpha *= a;
  circle(c, x, y, r, 'rgba(255,253,244,.55)');
  c.strokeStyle = D.puff; c.lineWidth = Math.max(1.5, r * .06); c.lineCap = 'round';
  for (let k = 0; k < 14; k++) { const g = k / 14 * TAU + t * .05; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(g) * r * .92, y + Math.sin(g) * r * .92); c.stroke(); circle(c, x + Math.cos(g) * r * .95, y + Math.sin(g) * r * .95, r * .1, D.puff); }
  circle(c, x, y, r * .2, D.puffD);
  c.restore();
}
// một hạt bồ công anh bay (cuống + túm lông)
export function seed(c, x, y, s, rot) {
  c.save(); c.translate(x, y); c.rotate(rot); c.strokeStyle = D.puff; c.lineCap = 'round'; c.lineWidth = 2.2 * s;
  c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 22 * s); c.stroke();
  for (let k = -3; k <= 3; k++) { const g = -Math.PI / 2 + k * .32; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(g) * 16 * s, Math.sin(g) * 16 * s); c.stroke(); }
  circle(c, 0, 24 * s, 3 * s, '#C8B38A'); c.restore();
}
// hạt bay ngang khung (lớp giữa, trôi theo gió)
export function seeds(c, t, n = 7) {
  for (let i = 0; i < n; i++) {
    const m = 1 + (i % 2), x = -200 + ((t / DUR * 1500 * m + hash(i + 41) * 1500) % 1500), y = 700 + hash(i + 42) * 380 + Math.sin(W(6) * t + i * 2) * 26;
    seed(c, x, y, .8 + hash(i + 43) * .5, Math.sin(W(7) * t + i) * .4);
  }
}

/* ---------- hòn đá phẳng (sân khấu) và đất cỏ phía trước ---------- */
export const STONE = { x: 560, y: GY, rx: 700, ry: 80 };
export function stone(c) {
  // đất cỏ phía sau và hai bên hòn đá
  rrect(c, -900, 1150, 2900, 1300, 0, D.ground);
  ell(c, STONE.x + 20, STONE.y + 150, STONE.rx + 30, 170, 0, D.groundD);
  // thân đá: cạnh bên tối, mặt trên sáng, vành nắng ở mép sau
  ell(c, STONE.x, STONE.y + 70, STONE.rx, STONE.ry + 60, 0, D.stoneD);
  ell(c, STONE.x, STONE.y + 38, STONE.rx, STONE.ry + 34, 0, D.stoneS);
  ell(c, STONE.x, STONE.y, STONE.rx, STONE.ry, 0, D.stone);
  ell(c, STONE.x - 40, STONE.y - 8, STONE.rx * .82, STONE.ry * .62, 0, D.stoneT);
  c.strokeStyle = D.rim; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.ellipse(STONE.x, STONE.y, STONE.rx - 6, STONE.ry - 5, 0, Math.PI * 1.08, Math.PI * 1.92); c.stroke();
  // vài vết rỗ nhỏ trên mặt đá
  for (const [x, y, r] of [[250, 1215, 14], [820, 1222, 11], [430, 1236, 8], [960, 1200, 9]]) ell(c, x, y, r * 1.6, r * .55, 0, D.stoneS);
}
// tiền cảnh: cỏ và bông bồ công anh vàng ở hai góc dưới, trôi nhanh hơn máy (px = độ lệch thị sai đã tính sẵn theo máy)
export function foreground(c, t, px = 0) {
  rrect(c, -900, 1330, 2900, 1000, 0, D.groundD);
  for (let i = 0; i < 30; i++) { const x = -500 + i * 72 + px, h = 90 + hash(i + 90) * 110, sw = Math.sin(W(6) * t + i) * 9; poly(c, [[x - 16, 1360], [x + 16, 1360], [x + sw, 1360 - h]], i % 2 ? D.ground : D.groundL); }
  for (const [x, y, r] of [[-60, 1395, 70], [1120, 1405, 66]]) { flower(c, x + px * 1.2, y, r, t); }
  for (let i = 0; i < 12; i++) { const x = -400 + i * 170 + px * 1.1; clover(c, x, 1430 + (i % 2) * 40, 34, t + i); }
}
export function flower(c, x, y, r, t) {
  const sw = Math.sin(W(5) * t + x) * .06;
  capsule(c, x, y + 260, x, y, 10, D.stem);
  c.save(); c.translate(x, y); c.rotate(sw);
  for (let k = 0; k < 18; k++) { const g = k / 18 * TAU; ell(c, Math.cos(g) * r * .55, Math.sin(g) * r * .55, r * .5, r * .16, g, k % 2 ? D.flower : D.flowerD); }
  circle(c, 0, 0, r * .36, D.flowerD); circle(c, 0, 0, r * .24, D.flower);
  c.restore();
}
export function clover(c, x, y, r, t) {
  const sw = Math.sin(W(4) * t) * 3;
  for (let k = 0; k < 3; k++) { const g = -Math.PI / 2 + (k - 1) * 1.15; circle(c, x + sw + Math.cos(g) * r * .55, y + Math.sin(g) * r * .55, r * .52, D.clover); }
}

/* ---------- vụn bánh của Crumb (đạo cụ của gag, có từ khung 0) ---------- */
export function cookie(c, x, y, s = 1, t = 0, bite = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  ell(c, 4, 6, 50, 14, 0, 'rgba(30,27,58,.16)');
  c.fillStyle = C.honeyL; c.beginPath(); c.ellipse(0, -26, 44, 32, -.08, 0, TAU); c.fill();
  c.strokeStyle = D.ink; c.lineWidth = 4; c.stroke();
  c.fillStyle = C.honey; c.beginPath(); c.ellipse(-6, -14, 34, 14, -.08, 0, Math.PI); c.fill();
  for (const [a, b, r] of [[-18, -36, 6], [12, -40, 5], [20, -20, 6], [-4, -24, 4], [-24, -18, 4]]) circle(c, a, b, r, C.honeyD);
  circle(c, -14, -44, 7, 'rgba(255,248,231,.55)');
  c.restore();
}

/* ---------- màng nhĩ vẽ to trên bụng Hop (qua drawChar extra) ----------
   Đặt đúng chỗ màng nghe của rig (hai bên đốt bụng đầu, cast/hop.js), to hơn một chút để thấy rõ trong kính:
   vành sẫm, màng mỏng sáng dần khi "nghe" (glow), các vòng gợn chạy từ tâm ra (ripples: pha 0..1), tâm màng rung (vib, px rig). */
export function drumExtra(P, D2 = {}) {
  const { glow = 0, ripples = [], vib = 0, size = .2 } = D2;
  return r => {
    const L = P.lift || 0, cr = P.crouch || 0, AC = [0, -.8 - L + cr * .16, -.42], AR = [.36, .36, .8];
    for (const sd of [-1, 1]) r.decal(AC, AR, [sd * .95, -.05, .42], size, cc => drumFace(cc, glow, ripples, vib), { bias: .006, line: 'first' });
  };
}
export function drumFace(c, glow, ripples, vib) {
  c.fillStyle = HOP_COL.earRim; c.beginPath(); c.arc(0, 0, 1.22, 0, TAU); c.fill();
  const mem = glow > .02 ? lerpCol('#FFF8E7', '#B8FBE6', clamp(glow)) : '#FFF8E7';
  c.fillStyle = mem; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill();
  // tâm màng nảy ra vào: một vùng sáng lệch theo vib
  c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(vib * .18, vib * .1, .46 + .08 * Math.abs(vib), .4, 0, 0, TAU); c.fill();
  c.strokeStyle = 'rgba(46,160,130,.85)'; c.lineCap = 'round';
  for (const p of ripples) { if (p <= 0 || p >= 1) continue; c.lineWidth = .16 * (1 - p) + .03; c.globalAlpha = 1 - p * .8; c.beginPath(); c.arc(0, 0, .12 + .86 * p, 0, TAU); c.stroke(); }
  c.globalAlpha = 1;
  if (glow > .05) { c.strokeStyle = `rgba(123,240,208,${.9 * glow})`; c.lineWidth = .1; c.beginPath(); c.arc(0, 0, 1.1, 0, TAU); c.stroke(); }
  c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = .09; c.beginPath(); c.arc(0, 0, .74, Math.PI * 1.1, Math.PI * 1.45); c.stroke();
}
function lerpCol(a, b, t) { const p = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)), A = p(a), B = p(b); return '#' + A.map((x, i) => Math.round(x + (B[i] - x) * t).toString(16).padStart(2, '0')).join(''); }

/* ---------- vòng sóng âm: từ nguồn (src) bay tới màng nhĩ (dst); emits: các lúc phát ra; speed px/s (toạ độ đang vẽ) ---------- */
export function soundRings(c, t, src, dst, emits, speed, col = D.ring, w = 7, span = .55) {
  const dx = dst[0] - src[0], dy = dst[1] - src[1], dist = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
  c.lineCap = 'round';
  for (const te of emits) {
    const d = (t - te) * speed; if (d <= 4 || d > dist + 10) continue;
    const k = d / dist, al = Math.min(1, 1.4 - k) * Math.min(1, d / 30);
    for (const [off, ww] of [[0, 1], [-w * 2.2, .6]]) {
      const R = d + off; if (R <= 2) continue;
      const a0 = a - span * (1 - .35 * k), a1 = a + span * (1 - .35 * k);
      c.globalAlpha = Math.max(0, al) * (off ? .7 : 1);
      c.strokeStyle = D.ink; c.lineWidth = w * ww + w * .7; c.beginPath(); c.arc(src[0], src[1], R, a0, a1); c.stroke();   // viền mực: đọc được trên nền sáng và trên kính
      c.strokeStyle = col; c.lineWidth = w * ww; c.beginPath(); c.arc(src[0], src[1], R, a0, a1); c.stroke();
    }
  }
  c.globalAlpha = 1;
}
export const arrive = (te, src, dst, speed) => te + Math.hypot(dst[0] - src[0], dst[1] - src[1]) / speed;
// sóng "ục ục" của bụng Crumb: vòng cung lượn sóng màu cam, bay về phía màng nhĩ
export function rumbleWaves(c, t, src, dst, emits, speed, w = 9) {
  const dx = dst[0] - src[0], dy = dst[1] - src[1], dist = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
  c.lineCap = 'round'; c.lineJoin = 'round';
  for (const te of emits) {
    const d = (t - te) * speed; if (d <= 4 || d > dist + 10) continue;
    const al = Math.min(1, 1.3 - d / dist) * Math.min(1, d / 30);
    c.globalAlpha = Math.max(0, al);
    c.beginPath();
    for (let i = 0; i <= 24; i++) { const g = a - .6 + 1.2 * i / 24, R = d + 6 * Math.sin(i * 1.6 + t * 30); const x = src[0] + Math.cos(g) * R, y = src[1] + Math.sin(g) * R; i ? c.lineTo(x, y) : c.moveTo(x, y); }
    c.strokeStyle = D.ink; c.lineWidth = w * 1.7; c.stroke();                       // viền mực
    c.strokeStyle = D.rumble; c.lineWidth = w; c.stroke();
  }
  c.globalAlpha = 1;
}
// đám bụi nhỏ khi Hop bật lên / đáp xuống (p 0..1)
export function puff(c, x, y, p, s = 1) {
  if (p <= 0 || p >= 1) return;
  for (let i = 0; i < 6; i++) { const g = Math.PI + i / 5 * Math.PI, d = (30 + 70 * eo(p)) * s; circle(c, x + Math.cos(g) * d * 1.4, y + Math.sin(g) * d * .35 - 6, (16 + 14 * p) * s * (1 - p * .6), `rgba(255,253,244,${.85 * (1 - p)})`); }
}
// "!" bật lên (toạ độ khung)
export function bang(c, x, y, p, px = 120) {
  if (p <= 0) return; const s = back(clamp(p * 3), 2.6);
  c.save(); c.translate(x, y); c.scale(s, s); popText(c, '!', 0, px * .36, px, C.lemon, C.ink, -1, -1, { sh: px * .08, read: false }); c.restore();
}
// vòng gợn dưới đáy chân trên trang sổ
export { lerpCol };
