// Trang kiểm tra: bảng nhân vật và storyboard, vẽ bằng đúng code của phim.
import { C, circle, rrect, subFont, bigFont, popText, wrap, ground } from './kit.js';
import { lup, butterfly, cricket, bee, flower } from './cast.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }

export function modelSheet(c, W, H) {
  ground(c, C.cream);
  label(c, 'Big Secrets of Tiny Bugs — model sheet', 50, 56, 44, C.ink, 'left');
  label(c, 'MISS LOUPE: expressions', 50, 118, 28, C.berry, 'left');
  const ex = [['happy', 'happy', 0], ['wow', 'amazed', 0], ['laugh', 'laughing', 0], ['shock', 'let down', 0], ['cross', 'cross-eyed up', 0], ['happy', 'talking', .9]];
  ex.forEach(([e, n, talk], i) => { const x = 150 + i * 215; circle(c, x, 240, 74, C.mint); lup(c, x, 240, 88, { expr: e, talk, rot: 0 }); label(c, n, x, 500, 24); });
  label(c, 'MISS LOUPE: poses', 1350, 118, 28, C.berry, 'left');
  [[-.34, [.46, -.2], [-.42, .12]], [.3, [.42, .12], [-.5, -.2]], [0, [.5, -.5], [-.5, -.5]]].forEach(([rot, r, l], i) => { const x = 1430 + i * 170; circle(c, x, 240, 66, C.sky); lup(c, x, 240, 78, { rot, armR: r, armL: l, expr: i == 2 ? 'laugh' : 'happy' }); });
  label(c, 'peering / leaning / cheering', 1600, 500, 24);
  label(c, 'THE THREE BUGS', 50, 560, 28, C.berry, 'left');
  rrect(c, 40, 590, 560, 410, 30, C.mint); flower(c, 310, 830, 96, { petal: C.berry, heart: C.lemon, n: 7 }); butterfly(c, 310, 740, 86, { wingA: C.grape, flap: .1 });
  rrect(c, 620, 590, 620, 410, 30, C.night); cricket(c, 880, 800, 110, { detail: 1, glow: 1, chirp: .5 });
  rrect(c, 1260, 590, 580, 410, 30, C.honey); bee(c, 1550, 800, 112, { wing: .4 });
  label(c, 'Palette', 50, 1040, 26, C.ink, 'left');
  ['mango', 'tang', 'berry', 'pink', 'grape', 'night', 'leaf', 'lime', 'mint', 'sky', 'honey', 'lemon', 'cream', 'ink'].forEach((k, i) => { rrect(c, 180 + i * 118, 1016, 106, 48, 14, C[k]); });
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'Big Secrets of Tiny Bugs — storyboard (frames drawn with the film\'s own code)', 30, 44, 34, C.cream, 'left');
  const fw = 340, fh = 604, cap = 136, gap = 26, top = 84;
  BOARD.forEach((b, i) => {
    const col = i < 5 ? i : i - 5, row = i < 5 ? 0 : 1, x = gap + col * (fw + gap), y = top + row * (fh + cap + gap);
    const oc = off.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, 1080, 1920); drawFilm(oc, b.t);
    c.drawImage(off, x, y, fw, fh);
    rrect(c, x, y + fh, fw, cap, 0, '#2A2650');
    label(c, `Shot ${b.shot} · ${b.frame} · ${b.dur}`, x + 14, y + fh + 28, 23, C.lemon, 'left');
    c.font = subFont(23); const ls = wrap(c, b.line, fw - 28).slice(0, 3); ls.forEach((l, k) => label(c, l, x + 14, y + fh + 64 + k * 30, 23, C.cream, 'left'));
  });
}
