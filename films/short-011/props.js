// Đạo cụ và bối cảnh của SHORT-011: khu vườn buổi chiều (trời mơ chín, hàng rào cây xanh ngọc, bãi cỏ), cành que cho Zip đậu,
// lá khô giòn (tiếng "rắc" của móc), đệm cỏ ba lá (chỗ Crumb ngã ở gag, có từ khung 0), tấm biển BOO! của Crumb (mặt sau vẽ "hi!"),
// khung chia đôi "CRUMB SEES | ZIP SEES": khoá kéo, nhãn, viền khung, mí mắt của Zip, vòng "bị thấy rồi!".
// Nền phẳng, không viền và nhạt hơn nhân vật (nhân vật v2 có viền mực nổi lên trên); đạo cụ nhân vật cầm (biển, cành que) có viền mực cùng màu với rig.
import { C, circle, ell, rrect, poly, capsule, popText, subFont, TAU } from '/_shared/kit.js';
import { hash, lerp, clamp, seg, ss, eo, back } from '/core/lib.js';
import { star } from '/_shared/characters/face.js';
import { LOOK } from '/_shared/characters/look.js';

export const INK = LOOK.ink;
export const D = {
  sky0: '#FFE59A', sky1: '#FFD685', sky2: '#FFC576', sun: '#FFF4B8', cloud: '#FFF8E7', cloudD: '#FBE3B4',
  hedge: '#2BAE84', hedgeD: '#1E9070', hedgeL: '#56CFA2', grass: '#3DC46A', grassD: '#27A856', grassL: '#7FE397', grassF: '#1F944B',
  twig: '#A0602F', twigD: '#6E3B18', sprout: '#5FD06F', moss: '#33A85F', mossL: '#74DD8F', mossD: '#23864A',
  dry: '#F2A03E', dryD: '#C8701E', board: '#FFF8E7', boardD: '#F1DDB4', stick: '#B8743A',
  night: '#2A1A74', nightL: '#3A2894', zipRim: '#B7F04A', zipRimD: '#86C72C', crumbRim: '#F2A33A', crumbRimD: '#B85C12',
};
export const GY = 1195;                                           // mặt cỏ của khu vườn (toạ độ cảnh)

/* ---------- trời mơ chín: dải phẳng, mặt trời mờ, mây trôi ---------- */
export function sky(c, t, o = {}) {
  const x0 = o.x0 ?? -900, x1 = o.x1 ?? 2000, gy = o.gy ?? GY;
  c.fillStyle = D.sky0; c.fillRect(x0, -1400, x1 - x0, gy + 1600);
  c.fillStyle = D.sky1; c.fillRect(x0, gy - 560, x1 - x0, 600);
  c.fillStyle = D.sky2; c.fillRect(x0, gy - 300, x1 - x0, 340);
  const sx = o.sun ? o.sun[0] : 960, sy = o.sun ? o.sun[1] : 610, sr = o.sunR ?? 74;
  for (const [m, a] of [[2.0, .16], [1.5, .22]]) circle(c, sx, sy, sr * m, `rgba(255,244,184,${a})`);
  circle(c, sx, sy, sr, D.sun);
  for (const [cx, cy, s, sp] of (o.clouds || [[120, 560, 1, 9], [760, 380, .8, 6], [1180, 700, .9, 7]])) cloud(c, cx + ((t * sp) % 1600 + 1600) % 1600 - 400 * 0, cy, s);
}
export function cloud(c, x, y, s = 1) {
  ell(c, x + 10 * s, y + 22 * s, 150 * s, 30 * s, 0, D.cloudD);
  for (const [dx, dy, r] of [[-80, 0, 50], [-20, -26, 66], [55, -8, 54], [105, 10, 38]]) circle(c, x + dx * s, y + dy * s, r * s, D.cloud);
  rrect(c, x - 125 * s, y, 270 * s, 46 * s, 23 * s, D.cloud);
}
/* ---------- hàng rào cây (bụi tròn xanh ngọc) ---------- */
export function hedge(c, t, gy = GY, x0 = -900, x1 = 2000, h = 170) {
  for (let x = x0, i = 0; x < x1; x += 110, i++) circle(c, x, gy - h + 40 + 22 * hash(i + 3), 92 + 18 * hash(i + 7), D.hedgeD);
  for (let x = x0 + 55, i = 0; x < x1; x += 120, i++) circle(c, x, gy - h + 70 + 18 * hash(i + 11), 80 + 16 * hash(i + 13), D.hedge);
  c.fillStyle = D.hedge; c.fillRect(x0, gy - h + 70, x1 - x0, h);
  for (let x = x0 + 30, i = 0; x < x1; x += 140, i++) ell(c, x + 30 * hash(i), gy - h + 46 + 20 * hash(i + 2), 26, 14, -.4, D.hedgeL);
}
/* ---------- bãi cỏ: mặt phẳng, sọc cắt cỏ, ngọn cỏ đung đưa ---------- */
export function grass(c, t, gy = GY, x0 = -900, x1 = 2000) {
  c.fillStyle = D.grass; c.fillRect(x0, gy - 8, x1 - x0, 1800);
  c.fillStyle = D.grassD; for (let k = 0; k < 6; k++) c.fillRect(x0, gy + 90 + k * 150, x1 - x0, 40 + k * 8);
  c.strokeStyle = D.grassL; c.lineWidth = 7; c.lineCap = 'round';
  for (let i = 0; i < 46; i++) {
    const x = x0 + 60 + i * ((x1 - x0) / 46) + 20 * hash(i), y = gy + 20 + 140 * hash(i + 40), sw = 7 * Math.sin(t * 2.1 + i);
    c.beginPath(); c.moveTo(x - 10, y); c.quadraticCurveTo(x - 6, y - 18, x - 12 + sw, y - 36); c.moveTo(x + 6, y); c.quadraticCurveTo(x + 8, y - 16, x + 14 + sw, y - 30); c.stroke();
  }
}
/* ---------- hoa nhỏ ---------- */
export function daisy(c, x, y, r, col, ctr = C.lemon, rot = 0) {
  for (let i = 0; i < 6; i++) { const a = rot + i * TAU / 6; ell(c, x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9, r * .7, r * .38, a, col); }
  circle(c, x, y, r * .55, ctr);
}
export function stemFlower(c, t, x, gy, h, r, col, ph = 0) {
  const sw = 6 * Math.sin(t * 1.6 + ph);
  c.strokeStyle = D.grassF; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, gy); c.quadraticCurveTo(x + sw * .3, gy - h * .6, x + sw, gy - h); c.stroke();
  ell(c, x + 12, gy - h * .45, 18, 8, -.5, D.grassF);
  daisy(c, x + sw, gy - h, r, col, C.lemon, t * .2 + ph);
}

