// SHORT-014 · Hearing With Your Tummy?! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp: Hop vọt khỏi khung rồi rơi về đúng chỗ cũ,
// Crumb chạy lại áp tai vào bụng Hop như khung đầu.
// Bản B theo lượt nâng cấp 11/2026 (PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §4): kính lớn có máy trôi, bí mật xảy ra thành chuyển động
// (màng nhĩ bên bụng gợn theo từng vòng sóng âm), câu cửa miệng có hành động (albumGulp), người nói có trên hình, phụ đề ở vùng an toàn.
// Nhân vật phong cách v2 "Kẹo Phẳng Viền" (LOOK.v = 2). Hop: _shared/characters/cast/hop.js; màng nhĩ vẽ to qua drawChar extra (props.js).
import { LOOK } from '/_shared/characters/look.js';
import { C, REC, circle, ell, rrect, ground, popText, subFont, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { makeTalk, blinkAt, ex, rigPt, look, toScreen, loupe, ARM, badge, shadow, subtitle, LENS_UP, hookTitle, stickerMatchCut, snapFlash, SAFE, albumGulp } from '/_shared/episode.js';
import { D, GY, sky, stone, foreground, seeds, cookie, drumExtra, soundRings, rumbleWaves, puff, arrive } from './props.js';
import { LINES, CARDS, DUR, HIT } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';
LOOK.v = 2;   // phong cách nhân vật v2 "Kẹo Phẳng Viền" cho tập mới (CHARACTER-BIBLE §7, §10)
LOOK.cheer = true;   // (11/2026) mặt nhân vật luôn vui tươi (QUALITY.md §5, stage.js cheerExpr)

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const decay = (t, list, k = 6) => list.reduce((s, h) => s + (t >= h ? Math.exp(-(t - h) * k) : 0), 0);
const arc = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];
const line = id => LINES.find(l => l.id === id);
const frac = x => x - Math.floor(x);
const L01 = line('L01'), L05 = line('L05'), L06 = line('L06'), L08 = line('L08'), L09 = line('L09');

/* ================= nhân vật: chỗ đứng (toạ độ cảnh) ================= */
const HP = { x: 490, k: 130, yaw: -.9 };                       // Hop quay sang trái, bên bụng phải (có màng nhĩ) hướng về máy
const CKX = 778;                                                // vụn bánh của Crumb (có từ khung 0)
const LS = { x: 255, r: 85 };                                   // Miss Loupe cỡ trung, đứng bên trái
const CR = { k: 76, press: { x: 633, y: GY + 14, yaw: -.55, lean: -.32 }, stand: { x: 690, y: GY + 16 }, hello: { x: 690, y: GY + 16 } };
const APEX = [HP.x - 330, GY - 1150];                           // đỉnh cú vọt (ngoài khung)
const lsLens = () => [LS.x, GY - LENS_UP * LS.r];

// vị trí màng nhĩ bên phải (rig): đúng chỗ decal của drumExtra trên elip bụng
function drumRig(P) {
  const L = P.lift || 0, cr = P.crouch || 0, AC = [0, -.8 - L + cr * .16, -.42], AR = [.36, .36, .8], n = Math.hypot(.95, .05, .42), d = [.95 / n, -.05 / n, .42 / n];
  const tt = 1 / Math.hypot(d[0] / AR[0], d[1] / AR[1], d[2] / AR[2]); return [AC[0] + d[0] * tt, AC[1] + d[1] * tt, AC[2] + d[2] * tt];
}
const drumAt = s => rigPt(s.x, s.y, HP.k, s.yaw, s.lean || 0, drumRig(s.P));
const crumbMouth = s => rigPt(s.x, s.y, CR.k, s.yaw, s.lean || 0, [0, -1.4 - (s.lift || 0), .55]);
const crumbBelly = s => rigPt(s.x, s.y, CR.k, s.yaw, s.lean || 0, [0, -.55 - (s.lift || 0), -.5]);

