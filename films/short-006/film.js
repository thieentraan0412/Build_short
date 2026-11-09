// SHORT-006 · Ants Run a Tiny Cow Farm?! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp: khung cuối mở về khung đầu.
// Tập đầu tiên theo lượt nâng cấp 11/2026 (PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md): kính lớn, câu cửa miệng có hành động,
// người nói có trên hình, phụ đề ở vùng an toàn (SAFE.subY).
import { C, REC, circle, ell, rrect, ground, popText, subFont, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { makeTalk, blinkAt, ex, rigPt, look, toScreen, loupe, zoomIn, ARM, albieAt, badge, shadow, subtitle, LENS_UP, hookTitle, stickerMatchCut, snapFlash, SAFE } from '/_shared/episode.js';
import { sky, bush, leaf, leafY, aphid, aphidRear, dropTear, dropBall, heart, tapLines, ripples } from './props.js';
import { LINES, CARDS, DUR, HIT } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const pulse = (t, list, a = .12, b = .1) => list.reduce((s, h) => s + Math.sin(Math.PI * seg(t, h - a, h + b)), 0);   // 0→1→0 quanh mỗi mốc
const arc = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];                   // đường bay parabol

/* ---------- Crumb: kiến con hổ phách. lean: nghiêng cả người về trước (gõ râu lên trán rệp) ---------- */
const FEET = [[-.4, 0, .3], [-.48, 0, -.1], [.4, 0, .3], [.48, 0, -.1]];
const ARMS = {
  rest: { armL: [-.4, -1.0, .45], armR: [.42, -1.05, .45] }, up: { armL: [-.62, -2.45, .2], armR: [.62, -2.45, .2] },
  hug: { armL: [-.22, -1.42, .78], armR: [.22, -1.42, .8] }, reach: { armL: [-.4, -1.0, .45], armR: [.7, -1.9, .5] },
};
const mixArms = (a, b, k) => ({ armL: a.armL.map((v, i) => lerp(v, b.armL[i], k)), armR: a.armR.map((v, i) => lerp(v, b.armR[i], k)) });
function crumbAt(c, x, y, k, o = {}) {
  const w = o.walk || 0, ph = o.ph || 0;
  const feet = FEET.map((f, i) => { const s = Math.sin(ph * TAU + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)); return [f[0], -Math.max(0, s) * .14 * w, f[2] + s * .16 * w]; });
  const pose = { carry: null, q: o.q ?? 0, reach: o.reach ?? 0, lift: (o.hop || 0) + Math.abs(Math.sin(ph * TAU)) * .04 * w, bodyLean: 0, feet, ...(o.arms || ARMS.rest) };
  return drawChar(c, BY.crumb, { x, y, k, yaw: o.yaw ?? CY, lean: o.lean || 0, showFx: false, expr: o.E || ex(BY.crumb, 'happy'), pose });
}
const crumbE = (name, t, o = {}) => ex(BY.crumb, name, { talk: talkAt(t, 'crumb'), blink: talkAt(t, 'crumb') ? 0 : blinkAt(t, .6), ...o });
// đầu râu trước của Crumb (toạ độ cảnh), cùng công thức với rig (crumb.js) và cùng phép xoay với drawChar
function crumbTip(x, y, k, yaw, reach, lift = 0, lean = 0) {
  const sd = yaw >= 0 ? 1 : -1, p = [sd * (.64 - .42 * reach), -2.32 - lift + .12 * reach - .3024, .34 + .78 * reach];
  return rigPt(x, y, k, yaw, lean, p);
}
// chỗ giọt ngọt nằm trên tay Crumb: trên đầu (tay giơ) hoặc trước ngực (ôm), nội suy theo hug
const dropOnCrumb = (x, y, k, yaw, lean, lift, hug) => {
  const top = rigPt(x, y, k, yaw, lean, [0, -2.45 - .4 - lift, .2]), chest = rigPt(x, y, k, yaw, lean, [0, -1.42 - lift, 1.02]);
  return [lerp(top[0], chest[0], hug), lerp(top[1], chest[1], hug)];
};

/* ================= CHIẾC LÁ: móc → kính lớn → "bò tí hon" → nhịp "ồ" (một cảnh liền) =================
   Crumb (trái) quay sang phải; chú rệp to quay mặt về phía Crumb (dir −1), đuôi bên phải: giọt ngọt phồng ở đó, không bị Crumb che.
   Miss Loupe đứng bên trái, mặt xa cột nút của Shorts. */
