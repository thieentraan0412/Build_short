// SHORT-005 · How Ants Say Hello: Tap, Tap! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp: khung cuối mở về khung đầu.
import { C, REC, circle, ell, capsule, rrect, ground, popText, nope, subFont, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { makeTalk, blinkAt, ex, rigPt, look, toScreen, loupe, zoomIn, ARM, albieAt, badge, shadow, subtitle, LENS_UP, hookTitle, askTitle, stickerMatchCut, snapFlash } from '/_shared/episode.js';
import { antAt, antHead, antRelaxTip, smellCloud, wisp, morning, nearGround, stem, stemY, heart, squeakLines, SMELL, rgba } from './props.js';
import { at, LINES, CARDS, DUR, HIT } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const pulse = (t, list, a = .12, b = .1) => list.reduce((s, h) => s + Math.sin(Math.PI * seg(t, h - a, h + b)), 0);   // 0→1→0 quanh mỗi mốc

/* ---------- Crumb: kiến con hổ phách; râu có thể với tới trước (reach) để chạm đầu râu ---------- */
const FEET = [[-.4, 0, .3], [-.48, 0, -.1], [.4, 0, .3], [.48, 0, -.1]];
const ARMS = { rest: { armL: [-.4, -1.0, .45], armR: [.42, -1.05, .45] }, wave: { armL: [-.4, -1.0, .45], armR: [.55, -2.65, .45] }, hug: { armL: [-.1, -1.5, .75], armR: [.1, -1.5, .78] }, up: { armL: [-.62, -2.45, .2], armR: [.62, -2.45, .2] } };
function crumbAt(c, x, y, k, o = {}) {
  const w = o.walk || 0, ph = o.ph || 0;
  const feet = FEET.map((f, i) => { const s = Math.sin(ph * TAU + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)); return [f[0], -Math.max(0, s) * .14 * w, f[2] + s * .16 * w]; });
  const pose = { carry: null, q: o.q ?? 0, reach: o.reach ?? 0, lift: (o.hop || 0) + Math.abs(Math.sin(ph * TAU)) * .04 * w, bodyLean: o.lean || 0, feet, ...(o.arms || ARMS.rest) };
  return drawChar(c, BY.crumb, { x, y, k, yaw: o.yaw ?? CY, showFx: false, expr: o.E || ex(BY.crumb, 'happy'), pose });
}
const crumbE = (name, t, o = {}) => ex(BY.crumb, name, { talk: talkAt(t, 'crumb'), blink: talkAt(t, 'crumb') ? 0 : blinkAt(t, .6), ...o });
// đầu râu trước của Crumb (toạ độ cảnh), cùng công thức với rig (crumb.js: antennaElbow, antennaU, điểm (1, −0,72) của đường cong)
function crumbTip(x, y, k, yaw, reach, lift = 0) {
  const sd = yaw >= 0 ? 1 : -1, p = [sd * (.64 - .42 * reach), -2.32 - lift + .12 * reach - .3024, .34 + .78 * reach];
  return rigPt(x, y, k, yaw, 0, p);
}