/* ---------- cành que cho Zip đậu (viền mực như đạo cụ của nhân vật) ---------- */
export const TWIG = { x0: 562, y0: GY + 8, x1: 580, y1: 742 };
export function twig(c, T = TWIG, w = 17) {
  const mx = (T.x0 + T.x1) / 2 - 14, my = (T.y0 + T.y1) / 2;
  const path = () => { c.beginPath(); c.moveTo(T.x0, T.y0); c.quadraticCurveTo(mx, my, T.x1, T.y1); };
  const br = [lerp(T.x0, T.x1, .55) - 6, lerp(T.y0, T.y1, .55)], bt = [br[0] + 70 * (w / 17), br[1] - 60 * (w / 17)];
  c.lineCap = 'round';
  c.strokeStyle = INK; c.lineWidth = w + 9; path(); c.stroke(); c.beginPath(); c.moveTo(br[0], br[1]); c.lineTo(bt[0], bt[1]); c.stroke();
  c.strokeStyle = D.twig; c.lineWidth = w; path(); c.stroke(); c.lineWidth = w * .6; c.beginPath(); c.moveTo(br[0], br[1]); c.lineTo(bt[0], bt[1]); c.stroke();
  c.strokeStyle = D.twigD; c.lineWidth = w * .3; c.beginPath(); c.moveTo(T.x0 + 3, T.y0 - 10); c.quadraticCurveTo(mx + 4, my, T.x1 + 3, T.y1 + 12); c.stroke();
  // mầm lá ở đầu cành phụ
  c.save(); c.translate(bt[0], bt[1]); c.rotate(-.6); c.fillStyle = INK; c.beginPath(); c.ellipse(16 * w / 17, 0, 24 * w / 17, 12 * w / 17, 0, 0, TAU); c.fill();
  c.fillStyle = D.sprout; c.beginPath(); c.ellipse(16 * w / 17, 0, 20 * w / 17, 8.5 * w / 17, 0, 0, TAU); c.fill(); c.restore();
}

