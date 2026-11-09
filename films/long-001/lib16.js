// LONG-001 · công cụ dựng cho khung 16:9 (1920×1080): máy quay, phụ đề, nhân vật đặt sẵn, chữ lớn, đếm ngược, chuyển cảnh.
// Video dài đầu tiên của kênh; các Short dùng _shared/episode.js (khung 1080×1920), ở đây là bản 16:9 của cùng ngữ pháp.
import { C, REC, circle, ell, capsule, rrect, poly, popText, subFont, wrap, sticker, nope, rings, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { makeTalk, blinkAt, flutterWave, ex, rigPt, loupe, zoomIn, ARM, flutterAt, tasteGlow, badge, shadow, LENS_UP } from '/_shared/episode.js';
import { track, ss, ei } from '/core/lib.js';
import { LINES, CARDS, HIT, DUR } from './timeline.js';

export { C, REC, circle, ell, capsule, rrect, poly, popText, subFont, sticker, nope, rings, clamp, lerp, seg, back, eo, TAU, drawChar, BY, star, blinkAt, flutterWave, ex, rigPt, loupe, zoomIn, ARM, flutterAt, tasteGlow, badge, shadow, LENS_UP, track, ss, ei, HIT, LINES, DUR };
export const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv, talkAt = T.talkAt;
export const lineOf = id => LINES.find(l => l.id === id);
export const lineAt = (t, who) => LINES.find(l => l.t <= t && t < l.t + l.dur && (!who || l.who === who));
export const H = HIT;
export const pulse = (t, t0, d = .3) => Math.sin(Math.PI * clamp(seg(t, t0, t0 + d)));   // nảy một lần 0 → 1 → 0
export const hold = (t, a, b, fi = .3, fo = .3) => ss(seg(t, a, a + fi)) * (1 - ss(seg(t, b - fo, b)));

/* ---------- máy quay 16:9: nhìn vào (cx, cy) với độ phóng z ---------- */
export const cam = (c, k, fn) => { c.save(); c.translate(960, 540); c.scale(k.z, k.z); if (k.rot) c.rotate(k.rot); c.translate(-k.cx, -k.cy); fn(); c.restore(); };
export const shake = (t, t0, d = .3, a = 10) => t > t0 && t < t0 + d ? Math.sin((t - t0) * 70) * a * (1 - (t - t0) / d) : 0;

/* ---------- phụ đề 16:9: tấm kem dưới cùng, chữ hiện theo câu đã nói ---------- */
export function subtitle16(c, card, t, cx = 960, y = 985) {
  const a = seg(t, card.t0, card.t0 + .14); if (a <= 0) return;
  c.save(); c.font = subFont(50); c.textAlign = 'left'; c.textBaseline = 'middle';
  const ls = wrap(c, card.text, 1300), lh = 60, w = Math.max(...ls.map(l => c.measureText(l).width)) + 70, h = ls.length * lh + 26;
  let shown = card.parts.filter(p => t >= p.t).map(p => p.text).join(' ').length;
  const s = back(a, 1.6), yy = y - (ls.length - 1) * lh / 2; c.translate(cx, yy); c.scale(s, s);
  rrect(c, -w / 2 + 6, -h / 2 + 9, w, h, 28, 'rgba(30,27,58,.28)');
  rrect(c, -w / 2, -h / 2, w, h, 28, C.cream);
  c.fillStyle = C.ink;
  ls.forEach((l, i) => { if (shown <= 0) return; const lw = c.measureText(l).width; c.fillText(l.slice(0, shown), -lw / 2, (i - (ls.length - 1) / 2) * lh + 3); shown -= l.length + 1; });
  c.restore();
}
export const cardAt = t => CARDS.find(x => t >= x.t0 && t < x.t1);

/* ---------- chữ lớn nảy (có ghi cho readcheck) ---------- */
export function big(c, str, x, y, px, fill, sh, t, t0, o = {}) { if (t < t0) return; popText(c, str, x, y, px, fill, sh, t, t0, { step: .03, ...o }); }
// đếm ngược "3... 2... 1!": mỗi số nảy to ở giữa khung theo lời của Miss Loupe
export function countdown(c, t, t0, x = 960, y = 470) {
  const L = lineAt(t, 'loupe'); const d = L && /Three/.test(L.text) ? L.dur : 1.5;
  ['3', '2', '1!'].forEach((s, i) => {
    const a = t0 + i * d / 3, b = a + d / 3 + (i === 2 ? .9 : 0); if (t < a || t >= b) return;
    const p = back(seg(t, a, a + .2), 2.6), f = 1 - ss(seg(t, b - .12, b));
    c.save(); c.translate(x, y); c.scale(p * f, p * f); c.translate(-x, -y);
    circle(c, x, y - 70, 150, [C.sky, C.lemon, C.berry][i]); popText(c, s, x, y, 220, C.cream, C.ink, -1, 0, { read: false });
    c.restore();
  });
}
// bong bóng hỏi (câu hỏi đoán trước đáp án): "TONGUE?" "FEET?"
export function choiceBubble(c, x, y, str, p, col, draw) {
  if (p <= 0) return; const s = back(p, 2.2);
  c.save(); c.translate(x, y); c.scale(s, s);
  ell(c, 8, 12, 170, 130, 0, 'rgba(30,27,58,.2)'); ell(c, 0, 0, 170, 130, 0, C.cream); poly(c, [[-30, 110], [30, 110], [-10, 175]], C.cream);
  if (draw) draw(c);
  c.restore();
  popText(c, str, x, y + 205 * s - 60, 54, col, C.ink, -1, 0, { font: subFont, read: p > .9 });
}

/* ---------- Crumb: kiến con hổ phách; trong phim này vác viên đường, quàng khăn khi ở ngoài trời không cần (Crumb ở trong nhà) ---------- */
const FEET = [[-.4, 0, .3], [-.48, 0, -.1], [.4, 0, .3], [.48, 0, -.1]];
export const UP_ARMS = { armL: [-.32, -2.5, .25], armR: [.32, -2.5, .25] };
export const DOWN_ARMS = { armL: [-.4, -1.0, .45], armR: [.42, -1.05, .45] };
export function crumbAt(c, x, y, k, o = {}) {
  const w = o.walk || 0, ph = o.ph || 0;
  const feet = FEET.map((f, i) => { const s = Math.sin(ph * TAU + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)); return [f[0], -Math.max(0, s) * .14 * w, f[2] + s * .16 * w]; });
  const pose = { carry: null, q: o.q ?? 0, lift: (o.hop || 0) + Math.abs(Math.sin(ph * TAU)) * .04 * w, bodyLean: o.lean || 0, feet, reach: o.reach || 0, ...(o.arms || UP_ARMS) };
  const r = drawChar(c, BY.crumb, { x, y, k, yaw: o.yaw ?? .7, flip: !!o.flip, showFx: false, expr: o.E || ex(BY.crumb, 'happy'), pose });
  if (o.cube !== false && !o.arms?.noCube && (o.arms || UP_ARMS) === UP_ARMS) sugarCube(c, x + (o.flip ? 6 : -6), y - (2.8 + (o.hop || 0)) * k, k * .9, .06);
  return r;
}
export const crumbE = (name, t, o = {}) => ex(BY.crumb, name, { talk: talkAt(t, 'crumb'), blink: talkAt(t, 'crumb') ? 0 : blinkAt(t, .6), ...o });
export const crumbAnt = (x, y, k, o = {}) => rigPt(x, y, k, o.yaw ?? .7, 0, [.22, -2.38 - (o.hop || 0), .34]).map((v, i) => i === 0 && o.flip ? 2 * x - v : v);
export function sugarCube(c, x, y, s, rot = 0) {             // viên đường: khối vuông trắng có mặt bên kem
  c.save(); c.translate(x, y); c.rotate(rot);
  poly(c, [[-.42 * s, -.18 * s], [.18 * s, -.42 * s], [.48 * s, -.2 * s], [-.12 * s, .04 * s]], C.white);
  poly(c, [[-.42 * s, -.18 * s], [-.12 * s, .04 * s], [-.12 * s, .44 * s], [-.42 * s, .22 * s]], '#E9F1FA');
  poly(c, [[-.12 * s, .04 * s], [.48 * s, -.2 * s], [.48 * s, .2 * s], [-.12 * s, .44 * s]], '#DDE8F4');
  for (const [dx, dy] of [[.05, -.18], [.2, -.24], [-.1, -.12]]) circle(c, dx * s, dy * s, .03 * s, '#C9D8EA');
  c.restore();
}

