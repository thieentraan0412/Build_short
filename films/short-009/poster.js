// SHORT-009 · poster Shorts 9:16 và thumbnail YouTube 16:9. Concept "Ai là ruồi?": Fizz (ruồi, hai cánh) và Blink (tấm cánh bật lên)
// đứng cạnh nhau trên chiếc lá lúc hoàng hôn; chữ WHO'S THE FLY?! Khác ảnh bìa 007 (Blink bay) và 008 (lửa trại).
import { C, popText } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { ex, shadow } from '/_shared/episode.js';
import { duskSky, leaf, leafY, bigGlow, BLINK_WINGS } from './props.js';

function scene(c) {
  duskSky(c, 1.5); leaf(c);
  shadow(c, 440, leafY(440) + 2, 70, .2); drawChar(c, BY.fizz, { x: 440, y: leafY(440), k: 88, yaw: .7, showFx: false, expr: ex(BY.fizz, 'excited', { look: [.6, -.1] }), pose: { flap: .8 } });
  bigGlow(c, 640, leafY(680) - 70, 200, .8);
  shadow(c, 680, leafY(680) + 2, 90, .2); drawChar(c, BLINK_WINGS, { x: 680, y: leafY(680), k: 100, yaw: -.5, showFx: false, expr: ex(BY.blink, 'excited', { look: [-.6, -.1] }), pose: { glow: 1.6, cases: 1, wings: .8 } });
}
const title = (c, s, x, y, px, fill, sh) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075 });
export function poster(c) {
  c.save(); c.translate(540, 1300); c.scale(2.6, 2.6); c.translate(-565, -1185); scene(c); c.restore();
  title(c, "WHO'S", 540, 300, 210, C.lemon, C.ink);
  title(c, 'THE FLY?!', 540, 520, 180, C.cream, C.berryD);
}
export function thumb(c) {
  c.save(); c.translate(600, 640); c.scale(1.85, 1.85); c.translate(-560, -1140); scene(c); c.restore();
  title(c, "WHO'S", 1460, 380, 220, C.lemon, C.ink);
  title(c, 'THE FLY?!', 1460, 620, 180, C.cream, C.berryD);
}
