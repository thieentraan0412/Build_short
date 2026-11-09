// Đạo cụ và bối cảnh của SHORT-007: vườn đêm tím đậm, trăng, đom đóm, kẹo dẻo, bong bóng nghĩ, dải mật mã.
// Trời đêm dùng tím đậm của kênh (C.night), không dùng đen: khung vẫn rực màu và có tương phản khi máy trôi (kế hoạch nâng cấp, ghi chú 007).
import { C, circle, ell, rrect, poly, capsule, path, TAU } from '/_shared/kit.js';
import { hash, lerp, clamp, seg, ss, eo, back } from '/core/lib.js';
import { star } from '/_shared/characters/face.js';
import { V } from '/_shared/characters/rig.js';
import { X, bugFace, leg, antenna, glassWing } from '/_shared/characters/parts.js';
import { BY } from '/_shared/characters/cast/index.js';
import { DOT_SPOTS } from '/_shared/characters/cast/dot.js';

export const N = {
  sky0: '#2A158C', sky1: '#5A36D6', hill0: '#4B2BB8', hill1: '#3A1F9C', far: '#2E7F9A',
  grass: '#1F9C88', grassD: '#167565', grassL: '#43D6A6', moss: '#2E9C62', mossD: '#1E7048', mossL: '#5AD690',
  moon: '#FFF3B8', moonD: '#F2DC86', glow: 'rgba(255,227,77,', web: 'rgba(255,248,231,.55)', sil: '#22126A',
};
// mặt đất (mô rêu) ở toạ độ cảnh
export const groundY = x => 1195 + .00012 * (x - 560) ** 2;
export const MOON = { x: 790, y: 430, r: 92 };