/* ---------- Albie mùa đông: quàng khăn, run lập cập, phủ băng (frost 0..1), mắt díp (sleepy) ---------- */
export function albieW(c, x, y, k, t, o = {}) {
  const cold = o.cold ?? 0, sh = cold > 0 ? Math.sin(t * 46) * 2.2 * cold : 0;
  const talk = talkAt(t, 'albie'), name = o.name || (talk ? 'talk' : 'happy');
  const E = o.E || ex(BY.albie, name, { talk, look: o.look || [-.4, -.1], blink: talk ? 0 : blinkAt(t, .4) });
  const r = drawChar(c, BY.albie, { x: x + sh, y, k, yaw: o.yaw ?? -.3, showFx: !!o.fx, expr: E,
    pose: { hop: o.hop || 0, tilt: o.tilt || 0, tabsUp: o.tabsUp || 0, page: o.page || null, pageCurl: o.curl ?? .3, scarf: o.scarf ?? true, sneeze: o.sneeze || 0 } });
  // bốn tab trên đầu: phủ băng (tabsIce[i] 0..1) hoặc sáng (tabsGlow[i])
  const tabs = [[-.42, C.sky], [-.12, C.lemon], [.18, C.mint], [.44, C.pink]];
  tabs.forEach(([tx, col], i) => {
    const p = rigPt(x + sh, y, k, o.yaw ?? -.3, 0, [tx, -2.42, 0]), ice = (o.tabsIce || [])[i] || 0, gl = (o.tabsGlow || [])[i] || 0;
    if (gl > .01) { circle(c, p[0], p[1], k * (.32 + .1 * gl), `rgba(255,248,231,${.55 * gl})`); for (let j = 0; j < 4; j++) { const a = j * TAU / 4 + t * 2; star(c, p[0] + Math.cos(a) * k * .4, p[1] + Math.sin(a) * k * .4, k * .06 * gl, C.lemon); } }
    if (ice > .01) { ell(c, p[0], p[1] - k * .02, k * .16 * (.6 + .4 * ice), k * .22 * (.6 + .4 * ice), 0, `rgba(214,240,255,${.92 * ice})`); circle(c, p[0] - k * .05, p[1] - k * .1, k * .035 * ice, C.white); }
  });
  if (cold > 0) {                                                 // băng phủ bìa + chấm tuyết trên đầu
    const top = rigPt(x + sh, y, k, o.yaw ?? -.3, 0, [0, -2.3, .1]);
    ell(c, top[0], top[1] + k * .06, k * .62, k * .1, 0, `rgba(244,251,255,${.9 * cold})`);
    for (let i = 0; i < 4; i++) { const q = rigPt(x + sh, y, k, o.yaw ?? -.3, 0, [-.5 + i * .33, -2.2, .42]); poly(c, [[q[0] - k * .04, q[1]], [q[0] + k * .04, q[1]], [q[0], q[1] + k * (.12 + .06 * (i % 2)) * cold]], `rgba(214,240,255,${.9 * cold})`); }   // cột băng nhỏ
    for (let i = 0; i < 3; i++) { const q = rigPt(x + sh, y, k, o.yaw ?? -.3, 0, [-.5 + i * .5, -.4 - (i % 2) * .5, .45]); ell(c, q[0], q[1], k * .16, k * .08, .3, `rgba(214,240,255,${.6 * cold})`); }
  }
  if (o.zzz) for (let i = 0; i < 3; i++) { const p = ((t * .5 + i / 3) % 1), zx = x + k * (.9 + p * .6), zy = y - k * (2.4 + p * 1.1); c.save(); c.globalAlpha = o.zzz * (1 - p); c.font = subFont(k * (.22 + .1 * i)); c.fillStyle = C.grape; c.fillText('z', zx, zy); c.restore(); }
  return r;
}