/* ---------- Hop ---------- */
const hopE = (name, t, o = {}) => ex(BY.hop, name, { blink: blinkAt(t, .6), ...o });
// cú đáp về chỗ cũ: u = giây sau khi chạm đá (âm = đang rơi). Dùng ở cuối phim và đầu phim (u nối qua khung nối).
function hopLanding(u, s) {
  if (u < 0) {
    const v = clamp(1 + u / (HIT.fall[1] - HIT.fall[0])), e = v * v;                 // rơi nhanh dần
    s.x = lerp(APEX[0], HP.x, e); s.y = lerp(APEX[1], GY, e); s.P.lift = .3 * (1 - v); s.P.wingOpen = .5 * (1 - v); s.lean = -.25 * (1 - v);
    s.E = hopE('excited', 0, { look: [.2, .6] }); return s;
  }
  s.P.crouch = .75 * Math.exp(-u * 7) * Math.cos(u * 14) * (u < .45 ? 1 : 0);
  return s;
}
function hopBase(t) {
  const s = { x: HP.x, y: GY, yaw: HP.yaw, lean: 0, P: { ant: Math.sin(t * 4) * .3 }, E: null, drum: { glow: 0, ripples: [], vib: 0 } };
  if (t >= HIT.fall[0] - .01) return hopLanding(t - HIT.fall[1], s);
  if (t < .6) hopLanding(t + DUR - HIT.fall[1], s);
  return s;
}
function hopHook(t) {
  const s = hopBase(t);
  if (s.E) return s;
  const jig = seg(t, HIT.jiggle[0], HIT.jiggle[1]), jj = Math.sin(Math.PI * jig);
  s.lean = .06 * Math.sin(t * 38) * jj; s.P.lift = (s.P.lift || 0) + .12 * Math.sin(Math.PI * seg(t, HIT.jiggle[0] + .08, HIT.jiggle[0] + .36));
  s.P.ant = jj > 0 ? 2 * Math.sin(t * 20) : s.P.ant;
  const tk = talkAt(t, 'crumb');
  // giọng Crumb sát bụng: màng nhĩ sáng theo giọng, gợn đều
  if (t < L01.t + L01.dur + .3) { const g = clamp((t - L01.t) / .2) * (1 - seg(t, L01.t + L01.dur, L01.t + L01.dur + .3)); s.drum = { glow: .35 * g + .5 * tk, ripples: g > 0 ? [frac((t - L01.t) * 2.2), frac((t - L01.t) * 2.2 + .5)] : [], vib: 1.2 * tk * Math.sin(t * 55) }; }
  const atL = t > HIT.hopIn[0] + .1;
  s.E = jj > .15 ? hopE('laugh', t) : atL ? hopE('curious', t, { look: [-.75, -.1] }) : t > HIT.bump[0] ? hopE('surprised', t, { look: [.7, .2] }) : hopE('happy', t, { look: [.6, .35] });
  if (atL) s.P.frontR = [.4, -.45, 1.4];
  return s;
}
// trong kính: Hop gần như đứng yên (kính ổn định), râu ngọ nguậy; màng nhĩ: sáng ở HIT.glow, gợn theo vòng sóng "Hello in there!", rung theo giọng Miss Loupe và phách kick của funk
const helloHits = () => { const s = crumbLens(HIT.hello[0]), src = crumbMouth(s), dst = drumAt(hopBase(0)); return HIT.hello.map(te => arrive(te, src, dst, RING_V)); };
const RING_V = 280;
const KICKS = (() => { const o = []; for (let b = 0; b < 11; b++) for (const k of [0, .375, 1.25]) o.push(b * 2 + k); return o.filter(x => x > 9.0 && x < 12.2); })();
function hopLens(t) {
  const s = hopBase(t);
  const hits = helloHits(), hit = decay(t, hits, 5), hs = hits.filter(h => t >= h && t < h + .9).map(h => (t - h) / .9);
  const lt = talkAt(t, 'loupe') * (t > L06.t - .05 ? 1 : 0), kick = decay(t, KICKS, 9);
  const glow = ss(seg(t, HIT.glow - .15, HIT.glow + .25));
  const rip = [...hs];
  if (t > L06.t) { rip.push(frac((t - L06.t) * 1.8), frac((t - L06.t) * 1.8 + .5)); }
  s.drum = { glow: clamp(.55 * glow + .45 * hit + .35 * lt + .3 * kick), ripples: rip, vib: (1.6 * hit + 1.1 * lt + .7 * kick) * Math.sin(t * 58) };
  s.P.ant = Math.sin(t * 3) * .4 + 2 * hit * Math.sin(t * 25);
  s.E = hit > .4 ? hopE('surprised', t, { look: [.6, .3] }) : t > L06.t ? hopE('excited', t, { look: [.5, .3] }) : t > HIT.glow ? hopE('happy', t, { look: [.4, .4] }) : hopE('curious', t, { look: [-.2, .2] });
  if (hit > .3) s.P.lift = .05 * hit;
  return s;
}
// gag: sóng "ục ục" tới màng nhĩ → giật mình, co chân, vọt khỏi khung; rơi về ở cuối (hopBase)
function hopGag(t) {
  if (t >= HIT.fall[0] - .01) return hopHook(t - DUR);                          // rơi về, đáp: như khung đầu
  const s = hopBase(t);
  if (t >= HIT.leap[0]) {
    if (t >= HIT.leap[1] + .02) { s.y = -9999; return s; }                           // ngoài khung (không vẽ)
    const u = seg(t, HIT.leap[0], HIT.leap[1]), e = 1 - (1 - u) * (1 - u);
    s.x = lerp(HP.x, APEX[0], e); s.y = lerp(GY, APEX[1], e); s.P.lift = .35; s.P.wingOpen = .8; s.lean = .55 * Math.min(1, u * 4);
    s.E = hopE('surprised', t, { look: [-.3, -.8], mouth: 'shout' }); return s;
  }
  const hits = HIT.rumble.map(h => h + RUMBLE_T), hit = decay(t, hits, 4);
  const hs = hits.filter(h => t >= h && t < h + .8).map(h => (t - h) / .8);
  s.drum = { glow: clamp(.9 * hit + .8 * seg(t, hits[0], hits[0] + .1) * (t < HIT.leap[0] ? 1 : 0)), ripples: [...hs, ...hs.map(p => p + .33).filter(p => p < 1)], vib: 3 * hit * Math.sin(t * 64) };
  const cr = ss(seg(t, HIT.crouch[0], HIT.crouch[1]));
  s.P.crouch = .9 * cr; s.lean = -.06 * cr + .04 * hit * Math.sin(t * 50);
  s.P.ant = t > HIT.startle ? 2.5 : Math.sin(t * 3) * .4;
  s.E = t > HIT.startle ? hopE('surprised', t, { look: [.5, -.2] }) : hit > .2 ? hopE('curious', t, { look: [.7, .2] }) : hopE('happy', t, { look: [.5, .3] });
  return s;
}
const RUMBLE_T = .16;                                           // sóng "ục ục" đi từ bụng Crumb tới màng nhĩ
function drawHop(c, s, o = {}) {
  if (s.y < -5000) return;
  const P = { ...s.P, ear: (s.drum && s.drum.glow) || 0 };
  drawChar(c, BY.hop, { x: s.x, y: s.y, k: o.k || HP.k, yaw: s.yaw, lean: s.lean || 0, showFx: false, expr: s.E, pose: P, extra: drumExtra(P, s.drum || {}) });
}

