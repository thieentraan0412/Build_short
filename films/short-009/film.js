// SHORT-009 · Is a Firefly a Fly? Nope! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp: Fizz bay một vòng rồi đáp về đúng khung đầu.
// Bản B theo lượt nâng cấp 11/2026 (PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §4): kính lớn có máy trôi, bí mật xảy ra thành chuyển động
// (đếm cánh), câu cửa miệng có hành động (albumGulp), người nói có trên hình, phụ đề ở vùng an toàn. Fizz (ruồi) ra mắt: _shared/characters/cast/fizz.js.
import { C, REC, circle, ell, rrect, ground, popText, subFont, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { makeTalk, blinkAt, ex, rigPt, look, toScreen, loupe, ARM, badge, shadow, subtitle, LENS_UP, hookTitle, stickerMatchCut, snapFlash, SAFE, albumGulp } from '/_shared/episode.js';
import { D, duskSky, sunflower, leaf, leafY, bigGlow, countBadge, fizzle, BLINK_WINGS, caseCenter, wingCenter, fizzWingCenter } from './props.js';
import { LINES, CARDS, DUR, HIT } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const pulse = (t, list, a = .12, b = .1) => list.reduce((s, h) => s + Math.sin(Math.PI * seg(t, h - a, h + b)), 0);
const decay = (t, list, k = 6) => list.reduce((s, h) => s + (t >= h ? Math.exp(-(t - h) * k) : 0), 0);
const arc = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];
const line = id => LINES.find(l => l.id === id);
const blendS = (a, b, k) => { const o = { ...a }; for (const key of ['x', 'y', 'yaw', 'glow', 'lift', 'lean']) if (typeof a[key] === 'number' && typeof b[key] === 'number') o[key] = lerp(a[key], b[key], k); if (k > .5) { o.E = b.E; o.legsUp = b.legsUp; o.fx = b.fx; } return o; };

/* ================= nhân vật ================= */
const FZ = { x: 440, k: 98 }, BL = { x: 680, k: 100 }, LS = { x: 285, r: 95 };
const lsLens = () => [LS.x, leafY(LS.x) - LENS_UP * LS.r];
const fizzE = (name, t, o = {}) => ex(BY.fizz, name, { blink: blinkAt(t, .45), ...o });
const blinkE = (name, t, o = {}) => ex(BY.blink, name, { talk: talkAt(t, 'blink'), blink: talkAt(t, 'blink') ? 0 : blinkAt(t, .3), ...o });
function drawFizz(c, s) { drawChar(c, BY.fizz, { x: s.x, y: s.y, k: s.k || FZ.k, yaw: s.yaw, lean: s.lean || 0, showFx: false, expr: s.E, pose: { lift: s.lift || 0, flap: s.flap || 0, buzz: s.buzz || 0, rub: s.rub || 0, legsUp: s.legsUp || null } }); }
const tailOf = s => rigPt(s.x, s.y, s.k || BL.k, s.yaw, s.lean || 0, [0, -.62 - (s.lift || 0), -.78]);
function drawBlink(c, s) {
  if (s.glowR) { const p = tailOf(s); bigGlow(c, p[0], p[1], s.glowR, s.glowA ?? .7); }
  drawChar(c, BLINK_WINGS, { x: s.x, y: s.y, k: s.k || BL.k, yaw: s.yaw, lean: s.lean || 0, showFx: !!s.fx, expr: s.E, pose: { glow: s.glow, lift: s.lift || 0, cases: s.cases || 0, wings: s.wings || 0, legsUp: s.legsUp || null } });
}

