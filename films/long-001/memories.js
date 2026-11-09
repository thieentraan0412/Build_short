// LONG-001 · bốn trang ký ức mùa hè (côn trùng mùa hè chỉ sống trong ký ức, TREATMENT §7): bàn tiệc hoa quả, mê cung đường mùi,
// đồng cỏ đêm, mép ao + đêm đom đóm + tổ ong. Mỗi hàm vẽ cả khung 1920×1080 ở thời điểm t; viền trang sổ vẽ ở film.js.
import { C, circle, ell, capsule, rrect, poly, popText, subFont, nope, rings, clamp, lerp, seg, back, eo, TAU, BY, star, ex, ARM, loupe, zoomIn,
  K, H, talkAt, lineOf, pulse, hold, cam, big, crumbAt, crumbE, crumbAnt, UP_ARMS, DOWN_ARMS, loupeW, chirpAt, waggleAt, blinkFly, rolloAt,
  flutterAt, flutterWave, tasteGlow, sparkles, notes, countdown, choiceBubble, ss, ei, blinkAt } from './lib16.js';
import { lemon, leafBig, strawberry, tableCloth, hop, zip, workerAnt, antTip, nightMeadow, pond, W } from './props.js';
import { hexes } from '/_shared/kit.js';

const sunny = (c, t, sx = 1500, sy = 170) => {
  c.fillStyle = C.sky; c.fillRect(0, 0, 1920, 1080);
  c.fillStyle = C.skyL; for (let i = 0; i < 14; i++) { const a = t * .05 + i * TAU / 14; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + Math.cos(a) * 2600, sy + Math.sin(a) * 2600); c.lineTo(sx + Math.cos(a + TAU / 28) * 2600, sy + Math.sin(a + TAU / 28) * 2600); c.fill(); }
  circle(c, sx, sy, 90, C.lemon); ell(c, 300, 210, 150, 55, 0, C.cream); ell(c, 380, 180, 90, 50, 0, C.cream); ell(c, 900, 120, 110, 40, 0, C.cream);
};

