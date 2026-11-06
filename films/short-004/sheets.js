// Trang kiểm tra: bảng nhân vật của tập và storyboard, vẽ bằng đúng code của phim (rig dùng chung _shared/characters).
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';
import { workerAnt, aphid, honeydew, tinyMap, cookie } from './props.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);
const UP = { armL: [-.32, -2.5, .25], armR: [.32, -2.5, .25] };

export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-004 · Crumb debuts · cast and key poses (shared rig, _shared/characters)', 40, 50, 38, C.ink, 'left');
  label(c, 'CRUMB (new) · amber ant, baby-big head, question-mark antennae, always carries something too big', 40, 108, 26, C.honeyD, 'left');
  const F = [['carries a crumb', 'happy', { ...UP }, 1], ['asks: antennae "?"', 'curious', { ...UP }, 0], ['"Ants can!"', 'excited', {}, 0], ['holds a tiny map', 'curious', { armL: [-.3, -1.35, .7], armR: [.34, -1.4, .72] }, 2], ['"Not yet!"', 'sad', { armL: [-.3, -.9, .4], armR: [.3, -.9, .4] }, 0]];
  F.forEach(([n, e, pose, prop], i) => {
    const x = 160 + i * 300; cell(c, x - 140, 130, 280, 420, C.mintL);
    drawChar(c, BY.crumb, { x, y: 500, k: 95, yaw: .7, expr: e, pose: { carry: null, ...pose }, showFx: false });
    if (prop === 1) cookie(c, x, 500 - 2.75 * 95, 95 * 1.1, .08);
    if (prop === 2) tinyMap(c, x + 30, 500 - 1.4 * 95, 120, 84, -.08);
    label(c, n, x, 575, 22);
  });
  label(c, 'NON-SPEAKING · worker ants, aphids ("tiny cows"), honeydew', 40, 630, 26, C.leafD, 'left');
  cell(c, 20, 655, 580, 380, C.skyL);
  workerAnt(c, 170, 860, 100, .2); workerAnt(c, 420, 860, 100, .6, { tap: 1 }); label(c, 'worker ant · antenna tap', 300, 1000, 22);
  cell(c, 620, 655, 420, 380, C.skyL);
  aphid(c, 790, 880, 110); honeydew(c, 690, 850, 16); label(c, 'aphid + honeydew drop', 830, 1000, 22);
  cell(c, 1060, 655, 420, 380, C.skyL);
  c.save(); c.beginPath(); c.roundRect(1060, 655, 420, 380, 28); c.clip(); drawChar(c, BY.giant, { x: 1270, y: 950, k: 70, showFx: false, pose: { part: 'hand', gesture: 'point', rot: [Math.PI, 0, 0] } }); c.restore(); label(c, 'The Giant · pointing finger', 1270, 1000, 22);
  cell(c, 1500, 130, 400, 905, C.mintL);
  drawChar(c, BY.loupe, { x: 1700, y: 900, h: 330, expr: 'surprised', showFx: false }); label(c, 'Miss Loupe', 1700, 960, 22);
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-004 · Ants Sniff With Their Antennae! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
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
