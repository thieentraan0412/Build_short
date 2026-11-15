// Trang kiểm tra: bảng nhân vật của tập (bản Zip có cánh so le, Miss Loupe và Albie v2) và storyboard, vẽ bằng đúng code của phim.
import { LOOK } from '/_shared/characters/look.js';
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';
import { D, ZIP12, strokeArrow } from './props.js';
import { ex } from '/_shared/episode.js';
LOOK.v = 2;
LOOK.cheer = true;   // (11/2026) mặt nhân vật luôn vui tươi (QUALITY.md §5, stage.js cheerExpr)

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);

export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-012 · This Bug Can Fly Backwards! · cast in style v2 "Kẹo Phẳng Viền" (LOOK.v = 2)', 40, 50, 34, C.ink, 'left');
  label(c, 'ZIP (episode copy ZIP12 in props.js): pose.cs = counter-stroke (front wings up while back wings down) · pose.tint = lemon front pair, pink back pair (slow-mo only)', 40, 104, 22, '#3D4470', 'left');
  const F = [['flying forward (wings in phase)', -1.25, 'excited', { fly: 1, flap: 1.2, beat: 1, lift: .3 }], ['hover: wings blur', -1.25, 'happy', { blur: 1, lift: .3 }],
    ['turned to camera', -.42, 'happy', { blur: 1, lift: .3 }], ['slow-mo: front UP, back DOWN', -.42, 'excited', { beat: 1, flap: Math.PI / 2, cs: 1, amp: .62, tint: 1, lift: .3 }],
    ['slow-mo: front DOWN, back UP', -.42, 'excited', { beat: 1, flap: -Math.PI / 2, cs: 1, amp: .62, tint: 1, lift: .3 }], ['shared rig: same pose, in phase', -.42, 'curious', { beat: 1, flap: Math.PI / 2, cs: 0, amp: .62, tint: 1, lift: .3 }]];
  F.forEach(([n, yaw, e, p], i) => {
    const x = 210 + (i % 3) * 420, y = i < 3 ? 470 : 900; cell(c, x - 195, y - 300, 390, 380, i < 3 ? C.mintL : '#C9E8F0');
    drawChar(c, ZIP12, { x, y, k: 90, yaw, showFx: false, expr: ex(BY.zip, e), pose: p }); label(c, n, x, y + 50, 19);
  });
  strokeArrow(c, 1270, 650, true, 40, D.front); strokeArrow(c, 1370, 700, false, 40, D.back); label(c, 'arrows on wing tips', 1320, 790, 20);
  cell(c, 1460, 130, 440, 1180, C.mintL);
  drawChar(c, BY.loupe, { x: 1680, y: 760, h: 360, expr: 'surprised', showFx: false }); label(c, 'Miss Loupe (v2)', 1680, 800, 22);
  drawChar(c, BY.albie, { x: 1680, y: 1200, h: 300, yaw: -.3, expr: 'explaining', showFx: false, pose: { page: [.85, -1.45, -.5] } }); label(c, 'Albie (v2): "Watch the corners!"', 1680, 1240, 20);
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-012 · This Bug Can Fly Backwards! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
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
