// Đạo cụ và bối cảnh của SHORT-010: bờ ao buổi sáng (trời kem ấm cho Zip xanh trời nổi lên), mặt ao, lá súng, cỏ nến, hòn đá,
// tổ ong mắt kép có hình phản chiếu (cảnh đặc trưng), vòng nhìn quanh Zip, vệt bay lùi.
import { C, circle, ell, rrect, poly, capsule, path, popText, TAU } from '/_shared/kit.js';
import { hash, lerp, clamp, seg, ss, eo, back } from '/core/lib.js';
import { star } from '/_shared/characters/face.js';
import { drawChar, FACES } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { ex } from '/_shared/episode.js';

export const N = {
  sky0: '#FFF6DC', sky1: '#FFDDB0', sun: '#FFC32B', sunL: '#FFE38A', ray: 'rgba(255,227,77,.22)',
  hill0: '#5BD892', hill1: '#36C27A', far: '#2FA86A', water: '#2AA7CF', waterD: '#1E86AE', waterL: '#7FDDF2',
  bank: '#9BE04A', bankD: '#6FBF2E', bankL: '#C4F27A', mud: '#C98A4B', pad: '#2DB86C', padD: '#1F9454',
  stone: '#B9A8E6', stoneD: '#8E7CC9', stoneL: '#DCD2FA', reed: '#5DBB3C', reedD: '#3F9628', cat: '#9A5A26', catL: '#C47F3E',
};
// bờ ao gần (mặt đất của nhân vật), toạ độ cảnh
export const groundY = x => 1190 + .0001 * (x - 560) ** 2;
export const SUN = { x: 840, y: 360, r: 108 };
export const STONE = { x: 720, w: 150, h: 46 };                     // hòn đá Zip đậu ở bí mật 1, 2 (toạ độ cảnh)
export const stoneTop = () => groundY(STONE.x) - STONE.h * .9;
export const REED = { x: 930, top: 820 };                           // ngọn cỏ nến bên phải: chỗ Zip đậu ở gag

