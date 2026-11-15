// SHORT-015 · Grasshoppers Play Their Legs Like a Violin! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp: Hop lại kéo "vĩ cầm" đúng như khung đầu.
// Bản B theo lượt nâng cấp 11/2026 (PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §4): kính lớn có máy trôi, bí mật xảy ra thành chuyển động
// (mỗi gai vấp qua mép cánh là một tiếng tách, một nốt nhạc), người nói có trên hình, phụ đề ở vùng an toàn. Nhân vật v2 "Kẹo Phẳng Viền".
import { LOOK } from '/_shared/characters/look.js';
LOOK.v = 2;   // (11/2026) tập mới dùng phong cách nhân vật v2
LOOK.cheer = true;   // (11/2026) mặt nhân vật luôn vui tươi (QUALITY.md §5, stage.js cheerExpr)
import { C, popText, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { makeTalk, blinkAt, ex, rigPt, look, toScreen, loupe, ARM, shadow, subtitle, LENS_UP, hookTitle, SAFE } from '/_shared/episode.js';
import { STAGE, sky, bandshell, spotlight, motes, stump, foreground, noteGlyph, NOTE_COL, macro, violin, squeakFx } from './props.js';
import { LINES, CARDS, DUR, HIT, MACRO_U } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const decay = (t, list, k = 6) => list.reduce((s, h) => s + (t >= h ? Math.exp(-(t - h) * k) : 0), 0);
const arc = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];
const line = id => LINES.find(l => l.id === id);
const inLine = (t, id, pre = 0, post = 0) => { const l = line(id); return t >= l.t - pre && t < l.t + l.dur + post; };

/* ================= nhịp kéo chân: đùi đi từ cực này sang cực kia giữa hai mốc liền nhau ================= */
export function strokePos(t, L) {
  if (t <= L[0]) return { p: 1, v: 0 };
  if (t >= L[L.length - 1]) return { p: (L.length - 1) % 2 ? -1 : 1, v: 0 };
  let i = 0; while (t >= L[i + 1]) i++;
  const u = (t - L[i]) / (L[i + 1] - L[i]), a = i % 2 ? -1 : 1;
  return { p: a - 2 * a * (1 - Math.cos(Math.PI * u)) / 2, v: Math.sin(Math.PI * u) };
}

