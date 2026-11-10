// SHORT-010 · poster Shorts 9:16 và thumbnail YouTube 16:9. Concept "Sau lưng bạn!": Crumb rón rén sau lưng Zip, nhưng con ngươi của Zip
// đã liếc ra sau nhìn thẳng vào Crumb; kính tròn soi mắt kép thấy các ô mắt, mỗi ô một Crumb tí hon. Chữ BEHIND YOU?!
// Khác ảnh bìa 007 (Blink bay đêm), 008 (lửa trại), 009 (Fizz và Blink trên lá).
import { C, popText, circle } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { ex, shadow } from '/_shared/episode.js';
import { pondSky, pondBank, groundY, facets } from './props.js';

const tinyCrumb = () => ({ key: 'cover', draw: cc => drawChar(cc, BY.crumb, { x: 0, y: 0, k: 52, yaw: .15, showFx: false, expr: ex(BY.crumb, 'laugh'),
  pose: { carry: null, armL: [-.4, -1.0, .45], armR: [.85, -2.45, .3] } }) });
function scene(c) {
  pondSky(c, 1.2); pondBank(c, 1.2, { noStone: true });
  shadow(c, 300, groundY(300) + 2, 110, .2);
  drawChar(c, BY.crumb, { x: 300, y: groundY(300), k: 105, yaw: .9, showFx: false, expr: ex(BY.crumb, 'excited', { look: [.8, -.2] }),
    pose: { carry: null, lift: .12, armL: [-.5, -2.0, .62], armR: [.5, -2.05, .62], feet: [[-.4, -.3, .5], [-.48, 0, -.1], [.4, 0, .3], [.48, -.2, -.3]] } });
  shadow(c, 650, groundY(650) + 2, 120, .18);
  drawChar(c, BY.zip, { x: 650, y: groundY(650) - 20, k: 150, yaw: .55, showFx: false, expr: ex(BY.zip, 'confident', { look: [-.9, .05] }), pose: { peek: -1.65 } });
}
function inset(c, x, y, r) {                                       // kính tròn soi mắt kép: mỗi ô một Crumb tí hon (toạ độ khung)
  circle(c, x + 10, y + 14, r + 26, 'rgba(30,27,58,.22)'); circle(c, x, y, r + 26, C.berry);
  facets(c, x, y, r, 22, { a: 1, n: 4.2, refl: 1, pose: tinyCrumb });
  c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.arc(x, y, r * .78, Math.PI * 1.1, Math.PI * 1.45); c.stroke();
}
const title = (c, s, x, y, px, fill, sh) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075 });
export function poster(c) {
  c.save(); c.translate(540, 1300); c.scale(1.55, 1.55); c.translate(-500, -1080); scene(c); c.restore();
  inset(c, 790, 760, 190);
  title(c, 'BEHIND', 540, 270, 200, C.lemon, C.ink);
  title(c, 'YOU?!', 470, 480, 230, C.pink, C.berryD);
}
export function thumb(c) {
  c.save(); c.translate(520, 700); c.scale(1.45, 1.45); c.translate(-500, -1030); scene(c); c.restore();
  inset(c, 860, 300, 175);
  title(c, 'BEHIND', 1500, 420, 200, C.lemon, C.ink);
  title(c, 'YOU?!', 1500, 650, 230, C.pink, C.berryD);
}
