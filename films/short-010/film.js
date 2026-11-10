// SHORT-010 · Dragonflies See Behind Their Heads! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp:
// móc và gag là cùng một sân khấu bờ ao; cuối phim mọi nhân vật và máy quay trở về đúng khung đầu (Crumb lại rón rén, Zip đậu trên vành kính).
// Công thức tập A 45 s (PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §3): logo 0,8 s lồng vào cú lao vào kính (titleSting), ô sticker "1 2 3"
// (stickerSlots), kính lớn có máy trôi, cảnh đặc trưng phủ cả khung, câu cửa miệng có hành động (albumGulp), phụ đề ở vùng an toàn (SAFE.subY).
import { C, REC, circle, ell, rrect, ground, popText, subFont, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { makeTalk, blinkAt, ex, rigPt, look, toScreen, loupe, ARM, badge, shadow, subtitle, LENS_UP, hookTitle, stickerMatchCut, snapFlash, SAFE,
  titleSting, stickerSlots, flyBadge, albumGulp } from '/_shared/episode.js';
import { N, groundY, pondSky, pondBank, STONE, stoneTop, REED, reedTip, viewRing, rewind, facets, bigWord } from './props.js';
import { LINES, CARDS, DUR, HIT } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const decay = (t, list, k = 6) => list.reduce((s, h) => s + (t >= h ? Math.exp(-(t - h) * k) : 0), 0);
const pulse = (t, list, a = .12, b = .1) => list.reduce((s, h) => s + Math.sin(Math.PI * seg(t, h - a, h + b)), 0);
const arc = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];
const line = id => LINES.find(l => l.id === id);
const W = (t, a, b) => ss(seg(t, a, b));                                         // 0→1 êm trong [a, b]
const BAND = (t, a, b, f = .2) => ss(seg(t, a, a + f)) * (1 - ss(seg(t, b - f, b)));   // 0→1→0

/* ================= nhân vật ================= */
// Crumb: kiến con hổ phách. tip: rón rén (nhón chân, bước cao, chậm) · sit: ngồi bệt · arms: dáng hai tay
const FEET = [[-.4, 0, .3], [-.48, 0, -.1], [.4, 0, .3], [.48, 0, -.1]];
const ARMS = {
  rest: { armL: [-.4, -1.0, .45], armR: [.42, -1.05, .45] }, up: { armL: [-.62, -2.45, .2], armR: [.62, -2.45, .2] },
  sneak: { armL: [-.5, -2.0, .62], armR: [.5, -2.05, .62] }, point: { armL: [-.4, -1.0, .45], armR: [.55, -2.35, .75] },
  wave: { armL: [-.4, -1.0, .45], armR: [.85, -2.45, .3] }, reach: { armL: [-.3, -2.6, .5], armR: [.35, -2.65, .5] },
  shrug: { armL: [-.85, -1.45, .2], armR: [.85, -1.45, .2] }, down: { armL: [-.32, -.7, .35], armR: [.32, -.7, .35] },
};
const mixArms = (a, b, k) => ({ armL: a.armL.map((v, i) => lerp(v, b.armL[i], k)), armR: a.armR.map((v, i) => lerp(v, b.armR[i], k)) });
function crumbAt(c, x, y, k, o = {}) {
  const w = o.walk || 0, tip = o.tip || 0, ph = o.ph || 0, sit = o.sit || 0;
  const feet = FEET.map((f, i) => {
    const s = Math.sin(ph * TAU + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0));
    const ft = [f[0], -Math.max(0, s) * (.14 * w + .34 * tip), f[2] + s * (.16 * w + .22 * tip)];
    return [ft[0], ft[1] * (1 - sit), lerp(ft[2], f[2] + .55, sit)];
  });
  const lift = (o.hop || 0) + Math.abs(Math.sin(ph * TAU)) * (.04 * w + .1 * tip) + .12 * tip - .42 * sit;
  const pose = { carry: null, q: o.q || 0, reach: o.reach ?? .4, lift, bodyLean: o.bodyLean || 0, feet, ...(o.arms || ARMS.rest) };
  return drawChar(c, BY.crumb, { x, y, k, yaw: o.yaw ?? .9, lean: o.lean || 0, showFx: !!o.fx, expr: o.E || ex(BY.crumb, 'happy'), pose });
}
const crumbE = (name, t, o = {}) => ex(BY.crumb, name, { talk: talkAt(t, 'crumb'), blink: talkAt(t, 'crumb') ? 0 : blinkAt(t, .6), ...o });
// Zip: chuồn chuồn. s: { x, y (điểm chân), k, yaw, lift, beat, blur, peek, curl, E, rew: [độ hiện, hướng] }
function drawZip(c, s) {
  const fl = s.fly ? s.t * 40 : 0;
  drawChar(c, BY.zip, { x: s.x, y: s.y, k: s.k, yaw: s.yaw, lean: s.lean || 0, showFx: false, expr: s.E,
    pose: { lift: s.lift || 0, flap: fl, beat: s.fly ? 1 : 0, blur: s.blur || 0, peek: s.peek || 0, curl: s.curl || 0 } });
  if (s.rew && s.rew[0] > .02) { const p = rigPt(s.x, s.y, s.k, s.yaw, 0, [0, -.6 - (s.lift || 0), -2.4]); rewind(c, p[0] + s.rew[1] * 20, p[1], s.k / 110, s.rew[0], s.rew[1]); }
}
const zipE = (name, t, o = {}) => ex(BY.zip, name, { blink: blinkAt(t, .2), ...o });
const domeOf = (s, sd = 1) => rigPt(s.x, s.y, s.k, s.yaw, s.lean || 0, [sd * .2, -.86 - (s.lift || 0), .6]);

/* ================= BỜ AO: móc (0–3 s) và gag (32,85–44 s), cùng một sân khấu ================= */
const LS = { x: 560, r: 100 }, ZK = 80, CK = 80;
const TT = t => (t > 30 ? t - DUR : t);                                           // giờ của móc, kéo dài về trước điểm lặp (t âm = cuối phim)
const CAM = K([[-2.8, [700, 990, 1.55]], [-1.4, [560, 985, 1.58]], [0, [500, 975, 1.62]], [.6, [505, 978, 1.66]], [1.4, [510, 976, 1.68]], [1.95, [495, 966, 1.64]],
  [2.7, [520, 960, 1.6]], [3.0, [540, 955, 1.62]]]);
