// SHORT-011 · Sneaking Up on a Dragonfly... Oops! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp: Crumb lại giơ biển, rón rén về đúng khung đầu.
// Bản B theo lượt nâng cấp 11/2026 (PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §4). Cảnh đặc trưng của tập: KHUNG CHIA ĐÔI "CRUMB SEES | ZIP SEES"
// (khoá kéo tách khung; mắt Zip mở ra, tầm nhìn nở rộng gần trọn vòng, Crumb trượt vào tầm nhìn). Nhân vật phong cách v2 "Kẹo Phẳng Viền".
// (19/11/2026, chuẩn 11/2026b theo SHORT-016) chữ móc ở giữa phía trên (hookStack 'mid'), nhân vật đứng dưới chữ trong 3 s đầu; khung chia đôi
// có máy riêng (look: đẩy vào nửa trái, lia sang nửa phải, lùi ra ở điệp khúc) để mỗi 2–4 s có một thay đổi; điệp khúc lần 2 ở gag: mắt Zip sáng lại.
import { LOOK } from '/_shared/characters/look.js';
LOOK.v = 2;   // (11/2026) tập mới dùng phong cách nhân vật v2
LOOK.cheer = true;   // (11/2026) mặt nhân vật luôn vui tươi (QUALITY.md §5, stage.js cheerExpr)
import { C, circle, ell, rrect, poly, ground, popText, subFont, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { makeTalk, blinkAt, ex, rigPt, look, loupe, ARM, badge, shadow, subtitle, LENS_UP, hookTitle, hookStack, stickerMatchCut, SAFE, albumGulp } from '/_shared/episode.js';
import { D, INK, GY, sky, hedge, grass, stemFlower, daisy, twig, TWIG, cushion, CUSH, dryLeaf, LEAFX, booSign, PL, PR, pc, panelPath, splitBg, panelFrame, tag, zipper, eyelids, spotRing, bang } from './props.js';
import { LINES, CARDS, DUR, HIT, spanEnd } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const decay = (t, list, k = 6) => list.reduce((s, h) => s + (t >= h ? Math.exp(-(t - h) * k) : 0), 0);
const pulse = (t, list, a = .12, b = .1) => list.reduce((s, h) => s + Math.sin(Math.PI * seg(t, h - a, h + b)), 0);
const arc = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];
const line = id => LINES.find(l => l.id === id);
const W = (t, a, b) => ss(seg(t, a, b));
const BAND = (t, a, b, f = .2) => ss(seg(t, a, a + f)) * (1 - ss(seg(t, b - f, b)));
const wob = (t, t0, f = 14, k = 3) => t > t0 ? Math.sin((t - t0) * f) * Math.exp(-(t - t0) * k) : 0;
// (19/11/2026) không ai hát: màu biểu cảm của Miss Loupe lấy từ tune.mode của câu nói theo phách (điệp khúc → phấn khích, móc / bất ngờ → vui, giải thích → giảng giải)
const lineAt = t => LINES.find(l => t >= l.t && t < l.t + l.dur + .1);
const singExpr = t => { const l = lineAt(t); if (!l || l.who !== 'loupe') return null; const m = (l.sung || l.tune || {}).mode || 'speak'; return m === 'sing' ? 'excited' : m === 'half-sing' ? 'happy' : m === 'sing-talk' ? 'explaining' : null; };
const CH = id => t => t >= line(id).t && t < spanEnd(id);                      // đang trong đoạn nhạc của câu điệp khúc

/* ================= nhân vật ================= */
// Crumb: kiến con hổ phách. tip: rón rén (nhón chân, bước cao) · sit: ngồi bệt · one: co một chân (đứng sững) · arms: dáng hai tay
const FEET = [[-.4, 0, .3], [-.48, 0, -.1], [.4, 0, .3], [.48, 0, -.1]];
const ARMS = {
  rest: { armL: [-.4, -1.0, .45], armR: [.42, -1.05, .45] }, sign: { armL: [-.3, -2.35, .5], armR: [.3, -2.4, .5] },
  signHi: { armL: [-.26, -2.78, .4], armR: [.26, -2.83, .4] }, hide: { armL: [-.26, -1.55, .72], armR: [.26, -1.55, .72] },
  up: { armL: [-.72, -2.4, .2], armR: [.72, -2.4, .2] }, hat: { armL: [-.42, -2.25, .25], armR: [.42, -2.3, .25] },
  wave: { armL: [-.26, -1.55, .72], armR: [.9, -2.2, .4] }, shrug: { armL: [-.85, -1.45, .2], armR: [.85, -1.45, .2] },
};
const mixArms = (a, b, k) => ({ armL: a.armL.map((v, i) => lerp(v, b.armL[i], k)), armR: a.armR.map((v, i) => lerp(v, b.armR[i], k)) });
const crumbLift = o => (o.hop || 0) + Math.abs(Math.sin((o.ph || 0) * TAU)) * .1 * (o.tip || 0) + .12 * (o.tip || 0) - .42 * (o.sit || 0);
function crumbAt(c, s) {
  const tip = s.tip || 0, ph = s.ph || 0, sit = s.sit || 0, one = s.one || 0;
  const feet = FEET.map((f, i) => {
    const q = Math.sin(ph * TAU + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0));
    let ft = [f[0], -Math.max(0, q) * .34 * tip, f[2] + q * .22 * tip];
    if (one && i === 2) ft = [f[0] + .05, -.42 * one, f[2] + .18 * one];   // chân trước bên phải co lên: đứng sững một chân
    return [ft[0], ft[1] * (1 - sit), lerp(ft[2], f[2] + .55, sit)];
  });
  const pose = { carry: null, q: s.q || 0, reach: s.reach ?? .35, lift: crumbLift(s), bodyLean: s.bodyLean || 0, feet, ...(s.arms || ARMS.rest) };
  return drawChar(c, BY.crumb, { x: s.x, y: s.y, k: s.k, yaw: s.yaw ?? .9, lean: s.lean || 0, showFx: !!s.fx, expr: s.E || ex(BY.crumb, 'happy'), pose });
}
const crumbE = (name, t, o = {}) => ex(BY.crumb, name, { talk: talkAt(t, 'crumb'), blink: talkAt(t, 'crumb') ? 0 : blinkAt(t, .6), ...o });
function gripOf(s) { const a = (s.arms || ARMS.rest), L = crumbLift(s); return rigPt(s.x, s.y, s.k, s.yaw ?? .9, s.lean || 0, [(a.armL[0] + a.armR[0]) / 2, (a.armL[1] + a.armR[1]) / 2 - L, (a.armL[2] + a.armR[2]) / 2]); }
// Crumb + tấm biển: biển giơ cao vẽ trước (tay đè lên que), biển che mặt vẽ sau. s.sign = { mode: 'up' | 'hide' | 'free', rot, face, x, y }
function drawCrumb(c, s) {
  const sg = s.sign;
  if (sg && sg.mode === 'up') { const g = gripOf(s); booSign(c, g[0], g[1], s.k * (sg.k || 1), sg.rot || 0, sg.face ?? 1, sg.stick ? { stick: sg.stick * s.k } : {}); }
  crumbAt(c, s);
  if (sg && sg.mode === 'hide') { const g = gripOf(s); booSign(c, g[0], g[1] + .35 * s.k, s.k * (sg.k || 1), sg.rot || 0, sg.face ?? 1, { stick: .25 * s.k }); }
  if (sg && sg.mode === 'free') booSign(c, sg.x, sg.y, s.k * (sg.k || 1), sg.rot || 0, sg.face ?? 1);
}
// Zip: chuồn chuồn. s: { x, y (điểm chân), k, yaw, lift, beat, blur, peek, curl, lean, E }
function drawZip(c, s, t) {
  drawChar(c, BY.zip, { x: s.x, y: s.y, k: s.k, yaw: s.yaw, lean: s.lean || 0, showFx: false, expr: s.E,
    pose: { lift: s.lift || 0, flap: (s.flapT ?? t) * (s.fly ? 40 : 26), beat: s.beat ?? 0, blur: s.blur || 0, peek: s.peek || 0, curl: s.curl || 0 } });
}
const zipE = (name, t, o = {}) => ex(BY.zip, name, { blink: blinkAt(t, .2), ...o });
const domeOf = (s, sd) => rigPt(s.x, s.y, s.k, s.yaw, s.lean || 0, [sd * .2, -.86 - (s.lift || 0), .6]);
// Miss Loupe đứng trên mặt đất gy, kính bán kính r (tâm kính tính từ chân)
function loupeAt(c, x, gy, r, o = {}) {
  const rot = o.rot ?? -.06, hop = o.hop || 0, lx = x + Math.sin(rot) * LENS_UP * r, ly = gy - hop * r - Math.cos(rot) * LENS_UP * r;
  if (!o.noShadow) shadow(c, x + 6, gy + 2, r * 1.15, .18);
  loupe(c, lx, ly, r, { E: o.E, rot, pose: o.pose, yaw: o.yaw || 0 });
}