const CY = 1.0;
const CR = { x: 360, k: 110 };
const APH = { x: 660, s: 290 }, HERD = [[995, 104, -1, .7], [1125, 92, -1, 2.1]];
const aphY = () => leafY(APH.x);
const REAR = aphidRear(APH.x, leafY(APH.x), APH.s, -1);          // đuôi rệp (bên phải): chỗ giọt ngọt phồng ra
const LS = { x: 225, r: 100 };                                    // chỗ Miss Loupe đứng trên lá (toạ độ cảnh)
const lsLens = () => [LS.x, leafY(LS.x) - LENS_UP * LS.r];
export const BASE = { cx: 560, cy: 951, z: 1.25 };
function stemCam(t) {
  const [cx, cy, z] = K([[-1, [585, 951, 1.19]], [HIT.crash[0], [585, 951, 1.19]], [HIT.crash[1], [590, 945, 1.31]], [HIT.catch0 - .1, [588, 947, 1.29]], [HIT.catch0 + .12, [580, 930, 1.4]], [HIT.hug0[1] + .1, [585, 942, 1.31]], [2.6, [585, 948, 1.28]], [HIT.lensIn[0], [560, 951, 1.25]],
    [HIT.zoom[0], [560, 951, 1.25]], [HIT.snap, [575, 945, 1.32]], [HIT.snap + 1, [575, 945, 1.32]]])(t);
  return { cx, cy, z };
}
const TAPS = [HIT.tap0, ...HIT.taps];
// Crumb trong cảnh chính
function crumbState(t) {
  const s = { x: CR.x, yaw: CY, reach: .55, lean: 0, hop: 0, q: 0, arms: ARMS.rest, hug: 1, E: null };
  const tap = Math.min(1, pulse(t, TAPS, .14, .14));
  s.lean = .28 * tap; s.reach = .55 + .45 * tap;
  if (t < HIT.gulp[1]) {                                         // giọt của móc: giơ tay chụp, hạ xuống ôm, rồi nuốt chửng
    const upK = ss(seg(t, .45, .95)), hugK = ss(seg(t, HIT.hug0[0], HIT.hug0[1])), down = ss(seg(t, HIT.gulp[0] + .15, HIT.gulp[1]));
    s.hug = t < HIT.catch0 ? 0 : hugK;
    s.arms = t < HIT.hug0[0] ? mixArms(ARMS.rest, ARMS.up, upK) : mixArms(mixArms(ARMS.up, ARMS.hug, hugK), ARMS.rest, down);
  } else if (t >= HIT.pop - .3) {                                // giọt thứ hai: giơ tay đón, ôm vào ngực
    const upK = ss(seg(t, HIT.pop - .3, HIT.pop + .1)), hugK = ss(seg(t, HIT.hug2[0], HIT.hug2[1]));
    s.hug = t < HIT.merge ? 0 : hugK; s.arms = t < HIT.hug2[0] ? mixArms(ARMS.rest, ARMS.up, upK) : mixArms(ARMS.up, ARMS.hug, hugK);
  }
  s.hop = .3 * Math.sin(Math.PI * seg(t, HIT.catch0 - .1, HIT.catch0 + .3)) + .12 * Math.abs(Math.sin((t - HIT.hug0[0]) * 9)) * (t > HIT.hug0[0] && t < HIT.turn0 ? 1 : 0) + .14 * Math.sin(Math.PI * seg(t, HIT.merge - .1, HIT.merge + .25))
    + .1 * Math.sin(Math.PI * seg(t, HIT.aww[0], HIT.aww[0] + .3));
  const toCam = ss(seg(t, HIT.turn0, HIT.turn0 + .3)) * (1 - ss(seg(t, HIT.turnBack, HIT.turnBack + .3)));
  s.yaw = lerp(CY, .22, toCam) + (t > HIT.hug0[0] && t < HIT.turn0 ? .3 * Math.sin((t - HIT.hug0[0]) * 9) * (1 - seg(t, HIT.hug0[0], HIT.turn0)) : 0);
  if (t < .35) s.E = crumbE('happy', t, { look: [.8, -.3] });
  else if (t < HIT.catch0 + .1) s.E = crumbE('surprised', t, { look: [.5, -.95] });
  else if (t < HIT.turn0) s.E = crumbE('excited', t, { look: [.3, -.5] });
  else if (t < HIT.turnBack) s.E = crumbE('excited', t, { look: [0, 0] });
  else if (t < HIT.gulp[1] + .1) s.E = crumbE('happy', t, { closed: 1, mouth: 'o' });
  else if (t < HIT.pop - .1) s.E = crumbE('curious', t, { look: [.75, -.1] });
  else if (t < HIT.merge + .3) s.E = crumbE('surprised', t, { look: [.7, -.8] });
  else if (t < HIT.aww[0]) s.E = crumbE('laugh', t, { look: [.6, -.1] });
  else if (t < HIT.aww[1] + .2) s.E = crumbE('happy', t, { closed: 1 });
  else s.E = crumbE('excited', t, { look: [.7, -.2] });
  return s;
}
// giọt ngọt Crumb đang cầm hoặc đang bay về phía Crumb (toạ độ cảnh)
function crumbDrop(t, cs) {
  const cy = leafY(cs.x), hold = dropOnCrumb(cs.x, cy, CR.k, cs.yaw, cs.lean, cs.hop, cs.hug);
  if (t < HIT.pop0) return null;
  if (t < HIT.catch0) {                                           // giọt của móc: bay vòng qua lưng rệp, rơi vào tay Crumb
    const u = seg(t, HIT.pop0, HIT.catch0), p = arc([REAR[0], REAR[1] - 10], hold, u, 360);
    return { x: p[0], y: p[1], r: 34, sq: -.25 * Math.sin(Math.PI * u), rot: -u * 3 };
  }
  if (t < HIT.gulp[1]) {                                          // trên tay; nuốt chửng: thu nhỏ vào miệng
    const g = ss(seg(t, HIT.gulp[0], HIT.gulp[1])), mouth = rigPt(cs.x, cy, CR.k, cs.yaw, cs.lean, [.2, -1.35 - cs.hop, .55]);
    return { x: lerp(hold[0], mouth[0], g), y: lerp(hold[1], mouth[1], g), r: 34 * (1 - g), sq: .3 * Math.sin(Math.PI * seg(t, HIT.catch0, HIT.catch0 + .2)), rot: 0 };
  }
  if (t < HIT.pop) return null;
  if (t < HIT.merge) {                                            // giọt thứ hai: "pop!" ở đuôi, bay vòng qua lưng rệp
    const u = seg(t, HIT.pop, HIT.merge), p = arc([REAR[0] + 8, REAR[1] - 6], hold, u, 300);
    return { x: p[0], y: p[1], r: 40, sq: -.25 * Math.sin(Math.PI * u), rot: -u * 3 };
  }
  return { x: hold[0], y: hold[1], r: 40, sq: .3 * Math.sin(Math.PI * seg(t, HIT.merge, HIT.merge + .2)), rot: 0 };
}
function aphidState(t, gag = false) {
  const tap = Math.min(1, pulse(t, gag ? [] : TAPS, .08, .2)), gig = gag ? 0 : Math.sin(Math.PI * seg(t, HIT.giggle[0], HIT.giggle[1])) * Math.abs(Math.sin(t * 22));
  let eye = blinkAt(t, .2) ? 'happy' : 'open', look = [.5, -.6];
  if (gag) {
    const hitB = Math.sin(Math.PI * seg(t, HIT.bounce[0] - .02, HIT.bounce[0] + .3)), home = Math.sin(Math.PI * seg(t, HIT.home - .02, HIT.home + .3));
    if (hitB > .05 || home > .05) eye = 'wide';
    else if (t > HIT.home + .3) { eye = blinkAt(t, .2) ? 'happy' : 'open'; look = [.2, -.9]; }
    return { sq: .9 * hitB + .5 * home, eye, look, cow: 0 };
  }
  const cow = ss(seg(t, HIT.cow[0], HIT.cow[1])) * (1 - ss(seg(t, HIT.cowOff[0], HIT.cowOff[1])));
  if (tap > .2 || gig > .1) eye = 'happy';
  if (t > HIT.swell[0] && t < HIT.pop) look = [-.95, .1];
  if (t > HIT.pop - .05 && t < HIT.pop + .35) eye = 'wide';
  if (cow > .3) eye = 'happy';
  if (t > HIT.wink[0] && t < HIT.wink[1]) eye = 'wink';
  const strain = t > HIT.swell[0] && t < HIT.pop ? .3 * Math.abs(Math.sin(t * 7)) * seg(t, HIT.swell[0], HIT.swell[1]) : 0;
  return { sq: .7 * tap + .35 * gig + strain, eye, look, cow };
}
function stemWorld(c, t, o = {}) {
  sky(c, t); bush(c, t); leaf(c, t);
  HERD.forEach(([x, s, dir, ph]) => { shadow(c, x, leafY(x) + 2, s * .7, .14); aphid(c, x, leafY(x), s, { dir, bob: Math.abs(Math.sin(t * 2.2 + ph)) * 4, eye: blinkAt(t, ph) ? 'happy' : 'open', look: [.5, -.2] }); });
  const gag = !!o.gag, as = aphidState(t, gag);
  shadow(c, APH.x, aphY() + 2, 210, .16);
  aphid(c, APH.x, aphY(), APH.s, { dir: -1, sq: as.sq, eye: as.eye, look: as.look, cow: as.cow, bob: Math.abs(Math.sin(t * 1.8)) * 3 + 14 * as.cow * Math.abs(Math.sin(t * 5)) });
  if (!gag) {                                                     // giọt ngọt thứ hai phồng dần ở đuôi rệp
    const sw = seg(t, HIT.swell[0], HIT.swell[1]);
    if (sw > 0 && t < HIT.pop) {
      const r = 44 * (.18 + .82 * sw) * (1 + .07 * Math.sin(t * 18)), gx = REAR[0] + 10 * sw, gy = REAR[1] + 8;
      for (let i = 0; i < 2; i++) { const q = (t * 1.6 + i * .5) % 1; c.strokeStyle = `rgba(255,227,77,${.8 * (1 - q) * Math.min(1, sw * 3)})`; c.lineWidth = 8 * (1 - q) + 2; c.beginPath(); c.arc(gx, gy, r + 14 + 60 * q, 0, TAU); c.stroke(); }
      dropTear(c, gx, gy, r);
    }
    for (const [h, n] of [[HIT.pop0, 7], [HIT.pop, 8]]) { const q = seg(t, h, h + .55); if (q > 0 && q < 1) for (let i = 0; i < n; i++) { const a = i * TAU / n + .2; star(c, REAR[0] + Math.cos(a) * 80 * eo(q), REAR[1] - 10 + Math.sin(a) * 80 * eo(q), 20 * (1 - q), C.lemon); } }
  }
  if (o.noCrumb) return;
  const cs = o.cs || crumbState(t), cy = leafY(cs.x);
  shadow(c, cs.x + 20, cy + 2, 120, .18);
  crumbAt(c, cs.x, cy, CR.k, { ...cs, ph: t * 2.4 });
  if (gag) return;
  const d = crumbDrop(t, cs); if (d) dropBall(c, d.x, d.y, d.r, d.sq, d.rot);
  const tp = crumbTip(cs.x, cy, CR.k, cs.yaw, cs.reach, cs.hop, cs.lean);
  TAPS.forEach(h => tapLines(c, tp[0] + 4, tp[1] + 8, seg(t, h, h + .35), C.cream, 22));
  // nhịp "ồ": lấp lánh quanh giọt ngọt; tim nhỏ khi rệp nháy mắt
  for (let i = 0; i < 5; i++) { const q = seg(t, HIT.aww[0] + i * .06, HIT.aww[0] + i * .06 + .7); if (q <= 0 || q >= 1 || !d) continue; const a = i * TAU / 5 + .4; star(c, d.x + Math.cos(a) * 70 * eo(q), d.y - 20 + Math.sin(a) * 60 * eo(q), 12 * (1 - q), C.lemon); }
  for (let i = 0; i < 2; i++) { const q = seg(t, HIT.wink[0] + i * .12, HIT.wink[0] + i * .12 + .8); if (q > 0 && q < 1) heart(c, APH.x - 120 + i * 40, aphY() - 300 - 90 * eo(q), 18 * Math.sin(Math.PI * Math.min(1, q * 1.5)), [C.berry, C.pink][i]); }
}
// kính: toạ độ khung. Nhảy vào chỗ đứng trên lá → bật về phía máy (kính lớn r 310) → trôi nhẹ
function lensState(t) {
  const cam = stemCam(t), [wx, wy] = lsLens(), st = toScreen(cam, wx, wy), sr = LS.r * cam.z;
  if (t < HIT.lensIn[1]) { const u = seg(t, HIT.lensIn[0], HIT.lensIn[1]), p = arc(toScreen(cam, -200, 760), st, ei(u), 160); return { x: p[0], y: p[1], r: sr, big: 0, m: 0 }; }
  const big = ss(seg(t, HIT.zoom[0], HIT.zoom[1]));
  const bx = 540 + 12 * Math.sin(t * 1.3), by = 690 + 10 * Math.sin(t * 1.7), br = 310 + 6 * Math.sin(t * 2.1);
  const hop = Math.sin(Math.PI * seg(t, HIT.zoom[0], HIT.zoom[1])) * 120;
  return { x: lerp(st[0], bx, big), y: lerp(st[1], by, big) - hop, r: lerp(sr, br, big), big, m: ss(seg(t, HIT.zoom[0] + .25, HIT.zoom[1])) };
}
// phóng trong kính: điểm cảnh ở tâm kính và độ phóng, đi theo nhịp của bí mật
function lensFocus(t) {
  // tap: râu Crumb, trán và mắt rệp · swell: đuôi rệp, giọt ngọt to · pop: theo giọt bay qua lưng rệp · cow: cả chú rệp · "ồ": Crumb ôm giọt
  const [x, y, mag] = K([[HIT.zoom[0], [500, 1020, 1.0]], [HIT.zoom[1], [480, 1015, 1.28]], [HIT.taps[1] + .35, [490, 1015, 1.3]], [HIT.swell[0] + .5, [REAR[0] + 5, REAR[1] - 10, 1.8]],
    [HIT.pop, [REAR[0] - 5, REAR[1] - 20, 1.9]], [HIT.merge, [470, 990, 1.2]], [HIT.pull[1], [620, 1060, .98]], [HIT.cowOff[0], [625, 1060, 1.0]],
    [HIT.aww[0], [420, 1010, 1.4]], [HIT.snap, [480, 1020, 1.3]]])(t);
  return { x, y, mag };
}
function loupeStem(c, t) {
  if (t < HIT.lensIn[0]) return;
  const L = lensState(t), cam = stemCam(t), talk = talkAt(t);
  const name = t < HIT.zoom[0] ? (t < HIT.lensIn[1] + .1 ? 'excited' : 'happy') : t > HIT.pop - .05 && t < HIT.pop + .5 ? 'surprised' : talk ? 'explaining' : t < HIT.aww[0] && t > HIT.pop ? 'laugh' : 'happy';
  const F = lensFocus(t), fs = toScreen(cam, F.x, F.y);
  loupe(c, L.x, L.y, L.r, {
    E: ex(BY.loupe, name, { talk, look: L.big > .5 ? [.15, .35] : [.75, .1], blink: talk ? 0 : blinkAt(t) }),
    rot: lerp(-.1, -.05, L.big), pose: L.big > .5 ? ARM.peer : t < HIT.zoom[0] && t > HIT.lensIn[1] ? ARM.point : ARM.up,
    inside: L.m > .01 ? zoomIn(L.x, L.y, lerp(1, F.mag, L.m), lerp(L.x, fs[0], L.m), lerp(L.y, fs[1], L.m), () => look(c, cam, () => stemWorld(c, t))) : null,
  });
}
const TITLE = [{ text: 'SWEET', y: 272, px: 200, fill: C.berry, shadow: C.cream, t0: HIT.words[0] }, { text: 'PET?!', y: 480, px: 210, fill: C.grape, shadow: C.cream, t0: HIT.words[1] }];
function sStem(c, t, o = {}) {
  look(c, stemCam(t), () => stemWorld(c, t));
  if (!o.noLup) loupeStem(c, t);
  // tựa móc dùng chung (hookTitle): hiện đủ ở khung 0, từng dòng nảy có tiếng; thu nhỏ biến mất trước khi Miss Loupe vào
  const wob = [HIT.catch0, HIT.hug0[0]].reduce((a, h) => a + (t > h ? Math.sin((t - h) * 16) * Math.exp(-(t - h) * 5) * .07 : 0), 0);
  hookTitle(c, TITLE, t, { gone: ss(seg(t, 2.6, 2.95)), cy: 360, wob });
  // chữ hành động (ngoài kính, để readcheck đo được)
  if (t > HIT.pop - .02 && t < HIT.pop + 1.9) popText(c, 'POP!', 250, 280, 150, C.lemon, C.grape, t, HIT.pop, { step: .03, sh: 10 });
  if (t > HIT.clonk - .02 && t < HIT.clonk + 1.95) {
    const pu = 1 + .1 * Math.sin(Math.PI * seg(t, HIT.clonk, HIT.clonk + .25));
    c.save(); c.translate(800, 250); c.scale(pu, pu); c.rotate(.06 * Math.sin((t - HIT.clonk) * 20) * Math.exp(-(t - HIT.clonk) * 3)); c.translate(-800, -250);
    popText(c, 'CLONK!', 790, 280, 120, C.mango, C.ink, t, HIT.clonk, { step: .03, sh: 9 }); c.restore();
  }
}