const GCAM = K([[HIT.flip[1], [700, 985, 1.6]], [35.2, [690, 985, 1.62]], [36.5, [720, 985, 1.6]], [38.0, [760, 985, 1.58]], [39.4, [745, 985, 1.58]], [40.6, [730, 985, 1.6]],
  [HIT.home[0], [700, 990, 1.55]]]);
function pondCam(t) {
  const base = t > 30 && t < HIT.home[0] ? GCAM(t) : CAM(TT(t));
  const sh = decay(t, [HIT.startle, HIT.sit, HIT.jump, HIT.fall], 9);
  const [cx, cy, z] = base; return { cx: cx + 6 * Math.sin(t * 47) * sh, cy: cy + 5 * Math.sin(t * 39) * sh, z };
}
function lensPond(t) {                                                         // kính của Miss Loupe (toạ độ cảnh)
  const tt = TT(t), wx = LS.x, wy = groundY(LS.x) - LENS_UP * LS.r, j = decay(t, [HIT.startle], 5);
  const rs = t < 4 ? W(t, HIT.raise, HIT.sting[0]) : 0, up = t > 30 ? BAND(t, HIT.lensUp[0], HIT.pout[1], .3) : 0;
  return { x: wx + 16 * Math.sin(t * 34) * j + 30 * rs, y: wy - 4 * Math.sin(tt * 2.2) - 60 * rs - 70 * up, r: LS.r, rot: -.06 + .03 * Math.sin(tt * 1.7) + .2 * Math.sin(t * 28) * j - .08 * rs + .15 * up * Math.sin(t * 9) };
}
function loupePondE(t) {
  const talk = talkAt(t), tt = TT(t);
  if (t < 4) {
    const turned = W(t, HIT.turn[0], HIT.turn[1]);
    const name = t > HIT.startle && t < HIT.startle + .5 ? 'surprised' : talk ? 'explaining' : turned > .5 ? 'curious' : 'happy';
    return { E: ex(BY.loupe, name, { talk, look: turned > .5 ? [-.8, .15] : [0, 0], blink: talk ? 0 : blinkAt(t) }), pose: t > HIT.startle && t < HIT.startle + .45 ? ARM.up : talk ? ARM.wave : ARM.peer };
  }
  if (t < HIT.home[0]) {
    const lk = t < HIT.notice ? [-.8, .3] : t < HIT.zipOut[1] ? [.6, .2] : t < HIT.zipBack[1] ? [.8, 0] : [.5, .2];
    const name = talk ? (t > HIT.lensUp[0] ? 'wink' : 'explaining') : t > HIT.jump && t < HIT.giggle[1] ? 'laugh' : t > HIT.zipOut[0] && t < HIT.zipOut[1] + .4 ? 'surprised' : 'happy';
    return { E: ex(BY.loupe, name, { talk, look: lk, blink: talk || name === 'wink' ? 0 : blinkAt(t) }), pose: t > HIT.lensUp[0] && t < HIT.pout[1] ? ARM.up : ARM.peer };
  }
  const name = talk ? 'explaining' : 'happy';
  return { E: ex(BY.loupe, name, { talk, look: [0, 0], blink: talk ? 0 : blinkAt(tt) }), pose: talk ? ARM.wave : ARM.peer };
}
// Crumb ở bờ ao. Móc: rón rén phải (x = 330 + 45·t), giật mình, ngồi bệt chỉ Zip. Gag: xin cầm kính, xìu, rón rén tới cỏ nến, "boo!", giật bắn, chạy về sau lưng Miss Loupe.
function crumbPond(t) {
  const s = { x: 330, k: CK, yaw: .9, tip: 0, walk: 0, ph: 0, sit: 0, hop: 0, arms: ARMS.rest, E: null, q: 0, lean: 0, behind: true };
  const tt = TT(t);
  if (t < 4 && t >= 0 || t >= HIT.home[1] - .05) {
    if (tt < HIT.startle) { s.x = 330 + 45 * tt; s.tip = 1; s.ph = tt / .8; s.arms = ARMS.sneak; s.E = crumbE('excited', t, { look: [.8, -.1] }); return s; }
    const u = seg(t, HIT.startle, HIT.sit), sit = W(t, HIT.sit - .12, HIT.sit + .1);
    s.x = 330 + 45 * HIT.startle - 30 * u; s.hop = .6 * Math.sin(Math.PI * u) * (1 - sit); s.sit = sit; s.yaw = lerp(.9, .25, W(t, HIT.startle, HIT.startle + .2));
    s.arms = sit > .5 ? mixArms(ARMS.rest, ARMS.point, W(t, HIT.sit, HIT.sit + .25)) : ARMS.up;
    s.E = t < HIT.sit + .1 ? crumbE('surprised', t, { look: [.4, -.8] }) : crumbE(talkAt(t, 'crumb') ? 'confused' : 'surprised', t, { look: [.35, -.8] });
    s.q = t > HIT.sit + .3 ? 1 : 0;
    return s;
  }
  // gag
  s.behind = false;
  if (t < HIT.lensUp[0]) { const hop = Math.abs(Math.sin((t - HIT.flip[1]) * 7)) * .14; s.x = 690; s.yaw = -.7; s.hop = hop; s.arms = ARMS.reach; s.E = crumbE('hopeful', t, { look: [-.6, -.7] }); return s; }
  if (t < HIT.notice) {
    const pout = W(t, HIT.pout[0], HIT.pout[0] + .3); s.x = 690; s.yaw = lerp(-.7, -.2, pout); s.arms = mixArms(ARMS.reach, ARMS.down, W(t, HIT.lensUp[1], HIT.pout[0] + .2)); s.hop = -.08 * pout;
    s.E = pout > .5 ? crumbE('sad', t) : crumbE('surprised', t, { look: [-.5, -.8] }); return s;
  }
  if (t < HIT.tiptoe[0]) { const h = Math.sin(Math.PI * seg(t, HIT.notice, HIT.notice + .25)); s.x = 690; s.yaw = lerp(-.2, .9, W(t, HIT.notice, HIT.notice + .2)); s.hop = .16 * h; s.E = crumbE('excited', t, { look: [.9, -.4] }); return s; }
  if (t < HIT.puzzled[0]) { const u = seg(t, HIT.tiptoe[0], HIT.tiptoe[1]); s.x = lerp(690, 790, u); s.tip = u < 1 ? 1 : 0; s.ph = (t - HIT.tiptoe[0]) / .75; s.arms = ARMS.sneak; s.E = crumbE(t > HIT.zipOut[0] ? 'surprised' : 'confident', t, { look: [.9, -.3] }); return s; }
  if (t < line('L15').t) { const sw = Math.sin((t - HIT.puzzled[0]) * 9); s.x = 790; s.yaw = .9 * sw; s.q = 1; s.arms = ARMS.shrug; s.E = crumbE('confused', t, { look: [sw, -.2] }); return s; }
  if (t < HIT.boo) {                                                            // "One, two, three…": nhún xuống mỗi số, hai tay giơ vuốt
    const dip = Math.min(1, pulse(t, HIT.count3, .05, .25)); s.x = 790; s.yaw = .9; s.hop = -.12 * dip; s.arms = ARMS.sneak; s.E = crumbE('excited', t, { look: [.9, -.2] }); return s;
  }
  if (t < HIT.jump) { const u = seg(t, HIT.boo, HIT.boo + .2); s.x = lerp(790, 830, u); s.yaw = .9; s.hop = .35 * Math.sin(Math.PI * Math.min(1, u * .8 + .2)); s.arms = ARMS.up; s.E = crumbE('shout', t, { look: [.9, -.2] }); return s; }
  if (t < HIT.home[0]) {
    const u = seg(t, HIT.jump, HIT.fall), sit = W(t, HIT.fall - .1, HIT.fall + .1);
    s.x = 830 - 20 * u; s.hop = 1.0 * Math.sin(Math.PI * u) * (1 - sit); s.sit = sit; s.yaw = lerp(.9, -.5, W(t, HIT.jump, HIT.jump + .2)); s.arms = sit > .5 ? ARMS.rest : ARMS.up;
    s.E = t < HIT.fall ? crumbE('surprised', t, { look: [-.8, -.4] }) : crumbE('laugh', t);
    s.hop += sit > .5 ? .04 * Math.abs(Math.sin(t * 14)) * (t < HIT.giggle[1]) : 0;
    return s;
  }
  // chạy về sau lưng Miss Loupe (đi sau cô), quay mặt lại, rồi nối vào dáng rón rén của khung đầu
  const u = seg(t, HIT.home[0] + .15, HIT.home[1] - .2), x0 = 810, x1 = 330 + 45 * (HIT.home[1] - .05 - DUR);
  s.x = lerp(x0, x1, ei(u)); s.walk = u > 0 && u < 1 ? 1 : 0; s.ph = t * 3.4; s.yaw = t < HIT.home[1] - .2 ? -1.1 : lerp(-1.1, .9, W(t, HIT.home[1] - .2, HIT.home[1] - .05));
  s.sit = 1 - W(t, HIT.home[0], HIT.home[0] + .2); s.behind = true; s.arms = mixArms(ARMS.rest, ARMS.sneak, W(t, HIT.home[1] - .3, HIT.home[1]));
  s.E = crumbE('excited', t, { look: [-.6, 0] });
  return s;
}
// Zip ở bờ ao
function zipPond(t) {
  const L = lensPond(t), rim = [L.x + 4, L.y - L.r + 8], tt = TT(t);
  const s = { t, x: rim[0], y: rim[1], k: ZK, yaw: 0, fly: 0, blur: 0, peek: 0, curl: 0, lean: 0, E: null, rew: null };
  if (t >= HIT.land[1] || t < HIT.zipUp[0]) {                                  // đậu trên vành kính; con ngươi đã liếc ra sau (về phía Crumb)
    const pk = t > 30 ? -.45 : lerp(-.45, -1.25, W(t, HIT.peek, HIT.peek + .25));
    s.peek = pk; s.E = zipE(t > HIT.peek && t < 4 ? 'confident' : 'happy', tt, { look: [-.9, .05] }); s.yaw = .05 * Math.sin(tt * 1.3);
    return s;
  }
  if (t < 4) {                                                                 // vụt lên, quay về phía Crumb, đứng yên giữa trời
    const u = W(t, HIT.zipUp[0], HIT.zipUp[1]), p = arc(rim, [430, 860], u, 120);
    s.x = p[0] + 10 * Math.sin(t * 3); s.y = p[1] + 8 * Math.sin(t * 4.2); s.fly = 1; s.blur = u; s.yaw = lerp(0, -.9, u); s.peek = lerp(-1.25, 0, u);
    s.E = zipE(t > HIT.sit ? 'laugh' : 'excited', t, { look: [-.3, .5] });
    return s;
  }
  if (t < HIT.zipOut[0]) {                                                     // đậu trên ngọn cỏ nến, nhìn Crumb
    const tip = reedTip(t); s.x = tip[0]; s.y = tip[1] + 4; s.yaw = -.95; s.E = zipE(t > HIT.notice ? 'curious' : 'happy', t, { look: [-.5, .3] });
    return s;
  }
  if (t < HIT.zipBack[0]) {                                                    // bay lùi vụt ra khỏi khung phải (mặt vẫn nhìn Crumb)
    const tip = reedTip(HIT.zipOut[0]), u = ei(seg(t, HIT.zipOut[0], HIT.zipOut[1]));
    s.x = lerp(tip[0], 1500, u); s.y = tip[1] + 4 - 80 * u; s.yaw = -1.2; s.fly = 1; s.curl = .2; s.rew = [Math.sin(Math.PI * Math.min(1, u * 1.4)), 1]; s.E = zipE('confident', t, { look: [-.8, 0] });
    return s;
  }
  if (t < HIT.giggle[1]) {                                                     // vào lại từ khung trái, vẫn bay lùi, đuôi chạm vai Crumb; rồi quay lại nhìn
    const u = eo(seg(t, HIT.zipBack[0], HIT.zipBack[1])), turn = W(t, HIT.jump + .15, HIT.jump + .45);
    s.x = lerp(80, 680, u) + 10 * Math.sin(t * 2) * u; s.y = 995 + 8 * Math.sin(t * 3.1); s.yaw = lerp(-1.25, 1.1, turn); s.fly = 1; s.blur = turn;
    s.curl = .35 * Math.sin(Math.PI * seg(t, HIT.tap - .12, HIT.tap + .15)); s.rew = u < 1 ? [Math.min(1, (1 - u) * 3), 1] : null;
    s.E = zipE(turn > .5 ? 'laugh' : 'happy', t, { look: [turn > .5 ? .8 : -.6, .2] });
    return s;
  }
  // về đậu lên vành kính (khớp khung đầu)
  const h = [680 + 10 * Math.sin(t * 2), 995 + 8 * Math.sin(t * 3.1)], u = W(t, HIT.land[0], HIT.land[1]), p = arc(h, rim, u, 90);
  s.x = p[0]; s.y = p[1]; s.fly = u < .97 ? 1 : 0; s.blur = 1 - u; s.yaw = lerp(1.1, 0, W(t, HIT.land[0], HIT.land[1] - .1)); s.peek = lerp(0, -.45, u);
  s.E = zipE('happy', t, { look: [lerp(.6, -.9, u), .1] });
  return s;
}
function pondWorld(c, t) {
  pondSky(c, t, { waggle: t > 30 ? seg(t, HIT.waggle[0], HIT.waggle[1]) : null, rollo: t > 30 ? seg(t, HIT.rollo[0], HIT.rollo[1]) : null });
  pondBank(c, t);
}
const HOOK_TITLE = [{ text: 'BEHIND', y: 270, px: 172, fill: C.lemon, shadow: C.ink, t0: HIT.words[0] }, { text: 'YOU?!', y: 450, px: 196, fill: C.pink, shadow: C.ink, t0: HIT.words[1] }];
function sPond(c, t, o = {}) {
  const cam = pondCam(t), L = lensPond(t), cs = crumbPond(t), zs = zipPond(t), le = loupePondE(t);
  look(c, cam, () => {
    pondWorld(c, t);
    const drawCrumb = () => { shadow(c, cs.x + 16, groundY(cs.x) + 2, 90, .18); crumbAt(c, cs.x, groundY(cs.x), cs.k, cs); };
    if (cs.behind) drawCrumb();
    loupe(c, L.x, L.y, L.r, { E: le.E, rot: L.rot, pose: le.pose });
    if (!cs.behind) drawCrumb();
    if (zs.x > -200 && zs.x < 1450) { if (!zs.fly) shadow(c, zs.x, zs.y + 4, 40, .12); drawZip(c, zs); }
  });
  // chữ trên bờ ao (toạ độ khung)
  if (t > 30) {
    const bp = toScreen(cam, 820, 760);
    bigWord(c, 'BOO!', bp[0] - 40, bp[1] - 40, 150, C.tang, t, HIT.boo, HIT.boo + 2.0, { rot: -.12 });
  }
  if (!o.noTitle && t < 4) hookTitle(c, HOOK_TITLE, t, { gone: W(t, HIT.titleOut[0], HIT.titleOut[1]), cy: 400, wob: decay(t, [HIT.startle], 5) * .05 * Math.sin(t * 16) });
}

