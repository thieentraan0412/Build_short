// Trang kiểm tra: bảng nhân vật của tập (Fizz ra mắt) và storyboard, vẽ bằng đúng code của phim (rig dùng chung _shared/characters).
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';
import { BLINK_WINGS, D, countBadge, fizzle } from './props.js';
import { ex } from '/_shared/episode.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);

export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-009 · Is a Firefly a Fly? Nope! · FIZZ joins the cast (guest, _shared/characters/cast/fizz.js)', 40, 50, 34, C.ink, 'left');
  label(c, 'FIZZ, the house fly · non-speaking · ONE pair of clear wings + two tiny knobs (halteres) · red compound-eye domes · slate body, grey bands', 40, 104, 22, '#3D4470', 'left');
  const F = [['front', 0, 'happy', {}], ['3/4', .7, 'curious', {}], ['side', 1.5, 'happy', {}], ['back 3/4', 2.4, 'happy', {}], ['wings spread: count 1, 2', .5, 'excited', { flap: 1 }], ['rubs front legs', .6, 'happy', { rub: 1.3 }], ['strain (tries to glow)', .4, 'strain', {}], ['sad', .6, 'sad', {}]];
  F.forEach(([n, yaw, e, p], i) => { const x = 140 + (i % 4) * 300, y = i < 4 ? 400 : 800; cell(c, x - 135, y - 270, 270, 330, i < 4 ? C.mintL : C.skyL); drawChar(c, BY.fizz, { x, y, k: 130, yaw, showFx: false, expr: ex(BY.fizz, e), pose: p }); label(c, n, x, y + 35, 19); });
  label(c, 'BLINK (episode copy of the rig): wing cases lift (cases) and thin wings open (wings) separately · counting 1 2 + 3 4', 40, 925, 22, C.grape, 'left');
  const B = [['closed', 0, 0], ['cases up', 1, 0], ['cases + wings', 1, 1]];
  B.forEach(([n, cs, w], i) => { const x = 180 + i * 330; cell(c, x - 155, 950, 310, 360, D.sky3); drawChar(c, BLINK_WINGS, { x, y: 1240, k: 120, yaw: -.35, showFx: false, expr: ex(BY.blink, 'happy'), pose: { glow: 1, cases: cs, wings: w } }); label(c, n, x, 1285, 20, C.cream); });
  countBadge(c, 1110, 1050, 1, 9, 0, C.mint); countBadge(c, 1230, 1050, 3, 9, 0, C.white, C.grape); fizzle(c, 1150, 1230, .35);
  cell(c, 1460, 130, 440, 1180, C.mintL);
  drawChar(c, BY.loupe, { x: 1680, y: 820, h: 380, expr: 'happy', showFx: false }); label(c, 'Miss Loupe', 1680, 870, 22);
  drawChar(c, BY.albie, { x: 1680, y: 1200, h: 170, expr: 'happy', showFx: false }); label(c, 'Albie', 1680, 1240, 22);
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-009 · Is a Firefly a Fly? Nope! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
  const fw = 340, fh = 604, cap = 136, gap = 26, top = 84;
  BOARD.forEach((b, i) => {
    const col = i < 5 ? i : i - 5, row = i < 5 ? 0 : 1, x = gap + col * (fw + gap), y = top + row * (fh + cap + gap);
    const oc = off.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, 1080, 1920); drawFilm(oc, b.t);
    c.drawImage(off, x, y, fw, fh);
    rrect(c, x, y + fh, fw, cap, 0, '#2A2650');
    label(c, `Shot ${b.shot} · ${b.frame} · ${b.dur}`, x + 14, y + fh + 28, 21, C.lemon, 'left');
    c.font = subFont(23); const ls = wrap(c, b.line, fw - 28).slice(0, 3); ls.forEach((l, k) => label(c, l, x + 14, y + fh + 64 + k * 30, 23, C.cream, 'left'));
  });
}