/* ================= nhân vật ================= */
const HP = { x: 400, k: 150, yaw: 1.25 }, LP = { x: 770, x2: 730, xg: 745, r: 108 };
const hopE = (name, t, o = {}) => ex(BY.hop, name, { blink: o.closed ? 0 : blinkAt(t, .55), ...o });
const HOP_REST = { lift: 0, crouch: 0, fiddle: 0, bow: Math.PI / 2, ear: 0, earCover: 0, frontL: null, frontR: null, ant: 0, hindUp: 0, pegs: false, wingOpen: 0 };
function drawHop(c, s) {
  drawChar(c, BY.hop, { x: s.x, y: s.y, k: HP.k, yaw: s.yaw, lean: s.lean || 0, exprPose: false, showFx: !!s.fx, expr: s.E, pose: { ...HOP_REST, ...s.pose } });
}
// móc (thời gian vòng lặp: t âm = cuối phim): kéo chân, nhắm mắt ở lượt to, nhìn Miss Loupe ở lượt nhỏ
function hopHook(t) {
  const L = HIT.strokes0, { p, v } = strokePos(t, L);
  const amp = (t < L[0] ? ss(seg(t, L[0] - .35, L[0])) : 1) * (1 - ss(seg(t, L.at(-1), L.at(-1) + .4)));
  const loud = HIT.loud0.some(s => t >= s - .02 && t < s + .26);
  const s = { x: HP.x, y: STAGE.y, yaw: HP.yaw, lean: -.02 * v * amp, pose: { fiddle: amp * p, lift: .025 * v * amp, ant: .6 * Math.sin(t * 7) } };
  const peek = t > HIT.curious[0] && t < HIT.zoom[0];
  s.E = loud ? hopE('laugh', t, { closed: 'happy' }) : peek ? hopE('confident', t, { look: [.8, -.15] }) : hopE('happy', t, { look: [.85, -.1] });
  return s;
}
// kính: đùi kéo chậm, to (lượt 1 và lượt 2); giữa hai lượt (cận cảnh) kéo nhẹ
function hopLens(t) {
  const L1 = HIT.strokes1, L2 = HIT.strokes2;
  let p = 0, amp = 0, v = 0;
  if (t < L1.at(-1) + .2) { ({ p, v } = strokePos(t, L1)); amp = ss(seg(t, L1[0] - .35, L1[0])); }
  else if (t < L2[0] - .1) { p = Math.sin((t - L1.at(-1)) * 5); amp = .6; }
  else { ({ p, v } = strokePos(t, L2)); amp = 1 - ss(seg(t, L2.at(-1), L2.at(-1) + .3)); }
  return { x: HP.x, y: STAGE.y, yaw: HP.yaw, lean: -.02 * v * amp, pose: { fiddle: amp * p, lift: .02 * v * amp, ant: .5 * Math.sin(t * 6) }, E: hopE(t > HIT.violin ? 'laugh' : 'happy', t, { look: [.85, -.1], closed: t > HIT.violin ? 'happy' : 0 }) };
}
// gag: xem Miss Loupe, giật mình vì "squeak", bật cười, rồi giơ chân sau và lại kéo (nối về khung đầu)
function hopGag(t) {
  if (t >= HIT.loop[0] - .02) return hopHook(t - DUR);
  const s = { x: HP.x, y: STAGE.y, yaw: HP.yaw, lean: 0, pose: { ant: .4 * Math.sin(t * 5) } };
  const jolt = Math.sin(Math.PI * seg(t, HIT.squeak, HIT.squeak + .25)), gig = seg(t, HIT.giggle[0], HIT.giggle[1]), gg = gig > 0 && gig < 1;
  const rd = Math.sin(Math.PI * seg(t, HIT.ready[0], HIT.loop[0] + .1));
  s.pose.lift = .07 * jolt + (gg ? .05 * Math.abs(Math.sin((t - HIT.giggle[0]) * 18)) : 0);
  s.pose.ant = jolt > .1 ? 1.5 : gg ? 2 * Math.sin(t * 9) : s.pose.ant;
  s.pose.hindUp = .55 * rd;
  s.yaw = lerp(HP.yaw, .8, Math.sin(Math.PI * seg(t, HIT.giggle[0] - .2, HIT.shrug[1])));
  if (gg) s.pose.frontR = [.4, -.95, 1.32];
  const watch = t > HIT.legUp[0] && t < HIT.squeak;
  s.E = t >= HIT.squeak && t < HIT.giggle[0] ? hopE('surprised', t, { look: [.8, -.2], blink: Math.abs(t - (HIT.hush[0] + .25)) < .05 ? 1 : 0 })
    : gg ? hopE('silly', t) : t >= HIT.giggle[1] && t < HIT.ready[0] ? hopE('laugh', t, { look: [.4, -.1] })
    : t >= HIT.ready[0] ? hopE('confident', t, { look: [.85, -.1] }) : watch ? hopE('curious', t, { look: [.85, -.25] }) : hopE('happy', t, { look: [.85, -.1] });
  return s;
}
function hopAt(t) { return t < HIT.zoom[0] ? hopHook(t) : t < HIT.lensDown[0] ? hopLens(t) : hopGag(t); }
// điểm trên đùi sau phía gần (toạ độ cảnh): u 0 = hông, 1 = gối
function femurPt(s, u = .5, off = [0, 0, 0]) {
  const saw = (s.pose.fiddle || 0), hip = [.32, -.76, -.3], knee = [.47, -1.38 - (s.pose.hindUp || 0) * .3 - saw * .2, -.98];
  const p = [lerp(hip[0], knee[0], u) + off[0], lerp(hip[1], knee[1], u) - (s.pose.lift || 0) + off[1], lerp(hip[2], knee[2], u) + off[2]];
  return rigPt(s.x, s.y, HP.k, s.yaw, s.lean || 0, p);
}

