// Bảng hình của LONG-003, vẽ bằng đúng code của phim (rig dùng chung, LOOK.v = 2 và LOOK.cheer bật trong film.js):
// ?mode=model — bối cảnh, đạo cụ và dáng mới của tập (trời Dải Ngân Hà và mây, Miss Loupe trên viên tròn, kiến sa mạc, Uncle Telly trên cọc,
//               bàn tay The Giant, khung ngửi, ống nhòm, vệt lăn thẳng/ngoằn ngoèo, bản đồ vườn, 5 ô "cách tìm đường");
// ?mode=board — 12 khung storyboard (BOARD trong timeline.js), mỗi khung ghi số cảnh, khung hình, độ dài và lời.
import { C, popText, subFont, rrect, wrap, circle, ell, capsule, inked, TAU, lerp, cam, star, ARM, rolloAt, loupeOnBall, loupeN, lpY, crumbAt, crumbE, tellyAt, giantHand, blinkN, UP_ARMS } from './lib16.js';
import { drawFilm, WAYS } from './film.js';
import { BOARD } from './timeline.js';
import { N, starSky, workerAnt, desertAnt, fencePost, sniffFrame, scentTrail, binoMask, trackLine, topGrass, cloudShadow, mapPage, ballProp } from './props.js';
import { quizIcon } from './scenes.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);
const clipCell = (c, x, y, w, h, fn) => { c.save(); c.beginPath(); c.roundRect(x, y, w, h, 28); c.clip(); fn(); c.restore(); };
const caption = (c, s, x, y, w, px = 20, col = C.ink) => { c.font = subFont(px); wrap(c, s, w).forEach((l, k) => label(c, l, x, y + k * (px + 6), px, col)); };