/* ================= KÍNH LỚN (3,8–28,4 s): Zip trên hòn đá ================= */
export const BASE = { cx: 600, cy: 1000, z: 1.25 };
const ZL = { x: STONE.x, k: 92, yaw: .45 }, CL = { k: 72 };
const zipRest = t => ({ t, x: ZL.x, y: stoneTop() + 4, k: ZL.k, yaw: ZL.yaw, fly: 0, blur: 0, peek: 0, curl: 0, lean: 0, E: null, rew: null });
const RING = { r: 190, ry: 60 };                                                   // vòng Crumb đi quanh Zip (toạ độ cảnh)
const walkPos = t => {                                                             // góc a quanh Zip: 2,4 (trước-trái) → trái → sau lưng → 5,3 (sau-phải, bị bắt gặp); sin a > 0 là phía máy
  const u = ss(seg(t, HIT.walk[0], HIT.walk[1])), a = lerp(2.4, 5.3, u);
  return { a, x: ZL.x + RING.r * Math.cos(a), y: groundY(ZL.x) + RING.ry * Math.sin(a), back: Math.sin(a) < 0 };
};
function zipLens(t) {
  const s = zipRest(t);
  if (t < HIT.stamp1) {                                                        // bí mật 1: đậu yên; con ngươi theo Crumb đi một vòng
    s.E = zipE('happy', t, { look: [0, 0] });
    if (t > HIT.walk[0] - .1) {
      // hướng của Crumb quanh Zip (0 = phía máy, ±π = sau lưng); mắt hoạt hình trượt theo, giữ ở mép vòm mắt còn thấy được
      const w = walkPos(t), phi = Math.atan2(Math.cos(w.a), Math.sin(w.a)), want = clamp(phi - ZL.yaw, -1.5 - ZL.yaw + .32, 1.5 - ZL.yaw - .32);
      s.peek = want; s.E = zipE(t > HIT.caught ? 'laugh' : 'confident', t, { look: [want < 0 ? -.9 : .9, .1] });
    }
    return s;
  }
  if (t < HIT.back1[0]) {                                                      // bí mật 2: Crumb rón rén từ phía sau-trái; con ngươi liếc ra sau; quay mặt lại
    const pk = W(t, HIT.sneak[0] + .4, HIT.sneak[0] + .8), turn = W(t, HIT.hush[0], HIT.hush[0] + .3);
    s.peek = -1.6 * pk * (1 - turn); s.yaw = lerp(ZL.yaw, -1.15, turn); s.E = zipE(turn > .5 ? 'confident' : 'happy', t, { look: [-.9 * pk, .1] });
    return s;
  }
  const y0 = stoneTop() + 4;
  const PATH = K([[HIT.back1[0], [ZL.x, y0]], [HIT.back1[1], [860, 1025]], [HIT.fwd[0], [860, 1025]], [HIT.fwd[1], [770, 1012]], [HIT.back2[0], [770, 1012]], [HIT.back2[1], [870, 1028]],
    [HIT.hover[0], [850, 1015]], [HIT.hover[0] + .4, [800, 1000]], [HIT.reach, [800, 1000]], [HIT.reach + .25, [803, 975]], [HIT.settle[0], [790, 995]], [HIT.settle[1], [ZL.x, y0]]]);
  const [x, y] = PATH(t), hov = BAND(t, HIT.hover[0] + .3, HIT.settle[0] + .1, .2), set = W(t, HIT.settle[0], HIT.settle[1]);
  s.x = x; s.y = y + (set < 1 ? 6 * Math.sin(t * 5) * (1 - hov) : 0); s.fly = set < 1 ? 1 : 0; s.blur = hov;
  const backing = BAND(t, HIT.back1[0], HIT.back1[1] + .15, .08) + BAND(t, HIT.back2[0], HIT.back2[1] + .15, .08);
  const fwd = BAND(t, HIT.fwd[0], HIT.fwd[1], .08);
  s.yaw = set > 0 ? lerp(-1.15, ZL.yaw, set) : -1.15; s.rew = backing > .02 ? [backing, 1] : null; s.curl = .2 * backing - .15 * fwd;
  s.lean = .12 * backing - .1 * fwd;
  s.E = zipE(t > HIT.reach - .1 && t < HIT.reach + .5 ? 'laugh' : backing > .3 ? 'confident' : 'happy', t, { look: [t > HIT.hover[0] + .4 && t < HIT.settle[0] ? -.2 : -.8, t > HIT.hover[0] + .4 && t < HIT.settle[0] ? .9 : .1] });
  if (t >= HIT.stamp2) { s.E = zipE(t > HIT.laugh[0] ? 'laugh' : 'happy', t, { look: [-.5, .1] }); s.lift = .25 * Math.sin(Math.PI * seg(t, HIT.laugh[0], HIT.laugh[0] + .6)); }
  return s;
}
function crumbLens(t) {
  const s = { x: 520, k: CL.k, yaw: .9, tip: 0, walk: 0, ph: 0, sit: 0, hop: 0, arms: ARMS.rest, E: null, q: 0, lean: 0, back: false, kk: 1, gy: null };
  if (t < HIT.walk[0]) { s.x = 470; s.E = crumbE(t > HIT.eyesGlow[0] ? 'curious' : 'happy', t, { look: [.9, -.25] }); s.q = 0; return s; }
  if (t < HIT.stamp1) {
    if (t < HIT.walk[1]) {
      const w = walkPos(t), w2 = walkPos(t + .05); s.x = w.x; s.gy = w.y; s.tip = 1; s.ph = (t - HIT.walk[0]) / .8; s.arms = ARMS.sneak;
      s.yaw = w2.x >= w.x ? (w.back ? 1.4 : .9) : (w.back ? -1.4 : -.9); s.back = w.back; s.kk = w.back ? .82 : 1; s.E = crumbE('confident', t, { look: [-.2, 0] });
      return s;
    }
    const w = walkPos(HIT.walk[1]); s.x = w.x; s.gy = w.y; s.back = true; s.kk = .82; s.yaw = -.5; s.arms = ARMS.shrug;
    s.E = crumbE(t > HIT.caught ? 'shy' : 'surprised', t, { look: [-.6, .2] }); s.hop = .1 * Math.sin(Math.PI * seg(t, HIT.caught, HIT.caught + .3));
    return s;
  }
  if (t < HIT.pounce) {                                                        // rón rén từ phía sau-trái tới
    const u = seg(t, HIT.sneak[0], HIT.sneak[1]), hush = W(t, HIT.hush[0], HIT.hush[0] + .2);
    s.x = lerp(380, 560, u); s.tip = u < 1 ? 1 : 0; s.ph = (t - HIT.sneak[0]) / .9; s.arms = ARMS.sneak; s.hop = -.1 * hush; s.yaw = .9;
    s.E = crumbE(talkAt(t, 'crumb') ? 'excited' : hush > .5 ? 'confident' : 'excited', t, { look: [.9, -.1] });
    return s;
  }
  if (t < HIT.flop + .9) {                                                     // vồ, úp mặt xuống đá
    const u = seg(t, HIT.pounce, HIT.flop), p = arc([560, groundY(560)], [ZL.x - 30, stoneTop() + 2], ei(u), 120), fl = W(t, HIT.flop, HIT.flop + .1);
    s.x = p[0]; s.gy = p[1]; s.arms = u < 1 ? ARMS.up : ARMS.sneak; s.lean = .5 * fl; s.yaw = .9; s.E = crumbE(fl > .5 ? 'crosseyed' : 'excited', t, { look: [.9, -.1] });
    return s;
  }
  if (t < HIT.stamp2 + .3) {                                                   // ngồi dậy trên đá, ngước nhìn Zip đứng yên giữa trời, với tay
    const r = Math.sin(Math.PI * seg(t, HIT.reach - .1, HIT.reach + .45)), slide = W(t, HIT.reach + .5, HIT.settle[0]);
    s.x = lerp(ZL.x - 30, 590, slide); s.gy = lerp(stoneTop() + 2, groundY(590), slide); s.sit = (1 - r) * (1 - slide) * .6; s.yaw = lerp(.6, .9, slide);
    s.arms = r > .1 ? ARMS.reach : ARMS.rest; s.hop = .55 * r; s.E = crumbE(r > .2 ? 'excited' : 'surprised', t, { look: [.4, -.9] });
    return s;
  }
  s.x = 590; s.yaw = .9; const lg = BAND(t, HIT.laugh[0], HIT.laugh[1]); s.hop = .12 * lg * Math.abs(Math.sin(t * 9));
  s.E = crumbE(lg > .2 || t > HIT.out[1] ? 'laugh' : 'curious', t, { look: [.9, -.3] });
  return s;
}
function lensChars(c, t, V) {
  const zs = zipLens(t), cs = crumbLens(t);
  const drawCrumb = () => { const gy = cs.gy ?? groundY(cs.x); shadow(c, cs.x + 14, gy + 2, 80 * cs.kk, .16); crumbAt(c, cs.x, gy, cs.k * cs.kk, cs); };
  // vòng nhìn quanh Zip (bí mật 1), vẽ dưới nhân vật
  const rp = t < HIT.stamp1 ? W(t, HIT.ring[0], HIT.ring[1]) * (1 - W(t, HIT.snap1 - .2, HIT.snap1)) : 0;
  if (rp > 0) viewRing(c, ZL.x, groundY(ZL.x) - 50, RING.r + 40, rp, t);
  if (cs.back) drawCrumb();
  if (!zs.fly) shadow(c, zs.x, zs.y + 3, 50, .12);
  drawZip(c, zs);
  // hai vòm mắt sáng viền; tia lấp lánh chạy dọc chỗ hai mắt chạm nhau trên đỉnh đầu
  const g = t < HIT.stamp1 ? BAND(t, HIT.eyesGlow[0], HIT.eyesGlow[1], .3) : 0;
  if (g > 0) for (const sd of [-1, 1]) { const d = domeOf(zs, sd); c.save(); c.globalAlpha *= g * (.7 + .3 * Math.sin(t * 10)); c.strokeStyle = C.cream; c.lineWidth = 7; c.beginPath(); c.arc(d[0], d[1], .36 * zs.k + 6, 0, TAU); c.stroke(); c.strokeStyle = C.lemon; c.lineWidth = 3; c.beginPath(); c.arc(d[0], d[1], .36 * zs.k + 12, 0, TAU); c.stroke(); c.restore(); }
  const sp = t < HIT.stamp1 ? seg(t, HIT.seam[0], HIT.seam[1]) : 0;
  if (sp > 0 && sp < 1) { const a = domeOf(zs, -1), b = domeOf(zs, 1), x = lerp(a[0], b[0], sp), y = lerp(a[1], b[1], sp) - .3 * zs.k - 8 * Math.sin(Math.PI * sp); star(c, x, y, 26 * Math.sin(Math.PI * sp) + 6, C.white); star(c, x, y, 12, C.lemon); }
  // mặt mắt kép: lưới ô hiện khi kính đẩy rất gần (bí mật 3), hình phản chiếu ở mỗi ô
  if (V.grid > 0) { const d = domeOf(zs, 1); facets(c, d[0], d[1], .36 * zs.k, t, { a: V.grid, refl: V.refl, pose: reflPose, view: V.view }); }
  if (!cs.back && !V.hideCrumb) drawCrumb();
}
// dáng của Crumb tí hon trong từng ô mắt (hình phản chiếu, quay mặt ra): làn sóng vẫy tay lan từ giữa ra, rón rén theo, lè lưỡi theo
function reflPose(t, d, i, j) {
  if (i === 2 && j === -6) return { key: 'loupe', draw: cc => drawChar(cc, BY.loupe, { x: 0, y: 0, k: 44, yaw: 0, showFx: false, expr: ex(BY.loupe, 'laugh') }) };   // chi tiết để xem lại: một ô phản chiếu Miss Loupe
  const lag = d * .45, tt = t - lag;
  const wv = BAND(tt, HIT.wave[0] + .3, HIT.wave[1], .25), sd = BAND(tt, HIT.side[0], HIT.side[1] + .1, .15), tg = BAND(tt, HIT.tongue[0], HIT.tongue[1] + .3, .15);
  const wph = Math.floor(((tt - HIT.wave[0]) * 6) % 2 + 2) % 2, tph = Math.floor(((tt - HIT.side[0]) / .4) % 2 + 2) % 2;
  const state = tg > .5 ? 'tongue' : wv > .5 ? 'wave' + wph : sd > .5 ? 'tip' + tph : 'rest';
  return { key: state, draw: cc => {
    const o = { k: 52, yaw: 0, E: ex(BY.crumb, 'happy'), arms: ARMS.rest };
    if (state === 'tongue') { o.E = ex(BY.crumb, 'crosseyed'); o.arms = ARMS.shrug; }
    else if (state.startsWith('wave')) { o.E = ex(BY.crumb, 'laugh'); o.arms = state === 'wave0' ? { armL: [-.4, -1.0, .45], armR: [.85, -2.45, .3] } : { armL: [-.4, -1.0, .45], armR: [.45, -2.6, .4] }; }
    else if (state.startsWith('tip')) { o.arms = ARMS.sneak; o.tip = 1; o.ph = state === 'tip0' ? .25 : .75; o.E = ex(BY.crumb, 'confident'); }
    crumbAt(cc, 0, 0, o.k, { ...o, yaw: .15 });
  } };
}