/* ---------- Miss Loupe mùa đông (khăn len) ---------- */
export function loupeW(c, lx, ly, r, t, o = {}) {
  const talk = talkAt(t, 'loupe'), name = o.name || 'happy';
  const E = o.E || ex(BY.loupe, name, { talk, look: o.look || [0, 0], blink: name === 'happy' || name === 'explaining' ? (talk ? 0 : blinkAt(t)) : 0 });
  return loupe(c, lx, ly, r, { E, rot: o.rot ?? -.08, yaw: o.yaw || 0, pose: { scarf: o.scarf ?? true, ...(o.pose || {}) }, inside: o.inside || null, fx: o.fx });
}

/* ---------- các bạn côn trùng ---------- */
export function chirpAt(c, x, y, k, o = {}) {
  return drawChar(c, BY.chirp, { x, y, k, yaw: o.yaw ?? 1.15, flip: !!o.flip, detail: o.detail || 0, showFx: false, expr: o.E || ex(BY.chirp, 'happy', { look: o.look || [.4, 0], blink: blinkAt(o.t || 0, .2) }),
    pose: { chirp: o.chirp || 0, earGlow: o.earGlow || 0, ant: o.ant || 0, lift: o.hop || 0, ...(o.frontL ? { frontL: o.frontL } : {}) } });
}
export function waggleAt(c, x, y, k, o = {}) {
  return drawChar(c, BY.waggle, { x, y, k, yaw: o.yaw ?? .6, flip: !!o.flip, lean: o.lean || 0, showFx: false, expr: o.E || ex(BY.waggle, 'happy', { look: o.look || [.3, 0] }),
    pose: { wing: o.wing ?? 0, wag: o.wag || 0, pitch: o.pitch || 0 } });
}
export function blinkFly(c, x, y, k, o = {}) {
  return drawChar(c, BY.blink, { x, y, k, yaw: o.yaw ?? .5, flip: !!o.flip, showFx: false, expr: o.E || ex(BY.blink, 'happy', { look: o.look || [.3, 0] }),
    pose: { glow: o.glow ?? .7, fly: o.fly ?? 0, lift: o.lift || 0, tailUp: o.tailUp || 0 } });
}
export function dotAt(c, x, y, k, o = {}) {
  return drawChar(c, BY.dot, { x, y, k, yaw: o.yaw ?? .4, flip: !!o.flip, showFx: false, expr: o.E || ex(BY.dot, 'happy', { look: o.look || [.3, 0] }),
    pose: { scarf: o.scarf ?? true, lift: o.lift || 0, ...(o.legsUp ? { legsUp: o.legsUp } : {}) } });
}
// Rollo lăn viên tròn (hoặc quả cầu tuyết: snow = true): đi thẳng tắp, viên tròn quay đúng quãng đường
export function rolloAt(c, x, y, k, dist, o = {}) {
  const yaw = o.yaw ?? -1.4, B = rigPt(x, y, k, yaw, 0, [0, -.72, -1.55]), R = .72 * k * (o.ballK || 1), spin = dist / R;
  c.save(); c.beginPath(); c.arc(B[0], B[1] - (R - .72 * k), R, 0, TAU); c.clip();
  c.fillStyle = o.snow ? '#D3E9F7' : '#8E430B'; c.fill(); circle(c, B[0] - R * .14, B[1] - (R - .72 * k) - R * .14, R, o.snow ? '#F4FBFF' : C.honeyD);
  for (const [a, rr, s] of [[0, .45, .26], [2.1, .5, .2], [4.0, .38, .17], [5.2, .62, .13]]) circle(c, B[0] + Math.cos(a + spin) * R * rr, B[1] - (R - .72 * k) + Math.sin(a + spin) * R * rr, R * s, o.snow ? '#E3F0FA' : C.honey);
  c.restore();
  drawChar(c, BY.rollo, { x, y, k, yaw, showFx: false, flip: !!o.flip, expr: ex(BY.rollo, o.expr || 'happy', { look: [.3, .1] }), pose: { showBall: false, ...(o.scarf ? {} : {}) } });
}

