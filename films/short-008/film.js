// SHORT-008 · A Light That Doesn't Get Hot?! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp: khung cuối mở về khung đầu.
// Bản B theo lượt nâng cấp 11/2026 (PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §4): kính lớn có máy trôi, bí mật xảy ra thành chuyển động
// (buồng sáng trong đèn đuôi), câu cửa miệng có hành động (albumGulp), người nói có trên hình, phụ đề ở vùng an toàn (SAFE.subY).
import { C, REC, circle, ell, rrect, ground, popText, subFont, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { makeTalk, blinkAt, ex, rigPt, look, toScreen, loupe, zoomIn, ARM, badge, shadow, subtitle, LENS_UP, hookTitle, stickerMatchCut, snapFlash, SAFE, albumGulp } from '/_shared/episode.js';
import { N, groundY, FIRE, fireY, SEAT, campSky, camp, pebbles, twigs, glowDot, bigGlow, frost, breath, chamber, thermometer, burst, foreground } from './props.js';
import { LINES, CARDS, DUR, HIT } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const pulse = (t, list, a = .12, b = .1) => list.reduce((s, h) => s + Math.sin(Math.PI * seg(t, h - a, h + b)), 0);   // 0→1→0 quanh mỗi mốc
const decay = (t, list, k = 6) => list.reduce((s, h) => s + (t >= h ? Math.exp(-(t - h) * k) : 0), 0);
const arc = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];
const line = id => LINES.find(l => l.id === id);

/* ================= nhân vật ================= */
// Blink ngồi trên đống que cỏ, mặt quay phải, đuôi (đèn) quay về phía Miss Loupe. Đèn đuôi theo rig (blink.js): [0, −.62 − lift, −.78]
const BL = { k: 100, yaw: 1.3 };
const tailOf = s => rigPt(s.x, s.y, s.k, s.yaw, s.lean || 0, [0, -.62 - (s.lift || 0), -.78]);
const blinkE = (name, t, o = {}) => ex(BY.blink, name, { talk: talkAt(t, 'blink'), blink: talkAt(t, 'blink') ? 0 : blinkAt(t, .3), ...o });
function drawBlink(c, s) {
  if (s.glowR) { const p = tailOf(s); bigGlow(c, p[0], p[1], s.glowR, s.glowA ?? 1); }
  drawChar(c, BY.blink, { x: s.x, y: s.y, k: s.k, yaw: s.yaw, lean: s.lean || 0, showFx: !!s.fx, expr: s.E, pose: { glow: s.glow, fly: s.fly || 0, lift: s.lift || 0, tailUp: 0, legsUp: s.legsUp || null } });
}
const COVER = [[-.25, -1.05, .95], 0, 0, [.25, -1.05, .95], 0, 0];          // hai chân trước che mặt (ngượng)
// Miss Loupe: đứng bên trái vòng sỏi, quàng khăn; tay hơ về phía đèn đuôi. Toạ độ kính (tâm) theo cảnh
const LS = { x: 470, r: 95, yaw: .35 };
const lsLens = () => [LS.x, groundY(LS.x) - LENS_UP * LS.r];
const WARM = { handL: [1.05, -1.12, .55], handR: [1.32, -1.24, .28], elbowL: [.62, -.98, .42], elbowR: [.82, -1.12, .2] };
const SHADE = { handR: [.35, -2.35, .5], elbowR: [.62, -1.6, .3], handL: [-.72, -1.0, .1] };                 // tay che kính khi chói
const mixPose = (a, b, k) => { const o = {}; for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) { const p = a[key] || b[key], q = b[key] || a[key]; o[key] = p.map((v, i) => lerp(v, q[i], k)); } return o; };
// điểm tay (toạ độ cảnh) theo phép đặt nhân vật của loupe(): chân ở (lx − sin θ·2,73r, ly + cos θ·2,73r)
function loupeHand(lx, ly, r, rot, yaw, hand) { const fx = lx - Math.sin(rot) * LENS_UP * r, fy = ly + Math.cos(rot) * LENS_UP * r; return rigPt(fx, fy, r, yaw, rot, hand); }

