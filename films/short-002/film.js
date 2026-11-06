// SHORT-002 · This Butterfly Tastes With Its Feet! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp: khung cuối = khung đầu.
import { C, REC, circle, ell, capsule, rrect, poly, ground, popText, subFont, bigFont, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { hookTitle, stickerMatchCut, snapFlash } from '/_shared/episode.js';
import { makeTalk, blinkAt, flutterWave, ex, rigPt, look, toScreen, loupe, zoomIn, ARM, flutterAt, tasteGlow, albieAt, albiePageTip, badge, shadow, subtitle } from '/_shared/episode.js';
import { cloud, sun, flower, gingham, watermelon, drop } from './props.js';
import { at, BEAT, SECS, LINES, CARDS, DUR, HIT } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;

/* ================= PICNIC: miếng dưa hấu trên khăn ca-rô (một cảnh liền, máy quay theo keyframe) ================= */
const MEL = { x: 520, y: 960, R: 380 };                          // tâm mặt cắt miếng dưa
const BFX = 500, BFY = MEL.y, BFK = 175, BFYAW = 1.25;           // Flutter đứng trên mặt cắt
const bp = p => rigPt(BFX, BFY, BFK, BFYAW, 0, p);
const FOOT0 = bp([-.3, 0, .44]), HEADP = bp([0, -.6, .7]);
// đường đi của "tia ngọt": bàn chân → gối → hông → ngực → đầu (toạ độ rig của Flutter)
const SIG = [[-.3, 0, .44], [-.27, -.5, .34], [-.08, -.56, .24], [0, -.66, .14], [0, -.72, .5], [0, -.6, .7]].map(bp);
function sigPos(s) {
  const L = []; let tot = 0; for (let i = 1; i < SIG.length; i++) { const d = Math.hypot(SIG[i][0] - SIG[i - 1][0], SIG[i][1] - SIG[i - 1][1]); L.push(d); tot += d; }
  let d = clamp(s) * tot; for (let i = 0; i < L.length; i++) { if (d <= L[i] || i === L.length - 1) { const k = clamp(d / L[i]); return [lerp(SIG[i][0], SIG[i + 1][0], k), lerp(SIG[i][1], SIG[i + 1][1], k)]; } d -= L[i]; }
}
const STAND = { x: 846, y: 880, r: 200 };                         // chỗ Miss Loupe đứng ở nhịp "ồ" (chân chạm khăn ở y ≈ 1426)
// nhịp móc 0–3 s (HOOK.md): peek = cúi nhìn cái vòi, huhEnd = hết cái nhìn "hả?" ra người xem, twinkle = đốm sáng gợi ý ở bàn chân
const HOOK = { peek: 1.45, huhEnd: 2.95, twinkle: 2.3, tip: [0, -.25, .95], camLook: [-.12, .02] };
function cam(t) {
  // móc: đẩy cận vào đầu và cái vòi (cánh nằm dưới chữ móc, không che chữ), giữ cận và trôi nhẹ đến lúc kéo xa
  const [cx, cy, z] = K([[-1, [575, 760, 1.9]], [HIT.sproing - .12, [575, 760, 1.9]], [HIT.sproing + .2, PUSH[0]], [HIT.pull, PUSH[1]], [3.2, [540, 960, 1]], [HIT.push, [540, 960, 1]], [11.4, [STAND.x - 20, 1150, 1.3]], [HIT.aim[0], [STAND.x - 20, 1150, 1.3]], [HIT.aim[1], [640, 1000, 1.25]], [15, [640, 1000, 1.25]]])(t);   // v4: lia về phía Flutter trước cú chụp
  return { cx, cy, z };
}
const PUSH = [[630, 765, 2.3], [636, 760, 2.35]];   // đỉnh cánh (y ≈ 520 trong cảnh) nằm dưới chữ móc đã thu nhỏ
// vòi bật ra như lò xo: duỗi hẳn, rồi nảy co–duỗi nhỏ dần (0..1, 1 = duỗi thẳng)
function sproingTongue(t) {
  const u = t - (HIT.sproing - .07);
  if (u <= 0) return 0;
  const s = u < .12 ? eo(u / .12) : 1 - .3 * Math.abs(Math.sin((u - .12) * 15)) * Math.exp(-(u - .12) * 3.2);
  return s * (1 - ss(seg(t, HIT.curl, HIT.curl + .5)));
}

function flutterPicnic(c, t, detail) {
  const p = ss(seg(t, -.75, HIT.stomp)), landed = t >= HIT.stomp;
  const x = BFX + (landed ? 0 : Math.sin(t * 5) * 30 * (1 - p)), y = BFY - 260 * (1 - p) + (landed ? 0 : Math.sin(t * 7) * 18 * (1 - p));
  const beta = landed ? .2 + .14 * Math.sin(t * 2.4) + .5 * Math.exp(-(t - HIT.stomp) * 6) : .25 + flutterWave(t + .078) * 1.05;   // lệch nửa nhịp vỗ: khung đầu bắt đúng lúc cánh mở ngang, không che chữ móc
  const tongue = Math.max(t > HIT.sproing - .1 && t < HIT.curl + .6 ? sproingTongue(t) : 0, ss(seg(t, HIT.straw, HIT.straw + .8)));
  const lift = ss(seg(t, 2.7, 3.3)) * (1 - ss(seg(t, HIT.tap - .14, HIT.tap)));      // chân trước nhấc lên rồi dậm xuống
  const glow = ss(seg(t, HIT.tap, HIT.tap + .4)) * (1 - seg(t, 10.0, 10.6));
  // móc: giật mình tròn mắt khi vòi bung → cúi nhìn cái vòi của mình → vòi cuộn lại, quay ra nhìn người xem "hả?"
  let name = t > HIT.sip ? 'laugh' : 'happy', lk = t > 8.5 ? [.55, .5] : [.3, .1];
  if (t > HIT.sproing - .05 && t < HOOK.peek) name = 'surprised';
  else if (t >= HOOK.peek && t < HIT.curl) { name = 'curious'; lk = [.6, .9]; }
  else if (t >= HIT.curl && t < HOOK.huhEnd) { name = 'confused'; lk = HOOK.camLook; }
  if (t < HIT.stomp + .15) { name = 'excited'; lk = [.35, .8]; }   // khung đầu (và trong đốm mắt cuối phim): phấn khích, mắt to, nhìn xuống miếng dưa sắp dậm
  const E = ex(BY.flutter, name, { look: lk });
  if (name === 'excited') E.eye = { ...E.eye, scale: 1.3 };
  if (name === 'surprised') E.eye = { ...E.eye, scale: lerp(1, 1.45, back(seg(t, HIT.sproing - .05, HIT.sproing + .2), 3)), pupil: .3 };
  if (t > HIT.sproing - .05 && t < HIT.sproing + .4) {           // vệt "bung" phẳng sau đầu vòi: cú bật đọc được ở cỡ điện thoại
    const q = seg(t, HIT.sproing - .05, HIT.sproing + .4), tip = bp(HOOK.tip), R = BFK * .36 * eo(Math.min(1, q * 2.4)) * (1 - q * q);
    const pts = []; for (let i = 0; i < 16; i++) { const a = .2 + i * Math.PI / 8, rr = i % 2 ? R * .5 : R; pts.push([tip[0] + Math.cos(a) * rr, tip[1] + Math.sin(a) * rr]); }
    poly(c, pts, C.lemon);
  }
  flutterAt(c, x, y, BFK, {
    beta, lift: landed ? 0 : .3 * (1 - p), tongue, detail, rot: landed ? 0 : -.1,
    legsUp: [[-.3, -.34 * lift, .44 + .12 * lift], 0, 0, 0, 0, 0],
    E, extra: detail ? tasteGlow(glow) : null,
  });
  if (t > HOOK.twinkle && t < HOOK.twinkle + .5) {               // gợi ý: hai đốm sao nháy ở bàn chân (chưa giải thích, kính sẽ soi vào đây)
    const q = seg(t, HOOK.twinkle, HOOK.twinkle + .5);
    [[FOOT0, -30], [bp([.3, 0, .44]), 34]].forEach(([f, dx], i) => star(c, f[0] + dx, f[1] - 24 - 34 * eo(q), 19 * Math.sin(Math.PI * clamp(q * 1.1 - i * .1)), C.lemon));
  }
  if (t >= HIT.stomp && t < HIT.stomp + .6) {                    // nước dưa bắn khi dậm chân
    const q = seg(t, HIT.stomp, HIT.stomp + .6);
    for (let i = 0; i < 7; i++) { const a = -Math.PI + .3 + i * .42, d = 40 + 120 * eo(q); circle(c, FOOT0[0] - 40 + Math.cos(a) * d, BFY - 6 + Math.sin(a) * d * .7 + 160 * q * q, 9 * (1 - q), C.berry); }
  }
  if (t > HIT.sproing - .05 && t < HIT.sproing + .45) {           // nét hành động khi vòi tự bung ra
    const q = seg(t, HIT.sproing - .05, HIT.sproing + .45), tip = bp(HOOK.tip);
    c.strokeStyle = C.ink; c.lineCap = 'round'; c.lineWidth = 7 * (1 - q);
    for (const a of [-.9, -.35, .2, .75, 1.3]) { c.beginPath(); c.moveTo(tip[0] + Math.cos(a) * (40 + 30 * q), tip[1] + Math.sin(a) * (40 + 30 * q)); c.lineTo(tip[0] + Math.cos(a) * (62 + 36 * q), tip[1] + Math.sin(a) * (62 + 36 * q)); c.stroke(); }
  }
  if (detail && glow > 0) for (let i = 0; i < 10; i++) {         // giọt nước dưa dâng lên chân (chỉ trong kính)
    const ph = ((t * .8 + i * .1) % 1), fx = FOOT0[0] - 40 + (i * 29) % 86, fy = FOOT0[1] + 24 - ph * 26;
    drop(c, fx, fy, 4.6 * (1 - ph * .5) * glow, C.berry);
  }
  if (detail && t > HIT.sigA - .05 && t < HIT.sigB + .3) {         // tia "ngọt!" chạy từ chân lên miệng (chỉ trong kính)
    const s = ss(seg(t, HIT.sigA, HIT.sigB));
    for (let k = 5; k >= 0; k--) { const q = sigPos(s - k * .045); if (s - k * .045 < 0) continue; circle(c, q[0], q[1], (7 - k) * .9 + 2, k ? 'rgba(183,240,74,.55)' : C.lemon); }
    if (t > HIT.sigB) { const b = seg(t, HIT.sigB, HIT.sigB + .3); for (let i = 0; i < 5; i++) { const a = i * TAU / 5 - Math.PI / 2; star(c, HEADP[0] + Math.cos(a) * 26 * eo(b), HEADP[1] + Math.sin(a) * 26 * eo(b), 7 * (1 - b), C.lemon); } }
  }
}
function picnicWorld(c, t, detail) {
  ground(c, C.sky);
  sun(c, 905, 225, 62, t * .3); cloud(c, 150, 610, 110); cloud(c, 1000, 660, 80);
  for (let i = 0; i < 9; i++) ell(c, -60 + i * 160, 950 + (i % 2) * 18, 120, 90, 0, i % 2 ? C.leaf : C.leafD);   // hàng cây bụi phía sau
  gingham(c, -600, 1000, 1700, 2600, 96);
  flower(c, 990, 1080, 34, C.berry, C.cream); flower(c, 90, 1120, 28, C.grape, C.lemon);
  shadow(c, MEL.x, MEL.y + MEL.R * .98, MEL.R * .92, .2);
  watermelon(c, MEL.x, MEL.y, MEL.R);
  flutterPicnic(c, t, detail);
}
// Miss Loupe trong cảnh picnic (toạ độ cảnh); trả về tâm/bán kính kính để iris dùng
function lensState(t) {
  const enter = K([[HIT.lensIn, [1300, 1250, 200]], [3.4, [FOOT0[0] + 10, FOOT0[1] + 40, 240]]])(t);
  let x = enter[0], y = enter[1], r = enter[2];
  const sp = sigPos(ss(seg(t, HIT.sigA, HIT.sigB)));
  const follow = ss(seg(t, HIT.sigA - .1, HIT.sigA + .3)), head = ss(seg(t, HIT.sigB - .2, HIT.sigB + .2)), out = ss(seg(t, HIT.lensOut, HIT.lensOut + .6));
  x = lerp(x, sp[0] + 10, follow); y = lerp(y, sp[1] + 34, follow);
  x = lerp(x, HEADP[0] + 30, head); y = lerp(y, HEADP[1] + 60, head);
  x = lerp(x, STAND.x, out); y = lerp(y, STAND.y, out); r = lerp(r, STAND.r, out);
  const aim = ss(seg(t, HIT.aim[0], HIT.aim[1])); x = lerp(x, AIM.x, aim); y = lerp(y, AIM.y, aim); r = lerp(r, AIM.r, aim);   // v4: giơ kính về phía Flutter để "chụp"
  // điểm của cảnh nằm giữa kính khi phóng to
  let fx = FOOT0[0] + 6, fy = FOOT0[1] - 6;
  fx = lerp(fx, sp[0], follow); fy = lerp(fy, sp[1], follow); fx = lerp(fx, HEADP[0] + 26, head); fy = lerp(fy, HEADP[1] + 40, head);
  const m = ss(seg(t, HIT.zoom, HIT.zoom + .5)) * (1 - out), mag = lerp(1.4, lerp(4.0, 3.1, follow), m);
  return { x, y, r, m, mag, fx, fy, out };
}
const AIM = { x: 610, y: 820, r: 190 };                          // v4: chỗ kính lúc "chụp" Flutter (toạ độ cảnh)
const SHOE = K([[12.2, [0]], [12.4, [1]], [HIT.shoe[0], [0]], [HIT.shoe[0] + .12, [.8]], [HIT.shoe[1], [0]], [14, [0]]]);
function loupePicnic(c, t) {
  if (t < HIT.lensIn) return;
  const L = lensState(t), wow = t >= HIT.wow - .1;
  let name = t < HIT.zoom ? 'happy' : t < HIT.lensOut ? 'surprised' : 'happy', look = [-.3, -.5], pose = L.out < .5 ? ARM.peer : {};
  if (wow) {
    const down = t > 12.05 && t < HIT.shrug;
    name = t < 12.05 ? 'surprised' : down ? 'curious' : t < 13.3 ? 'confused' : 'laugh';
    look = down ? [.05, .95] : [0, -.1];
    const lift = SHOE(t)[0];
    pose = { ...(t >= HIT.shrug ? ARM.shrug : {}), footR: [.2, -.17 - .46 * lift, .16 * lift] };
  }
  shadow(c, L.x - Math.sin(-.14) * 0, STAND.y + 548, 150 * (L.out), .14 * L.out);
  loupe(c, L.x, L.y, L.r, {
    E: ex(BY.loupe, name, { talk: talkAt(t), look, blink: name === 'happy' ? blinkAt(t) : 0 }), rot: lerp(-.3, -.04, L.out), pose,
    inside: L.m > .01 ? zoomIn(L.x, L.y, L.mag, lerp(L.x, L.fx, L.m), lerp(L.y, L.fy, L.m), () => picnicWorld(c, t, L.m > .3 ? 1 : 0)) : null,
  });
}
function sPicnic(c, t, o = {}) {
  const cm = cam(t);
  look(c, cm, () => { picnicWorld(c, t, 0); if (!o.noLup) loupePicnic(c, t); });
  // chữ móc (v4: hookTitle dùng chung): hiện đủ ở khung 0, từng dòng nảy có tiếng; khi máy đẩy cận, chữ nhỏ lại và nhích lên để cánh không che; thu nhỏ biến mất khi máy kéo xa
  const gone = ss(seg(t, 2.55, 2.9)), up = ss(seg(t, HIT.sproing - .12, HIT.sproing + .2));
  hookTitle(c, TITLE, t, { gone: 1 - (1 - gone) * lerp(1, .7, up), dy: -105 * up, cy: 360, rot: -.04, wob: t > HIT.stomp ? Math.sin((t - HIT.stomp) * 14) * Math.exp(-(t - HIT.stomp) * 5) * .05 : 0 });
  if (t > HIT.sweet - .05 && t < 10.4) popText(c, 'SWEET!', 540, 420, 180, C.berry, C.cream, t, HIT.sweet, { step: .05, sh: 10 });
}

/* ================= SỔ: sticker, Albie, rồi Flutter nếm góc trang ================= */
const AL = { x: 262, y: 1440, k: 240 }, PAGE = [.82, -1.35, -.15], BFK2 = 118;
const TITLE = [{ text: 'TASTY', y: 258, px: 186, fill: C.lemon, shadow: C.night, t0: HIT.words[0] }, { text: 'SOCKS?!', y: 446, px: 190, fill: C.berry, shadow: C.cream, t0: HIT.words[1] }];
const SLOT = { x: 280, y: 480, r: 140 }, stickerArt = cc => flutterAt(cc, -12, 92, 78, { beta: .3 });
const PAGE_SPOT = rigPt(AL.x, AL.y, AL.k, .32, 0, albiePageTip(PAGE, .74));
function sAlbum(c, t, o = {}) {
  ground(c, C.sky); ell(c, 200, 1760, 900, 420, 0, C.skyL);
  ell(c, 540, 1720, 980, 330, 0, C.leaf); ell(c, 540, 1760, 900, 280, 0, C.leafD);
  const pageOff = ss(seg(t, HIT.recall - .2, HIT.recall + .1));   // v4: trang sổ trượt lên khỏi khung để chữ móc trở lại trên nền trời
  c.save(); c.translate(0, -980 * pageOff);
  rrect(c, 96, 218, 890, 560, 54, C.grape); rrect(c, 84, 200, 890, 560, 54, C.cream);
  // một sticker lớn
  const t0 = HIT.stamp;
  circle(c, 280, 480, 142, '#EBDDBC');
  if (t >= HIT.irisB) {                                          // v4: sticker nằm sẵn ở chỗ (máy lùi ra từ chính nó), nảy lên ở cú dán
    const p = t >= t0 ? back(seg(t, t0, t0 + .22), 2.6) : 1;
    badge(c, SLOT.x, SLOT.y, SLOT.r, C.mint, stickerArt, -.05, t >= t0 ? lerp(1.2, 1, p) : 1);
    popText(c, 'Taste', 470, 468, 122, C.berry, null, t, t0 + .1, { align: 'left', step: .02 });
    popText(c, 'with feet', 470, 560, 76, C.ink, null, t, t0 + .2, { align: 'left', step: .012, font: subFont });
  }
  c.restore();
  // Albie
  const landed = t >= HIT.land, talk = talkAt(t, 'albie');
  const hop = .1 * Math.sin(Math.PI * seg(t, t0, t0 + .22)) + .14 * Math.sin(Math.PI * seg(t, HIT.land + .05, HIT.land + .3));
  let E;
  if (!landed) E = ex(BY.albie, 'happy', { talk, look: t < HIT.stamp + 1.1 ? [.45, -.65] : [.15, -.05], blink: talk ? 0 : blinkAt(t, .4) });
  else if (t < 17.85) E = ex(BY.albie, 'surprised', { look: [.75, .35] });
  else if (talk > 0) E = ex(BY.albie, 'shout', { talk, look: [.75, .35] });
  else E = ex(BY.albie, 'worried', { look: [.75, .35], fx: true });
  shadow(c, AL.x + 18, AL.y + 4, 220, .18);
  albieAt(c, AL.x, AL.y, AL.k, { E, hop, tabsUp: landed ? 1 - seg(t, HIT.land, HIT.land + 1.5) : 0, page: t > 14.9 ? PAGE : null, curl: -.2, fx: landed && talk === 0 && t > 19.55 });
  // Flutter bay vào, đậu lên góc trang, nếm giấy
  if (t >= HIT.fly && t < HIT.takeoff) {
    const p = ss(seg(t, HIT.fly, HIT.land)), spot = [PAGE_SPOT[0], PAGE_SPOT[1] - hop * AL.k];
    const x = lerp(1250, spot[0], p) + (landed ? 0 : Math.sin(t * 6) * 40 * (1 - p)), y = lerp(640, spot[1], p) + (landed ? 0 : Math.sin(t * 8) * 30 * (1 - p));
    flutterAt(c, x, y, BFK2, { beta: landed ? .2 + .12 * Math.sin(t * 2.6) : .25 + flutterWave(t), lift: landed ? 0 : .3, rot: landed ? 0 : -.12, tongue: ss(seg(t, HIT.sipPage, HIT.sipPage + .5)) * .75, E: ex(BY.flutter, t > HIT.sipPage + .3 ? 'laugh' : 'happy', { look: [.4, .5] }) });
    if (landed && t < HIT.land + .5) { const b = seg(t, HIT.land, HIT.land + .5); for (let i = 0; i < 4; i++) star(c, spot[0] - 30 + i * 22, spot[1] - 4 - 26 * eo(b), 9 * (1 - b), C.lemon); }
  }
  // bóng thoại "Mmm!" của Flutter (Flutter không lời: đây là tiếng ngân)
  if (t >= HIT.mmm) {
    const p = back(seg(t, HIT.mmm, HIT.mmm + .25), 2.2), bx = 846, by = 900;
    c.save(); c.translate(bx, by); c.scale(p, p); c.rotate(.04);
    circle(c, 8, 10, 118, 'rgba(30,27,58,.18)'); ell(c, 0, 0, 150, 96, 0, C.cream); poly(c, [[-80, 60], [-150, 140], [-20, 82]], C.cream);
    c.restore();
    if (p > .98) popText(c, 'Mmm!', bx, by + 26, 78, C.berry, null, t, HIT.mmm + .1, { step: .04 });
  }
}

/* ---------- vòng lặp: Flutter bay vụt vào ống kính, đốm mắt trên cánh mở ra đúng khung đầu ---------- */
function loopOut(c, t) {
  if (t < HIT.takeoff) return;
  const u = ss(seg(t, HIT.takeoff, HIT.spot + .1)), from = PAGE_SPOT;
  const x = lerp(from[0], 540, u), y = lerp(from[1], 1180, u), k = lerp(BFK2, 1100, ei(u));
  flutterAt(c, x, y, k, { beta: .25 + flutterWave(t) * 1.1, lift: .3, yaw: lerp(1.25, .25, u), E: ex(BY.flutter, 'laugh') });
  if (t < HIT.spot) return;
  const H = lerp(0, 1300, ss(seg(t, HIT.spot, DUR - .06)));
  circle(c, 540, 960, H * 1.9 + 70, C.night); circle(c, 540, 960, H * 1.45 + 40, C.mango); circle(c, 540, 960, H * 1.16 + 16, C.cream);
  c.save(); c.beginPath(); c.arc(540, 960, H, 0, TAU); c.clip(); REC.mute++; sPicnic(c, t - DUR); REC.mute--; c.restore();
}

/* ---------- iris qua kính: picnic → sổ ---------- */
function matchCut(c, t) {                                      // v4: kính "chụp" Flutter → máy lao xuyên qua mặt kính → hình hoá thành sticker → lùi ra lộ trang sổ
  const cm = cam(HIT.zoomIn[0]), L = lensState(HIT.zoomIn[0]), [sx, sy] = toScreen(cm, L.x, L.y);
  stickerMatchCut(c, t, { t0: HIT.zoomIn[0], t1: HIT.zoomOut[0], t2: HIT.zoomOut[1], lens: { x: sx, y: sy, r: L.r * cm.z }, from: cc => sPicnic(cc, HIT.zoomIn[0]), to: (cc, tt) => sAlbum(cc, tt), slot: SLOT, fill: C.mint, draw: stickerArt });
}
function lensScreen(t) { const cm = cam(t), L = lensState(t), [x, y] = toScreen(cm, L.x, L.y); return { x, y, r: L.r * cm.z }; }
function recallTitle(c, t) { hookTitle(c, TITLE, -1, { gone: 1 - back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: 360, rot: -.04 }); }   // v4: chữ móc trở lại đúng chỗ, đúng cỡ của khung đầu
function irisLens(c, t) {
  const cm = cam(HIT.irisA), L = lensState(HIT.irisA), [sx, sy] = toScreen(cm, L.x, L.y), r0 = L.r * cm.z;
  const u = ei(seg(t, HIT.irisA, HIT.irisB)), R = lerp(r0, 2200, u);
  sPicnic(c, t, { noLup: true });
  loupe(c, sx, sy, R, { E: ex(BY.loupe, 'laugh'), rot: -.04, pose: ARM.shrug, inside: () => sAlbum(c, Math.max(t, HIT.irisB)) });
}

export function drawFilm(c, t) {
  t = clamp(t, 0, DUR - .001);
  c.save();
  if (t >= HIT.zoomIn[0] && t < HIT.zoomOut[1]) matchCut(c, t);
  else if (t < HIT.zoomIn[0]) { sPicnic(c, t); snapFlash(c, t, HIT.snap, lensScreen(t)); }
  else { sAlbum(c, t); loopOut(c, t); }
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t);
  c.restore();
}