/* ================= KHU VƯỜN: móc (0–3,85 s) và gag (17,45–22 s), cùng một sân khấu ================= */
const CK = 108, ZK = 98, LR = 94, CX0 = 222, LX = 782;
const ZT = [TWIG.x1, TWIG.y1];
function gardenWorld(c, t, o = {}) {
  sky(c, t); hedge(c, t); grass(c, t);
  stemFlower(c, t, 40, GY + 6, 150, 26, C.pink, 1); stemFlower(c, t, 470, GY + 4, 92, 18, C.cream, 2); stemFlower(c, t, 1010, GY + 6, 170, 28, C.berry, 3);
  cushion(c, CUSH.x, CUSH.y, 1, o.squash || 0);
  dryLeaf(c, t, o.broken || 0);
  for (const [x, y, r, col] of [[110, 1390, 30, C.cream], [420, 1460, 26, C.pink], [700, 1380, 32, C.lemon], [930, 1470, 30, C.cream], [300, 1620, 34, C.berry], [820, 1640, 30, C.pink]]) daisy(c, x, y, r, col, col === C.lemon ? C.tang : C.lemon, t * .15 + x);
  twig(c);
  if (o.ls) { const L = o.ls; loupeAt(c, L.x, GY + 4, LR, L); }
  if (o.cs && !o.csFront) { shadow(c, o.cs.x + 10, GY + 4, 75, .16); drawCrumb(c, o.cs); }
  if (o.zs) { shadow(c, ZT[0] - 30, GY + 6, 60, .1); drawZip(c, o.zs, t); }
  if (o.cs && o.csFront) { shadow(c, o.cs.x + 10, GY + 4, 75, .16); drawCrumb(c, o.cs); }
  if (o.after) o.after(c);
}
/* ---------- móc ---------- */
const crumbX = t => CX0 + 30 * clamp(t, -2, HIT.crunch);
function crumbHook(t) {
  const fr = Math.min(t, HIT.crunch), wb = wob(t, HIT.crunch, 15, 3.2), cr = t >= HIT.crunch;
  const s = { x: crumbX(t), y: GY, k: CK, yaw: .9, tip: 1, ph: fr + .25, arms: ARMS.sign, sign: { mode: 'up', rot: -.06 + .05 * Math.sin(t * 3) + .22 * wb, stick: .42 }, lean: .14 * wb };
  if (cr) { s.one = 1 - W(t, HIT.wobble[1] - .1, HIT.wobble[1] + .3); s.tip = lerp(1, .5, W(t, HIT.wobble[1], HIT.wobble[1] + .3)); }
  const L2 = line('L02'), talking = t >= L2.t && t < L2.t + L2.dur + .1;
  s.E = cr && t < HIT.grin ? crumbE('worried', t, { look: [-.5, .2] }) : talking ? crumbE('confident', t, { look: [-.55, .1] }) : cr ? crumbE('silly', t, { look: [-.4, .1] }) : crumbE('confident', t, { look: [.7, -.45] });
  return s;
}
function zipHook(t) {
  return { x: ZT[0], y: ZT[1], k: ZK, yaw: 1.3, beat: .1, lift: 0, curl: .45 * wob(t, HIT.crunch + .1, 22, 5) + .04 * Math.sin(t * 1.7), lean: .015 * Math.sin(t * 1.3),
    E: zipE('happy', t, { look: [.75, -.1] }) };
}
const CLASP = { handL: [-.2, -.95, .45], handR: [.2, -.95, .45], elbowL: [-.52, -.85, .2], elbowR: [.52, -.85, .2] };   // hai tay chắp trước ngực: hồi hộp xem
function loupeHook(t) {
  const L1 = line('L01'), talk = talkAt(t), jolt = Math.sin(Math.PI * seg(t, HIT.crunch, HIT.crunch + .35));
  const name = jolt > .2 ? 'surprised' : talk ? (singExpr(t) || 'curious') : t > HIT.crunch + .3 ? 'confident' : 'curious';
  const lk = t > HIT.crunch + .3 ? [-.75, .1] : [-.2, .15];
  return { x: LX, hop: .12 * jolt, rot: -.06 + .02 * Math.sin(t * 2), pose: jolt > .2 ? ARM.up : CLASP,
    E: ex(BY.loupe, name, { talk, look: lk, blink: talk ? 0 : blinkAt(t) }) };
}
// (19/11/2026, chuẩn 11/2026b) 3 s đầu máy đặt cao: chữ móc ở trời (giữa phía trên khung), mặt Crumb, Zip, Miss Loupe ở y 1000–1350 dưới chữ;
// chữ móc rời đi thì máy hạ xuống ngang tầm Crumb (HIT.tilt) như bản cũ, để khoá kéo tách khung từ đúng bố cục cũ
const HOOKCAM = K([[-2, [520, 668, 1.04]], [0, [508, 672, 1.06]], [1.0, [496, 676, 1.09]], [HIT.crunch, [488, 680, 1.12]], [HIT.crunch + .25, [482, 684, 1.15]],
  [HIT.tilt[0], [484, 688, 1.14]], [HIT.tilt[1], [482, 998, 1.18]], [HIT.split[1] + .2, [486, 994, 1.17]]]);