/* ---------- máy và kính lớn ---------- */
function lensBig(t) {
  const sh = decay(t, [HIT.flop, HIT.pounce], 10) * 4;
  return { x: 540 + 12 * Math.sin(t * 1.3) + sh * Math.sin(t * 50), y: 690 + 10 * Math.sin(t * 1.7), r: 310 + 6 * Math.sin(t * 2.1) };
}
const lensCam = t => ({ cx: BASE.cx + 8 * Math.sin(t * .4), cy: BASE.cy + 6 * Math.sin(t * .5), z: BASE.z });
// điểm cảnh ở tâm kính và độ phóng (so với BASE.z), theo nhịp của bí mật
const FOCUS = K([[HIT.sting[1], [760, 1060, 1.9]], [line('L04').t, [740, 1085, 1.95]], [HIT.eyesGlow[1], [740, 1080, 2.0]], [HIT.ring[0], [700, 1110, 1.35]], [HIT.walk[0] + .3, [690, 1115, 1.25]],
  [HIT.caught, [700, 1110, 1.3]], [HIT.snap1, [705, 1105, 1.35]], [HIT.sneak[0] + .3, [640, 1110, 1.4]], [HIT.hush[1], [660, 1110, 1.5]], [HIT.back1[1], [760, 1065, 1.15]],
  [HIT.back2[1], [775, 1060, 1.12]], [HIT.hover[0] + .5, [745, 1065, 1.15]], [HIT.settle[0], [735, 1070, 1.2]], [HIT.settle[1], [730, 1085, 1.35]]]);