/* ---------- Fizz ---------- */
// đường bay tới ở móc (dùng cả cuối phim với t − DUR): từ trên bên trái lượn xuống, chạm lá ở HIT.land
const FLY_IN = K([[-.62, [250, 930]], [-.3, [335, 1010]], [HIT.land, [FZ.x, leafY(FZ.x)]]]);
// vòng bay cuối phim: cất cánh, lượn một vòng quanh khoảng trời giữa, về điểm bắt đầu của FLY_IN
const LOOP = K([[HIT.takeoff, [FZ.x, leafY(FZ.x)]], [HIT.takeoff + .25, [490, 1060]], [HIT.takeoff + .5, [580, 900]], [HIT.takeoff + .72, [450, 780]], [HIT.takeoff + .9, [300, 840]], [DUR - .62, [250, 930]]]);
function fizzHook(t) {
  const s = { x: FZ.x, y: leafY(FZ.x), yaw: .85, flap: 0, buzz: 0, lift: 0, lean: 0, rub: 0, E: null, legsUp: null };
  if (t < HIT.land) { const [x, y] = FLY_IN(t), [x2] = FLY_IN(t + .04); s.x = x; s.y = y; s.flap = .6; s.buzz = t * 60; s.lift = .25; s.yaw = x2 >= x ? .9 : -.9; s.lean = .2 * Math.sin(t * 9); s.E = fizzE('excited', t, { look: [.5, .3] }); return s; }
  const land = Math.sin(Math.PI * seg(t, HIT.land, HIT.land + .25));
  s.lift = -.05 * land + .12 * Math.sin(Math.PI * seg(t, 1.5, 1.8)); s.flap = .4 * (1 - seg(t, HIT.land, HIT.land + .35));
  if (t > HIT.rub[0] && t < HIT.rub[1]) s.rub = 1 + t * .6;
  const atLoupe = t > HIT.hopIn[0] && t < HIT.zoom[0];
  s.yaw = atLoupe ? lerp(.85, -.6, ss(seg(t, HIT.hopIn[0], HIT.hopIn[1]))) : .85;
  s.E = t < HIT.land + .3 ? fizzE('surprised', t, { look: [.6, .1] }) : t > HIT.claim && t < HIT.hush[1] ? fizzE('curious', t, { look: [.9, -.1] }) : atLoupe ? fizzE('surprised', t, { look: [-.8, -.1] }) : fizzE('happy', t, { look: [.85, -.05] });
  return s;
}
function fizzGag(t) {
  const s = { x: FZ.x, y: leafY(FZ.x), yaw: .85, flap: 0, buzz: 0, lift: 0, lean: 0, rub: 0, E: null, legsUp: null };
  if (t >= DUR - .62) return fizzHook(t - DUR);
  if (t >= HIT.takeoff) { const [x, y] = LOOP(t), [x2] = LOOP(t + .04); s.x = x; s.y = y; s.flap = .6; s.buzz = t * 60; s.lift = .25; s.yaw = x2 >= x ? .9 : -.9; s.lean = .3 * Math.sin((t - HIT.takeoff) * 6); s.E = fizzE('excited', t, { look: [0, 0] }); return s; }
  const up = ss(seg(t, HIT.lift[0], HIT.lift[1])) * (1 - ss(seg(t, HIT.fizzle + .2, HIT.fizzle + .5))), strain = seg(t, HIT.strain[0], HIT.fizzle) > 0 && t < HIT.fizzle;
  s.flap = up; s.lift = .05 * up; s.yaw = lerp(.85, .35, up);
  if (strain) { s.lean = .05 * Math.sin(t * 70); s.lift += .03 * Math.abs(Math.sin(t * 35)); }
  const sh = Math.sin(Math.PI * seg(t, HIT.shrug, HIT.shrug + .5));
  if (sh > 0) s.legsUp = [0, [-.7, -.95, .2], 0, 0, [.7, -.95, .2], 0];
  if (t > HIT.rub2[0] && t < HIT.rub2[1]) s.rub = 1 + t * .6;
  const L10 = line('L10'), ask = t > L10.t - .2;
  s.E = strain ? fizzE('strain', t, {}) : t > HIT.fizzle && t < HIT.fizzle + .5 ? fizzE('surprised', t, { look: [-.5, .5] }) : t > HIT.fizzle && t < HIT.shrug + .6 ? fizzE('sad', t) : ask ? fizzE('excited', t, { look: [0, 0] }) : up > .3 ? fizzE('proud', t, { look: [.4, -.3] }) : fizzE('happy', t, { look: [.85, -.05] });
  if (ask) { s.flap = .3 + .25 * Math.abs(Math.sin(t * 7)); s.buzz = t * 30; }
  return s;
}

