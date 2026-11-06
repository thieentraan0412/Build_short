// Đạo cụ của SHORT-004: mặt đất khu vườn, kiến thợ, rệp, giọt ngọt, tấm bản đồ bé xíu, cây kem của tập 1.
// Khối phẳng, không viền, không gradient (Khối Kẹo Phẳng).
import { C, circle, ell, capsule, rrect, poly, lerp, TAU } from '/_shared/kit.js';

// cây kem của tập 1 (giống films/short-001/props.js: cùng một đạo cụ của kênh). tilt: nghiêng quanh mũi ốc quế
export function iceCream(c, x, y, s, sq = 0, tilt = 0) {
  c.save(); c.translate(x, y + 210 * s); c.rotate(tilt); c.translate(0, -210 * s); c.scale(s, s);
  poly(c, [[-92, 0], [92, 0], [0, 210]], '#E8A85C');
  c.save(); c.beginPath(); c.moveTo(-92, 0); c.lineTo(92, 0); c.lineTo(0, 210); c.closePath(); c.clip();
  for (let i = -5; i < 7; i++) { capsule(c, i * 36 - 60, 0, i * 36 + 60, 210, 6, '#C98638'); capsule(c, i * 36 + 60, 0, i * 36 - 60, 210, 6, '#C98638'); }
  c.restore();
  const k = lerp(1, .42, sq), w = lerp(1, 1.5, sq);
  c.save(); c.scale(w, k);
  circle(c, 0, -46, 110, C.pink); circle(c, -60, -28, 56, C.pink); circle(c, 60, -28, 56, C.pink);
  if (sq < .2) { circle(c, 0, -146, 12, C.berry); ell(c, -30, -120, 8, 14, .4, C.mint); ell(c, 34, -112, 8, 14, -.5, C.lemon); }
  c.restore(); c.restore();
}
// kiến thợ (không phải Crumb): đầu nhỏ hơn, màu nâu đậm, râu gập khuỷu. Nhìn nghiêng, mặt quay theo dir (1 = phải).
// ph: pha bước chân; tap: 0..1 râu trước hạ xuống chạm; sip: cúi đầu
export function workerAnt(c, x, y, s, ph = 0, o = {}) {
  const dir = o.dir ?? 1, col = o.col || '#7A3A10', dark = o.dark || '#4E2408', tap = o.tap || 0;
  c.save(); c.translate(x, y); c.scale(dir, 1);
  for (let i = 0; i < 3; i++) {                                  // 6 chân, bước luân phiên
    for (const sd of [-1, 1]) {
      const a = Math.sin(ph * TAU + i * 2.1 + (sd > 0 ? Math.PI : 0)), hx = (-.32 + i * .32) * s, fx = hx + (i - 1) * .2 * s + a * .16 * s;
      capsule(c, hx, -.42 * s, (hx + fx) / 2 + .08 * s, -.62 * s + Math.max(0, a) * -.1 * s, .07 * s, sd > 0 ? dark : col);
      capsule(c, (hx + fx) / 2 + .08 * s, -.62 * s, fx, -Math.max(0, -a) * .08 * s, .06 * s, sd > 0 ? dark : col);
    }
  }
  ell(c, -.72 * s, -.55 * s, .42 * s, .3 * s, -.2, col);       // bụng
  ell(c, -.08 * s, -.58 * s, .26 * s, .17 * s, 0, col);        // ngực
  const hy = -.66 * s - (o.sip || 0) * .1 * s;
  circle(c, .38 * s, hy, .22 * s, col);                         // đầu
  circle(c, .46 * s, hy - .04 * s, .055 * s, C.ink); circle(c, .48 * s, hy - .06 * s, .02 * s, C.cream);
  for (const [k, dy] of [[0, 0], [1, .03]]) {                    // hai râu gập khuỷu; râu trước có thể hạ xuống chạm
    const t2 = k === 0 ? tap : tap * .6, ex = .62 * s, ey = hy - .38 * s + dy * s, tipx = ex + lerp(.32, .44, t2) * s, tipy = ey + lerp(-.12, .36, t2) * s;
    capsule(c, .44 * s, hy - .14 * s, ex, ey, .045 * s, dark); capsule(c, ex, ey, tipx, tipy, .04 * s, dark);
  }
  c.restore();
}
// điểm đầu râu trước của kiến thợ (để vẽ tia "chạm")
export const antTip = (x, y, s, o = {}) => { const dir = o.dir ?? 1, tap = o.tap || 0, hy = -.66 * s - (o.sip || 0) * .1 * s; return [x + dir * (.62 + lerp(.32, .44, tap)) * s, y + hy - .38 * s + lerp(-.12, .36, tap) * s]; };
// rệp xanh tròn ủm ("bò tí hon"): thân lime, hai ống nhỏ sau lưng, mắt đen, sáu chân ngắn
export function aphid(c, x, y, s, o = {}) {
  const dir = o.dir ?? 1, sq = o.sq || 0;
  c.save(); c.translate(x, y); c.scale(dir, 1);
  for (let i = 0; i < 3; i++) capsule(c, (-.3 + i * .3) * s, -.15 * s, (-.38 + i * .34) * s, .02 * s, .06 * s, '#5FAE2E');
  ell(c, 0, -.42 * s * (1 - sq * .08), .62 * s, .42 * s * (1 - sq * .08), 0, C.lime);
  ell(c, -.12 * s, -.58 * s, .32 * s, .14 * s, -.2, '#D5F78F');                    // vệt sáng phẳng
  capsule(c, -.42 * s, -.62 * s, -.62 * s, -.86 * s, .07 * s, '#5FAE2E'); capsule(c, -.2 * s, -.72 * s, -.32 * s, -.98 * s, .07 * s, '#5FAE2E');   // hai ống
  circle(c, .48 * s, -.48 * s, .09 * s, C.ink); circle(c, .5 * s, -.5 * s, .03 * s, C.cream);
  capsule(c, .52 * s, -.66 * s, .9 * s, -.95 * s, .035 * s, '#5FAE2E');
  ell(c, .42 * s, -.3 * s, .06 * s, .04 * s, 0, C.pink);                           // má hồng
  c.restore();
}
// giọt ngọt (mật rệp): vàng mật, có vệt sáng kem
export function honeydew(c, x, y, r) { c.fillStyle = C.honeyL; c.beginPath(); c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r * 1.05, y - r * .1, x, y + r); c.quadraticCurveTo(x - r * 1.05, y - r * .1, x, y - r * 1.6); c.fill(); circle(c, x, y, r * .98, C.honeyL); circle(c, x - r * .3, y - r * .3, r * .28, C.cream); }
// tấm bản đồ bé xíu (giấy kem, đường đỏ đứt nét, dấu X)
export function tinyMap(c, x, y, w, h, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  rrect(c, -w / 2 + 4, -h / 2 + 6, w, h, w * .08, 'rgba(30,27,58,.25)'); rrect(c, -w / 2, -h / 2, w, h, w * .08, C.cream);
  c.setLineDash([w * .08, w * .07]); c.strokeStyle = C.berry; c.lineWidth = w * .05; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-w * .35, h * .25); c.quadraticCurveTo(-w * .05, -h * .35, w * .2, h * .05); c.stroke(); c.setLineDash([]);
  capsule(c, w * .2, -h * .05, w * .34, h * .15, w * .05, C.berry); capsule(c, w * .34, -h * .05, w * .2, h * .15, w * .05, C.berry);
  c.restore();
}
// mặt đất khu vườn: đất ấm, sỏi, cỏ
export function soil(c, x0, x1, y, h, t = 0) {
  rrect(c, x0, y, x1 - x0, h, 0, '#E9A65A');
  rrect(c, x0, y, x1 - x0, 26, 0, '#F2BC77');
  for (let x = x0 + 40, i = 0; x < x1; x += 137, i++) ell(c, x + (i % 3) * 23, y + 70 + (i * 53) % 160, 26 + (i % 4) * 8, 15 + (i % 3) * 5, 0, i % 2 ? '#D58E45' : '#F2BC77');
}
export function grassTuft(c, x, y, h, t, col = C.leaf, n = 5) {
  for (let i = 0; i < n; i++) { const dx = (i - (n - 1) / 2) * 22, sw = Math.sin(t * 1.4 + x * .01 + i) * h * .05; capsule(c, x + dx, y, x + dx * 1.7 + sw, y - h * (.6 + .4 * ((i * 7) % 3) / 2), 18, col); }
}
export function pebble(c, x, y, r, col = '#C9C2B8') { ell(c, x, y, r, r * .62, 0, col); ell(c, x - r * .25, y - r * .2, r * .4, r * .18, 0, '#E6E0D8'); }
export function cloud(c, x, y, s, f = C.cream) { circle(c, x, y, s * .5, f); circle(c, x + s * .55, y + s * .08, s * .38, f); circle(c, x - s * .55, y + s * .1, s * .34, f); rrect(c, x - s * .9, y + s * .1, s * 1.8, s * .34, s * .17, f); }
// vụn bánh to (to hơn Crumb): khối tròn méo màu mật sáng, vài hạt đậm
export function cookie(c, x, y, r, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.fillStyle = C.honeyL; c.beginPath();
  for (let i = 0; i <= 14; i++) { const a = i / 14 * TAU, rr = r * (1 + .08 * Math.sin(i * 2.7) + .05 * Math.cos(i * 4.1)); i ? c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * .82) : c.moveTo(Math.cos(a) * rr, Math.sin(a) * rr * .82); }
  c.closePath(); c.fill();
  ell(c, -r * .2, -r * .3, r * .5, r * .2, -.2, '#F7C46A');
  for (const [dx, dy, s] of [[-.4, .1, .12], [.25, -.15, .1], [.45, .3, .09], [-.05, .4, .08], [.1, .05, .07]]) circle(c, dx * r, dy * r, s * r, C.honeyD);
  c.restore();
}
// mạng nhện nhỏ ở góc (cho Spindle ló ra)
export function web(c, x, y, R, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.strokeStyle = 'rgba(255,248,231,.85)'; c.lineWidth = 3; c.lineCap = 'round';
  for (let i = 0; i < 6; i++) { const a = i / 5 * Math.PI / 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * R, Math.sin(a) * R); c.stroke(); }
  for (let k = 1; k <= 4; k++) { c.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 5 * Math.PI / 2, r = R * k / 4.4; i ? c.lineTo(Math.cos(a) * r, Math.sin(a) * r) : c.moveTo(Math.cos(a) * r, Math.sin(a) * r); } c.stroke(); }
  c.restore();
}