/* ================= SỔ: sticker, Albie, Crumb nhảy ùm vào trang ================= */
const SLOT = { x: 280, y: 480, r: 140 }, PAGE = { x: 84, y: 200, w: 890, h: 650 }, DIVE = { x: 610, y: 735 }, MINI = { x: 860, y: 745, r: 76 };
function stickerArt(cc) {                                         // hình trong sticker: chú rệp và giọt ngọt (cỡ theo SLOT.r)
  aphid(cc, -14, 78, 140, { dir: -1, eye: 'happy' });
  dropBall(cc, 78, -34, 30);
  for (let i = 0; i < 4; i++) { const a = i * TAU / 4 + .4; star(cc, 78 + Math.cos(a) * 50, -34 + Math.sin(a) * 50, 9, C.lemon); }
}
function miniArt(cc) {                                            // sticker Crumb tí hon ôm giọt ngọt
  crumbAt(cc, 0, 58, 40, { yaw: .3, arms: ARMS.hug, E: ex(BY.crumb, 'laugh') });
  const d = rigPt(0, 58, 40, .3, 0, [0, -1.42, 1.02]); dropBall(cc, d[0], d[1], 15);
}
const AL = { x: 262, y: 1440, k: 240 };
function albumCrumb(t) {                                          // Crumb chạy vào từ phải, khom người, nhảy ùm vào trang
  if (t < HIT.run[0] || t >= HIT.splash) return null;
  const gy = 1500;
  if (t < HIT.crouch[0]) { const u = ss(seg(t, HIT.run[0], HIT.run[1])); return { x: lerp(1300, 790, u), y: gy, k: 150, walk: 1, rot: 0, hop: 0, E: 'excited' }; }
  if (t < HIT.jump[0]) return { x: 790, y: gy, k: 150, walk: 0, rot: 0, hop: -.12 * Math.sin(Math.PI * seg(t, HIT.crouch[0], HIT.crouch[1])), E: 'excited' };
  const u = seg(t, HIT.jump[0], HIT.jump[1]), p = arc([790, gy], [DIVE.x, DIVE.y + 60], u, 520);
  return { x: p[0], y: p[1], k: lerp(150, 70, u), walk: 0, rot: -1.6 * ei(u), hop: 0, E: 'laugh' };
}
function sAlbum(c, t) {
  const push = 1 + .05 * Math.sin(Math.PI * seg(t, HIT.splash - .05, HIT.splash + .6));
  c.save(); c.translate(540, 700); c.scale(push, push); c.translate(-540, -700);
  ground(c, C.mint); ell(c, 200, 1760, 900, 420, 0, C.mintL); ell(c, 540, 1730, 980, 330, 0, C.leaf); ell(c, 540, 1770, 900, 280, 0, C.leafD);
  rrect(c, PAGE.x + 12, PAGE.y + 18, PAGE.w, PAGE.h, 54, C.grape); rrect(c, PAGE.x, PAGE.y, PAGE.w, PAGE.h, 54, C.cream);
  const t0 = HIT.stamp;
  circle(c, SLOT.x, SLOT.y, 142, '#EBDDBC');
  if (t >= HIT.zoomOut[0]) {                                      // sticker nằm sẵn ở chỗ (máy lùi ra từ chính nó), nảy lên ở cú dán
    const p = t >= t0 ? back(seg(t, t0, t0 + .22), 2.6) : 1;
    badge(c, SLOT.x, SLOT.y, SLOT.r, C.skyL, stickerArt, -.05, t >= t0 ? lerp(1.2, 1, p) : 1);
    popText(c, 'Tap', 470, 468, 122, C.berry, null, t, t0 + .1, { align: 'left', step: .02 });
    popText(c, 'for sweet drops', 470, 560, 64, C.ink, null, t, t0 + .2, { align: 'left', step: .012, font: subFont });
  }
  // gợn sóng trên trang khi Crumb nhảy vào, giọt nước bắn lên, rồi sticker Crumb tí hon bật lên
  c.save(); c.beginPath(); c.roundRect(PAGE.x, PAGE.y, PAGE.w, PAGE.h, 54); c.clip();
  ripples(c, DIVE.x, DIVE.y, seg(t, HIT.splash, HIT.splash + .8), 330);
  c.restore();
  const sp = seg(t, HIT.splash, HIT.splash + .55);
  if (sp > 0 && sp < 1) for (let i = 0; i < 7; i++) { const a = -Math.PI * (.1 + .8 * i / 6), d = 150 * eo(sp); circle(c, DIVE.x + Math.cos(a) * d * 1.3, DIVE.y + Math.sin(a) * d + 70 * sp * sp, 16 * (1 - sp) + 4, i % 2 ? C.skyL : C.white); }
  if (t >= HIT.mini) badge(c, MINI.x, MINI.y, MINI.r, C.lemon, miniArt, .08, back(seg(t, HIT.mini, HIT.mini + .3), 2.6));
  // Albie: nhún theo chữ, tròn mắt khi Crumb nhảy vào, rồi cười
  const talk = talkAt(t, 'albie'), L6 = LINES.find(l => l.id === 'L06');
  const hop = .1 * Math.sin(Math.PI * seg(t, t0, t0 + .22)) + .12 * pulse(t, [L6.t + .15, L6.t + 1.25], .1, .2);
  const name = t > HIT.splash - .05 && t < HIT.splash + .45 ? 'surprised' : t > HIT.splash + .45 ? 'laugh' : 'happy';
  shadow(c, AL.x + 18, AL.y + 4, 220, .18);
  albieAt(c, AL.x, AL.y, AL.k, { E: ex(BY.albie, name, { talk, look: t > HIT.run[0] && t < HIT.splash + .3 ? [.75, -.45] : [.45, -.65], blink: talk ? 0 : blinkAt(t, .4) }), hop, tilt: .06 * Math.sin(Math.PI * seg(t, HIT.splash, HIT.splash + .5)) });
  const cr = albumCrumb(t);
  if (cr) {
    if (cr.rot === 0) shadow(c, cr.x - 10, 1502, 110, .16);
    const pv = [cr.x, cr.y - cr.k * 1.2];
    c.save(); c.translate(pv[0], pv[1]); c.rotate(cr.rot); c.translate(-pv[0], -pv[1]);
    crumbAt(c, cr.x, cr.y, cr.k, { yaw: -.9, arms: ARMS.up, hop: cr.hop, walk: cr.walk, ph: t * 3, E: ex(BY.crumb, cr.E, { look: [-.6, -.6] }) });
    const d = rigPt(cr.x, cr.y, cr.k, -.9, 0, [0, -2.85 - cr.hop, .2]); dropBall(c, d[0], d[1], cr.k * .33);
    c.restore();
  }
  c.restore();
}

