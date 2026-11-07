// Bảng hình của LONG-001: ?mode=model — ba khách mời mới (Hop, Zip, sâu gấu len) cạnh Chirp; ?mode=board — 12 khung storyboard.
import { C, popText, subFont, rrect } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { hop, zip, woollyBear } from './props.js';
import { drawFilm } from './film.js';

export function modelSheet(c, W, H) {
  c.setTransform(W / 1920, 0, 0, W / 1920, 0, 0);
  c.fillStyle = C.cream; c.fillRect(0, 0, 1920, 1080);
  popText(c, 'LONG-001 · guest cast', 960, 110, 70, C.grape, null, -1, 0, { read: false });
  rrect(c, 60, 180, 1800, 820, 40, '#F1E6CC');
  drawChar(c, BY.chirp, { x: 330, y: 760, k: 150, yaw: 1.15, showFx: false });
  hop(c, 780, 760, 170, { dir: -1 }); hop(c, 1160, 760, 170, { dir: -1, ear: 1, fiddle: .8 });
  zip(c, 1560, 520, 150, { dir: -1, eyeGlow: 1 }); woollyBear(c, 1560, 860, 70, { curl: .9, freeze: 1 });
  [['Chirp · cricket (ears on front legs)', 330], ['Hop · grasshopper (short antennae)', 780], ['Hop · ear on tummy, fiddle', 1160], ['Zip · woolly bear', 1560]].forEach(([s, x]) => popText(c, s, x, 960, 30, C.ink, null, -1, 0, { font: subFont, read: false }));
}
const BOARD = [1.2, 6.5, 14.6, 25, 30.3, 43.5, 53.5, 60.5, 77, 85.2, 98, 121.5, 128.6, 150.6, 153.5, 160.2, 169.5, 181.5, 191.5, 200.2, 207, 213, 223.5, 233, 244, 268.5, 272.8, 279];
export function storyboard(c, W, H) {
  c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = C.ink; c.fillRect(0, 0, W, H);
  const cols = 7, rows = Math.ceil(BOARD.length / cols), cw = W / cols, ch = cw * 9 / 16;
  BOARD.forEach((t, i) => { const x = (i % cols) * cw, y = Math.floor(i / cols) * (ch + 30); c.save(); c.translate(x + 4, y + 4); c.scale((cw - 8) / 1920, (cw - 8) / 1920); c.beginPath(); c.rect(0, 0, 1920, 1080); c.clip(); drawFilm(c, t); c.restore(); c.fillStyle = C.cream; c.font = '20px sans-serif'; c.fillText(t.toFixed(1) + ' s', x + 8, y + ch + 22); });
}
