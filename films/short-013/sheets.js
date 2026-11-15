// Trang kiểm tra: bảng nhân vật của tập (Hop ra mắt, đứng cạnh Chirp để so) và storyboard, vẽ bằng đúng code của phim (rig dùng chung _shared/characters).
import { LOOK } from '/_shared/characters/look.js';
import { C, rrect, subFont, wrap, ground, circle } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';
import { meadowSky, meadowGround, N, coil, note } from './props.js';
import { ex, rigPt } from '/_shared/episode.js';
LOOK.v = 2;
LOOK.cheer = true;   // (11/2026) mặt nhân vật luôn vui tươi (QUALITY.md §5, stage.js cheerExpr)

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);

// Bảng nhân vật 1920×1080: hàng trên Hop xoay 4 góc; hàng giữa các dáng riêng; khung phải: Hop cạnh Chirp (khác nhau ở đâu); khung dưới: cận tai bụng và đùi sau
export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-013 · Grasshoppers Hide Their Ears in a Funny Place! · HOP joins the cast (guest, _shared/characters/cast/hop.js)', 40, 46, 32, C.ink, 'left');
  label(c, 'HOP, the grasshopper · non-speaking ("boing!", leg-fiddle rasp) · dark leaf-green · SHORT thick antennae · tan folded wings · round EAR DRUMS on both sides of the tummy · striped back legs with a row of pegs', 40, 92, 19, C.leafD, 'left');
  const F = [['front', 0, 'happy', {}], ['3/4', .6, 'curious', {}], ['side', 1.5, 'happy', {}], ['back 3/4', 2.5, 'happy', {}],
    ['ear (tummy ear glows)', 1.05, 'excited', { ear: 1, wingOpen: .8 }], ['fiddle: leg on wing', 1.1, 'confident', { fiddle: 1, bow: 1.3, hindUp: .35, pegs: true }], ['crouch (spring)', .8, 'confident', { crouch: 1 }], ['lift: BOING!', .6, 'excited', { lift: .6, wingOpen: .7 }],
    ['earCover: too loud!', .45, 'strain', { earCover: 1 }], ['silly', .3, 'silly', { hindUp: .6, ant: 2 }]];
  F.forEach(([n, yaw, e, p], i) => {
    const col = i % 5, row = Math.floor(i / 5), x = 150 + col * 262, y = 380 + row * 330;
    cell(c, x - 124, y - 238, 248, 300, row ? C.mintL : N.sky1);
    drawChar(c, BY.hop, { x, y: y - (p.lift ? 20 : 0), k: 62, yaw, showFx: false, detail: 1, expr: ex(BY.hop, e), pose: p });
    label(c, n, x, y + 40, 18);
  });
  // so với Chirp: cùng "họ hình", khác ở màu, râu, cánh, chỗ đặt tai
  cell(c, 1340, 130, 550, 590, '#FFF1C9');
  label(c, 'Hop vs Chirp (look alike, NOT the same)', 1615, 168, 22);
  drawChar(c, BY.chirp, { x: 1480, y: 470, k: 74, yaw: -.35, showFx: false, detail: 1, expr: ex(BY.chirp, 'happy'), pose: { earGlow: 1 } });
  drawChar(c, BY.hop, { x: 1745, y: 470, k: 74, yaw: -.35, showFx: false, detail: 1, expr: ex(BY.hop, 'happy'), pose: { ear: 1 } });
  label(c, 'CHIRP · cricket', 1480, 512, 20); label(c, 'HOP · grasshopper', 1745, 512, 20);
  [['lime green', 'dark leaf green'], ['very long antennae, swept back', 'short, thick antennae'], ['leafy wings, two tail spikes', 'tan roof-like wings'], ['EARS: front legs (knees)', 'EARS: both sides of the tummy'], ['sings: wing on wing', 'sings: back leg on wing']]
    .forEach(([a, b], i) => { label(c, a, 1480, 560 + i * 30, 16, '#6E6555'); label(c, b, 1745, 560 + i * 30, 16, C.leafD); });
  // cận tai bụng và hàng gai ở đùi (cắt trong ô, điểm chính ở giữa ô)
  const zoomCell = (x, y, w, h, col, k, yaw, pose, E, pt, txt) => {
    cell(c, x, y, w, h, col);
    c.save(); c.beginPath(); c.roundRect(x, y, w, h, 28); c.clip();
    const p = rigPt(0, 0, k, yaw, 0, pt); drawChar(c, BY.hop, { x: x + w / 2 - p[0], y: y + h / 2 - 10 - p[1], k, yaw, showFx: false, detail: 1, expr: E, pose });
    c.restore(); rrect(c, x + 14, y + h - 46, w - 28, 34, 17, 'rgba(255,248,231,.9)'); label(c, txt, x + w / 2, y + h - 29, 17);
  };
  zoomCell(30, 780, 640, 280, N.hay0, 300, -1.1, { ear: 1, wingOpen: .8 }, ex(BY.hop, 'happy'), BY.hop.ear(1), 'close-up: round ear drum on the side of the 1st tummy segment');
  zoomCell(700, 780, 620, 280, N.sky1, 230, -1.1, { fiddle: 1, bow: 1.3, hindUp: .35, pegs: true }, ex(BY.hop, 'laugh'), [.42, -1.2, -.7], 'back leg: chevron stripes + a row of pegs, rubbed on the wing edge');
  // nhỏ: cả dàn trên bãi cỏ
  cell(c, 1340, 740, 550, 320, N.hay0);
  c.save(); c.beginPath(); c.roundRect(1340, 740, 550, 320, 28); c.clip(); c.translate(1340, 740); c.scale(.5, .5); c.translate(-250, -720); meadowSky(c, 1); meadowGround(c, 1, { noStump: true }); c.restore();
  drawChar(c, BY.loupe, { x: 1420, y: 1015, h: 230, expr: 'happy', showFx: false });
  drawChar(c, BY.crumb, { x: 1545, y: 1018, k: 44, yaw: .5, showFx: false, expr: 'happy', pose: { carry: null } });
  drawChar(c, BY.chirp, { x: 1675, y: 1010, k: 42, yaw: -.35, showFx: false, expr: 'happy' });
  drawChar(c, BY.hop, { x: 1810, y: 1010, k: 42, yaw: -.35, showFx: false, expr: 'happy' });
  rrect(c, 1360, 1022, 510, 30, 15, 'rgba(255,248,231,.9)'); label(c, 'Miss Loupe · Crumb · Chirp · Hop (same scale as the film)', 1615, 1037, 16);
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-013 · Grasshoppers Hide Their Ears in a Funny Place! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
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
