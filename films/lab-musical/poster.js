// SHORT-015 · poster Shorts 9:16 và thumbnail YouTube 16:9. Concept "Vĩ cầm chân": Hop nhắm mắt kéo đùi sau trên sân khấu gốc cây
// lúc chạng vạng, nốt nhạc bật ra; Miss Loupe tròn mắt soi; cây vĩ cầm bên cạnh; chữ LEG VIOLIN?! Khác ảnh bìa 013/014 (tai ở bụng) và 009 (hoàng hôn trên lá).
import { C, popText } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { ex, shadow, loupe, ARM } from '/_shared/episode.js';
import { STAGE, sky, bandshell, spotlight, stump, noteGlyph, NOTE_COL, violin } from './props.js';

function scene(c) {
  sky(c, 1.2); bandshell(c, 1.2, 1.3); spotlight(c, 1.2, 420, .1); stump(c, 1.2);
  shadow(c, 360, STAGE.y + 6, 250, .22);
  drawChar(c, BY.hop, { x: 400, y: STAGE.y, k: 150, yaw: 1.25, exprPose: false, expr: ex(BY.hop, 'laugh', { closed: 'happy' }), pose: { fiddle: .9, bow: Math.PI / 2, lift: .03, ant: .8 } });
  shadow(c, 776, STAGE.y + 4, 110, .22);
  loupe(c, 770 - .1 * 2.73 * 108, STAGE.y - 2.73 * 108, 108, { E: ex(BY.loupe, 'surprised', { look: [-.8, .05] }), rot: -.1, pose: { handL: [-.82, -1.3, .1], handR: [.82, -1.3, .1] } });
  [[300, 860, 1.3, 0], [430, 760, 1.1, 1], [200, 760, 1.0, 2], [560, 880, .9, 3], [360, 650, 1.0, 4]].forEach(([x, y, s, i]) => noteGlyph(c, x, y, s, NOTE_COL[i], -.2 + .15 * i, i));
}
const title = (c, s, x, y, px, fill, sh) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075 });
export function poster(c) {
  c.save(); c.translate(540, 1340); c.scale(1.55, 1.55); c.translate(-520, -1100); scene(c); c.restore();
  violin(c, 905, 760, .62, .3, .15);
  title(c, 'LEG', 540, 300, 230, C.lemon, C.ink);
  title(c, 'VIOLIN?!', 540, 520, 190, C.cream, C.berryD);
}
export function thumb(c) {
  c.save(); c.translate(560, 640); c.scale(1.2, 1.2); c.translate(-520, -1060); scene(c); c.restore();
  violin(c, 1080, 560, .6, .3, .15);
  title(c, 'LEG', 1500, 400, 230, C.lemon, C.ink);
  title(c, 'VIOLIN?!', 1500, 640, 170, C.cream, C.berryD);
}