/* ================= GAG: lại chiếc lá; Crumb đội giọt ngọt, giọt nảy tưng tưng ================= */
function gagCrumb(t) {
  const walk = t > HIT.walkG[0] && t < HIT.walkG[1], chase = t > HIT.slip + .1 && t < HIT.hitLens;
  const x = t < HIT.slip ? lerp(110, CR.x, ss(seg(t, HIT.walkG[0], HIT.walkG[1]))) : lerp(CR.x, CR.x + 40, ss(seg(t, HIT.slip + .1, HIT.bounce[1])));
  const s = { x, yaw: CY, reach: .3, lean: 0, hop: 0, q: 0, arms: ARMS.up, hug: 0, walk: walk || chase ? 1 : 0, E: null };
  if (t < HIT.slip) s.E = crumbE('excited', t, { look: [.5, -.6] });
  else if (t < HIT.home) { s.E = crumbE(t < HIT.slip + .4 ? 'surprised' : 'worried', t, { look: t > HIT.bounce[1] ? [-.5, -.5] : [.7, -.4] }); s.arms = ARMS.reach; s.lean = .1; s.yaw = t > HIT.bounce[1] + .1 ? -.6 : CY; }
  else if (t < HIT.lift) { s.E = crumbE('laugh', t, { look: [.5, -.3] }); s.arms = t > HIT.home + .6 ? ARMS.up : ARMS.rest; s.hop = .1 * Math.sin(Math.PI * seg(t, HIT.home, HIT.home + .3)) + (t > HIT.home + .6 ? .14 * Math.abs(Math.sin((t - HIT.home) * 7)) : 0); }
  else { s.E = crumbE('surprised', t, { look: [.4, -.8] }); s.arms = ARMS.up; }
  return s;
}
// giọt ngọt trong gag (toạ độ cảnh): trên đầu Crumb → nảy lên lưng rệp → xuống lá sau đuôi rệp → bay qua đầu Crumb trúng kính → về lưng rệp
const BACKTOP = [APH.x + 10, aphY() - .88 * APH.s - 36], LEAFP = [905, leafY(905) - 34], HOMEP = [APH.x - 10, aphY() - .88 * APH.s - 32];
function gagDrop(t, cs) {
  const head = dropOnCrumb(cs.x, leafY(cs.x), CR.k, CY, 0, cs.hop, 0), [lx, ly] = lsLens(), LENSP = [lx + LS.r * .8, ly + LS.r * .1];
  if (t < HIT.slip) { const wob = Math.sin(t * 9) * .08 * seg(t, HIT.walkG[0], HIT.walkG[1]); return { x: head[0] + 10 * wob, y: head[1], r: 40, sq: 0, rot: wob }; }
  const legs = [[HIT.slip, HIT.bounce[0], head, BACKTOP, 230], [HIT.bounce[0], HIT.bounce[1], BACKTOP, LEAFP, 200], [HIT.bounce[1], HIT.hitLens, LEAFP, LENSP, 330], [HIT.hitLens, HIT.home, LENSP, HOMEP, 210]];
  for (const [a, b, pa, pb, h] of legs) if (t < b) { const u = seg(t, a, b), p = arc(pa, pb, u, h); return { x: p[0], y: p[1], r: 40, sq: -.25 * Math.sin(Math.PI * u), rot: u * 4 }; }
  const land = Math.sin(Math.PI * seg(t, HIT.home, HIT.home + .25));
  return { x: HOMEP[0], y: HOMEP[1] + 3 * Math.sin(t * 3), r: 40, sq: .35 * land, rot: 0 };
}
// máy của gag: rung nhẹ ở mỗi cú nảy; đẩy chậm vào khi Miss Loupe hỏi người xem
function gagCam(t) {
  const shake = [HIT.slip, ...HIT.bounce, HIT.hitLens, HIT.home].reduce((a, h) => a + (t > h ? Math.sin((t - h) * 50) * Math.exp(-(t - h) * 10) : 0), 0);
  const L8 = LINES.find(l => l.id === 'L08'), p = ss(seg(t, L8.t - .2, HIT.loop[0]));
  return { cx: BASE.cx + 18 * p, cy: BASE.cy + shake * 4 - 12 * p, z: BASE.z + .08 * p };
}
function sGag(c, t, o = {}) {
  const cs = gagCrumb(t), cm = gagCam(t);
  look(c, cm, () => stemWorld(c, t, { gag: true, cs }));
  // Miss Loupe đứng trên lá bên trái: giật mình khi giọt trúng kính, rồi cười và hỏi người xem
  const [wx, wy] = lsLens(), st = toScreen(cm, wx, wy), hitK = t > HIT.hitLens ? Math.exp(-(t - HIT.hitLens) * 6) : 0;
  const laugh = t > HIT.laugh, hopL = laugh && t < HIT.laugh + .8 ? Math.abs(Math.sin((t - HIT.laugh) * 9)) * 12 : 0;
  if (!o.noLup) {
    const talk = talkAt(t), name = talk ? 'explaining' : t > HIT.hitLens && t < HIT.laugh ? 'surprised' : laugh ? 'laugh' : 'happy';
    loupe(c, st[0] + Math.sin(t * 40) * 10 * hitK, st[1] - hopL, LS.r * cm.z, { E: ex(BY.loupe, name, { talk, look: talk ? [.1, .1] : [.8, .1], blink: talk ? 0 : blinkAt(t) }), rot: -.06 - .1 * hitK, pose: laugh && !talk ? ARM.up : talk ? ARM.wave : {} });
  }
  if (!o.noDrop) { const d = gagDrop(t, cs); look(c, cm, () => dropBall(c, d.x, d.y, d.r, d.sq, d.rot)); }
  if (t > HIT.slip - .02 && t < HIT.slip + 1.95) {
    const pu = 1 + .12 * Math.sin(Math.PI * seg(t, HIT.slip, HIT.slip + .25));
    c.save(); c.translate(540, 340); c.scale(pu, pu); c.translate(-540, -340);
    popText(c, 'BOING!', 540, 380, 170, C.mango, C.grape, t, HIT.slip, { step: .03, sh: 11 }); c.restore();
  }
}