// trời, sao, trăng, đồi xa, đom đóm xa (toạ độ cảnh)
export function nightSky(c, t, o = {}) {
  const g = c.createLinearGradient(0, -400, 0, 1150); g.addColorStop(0, N.sky0); g.addColorStop(.75, C.night); g.addColorStop(1, N.sky1);
  c.fillStyle = g; c.fillRect(-1600, -1600, 4300, 3600);
  for (let i = 0; i < 80; i++) {
    const x = -500 + hash(i) * 2100, y = -300 + hash(i + 9) * 1180, tw = .55 + .45 * Math.sin(t * (1.5 + hash(i + 4) * 2) + i);
    if (i % 5 === 0) star(c, x, y, (5 + 5 * hash(i + 2)) * tw, C.cream); else circle(c, x, y, (1.6 + 2.6 * hash(i + 6)) * tw, C.cream);
  }
  // trăng: quầng, mặt, vài miệng hố
  if (!o.noMoon) {
    for (const [m, a] of [[2.1, .08], [1.55, .12]]) circle(c, MOON.x, MOON.y, MOON.r * m, `rgba(255,243,184,${a})`);
    circle(c, MOON.x, MOON.y, MOON.r, N.moon);
    for (const [dx, dy, r] of [[-30, -22, 18], [26, 18, 13], [-8, 36, 9], [34, -30, 7]]) circle(c, MOON.x + dx, MOON.y + dy, r, N.moonD);
  }
  if (o.rollo != null) rolloSil(c, o.rollo);
  // đồi xa, có viền sáng ánh trăng
  ell(c, 160, 1070, 760, 210, 0, N.hill0); ell(c, 1050, 1090, 800, 230, 0, N.hill1);
  c.strokeStyle = 'rgba(169,247,226,.35)'; c.lineWidth = 5; c.beginPath(); c.ellipse(160, 1070, 760, 210, 0, Math.PI * 1.08, Math.PI * 1.62); c.stroke();
  c.beginPath(); c.ellipse(1050, 1090, 800, 230, 0, Math.PI * 1.25, Math.PI * 1.75); c.stroke();
  // đom đóm xa: nháy chậm, mỗi con một pha, trôi nhẹ
  for (let i = 0; i < 26; i++) {
    const x = -200 + hash(i + 40) * 1500 + 18 * Math.sin(t * .7 + i), y = 760 + hash(i + 50) * 330 + 10 * Math.sin(t * .9 + i * 2);
    const on = Math.max(0, Math.sin(t * (1.6 + hash(i + 60)) + i * 1.7)) ** 3;
    if (on > .05) glowDot(c, x, y, 5 + 3 * hash(i), on * .8);
  }
}
// bóng Rollo lăn viên tròn ngang mặt trăng (trứng phục sinh); u 0..1
export function rolloSil(c, u) {
  if (u <= 0 || u >= 1) return;
  const x = lerp(MOON.x - 190, MOON.x + 170, u), y = MOON.y + 46, sp = u * 9;
  c.save(); c.translate(x, y); c.scale(1.25, 1.25); c.translate(-x, -y); c.fillStyle = N.sil; c.strokeStyle = N.sil; c.lineCap = 'round';
  circle(c, x + 34, y - 18, 30, N.sil);                                 // viên tròn (đi trước)
  c.strokeStyle = 'rgba(255,243,184,.25)'; c.lineWidth = 3; c.beginPath(); c.arc(x + 34, y - 18, 20, sp, sp + 1.6); c.stroke();
  c.fillStyle = N.sil; c.beginPath(); c.ellipse(x - 10, y - 14, 26, 16, -.5, 0, TAU); c.fill();   // thân chổng ngược, chân sau đẩy
  c.strokeStyle = N.sil; c.lineWidth = 5;
  for (let k = 0; k < 3; k++) { const a = sp + k * 2.1; c.beginPath(); c.moveTo(x - 10, y - 10); c.lineTo(x - 26 + 8 * Math.cos(a), y + 4 + 6 * Math.sin(a)); c.stroke(); }
  for (let k = 0; k < 2; k++) { c.beginPath(); c.moveTo(x + 2, y - 26); c.lineTo(x + 12 + 4 * Math.sin(sp + k * 3), y - 46); c.stroke(); }
  c.restore();
}
// đốm sáng có quầng (toạ độ đang vẽ); a 0..1
export function glowDot(c, x, y, r, a = 1) {
  if (a <= .01) return;
  circle(c, x, y, r * 4.2, N.glow + (.10 * a) + ')'); circle(c, x, y, r * 2.4, N.glow + (.22 * a) + ')');
  circle(c, x, y, r * (1 + .25 * a), a > .5 ? C.lemon : '#E9D46A'); circle(c, x - r * .25, y - r * .25, r * .4, `rgba(255,255,255,${.8 * a})`);
}
// quầng sáng lớn quanh đuôi (bùng sáng)
export function bigGlow(c, x, y, r, a = 1) {
  if (a <= .01) return;
  const g = c.createRadialGradient(x, y, r * .1, x, y, r);
  g.addColorStop(0, `rgba(255,236,120,${.55 * a})`); g.addColorStop(.45, `rgba(255,227,77,${.22 * a})`); g.addColorStop(1, 'rgba(255,227,77,0)');
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
}
// một con đom đóm nhỏ không mặt (đám đông, bạn đáp ở dưới cỏ); on 0..1, dir hướng mặt
export function tinyFly(c, x, y, s, on, o = {}) {
  const dir = o.dir ?? 1, wing = o.wing ?? 0;
  c.save(); c.translate(x, y); c.scale(dir, 1);
  if (on > .02) { circle(c, -s * .9, s * .05, s * 3.2, N.glow + (.12 * on) + ')'); circle(c, -s * .9, s * .05, s * 1.7, N.glow + (.25 * on) + ')'); }
  if (wing) for (const k of [-1, 1]) ell(c, -s * .1, -s * .55, s * .55, s * .22, k * (.5 + .4 * Math.sin(wing)), 'rgba(220,255,245,.55)');
  ell(c, 0, 0, s * .9, s * .55, 0, X.mintD || '#3FBF9F');
  ell(c, -s * .85, s * .05, s * .5, s * .45, 0, on > .3 ? C.lemon : '#CDBE6A');
  circle(c, s * .75, -s * .05, s * .42, C.mint); circle(c, s * .92, -s * .14, s * .14, C.ink);
  c.restore();
}
// đất: mô rêu, cỏ, nấm, cỏ ba lá (toạ độ cảnh); t để cỏ lay
export function garden(c, t, o = {}) {
  // cỏ xa
  for (let i = 0; i < 46; i++) { const gx = -260 + i * 36, h = 70 + hash(i + 3) * 90, sw = Math.sin(t * 1.3 + i) * 7; poly(c, [[gx - 11, 1130], [gx + 11, 1130], [gx + sw, 1130 - h]], i % 2 ? N.grass : N.grassD); }
  // mạng nhện đọng sương (nhà của Spindle) giữa hai cọng cỏ cao bên trái
  if (!o.noWeb) web(c, 150, 760, 120, t);
  // mô rêu
  c.fillStyle = N.mossD; c.beginPath(); c.moveTo(-1400, 1260); for (let x = -1400; x <= 2600; x += 40) c.lineTo(x, groundY(x) + 14); c.lineTo(2600, 3400); c.lineTo(-1400, 3400); c.closePath(); c.fill();
  c.fillStyle = N.moss; c.beginPath(); for (let x = -1400; x <= 2600; x += 40) c.lineTo(x, groundY(x)); c.lineTo(2600, groundY(2600) + 30); c.lineTo(-1400, groundY(-1400) + 30); c.closePath(); c.fill();
  c.strokeStyle = N.mossL; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); for (let x = -1400; x <= 2600; x += 40) c.lineTo(x, groundY(x) + 3); c.stroke();
  for (let i = 0; i < 30; i++) { const x = -300 + hash(i + 70) * 1700, y = groundY(x) + 60 + hash(i + 80) * 500; ell(c, x, y, 26 + 20 * hash(i), 10 + 6 * hash(i + 1), 0, i % 2 ? N.mossL : '#3DB574'); }
  // nấm (Chirp đậu trên cái to nhất)
  mushroom(c, 860, groundY(860), 1.0); mushroom(c, 990, groundY(990), .6); mushroom(c, 60, groundY(60), .7);
  // cỏ ba lá tiền cảnh hai bên
  clover(c, -40, groundY(-40) + 10, 1.4, t, 0); clover(c, 1120, groundY(1120) + 6, 1.3, t, 2);
}
export const SHROOM = { x: 860, top: () => groundY(860) - 150 };
export function mushroom(c, x, y, s) {
  rrect(c, x - 22 * s, y - 120 * s, 44 * s, 124 * s, 18 * s, C.cream);
  c.fillStyle = C.berry; c.beginPath(); c.ellipse(x, y - 118 * s, 96 * s, 54 * s, 0, Math.PI, TAU); c.closePath(); c.fill();
  ell(c, x, y - 118 * s, 96 * s, 12 * s, 0, C.berryD);
  for (const [dx, dy, r] of [[-46, -150, 13], [8, -160, 16], [50, -138, 10]]) circle(c, x + dx * s, y + dy * s, r * s, C.cream);
}
export function clover(c, x, y, s, t, ph) {
  const sw = Math.sin(t * 1.2 + ph) * .05;
  c.save(); c.translate(x, y); c.rotate(sw); c.scale(s, s);
  capsule(c, 0, 0, 6, -190, 12, N.grassD);
  for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + (k - 1) * 2.1; c.save(); c.translate(6, -190); c.rotate(a + Math.PI / 2); ell(c, 0, -46, 40, 50, 0, k === 1 ? N.grassL : N.grass); c.restore(); }
  c.restore();
}
// mạng nhện đọng sương
export function web(c, x, y, R, t) {
  capsule(c, x - R * 1.2, 1140, x - R * 1.05, y - R * 1.3, 9, N.grassD); capsule(c, x + R * 1.25, 1140, x + R * 1.1, y - R * 1.2, 9, N.grassD);
  c.strokeStyle = N.web; c.lineWidth = 2.5;
  const n = 9;
  for (let k = 0; k < n; k++) { const a = k / n * TAU; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * R, y + Math.sin(a) * R); c.stroke(); }
  for (let ring = 1; ring <= 4; ring++) { c.beginPath(); for (let k = 0; k <= n; k++) { const a = k / n * TAU, rr = R * ring / 4.4; k ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.stroke(); }
  for (let i = 0; i < 9; i++) {                                    // giọt sương lấp lánh lần lượt
    const a = hash(i + 90) * TAU, rr = R * (.3 + .6 * hash(i + 91)), dx = x + Math.cos(a) * rr, dy = y + Math.sin(a) * rr;
    circle(c, dx, dy, 5, 'rgba(169,247,226,.85)'); const tw = Math.max(0, Math.sin(t * 2.4 + i * 1.9)) ** 6; if (tw > .1) star(c, dx, dy, 14 * tw, C.cream);
  }
}
// kẹo dẻo xiên que: que từ (x0, y0) tới (x1, y1), kẹo ở đầu que. lit: được chiếu sáng (ánh vàng trên mặt kẹo, kẹo vẫn trắng)
export function marshmallow(c, x0, y0, x1, y1, s, lit = 0) {
  capsule(c, x0, y0, x1, y1, 7 * s, '#8A5A2B'); capsule(c, x0, y0, x1, y1, 3 * s, '#B57B45');
  const a = Math.atan2(y1 - y0, x1 - x0);
  c.save(); c.translate(x1, y1); c.rotate(a);
  rrect(c, -6 * s, -26 * s, 50 * s, 52 * s, 16 * s, C.white);
  rrect(c, -6 * s, 10 * s, 50 * s, 16 * s, 10 * s, '#F1E7F2');
  if (lit > .01) { c.globalAlpha = lit; rrect(c, 16 * s, -26 * s, 28 * s, 52 * s, 14 * s, 'rgba(255,233,140,.55)'); c.globalAlpha = 1; }
  c.restore();
}
// bong bóng nghĩ: đuôi bong bóng từ (fx, fy) lên (x, y); p 0..1 hiện; inside(c) vẽ trong bong bóng (toạ độ quanh 0,0)
export function thought(c, fx, fy, x, y, w, h, p, inside) {
  if (p <= 0) return;
  const s = back(p, 2);
  for (let k = 0; k < 3; k++) { const q = (k + 1) / 4; circle(c, lerp(fx, x, q), lerp(fy, y + h * .45, q), (8 + k * 6) * s, C.cream); }
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = 'rgba(30,27,58,.25)'; c.beginPath(); c.ellipse(8, 10, w / 2, h / 2, 0, 0, TAU); c.fill();
  for (const [dx, dy, r] of [[-w * .3, -h * .2, h * .38], [0, -h * .32, h * .42], [w * .3, -h * .18, h * .36], [-w * .22, h * .16, h * .34], [w * .24, h * .16, h * .34]]) circle(c, dx, dy, r, C.cream);
  ell(c, 0, 0, w / 2, h / 2, 0, C.cream);
  if (inside) inside(c);
  c.restore();
}
// một con ruồi hoạt hình (chỉ trong bong bóng nghĩ: câu đoán sai)
export function cartoonFly(c, x, y, s, t) {
  c.save(); c.translate(x, y + 4 * Math.sin(t * 14)); c.scale(s, s);
  for (const k of [-1, 1]) { c.save(); c.rotate(k * (.35 + .25 * Math.sin(t * 40))); ell(c, k * 18, -26, 26, 14, k * .5, 'rgba(126,220,255,.7)'); c.restore(); }
  ell(c, 0, 4, 30, 24, 0, '#6A6A7A'); for (let i = -1; i <= 1; i++) capsule(c, i * 12, 20, i * 18, 36, 4, C.ink);
  circle(c, -14, -8, 13, C.berry); circle(c, 14, -8, 13, C.berry); circle(c, -10, -12, 4, C.white); circle(c, 18, -12, 4, C.white);
  c.restore();
}
// dải mật mã: mỗi cú nháy ngắn là một chấm, nháy dài là một gạch; hiện ở thời điểm nháy (toạ độ khung)
export function codeStrip(c, t, x, y, code, long, a = 1) {
  if (a <= 0) return;
  const items = code.map((h, i) => ({ h, long: i === code.length - 1 && long })), w = 360;
  c.save(); c.globalAlpha = a;
  rrect(c, x - w / 2 + 6, y - 36, w, 72, 36, 'rgba(30,27,58,.35)'); rrect(c, x - w / 2, y - 42, w, 72, 36, 'rgba(30,27,58,.78)');
  let px = x - 120;
  items.forEach((it, i) => {
    if (i === 2) px += 40;                                          // nhịp nghỉ trong mẫu
    const p = back(seg(t, it.h, it.h + .2), 2.4), lit = Math.max(0, 1 - seg(t, it.h + (it.long ? .5 : .15), it.h + (it.long ? .9 : .5)));
    if (p > 0) { if (it.long) rrect(c, px - 12, y - 18, 84 * p, 36, 18, lit > .2 ? C.lemon : '#E9D46A'); else circle(c, px + 6, y, 18 * p, lit > .2 ? C.lemon : '#E9D46A'); }
    px += it.long ? 110 : 62;
  });
  c.restore();
}

