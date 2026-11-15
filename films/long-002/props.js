// LONG-002 · bối cảnh và đạo cụ: bàn học của The Giant lúc nửa đêm (đèn bàn, cửa sổ trăng), trang Insects của Albie,
// sợi tơ bạc, sticker dệt bằng tơ, ba ô manh mối, dấu chân trong bụi tẩy, cánh giấy, thước đo chân "LEG-O-METER",
// Flutter lúc còn là sâu (nệm tơ, nhộng), con dấu CASE CLOSED. Đạo cụ có viền mực để đồng bộ với nhân vật v2.
import { C, circle, ell, capsule, rrect, poly, popText, subFont, clamp, lerp, seg, back, eo, TAU, star, ss, inked, badge, drawChar, BY, ex, blinkAt } from './lib16.js';

export const N = {                                   // bảng màu ban đêm (bàn học dưới đèn)
  wall: '#3A2C8C', wallS: '#4433A3', wallD: '#2B2070', sky: '#1F2A6B', skyL: '#2E3D8F', moon: '#FFF3C4',
  wood: '#D98A45', woodL: '#E9A262', woodD: '#B8652B', woodDD: '#8E4A1D', frame: '#C77A3A',
  lamp: '#2FB8A8', lampD: '#1F8F83', glow: 'rgba(255,214,120,', paper: '#FFF8E7', paperD: '#EBDDBC', line: '#BFD7F2',
  silk: '#F4F1FF', silkD: '#C9C2EA', dust: '#E9E4F2', dustD: '#BDB4D3', eraser: '#FFFFFF', sleeve: '#3CC8FF', tape: '#FFE34D',
};
export const DESK_Y = 760;                           // mặt bàn (điểm chân nhân vật trong cảnh rộng)