/* ================= 1 · VỊ GIÁC: Flutter chọn món (chanh, lá, dâu) ================= */
export const FR = { lemon: [520, 650], leaf: [960, 668], berry: [1400, 610] };
const FLY_K = 96;
function flutterPos(t) {                                         // bay lượn → đậu chanh → lá → dâu
  const hover = [300 + Math.sin(t * 1.3) * 120, 300 + Math.sin(t * 2.1) * 40];
  return K([[H.s_c1m, [-120, 260]], [H.s_c1m + 1.2, hover], [H.c1_fly, [400 + Math.sin(H.c1_fly * 1.3) * 60, 300]], [H.c1_land1, [FR.lemon[0], FR.lemon[1] - 70]],
    [H.c1_off1, [FR.lemon[0], FR.lemon[1] - 70]], [H.c1_land2, [FR.leaf[0], FR.leaf[1] - 50]], [H.c1_off2, [FR.leaf[0], FR.leaf[1] - 50]], [H.c1_land3, [FR.berry[0] - 10, FR.berry[1] - 110]], [400, [FR.berry[0] - 10, FR.berry[1] - 110]]])(t);
}
export function c1World(c, t, o = {}) {
  sunny(c, t);
  ell(c, 400, 760, 700, 160, 0, C.leaf); ell(c, 1500, 770, 760, 170, 0, C.leafD);
  tableCloth(c, 760);
  // Rollo lăn ngang mép bàn (trứng phục sinh)
  const rp = seg(t, H.rollo1, H.rollo1 + 1.8); if (rp > 0 && rp < 1) rolloAt(c, lerp(2050, -150, rp), 770, 36, 2200 * rp);
  lemon(c, ...FR.lemon, .9); leafBig(c, FR.leaf[0], FR.leaf[1] + 20, .9, -.05); strawberry(c, ...FR.berry, .82, pulse(t, H.c1_land3, .3));
  // nhãn đoán: LEMON? LEAF? STRAWBERRY?
  [['LEMON?', FR.lemon, C.lemon], ['LEAF?', FR.leaf, C.lime], ['STRAWBERRY?', FR.berry, C.pink]].forEach(([w, [x, y], col], i) => {
    const t0 = H.c1_lab + i * .45, p = back(seg(t, t0, t0 + .25), 2.2) * (1 - ss(seg(t, H.c1_fly + 1.0, H.c1_fly + 1.3))); if (p <= 0) return;
    c.save(); c.translate(x, y - 230); c.scale(p, p); rrect(c, -150, -46, 300, 92, 30, C.cream); c.restore();
    if (p > .9) popText(c, w, x, y - 214, w.length > 8 ? 42 : 50, C.ink, null, t, t0, { font: subFont, step: .01 });
  });
  // Flutter
  const [fx, fy] = flutterPos(t), landed = (t > H.c1_land1 && t < H.c1_off1) || (t > H.c1_land2 && t < H.c1_off2) || t > H.c1_land3;
  const sour = t > H.c1_land1 && t < H.c1_off1, meh = t > H.c1_land2 && t < H.c1_off2, yum = t > H.c1_mmm - .1;
  const name = sour ? 'strain' : meh ? 'annoyed' : yum ? 'laugh' : t > H.c1_lab && t < H.c1_fly ? 'thinking' : 'happy';
  const flip = t > H.c1_off1 + .2 && t < H.c1_land2 ? false : t < H.c1_fly ? false : false;
  flutterAt(c, fx, fy, FLY_K, { beta: landed ? .22 + .1 * Math.sin(t * 2.6) : .25 + flutterWave(t) * 1.1, lift: landed ? 0 : .3, rot: landed ? 0 : -.1, flip,
    tongue: ss(seg(t, H.c1_sip, H.c1_sip + .5)) * .8, detail: o.detail ? 1 : 0, E: ex(BY.flutter, name, { look: [.3, .5] }), extra: o.detail ? tasteGlow(hold(t, H.c1_zoom, 400, .2, .2)) : undefined });
  if (sour && t < H.c1_land1 + .6) sparkles(c, fx, fy - 60, 90, seg(t, H.c1_land1, H.c1_land1 + .6), 5, C.lemon, 14);
  if (yum) { const p = (t - H.c1_mmm) % 1.4 / 1.4; for (let i = 0; i < 3; i++) { const q = (p + i / 3) % 1; c.save(); c.globalAlpha = 1 - q; heart(c, fx + 80 + i * 20, fy - 120 - q * 120, 20); c.restore(); } }
  // tiền cảnh: Crumb và Miss Loupe đứng xem (Miss Loupe soi chân Flutter khi đáp án)
  if (o.cast !== false) {
    crumbAt(c, 220, 1065, 70, { E: crumbE(t > H.c1_land1 - .1 && t < H.c1_off1 ? 'worried' : t > H.c1_mmm ? 'excited' : 'curious', t, { look: [.7, -.6] }), yaw: .9, hop: .2 * pulse(t, lineOf('L16').t, .4) });
  }
}
function heart(c, x, y, s) { circle(c, x - s * .5, y, s * .55, C.berry); circle(c, x + s * .5, y, s * .55, C.berry); poly(c, [[x - s * 1.02, y + s * .15], [x + s * 1.02, y + s * .15], [x, y + s * 1.2]], C.berry); }
export function c1Lens(t) {                                       // Miss Loupe: đứng bên phải, soi chân Flutter lúc đáp án
  const foot = [FR.berry[0] - 10, FR.berry[1] - 112];
  const [x, y, r] = K([[H.s_c1m, [1720, 1075 - 2.73 * 105, 105]], [H.c1_zoom - .05, [1720, 1075 - 2.73 * 105, 105]], [H.c1_zoom + .35, [foot[0] + 160, foot[1] + 40, 170]], [H.c1_sip + 1.0, [foot[0] + 160, foot[1] + 40, 170]], [H.c1_out, [1720, 1075 - 2.73 * 105, 105]]])(t);
  const m = hold(t, H.c1_zoom, H.c1_sip + 1.1, .35, .3);
  return { x, y, r, m, fx: foot[0], fy: foot[1] };
}
export function sC1m(c, t, o = {}) {
  c1World(c, t);
  if (!o.noLup) {
    const L = c1Lens(t), name = t < H.c1_count ? (t > lineOf('L17').t ? 'thinking' : 'happy') : t < H.c1_zoom ? 'excited' : 'surprised';
    loupeW(c, L.x, L.y, L.r, t, { name, look: L.m > .3 ? [-.4, .5] : [-.6, -.2], pose: L.m > .3 ? ARM.peer : name === 'thinking' ? ARM.shrug : {}, rot: L.m > .3 ? -.25 : -.06,
      inside: L.m > .02 ? zoomIn(L.x, L.y, lerp(1.2, 2.6, L.m), lerp(L.x, L.fx, L.m), lerp(L.y, L.fy, L.m), () => c1World(c, t, { detail: true, cast: false })) : null });
  }
  // "With its tongue... or its feet?" → 3, 2, 1 → "Its feet!"
  const L18 = lineOf('L18'), bub = hold(t, L18.t, H.c1_zoom + .8, .25, .35);
  choiceBubble(c, 470, 250, 'TONGUE?', bub * ss(seg(t, L18.t, L18.t + .2)) * (t > H.c1_zoom ? 1 - .4 * ss(seg(t, H.c1_zoom, H.c1_zoom + .3)) : 1), C.berry, cc => { ell(cc, 0, -10, 60, 30, 0, C.pink); capsule(cc, 0, 10, 0, 60, 26, C.pink); });
  choiceBubble(c, 1050, 250, 'FEET?', bub * ss(seg(t, L18.t + .9, L18.t + 1.1)), C.grape, cc => { for (let i = 0; i < 3; i++) { capsule(cc, -60 + i * 60, -40, -50 + i * 60, 40, 16, C.ink); ell(cc, -48 + i * 60, 46, 24, 12, 0, C.lime); } });
  if (t > H.c1_zoom && t < H.c1_zoom + .8) { nope(c, 470, 250, 70, seg(t, H.c1_zoom, H.c1_zoom + .2)); sparkles(c, 1050, 250, 220, seg(t, H.c1_zoom, H.c1_zoom + .8), 8, C.lemon, 22); }
  countdown(c, t, lineOf('L19').t, 760, 470);
  if (t > lineOf('L21').t - .1 && t < H.c1_out) { big(c, 'TASTE WITH', 660, 160, 96, C.cream, C.grape, t, lineOf('L21').t); big(c, 'FEET!', 660, 270, 120, C.lemon, C.berry, t, lineOf('L21').t + .35); }
}

