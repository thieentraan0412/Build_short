// SHORT-005 · poster Shorts 9:16 và thumbnail YouTube 16:9 (cùng một concept, hai bố cục).
// Concept: "Chạm, chạm!": Crumb và chị kiến mặt đối mặt trên cành cây, hai đầu râu chạm nhau lóe sáng, tim nhỏ bay lên (mây mùi chỉ có trong kính, nên không đưa lên ảnh bìa).
// Khác ảnh bìa SHORT-004 (Crumb vác vụn bánh, "ANTENNA NOSES?!"). Rig dùng chung, khối phẳng, không viền, không gradient.
import { C, popText, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { ex, rigPt, shadow } from '/_shared/episode.js';
import { antAt, morning, stem, heart, nearGround } from './props.js';

const tipOf = (x, y, k, yaw, reach) => rigPt(x, y, k, yaw, 0, [Math.sign(yaw) * (.64 - .42 * reach), -2.32 + .12 * reach - .3024, .34 + .78 * reach]);
function pair(c, x, y, k, s, gap) {                              // Crumb (trái) và chị kiến (phải), đầu râu chạm nhau
  shadow(c, x + 20, y + 2, k, .18);
  drawChar(c, BY.crumb, { x, y, k, yaw: 1, showFx: false, expr: ex(BY.crumb, 'excited', { look: [.7, -.25] }), pose: { carry: null, reach: 1, armL: [-.4, -1.0, .45], armR: [.55, -2.65, .45] } });
  const tp = tipOf(x, y, k, 1, 1);
  antAt(c, x + gap, y, s, 0, { dir: -1, walk: 0, tip: [tp[0] + 6, tp[1] + 2], eye: 'happy' });
  for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + .3; star(c, tp[0] + Math.cos(a) * k * .32, tp[1] + Math.sin(a) * k * .32, k * .08, C.lemon); }
  star(c, tp[0], tp[1], k * .12, C.cream);
  heart(c, tp[0] - k * .28, tp[1] - k * .5, k * .09, C.berry); heart(c, tp[0] + k * .08, tp[1] - k * .68, k * .12, C.berry); heart(c, tp[0] + k * .36, tp[1] - k * .42, k * .07, C.pink);
}
const title = (c, s, x, y, px, fill, sh, o = {}) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075, ...o });

/* 9:16 · 1080×1920: trên là câu móc, giữa là cặp kiến to, dưới để trống cho giao diện Shorts */
export function poster(c) {
  c.save(); c.translate(0, 120); morning(c, 0, { sunX: 990, sunY: 1000 }); c.restore();
  c.save(); c.translate(-60, 150); c.scale(1.12, 1.12); stem(c, 0); c.restore();
  nearGround(c, 1720);
  pair(c, 270, 1520, 240, 360, 600);
  title(c, 'SNIFF', 540, 300, 210, C.grape, C.cream);
  title(c, 'HELLO?!', 540, 510, 210, C.berry, C.cream);
  title(c, 'TAP! TAP!', 540, 680, 110, C.lemon, C.grape);
}

/* 16:9 · 1920×1080: trái là cặp kiến, phải là tiêu đề; góc dưới-phải để trống (ô thời lượng) */
export function thumb(c) {
  c.save(); c.translate(0, -420); morning(c, 0, { sunX: 120, sunY: 560 }); c.restore();
  c.save(); c.translate(-80, -330); stem(c, 0); c.restore();
  pair(c, 260, 940, 200, 320, 520);
  title(c, 'SNIFF', 1430, 300, 200, C.grape, C.cream);
  title(c, 'HELLO?!', 1430, 500, 200, C.berry, C.cream);
  title(c, 'TAP! TAP!', 1430, 680, 110, C.lemon, C.grape);
}