/* ================= bàn học ban đêm (cảnh rộng, toạ độ 1920×1080; máy quay đặt ở scenes.js) ================= */
// o.lamp 0..1 đèn bàn sáng; o.moon 0..1 ánh trăng (bẫy ban đêm); o.shadow: bóng 8 chân lướt trên tường (0..1)
export function deskRoom(c, t, o = {}) {
  const lamp = o.lamp ?? 1;
  c.fillStyle = N.wall; c.fillRect(-1200, -800, 4320, DESK_Y + 800);
  for (let x = -1200; x < 3200; x += 120) { c.fillStyle = N.wallS; c.fillRect(x, -800, 46, DESK_Y + 800); }   // giấy dán tường sọc
  // cửa sổ trăng (trái)
  const W = { x: 90, y: 70, w: 520, h: 420 };
  rrect(c, W.x - 26, W.y - 26, W.w + 52, W.h + 52, 30, N.frame);
  rrect(c, W.x, W.y, W.w, W.h, 16, N.sky);
  c.save(); c.beginPath(); c.roundRect(W.x, W.y, W.w, W.h, 16); c.clip();
  circle(c, W.x + 380, W.y + 120, 120, 'rgba(255,243,196,.12)'); circle(c, W.x + 380, W.y + 120, 66, N.moon); circle(c, W.x + 405, W.y + 105, 56, N.sky);
  for (let i = 0; i < 14; i++) { const sx = W.x + (i * 137) % W.w, sy = W.y + (i * 71) % W.h, tw = .5 + .5 * Math.sin(t * 2.2 + i * 1.7); star(c, sx, sy, 7 + 6 * tw, `rgba(255,248,231,${.5 + .5 * tw})`); }
  ell(c, W.x + 120, W.y + W.h + 10, 260, 90, 0, '#2A5A8A'); ell(c, W.x + 420, W.y + W.h + 30, 260, 110, 0, '#24507E');   // đồi xa
  c.restore();
  rrect(c, W.x + W.w / 2 - 12, W.y, 24, W.h, 6, N.frame); rrect(c, W.x, W.y + W.h / 2 - 12, W.w, 24, 6, N.frame);
  // ánh trăng rọi xuống bàn
  const mo = o.moon || 0; if (mo > 0) { c.fillStyle = `rgba(200,220,255,${.16 * mo})`; c.beginPath(); c.moveTo(W.x + 60, W.y + W.h); c.lineTo(W.x + W.w, W.y + W.h); c.lineTo(1500, 1100); c.lineTo(300, 1100); c.fill(); }
  // bóng 8 chân trên tường (vui: có nơ, vẫy chân)
  if (o.shadow > 0) shadowPuppet(c, lerp(700, 1350, o.shadow), 330, t, Math.sin(Math.PI * clamp(o.shadow)));
  // đèn bàn (phải): chân đế, cần, chao đèn
  const L = { x: 1700, y: DESK_Y, hx: 1520, hy: 250 };
  if (lamp > 0) { c.save(); c.globalAlpha = lamp; const g = c.createRadialGradient(L.hx - 120, DESK_Y + 20, 40, L.hx - 120, DESK_Y + 20, 900); g.addColorStop(0, N.glow + '.42)'); g.addColorStop(1, N.glow + '0)'); c.fillStyle = g; c.fillRect(-400, -400, 2800, 1900); c.restore(); }
  if (lamp > 0) { c.fillStyle = N.glow + (.2 * lamp) + ')'; c.beginPath(); c.moveTo(L.hx - 120, L.hy + 70); c.lineTo(L.hx + 60, L.hy + 70); c.lineTo(L.hx + 320, DESK_Y + 30); c.lineTo(L.hx - 760, DESK_Y + 30); c.fill(); }
  // mặt bàn
  rrect(c, -1200, DESK_Y - 30, 4320, 1200, 0, N.wood);
  for (let i = 0; i < 6; i++) capsule(c, -1200, DESK_Y + 40 + i * 70, 3100, DESK_Y + 48 + i * 70, 4, 'rgba(184,101,43,.35)');
  rrect(c, -1200, DESK_Y - 34, 4320, 14, 0, N.woodL);
  inked(c, cc => { cc.moveTo(L.x - 120, L.y); cc.ellipse(L.x, L.y, 120, 28, 0, Math.PI, 0); cc.lineTo(L.x + 120, L.y + 18); cc.ellipse(L.x, L.y + 18, 120, 28, 0, 0, Math.PI); cc.closePath(); }, N.lampD, 6);
  c.lineCap = 'round'; c.strokeStyle = C.ink; c.lineWidth = 30; c.beginPath(); c.moveTo(L.x, L.y - 10); c.lineTo(L.x + 40, 470); c.lineTo(L.hx + 40, L.hy + 30); c.stroke();
  c.strokeStyle = N.lamp; c.lineWidth = 20; c.stroke();
  circle(c, L.x + 40, 470, 22, C.ink); circle(c, L.x + 40, 470, 15, N.lamp);
  c.save(); c.translate(L.hx, L.hy); c.rotate(-.35);
  inked(c, cc => { cc.moveTo(-50, -70); cc.lineTo(60, -70); cc.lineTo(170, 70); cc.lineTo(-160, 70); cc.closePath(); }, N.lamp, 7);
  ell(c, 5, 70, 165, 22, 0, lamp > .5 ? '#FFF3B0' : '#8E8AB8'); c.restore();
  if (o.items !== false) deskItems(c, t, o);
}
// đồ trên bàn: hũ bút (trái), cục tẩy + vụn tẩy, cuộn băng dính, kéo (gài trước cho cánh giấy), thước
export const CUP = { x: 420, y: DESK_Y, w: 190, h: 270 }, ERASER = { x: 1270, y: DESK_Y }, TAPE = { x: 1520, y: DESK_Y };
export function deskItems(c, t, o = {}) {
  // hũ bút
  const P = CUP;
  [[-50, C.lemon, -.12], [0, C.mint, .02], [46, C.sky, .14]].forEach(([dx, col, a]) => { c.save(); c.translate(P.x + dx, P.y - P.h + 40); c.rotate(a); inked(c, cc => cc.roundRect(-16, -170, 32, 210, 8), col, 5); inked(c, cc => { cc.moveTo(-16, -170); cc.lineTo(0, -214); cc.lineTo(16, -170); cc.closePath(); }, N.woodL, 5); circle(c, 0, -206, 6, C.ink); c.restore(); });
  inked(c, cc => { cc.moveTo(P.x - P.w / 2, P.y - P.h); cc.lineTo(P.x + P.w / 2, P.y - P.h); cc.lineTo(P.x + P.w / 2 - 12, P.y); cc.lineTo(P.x - P.w / 2 + 12, P.y); cc.closePath(); }, C.berry, 7);
  rrect(c, P.x - P.w / 2 + 20, P.y - P.h + 40, 26, P.h - 70, 13, 'rgba(255,255,255,.25)');
  ell(c, P.x, P.y - P.h, P.w / 2, 18, 0, C.berryD);
  if (o.cupPeek) o.cupPeek(c);                                   // ai đó nấp trong hũ bút (bẫy)
  // thước nằm
  if (o.ruler !== false) { inked(c, cc => cc.roundRect(80, DESK_Y + 120, 640, 70, 10), C.lemon, 6); for (let i = 0; i < 16; i++) capsule(c, 110 + i * 38, DESK_Y + 124, 110 + i * 38, DESK_Y + 124 + (i % 2 ? 22 : 36), 4, C.ink); }
  // cục tẩy trắng bọc giấy xanh, vụn tẩy
  const E = ERASER;
  if (o.dust !== false) for (let i = 0; i < 26; i++) { const dx = ((i * 97) % 300) - 110, dy = ((i * 53) % 60) + 14; ell(c, E.x + dx, E.y + dy, 9 + (i % 3) * 4, 6 + (i % 2) * 3, i, i % 3 ? N.dust : N.dustD); }
  inked(c, cc => cc.roundRect(E.x - 120, E.y - 92, 240, 96, 18), N.eraser, 6);
  inked(c, cc => cc.roundRect(E.x - 10, E.y - 96, 140, 104, 10), N.sleeve, 6);
  popText(c, 'ERASE', E.x + 60, E.y - 30, 30, C.cream, null, -1, 0, { font: subFont, read: false });
  // cuộn băng dính (gài trước cho cánh giấy) và cây kéo đang đóng
  const T = TAPE;
  inked(c, cc => cc.ellipse(T.x, T.y - 58, 64, 64, 0, 0, TAU), 'rgba(255,227,77,.85)', 6);
  inked(c, cc => cc.ellipse(T.x, T.y - 58, 32, 32, 0, 0, TAU), N.wall, 5);
  if (o.tapePeek) o.tapePeek(c, T.x, T.y - 58);
  c.save(); c.translate(1520, DESK_Y + 150); c.rotate(.1);
  inked(c, cc => { cc.moveTo(0, -10); cc.lineTo(210, -4); cc.lineTo(210, 4); cc.lineTo(0, 10); cc.closePath(); }, '#CFD6E6', 5);
  inked(c, cc => cc.ellipse(-40, -18, 38, 24, -.2, 0, TAU), C.berry, 6); inked(c, cc => cc.ellipse(-40, 22, 38, 24, .2, 0, TAU), C.berry, 6);
  ell(c, -40, -18, 18, 10, -.2, N.wood); ell(c, -40, 22, 18, 10, .2, N.wood); circle(c, 8, 0, 7, C.ink);
  c.restore();
}
// bóng 8 chân dễ thương trên tường (đèn bàn chiếu): thân tròn, nơ, chân vẫy
function shadowPuppet(c, x, y, t, a) {
  c.save(); c.globalAlpha = .55 * a; c.fillStyle = '#1C1450';
  c.beginPath(); c.ellipse(x, y, 70, 60, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(x + 70, y + 10, 42, 38, 0, 0, TAU); c.fill();
  c.strokeStyle = '#1C1450'; c.lineWidth = 12; c.lineCap = 'round';
  for (let i = 0; i < 8; i++) { const sd = i < 4 ? -1 : 1, j = i % 4, a0 = .3 + j * .45, w = Math.sin(t * 9 + i) * .15; c.beginPath(); c.moveTo(x + 20, y + 10); c.quadraticCurveTo(x + 20 + Math.cos(a0 + w) * 90 * sd, y - 60, x + 20 + Math.cos(a0 + w) * 150 * sd, y + 80); c.stroke(); }
  c.beginPath(); c.moveTo(x + 50, y - 50); c.lineTo(x + 20, y - 80); c.lineTo(x + 20, y - 30); c.closePath(); c.moveTo(x + 50, y - 50); c.lineTo(x + 84, y - 84); c.lineTo(x + 86, y - 32); c.closePath(); c.fill();   // nơ
  c.restore();
}

/* ================= trang sổ mở (bên trong Albie): trang INSECTS ================= */
export const PAGE = { x: 150, y: 70, w: 1620, h: 860 };
export const GUT = PAGE.x + PAGE.w / 2;
// chỗ các sticker trên trang (toạ độ trang mở 1920×1080)
export const SLOTS = [
  { id: 'waggle', x: 420, y: 470 }, { id: 'flutter', x: 680, y: 400 }, { id: 'chirp', x: 450, y: 730 }, { id: 'crumb', x: 720, y: 690 },
  { id: 'rollo', x: 1130, y: 390 }, { id: 'dot', x: 1360, y: 470 }, { id: 'silk', x: 1220, y: 690 },
];
export const SILK_SLOT = SLOTS.find(s => s.id === 'silk');
export function bookSpread(c, t, o = {}) {
  c.fillStyle = N.woodD; c.fillRect(-400, -400, 2800, 1900);
  for (let i = 0; i < 14; i++) capsule(c, -400, i * 90 - 40, 2400, i * 90 - 30, 5, 'rgba(142,74,29,.4)');
  
  inked(c, cc => cc.roundRect(PAGE.x - 40, PAGE.y - 34, PAGE.w + 80, PAGE.h + 78, 40), C.grape, 7);
  [C.sky, C.lemon, C.mint, C.pink].forEach((col, i) => inked(c, cc => cc.roundRect(PAGE.x + 240 + i * 300, PAGE.y - 72, 150, 96, 26), col, 6));
  inked(c, cc => cc.roundRect(PAGE.x - 40, PAGE.y - 34, PAGE.w + 80, PAGE.h + 78, 40), C.grape, 7);
  rrect(c, PAGE.x, PAGE.y, PAGE.w, PAGE.h, 24, N.paper);
  rrect(c, GUT - 8, PAGE.y, 16, PAGE.h, 8, N.paperD);
  for (let i = 0; i < 11; i++) { capsule(c, PAGE.x + 40, PAGE.y + 160 + i * 64, GUT - 50, PAGE.y + 160 + i * 64, 3, 'rgba(191,215,242,.6)'); capsule(c, GUT + 50, PAGE.y + 160 + i * 64, PAGE.x + PAGE.w - 40, PAGE.y + 160 + i * 64, 3, 'rgba(191,215,242,.6)'); }
  if (o.title !== false) {
    popText(c, o.title || 'INSECTS', 560, PAGE.y + 118, 92, C.grape, C.lemon, -1, 0, { read: !o.noRead });
    sixLegIcon(c, 840, PAGE.y + 86, 34);
    popText(c, o.title2 || 'six legs only!', 1350, PAGE.y + 110, 46, C.berry, null, -1, 0, { font: subFont, read: !o.noRead });
  }
  if (o.stickers !== false) for (const s of SLOTS) {
    if (s.id === 'silk') { if (o.silk !== false) silkSticker(c, s.x + (o.silkDx || 0), s.y, 112, t, { wiggle: o.wiggle || 0, glow: o.silkGlow || 0 }); continue; }
    if (o.skip && o.skip.includes(s.id)) continue;
    charSticker(c, s.id, s.x, s.y, 104, t, (s.x * .37) % .3 - .15);
  }
  if (o.extra) o.extra(c);
  if (o.night) { const g = c.createRadialGradient(1100, 600, 300, 1100, 600, 1300); g.addColorStop(0, 'rgba(60,70,170,0)'); g.addColorStop(1, 'rgba(30,27,90,.32)'); c.fillStyle = g; c.fillRect(-400, -400, 2800, 1900); }
}
export function sixLegIcon(c, x, y, s) {                           // biểu tượng 6 chân nhỏ cạnh chữ
  ell(c, x, y, s * .9, s * .55, 0, C.grape);
  for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) capsule(c, x + (i - 1) * s * .5, y + s * .3, x + (i - 1) * s * .7 + sd * 0, y + s * 1.05, s * .18, C.grape);
}
const STK_COL = { waggle: C.lemon, flutter: C.mint, chirp: C.skyL, crumb: C.pink, rollo: C.lime, dot: C.mangoL };
export function charSticker(c, id, x, y, r, t, rot = 0) {
  badge(c, x, y, r, STK_COL[id] || C.cream, cc => {
    const CH = BY[id], k = r * 1.35 / CH.h * (id === 'chirp' || id === 'rollo' ? .78 : id === 'crumb' ? .9 : 1);
    drawChar(cc, CH, { x: 0, y: r * .62, k, yaw: id === 'chirp' ? 1.1 : id === 'rollo' ? -1.2 : .45, showFx: false, expr: ex(CH, 'happy', { blink: blinkAt(t, x * .001) }), pose: id === 'waggle' ? { lift: .1 } : {} });
  }, rot);
  c.lineWidth = 6; c.strokeStyle = C.ink; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
  c.lineWidth = 4; c.strokeStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.arc(x, y, r - 9, -2.6, -1.6); c.stroke();
}
// sticker dệt bằng tơ: chân dung Spindle bằng sợi bạc trên nền tím oải hương; wiggle 0..1 tám chân ngọ nguậy; glow lấp lánh
// 8 chân tách rời (gối vồng lên, bàn chân xoè), đếm được ở cỡ nhỏ. SILK_LEGS: [gối, bàn chân] của chân bên phải, đơn vị r; bên trái lấy đối xứng
export const SILK_LEGS = [[[.30, -.46], [.50, -.74]], [[.48, -.30], [.84, -.30]], [[.48, -.02], [.84, .16]], [[.34, .24], [.56, .66]]];
export function silkSticker(c, x, y, r, t, o = {}) {
  c.save(); c.translate(x, y); c.rotate(.08 + (o.wiggle || 0) * .06 * Math.sin(t * 14)); c.scale(o.s || 1, o.s || 1);
  if (o.glow) { circle(c, 0, 0, r * (1.25 + .08 * Math.sin(t * 6)), `rgba(244,241,255,${.35 * o.glow})`); }
  circle(c, 7, 9, r, 'rgba(30,27,58,.2)'); circle(c, 0, 0, r, '#9A86E6');
  c.save(); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.clip();
  c.strokeStyle = 'rgba(214,206,250,.55)'; c.lineWidth = 2.5;            // mạng tơ nền
  for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + .2; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * r, Math.sin(a) * r); c.stroke(); }
  for (let k = 2; k < 5; k++) { c.beginPath(); for (let i = 0; i <= 8; i++) { const a = i * TAU / 8 + .2, rr = r * k / 5; i ? c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : c.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.stroke(); }
  const wig = o.wiggle || 0; c.lineCap = 'round'; c.lineJoin = 'round';
  for (const [w, col] of [[r * .11, C.grape], [r * .06, '#FFFFFF']]) {      // chân: viền tím rồi lõi trắng
    c.strokeStyle = col; c.lineWidth = w;
    for (const sd of [-1, 1]) SILK_LEGS.forEach(([kn, ft], j) => { const wv = Math.sin(t * 12 + j * 1.3 + sd) * .06 * wig;
      c.beginPath(); c.moveTo(sd * r * .1, -r * .1); c.lineTo(sd * r * kn[0], r * (kn[1] - wv)); c.lineTo(sd * r * ft[0], r * (ft[1] + wv)); c.stroke(); });
  }
  c.fillStyle = '#FFFFFF'; c.strokeStyle = C.grape; c.lineWidth = r * .04;
  c.beginPath(); c.ellipse(0, r * .26, r * .25, r * .27, 0, 0, TAU); c.fill(); c.stroke();             // bụng
  c.beginPath(); c.ellipse(0, -r * .12, r * .2, r * .17, 0, 0, TAU); c.fill(); c.stroke();             // đầu-ngực
  for (const [ex_, ey, er] of [[-.06, -.13, .05], [.06, -.13, .05], [-.15, -.1, .028], [.15, -.1, .028], [-.04, -.24, .024], [.04, -.24, .024], [-.11, -.21, .02], [.11, -.21, .02]]) circle(c, ex_ * r, ey * r, er * r, C.grape);
  c.strokeStyle = C.grape; c.lineWidth = r * .028; c.beginPath(); c.arc(0, -r * .06, r * .05, .3, Math.PI - .3); c.stroke();
  for (const [dx, dy] of [[-.12, .2], [.1, .32], [0, .12]]) circle(c, dx * r, dy * r, r * .04, '#C9BDF5');
  c.restore();
  c.lineWidth = 6; c.strokeStyle = C.ink; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke();
  c.lineWidth = 3; c.strokeStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(0, 0, r - 8, -2.6, -1.6); c.stroke();
  c.restore();
  if (o.glow) for (let i = 0; i < 4; i++) { const a = t * 1.6 + i * TAU / 4; star(c, x + Math.cos(a) * r * 1.18, y + Math.sin(a) * r * 1.18, 10 + 6 * Math.sin(t * 5 + i), N.silk); }
}
// sợi tơ bạc giăng qua trang: đường võng, lấp lánh chạy dọc theo sợi (u0..u1: phần đã giăng); twang: rung khi bị gảy
export function silkLine(c, a, b, t, o = {}) {
  const sag = o.sag ?? 60, tw = o.twang ? Math.sin(t * 60) * 14 * o.twang : 0, u1 = o.u ?? 1;
  const pt = u => { const x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) + Math.sin(Math.PI * u) * (sag + tw); return [x, y]; };
  c.lineCap = 'round';
  for (const [w, col] of [[o.w ? o.w + 5 : 10, 'rgba(30,27,58,.35)'], [o.w || 5, N.silk]]) {
    c.strokeStyle = col; c.lineWidth = w; c.beginPath();
    for (let i = 0; i <= 40; i++) { const u = i / 40 * u1, p = pt(u); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }
    c.stroke();
  }
  if (o.glint !== false) for (let i = 0; i < 3; i++) { const u = ((t * .35 + i / 3) % 1) * u1, p = pt(u); star(c, p[0], p[1] - 2, 9 + 5 * Math.sin(t * 7 + i), N.silk); }
  return pt;
}