/* ================= 2 · KHỨU GIÁC: mê cung cỏ, đường mùi chỉ hiện trong kính ================= */
export const MZ = { S: [960, 930], F1: [960, 700], F2: [560, 700], D: [560, 900], F3: [560, 380], G: [1240, 380], M: [1240, 190] };
const SEGS = [['S', 'F1'], ['F1', 'F2'], ['F1', 'E1'], ['F2', 'D'], ['F2', 'F3'], ['F3', 'L3'], ['F3', 'G'], ['G', 'M'], ['G', 'E2'], ['L3', 'L4']];
const PTS = { ...MZ, E1: [1450, 700], L3: [250, 380], L4: [250, 160], E2: [1620, 380] };
const ROUTE = [['S', H.c2_walk1, H.c2_walk1 + 1.6], ['F1', H.c2_walk2, H.c2_walk2 + 1.9], ['F2', H.c2_wrong, H.c2_wrong + 1.0], ['D', H.c2_walk3, H.c2_walk3 + .9], ['F2', H.c2_walk3 + .9, H.c2_walk3 + 2.2], ['F3', H.c2_walk4, H.c2_walk4 + 1.1], ['G', H.c2_walk4 + 1.1, H.c2_walk4 + 1.8], ['M', 0, 0]];
export function crumbMaze(t) {                                   // vị trí, hướng đi và trạng thái bước của Crumb trong mê cung
  for (let i = 0; i < ROUTE.length - 1; i++) {
    const [a, t0, t1] = ROUTE[i], b = ROUTE[i + 1][0];
    if (t < t0) { const [x, y] = PTS[a]; return { x, y, dir: i ? ROUTE[i - 1].dir : [0, -1], walk: 0 }; }
    if (t < t1) { const u = (t - t0) / (t1 - t0), [x0, y0] = PTS[a], [x1, y1] = PTS[b]; const d = [Math.sign(x1 - x0), Math.sign(y1 - y0)]; ROUTE[i].dir = d; return { x: lerp(x0, x1, u), y: lerp(y0, y1, u), dir: d, walk: 1 }; }
    const [x1, y1] = PTS[b], [x0, y0] = PTS[a]; ROUTE[i].dir = [Math.sign(x1 - x0), Math.sign(y1 - y0)];
  }
  const [x, y] = PTS.M; return { x: x - 70, y, dir: [1, 0], walk: 0 };
}
const TRAIL = ['S', 'F1', 'F2', 'F3', 'G', 'M'].map(k => PTS[k]);
export function mazeWorld(c, t, o = {}) {
  c.fillStyle = '#2E8F4C'; c.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 60; i++) { const x = (i * 233) % 1920, y = (i * 137) % 1080; circle(c, x, y, 48 + (i % 3) * 14, i % 2 ? '#3AA65A' : '#279A48'); }   // bụi cỏ
  c.lineCap = 'round'; c.lineJoin = 'round';
  for (const [w, col] of [[150, '#D9B571'], [124, '#F2D9A0']]) { c.strokeStyle = col; c.lineWidth = w; for (const [a, b] of SEGS) { c.beginPath(); c.moveTo(...PTS[a]); c.lineTo(...PTS[b]); c.stroke(); } }
  for (const [a, b] of SEGS) for (let k = 1; k < 4; k++) { const u = k / 4, x = lerp(PTS[a][0], PTS[b][0], u), y = lerp(PTS[a][1], PTS[b][1], u); circle(c, x + 20, y + 14, 6, '#E3C384'); }
  ell(c, PTS.S[0], PTS.S[1] + 30, 90, 30, 0, '#B9712F');                                        // lối vào
  // đường mùi bạc hà (chỉ trong kính)
  if (o.trail) {
    c.strokeStyle = C.mint; c.lineWidth = 34; c.beginPath(); TRAIL.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.stroke();
    c.strokeStyle = C.mintL; c.lineWidth = 12; c.setLineDash([26, 30]); c.lineDashOffset = -t * 140; c.beginPath(); TRAIL.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.stroke(); c.setLineDash([]);
    for (let i = 0; i < 16; i++) { const s = (t * .25 + i / 16) % 1, idx = Math.floor(s * (TRAIL.length - 1)), u = s * (TRAIL.length - 1) - idx, a = TRAIL[idx], b = TRAIL[idx + 1]; circle(c, lerp(a[0], b[0], u) + Math.sin(i * 5) * 20, lerp(a[1], b[1], u) - 30 - ((t + i) % 1) * 30, 6, C.mint); }
  }
  // Rollo lăn ngang hàng rào dưới (trứng phục sinh)
  const rp = seg(t, H.rollo2, H.rollo2 + 2.0); if (rp > 0 && rp < 1) rolloAt(c, lerp(2000, -100, rp), 1040, 34, 2100 * rp);
  // chị kiến ở giữa mê cung
  const tap = pulse(t, H.c2_tap, .25) + pulse(t, H.c2_tap + .45, .25);
  workerAnt(c, PTS.M[0] + 40, PTS.M[1] + 30, 70, t > H.c2_meet + 1.5 ? 0 : t * .3, { dir: -1, tap: t > H.c2_meet ? tap : 0 });
  [H.c2_tap, H.c2_tap + .45].forEach(s => sparkles(c, PTS.M[0] - 20, PTS.M[1] - 40, 50, seg(t, s, s + .4), 5, C.lemon, 10));
  // Crumb (nhìn từ trên như quân cờ đứng)
  const P = crumbMaze(t), d = P.dir, yaw = d[1] < 0 ? Math.PI : d[1] > 0 ? 0 : d[0] > 0 ? Math.PI / 2 : -Math.PI / 2;
  const bonk = pulse(t, H.c2_bonk, .5), sniff = [H.c2_sniff1, H.c2_sniff2, H.c2_sniff3].reduce((a, s) => a + hold(t, s, s + .55, .1, .15), 0);
  const name = bonk > .1 || (t > H.c2_bonk && t < lineOf('L32').t + 1) ? 'crosseyed' : sniff > .2 ? 'thinking' : t > H.c2_meet ? 'excited' : P.walk ? 'happy' : 'curious';
  const at = [P.x, P.y + 40 - 18 * bonk];
  crumbAt(c, at[0], at[1], 62, { walk: P.walk, ph: t * 2.6, yaw: P.walk || t > H.c2_meet ? yaw : .3, E: crumbE(name, t, { look: [.2, -.4] }), q: sniff > .2 ? 1 : 0, lean: -.2 * bonk });
  if (sniff > .1) for (let i = 0; i < 3; i++) { const a = -.6 + i * .6, r = 60 + 20 * sniff; c.strokeStyle = C.cream; c.lineWidth = 6; c.beginPath(); c.arc(at[0], at[1] - 190, r, a - .2 - Math.PI / 2, a + .2 - Math.PI / 2); c.stroke(); }
  if (t > H.c2_bonk && t < H.c2_bonk + .9) for (let i = 0; i < 5; i++) { const a = t * 6 + i * TAU / 5; star(c, at[0] + Math.cos(a) * 70, at[1] - 220 + Math.sin(a) * 18, 12, C.lemon); }
  // mũi tên chọn ngả: "Left or right?" / "Up or down?"
  const asks = [['L28', 'F1', ['←', '→'], 'h'], ['L30', 'F2', ['↑', '↓'], 'v'], ['L33', 'F3', ['←', '→'], 'h']];
  asks.forEach(([id, node, ar, hv], i) => {
    const L = lineOf(id), end = [H.c2_sniff1, H.c2_wrong, H.c2_sniff3][i] + .6, p = hold(t, L.t, end, .2, .25); if (p <= 0) return;
    const [x, y] = PTS[node];
    ar.forEach((a, j) => { const dx = hv === 'h' ? (j ? 270 : -270) : 0, dy = hv === 'v' ? (j ? 150 : -170) : 0; c.save(); c.translate(x + dx, y + dy - (hv === 'h' ? 60 : 0)); c.scale(back(p, 2.2), back(p, 2.2)); circle(c, 0, 0, 64, j ? C.berry : C.grape); popText(c, a, 0, 26, 80, C.cream, null, -1, 0, { read: false, font: subFont }); c.restore(); });
  });
}
export function mazeLens(t) {
  const P = crumbMaze(t), lagX = P.x + 40, lagY = P.y - 70;
  const r = 165 + 15 * hold(t, H.c2_meet, H.c2_out, .3, .3);
  return { x: lagX, y: lagY, r };
}
export function sC2m(c, t, o = {}) {
  const br = 1.02 + .02 * Math.sin((t - H.s_c2m) * .45); c.save(); c.translate(960, 560); c.scale(br, br); c.rotate(.006 * Math.sin(t * .6)); c.translate(-960, -560);   // máy trôi chậm trên mê cung
  mazeWorld(c, t);
  if (!o.noLup) {
    const L = mazeLens(t), name = t > H.c2_bonk && t < lineOf('L31').t + .8 ? 'shout' : t > H.c2_meet ? 'laugh' : 'curious';
    loupeW(c, L.x, L.y, L.r, t, { name, look: [-.2, .6], pose: ARM.peer, rot: -.04, inside: zoomIn(L.x, L.y, 1.0, L.x, L.y, () => mazeWorld(c, t, { trail: true })) });
  }
  if (t > lineOf('L35').t - .1 && t < H.c2_out) { big(c, 'TAP,', 1470, 190, 100, C.lemon, C.grape, t, lineOf('L35').t); big(c, 'TAP!', 1720, 190, 100, C.lemon, C.grape, t, lineOf('L35').t + .35); }
  c.restore();
  if (t > lineOf('L36').t && t < H.c2_out) { big(c, 'SMELL', 330, 170, 92, C.mint, C.leafD, t, lineOf('L36').t + .2); big(c, 'TRAIL!', 330, 270, 92, C.lemon, C.leafD, t, lineOf('L36').t + .6); }
}