/* ---------- Crumb ---------- */
const crumbE = (name, t, o = {}) => ex(BY.crumb, name, { talk: talkAt(t, 'crumb'), blink: talkAt(t, 'crumb') ? 0 : blinkAt(t, .2), ...o });
const ARMS = { relax: { armL: [-.42, -1.0, .35], armR: [.42, -1.0, .35] }, press: { armL: [-.5, -1.25, .4], armR: [-.1, -1.95, .35] },
  cup: { armL: [-.2, -1.45, .62], armR: [.2, -1.45, .62] }, out: { armL: [-.7, -1.9, .3], armR: [.7, -1.9, .3] }, belly: { armL: [-.3, -.8, .3], armR: [.3, -.8, .3] },
  wave: { armL: [-.42, -1.0, .35], armR: [.62, -2.3, .25] } };
function crumbPress(t) {                                       // áp tai vào bụng Hop (t có thể âm: chạy lại ở cuối phim)
  const P = CR.press, S = CR.stand, u = ss(seg(t, HIT.back[0] - DUR, HIT.press[1]));
  const run = t < HIT.press[1] ? Math.abs(Math.sin((t - HIT.back[0] + DUR) * 18)) * (1 - u) : 0;
  const s = { x: lerp(S.x, P.x, u), y: P.y, yaw: lerp(-.6, P.yaw, u), lean: lerp(0, P.lean, u) + .04 * Math.sin(t * 3), lift: .08 * run, arms: u > .5 ? ARMS.press : ARMS.relax, q: 0 };
  const tk = talkAt(t, 'crumb');
  s.E = crumbE(tk ? 'happy' : 'happy', t, { look: [-.5, -.6] });
  if (u < .9) s.E = crumbE('excited', t, { look: [-.7, -.3] });
  return s;
}
function crumbHook(t) {
  if (t < HIT.bump[0]) return crumbPress(t);
  const S = CR.stand, b = seg(t, HIT.bump[0], HIT.bump[1]);
  if (b < 1) { const p = arc([CR.press.x, CR.press.y], [S.x, S.y], eo(b), 70); return { x: p[0], y: p[1], yaw: -.4, lean: lerp(-.32, .25, b) - .5 * Math.sin(Math.PI * b), lift: 0, arms: ARMS.out, E: crumbE('surprised', t, { look: [-.6, -.2] }) }; }
  const land = Math.sin(Math.PI * seg(t, HIT.bump[1], HIT.bump[1] + .25)), q = t > HIT.qmark && t < HIT.hopIn[1] + .3;
  const toL = t > HIT.hopIn[0] + .15;
  const s = { x: S.x, y: S.y, yaw: toL ? -.75 : -.55, lean: .1 * land * Math.sin(t * 30), lift: -.04 * land, arms: q ? { armL: [-.42, -1.0, .35], armR: [.5, -1.5, .5] } : ARMS.relax };
  s.E = q ? crumbE('curious', t, { look: [-.6, -.4] }) : toL ? crumbE(talkAt(t) ? 'excited' : 'happy', t, { look: [-.85, -.2] }) : crumbE('surprised', t, { look: [-.6, -.2] });
  if (t > HIT.raise && t < HIT.zoom[1] + .4) s.lift = .12 * Math.abs(Math.sin((t - HIT.raise) * 6));          // nhún háo hức theo "Let's zoom in!"
  return s;
}
function crumbLens(t) {                                         // ghé sát màng nhĩ, khum tay: "Hello in there!"
  const S = CR.stand, H = CR.hello, u = ss(seg(t, HIT.lean[0], HIT.lean[1]));
  const walk = Math.sin(Math.PI * seg(t, HIT.lean[0], HIT.lean[1]));
  const s = { x: lerp(S.x, H.x, u), y: S.y, yaw: lerp(-.75, -1.1, u), lean: -.18 * u, lift: .06 * Math.abs(Math.sin(t * 22)) * walk, arms: u > .5 ? ARMS.cup : ARMS.relax };
  const tk = talkAt(t, 'crumb'), after = t > L05.t + L05.dur;
  s.E = tk ? crumbE('excited', t, { look: [-.8, -.1] }) : after ? crumbE('excited', t, { look: [-.7, -.2] }) : crumbE('happy', t, { look: [-.6, -.3] });
  if (after && t > L06.t) { s.arms = ARMS.relax; s.lean = -.1 + .05 * Math.sin(t * 6); }
  return s;
}
function crumbGag(t) {
  if (t >= HIT.back[0]) return crumbPress(t - DUR);
  const S = CR.stand, rb = HIT.rumble.reduce((a, h) => a + Math.sin(Math.PI * seg(t, h, h + .32)), 0);
  const s = { x: S.x, y: S.y, yaw: .55, lean: .08 * rb * Math.sin(t * 40), lift: 0, arms: ARMS.relax };
  const L8 = t >= L08.t - .1 && t < L09.t;
  if (t < HIT.glance) { s.yaw = -.5; s.E = crumbE('happy', t, { look: [-.6, -.3] }); }
  else if (t < HIT.rumble[0]) { s.E = crumbE(t > HIT.lick[0] ? 'silly' : 'hopeful', t, { look: [.8, .3] }); s.arms = { armL: [-.42, -1.0, .35], armR: [.45, -1.6, .55] }; }
  else if (t < HIT.leap[0]) { s.E = crumbE('surprised', t, { look: [.2, .4] }); s.arms = ARMS.belly; s.yaw = .2; }
  else if (t < HIT.leap[1] + .1) { s.E = crumbE('surprised', t, { look: [-.4, -.8] }); s.arms = ARMS.out; s.yaw = -.3; s.lift = .08 * Math.sin(Math.PI * seg(t, HIT.leap[0], HIT.leap[1])); }
  else if (L8 || t < L08.t) { s.E = crumbE('shy', t, { look: [-.3, -.6], fx: true }); s.arms = ARMS.belly; s.yaw = -.2; }
  else { s.E = crumbE('happy', t, { look: [-.2, -.7] }); s.yaw = -.35; s.lift = .05 * Math.abs(Math.sin(t * 5)); }
  return s;
}
function drawCrumb(c, s) {
  shadow(c, s.x, GY + 18, 56, .18);
  drawChar(c, BY.crumb, { x: s.x, y: s.y, k: CR.k, yaw: s.yaw, lean: s.lean || 0, showFx: !!(s.E && s.E.fx), expr: s.E, pose: { carry: null, lift: s.lift || 0, ...(s.arms || ARMS.relax), q: s.q || 0 } });
}

