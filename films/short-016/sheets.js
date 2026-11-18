// Trang kiểm tra: bảng nhân vật của tập và storyboard, vẽ bằng đúng code của phim. Thay bằng bảng của tập (xem films/short-015/sheets.js).
import { C, ground, subFont } from '/_shared/kit.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';

const label = (c, s, x, y, px = 26, f = C.ink) => { c.font = subFont(px); c.fillStyle = f; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(s, x, y); };
export function modelSheet(c) { ground(c, C.cream); label(c, 'SHORT-016 · model sheet', 40, 50, 34); }
export function storyboard(c, W, H, off) {
  ground(c, C.ink); label(c, 'SHORT-016 — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream);
  const fw = 340, fh = 604, gap = 26;
  BOARD.forEach((b, i) => {
    const x = gap + (i % 5) * (fw + gap), y = 84 + Math.floor(i / 5) * (fh + 160);
    const oc = off.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, 1080, 1920); drawFilm(oc, b.t);
    c.drawImage(off, x, y, fw, fh); label(c, `${b.shot} · ${b.frame} · ${b.dur}`, x, y + fh + 24, 18, C.cream); label(c, b.line, x, y + fh + 54, 18, C.lemon);
  });
}
