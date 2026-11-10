// Trang kiểm tra: bảng nhân vật của tập (Zip ra mắt) và storyboard, vẽ bằng đúng code của phim (rig dùng chung _shared/characters).
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';
import { pondSky, pondBank, facets, viewRing, rewind, N } from './props.js';
import { ex } from '/_shared/episode.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);

export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-010 · Dragonflies See Behind Their Heads! · ZIP joins the cast (guest, _shared/characters/cast/zip.js)', 40, 50, 34, C.ink, 'left');
  label(c, 'ZIP, the dragonfly · non-speaking ("zip!") · two huge compound-eye domes meeting on top · FOUR clear wings held flat · long slender tail · six legs', 40, 104, 22, '#1EA3DB', 'left');
  const F = [['front', 0, 'happy', {}], ['3/4', .6, 'curious', {}], ['side', 1.5, 'happy', {}], ['back 3/4', 2.5, 'happy', {}],
    ['peek: sees behind', 0, 'happy', { peek: -1.1 }], ['hover (wings blur)', .5, 'excited', { blur: 1, lift: .3 }], ['flies backwards', -1.3, 'confident', { beat: 1, flap: 1, curl: .3, lift: .3 }], ['sad', .5, 'sad', {}]];
  F.forEach(([n, yaw, e, p], i) => { const x = 160 + (i % 4) * 320, y = i < 4 ? 420 : 820; cell(c, x - 150, y - 270, 300, 330, i < 4 ? N.sky0 : C.mintL); drawChar(c, BY.zip, { x, y, k: 72, yaw, showFx: false, expr: ex(BY.zip, e, p.peek ? { look: [-.9, 0] } : {}), pose: p }); label(c, n, x, y + 38, 19); });
  cell(c, 20, 900, 640, 640, N.water);
  facets(c, 340, 1220, 300, 1, { a: 1 });
  label(c, 'compound-eye close-up: facets (thousands; ~600 drawn)', 340, 1560, 20, C.ink);
  c.save(); c.beginPath(); c.rect(690, 900, 740, 640); c.clip(); c.translate(690, 900); c.scale(.6, .6); c.translate(-100, -700); pondSky(c, 1, { waggle: .5, rollo: .5 }); pondBank(c, 1); c.restore();
  viewRing(c, 1060, 1350, 150, 1, 1); rewind(c, 1300, 1000, 1, 1, 1);
  cell(c, 1460, 130, 440, 1180, C.mintL);
  drawChar(c, BY.loupe, { x: 1680, y: 820, h: 380, expr: 'happy', showFx: false }); label(c, 'Miss Loupe', 1680, 870, 22);
  drawChar(c, BY.zip, { x: 1560, y: 1150, k: 60, yaw: .5, showFx: false, expr: 'happy' }); label(c, 'Zip', 1560, 1190, 22);
  drawChar(c, BY.crumb, { x: 1790, y: 1150, k: 60, yaw: -.5, showFx: false, expr: 'happy' }); label(c, 'Crumb', 1790, 1190, 22);
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-010 · Dragonflies See Behind Their Heads! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
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