/* ---------- hiệu ứng ---------- */
export function sparkles(c, x, y, R, p, n = 6, col = C.lemon, s = 14) { if (p <= 0 || p >= 1) return; for (let i = 0; i < n; i++) { const a = i * TAU / n + .3; star(c, x + Math.cos(a) * R * eo(p), y + Math.sin(a) * R * eo(p), s * (1 - p), col); } }
export function breath(c, x, y, s, p) {                         // hơi thở "haaa": các cuộn mây ấm bay ra
  if (p <= 0 || p >= 1) return;
  for (let i = 0; i < 5; i++) { const q = clamp(p * 1.4 - i * .1); if (q <= 0 || q >= 1) continue; circle(c, x + s * (q * 3.2 + i * .1), y - s * (Math.sin(q * 3) * .3 + i * .05), s * (.25 + .35 * q), `rgba(255,248,231,${.8 * (1 - q)})`); }
}
export function notes(c, x, y, t, n = 4, col = C.lemon, s = 40) {   // nốt nhạc bay lên
  for (let i = 0; i < n; i++) { const p = (t * .6 + i / n) % 1, nx = x + Math.sin(p * 6 + i) * 50 + i * 30 - n * 15, ny = y - p * 260; c.save(); c.globalAlpha = 1 - p; circle(c, nx, ny, s * .3, col); capsule(c, nx + s * .26, ny, nx + s * .26, ny - s * .9, s * .1, col); capsule(c, nx + s * .26, ny - s * .9, nx + s * .6, ny - s * .7, s * .1, col); c.restore(); }
}
// vòng chuyển cảnh qua kính (giống các Short): kính lớn dần, cảnh sau nằm sẵn trong kính
export function lensIris(c, t, t0, t1, x, y, r0, from, to, o = {}) {
  const u = ei(seg(t, t0, t1)), R = lerp(r0, 2400, u);
  from(c);
  loupe(c, x, y, R, { E: ex(BY.loupe, 'surprised', { talk: talkAt(t), look: [0, -.4] }), rot: -.1, pose: { ...ARM.up, scarf: true }, inside: cc => to(cc) });
}
// "lặn" vào ký ức qua lỗ băng đã tan trên trang sổ: lỗ tròn lớn dần thành cả khung, bên trong là cảnh ký ức
export function holeDive(c, t, t0, t1, hole, from, to) {
  const u = ei(seg(t, t0, t1)), R = lerp(hole.r, 2300, u);
  c.save(); const z = lerp(1, 2.2, u); c.translate(hole.x, hole.y); c.scale(z, z); c.translate(-hole.x, -hole.y); from(c); c.restore();
  c.save(); c.beginPath(); c.arc(lerp(hole.x, 960, u), lerp(hole.y, 540, u), R, 0, TAU); c.clip(); to(c); c.restore();
  c.strokeStyle = 'rgba(255,248,231,.9)'; c.lineWidth = 24 * (1 - u); c.beginPath(); c.arc(lerp(hole.x, 960, u), lerp(hole.y, 540, u), R, 0, TAU); c.stroke();
}
// ra khỏi ký ức: cảnh ký ức thu nhỏ về lại trang sổ (ngược holeDive)
export function holeOut(c, t, t0, t1, hole, mem, page) { holeDive(c, t1 - (t - t0), t0, t1, hole, page, mem); }
