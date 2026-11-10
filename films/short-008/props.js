// Đạo cụ và bối cảnh của SHORT-008: "trại" đêm lạnh (trời xanh tím, trăng lưỡi liềm bên trái, cỏ đọng sương giá), vòng sỏi lửa trại
// với đống que cỏ (Blink ngồi trên làm "lửa"), túp lều lá, băng giá trên tay, hơi thở, buồng sáng trong đèn đuôi (cắt ngang)
// với giọt vàng (luciferin), bong bóng xanh (oxy) và cánh quạt hồng (luciferase), tia sáng "pop", nhiệt kế tí hon.
// Khối phẳng, không viền (Khối Kẹo Phẳng). Trời và quầng sáng dùng chồng nhiều lớp phẳng, như trời đêm của SHORT-007.
import { C, circle, ell, rrect, poly, capsule, path, TAU } from '/_shared/kit.js';
import { hash, lerp, clamp, seg, ss, eo, back } from '/core/lib.js';
import { star } from '/_shared/characters/face.js';

export const N = {
  sky0: '#241A8F', sky1: '#3E2DC2', band: '#4F3BD8', hill0: '#2E2696', hill1: '#38279F',
  grass: '#2AA39A', grassD: '#1C7F7A', grassL: '#5ED8C8', frost: '#E4FBFF', frostD: '#A9E6F2',
  pebble: '#8C86C9', pebbleD: '#6B64AE', pebbleL: '#B9B4E8', twig: '#B8662A', twigD: '#8A4618', twigL: '#D98A45',
  moon: '#FFF3B8', moonD: '#F2DC86', glow: 'rgba(255,227,77,', tent: '#3FBF6A', tentD: '#2A9A50', tentL: '#7EE39A',
  lamp: '#FFF4C2', lampD: '#FFE58A', wall: '#F7D45A', o2: '#58C9FF', o2L: '#C6EEFF', enz: '#FF7EB3', enzD: '#E8336D',
};
// mặt đất ở toạ độ cảnh (bãi cỏ sương giá, hơi cong)
export const groundY = x => 1205 + .00009 * (x - 560) ** 2;
export const MOON = { x: 300, y: 640, r: 66 };
export const FIRE = { x: 690, rx: 150, ry: 38 };                  // vòng sỏi lửa trại (tâm trên mặt đất)
export const fireY = () => groundY(FIRE.x);

/* ---------- trời đêm: các dải phẳng, sao lấp lánh, trăng lưỡi liềm bên trái, đồi xa, bông tuyết li ti ---------- */
export function campSky(c, t, o = {}) {
  c.fillStyle = N.sky0; c.fillRect(-1600, -1600, 4300, 3600);
  ell(c, 560, 1130, 1700, 620, 0, N.sky1); ell(c, 560, 1150, 1500, 330, 0, N.band);
  for (let i = 0; i < 70; i++) {
    const x = -500 + hash(i + 300) * 2100, y = -300 + hash(i + 309) * 1150, tw = .55 + .45 * Math.sin(t * (1.4 + hash(i + 304) * 2) + i);
    if (i % 6 === 0) star(c, x, y, (5 + 5 * hash(i + 302)) * tw, C.cream); else circle(c, x, y, (1.6 + 2.4 * hash(i + 306)) * tw, C.cream);
  }
  if (!o.noMoon) {                                                // trăng lưỡi liềm: hai hình tròn chồng nhau (không gradient)
    for (const [m, a] of [[2.0, .07], [1.5, .1]]) circle(c, MOON.x, MOON.y, MOON.r * m, `rgba(255,243,184,${a})`);
    circle(c, MOON.x, MOON.y, MOON.r, N.moon); circle(c, MOON.x + 34, MOON.y - 22, MOON.r * .86, N.sky0);
  }
  ell(c, 120, 1100, 760, 200, 0, N.hill0); ell(c, 1040, 1120, 820, 220, 0, N.hill1);
  c.strokeStyle = 'rgba(228,251,255,.35)'; c.lineWidth = 5; c.beginPath(); c.ellipse(120, 1100, 760, 200, 0, Math.PI * 1.1, Math.PI * 1.6); c.stroke();
  c.beginPath(); c.ellipse(1040, 1120, 820, 220, 0, Math.PI * 1.25, Math.PI * 1.72); c.stroke();
  // bông tuyết li ti rơi chậm: đêm lạnh
  for (let i = 0; i < 26; i++) {
    const x = -260 + hash(i + 400) * 1600 + 30 * Math.sin(t * .6 + i), y = ((hash(i + 410) * 1300 + t * (40 + 30 * hash(i + 420))) % 1300) - 150;
    circle(c, x, y, 3 + 3 * hash(i + 430), 'rgba(228,251,255,.7)');
  }
}