/* ---------- Blink ---------- */
function blinkHook(t) {
  const s = { x: BL.x, y: leafY(BL.x), yaw: -.9, glow: 1 + .15 * Math.sin(t * 3), lift: 0, cases: 0, wings: 0, E: null, fx: false, legsUp: null, glowR: 130, glowA: .5 };
  const cp = t > HIT.copy[0] && t < HIT.copy[1], claim = ss(seg(t, HIT.claim - .1, HIT.claim + .15)) * (1 - ss(seg(t, HIT.deflate, HIT.deflate + .25)));
  const def = Math.sin(Math.PI * seg(t, HIT.deflate, HIT.deflate + .9));
  if (cp) s.legsUp = [[-.12 + .06 * Math.sin(t * 24), -.82, .95], 0, 0, [.12 - .06 * Math.sin(t * 24), -.82, .95], 0, 0];
  if (claim > .3) s.legsUp = [0, 0, 0, [.5, -1.6, .7], 0, 0];
  s.lift = .1 * Math.sin(Math.PI * seg(t, 1.7, 2.0)) + .1 * claim - .1 * def;
  s.yaw = lerp(-.9, -.3, claim) ; s.glow += .8 * claim - .7 * def; s.glowR = 130 + 120 * claim; s.fx = claim > .3;
  s.E = def > .2 ? blinkE('sad', t) : claim > .3 ? blinkE('excited', t, { look: [-.2, -.1], fx: true }) : cp ? blinkE('laugh', t, { look: [-.8, .1] }) : t > HIT.hopIn[0] && t < HIT.zoom[0] ? blinkE('curious', t, { look: [-.9, -.2] }) : blinkE('happy', t, { look: [-.85, .05] });
  return s;
}
function blinkLens(t) {                                           // trong kính: tấm cánh bật lên rồi cánh mỏng mở; tự hào
  const s = blinkHook(Math.min(t, HIT.zoom[0] - .01));
  s.cases = ss(seg(t, HIT.cases - .05, HIT.cases + .2)); s.wings = ss(seg(t, HIT.wings, HIT.wings + .35));
  const pr = ss(seg(t, HIT.proud - .1, HIT.proud + .2)), L7 = line('L07');
  s.yaw = lerp(-.9, -.35, ss(seg(t, HIT.cases - .3, HIT.cases + .1))); s.lift = .06 * Math.sin(Math.PI * seg(t, HIT.cases, HIT.cases + .3)) + .12 * pr; s.glow = 1.1 + .9 * pr; s.glowR = 140 + 120 * pr; s.fx = pr > .3;
  s.legsUp = null;
  s.E = t > HIT.proud - .1 ? blinkE(t < L7.t + L7.dur ? 'confident' : 'excited', t, { look: [-.1, -.1], fx: true }) : t > HIT.cases ? blinkE('surprised', t, { look: [-.5, -.6] }) : blinkE('curious', t, { look: [-.9, -.1] });
  return s;
}
function blinkGag(t) {
  const s = { x: BL.x, y: leafY(BL.x), yaw: -.9, glow: 1 + .15 * Math.sin(t * 3), lift: 0, cases: 0, wings: 0, E: null, fx: false, legsUp: null, glowR: 130, glowA: .5 };
  const gig = Math.sin(Math.PI * seg(t, HIT.fizzle + .1, HIT.fizzle + .9));
  s.lift = .05 * Math.abs(Math.sin(t * 14)) * gig;
  s.E = gig > .2 ? blinkE('laugh', t, { look: [-.8, .1] }) : t > HIT.strain[0] && t < HIT.fizzle ? blinkE('curious', t, { look: [-.9, -.1] }) : blinkE('happy', t, { look: [-.85, .05] });
  const k = ss(seg(t, DUR - 1.0, DUR - .5));
  return k > 0 ? blendS(s, blinkHook(t - DUR), k) : s;
}

