// SHORT-012 · poster Shorts 9:16 và thumbnail YouTube 16:9. Concept "Đi đuôi trước": Zip phanh kít, bay giật lùi ngay trước kính của
// Miss Loupe đang giật mình, vệt gió nằm trước đầu Zip; chữ TAIL FIRST?!. Khác ảnh bìa 010 (Crumb rón rén, Zip trên vành kính) và 009 (hai bạn trên lá).
import { LOOK } from '/_shared/characters/look.js';
import { C, popText } from '/_shared/kit.js';
import { BY } from '/_shared/characters/cast/index.js';
import { ex, loupe, ARM, LENS_UP } from '/_shared/episode.js';
import { garden, GY } from './props.js';
import { drawZip } from './film.js';
LOOK.v = 2;
LOOK.cheer = true;   // (11/2026) mặt nhân vật luôn vui tươi (QUALITY.md §5, stage.js cheerExpr)

function scene(c) {
  garden(c, 1.5);
  loupe(c, 360, GY - LENS_UP * 95, 95, { E: ex(BY.loupe, 'surprised', { look: [.9, -.1] }), rot: -.22, pose: ARM.up });
  drawZip(c, { x: 600, y: 1030, k: 66, yaw: -1.2, lean: .08, lift: .3, fly: 1, wind: [1, 1], E: ex(BY.zip, 'excited', { look: [-.8, 0] }) }, 1.5);
}
const title = (c, s, x, y, px, fill, sh) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075 });
export function poster(c) {
  c.save(); c.translate(540, 1260); c.scale(2.0, 2.0); c.translate(-515, -1010); scene(c); c.restore();
  title(c, 'TAIL', 540, 330, 240, C.lemon, C.ink);
  title(c, 'FIRST?!', 540, 560, 210, C.cream, C.berryD);
}
export function thumb(c) {
  c.save(); c.translate(560, 600); c.scale(1.75, 1.75); c.translate(-520, -990); scene(c); c.restore();
  title(c, 'TAIL', 1490, 420, 240, C.lemon, C.ink);
  title(c, 'FIRST?!', 1490, 650, 200, C.cream, C.berryD);
}