// trời, mặt trời, đồi xa, mặt ao (toạ độ cảnh). o.waggle: Waggle bay ngang trời rất nhỏ (trứng phục sinh) · o.rollo: bóng Rollo trên bờ xa
export function pondSky(c, t, o = {}) {
  const g = c.createLinearGradient(0, -500, 0, 980); g.addColorStop(0, N.sky0); g.addColorStop(1, N.sky1);
  c.fillStyle = g; c.fillRect(-1800, -1800, 4700, 3900);
  c.save(); c.translate(SUN.x, SUN.y); c.rotate(t * .05);
  c.fillStyle = N.ray; c.beginPath(); for (let i = 0; i < 12; i++) { const a = i * TAU / 12, b = a + TAU / 24; c.moveTo(0, 0); c.lineTo(Math.cos(a) * 900, Math.sin(a) * 900); c.lineTo(Math.cos(b) * 900, Math.sin(b) * 900); c.closePath(); } c.fill();
  c.restore();
  circle(c, SUN.x, SUN.y, SUN.r * 1.35, 'rgba(255,227,77,.3)'); circle(c, SUN.x, SUN.y, SUN.r, N.sun); circle(c, SUN.x - 30, SUN.y - 32, SUN.r * .38, N.sunL);
  // mây phẳng
  for (const [x, y, s] of [[180, 300, 1], [560, 190, .8], [1180, 520, .9], [-260, 560, 1.1]]) { const dx = 14 * Math.sin(t * .2 + x); for (const [a, b, r] of [[-70, 10, 52], [0, -14, 70], [74, 8, 50], [20, 22, 56]]) circle(c, x + dx + a * s, y + b * s, r * s, C.cream); }
  if (o.waggle != null && o.waggle > 0 && o.waggle < 1) waggleTiny(c, lerp(-120, 1200, o.waggle), 560 + 40 * Math.sin(o.waggle * 9), t);
  // đồi xa và bờ bên kia
  ell(c, 120, 960, 760, 200, 0, N.hill0); ell(c, 1040, 975, 820, 215, 0, N.hill1);
  ell(c, 560, 990, 1500, 70, 0, N.far);
  if (o.rollo != null && o.rollo > 0 && o.rollo < 1) rolloTiny(c, lerp(-60, 1150, o.rollo), 952, o.rollo);
  // mặt ao: dải nước, gợn sáng trôi, lá súng có hoa
  rrect(c, -1600, 985, 4300, 220, 0, N.water); rrect(c, -1600, 985, 4300, 14, 0, N.waterD);
  for (let i = 0; i < 26; i++) { const y = 1010 + hash(i + 3) * 150, x = ((hash(i) * 2200 + t * (14 + 10 * hash(i + 7))) % 2400) - 700, w = 30 + 60 * hash(i + 5); capsule(c, x, y, x + w, y, 6, i % 3 ? N.waterL : 'rgba(255,255,255,.55)'); }
  for (const [x, y, r, fl] of [[110, 1060, 62, 1], [380, 1030, 44, 0], [980, 1050, 70, 1], [1230, 1100, 56, 0], [-180, 1110, 60, 1]]) lilyPad(c, x, y + 3 * Math.sin(t * 1.1 + x), r, fl);
}
export function lilyPad(c, x, y, r, flower) {
  c.fillStyle = N.padD; c.beginPath(); c.ellipse(x + 4, y + 6, r, r * .36, 0, 0, TAU); c.fill();
  c.fillStyle = N.pad; c.beginPath(); c.ellipse(x, y, r, r * .36, 0, .22, TAU - .22); c.lineTo(x, y); c.closePath(); c.fill();
  if (flower) { for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .42; ell(c, x + r * .1 + Math.cos(a) * 14, y - 12 + Math.sin(a) * 12, 9, 22, a + Math.PI / 2, C.pink); } circle(c, x + r * .1, y - 14, 9, C.lemon); }
}
// bờ ao gần: cỏ, bùn mép nước, cỏ nến hai bên, hòn đá (toạ độ cảnh)
export function pondBank(c, t, o = {}) {
  c.fillStyle = N.mud; c.beginPath(); c.moveTo(-1600, 1196); for (let x = -1600; x <= 2700; x += 40) c.lineTo(x, groundY(x) - 2 + 8 * Math.sin(x * .03)); c.lineTo(2700, 3000); c.lineTo(-1600, 3000); c.fill();
  c.fillStyle = N.bank; c.beginPath(); c.moveTo(-1600, 1210); for (let x = -1600; x <= 2700; x += 40) c.lineTo(x, groundY(x) + 10 + 6 * Math.sin(x * .05)); c.lineTo(2700, 3000); c.lineTo(-1600, 3000); c.fill();
  c.fillStyle = N.bankD; c.fillRect(-1600, 1420, 4300, 2000);
  c.fillStyle = N.bankL; for (let i = 0; i < 40; i++) { const x = -500 + hash(i + 70) * 2100, y = groundY(x) + 40 + hash(i + 71) * 160; c.beginPath(); c.ellipse(x, y, 26, 7, 0, 0, TAU); c.fill(); }
  // ngọn cỏ ở mép bờ
  for (let i = 0; i < 70; i++) { const x = -600 + i * 34 + 10 * hash(i + 90), y = groundY(x) + 14, h = 26 + 30 * hash(i + 91), sw = 6 * Math.sin(t * 1.6 + i); c.strokeStyle = i % 2 ? N.reed : N.bankD; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + sw * .5, y - h * .6, x + sw + 6, y - h); c.stroke(); }
  if (!o.noReeds) { cattails(c, t, 150, [[-40, 330], [10, 380], [55, 300]]); cattails(c, t, REED.x, [[-60, 300], [0, groundY(REED.x) - REED.top], [52, 330]], o.perch); }
  if (!o.noStone) stone(c);
}
export function stone(c) {
  const x = STONE.x, y = groundY(x);
  ell(c, x + 10, y + 6, STONE.w * .62, 16, 0, 'rgba(30,27,58,.16)');
  c.fillStyle = N.stoneD; c.beginPath(); c.ellipse(x, y - STONE.h * .4, STONE.w * .55, STONE.h * .62, 0, 0, TAU); c.fill();
  c.fillStyle = N.stone; c.beginPath(); c.ellipse(x - 8, y - STONE.h * .52, STONE.w * .5, STONE.h * .5, 0, 0, TAU); c.fill();
  ell(c, x - 34, y - STONE.h * .74, 26, 8, -.2, N.stoneL);
}
// cụm cỏ nến: mỗi cây [lệch x, cao]; perch: cây giữa có ngọn để Zip đậu (không vẽ đầu nến che chân)
function cattails(c, t, x0, list, perch) {
  list.forEach(([dx, h], i) => {
    const x = x0 + dx, y = groundY(x) + 6, sw = 8 * Math.sin(t * 1.2 + i * 1.7 + x0), tx = x + sw, ty = y - h;
    c.strokeStyle = N.reedD; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + sw * .3, y - h * .5, tx, ty); c.stroke();
    capsule(c, tx, ty + 70, tx + sw * .05, ty + 18, 26, N.cat); capsule(c, tx - 4, ty + 62, tx - 4, ty + 26, 7, N.catL);
    // lá dài
    c.strokeStyle = N.reed; c.lineWidth = 12; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - 40 + sw, y - h * .45, x - 70 + sw * 1.4, y - h * .62); c.stroke();
  });
}
// đỉnh cỏ nến cây giữa của cụm phải (chỗ Zip đậu) theo t
export const reedTip = t => { const x = REED.x, h = groundY(x) - REED.top, sw = 8 * Math.sin(t * 1.2 + 1.7 + REED.x); return [x + sw, groundY(x) + 6 - h]; };