/* ================= 3 · THÍNH GIÁC: trốn tìm cái tai (Chirp, Hop) dưới trăng ================= */
export const CK = { x: 600, y: 930, k: 118 }, HP = { x: 1300, y: 930, s: 150 };
const chirpHead = () => [CK.x + 1.0 * CK.k * .9, CK.y - 1.25 * CK.k];
const chirpEar = () => [CK.x + .55 * CK.k, CK.y - .3 * CK.k];
const hopHead = () => [HP.x - .52 * HP.s, HP.y - 1.05 * HP.s], hopEar = () => [HP.x + .22 * HP.s, HP.y - .6 * HP.s];   // Hop quay mặt sang trái (dir −1)
export function c3World(c, t, o = {}) {
  nightMeadow(c, t);
  const rp = seg(t, H.rollo3, H.rollo3 + 2.4); if (rp > 0 && rp < 1) rolloAt(c, lerp(-100, 1100, rp), 690, 34, 1200 * rp, { yaw: 1.4 });   // Rollo trên đồi xa
  const band = hold(t, H.c3_band, H.c3_band + 2.4, .2, .3) + hold(t, H.c3_fiddle, H.c3_fiddle + 2.3, .2, .3), ch = band > .1 ? .5 + .5 * Math.sin(t * 22) : t > H.c3_chirp && t < H.c3_chirp + .8 ? .5 + .5 * Math.sin(t * 24) : 0;
  const earC = o.detail ? hold(t, H.c3_down1 + 1.0, H.c3_out, .3, .3) : 0, earH = o.detail ? hold(t, H.c3_down2 + 1.2, H.c3_out, .3, .3) : 0;
  chirpAt(c, CK.x, CK.y, CK.k, { t, chirp: ch, detail: o.detail ? 1 : 0, earGlow: earC > .3 ? 1 : 0, E: ex(BY.chirp, band > .1 ? 'laugh' : t > H.c3_head1 && t < H.c3_down1 + 1 ? 'confused' : 'happy', { look: [.5, -.1] }) });
  hop(c, HP.x, HP.y, HP.s, { dir: -1, fiddle: band > .1 ? .5 + .5 * Math.sin(t * 9) : 0, ear: earH, look: [-.2, -.1], blink: blinkAt(t, .7) > .5 ? 1 : 0 });
  if (band > .1) { notes(c, CK.x + 120, CK.y - 260, t, 3, C.lemon, 44); notes(c, HP.x - 60, HP.y - 300, t + .5, 3, C.mint, 44); }
  if (o.detail && earC > .3) rings(c, ...chirpEar(), 20, 110, 3, t * .8, C.mint, 6);
  if (o.detail && earH > .3) rings(c, ...hopEar(), 20, 110, 3, t * .8, C.mint, 6);
}
function c3Lens(t) {
  const rest = [960, 1075 - 2.73 * 105, 105], ch = chirpHead(), ce = chirpEar(), hh = hopHead(), he = hopEar();
  const [x, y, r] = K([[H.s_c3m, rest], [H.c3_head1 - .3, rest], [H.c3_head1, [ch[0] + 20, ch[1], 150]], [H.c3_down1, [ch[0] + 20, ch[1], 150]], [H.c3_down1 + 1.4, [ce[0] + 30, ce[1] - 30, 150]], [H.c3_chirp + .8, [ce[0] + 30, ce[1] - 30, 150]],
    [H.c3_head2, [hh[0], hh[1], 150]], [H.c3_down2, [hh[0], hh[1], 150]], [H.c3_down2 + 1.4, [he[0] + 20, he[1] - 20, 150]], [H.c3_fiddle - .1, [he[0] + 20, he[1] - 20, 150]], [H.c3_fiddle + .5, rest]])(t);
  const target = t < H.c3_chirp + 1 ? (t < H.c3_down1 ? ch : ce) : (t < H.c3_down2 ? hh : he);
  const m = hold(t, H.c3_head1, H.c3_chirp + 1.1, .3, .3) + hold(t, H.c3_head2, H.c3_fiddle + .2, .3, .3);
  return { x, y, r, m, fx: x, fy: y };
}
export function sC3m(c, t, o = {}) {
  c3World(c, t);
  crumbAt(c, 230, 1070, 56, { E: crumbE(t > lineOf('L44').t - .2 && t < lineOf('L44').t + .8 || t > lineOf('L47').t - .2 && t < lineOf('L47').t + .8 ? 'confident' : 'happy', t, { look: [.7, -.5] }), yaw: .9,
    hop: .2 * pulse(t, lineOf('L44').t, .3) + .2 * pulse(t, lineOf('L47').t, .3) });
  if (!o.noLup) {
    const L = c3Lens(t), name = t > lineOf('L43').t && t < lineOf('L43').t + 2.3 ? 'confident' : L.m > .3 ? 'surprised' : 'happy';
    loupeW(c, L.x, L.y, L.r, t, { name, look: L.m > .3 ? [-.3, .6] : [-.4, -.3], pose: L.m > .3 ? ARM.peer : name === 'confident' ? ARM.point : {}, rot: -.1,
      inside: L.m > .02 ? zoomIn(L.x, L.y, lerp(1.2, 2.0, Math.min(1, L.m)), L.fx, L.fy, () => c3World(c, t, { detail: true })) : null });
    // "Nope!": không có tai trên đầu
    [[H.c3_head1, lineOf('L44').t], [H.c3_head2, lineOf('L47').t]].forEach(([h0, n0]) => { if (t > n0 && t < n0 + 1.1) nope(c, L.x + L.r * .8, L.y - L.r * .7, 46, seg(t, n0, n0 + .2)); });
  }
  if (t > lineOf('L45').t && t < H.c3_head2 - .2) { big(c, 'EARS ON', 960, 150, 88, C.cream, C.grape, t, lineOf('L45').t + .3); big(c, 'FRONT LEGS!', 960, 245, 92, C.mint, C.grape, t, lineOf('L45').t + .6); }
  if (t > lineOf('L48').t && t < H.c3_out) { big(c, 'EARS ON', 960, 150, 88, C.cream, C.grape, t, lineOf('L48').t + .3); big(c, 'ITS TUMMY!', 960, 245, 92, C.mint, C.grape, t, lineOf('L48').t + .6); }
}