/* ---------- Miss Loupe trên sân khấu: trả về chân (x, y), r, độ nghiêng, dáng tay chân, biểu cảm ---------- */
const lensOf = L => { const th = L.rot; return [L.x + Math.sin(th) * LENS_UP * L.r, L.y - Math.cos(th) * LENS_UP * L.r]; };
function loupeHook(t) {
  const r = LP.r, talk = talkAt(t);
  const L = { x: LP.x, y: STAGE.y, r, rot: -.06, pose: {}, E: null, fx: false };
  const st = Math.sin(Math.PI * seg(t, HIT.startle[0], HIT.startle[1]));
  L.y -= 52 * st;
  const wig = seg(t, HIT.wiggle[0], HIT.wiggle[1]), wg = wig > 0 && wig < 1, lift = Math.sin(Math.PI * wig);
  const cur = t > HIT.curious[0] && t < HIT.hopTo[0], hop = seg(t, HIT.hopTo[0], HIT.hopTo[1]), up = ss(seg(t, HIT.raise[0], HIT.raise[1]));
  if (t >= HIT.hopTo[0]) { const p = arc([LP.x, STAGE.y], [LP.x2, STAGE.y], ei(hop), 95); L.x = p[0]; L.y = p[1]; }
  if (st > .05) { L.pose = { handL: [-.82, -1.3, .1], handR: [.82, -1.3, .1] }; L.E = ex(BY.loupe, 'surprised', { look: [-.7, 0], fx: true }); L.fx = true; }
  else if (wg) {
    L.pose = { handL: [-.5, -.66, .12], handR: [.5, -.66, .12], elbowL: [-.7, -.92, 0], elbowR: [.7, -.92, 0], footR: [.2 + .05 * Math.sin(t * 30) * lift, -.17 - .24 * lift, .2 * lift] };
    L.E = ex(BY.loupe, talk ? 'explaining' : 'curious', { talk, look: [.15, .85], blink: 0 }); L.rot = -.06 + .05 * lift;
  } else if (cur) {
    L.pose = { handR: [.16, -.8, .5], elbowR: [.58, -.68, .25] }; L.rot = -.06 - .1 * Math.sin(Math.PI * seg(t, HIT.curious[0], HIT.hopTo[0]));
    L.E = ex(BY.loupe, 'curious', { look: [-.9, .15], fx: true }); L.fx = true;
  } else if (t >= HIT.hopTo[0]) {
    L.pose = up > .3 ? ARM.peer : ARM.up; L.rot = -.12 + .06 * up;
    L.E = ex(BY.loupe, 'excited', { talk, look: [-.6, .1], blink: 0 });
  } else if (talk) { L.pose = ARM.point; L.E = ex(BY.loupe, 'explaining', { talk, look: [-.05, .05] }); }
  else L.E = ex(BY.loupe, 'happy', { look: [-.8, .12], blink: blinkAt(t, .2) });
  return L;
}
function loupeGag(t) {
  if (t >= HIT.home[1]) return loupeHook(t - DUR);
  const r = LP.r, talk = talkAt(t);
  const L = { x: LP.x2, y: STAGE.y, r, rot: -.04, pose: {}, E: null, fx: false };
  const stp = seg(t, HIT.step[0], HIT.step[1]);
  if (stp > 0) { const p = arc([LP.x2, STAGE.y], [LP.xg, STAGE.y], ei(stp), 50); L.x = p[0]; L.y = p[1]; }
  const hm = seg(t, HIT.home[0], HIT.home[1]);
  if (hm > 0) { const p = arc([LP.xg, STAGE.y], [LP.x, STAGE.y], ei(hm), 80); L.x = p[0]; L.y = p[1]; }
  const legUp = ss(seg(t, HIT.legUp[0], HIT.legUp[1])) * (1 - ss(seg(t, HIT.hush[1], HIT.hush[1] + .25)));
  const rub = seg(t, HIT.rub[0], HIT.rub[1]), rubbing = rub > 0 && rub < 1, w = (t - HIT.rub[0]) * TAU * 3.6;
  const frozen = t >= HIT.squeak && t < HIT.hush[1];
  if (legUp > 0) {
    // bắt chước Hop: chân "ống mì" duỗi ra ngoài thân rồi kéo lên kéo xuống dọc sườn (như đùi Hop dọc mép cánh); đứng một chân, nghiêng giữ thăng bằng
    const A = [-.98, -.3, .12], B = [-.86, -.95, .12], m = rubbing ? .5 - .5 * Math.cos(w) : frozen ? .5 : .15;
    const f = [lerp(A[0], B[0], m), lerp(A[1], B[1], m), lerp(A[2], B[2], m)];
    L.pose = { footL: [lerp(-.17, f[0], legUp), lerp(-.17, f[1], legUp), lerp(0, f[2], legUp)], handL: [-.55, -1.95, .1], elbowL: [-.75, -1.45, 0], handR: [1.0, -1.3, .1], elbowR: [.7, -1.15, 0] };
    L.rot = .07 * legUp + (rubbing ? .025 * Math.sin(w) : .015 * Math.sin(t * 9) * legUp) + (frozen ? .02 * Math.sin(t * 60) * Math.exp(-(t - HIT.squeak) * 6) : 0);
    L.E = frozen ? ex(BY.loupe, 'surprised', { look: [-.2, .4] }) : rubbing ? ex(BY.loupe, 'strain', {}) : ex(BY.loupe, 'confident', { talk, look: [-.1, -.2] });
  } else if (inLine(t, 'L08', .1, .1)) {
    const sh = Math.sin(Math.PI * seg(t, HIT.shrug[0], HIT.shrug[1]));
    L.pose = sh > .1 ? ARM.shrug : { handL: [-.3, -.85, .5], handR: [.3, -.85, .5], elbowL: [-.62, -.75, .2], elbowR: [.62, -.75, .2] };
    L.E = ex(BY.loupe, sh > .1 ? 'happy' : 'shy', { talk, look: sh > .1 ? [-.1, .1] : [-.05, .85], fx: sh <= .1, blink: 0 }); L.fx = sh <= .1;
  } else if (t >= HIT.ask - .1) {
    const home = ss(seg(t, HIT.home[0] + .3, HIT.home[1]));
    L.pose = home > .5 ? {} : ARM.up; L.rot = lerp(-.02, -.06, home);
    L.E = home > .5 ? ex(BY.loupe, 'happy', { look: [-.8, .12] }) : ex(BY.loupe, 'excited', { talk, look: [0, -.05], blink: 0 });
  } else if (t >= HIT.hush[1]) { L.E = ex(BY.loupe, 'surprised', { look: [-.6, .1] }); L.pose = { handL: [-.6, -1.0, .2], handR: [.6, -1.0, .2] }; }
  else { L.pose = { handR: [.2, -.85, .55], elbowR: [.62, -.8, .2] }; L.E = ex(BY.loupe, 'excited', { talk, look: [0, 0], blink: talk ? 0 : blinkAt(t) }); }
  return L;
}
function drawLoupe(c, L) { if (!L) return; const [lx, ly] = lensOf(L); shadow(c, L.x + 6, STAGE.y + 4, 110, .22); loupe(c, lx, ly, L.r, { E: L.E, rot: L.rot, pose: L.pose, fx: L.fx, yaw: L.yaw || 0 }); }

