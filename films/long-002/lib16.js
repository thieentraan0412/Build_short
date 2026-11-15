// LONG-002 · công cụ dựng cho khung 16:9 (1920×1080): máy quay, phụ đề, chữ lớn, nhân vật đặt sẵn, chuyển cảnh.
// Chép từ films/long-001/lib16.js rồi bỏ phần mùa đông (khăn, băng), thêm Spindle, Flutter, đèn bàn. Nhân vật v2 + luôn vui (film.js bật LOOK).
import { C, REC, circle, ell, capsule, rrect, poly, popText, subFont, wrap, sticker, nope, rings, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { makeTalk, blinkAt, flutterWave, ex, rigPt, loupe, zoomIn, ARM, badge, shadow, LENS_UP, albiePageTip } from '/_shared/episode.js';
import { track, ss, ei } from '/core/lib.js';
import { LINES, CARDS, HIT, DUR } from './timeline.js';

export { C, REC, circle, ell, capsule, rrect, poly, popText, subFont, wrap, sticker, nope, rings, clamp, lerp, seg, back, eo, TAU, drawChar, BY, star, blinkAt, flutterWave, ex, rigPt, loupe, zoomIn, ARM, badge, shadow, LENS_UP, albiePageTip, track, ss, ei, HIT, LINES, DUR };
export const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv, talkAt = T.talkAt;
export const H = HIT;
export const lineOf = id => LINES.find(l => l.id === id);
export const lineBy = (who, text) => LINES.find(l => l.who === who && l.text === text);
export const lineAt = (t, who) => LINES.find(l => l.t <= t && t < l.t + l.dur && (!who || l.who === who));
export const pulse = (t, t0, d = .3) => Math.sin(Math.PI * clamp(seg(t, t0, t0 + d)));   // nảy một lần 0 → 1 → 0
export const hold = (t, a, b, fi = .3, fo = .3) => ss(seg(t, a, a + fi)) * (1 - ss(seg(t, b - fo, b)));
export const after = (t, name, d = .4) => ss(seg(t, H[name], H[name] + d));             // 0 → 1 sau mốc

/* ---------- máy quay 16:9: nhìn vào (cx, cy) với độ phóng z ---------- */
export const cam = (c, k, fn) => { c.save(); c.translate(960, 540); c.scale(k.z, k.z); if (k.rot) c.rotate(k.rot); c.translate(-k.cx, -k.cy); fn(); c.restore(); };
export const camLerp = (a, b, u) => ({ cx: lerp(a.cx, b.cx, u), cy: lerp(a.cy, b.cy, u), z: lerp(a.z, b.z, u), rot: lerp(a.rot || 0, b.rot || 0, u) });
export const drift = (k, t, a = 1) => ({ ...k, cx: k.cx + Math.sin(t * .35) * 14 * a, cy: k.cy + Math.sin(t * .27 + 1) * 8 * a, z: k.z * (1 + .012 * Math.sin(t * .22) * a) });   // máy trôi chậm
export const shake = (t, t0, d = .3, a = 10) => t > t0 && t < t0 + d ? Math.sin((t - t0) * 70) * a * (1 - (t - t0) / d) : 0;

/* ---------- phụ đề 16:9: tấm kem dưới cùng, chữ hiện theo câu đã nói ---------- */
export function subtitle16(c, card, t, cx = 960, y = 990) {
  const a = seg(t, card.t0, card.t0 + .14); if (a <= 0) return;
  c.save(); c.font = subFont(50); c.textAlign = 'left'; c.textBaseline = 'middle';
  const ls = wrap(c, card.text, 1300), lh = 60, w = Math.max(...ls.map(l => c.measureText(l).width)) + 70, h = ls.length * lh + 26;
  let shown = card.parts.filter(p => t >= p.t).map(p => p.text).join(' ').length;
  const s = back(a, 1.6), yy = y - (ls.length - 1) * lh / 2; c.translate(cx, yy); c.scale(s, s);
  rrect(c, -w / 2 + 6, -h / 2 + 9, w, h, 28, 'rgba(30,27,58,.32)');
  rrect(c, -w / 2, -h / 2, w, h, 28, C.cream);
  c.fillStyle = C.ink;
  ls.forEach((l, i) => { if (shown <= 0) return; const lw = c.measureText(l).width; c.fillText(l.slice(0, shown), -lw / 2, (i - (ls.length - 1) / 2) * lh + 3); shown -= l.length + 1; });
  c.restore();
}
export const cardAt = t => CARDS.find(x => t >= x.t0 && t < x.t1);

/* ---------- chữ lớn nảy (có ghi cho readcheck) ---------- */
export function big(c, str, x, y, px, fill, sh, t, t0, o = {}) { if (t < t0) return; popText(c, str, x, y, px, fill, sh, t, t0, { step: .03, ...o }); }
// số lớn nảy ở một chỗ (đếm chân, đếm dấu chân): hiện từ t0, nảy, mờ dần sau life giây
export function countPop(c, n, x, y, t, t0, o = {}) {
  if (t < t0) return; const life = o.life ?? 1e9, f = 1 - ss(seg(t, t0 + life, t0 + life + .25)); if (f <= 0) return;
  const p = back(seg(t, t0, t0 + .22), 2.8), r = o.r ?? 34;
  c.save(); c.translate(x, y); c.scale(p * f, p * f);
  circle(c, 3, 5, r, 'rgba(30,27,58,.3)'); circle(c, 0, 0, r, o.fill || C.lemon);
  c.lineWidth = r * .12; c.strokeStyle = C.ink; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke();
  popText(c, String(n), 0, r * .42, r * 1.25, C.ink, null, -1, 0, { font: subFont, read: false });
  c.restore();
}

/* ---------- viền mực v2 cho đạo cụ vẽ tay: tô rồi viền (đồng bộ với nhân vật "Kẹo Phẳng Viền") ---------- */
export function inked(c, draw, fill, w = 5) { c.beginPath(); draw(c); if (fill) { c.fillStyle = fill; c.fill(); } if (w > 0) { c.lineWidth = w; c.strokeStyle = C.ink; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); } }