/* ================= 4 · THỊ GIÁC VÀ TÍN HIỆU: Zip ở mép ao → đêm đom đóm (Blink) → tổ ong (Waggle) ================= */
export const ZP = { perch: [1320, 470], away: [1640, 250], s: 120 };
function zipPos(t) { return K([[0, ZP.perch], [H.c4_zip, ZP.perch], [H.c4_zip + .5, ZP.away], [400, ZP.away]])(t); }
export function c4World(c, t, o = {}) {
  pond(c, t);
  capsule(c, ZP.perch[0] + 40, 1080, ZP.perch[0] + 10, ZP.perch[1] + 30, 16, C.leafD);   // cây sậy Zip đậu
  const rp = seg(t, H.rollo4, H.rollo4 + 2.2); if (rp > 0 && rp < 1) rolloAt(c, lerp(-120, 1100, rp), 715, 30, 1220 * rp, { yaw: 1.4 });
  const [zx, zy] = zipPos(t), spot = ss(seg(t, H.c4_spot, H.c4_spot + .25)), dart = t > H.c4_zip && t < H.c4_zip + .5;
  zip(c, zx, zy + Math.sin(t * 2) * 6, ZP.s, { dir: -1, wing: t * (t > H.c4_zip ? 9 : 1.2), look: spot > .5 ? [-.9, .7] : [-.6, 0], eyeGlow: o.detail ? hold(t, H.c4_zoom, 400, .3, .2) : 0, rot: dart ? -.4 : 0 });
  if (dart) for (let i = 0; i < 4; i++) capsule(c, zx + 60 + i * 50, zy + 40 + i * 30, zx + 140 + i * 50, zy + 90 + i * 30, 6, 'rgba(255,255,255,.7)');
  if (t > H.c4_spot && t < H.c4_spot + .5) { c.font = subFont(80); c.fillStyle = C.berry; c.textAlign = 'center'; c.fillText('!', zx + 40, zy - 110); }
  // Crumb rón rén tới từ bên hông → hụt → ngã sấp
  const sneak = ss(seg(t, H.c4_sneak, H.c4_sneak + 2.6)), flop = ss(seg(t, H.c4_flop, H.c4_flop + .3));
  const cx = lerp(260, 1080, sneak);
  ell(c, 760, 1090, 1300, 120, 0, C.leafD); ell(c, 700, 1100, 1200, 100, 0, C.leaf);   // bờ ao gần (Crumb rón rén trên bờ)
  if (o.cast !== false) crumbAt(c, cx, 1010, 64, { walk: t > H.c4_sneak && t < H.c4_spot ? .6 : 0, ph: t * 1.4, yaw: 1.2, lean: .9 * flop + (t > H.c4_sneak && t < H.c4_spot ? .15 : 0),
    E: crumbE(flop > .5 ? 'crosseyed' : t > H.c4_sneak && t < H.c4_spot ? 'confident' : t > lineOf('L54').t - .2 ? 'confused' : 'happy', t, { look: [.8, -.6] }), hop: -.3 * flop, arms: flop > .3 ? DOWN_ARMS : UP_ARMS });
  if (t > H.c4_sneak && t < H.c4_spot) { c.font = subFont(56); c.fillStyle = C.cream; c.textAlign = 'center'; c.fillText('shh...', cx, 780); }
}
function c4Lens(t) {
  const rest = [520, 1075 - 2.73 * 100, 100], ey = [ZP.away[0] + .32 * ZP.s * -1 + 0, ZP.away[1] - .24 * ZP.s];
  const [x, y, r] = K([[H.s_c4m, rest], [H.c4_zoom - .2, rest], [H.c4_zoom + .3, [ey[0] - 80, ey[1] + 60, 170]], [H.c4_night - .2, [ey[0] - 80, ey[1] + 60, 170]], [H.c4_night + .3, rest]])(t);
  return { x, y, r, m: hold(t, H.c4_zoom, H.c4_night, .3, .25), fx: ey[0], fy: ey[1] };
}
export function sC4m(c, t, o = {}) {
  c4World(c, t);
  if (!o.noLup) {
    const L = c4Lens(t);
    loupeW(c, L.x, L.y, L.r, t, { name: L.m > .3 ? 'surprised' : t > lineOf('L54').t ? 'curious' : 'happy', look: L.m > .3 ? [.5, -.4] : [.6, -.2], pose: L.m > .3 ? ARM.peer : {}, rot: L.m > .3 ? .15 : -.06,
      inside: L.m > .02 ? zoomIn(L.x, L.y, lerp(1.2, 2.4, L.m), lerp(L.x, L.fx, L.m), lerp(L.y, L.fy, L.m), () => c4World(c, t, { detail: true, cast: false })) : null });
  }
  if (t > lineOf('L55').t && t < H.c4_night) { big(c, 'GIANT', 470, 170, 100, C.lemon, C.grape, t, lineOf('L55').t + .2); big(c, 'EYES!', 470, 280, 110, C.mint, C.grape, t, lineOf('L55').t + .5); }
}
// đêm hè: Blink chối "I'm not glowing!" nhưng đuôi càng sáng; nháy mật mã, bạn ở xa nháy đáp lại đúng mã
const CODE = [0, .3, .9];                                        // ba lần nháy: ngắn, ngắn, (nghỉ) dài
const flashAt = (t, t0) => CODE.reduce((a, d, i) => a + hold(t, t0 + d, t0 + d + (i === 2 ? .55 : .2), .04, .08), 0);
export function c4Night(c, t) {
  c.fillStyle = C.night; c.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 50; i++) circle(c, (i * 389) % 1920, (i * 151) % 640, 2 + (i % 3), C.cream);
  ell(c, 960, 1000, 1300, 220, 0, '#1F4E2E'); c.fillStyle = '#163E24'; c.fillRect(0, 1010, 1920, 100);
  for (let i = 0; i < 9; i++) { const p = (t * .2 + i * .37) % 1, x = (i * 271) % 1920, y = 900 - p * 300; circle(c, x, y, 18 * Math.sin(Math.PI * p), 'rgba(255,227,77,.35)'); circle(c, x, y, 6 * Math.sin(Math.PI * p), C.lemon); }   // đom đóm khác lấp lánh
  const deny = hold(t, lineOf('L57').t, H.c4_code, .2, .3), g = .45 + .5 * ss(seg(t, lineOf('L57').t + .3, H.c4_glow + .3)) + .4 * flashAt(t, H.c4_code);
  const bx = 960, by = 640 + Math.sin(t * 2) * 14;
  if (g > .6) circle(c, bx - 40, by - 70, 180 * Math.min(1.4, g), 'rgba(255,227,77,.16)');
  blinkFly(c, bx, by, 140, { fly: .9, glow: Math.min(1, g), lift: .2, E: ex(BY.blink, deny > .3 && t < H.c4_code ? 'shy' : t > H.c4_code ? 'confident' : 'happy', { talk: talkAt(t, 'blink'), look: [-.3, 0] }) });
  // một bạn đậu trong cỏ chờ một nhịp rồi nháy đáp lại (FACTS §8: đáp từ dưới cỏ, sau một khoảng nghỉ)
  const fx = 1620, fy = 975, rep = hold(t, H.c4_code + 2.1, H.c4_code + 2.45, .04, .1) + hold(t, H.c4_code + 4.6, H.c4_code + 4.95, .04, .1);
  circle(c, fx, fy, 14 + 46 * rep, `rgba(255,227,77,${.12 + .4 * rep})`); circle(c, fx, fy, 10, rep > .2 ? C.lemon : '#8E8A5A');
  for (let i = 0; i < 6; i++) poly(c, [[fx - 70 + i * 28, 1080], [fx - 56 + i * 28, 1080], [fx - 63 + i * 28 + Math.sin(t + i) * 6, 1000 - (i % 2) * 20]], '#246236');
  // mã: ● ● ━
  const shown = hold(t, H.c4_code, lineOf('L59').t + lineOf('L59').dur + .5, .2, .3);
  if (shown > 0) { c.save(); c.globalAlpha = shown; CODE.forEach((d, i) => { const on = t > H.c4_code + d; if (i < 2) circle(c, 760 + i * 90, 230, 26, on ? C.lemon : 'rgba(255,255,255,.25)'); else capsule(c, 960, 230, 1080, 230, 52, on ? C.lemon : 'rgba(255,255,255,.25)'); }); c.restore(); }
  if (t > H.c4_code + 2.1 && t < H.c4_code + 2.8) sparkles(c, fx, fy - 20, 70, seg(t, H.c4_code + 2.1, H.c4_code + 2.8), 6, C.lemon, 12);
}
export function sC4n(c, t, o = {}) {
  c4Night(c, t);
  if (!o.noLup) loupeW(c, 360, 1075 - 2.73 * 105, 105, t, { name: t > lineOf('L58').t && t < lineOf('L58').t + 1.8 ? 'wink' : t > H.c4_code ? 'surprised' : 'curious', look: [.6, -.3], rot: -.06 });
  if (t > lineOf('L59').t && t < H.c4_hive) { big(c, 'SECRET', 1450, 520, 96, C.lemon, C.grape, t, lineOf('L59').t + .3); big(c, 'CODE!', 1450, 620, 110, C.cream, C.grape, t, lineOf('L59').t + .6); }
}
// tổ ong: Waggle nhảy số 8, vạch nhảy kéo dài thành mũi tên chỉ ra mép trang
export function c4Hive(c, t) {
  c.fillStyle = C.honeyD; c.fillRect(0, 0, 1920, 1080); hexes(c, 70, C.honeyL, -100, -100, 2100, 1200, .9); hexes(c, 70, 'rgba(255,195,43,.45)', -100, -100, 2100, 1200, .55);
  for (const [x, y, f] of [[380, 360, 1], [420, 760, 1], [1500, 320, -1], [1560, 780, -1]]) waggleAt(c, x, y, 70, { flip: f < 0, wing: Math.sin(t * 20) * .3, look: [f * .5, 0] });   // các bạn ong xem
  const dt = t - H.s_c4h, loop = (dt % 2.0) / 2.0, a = loop * TAU, straight = loop < .35;
  const px = 900 + (straight ? lerp(-180, 180, loop / .35) : Math.cos(a) * 180 * (Math.floor(dt / 2) % 2 ? 1 : -1)), py = 560 + (straight ? 0 : Math.sin(a) * 140);
  c.strokeStyle = 'rgba(255,248,231,.5)'; c.lineWidth = 10; c.setLineDash([20, 20]); c.beginPath(); c.ellipse(720, 560, 180, 140, 0, 0, TAU); c.stroke(); c.beginPath(); c.ellipse(1080, 560, 180, 140, 0, 0, TAU); c.stroke(); c.setLineDash([]);
  const pt = ss(seg(t, H.c4_point, H.c4_point + 1.0));
  if (pt > 0) { capsule(c, 1080, 560, lerp(1080, 1820, pt), 560, 30, C.cream); poly(c, [[lerp(1080, 1820, pt) + 60, 560], [lerp(1080, 1820, pt) - 10, 500], [lerp(1080, 1820, pt) - 10, 620]], C.cream); }
  waggleAt(c, px, py + 120, 110, { wag: straight ? Math.sin(t * 30) * .5 : 0, wing: Math.sin(t * 24) * .4, lean: straight ? 0 : Math.cos(a) * .2, E: ex(BY.waggle, 'excited', { look: [.6, 0] }) });
}
export function sC4h(c, t, o = {}) {
  c4Hive(c, t);
  if (!o.noLup) loupeW(c, 260, 1075 - 2.73 * 100, 100, t, { name: 'excited', look: [.7, -.1], rot: -.06 });
  if (t > lineOf('L60').t && t < H.c4_out) { big(c, 'THE DANCE', 960, 170, 92, C.cream, C.honeyD, t, lineOf('L60').t + .2); big(c, 'SHOWS THE WAY!', 960, 270, 92, C.lemon, C.honeyD, t, lineOf('L60').t + .6); }
}