/* ---------- đệm cỏ ba lá (chỗ Crumb ngã ngồi ở gag; có từ khung 0) ---------- */
export const CUSH = { x: 196, y: GY + 4 };
export function cushion(c, x = CUSH.x, y = CUSH.y, s = 1, squash = 0) {
  c.save(); c.translate(x, y); c.scale(s * (1 + .12 * squash), s * (1 - .2 * squash));
  ell(c, 0, 4, 128, 26, 0, 'rgba(30,27,58,.16)');
  c.fillStyle = INK; c.beginPath(); c.ellipse(0, -30, 124, 58, 0, Math.PI, TAU); c.lineTo(124, 4); c.lineTo(-124, 4); c.closePath(); c.fill();
  c.fillStyle = D.moss; c.beginPath(); c.ellipse(0, -30, 118, 53, 0, Math.PI, TAU); c.lineTo(118, 0); c.lineTo(-118, 0); c.closePath(); c.fill();
  ell(c, -30, -58, 60, 16, -.1, D.mossL);
  for (const [dx, dy, r] of [[-70, -40, 15], [-10, -70, 17], [55, -50, 15], [90, -18, 12], [-100, -10, 12]]) {
    for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * TAU / 3; circle(c, dx + Math.cos(a) * r * .55, dy + Math.sin(a) * r * .55, r * .58, D.mossD); }
    circle(c, dx, dy, 3, D.mossL);
  }
  c.restore();
}

/* ---------- lá khô giòn (Crumb giẫm "rắc" ở móc): broken 0..1 tách đôi, vụn bay ---------- */
export const LEAFX = { x: 362, y: GY + 6 };
export function dryLeaf(c, t, broken = 0, x = LEAFX.x, y = LEAFX.y) {
  const half = (sd, dx, dy, r) => {
    c.save(); c.translate(x + dx, y + dy); c.rotate(r);
    const a0 = sd > 0 ? -Math.PI / 2 : Math.PI / 2, a1 = sd > 0 ? Math.PI / 2 : Math.PI * 1.5;
    c.fillStyle = INK; c.beginPath(); c.ellipse(0, 0, 56, 19, 0, a0, a1); c.closePath(); c.fill();
    c.fillStyle = D.dry; c.beginPath(); c.ellipse(sd * -2, 0, 51, 14.5, 0, a0, a1); c.closePath(); c.fill();
    c.strokeStyle = D.dryD; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(sd * 50, 0); c.stroke();
    c.restore();
  };
  const b = ss(broken);
  c.save(); c.translate(x, y); c.scale(1.6, 1.6); c.translate(-x, -y);
  half(-1, -12 * b, 0, -.15 * b); half(1, 14 * b, 0, .18 * b);
  if (broken > 0 && broken < 1) for (let i = 0; i < 7; i++) {
    const a = -Math.PI * (.15 + .7 * hash(i + 4)), d = 30 + 90 * eo(broken), h = 40 * Math.sin(Math.PI * broken);
    poly(c, [[0, -5], [6, 3], [-5, 4]].map(([px, py]) => [x + Math.cos(a) * d + px * 1.4, y + Math.sin(a) * d * .6 - h + py * 1.4]), i % 2 ? D.dry : D.dryD);
  }
  c.restore();
}

/* ---------- tấm biển BOO! của Crumb ----------
   (gx, gy): chỗ hai tay cầm; que đi lên tới tấm biển. k: cỡ (≈ hệ số k của Crumb). rot: nghiêng quanh chỗ cầm.
   face: 1 mặt trước (BOO!), −1 mặt sau ("hi!"), giữa hai giá trị là tấm biển đang xoay (bẹt ngang). */
export function booSign(c, gx, gy, k, rot = 0, face = 1, o = {}) {
  const W = 2.35 * k, H = 1.36 * k, L = o.stick ?? .95 * k, lw = Math.max(3, k * .055);
  c.save(); c.translate(gx, gy); c.rotate(rot);
  // que gỗ (o.hat: tấm biển đội trên đầu, tâm tấm ở (gx, gy), que chĩa lên trời)
  const s0 = o.hat ? -H / 2 + .1 * k : .35 * k, s1 = o.hat ? -H / 2 - 1.05 * k : -L;
  c.lineCap = 'round'; c.strokeStyle = INK; c.lineWidth = .2 * k + 2 * lw; c.beginPath(); c.moveTo(0, s0); c.lineTo(0, s1); c.stroke();
  c.strokeStyle = D.stick; c.lineWidth = .2 * k; c.beginPath(); c.moveTo(0, s0); c.lineTo(0, s1); c.stroke();
  // tấm biển (bẹt theo face khi xoay)
  const s = Math.max(.04, Math.abs(face));
  if (!o.hat) c.translate(0, -L - H / 2 + .1 * k); c.scale(s, 1);
  rrect(c, -W / 2 - lw, -H / 2 - lw, W + 2 * lw, H + 2 * lw, .24 * k + lw, INK);
  rrect(c, -W / 2, -H / 2, W, H, .24 * k, face >= 0 ? D.board : D.boardD);
  rrect(c, -W / 2 + .1 * k, H / 2 - .26 * k, W - .2 * k, .16 * k, .08 * k, 'rgba(184,116,58,.25)');
  if (face >= 0) {
    c.font = `${.86 * k}px "Paytone One"`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = INK; c.fillText('BOO!', .05 * k, .1 * k); c.fillStyle = C.berry; c.fillText('BOO!', 0, .04 * k);
  } else {
    c.font = `800 ${.6 * k}px "Baloo 2"`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = C.grape; c.fillText('hi!', -.18 * k, .08 * k);
    const hx = .55 * k, hy = 0, hr = .15 * k;
    c.fillStyle = C.pink; c.beginPath(); c.arc(hx - hr * .55, hy - hr * .2, hr * .62, 0, TAU); c.arc(hx + hr * .55, hy - hr * .2, hr * .62, 0, TAU); c.fill();
    poly(c, [[hx - hr * 1.15, hy], [hx + hr * 1.15, hy], [hx, hy + hr * 1.25]], C.pink);
  }
  c.restore();
}