const FAR = 40;                                                                   // độ phóng ở cảnh mắt kép (vòm mắt ≈ 1330 px trên khung)
function lensView(t) {
  // Phép phóng trong kính: điểm cảnh P ở tâm kính, tỉ lệ S. Cảnh mắt kép: P tiến về tâm vòm mắt phải của Zip, S tăng theo hàm mũ tới FAR·BASE.z,
  // kính phình ra phủ cả khung (r 1320, tâm khung); rồi lùi về đúng đường cũ.
  const L = lensBig(t), lc = lensCam(t), z0 = BASE.z;
  const dIn = W(t, HIT.dive[0], HIT.dive[1]), dOut = W(t, HIT.out[0], HIT.out[1]), d = dIn * (1 - dOut);
  const grow = W(t, 18.95, 19.75) * (1 - W(t, HIT.out[0], HIT.out[1] - .2));
  const [fx, fy, mag] = t < HIT.dive[0] ? FOCUS(t) : t < HIT.out[0] ? FOCUS(HIT.settle[1]) : [650, 1095, 1.45];
  const dome = domeOf(zipLens(Math.min(t, HIT.stamp2)), 1), drift = [12 * Math.sin(t * .5), 10 * Math.sin(t * .7)];
  const S = Math.exp(lerp(Math.log(mag * z0), Math.log(FAR * z0), d)), P = [lerp(fx, dome[0] + drift[0] / (S / z0), d), lerp(fy, dome[1] + drift[1] / (S / z0), d)];
  const Lg = { x: lerp(L.x, 540, grow), y: lerp(L.y, 960, grow), r: lerp(L.r, 1320, ei(grow)) };
  const grid = clamp((S / z0 - 7) / 10) * W(t, HIT.grid[0], HIT.grid[1]);
  const refl = W(t, HIT.refl[0], HIT.refl[1]) * (1 - W(t, HIT.out[0] + .3, HIT.out[1]));
  const view = [P[0] - Lg.x / S, P[1] - Lg.y / S, P[0] + (1080 - Lg.x) / S, P[1] + (1920 - Lg.y) / S];   // khung hình trong toạ độ cảnh (bỏ ô ngoài khung)
  return { L: Lg, S, P, grow, d, outer: lc, grid, refl, view, hideCrumb: t > 18.6 && t < HIT.out[0] + .3 };
}
// Crumb thật ở cảnh mắt kép: ló vào từ mép dưới-trái (toạ độ khung), to, vẫy tay, rón rén sang ngang, lè lưỡi; tụt xuống khi kính lùi ra
function crumbFront(t) {
  const up = W(t, HIT.crumbUp[0], HIT.crumbUp[1]) * (1 - W(t, HIT.out[0], HIT.out[0] + .45));
  if (up <= 0) return null;
  const side = W(t, HIT.side[0], HIT.side[1]), wv = BAND(t, HIT.wave[0], HIT.wave[1], .2), tg = BAND(t, HIT.tongue[0], HIT.tongue[1] + .2, .15);
  const tip = BAND(t, HIT.side[0], HIT.side[1], .1), wph = Math.sin((t - HIT.wave[0]) * 6 * Math.PI) > 0;
  return { x: 250 + 110 * side, y: lerp(2500, 1560, ease(up)), k: 230, yaw: .75, tip, ph: (t - HIT.side[0]) / .8,
    arms: tg > .5 ? ARMS.shrug : wv > .3 ? (wph ? ARMS.wave : { armL: [-.4, -1.0, .45], armR: [.45, -2.6, .4] }) : tip > .3 ? ARMS.sneak : ARMS.rest,
    E: tg > .5 ? crumbE('crosseyed', t) : crumbE(talkAt(t, 'crumb') ? 'excited' : wv > .3 ? 'laugh' : 'curious', t, { look: [.7, -.4] }) };
}
const ease = u => 1 - (1 - u) ** 3;
function sLens(c, t) {
  const V = lensView(t), talk = talkAt(t);
  look(c, V.outer, () => pondWorld(c, t));                                     // ngoài kính lớn: chỉ có bờ ao (nhân vật ở trong kính)
  const surprised = t > HIT.back1[0] && t < HIT.back1[1] + .3 || t > HIT.walk[1] && t < HIT.caught + .3;
  const name = surprised ? 'surprised' : talk ? 'explaining' : t > HIT.out[1] && t < HIT.snap3 || t > HIT.reach && t < HIT.reach + .6 ? 'laugh' : 'happy';
  loupe(c, V.L.x, V.L.y, V.L.r, {
    E: ex(BY.loupe, name, { talk, look: [.15, .35], blink: talk ? 0 : blinkAt(t) }), rot: -.05 * (1 - V.grow), pose: ARM.peer,
    inside: cc => { cc.translate(V.L.x, V.L.y); cc.scale(V.S, V.S); cc.translate(-V.P[0], -V.P[1]); pondWorld(cc, t); lensChars(cc, t, V); },
  });
  // chữ (toạ độ khung)
  bigWord(c, 'NOPE!', 300, 400, 120, C.berry, t, line('L07').t, line('L07').t + 2.05, { rot: -.08 });
  bigWord(c, '1000s!', 540, 420, 170, C.lemon, t, HIT.k1000[0], HIT.k1000[1], { rot: -.05 });
  const cf = crumbFront(t);
  if (cf) crumbAt(c, cf.x, cf.y, cf.k, cf);
}