function hookCam(t) {
  const [cx, cy, z] = HOOKCAM(t);
  const sh = decay(t, [HIT.crunch], 7);
  return { cx: cx + 9 * Math.sin(t * 47) * sh, cy: cy + 7 * Math.sin(t * 39) * sh, z };
}
const HOOK = hookStack([{ text: 'SNEAK', px: 210, fill: C.grape, shadow: C.lemon, t0: HIT.words[0] }, { text: 'UP?!', px: 196, fill: C.berry, shadow: INK, t0: HIT.words[1] }], 'mid');
const TITLE = HOOK.lines;
function sHook(c, t, o = {}) {
  look(c, hookCam(t), () => gardenWorld(c, t, { cs: crumbHook(t), zs: zipHook(t), ls: loupeHook(t), broken: seg(t, HIT.crunch, HIT.crunch + .55) }));
  const w = [HIT.crunch].reduce((a, h) => a + (t > h ? Math.sin((t - h) * 16) * Math.exp(-(t - h) * 5) * .05 : 0), 0);
  if (!o.noTitle && t < HIT.titleOut[1] + .05) hookTitle(c, HOOK.lines, t, { gone: ss(seg(t, HIT.titleOut[0], HIT.titleOut[1])), cy: HOOK.cy, wob: w });
}