/* ================= ba ô manh mối (vòng mở của phim): kính lúp nhỏ "1 2 3", lấp dần ================= */
export function clueSlots(c, t, fill, o = {}) {                   // fill = [t1, t2, t3] lúc mỗi ô được lấp (Infinity: chưa)
  const a = o.a ?? 1; if (a <= 0) return;
  const s0 = back(a, 1.8);
  c.save(); c.translate(960, 78); c.scale(s0, s0); rrect(c, -265, -62, 530, 124, 62, 'rgba(30,27,58,.62)'); c.restore();
  for (let i = 0; i < 3; i++) {
    const x = 790 + i * 170, y = 78, on = t >= fill[i], p = on ? back(seg(t, fill[i], fill[i] + .35), 2.6) : 0;
    c.save(); c.translate(x, y); c.scale(s0 * .82, s0 * .82);
    c.save(); c.rotate(.7); inked(c, cc => cc.roundRect(-11, 44, 22, 40, 10), C.berry, 5); c.restore();
    inked(c, cc => cc.arc(0, 0, 54, 0, TAU), C.berry, 6);
    circle(c, 0, 0, 42, on ? C.cream : 'rgba(255,248,231,.55)');
    if (!on) popText(c, String(i + 1), 0, 22, 62, 'rgba(90,51,214,.55)', null, -1, 0, { font: subFont, read: false });
    else { c.save(); c.scale(p, p); clueIcon(c, i, 0, 0, 36, t); c.restore(); }
    c.restore();
  }
}
export function clueIcon(c, i, x, y, s, t = 0) {
  c.save(); c.translate(x, y);
  if (i === 0) { c.lineCap = 'round'; c.strokeStyle = C.ink; c.lineWidth = s * .26; c.beginPath(); c.moveTo(-s * .9, -s * .3); c.quadraticCurveTo(0, s * .7, s * .9, -s * .1); c.stroke(); c.strokeStyle = N.silkD; c.lineWidth = s * .14; c.stroke(); star(c, s * .1, s * .14, s * .32, C.lemon); }
  if (i === 1) for (let k = 0; k < 8; k++) ell(c, (k % 4 - 1.5) * s * .42, (k < 4 ? -1 : 1) * s * .32, s * .15, s * .2, 0, C.grape);
  if (i === 2) { c.rotate(-.3); paperWingShape(c, 0, 0, s * 1.5, .0); }
  c.restore();
}