/* ================= CÀNH CÂY: móc → soi → "ồ" → chú kiến lạ (một cảnh liền) ================= */
const CY = 1.0;                                                   // Crumb nhìn nghiêng sang phải
const CR = { x: 400, k: 150 }, SIS = { x: 805, s: 250 }, STR = { s: 250 };
const crY = x => stemY(x) - 2;
const ZC = { x: 565, y: 985 }, ZS = { x: 245, y: 985 };          // chỗ kính soi (toạ độ cảnh): giữa hai cái đầu, rồi sang trái (chú kiến lạ)
const STAND = { x: 930, y: 1330, r: 150 };                        // Miss Loupe đứng ở đồi cỏ phía trước, bên phải (toạ độ khung)
// máy quay của cảnh cành cây: khung trung → đẩy vào hai cái đầu khi soi → trượt sang trái theo chú kiến lạ
export const BASE = { cx: 560, cy: 1030, z: 1.15 };
function twigCam(t) {
  const [cx, cy, z] = K([[-1, [560, 1030, 1.06]], [HIT.crash[0], [560, 1030, 1.06]], [HIT.crash[1], [560, 1028, 1.16]], [2.2, [560, 1020, 1.2]],   // v2: đẩy nhanh vào ở khung đầu [3.3, [560, 1020, 1.2]], [3.8, [560, 1030, 1.15]],
    [HIT.zoom, [560, 1030, 1.15]], [HIT.zoom + .4, [585, 1000, 1.3]], [HIT.lensSlide[0], [585, 1000, 1.3]], [HIT.lensSlide[1], [300, 1000, 1.3]], [HIT.back[0], [300, 1000, 1.3]], [HIT.back[1], [585, 1000, 1.3]], [HIT.irisA + 1, [585, 1000, 1.3]]])(t);   // v2: quay lại chỗ chị kiến trước cú chụp
  return { cx, cy, z };
}
// Crumb: hướng mặt, độ với của râu, vị trí
function crumbState(t, gag = false) {
  const s = { x: CR.x, yaw: CY, reach: .72, hop: 0, lean: 0, q: 0, arms: ARMS.rest, E: null };
  if (!gag) {
    const tap = pulse(t, HIT.tap0) + pulse(t, HIT.tapZ) + pulse(t, HIT.tapS) + pulse(t, [HIT.tapB]);
    const toCam = ss(seg(t, HIT.turn0, HIT.turn0 + .3)) * (1 - ss(seg(t, HIT.turnBack, HIT.turnBack + .3)));
    const toLeft = ss(seg(t, HIT.turn1[0], HIT.turn1[1])) * (1 - ss(seg(t, HIT.back[0], HIT.back[1])));   // v2: quay lại chị kiến sau khi chú kiến lạ đi
    s.yaw = lerp(lerp(CY, .25, toCam), -CY, toLeft);
    s.reach = lerp(.72 + .28 * tap, .15, toCam) * (1 - toLeft * (1 - ss(seg(t, HIT.lensSlide[0], HIT.lensSlide[1]))) * .8);
    s.reach = Math.max(s.reach, toLeft > .5 || t > HIT.back[1] ? .72 + .28 * tap : 0);
    const nz = Math.sin(Math.PI * seg(t, HIT.nuzzle[0], HIT.nuzzle[1]));
    s.lean = .2 * nz; s.x += 18 * nz;
    s.hop = .12 * Math.sin(Math.PI * seg(t, HIT.match, HIT.match + .3)) + .1 * Math.sin(Math.PI * seg(t, HIT.turn0, HIT.turn0 + .3));
    const sniff = pulse(t, HIT.sniff0, .1, .15);
    if (t > HIT.tap0[0] - .02 && t < HIT.tap0[0] + .35) s.E = crumbE('surprised', t, { look: [.75, -.4] });   // v2: cú chạm đầu tiên "tê tê": tròn mắt
    else if (t < HIT.turn0) s.E = crumbE('happy', t, { look: [.7, -.25], closed: sniff > .3 ? 1 : 0 });
    else if (t < HIT.turnBack) { s.E = crumbE('excited', t, { look: [0, 0] }); s.arms = ARMS.wave; }
    else if (t < HIT.match) s.E = crumbE('curious', t, { look: [.7, -.3] }), s.q = 0;
    else if (t < HIT.nuzzle[1] + .2) { s.E = crumbE(nz > .2 ? 'laugh' : 'excited', t, { look: [.7, -.2] }); s.arms = nz > .1 ? ARMS.hug : ARMS.rest; }
    else if (t < HIT.clash) s.E = crumbE('curious', t, { look: [.7, -.2] });
    else if (t < HIT.leave[0]) s.E = crumbE('surprised', t, { look: [.7, -.3] });
    else s.E = crumbE('worried', t, { look: [.6, 0] });
  }
  return s;
}
// chị kiến (phải, quay trái): đầu râu trước chạm đúng đầu râu Crumb ở mỗi cú "tách"
function sisterTip(t, cs, gag = false) {
  const relax = antRelaxTip(SIS.x, stemY(SIS.x), SIS.s, { dir: -1, wig: .05 * Math.sin(t * 6) });
  if (gag) return relax;
  const ct = crumbTip(cs.x, crY(cs.x), CR.k, cs.yaw, cs.reach, cs.hop), tap = pulse(t, HIT.tap0) + pulse(t, HIT.tapZ) + pulse(t, [HIT.tapB]) + (t > HIT.match - .1 && t < HIT.nuzzle[1] ? ss(seg(t, HIT.match - .1, HIT.match)) * (1 - ss(seg(t, HIT.nuzzle[1] - .1, HIT.nuzzle[1] + .2))) : 0);
  return [lerp(relax[0], ct[0] + 6, Math.min(1, tap)), lerp(relax[1], ct[1] + 2, Math.min(1, tap))];
}
// chú kiến lạ (từ trái đi tới, trông y hệt chị kiến): x theo thời gian, hướng mặt, nhún vai
function strangerState(t) {
  const xin = K([[HIT.stranger[0], [-420]], [HIT.stranger[1], [40]]])(t)[0];
  const away = ss(seg(t, HIT.leave[0], HIT.leave[0] + .2)), x = t < HIT.leave[0] ? xin : lerp(40, -520, ss(seg(t, HIT.leave[0] + .15, HIT.leave[1])));
  return { x, dir: away > .5 ? -1 : 1, walk: (t > HIT.stranger[0] && t < HIT.stranger[1]) || t > HIT.leave[0] + .15 ? 1 : 0, shrug: Math.sin(Math.PI * seg(t, HIT.shrug, HIT.shrug + .45)), hop: Math.sin(Math.PI * seg(t, HIT.leave[0], HIT.leave[0] + .2)) * 26 };
}
function twigWorld(c, t, detail, o = {}) {
  morning(c, t);
  stem(c, t);
  const gag = !!o.gag, cs = o.cs || crumbState(t, gag), cy = crY(cs.x);
  const syy = stemY(SIS.x), sx = SIS.x - 16 * Math.sin(Math.PI * seg(t, HIT.nuzzle[0], HIT.nuzzle[1]));
  const st = !gag && t > HIT.stranger[0] && t < HIT.leave[1] ? strangerState(t) : null;
  // trong kính: mây mùi quanh từng chú kiến (vẽ sau lưng nhân vật)
  if (detail) {                                                   // "kính ngửi": nền tối lại, mây mùi sáng lên (nhân vật vẽ sau nên vẫn sáng)
    const on = o.cloudOn ?? 1;
    c.fillStyle = `rgba(40,22,110,${.36 * on})`; c.fillRect(-2000, -2000, 5080, 5920);
    const ch = rigPt(cs.x, cy, CR.k, cs.yaw, 0, [0, -1.58 - cs.hop, .14]), sh = antHead(sx, syy, SIS.s, { dir: -1 });   // mây mùi ôm lấy đầu (kính nhìn thấy đầu)
    smellCloud(c, ch[0], ch[1] - 20, 140, 160, t, SMELL.home, .62 * on, 0);
    smellCloud(c, sh[0] + 40, sh[1] - 10, 175, 120, t, SMELL.home, .62 * on, 1.3);
    if (st) { const h = antHead(st.x, stemY(Math.max(-200, st.x)) - st.hop, STR.s, { dir: st.dir }); smellCloud(c, h[0] - st.dir * 40, h[1] - 10, 175, 120, t, SMELL.away, .66 * on, 2.6); }
  }
  // chị kiến
  const sTip = sisterTip(t, cs, gag), nod = Math.sin(Math.PI * seg(t, HIT.nuzzle[0], HIT.nuzzle[1]));
  const sEye = !gag && t > HIT.match && t < HIT.nuzzle[1] + .3 ? 'happy' : !gag && ((t > HIT.clash && t < HIT.leave[0] + .3) || (t > HIT.tap0[0] - .02 && t < HIT.tap0[0] + .35)) ? 'wide' : blinkAt(t, .3) ? 'shut' : 'open';
  shadow(c, sx - 60, syy + 2, 210, .16);
  antAt(c, sx, syy, SIS.s, 0, { dir: -1, walk: 0, tip: sTip, nod, eye: sEye, look: [.5, -.2] });
  // chú kiến lạ
  if (st) {
    const sy = stemY(Math.max(-200, st.x)) - st.hop;
    const cTip = crumbTip(cs.x, cy, CR.k, cs.yaw, cs.reach, cs.hop), tapS = pulse(t, HIT.tapS), relax = antRelaxTip(st.x, sy, STR.s, { dir: st.dir });
    const tip = st.dir > 0 ? [lerp(relax[0], cTip[0] - 6, Math.min(1, tapS)), lerp(relax[1], cTip[1] + 2, Math.min(1, tapS))] : null;
    antAt(c, st.x, sy, STR.s, t * 2.4, { dir: st.dir, walk: st.walk, tip, shrug: st.shrug, eye: st.shrug > .3 ? 'shut' : 'open', look: [.5, -.2] });
  }
  // Crumb
  shadow(c, cs.x + 20, cy + 2, 150, .18);
  crumbAt(c, cs.x, cy, CR.k, { yaw: cs.yaw, reach: cs.reach, hop: cs.hop, lean: cs.lean, q: cs.q, arms: cs.arms, E: cs.E, walk: cs.walk || 0, ph: t * 2.4 });
  const ct = crumbTip(cs.x, cy, CR.k, cs.yaw, cs.reach, cs.hop);
  if (gag) return ct;
  // tia sáng nhỏ ở mỗi cú chạm râu
  for (const h of [...HIT.tap0, ...HIT.tapZ, ...HIT.tapS]) { const q = seg(t, h, h + .4); if (q <= 0 || q >= 1) continue; for (let i = 0; i < 5; i++) { const a = i * TAU / 5 + .3; star(c, ct[0] + Math.cos(a) * 34 * eo(q), ct[1] + Math.sin(a) * 34 * eo(q), 10 * (1 - q), C.lemon); } }
  // tim nhỏ khi dụi đầu
  for (let i = 0; i < 3; i++) { const q = seg(t, HIT.hearts + i * .12, HIT.hearts + i * .12 + .9); if (q <= 0 || q >= 1) continue; heart(c, ct[0] - 30 + i * 40, ct[1] - 30 - 120 * eo(q), 22 * Math.sin(Math.PI * Math.min(1, q * 1.5)), [C.berry, C.pink, C.berry][i]); }
  if (!detail) return ct;
  // làn mùi bay vào đầu râu, đầu râu sáng màu mùi (bạc hà = cùng nhà, cam = khác nhà)
  const wOn = Math.sin(Math.PI * seg(t, HIT.wisp[0] - .1, HIT.wisp[1] + .1));
  wisp(c, sx - 40, syy - 230, ct[0] + 6, ct[1], t, SMELL.home, wOn);
  if (st) wisp(c, st.x + 40, stemY(Math.max(-200, st.x)) - 230, ct[0] - 6, ct[1], t, SMELL.away, Math.sin(Math.PI * seg(t, HIT.wispS[0] - .1, HIT.wispS[1] + .1)));
  const g = t > HIT.match - .05 && t < HIT.nuzzle[1] ? SMELL.home : t > HIT.clash - .05 && t < HIT.leave[0] ? SMELL.away : null;
  if (g) { const p = .5 + .5 * Math.sin(t * 12); circle(c, ct[0], ct[1], 22 * (1 + .25 * p), rgba(g, .55)); circle(c, ct[0], ct[1], 10, rgba(g, 1)); }
  return ct;
}
function lensState(t) {                                          // toạ độ khung; trong kính: phóng thêm quanh tâm kính
  const zc = toScreen({ cx: 585, cy: 1000, z: 1.3 }, ZC.x, ZC.y), zs = toScreen({ cx: 300, cy: 1000, z: 1.3 }, ZS.x, ZS.y);
  const [x, y, r] = K([[HIT.lensIn, [1360, 1700, 150]], [HIT.lensIn + .55, [STAND.x, STAND.y, STAND.r]], [HIT.zoom - .05, [STAND.x, STAND.y, STAND.r]], [HIT.zoom + .4, [zc[0], zc[1], 250]],
    [HIT.lensSlide[0], [zc[0], zc[1], 250]], [HIT.lensSlide[1], [zs[0], zs[1], 250]], [HIT.back[0], [zs[0], zs[1], 250]], [HIT.back[1], [zc[0], zc[1], 250]], [HIT.irisA, [zc[0], zc[1], 250]]])(t);
  const m = ss(seg(t, HIT.zoom, HIT.zoom + .35));
  return { x, y, r, m, mag: lerp(1, 1.04, m) };
}
function loupeTwig(c, t) {
  if (t < HIT.lensIn) return;
  const L = lensState(t), cm = twigCam(t), name = t < HIT.zoom ? 'happy' : t < HIT.match ? 'curious' : t < HIT.clash ? 'surprised' : t < HIT.nope + .7 ? 'explaining' : 'laugh';
  loupe(c, L.x, L.y, L.r, {
    E: ex(BY.loupe, name, { talk: talkAt(t), look: L.m > .3 ? [-.3, -.55] : [-.7, -.3], blink: name === 'happy' ? blinkAt(t) : 0 }), rot: L.m > .3 ? -.28 : -.12, pose: L.m > .3 ? ARM.peer : name === 'explaining' ? ARM.wave : ARM.up,
    inside: L.m > .01 ? zoomIn(L.x, L.y, L.mag, L.x, L.y, () => look(c, cm, () => twigWorld(c, t, L.m > .3 ? 1 : 0, { cloudOn: ss(seg(t, HIT.clouds, HIT.clouds + .5)) }))) : null,
  });
  if (L.m > .5 && t > HIT.clash && t < Math.min(HIT.leave[0] + .3, HIT.back[0] + .1)) nope(c, L.x - L.r * .62, L.y - L.r * .62, 62, seg(t, HIT.clash, HIT.clash + .25));
}
function sTwig(c, t, o = {}) {
  look(c, twigCam(t), () => { twigWorld(c, t, 0); nearGround(c, 1560); });
  if (!o.noLup) loupeTwig(c, t);
  // v2: tựa móc dùng chung (hookTitle): hiện đủ ở khung 0, từng dòng nảy có tiếng, lắc ở mỗi cú chạm, thu nhỏ biến mất trước khi Miss Loupe vào
  const wob = HIT.tap0.reduce((a, h) => a + (t > h ? Math.sin((t - h) * 16) * Math.exp(-(t - h) * 6) * .05 : 0), 0);
  hookTitle(c, TITLE, t, { gone: ss(seg(t, 2.6, 2.95)), wob, cy: 340 });
  if (t > HIT.tap0[0] - .02 && t < 2.6) { popText(c, 'TAP!', 230, 690, 96, C.lemon, C.grape, t, HIT.tap0[0], { step: .03, sh: 8 }); popText(c, 'TAP!', 850, 690, 96, C.lemon, C.grape, t, HIT.tap0[1], { step: .03, sh: 8 }); }
  if (t > HIT.same - .02 && t < 10.9) {
    const pu = 1 + .1 * Math.sin(Math.PI * seg(t, HIT.match, HIT.match + .25));
    c.save(); c.translate(540, 330); c.scale(pu, pu); c.translate(-540, -330);
    popText(c, 'SAME', 540, 270, 150, C.grape, C.cream, t, HIT.same, { step: .03, sh: 9 }); popText(c, 'SMELL!', 540, 430, 160, C.leafD, C.cream, t, HIT.same + .15, { step: .03, sh: 10 });
    c.restore();
  }
}