/* ---------- nhân vật đặt sẵn (mặt vui: LOOK.cheer bật ở film.js) ---------- */
export function crumbAt(c, x, y, k, o = {}) {
  const w = o.walk || 0, ph = o.ph || 0;
  const FEET = [[-.4, 0, .3], [-.48, 0, -.1], [.4, 0, .3], [.48, 0, -.1]];
  const feet = FEET.map((f, i) => { const s = Math.sin(ph * TAU + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)); return [f[0], -Math.max(0, s) * .14 * w, f[2] + s * .16 * w]; });
  const pose = { q: o.q ?? 0, lift: (o.hop || 0) + Math.abs(Math.sin(ph * TAU)) * .04 * w, bodyLean: o.lean || 0, feet, reach: o.reach || 0, ...(o.arms || {}) };
  if (o.carry !== undefined) pose.carry = o.carry;
  return drawChar(c, BY.crumb, { x, y, k, yaw: o.yaw ?? .7, flip: !!o.flip, showFx: !!o.fx, expr: o.E || ex(BY.crumb, 'happy'), pose, alpha: o.alpha ?? 1 });
}
export const crumbE = (name, t, o = {}) => ex(BY.crumb, name, { talk: talkAt(t, 'crumb'), blink: talkAt(t, 'crumb') ? 0 : blinkAt(t, .6), ...o });
export const UP_ARMS = { armL: [-.32, -2.5, .25], armR: [.32, -2.5, .25] };
export const WAVE_ARMS = { armL: [-.32, -2.5, .25], armR: [.7, -2.9, .3] };

