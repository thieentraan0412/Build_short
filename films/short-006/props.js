// Đạo cụ của SHORT-006: chiếc lá to làm "đồng cỏ" trên cao, trời xanh có mặt trời, bụi hồng phía dưới,
// chú rệp có biểu cảm ("bò" tí hon), giọt ngọt (mật rệp) nảy được như quả bóng, đốm bò và chuông tưởng tượng, gợn sóng trên trang sổ.
// Khối phẳng, không viền, không gradient (Khối Kẹo Phẳng). Hình rệp và giọt ngọt dựa trên films/short-004/props.js, vẽ to hơn cho cận cảnh.
import { C, circle, ell, capsule, rrect, rays, lerp, TAU } from '/_shared/kit.js';

/* ---------- trời, mặt trời, bụi hồng phía dưới ---------- */
export const SUN = { x: 70, y: 600 };                              // mặt trời thấp bên trái, gần như ngoài khung: không trùng màu với giọt ngọt
export function sky(c, t, o = {}) {
  c.fillStyle = C.skyL; c.fillRect(-2000, -2000, 5080, 5920);
  const sx = o.sunX ?? SUN.x, sy = o.sunY ?? SUN.y;
  rays(c, sx, sy, '#A6E8FF', t * .05, 14, 3400);
  circle(c, sx, sy, 150, C.mangoL); circle(c, sx, sy, 116, C.lemon);
  cloudPuff(c, 150 + Math.sin(t * .3) * 12, 760, 150); cloudPuff(c, 720 + Math.sin(t * .25 + 1) * 10, 640, 110);
}
export function cloudPuff(c, x, y, s, f = C.white) { circle(c, x, y, s * .5, f); circle(c, x + s * .55, y + s * .08, s * .38, f); circle(c, x - s * .55, y + s * .1, s * .34, f); rrect(c, x - s * .9, y + s * .1, s * 1.8, s * .34, s * .17, f); }
// bụi hồng phía dưới chiếc lá: khối lá tròn, vài bông hồng berry
export function bush(c, t, y0 = 1420) {
  for (let x = -300, i = 0; x < 1500; x += 230, i++) circle(c, x, y0 + 120 + (i % 2) * 40, 230, i % 2 ? C.leafD : '#139A55');
  for (const [x, y, s] of [[60, 1470, 1], [1000, 1500, .85], [700, 1640, .7]]) rose(c, x, y + Math.sin(t * .8 + x) * 3, s);
  rrect(c, -400, y0 + 300, 1900, 900, 0, C.leafD);
}
export function rose(c, x, y, s) {
  circle(c, x, y, 62 * s, C.berryD); circle(c, x - 18 * s, y - 10 * s, 44 * s, C.berry); circle(c, x + 20 * s, y - 6 * s, 40 * s, C.berry);
  circle(c, x, y - 18 * s, 30 * s, C.pink); circle(c, x + 4 * s, y - 22 * s, 13 * s, C.berry);
}