/* ================= TRẠI: móc (0–3,9 s), giơ kính, gag ================= */
export const BASE = { cx: 570, cy: 1050, z: 1.9 };
function blinkCamp(t, gag = false) {
  const [sx, sy] = SEAT(), s = { x: sx, y: sy, k: BL.k, yaw: BL.yaw, glow: 1 + .15 * Math.sin(t * 3), lift: 0, lean: 0, E: null, fx: false, legsUp: null, glowR: 160, glowA: .7, fly: 0 };
  const talk = talkAt(t, 'blink');
  if (!gag) {
    const gig = Math.sin(Math.PI * seg(t, HIT.giggle0, HIT.giggle0 + .6)), toCam = ss(seg(t, 2.25, 2.55)) * (1 - ss(seg(t, HIT.raise[0], HIT.raise[1])));
    const fl = Math.sin(Math.PI * seg(t, HIT.flare[0], HIT.flare[1] + .3));
    s.yaw = lerp(BL.yaw, .45, toCam); s.lift = .05 * Math.abs(Math.sin(t * 14)) * gig + .14 * fl;
    s.glow = 1 + .15 * Math.sin(t * 3) + 1.9 * fl; s.glowR = 160 + 380 * fl; s.glowA = .7 + .3 * fl;
    s.E = fl > .3 ? blinkE('excited', t, { look: [-.5, -.1] }) : gig > .2 ? blinkE('laugh', t, { look: [-.8, .1] }) : toCam > .5 ? blinkE('confident', t, { look: [0, 0] }) : blinkE('happy', t, { look: [-.8, .05] });
    s.fx = fl > .3; s.fly = .6 * fl;
    return s;
  }
  // gag: vui khi được khen → ngượng che mặt → bỏ tay ra chối "I'm not glowing!" (đuôi bùng chói) → dịu lại, cười
  const L7 = line('L07'), L8 = line('L08'), cover = ss(seg(t, HIT.shy[0], HIT.shy[1])) * (1 - ss(seg(t, L8.t - .15, L8.t + .05)));
  const bl = ss(seg(t, HIT.blaze[0], HIT.blaze[0] + .3)) * (1 - ss(seg(t, HIT.blaze[1] - .4, HIT.blaze[1])));
  s.yaw = lerp(BL.yaw, .35, ss(seg(t, L7.t + .6, L7.t + 1.0)));
  s.legsUp = cover > .3 ? COVER : null; s.lift = .06 * Math.abs(Math.sin(t * 9)) * cover + .2 * bl;
  s.glow = 1 + .15 * Math.sin(t * 3) + .8 * cover + 2.6 * bl; s.glowR = 160 + 80 * cover + 1300 * bl; s.glowA = .7 + .3 * bl; s.fly = .5 * bl;
  s.E = t >= L8.t - .1 && t < L8.t + L8.dur + .2 ? blinkE('confident', t, { look: [.2, -.1], fx: true }) : cover > .3 ? blinkE('shy', t, { fx: true }) : t > HIT.blaze[1] ? blinkE('laugh', t, { look: [-.5, 0] }) : blinkE(t > L7.t + .6 ? 'excited' : 'happy', t, { look: [-.7, 0] });
  s.fx = cover > .3 || bl > .2;
  return s;
}
// Miss Loupe trong trại (toạ độ cảnh): run, hơ tay, băng mọc, giật nảy, vẩy tay (móc); giơ kính; trong gag: khen, nheo mắt che kính, hỏi người xem
function loupeCamp(t, gag = false) {
  const [wx, wy] = lsLens(), s = { x: wx, y: wy, r: LS.r, rot: -.08, yaw: LS.yaw, pose: WARM, name: 'happy', look: [.85, .15], frost: 0, scarf: true };
  const shiver = Math.sin(t * 46) * (gag ? 0 : 1);
  if (!gag) {
    const jolt = Math.sin(Math.PI * seg(t, HIT.jolt, HIT.jolt + .35)), shake = seg(t, HIT.shake[0], HIT.shake[1]) > 0 && seg(t, HIT.shake[0], HIT.shake[1]) < 1;
    const back2 = ss(seg(t, HIT.shake[1], HIT.shake[1] + .4)) * (1 - ss(seg(t, HIT.raise[0] - .1, HIT.raise[0] + .2)));
    s.frost = ss(seg(t, HIT.frost[0], HIT.frost[1])) * (1 - ss(seg(t, HIT.raise[0], HIT.raise[1])));
    s.x += 3 * shiver * (t < HIT.jolt ? 1 : .4); s.y -= 46 * jolt; s.rot += .1 * jolt;
    if (shake) { const q = seg(t, HIT.shake[0], HIT.shake[1]); s.pose = mixPose(WARM, ARM.shrug, .7); s.pose.handL = [-.88, -1.32 + .25 * Math.sin(q * 40), .1]; s.pose.handR = [.88, -1.32 + .25 * Math.sin(q * 40 + 1), .1]; s.yaw = .1; }
    else if (t >= HIT.shake[1]) s.pose = mixPose(ARM.shrug, WARM, back2);
    const raise = ss(seg(t, HIT.raise[0], HIT.raise[1]));
    if (raise > 0) { s.pose = mixPose(s.pose, ARM.peer, raise); s.yaw = lerp(s.yaw, .1, raise); s.y -= 70 * raise; s.x += 20 * raise; }
    s.name = t < .25 ? 'worried' : jolt > .2 || shake ? 'surprised' : talkAt(t) ? 'explaining' : t > HIT.flare[0] ? 'excited' : 'worried';
    s.look = t > HIT.flare[0] && raise < .5 ? [.9, .1] : talkAt(t) && t < 2.5 ? [.1, .2] : [.85, .15];
    return s;
  }
  // gag: không còn băng; khen Blink (vẫy tay), nheo mắt che kính khi chói, cười, hỏi người xem; cuối phim lại chìa tay hơ
  const L7 = line('L07'), L9 = line('L09'), bl = ss(seg(t, HIT.blaze[0], HIT.blaze[0] + .3)) * (1 - ss(seg(t, HIT.blaze[1] - .4, HIT.blaze[1])));
  const warm = ss(seg(t, HIT.warm[0], HIT.warm[1])), talk = talkAt(t);
  s.pose = talk && t < L7.t + L7.dur + .1 ? ARM.wave : t >= L9.t - .1 && t < L9.t + L9.dur ? ARM.up : ARM.peer;
  if (bl > 0) s.pose = mixPose(s.pose, SHADE, bl);
  if (warm > 0) s.pose = mixPose(s.pose, WARM, warm);
  s.yaw = lerp(t >= L9.t - .3 && t < HIT.warm[0] ? 0 : .2, LS.yaw, warm);
  s.y -= 18 * Math.abs(Math.sin((t - HIT.blaze[1]) * 8)) * (t > HIT.blaze[1] && t < HIT.blaze[1] + .7 ? 1 : 0); s.rot = -.05 - .12 * bl;
  s.name = bl > .2 ? 'surprised' : talk ? 'explaining' : t > HIT.blaze[1] && t < L9.t ? 'laugh' : 'happy';
  s.look = bl > .2 ? [.9, -.2] : t >= L9.t - .2 && t < HIT.warm[0] ? [.05, .15] : [.85, .1];
  return s;
}
function drawLoupeCamp(c, t, s) {
  const talk = talkAt(t), closed = s.name === 'surprised' && t > HIT.blaze[0] && t < HIT.blaze[1] ? .8 : 0;
  loupe(c, s.x, s.y, s.r, { E: ex(BY.loupe, s.name, { talk, look: s.look, blink: talk ? 0 : blinkAt(t), closed }), rot: s.rot, yaw: s.yaw, pose: { ...s.pose, scarf: true } });
  if (s.frost > .01) for (const [h, sd] of [['handL', 1], ['handR', 2]]) { const p = loupeHand(s.x, s.y, s.r, s.rot, s.yaw, s.pose[h]); frost(c, p[0], p[1], 40, s.frost, sd); }
}
// thế giới trại (toạ độ cảnh). o.noLoupe / o.noBlink để vẽ riêng trong kính
function campWorld(c, t, o = {}) {
  campSky(c, t); camp(c, t);
  pebbles(c, false); twigs(c);
  const bs = o.bs || blinkCamp(t, o.gag);
  if (!o.noBlink) { shadow(c, bs.x, fireY() - 6, 90, .2); drawBlink(c, bs); }
  pebbles(c, true);
  // quầng ấm phủ lên vòng sỏi (ánh sáng đuôi)
  const tp = tailOf(bs); glowDot(c, tp[0], tp[1], 10 * (bs.glow / 1.2), .5);
  if (!o.noLoupe) {
    const ls = o.ls || loupeCamp(t, o.gag);
    shadow(c, LS.x + 10, groundY(LS.x) + 2, 120, .2);
    drawLoupeCamp(c, t, ls);
    if (!o.gag) {                                                 // hơi thở phả ra khi run
      const mouth = loupeHand(ls.x, ls.y, ls.r, ls.rot, ls.yaw, [.35, -.9, .4]);
      for (const h of [.45, 2.15]) breath(c, mouth[0] + 10, mouth[1], seg(t, h, h + 1.1), 1);
    }
  }
  foreground(c, t);
}
function hookCam(t) {
  const [cx, cy, z] = K([[-1, [560, 1080, 1.8]], [0, [560, 1080, 1.8]], [.45, [570, 1076, 1.95]], [HIT.jolt, [575, 1070, 2.0]], [2.3, [585, 1073, 2.0]], [HIT.flare[0], [600, 1070, 2.06]],
    [HIT.flare[1] + .2, [592, 1070, 2.0]], [HIT.raise[0], [575, 1068, 1.95]], [HIT.zoom[0], [570, 1068, 1.9]], [HIT.zoom[0] + 1, [570, 1068, 1.9]]])(t);
  const sh = decay(t, [HIT.jolt], 9) + .6 * decay(t, [HIT.flare[0]], 7);
  return { cx: cx + 6 * Math.sin(t * 47) * sh, cy: cy + 5 * Math.sin(t * 39) * sh, z };
}
const TITLE = [{ text: 'NOT', y: 300, px: 210, fill: C.mintL, shadow: C.ink, t0: HIT.words[0] }, { text: 'HOT?!', y: 515, px: 230, fill: C.tang, shadow: C.ink, t0: HIT.words[1] }];
function sCamp(c, t, o = {}) {
  look(c, hookCam(t), () => campWorld(c, t));
  const wob = [HIT.jolt, HIT.flare[0]].reduce((a, h) => a + (t > h ? Math.sin((t - h) * 16) * Math.exp(-(t - h) * 5) * .07 : 0), 0);
  if (!o.noTitle) hookTitle(c, TITLE, t, { gone: ss(seg(t, HIT.titleOut[0], HIT.titleOut[1])), cy: 400, wob });
  if (!o.noText && t > HIT.jolt - .02 && t < HIT.jolt + 1.95) {   // "BRRR!" khi giật nảy (ngoài kính, để readcheck đo được)
    const pu = 1 + .12 * Math.sin(Math.PI * seg(t, HIT.jolt, HIT.jolt + .25));
    c.save(); c.translate(810, 690); c.scale(pu, pu); c.rotate(.05 * Math.sin((t - HIT.jolt) * 30) * Math.exp(-(t - HIT.jolt) * 3)); c.translate(-810, -690);
    popText(c, 'BRRR!', 810, 720, 130, C.mintL, C.ink, t, HIT.jolt, { step: .03, sh: 9 }); c.restore();
  }
}

