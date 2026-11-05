// Trang kiểm tra: bảng nhân vật của tập và storyboard, vẽ bằng đúng code của phim (rig dùng chung _shared/characters).
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);

export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-002 · cast and key poses (shared rig, _shared/characters)', 40, 50, 38, C.ink, 'left');
  const F = [['straw curled', { tongue: 0 }, 'happy'], ['straw pops out', { tongue: 1 }, 'surprised'], ['front foot lifted', { legsUp: [[-.3, -.34, .56], 0, 0, 0, 0, 0] }, 'happy'], ['sipping', { tongue: 1, beta: .5 }, 'laugh']];
  label(c, 'FLUTTER', 40, 108, 26, C.berry, 'left');
  F.forEach(([n, pose, e], i) => { const x = 160 + i * 300; cell(c, x - 140, 130, 280, 400, C.mintL); drawChar(c, BY.flutter, { x, y: 470, h: 300, yaw: 1.25, expr: e, pose, detail: 1, showFx: false }); label(c, n, x, 552, 22); });
  label(c, 'ALBIE · gag', 1240, 108, 26, C.grape, 'left');
  [['happy', '"In you go!"', { page: [.82, -1.35, -.15] }], ['surprised', 'a butterfly?!', { page: [.82, -1.35, -.15] }], ['shout', '"NOT my pages!"', { page: [.82, -1.35, -.15], tabsUp: 1 }]].forEach(([e, n, pose], i) => {
    const x = 1320 + i * 200; cell(c, x - 90, 130, 180, 400, C.skyL); drawChar(c, BY.albie, { x: x - 34, y: 470, h: 150, yaw: .32, expr: e, pose, showFx: false }); label(c, n, x, 552, 22);
  });
  label(c, 'MISS LOUPE · the "wow" beat', 40, 600, 26, C.berry, 'left');
  [['surprised', 'wow!', {}], ['curious', 'looks at her shoes', { footR: [.19, -.49, .14] }], ['confused', 'shrug', { handL: [-.88, -1.32, .1], handR: [.88, -1.32, .1] }], ['laugh', 'laugh', {}]].forEach(([e, n, pose], i) => {
    const x = 160 + i * 300; cell(c, x - 140, 625, 280, 400, C.mintL);
    drawChar(c, BY.loupe, { x, y: 980, h: 320, expr: e === 'curious' ? { ...{ eye: { look: [.05, .95] } }, mouth: 'tiny' } : e, pose, showFx: false }); label(c, n, x, 1050 - 50 + 50, 22);
  });
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-002 · This Butterfly Tastes With Its Feet! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
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