/* ---------- vòng lặp: giọt ngọt bay về phía máy, phình thành vòng tròn vàng mật, mở về đúng khung đầu ---------- */
function liftDrop(t) {                                            // giọt nảy lên từ lưng rệp về phía máy (toạ độ khung)
  const u = seg(t, HIT.lift, HIT.loop[0]), cm = gagCam(HIT.lift), p = toScreen(cm, HOMEP[0], HOMEP[1]);
  return { x: lerp(p[0], 600, ei(u)), y: lerp(p[1], 880, ei(u)) - 160 * Math.sin(Math.PI * u), r: lerp(40 * cm.z, 90, ei(u)) };
}
function dropIris(c, t) {
  sGag(c, t, { noDrop: true });
  const d = liftDrop(t), u = ei(seg(t, HIT.loop[0], DUR - .04)), R = lerp(d.r, 2300, u), cx = lerp(d.x, 540, u), cy = lerp(d.y, 960, u);
  circle(c, cx, cy, R + 40, C.mango); circle(c, cx, cy, R + 18, C.honeyL);
  c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip();
  REC.mute++; sStem(c, t - DUR, { noLup: true }); REC.mute--; c.restore();
  if (u < .5) circle(c, cx - R * .45, cy - R * .5, R * .16 * (1 - 2 * u), C.cream);
}

