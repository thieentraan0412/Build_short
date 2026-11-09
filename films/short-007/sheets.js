// Trang kiểm tra: bảng nhân vật của tập và storyboard, vẽ bằng đúng code của phim (rig dùng chung _shared/characters).
import { C, rrect, subFont, wrap, ground } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';
import { ex, rigPt } from '/_shared/episode.js';
import { bigGlow, tinyFly, marshmallow, thought, cartoonFly, DOT_OPEN } from './props.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);

export function modelSheet(c) {
  ground(c, C.cream);
  label(c, 'SHORT-007 · Fireflies Talk in Secret Light Codes! · cast and key poses (shared rig, _shared/characters)', 40, 50, 36, C.ink, 'left');
  label(c, 'BLINK (speaks for the first time) · the tail lamp is the glow; wing cases open with pose.fly', 40, 108, 26, C.night, 'left');
  const B = [['happy, glow 1', 'happy', { glow: 1 }, 1.0], ['"My tummy can!" flare', 'excited', { glow: 2.2 }, .3], ['wing cases open', 'excited', { glow: .9, fly: 1 }, .3],
    ['"No!" (turns away)', 'annoyed', { glow: 1, legsUp: [[.2, -.95, .85], 0, 0, [-.2, -1.0, .85], 0, 0] }, 1.55], ['"Okay, yes." (shy)', 'shy', { glow: 1.6 }, .5], ['flashing the code', 'confident', { glow: 2, fly: 1, lift: .5 }, .4]];
  B.forEach(([n, e, p, yaw], i) => {
    const x = 135 + i * 232; cell(c, x - 112, 130, 224, 360, C.night);
    const tail = rigPt(x, 410, 100, yaw, 0, [0, -.62 - (p.lift || 0), -.78]); if (p.glow > 1.4) bigGlow(c, tail[0], tail[1], 170, 1);
    drawChar(c, BY.blink, { x, y: 410, k: 88, yaw, showFx: e === 'shy', expr: ex(BY.blink, e), pose: p }); label(c, n, x, 470, 17, C.cream);
  });
  label(c, 'DOT (no lines) · wing cases closed / open (episode copy of the rig: pose.open)', 40, 540, 26, C.berryD, 'left');
  [[0, 'closed'], [1, 'open: wing cases up, thin wings out']].forEach(([op, n], i) => { const x = 200 + i * 420; cell(c, x - 190, 570, 380, 330, C.mintL); drawChar(c, DOT_OPEN, { x, y: 840, k: 140, yaw: -.3, showFx: false, expr: ex(BY.dot, op ? 'excited' : 'happy'), pose: { open: op } }); label(c, n, x, 880, 20); });
  label(c, 'CRUMB (no lines) · marshmallow, "?" antennae', 40, 950, 26, C.honeyD, 'left'); label(c, 'Thought bubble (the wrong guess)', 490, 950, 26, C.berryD, 'left');
  cell(c, 30, 980, 420, 420, C.night);
  drawChar(c, BY.crumb, { x: 180, y: 1330, k: 110, yaw: .9, showFx: false, expr: ex(BY.crumb, 'confused'), pose: { carry: null, reach: .4, armL: [-.4, -1.0, .45], armR: [.78, -1.3, .7] } });
  const h = rigPt(180, 1330, 110, .9, 0, [.78, -1.3, .7]); marshmallow(c, h[0], h[1], h[0] + 150, h[1] - 20, 1.1, 1);
  c.font = '60px "Paytone One"'; c.fillStyle = C.lemon; c.textAlign = 'center'; c.fillText('?', 150, 1050); c.fillText('?', 214, 1050);
  cell(c, 480, 980, 420, 420, C.night); thought(c, 560, 1320, 690, 1150, 260, 170, 1, cc => { cartoonFly(cc, -20, 6, 1.2, 0); cc.font = '64px "Paytone One"'; cc.fillStyle = C.berry; cc.textAlign = 'center'; cc.fillText('?', 80, 26); });
  label(c, 'Tiny firefly (gag) · off / on', 950, 950, 26, C.night, 'left');
  cell(c, 940, 980, 400, 420, C.night); tinyFly(c, 1050, 1200, 50, .1, { dir: -1 }); tinyFly(c, 1240, 1200, 50, 1, { dir: -1 });
  cell(c, 1460, 130, 440, 1270, C.mintL);
  drawChar(c, BY.loupe, { x: 1680, y: 840, h: 380, expr: 'wink', showFx: false }); label(c, 'Miss Loupe (wink)', 1680, 880, 22);
  drawChar(c, BY.chirp, { x: 1680, y: 1100, k: 80, yaw: -.75, showFx: false, expr: 'excited', pose: { chirp: 1 } }); label(c, 'Chirp (no lines)', 1680, 1130, 22);
  drawChar(c, BY.albie, { x: 1680, y: 1360, h: 180, expr: ex(BY.albie, 'surprised', { mouth: 'shout' }), showFx: false }); label(c, 'Albie (gulp)', 1680, 1385, 22);
}

export function storyboard(c, W, H, off) {
  ground(c, C.ink);
  label(c, 'SHORT-007 · Fireflies Talk in Secret Light Codes! — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
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
