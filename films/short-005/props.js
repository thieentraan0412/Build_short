// Đạo cụ của SHORT-005: cành cây làm cầu, vườn buổi sáng, kiến thợ nhìn nghiêng (chị kiến và chú kiến lạ dùng chung một hình), mây mùi.
// Khối phẳng, không viền, không gradient (Khối Kẹo Phẳng). Mây mùi là khối phẳng trong mờ, chỉ vẽ trong kính.
import { C, circle, ell, capsule, rrect, poly, rays, lerp, TAU } from '/_shared/kit.js';

export const ANT = { col: '#7A3A10', dark: '#4E2408' };
export const SMELL = { home: [123, 240, 208], away: [255, 122, 47] };   // bạc hà = nhà Crumb, cam = nhà khác
export const rgba = (rgb, a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;

/* ---------- kiến thợ nhìn nghiêng, to bằng Crumb (không phải Crumb): đầu tròn, mắt to có ánh sáng ----------
   (x, y): điểm giữa ngực trên mặt cành. dir 1 = quay mặt sang phải. ph: pha bước chân.
   o.tip: [x, y] toạ độ cảnh cho đầu râu trước (để chạm đúng đầu râu Crumb); không có thì râu thả lỏng.
   o.eye: 'open' | 'happy' (cong, cười) | 'wide' | 'shut'; o.nod: cúi đầu 0..1; o.shrug: nhún vai 0..1 */
export const antHead = (x, y, s, o = {}) => { const dir = o.dir ?? 1, hy = -.66 * s + (o.nod || 0) * .1 * s + (o.shrug || 0) * .06 * s; return [x + dir * .4 * s, y + hy]; };
export function antAt(c, x, y, s, ph = 0, o = {}) {
  const dir = o.dir ?? 1, col = ANT.col, dark = ANT.dark, walk = o.walk ?? 1;
  c.save(); c.translate(x, y); c.scale(dir, 1);
  for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) {                       // 6 chân, bước luân phiên
    const a = Math.sin(ph * TAU + i * 2.1 + (sd > 0 ? Math.PI : 0)) * walk, hx = (-.3 + i * .3) * s, fx = hx + (i - 1) * .22 * s + a * .16 * s;
    capsule(c, hx, -.42 * s, (hx + fx) / 2 + .08 * s, -.64 * s + Math.max(0, a) * -.1 * s, .075 * s, sd > 0 ? dark : col);
    capsule(c, (hx + fx) / 2 + .08 * s, -.64 * s, fx, -Math.max(0, -a) * .08 * s, .065 * s, sd > 0 ? dark : col);
  }
  const sh = (o.shrug || 0) * .06 * s;
  ell(c, -.74 * s, -.58 * s - sh, .42 * s, .31 * s, -.2, col);               // bụng
  ell(c, -.86 * s, -.66 * s - sh, .2 * s, .08 * s, -.3, '#9A5524');           // vệt sáng phẳng trên bụng
  ell(c, -.08 * s, -.6 * s - sh, .27 * s, .18 * s, 0, col);                   // ngực
  const [hx, hy] = antHead(0, 0, s, { dir: 1, nod: o.nod, shrug: o.shrug });
  circle(c, hx, hy, .25 * s, col);                                           // đầu
  ell(c, hx + .2 * s, hy + .11 * s, .07 * s, .045 * s, .3, dark);            // hàm nhỏ
  // mắt to
  const ex = hx + .09 * s, ey = hy - .05 * s, er = .085 * s, eye = o.eye || 'open';
  if (eye === 'happy' || eye === 'shut') { c.strokeStyle = C.ink; c.lineWidth = .035 * s; c.lineCap = 'round'; c.beginPath(); eye === 'happy' ? c.arc(ex, ey + .02 * s, er * .8, Math.PI * 1.15, Math.PI * 1.85) : (c.moveTo(ex - er * .8, ey), c.lineTo(ex + er * .8, ey)); c.stroke(); }
  else { const k = eye === 'wide' ? 1.25 : 1; circle(c, ex, ey, er * k, C.white); const lk = o.look || [.4, 0]; circle(c, ex + lk[0] * er * .35, ey + lk[1] * er * .35, er * .62 * k, C.ink); circle(c, ex + lk[0] * er * .35 + er * .22, ey + lk[1] * er * .35 - er * .25, er * .2, C.white); }
  ell(c, hx + .05 * s, hy + .1 * s, .055 * s, .03 * s, 0, 'rgba(255,156,194,.75)');   // má hồng
  // hai râu gập khuỷu: râu sau (đậm, xa) và râu trước (có thể với tới một điểm)
  const base = [hx + .06 * s, hy - .2 * s];
  const relax = (k, wig) => { const e = [base[0] + (.18 + k * .04) * s, base[1] - (.3 - k * .03) * s]; return [e, [e[0] + .34 * s, e[1] - (.1 - wig) * s]]; };
  const wig = o.wig || 0;
  for (const k of [1, 0]) {
    let [el, tp] = relax(k, k ? wig * .6 : wig);
    if (k === 0 && o.tip) tp = [(o.tip[0] - x) * dir, o.tip[1] - y];
    if (k === 1 && o.tip2) tp = [(o.tip2[0] - x) * dir, o.tip2[1] - y];
    capsule(c, base[0], base[1], el[0], el[1], .05 * s, dark);
    c.strokeStyle = dark; c.lineWidth = .045 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(el[0], el[1]);
    c.quadraticCurveTo((el[0] + tp[0]) / 2 + .02 * s, Math.min(el[1], tp[1]) - .12 * s, tp[0], tp[1]); c.stroke();
    circle(c, tp[0], tp[1], .035 * s, dark);                                  // đầu râu tròn
  }
  c.restore();
}
// đầu râu trước khi thả lỏng (toạ độ cảnh)
export const antRelaxTip = (x, y, s, o = {}) => { const dir = o.dir ?? 1, [hx, hy] = antHead(0, 0, s, o), b = [hx + .06 * s, hy - .2 * s], e = [b[0] + .18 * s, b[1] - .3 * s]; return [x + dir * (e[0] + .34 * s), y + e[1] - (.1 - (o.wig || 0)) * s]; };