/* ================= KÍNH LỚN (4,95–11,9 s): lao vào đèn đuôi, buồng sáng, nhiệt kế ================= */
function lensBig(t) {
  const big = ss(seg(t, HIT.zoom[0], HIT.zoom[1])), cam = hookCam(t), [wx, wy] = lsLens(), st = toScreen(cam, wx + 20, wy - 70);
  const sh = decay(t, [HIT.bloom], 8) * 4;
  const bx = 540 + 12 * Math.sin(t * 1.3) + sh * Math.sin(t * 50), by = 690 + 10 * Math.sin(t * 1.7), br = 310 + 6 * Math.sin(t * 2.1);
  const hop = Math.sin(Math.PI * seg(t, HIT.zoom[0], HIT.zoom[1])) * 120;
  return { x: lerp(st[0], bx, big), y: lerp(st[1], by, big) - hop, r: lerp(LS.r * cam.z, br, big), big };
}
// tiến trình đi vào buồng sáng (0 ngoài, 1 trong)
const inside = t => ss(seg(t, HIT.dive[0], HIT.dive[1])) * (1 - ss(seg(t, HIT.out[0], HIT.out[1])));
function chamberState(t) {
  const lit = clamp(HIT.pops.filter(h => t > h).length / HIT.pops.length * .7 + .3 * Math.sin(Math.PI * seg(t, HIT.bloom - .1, HIT.bloom + 1.2)) + (t > HIT.bloom ? .3 : 0));
  return { t, pops: HIT.pops, bloom: HIT.bloom, lit };
}
function lensInside(c, t, L) {
  const io = inside(t), cam = hookCam(HIT.zoom[0]), bs = blinkCamp(t), tp = tailOf(bs);
  // ngoài buồng sáng: trại phóng to vào đèn đuôi (vào) hoặc vào mặt Blink (ra, nhịp "ồ")
  if (io < 1) {
    const going = t < HIT.out[0], d = going ? ss(seg(t, HIT.zoom[0] + .2, HIT.dive[1])) : 1 - ss(seg(t, HIT.out[0], HIT.out[1] + .2));
    const face = rigPt(bs.x, bs.y, bs.k, bs.yaw, 0, [0, -1.0, .8]), F = going ? tp : face;
    const mag = going ? lerp(1.5, 6, d * d) : lerp(1.15, 6, d * d);
    c.save(); zoomIn(L.x, L.y, mag * cam.z, F[0], F[1], () => campWorld(c, t, { noLoupe: true }))(c); c.restore();
  }
  if (io > 0) {                                                   // buồng sáng hiện ra từ tâm đèn, như cửa sổ tròn mở rộng
    const R0 = L.r * .78, panL = ss(seg(t, HIT.therm[0] - .2, HIT.therm[1] + .3)) * (1 - ss(seg(t, HIT.out[0] - .3, HIT.out[0])));
    c.save(); c.beginPath(); c.arc(L.x, L.y, lerp(8, L.r * 1.05, io), 0, TAU); c.clip();
    chamber(c, L.x - 80 * panL, L.y - 10 * panL, R0 * (1 - .12 * panL), chamberState(t));
    // nhiệt kế trượt vào từ phải, run lập cập; vạch đỏ chỉ nhích một nấc ở chữ "heat" (FACTS §2)
    const th = ss(seg(t, HIT.therm[0], HIT.therm[1])) * (1 - ss(seg(t, HIT.out[0] - .2, HIT.out[0] + .1)));
    if (th > 0) {
      const lv = .12 + .06 * ss(seg(t, HIT.tick, HIT.tick + .2)), sh = t > HIT.therm[1] && t < HIT.therm[1] + .6 ? t : 0;
      thermometer(c, lerp(L.x + L.r + 150, L.x + 175, th), L.y + 210, 150, lv, sh, t > HIT.tick + .3 ? 'ok' : 'cold');
      const tk = seg(t, HIT.tick, HIT.tick + .5); if (tk > 0 && tk < 1) for (let i = 0; i < 3; i++) { const a = -2.4 + i * .5; c.strokeStyle = `rgba(255,255,255,${1 - tk})`; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(L.x + 175 + Math.cos(a) * 40, L.y - 50 + Math.sin(a) * 40); c.lineTo(L.x + 175 + Math.cos(a) * (60 + 30 * tk), L.y - 50 + Math.sin(a) * (60 + 30 * tk)); c.stroke(); }
    }
    c.restore();
    if (io < 1) { c.strokeStyle = `rgba(255,248,214,${.8 * (1 - io)})`; c.lineWidth = 10; c.beginPath(); c.arc(L.x, L.y, lerp(8, L.r * 1.05, io), 0, TAU); c.stroke(); }
  }
}
function sLens(c, t) {
  look(c, hookCam(t), () => campWorld(c, t, { noLoupe: true }));
  const L = lensBig(t), talk = talkAt(t), io = inside(t);
  const name = t > HIT.bloom - .1 && t < HIT.bloom + .5 ? 'surprised' : talk ? 'explaining' : t > HIT.wink[0] ? 'laugh' : io > .5 ? 'excited' : 'happy';
  loupe(c, L.x, L.y, L.r, {
    E: ex(BY.loupe, name, { talk, look: L.big > .5 ? [.15, .35] : [.75, .1], blink: talk ? 0 : blinkAt(t) }), rot: lerp(-.1, -.05, L.big), pose: { ...ARM.peer, scarf: true },
    inside: L.big > .02 ? cc => lensInside(cc, t, L) : null,
  });
  // chữ hành động (ngoài kính, để readcheck đo được)
  const p0 = HIT.pops[0];
  if (t > p0 - .02 && t < HIT.pops.at(-1) + 1.0) popText(c, 'POP!', 230, 300, 140, C.lemon, C.grape, t, p0, { step: .03, sh: 10 });
  if (t > HIT.bloom - .02 && t < HIT.bloom + 1.95) { const pu = 1 + .1 * Math.sin(Math.PI * seg(t, HIT.bloom, HIT.bloom + .25)); c.save(); c.translate(820, 270); c.scale(pu, pu); c.translate(-820, -270); popText(c, 'GLOW!', 820, 300, 130, C.lemon, C.grape, t, HIT.bloom, { step: .03, sh: 10 }); c.restore(); }
}
function sHookAndLens(c, t, o = {}) {
  if (t < HIT.zoom[0]) sCamp(c, t, o);
  else sLens(c, t);
}