export function albieN(c, x, y, k, t, o = {}) {
  const talk = talkAt(t, 'albie'), name = o.name || (talk ? 'talk' : 'happy');
  const E = o.E || ex(BY.albie, name, { talk, look: o.look || [-.4, -.1], blink: talk || o.closed ? 0 : blinkAt(t, .4), closed: o.closed, tilt: o.tilt });
  return drawChar(c, BY.albie, { x, y, k, yaw: o.yaw ?? -.3, showFx: !!o.fx, expr: E,
    pose: { hop: o.hop || 0, tilt: o.lean || 0, tabsUp: o.tabsUp || 0, page: o.page || null, pageCurl: o.curl ?? .3, open: o.open || 0 } });
}
export function loupeN(c, lx, ly, r, t, o = {}) {
  const talk = talkAt(t, 'loupe'), name = o.name || 'happy';
  const E = o.E || ex(BY.loupe, name, { talk, look: o.look || [0, 0], blink: name === 'happy' || name === 'explaining' ? (talk ? 0 : blinkAt(t)) : 0 });
  return loupe(c, lx, ly, r, { E, rot: o.rot ?? -.08, yaw: o.yaw || 0, pose: { ...(o.pose || {}) }, inside: o.inside || null, fx: o.fx });
}
export function dotAt(c, x, y, k, t, o = {}) {
  const talk = talkAt(t, 'dot');
  return drawChar(c, BY.dot, { x, y, k, yaw: o.yaw ?? .4, flip: !!o.flip, showFx: false,
    expr: o.E || ex(BY.dot, o.name || (talk ? 'talk' : 'happy'), { talk, look: o.look || [.3, 0], blink: talk ? 0 : blinkAt(t, .8) }),
    pose: { lift: o.lift || 0, ...(o.legsUp ? { legsUp: o.legsUp } : {}) } });
}
// Spindle: thân hồng đốm tím, 8 chân; o.thread treo trên tơ; o.hidden giấu 2 chân; o.wings cánh giấy; o.sweater áo sọc ong; o.ant râu giấy (0..1, rủ: o.droop)
export function spindleAt(c, x, y, k, t, o = {}) {
  const talk = talkAt(t, 'spindle');
  const E = o.E || ex(BY.spindle, o.name || (talk ? 'talk' : 'happy'), { talk, look: o.look || [0, 0], blink: talk ? 0 : blinkAt(t, .3) });
  const r = drawChar(c, BY.spindle, { x, y, k, yaw: o.yaw ?? 0, flip: !!o.flip, lean: o.lean || 0, showFx: false, expr: E, alpha: o.alpha ?? 1,
    pose: { thread: !!o.thread, hidden: o.hidden || 0, wings: !!o.wings, sweater: !!o.sweater, lift: o.lift || 0, ...(o.legs ? { legs: o.legs } : {}) } });
  if (o.ant) paperAntennae(c, x, y, k, o.yaw ?? 0, o.ant, o.droop || 0, t, o.lean || 0);
  return r;
}
// râu giấy: hai que giấy cong gắn trên đầu-ngực, đầu tròn; droop 0..1 rủ xuống, > 1 rơi
export function paperAntennae(c, x, y, k, yaw, a, droop, t, lean = 0) {
  if (a <= 0) return;
  const base = rigPt(x, y, k, yaw, lean, [0, -1.18, .4]);
  for (const sd of [-1, 1]) {
    const fall = clamp(droop - 1), dr = clamp(droop), ang = -Math.PI / 2 + sd * (.45 + 1.5 * dr) + Math.sin(t * 6 + sd) * .05;
    const bx = base[0] + sd * k * .16, by = base[1] + fall * k * 2.2, L = k * .85 * a;
    const tipx = bx + Math.cos(ang) * L, tipy = by + Math.sin(ang) * L;
    c.save(); c.globalAlpha *= 1 - clamp(fall * 1.5 - .5);
    c.translate(bx, by); c.rotate(fall * sd * 2.4); c.translate(-bx, -by);
    c.lineCap = 'round'; c.strokeStyle = C.ink; c.lineWidth = k * .13; c.beginPath(); c.moveTo(bx, by); c.quadraticCurveTo(bx + sd * k * .3, by - L * .7 * (1 - dr), tipx, tipy); c.stroke();
    c.strokeStyle = '#F4E6C4'; c.lineWidth = k * .07; c.stroke();
    circle(c, tipx, tipy, k * .14, C.ink); circle(c, tipx, tipy, k * .1, '#F4E6C4');
    c.restore();
  }
}
export function flutterN(c, x, y, k, t, o = {}) {
  return drawChar(c, BY.flutter, { x, y, k, yaw: o.yaw ?? 1.25, lean: o.rot || 0, flip: !!o.flip, showFx: false,
    expr: o.E || ex(BY.flutter, o.name || 'happy', { look: o.look || [.3, .1], blink: blinkAt(t, .1) }),
    pose: { beta: o.beta ?? .32, alpha: o.alpha ?? .78, lift: o.lift || 0, antL: o.ant || 0, antR: o.ant || 0, ...(o.legsUp ? { legsUp: o.legsUp } : {}) } });
}
export function waggleAt(c, x, y, k, t, o = {}) {
  return drawChar(c, BY.waggle, { x, y, k, yaw: o.yaw ?? .6, flip: !!o.flip, lean: o.lean || 0, showFx: false, expr: o.E || ex(BY.waggle, o.name || 'happy', { look: o.look || [.3, 0], blink: blinkAt(t, .5) }),
    pose: { wing: o.wing ?? 0, wag: o.wag || 0, pitch: o.pitch || 0, ...(o.lift ? { lift: o.lift } : {}) } });
}
export function chirpAt(c, x, y, k, t, o = {}) {
  return drawChar(c, BY.chirp, { x, y, k, yaw: o.yaw ?? 1.15, flip: !!o.flip, showFx: false, expr: o.E || ex(BY.chirp, o.name || 'happy', { look: o.look || [.4, 0], blink: blinkAt(t, .2) }),
    pose: { chirp: o.chirp || 0, ant: o.ant || 0, lift: o.hop || 0 } });
}
// Rollo lăn viên tròn: đi thẳng tắp, viên tròn quay đúng quãng đường (dist / R)
export function rolloAt(c, x, y, k, t, dist = 0, o = {}) {
  return drawChar(c, BY.rollo, { x, y, k, yaw: o.yaw ?? -1.4, flip: !!o.flip, showFx: false, expr: ex(BY.rollo, o.name || 'happy', { look: o.look || [.3, .1], blink: blinkAt(t, .7) }),
    pose: { ballSpin: dist / (.72 * k), lift: o.lift || 0 } });
}