/* ---------- mây mùi: một khối mềm, mép gợn, trôi chậm quanh thân (chỉ trong kính) ---------- */
export function smellCloud(c, x, y, rx, ry, t, rgb, a = .5, seed = 0) {
  if (a <= .005) return;
  const blob = k => {                                              // một khối liền (một path) để độ trong đều, không đậm chỗ chồng nhau
    c.beginPath(); c.ellipse(x, y, rx * k, ry * k, 0, 0, TAU);
    for (let i = 0; i < 10; i++) {
      const ang = i / 10 * TAU + seed, w = Math.sin(t * 1.6 + i * 1.7 + seed) * .06, px = x + Math.cos(ang) * rx * k * (.9 + w), py = y + Math.sin(ang) * ry * k * (.9 + w), r = Math.min(rx, ry) * k * (.3 + .05 * Math.sin(t * 2.1 + i));
      c.moveTo(px + r, py); c.arc(px, py, r, 0, TAU);
    }
    c.fill('nonzero');
  };
  c.fillStyle = rgba(rgb, a); blob(1);
  c.fillStyle = rgba(rgb, a * .7); blob(.62);
  for (let i = 0; i < 4; i++) { const p = (t * .4 + i / 4) % 1, px = x + (i - 1.5) * rx * .4 + Math.sin(t * 2 + i) * 10, py = y - ry * (1.05 + p * .6); circle(c, px, py, Math.min(rx, ry) * .11 * (1 - p), rgba(rgb, a * 1.4)); }   // "sợi mùi" bốc lên
}
// dải mùi bay từ thân chú kia vào đầu râu: chuỗi hạt tròn trên một đường cong, hạt chạy về phía đầu râu
export function wisp(c, x0, y0, x1, y1, t, rgb, on = 1) {
  if (on <= .01) return;
  const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 70;
  for (let i = 0; i < 11; i++) {
    const p = ((t * 1.4 + i / 11) % 1), q = 1 - p, bx = q * q * x0 + 2 * q * p * mx + p * p * x1, by = q * q * y0 + 2 * q * p * my + p * p * y1;
    circle(c, bx + Math.sin(p * 9 + i) * 8, by, (7 + (i % 3) * 3) * on * (.5 + .5 * Math.sin(Math.PI * p)), rgba(rgb, .85));
  }
}

