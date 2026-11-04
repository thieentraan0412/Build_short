// Đạo cụ phẳng dùng trong các bảng tư thế và bảng tương tác (toạ độ 2D của ô, hoặc toạ độ nhân vật trong props()).
import { C, circle, capsule, rrect } from '../kit.js';
import { X } from './parts.js';
import { star } from './face.js';
import { GLASS } from './cast/loupe.js';
const TAU = Math.PI * 2;
const circ = (c, x, y, r, f) => { c.fillStyle = f; c.beginPath(); c.arc(x, y, Math.max(0, r), 0, TAU); c.fill(); };

// mây và mặt trời của khu vườn (giống hệt cast.js của pilot)
export function cloud(c, x, y, s, f = C.cream) { circle(c, x, y, s * .5, f); circle(c, x + s * .55, y + s * .08, s * .38, f); circle(c, x - s * .55, y + s * .1, s * .34, f); rrect(c, x - s * .9, y + s * .1, s * 1.8, s * .34, s * .17, f); }
export function sun(c, x, y, r, rot = 0) { for (let i = 0; i < 10; i++) { const a = rot + i * TAU / 10; capsule(c, x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3, x + Math.cos(a) * r * 1.62, y + Math.sin(a) * r * 1.62, r * .16, C.lemon); } circle(c, x, y, r, C.lemon); }