export function modelSheet(c, W, H) {
  c.setTransform(W / 1920, 0, 0, W / 1920, 0, 0);
  const t = 3.2;
  c.fillStyle = C.cream; c.fillRect(0, 0, 1920, 1080);
  label(c, 'LONG-003 · Lost at Night! — new sets, looks & props (look v2, always cheerful)', 40, 46, 34, C.ink, 'left');
  // 1 · trời đêm không trăng: Dải Ngân Hà, mây che sao
  clipCell(c, 40, 90, 520, 420, () => { c.save(); c.translate(40, 90); c.scale(.27, .27); starSky(c, t, { x0: 0, x1: 1920, y0: 0, y1: 1560 }); c.restore();
    c.save(); c.beginPath(); c.rect(300, 90, 260, 420); c.clip(); c.translate(40, 90); c.scale(.27, .27); starSky(c, t, { x0: 0, x1: 1920, y0: 0, y1: 1560, cloud: 1, cx: 300 }); c.restore();
    capsule(c, 300, 100, 300, 500, 4, C.cream); label(c, 'clear', 170, 120, 22, C.cream); label(c, 'cloudy', 430, 120, 22, C.cream); });
  label(c, 'no moon · Milky Way · clouds hide the stars', 300, 485, 20, C.cream);
  // 2 · Miss Loupe chạy trên viên tròn của Rollo (móc)
  clipCell(c, 580, 90, 400, 420, () => { rrect(c, 580, 90, 400, 420, 0, C.mintL);
    const b = rolloAt(c, 740, 420, 82, t, 0, { yaw: -1.4, look: [.6, -.3] }); loupeOnBall(c, b.c[0], b.c[1], b.R, 34, t, { run: 1, name: 'excited' });
    caption(c, 'hook: Loupe runs on Rollo’s ball (Rollo pushes it backwards)', 780, 462, 360); });
  // 3 · đàn kiến của Crumb và kiến sa mạc (khách mời trong bóng nghĩ)
  clipCell(c, 1000, 90, 420, 420, () => { rrect(c, 1000, 90, 420, 420, 0, N.sandL);
    crumbAt(c, 1090, 300, 46, { E: crumbE('happy', t), yaw: .7 }); label(c, 'Crumb', 1090, 330, 18);
    workerAnt(c, 1290, 250, 64, 0, {}); label(c, 'garden ant (family)', 1300, 282, 18);
    desertAnt(c, 1240, 455, 90, .2, {}); caption(c, 'desert ant (guest) · long legs, sand colour', 1210, 482, 380, 18); });
  // 4 · Uncle Telly trên cọc hàng rào, tròng kính lóe
  clipCell(c, 1440, 90, 440, 420, () => { rrect(c, 1440, 90, 440, 420, 0, C.skyL);
    fencePost(c, 1760, 560, 170); tellyAt(c, 1760, 560 - 170 - 30, 44, t, { glint: 1, pitch: .25 });
    caption(c, 'Uncle Telly on the far fence post · lens flash', 1560, 140, 220, 20); });
  // 5 · bàn tay The Giant (lòng bàn tay ngửa) đỡ Miss Loupe
  clipCell(c, 40, 540, 420, 500, () => { rrect(c, 40, 540, 420, 500, 0, C.pink);
    giantHand(c, 470, 880, 78, { lean: -Math.PI / 2 + .12, gesture: 'soft' }); loupeN(c, 220, lpY(800, 42), 42, t, { name: 'excited', pose: ARM.up });
    caption(c, 'The Giant: hand only, gentle; carries Loupe (an object, never a bug)', 250, 975, 380); });
  // 6 · khung ngửi (đường mùi)
  clipCell(c, 480, 540, 440, 500, () => { rrect(c, 480, 540, 440, 500, 0, C.mintL);
    sniffFrame(c, 700, 760, 120, t, cc => { cc.fillStyle = N.grassD; cc.fillRect(560, 620, 300, 300); scentTrail(cc, [[800, 680], [700, 760], [600, 830]], t, 1, { r: 10, step: 30 }); }, 1);
    caption(c, 'Crumb’s sniff view (antennae, not a lens): pink smell trail', 700, 975, 400); });
  // 7 · vệt lăn: thẳng dưới sao, ngoằn ngoèo khi mây che
  clipCell(c, 940, 540, 440, 500, () => { c.save(); c.translate(940, 540); c.scale(.24, .46); topGrass(c, t); c.restore();
    const A = [], B = []; for (let x = 0; x <= 380; x += 6) { A.push([970 + x, 680]); B.push([970 + x, 860 + 50 * Math.sin(x * .05) + 22 * Math.sin(x * .13)]); }
    trackLine(c, A, 18); trackLine(c, B, 18); cloudShadow(c, 1180, 860, .35);
    label(c, 'stars: straight', 1160, 620, 22, C.cream); label(c, 'clouds: wiggles', 1160, 780, 22, C.cream); caption(c, 'top shot of Rollo’s track', 1160, 975, 400, 20, C.cream); });
  // 8 · 5 ô "cách tìm đường" (vòng mở) và bản đồ có góc mới
  clipCell(c, 1400, 540, 480, 500, () => { rrect(c, 1400, 540, 480, 500, 0, C.lemon);
    WAYS.forEach((w, i) => quizIcon(c, w, 1470 + i * 85, 610, 36, t));
    caption(c, '5 ways home: sun · smell trail · steps · stars · flash', 1640, 670, 440, 18);
    c.save(); c.translate(1410, 700); c.scale(.24, .24); mapPage(c, t, { glow: () => 1, trip: 1, corner: 1 }); c.restore();
    label(c, 'Albie’s garden map + new corner', 1640, 1010, 20); });
}

// 12 khung storyboard (16:9), lưới 4 × 3; off = canvas 1920×1080 để vẽ từng khung bằng drawFilm
export function storyboard(c, W, H, off) {
  c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = C.ink; c.fillRect(0, 0, W, H);
  label(c, 'LONG-003 · Lost at Night! How Do Bugs Find Their Way Home? — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
  const cols = 4, gap = 24, fw = (W - gap * (cols + 1)) / cols, fh = fw * 9 / 16, cap = 116, top = 84;
  BOARD.forEach((b, i) => {
    const x = gap + (i % cols) * (fw + gap), y = top + Math.floor(i / cols) * (fh + cap + gap);
    const oc = off.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, 1920, 1080); drawFilm(oc, b.t);
    c.drawImage(off, x, y, fw, fh);
    rrect(c, x, y + fh, fw, cap, 0, '#2A2650');
    label(c, `Shot ${b.shot} · ${b.frame} · ${b.dur}`, x + 14, y + fh + 26, 19, C.lemon, 'left');
    label(c, `${fmt(b.t)}`, x + fw - 14, y + fh + 26, 18, '#A9A3D9', 'right');
    c.font = subFont(23); wrap(c, b.line, fw - 28).slice(0, 2).forEach((l, k) => label(c, l, x + 14, y + fh + 62 + k * 30, 23, C.cream, 'left'));
  });
}
const fmt = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