/* ---------- Miss Loupe (cỡ trung, bên trái) ---------- */
function loupeHook(t) {                                         // bật vào ngay trước "Well, Hop can!"; null khi chưa vào
  if (t < HIT.hopIn[0]) return null;
  const [wx, wy] = lsLens(), u = seg(t, HIT.hopIn[0], HIT.hopIn[1]), p = u < 1 ? arc([-260, wy + 40], [wx, wy], ei(u), 220) : [wx, wy];
  const land = Math.sin(Math.PI * seg(t, HIT.hopIn[1], HIT.hopIn[1] + .3)), talk = talkAt(t), raise = ss(seg(t, HIT.raise, HIT.raise + .5));
  const name = talk ? 'explaining' : 'happy';
  return { x: p[0], y: p[1] + 18 * land - 46 * raise, r: LS.r, rot: -.08 + .05 * Math.sin(t * 2.2), pose: raise > .3 ? ARM.peer : ARM.point, E: ex(BY.loupe, name, { talk, look: [.85, .1], blink: talk ? 0 : blinkAt(t) }) };
}
function loupeGag(t) {
  const [wx, wy] = lsLens(), ex_ = seg(t, HIT.exit[0], HIT.exit[1]);
  if (ex_ >= 1) return null;
  const p = ex_ > 0 ? arc([wx, wy], [-300, wy + 40], ei(ex_), 200) : [wx, wy];
  const talk = talkAt(t), rb = HIT.rumble.reduce((a, h) => a + Math.sin(Math.PI * seg(t, h, h + .4)), 0), lp = Math.sin(Math.PI * seg(t, HIT.leap[0], HIT.leap[0] + .6));
  const ask = t >= L09.t - .2;
  const name = talk ? 'explaining' : lp > .2 || rb > .3 ? 'surprised' : t > HIT.leap[1] && !ask ? 'laugh' : 'happy';
  const pose = ask ? ARM.up : lp > .2 ? ARM.shrug : ARM.peer;
  return { x: p[0], y: p[1] - 10 * Math.abs(Math.sin(t * 2)) - 22 * lp, r: LS.r, rot: -.06 + .05 * Math.sin(t * 1.7), pose, E: ex(BY.loupe, name, { talk, look: ask ? [.05, .15] : lp > .2 ? [.3, -.8] : [.85, .1], blink: talk ? 0 : blinkAt(t) }) };
}
function drawLoupe(c, L) { if (!L) return; shadow(c, L.x + 8, GY + 2, 110, .18); loupe(c, L.x, L.y, L.r, { E: L.E, rot: L.rot, pose: L.pose }); }