/* ---------- Dot mở tấm cánh: bản sao của rig Dot (_shared/characters/cast/dot.js) có thêm hai nửa vòm cánh nâng lên và đôi cánh mỏng.
   Rig dùng chung chỉ khai báo pose.open mà chưa vẽ; tập này vẽ riêng để không đổi hình của các tập khác. id 'dot' để đo mặt. ---------- */
const spot = c => { c.fillStyle = C.ink; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); };
export const DOT_OPEN = {
  ...BY.dot,
  build(r, o = {}) {
    const P = { lift: 0, open: 0, ...(o.pose || {}) }, E = o.E || {}, L = P.lift, Y = y => y - L, op = P.open;
    if (op < .02) return BY.dot.build(r, o);
    const EC = [0, Y(-.6), -.12];
    // thân dưới cánh (mực) và đôi cánh mỏng
    r.ell([0, Y(-.52), -.2], [.5, .38, .6], C.ink, { bias: -.02 });
    for (const sd of [-1, 1]) glassWing(r, [sd * .15, Y(-.85), -.2], V.mul(V.norm([sd * .95, -.55, -.35]), 1.15 * op), V.mul([0, 0, -1], .42), { len: 1, wid: .4, bias: -.3 });
    // hai nửa vòm cánh nâng lên, xoay ra hai bên
    for (const sd of [-1, 1]) {
      const a = op * sd * .75, ctr = [sd * (.3 + op * .3), Y(-.66 - op * .28), -.12], R = [[Math.cos(a), -Math.sin(a), 0], [Math.sin(a), Math.cos(a), 0], [0, 0, 1]], ER = [.36, .54, .7];
      r.ell(ctr, ER, C.tang, { rot: R, bias: .01, shade: { col: X.tangD, k: .26 } });
      DOT_SPOTS.filter(([d]) => d[0] * sd > .1).forEach(([d, s]) => r.decal(ctr, ER, [d[0] * .4, d[1], d[2]], s, spot, { bias: .012 }));
    }
    const feet = [[-.42, 0, .4], [-.5, 0, 0], [-.42, 0, -.4], [.42, 0, .4], [.5, 0, 0], [.42, 0, -.4]];
    feet.forEach((f, i) => {
      const sd = i < 3 ? -1 : 1, j = i % 3, hip = [sd * .2, Y(-.24), [.3, .06, -.18][j]];
      const ft = V.add(f, [0, L > 0 ? -L * .7 : 0, 0]), knee = V.lerp(hip, ft, .5); knee[0] += sd * .1; knee[1] -= .06;
      leg(r, hip, knee, ft, .075, C.ink, { toeDir: [sd * .2, 0, 1], bias: -.05 });
    });
    const PC = [0, Y(-.5), .5];
    r.ell(PC, [.46, .3, .24], C.ink, { bias: .02 });
    for (const sd of [-1, 1]) r.decal(PC, [.46, .3, .24], [sd * .72, -.25, .64], .1, c => { c.fillStyle = C.cream; c.beginPath(); c.ellipse(0, 0, 1.3, .9, 0, 0, TAU); c.fill(); }, { bias: .021 });
    const H = [0, Y(-.5), .76];
    r.ball(H, .3, C.ink, { bias: .04 });
    bugFace(r, H, .3, E, { eyeA: .44, eyeEl: -.28, eyeR: .5, lid: C.ink, line: C.cream, cheekA: .82, cheekEl: .26, mouthEl: .5, mouthW: .26, mouthInk: C.cream, tongue: C.pink });
    for (const sd of [-1, 1]) antenna(r, [[sd * .1, Y(-.76), .9], [sd * .2, Y(-.98), 1.0], [sd * .3, Y(-1.08), 1.0]], .04, C.ink, { club: .055, bias: .05 });
  },
};