/* ================= KHUNG CHIA ĐÔI (3,85–13,35 s) ================= */
// ---- trái: CRUMB SEES (qua vai Crumb, thấy lưng Zip; Miss Loupe ở xa, phía trước Zip) ----
const LV = { gy: 905, zip: [300, 700], zk: 126, crumb: [168, 1262], ck: 98, loupe: [446, 908], lr: 58 };
function zipBack(t) { return { x: LV.zip[0], y: LV.zip[1], k: LV.zk, yaw: 2.86 + .08 * Math.sin(t * 1.4), beat: .22, curl: .05 * Math.sin(t * 1.6), lean: .02 * Math.sin(t * 1.1), E: zipE('happy', t) }; }
function crumbView(c, t) {
  const z = 1 + .12 * ss(seg(t, HIT.split[0], HIT.snap)), px = 300, py = 720, dx = 30 * Math.sin(t * 1.15), dy = 16 * Math.sin(t * 1.7);
  c.save(); c.translate(px + dx, py + dy); c.scale(z, z); c.rotate(.025 * Math.sin(t * 1.15)); c.translate(-px, -py);
  const gy = LV.gy, x0 = PL.x0 - 220, x1 = PL.x1 + 220;
  sky(c, t, { x0, x1, gy, sun: [480, 420], sunR: 46, clouds: [[60, 330, .55, 11], [380, 560, .45, 7]] });
  hedge(c, t, gy, x0, x1, 120); grass(c, t, gy, x0, x1);
  stemFlower(c, t, 70, gy + 30, 110, 20, C.pink, 4); stemFlower(c, t, 500, gy + 40, 90, 18, C.cream, 5);
  // Miss Loupe ở xa, trước mặt Zip, nhìn về phía Crumb (về phía máy)
  const L3 = line('L03'), talk = talkAt(t), wave = t > HIT.split[1] && t < L3.t + L3.dur;
  loupeAt(c, LV.loupe[0], gy + 6, LV.lr, { rot: .05 * Math.sin(t * 2.2), hop: .05 * Math.abs(Math.sin(t * 4)) * (wave ? 1 : 0), pose: wave ? ARM.wave : ARM.point,
    E: ex(BY.loupe, talk ? 'explaining' : 'happy', { talk, look: [-.25, .1], blink: talk ? 0 : blinkAt(t, .3) }) });
  twig(c, { x0: LV.zip[0] - 22, y0: 1340, x1: LV.zip[0], y1: LV.zip[1] }, 22);
  const zs = zipBack(t); drawZip(c, zs, t);
  // hai vòm mắt sáng lên (L06): nhìn từ sau lưng vẫn thấy mắt bọc gần hết đầu
  const g = BAND(t, HIT.glow[0], HIT.glow[1], .3);
  if (g > 0) for (const sd of [-1, 1]) {
    const p = domeOf(zs, sd), pu = .5 + .5 * Math.sin(t * 9 + sd);
    for (const [m, a] of [[1.9, .16], [1.45, .22]]) circle(c, p[0], p[1], .36 * zs.k * m * (1 + .08 * pu), `rgba(183,240,74,${a * g})`);
    c.lineWidth = 6; c.strokeStyle = `rgba(255,255,255,${.75 * g})`; c.beginPath(); c.arc(p[0], p[1], .36 * zs.k * 1.12, -2.4 + sd * .3, -1.2 + sd * .3); c.stroke();
    star(c, p[0] + sd * 40 * zs.k / 100, p[1] - 50 * zs.k / 100, (10 + 8 * pu) * g, C.cream);
  }
  // Crumb qua vai: thấy lưng Crumb và mặt sau tấm biển ("hi!" nhỏ: chi tiết xem lại)
  const ph = t * .9, cs = { x: LV.crumb[0] + 6 * Math.sin(t * 2.2), y: LV.crumb[1], k: LV.ck, yaw: 2.78, tip: .5, ph, arms: ARMS.sign, sign: { mode: 'up', rot: -.12 + .04 * Math.sin(t * 2.7), face: -1, k: .62, stick: .45 }, E: crumbE('happy', t) };
  drawCrumb(c, cs);
  c.restore();
}
// ---- phải: ZIP SEES (mắt Zip mở; tầm nhìn nở rộng gần trọn vòng, mặt đất cong như nhìn qua mắt kép) ----
const RV = { cx: 830, gy: 1000, crumbB: -1.15, loupeB: .12, rolloB: 1.62 };
function zipGeo(t) {
  const w = ss(seg(t, HIT.wide[0], HIT.wide[1])), Rg = lerp(5200, 700, w), Lp = lerp(640, 120, w), gy = RV.gy + 10 * w, turn = .22 * w * Math.sin((t - HIT.wide[1]) * 2.1) + .08 * Math.sin(t * 3.1) * BAND(t, HIT.glow[0], HIT.glow[1], .3);   // đầu Zip lắc nhẹ: cả tầm nhìn trôi qua lại
  const P = (b, h = 0) => { const a = (b + turn) * Lp / Rg, R = Rg + h; return { x: RV.cx + R * Math.sin(a), y: gy + Rg - R * Math.cos(a), a }; };
  return { w, Rg, Lp, gy, P };
}
function crumbInView(t) {      // Crumb trong tầm nhìn của Zip: rón rén, đứng sững khi bị thấy, nấp sau biển, ló ra vẫy
  const sp = t >= HIT.spot, hid = W(t, HIT.hide[0], HIT.hide[1]) * (1 - W(t, HIT.peek, HIT.peek + .25)), pk = W(t, HIT.peek, HIT.peek + .25);
  const L5 = line('L05'), jolt = Math.sin(Math.PI * seg(t, HIT.spot, HIT.spot + .3));
  const s = { k: 88, yaw: .3, tip: sp ? (hid > .5 ? .35 : .15) : 1, ph: sp ? t * 2.4 : t * 1.05, lean: sp && pk < .5 ? .035 * Math.sin(t * 23) : 0, arms: hid > .5 ? ARMS.hide : pk > .5 ? ARMS.wave : ARMS.sign, hop: .12 * jolt,
    sign: hid > .5 ? { mode: 'hide', rot: .07 * Math.sin(t * 13), face: 1, k: .85 } : pk > .5 ? null : { mode: 'up', rot: .04 + .05 * Math.sin(t * 3), face: 1, k: .85, stick: .42 } };
  s.E = pk > .5 ? crumbE('silly', t, { look: [0, .1] }) : t >= L5.t - .1 && t < HIT.hide[0] ? crumbE('worried', t, { look: [0, .05] }) : sp ? crumbE('surprised', t, { look: [.1, 0] }) : crumbE('confident', t, { look: [.35, -.2] });
  if (hid > .5) { s.E = crumbE('worried', t, { look: [0, -.3] }); }
  if (pk > .5 && !s.sign) s.sign2 = true;
  return s;
}
function zipView(c, t) {
  const G = zipGeo(t), { P, Rg, gy, w } = G, O = [RV.cx, gy + Rg];
  // trời cong theo mặt đất
  c.fillStyle = D.sky0; c.fillRect(PR.x0 - 20, PR.y0 - 20, PR.x1 - PR.x0 + 40, PR.y1 - PR.y0 + 40);
  circle(c, O[0], O[1], Rg + 560, D.sky1); circle(c, O[0], O[1], Rg + 300, D.sky2);
  const sun = P(.75, 470); for (const [m, a] of [[1.9, .16], [1.45, .22]]) circle(c, sun.x, sun.y, 46 * m, `rgba(255,244,184,${a})`); circle(c, sun.x, sun.y, 46, D.sun);
  // hàng rào cây cong
  c.fillStyle = D.hedgeD; c.beginPath();
  for (let b = -3.3; b <= 3.3; b += .04) { const p = P(b, 120 + 22 * Math.sin(b * 23) + 14 * Math.sin(b * 7)); b === -3.3 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y); }
  c.arc(O[0], O[1], Rg, P(3.3).a - Math.PI / 2, P(-3.3).a - Math.PI / 2, true); c.closePath(); c.fill();
  c.fillStyle = D.hedge; c.beginPath();
  for (let b = -3.3; b <= 3.3; b += .04) { const p = P(b, 88 + 18 * Math.sin(b * 31 + 1) + 10 * Math.sin(b * 5)); b === -3.3 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y); }
  c.arc(O[0], O[1], Rg, P(3.3).a - Math.PI / 2, P(-3.3).a - Math.PI / 2, true); c.closePath(); c.fill();
  // mặt cỏ cong + sọc cắt cỏ cong (cho thấy tầm nhìn "uốn" quanh đầu Zip)
  circle(c, O[0], O[1], Rg + 4, D.grass);
  c.lineWidth = 30; c.strokeStyle = D.grassD; for (const d of [60, 150, 255]) { c.beginPath(); c.arc(O[0], O[1], Math.max(10, Rg - d), 0, TAU); c.stroke(); }
  // hoa theo hướng nhìn
  for (const [b, col, r] of [[-2.7, C.cream, 22], [-2.15, C.berry, 20], [-1.05, C.pink, 22], [-.42, C.cream, 18], [.36, C.lemon, 20], [1.0, C.pink, 22], [1.5, C.cream, 18], [2.45, C.berry, 22], [2.95, C.cream, 20]]) {
    const p = P(b, 0); c.save(); c.translate(p.x, p.y); c.rotate(p.a);
    stemFlower(c, t, 0, 6, 70 + 30 * Math.abs(Math.sin(b * 3)), r, col, b * 3); c.restore();
  }
  // Mr. Rollo lăn viên tròn ở rìa phải: chỉ trong tầm nhìn của Zip mới thấy (trứng phục sinh)
  if (w > .3) { const p = P(RV.rolloB + .03 * Math.sin(t * .8), 0); c.save(); c.translate(p.x, p.y); c.rotate(p.a * .7);
    circle(c, 34, -24, 25, INK); circle(c, 34, -24, 21, '#8B5A2B'); circle(c, 28, -30, 6, '#A87240');
    drawChar(c, BY.rollo, { x: -8, y: 0, k: 30, yaw: 1.2, showFx: false, expr: ex(BY.rollo, 'happy') }); c.restore(); }
  // Miss Loupe ở ngay trước mặt Zip (hướng 0), nhìn vào mắt Zip (về phía máy)
  { const p = P(RV.loupeB, 0), talk = talkAt(t), L6 = line('L06'), lk = t > HIT.spot && t < L6.t ? [-.55, .15] : [0, .1];
    c.save(); c.translate(p.x, p.y); c.rotate(p.a);
    loupeAt(c, 0, 4, 66, { rot: -.06 * Math.sin(t * 2.3), hop: .09 * Math.abs(Math.sin(t * 3.5)), pose: talk ? ARM.wave : t > HIT.spot && t < L6.t ? ARM.point : ARM.shrug,
      E: ex(BY.loupe, talk ? 'explaining' : t > HIT.spot ? 'laugh' : 'happy', { talk, look: lk, blink: talk ? 0 : blinkAt(t, .1) }) });
    c.restore(); }
  // Crumb ở phía sau Zip: trượt vào tầm nhìn khi tầm nhìn nở rộng
  const cp = P(RV.crumbB, 0), cs = crumbInView(t), rot = cp.a * .5;
  if (w > .05) {
    c.save(); c.translate(cp.x, cp.y); c.rotate(rot);
    shadow(c, 8, 4, 60, .18); cs.x = 0; cs.y = 0; drawCrumb(c, cs);
    if (cs.sign2) booSign(c, -.95 * cs.k, -.1 * cs.k, cs.k * .7, -.45, 1, { stick: .4 * cs.k });   // biển dựa bên cạnh khi Crumb ló ra vẫy
    c.restore();
  }
  // vệt sáng chạy quanh tầm nhìn từ phía trước ra hai bên tới tận phía sau (L06)
  const sw = ss(seg(t, HIT.sweep[0], HIT.sweep[1])), sf = 1 - ss(seg(t, HIT.sweep[1] + .4, HIT.snap));
  if (sw > 0 && sf > 0) for (const sd of [-1, 1]) {
    const end = sd * (Math.PI - .3) * sw, pts = []; for (let i = 0; i <= 40; i++) pts.push(P(end * i / 40, 64));
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (const [lw, col] of [[56, `rgba(183,240,74,${.4 * sf})`], [30, `rgba(183,240,74,${.75 * sf})`], [12, `rgba(255,255,230,${.95 * sf})`]]) { c.lineWidth = lw; c.strokeStyle = col; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)); c.stroke(); }
    const tp = pts.at(-1); star(c, tp.x, tp.y - 6, 30 * sf, C.cream);
  }
  return { cp, cs, rot };
}
const crumbSpot = (t, R) => { const h = 1.35 * R.cs.k; return [R.cp.x + h * Math.sin(R.rot), R.cp.y - h * Math.cos(R.rot)]; };
// (19/11/2026, chuẩn 11/2026b: mỗi 2–4 s một thay đổi có mục đích; bản cũ chia đôi đứng yên 9 s) máy của khung chia đôi: đẩy nhẹ, ngẩng lên
// lưng Zip (CRUMB SEES; đẩy thẳng giữa khung: lệch trái thì mặt Miss Loupe ở khung phải lọt vào cột nút phải) → lia sang nửa phải khi mắt Zip
// mở (ZIP SEES) → nhích vào lúc Crumb bị thấy, nấp sau biển → lùi ra cả hai khung ở điệp khúc (hai vòm mắt sáng), đứng đó tới cú chụp
// (kính chụp đúng chỗ khung phải). z không dưới 1: không lộ mép nền.
const SPLITCAM = K([[HIT.split[1], [540, 960, 1]], [HIT.split[1] + .3, [540, 960, 1]], [HIT.split[1] + .85, [540, 924, 1.06]], [HIT.open[0] - .15, [540, 926, 1.06]],
  [HIT.open[0] + .45, [690, 905, 1.08]], [HIT.spot - .05, [698, 910, 1.09]], [HIT.spot + .3, [700, 915, 1.13]], [HIT.hide[0], [700, 930, 1.13]],
  [HIT.hide[1] + .2, [690, 950, 1.17]], [HIT.glow[0], [684, 952, 1.16]], [HIT.glow[0] + .6, [540, 960, 1.0]], [HIT.snap, [540, 960, 1.0]]]);
