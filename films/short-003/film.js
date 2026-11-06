// SHORT-003 · Crickets Have Ears on Their Legs?! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp: khung cuối nối vào khung đầu.
import { C, REC, circle, ell, capsule, rrect, poly, ground, popText, subFont, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { X } from '/_shared/characters/parts.js';
import { star } from '/_shared/characters/face.js';
import { makeTalk, blinkAt, ex, rigPt, look, toScreen, loupe, zoomIn, ARM, albieAt, badge, shadow, subtitle, hookTitle, askTitle } from '/_shared/episode.js';
import { stars, moon, grass, mushroom, farCricket, note } from './props.js';
import { at, BEAT, LINES, CARDS, DUR, HIT } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const L3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

/* ---------- Chirp: chân trước gần người xem (frontL) vểnh lên nghe; hai chân trước bắt chéo để "bịt đầu gối" ---------- */
const HIP_L = [-.24, -.7, .74], FOOT_L = [-.4, 0, 1.18], FOOT_R = [.4, 0, 1.18], UP_L = [-.48, -1.02, 2.2];   // UP_L: chân vươn lên và ra trước, tách khỏi đầu (cái tai ở ống chân nhìn rõ)
const COVER_L = [.12, -.66, 1.3], COVER_R = [-.1, -.62, 1.34];       // hai bàn chân trước bắt chéo trước ngực, ống chân che lấy nhau
const frontAt = lift => L3(FOOT_L, UP_L, lift);
const HELLO_L = [-.45, -.45, 2.25];                               // chân đưa ra phía Miss Loupe như bắt tay (nhịp "ồ")
const earRigOf = f => { const knee = L3(HIP_L, f, .45); knee[1] += .12; return L3(knee, f, .32); };   // cùng công thức với rig (chirp.js)
const kneeRigOf = f => { const knee = L3(HIP_L, f, .45); knee[1] += .12; return knee; };
function chirpAt(c, x, y, k, o = {}) {
  const cover = o.cover || 0, fl = L3(L3(frontAt(o.lift || 0), HELLO_L, o.hello || 0), COVER_L, cover), fr = L3(FOOT_R, COVER_R, cover);
  return drawChar(c, BY.chirp, {
    x, y, k, yaw: o.yaw ?? 1.15, flip: !!o.flip, lean: o.lean || 0, detail: o.detail || 0, showFx: false,
    expr: o.E || ex(BY.chirp, 'happy', { look: [.4, 0] }),
    pose: { chirp: o.chirp || 0, frontL: fl, frontR: fr, earGlow: o.earGlow || 0, ant: o.ant || 0, lift: (o.hop || 0) - .07 * cover },   // bịt tai thì co người xuống
  });
}
const chirpE = (name, o = {}) => { const E = ex(BY.chirp, name, o); if (o.scale) E.eye = { ...E.eye, scale: o.scale, ...(o.pupil ? { pupil: o.pupil } : {}) }; return E; };

/* ================= ĐÊM: sân khấu nấm dưới trăng (một cảnh liền, máy quay theo keyframe) ================= */
const TITLE = [{ text: 'EARS ON', y: 268, px: 182, fill: C.lemon, shadow: X.nightD, t0: HIT.words[0] }, { text: 'KNEES?!', y: 478, px: 206, fill: C.mint, shadow: X.nightD, t0: HIT.words[1] }];
const MU = { x: 450, top: 1012, R: 330 };                       // mũ nấm
const CKX = 440, CKY = 1040, CKK = 190, CKYAW = 1.15;           // Chirp đứng trên mũ nấm, quay sang phải (về phía tiếng gáy xa)
const FC = { x: 905, y: 700, s: 66 };                           // con dế ở xa: bóng đen trên ngọn cỏ cao, in lên vầng trăng
const ckPt = p => rigPt(CKX, CKY, CKK, CKYAW, 0, p);
const EAR_UP = ckPt(earRigOf(frontAt(1)));                       // cái tai khi chân đang vểnh lên
const STAND = { x: 805, y: 872, r: 178 };                        // chỗ Miss Loupe đứng sát cây nấm sau khi kính rời chân (chân chạm đất ở y ≈ 1358)
const CLOSE = { x: 770, y: 712, r: 150 };                        // nhịp "ồ": cô nhảy lên mép mũ nấm, mặt ngay cạnh cái tai (chân ở y ≈ 1122)
function cam(t) {
  const [cx, cy, z] = K([[-1, [540, 960, .95]], [HIT.crash[0], [540, 960, .95]], [HIT.crash[1], [520, 905, 1.22]], [HIT.answer, [520, 905, 1.22]], [HIT.answer + .25, [524, 910, 1.28]], [HIT.pull, [526, 910, 1.28]],
    [3.2, [540, 960, 1]], [HIT.push, [540, 960, 1]], [HIT.push + .7, [650, 930, 1.3]], [HIT.snap, [656, 922, 1.38]], [15, [656, 922, 1.38]]])(t);   // v2: đẩy chậm tiếp trong lúc "Hello"   // v2: lao vào Chirp ở 0–0,45 s
  return { cx, cy, z };
}
// mặt tai rung như mặt trống khi một vòng sóng chạm tới (0 khi yên)
const drum = t => HIT.drumHit.reduce((a, h) => a + (t > h ? Math.sin((t - h) * 42) * Math.exp(-(t - h) * 8) : 0), 0);
function chirpState(t) {
  const s = { lift: 1, chirp: 0, ant: t * 2.2, glow: 0, E: chirpE('curious', { look: [.6, -.15] }) };
  if (t >= HIT.hear && t < HIT.answer) {                         // nghe thấy! v3: cái đầu gối giật lên trước, Chirp ngó xuống đầu gối mình
    s.lift = 1 + .3 * Math.sin(Math.PI * seg(t, HIT.hear, HIT.hear + .16));
    s.E = chirpE('surprised', { look: t < HIT.kneeLook[0] ? [.65, -.1] : [.35, .8], scale: lerp(1, 1.4, back(seg(t, HIT.hear, HIT.hear + .18), 3)), pupil: .3 });
  }
  else if (t >= HIT.answer && t < HIT.listen2) {                                // gáy đáp lại: hạ chân, cánh cọ nhanh
    s.lift = 1 - ss(seg(t, HIT.answer, HIT.answer + .2)); s.chirp = t < HIT.answerEnd ? Math.abs(Math.sin((t - HIT.answer) * TAU * 4)) : 0;
    s.E = chirpE('excited', { look: [.5, -.2], scale: 1.15 });
  } else if (t >= HIT.listen2 && t < HIT.bend) {                                    // lại vểnh chân nghe
    s.lift = clamp(back(seg(t, HIT.listen2, HIT.listen2 + .24), 2.2), 0, 1.15);
    s.E = chirpE('curious', { look: [.6, -.15], scale: 1.1, blink: blinkAt(t, .2) });
  } else if (t >= HIT.bend && t < HIT.giggle) s.E = chirpE('happy', { look: [-.5, .35] });   // nhìn Miss Loupe đang cúi xuống
  else if (t >= HIT.giggle) {                                                    // khúc khích, tai lóe sáng, hạ chân
    s.chirp = t < HIT.giggle + .6 ? Math.abs(Math.sin((t - HIT.giggle) * TAU * 6)) * .7 : 0;
    s.glow = t < HIT.giggle + .9 ? 1 : 0; s.lift = 1;   // v4: chân vẫn vểnh, cái tai sáng nằm trong kính tới cú chụp (sticker vẽ đúng tư thế này)
    s.E = chirpE(t < HIT.giggle + .9 ? 'laugh' : 'happy', { look: [-.3, .2] });
  }
  return s;
}
function nightWorld(c, t, detail, mid, noSky) {   // mid: vẽ thêm giữa cây nấm và Chirp (Miss Loupe đứng sau Chirp ở nhịp "ồ"). noSky: trời, sao, trăng do lớp nền parallax vẽ (v2)
  if (!noSky) { ground(c, C.night); stars(c, t, 30, 1080, 1250, 3); moon(c, 930, 660, 118); }
  ell(c, 160, 1500, 760, 380, 0, C.nightL); ell(c, 1000, 1560, 660, 400, 0, C.grape);
  for (const [x, y, h] of [[60, 1330, 260], [250, 1300, 200], [700, 1320, 230], [880, 1360, 180], [1050, 1330, 250]]) grass(c, x, y, h, t);
  // con dế ở xa trên ngọn cỏ cao; tiếng gáy của nó lan ra thành những vòng sóng chanh (chỉ phía về Chirp)
  c.strokeStyle = X.nightD; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(FC.x + 60, 1400); c.quadraticCurveTo(FC.x + 90, FC.y + 300, FC.x - 30, FC.y + 60); c.stroke();   // ngọn cỏ cao
  const fw = Math.abs(Math.sin(t * TAU * 4)) * (((t % 2) + 2) % 2 < .55 ? 1 : 0);
  farCricket(c, FC.x, FC.y, FC.s, fw);
  if (t < HIT.drumIn - .5 || t > 12) c.save(), rings(c, FC.x - 40, FC.y - 10, 30, 560, 3, ((t * .9) % 1 + 1) % 1, C.lime, 10, Math.PI - .5, Math.PI + .5), c.restore();
  // cảnh đặc trưng: mỗi vòng sóng lan từ con dế xa tới, chạm mặt tai đúng lúc "bum"
  const toEar = Math.hypot(FC.x - EAR_UP[0], FC.y - EAR_UP[1]), dirA = Math.atan2(EAR_UP[1] - FC.y, EAR_UP[0] - FC.x);
  for (const h of HIT.drumHit) {
    const q = seg(t, h - .45, h); if (q <= 0 || q >= 1) continue;
    c.strokeStyle = C.lime; c.lineCap = 'round'; c.lineWidth = 9; c.beginPath(); c.arc(FC.x, FC.y, 20 + (toEar - 20) * q, dirA - .32, dirA + .32); c.stroke();
  }
  mushroom(c, MU.x, MU.top, MU.R);
  if (mid) mid();
  shadow(c, CKX + 30, CKY + 4, 260, .2);
  const s = chirpState(t);
  chirpAt(c, CKX, CKY, CKK, { lift: s.lift, chirp: s.chirp, ant: s.ant, E: s.E, detail, earGlow: (detail && t > HIT.glow - .05) || s.glow ? 1 : 0 });
  // nốt nhạc bật lên khi Chirp gáy đáp
  for (let i = 0; i < 3; i++) {
    const t0 = HIT.answer + .08 + i * .3, q = seg(t, t0, t0 + .9); if (q <= 0 || q >= 1) continue;
    const w = ckPt([-.17, -1.35, -.2]); note(c, w[0] + 40 + i * 50 + 50 * q, w[1] - 30 - 170 * eo(q), 34 * Math.sin(Math.PI * Math.min(1, q * 1.6)), [C.lime, C.lemon, C.mint][i], -.2 + .2 * i);
  }
  if (!detail) return;
  // trong kính: vòng sóng hút vào tai, mặt tai rung như mặt trống
  const E = ckPt(earRigOf(frontAt(s.lift))), kn = ckPt(kneeRigOf(frontAt(s.lift))), ft = ckPt(frontAt(s.lift)), ang = Math.atan2(ft[1] - kn[1], ft[0] - kn[0]);
  const w = drum(t), on = ss(seg(t, HIT.glow - .05, HIT.glow + .3)) * (1 - ss(seg(t, HIT.lensOut, HIT.lensOut + .3)));
  if (on > 0) {
    if (t < HIT.drumIn) { c.save(); rings(c, E[0], E[1], 8, 70, 3, 1 - ((t * .9) % 1), C.mint, 4); c.restore(); }
    const toFC = Math.atan2(FC.y - E[1], FC.x - E[0]);                      // mỗi cú "bum": ba cung sóng từ phía con dế xa hội tụ vào tai
    for (const h of HIT.drumHit) { const q = seg(t, h - .45, h); if (q <= 0 || q >= 1) continue;
      for (let i = 0; i < 3; i++) { const r = lerp(120, 10, Math.min(1, q + i * .12)); if (r <= 12) continue; c.strokeStyle = C.lime; c.lineCap = 'round'; c.lineWidth = 6 - i; c.beginPath(); c.arc(E[0], E[1], r, toFC - .55, toFC + .55); c.stroke(); } }
    c.save(); c.translate(E[0], E[1]); c.rotate(ang);
    ell(c, 0, 0, CKK * .088 * (1 + .45 * w), CKK * .05 * (1 + .45 * w), 0, C.mint);                      // mặt tai lõm vào, nảy ra
    ell(c, -CKK * .025 * w, 0, CKK * .036 * on, CKK * .018 * on, 0, C.cream);
    c.restore();
    if (Math.abs(w) > .15) for (const a of [-.9, 0, .9]) { const r0 = CKK * .1, r1 = CKK * (.13 + .05 * Math.abs(w)); capsule(c, E[0] + Math.cos(ang + Math.PI / 2 + a) * r0, E[1] + Math.sin(ang + Math.PI / 2 + a) * r0, E[0] + Math.cos(ang + Math.PI / 2 + a) * r1, E[1] + Math.sin(ang + Math.PI / 2 + a) * r1, 2.5, C.cream); }
  }
}
function rings(c, x, y, r0, r1, n, phase, f, w, a0, a1) {   // các cung phẳng lan ra (giống kit.rings, có thêm góc)
  c.strokeStyle = f; c.lineCap = 'round';
  for (let i = 0; i < n; i++) { const p = (phase + i / n) % 1, r = lerp(r0, r1, p), k = 1 - p; if (k <= .02) continue; c.lineWidth = w * k; c.beginPath(); c.arc(x, y, r, a0 ?? 0, a1 ?? TAU); c.stroke(); }
}
// Miss Loupe trong cảnh đêm (toạ độ cảnh); trả về tâm/bán kính kính để iris dùng
function lensState(t) {
  let [x, y, r] = K([[HIT.lensIn, [1320, 1250, 200]], [3.4, [EAR_UP[0] + 18, EAR_UP[1] + 30, 235]]])(t);
  const m0 = ss(seg(t, HIT.zoom, HIT.zoom + .5)), wave = ss(seg(t, HIT.drumIn, HIT.drumIn + .6)), out = ss(seg(t, HIT.lensOut, HIT.lensOut + .6));
  const bend = ss(seg(t, HIT.bend, HIT.bend + .38));
  const up = ss(seg(t, HIT.bend, HIT.bend + .38)), hop = Math.sin(Math.PI * seg(t, HIT.bend, HIT.bend + .38)) * 110;   // nhảy lên mép mũ nấm
  x = lerp(x, lerp(STAND.x, CLOSE.x, up), out); y = lerp(y, lerp(STAND.y, CLOSE.y, up) - hop, out); r = lerp(r, lerp(STAND.r, CLOSE.r, up), out);
  const m = m0 * (1 - out), mag = lerp(1.4, lerp(3.6, 3.0, wave), m0);   // "kính lùi theo sóng": bớt phóng một chút để thấy sóng bay tới
  return { x, y, r, m, mag, fx: EAR_UP[0], fy: EAR_UP[1], out, bend };
}
function loupeNight(c, t) {
  if (t < HIT.lensIn) return;
  const L = lensState(t);
  let name = t < HIT.zoom ? 'happy' : t < HIT.lensOut ? 'surprised' : 'happy', lk = [-.3, -.5], pose = L.out < .5 ? ARM.peer : {};
  if (L.out >= .5) { name = t < HIT.laugh ? (t < HIT.bend ? 'happy' : 'curious') : 'laugh'; lk = [-.75, -.1]; }
  shadow(c, STAND.x, STAND.y + STAND.r * 2.73, 150 * L.out * (1 - L.bend), .14 * L.out * (1 - L.bend));
  loupe(c, L.x, L.y, L.r, {
    E: ex(BY.loupe, name, { talk: talkAt(t), look: lk, blink: name === 'happy' ? blinkAt(t) : 0 }), rot: lerp(-.3, lerp(-.06, -.1, L.bend), L.out), pose,
    inside: L.m > .01 ? zoomIn(L.x, L.y, L.mag, lerp(L.x, L.fx, L.m), lerp(L.y, L.fy, L.m), () => nightWorld(c, t, L.m > .3 ? 1 : 0)) : null,
  });
}
function sNight(c, t, o = {}) {
  const cm = cam(t);
  const behind = !o.noLup && t >= HIT.bend + .36;                // đã đứng trên mép mũ nấm: ở sau Chirp, chân có tai vươn ra trước mặt cô
  skyLayer(c, t, cm);                                            // v2: nền (trời, sao, quầng trăng, đồi xa) trôi chậm hơn máy
  look(c, cm, () => { nightWorld(c, t, 0, behind ? () => loupeNight(c, t) : null, true); if (!o.noLup && !behind) loupeNight(c, t); });
  fgLayer(c, t, cm); motes(c, t, cm);                            // tiền cảnh cỏ tối trôi nhanh hơn máy; bụi trăng lơ lửng
  if (t > HIT.bang[0] && t < HIT.bang[1]) bang(c, t, cm);
  if (t > HIT.aim[0] && t < HIT.zoomIn[0]) viewfinder(c, t);      // v4: kính "ngắm" Chirp: trong kính hiện dần đúng hình sẽ thành sticker         // v4: dấu "!" bật ra ở cái đầu gối (bất ngờ đọc được ở cỡ điện thoại)
  if (t < HIT.crash[1] + .1) speedLines(c, 1 - seg(t, HIT.crash[0], HIT.crash[1] + .1));
  // chữ móc: hiện sẵn từ khung đầu và bật ra (85% → 100%), lắc khi tiếng gáy chạm tai, thu nhỏ biến mất khi máy kéo xa
  // v3: chữ to hơn, hiện đủ ngay khung 0, từng dòng nảy lên có tiếng (hookTitle dùng chung), lắc khi tiếng gáy chạm tai, thu nhỏ biến mất khi máy kéo xa
  const wob = t > HIT.hear ? Math.sin((t - HIT.hear) * 14) * Math.exp(-(t - HIT.hear) * 5) * .05 : 0;
  hookTitle(c, TITLE, t, { gone: ss(seg(t, 2.55, 2.9)), wob, cy: 350 });
  if (t > HIT.drumText - .05 && t < HIT.drumText + 2.2) {                      // TINY DRUM! hiện cùng chữ "tiny" trong lời, nảy lên ở cú "bum" thứ ba
    const pu = 1 + .14 * Math.sin(Math.PI * seg(t, HIT.drumHit[2], HIT.drumHit[2] + .25));
    c.save(); c.translate(540, 360); c.scale(pu, pu); c.translate(-540, -360); popText(c, 'TINY DRUM!', 540, 380, 150, C.lemon, C.grape, t, HIT.drumText, { step: .03, sh: 10 }); c.restore();
  }
}

/* ================= SỔ: sticker, Albie, gag "NOPE!" ================= */
const AL = { x: 262, y: 1440, k: 240 }, CH2 = { x: 770, y: 1470, k: 185, yaw: 1.15 };
const earAlbum = lift => { const p = rigPt(CH2.x, CH2.y, CH2.k, CH2.yaw, 0, earRigOf(frontAt(lift))); return [2 * CH2.x - p[0], p[1]]; };   // Chirp quay trái (lật)
function albumChirp(t) {
  const s = { x: CH2.x, y: CH2.y, hop: 0, lift: 0, cover: 0, chirp: 0, E: chirpE('happy', { look: [.35, .05] }) };
  if (t < HIT.hopLand) { const p = ss(seg(t, HIT.hop, HIT.hopLand)); s.x = lerp(1250, CH2.x, p); s.y = lerp(1320, CH2.y, p) - Math.sin(Math.PI * p) * 220; s.E = chirpE('excited', { look: [.4, .2] }); }
  s.cover = ss(seg(t, HIT.cover, HIT.cover + .14)) * (1 - ss(seg(t, HIT.peek + .25, HIT.peek + .55)));
  if (t >= HIT.cover && t < HIT.peek) { s.E = chirpE('worried', { closed: 1 }); s.x += Math.sin(t * 70) * 3 * s.cover; }   // mắt nhắm tịt, run run
  else if (t >= HIT.peek && t < HIT.show) s.E = chirpE('curious', { look: t < HIT.peek + .6 ? [.6, -.3] : [.05, -.05], blink: t < HIT.peek + .6 ? .45 : 0 });   // hé mắt, rồi nhìn thẳng vào trẻ: "Where are YOUR ears?"
  else if (t >= HIT.show && t < HIT.listen3) { s.lift = 1.15 * back(seg(t, HIT.show, HIT.show + .3), 2); s.hop = .12 * Math.sin(Math.PI * seg(t, HIT.show, HIT.show + .35)); s.E = chirpE('excited', { look: [.05, -.1], scale: 1.15 }); }   // v3: khoe cái tai ở đầu gối
  else if (t >= HIT.listen3) { s.lift = 1; s.E = chirpE('curious', { look: [.6, -.15], scale: 1.1 }); }   // quay về phía tiếng gáy xa: đúng tư thế khung đầu
  return s;
}
function sAlbum(c, t) {
  const sh = (t > HIT.nope && t < HIT.nope + .45 ? (1 - seg(t, HIT.nope, HIT.nope + .45)) : 0) + (t > HIT.recall && t < HIT.recall + .3 ? .35 * (1 - seg(t, HIT.recall, HIT.recall + .3)) : 0);   // rung ở "NOPE!" và nhẹ hơn khi chữ móc trở lại
  const drift = 1 + .025 * ss(seg(t, HIT.irisB, HIT.nope)) * (1 - ss(seg(t, HIT.nope, HIT.nope + .4))) + .02 * ss(seg(t, HIT.listen3, HIT.ring));   // v2: máy trôi chậm, khựng ở "NOPE!", đẩy nhẹ khi lắng nghe
  c.save(); if (sh > 0) c.translate(Math.sin(t * 95) * 16 * sh, Math.cos(t * 80) * 9 * sh);
  c.translate(540, 1100); c.scale(drift, drift); c.translate(-540, -1100);
  ground(c, C.night); stars(c, t, 16, 1080, 1100, 9);
  for (const [r, a] of [[120, .05], [92, .08]]) circle(c, 945, 905, r, `rgba(255,248,231,${a})`);
  moon(c, 945, 905, 62);
  farCricket(c, 960, 930, 30, Math.abs(Math.sin(t * TAU * 4)) * (HIT.far3.some(f => t > f && t < f + .2) ? 1 : 0));   // con dế xa trên vầng trăng: gáy ở câu "can you hear it?"
  for (const f of HIT.far3) { const q = seg(t, f, f + 1.1); if (q > 0 && q < 1) { c.strokeStyle = C.lime; c.lineCap = 'round'; c.lineWidth = 8 * (1 - q); c.beginPath(); c.arc(960, 930, 30 + 520 * q, Math.PI * .75, Math.PI * 1.1); c.stroke(); } }
  ell(c, 200, 1760, 900, 420, 0, C.nightL); ell(c, 540, 1730, 980, 330, 0, C.grape); ell(c, 540, 1770, 900, 280, 0, X.nightD);
  const pageOff = ss(seg(t, HIT.ask[0] - .3, HIT.ask[0] + .05));   // v4: trang sổ trượt lên khỏi khung để chữ câu hỏi, rồi chữ móc, hiện trên nền đêm
  c.save(); c.translate(0, -980 * pageOff);
  rrect(c, 96, 218, 890, 560, 54, C.grape); rrect(c, 84, 200, 890, 560, 54, C.cream);
  // một sticker lớn (v3: máy lùi ra từ chính sticker; nảy lên ở cú dán)
  const t0 = HIT.stamp;
  circle(c, 280, 480, 142, '#EBDDBC');
  if (t >= HIT.irisB) {                                          // v3: sticker đã nằm sẵn ở chỗ (máy lùi ra từ chính nó), nảy lên ở cú dán
    const p = t >= t0 ? back(seg(t, t0, t0 + .22), 2.6) : 1;
    badge(c, 280, 480, 140, C.mint, stickerDraw, -.05, t >= t0 ? lerp(1.2, 1, p) : 1);
    popText(c, 'Hear', 470, 468, 122, C.berry, null, t, t0 + .1, { align: 'left', step: .02 });
    popText(c, 'with legs', 470, 560, 76, C.ink, null, t, t0 + .2, { align: 'left', step: .012, font: subFont });
  }
  c.restore();
  // Albie
  const talk = talkAt(t, 'albie'), shout = seg(t, HIT.nope, HIT.nope + 1.4);
  const hop = .1 * Math.sin(Math.PI * seg(t, t0, t0 + .22)) + .16 * Math.sin(Math.PI * seg(t, HIT.nope, HIT.nope + .3));
  let E;
  if (t < HIT.hop) E = ex(BY.albie, 'happy', { talk, look: t < HIT.stamp + .9 ? [.45, -.65] : [.15, -.05], blink: talk ? 0 : blinkAt(t, .4) });
  else if (t < HIT.nope) E = ex(BY.albie, talk ? 'curious' : 'surprised', { talk, look: [.75, .3] });
  else if (t < HIT.nope + 1.6) E = ex(BY.albie, 'surprised', { look: [.8, -.2], fx: true });
  else E = ex(BY.albie, 'happy', { look: [.75, .3], blink: blinkAt(t, .4) });
  shadow(c, AL.x + 18, AL.y + 4, 220, .18);
  albieAt(c, AL.x, AL.y, AL.k, { E, hop, tabsUp: shout > 0 && shout < 1 ? 1 - shout : 0, fx: t >= HIT.nope && t < HIT.nope + 1.6 });
  // Chirp nhảy tới cạnh sổ
  if (t >= HIT.hop) {
    const s = albumChirp(t);
    shadow(c, s.x - 20, CH2.y + 4, 200 * (1 - .4 * Math.min(1, (CH2.y - s.y) / 220)), .2);
    chirpAt(c, s.x, s.y, CH2.k, { flip: true, yaw: CH2.yaw, lift: s.lift, cover: s.cover, chirp: s.chirp, E: s.E, ant: t * 2.2, earGlow: (t >= HIT.nope - .05 && t < HIT.cover + .1) || (t > HIT.show && t < HIT.listen3) || HIT.far3.some(f => t > f + .45 && t < f + .8) ? 1 : 0, lean: .07 * ss(seg(t, HIT.listen3 + .6, HIT.listen3 + 1.2)) });   // tai lóe khi tiếng hét tới, rồi bị bịt lại; v2: lóe ở mỗi tiếng gáy xa, nghiêng về phía trăng khi lắng nghe
    if (s.cover > .5 && t < HIT.peek) for (const sd of [-1, 1]) for (let i = 0; i < 2; i++) { const x0 = s.x + sd * (CH2.k * 1.45 + i * 26), y0 = s.y - CH2.k * (.9 + .25 * i), j = Math.sin(t * 50 + i) * 4; capsule(c, x0 + j, y0 - 22, x0 + j + sd * 8, y0 + 22, 7, C.cream); }   // vạch run run
    if (t > HIT.show && t < HIT.show + .7) { const [ex2, ey2] = earAlbum(s.lift), b = seg(t, HIT.show, HIT.show + .7); for (let i = 0; i < 6; i++) { const a = i * TAU / 6; star(c, ex2 + Math.cos(a) * 70 * eo(b), ey2 + Math.sin(a) * 70 * eo(b), 13 * (1 - b), C.lemon); } }   // v3: ta-da quanh cái tai
    if (t >= HIT.hopLand && t < HIT.hopLand + .5) { const b = seg(t, HIT.hopLand, HIT.hopLand + .5); for (let i = 0; i < 4; i++) star(c, CH2.x - 60 + i * 40, CH2.y - 10 - 26 * eo(b), 9 * (1 - b), C.lemon); }
  }
  motes(c, t, { cx: 540, cy: 960 }, 10);
  // "NOPE!": Miss Loupe hét ngoài khung, chữ to bay vào từ bên phải, vạch hét toả ra
  if (t >= HIT.nope && t < HIT.nope + 2.1) {
    const p = back(seg(t, HIT.nope, HIT.nope + .2), 2.4), q = ss(seg(t, HIT.nope + 1.75, HIT.nope + 2.1));
    for (let i = 0; i < 6; i++) { const a = Math.PI + (i - 2.5) * .22, r0 = 120 + 260 * eo(seg(t, HIT.nope, HIT.nope + .35)), r1 = r0 + 90; capsule(c, 1120 + Math.cos(a) * r0, 980 + Math.sin(a) * r0, 1120 + Math.cos(a) * r1, 980 + Math.sin(a) * r1, 14 * (1 - q), C.cream); }
    c.save(); c.translate(lerp(1300, 620, Math.min(1, p)), 1000); c.rotate(-.08 + Math.sin(t * 30) * .015); const s = Math.max(.01, (1 - q) * (.6 + .4 * p)); c.scale(s, s);
    popText(c, 'NOPE!', 0, 0, 225, C.berry, C.cream, -1, -1, { sh: 13 }); c.restore();
  }
  c.restore();
}

/* ---------- vòng lặp: Chirp lại vểnh chân nghe; vòng sóng âm từ cái tai mở ra đúng khung đầu ---------- */
function loopOut(c, t) {
  if (t < HIT.ring) return;
  const [ex_, ey] = earAlbum(1), u = ss(seg(t, HIT.ring, DUR - .06)), H = lerp(0, 2300, u * u);
  const cx = lerp(ex_, 540, u), cy = lerp(ey, 960, u);
  for (let i = 0; i < 3; i++) { const p = ((t - HIT.ring) * 1.6 + i / 3) % 1; c.strokeStyle = C.mint; c.lineWidth = 12 * (1 - p); c.beginPath(); c.arc(cx, cy, H + 30 + p * 240, 0, TAU); c.stroke(); }
  circle(c, cx, cy, H + 24, C.lime); circle(c, cx, cy, H + 10, C.cream);
  c.save(); c.beginPath(); c.arc(cx, cy, H, 0, TAU); c.clip(); REC.mute++; sNight(c, t - DUR); REC.mute--; c.restore();
}

/* ---------- v2: lớp chiều sâu (nền parallax, tiền cảnh, bụi trăng), vệt tốc độ của hook ---------- */
function skyLayer(c, t, cm, k = .35) {
  const pc = { cx: 540 + (cm.cx - 540) * k, cy: 960 + (cm.cy - 960) * k, z: 1 + (cm.z - 1) * k };
  look(c, pc, () => {
    ground(c, C.night); stars(c, t, 30, 1080, 1250, 3);
    for (const [r, a] of [[260, .05], [200, .07], [150, .09]]) circle(c, 930, 660, r, `rgba(255,248,231,${a})`);   // quầng trăng (khối phẳng trong mờ)
    moon(c, 930, 660, 118);
    for (let x = -300, i = 0; x < 1500; x += 260, i++) ell(c, x, 1300 + (i % 2) * 30, 230, 130, 0, i % 2 ? '#2F1880' : '#34198C');   // đồi xa
  });
}
function fgLayer(c, t, cm, k = 1.5) {                          // cỏ tối ở hai góc dưới, trôi nhanh hơn máy, lắc nhẹ; không che nhân vật
  const dx = -(cm.cx - 540) * (k - 1) * cm.z, dy = -(cm.cy - 960) * (k - 1) * cm.z, sc = 1 + (cm.z - 1) * .5;
  c.save(); c.translate(dx, dy);
  for (const [x, y, h, a] of [[-30, 1960, 360, .25], [40, 1990, 300, .05], [110, 1975, 240, -.15], [1000, 1980, 340, -.2], [1080, 1960, 300, .1], [930, 2000, 220, .3]]) {
    const sw = Math.sin(t * 1.3 + x * .02) * .06; c.fillStyle = '#22105E'; c.beginPath(); c.moveTo(x - 26 * sc, y); c.quadraticCurveTo(x + Math.sin(a + sw) * h * .5, y - h * .6 * sc, x + Math.sin(a + sw) * h * .45, y - h * sc); c.quadraticCurveTo(x + Math.sin(a + sw) * h * .2 + 10, y - h * .5 * sc, x + 26 * sc, y); c.fill();
  }
  c.restore();
}
function motes(c, t, cm, n = 16) {                              // bụi trăng: chấm kem nhỏ bay lên chậm, lấp lánh
  for (let i = 0; i < n; i++) {
    const ph = (t * .05 + i * .137) % 1, x = ((i * 233) % 1080) + Math.sin(t * .7 + i) * 24 - (cm.cx - 540) * .6, y = 1700 - ph * 1500 - (cm.cy - 960) * .6;
    circle(c, x, y, (2.5 + (i % 3)) * (.6 + .4 * Math.sin(t * 3 + i * 2)), `rgba(255,248,231,${.55 * Math.sin(Math.PI * ph)})`);
  }
}
function speedLines(c, a) {                                    // vệt tốc độ toả từ giữa khung lúc máy lao vào (khối phẳng)
  if (a <= 0) return; c.strokeStyle = `rgba(255,248,231,${.35 * a})`; c.lineCap = 'round';
  for (let i = 0; i < 18; i++) { const ang = i / 18 * TAU + .1, r0 = 520 + (i % 3) * 60, r1 = r0 + 260 * a; c.lineWidth = 10 * a; c.beginPath(); c.moveTo(540 + Math.cos(ang) * r0, 960 + Math.sin(ang) * r0 * 1.4); c.lineTo(540 + Math.cos(ang) * r1, 960 + Math.sin(ang) * r1 * 1.4); c.stroke(); }
}

/* ---------- v2: kính "chụp" cái tai thành sticker; sticker bay ra; máy lia theo sang sổ ---------- */
const SLOT = { x: 280, y: 480, r: 140 };
const stickerDraw = cc => chirpAt(cc, -34, 52, 62, { detail: 1, earGlow: 1, lift: 1, yaw: 1.2 });
function lensScreen(t) { const cm = cam(t), L = lensState(t), [x, y] = toScreen(cm, L.x, L.y); return { x, y, r: L.r * cm.z }; }
function snapFlash(c, t) {                                     // chớp sáng trong mặt kính lúc "chụp"
  const a = 1 - seg(t, HIT.snap, HIT.snap + .3); if (a <= 0 || t < HIT.snap) return;
  const L = lensScreen(t); circle(c, L.x, L.y, L.r * .96, `rgba(255,255,255,${.85 * a})`);
  for (let i = 0; i < 8; i++) { const ang = i / 8 * TAU; capsule(c, L.x + Math.cos(ang) * L.r * 1.1, L.y + Math.sin(ang) * L.r * 1.1, L.x + Math.cos(ang) * L.r * (1.1 + .35 * (1 - a)), L.y + Math.sin(ang) * L.r * (1.1 + .35 * (1 - a)), 10 * a, C.lemon); }
}
const ZOOM_R = 1150;
function zoomMatch(c, t) {                                     // v3: máy lao xuyên qua mặt kính; hình trong kính chính là sticker; máy lùi ra từ sticker, lộ trang sổ
  if (t < HIT.zoomOut[0]) {
    const u = ei(seg(t, HIT.zoomIn[0], HIT.zoomIn[1])), L = lensScreen(HIT.zoomIn[0]);
    sNight(c, HIT.zoomIn[0]);                                   // khung đêm đứng lại (tấm "ảnh" vừa chụp)
    const cx = lerp(L.x, 540, u), cy = lerp(L.y, 960, u), R = lerp(L.r * .94, ZOOM_R, u);
    circle(c, cx, cy, R + 22 * (1 - u), C.berry);                // vành kính mỏng dần thành mép sticker
    badge(c, cx, cy, R, C.mint, cc => { const k = R / SLOT.r; cc.scale(k, k); stickerDraw(cc); }, -.05 * u, 1);
    const f = 1 - seg(t, HIT.zoomIn[0], HIT.zoomIn[0] + .2); if (f > 0) circle(c, cx, cy, R, `rgba(255,255,255,${.6 * f})`);   // đuôi chớp sáng của cú chụp
  } else {
    const v = eo(seg(t, HIT.zoomOut[0], HIT.zoomOut[1])), k = lerp(ZOOM_R / SLOT.r, 1, v), cx = lerp(540, SLOT.x, v), cy = lerp(960, SLOT.y, v);
    c.save(); c.translate(cx, cy); c.scale(k, k); c.translate(-SLOT.x, -SLOT.y); sAlbum(c, t); c.restore();
  }
}
function bang(c, t, cm) {                                      // v4: dấu "!" và vạch giật mình ở cái đầu gối khi vòng sóng chạm tới
  const [x, y] = toScreen(cm, EAR_UP[0], EAR_UP[1]), a = back(seg(t, HIT.bang[0], HIT.bang[0] + .2), 2.6), q = ss(seg(t, HIT.bang[1] - .2, HIT.bang[1])), s = Math.max(.01, a * (1 - q));
  c.save(); c.translate(x - 5, y - 180); c.rotate(.12 + Math.sin(t * 30) * .03); c.scale(s, s);
  for (let i = 0; i < 5; i++) { const g = -2.6 + i * .5; capsule(c, Math.cos(g) * 105, Math.sin(g) * 105 - 20, Math.cos(g) * 150, Math.sin(g) * 150 - 20, 13, C.cream); }
  popText(c, '!', 0, 60, 230, C.lemon, X.nightD, -1, -1, { sh: 12, read: false }); c.restore();
}
function viewfinder(c, t) {                                    // v4: trước cú chụp, mặt kính hiện đúng hình sticker (cùng con Chirp, chân vểnh, tai sáng); bốn góc ngắm khép vào
  const a = ss(seg(t, HIT.aim[0], HIT.aim[1])), L = lensScreen(t), R = L.r * .94;
  c.save(); c.globalAlpha = a; badge(c, L.x, L.y, R, C.mint, cc => { const k = R / SLOT.r; cc.scale(k, k); stickerDraw(cc); }, 0, 1); c.restore();
  const g = lerp(1.35, 1.12, a); c.strokeStyle = `rgba(255,248,231,${a})`; c.lineWidth = 9; c.lineCap = 'round';
  for (let i = 0; i < 4; i++) { const ang = Math.PI / 4 + i * Math.PI / 2, x = L.x + Math.cos(ang) * R * g, y = L.y + Math.sin(ang) * R * g, sx = Math.sign(Math.cos(ang)), sy = Math.sign(Math.sin(ang)); c.beginPath(); c.moveTo(x - sx * 34, y); c.lineTo(x, y); c.lineTo(x, y - sy * 34); c.stroke(); }
}
function recallTitle(c, t) {                                   // v3: chữ móc trở lại ở cuối, đúng chỗ và đúng cỡ của khung đầu (vòng lặp liền)
  const a = back(seg(t, HIT.recall, HIT.recall + .32), 2.4);
  hookTitle(c, TITLE, -1, { gone: 1 - a, cy: 350 });
}

/* ---------- iris qua kính: đêm → sổ (bản v1, không dùng nữa) ---------- */
function irisLens(c, t) {
  const cm = cam(HIT.irisA), L = lensState(HIT.irisA), [sx, sy] = toScreen(cm, L.x, L.y), r0 = L.r * cm.z;
  const u = ei(seg(t, HIT.irisA, HIT.irisB)), R = lerp(r0, 2200, u);
  sNight(c, t, { noLup: true });
  loupe(c, sx, sy, R, { E: ex(BY.loupe, 'laugh'), rot: -.06, pose: ARM.shrug, inside: () => sAlbum(c, Math.max(t, HIT.irisB)) });
}

export function drawFilm(c, t) {
  t = clamp(t, 0, DUR - .001);
  c.save();
  const shk = t > HIT.hear && t < HIT.hear + .25 ? 1 - seg(t, HIT.hear, HIT.hear + .25) : 0;   // v3: rung nhẹ khi vòng sóng chạm tai
  if (t >= HIT.zoomIn[0] && t < HIT.zoomOut[1]) zoomMatch(c, t);
  else if (t < HIT.zoomIn[0]) { c.save(); c.translate(Math.sin(t * 90) * 7 * shk, Math.cos(t * 70) * 5 * shk); sNight(c, t); c.restore(); snapFlash(c, t); }
  else { sAlbum(c, t); loopOut(c, t); }
  askTitle(c, t, HIT.ask[0], HIT.ask[1], { small: 'Where are', big: 'YOUR EARS?', cy: 350, px: 132, shadow: X.nightD, fill: C.lemon, q: C.mint });   // v4: câu hỏi kết hiện to, rồi nhường chỗ cho chữ móc
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t);
  c.restore();
}