/* ---------- trại: bãi cỏ sương giá, lều lá, vòng sỏi, đống que cỏ ---------- */
export function camp(c, t, o = {}) {
  // cỏ xa
  for (let i = 0; i < 46; i++) { const gx = -260 + i * 36, h = 60 + hash(i + 13) * 80, sw = Math.sin(t * 1.1 + i) * 6; poly(c, [[gx - 11, 1150], [gx + 11, 1150], [gx + sw, 1150 - h]], i % 2 ? N.grass : N.grassD); }
  if (!o.noTent) tent(c, 1000, groundY(1000) - 4, 1.0, t);
  // bãi cỏ
  c.fillStyle = N.grassD; c.beginPath(); c.moveTo(-1400, 1270); for (let x = -1400; x <= 2600; x += 40) c.lineTo(x, groundY(x) + 14); c.lineTo(2600, 3400); c.lineTo(-1400, 3400); c.closePath(); c.fill();
  c.fillStyle = N.grass; c.beginPath(); for (let x = -1400; x <= 2600; x += 40) c.lineTo(x, groundY(x)); c.lineTo(2600, groundY(2600) + 30); c.lineTo(-1400, groundY(-1400) + 30); c.closePath(); c.fill();
  c.strokeStyle = N.frost; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); for (let x = -1400; x <= 2600; x += 40) c.lineTo(x, groundY(x) + 3); c.stroke();
  // đốm sương giá lấp lánh trên cỏ
  for (let i = 0; i < 34; i++) { const x = -300 + hash(i + 70) * 1700, y = groundY(x) + 50 + hash(i + 80) * 520, tw = .5 + .5 * Math.sin(t * 2 + i * 1.7); ell(c, x, y, 22 + 18 * hash(i), 8 + 5 * hash(i + 1), 0, i % 3 ? N.grassL : '#3FC2B4'); if (i % 4 === 0) star(c, x, y - 6, 7 * tw, N.frost); }
  // cỏ ba lá tiền cảnh hai bên
  if (!o.noClover) { clover(c, -60, groundY(-60) + 10, 1.3, t, 0); clover(c, 1150, groundY(1150) + 6, 1.25, t, 2); }
}
export function tent(c, x, y, s, t) {                            // túp lều lá: hai lá xanh dựng chữ A, cửa tối, que cắm cờ nhỏ
  c.save(); c.translate(x, y); c.scale(s, s);
  poly(c, [[-170, 0], [0, -260], [170, 0]], N.tentD); poly(c, [[-170, 0], [0, -260], [-10, 0]], N.tent);
  poly(c, [[-56, 0], [0, -120], [56, 0]], C.ink);
  c.strokeStyle = N.tentL; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(-90, -120); c.lineTo(-30, -190); c.moveTo(-130, -60); c.lineTo(-60, -150); c.stroke();
  capsule(c, 0, -260, 0, -340, 6, N.twigD);
  const fl = Math.sin(t * 5) * 8; poly(c, [[0, -340], [70, -322 + fl * .3], [0, -300]], C.berry);
  c.restore();
}
export function clover(c, x, y, s, t, ph) {
  const sw = Math.sin(t * 1.2 + ph) * .05;
  c.save(); c.translate(x, y); c.rotate(sw); c.scale(s, s);
  capsule(c, 0, 0, 6, -190, 12, N.grassD);
  for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + (k - 1) * 2.1; c.save(); c.translate(6, -190); c.rotate(a + Math.PI / 2); ell(c, 0, -46, 40, 50, 0, k === 1 ? N.grassL : N.grass); c.restore(); }
  c.restore();
}
// vòng sỏi: nửa sau vẽ trước nhân vật, nửa trước vẽ sau (o.front)
export function pebbles(c, front = false) {
  const n = 11, y0 = fireY();
  for (let i = 0; i < n; i++) {
    const a = Math.PI + i / n * TAU, sy = Math.sin(a); if ((sy > 0) !== front) continue;
    const x = FIRE.x + Math.cos(a) * FIRE.rx, y = y0 + sy * FIRE.ry, r = 30 + 8 * hash(i + 3);
    ell(c, x, y + 4, r * 1.15, r * .7, 0, N.pebbleD); ell(c, x - 3, y - 2, r, r * .62, 0, N.pebble); ell(c, x - r * .3, y - r * .3, r * .35, r * .18, -.2, N.pebbleL);
  }
}
// đống que cỏ hình chóp (Blink ngồi trên đỉnh); trả về điểm ngồi
export const SEAT = () => [FIRE.x, fireY() - 62];
export function twigs(c) {
  const y0 = fireY() + 6, x0 = FIRE.x;
  for (const [dx, a, w] of [[-70, -.5, 18], [70, .5, 18], [-30, -.2, 16], [36, .25, 16], [0, 0, 14]]) {
    const x1 = x0 + dx, x2 = x0 + dx * .25 + Math.sin(a) * 30, y2 = y0 - 120;
    capsule(c, x1, y0, x2, y2, w + 6, N.twigD); capsule(c, x1, y0, x2, y2, w, N.twig); capsule(c, x1 + 2, y0 - 6, (x1 + x2) / 2, (y0 + y2) / 2, w * .35, N.twigL);
  }
  capsule(c, x0 - 95, y0 - 4, x0 + 95, y0 - 22, 30, N.twigD); capsule(c, x0 - 95, y0 - 8, x0 + 95, y0 - 26, 22, N.twig);   // khúc củi nằm (ghế của Blink)
  for (const sx of [-95, 95]) { circle(c, x0 + sx, y0 - 15 - sx * .1, 13, N.twigL); circle(c, x0 + sx, y0 - 15 - sx * .1, 6, N.twigD); }
}