// Waggle bay ngang trời rất nhỏ, Rollo lăn viên tròn trên bờ xa (trứng phục sinh)
function waggleTiny(c, x, y, t) {
  ell(c, x, y, 16, 11, 0, C.lemon); for (const k of [-6, 2]) rrect(c, x + k, y - 11, 4, 22, 2, C.ink);
  c.fillStyle = 'rgba(255,255,255,.8)'; const fl = Math.sin(t * 60) * .4; ell(c, x - 4, y - 16, 10, 6, -.6 + fl, 'rgba(255,255,255,.8)'); ell(c, x + 6, y - 16, 10, 6, .6 - fl, 'rgba(255,255,255,.8)');
}
function rolloTiny(c, x, y, u) {
  const sp = u * 30; circle(c, x + 16, y - 10, 13, C.honeyD); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; c.beginPath(); c.arc(x + 16, y - 10, 8, sp, sp + 1.5); c.stroke();
  ell(c, x - 4, y - 8, 12, 8, -.5, C.ink); c.strokeStyle = C.ink; c.lineWidth = 3; for (let k = 0; k < 3; k++) { const a = sp + k * 2.1; c.beginPath(); c.moveTo(x - 4, y - 6); c.lineTo(x - 12 + 4 * Math.cos(a), y + 2 + 3 * Math.sin(a)); c.stroke(); }
}

/* ---------- vòng nhìn quanh Zip (bí mật 1): vòng chấm loang ra, chừa một khe nhỏ phía sau-dưới ---------- */
export function viewRing(c, x, y, R, p, t) {
  if (p <= 0) return;
  const gap = .55, a0 = Math.PI / 2 + gap / 2, span = (TAU - gap) * eo(Math.min(1, p * 1.25));
  c.save(); c.globalAlpha *= Math.min(1, p * 3);
  c.fillStyle = 'rgba(183,240,74,.16)'; c.beginPath(); c.moveTo(x, y); c.arc(x, y, R, a0, a0 + span); c.closePath(); c.fill();
  const n = 40; for (let i = 0; i <= n; i++) { const a = a0 + span * i / n; circle(c, x + Math.cos(a) * R, y + Math.sin(a) * R * .9, 7 + 2 * Math.sin(t * 6 + i), i % 2 ? C.lime : C.cream); }
  c.restore();
}
// vệt bay lùi "◄◄" phía sau đuôi (toạ độ đang vẽ); dir: hướng bay (+1 phải, −1 trái)
export function rewind(c, x, y, s, a, dir) {
  if (a <= .02) return;
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(dir * s, s);
  for (const k of [0, 1]) { const ox = -k * 54; c.fillStyle = C.ink; poly(c, [[ox + 8, -30], [ox - 44, 4], [ox + 8, 38]].map(([px, py]) => [px, py]), C.ink); poly(c, [[ox, -22], [ox - 36, 4], [ox, 30]], C.lemon); }
  c.restore();
  // vệt gió
  for (let i = 0; i < 3; i++) { c.save(); c.globalAlpha *= a * .7; capsule(c, x - dir * (40 + i * 10) * s, y + (i - 1) * 26 * s, x - dir * (150 + i * 30) * s, y + (i - 1) * 26 * s, 8 * s, C.cream); c.restore(); }
}

/* ---------- CẢNH ĐẶC TRƯNG: mặt mắt kép, tổ ong các ô mắt có hình phản chiếu ----------
   facets(c, cx, cy, R, t, o): vòm mắt tâm (cx, cy) bán kính R (toạ độ đang vẽ), chia NH ô theo bán kính.
   o.a: độ hiện của lưới ô (0 = vòm trơn) · o.refl: độ hiện hình phản chiếu (lan từ giữa ra) · o.pose(t, d): dáng của Crumb tí hon
   theo khoảng cách d (0..1) từ tâm, để làn sóng vẫy tay đi từ giữa ra · o.view: khung nhìn [x0, y0, x1, y1] để bỏ ô ngoài khung.
   Hình phản chiếu: vẽ Crumb một lần mỗi dáng vào canvas phụ (không ghi mặt cho safezone), rồi chép vào từng ô. */