/* ================= dấu chân trong bụi tẩy (nhìn từ trên xuống) ================= */
// một bước = 8 dấu (4 mỗi bên). steps: số bước; lit[i]: lúc dấu thứ i sáng lên (đếm)
export function dustPatch(c, x, y, w, h, t) {
  for (let i = 0; i < 90; i++) { const dx = ((i * 137) % w) - w / 2, dy = ((i * 89) % h) - h / 2, r = 14 + (i % 5) * 6; ell(c, x + dx, y + dy, r, r * .8, i, i % 4 ? N.dust : N.dustD); }
}
export const PRINT8 = [[-70, -60], [-90, -20], [-90, 22], [-70, 62], [70, -60], [90, -20], [90, 22], [70, 62]];
export function footprints(c, x, y, s, t, o = {}) {
  const n = o.n ?? 8, pts = (o.pts || PRINT8).slice(0, n);
  pts.forEach(([dx, dy], i) => {
    const lit = o.lit ? clamp(seg(t, o.lit[i], o.lit[i] + .15)) : 0, px = x + dx * s, py = y + dy * s;
    if (lit > 0) circle(c, px, py, 30 * s * (1 + .3 * lit), `rgba(255,227,77,${.55 * lit})`);
    ell(c, px, py, 13 * s, 17 * s, dx > 0 ? .4 : -.4, '#9C93B8'); ell(c, px + 2 * s, py - 3 * s, 9 * s, 12 * s, dx > 0 ? .4 : -.4, '#7C7298');
  });
}