/* ================= SỔ (12,6–15,85 s): sticker, Albie đếm chân, Blink lao vào trang đúng "go!" ================= */
const SLOT = { x: 280, y: 480, r: 140 }, PAGE = { x: 84, y: 200, w: 890, h: 650 }, DIVE = { x: 610, y: 735 }, MINI = { x: 860, y: 745, r: 76 }, AL = { x: 250, y: 1450, k: 240 };
function stickerArt(cc) {                                         // hình trong sticker: buồng sáng thu nhỏ, cánh quạt, giọt vàng, bong bóng xanh, tia sáng
  chamber(cc, 0, 0, 92, { t: 1.3, pops: [1.1], bloom: 9, lit: .25 });
  burst(cc, 10, -10, 50, .9);
}
function miniArt(cc) { bigGlow(cc, -16, 22, 70, 1); drawChar(cc, BY.blink, { x: 0, y: 50, k: 46, yaw: .4, showFx: false, expr: ex(BY.blink, 'laugh'), pose: { glow: 1.3 } }); }
function albumBlink(t) {                                          // Blink bay vào, lượn, lao vào trang đúng "go!" (toạ độ khung)
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
  if (t >= HIT.zoomOut[0]) {                                      // sticker nằm sẵn ở chỗ (máy lùi ra từ chính nó), nảy lên ở cú dán
    const p = t >= t0 ? back(seg(t, t0, t0 + .22), 2.6) : 1;
    badge(c, SLOT.x, SLOT.y, SLOT.r, N.wall, cc => { const k = SLOT.r / 100; cc.scale(k, k); stickerArt(cc); }, -.05, t >= t0 ? lerp(1.2, 1, p) : 1);
    popText(c, 'Mix', 470, 468, 122, C.berry, null, t, t0 + .1, { align: 'left', step: .02 });
    popText(c, 'and make light!', 470, 560, 64, C.ink, null, t, t0 + .2, { align: 'left', step: .012, font: subFont });
  }
  // trang gợn sáng khi Blink lao vào, rồi sticker Blink tí hon bật lên
  const rq = seg(t, HIT.gulp, HIT.gulp + .8);
  if (rq > 0 && rq < 1) for (let k = 0; k < 3; k++) { const q = clamp(rq * 1.4 - k * .2); if (q > 0 && q < 1) { c.strokeStyle = `rgba(255,227,77,${.9 * (1 - q)})`; c.lineWidth = 12 * (1 - q) + 2; c.beginPath(); c.ellipse(DIVE.x, DIVE.y, 60 + 260 * q, 26 + 90 * q, 0, 0, TAU); c.stroke(); } }
  if (t >= HIT.mini) badge(c, MINI.x, MINI.y, MINI.r, C.night, miniArt, .06, back(seg(t, HIT.mini, HIT.mini + .3), 2.6));
  // Albie: câu cửa miệng có hành động (đếm chân Blink bằng trang giấy, há miệng, "đớp" đúng "go!")
  const talk = talkAt(t, 'albie'), b = albumBlink(t);
  shadow(c, AL.x + 18, AL.y + 4, 220, .18);
  albumGulp(c, t, { x: AL.x, y: AL.y, k: AL.k, talk, line: line('L06'), counts: HIT.counts, tg: HIT.gulp, look: b ? [.75, -.4] : [.5, -.7], blink: talk ? 0 : blinkAt(t, .4) });
  if (b) {
    c.save(); c.translate(b.x, b.y - b.k); c.rotate(b.rot); c.translate(-b.x, -(b.y - b.k));
    const cnt = Math.min(1, pulse(t, HIT.counts, .05, .12)), legs = cnt > .2 ? [0, [-.55, -.55, .1], 0, 0, [.55, -.55, .1], 0] : null;
    drawBlink(c, { x: b.x, y: b.y, k: b.k, yaw: b.yaw, fly: 1, lift: .3, glow: 1.2 + .4 * Math.sin(t * 6), E: ex(BY.blink, t > HIT.dive2[0] ? 'excited' : 'laugh', { look: [-.6, .2] }), legsUp: legs, glowR: 120, glowA: .6 });
    c.restore();
  }
  c.restore();
}