/* ================= SỔ: một sticker, Albie ================= */
const TITLE = [{ text: 'SNIFF', y: 272, px: 196, fill: C.grape, shadow: C.cream, t0: HIT.words[0] }, { text: 'HELLO?!', y: 476, px: 200, fill: C.berry, shadow: C.cream, t0: HIT.words[1] }];
const SLOT = { x: 280, y: 480, r: 140 };
function stickerArt(cc) {                                         // hình trong sticker: Crumb và chị kiến chạm râu (cỡ theo SLOT.r)
  crumbAt(cc, -62, 92, 52, { yaw: CY, reach: 1, E: ex(BY.crumb, 'happy', { look: [.7, -.2] }) });
  const tp = crumbTip(-62, 92, 52, CY, 1);
  antAt(cc, 92, 94, 88, 0, { dir: -1, walk: 0, tip: [tp[0] + 3, tp[1]], eye: 'happy' });
  for (let i = 0; i < 4; i++) { const a = i * TAU / 4 + .4; star(cc, tp[0] + Math.cos(a) * 16, tp[1] + Math.sin(a) * 16, 6, C.lemon); }
}
const AL = { x: 262, y: 1440, k: 240 };
function sAlbum(c, t) {
  ground(c, C.pink); ell(c, 200, 1760, 900, 420, 0, '#FFB3D1'); ell(c, 540, 1730, 980, 330, 0, C.leaf); ell(c, 540, 1770, 900, 280, 0, C.leafD);
  rrect(c, 96, 218, 890, 560, 54, C.grape); rrect(c, 84, 200, 890, 560, 54, C.cream);
  const t0 = HIT.stamp;
  circle(c, 280, 480, 142, '#EBDDBC');
  if (t >= HIT.irisB) {                                          // v2: sticker nằm sẵn ở chỗ (máy lùi ra từ chính nó), nảy lên ở cú dán
    const p = t >= t0 ? back(seg(t, t0, t0 + .22), 2.6) : 1;
    badge(c, SLOT.x, SLOT.y, SLOT.r, C.mint, stickerArt, -.05, t >= t0 ? lerp(1.2, 1, p) : 1);
    popText(c, 'Sniff', 470, 468, 122, C.berry, null, t, t0 + .1, { align: 'left', step: .02 });
    popText(c, 'to say hi', 470, 560, 76, C.ink, null, t, t0 + .2, { align: 'left', step: .012, font: subFont });
  }
  const talk = talkAt(t, 'albie'), hop = .1 * Math.sin(Math.PI * seg(t, t0, t0 + .22));
  shadow(c, AL.x + 18, AL.y + 4, 220, .18);
  albieAt(c, AL.x, AL.y, AL.k, { E: ex(BY.albie, 'happy', { talk, look: talk ? [.45, -.65] : [.55, .1], blink: talk ? 0 : blinkAt(t, .4) }), hop });
  // Crumb ngó vào trang sổ từ góc phải, vẫy chào sticker của mình
  const peek = ss(seg(t, 16.6, 17.0));
  if (peek > 0) crumbAt(c, lerp(1250, 830, peek), 1470, 120, { yaw: -.75, E: ex(BY.crumb, 'excited', { look: [-.6, -.4], talk: 0, blink: blinkAt(t, .2) }), arms: { armL: [-.55, -2.65, .45], armR: [.42, -1.05, .45] }, hop: .1 * Math.abs(Math.sin((t - 17) * 5)) * peek });
}

