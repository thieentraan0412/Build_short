// Đạo cụ cảnh (không phải nhân vật): chép từ cast.js của pilot để khu vườn giống hệt tập trước.
// Nhân vật lấy từ _shared/characters, không vẽ ở đây.
import { C, circle, ell, capsule, rrect, poly, TAU, lerp } from '/_shared/kit.js';

export function flower(c, x, y, r, o = {}) {
  const { n = 6, petal = C.mango, heart = C.berry, stem = 0, leafy = 1, sway = 0, open = 1 } = o;
  if (stem) { capsule(c, x, y, x + sway * .3, y + stem, r * .16, C.leaf); if (leafy) { ell(c, x + r * .5, y + stem * .55, r * .52, r * .2, -.5, C.leaf); ell(c, x - r * .5, y + stem * .75, r * .52, r * .2, .5, C.leafD); } }
  for (let i = 0; i < n; i++) { const a = i * TAU / n + .2 + sway * .002; circle(c, x + Math.cos(a) * r * .62 * open, y + Math.sin(a) * r * .62 * open, r * .46 * open, petal); }
  circle(c, x, y, r * .44, heart);
}
export function cloud(c, x, y, s, f = C.cream) { circle(c, x, y, s * .5, f); circle(c, x + s * .55, y + s * .08, s * .38, f); circle(c, x - s * .55, y + s * .1, s * .34, f); rrect(c, x - s * .9, y + s * .1, s * 1.8, s * .34, s * .17, f); }
export function sun(c, x, y, r, rot = 0) { for (let i = 0; i < 10; i++) { const a = rot + i * TAU / 10; capsule(c, x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3, x + Math.cos(a) * r * 1.62, y + Math.sin(a) * r * 1.62, r * .16, C.lemon); } circle(c, x, y, r, C.lemon); }

export function iceCream(c, x, y, s, sq = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  poly(c, [[-92, 0], [92, 0], [0, 210]], '#E8A85C');                     // ốc quế
  c.save(); c.beginPath(); c.moveTo(-92, 0); c.lineTo(92, 0); c.lineTo(0, 210); c.closePath(); c.clip();
  for (let i = -5; i < 7; i++) { capsule(c, i * 36 - 60, 0, i * 36 + 60, 210, 6, '#C98638'); capsule(c, i * 36 + 60, 0, i * 36 - 60, 210, 6, '#C98638'); }
  c.restore();
  const k = lerp(1, .42, sq), w = lerp(1, 1.5, sq);                        // kem bị ép dẹt khi giẫm
  c.save(); c.scale(w, k);
  circle(c, 0, -46, 110, C.pink); circle(c, -60, -28, 56, C.pink); circle(c, 60, -28, 56, C.pink);
  if (sq < .2) { circle(c, 0, -146, 12, C.berry); ell(c, -30, -120, 8, 14, .4, C.mint); ell(c, 34, -112, 8, 14, -.5, C.lemon); }
  c.restore();
  if (sq > .3) for (const [dx, h] of [[-120, 62], [-74, 92], [66, 74], [124, 52]]) capsule(c, dx, 6, dx, 6 + h * sq, 28, C.pink);
  c.restore();
}
// bóng đổ mềm dưới nhân vật
export const shadow = (c, x, y, w, a = .16) => { c.fillStyle = `rgba(30,27,58,${a})`; c.beginPath(); c.ellipse(x, y, w, w * .17, 0, 0, TAU); c.fill(); };
// sticker tròn có hình nhân vật bên trong (trang sổ)
export function badge(c, x, y, r, fill, draw, rot = 0, s = 1) {
  if (s <= 0) return;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  circle(c, 8, 10, r, 'rgba(30,27,58,.18)'); circle(c, 0, 0, r, fill); circle(c, 0, 0, r * .9, fill);
  c.save(); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.clip(); draw(c); c.restore();
  c.restore();
}
