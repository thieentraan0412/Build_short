// Trang kiểm tra: bảng nhân vật và đạo cụ của tập (vẽ bằng đúng code của phim, rig dùng chung _shared/characters, phong cách v2) và storyboard.
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm, drawCrumb, drawZip, ARMS } from './film.js';
import { BOARD } from './timeline.js';
import { booSign, cushion, dryLeaf, D } from './props.js';
import { ex } from '/_shared/episode.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);

export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-011 · Sneaking Up on a Dragonfly... Oops! · cast & props (look v2 "Kẹo Phẳng Viền")', 40, 50, 34, C.ink, 'left');
  label(c, 'CRUMB with the BOO! sign (the back says "hi!") · ZIP from every side (from behind, its huge eyes still wrap the head) · props', 40, 100, 22, '#3D4470', 'left');
  const CR = [['tiptoe, sign up', { tip: 1, ph: .1, arms: ARMS.sign, sign: { mode: 'up', stick: .42 }, E: 'confident' }], ['crunch! freeze on one leg', { one: 1, arms: ARMS.sign, sign: { mode: 'up', rot: .15, stick: .42 }, E: 'worried' }],
    ['hides behind the sign', { arms: ARMS.hide, sign: { mode: 'hide' }, yaw: .35, E: 'worried' }], ['seen from behind (back of sign)', { yaw: 2.78, arms: ARMS.sign, sign: { mode: 'up', face: -1, stick: .42 }, E: 'happy' }]];
  CR.forEach(([n, o], i) => { const x = 175 + i * 300, y = 650; cell(c, x - 145, 140, 290, 580, i % 2 ? '#FFE2B6' : D.sky1); drawCrumb(c, { x, y, k: 90, yaw: .9, ...o, E: ex(BY.crumb, o.E) }); label(c, n, x, 695, 19); });
  const Z = [['3/4 (perched)', 1.3, 'happy', {}, 55], ['front', 0, 'excited', { beat: .3 }, 0], ['from behind', 2.86, 'happy', {}, 30], ['turned to Crumb', -1.3, 'excited', { lift: .15, beat: .9 }, -55]];
  Z.forEach(([n, yaw, e, p, dx], i) => { const x = 175 + i * 300, y = 1060; cell(c, x - 145, 760, 290, 360, i % 2 ? C.mintL : '#FFE2B6'); drawZip(c, { x: x + dx, y, k: 72, yaw, E: ex(BY.zip, e), ...p }, .3); label(c, n, x, 1095, 19); });
  cell(c, 1240, 140, 650, 580, '#FFF1D6');
  booSign(c, 1400, 600, 95, 0, 1); booSign(c, 1730, 600, 95, 0, -1);
  label(c, 'BOO! sign · front', 1400, 680, 20); label(c, 'back: "hi!" (seen in the gag)', 1730, 680, 20);
  cell(c, 1240, 760, 650, 360, D.grassL);
  cushion(c, 1400, 1000, .95, 0); dryLeaf(c, 0, 0, 1725, 930); dryLeaf(c, 0, 1, 1725, 1020);
  label(c, 'clover cushion (Crumb lands here)', 1400, 1080, 19); label(c, 'crunchy leaf: whole / broken', 1725, 1080, 19);
  cell(c, 30, 1160, 1860, 420, '#F3E9FF');
  drawChar(c, BY.loupe, { x: 300, y: 1520, h: 320, expr: 'happy', showFx: false }); label(c, 'Miss Loupe (explains; in both split panels)', 300, 1555, 19);
  drawChar(c, BY.albie, { x: 800, y: 1500, h: 250, expr: 'happy', showFx: false }); label(c, 'Albie (album: "Six legs? In you go!")', 800, 1555, 19);
  drawChar(c, BY.rollo, { x: 1250, y: 1500, k: 90, yaw: 1.0, showFx: false, expr: ex(BY.rollo, 'happy') }); label(c, 'Mr. Rollo (easter egg: only in ZIP SEES)', 1250, 1555, 19);
  label(c, 'Split frame: CRUMB SEES (honey rim)', 1640, 1300, 21, C.grape); label(c, '| ZIP SEES (lime rim: eyelids open,', 1640, 1340, 21, C.grape); label(c, 'the view widens almost all around)', 1640, 1380, 21, C.grape);
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-011 · Sneaking Up on a Dragonfly... Oops! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
  const fw = 340, fh = 604, cap = 136, gap = 26, top = 84;
  BOARD.forEach((b, i) => {
    const col = i < 5 ? i : i - 5, row = i < 5 ? 0 : 1, x = gap + col * (fw + gap), y = top + row * (fh + cap + gap);
    const oc = off.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, 1080, 1920); drawFilm(oc, b.t);
    c.drawImage(off, x, y, fw, fh);
    rrect(c, x, y + fh, fw, cap, 0, '#2A2650');
    label(c, `Shot ${b.shot} · ${b.frame}`, x + 14, y + fh + 28, 19, C.lemon, 'left');
    c.font = subFont(23); const ls = wrap(c, b.line, fw - 28).slice(0, 3); ls.forEach((l, k) => label(c, l, x + 14, y + fh + 64 + k * 30, 23, C.cream, 'left'));
  });
}
