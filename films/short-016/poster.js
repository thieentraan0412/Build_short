// Ảnh bìa riêng: Shorts 9:16 (poster) và thumbnail YouTube 16:9 (thumb), vẽ bằng đúng code của phim.
// Poster: khung móc (chữ BUGS IN SNOW?!, Miss Loupe quàng khăn, Albie, tổ ong, chấm cam của Dot). Thumbnail: kính ấm với quả bóng ong + chữ móc.
import { C, ground, popText } from '/_shared/kit.js';
import { drawFilm } from './film.js';
export function poster(c) { drawFilm(c, .45); }
export function thumb(c) {
  ground(c, '#8ED6FF');
  c.save(); c.translate(1010, -330); c.scale(.82, .82); drawFilm(c, 10.2, { noSub: true }); c.restore();
  popText(c, 'BUGS IN', 500, 430, 190, C.lemon, C.ink, -1, -1, { read: false, sh: 12 });
  popText(c, 'SNOW?!', 500, 690, 250, C.cream, C.berryD, -1, -1, { read: false, sh: 16 });
}