/* ---------- Miss Loupe (cỡ trung, trên lá bên trái) ---------- */
function loupeHook(t) {                                           // bật vào đúng "Nope!" (toạ độ cảnh); null khi chưa vào
  if (t < HIT.hopIn[0]) return null;
  const [wx, wy] = lsLens(), u = seg(t, HIT.hopIn[0], HIT.hopIn[1]), p = u < 1 ? arc([-260, wy + 40], [wx, wy], ei(u), 220) : [wx, wy];
  const land = Math.sin(Math.PI * seg(t, HIT.hopIn[1], HIT.hopIn[1] + .3)), shake = Math.sin(Math.PI * seg(t, line('L03').t, line('L03').t + .6));
  const talk = talkAt(t), raise = ss(seg(t, line('L04').t, line('L04').t + .5));
  const name = talk ? 'explaining' : 'happy';
  return { x: p[0] + 6 * Math.sin(t * 30) * shake, y: p[1] + 18 * land - 50 * raise, r: LS.r, rot: -.08 + .1 * Math.sin(t * 22) * shake, pose: raise > .3 ? ARM.peer : shake > .1 ? ARM.wave : ARM.point, E: ex(BY.loupe, name, { talk, look: [.85, .05], blink: talk ? 0 : blinkAt(t) }) };
}
function loupeGag(t) {
  const [wx, wy] = lsLens(), ex_ = seg(t, HIT.exit[0], HIT.exit[1]);
  if (ex_ >= 1) return null;
  const p = ex_ > 0 ? arc([wx, wy], [-300, wy + 40], ei(ex_), 200) : [wx, wy];
  const talk = talkAt(t), L9 = line('L09'), L10 = line('L10'), fz = Math.sin(Math.PI * seg(t, HIT.fizzle, HIT.fizzle + .4));
  const name = talk ? 'explaining' : fz > .2 ? 'surprised' : t > HIT.fizzle && t < L10.t ? 'laugh' : 'curious';
  const pose = t >= L10.t - .1 && t < L10.t + L10.dur ? ARM.up : talk ? ARM.wave : ARM.peer;
  return { x: p[0], y: p[1] - 10 * Math.abs(Math.sin(t * 2)) - 14 * fz, r: LS.r, rot: -.06 + .05 * Math.sin(t * 1.7), pose, E: ex(BY.loupe, name, { talk, look: t >= L10.t - .2 ? [.05, .15] : [.85, .1], blink: talk ? 0 : blinkAt(t) }) };
}
function drawLoupe(c, L) { if (!L) return; shadow(c, L.x + 8, leafY(L.x) + 2, 120, .2); loupe(c, L.x, L.y, L.r, { E: L.E, rot: L.rot, pose: L.pose }); }

/* ================= CHIẾC LÁ: thế giới (toạ độ cảnh) ================= */
function leafWorld(c, t, o = {}) {
  duskSky(c, t); sunflower(c, t); leaf(c);
  const bs = o.bs, fs = o.fs;
  if (bs) { shadow(c, bs.x, leafY(bs.x) + 2, 90, .2); drawBlink(c, bs); }
  if (fs) { const g = leafY(fs.x); shadow(c, fs.x, g + 2, 70 * clamp(1 - (g - fs.y) / 300, .3, 1), .2); drawFizz(c, fs); }
  if (o.ls) drawLoupe(c, o.ls);
}
function hookCam(t) {
  const [cx, cy, z] = K([[-1, [520, 1090, 1.8]], [0, [520, 1090, 1.8]], [.45, [512, 1086, 1.9]], [HIT.claim, [540, 1084, 1.9]], [HIT.hush[0], [535, 1084, 1.88]], [HIT.hopIn[0], [490, 1086, 1.72]],
    [HIT.hopIn[1] + .2, [470, 1086, 1.68]], [HIT.zoom[0], [470, 1086, 1.66]], [HIT.zoom[0] + 1, [470, 1086, 1.66]]])(t);
  const sh = decay(t, [HIT.land], 9) + .7 * decay(t, [line('L03').t], 8);
  return { cx: cx + 6 * Math.sin(t * 47) * sh, cy: cy + 5 * Math.sin(t * 39) * sh, z };
}
const TITLE = [{ text: "WHO'S", y: 300, px: 190, fill: C.lemon, shadow: C.ink, t0: HIT.words[0] }, { text: 'THE FLY?!', y: 500, px: 170, fill: C.cream, shadow: C.berryD, t0: HIT.words[1] }];
function sHook(c, t, o = {}) {
  look(c, hookCam(t), () => leafWorld(c, t, { bs: blinkHook(t), fs: fizzHook(t), ls: loupeHook(t) }));
  const wob = [HIT.land, HIT.claim].reduce((a, h) => a + (t > h ? Math.sin((t - h) * 16) * Math.exp(-(t - h) * 5) * .06 : 0), 0);
  if (!o.noTitle) hookTitle(c, TITLE, t, { gone: ss(seg(t, HIT.titleOut[0], HIT.titleOut[1])), cy: 400, wob });
}