/* ================= cánh giấy (manh mối 3): cắt bằng kéo, mép răng cưa, nét bút chì, băng dính ================= */
export function paperWingShape(c, x, y, s, flap = 0, o = {}) {
  c.save(); c.translate(x, y); c.scale(s / 100, s / 100 * (1 - .35 * flap));
  const zig = [];
  for (let i = 0; i <= 24; i++) { const a = -2.6 + i / 24 * 3.5, r = (i % 2 ? 92 : 100) * (1 - .25 * Math.max(0, Math.sin(a * 2))); zig.push([Math.cos(a) * r * 1.05, Math.sin(a) * r * .8]); }
  inked(c, cc => { zig.forEach((p, i) => i ? cc.lineTo(p[0], p[1]) : cc.moveTo(p[0], p[1])); cc.closePath(); }, '#FFFDF4', 6);
  if (o.grain) { c.save(); c.beginPath(); zig.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.clip(); c.strokeStyle = 'rgba(201,189,160,.55)'; c.lineWidth = 1.2; for (let i = 0; i < 24; i++) { c.beginPath(); c.moveTo(-120 + i * 10, -100); c.lineTo(-130 + i * 10 + 14 * Math.sin(i), 100); c.stroke(); } c.restore(); }
  c.strokeStyle = 'rgba(30,27,58,.45)'; c.lineWidth = 3; c.setLineDash([10, 8]); c.beginPath(); c.ellipse(20, -20, 48, 34, -.4, 0, TAU); c.stroke(); c.setLineDash([]);   // nét bút chì
  circle(c, 30, -24, 14, 'rgba(255,195,43,.7)'); circle(c, -10, -46, 9, 'rgba(255,122,47,.6)');                                             // tô màu vụng
  if (o.tape !== false) { c.save(); c.rotate(.5); rrect(c, -34, -16, 68, 32, 4, 'rgba(255,227,77,.55)'); c.strokeStyle = 'rgba(184,92,18,.5)'; c.lineWidth = 2; c.strokeRect(-34, -16, 68, 32); c.restore(); }
  c.restore();
}