/* ================= HÒN ĐÁ: thế giới (toạ độ cảnh) ================= */
function world(c, t, o = {}) {
  sky(c, t); stone(c); seeds(c, t);
  cookie(c, CKX, GY + 26, 1, t);
  const hs = o.hs, cs = o.cs;
  if (hs && hs.y > -5000) shadow(c, hs.x - 10, GY + 6, 170 * clamp(1 - (GY - hs.y) / 600, .25, 1), .18);
  if (hs) drawHop(c, hs);
  if (cs) drawCrumb(c, cs);
  if (o.ls) drawLoupe(c, o.ls);
  if (o.fx) o.fx(c);
  foreground(c, t, o.px || 0);
}
const HOOKCAM = K([[-1, [545, 1005, 1.7]], [0, [545, 1005, 1.7]], [.6, [541, 1001, 1.8]], [HIT.bump[0], [545, 1001, 1.82]], [HIT.bump[1] + .2, [565, 1004, 1.74]],
  [HIT.hopIn[0], [555, 1006, 1.7]], [HIT.hopIn[1] + .25, [512, 1008, 1.52]], [HIT.zoom[0], [510, 1008, 1.5]], [HIT.zoom[0] + 8, [508, 1006, 1.5]]]);
function hookCam(t) {
  const [cx, cy, z] = HOOKCAM(t), sh = decay(t, [HIT.bump[1]], 9) + .6 * decay(t, [HIT.hopIn[1]], 8) + .5 * decay(t, [HIT.fall[1] - DUR], 9);
  return { cx: cx + 6 * Math.sin(t * 47) * sh, cy: cy + 5 * Math.sin(t * 39) * sh, z };
}
const px = cam => -(cam.cx - 540) * .45;
const TITLE = [{ text: 'TUMMY', y: 330, px: 210, fill: C.lemon, shadow: C.ink, t0: HIT.words[0] }, { text: 'EARS?!', y: 545, px: 200, fill: C.cream, shadow: C.berryD, t0: HIT.words[1] }];
function sHook(c, t, o = {}) {
  const cam = hookCam(t), hs = hopHook(t), cs = crumbHook(t);
  const fx = cc => {                                             // giọng Crumb sát bụng: vòng gợn quanh màng nhĩ (thấy quanh đầu Crumb)
    const tk = talkAt(t, 'crumb'); if (!tk && !(t > L01.t && t < L01.t + L01.dur + .4)) return;
    const d = drumAt(hs); cc.lineCap = 'round';
    for (let k = 0; k < 3; k++) { const p = frac((t - L01.t) * 1.6 + k / 3), a = (1 - p) * clamp((L01.t + L01.dur + .4 - t) / .4); cc.strokeStyle = `rgba(123,240,208,${.9 * a})`; cc.lineWidth = 7 * (1 - p) + 2; cc.beginPath(); cc.arc(d[0], d[1], 36 + 70 * p, Math.PI * .55, Math.PI * 1.75); cc.stroke(); }
  };
  look(c, cam, () => world(c, t, { hs, cs, ls: loupeHook(t), px: px(cam), fx }));
  const wob = [HIT.tickle, HIT.bump[1]].reduce((a, h) => a + (t > h ? Math.sin((t - h) * 16) * Math.exp(-(t - h) * 5) * .05 : 0), 0);
  if (!o.noTitle) hookTitle(c, TITLE, t, { gone: ss(seg(t, HIT.titleOut[0], HIT.titleOut[1])), cy: 420, wob });
}

/* ================= KÍNH LỚN (5,0–12,35 s): màng nhĩ bên bụng ================= */
function lensBig(t) {
  const big = ss(seg(t, HIT.zoom[0], HIT.zoom[1])), cam = hookCam(t), L0 = loupeHook(t), st = toScreen(cam, L0.x, L0.y);
  const sh = decay(t, helloHits(), 9) * 4;
  const bx = 540 + 12 * Math.sin(t * 1.3) + sh * Math.sin(t * 50), by = 690 + 10 * Math.sin(t * 1.7), br = 322 + 6 * Math.sin(t * 2.1);
  const hop = Math.sin(Math.PI * seg(t, HIT.zoom[0], HIT.zoom[1])) * 120;
  return { x: lerp(st[0], bx, big), y: lerp(st[1], by, big) - hop, r: lerp(LS.r * cam.z, br, big), big };
}
// điểm cảnh ở tâm kính và độ phóng (px khung / px cảnh): mặt Hop → lướt xuống bên bụng → màng nhĩ → lùi để thấy cả Crumb → lại đẩy vào màng nhĩ
const DRUM0 = (() => drumAt({ x: HP.x, y: GY, yaw: HP.yaw, lean: 0, P: {} }))();
const FACE0 = rigPt(HP.x, GY, HP.k, HP.yaw, 0, [0, -1.06, 1.02]);
const MID = () => { const m = crumbMouth(crumbLens(HIT.lean[1] + .1)); return [(m[0] + DRUM0[0]) / 2 + 4, (m[1] + DRUM0[1]) / 2 + 6]; };
const FOCUS = (() => { const M = MID(); return K([[HIT.zoom[0], [FACE0[0] + 30, FACE0[1], 1.8]], [HIT.zoom[1], [FACE0[0] + 10, FACE0[1] + 4, 2.9]], [HIT.glide[0] + .1, [FACE0[0] + 14, FACE0[1] + 6, 3.0]],
  [HIT.glide[1], [DRUM0[0] + 4, DRUM0[1] + 4, 4.4]], [HIT.lean[0], [DRUM0[0] + 2, DRUM0[1] + 2, 4.7]], [HIT.lean[1] + .05, [M[0], M[1], 2.75]], [L05.t + L05.dur + .1, [M[0] - 4, M[1], 2.85]],
  [L06.t + .3, [DRUM0[0] + 6, DRUM0[1] + 2, 4.0]], [HIT.snap, [DRUM0[0] + 2, DRUM0[1], 4.7]], [HIT.snap + 1, [DRUM0[0] + 2, DRUM0[1], 4.7]]]); })();