export const NH = 32;
const SPR = { cv: null, keys: [] };
function sprite(key, draw) {
  if (!SPR.cv) { SPR.cv = document.createElement('canvas'); SPR.cv.width = 160 * 8; SPR.cv.height = 200; }
  let i = SPR.keys.indexOf(key);
  if (i < 0) {
    if (SPR.keys.length >= 8) SPR.keys = [];
    i = SPR.keys.length; SPR.keys.push(key);
    const c = SPR.cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(i * 160, 0, 160, 200);
    const was = FACES.on; FACES.on = false; c.save(); c.translate(i * 160 + 80, 186); draw(c); c.restore(); FACES.on = was;
  }
  return i;
}
export function facets(c, cx, cy, R, t, o = {}) {
  const a = o.a ?? 1, nh = o.n || NH, s = R / nh, w = s * Math.sqrt(3), h = s * 1.5, refl = o.refl || 0;
  c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip();
  circle(c, cx, cy, R, C.lime);
  if (a > .01) {
    const [vx0, vy0, vx1, vy1] = o.view || [-1e9, -1e9, 1e9, 1e9], sprites = {};
    c.save(); c.globalAlpha *= a; circle(c, cx, cy, R, '#5E9E1E');            // mạch giữa các ô
    const J = Math.ceil(nh / 1.5) + 1;
    for (let j = -J; j <= J; j++) for (let i = -nh - 1; i <= nh + 1; i++) {
      const x = cx + (i + (j & 1) * .5) * w, y = cy + j * h, d = Math.hypot(x - cx, y - cy) / R;
      if (d > 1.03 || x < vx0 - w || x > vx1 + w || y < vy0 - h || y > vy1 + h) continue;
      const r = s * (1 - .16 * d * d);                                        // ô ở rìa vòm hơi nhỏ lại (vòm cong)
      c.fillStyle = (i * 7 + j * 3) % 11 === 0 ? '#D6FB86' : '#C6F46A'; c.beginPath(); hexPath(c, x, y, r * .9); c.fill();
      const show = refl > 0 && o.pose ? clamp((refl * 1.5 - d) * 4) : 0;    // hình phản chiếu lan từ giữa ra
      if (show > 0) {
        const ps = o.pose(t, d, i, j);
        if (!(ps.key in sprites)) sprites[ps.key] = sprite(ps.key, ps.draw);
        c.save(); c.globalAlpha *= show; c.beginPath(); hexPath(c, x, y, r * .86); c.clip();
        c.drawImage(SPR.cv, sprites[ps.key] * 160, 30, 160, 166, x - r * .66, y - r * .72, r * 1.32, r * 1.37);
        c.restore();
      }
      c.fillStyle = 'rgba(70,130,10,.2)'; c.beginPath(); c.arc(x + r * .3, y + r * .32, r * .62, 0, TAU); c.fill();   // mảng tối phẳng dưới-phải của mỗi ô lồi
      c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.ellipse(x - r * .42, y - r * .42, r * .13, r * .07, -.7, 0, TAU); c.fill();
    }
    c.restore();
  }
  // một mảng tối phẳng ở dưới-phải của cả vòm (ánh sáng từ trên-trái), như mọi khối của kênh
  c.fillStyle = 'rgba(60,110,10,.16)'; c.beginPath(); c.arc(cx + R * .35, cy + R * .38, R * .95, 0, TAU); c.fill();
  c.restore();
}
function hexPath(c, x, y, r) { for (let k = 0; k < 6; k++) { const an = Math.PI / 6 + k * Math.PI / 3; k ? c.lineTo(x + Math.cos(an) * r, y + Math.sin(an) * r) : c.moveTo(x + Math.cos(an) * r, y + Math.sin(an) * r); } c.closePath(); }

/* ---------- chữ to (toạ độ khung) ---------- */
export function bigWord(c, s, x, y, px, fill, t, t0, t1, o = {}) {
  if (t < t0 || t > t1) return;
  const pu = 1 + .14 * Math.sin(Math.PI * seg(t, t0, t0 + .25)), fade = 1 - ss(seg(t, t1 - .2, t1));
  c.save(); c.globalAlpha *= fade; c.translate(x, y); c.rotate(o.rot || 0); c.scale(pu, pu); c.translate(-x, -y);
  popText(c, s, x, y, px, fill, C.ink, t, t0, { step: .03, sh: px * .075 }); c.restore();
}
export { hexPath };