/* ================= GAG: lại cành cây; Miss Loupe đứng trên cành, kính giữa Crumb và chị kiến; Crumb chào cái kính ================= */
const GL = { x: 600, r: 150 };
const glY = () => stemY(GL.x) - LENS_UP * GL.r - 6;
function gagCrumb(t) {
  const s = { x: lerp(250, CR.x, ss(seg(t, HIT.walkG[0], HIT.walkG[1]))), yaw: CY, reach: .2, hop: 0, lean: 0, q: 0, arms: ARMS.rest, walk: t > HIT.walkG[0] && t < HIT.walkG[1] ? 1 : 0, E: null };
  const say = LINES.find(l => l.id === 'L09'), [g1, g2] = HIT.glass, tp = pulse(t, HIT.glass, .14, .12);
  const curl = t > HIT.curl[0] && t < HIT.curl[1];
  s.reach = t < g1 - .5 ? .2 : t < HIT.curl[0] ? lerp(.55, 1, Math.min(1, tp)) : lerp(.55, .3, ss(seg(t, HIT.curl[1], HIT.curl[1] + .3)));
  if (curl) s.q = 1;
  if (t > HIT.turnG) { s.reach = lerp(.3, .72, ss(seg(t, HIT.turnG, HIT.turnG + .3))); s.q = 0; }
  if (t < say.t + say.dur + .1) { s.E = crumbE('excited', t, { look: [.6, -.3] }); s.arms = t > say.t - .1 ? ARMS.wave : ARMS.rest; }
  else if (t < HIT.curl[0]) s.E = crumbE('curious', t, { look: [.7, -.3] });
  else if (t < HIT.curl[1]) s.E = crumbE(t < HIT.curl[0] + .5 ? 'surprised' : 'confused', t, { look: [.7, -.1], closed: t > HIT.curl[0] + .6 && t < HIT.curl[0] + 1.0 ? 1 : 0 });
  else s.E = crumbE('happy', t, { look: [.7, -.25] });
  s.hop = .16 * Math.sin(Math.PI * seg(t, g2, g2 + .3));
  return s;
}
function sGag(c, t, o = {}) {
  const cs = gagCrumb(t), shake = HIT.glass.reduce((a, h) => a + (t > h ? Math.sin((t - h) * 60) * Math.exp(-(t - h) * 9) : 0), 0);
  const lift = ss(seg(t, HIT.lift[0], HIT.lift[1])), laugh = t > HIT.laugh;
  const push = 1 + .05 * ss(seg(t, HIT.glass[0] - .3, HIT.glass[0])) * (1 - ss(seg(t, HIT.turnG, HIT.puff[0])));
  look(c, { cx: BASE.cx, cy: BASE.cy, z: BASE.z * push }, () => {
    morning(c, t); stem(c, t);
    // chị kiến chờ bên phải, thò đầu nhìn
    const syy = stemY(SIS.x); shadow(c, SIS.x - 60, syy + 2, 210, .16);
    antAt(c, SIS.x, syy, SIS.s, 0, { dir: -1, walk: 0, eye: t > HIT.glass[0] && t < HIT.curl[1] ? 'wide' : blinkAt(t, .3) ? 'shut' : 'open', look: [.6, -.3], wig: .05 * Math.sin(t * 6) });
    // Miss Loupe đứng trên cành, giữ kính ngang tầm râu; cười rồi nhảy khỏi cành (lên phải)
    if (!o.noLup && lift < 1) {
      const hop = laugh ? Math.abs(Math.sin((t - HIT.laugh) * 9)) * 14 * (1 - lift) : 0, lx = GL.x + 700 * lift + shake * 6, ly = glY() - hop - 900 * lift * lift;
      loupe(c, lx, ly, GL.r, { E: ex(BY.loupe, laugh ? 'laugh' : t > HIT.glass[0] ? 'surprised' : 'happy', { talk: talkAt(t), look: [-.8, .2], blink: blinkAt(t) }), rot: -.04 + shake * .03, pose: laugh ? ARM.up : {} });
    }
    // Crumb (vẽ trước mặt kính: đầu râu chạm mặt kính)
    shadow(c, cs.x + 20, crY(cs.x) + 2, 150, .18);
    crumbAt(c, cs.x, crY(cs.x), CR.k, { ...cs, ph: t * 2.4 });
    const ct = crumbTip(cs.x, crY(cs.x), CR.k, cs.yaw, cs.reach, cs.hop);
    HIT.glass.forEach(h => squeakLines(c, ct[0] + 10, ct[1], seg(t, h, h + .35)));
    nearGround(c, 1560);
  });
  if (t > HIT.glass[0] - .02 && t < HIT.curl[1]) {
    const pu = 1 + .12 * Math.sin(Math.PI * seg(t, HIT.glass[1], HIT.glass[1] + .25));
    c.save(); c.translate(540, 360); c.scale(pu, pu); c.rotate(.04 * Math.sin(t * 30) * (t < HIT.glass[1] + .4 ? 1 : 0)); c.translate(-540, -360);
    popText(c, 'SQUEAK!', 540, 400, 170, C.grape, C.cream, t, HIT.glass[0], { step: .03, sh: 11 }); c.restore();
  }
}