function sLens(c, t) {
  const L = lensBig(t), [fx, fy, S0] = FOCUS(t), cam = hookCam(t), S = lerp(cam.z, S0, L.big);
  const hs = hopLens(t), cs = crumbLens(t);
  const rings = cc => { const src = crumbMouth(cs), dst = drumAt(hs); soundRings(cc, t, src, dst, HIT.hello, RING_V, D.ring, 5, .6); if (t > L06.t) voiceRings(cc, t, dst); };
  look(c, cam, () => world(c, t, { hs, cs, px: px(cam) }));
  const talk = talkAt(t), name = t > helloHits()[0] && t < helloHits()[2] + .4 ? 'surprised' : talk ? 'explaining' : t > HIT.glow ? 'excited' : 'happy';
  loupe(c, L.x, L.y, L.r, {
    E: ex(BY.loupe, name, { talk, look: L.big > .5 ? [.15, -.5] : [.75, .1], blink: talk ? 0 : blinkAt(t) }), rot: lerp(-.1, -.04, L.big), pose: ARM.peer,
    inside: L.big > .02 ? cc => { cc.translate(L.x, L.y); cc.scale(S, S); cc.translate(-fx, -fy); world(cc, t, { hs, cs, fx: rings }); } : null,
  });
  if (L.big < .9) return;
  // nhãn chữ trên kính: "EAR!" rồi "EARDRUM!", mũi tên chỉ vào màng nhĩ
  const dS = [L.x + S * (drumAt(hs)[0] - fx), L.y + S * (drumAt(hs)[1] - fy)];
  if (t > HIT.tag - .02 && t < HIT.tag2 - .05) tagText(c, 'EAR!', t, HIT.tag, dS, L);
  if (t > HIT.tag2 - .02) tagText(c, 'EARDRUM!', t, HIT.tag2, dS, L);
}
// sóng giọng của Miss Loupe đi vào màng nhĩ từ phía dưới (cô đứng dưới kính)
function voiceRings(c, t, dst) {
  const src = [dst[0] - 40, dst[1] + 260], em = []; for (let k = L06.t; k < L06.t + L06.dur; k += .42) em.push(k);
  soundRings(c, t, src, dst, em.filter(e => talkAt(e + .1) > .1), 600, C.lemon, 3.5, .45);
}
function tagText(c, s, t, t0, dS, L) {
  const ty = L.y - L.r - 70;
  popText(c, s, 540, ty, 140, C.lemon, C.ink, t, t0, { step: .03, sh: 10 });
  const a = seg(t, t0 + .1, t0 + .35); if (a <= 0) return;
  const p0 = [540 + (dS[0] > 540 ? 60 : -60), ty + 30], p1 = [lerp(p0[0], dS[0], .55 * a), lerp(p0[1], dS[1] - 70, a)];
  c.strokeStyle = C.ink; c.lineCap = 'round'; c.lineWidth = 16; c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.stroke();
  c.strokeStyle = C.lemon; c.lineWidth = 9; c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.stroke();
  const g = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
  c.fillStyle = C.lemon; c.strokeStyle = C.ink; c.lineWidth = 5; c.beginPath(); c.moveTo(p1[0] + Math.cos(g) * 26, p1[1] + Math.sin(g) * 26); c.lineTo(p1[0] + Math.cos(g + 2.4) * 22, p1[1] + Math.sin(g + 2.4) * 22); c.lineTo(p1[0] + Math.cos(g - 2.4) * 22, p1[1] + Math.sin(g - 2.4) * 22); c.closePath(); c.fill(); c.stroke();
}