/* ---------- hiệu ứng ---------- */
export function sparkles(c, x, y, R, p, n = 6, col = C.lemon, s = 14) { if (p <= 0 || p >= 1) return; for (let i = 0; i < n; i++) { const a = i * TAU / n + .3; star(c, x + Math.cos(a) * R * eo(p), y + Math.sin(a) * R * eo(p), s * (1 - p), col); } }
export function glints(c, x, y, R, t, n = 5, col = C.cream, s = 12) { for (let i = 0; i < n; i++) { const p = (t * .7 + i / n) % 1, a = i * 2.39; c.save(); c.globalAlpha = Math.sin(Math.PI * p); star(c, x + Math.cos(a) * R * (.4 + .6 * ((i * .37) % 1)), y + Math.sin(a) * R * (.4 + .6 * ((i * .61) % 1)), s * (.6 + .6 * Math.sin(Math.PI * p)), col); c.restore(); } }
// vòng chuyển cảnh qua kính (ngữ pháp của kênh): kính lớn dần, cảnh sau nằm sẵn trong kính
export function lensIris(c, t, t0, t1, x, y, r0, from, to) {
  const u = ei(seg(t, t0, t1)), R = lerp(r0, 2400, u);
  from(c);
  loupe(c, x, y, R, { E: ex(BY.loupe, 'excited', { talk: talkAt(t), look: [0, -.4] }), rot: -.1, pose: { ...ARM.up }, inside: cc => to(cc) });
}
// lật trang: trang cũ cuộn sang trái, lộ trang mới (cả hai do caller vẽ)
export function pageFlip(c, t, t0, t1, from, to, dir = 1) {
  const u = ss(seg(t, t0, t1)); if (u <= 0) return from(c); to(c);
  if (u >= 1) return;
  c.save(); c.beginPath(); if (dir > 0) c.rect(0, 0, 1920 * (1 - u), 1080); else c.rect(1920 * u, 0, 1920 * (1 - u), 1080); c.clip(); from(c); c.restore();
  const x = dir > 0 ? 1920 * (1 - u) : 1920 * u; ell(c, x, 540, 60 * Math.sin(Math.PI * u) + 4, 620, 0, 'rgba(30,27,58,.22)'); rrect(c, x - 6, -20, 12, 1120, 6, C.cream);
}
// lia nhanh (whip pan): hai cảnh trượt ngang có vệt mờ
export function whip(c, t, t0, t1, from, to) {
  const u = ei(seg(t, t0, t1)); if (u <= 0) return from(c); if (u >= 1) return to(c);
  c.save(); c.translate(-1920 * u, 0); from(c); c.restore();
  c.save(); c.translate(1920 * (1 - u), 0); to(c); c.restore();
  const a = Math.sin(Math.PI * u); c.fillStyle = `rgba(255,248,231,${.35 * a})`;
  for (let i = 0; i < 9; i++) c.fillRect(0, 60 + i * 115, 1920, 18 + 10 * (i % 3));
}