/* ---------- vòng lặp: một đám mây mùi bạc hà phồng ra từ chỗ hai đầu râu, mở về đúng khung đầu ---------- */
function puffIris(c, t) {
  sGag(c, t, { noLup: true });
  const u = ei(seg(t, HIT.puff[0], DUR - .04)), R = lerp(10, 2300, u), ct = toScreen(BASE, ...crumbTip(CR.x, crY(CR.x), CR.k, CY, .72));
  const [cx, cy] = [lerp(ct[0], 540, u), lerp(ct[1], 960, u)];
  const blob = (r, f) => { c.fillStyle = f; c.beginPath(); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + t; c.moveTo(cx + Math.cos(a) * r * .8 + r * .3, cy + Math.sin(a) * r * .8); c.arc(cx + Math.cos(a) * r * .8, cy + Math.sin(a) * r * .8, r * .3, 0, TAU); } c.moveTo(cx + r * .85, cy); c.arc(cx, cy, r * .85, 0, TAU); c.fill(); };
  blob(R + 46, C.mint); blob(R + 22, C.mintL);
  c.save(); c.beginPath(); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + t; c.moveTo(cx + Math.cos(a) * R * .8 + R * .3, cy + Math.sin(a) * R * .8); c.arc(cx + Math.cos(a) * R * .8, cy + Math.sin(a) * R * .8, R * .3, 0, TAU); } c.moveTo(cx + R * .85, cy); c.arc(cx, cy, R * .85, 0, TAU); c.clip();
  REC.mute++; sTwig(c, t - DUR, { noLup: true }); REC.mute--; c.restore();
}