/* ---------- sticker ---------- */
function art1(cc) {                                               // "All-around eyes": đầu Zip nhìn thẳng, vòng chấm quanh đầu
  for (let i = 0; i < 18; i++) { const a = i * TAU / 18; if (Math.abs(a - Math.PI / 2) < .3) continue; circle(cc, Math.cos(a) * 82, -6 + Math.sin(a) * 76, 6, i % 2 ? C.lime : C.white); }
  drawChar(cc, BY.zip, { x: 0, y: 44, k: 95, yaw: 0, showFx: false, expr: ex(BY.zip, 'happy', { look: [-.8, 0] }), pose: { peek: -.9 } });
}
function art2(cc) {                                               // "Flies backwards": Zip nghiêng, vệt ◄◄ sau đuôi
  rewind(cc, 64, 2, .55, 1, 1);
  drawChar(cc, BY.zip, { x: -10, y: 30, k: 52, yaw: -1.35, showFx: false, expr: ex(BY.zip, 'confident'), pose: { beat: 1, flap: 1, curl: .2 } });
}
function art3(cc) {                                               // "1000s of eyes": tổ ong có Crumb tí hon
  facets(cc, 0, 0, 104, 22.0, { a: 1, n: 3.2, refl: 1, pose: (t, d) => ({ key: 'st', draw: c2 => crumbAt(c2, 0, 0, 52, { yaw: .15, E: ex(BY.crumb, 'laugh'), arms: ARMS.wave }) }) });
}
const FILLS = [{ t: HIT.stamp1, fill: N.sky0, draw: art1, r0: 100 }, { t: HIT.stamp2, fill: C.mintL, draw: art2, r0: 100 }, { t: HIT.stamp3, fill: C.lime, draw: art3, r0: 100 }];
const SLOTS = [{ x: 380, y: 232, r: 52 }, { x: 540, y: 232, r: 52 }, { x: 700, y: 232, r: 52 }];