function splitCam(t) {
  const [cx, cy, z] = SPLITCAM(t), sh = decay(t, [HIT.spot], 9) + .6 * decay(t, [HIT.hide[0] + .1], 10);
  return { cx: cx + 7 * Math.sin(t * 45) * sh, cy: cy + 6 * Math.sin(t * 38) * sh, z };
}
function sSplit(c, t, o = {}) {
  if (o.intro) return splitBody(c, t, o);
  look(c, splitCam(t), () => splitBody(c, t, o));
}
function splitBody(c, t, o = {}) {
  splitBg(c, t);
  // trái
  c.save(); panelPath(c, PL); c.clip(); crumbView(c, t);
  const dimL = .32 * BAND(t, HIT.open[0], HIT.glow[0], .3); if (dimL > 0) { c.fillStyle = `rgba(30,27,58,${dimL})`; c.fillRect(PL.x0, PL.y0, PL.x1 - PL.x0, PL.y1 - PL.y0); }
  c.restore();
  panelFrame(c, PL, D.crumbRim, D.crumbRimD, .7 * BAND(t, HIT.split[1], HIT.open[0], .3));
  // phải
  c.save(); panelPath(c, PR); c.clip(); const R = zipView(c, t);
  // viền trong xanh cốm: nhìn qua mắt Zip
  c.lineWidth = 60; c.strokeStyle = 'rgba(183,240,74,.22)'; panelPath(c, PR, 8, 40); c.stroke();
  eyelids(c, PR, ss(seg(t, HIT.open[0], HIT.open[1])), t);
  const fl = 1 - seg(t, HIT.snap, HIT.snap + .3); if (t >= HIT.snap && fl > 0) { c.fillStyle = `rgba(255,255,255,${.85 * fl})`; c.fillRect(PR.x0, PR.y0, PR.x1 - PR.x0, PR.y1 - PR.y0); }
  c.restore();
  panelFrame(c, PR, D.zipRim, D.zipRimD, .8 * BAND(t, HIT.open[0], HIT.wide[1] + .4, .3) + .9 * BAND(t, HIT.sweep[0], HIT.sweep[1] + .4, .3));
  // vòng "bị thấy rồi!" và "!" quanh Crumb trong tầm nhìn của Zip
  if (t >= HIT.spot) { const [sx, sy] = crumbSpot(t, R); c.save(); panelPath(c, PR); c.clip(); spotRing(c, sx, sy, 125, t, HIT.spot); c.restore(); bang(c, sx + 40, sy - 345 + 10 * Math.sin(t * 6), t, HIT.spot); }
  // khoá kéo ở đường chia (đã kéo hết, con chạy ở đáy)
  if (!o.intro) zipper(c, 540, PL.y0 + 10, PL.y1 - 46, t);
  // nhãn
  if (!o.intro) { tag(c, 'CRUMB SEES', 276, 268, t, HIT.split[1], C.honey); tag(c, 'ZIP SEES', 804, 268, t, HIT.split[1] + .12, C.lime); }
  // chụp: tia sáng quanh khung phải
  const a = 1 - seg(t, HIT.snap, HIT.snap + .3);
  if (t >= HIT.snap && a > 0) { c.strokeStyle = C.lemon; c.lineCap = 'round'; c.lineWidth = 10 * a; const [cx, cy] = pc(PR);
    for (let i = 0; i < 10; i++) { const g = i / 10 * TAU, r0 = 330, r1 = 330 + 160 * (1 - a); c.beginPath(); c.moveTo(cx + Math.cos(g) * r0 * .8, cy + Math.sin(g) * r0 * 1.4); c.lineTo(cx + Math.cos(g) * r1 * .8, cy + Math.sin(g) * r1 * 1.4); c.stroke(); } }
}
// khoá kéo tách khung: con chạy đi từ trên xuống, phía trên con chạy là khung chia đôi, phía dưới vẫn là khu vườn
function sZip(c, t) {
  sHook(c, t, { noTitle: true });
  const u = ss(seg(t, HIT.split[0], HIT.split[1])), y = lerp(110, PL.y1 - 46, u);
  c.save(); c.beginPath(); c.rect(-10, -10, 1100, y - 6);
  // khe chữ V mở rộng dần phía trên con chạy
  c.moveTo(540 - 6, y - 6); c.lineTo(540 - 90, y - 6); c.lineTo(540, y + 30); c.lineTo(540 + 90, y - 6); c.closePath();
  c.clip(); sSplit(c, t, { intro: true }); c.restore();
  zipper(c, 540, 110, y, t);
}

