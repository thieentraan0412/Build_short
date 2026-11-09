// SHORT-006 · poster Shorts 9:16 và thumbnail YouTube 16:9 (cùng một concept, hai bố cục).
// Concept: "Thú cưng làm kẹo": Crumb ôm một giọt ngọt to, tròn mắt, cạnh chú rệp xanh cười tít; giọt ngọt lấp lánh.
// Khác ảnh bìa SHORT-004 (Crumb vác vụn bánh, "ANTENNA NOSES?!") và SHORT-005 (hai chú kiến chạm râu). Rig dùng chung, khối phẳng.
import { C, popText, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { ex, rigPt, shadow } from '/_shared/episode.js';
import { sky, bush, leaf, aphid, dropBall } from './props.js';

function pair(c, x, y, k, s, gap) {                              // Crumb (trái) ôm giọt ngọt, chú rệp (phải)
  shadow(c, x + gap, y + 2, s * .8, .16);
  aphid(c, x + gap, y, s, { dir: -1, eye: 'happy' });
  shadow(c, x + 10, y + 2, k, .18);
  drawChar(c, BY.crumb, { x, y, k, yaw: .5, showFx: false, expr: ex(BY.crumb, 'excited', { look: [.2, -.1] }), pose: { carry: null, reach: .6, armL: [-.22, -1.42, .78], armR: [.22, -1.42, .8] } });
  const d = rigPt(x, y, k, .5, 0, [0, -1.42, 1.02]); dropBall(c, d[0], d[1], k * .42);
  for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + .3; star(c, d[0] + Math.cos(a) * k * .7, d[1] + Math.sin(a) * k * .62, k * .07, C.lemon); }
}
const title = (c, s, x, y, px, fill, sh, o = {}) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075, ...o });

/* 9:16 · 1080×1920: trên là câu móc, giữa là Crumb và chú rệp to, dưới để trống cho giao diện Shorts */
export function poster(c) {
  c.save(); c.translate(0, 80); sky(c, 0, { sunX: 900, sunY: 820 }); c.restore();
  c.save(); c.translate(0, 330); bush(c, 0); leaf(c, 0); c.restore();
  pair(c, 330, 1530, 190, 330, 360);
  title(c, 'SWEET', 540, 300, 220, C.berry, C.cream);
  title(c, 'PET?!', 540, 520, 230, C.grape, C.cream);
}

/* 16:9 · 1920×1080: trái là Crumb và chú rệp, phải là tiêu đề; góc dưới-phải để trống (ô thời lượng) */
export function thumb(c) {
  c.save(); c.translate(0, -420); sky(c, 0, { sunX: 160, sunY: 600 }); c.restore();
  c.save(); c.translate(-120, -300); bush(c, 0); leaf(c, 0); c.restore();
  pair(c, 260, 930, 170, 290, 330);
  title(c, 'SWEET', 1400, 330, 220, C.berry, C.cream);
  title(c, 'PET?!', 1400, 560, 230, C.grape, C.cream);
}