/* ---------- ánh sáng: đốm sáng có quầng, quầng lớn quanh đuôi (chồng lớp phẳng, trong suốt) ---------- */
export function glowDot(c, x, y, r, a = 1) {
  if (a <= .01) return;
  circle(c, x, y, r * 4.2, N.glow + (.10 * a) + ')'); circle(c, x, y, r * 2.4, N.glow + (.22 * a) + ')');
  circle(c, x, y, r * (1 + .25 * a), a > .5 ? C.lemon : '#E9D46A'); circle(c, x - r * .25, y - r * .25, r * .4, `rgba(255,255,255,${.8 * a})`);
}
export function bigGlow(c, x, y, r, a = 1) {
  if (a <= .01) return;
  for (const [k, al] of [[1, .1], [.72, .14], [.48, .2], [.28, .28]]) circle(c, x, y, r * k, `rgba(255,232,110,${al * a})`);
}

/* ---------- băng giá trên tay, hơi thở ---------- */
// cụm tinh thể băng quanh (x, y), cỡ s; k 0..1 mọc dần
export function frost(c, x, y, s, k, seed = 0) {
  if (k <= .01) return;
  for (let i = 0; i < 7; i++) {
    const a = hash(i + seed * 13) * TAU, d = s * (.25 + .55 * hash(i + seed * 13 + 5)), kk = clamp(k * 1.6 - i * .1);
    if (kk <= 0) continue;
    const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d, L = s * (.32 + .3 * hash(i + 9)) * kk;
    c.strokeStyle = N.frost; c.lineCap = 'round'; c.lineWidth = s * .09;
    for (let j = 0; j < 3; j++) { const b = a + j * Math.PI / 3; c.beginPath(); c.moveTo(px - Math.cos(b) * L, py - Math.sin(b) * L); c.lineTo(px + Math.cos(b) * L, py + Math.sin(b) * L); c.stroke(); }
    circle(c, px, py, s * .08 * kk, C.white);
  }
  ell(c, x, y, s * .7 * k, s * .5 * k, 0, 'rgba(228,251,255,.45)');
}
// làn hơi thở: ba cụm tròn trắng bay lên, mờ dần; p 0..1
export function breath(c, x, y, p, dir = 1) {
  if (p <= 0 || p >= 1) return;
  for (let i = 0; i < 3; i++) { const q = clamp(p * 1.4 - i * .18); if (q <= 0 || q >= 1) continue; circle(c, x + dir * (20 + 70 * q) + i * 14 * dir, y - 30 * q - i * 8, (14 + 22 * q) * (1 - .3 * i), `rgba(240,250,255,${.75 * (1 - q)})`); }
}