/* ================= SỔ (12,65–16,8 s) ================= */
const SLOT = { x: 280, y: 480, r: 140 }, PAGE = { x: 84, y: 200, w: 890, h: 650 }, DIVE = { x: 610, y: 735 }, MINI = { x: 860, y: 745, r: 76 }, AL = { x: 250, y: 1450, k: 240 };
function stickerArt(cc, t = 0) { const P = { ear: 1 }; drawChar(cc, BY.hop, { x: 22, y: 60, k: 62, yaw: -.85, showFx: false, expr: ex(BY.hop, 'excited', { look: [.3, .2] }), pose: P, extra: drumExtra(P, { glow: 1, ripples: [.3, .65], vib: 0 }) }); }
function miniArt(cc) { drawChar(cc, BY.hop, { x: 6, y: 40, k: 40, yaw: -.8, showFx: false, expr: ex(BY.hop, 'laugh'), pose: { lift: .1 } }); }
function albumHop(t) {
  if (t < HIT.hopIn2[0] || t >= HIT.dive2[1]) return null;
  if (t < HIT.hopIn2[1]) { const u = ss(seg(t, HIT.hopIn2[0], HIT.hopIn2[1])), p = arc([1260, 1080], [690, 1130], u, 240); return { x: p[0], y: p[1], k: 90, yaw: -1.0, rot: -.4 * Math.sin(Math.PI * u), lift: .3 * Math.sin(Math.PI * u) }; }
  if (t < HIT.dive2[0]) { const h = Math.abs(Math.sin((t - HIT.hopIn2[1]) * 5.2)); return { x: 690 - 20 * Math.sin((t - HIT.hopIn2[1]) * 2.6), y: 1130 - 40 * h, k: 90, yaw: -1.0 + .25 * Math.sin(t * 2), rot: 0, lift: .1 * h }; }
  const u = seg(t, HIT.dive2[0], HIT.dive2[1]), p = arc([690, 1130], [DIVE.x, DIVE.y + 30], u, 320); return { x: p[0], y: p[1], k: lerp(90, 30, ei(u)), yaw: -.8, rot: .9 * ei(u), lift: .35 };
}
function sAlbum(c, t) {
  const push = 1 + .05 * Math.sin(Math.PI * seg(t, HIT.gulp - .05, HIT.gulp + .6));
  c.save(); c.translate(540, 700); c.scale(push, push); c.translate(-540, -700);
  ground(c, '#D8CDEB'); ell(c, 200, 1760, 900, 420, 0, '#E6DEF2'); ell(c, 540, 1730, 980, 330, 0, D.ground); ell(c, 540, 1770, 900, 280, 0, D.groundD);
  rrect(c, PAGE.x + 12, PAGE.y + 18, PAGE.w, PAGE.h, 54, C.grape); rrect(c, PAGE.x, PAGE.y, PAGE.w, PAGE.h, 54, C.cream);
  const t0 = HIT.stamp;
  circle(c, SLOT.x, SLOT.y, 142, '#EBDDBC');
  if (t >= HIT.zoomOut[0]) {
    const p = t >= t0 ? back(seg(t, t0, t0 + .22), 2.6) : 1;
    badge(c, SLOT.x, SLOT.y, SLOT.r, C.skyL, cc => { const k = SLOT.r / 100; cc.scale(k, k); stickerArt(cc, t); }, -.05, t >= t0 ? lerp(1.2, 1, p) : 1);
    popText(c, 'Tummy', 470, 445, 118, C.berry, null, t, t0 + .1, { align: 'left', step: .02 });
    popText(c, 'ears!', 470, 560, 118, C.berry, null, t, t0 + .18, { align: 'left', step: .02 });
    popText(c, 'they wiggle with sound', 445, 650, 44, C.ink, null, t, t0 + .25, { align: 'left', step: .012, font: subFont });
  }
  const rq = seg(t, HIT.gulp, HIT.gulp + .8);
  if (rq > 0 && rq < 1) for (let k = 0; k < 3; k++) { const q = clamp(rq * 1.4 - k * .2); if (q > 0 && q < 1) { c.strokeStyle = `rgba(123,240,208,${.9 * (1 - q)})`; c.lineWidth = 12 * (1 - q) + 2; c.beginPath(); c.ellipse(DIVE.x, DIVE.y, 60 + 260 * q, 26 + 90 * q, 0, 0, TAU); c.stroke(); } }
  if (t >= HIT.mini) badge(c, MINI.x, MINI.y, MINI.r, C.mintL, miniArt, .06, back(seg(t, HIT.mini, HIT.mini + .3), 2.6));
  const talk = talkAt(t, 'albie'), b = albumHop(t);
  shadow(c, AL.x + 18, AL.y + 4, 220, .18);
  albumGulp(c, t, { x: AL.x, y: AL.y, k: AL.k, talk, line: line('L07'), counts: HIT.counts, tg: HIT.gulp, look: b ? [.75, -.4] : [.5, -.7], blink: talk ? 0 : blinkAt(t, .4) });
  if (b) {
    c.save(); c.translate(b.x, b.y - b.k); c.rotate(b.rot); c.translate(-b.x, -(b.y - b.k));
    const cnt = HIT.counts.reduce((a, h) => a + Math.sin(Math.PI * seg(t, h - .05, h + .12)), 0);
    drawChar(c, BY.hop, { x: b.x, y: b.y, k: b.k, yaw: b.yaw, showFx: false, expr: ex(BY.hop, t > HIT.dive2[0] ? 'excited' : 'laugh', { look: [-.6, .2] }), pose: { lift: b.lift, ant: Math.sin(t * 9), frontL: cnt > .2 ? [-.42, -.9, 1.3] : null, hindUp: .4 * Math.min(1, cnt) } });
    c.restore();
  }
  c.restore();
}