/* ================= KÍNH LỚN (5,75–13,5 s): đếm cánh ================= */
function lensBig(t) {
  const big = ss(seg(t, HIT.zoom[0], HIT.zoom[1])), cam = hookCam(t), L0 = loupeHook(t), st = toScreen(cam, L0.x, L0.y);
  const sh = decay(t, [HIT.cases, HIT.wings], 9) * 4;
  const bx = 540 + 12 * Math.sin(t * 1.3) + sh * Math.sin(t * 50), by = 690 + 10 * Math.sin(t * 1.7), br = 310 + 6 * Math.sin(t * 2.1);
  const hop = Math.sin(Math.PI * seg(t, HIT.zoom[0], HIT.zoom[1])) * 120;
  return { x: lerp(st[0], bx, big), y: lerp(st[1], by, big) - hop, r: lerp(LS.r * cam.z, br, big), big };
}
// điểm cảnh ở tâm kính và độ phóng: cánh Fizz → lia sang Blink → mặt Blink khi tự hào
const FOCUS = K([[HIT.zoom[0], [FZ.x + 20, leafY(FZ.x) - 80, 1.1]], [HIT.zoom[1], [FZ.x, leafY(FZ.x) - 90, 1.45]], [HIT.pan[0], [FZ.x + 5, leafY(FZ.x) - 92, 1.5]], [HIT.pan[1], [BL.x - 10, leafY(BL.x) - 115, 1.0]],
  [HIT.wings + .5, [BL.x - 5, leafY(BL.x) - 125, .95]], [HIT.proud, [BL.x - 25, leafY(BL.x) - 105, 1.45]], [HIT.snap, [BL.x - 25, leafY(BL.x) - 105, 1.5]]]);
