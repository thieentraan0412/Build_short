// Trang kiểm tra: bảng nhân vật của tập (Hop: dáng kéo vĩ cầm, biểu cảm; cận cảnh hàng gai; Miss Loupe thử cọ chân) và storyboard,
// vẽ bằng đúng code của phim (rig dùng chung _shared/characters, LOOK.v = 2 bật trong film.js).
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';
import { D, macro, violin, noteGlyph, NOTE_COL } from './props.js';
import { ex } from '/_shared/episode.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);

export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-015 · Grasshoppers Play Their Legs Like a Violin! · HOP (guest, _shared/characters/cast/hop.js) · look v2', 40, 50, 34, C.ink, 'left');
  label(c, 'HOP, the grasshopper · non-speaking · leaf-green body, tan folded wings, short forward antennae, striped hind femur with a row of pegs (inner side)', 40, 102, 22, '#3D4470', 'left');
  const P = [['side · rest', 1.25, 'happy', {}], ['bow up (fiddle +1)', 1.25, 'laugh', { fiddle: 1 }], ['bow down (fiddle −1)', 1.25, 'laugh', { fiddle: -1 }], ['3/4', .7, 'happy', {}],
    ['surprised', 1.0, 'surprised', { lift: .07, ant: 1.5 }], ['giggle (silly)', .8, 'silly', { frontR: [.4, -.95, 1.32] }], ['ready (hindUp)', 1.25, 'confident', { hindUp: .55 }], ['pegs (detail)', 1.25, 'happy', { pegs: true }]];
  P.forEach(([n, yaw, e, p], i) => { const x = 175 + (i % 4) * 330, y = i < 4 ? 450 : 860; cell(c, x - 160, y - 300, 320, 360, i < 4 ? C.mintL : C.skyL); drawChar(c, BY.hop, { x, y, k: 72, yaw, exprPose: false, expr: ex(BY.hop, e, e === 'laugh' ? { closed: 'happy' } : {}), pose: { bow: Math.PI / 2, ...p }, detail: n.startsWith('pegs') ? 1 : 0 }); label(c, n, x, y + 35, 20); });
  // cận cảnh hàng gai (vẽ riêng trong props.js) + vĩ cầm
  cell(c, 15, 950, 640, 400, '#123A3F');
  c.save(); c.beginPath(); c.roundRect(15, 950, 640, 400, 28); c.clip(); c.translate(335, 1150); macro(c, 300, { t: 10.07, u: 2, lift: 0, ticks: [{ t: 10.05, i: 2 }], glint: null, fast: 0, notes: [{ t: 9.6, i: 1 }] }); c.restore();
  label(c, 'macro: each peg ticks over the wing edge', 335, 1325, 20, C.cream);
  cell(c, 680, 950, 300, 400, D.shellIn); violin(c, 830, 1170, .62, .4, .1); label(c, '"It\'s like a violin bow!"', 830, 1325, 19);
  [0, 1, 2, 3].forEach(i => noteGlyph(c, 1010 + i * 70, 1000 + (i % 2) * 40, .8, NOTE_COL[i], 0, i));
  cell(c, 1340, 130, 560, 1220, C.mintL);
  drawChar(c, BY.loupe, { x: 1500, y: 760, h: 380, expr: 'happy', showFx: false }); label(c, 'Miss Loupe', 1500, 800, 22);
  drawChar(c, BY.loupe, { x: 1760, y: 760, h: 380, expr: 'strain', showFx: false, pose: { footL: [-.98, -.6, .12], handL: [-.55, -1.95, .1], elbowL: [-.75, -1.45, 0], handR: [1.0, -1.3, .1], elbowR: [.7, -1.15, 0] }, lean: .07 }); label(c, 'gag: "Let me try!"', 1760, 800, 22);
  drawChar(c, BY.loupe, { x: 1500, y: 1250, h: 380, expr: 'shy', showFx: true }); label(c, '"Oops! No pegs!"', 1500, 1290, 22);
  drawChar(c, BY.loupe, { x: 1760, y: 1250, h: 380, expr: 'surprised', showFx: true, pose: { handL: [-.82, -1.3, .1], handR: [.82, -1.3, .1] } }); label(c, 'startle', 1760, 1290, 22);
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-015 · Grasshoppers Play Their Legs Like a Violin! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
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
