// SHORT-008 · poster Shorts 9:16 và thumbnail YouTube 16:9 (cùng một concept, hai bố cục).
// Concept: "Lửa trại Blink": Miss Loupe quàng khăn hơ tay bên đuôi sáng của Blink, tay vẫn đóng băng; chữ NOT HOT?!
// Khác ảnh bìa SHORT-007 (Blink bay, "GLOWING TUMMY?!"). Rig dùng chung, khối phẳng.
import { C, popText } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { ex, rigPt, shadow, loupe } from '/_shared/episode.js';
import { campSky, camp, pebbles, twigs, bigGlow, frost, FIRE, SEAT, groundY } from './props.js';

const WARM = { handL: [1.05, -1.12, .55], handR: [1.32, -1.24, .28], elbowL: [.62, -.98, .42], elbowR: [.82, -1.12, .2], scarf: true };
function scene(c) {                                               // toạ độ cảnh như phim; gọi trong một phép biến đổi
  campSky(c, 1.2, { noMoon: true }); camp(c, 1.2, { noTent: true, noClover: true }); pebbles(c, false); twigs(c);
  const [sx, sy] = SEAT(), tail = rigPt(sx, sy, 100, 1.1, 0, [0, -.62 - .1, -.78]);
  bigGlow(c, tail[0], tail[1], 480, 1);
  drawChar(c, BY.blink, { x: sx, y: sy, k: 100, yaw: 1.1, showFx: true, expr: ex(BY.blink, 'laugh', { look: [-.6, 0], fx: true }), pose: { glow: 2.6, lift: .1 } });
  pebbles(c, true);
  const lx = 470, ly = groundY(470) - 2.73 * 95; shadow(c, 480, groundY(470) + 2, 120, .2);
  loupe(c, lx, ly, 95, { E: ex(BY.loupe, 'worried', { look: [.85, .1] }), rot: -.08, yaw: .35, pose: WARM });
  const fx = lx - Math.sin(-.08) * 2.73 * 95, fy = ly + Math.cos(-.08) * 2.73 * 95;
  for (const [h, s] of [[WARM.handL, 1], [WARM.handR, 2]]) { const p = rigPt(fx, fy, 95, .35, -.08, h); frost(c, p[0], p[1], 40, 1, s); }
}
const title = (c, s, x, y, px, fill, sh, o = {}) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075, ...o });

/* 9:16 · 1080×1920 */
export function poster(c) {
  c.save(); c.translate(540, 1130); c.scale(2.35, 2.35); c.translate(-590, -1085); scene(c); c.restore();
  title(c, 'NOT', 540, 300, 230, C.mintL, C.ink);
  title(c, 'HOT?!', 540, 530, 250, C.tang, C.ink);
}
/* 16:9 · 1920×1080 */
export function thumb(c) {
  c.save(); c.translate(560, 600); c.scale(1.75, 1.75); c.translate(-590, -1060); scene(c); c.restore();
  title(c, 'NOT', 1450, 370, 240, C.mintL, C.ink);
  title(c, 'HOT?!', 1450, 620, 260, C.tang, C.ink);
}