function lensMap(t, L) { const [fx, fy, mag] = FOCUS(t), S = lerp(1, mag, L.big) * hookCam(HIT.zoom[0]).z; return p => [L.x + S * (p[0] - fx), L.y + S * (p[1] - fy)]; }   // điểm cảnh → điểm khung trong mặt kính
function lensWorld(t) { const fs = fizzHook(Math.min(t, HIT.zoom[0] - .01)); fs.flap = ss(seg(t, HIT.spread, HIT.spread + .3)); fs.buzz = fs.flap > .2 ? t * 22 : 0; fs.E = fizzE(t > HIT.count2[0] && t < HIT.pan[0] ? 'proud' : 'happy', t, { look: [.4, -.2] }); fs.rub = 0; fs.yaw = .55; return { fs, bs: blinkLens(t) }; }
function sLens(c, t) {
  const L = lensBig(t), W = lensWorld(t), map = lensMap(t, L), [fx, fy, mag] = FOCUS(t), cam = hookCam(HIT.zoom[0]), S = lerp(1, mag, L.big) * cam.z;
  look(c, hookCam(t), () => leafWorld(c, t, { bs: W.bs, fs: W.fs }));
  const talk = talkAt(t), name = t > HIT.cases && t < HIT.cases + .5 ? 'surprised' : talk ? 'explaining' : t > HIT.proud ? 'laugh' : 'happy';
  loupe(c, L.x, L.y, L.r, {
    E: ex(BY.loupe, name, { talk, look: L.big > .5 ? [.15, .35] : [.75, .1], blink: talk ? 0 : blinkAt(t) }), rot: lerp(-.1, -.05, L.big), pose: ARM.peer,
    inside: L.big > .02 ? cc => { cc.translate(L.x, L.y); cc.scale(S, S); cc.translate(-fx, -fy); leafWorld(cc, t, { bs: W.bs, fs: W.fs }); } : null,
  });
  if (L.big < .9) return;
  // số đếm (toạ độ khung, trong mặt kính): cánh Fizz 1, 2 · tấm cánh Blink 1, 2 · cánh mỏng Blink 3, 4
  c.save(); c.beginPath(); c.arc(L.x, L.y, L.r * .86, 0, TAU); c.clip();
  const fz = W.fs, bl = W.bs;
  if (t < HIT.pan[1] + .1) [-1, 1].forEach((sd, i) => { const p = map(rigPt(fz.x, fz.y, FZ.k, fz.yaw, 0, fizzWingCenter(sd, fz.flap, fz.lift))); countBadge(c, p[0], p[1] - 20, i + 1, t, HIT.count2[i], C.cream, C.ink, 56); });
  if (t > HIT.count4[0] - .05) {
    // tấm cánh: số ở hai vai, đẩy ra ngoài thân; cánh mỏng: số ở hai đầu cánh, xa hơn (không chồng nhau)
    const body = map(rigPt(bl.x, bl.y, BL.k, bl.yaw, 0, [0, -.9 - bl.lift, 0]));
    [-1, 1].forEach((sd, i) => { const q = map(rigPt(bl.x, bl.y, BL.k, bl.yaw, 0, caseCenter(sd, bl.cases, bl.lift))), dx = q[0] - body[0]; countBadge(c, body[0] + Math.sign(dx || sd) * Math.max(95, Math.abs(dx) + 40), q[1] + 30, i + 1, t, HIT.count4[i], C.mint, C.ink, 46); });
    [-1, 1].forEach((sd, i) => { const q = map(rigPt(bl.x, bl.y, BL.k, bl.yaw, 0, wingCenter(sd, bl.wings, bl.lift))), dx = q[0] - body[0]; countBadge(c, body[0] + Math.sign(dx || sd) * Math.min(185, Math.max(150, Math.abs(dx) + 40)), q[1] - 50, i + 3, t, HIT.count4[i + 2], C.white, C.grape, 46); });
  }
  c.restore();
  if (t > HIT.proud - .42) popText(c, 'BEETLE!', 540, 300, 150, C.mint, C.ink, t, HIT.proud - .4, { step: .03, sh: 10 });   // hiện từ ngay trước câu của Blink để đủ thời gian đọc
}