/* ================= SÂN KHẤU: thế giới (toạ độ cảnh) ================= */
// nốt nhạc bật ra ở các lượt kéo to (toạ độ cảnh, gần gối của đùi sau); tính theo thời gian vòng lặp để khung cuối nối khung đầu
const NOTE_SPAWN = HIT.loud0.map((s, i) => ({ s, i }));
function stageNotes(c, t, hs) {
  const knee = femurPt(hs, .9, [0, -.15, 0]);
  for (const tt of (t > DUR - 1.4 ? [t - DUR] : [t])) for (const N of NOTE_SPAWN) {
    const d = tt - N.s; if (d < 0 || d > 1.15) continue;
    const q = d / 1.15, sd = N.i % 2 ? 1 : -1, x = knee[0] + 20 + (60 + 50 * sd) * eo(q) + 26 * Math.sin(d * 5 + N.i), y = knee[1] - 50 - 290 * eo(q);
    noteGlyph(c, x, y, (.85 + .2 * (N.i % 2)) * back(clamp(d / .18), 2.6), NOTE_COL[N.i % NOTE_COL.length], -.2 + .3 * Math.sin(d * 4 + N.i), N.i, 1 - seg(q, .75, 1));
  }
}
function stageWorld(c, t, o = {}) {
  const px = o.par || 0;
  c.save(); c.translate(px * .35, 0); sky(c, t); c.restore();
  bandshell(c, t, 1 + .3 * decay(t, HIT.loud0, 5));
  spotlight(c, t, HP.x + 20, .09);
  stump(c, t);
  motes(c, t);
  const hs = o.hs || hopAt(t);
  shadow(c, hs.x - 40, STAGE.y + 6, 250, .22); drawHop(c, hs);
  if (o.ls) drawLoupe(c, o.ls);
  if (!o.noNotes) stageNotes(c, t, hs);
}
function hookCam(t) {
  const [cx, cy, z] = K([[-1.2, [548, 984, 1.26]], [0, [550, 982, 1.28]], [1.0, [545, 985, 1.31]], [2.2, [535, 987, 1.33]], [2.85, [522, 987, 1.35]], [HIT.zoom[0], [508, 985, 1.36]], [HIT.zoom[0] + 1, [508, 985, 1.36]]])(t);
  const sh = decay(t, [HIT.strokes0[3]], 10) + .6 * decay(t, [HIT.startle[0]], 9) + .5 * decay(t, [HIT.strokes0[11]], 9);
  return { cx: cx + 5 * Math.sin(t * 47) * sh, cy: cy + 4 * Math.sin(t * 39) * sh, z };
}
// kính lớn: máy giữ khung của lúc kính bật lên, trôi rất chậm
function lensCam(t) { const h = hookCam(HIT.zoom[0]); const d = t - HIT.zoom[0]; return { cx: h.cx - 2 * d, cy: h.cy, z: h.z + .002 * d }; }
function gagCam(t) {
  const L7 = line('L07'), h0 = lensCam(HIT.lensDown[1]);
  const toL = ss(seg(t, HIT.legUp[0] - .3, HIT.rub[1])) * (1 - ss(seg(t, HIT.giggle[0], HIT.giggle[1] + .3)));
  const both = ss(seg(t, HIT.giggle[0], HIT.giggle[1] + .3));
  let cx = lerp(h0.cx, 560, ss(seg(t, HIT.lensDown[1], L7.t + .6))), cy = lerp(h0.cy, 1000, ss(seg(t, HIT.lensDown[1], L7.t + .6))), z = lerp(h0.z, 1.36, ss(seg(t, HIT.lensDown[1], L7.t + .6)));
  cx = lerp(cx, LP.xg - 10, toL); cy = lerp(cy, 1130, toL); z = lerp(z, 1.62, toL);
  cx = lerp(cx, 560, both * (1 - toL)); cy = lerp(cy, 1000, both * (1 - toL)); z = lerp(z, 1.32, both * (1 - toL));
  const k = ss(seg(t, HIT.home[0], DUR - .1)), hh = hookCam(t - DUR);
  const sh = decay(t, [HIT.squeak], 10) * .8;
  return { cx: lerp(cx, hh.cx, k) + 5 * Math.sin(t * 51) * sh, cy: lerp(cy, hh.cy, k) + 4 * Math.sin(t * 43) * sh, z: lerp(z, hh.z, k) };
}
const TITLE = [{ text: 'SINGING', y: 300, px: 172, fill: C.lemon, shadow: C.ink, t0: HIT.words[0] }, { text: 'LEGS?!', y: 505, px: 210, fill: C.cream, shadow: C.berryD, t0: HIT.words[1] }];
function sHook(c, t, o = {}) {
  const cam = hookCam(t);
  look(c, cam, () => { stageWorld(c, t, { ls: loupeHook(t), hs: hopHook(t), par: cam.cx - 540 }); });
  foreground(c, t);
  const wob = [HIT.strokes0[3], HIT.startle[0]].reduce((a, h) => a + (t > h ? Math.sin((t - h) * 16) * Math.exp(-(t - h) * 5) * .05 : 0), 0);
  if (!o.noTitle) hookTitle(c, TITLE, t, { gone: ss(seg(t, HIT.titleOut[0], HIT.titleOut[1])), cy: 400, wob });
}

