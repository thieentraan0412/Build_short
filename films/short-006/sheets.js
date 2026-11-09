// Trang kiểm tra: bảng nhân vật của tập và storyboard, vẽ bằng đúng code của phim (rig dùng chung _shared/characters).
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';
import { aphid, dropBall, dropTear } from './props.js';
import { rigPt } from '/_shared/episode.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);

export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-006 · Ants Run a Tiny Cow Farm?! · cast and key poses (shared rig, _shared/characters)', 40, 50, 38, C.ink, 'left');
  label(c, 'THE APHID ("tiny cow") · non-speaking · redrawn from SHORT-004 for close-ups', 40, 108, 26, C.leafD, 'left');
  const A = [['open', {}], ['tapped: squish + happy eyes', { sq: .8, eye: 'happy' }], ['wide (the drop pops)', { eye: 'wide', look: [-.9, .2] }], ['wink', { eye: 'wink' }], ['pretend cow spots + bell', { cow: 1, eye: 'happy' }]];
  A.forEach(([n, o], i) => { const x = 175 + i * 285; cell(c, x - 135, 130, 270, 330, C.mintL); aphid(c, x - 10, 380, 165, { dir: 1, ...o }); label(c, n, x, 430, 19); });
  label(c, 'THE SWEET DROP (honeydew) · swelling at the tail, then a bouncy ball (cartoon exaggeration)', 40, 500, 26, C.honeyD, 'left');
  cell(c, 40, 525, 900, 260, C.skyL);
  [10, 18, 26].forEach((r, i) => dropTear(c, 140 + i * 120, 690, r));
  [[540, 0], [680, .3], [820, -.3]].forEach(([x, sq]) => dropBall(c, x, 660, 50, sq));
  label(c, 'CRUMB · holds the drop (hug), carries it overhead (up), leans in to tap', 40, 830, 26, C.honeyD, 'left');
  const F = [['hug the drop', 'excited', [[-.22, -1.42, .78], [.22, -1.42, .8]], 0], ['overhead', 'surprised', [[-.62, -2.45, .2], [.62, -2.45, .2]], 0], ['leans in: tap!', 'curious', [[-.4, -1.0, .45], [.42, -1.05, .45]], .38]];
  F.forEach(([n, e, [L, R], lean], i) => { const x = 180 + i * 320; cell(c, x - 150, 860, 300, 420, C.mintL); drawChar(c, BY.crumb, { x: x - 20, y: 1220, k: 110, yaw: 1, lean, expr: e, pose: { carry: null, reach: lean ? 1 : .5, armL: L, armR: R }, showFx: false });
    if (i < 2) { const d = rigPt(x - 20, 1220, 110, 1, 0, i ? [0, -2.85, .2] : [0, -1.42, 1.02]); dropBall(c, d[0], d[1], 40); }
    label(c, n, x, 1255, 22); });
  cell(c, 1460, 130, 440, 1150, C.mintL);
  drawChar(c, BY.loupe, { x: 1680, y: 1000, h: 380, expr: 'laugh', showFx: false }); label(c, 'Miss Loupe', 1680, 1060, 22);
  drawChar(c, BY.albie, { x: 1680, y: 1240, h: 150, expr: 'happy', showFx: false }); label(c, 'Albie', 1680, 1265, 22);
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-006 · Ants Run a Tiny Cow Farm?! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
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
