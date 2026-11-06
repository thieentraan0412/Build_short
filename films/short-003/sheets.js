// Trang kiểm tra: bảng nhân vật của tập và storyboard, vẽ bằng đúng code của phim (rig dùng chung _shared/characters).
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);
const L3 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const UP = [-.48, -1.02, 2.2], DOWN = [-.4, 0, 1.18];   // cùng tư thế với film.js

export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-003 · cast and key poses (shared rig, _shared/characters)', 40, 50, 38, C.ink, 'left');
  const F = [['listening (leg up)', { frontL: UP }, 'curious'], ['chirping back', { frontL: DOWN, chirp: 1 }, 'excited'], ['ear in the lens', { frontL: UP, earGlow: 1 }, 'curious'],
    ['covers its knees', { frontL: [.12, -.66, 1.3], frontR: [-.1, -.62, 1.34] }, 'worried'], ['giggle', { frontL: L3(DOWN, UP, .5), chirp: .7 }, 'laugh']];
  label(c, 'CHIRP', 40, 108, 26, C.leafD, 'left');
  F.forEach(([n, pose, e], i) => { const x = 160 + i * 300; cell(c, x - 140, 130, 280, 400, C.mintL); drawChar(c, BY.chirp, { x: x - 20, y: 440, h: 110, yaw: 1.15, expr: e === 'worried' ? { eye: { closed: 1 }, mouth: 'wavy' } : e, pose, detail: i === 2 ? 1 : 0, showFx: false }); label(c, n, x, 552, 22); });
  label(c, 'MISS LOUPE · the "hello" beat', 40, 600, 26, C.berry, 'left');
  [['surprised', 'in the lens', {}], ['curious', 'hello, little ears!', {}], ['laugh', 'laugh', {}]].forEach(([e, n, pose], i) => {
    const x = 160 + i * 300; cell(c, x - 140, 625, 280, 400, C.mintL); drawChar(c, BY.loupe, { x, y: 980, h: 320, lean: i === 1 ? -.4 : 0, expr: e, pose, showFx: false }); label(c, n, x, 1050, 22);
  });
  label(c, 'ALBIE · gag', 1000, 600, 26, C.grape, 'left');
  [['happy', '"In you go!"'], ['curious', '"Ears on its head?"'], ['surprised', '"NOPE!"']].forEach(([e, n], i) => {
    const x = 1080 + i * 200; cell(c, x - 90, 625, 180, 400, C.skyL); drawChar(c, BY.albie, { x: x - 30, y: 980, h: 150, yaw: .32, expr: e, pose: { tabsUp: i === 2 ? 1 : 0 }, showFx: false }); label(c, n, x, 1050, 20);
  });
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-003 · Crickets Have Ears on Their Legs?! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
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