/* ================= SỔ (13,8–17,6 s) ================= */
const SLOT = { x: 280, y: 480, r: 140 }, PAGE = { x: 84, y: 200, w: 890, h: 650 }, DIVE = { x: 610, y: 735 }, MINI = { x: 860, y: 745, r: 76 }, AL = { x: 250, y: 1450, k: 240 };
function stickerArt(cc) { drawChar(cc, BLINK_WINGS, { x: 0, y: 70, k: 72, yaw: -.3, showFx: false, expr: ex(BY.blink, 'excited'), pose: { glow: 1.2, cases: 1, wings: 1 } }); }
function miniArt(cc) { bigGlow(cc, -16, 22, 70, 1); drawChar(cc, BY.blink, { x: 0, y: 50, k: 46, yaw: .4, showFx: false, expr: ex(BY.blink, 'laugh'), pose: { glow: 1.3 } }); }
function albumBlink(t) {
  if (t < HIT.blinkIn[0] || t >= HIT.dive2[1]) return null;
  if (t < HIT.blinkIn[1]) { const u = ss(seg(t, HIT.blinkIn[0], HIT.blinkIn[1])), p = arc([1250, 980], [640, 1080], u, 160); return { x: p[0], y: p[1], k: 92, yaw: -1.1, rot: 0 }; }
  if (t < HIT.dive2[0]) return { x: 640 + 30 * Math.sin((t - HIT.blinkIn[1]) * 3), y: 1080 + 18 * Math.sin((t - HIT.blinkIn[1]) * 5), k: 92, yaw: -.6 + .3 * Math.sin(t * 2), rot: 0 };
  const u = seg(t, HIT.dive2[0], HIT.dive2[1]), p = arc([640, 1080], [DIVE.x, DIVE.y + 30], u, 300); return { x: p[0], y: p[1], k: lerp(92, 34, ei(u)), yaw: -.4, rot: -1.2 * ei(u) };
}
function sAlbum(c, t) {
  const push = 1 + .05 * Math.sin(Math.PI * seg(t, HIT.gulp - .05, HIT.gulp + .6));
  c.save(); c.translate(540, 700); c.scale(push, push); c.translate(-540, -700);
  ground(c, C.mint); ell(c, 200, 1760, 900, 420, 0, C.mintL); ell(c, 540, 1730, 980, 330, 0, C.leaf); ell(c, 540, 1770, 900, 280, 0, C.leafD);
  rrect(c, PAGE.x + 12, PAGE.y + 18, PAGE.w, PAGE.h, 54, C.grape); rrect(c, PAGE.x, PAGE.y, PAGE.w, PAGE.h, 54, C.cream);
  const t0 = HIT.stamp;
  circle(c, SLOT.x, SLOT.y, 142, '#EBDDBC');
  if (t >= HIT.zoomOut[0]) {
    const p = t >= t0 ? back(seg(t, t0, t0 + .22), 2.6) : 1;
    badge(c, SLOT.x, SLOT.y, SLOT.r, C.skyL, cc => { const k = SLOT.r / 100; cc.scale(k, k); stickerArt(cc); }, -.05, t >= t0 ? lerp(1.2, 1, p) : 1);
    popText(c, 'Beetle!', 470, 468, 118, C.berry, null, t, t0 + .1, { align: 'left', step: .02 });
    popText(c, 'wing cases on top', 470, 560, 58, C.ink, null, t, t0 + .2, { align: 'left', step: .012, font: subFont });
  }
  const rq = seg(t, HIT.gulp, HIT.gulp + .8);
  if (rq > 0 && rq < 1) for (let k = 0; k < 3; k++) { const q = clamp(rq * 1.4 - k * .2); if (q > 0 && q < 1) { c.strokeStyle = `rgba(255,227,77,${.9 * (1 - q)})`; c.lineWidth = 12 * (1 - q) + 2; c.beginPath(); c.ellipse(DIVE.x, DIVE.y, 60 + 260 * q, 26 + 90 * q, 0, 0, TAU); c.stroke(); } }
  if (t >= HIT.mini) badge(c, MINI.x, MINI.y, MINI.r, C.night, miniArt, .06, back(seg(t, HIT.mini, HIT.mini + .3), 2.6));
  const talk = talkAt(t, 'albie'), b = albumBlink(t);
  shadow(c, AL.x + 18, AL.y + 4, 220, .18);
  albumGulp(c, t, { x: AL.x, y: AL.y, k: AL.k, talk, line: line('L08'), counts: HIT.counts, tg: HIT.gulp, look: b ? [.75, -.4] : [.5, -.7], blink: talk ? 0 : blinkAt(t, .4) });
  if (b) {
    c.save(); c.translate(b.x, b.y - b.k); c.rotate(b.rot); c.translate(-b.x, -(b.y - b.k));
    const cnt = Math.min(1, pulse(t, HIT.counts, .05, .12)), legs = cnt > .2 ? [0, [-.55, -.55, .1], 0, 0, [.55, -.55, .1], 0] : null;
    drawChar(c, BY.blink, { x: b.x, y: b.y, k: b.k, yaw: b.yaw, showFx: false, expr: ex(BY.blink, t > HIT.dive2[0] ? 'excited' : 'laugh', { look: [-.6, .2] }), pose: { glow: 1.2 + .4 * Math.sin(t * 6), fly: 1, lift: .3, legsUp: legs } });
    c.restore();
  }
  c.restore();
}