/* ---------- buồng sáng trong đèn đuôi (cắt ngang), vẽ ở toạ độ khung: tâm (cx, cy), bán kính R ----------
   s: trạng thái { t, pops: [mốc…], bloom: mốc, lit: độ sáng nền 0..1 } — mỗi mốc pop: một giọt vàng và một bong bóng xanh bay tới
   một cánh quạt hồng, gặp nhau đúng mốc, bật thành tia sáng; cánh quạt ở lại (enzyme không bị dùng hết, FACTS §1). */
export const FANS = [[-.46, -.22], [.4, -.4], [-.04, .4], [.48, .3]];
const POPFAN = [0, 1, 2, 3, 1, 0, 3, 2];
const mixHex = (a, b, k) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(k)))).join(',')})`; };
export function chamber(c, cx, cy, R, s) {
  const t = s.t, lit = s.lit;
  // buồng đèn: tối (tím đêm) khi chưa sáng, vàng nhạt dần theo từng cú pop; ô tế bào mờ quanh mép
  circle(c, cx, cy, R * 1.7, mixHex('#2C1F86', '#FFE9A0', lit));
  circle(c, cx, cy, R * 1.05, mixHex('#3B2A9F', '#FFF4C8', lit));
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + .2; circle(c, cx + Math.cos(a) * R * 1.32, cy + Math.sin(a) * R * 1.32, R * .2, lit > .5 ? 'rgba(242,180,40,.18)' : 'rgba(255,255,255,.07)'); }
  // ống thở bên trái (oxy vào)
  capsule(c, cx - R * 1.8, cy + R * .7, cx - R * .9, cy + R * .3, R * .3, C.mint); capsule(c, cx - R * 1.8, cy + R * .7, cx - R * .9, cy + R * .3, R * .17, N.o2L);
  // bong bóng xanh trôi vào từ ống thở
  for (let i = 0; i < 5; i++) {
    const q = (t * .5 + i / 5) % 1, x = lerp(cx - R * 1.25, cx + R * .1, q) + R * .1 * Math.sin(t * 3 + i), y = lerp(cy + R * .5, cy - R * .3 + R * .6 * hash(i), q);
    bubble(c, x, y, R * (.11 + .03 * hash(i + 1)), clamp(Math.min(q * 4, (1 - q) * 4)));
  }
  // giọt vàng trôi lững lờ
  for (let i = 0; i < 4; i++) {
    const a = t * (.45 + .1 * i) + i * 1.6, x = cx + R * (.66 * Math.cos(a) * (.6 + .3 * hash(i))), y = cy + R * (.55 * Math.sin(a * 1.2 + i));
    drop(c, x, y, R * .13, .95);
  }
  // cánh quạt hồng (luciferase): quay tít, nảy lên khi có pop
  FANS.forEach(([fx, fy], k) => {
    const bump = s.pops.reduce((a, h, j) => a + (POPFAN[j] === k ? Math.sin(Math.PI * seg(t, h - .05, h + .25)) : 0), 0);
    fan(c, cx + fx * R, cy + fy * R, R * (.28 + .08 * bump), t * (2.5 + 4 * bump) + k, bump);
  });
  // mỗi pop: giọt vàng + bong bóng xanh bay tới cánh quạt, gặp nhau, bật thành tia sáng
  s.pops.forEach((h, j) => {
    const [fx, fy] = FANS[POPFAN[j]], X = cx + fx * R, Y = cy + fy * R, u = seg(t, h - .5, h);
    if (u > 0 && u < 1) {
      const e = ss(u);
      drop(c, lerp(X - R * .7, X - R * .18, e), lerp(Y - R * .4, Y - R * .06, e) - R * .14 * Math.sin(Math.PI * u), R * .15, 1);
      bubble(c, lerp(X + R * .65, X + R * .18, e), lerp(Y + R * .45, Y + R * .06, e) - R * .12 * Math.sin(Math.PI * u), R * .13, 1);
    }
    const q = seg(t, h, h + .55);
    if (q > 0 && q < 1) burst(c, X, Y, R * (.2 + .6 * eo(q)), 1 - q);
  });
  // bừng sáng: quầng lớn + tia
  const b = Math.sin(Math.PI * seg(t, s.bloom - .1, s.bloom + .9));
  if (b > .01) { for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * .5; capsule(c, cx + Math.cos(a) * R * .3, cy + Math.sin(a) * R * .3, cx + Math.cos(a) * R * (.8 + .5 * b), cy + Math.sin(a) * R * (.8 + .5 * b), R * .07 * b, `rgba(255,255,255,${.5 * b})`); } circle(c, cx, cy, R * .55 * b, `rgba(255,255,240,${.45 * b})`); }
}
export function bubble(c, x, y, r, a = 1) {
  if (a <= .02) return;
  circle(c, x, y, r, `rgba(88,201,255,${a})`); circle(c, x - r * .3, y - r * .32, r * .32, `rgba(255,255,255,${.85 * a})`);
}
export function drop(c, x, y, r, a = 1) {
  if (a <= .02) return;
  c.fillStyle = `rgba(255,195,43,${a})`; c.beginPath(); c.moveTo(x, y - r * 1.5); c.quadraticCurveTo(x + r * 1.05, y - r * .1, x, y + r); c.quadraticCurveTo(x - r * 1.05, y - r * .1, x, y - r * 1.5); c.fill();
  circle(c, x, y, r * .98, `rgba(255,195,43,${a})`); circle(c, x - r * .3, y - r * .25, r * .3, `rgba(255,248,231,${a})`);
}
// cánh quạt hồng có mặt cười (luciferase)
export function fan(c, x, y, r, rot, bump = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  for (let k = 0; k < 4; k++) { c.save(); c.rotate(k * Math.PI / 2); ell(c, r * .62, 0, r * .62, r * .34, 0, k % 2 ? N.enz : C.pink); c.restore(); }
  c.restore();
  circle(c, x, y, r * .5, N.enzD);
  circle(c, x - r * .17, y - r * .06, r * .09, C.white); circle(c, x + r * .17, y - r * .06, r * .09, C.white);
  circle(c, x - r * .17, y - r * .05, r * .05, C.ink); circle(c, x + r * .17, y - r * .05, r * .05, C.ink);
  c.strokeStyle = C.white; c.lineWidth = r * .07; c.lineCap = 'round'; c.beginPath(); c.arc(x, y + r * .08, r * (.14 + .06 * bump), .2, Math.PI - .2); c.stroke();
}
// tia sáng "pop": sao + vòng sáng + chấm bắn ra
export function burst(c, x, y, r, a) {
  if (a <= .01) return;
  circle(c, x, y, r * 1.5, `rgba(255,243,170,${.35 * a})`);
  c.strokeStyle = `rgba(255,255,255,${.9 * a})`; c.lineWidth = r * .12; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
  star(c, x, y, r * .8, C.lemon); star(c, x, y, r * .45, C.white);
  for (let i = 0; i < 6; i++) { const g = i / 6 * TAU + .3; circle(c, x + Math.cos(g) * r * 1.25, y + Math.sin(g) * r * 1.25, r * .1 * a, C.cream); }
}
/* ---------- nhiệt kế tí hon (toạ độ đang vẽ): (x, y) đáy bầu; s cỡ; lv mực đỏ 0..1; sh run lập cập ---------- */
export function thermometer(c, x, y, s, lv, sh = 0, face = 'cold') {
  c.save(); c.translate(x + Math.sin(sh * 60) * 4 * (sh > 0 ? 1 : 0), y);
  rrect(c, -s * .22 + 6, -s * 2.1 + 8, s * .44, s * 2.0, s * .22, 'rgba(30,27,58,.25)');
  rrect(c, -s * .22, -s * 2.1, s * .44, s * 2.0, s * .22, C.white); circle(c, 0, 0, s * .38, C.white);
  circle(c, 0, 0, s * .27, C.berry); rrect(c, -s * .09, -s * (.25 + 1.6 * lv), s * .18, s * (.25 + 1.6 * lv), s * .09, C.berry);
  for (let i = 0; i < 6; i++) capsule(c, s * .1, -s * (.45 + .26 * i), s * .2, -s * (.45 + .26 * i), s * .05, '#C9C3E8');
  // mặt: lạnh (run, răng va) hoặc bình thường
  const fy = -s * 1.55;
  circle(c, -s * .08, fy, s * .05, C.ink); circle(c, s * .08, fy, s * .05, C.ink);
  if (face === 'cold') { c.strokeStyle = C.ink; c.lineWidth = s * .03; c.beginPath(); for (let i = 0; i <= 6; i++) { const px = -s * .1 + i * s * .033, py = fy + s * .14 + (i % 2 ? -1 : 1) * s * .025; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); }
  else { c.strokeStyle = C.ink; c.lineWidth = s * .03; c.beginPath(); c.arc(0, fy + s * .1, s * .07, .2, Math.PI - .2); c.stroke(); }
  c.restore();
}
// tiền cảnh: bụi cỏ đọng sương và mấy hòn sỏi ở mép dưới khung (lấp nửa dưới cho khung có chiều sâu; không che nhân vật)
export function foreground(c, t) {
  for (const [x, y, s, ph] of [[300, 1420, 1.2, 0], [470, 1470, .9, 1], [860, 1430, 1.15, 2], [1010, 1390, .9, 3], [640, 1500, .8, 4]]) {
    const sw = Math.sin(t * 1.4 + ph) * 6;
    for (let k = -3; k <= 3; k++) poly(c, [[x + k * 22 * s - 12 * s, y], [x + k * 22 * s + 12 * s, y], [x + k * 30 * s + sw, y - (110 + 40 * hash(k + ph * 7)) * s]], k % 2 ? N.grassD : N.grass);
    for (let k = -2; k <= 2; k++) star(c, x + k * 34 * s + sw * .5, y - (100 + 30 * hash(k + ph)) * s, (6 + 3 * Math.sin(t * 2 + k + ph)) * s, N.frost);
  }
  for (const [x, y, r] of [[200, 1500, 34], [740, 1520, 28], [940, 1480, 30]]) { ell(c, x, y + 4, r * 1.2, r * .7, 0, N.pebbleD); ell(c, x - 3, y - 2, r, r * .62, 0, N.pebble); }
}
