// Trang kiểm tra: bảng nhân vật của tập và storyboard, vẽ bằng đúng code của phim (rig dùng chung _shared/characters).
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';
import { antAt, smellCloud, SMELL } from './props.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);
const ARM = { armL: [-.4, -1.0, .45], armR: [.42, -1.05, .45] };

export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-005 · How Ants Say Hello · cast and key poses (shared rig, _shared/characters)', 40, 50, 38, C.ink, 'left');
  label(c, 'CRUMB · new pose "reach": antennae lean forward to touch another ant (0 = old antennae)', 40, 108, 26, C.honeyD, 'left');
  const F = [['reach 0 (as before)', 'happy', 0, 1.0, 0], ['reach .7', 'curious', .7, 1.0, 0], ['reach 1 · tap!', 'excited', 1, 1.0, 0], ['turns to camera', 'excited', .15, .25, 0], ['curl "?" after the squeak', 'confused', .3, 1.0, 1]];
  F.forEach(([n, e, reach, yaw, q], i) => {
    const x = 170 + i * 300; cell(c, x - 140, 130, 280, 440, C.mintL);
    drawChar(c, BY.crumb, { x: x - 20, y: 520, k: 105, yaw, expr: e, pose: { carry: null, reach, q, ...ARM }, showFx: false });
    label(c, n, x, 595, 22);
  });
  label(c, 'NON-SPEAKING · big sister (home smell) and the stranger: the same ant drawing, only the smell cloud differs (visible in the lens)', 40, 650, 26, C.leafD, 'left');
  cell(c, 20, 675, 700, 380, C.pink);
  smellCloud(c, 330, 860, 300, 150, 0, SMELL.home, .34); antAt(c, 220, 960, 200, 0, { dir: 1, walk: 0 }); label(c, 'sister · mint = same home', 370, 1025, 22);
  cell(c, 740, 675, 700, 380, C.pink);
  smellCloud(c, 1080, 860, 300, 150, 0, SMELL.away, .38); antAt(c, 980, 960, 200, 0, { dir: 1, walk: 0, eye: 'shut', shrug: 1 }); label(c, 'stranger · orange = other home (shrugs, walks back)', 1090, 1025, 22);
  cell(c, 1460, 130, 440, 925, C.mintL);
  drawChar(c, BY.loupe, { x: 1680, y: 900, h: 330, expr: 'laugh', showFx: false }); label(c, 'Miss Loupe', 1680, 960, 22);
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-005 · How Ants Say Hello: Tap, Tap! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
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
