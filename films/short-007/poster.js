// SHORT-007 · poster Shorts 9:16 và thumbnail YouTube 16:9 (cùng một concept, hai bố cục).
// Concept: "Mật mã ánh sáng": Blink bay giữa vườn đêm, đuôi bùng sáng, quanh đuôi là dải chấm gạch; vài đom đóm xa nháy đáp.
// Khác ảnh bìa các tập trước (nền ngày, nhân vật đứng): đây là ảnh bìa đêm đầu tiên của kênh. Rig dùng chung, khối phẳng.
import { C, popText, rrect, circle, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { ex, rigPt } from '/_shared/episode.js';
import { nightSky, garden, glowDot, bigGlow } from './props.js';

function hero(c, x, y, k) {                                       // Blink bay, đuôi bùng sáng, dải mật mã
  const tail = rigPt(x, y, k, .45, 0, [0, -.62 - .4, -.78]);
  bigGlow(c, tail[0], tail[1], k * 2.6, 1);
  drawChar(c, BY.blink, { x, y, k, yaw: .45, showFx: false, expr: ex(BY.blink, 'excited', { look: [.1, 0] }), pose: { glow: 1.8, fly: 1, lift: .4 } });
  for (let i = 0; i < 7; i++) { const a = i * TAU / 7 + .2; star(c, tail[0] + Math.cos(a) * k * 1.25, tail[1] + Math.sin(a) * k * 1.05, k * .09, C.lemon); }
  const cy = y + k * .55, cx = x - k * .2;                        // ngắn, ngắn, nghỉ, dài
  rrect(c, cx - k * 1.15, cy - k * .3, k * 2.3, k * .6, k * .3, 'rgba(30,27,58,.75)');
  circle(c, cx - k * .78, cy, k * .17, C.lemon); circle(c, cx - k * .36, cy, k * .17, C.lemon); rrect(c, cx + .05 * k, cy - k * .15, k * .9, k * .3, k * .15, C.lemon);
}
const title = (c, s, x, y, px, fill, sh, o = {}) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075, ...o });

/* 9:16 · 1080×1920: trên là tựa, giữa là Blink to, dưới để trống cho giao diện Shorts */
export function poster(c) {
  c.save(); c.translate(-80, 180); c.scale(1.25, 1.25); nightSky(c, 1.2); garden(c, 1.2); c.restore();
  for (const [x, y, r] of [[140, 700, 10], [930, 820, 12], [210, 1080, 8], [860, 1180, 9], [500, 640, 7]]) glowDot(c, x, y, r, 1);
  hero(c, 560, 1260, 270);
  title(c, 'LIGHT', 540, 330, 230, C.lemon, C.ink);
  title(c, 'CODE?!', 540, 550, 230, C.pink, C.ink);
}

/* 16:9 · 1920×1080: trái là Blink, phải là tựa; góc dưới-phải để trống (ô thời lượng) */
export function thumb(c) {
  c.save(); c.translate(150, -320); c.scale(1.3, 1.3); nightSky(c, 1.2, { noMoon: true }); garden(c, 1.2, { noWeb: true }); c.restore();   // không trăng sau tựa, không mạng nhện sau Blink
  for (const [x, y, r] of [[1160, 760, 10], [1700, 700, 12], [120, 200, 8], [900, 140, 9]]) glowDot(c, x, y, r, 1);
  hero(c, 560, 780, 250);
  title(c, 'LIGHT', 1390, 360, 230, C.lemon, C.ink);
  title(c, 'CODE?!', 1390, 590, 230, C.pink, C.ink);
}
