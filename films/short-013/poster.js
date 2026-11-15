// SHORT-013 · poster Shorts 9:16 và thumbnail YouTube 16:9. Concept "Tai ở bụng!": Chirp và Hop đứng cạnh nhau trên gốc cây (trông giống nhau),
// kính tròn soi sườn Hop thấy màng nghe tròn đang rung; mũi tên chỉ vào bụng. Chữ EARS / HERE?!
// Khác ảnh bìa 007 (Blink bay đêm), 008 (lửa trại), 009 (Fizz và Blink trên lá), 010 (bờ ao, Zip và Crumb).
import { LOOK } from '/_shared/characters/look.js';
import { C, popText, circle } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { ex, shadow, rigPt } from '/_shared/episode.js';
import { meadowSky, meadowGround, STUMP, ripple } from './props.js';
LOOK.v = 2;
LOOK.cheer = true;   // (11/2026) mặt nhân vật luôn vui tươi (QUALITY.md §5, stage.js cheerExpr)

function scene(c) {
  meadowSky(c, 1.2); meadowGround(c, 1.2);
  shadow(c, 572, STUMP.top + 4, 70, .16); shadow(c, 750, STUMP.top + 4, 70, .16);
  drawChar(c, BY.chirp, { x: 565, y: STUMP.top, k: 72, yaw: -.35, showFx: false, detail: 1, expr: ex(BY.chirp, 'surprised', { look: [.8, -.1] }), pose: { earGlow: 1, lift: .1 } });
  drawChar(c, BY.hop, { x: 742, y: STUMP.top, k: 72, yaw: -1.0, showFx: false, detail: 1, expr: ex(BY.hop, 'excited', { look: [-.4, .2] }), pose: { ear: 1, wingOpen: .8 } });
  drawChar(c, BY.crumb, { x: 440, y: 1240, k: 55, yaw: .55, showFx: false, expr: ex(BY.crumb, 'surprised', { look: [.8, -.6] }), pose: { carry: null, q: 1, armL: [-.62, -1.72, .3], armR: [.62, -1.72, .3] } });
}
function inset(c, x, y, r) {                                       // kính tròn soi tai bụng của Hop (toạ độ khung)
  circle(c, x + 10, y + 14, r + 26, 'rgba(30,27,58,.22)'); circle(c, x, y, r + 26, C.berry);
  c.save(); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.clip(); circle(c, x, y, r, '#FFF1C9');
  const e = rigPt(0, 0, 300, -1.1, 0, BY.hop.ear(1));
  c.translate(x - e[0], y - e[1]);
  drawChar(c, BY.hop, { x: 0, y: 0, k: 300, yaw: -1.1, showFx: false, detail: 1, expr: ex(BY.hop, 'happy'), pose: { ear: 1, wingOpen: .8 } });
  for (const q of [.2, .5, .8]) ripple(c, e[0], e[1], 26, q, C.mint, 1);
  c.restore();
  c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.arc(x, y, r * .78, Math.PI * 1.1, Math.PI * 1.45); c.stroke();
}
const title = (c, s, x, y, px, fill, sh) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075 });
export function poster(c) {
  c.save(); c.translate(540, 1360); c.scale(1.7, 1.7); c.translate(-620, -1100); scene(c); c.restore();
  inset(c, 760, 780, 200);
  title(c, 'EARS', 540, 290, 220, C.lemon, C.ink);
  title(c, 'HERE?!', 470, 500, 210, C.pink, C.berryD);
}
export function thumb(c) {
  c.save(); c.translate(560, 700); c.scale(1.5, 1.5); c.translate(-620, -1090); scene(c); c.restore();
  inset(c, 960, 300, 180);
  title(c, 'EARS', 1480, 600, 190, C.lemon, C.ink);
  title(c, 'HERE?!', 1470, 820, 190, C.pink, C.berryD);
}