/* ---------- chuyển cảnh: kính nở thành trang sổ · trang sổ lật sang cành cây ---------- */
function matchCut(c, t) {                                      // v2: kính "chụp" cú chạm râu → máy lao xuyên qua mặt kính → hình hoá thành sticker → lùi ra lộ trang sổ
  stickerMatchCut(c, t, { t0: HIT.zoomIn[0], t1: HIT.zoomOut[0], t2: HIT.zoomOut[1], lens: lensState(HIT.zoomIn[0]), from: cc => sTwig(cc, HIT.zoomIn[0]), to: (cc, tt) => sAlbum(cc, tt), slot: SLOT, fill: C.mint, draw: stickerArt });
}
function recallTitle(c, t) {                                   // v2: chữ móc trở lại ở cuối, đúng chỗ và đúng cỡ của khung đầu
  hookTitle(c, TITLE, -1, { gone: 1 - back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: 340 });
}
function pageFlip(c, t) {
  const u = ss(seg(t, HIT.flip[0], HIT.flip[1])), w = 1080 * (1 - u);
  sGag(c, Math.max(t, HIT.flip[1]));
  c.save(); c.beginPath(); c.rect(0, 0, w, 1920); c.clip(); sAlbum(c, t); c.restore();
  c.fillStyle = 'rgba(30,27,58,.22)'; c.fillRect(w, 0, 34 * (1 - u), 1920);                 // bóng mép trang
  rrect(c, w - 60 * Math.sin(Math.PI * u), 0, 60 * Math.sin(Math.PI * u) + 2, 1920, 0, C.cream);   // mép trang cong
}

export function drawFilm(c, t) {
  t = clamp(t, 0, DUR - .001);
  c.save();
  if (t >= HIT.puff[0]) puffIris(c, t);
  else if (t >= HIT.flip[1]) sGag(c, t);
  else if (t >= HIT.flip[0]) pageFlip(c, t);
  else if (t >= HIT.zoomOut[1]) sAlbum(c, t);
  else if (t >= HIT.zoomIn[0]) matchCut(c, t);
  else { const sh = t > HIT.tap0[0] && t < HIT.tap0[0] + .22 ? 1 - seg(t, HIT.tap0[0], HIT.tap0[0] + .22) : 0; c.save(); c.translate(Math.sin(t * 90) * 6 * sh, 0); sTwig(c, t); c.restore(); snapFlash(c, t, HIT.snap, lensState(t)); }
  askTitle(c, t, HIT.ask[0], HIT.ask[1], { small: 'How do', big: 'YOU SAY HI?', cy: 340, px: 126, shadow: C.cream, fill: C.berry, ink: C.grape, q: C.grape });   // v3: câu hỏi kết hiện to, rồi nhường chỗ cho chữ móc
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t);
  c.restore();
}
