// Trang kiểm tra: bảng nhân vật của tập và storyboard, vẽ bằng đúng code của phim (rig dùng chung _shared/characters).
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);

// bảng nhân vật SHORT-001: những ai xuất hiện, các biểu cảm và tư thế dùng trong tập
export function modelSheet(c, W, H) {
  ground(c, C.cream);
  label(c, 'SHORT-001 · cast used in this episode (shared rig, _shared/characters)', 40, 50, 38, C.ink, 'left');
  // Miss Loupe: các biểu cảm của tập
  label(c, 'MISS LOUPE', 40, 108, 26, C.berry, 'left');
  [['happy', 'happy'], ['surprised', 'wow'], ['curious', 'guess'], ['thinking', 'hmm'], ['crosseyed', 'cross-eyed'], ['laugh', 'laugh'], ['explaining', 'explain']].forEach(([e, n], i) => {
    const x = 120 + i * 175; cell(c, x - 80, 130, 160, 400, C.mintL);
    drawChar(c, BY.loupe, { x, y: 505, h: 290, expr: e, showFx: false }); label(c, n, x, 552, 22);
  });
  // Albie: ngủ → tỉnh → nói → tự tin
  label(c, 'ALBIE (debut)', 1290, 108, 26, C.grape, 'left');
  [['sleepy', 'asleep', { eye: { closed: 'line' }, mouth: 'flat' }], ['surprised', 'wakes up'], ['talk', '"In you go!"'], ['happy', 'holds still']].forEach(([e, n, E], i) => {
    const x = 1360 + i * 150; cell(c, x - 70, 130, 140, 400, C.skyL);
    drawChar(c, BY.albie, { x: x - 8, y: 470, h: 170, yaw: .32, expr: E || e, showFx: false, pose: e === 'talk' ? { page: [.72, -1.62, -.35] } : {} }); label(c, n, x, 552, 22);
  });
  // côn trùng của tập
  label(c, 'FLUTTER · CHIRP · WAGGLE · MR. ROLLO · THE GIANT', 40, 600, 26, C.berry, 'left');
  cell(c, 40, 625, 420, 400, C.mint); drawChar(c, BY.flutter, { x: 250, y: 950, h: 260, yaw: 1.25, detail: 1 }); label(c, 'taste spots on feet (detail)', 250, 1000, 20);
  cell(c, 480, 625, 470, 400, C.night); drawChar(c, BY.chirp, { x: 700, y: 930, h: 190, yaw: 1.15, detail: 1, pose: { earGlow: 1, frontL: [-.5, -1.3, 1.4] } }); label(c, 'ears on front legs (detail)', 715, 1000, 20, C.cream);
  cell(c, 970, 625, 300, 400, C.honey); drawChar(c, BY.waggle, { x: 1120, y: 940, h: 230, yaw: .8 }); label(c, '5 eyes · 6 legs', 1120, 1000, 20);
  cell(c, 1290, 625, 300, 400, C.leaf);
  c.save(); c.translate(0, 0); drawChar(c, BY.rollo, { x: 1490, y: 900, h: 95, yaw: 1.4, pose: { showBall: true } }); c.restore(); label(c, 'hidden on the map', 1440, 1000, 20, C.cream);
  cell(c, 1610, 625, 270, 400, C.mango); drawChar(c, BY.giant, { x: 1700, y: 965, k: 34, yaw: Math.PI / 2, pose: { part: 'foot' } }); label(c, 'foot only', 1745, 1000, 20);
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-001 · Bugs Hide Secret Senses in Their Legs! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
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