/* ================= GAG (16,35–22 s): "You're so bright, Blink!" — "I'm not glowing!", đuôi bùng chói ================= */
function gagCam(t) {
  const L9 = line('L09'), d = seg(t, HIT.flip[1], DUR), toBlink = ss(seg(t, HIT.shy[0] - .3, HIT.shy[1])) * (1 - ss(seg(t, HIT.blaze[1], HIT.blaze[1] + .5)));
  const ask = ss(seg(t, L9.t - .3, L9.t + .4)), home = ss(seg(t, HIT.warm[0] - .2, HIT.loop[0]));
  const shake = decay(t, [HIT.blaze[0] + .1], 7);
  const cx = 585 + 20 * Math.sin(d * 2.4) + 40 * toBlink - 10 * ask, cy = 1070 - 8 * d - 10 * toBlink, z = 1.9 + .15 * toBlink + .05 * ask;
  return { cx: lerp(cx, 560, home) + 7 * Math.sin(t * 47) * shake, cy: lerp(cy, 1080, home) + 6 * Math.sin(t * 41) * shake, z: lerp(z, 1.8, home) };
}
function blazeA(t) { return ss(seg(t, HIT.blaze[0], HIT.blaze[0] + .35)) * (1 - ss(seg(t, HIT.blaze[1] - .45, HIT.blaze[1]))); }
function sGag(c, t, o = {}) {
  const cm = gagCam(t);
  look(c, cm, () => campWorld(c, t, { gag: true }));
  const bl = blazeA(t);
  if (bl > .01) {                                                 // cả trại vàng chói (lớp phủ ấm, không nhấp nháy)
    c.fillStyle = `rgba(255,236,150,${.42 * bl})`; c.fillRect(0, 0, 1080, 1920);
    const tp = toScreen(cm, ...tailOf(blinkCamp(t, true)));
    for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + t * .4; c.strokeStyle = `rgba(255,255,255,${.35 * bl})`; c.lineWidth = 26; c.lineCap = 'round'; c.beginPath(); c.moveTo(tp[0] + Math.cos(a) * 140, tp[1] + Math.sin(a) * 140); c.lineTo(tp[0] + Math.cos(a) * (420 + 200 * bl), tp[1] + Math.sin(a) * (420 + 200 * bl)); c.stroke(); }
  }
  if (!o.noText && t > HIT.blaze[0] - .17 && t < HIT.blaze[0] + 1.87) {
    const t0 = HIT.blaze[0] - .15, pu = 1 + .12 * Math.sin(Math.PI * seg(t, t0, t0 + .25));
    c.save(); c.translate(540, 330); c.scale(pu, pu); c.translate(-540, -330);
    popText(c, 'BRIGHT!', 540, 360, 160, C.lemon, C.grape, t, t0, { step: .03, sh: 11 }); c.restore();
  }
}