/* ---------- khung chia đôi ---------- */
export const PL = { x0: 28, y0: 196, x1: 524, y1: 1290 }, PR = { x0: 556, y0: 196, x1: 1052, y1: 1290 };
export const pc = P => [(P.x0 + P.x1) / 2, (P.y0 + P.y1) / 2];
export const panelPath = (c, P, inset = 0, r = 46) => { c.beginPath(); c.roundRect(P.x0 + inset, P.y0 + inset, P.x1 - P.x0 - 2 * inset, P.y1 - P.y0 - 2 * inset, r); };
export function splitBg(c, t) {
  c.fillStyle = D.night; c.fillRect(-200, -200, 1480, 2400);
  for (let i = 0; i < 60; i++) { const x = (i * 197) % 1080, y = 120 + ((i * 331) % 1800); circle(c, x + 6 * Math.sin(t + i), y, 3 + 3 * hash(i), 'rgba(255,248,231,.12)'); }
}
export function panelFrame(c, P, rim, rimD, glow = 0) {
  c.save();
  if (glow > 0) { c.shadowColor = rim; c.shadowBlur = 40 * glow; }
  panelPath(c, P, -10); c.lineWidth = 16; c.strokeStyle = INK; c.stroke();
  c.shadowBlur = 0;
  panelPath(c, P, -4); c.lineWidth = 12; c.strokeStyle = rim; c.stroke();
  panelPath(c, P, 4); c.lineWidth = 4; c.strokeStyle = rimD; c.stroke();
  c.restore();
}
// nhãn trên khung: chấm màu nhân vật + chữ (ghi vào readcheck)
export function tag(c, text, x, y, t, t0, dot, px = 50) {
  const a = back(seg(t, t0, t0 + .3), 2.2); if (a <= 0) return;
  c.save(); c.font = subFont(px); const w = c.measureText(text).width + 2.2 * px, h = px * 1.45;
  c.translate(x, y); c.scale(a, a); c.translate(-x, -y);
  rrect(c, x - w / 2 + 5, y - h / 2 + 7, w, h, h / 2, 'rgba(30,27,58,.35)');
  rrect(c, x - w / 2 - 4, y - h / 2 - 4, w + 8, h + 8, h / 2 + 4, INK);
  rrect(c, x - w / 2, y - h / 2, w, h, h / 2, C.cream);
  circle(c, x - w / 2 + .62 * px, y, .32 * px, INK); circle(c, x - w / 2 + .62 * px, y, .25 * px, dot);
  c.restore();
  popText(c, text, x + .3 * px, y + px * .33, px, INK, null, -1, -1, { font: subFont });
}
// khoá kéo ở đường chia: răng khoá từ trên xuống tới con chạy (y), mở chữ V phía trên con chạy
export function zipper(c, x, yTop, y, t) {
  const tooth = 26;
  for (let yy = yTop, i = 0; yy < y - 30; yy += tooth, i++) {
    const open = clamp((y - yy) / 260), dx = 6 + 6 * open;
    rrect(c, x - dx - (i % 2 ? 18 : 0) - 4, yy - 9, 22, 18, 5, INK); rrect(c, x - dx - (i % 2 ? 18 : 0) - 1, yy - 6, 16, 12, 4, C.lemon);
  }
  // con chạy + tay kéo
  rrect(c, x - 26, y - 34, 52, 62, 14, INK); rrect(c, x - 21, y - 29, 42, 52, 11, C.mango);
  rrect(c, x - 12, y + 18, 24, 56, 10, INK); rrect(c, x - 8, y + 22, 16, 48, 8, C.lemon);
}
// mí mắt của Zip trên khung phải: open 0 = nhắm (một khe), 1 = mở hết
export function eyelids(c, P, open, t) {
  if (open >= 1) return;
  const [cx, cy] = pc(P), hH = (P.y1 - P.y0) / 2 + 40, gap = hH * ss(open), w = (P.x1 - P.x0) / 2 + 40;
  c.save(); panelPath(c, P); c.clip();
  const wig = open < .05 ? 14 * Math.sin(t * 3.4) : 0;   // mắt nhắm vẫn "động đậy": con mắt đảo dưới mí
  for (const sd of [-1, 1]) {
    const edge = cy + sd * gap + wig, bow = (70 + 1.5 * wig) * (1 - open);
    c.fillStyle = D.zipRim; c.beginPath(); c.moveTo(cx - w, edge); c.quadraticCurveTo(cx, edge + sd * bow * -1 + sd * 0, cx + w, edge);
    c.lineTo(cx + w, cy + sd * (hH + 300)); c.lineTo(cx - w, cy + sd * (hH + 300)); c.closePath(); c.fill();
    c.strokeStyle = INK; c.lineWidth = 9; c.beginPath(); c.moveTo(cx - w, edge); c.quadraticCurveTo(cx, edge - sd * bow, cx + w, edge); c.stroke();
    c.strokeStyle = D.zipRimD; c.lineWidth = 6; c.beginPath(); c.moveTo(cx - w * .7, edge + sd * 40); c.quadraticCurveTo(cx, edge + sd * 40 - sd * bow * .8, cx + w * .7, edge + sd * 40); c.stroke();
  }
  // mắt nhắm: hàng mi ngắn dưới nếp mí (đọc được là "con mắt đang nhắm")
  if (open < .5) { const k = 1 - 2 * open; c.strokeStyle = INK; c.lineWidth = 9; c.lineCap = 'round';
    for (let i = -3; i <= 3; i++) { const u = i / 4, x = cx + u * w * .78, y = cy + wig + (70 + 1.5 * wig) * (1 - u * u) * (1 - open) - 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + u * 22, y + 34 * k); c.stroke(); } }
  // khi còn nhắm: đốm sáng nhỏ nhấp nháy trên mí (Zip "đang nhìn")
  if (open < .05) for (let i = 0; i < 5; i++) star(c, cx - 160 + i * 80, cy - 150 + 30 * Math.sin(t * 3 + i), 9 + 5 * Math.sin(t * 5 + i * 2), 'rgba(255,255,255,.7)');
  c.restore();
}
// vòng "bị thấy rồi!": vòng nét đứt vàng nảy ra quanh Crumb, quay chậm
export function spotRing(c, x, y, r, t, t0) {
  if (t < t0) return;
  const p = back(seg(t, t0, t0 + .3), 2.4), q = seg(t, t0, t0 + .6);
  if (q < 1) { c.strokeStyle = `rgba(255,227,77,${1 - q})`; c.lineWidth = 14 * (1 - q) + 2; c.beginPath(); c.arc(x, y, r * (1 + .8 * eo(q)), 0, TAU); c.stroke(); }
  c.save(); c.translate(x, y); c.scale(p, p);
  c.setLineDash([r * .28, r * .16]); c.lineWidth = 15; c.strokeStyle = INK; c.beginPath(); c.arc(0, 0, r, t * .8, t * .8 + TAU); c.stroke();
  c.lineWidth = 9; c.strokeStyle = C.lemon; c.beginPath(); c.arc(0, 0, r, t * .8, t * .8 + TAU); c.stroke(); c.setLineDash([]);
  c.restore();
}
// bong bóng "!" (ghi vào readcheck)
export function bang(c, x, y, t, t0, r = 46) {
  if (t < t0) return;
  const p = back(seg(t, t0 + .05, t0 + .35), 2.6); if (p <= 0) return;
  c.save(); c.translate(x, y); c.scale(p, p);
  circle(c, 5, 7, r, 'rgba(30,27,58,.35)'); circle(c, 0, 0, r + 6, INK); circle(c, 0, 0, r, C.lemon);
  poly(c, [[-12, r - 6], [10, r - 4], [-20, r + 26]], INK); poly(c, [[-9, r - 8], [6, r - 6], [-15, r + 17]], C.lemon);
  c.restore();
  if (p > .6) popText(c, '!', x, y + r * .42, r * 1.25, INK, null, -1, -1);
}
