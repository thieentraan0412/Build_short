// SHORT-011 · poster Shorts 9:16 và thumbnail YouTube 16:9. Concept "Rình chuồn chuồn": Crumb giơ biển BOO! sau lưng Zip (9:16);
// thumbnail là chính khung chia đôi của tập: "CRUMB SEES" lưng Zip | "ZIP SEES" thấy rõ Crumb. Khác ảnh bìa 010 (Crumb rón rén sau Miss Loupe).
import { C, popText } from '/_shared/kit.js';
import { hookWorld, splitAt } from './film.js';
import { D } from './props.js';

const title = (c, s, x, y, px, fill, sh) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075, read: false });
export function poster(c) {
  c.save(); c.translate(540, 1200); c.scale(1.4, 1.4); c.translate(-488, -945); hookWorld(c, 1.6); c.restore();
  title(c, 'SNEAK', 540, 330, 220, C.grape, C.lemon);
  title(c, 'UP?!', 540, 540, 210, C.berry, C.ink);
}
export function thumb(c) {
  c.fillStyle = D.night; c.fillRect(0, 0, 1920, 1080);
  c.save(); c.translate(30, 20); c.scale(.93, .93); c.translate(-20, -186); splitAt(c, 8.75); c.restore();
  title(c, 'SNEAK', 1480, 470, 220, C.lemon, C.ink);
  title(c, 'UP?!', 1480, 700, 210, C.cream, C.berryD);
}
