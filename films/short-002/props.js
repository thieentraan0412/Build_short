// Đạo cụ cảnh của SHORT-002 (không phải nhân vật): miếng dưa hấu, khăn picnic, bụi cây, mây, mặt trời.
import { C, circle, ell, capsule, rrect, poly, TAU } from '/_shared/kit.js';
import { X } from '/_shared/characters/parts.js';

export function cloud(c, x, y, s, f = C.cream) { circle(c, x, y, s * .5, f); circle(c, x + s * .55, y + s * .08, s * .38, f); circle(c, x - s * .55, y + s * .1, s * .34, f); rrect(c, x - s * .9, y + s * .1, s * 1.8, s * .34, s * .17, f); }
export function sun(c, x, y, r, rot = 0) { for (let i = 0; i < 10; i++) { const a = rot + i * TAU / 10; capsule(c, x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3, x + Math.cos(a) * r * 1.62, y + Math.sin(a) * r * 1.62, r * .16, C.lemon); } circle(c, x, y, r, C.lemon); }
export function flower(c, x, y, r, petal = C.mango, heart = C.cream) {
  for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + .2; circle(c, x + Math.cos(a) * r * .62, y + Math.sin(a) * r * .62, r * .46, petal); }
  circle(c, x, y, r * .44, heart);
}

// khăn picnic ca-rô: nền kem, sọc xoài nhạt, ô giao nhau xoài (ba tông phẳng, không trong suốt)
export function gingham(c, x0, y0, x1, y1, s) {
  c.fillStyle = C.cream; c.fillRect(x0, y0, x1 - x0, y1 - y0);
  const nx = Math.ceil((x1 - x0) / s), ny = Math.ceil((y1 - y0) / s);
  c.fillStyle = C.mangoL;
  for (let i = 0; i < nx; i += 2) c.fillRect(x0 + i * s, y0, s, y1 - y0);
  for (let j = 0; j < ny; j += 2) c.fillRect(x0, y0 + j * s, x1 - x0, s);
  c.fillStyle = C.mango;
  for (let i = 0; i < nx; i += 2) for (let j = 0; j < ny; j += 2) c.fillRect(x0 + i * s, y0 + j * s, s, s);
}

// miếng dưa hấu nằm ngửa: nửa đĩa, mặt cắt phẳng ở trên (bướm đứng trên đó), vỏ ở cung dưới. (x, y) = tâm mặt cắt.
export function watermelon(c, x, y, R, o = {}) {
  const { bite = 0 } = o, half = (col, r) => { c.fillStyle = col; c.beginPath(); c.moveTo(x - r, y); c.arc(x, y, r, 0, Math.PI); c.closePath(); c.fill(); };
  half(C.leafD, R); half(C.leaf, R * .93); half(C.mintL, R * .86); half(X.pinkD, R * .8);
  // hạt dưa: giọt mực xếp theo cung
  for (let i = 0; i < 9; i++) {
    const a = .28 + i * (Math.PI - .56) / 8, rr = R * (.48 + (i % 2) * .14), sx = x + Math.cos(a) * rr, sy = y + Math.sin(a) * rr;
    c.save(); c.translate(sx, sy); c.rotate(a - Math.PI / 2); c.fillStyle = C.ink; c.beginPath(); c.ellipse(0, 0, R * .026, R * .045, 0, 0, TAU); c.fill(); c.restore();
  }
  // mặt cắt nhìn hơi từ trên xuống: elip hồng sáng, viền vỏ ở hai đầu
  ell(c, x, y, R, R * .1, 0, C.leaf); ell(c, x, y, R * .93, R * .085, 0, C.mintL); ell(c, x, y, R * .8, R * .07, 0, C.pink);
  if (bite) circle(c, x + R * .82, y - R * .02, R * .1 * bite, C.sky);
}
// giọt nước dưa
export const drop = (c, x, y, r, col = C.berry) => { c.fillStyle = col; c.beginPath(); c.moveTo(x, y - r * 1.7); c.quadraticCurveTo(x + r * 1.05, y - r * .2, x, y + r); c.quadraticCurveTo(x - r * 1.05, y - r * .2, x, y - r * 1.7); c.fill(); circle(c, x, y, r * .98, col); };
