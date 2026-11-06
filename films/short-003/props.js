// Đạo cụ của SHORT-003: sân khấu nấm dưới trăng. Khối phẳng, không viền, không gradient (Khối Kẹo Phẳng).
import { C, circle, ell, capsule, rrect, poly, TAU } from '/_shared/kit.js';
import { X } from '/_shared/characters/parts.js';

// trời đêm: sao nháy theo t (vị trí cố định theo seed)
export function stars(c, t, n = 30, w = 1080, h = 1300, seed = 3) {
  let s = seed; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) {
    const x = rnd() * w, y = rnd() * h, r = 3 + rnd() * 5, ph = rnd() * TAU;
    circle(c, x, y, r * (.75 + .25 * Math.sin(t * 2.4 + ph)), i % 4 ? C.grape : C.nightL);
  }
}
// trăng khuyết: đĩa kem bị một đĩa màu trời che bớt
export function moon(c, x, y, r, sky = C.night) { circle(c, x, y, r, C.cream); circle(c, x + r * .45, y - r * .22, r * .86, sky); }
// một khóm cỏ đêm, đung đưa
export function grass(c, x, y, h, t, col = X.nightD, n = 5, w = 16) {
  for (let i = 0; i < n; i++) { const dx = (i - (n - 1) / 2) * w * 1.3, sw = Math.sin(t * 1.3 + x * .01 + i) * h * .05; capsule(c, x + dx, y, x + dx * 1.6 + sw, y - h * (.7 + .3 * ((i * 7) % 3) / 2), w, col); }
}
// cây nấm làm sân khấu. (x, top): đỉnh mũ nấm; R: nửa bề ngang mũ
export function mushroom(c, x, top, R) {
  const H = R * .5, cy = top + H;
  rrect(c, x - R * .26, cy - R * .05, R * .52, R * 2.2, R * .2, C.cream);                 // thân
  rrect(c, x - R * .26, cy - R * .05, R * .12, R * 2.2, R * .06, '#EBDDBC');             // một vệt tối phẳng bên trái thân
  ell(c, x, cy + R * .05, R * .92, R * .2, 0, C.berryD);                                  // mặt dưới mũ
  c.fillStyle = C.berry; c.beginPath(); c.ellipse(x, cy, R, H, 0, Math.PI, TAU); c.closePath(); c.fill();   // mũ (nửa elip)
  ell(c, x, cy, R, H * .22, 0, C.berry);
  for (const [dx, dy, r] of [[-.55, -.25, .13], [-.12, -.62, .11], [.32, -.38, .15], [.7, -.12, .08], [-.82, -.02, .07]]) ell(c, x + dx * R, cy + dy * H * 1.6, r * R, r * R * .7, 0, C.cream);
}
// con dế ở xa: bóng tối nhỏ trên ngọn cỏ (không phải nhân vật có tên; chỉ là nguồn tiếng gáy)
export function farCricket(c, x, y, s, wing = 0, col = X.nightD) {   // quay sang trái (về phía Chirp)
  ell(c, x, y, s * .62, s * .22, .12, col);
  ell(c, x + s * .1, y - s * .14 - wing * s * .08, s * .5, s * .12, .2 + wing * .15, col);   // cánh rung khi gáy
  circle(c, x - s * .55, y - s * .04, s * .17, col);
  capsule(c, x - s * .6, y - s * .14, x - s * 1.2, y - s * .62, s * .045, col);
  capsule(c, x - s * .5, y - s * .14, x - s * .9, y - s * .7, s * .045, col);
  for (const dx of [-.3, .05, .35]) capsule(c, x + dx * s, y + s * .12, x + dx * s + s * .12, y + s * .34, s * .07, col);
  capsule(c, x + s * .35, y - s * .02, x + s * .95, y - s * .45, s * .1, col); capsule(c, x + s * .95, y - s * .45, x + s * 1.1, y + s * .3, s * .06, col);   // chân sau gập cao
}
// nốt nhạc phẳng (móc đơn) — khi Chirp gáy
export function note(c, x, y, s, col = C.lime, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  ell(c, 0, 0, s * .42, s * .3, -.4, col); rrect(c, s * .3, -s * 1.25, s * .13, s * 1.25, s * .05, col);
  poly(c, [[s * .36, -s * 1.25], [s * .95, -s * .85], [s * .9, -s * .6], [s * .36, -s * .95]], col);
  c.restore();
}