/* ================= SỔ (13,65–17,0 s) ================= */
const SLOT = { x: 280, y: 480, r: 140 }, PAGE = { x: 84, y: 200, w: 890, h: 650 }, DIVE = { x: 610, y: 735 }, MINI = { x: 860, y: 745, r: 76 }, AL = { x: 250, y: 1385, k: 232 };
function stickerArt(cc) {   // Zip nhìn thẳng, mắt to sáng, một vòng sáng xanh cốm chạy quanh (gần trọn vòng)
  cc.lineWidth = 12; cc.strokeStyle = 'rgba(183,240,74,.9)'; cc.lineCap = 'round'; cc.beginPath(); cc.arc(0, 8, 78, -1.35, 4.5); cc.stroke();
  drawChar(cc, BY.zip, { x: 0, y: 52, k: 64, yaw: 0, showFx: false, expr: ex(BY.zip, 'excited', { look: [0, 0] }), pose: { beat: 0 } });
}
function miniArt(cc) { drawChar(cc, BY.zip, { x: 0, y: 34, k: 44, yaw: .4, showFx: false, expr: ex(BY.zip, 'laugh') }); }
function albumZip(t) {
  if (t < HIT.zipIn[0] || t >= HIT.dive[1]) return null;
  if (t < HIT.zipIn[1]) { const u = ss(seg(t, HIT.zipIn[0], HIT.zipIn[1])), p = arc([1300, 980], [660, 1060], u, 180); return { x: p[0], y: p[1], k: 82, yaw: -1.25, rot: 0 }; }
  if (t < HIT.dive[0]) return { x: 660 + 34 * Math.sin((t - HIT.zipIn[1]) * 3), y: 1060 + 20 * Math.sin((t - HIT.zipIn[1]) * 5), k: 82, yaw: -.5 + .35 * Math.sin(t * 2), rot: 0 };
  const u = seg(t, HIT.dive[0], HIT.dive[1]), p = arc([660, 1060], [DIVE.x, DIVE.y + 30], u, 300); return { x: p[0], y: p[1], k: lerp(82, 30, ei(u)), yaw: -.4, rot: -1.0 * ei(u) };
}
function sAlbum(c, t) {
  const push = 1 + .05 * Math.sin(Math.PI * seg(t, HIT.gulp - .05, HIT.gulp + .6));
  c.save(); c.translate(540, 700); c.scale(push, push); c.translate(-540, -700);
  ground(c, '#FFE2B6'); ell(c, 200, 1760, 900, 420, 0, D.grassL); ell(c, 540, 1730, 980, 330, 0, D.grass); ell(c, 540, 1770, 900, 280, 0, D.grassD);
  for (let i = 0; i < 9; i++) daisy(c, 60 + i * 125, 1600 + 40 * Math.sin(i * 2.3), 22, i % 2 ? C.pink : C.cream, C.lemon, t * .3 + i);
  rrect(c, PAGE.x + 12, PAGE.y + 18, PAGE.w, PAGE.h, 54, C.grape); rrect(c, PAGE.x, PAGE.y, PAGE.w, PAGE.h, 54, C.cream);
  const t0 = HIT.stamp;
  circle(c, SLOT.x, SLOT.y, 142, '#EBDDBC');
  if (t >= HIT.zoomOut[0]) {
    const p = t >= t0 ? back(seg(t, t0, t0 + .22), 2.6) : 1;
    badge(c, SLOT.x, SLOT.y, SLOT.r, '#FFD48A', cc => { const k = SLOT.r / 100; cc.scale(k, k); stickerArt(cc); }, -.05, t >= t0 ? lerp(1.2, 1, p) : 1);
    popText(c, 'No', 470, 420, 110, C.berry, null, t, t0 + .1, { align: 'left', step: .02 });
    popText(c, 'sneaking!', 470, 530, 96, C.berry, null, t, t0 + .14, { align: 'left', step: .02 });
    popText(c, 'sees almost all around', 470, 615, 44, INK, null, t, t0 + .24, { align: 'left', step: .012, font: subFont });
  }
  const rq = seg(t, HIT.gulp, HIT.gulp + .8);
  if (rq > 0 && rq < 1) for (let k = 0; k < 3; k++) { const q = clamp(rq * 1.4 - k * .2); if (q > 0 && q < 1) { c.strokeStyle = `rgba(183,240,74,${.9 * (1 - q)})`; c.lineWidth = 12 * (1 - q) + 2; c.beginPath(); c.ellipse(DIVE.x, DIVE.y, 60 + 260 * q, 26 + 90 * q, 0, 0, TAU); c.stroke(); } }
  if (t >= HIT.mini) badge(c, MINI.x, MINI.y, MINI.r, D.sky2, miniArt, .06, back(seg(t, HIT.mini, HIT.mini + .3), 2.6));
  const talk = talkAt(t, 'albie'), b = albumZip(t);
  shadow(c, AL.x + 18, AL.y + 4, 220, .18);
  albumGulp(c, t, { x: AL.x, y: AL.y, k: AL.k, talk, line: line('L07'), counts: HIT.counts, tg: HIT.gulp, look: b ? [.75, -.4] : [.5, -.7], blink: talk ? 0 : blinkAt(t, .4) });
  if (b) {
    c.save(); c.translate(b.x, b.y - b.k * .7); c.rotate(b.rot); c.translate(-b.x, -(b.y - b.k * .7));
    const cnt = Math.min(1, pulse(t, HIT.counts, .05, .12));
    drawZip(c, { x: b.x, y: b.y, k: b.k, yaw: b.yaw, fly: 1, lift: .25 + .15 * cnt, beat: 1, curl: .15 * cnt, E: zipE(t > HIT.dive[0] ? 'excited' : 'laugh', t, { look: [-.6, .2] }) }, t);
    c.restore();
  }
  c.restore();
}