export function flower2(c, x, y, r, petal = C.berry, heart = C.lemon, stem = 0) {
  if (stem) { c.strokeStyle = C.leaf; c.lineWidth = r * .22; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + stem); c.stroke(); c.fillStyle = C.leafD; c.beginPath(); c.ellipse(x + r * .5, y + stem * .6, r * .5, r * .2, -.5, 0, TAU); c.fill(); }
  for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + .2; circ(c, x + Math.cos(a) * r * .62, y + Math.sin(a) * r * .62, r * .46, petal); }
  circ(c, x, y, r * .44, heart);
}
export function leaf2(c, x, y, s, a = 0, col = C.leaf) {
  c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, s, s * .45, 0, 0, TAU); c.fill();
  c.strokeStyle = C.leafD; c.lineWidth = s * .08; c.lineCap = 'round'; c.beginPath(); c.moveTo(-s * .9, 0); c.lineTo(s * .8, 0); c.stroke(); c.restore();
}
export function sticker2(c, x, y, s, col = C.lemon, a = -.08) {
  c.save(); c.translate(x, y); c.rotate(a);
  c.fillStyle = 'rgba(30,27,58,.2)'; c.beginPath(); c.roundRect(-s + s * .08, -s * .72 + s * .1, s * 2, s * 1.44, s * .3); c.fill();
  c.fillStyle = C.cream; c.beginPath(); c.roundRect(-s, -s * .72, s * 2, s * 1.44, s * .3); c.fill();
  star(c, 0, 0, s * .55, col); c.restore();
}
export function drop2(c, x, y, r, col = C.skyL) { c.fillStyle = col; c.beginPath(); c.moveTo(x, y - r * 1.8); c.quadraticCurveTo(x + r * 1.1, y - r * .2, x, y + r); c.quadraticCurveTo(x - r * 1.1, y - r * .2, x, y - r * 1.8); c.fill(); circ(c, x, y, r, col); circ(c, x - r * .35, y - r * .3, r * .25, C.white); }
export function note2(c, x, y, s, col = C.grape) { circ(c, x, y, s * .32, col); c.fillStyle = col; c.fillRect(x + s * .22, y - s * 1.1, s * .12, s * 1.1); c.beginPath(); c.moveTo(x + s * .34, y - s * 1.1); c.quadraticCurveTo(x + s * .9, y - s * .9, x + s * .7, y - s * .45); c.lineTo(x + s * .34, y - s * .75); c.fill(); }
export function nopeX(c, x, y, r) { circ(c, x, y, r, C.berry); c.strokeStyle = C.cream; c.lineWidth = r * .24; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - r * .42, y - r * .42); c.lineTo(x + r * .42, y + r * .42); c.moveTo(x + r * .42, y - r * .42); c.lineTo(x - r * .42, y + r * .42); c.stroke(); }
export function rings2(c, x, y, r0, n, col = C.sky, w = .06, a0 = -1, a1 = 1) { c.strokeStyle = col; c.lineCap = 'round'; for (let i = 0; i < n; i++) { c.lineWidth = w * (1 - i / n * .5); c.beginPath(); c.arc(x, y, r0 * (1 + i * .55), a0, a1); c.stroke(); } }
export function speed2(c, x, y, s, n = 3, col = C.ink) { c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = s * .08; for (let i = 0; i < n; i++) { c.beginPath(); c.moveTo(x - s * (.2 + i * .1), y + (i - (n - 1) / 2) * s * .35); c.lineTo(x - s * (1 + i * .25), y + (i - (n - 1) / 2) * s * .35); c.stroke(); } }
export function swirl2(c, x, y, s, col = C.ink) { c.strokeStyle = col; c.lineWidth = s * .12; c.lineCap = 'round'; c.beginPath(); for (let i = 0; i <= 40; i++) { const a = i * .45, r = s * (.1 + i * .022); i ? c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r * .6) : c.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r * .6); } c.stroke(); }
export function pebble2(c, x, y, s, col = '#C9BFAE') { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, s, s * .7, 0, 0, TAU); c.fill(); }
export function web2(c, x, y, s, col = C.cream) { c.strokeStyle = col; c.lineWidth = s * .05; c.lineCap = 'round'; for (let i = 0; i < 6; i++) { const a = i * TAU / 6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s); c.stroke(); } for (let k = 1; k <= 3; k++) { c.beginPath(); for (let i = 0; i <= 6; i++) { const a = i * TAU / 6, r = s * k / 3.2; i ? c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : c.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.stroke(); } }
export function heart2(c, x, y, s, col = C.berry) { c.fillStyle = col; c.beginPath(); c.moveTo(x, y + s * .9); c.bezierCurveTo(x - s * 1.4, y - s * .1, x - s * .6, y - s * 1.1, x, y - s * .35); c.bezierCurveTo(x + s * .6, y - s * 1.1, x + s * 1.4, y - s * .1, x, y + s * .9); c.fill(); }
export function moon2(c, x, y, r, bg) { circ(c, x, y, r, C.cream); circ(c, x + r * .45, y - r * .25, r * .85, bg); }
export function star2(c, x, y, r, col = C.lemon) { star(c, x, y, r, col); }
export function iceCream2(c, x, y, s) {
  c.fillStyle = '#E8A85C'; c.beginPath(); c.moveTo(x - s * .5, y); c.lineTo(x + s * .5, y); c.lineTo(x, y + s * 1.1); c.closePath(); c.fill();
  circ(c, x, y - s * .2, s * .55, C.pink); circ(c, x - s * .32, y - s * .05, s * .3, C.pink); circ(c, x + s * .32, y - s * .05, s * .3, C.pink); circ(c, x, y - s * .76, s * .08, C.berry);
}
export function window2(c, x, y, w, h) { c.fillStyle = C.cream; c.beginPath(); c.roundRect(x, y, w, h, w * .04); c.fill(); c.fillStyle = C.skyL; c.beginPath(); c.roundRect(x + w * .08, y + h * .08, w * .84, h * .84, w * .03); c.fill(); c.fillStyle = C.cream; c.fillRect(x + w * .48, y, w * .04, h); }
// vòng kính của Miss Loupe làm khung soi (dùng cho ô "quan sát qua kính lúp")
export function lensFrame(c, x, y, R, handle = true) {
  if (handle) { c.save(); c.translate(x, y); c.rotate(-.55); c.fillStyle = C.mango; c.beginPath(); c.roundRect(-R * .2, R * .94, R * .4, R * .14, R * .07); c.fill(); c.fillStyle = C.berry; c.beginPath(); c.roundRect(-R * .22, R * 1.06, R * .44, R * .9, R * .22); c.fill(); c.restore(); }
  c.fillStyle = C.berry; c.beginPath(); c.arc(x, y, R, 0, TAU); c.arc(x, y, R * .86, 0, TAU, true); c.fill('evenodd');
  c.fillStyle = C.berryD; c.beginPath(); c.arc(x, y, R, .2, 1.8); c.arc(x, y, R * .91, 1.8, .2, true); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineCap = 'round'; c.lineWidth = R * .06; c.beginPath(); c.arc(x, y, R * .7, Math.PI * 1.08, Math.PI * 1.34); c.stroke(); c.beginPath(); c.arc(x, y, R * .7, Math.PI * 1.43, Math.PI * 1.49); c.stroke();
}
export function glassDisc(c, x, y, R) { circ(c, x, y, R, GLASS); }
export function crumbBit(c, x, y, s) { c.fillStyle = C.honeyL; c.beginPath(); c.ellipse(x, y, s, s * .72, .2, 0, TAU); c.fill(); for (const [a, b] of [[-.4, -.2], [.3, .1], [0, .35]]) circ(c, x + a * s, y + b * s, s * .14, C.honeyD); }
export { circ, X };