/* ================= LEG-O-METER: thước đo chiều cao hoá thành thước đo chân (hàng nghi phạm) ================= */
export const METER = { x0: 140, x1: 1840, y0: DESK_Y - 20, step: 66 };   // vạch 0 ở chân, mỗi vạch một chân
export function legOMeter(c, t, o = {}) {
  c.fillStyle = N.wall; c.fillRect(-400, -400, 2800, 1900);
  inked(c, cc => cc.roundRect(METER.x0 - 30, 40, METER.x1 - METER.x0 + 60, METER.y0 - 20, 30), N.paper, 7);
  for (let n = 1; n <= 8; n++) {
    const y = METER.y0 - n * METER.step, bold = n % 2 === 0;
    capsule(c, METER.x0 + 70, y, METER.x1 - 70, y, bold ? 6 : 3, bold ? 'rgba(90,51,214,.55)' : 'rgba(90,51,214,.25)');
    if (bold) { popText(c, String(n), METER.x0 + 30, y + 18, 50, C.grape, null, -1, 0, { font: subFont, read: false }); popText(c, String(n), METER.x1 - 30, y + 18, 50, C.grape, null, -1, 0, { font: subFont, read: false }); }
  }
  const y6 = METER.y0 - 6 * METER.step; capsule(c, METER.x0 + 70, y6, METER.x1 - 70, y6, 10, 'rgba(34,184,102,.75)');   // vạch 6: côn trùng
  popText(c, 'LEG-O-METER', 960, 112, 64, C.berry, C.lemon, -1, 0, { read: o.read !== false });
  // sàn
  rrect(c, -400, DESK_Y - 30, 2800, 1200, 0, N.wood); rrect(c, -400, DESK_Y - 34, 2800, 14, 0, N.woodL);
  for (let i = 0; i < 5; i++) capsule(c, -400, DESK_Y + 40 + i * 70, 2400, DESK_Y + 48 + i * 70, 4, 'rgba(184,101,43,.35)');
  // vệt đèn rọi
  const g = c.createRadialGradient(960, DESK_Y, 50, 960, DESK_Y, 1000); g.addColorStop(0, N.glow + '.25)'); g.addColorStop(1, N.glow + '0)'); c.fillStyle = g; c.fillRect(-400, -400, 2800, 1900);
}
// cột đo của một nghi phạm: dâng tới số chân n (có thể vọt), bảng số trên đỉnh
export function meterBar(c, x, n, t, t0, o = {}) {
  if (t < t0) return;
  const u = eo(seg(t, t0, t0 + .45)), h = n * METER.step * u, y = METER.y0 - h;
  c.save(); c.globalAlpha = .9;
  inked(c, cc => cc.roundRect(x - 26, y, 52, h, 18), o.col || C.mint, 5);
  c.restore();
  const p = back(seg(t, t0 + .3, t0 + .6), 2.6);
  if (p > 0) { c.save(); c.translate(x, y - 44); c.scale(p, p); inked(c, cc => cc.arc(0, 0, 40, 0, TAU), o.col || C.mint, 6); popText(c, String(o.label ?? n), 0, 18, 54, C.ink, null, -1, 0, { font: subFont, read: false }); c.restore(); }
}