/* ================= GAG (17,45–22 s): Zip quay lại trước; Crumb tự giật mình; câu hỏi; vòng lặp ================= */
// đường bay của tấm biển (toạ độ cảnh): rời tay lúc nhảy, xoay vèo (lộ mặt sau "hi!"), đáp lên đầu Crumb như chiếc mũ
function signFly(t, head) {
  const u = seg(t, HIT.jump, HIT.hat), p0 = [300, 760], p1 = [head[0] + 6, head[1] - 4];
  const p = arc(p0, p1, ei(u) * .5 + u * .5, 360), spin = u * Math.PI * 3.0;
  return { x: p[0], y: p[1], rot: -.2 + 1.3 * Math.sin(u * Math.PI) - .08, face: Math.cos(spin) };
}
function crumbGag(t) {
  const L8 = line('L08'), talk8 = t >= L8.t && t < L8.t + L8.dur + .1;
  // rón rén lần nữa, hít hơi
  if (t < HIT.jump) {
    const u = seg(t, HIT.sneak2[0], HIT.sneak2[1]), inh = W(t, HIT.inhale, HIT.inhale + .2);
    return { x: lerp(250, 300, u), y: GY, k: CK, yaw: .9, tip: 1 - .5 * inh, ph: (t - HIT.sneak2[0]) * 1.4 + .25, arms: mixArms(ARMS.sign, ARMS.signHi, inh), hop: .06 * inh, bodyLean: -.05 * inh,
      sign: { mode: 'up', rot: -.08 + .05 * Math.sin(t * 3) - .1 * inh, stick: lerp(.42, .7, inh) }, E: t > HIT.turn[0] + .1 ? crumbE('surprised', t, { look: [.6, -.3] }) : inh > .2 ? crumbE('excited', t, { look: [.6, -.4], mouth: 'o' }) : crumbE('confident', t, { look: [.7, -.45] }) };
  }
  // nhảy bật ra sau, rồi ngã ngồi lên đệm cỏ
  if (t < HIT.land) {
    const u = seg(t, HIT.jump, HIT.land), p = arc([300, GY], [CUSH.x + 20, GY - 40], ss(u), 260);
    return { x: p[0], y: p[1], k: CK, yaw: .7, tip: 0, arms: ARMS.up, hop: 0, lean: -.35 * Math.sin(Math.PI * u), sit: ss(seg(u, .5, 1)), E: crumbE('shout', t, { look: [.5, -.2] }) };
  }
  // ngồi trên đệm, biển đội đầu; cười ngượng nói câu gag; đứng dậy; nối về móc
  const sitY = GY - 40 + 40 * W(t, HIT.getUp[0], HIT.getUp[1]), b = Math.sin(Math.PI * seg(t, HIT.land, HIT.land + .3));
  const up = W(t, HIT.getUp[0], HIT.getUp[1]);
  const s = { x: CUSH.x + 20 + 10 * up, y: sitY + 14 * b, k: CK, yaw: lerp(.5, .9, up), tip: 0, sit: 1 - up, arms: t < HIT.hat - .05 ? ARMS.shrug : up > .4 ? mixArms(ARMS.hat, ARMS.sign, W(t, HIT.getUp[1] - .1, HIT.getUp[1] + .25)) : ARMS.hat,
    E: talk8 ? crumbE('laugh', t, { look: [.3, .1] }) : t < HIT.hat + .3 ? crumbE('surprised', t, { look: [0, -.6] }) : up > .3 ? crumbE('confident', t, { look: [.7, -.45] }) : crumbE('silly', t, { look: [.2, 0] }) };
  if (talk8) s.E = crumbE('happy', t, { look: [.25, .05] });
  if (CH('L09')(t) && up > .5) { const ph = (t - line('L09').t) * 132 / 60; s.hop = .05 * Math.abs(Math.sin(Math.PI * ph)); s.E = crumbE('excited', t, { look: [.6, -.5] }); }   // (11/2026b) điệp khúc 2: Crumb nhún theo phách, ngước nhìn mắt Zip sáng
  const k = W(t, HIT.loop[0] - .2, HIT.loop[0] + .3);
  if (k > 0) { const h = crumbHook(t - DUR); s.x = lerp(s.x, h.x, k); s.y = lerp(s.y, h.y, k); s.yaw = lerp(s.yaw, h.yaw, k); s.tip = h.tip * k; s.ph = h.ph; s.arms = mixArms(s.arms, h.arms, k); s.sit = (s.sit || 0) * (1 - k); if (k > .5) s.E = h.E; }
  return s;
}
function zipGag(t) {
  if (t >= HIT.turnBack[1] + .05) return zipHook(t - DUR);
  const tu = W(t, HIT.turn[0], HIT.turn[1]), tb = W(t, HIT.turnBack[0], HIT.turnBack[1]), hop = Math.sin(Math.PI * seg(t, HIT.turn[0], HIT.turn[1] + .1));
  const L8 = line('L08'), ch2 = BAND(t, HIT.glow2[0] - .2, HIT.glow2[1], .3), laugh = t > L8.t - .2 && t < HIT.turnBack[0] && ch2 < .5;
  const yaw = tb > 0 ? lerp(-1.3 + .9 * ch2, 1.3, tb) : lerp(1.3, -1.3 + .9 * ch2, tu);       // điệp khúc 2: Zip quay mặt ra phía máy, đôi mắt sáng
  return { x: ZT[0], y: ZT[1], k: ZK, yaw, beat: hop > .1 || laugh || ch2 > .1 ? .9 : .1, lift: .18 * hop + .1 * Math.sin(Math.PI * tb) + .12 * ch2, lean: -.08 * tu * (1 - tb) + .03 * Math.sin(t * 3) * (laugh ? 1 : 0), curl: laugh ? .15 * Math.sin(t * 12) : 0,
    E: ch2 > .5 ? zipE('excited', t, { look: [-.2, .1] }) : laugh ? zipE('laugh', t) : tu > .5 && tb < .5 ? zipE('excited', t, { look: [-.6, .15] }) : zipE('happy', t, { look: [.75, -.1] }) };
}
function loupeGag(t) {
  const talk = talkAt(t), L9 = line('L09'), jolt = Math.sin(Math.PI * seg(t, HIT.jump, HIT.jump + .35)), laugh = t > HIT.hat && t < L9.t - .1;
  const k = W(t, HIT.loop[0], DUR - .15), ch2 = CH('L09')(t), ph = (t - L9.t) * 132 / 60;
  const name = jolt > .2 ? 'surprised' : talk ? (singExpr(t) || 'explaining') : laugh ? 'laugh' : ch2 ? 'excited' : 'happy';
  const o = { x: LX, hop: .12 * jolt + (laugh ? .04 * Math.abs(Math.sin(t * 9)) : 0) + (ch2 ? .07 * Math.abs(Math.sin(Math.PI * ph)) : 0), rot: -.06 + .03 * Math.sin(t * 2) + (ch2 ? .06 * Math.sin(Math.PI * ph) : 0),
    pose: ch2 ? (Math.floor(ph) % 2 ? ARM.wave : ARM.up) : talk ? ARM.up : jolt > .2 ? ARM.up : ARM.shrug,
    E: ex(BY.loupe, name, { talk, look: ch2 ? [-.35, -.2] : talk ? [-.2, .15] : [-.75, .15], blink: talk ? 0 : blinkAt(t) }) };
  if (k > 0) { const h = loupeHook(t - DUR); o.rot = lerp(o.rot, h.rot, k); o.hop *= 1 - k; if (k > .5) { o.pose = h.pose; o.E = talk ? ex(BY.loupe, 'happy', { talk, look: [-.2, .15], blink: 0 }) : h.E; } }   // câu hỏi kết còn đang nói khi máy về khung 0
  return o;
}
function gagCam(t) {
  const d = seg(t, HIT.flip[1], DUR), toC = W(t, HIT.inhale - .3, HIT.jump) * (1 - W(t, HIT.hat + .3, HIT.hat + 1.0));
  const L10 = line('L10'), wide = W(t, HIT.glow2[0] - .2, HIT.glow2[0] + .4) * (1 - W(t, L10.t - .25, L10.t + .3)), push = W(t, L10.t - .25, L10.t + .3);
  const cx = 486 - 22 * toC + 10 * Math.sin(d * 3) + 40 * wide + 10 * push, cy = 1000 - 22 * toC - 60 * wide - 10 * push, z = 1.15 + .08 * toC - .1 * wide + .05 * push;
  const sh = decay(t, [HIT.jump], 9) + .8 * decay(t, [HIT.land], 10);
  const k = W(t, HIT.loop[0], DUR - .25), h = hookCam(t - DUR);
  return { cx: lerp(cx, h.cx, k) + 8 * Math.sin(t * 47) * sh, cy: lerp(cy, h.cy, k) + 7 * Math.sin(t * 41) * sh, z: lerp(z, h.z, k) };
}
function sGag(c, t) {
  const cs = crumbGag(t), zs = zipGag(t), ls = loupeGag(t), fly = t >= HIT.jump && t < HIT.hat;
  if (fly) cs.sign = null;
  else if (t >= HIT.hat) { const up = W(t, HIT.getUp[0] + .2, HIT.getUp[1] + .1); cs.sign = up < .5 ? null : { mode: 'up', rot: -.1 + .05 * Math.sin(t * 3), face: 1, stick: .42 }; }
  const head = rigPt(cs.x, cs.y, cs.k, cs.yaw, cs.lean || 0, [0, -2.15 - crumbLift(cs), 0]);
  look(c, gagCam(t), () => gardenWorld(c, t, { cs, zs, ls, broken: 1, squash: Math.sin(Math.PI * seg(t, HIT.land, HIT.land + .3)), csFront: true,
    after: cc => {
      if (fly) { const s = signFly(t, head); booSign(cc, s.x, s.y, CK, s.rot, s.face); }
      if (t >= HIT.hat && W(t, HIT.getUp[0] + .2, HIT.getUp[1] + .1) < .5) {   // biển đội đầu như mũ: que chỉ lên trời
        const b = Math.sin(Math.PI * seg(t, HIT.hat, HIT.hat + .25));
        booSign(cc, head[0] + 8, head[1] - .45 * CK - 10 * b, CK * .9, .18 + .1 * wob(t, HIT.hat, 12, 4), -1, { hat: true });
      }
      // (11/2026b) điệp khúc 2: hai vòm mắt Zip sáng lên lần nữa, vòng sáng chạy từ phía trước vòng ra hai bên, chừa một khe phía sau ("almost")
      const g = BAND(t, HIT.glow2[0], HIT.glow2[1], .3);
      if (g > 0) {
        for (const sd of [-1, 1]) { const p = domeOf(zs, sd), pu = .5 + .5 * Math.sin(t * 9 + sd); for (const [m, a] of [[1.9, .16], [1.45, .24]]) circle(cc, p[0], p[1], .36 * zs.k * m * (1 + .08 * pu), `rgba(183,240,74,${a * g})`); }
        const u = ss(seg(t, HIT.ring2[0], HIT.ring2[1])), f = 1 - ss(seg(t, HIT.ring2[1] + .05, HIT.glow2[1])), o0 = domeOf(zs, 0), R = 300;
        if (u > 0 && f > 0) for (const sd of [-1, 1]) {
          const pts = []; for (let i = 0; i <= 40; i++) { const a = Math.PI + sd * (Math.PI - .38) * u * i / 40; pts.push([o0[0] + R * Math.cos(a), o0[1] + .62 * R * Math.sin(a)]); }
          cc.lineCap = 'round'; cc.lineJoin = 'round';
          for (const [lw, col] of [[46, `rgba(183,240,74,${.38 * f})`], [24, `rgba(183,240,74,${.75 * f})`], [10, `rgba(255,255,230,${.95 * f})`]]) { cc.lineWidth = lw; cc.strokeStyle = col; cc.beginPath(); pts.forEach((p, i) => i ? cc.lineTo(p[0], p[1]) : cc.moveTo(p[0], p[1])); cc.stroke(); }
          const tp = pts.at(-1); star(cc, tp[0], tp[1] - 6, 26 * f, C.cream);
        }
      }
      // sao nhỏ và nốt nhạc vui quanh đầu khi ngã (không đau: Crumb cười ngay)
      const st = seg(t, HIT.land, HIT.land + .9);
      if (st > 0 && st < 1) for (let i = 0; i < 3; i++) { const a = t * 5 + i * TAU / 3; star(cc, head[0] + Math.cos(a) * 80, head[1] - 60 + Math.sin(a) * 24, 14 * (1 - st), C.lemon); }
    } }));
  // chữ "BOO?" bật ra khi Zip quay lại (chính Crumb giật mình)
  if (t > HIT.jump - .02 && t < HIT.jump + 1.85) {
    const pu = 1 + .14 * Math.sin(Math.PI * seg(t, HIT.jump, HIT.jump + .25));
    c.save(); c.translate(700, 330); c.scale(pu, pu); c.rotate(.05 * Math.sin((t - HIT.jump) * 25) * Math.exp(-(t - HIT.jump) * 3)); c.translate(-700, -330);
    popText(c, 'EEK!', 700, 380, 170, C.lemon, INK, t, HIT.jump, { step: .03, sh: 12 }); c.restore();
  }
}