/* ================= GAG (16,8–22 s): bụng Crumb "ục ục"; máy lao vào màng nhĩ; Hop vọt khỏi khung; câu hỏi; Hop rơi về ================= */
const GAGCAM = K([[HIT.flip[1], [510, 1008, 1.5]], [HIT.glance, [514, 1008, 1.52]], [HIT.rumble[0], [516, 1010, 1.53]]]);
function gagCam(t) {
  let [cx, cy, z] = GAGCAM(t);
  const D0 = drumAt(hopBase(17)), ci = ss(seg(t, HIT.crashIn[0], HIT.crashIn[1])) * (1 - ss(seg(t, HIT.crashOut[0], HIT.crashOut[1])));
  cx = lerp(cx, D0[0] + 66, ci); cy = lerp(cy, D0[1] - 6, ci); z = lerp(z, 4.2, ci);   // mặt Crumb (bên phải) dừng trước cột nút phải
  const up = Math.sin(Math.PI * seg(t, HIT.leap[0], HIT.leap[1] + .4)); cy -= 70 * up; z -= .06 * up;
  const back_ = ss(seg(t, HIT.leap[1] + .3, HIT.leap[1] + 1.1)); cx = lerp(cx, 512, back_); cy = lerp(cy, 1008, back_); z = lerp(z, 1.5, back_);
  const sh = 1.4 * decay(t, HIT.rumble.map(h => h + RUMBLE_T), 7) * ci + decay(t, [HIT.leap[0]], 8) + .6 * decay(t, [HIT.fall[1]], 9);
  const k = ss(seg(t, HIT.fall[0] - .1, DUR - .05)), h = hookCam(t - DUR);
  return { cx: lerp(cx, h.cx, k) + 7 * Math.sin(t * 47) * sh, cy: lerp(cy, h.cy, k) + 6 * Math.sin(t * 41) * sh, z: lerp(z, h.z, k) };
}
function sGag(c, t) {
  const cm = gagCam(t), hs = hopGag(t), cs = crumbGag(t);
  const fx = cc => {
    const src = crumbBelly(cs), dst = drumAt(hs.y > -5000 ? hs : hopBase(17));
    if (t > HIT.rumble[0] - .05 && t < HIT.leap[0]) rumbleWaves(cc, t, src, dst, HIT.rumble.flatMap(h => [h, h + .1]), (Math.hypot(dst[0] - src[0], dst[1] - src[1])) / RUMBLE_T, 8);
    puff(cc, HP.x, GY + 4, seg(t, HIT.leap[0], HIT.leap[0] + .6), 1.1);
    puff(cc, HP.x, GY + 4, seg(t, HIT.fall[1], HIT.fall[1] + .6), .9);
    // "ục ục": vạch lượn sóng quanh bụng Crumb
    HIT.rumble.forEach(h => { const q = seg(t, h, h + .4); if (q > 0 && q < 1) for (let i = 0; i < 3; i++) { const g = -.9 + i * .5, R = 34 + 40 * eo(q); cc.strokeStyle = `rgba(255,154,60,${1 - q})`; cc.lineWidth = 6; cc.beginPath(); for (let j = 0; j <= 8; j++) { const a = g + j * .05, r = R + 5 * Math.sin(j * 2.2 + t * 40); const X = src[0] + Math.cos(a + Math.PI) * r * 1.2, Y = src[1] + Math.sin(a) * r; j ? cc.lineTo(X, Y) : cc.moveTo(X, Y); } cc.stroke(); } });
  };
  look(c, cm, () => world(c, t, { hs, cs, ls: loupeGag(t), px: px(cm), fx }));
  // chữ "RUMBLE!" lắc khi bụng sôi (cận cảnh màng nhĩ)
  if (t > HIT.rumble[0] - .02 && t < HIT.rumble[0] + 2.05) {
    const pu = 1 + .1 * Math.sin(Math.PI * seg(t, HIT.rumble[1], HIT.rumble[1] + .25));
    c.save(); c.translate(715, 600); c.scale(pu, pu); c.rotate(.06 * Math.sin((t - HIT.rumble[0]) * 30)); c.translate(-715, -600);
    const out = ss(seg(t, HIT.rumble[0] + 1.85, HIT.rumble[0] + 2.05)); c.translate(715, 600); c.scale(1 - out, 1 - out); c.translate(-715, -600);
    popText(c, 'RUMBLE!', 715, 640, 122, C.tang, C.ink, t, HIT.rumble[0], { step: .03, sh: 9 }); c.restore();   // bên phải, trên đầu Crumb: cú vọt của Hop đi lên phía trái
  }
}

/* ---------- chuyển cảnh ---------- */
function matchCut(c, t) {
  stickerMatchCut(c, t, { t0: HIT.zoomIn[0], t1: HIT.zoomOut[0], t2: HIT.zoomOut[1], lens: lensBig(HIT.zoomIn[0]), from: cc => sLens(cc, HIT.zoomIn[0]), to: (cc, tt) => sAlbum(cc, tt), slot: SLOT, fill: C.skyL, draw: cc => { cc.scale(SLOT.r / 100, SLOT.r / 100); stickerArt(cc); } });
}
function recallTitle(c, t) { hookTitle(c, TITLE, -1, { gone: 1 - back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: 420 }); }
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
