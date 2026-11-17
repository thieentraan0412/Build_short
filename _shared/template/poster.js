// Ảnh bìa riêng: Shorts 9:16 (poster) và thumbnail YouTube 16:9 (thumb). Thay bằng ảnh bìa của tập (xem films/short-015/poster.js).
import { drawFilm } from './film.js';
export function poster(c) { drawFilm(c, .4); }
export function thumb(c) { c.save(); c.translate(420, -540); drawFilm(c, .4); c.restore(); }