/* ---------- chuyển cảnh: kính "chụp" → sticker → trang sổ · trang sổ lật sang chiếc lá ---------- */
function matchCut(c, t) {
  stickerMatchCut(c, t, { t0: HIT.zoomIn[0], t1: HIT.zoomOut[0], t2: HIT.zoomOut[1], lens: lensState(HIT.zoomIn[0]), from: cc => sStem(cc, HIT.zoomIn[0]), to: (cc, tt) => sAlbum(cc, tt), slot: SLOT, fill: C.skyL, draw: stickerArt });
}
function recallTitle(c, t) {                                   // chữ móc trở lại ở cuối, đúng chỗ và đúng cỡ của khung đầu
  hookTitle(c, TITLE, -1, { gone: 1 - back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: 360 });
}
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
  if (t >= HIT.loop[0]) dropIris(c, t);
  else if (t >= HIT.lift) { sGag(c, t, { noDrop: true }); const d = liftDrop(t); dropBall(c, d.x, d.y, d.r, -.2 * Math.sin(Math.PI * seg(t, HIT.lift, HIT.loop[0])), t * 3); }
  else if (t >= HIT.flip[1]) sGag(c, t);
  else if (t >= HIT.flip[0]) pageFlip(c, t);
  else if (t >= HIT.zoomOut[1]) sAlbum(c, t);
  else if (t >= HIT.zoomIn[0]) matchCut(c, t);
  else { sStem(c, t); snapFlash(c, t, HIT.snap, lensState(t)); }
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t, 510, SAFE.subY);
  c.restore();
}