/* ================= Flutter lúc còn là sâu (ký ức "Baby pictures") ================= */
// sâu tím đốm vàng, chân giả cam; munch 0..1 nhai; curl 0..1 cong chữ J (treo); s = bề dài thân
export function babyFlutter(c, x, y, s, t, o = {}) {
  const n = 7, curl = o.curl || 0, munch = o.munch || 0;
  const seg_ = i => {                                               // tâm từng đốt: thẳng (bò) → cong chữ J (treo đầu xuống)
    const u = i / (n - 1), sx = x - s * .5 + u * s, sy = y - Math.abs(Math.sin(t * 5 + i * .7)) * s * .03 * (1 - curl);
    const a = -Math.PI / 2 + u * Math.PI * .9, jx = x + Math.cos(a) * s * .32 * u, jy = y - s * .5 + u * s * .85;
    return [lerp(sx, jx, curl), lerp(sy, jy, curl)];
  };
  const P = Array.from({ length: n }, (_, i) => seg_(i));
  for (let i = 0; i < n; i++) { if (i > 0 && i < n - 1) { const [px, py] = P[i]; inked(c, cc => cc.ellipse(px, py + s * .12 * (1 - curl), s * .05, s * .06, 0, 0, TAU), C.tang, 4); } }
  for (let i = 0; i < n - 1; i++) { const [px, py] = P[i]; inked(c, cc => cc.arc(px, py, s * .105, 0, TAU), i % 2 ? '#6A3BD6' : '#7A4BE6', 5); circle(c, px - s * .02, py - s * .05, s * .025, C.lemon); }
  // đầu
  const [hx, hy] = P[n - 1], hr = s * .14;
  inked(c, cc => cc.arc(hx, hy, hr, 0, TAU), C.night, 6);
  for (const sd of [-1, 1]) { capsule(c, hx + sd * hr * .35, hy - hr * .8, hx + sd * hr * .6, hy - hr * 1.5, s * .025, C.ink); circle(c, hx + sd * hr * .6, hy - hr * 1.5, s * .03, C.lemon); }
  for (const sd of [-1, 1]) { const ex_ = hx + sd * hr * .42 + hr * .15, ey = hy - hr * .15; circle(c, ex_, ey, hr * .32, '#FFFFFF'); c.lineWidth = 3; c.strokeStyle = C.ink; c.beginPath(); c.arc(ex_, ey, hr * .32, 0, TAU); c.stroke(); circle(c, ex_ + hr * .06, ey + hr * .04, hr * .17, C.ink); circle(c, ex_, ey - hr * .06, hr * .07, '#FFFFFF'); }
  c.strokeStyle = C.ink; c.lineWidth = 4; c.beginPath(); c.arc(hx + hr * .15, hy + hr * .35, hr * (.22 + .08 * munch * Math.abs(Math.sin(t * 14))), .2, Math.PI - .2); c.stroke();
  circle(c, hx - hr * .5, hy + hr * .25, hr * .14, 'rgba(255,156,194,.8)'); circle(c, hx + hr * .75, hy + hr * .25, hr * .14, 'rgba(255,156,194,.8)');
  return P;
}
export function twigLeaf(c, x, y, s, bite = 0) {                  // cành ngang có lá (lá bị gặm một vết)
  c.lineCap = 'round'; c.strokeStyle = C.ink; c.lineWidth = s * .07 + 6; c.beginPath(); c.moveTo(x - s, y); c.quadraticCurveTo(x, y - s * .08, x + s, y + s * .04); c.stroke();
  c.strokeStyle = N.woodD; c.lineWidth = s * .07; c.stroke();
  c.save(); c.translate(x + s * .4, y + s * .03); c.rotate(.5);
  inked(c, cc => { cc.moveTo(0, 0); cc.quadraticCurveTo(s * .3, -s * .25, s * .7, 0); cc.quadraticCurveTo(s * .3, s * .25, 0, 0); }, C.leaf, 5);
  if (bite > 0) { c.fillStyle = N.paper; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(s * (.62 - i * .08), -s * .05 + i * s * .04, s * .06 * bite, 0, TAU); c.fill(); } }
  c.restore();
}
export function silkPad(c, x, y, s, p) {                         // nệm tơ nhỏ: các chấm trắng dệt dần thành miếng đệm
  if (p <= 0) return;
  for (let i = 0; i < 14; i++) { const q = clamp(p * 14 - i); if (q <= 0) continue; const a = i * 2.4, r = s * (.15 + .5 * ((i * .37) % 1)); circle(c, x + Math.cos(a) * r, y + Math.sin(a) * r * .45, s * .16 * q, '#FFFFFF'); }
  if (p > .6) { c.lineWidth = 3; c.strokeStyle = N.silkD; c.beginPath(); c.ellipse(x, y, s * .6, s * .28, 0, 0, TAU); c.stroke(); }
}
export function chrysalis(c, x, y, s, t, open = 0) {             // nhộng treo dưới nệm tơ (xanh bạc hà, chấm vàng)
  c.save(); c.translate(x, y); c.rotate(Math.sin(t * 1.5) * .05);
  capsule(c, 0, -s * .1, 0, s * .1, s * .06, '#FFFFFF');
  inked(c, cc => { cc.moveTo(0, s * .08); cc.bezierCurveTo(s * .42, s * .2, s * .38, s * .95, 0, s * 1.1); cc.bezierCurveTo(-s * .38, s * .95, -s * .42, s * .2, 0, s * .08); }, C.mint, 6);
  for (let i = 0; i < 5; i++) circle(c, (i - 2) * s * .08, s * .4, s * .035, C.mango);
  capsule(c, -s * .18, s * .62, s * .18, s * .7, s * .04, 'rgba(34,184,102,.45)');
  if (open > 0) { c.globalAlpha = open; sparklesRing(c, 0, s * .55, s * .7, t); }
  c.restore();
}
function sparklesRing(c, x, y, r, t) { for (let i = 0; i < 6; i++) { const a = t * 2 + i * TAU / 6; star(c, x + Math.cos(a) * r, y + Math.sin(a) * r, 12, C.lemon); } }
// khung ảnh kỷ niệm (polaroid) trên trang "Baby pictures"
export function photoFrame(c, x, y, w, h, rot, draw, label) {
  c.save(); c.translate(x, y); c.rotate(rot);
  rrect(c, -w / 2 + 10, -h / 2 + 14, w, h + 70, 10, 'rgba(30,27,58,.25)');
  inked(c, cc => cc.roundRect(-w / 2, -h / 2, w, h + 70, 10), '#FFFFFF', 6);
  rrect(c, -w / 2 + 24, -h / 2 + 24, w - 48, h - 30, 6, C.skyL);
  c.save(); c.beginPath(); c.roundRect(-w / 2 + 24, -h / 2 + 24, w - 48, h - 30, 6); c.clip(); c.translate(-w / 2 + 24, -h / 2 + 24); draw(c, w - 48, h - 30); c.restore();
  if (label) popText(c, label, 0, h / 2 + 28, 40, C.grape, null, -1, 0, { font: subFont });
  c.save(); c.rotate(-.05); rrect(c, -60, -h / 2 - 20, 120, 40, 4, 'rgba(255,227,77,.6)'); c.restore();   // băng dính dán ảnh
  c.restore();
}

