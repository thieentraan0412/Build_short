// Trang kiểm tra: bảng nhân vật của tập và storyboard, vẽ bằng đúng code của phim (rig dùng chung _shared/characters).
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';
import { chamber, thermometer, fan, drop, bubble, burst, frost, N } from './props.js';
import { ex } from '/_shared/episode.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);

export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-008 · A Light That Doesn\'t Get Hot?! · cast, props and key poses (shared rig, _shared/characters)', 40, 50, 36, C.ink, 'left');
  label(c, 'BLINK · sits on the twig "campfire"; tail lamp faces Miss Loupe · shy = covers face', 40, 108, 26, C.grape, 'left');
  const B = [['happy, glow 1', 'happy', { glow: 1 }, 1.3], ['"Watch this!" flare', 'excited', { glow: 2.9, fly: .6, lift: .14 }, .45], ['shy (covers face)', 'shy', { glow: 1.8, legsUp: [[-.25, -1.05, .95], 0, 0, [.25, -1.05, .95], 0, 0] }, .35], ['"I\'m not glowing!"', 'confident', { glow: 3.6, fly: .5, lift: .2 }, .35]];
  B.forEach(([n, e, p, yaw], i) => { const x = 170 + i * 300; cell(c, x - 140, 130, 280, 340, N.sky0); drawChar(c, BY.blink, { x, y: 400, k: 105, yaw, showFx: true, expr: ex(BY.blink, e, { fx: true }), pose: p }); label(c, n, x, 445, 20, C.cream); });
  label(c, 'INSIDE THE TAIL LAMP · yellow drops (luciferin) + blue bubbles (oxygen) meet a pink fan (luciferase) → POP of light', 40, 510, 24, C.honeyD, 'left');
  cell(c, 40, 535, 760, 520, N.sky0);
  c.save(); c.beginPath(); c.roundRect(40, 535, 760, 520, 28); c.clip(); chamber(c, 420, 795, 210, { t: 6.36, pops: [6.35], bloom: 99, lit: .5 }); c.restore();
  cell(c, 830, 535, 300, 520, C.mintL);
  for (const [x, f] of [[900, 'cold'], [1060, 'ok']]) thermometer(c, x, 960, 130, f === 'cold' ? .12 : .18, 0, f);
  label(c, 'thermometer: barely moves', 980, 1030, 20);
  label(c, 'MISS LOUPE · scarf, warming hands · frost grows on the hands', 40, 1100, 26, C.berryD, 'left');
  cell(c, 40, 1125, 1100, 260, N.sky1);
  frost(c, 200, 1250, 60, 1, 1); frost(c, 330, 1250, 60, .5, 2);
  fan(c, 520, 1250, 60, .4, 0); drop(c, 640, 1250, 30); bubble(c, 720, 1250, 26); burst(c, 860, 1250, 60, .8);
  cell(c, 1460, 130, 440, 1250, C.mintL);
  drawChar(c, BY.loupe, { x: 1680, y: 1000, h: 380, yaw: .35, expr: ex(BY.loupe, 'worried'), pose: { scarf: true, handL: [1.05, -1.12, .55], handR: [1.32, -1.24, .28], elbowL: [.62, -.98, .42], elbowR: [.82, -1.12, .2] }, showFx: false }); label(c, 'Miss Loupe (warming hands)', 1680, 1060, 22);
  drawChar(c, BY.albie, { x: 1680, y: 1300, h: 170, expr: 'happy', showFx: false }); label(c, 'Albie', 1680, 1335, 22);
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-008 · A Light That Doesn\'t Get Hot?! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
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
