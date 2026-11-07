// Ảnh bìa LONG-001: thumbnail YouTube 16:9 (chính) và bản dọc 9:16. Không có phụ đề.
import { C, popText, rrect } from '/_shared/kit.js';
import { drawFilm } from './film.js';
import { snowflake } from './props.js';

export function thumb(c) {
  drawFilm(c, 13.6, { noSub: true });                             // bậu cửa sổ: Albie đóng băng, Crumb ló ra, Miss Loupe
  rrect(c, 40, 760, 1840, 290, 50, 'rgba(30,27,58,.62)');         // chữ đặt trên mặt bậu gỗ, không che nhân vật
  popText(c, 'HOW DO BUGS TASTE,', 960, 880, 112, C.cream, C.grape, -1, 0, { read: false });
  popText(c, 'SMELL & HEAR?', 960, 1010, 120, C.lemon, C.berry, -1, 0, { read: false });
  snowflake(c, 1760, 820, 70, .3, { glow: 1, arms: [1, 1, 1, 1, 1, 1] });
}
export function poster(c) {
  c.fillStyle = C.grape; c.fillRect(0, 0, 1080, 1920);
  c.save(); c.translate(-420, 420); drawFilm(c, 13.6, { noSub: true }); c.restore();
  popText(c, 'A SNOWY', 540, 220, 130, C.cream, C.night, -1, 0, { read: false });
  popText(c, 'ADVENTURE', 540, 360, 130, C.lemon, C.berry, -1, 0, { read: false });
  snowflake(c, 540, 1660, 120, .2, { glow: 1, arms: [1, 1, 1, 1, 1, 1] });
}