/* ================= SỔ (28,4–32,85 s) ================= */
const PAGE = { x: 56, y: 190, w: 968, h: 760 }, P = [{ x: 228, y: 430, r: 118 }, { x: 540, y: 430, r: 118 }, { x: 852, y: 430, r: 118 }];
const LABELS = ['All around!', 'Backwards!', '1000s of eyes'], DIVE = { x: 540, y: 800 }, MINI = { x: 540, y: 800, r: 78 }, AL = { x: 250, y: 1450, k: 240 };
function albumZip(t) {                                            // Zip bay lùi vào (đuôi đi trước), lượn quanh Albie, lao vào trang đúng "go!" (toạ độ khung)
  if (t < HIT.zipIn[0] || t >= HIT.plunge[1]) return null;
  if (t < HIT.zipIn[1]) { const u = ss(seg(t, HIT.zipIn[0], HIT.zipIn[1])), p = arc([1300, 1000], [640, 1090], u, 120); return { x: p[0], y: p[1], k: 78, yaw: 1.25, rot: 0, rew: [Math.min(1, (1 - u) * 2), -1] }; }
  if (t < HIT.plunge[0]) { const q = t - HIT.zipIn[1]; return { x: 640 + 26 * Math.sin(q * 3), y: 1090 + 16 * Math.sin(q * 5), k: 78, yaw: lerp(1.25, -.5, W(t, HIT.zipIn[1], HIT.zipIn[1] + .4)), rot: 0, rew: null }; }
  const u = seg(t, HIT.plunge[0], HIT.plunge[1]), p = arc([640, 1090], [DIVE.x, DIVE.y + 30], u, 300); return { x: p[0], y: p[1], k: lerp(78, 30, ei(u)), yaw: -.4, rot: -1.0 * ei(u), rew: null };
}
function miniArt(cc) { drawChar(cc, BY.zip, { x: 0, y: 30, k: 58, yaw: .4, showFx: false, expr: ex(BY.zip, 'laugh') }); }
function sAlbum(c, t) {
  const push = 1 + .05 * Math.sin(Math.PI * seg(t, HIT.gulp - .05, HIT.gulp + .6));
  c.save(); c.translate(540, 700); c.scale(push, push); c.translate(-540, -700);
  ground(c, C.skyL); ell(c, 200, 1760, 900, 420, 0, C.mintL); ell(c, 540, 1730, 980, 330, 0, C.leaf); ell(c, 540, 1770, 900, 280, 0, C.leafD);
  rrect(c, PAGE.x + 12, PAGE.y + 18, PAGE.w, PAGE.h, 54, C.grape); rrect(c, PAGE.x, PAGE.y, PAGE.w, PAGE.h, 54, C.cream);
  P.forEach((S, i) => {
    circle(c, S.x, S.y, S.r + 4, '#EBDDBC');
    const shown = i === 2 ? t >= HIT.zoomOut[0] : t >= HIT.slotsDown[1];
    if (!shown) return;
    const st = i === 2 ? HIT.stamp3 : HIT.slotsDown[1], p = t >= st ? back(seg(t, st, st + .22), 2.6) : 1;
    badge(c, S.x, S.y, S.r, FILLS[i].fill, cc => { const k = S.r / 100; cc.scale(k, k); FILLS[i].draw(cc); }, [-.05, .04, -.03][i], t >= st ? lerp(1.18, 1, p) : 1);
    popText(c, LABELS[i], S.x, S.y + S.r + 70, 42, C.ink, null, t, st + .05, { step: .015, font: subFont });
  });
  const rq = seg(t, HIT.gulp, HIT.gulp + .8);
  if (rq > 0 && rq < 1) for (let k = 0; k < 3; k++) { const q = clamp(rq * 1.4 - k * .2); if (q > 0 && q < 1) { c.strokeStyle = `rgba(60,200,255,${.9 * (1 - q)})`; c.lineWidth = 12 * (1 - q) + 2; c.beginPath(); c.ellipse(DIVE.x, DIVE.y, 60 + 260 * q, 26 + 90 * q, 0, 0, TAU); c.stroke(); } }
  if (t >= HIT.mini) badge(c, MINI.x, MINI.y, MINI.r, N.sky0, miniArt, .06, back(seg(t, HIT.mini, HIT.mini + .3), 2.6));
  const talk = talkAt(t, 'albie'), b = albumZip(t);
  shadow(c, AL.x + 18, AL.y + 4, 220, .18);
  albumGulp(c, t, { x: AL.x, y: AL.y, k: AL.k, talk, line: line('L12'), counts: HIT.counts, tg: HIT.gulp, look: b ? [.75, -.4] : [.5, -.7], blink: talk ? 0 : blinkAt(t, .4) });
  if (b) {
    c.save(); c.translate(b.x, b.y - b.k * .6); c.rotate(b.rot); c.translate(-b.x, -(b.y - b.k * .6));
    drawZip(c, { t, x: b.x, y: b.y, k: b.k, yaw: b.yaw, fly: 1, lift: 0, E: ex(BY.zip, t > HIT.plunge[0] ? 'excited' : 'laugh', { look: [-.6, .2] }), rew: b.rew });
    c.restore();
  }
  c.restore();
}

