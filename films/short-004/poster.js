// SHORT-004 · poster Shorts 9:16 và thumbnail YouTube 16:9 (cùng một concept, hai bố cục).
// Concept: "Mũi ở trên râu?!": Crumb vác vụn bánh to hơn mình, hai râu dấu hỏi lóe sáng hút hạt mùi; ngón tay khổng lồ chỉ xuống "ngửi" thử.
// Khác ảnh bìa SHORT-001 (kính soi tai), 002 (bướm nếm dưa), 003 (dế bịt đầu gối). Khối phẳng, không viền, không gradient.
import { C, circle, ell, ground, rays, popText, lerp, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { ex, rigPt, shadow } from '/_shared/episode.js';
import { soil, grassTuft, pebble, cloud, cookie, workerAnt } from './props.js';

const UP = { armL: [-.32, -2.5, .25], armR: [.32, -2.5, .25] };
function crumbBig(c, x, y, k, yaw) {                           // vụn bánh nằm dưới đất cạnh Crumb; hạt mùi bay từ vụn bánh lên hai đầu râu đang lóe sáng
  const E = ex(BY.crumb, 'curious', { look: [.6, .1] }); E.eye = { ...E.eye, scale: 1.25 };
  const ck = [x + k * 1.45, y - k * .42];
  cookie(c, ck[0], ck[1], k * .62, .1);
  drawChar(c, BY.crumb, { x, y, k, yaw, showFx: false, expr: E, pose: { carry: null, q: 1, armL: [-.5, -1.35, .5], armR: [.66, -1.55, .62] } });
  const tips = [-1, 1].map(sd => rigPt(x, y, k, yaw, 0, [sd * .22 + .26, -2.62, .34]));
  for (const p of tips) { circle(c, p[0], p[1], k * .11, 'rgba(255,227,77,.5)'); circle(c, p[0], p[1], k * .05, C.lemon); }
  for (const [j, p] of tips.entries()) for (let i = 0; i < 7; i++) { const u = i / 6; circle(c, lerp(ck[0] - k * .1, p[0], u) + Math.sin(u * 6 + j) * k * .18 * (1 - u), lerp(ck[1] - k * .5, p[1], u) + Math.cos(u * 5 + j) * k * .1 * (1 - u), k * (.065 - .025 * u), [C.pink, C.lemon, C.mint][(i + j) % 3]); }
}
function finger(c, x, y, k, tilt) {
  c.save(); c.translate(x, y); c.rotate(tilt); c.translate(-x, -y);
  drawChar(c, BY.giant, { x, y, k, showFx: false, pose: { part: 'hand', gesture: 'point', rot: [Math.PI, 0, .1] } });
  c.restore();
}
function sniffLines(c, x, y, s) { c.strokeStyle = C.cream; c.lineCap = 'round'; c.lineWidth = s * .12; for (let i = 0; i < 3; i++) { const a = -.9 + i * .5; c.beginPath(); c.arc(x, y, s, a - .25, a + .25); c.stroke(); } }
function garden(c, W, H, y0) {
  ground(c, C.sky); rays(c, W * .8, H * .15, C.skyL, 0, 14, 3600);
  cloud(c, W * .18, H * .2, W * .12);
  for (let x = -60, i = 0; x < W + 60; x += 190, i++) ell(c, x, y0 - 10 + (i % 2) * 14, 150, 110, 0, i % 2 ? C.leaf : C.leafD);
  soil(c, -60, W + 60, y0, H, 0);
  for (let x = 40, i = 0; x < W; x += 330, i++) grassTuft(c, x + (i % 3) * 40, y0 + 18, 130 + (i % 3) * 50, 0, i % 2 ? C.leafD : C.leaf);
}
const title = (c, s, x, y, px, fill, sh, o = {}) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075, ...o });

/* ================= 9:16 · 1080×1920 ================= */
export function poster(c) {
  const W = 1080, H = 1920, x = 380, y = 1480, k = 250;
  garden(c, W, H, 1300);
  pebble(c, 860, 1560, 40); workerAnt(c, 880, 1440, 80, .3, { dir: -1 }); workerAnt(c, 120, 1500, 70, .7);
  shadow(c, x + 20, y + 4, 300, .22);
  crumbBig(c, x, y, k, .7);
  finger(c, 960, 780, 280, .45); sniffLines(c, 820, 790, 80);
  title(c, 'ANTENNA', W / 2, 300, 170, C.lemon, C.honeyD);
  title(c, 'NOSES?!', W / 2, 490, 200, C.berry, C.cream);
}

/* ================= 16:9 · 1920×1080 · góc dưới-phải để trống (ô thời lượng) ================= */
export function thumb(c) {
  const W = 1920, H = 1080, x = 430, y = 960, k = 200;
  garden(c, W, H, 820);
  workerAnt(c, 1000, 930, 70, .4, { dir: -1 }); workerAnt(c, 150, 960, 60, .1);
  shadow(c, x + 20, y + 4, 240, .22);
  crumbBig(c, x, y, k, .7);
  finger(c, 1010, 300, 230, .5); sniffLines(c, 900, 310, 64);
  title(c, 'ANTENNA', 1130, 400, 150, C.lemon, C.honeyD, { align: 'left' });
  title(c, 'NOSES?!', 1130, 580, 170, C.berry, C.cream, { align: 'left' });
}