/* ---------- chuyển cảnh ---------- */
const LENS_SNAP = { x: 804, y: 760, r: 255 };
function matchCut(c, t) {
  stickerMatchCut(c, t, { t0: HIT.zoomIn[0], t1: HIT.zoomOut[0], t2: HIT.zoomOut[1], lens: LENS_SNAP, from: cc => sSplit(cc, HIT.zoomIn[0]), to: (cc, tt) => sAlbum(cc, tt), slot: SLOT, fill: '#FFD48A', rim: D.zipRim, draw: cc => { cc.scale(SLOT.r / 100, SLOT.r / 100); stickerArt(cc); } });
}
function recallTitle(c, t) { hookTitle(c, HOOK.lines, -1, { gone: 1 - back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: HOOK.cy }); }
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
  else if (t >= HIT.split[1]) sSplit(c, t);
  else if (t >= HIT.split[0]) sZip(c, t);
  else sHook(c, t);
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t, 510, SAFE.subY);   // (11/2026b) tấm ≤ 7 từ, từ nhấn (subtitleEm), dưới hai khung chia đôi (đáy khung 1290 px)
  c.restore();
}

/* ---------- cho ảnh bìa (poster.js) và bảng nhân vật (sheets.js) ---------- */
export function hookWorld(c, t) { gardenWorld(c, t, { cs: crumbHook(t), zs: zipHook(t), ls: loupeHook(t), broken: seg(t, HIT.crunch, HIT.crunch + .55) }); }
export function splitAt(c, t) { sSplit(c, t); }
export { TITLE, HOOK, crumbAt, drawCrumb, drawZip, ARMS };