/* ================= KÍNH LỚN (3,55–16,0 s): chân sau → cận cảnh hàng gai → vĩ cầm ================= */
function loupeWorldAt(t) { return t < HIT.lensDown[0] + .01 ? loupeHook(Math.min(t, HIT.zoom[0])) : loupeGag(t); }
function lensBig(t) {
  const up = ss(seg(t, HIT.zoom[0], HIT.zoom[1])), dn = ss(seg(t, HIT.lensDown[0], HIT.lensDown[1])), big = up * (1 - dn);
  const cam = t < HIT.lensDown[1] ? lensCam(t) : gagCam(t), Lw = loupeWorldAt(t < HIT.lensDown[0] ? HIT.zoom[0] : Math.max(t, HIT.lensDown[1]));
  const [wx, wy] = lensOf(Lw), st = toScreen(cam, wx, wy);
  const sh = (decay(t, HIT.ticksUp, 12) * 3 + (t > HIT.zzzip[0] && t < HIT.zzzip[1] + .1 ? 4 * Math.sin(Math.PI * seg(t, HIT.zzzip[0], HIT.zzzip[1] + .1)) : 0));
  const side = ss(seg(t, HIT.out[0], HIT.out[1] + .15));               // "It's like a violin bow!": kính sang trái, vĩ cầm bên phải
  const bx = lerp(540, 425, side) + 12 * Math.sin(t * 1.3) + sh * Math.sin(t * 53), by = 640 + 10 * Math.sin(t * 1.7) + sh * Math.cos(t * 47), br = lerp(340, 300, side) + 6 * Math.sin(t * 2.1);
  const hop = Math.sin(Math.PI * seg(t, HIT.zoom[0], HIT.zoom[1])) * 110 - Math.sin(Math.PI * seg(t, HIT.lensDown[0], HIT.lensDown[1])) * 60;
  return { x: lerp(st[0], bx, big), y: lerp(st[1], by, big) - hop, r: lerp(Lw.r * cam.z, br, big), big, cam };
}
// trong kính (chế độ rig): điểm cảnh ở tâm kính và độ phóng; lao sâu vào mặt dưới của đùi rồi chuyển sang cận cảnh
function lensFocus(t) {
  const hs = hopAt(t), f = femurPt(hs, .55, [0, .12, 0]);
  const deep = ei(seg(t, HIT.deep[0], HIT.deep[1])), back_ = 1 - ei(seg(t, HIT.out[0], HIT.out[1]));
  const m = t < HIT.out[0] ? deep : back_;
  return { fx: f[0] + 8 * Math.sin(t * .9), fy: f[1] + 6 * Math.sin(t * 1.1), mag: lerp(1.85, 7, m), mac: t < HIT.out[0] ? ss(seg(t, HIT.deep[0] + .3, HIT.deep[1])) : 1 - ss(seg(t, HIT.out[0], HIT.out[1] - .15)) };
}
// trạng thái cận cảnh: u (gai nào đang ở đỉnh gờ), đùi nhấc, các tiếng tách, nốt nhạc, kéo nhanh
const MU = K(MACRO_U.map(([t, u]) => [t, [u]]));
const FZ = HIT.zzzip, f0 = 2.2, f1 = 9;
const phiAt = t => { const d = clamp(t - FZ[0], 0, FZ[1] - FZ[0]), D_ = FZ[1] - FZ[0]; return TAU * (f0 * d + (f1 - f0) * d * d / (2 * D_)); };
function macroU(t) { if (t < FZ[0]) return MU(t)[0]; return 1.5 - 2 * Math.cos(phiAt(t)); }
const FAST_TICKS = (() => { const out = []; let prev = macroU(FZ[0]); for (let t = FZ[0]; t < FZ[1] + .3; t += 1 / 240) { const u = macroU(t); if (Math.floor(u) !== Math.floor(prev)) out.push({ t, i: Math.max(Math.floor(u), Math.floor(prev)) }); prev = u; } return out; })();
const TICKS = [...HIT.ticksUp.map((t, i) => ({ t, i })), ...HIT.ticksDown.map((t, i) => ({ t, i: 4 - i })), ...FAST_TICKS];
const MNOTES = [...HIT.ticksUp.map((t, i) => ({ t, i })), ...HIT.ticksDown.map((t, i) => ({ t, i: i + 5 })), ...Array.from({ length: 10 }, (_, k) => ({ t: FZ[0] + .1 + k * .07, i: k + 10 }))];
function macroState(t) {
  const lift = 1 - ss(seg(t, HIT.touch - .2, HIT.touch));
  const fast = Math.sin(Math.PI * clamp((t - FZ[0]) / (FZ[1] + .25 - FZ[0]))) ** .6 * (t > FZ[0] ? 1 : 0);
  return { t, u: macroU(t), lift, ticks: TICKS.filter(T => T.t <= t && t - T.t < .5), glint: HIT.glint, fast, notes: MNOTES.filter(N => N.t <= t && t - N.t < 1.2) };
}
// nốt nhạc tuôn ra khỏi mặt kính lúc "zzzzip" (toạ độ khung)
function noteStream(c, t, L) {
  for (let k = 0; k < 16; k++) {
    const s = HIT.zzzip[0] + .38 + k * .055, d = t - s; if (d < 0 || d > 1.0) continue;
    const a = -Math.PI / 2 + (k % 2 ? 1 : -1) * (.45 + .9 * ((k * .37) % 1)), q = eo(d / 1.0), R = L.r * (.5 + 1.25 * q);
    noteGlyph(c, L.x + Math.cos(a) * R, L.y + Math.sin(a) * R * .9, 1.15 * back(clamp(d / .15), 2.6), NOTE_COL[k % NOTE_COL.length], .4 * Math.sin(d * 6 + k), k, 1 - seg(d, .7, 1.0));
  }
}
function lensLoupeE(t) {
  const talk = talkAt(t);
  if (t > HIT.zzzip[0] && t < HIT.zzzip[1] + .3) return ex(BY.loupe, 'laugh', { look: [.1, -.6] });
  if (t > HIT.touch && t < HIT.ticksUp[0] + .3) return ex(BY.loupe, 'surprised', { look: [.05, -.6] });
  if (talk) return ex(BY.loupe, 'explaining', { talk, look: [.1, -.55] });
  if (t > HIT.ticksUp[0] && t < HIT.ticksUp.at(-1) + .3) return ex(BY.loupe, 'excited', { look: [.0, -.6] });
  return ex(BY.loupe, 'happy', { look: [.1, -.55], blink: blinkAt(t, .1) });
}
function sLens(c, t) {
  const L = lensBig(t), cam = L.cam, F = lensFocus(t), S = F.mag * cam.z * L.big + (1 - L.big) * cam.z;
  look(c, cam, () => stageWorld(c, t, {}));
  foreground(c, t);
  const ms = F.mac > .01 ? macroState(t) : null;
  loupe(c, L.x, L.y, L.r, {
    E: lensLoupeE(t), rot: lerp(-.1, -.04, L.big), pose: ARM.peer,
    inside: L.big > .02 ? cc => {
      cc.save(); cc.translate(L.x, L.y); cc.scale(S, S); cc.translate(-F.fx, -F.fy); stageWorld(cc, t, { noNotes: true }); cc.restore();
      if (ms) { cc.save(); cc.globalAlpha *= F.mac; cc.translate(L.x, L.y); macro(cc, L.r * .88, ms); cc.restore(); }
      const fl = Math.max(Math.sin(Math.PI * seg(t, HIT.deep[0] + .2, HIT.deep[1] + .05)), Math.sin(Math.PI * seg(t, HIT.out[0], HIT.out[1])));
      if (fl > 0) { cc.fillStyle = `rgba(255,252,236,${.55 * fl})`; cc.fillRect(L.x - L.r, L.y - L.r, 2 * L.r, 2 * L.r); }
    } : null,
  });
  // vòng sáng khi kính lao sâu / lùi ra
  for (const [a, b] of [[HIT.deep[0], HIT.deep[1] + .2], [HIT.out[0], HIT.out[1] + .2]]) { const q = seg(t, a, b); if (q > 0 && q < 1) { c.strokeStyle = `rgba(255,236,150,${.8 * (1 - q)})`; c.lineWidth = 14 * (1 - q) + 2; c.beginPath(); c.arc(L.x, L.y, L.r * (1.05 + .5 * eo(q)), 0, TAU); c.stroke(); } }
  noteStream(c, t, L);
  // cây vĩ cầm cạnh kính: cây vĩ kéo cùng nhịp với đùi Hop (L06 "It's like a violin bow!")
  const vin = back(seg(t, HIT.violin, HIT.violin + .3), 2.4) * (1 - ss(seg(t, HIT.lensDown[0] - .1, HIT.lensDown[0] + .25)));
  if (vin > .01) { const { p } = strokePos(t, HIT.strokes2); violin(c, 880, 610 + 6 * Math.sin(t * 2), .72 * vin, -p, .1 + .03 * Math.sin(t * 1.6)); }
}