/* ---------- vòng lặp: ánh sáng đuôi Blink nở thành vòng tròn, mở về đúng khung đầu ---------- */
function glowIris(c, t) {
  sGag(c, t, { noText: true });
  const cm = gagCam(HIT.loop[0]), tp = toScreen(cm, ...tailOf(blinkCamp(HIT.loop[0], true))), u = ei(seg(t, HIT.loop[0], DUR - .04));
  const R = lerp(30, 2300, u), cx = lerp(tp[0], 540, u), cy = lerp(tp[1], 960, u);
  circle(c, cx, cy, R + 40, C.mango); circle(c, cx, cy, R + 18, C.lemon);
  c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip(); REC.mute++; sCamp(c, t - DUR); REC.mute--; c.restore();
}

/* ---------- chuyển cảnh: kính "chụp" → sticker → trang sổ · trang sổ lật về trại ---------- */
function matchCut(c, t) {
  stickerMatchCut(c, t, { t0: HIT.zoomIn[0], t1: HIT.zoomOut[0], t2: HIT.zoomOut[1], lens: lensBig(HIT.zoomIn[0]), from: cc => sLens(cc, HIT.zoomIn[0]), to: (cc, tt) => sAlbum(cc, tt), slot: SLOT, fill: N.wall, draw: cc => { cc.scale(SLOT.r / 100, SLOT.r / 100); stickerArt(cc); } });
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
  if (t >= HIT.loop[0]) glowIris(c, t);
  else if (t >= HIT.flip[1]) sGag(c, t);
  else if (t >= HIT.flip[0]) pageFlip(c, t);
  else if (t >= HIT.zoomOut[1]) sAlbum(c, t);
  else if (t >= HIT.zoomIn[0]) matchCut(c, t);
  else { sHookAndLens(c, t); if (t >= HIT.snap) snapFlash(c, t, HIT.snap, lensBig(t)); }
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t, 495, SAFE.subY);                       // tâm 495: tấm hai dòng rộng nhất vẫn dừng trước cột nút phải (x 940)
  c.restore();
}