/* ================= mồi bẫy: khung sticker vàng trống "YOUR STICKER HERE" ================= */
export function baitFrame(c, x, y, r, t, p = 1) {
  if (p <= 0) return; const s = back(p, 2.2);
  c.save(); c.translate(x, y); c.scale(s, s);
  circle(c, 0, 0, r * 1.25, `rgba(255,227,77,${.25 + .1 * Math.sin(t * 5)})`);
  c.setLineDash([22, 14]); c.lineDashOffset = -t * 40; c.lineWidth = 10; c.strokeStyle = C.mango; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke(); c.setLineDash([]);
  circle(c, 0, 0, r - 14, 'rgba(255,248,231,.9)');
  popText(c, 'YOUR', 0, -18, 30, C.berry, null, -1, 0, { font: subFont, read: false }); popText(c, 'STICKER', 0, 14, 30, C.berry, null, -1, 0, { font: subFont, read: false }); popText(c, 'HERE!', 0, 46, 30, C.berry, null, -1, 0, { font: subFont, read: false });
  for (let i = 0; i < 6; i++) { const a = t * 1.2 + i * TAU / 6; star(c, Math.cos(a) * r * 1.15, Math.sin(a) * r * 1.15, 10 + 5 * Math.sin(t * 6 + i), C.lemon); }
  c.restore();
}
// cục tơ: kẻ đột nhập cuộn tròn trong tơ, nảy; p 0..1 mức cuộn
export function silkBall(c, x, y, r, t, p = 1, o = {}) {
  if (p <= 0) return;
  c.save(); c.translate(x, y); c.rotate(t * 3 * (1 - p * .5));
  circle(c, 0, 0, r, `rgba(244,241,255,${.55 + .4 * p})`);
  c.strokeStyle = N.silkD; c.lineWidth = 4;
  for (let i = 0; i < 9; i++) { c.beginPath(); c.ellipse(0, 0, r * (.6 + .4 * ((i * .37) % 1)), r * .35, i * .7, 0, TAU * p); c.stroke(); }
  c.lineWidth = 6; c.strokeStyle = C.ink; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke();
  c.restore();
  if (o.legs !== false) for (let i = 0; i < 8; i++) { const a = -2.6 + i * .74 + Math.sin(t * 13 + i) * .12, x0 = x + Math.cos(a) * r * .92, y0 = y + Math.sin(a) * r * .92, x1 = x + Math.cos(a) * r * 1.45, y1 = y + Math.sin(a) * r * 1.45;
    capsule(c, x0, y0, x1, y1, r * .2, C.ink); capsule(c, x0, y0, x1, y1, r * .12, C.grape); }
  for (let i = 0; i < 2; i++) { circle(c, x - r * .2 + i * r * .4, y - r * .05, r * .14, '#FFFFFF'); circle(c, x - r * .17 + i * r * .4, y - r * .03, r * .07, C.ink); }
}
// con dấu CASE CLOSED!
export function caseStamp(c, x, y, t, t0) {
  if (t < t0) return; const u = seg(t, t0, t0 + .25), s = lerp(2.4, 1, eo(u)), a = clamp(u * 3);
  c.save(); c.translate(x, y); c.rotate(-.12); c.scale(s, s); c.globalAlpha = a;
  c.lineWidth = 14; c.strokeStyle = C.berry; c.beginPath(); c.roundRect(-330, -95, 660, 190, 30); c.stroke();
  popText(c, 'CASE CLOSED!', 0, 34, 104, C.berry, null, -1, 0, {});
  c.restore();
}