/* ---------- chuyển cảnh ---------- */
function matchCut(c, t) {
  stickerMatchCut(c, t, { t0: HIT.zoomIn[0], t1: HIT.zoomOut[0], t2: HIT.zoomOut[1], lens: lensBig(HIT.zoomIn[0]), from: cc => sLens(cc, HIT.zoomIn[0]), to: (cc, tt) => sAlbum(cc, tt),
    slot: P[2], fill: C.lime, draw: cc => { cc.scale(P[2].r / 100, P[2].r / 100); art3(cc); }, rim: C.berry });
}
function recallTitle(c, t) { hookTitle(c, HOOK_TITLE, -1, { gone: 1 - back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: 400 }); }
function pageFlip(c, t) {
  const u = ss(seg(t, HIT.flip[0], HIT.flip[1])), w = 1080 * (1 - u);
  sPond(c, Math.max(t, HIT.flip[1]));
  c.save(); c.beginPath(); c.rect(0, 0, w, 1920); c.clip(); sAlbum(c, t); c.restore();
  c.fillStyle = 'rgba(30,27,58,.22)'; c.fillRect(w, 0, 34 * (1 - u), 1920);
  rrect(c, w - 60 * Math.sin(Math.PI * u), 0, 60 * Math.sin(Math.PI * u) + 2, 1920, 0, C.cream);
}
function flyToSlot(c, t) {
  for (const [i, f] of [[0, HIT.fly1], [1, HIT.fly2]]) {
    const u = seg(t, f[0], f[1]); if (u <= 0 || u >= 1) continue;
    const L = lensBig(f[0]); flyBadge(c, u, { x: L.x, y: L.y, r: L.r * .8 }, SLOTS[i], FILLS[i].fill, FILLS[i].draw, 100);
  }
}
function lensSnap(c, t) { for (const h of [HIT.snap1, HIT.snap2, HIT.snap3]) if (t >= h && t < h + .35) snapFlash(c, t, h, lensBig(t)); }
const hookLensScreen = () => { const cam = pondCam(HIT.sting[0]), L = lensPond(HIT.sting[0]), p = toScreen(cam, L.x, L.y); return { x: p[0], y: p[1], r: L.r * cam.z }; };

export function drawFilm(c, t) {
  t = clamp(t, 0, DUR - .001);
  c.save();
  if (t >= HIT.flip[1]) sPond(c, t);
  else if (t >= HIT.flip[0]) pageFlip(c, t);
  else if (t >= HIT.zoomOut[1]) sAlbum(c, t);
  else if (t >= HIT.zoomIn[0]) matchCut(c, t);
  else if (t >= HIT.sting[0]) { sLens(c, t); lensSnap(c, t); titleSting(c, t, { t0: HIT.sting[0], t1: HIT.sting[1], from: hookLensScreen() }); flyToSlot(c, t); }
  else sPond(c, t);
  stickerSlots(c, t, { t0: HIT.slots, slots: SLOTS, fills: FILLS, to: { t0: HIT.slotsDown[0], t1: HIT.slotsDown[1], slots: P } });
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t, 495, SAFE.subY);
  c.restore();
}
