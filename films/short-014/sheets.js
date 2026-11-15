// Trang kiểm tra: bảng nhân vật của tập (Hop với màng nhĩ vẽ to của tập, Crumb, Miss Loupe, Albie) và storyboard,
// vẽ bằng đúng code của phim (rig dùng chung _shared/characters, phong cách v2).
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { LOOK } from '/_shared/characters/look.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';
import { D, drumExtra, drumFace, cookie } from './props.js';
import { ex } from '/_shared/episode.js';
LOOK.v = 2;

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);

export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-014 · Hearing With Your Tummy?! · HOP (guest, _shared/characters/cast/hop.js) · look v2', 40, 50, 34, C.ink, 'left');
  label(c, 'HOP, the grasshopper · non-speaking (giggle chirp + "boing") · round EARDRUMS on both sides of the first tummy segment, under the folded wings', 40, 102, 22, C.leafD, 'left');
  const F = [['3/4 left · eardrum faces camera', -.9, 'happy', {}, { glow: 0 }], ['eardrum hears: glow + ripples', -.85, 'excited', { ear: 1 }, { glow: 1, ripples: [.3, .7], vib: .6 }],
    ['tickled (laugh)', -.9, 'laugh', { lift: .1 }, {}], ['startled', -.9, 'surprised', { ant: 2.5 }, { glow: .8, ripples: [.5] }],
    ['crouch (wind-up)', -.9, 'surprised', { crouch: .9 }, {}], ['LEAP (lift + wings)', -.9, 'surprised', { lift: .35, wingOpen: .8 }, {}], ['lands back (squash)', -.9, 'happy', { crouch: .6 }, {}], ['side', -1.45, 'happy', {}, {}]];
  F.forEach(([n, yaw, e, p, d], i) => { const x = 175 + (i % 4) * 300, y = i < 4 ? 430 : 840; cell(c, x - 145, y - 280, 290, 340, i < 4 ? C.mintL : C.skyL); const P = { ...p }; drawChar(c, BY.hop, { x: x + (n.startsWith('LEAP') ? -25 : 10), y, k: 95, yaw, lean: n.startsWith('LEAP') ? .4 : 0, showFx: false, expr: ex(BY.hop, e), pose: P, extra: drumExtra(P, d) }); label(c, n, x, y + 38, 18); });
  // màng nhĩ cận cảnh: ba trạng thái
  label(c, 'EARDRUM close-up (props.js drumFace): rest · hears a sound (rings) · tummy rumble (big wobble)', 40, 945, 22, C.grape, 'left');
  [[0, [], 0], [.8, [.25, .6], .5], [1, [.15, .45, .8], 1.6]].forEach(([g, r, v], i) => { const x = 180 + i * 300; cell(c, x - 130, 975, 260, 260, D.stone); c.save(); c.translate(x, 1105); c.scale(95, 95); drumFace(c, g, r, v); c.restore(); });
  cookie(c, 1110, 1150, 1.3, 0); label(c, "Crumb's cookie (gag prop, from frame 0)", 1110, 1215, 18);
  cell(c, 1460, 130, 440, 1180, C.mintL);
  drawChar(c, BY.loupe, { x: 1680, y: 700, h: 360, expr: 'happy', showFx: false }); label(c, 'Miss Loupe', 1680, 740, 22);
  drawChar(c, BY.crumb, { x: 1580, y: 1000, k: 70, yaw: -.5, expr: ex(BY.crumb, 'curious'), pose: { carry: null, armL: [-.42, -1.0, .35], armR: [.5, -1.5, .5] } }); label(c, 'Crumb', 1580, 1035, 20);
  drawChar(c, BY.crumb, { x: 1780, y: 1000, k: 70, yaw: .4, expr: ex(BY.crumb, 'shy', { fx: true }), pose: { carry: null, armL: [-.3, -.8, .3], armR: [.3, -.8, .3] } }); label(c, '"Sorry! My tummy!"', 1780, 1035, 18);
  drawChar(c, BY.albie, { x: 1680, y: 1215, h: 150, expr: 'happy', showFx: false }); label(c, 'Albie', 1680, 1290, 22);
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-014 · Hearing With Your Tummy?! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
  const fw = 340, fh = 604, cap = 136, gap = 26, top = 84;
  BOARD.forEach((b, i) => {
    const col = i < 5 ? i : i - 5, row = i < 5 ? 0 : 1, x = gap + col * (fw + gap), y = top + row * (fh + cap + gap);
    const oc = off.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, 1080, 1920); drawFilm(oc, b.t);
    c.drawImage(off, x, y, fw, fh);
    rrect(c, x, y + fh, fw, cap, 0, '#2A2650');
    label(c, `Shot ${b.shot} · ${b.frame} · ${b.dur}`, x + 14, y + fh + 28, 19, C.lemon, 'left');
    c.font = subFont(23); const ls = wrap(c, b.line, fw - 28).slice(0, 3); ls.forEach((l, k) => label(c, l, x + 14, y + fh + 64 + k * 30, 23, C.cream, 'left'));
  });
}
