// SHORT-014 · poster Shorts 9:16 và thumbnail YouTube 16:9. Concept "Tai ở bụng?!": Crumb áp tai vào bụng Hop, màng nhĩ bên bụng sáng lên
// và gợn sóng, vòng sóng âm vàng bay vào; chữ TUMMY EARS?! Khác ảnh bìa 009 (ruồi và đom đóm trên lá lúc hoàng hôn) và 010 (Zip bên bờ ao).
import { C, popText } from '/_shared/kit.js';
import { LOOK } from '/_shared/characters/look.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { ex, shadow, rigPt } from '/_shared/episode.js';
import { sky, stone, cookie, drumExtra, GY, D } from './props.js';
LOOK.v = 2;
LOOK.cheer = true;   // (11/2026) mặt nhân vật luôn vui tươi (QUALITY.md §5, stage.js cheerExpr)

function scene(c) {
  sky(c, 1.5); stone(c);
  cookie(c, 778, GY + 26, 1, 0);
  shadow(c, 480, GY + 6, 170, .18);
  const P = { ear: 1, ant: 1.2 };
  drawChar(c, BY.hop, { x: 490, y: GY, k: 130, yaw: -.9, showFx: false, expr: ex(BY.hop, 'laugh'), pose: P, extra: drumExtra(P, { glow: 1, ripples: [.25, .6], vib: .6 }) });
  // vòng gợn quanh màng nhĩ
  const d = rigPt(490, GY, 130, -.9, 0, [.353, -.819, -.264]);
  c.lineCap = 'round';
  for (const [r, a] of [[42, .95], [62, .75], [82, .5]]) { c.strokeStyle = D.ink; c.lineWidth = 8; c.beginPath(); c.arc(d[0], d[1], r, Math.PI * .5, Math.PI * 1.7); c.stroke(); c.strokeStyle = `rgba(123,240,208,${a + .05})`; c.lineWidth = 4.5; c.beginPath(); c.arc(d[0], d[1], r, Math.PI * .5, Math.PI * 1.7); c.stroke(); }
  shadow(c, 633, GY + 18, 56, .18);
  drawChar(c, BY.crumb, { x: 633, y: GY + 14, k: 76, yaw: -.55, lean: -.32, showFx: false, expr: ex(BY.crumb, 'surprised', { look: [-.4, -.5] }), pose: { carry: null, armL: [-.5, -1.25, .4], armR: [-.1, -1.95, .35] } });
}
const title = (c, s, x, y, px, fill, sh) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075 });
export function poster(c) {
  c.save(); c.translate(540, 1250); c.scale(2.15, 2.15); c.translate(-548, -1110); scene(c); c.restore();
  title(c, 'TUMMY', 540, 330, 230, C.lemon, C.ink);
  title(c, 'EARS?!', 540, 560, 220, C.cream, C.berryD);
}
export function thumb(c) {
  c.save(); c.translate(620, 600); c.scale(1.95, 1.95); c.translate(-560, -1080); scene(c); c.restore();
  title(c, 'TUMMY', 1480, 400, 230, C.lemon, C.ink);
  title(c, 'EARS?!', 1480, 640, 210, C.cream, C.berryD);
}