/* ---------- vườn buổi sáng: trời hồng, mặt trời, đồi xa, hoa cúc ---------- */
export function morning(c, t, o = {}) {
  c.fillStyle = C.pink; c.fillRect(-2000, -2000, 5080, 5920);
  const sx = o.sunX ?? 990, sy = o.sunY ?? 830;                     // mặt trời thấp bên phải, không nằm dưới chữ
  rays(c, sx, sy, '#FFB3D1', t * .04, 14, 3400);
  circle(c, sx, sy, 150, C.mangoL); circle(c, sx, sy, 118, C.lemon);
  for (let x = -700, i = 0; x < 1900; x += 210, i++) ell(c, x, 1380 + (i % 2) * 18, 190, 150, 0, i % 2 ? C.leaf : '#3CCB7A');   // đồi xa
  for (const [x, y, s] of [[90, 1330, .55], [330, 1360, .45], [990, 1340, .5], [-60, 1300, .5]]) daisy(c, x, y, s, t);   // hoa xa, nhỏ
}
export function daisy(c, x, y, s, t = 0, stalk = 260) {
  capsule(c, x, y, x + Math.sin(t + x) * 6, y + stalk * s, 18 * s, C.leafD);
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + Math.sin(t * .8 + x) * .05; ell(c, x + Math.cos(a) * 52 * s, y + Math.sin(a) * 52 * s, 34 * s, 17 * s, a, C.cream); }
  circle(c, x, y, 30 * s, C.mango);
}
// mặt đất gần (đồi cỏ phía trước, Miss Loupe đứng ở đây)
export function nearGround(c, y0 = 1560) {
  ell(c, 200, y0 + 260, 900, 330, 0, C.leafD); ell(c, 900, y0 + 300, 800, 330, 0, C.leaf);
  rrect(c, -400, y0 + 220, 1900, 700, 0, C.leafD);
  for (let x = -40, i = 0; x < 1150; x += 120, i++) capsule(c, x, y0 + 70 + (i % 2) * 30, x + 12, y0 - 10 + (i % 3) * 20, 16, i % 2 ? C.leaf : C.lime);
}
// cành cây làm cầu: thân xanh, hơi võng, một nụ hoa bên trái, một chiếc lá bên phải
export const STEM = { x0: -140, x1: 1240, y: 1232, sag: 26 };
export const stemY = x => STEM.y + STEM.sag * Math.sin(Math.PI * Math.min(1, Math.max(0, (x - STEM.x0) / (STEM.x1 - STEM.x0))));
export function stem(c, t) {
  c.strokeStyle = C.leafD; c.lineCap = 'round'; c.lineWidth = 44; c.beginPath();
  for (let x = STEM.x0; x <= STEM.x1; x += 40) { const y = stemY(x) + 20; x === STEM.x0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
  c.strokeStyle = C.leaf; c.lineWidth = 16; c.beginPath();
  for (let x = STEM.x0; x <= STEM.x1; x += 40) { const y = stemY(x) + 10; x === STEM.x0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
  for (const nx of [120, 690]) ell(c, nx, stemY(nx) + 20, 14, 26, 0, '#11804A');   // đốt cành
  // chiếc lá nhỏ mọc từ cành
  c.save(); c.translate(980, stemY(980) + 30); c.rotate(.5 + Math.sin(t * 1.3) * .04);
  c.fillStyle = C.leaf; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(90, -70, 190, 0); c.quadraticCurveTo(90, 70, 0, 0); c.fill();
  c.strokeStyle = C.leafD; c.lineWidth = 6; c.beginPath(); c.moveTo(0, 0); c.lineTo(180, 0); c.stroke(); c.restore();
}

/* ---------- chi tiết hoạt hình ---------- */
export function heart(c, x, y, s, f = C.berry) {
  c.fillStyle = f; c.beginPath(); c.moveTo(x, y + s * .9);
  c.bezierCurveTo(x - s * 1.4, y - s * .1, x - s * .6, y - s * 1.1, x, y - s * .35);
  c.bezierCurveTo(x + s * .6, y - s * 1.1, x + s * 1.4, y - s * .1, x, y + s * .9); c.fill();
}
// vạch "kít kít" quanh chỗ râu cọ vào mặt kính
export function squeakLines(c, x, y, p, f = C.cream) {
  if (p <= 0 || p >= 1) return; c.strokeStyle = f; c.lineCap = 'round'; c.lineWidth = 9 * (1 - p);
  for (let i = 0; i < 5; i++) { const a = -2.4 + i * .5, r0 = 30 + 40 * p, r1 = r0 + 34; c.beginPath(); c.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); c.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); c.stroke(); }
}