/* ================= GAG (16,0–22 s): "Let me try!" → "squeak." → "Oops! No pegs!" → câu hỏi → vòng lặp ================= */
function sGag(c, t) {
  const cam = gagCam(t), ls = loupeGag(t);
  look(c, cam, () => {
    stageWorld(c, t, { ls, hs: hopGag(t), par: cam.cx - 540 });
  });
  foreground(c, t);
  // "squeak." bé tí: vòng tia ở chiếc giày; chữ ở bên trái kính, phía trên râu Hop (không đè mặt, ngoài cột nút phải)
  if (t >= HIT.squeak) {
    const sq = loupeGag(HIT.squeak), [fx, fy] = rigPt(sq.x, sq.y, sq.r, 0, sq.rot, [-.92, -.62, .12]), S = toScreen(cam, fx, fy), Tt = toScreen(cam, LP.xg - 190, 865);
    squeakFx(c, S[0], S[1], Tt[0], Tt[1], t, HIT.squeak, cam.z / 1.3);
  }
}

/* ---------- chữ móc trở lại ở cuối ---------- */
function recallTitle(c, t) { hookTitle(c, TITLE, -1, { gone: 1 - back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: 400 }); }

export function drawFilm(c, t) {
  t = clamp(t, 0, DUR - .001);
  c.save();
  if (t >= HIT.lensDown[1]) sGag(c, t);
  else if (t >= HIT.zoom[0]) sLens(c, t);
  else sHook(c, t);
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t, 500, SAFE.subY);                       // tâm 500: tấm hai dòng rộng nhất vẫn dừng trước cột nút phải (x 940)
  c.restore();
}
export { hopHook, hopGag, loupeHook, macroState };