/* ---------- chiếc lá to: mặt lá là "đồng cỏ" của trại rệp ---------- */
export const LEAF = { x0: -260, x1: 1340, y: 1236, bow: 22 };
export const leafY = x => LEAF.y - LEAF.bow * Math.sin(Math.PI * Math.min(1, Math.max(0, (x - LEAF.x0) / (LEAF.x1 - LEAF.x0))));
export function leaf(c, t) {
  // cuống lá đi xuống bụi hồng
  capsule(c, 1180, 1250, 1290, 1700, 40, C.leafD);
  // phiến lá: mặt trên (sáng) và mép dưới (đậm) để thấy độ dày
  c.fillStyle = C.leafD; c.beginPath(); c.moveTo(LEAF.x0, leafY(LEAF.x0) + 30);
  for (let x = LEAF.x0; x <= LEAF.x1; x += 40) c.lineTo(x, leafY(x) + 70 + 26 * Math.sin(Math.PI * (x - LEAF.x0) / (LEAF.x1 - LEAF.x0)));
  for (let x = LEAF.x1; x >= LEAF.x0; x -= 40) c.lineTo(x, leafY(x) + 10); c.closePath(); c.fill();
  c.fillStyle = C.leaf; c.beginPath(); c.moveTo(LEAF.x0, leafY(LEAF.x0));
  for (let x = LEAF.x0; x <= LEAF.x1; x += 40) c.lineTo(x, leafY(x) - 6);
  for (let x = LEAF.x1; x >= LEAF.x0; x -= 40) c.lineTo(x, leafY(x) + 52 + 22 * Math.sin(Math.PI * (x - LEAF.x0) / (LEAF.x1 - LEAF.x0)));
  c.closePath(); c.fill();
  // gân lá
  c.strokeStyle = C.lime; c.lineCap = 'round'; c.lineWidth = 10; c.beginPath();
  for (let x = LEAF.x0; x <= LEAF.x1; x += 40) { const y = leafY(x) + 22; x === LEAF.x0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
  c.lineWidth = 6; for (let x = -100; x < 1300; x += 170) { c.beginPath(); c.moveTo(x, leafY(x) + 22); c.lineTo(x + 70, leafY(x) + 46); c.stroke(); }
  // hai cái gai hồng nhỏ trên cuống (hàng rào của trại)
  for (const [x, y] of [[1230, 1420], [1262, 1560]]) { c.fillStyle = C.berryD; c.beginPath(); c.moveTo(x, y - 18); c.lineTo(x - 44, y - 30); c.lineTo(x, y + 14); c.fill(); }
}

/* ---------- chú rệp ("bò" tí hon) ----------
   (x, y): điểm giữa bụng trên mặt lá. s: cỡ. dir 1 = mặt quay phải (đuôi bên trái, giọt ngọt ra ở đuôi).
   o.sq: co người 0..1 (được gõ, cười khúc khích); o.eye: 'open' | 'happy' | 'wink' | 'wide'; o.look: [x, y];
   o.cow: 0..1 đốm bò và chuông tưởng tượng (bật lên rồi tắt); o.bob: nhún */
export const APH_COL = { body: C.lime, dark: '#5FAE2E', light: '#D5F78F' };
export const aphidRear = (x, y, s, dir = 1) => [x - dir * .6 * s, y - .36 * s];      // chỗ giọt ngọt hiện ra (đuôi)
export const aphidBack = (x, y, s, dir = 1) => [x - dir * .18 * s, y - .8 * s];      // chỗ râu kiến gõ (lưng)
export function aphid(c, x, y, s, o = {}) {
  const dir = o.dir ?? 1, sq = o.sq || 0, cow = o.cow || 0, bob = o.bob || 0;
  c.save(); c.translate(x, y - bob); c.scale(dir, 1);
  const ky = 1 - sq * .12, kx = 1 + sq * .06;
  for (let i = 0; i < 3; i++) capsule(c, (-.32 + i * .3) * s, -.16 * s, (-.4 + i * .36) * s, .02 * s + bob, .07 * s, APH_COL.dark);   // 6 chân ngắn (3 bên này)
  ell(c, 0, -.44 * s * ky, .64 * s * kx, .44 * s * ky, 0, APH_COL.body);
  if (cow > .01) {                                                // đốm bò tưởng tượng (bật lên từng đốm, chỉ trong bụng)
    c.save(); c.beginPath(); c.ellipse(0, -.44 * s * ky, .64 * s * kx, .44 * s * ky, 0, 0, TAU); c.clip();
    [[-.36, -.62, .16], [.04, -.3, .13], [-.12, -.74, .09], [.3, -.66, .1], [-.46, -.28, .1]].forEach(([px, py, r], i) => {
      const k = Math.min(1, Math.max(0, cow * 1.6 - i * .15)); if (k > 0) ell(c, px * s, py * s * ky, r * s * k * 1.2, r * s * k, .4 * i, C.ink);
    });
    c.restore();
  }
  ell(c, -.14 * s, -.62 * s * ky, .3 * s, .12 * s, -.2, APH_COL.light);                     // vệt sáng phẳng
  capsule(c, -.44 * s, -.64 * s * ky, -.64 * s, -.9 * s * ky, .075 * s, APH_COL.dark);     // hai ống nhỏ sau lưng
  capsule(c, -.22 * s, -.76 * s * ky, -.34 * s, -1.02 * s * ky, .075 * s, APH_COL.dark);
  // đầu và mặt
  const hx = .5 * s, hy = -.5 * s * ky;
  const eye = o.eye || 'open', er = .12 * s, ex = hx + .02 * s, ey = hy - .06 * s;
  if (eye === 'happy' || eye === 'wink') {
    c.strokeStyle = C.ink; c.lineWidth = .04 * s; c.lineCap = 'round'; c.beginPath(); c.arc(ex, ey + .03 * s, er * .75, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
    if (eye === 'wink') { circle(c, ex - .2 * s, ey, er * .6, C.white); circle(c, ex - .18 * s, ey, er * .4, C.ink); }
  } else {
    const k = eye === 'wide' ? 1.25 : 1, lk = o.look || [.4, -.1];
    circle(c, ex, ey, er * k, C.white); circle(c, ex + lk[0] * er * .35, ey + lk[1] * er * .35, er * .62 * k, C.ink); circle(c, ex + lk[0] * er * .35 + er * .22, ey + lk[1] * er * .35 - er * .25, er * .2, C.white);
  }
  c.strokeStyle = C.ink; c.lineWidth = .03 * s; c.lineCap = 'round'; c.beginPath(); c.arc(hx + .1 * s, hy + .16 * s, .07 * s, .2, Math.PI - .2); c.stroke();   // miệng cười
  ell(c, hx + .2 * s, hy + .1 * s, .06 * s, .035 * s, 0, 'rgba(232,51,109,.45)');                                            // má hồng
  capsule(c, hx + .02 * s, hy - .18 * s, hx + .36 * s, hy - .5 * s, .035 * s, APH_COL.dark);                                  // râu
  if (cow > .01) {                                                // chuông bò tưởng tượng dưới cằm
    const k = Math.min(1, cow * 1.4), bx = hx - .04 * s, by = hy + .3 * s;
    capsule(c, bx - .14 * s, by - .08 * s, bx + .14 * s, by - .08 * s, .05 * s * k, C.berry);
    c.fillStyle = C.mango; c.beginPath(); c.moveTo(bx - .08 * s * k, by - .06 * s); c.lineTo(bx + .08 * s * k, by - .06 * s); c.lineTo(bx + .13 * s * k, by + .14 * s * k); c.lineTo(bx - .13 * s * k, by + .14 * s * k); c.closePath(); c.fill();
    circle(c, bx, by + .16 * s * k, .035 * s * k, C.honeyD);
  }
  c.restore();
}

/* ---------- giọt ngọt (mật rệp) ----------
   dropTear: giọt đang phồng ở đuôi rệp (nhọn ở trên). dropBall: giọt tròn bay và nảy như quả bóng; sq > 0 dẹt khi chạm, < 0 dài ra khi bay */
export function dropTear(c, x, y, r) {
  if (r <= .5) return;
  c.fillStyle = C.honeyL; c.beginPath(); c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r * 1.05, y - r * .1, x, y + r); c.quadraticCurveTo(x - r * 1.05, y - r * .1, x, y - r * 1.6); c.fill();
  circle(c, x, y, r * .98, C.honeyL); circle(c, x - r * .3, y - r * .3, r * .28, C.cream);
}
export function dropBall(c, x, y, r, sq = 0, rot = 0) {
  if (r <= .5) return;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(1 + sq * .35, 1 - sq * .35);
  circle(c, 0, 0, r, C.honeyL); ell(c, r * .12, r * .18, r * .7, r * .62, 0, C.mango);
  circle(c, -r * .32, -r * .34, r * .26, C.cream); circle(c, r * .34, -r * .1, r * .08, C.cream);
  c.restore();
}

/* ---------- chi tiết hoạt hình ---------- */
export function heart(c, x, y, s, f = C.berry) {
  c.fillStyle = f; c.beginPath(); c.moveTo(x, y + s * .9);
  c.bezierCurveTo(x - s * 1.4, y - s * .1, x - s * .6, y - s * 1.1, x, y - s * .35);
  c.bezierCurveTo(x + s * .6, y - s * 1.1, x + s * 1.4, y - s * .1, x, y + s * .9); c.fill();
}
// vạch "tap" quanh chỗ râu gõ; p 0..1
export function tapLines(c, x, y, p, f = C.cream, R = 30) {
  if (p <= 0 || p >= 1) return; c.strokeStyle = f; c.lineCap = 'round'; c.lineWidth = R * .3 * (1 - p);
  for (let i = 0; i < 5; i++) { const a = -2.6 + i * .55, r0 = R + R * 1.3 * p, r1 = r0 + R * 1.1; c.beginPath(); c.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); c.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); c.stroke(); }
}
// gợn sóng trên trang sổ khi Crumb nhảy vào (vòng tròn nở ra, mờ dần); p 0..1
export function ripples(c, x, y, p, R = 420, col = 'rgba(60,200,255,') {
  if (p <= 0 || p >= 1) return;
  for (let i = 0; i < 3; i++) { const q = p * 1.25 - i * .14; if (q <= 0 || q >= 1) continue; c.strokeStyle = col + (.75 * (1 - q)) + ')'; c.lineWidth = 22 * (1 - q) + 4; c.beginPath(); c.ellipse(x, y, R * q, R * q * .55, 0, 0, TAU); c.stroke(); }
}
