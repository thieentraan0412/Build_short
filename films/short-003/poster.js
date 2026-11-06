// SHORT-003 · poster Shorts 9:16 và thumbnail YouTube 16:9 (cùng một concept, hai bố cục).
// Concept: "Ồn quá!": chữ NOPE! lao tới, Chirp nhắm tịt mắt, bịt chặt... đầu gối (vì tai nó ở chân). Khác ảnh bìa SHORT-001 (kính soi tai) và SHORT-002 (bướm nếm dưa).
// Nhân vật vẽ bằng rig dùng chung (giữ nguyên thiết kế); chỉ khối phẳng, không viền, không gradient (Khối Kẹo Phẳng).
import { C, circle, ell, capsule, ground, popText, lerp, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { X } from '/_shared/characters/parts.js';
import { ex, shadow } from '/_shared/episode.js';
import { stars, moon, grass, mushroom, farCricket } from './props.js';

const COVER_L = [.12, -.66, 1.3], COVER_R = [-.1, -.62, 1.34];
function chirpCover(c, x, y, k, yaw) {                          // Chirp bịt chặt đầu gối: hai chân trước bắt chéo, co người, mắt nhắm tịt
  const E = ex(BY.chirp, 'worried', { closed: 1 }); E.mouth = 'wavy';
  drawChar(c, BY.chirp, { x, y, k, yaw, showFx: false, expr: E, pose: { frontL: COVER_L, frontR: COVER_R, lift: -.07, ant: 1.2, earGlow: 1 } });
  for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) {       // vạch run run hai bên
    const x0 = x + sd * k * (1.35 + i * .16), y0 = y - k * (.75 + .22 * i);
    capsule(c, x0, y0 - k * .1, x0 + sd * k * .04, y0 + k * .1, k * .035, C.cream);
  }
}
function shout(c, x, y, r0, n, spread, a0, w, col = C.cream) {   // vạch tiếng hét toả ra từ (x, y)
  for (let i = 0; i < n; i++) { const a = a0 + (i - (n - 1) / 2) * spread, r1 = r0 + w * 6; capsule(c, x + Math.cos(a) * r0, y + Math.sin(a) * r0, x + Math.cos(a) * r1, y + Math.sin(a) * r1, w, col); }
}
function soundArcs(c, x, y, r, a0, a1, n, col) {               // sóng âm dồn vào tai
  c.strokeStyle = col; c.lineCap = 'round';
  for (let i = 0; i < n; i++) { c.lineWidth = r * (.12 - i * .025); c.beginPath(); c.arc(x, y, r * (1 + i * .55), a0, a1); c.stroke(); }
}
function night(c, W, H, o) {
  ground(c, C.night); stars(c, 0, o.stars, W, H * .8, 5);
  moon(c, ...o.moon);
  if (o.fc) farCricket(c, ...o.fc);
  ell(c, W * .15, H * 1.03, W * .7, H * .26, 0, C.nightL); ell(c, W * .95, H * 1.08, W * .62, H * .3, 0, C.grape);
  for (const [x, y, h] of o.grass) grass(c, x, y, h, 0);
}
const title = (c, s, x, y, px, fill, sh, o = {}) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075, ...o });

/* ================= 9:16 · 1080×1920 =================
   Trên: câu móc. Giữa–dưới: Chirp to trên sân khấu nấm, bịt đầu gối. Chữ NOPE! lao tới từ bên phải. Nội dung chính nằm trong y 180–1500. */
export function poster(c) {
  const W = 1080, H = 1920, x = 470, y = 1260, k = 300, yaw = .6;
  night(c, W, H, { stars: 34, moon: [945, 600, 100], fc: [926, 630, 52], grass: [[70, 1540, 300], [960, 1560, 260], [1040, 1520, 300]] });
  mushroom(c, x + 20, y - 28, 420);
  shadow(c, x + 30, y + 4, 360, .22);
  soundArcs(c, x + 250, y - 250, 60, -2.4, -1.2, 3, C.mint);
  chirpCover(c, x, y, k, yaw);
  shout(c, 1110, 640, 120, 5, .2, Math.PI * .82, 15);
  c.save(); c.translate(800, 745); c.rotate(-.12); title(c, 'NOPE!', 0, 0, 170, C.berry, C.cream); c.restore();
  title(c, 'EARS ON', W / 2, 290, 170, C.lemon, X.nightD);
  title(c, 'KNEES?!', W / 2, 480, 200, C.mint, X.nightD);
}

/* ================= 16:9 · 1920×1080 =================
   Trái: Chirp trên nấm, bịt đầu gối. Phải: tiêu đề; chữ NOPE! lao vào từ trên. Góc dưới-phải để trống (ô thời lượng). */
export function thumb(c) {
  const W = 1920, H = 1080, x = 520, y = 800, k = 250, yaw = .6;
  night(c, W, H, { stars: 40, moon: [1080, 210, 88], fc: [1062, 232, 44], grass: [[90, 940, 240], [1080, 980, 200]] });
  mushroom(c, x + 20, y - 24, 360);
  shadow(c, x + 30, y + 4, 300, .22);
  soundArcs(c, x + 215, y - 215, 50, -2.4, -1.2, 3, C.mint);
  chirpCover(c, x, y, k, yaw);
  shout(c, 1090, 330, 100, 5, .2, Math.PI * .78, 12);
  c.save(); c.translate(820, 360); c.rotate(-.12); title(c, 'NOPE!', 0, 0, 130, C.berry, C.cream); c.restore();
  title(c, 'EARS', 1200, 300, 190, C.lemon, X.nightD, { align: 'left' });
  title(c, 'ON', 1200, 460, 140, C.cream, C.berry, { align: 'left' });
  title(c, 'KNEES?!', 1200, 640, 160, C.mint, X.nightD, { align: 'left' });
}