/* ================= GAG (18,1–24 s): Fizz bắt chước Blink; câu hỏi; Fizz bay một vòng về khung đầu ================= */
function gagCam(t) {
  const L9 = line('L09'), L10 = line('L10'), d = seg(t, HIT.flip[1], DUR);
  const toFizz = ss(seg(t, HIT.lift[0] - .2, HIT.lift[1])) * (1 - ss(seg(t, L9.t + .3, L9.t + .9))), ask = ss(seg(t, L10.t - .3, L10.t + .4));
  const shake = decay(t, [HIT.fizzle], 8);
  const cx = 480 + 15 * Math.sin(d * 2.4) - 30 * toFizz, cy = 1086 - 6 * d - 12 * toFizz, z = 1.68 + .22 * toFizz + .06 * ask;
  const k = ss(seg(t, DUR - 1.1, DUR - .55)), h = hookCam(t - DUR);
  return { cx: lerp(cx, h.cx, k) + 6 * Math.sin(t * 47) * shake, cy: lerp(cy, h.cy, k) + 5 * Math.sin(t * 41) * shake, z: lerp(z, h.z, k) };
}
function sGag(c, t, o = {}) {
  const cm = gagCam(t), fs = fizzGag(t);
  look(c, cm, () => {
    leafWorld(c, t, { bs: blinkGag(t), fs, ls: loupeGag(t) });
    // đuôi Fizz gồng cho sáng: chấm sáng mờ yếu, rồi "xì"
    const tail = rigPt(fs.x, fs.y, FZ.k, fs.yaw, fs.lean || 0, [0, -.62 - (fs.lift || 0), -.88]), st = seg(t, HIT.strain[0], HIT.fizzle);
    if (st > 0 && t < HIT.fizzle) { circle(c, tail[0], tail[1], 8 + 10 * st, `rgba(255,227,77,${.25 + .3 * st * Math.abs(Math.sin(t * 30))})`); }
    fizzle(c, tail[0], tail[1], seg(t, HIT.fizzle, HIT.fizzle + .8));
  });
  if (!o.noText && t > HIT.fizzle - .02 && t < HIT.fizzle + 1.95) {
    const pu = 1 + .12 * Math.sin(Math.PI * seg(t, HIT.fizzle, HIT.fizzle + .25));
    c.save(); c.translate(560, 330); c.scale(pu, pu); c.rotate(.05 * Math.sin((t - HIT.fizzle) * 25) * Math.exp(-(t - HIT.fizzle) * 3)); c.translate(-560, -330);
    popText(c, 'FIZZ!', 560, 370, 170, C.cream, C.grape, t, HIT.fizzle, { step: .03, sh: 11 }); c.restore();
  }
}

/* ---------- chuyển cảnh ---------- */
function matchCut(c, t) {
  stickerMatchCut(c, t, { t0: HIT.zoomIn[0], t1: HIT.zoomOut[0], t2: HIT.zoomOut[1], lens: lensBig(HIT.zoomIn[0]), from: cc => sLens(cc, HIT.zoomIn[0]), to: (cc, tt) => sAlbum(cc, tt), slot: SLOT, fill: C.skyL, draw: cc => { cc.scale(SLOT.r / 100, SLOT.r / 100); stickerArt(cc); } });
}
function recallTitle(c, t) { hookTitle(c, TITLE, -1, { gone: 1 - back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: 400 }); }
function pageFlip(c, t) {
  const u = ss(seg(t, HIT.flip[0], HIT.flip[1])), w = 1080 * (1 - u);
  sGag(c, Math.max(t, HIT.flip[1]));
  c.save(); c.beginPath(); c.rect(0, 0, w, 1920); c.clip(); sAlbum(c, t); c.restore();
  c.fillStyle = 'rgba(30,27,58,.22)'; c.fillRect(w, 0, 34 * (1 - u), 1920);
  rrect(c, w - 60 * Math.sin(Math.PI * u), 0, 60 * Math.sin(Math.PI * u) + 2, 1920, 0, C.cream);
}

export function drawFilm(c, t) {
  t = clamp(t, 0, DUR - .001);
  c.save();
  if (t >= HIT.flip[1]) sGag(c, t);
  else if (t >= HIT.flip[0]) pageFlip(c, t);
  else if (t >= HIT.zoomOut[1]) sAlbum(c, t);
  else if (t >= HIT.zoomIn[0]) matchCut(c, t);
  else if (t >= HIT.zoom[0]) { sLens(c, t); if (t >= HIT.snap) snapFlash(c, t, HIT.snap, lensBig(t)); }
  else sHook(c, t);
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t, 495, SAFE.subY);                       // tâm 495: tấm hai dòng rộng nhất vẫn dừng trước cột nút phải (x 940)
  c.restore();
}
