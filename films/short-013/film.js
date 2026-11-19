// SHORT-013 · Grasshoppers Hide Their Ears in a Funny Place! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp:
// móc và gag là cùng một sân khấu gốc cây giữa bãi cỏ khô; cuối phim Chirp, Hop và Miss Loupe bỏ tay ra, lại đứng cạnh nhau, Crumb lại thổi còi lá (khung đầu).
// Công thức tập A 45 s (PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §3): logo 0,8 s lồng vào cú lao vào kính (titleSting), ô sticker "1 2 3"
// (stickerSlots), kính lớn có máy trôi, câu cửa miệng có hành động (albumGulp), phụ đề ở vùng an toàn (SAFE.subY).
// Phong cách nhân vật v2 "Kẹo Phẳng Viền" (CHARACTER-BIBLE §10). Hop (châu chấu) ra mắt ở tập này: _shared/characters/cast/hop.js.
// (19/11/2026, chuẩn 11/2026b theo SHORT-016) chữ móc ở giữa phía trên (hookStack), máy đặt cao trong 3 s đầu để mặt nhân vật đứng dưới chữ;
// mọi mốc thời gian đọc từ HIT / LINES của timeline.js (bản 44 s cũ có vài mốc viết số: 30 s, 38,6 s…); kính lớn ghi độ phóng / lia trong
// kính; điệp khúc lần 1 trong song tấu, lần 2 sau gag: Chirp và Hop chơi khe khẽ, nốt nhạc bay lên, cả nhóm nhún theo.
import { LOOK } from '/_shared/characters/look.js';
import { C, circle, ell, rrect, popText, subFont, clamp, lerp, seg, back, eo, TAU, ground, nope } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { makeTalk, blinkAt, ex, rigPt, look, toScreen, loupe, ARM, badge, shadow, subtitle, LENS_UP, hookTitle, hookStack, stickerMatchCut, snapFlash, SAFE,
  titleSting, stickerSlots, flyBadge, albumGulp } from '/_shared/episode.js';
import { N, groundY, STUMP, FAR, meadowSky, meadowGround, foreGrass, seeds, soundWaves, ripple, note, shapePt, coil, blade, bigWord, qmark } from './props.js';
import { LINES, CARDS, DUR, HIT, SAWS, DUET, ENCORE, DUET2, MID, spanEnd } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';
LOOK.v = 2;   // (11/2026) tập mới dùng phong cách nhân vật v2
LOOK.cheer = true;   // (11/2026) mặt nhân vật luôn vui tươi (QUALITY.md §5, stage.js cheerExpr)

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const decay = (t, list, k = 6) => list.reduce((s, h) => s + (t >= h ? Math.exp(-(t - h) * k) : 0), 0);
const line = id => LINES.find(l => l.id === id);
const W = (t, a, b) => ss(seg(t, a, b));                                         // 0→1 êm trong [a, b]
const BAND = (t, a, b, f = .2) => ss(seg(t, a, a + f)) * (1 - ss(seg(t, b - f, b)));   // 0→1→0
const arcP = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];
const TT = t => (t > MID ? t - DUR : t);                                          // giờ của móc, kéo dài về trước điểm lặp (t âm = cuối phim)
// (19/11/2026) không ai hát: màu biểu cảm của Miss Loupe lấy từ tune.mode của câu nói theo phách
const lineAt = t => LINES.find(l => t >= l.t && t < l.t + l.dur + .1);
const singExpr = t => { const l = lineAt(t); if (!l || l.who !== 'loupe') return null; const m = (l.sung || l.tune || {}).mode || 'speak'; return m === 'sing' ? 'excited' : m === 'half-sing' ? 'happy' : m === 'sing-talk' ? 'explaining' : null; };
const CH2 = t => t >= HIT.ch2[0] - .1 && t < HIT.ch2[1];                         // điệp khúc lần 2 (sau gag)
// pha kéo "vĩ" của Hop: mỗi nhát (list) là một lần đùi sau kéo xuống; giữa hai nhát đùi kéo lên. Trả về bow cho pose (sin(bow) = độ nâng)
function bowAt(t, list) {
  let i = list.findIndex(h => h > t); if (i < 0) return { bow: 0, on: 0 };
  if (i === 0) return { bow: 0, on: 0 };
  const a = list[i - 1], b = list[i], u = (t - a) / (b - a);
  return { bow: Math.PI * (1 - u), on: 1 };                                      // ngay sau nhát: đùi ở dưới (sin π = 0), lên dần (sin π/2 = 1) rồi xuống
}

/* ================= nhân vật ================= */
// Crumb: kiến con. tip/walk/ph: bước · sit · arms · blow: thổi còi lá (lá cỏ ở miệng) · q: râu dấu hỏi
const FEET = [[-.4, 0, .3], [-.48, 0, -.1], [.4, 0, .3], [.48, 0, -.1]];
const ARMS = {
  rest: { armL: [-.4, -1.0, .45], armR: [.42, -1.05, .45] }, up: { armL: [-.62, -2.45, .2], armR: [.62, -2.45, .2] },
  blow: { armL: [-.22, -1.55, .75], armR: [.22, -1.55, .75] }, point: { armL: [-.4, -1.0, .45], armR: [.55, -2.35, .75] },
  wave: { armL: [-.4, -1.0, .45], armR: [.85, -2.45, .3] }, tummy: { armL: [-.25, -.95, .62], armR: [.25, -.95, .62] },
  cheer: { armL: [-.85, -2.3, .3], armR: [.85, -2.3, .3] }, shrug: { armL: [-.85, -1.45, .2], armR: [.85, -1.45, .2] },
  dance0: { armL: [-.8, -2.2, .3], armR: [.6, -1.1, .4] }, dance1: { armL: [-.6, -1.1, .4], armR: [.8, -2.2, .3] },
};
const mixArms = (a, b, k) => ({ armL: a.armL.map((v, i) => lerp(v, b.armL[i], k)), armR: a.armR.map((v, i) => lerp(v, b.armR[i], k)) });
function crumbAt(c, x, y, k, o = {}) {
  const w = o.walk || 0, ph = o.ph || 0, sit = o.sit || 0;
  const feet = FEET.map((f, i) => {
    const s = Math.sin(ph * TAU + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0));
    const ft = [f[0], -Math.max(0, s) * .16 * w, f[2] + s * .18 * w];
    return [ft[0], ft[1] * (1 - sit), lerp(ft[2], f[2] + .55, sit)];
  });
  const lift = (o.hop || 0) + Math.abs(Math.sin(ph * TAU)) * .05 * w - .42 * sit;
  const pose = { carry: null, q: o.q || 0, reach: o.reach ?? .3, lift, bodyLean: o.bodyLean || 0, feet, ...(o.arms || ARMS.rest) };
  const bl = o.blade || 0;
  return drawChar(c, BY.crumb, { x, y, k, yaw: o.yaw ?? .55, lean: o.lean || 0, showFx: !!o.fx, expr: o.E || ex(BY.crumb, 'happy'), pose,
    props: bl > 0 ? (cc, r) => { const m = r.P([0, -1.35 - lift, .62]); blade(cc, m[0] + .05, m[1], 1.05, -.25 + .08 * Math.sin((o.t || 0) * 60) * (o.blow || 0), bl); } : null });
}
const crumbE = (name, t, o = {}) => ex(BY.crumb, name, { talk: talkAt(t, 'crumb'), blink: talkAt(t, 'crumb') ? 0 : blinkAt(t, .6), ...o });
// Chirp (dế): tai ở ống chân trước. o: { yaw, lift, chirp (cánh nâng = gáy), frontL, frontR, earGlow, ant, E, detail }
const CK = 80, HK = 80;
function chirpAt(c, x, y, k, o = {}) {
  return drawChar(c, BY.chirp, { x, y, k, yaw: o.yaw ?? -.35, lean: o.lean || 0, detail: o.detail || 0, showFx: false, expr: o.E || ex(BY.chirp, 'happy'),
    pose: { lift: o.lift || 0, chirp: o.chirp || 0, frontL: o.frontL || null, frontR: o.frontR || null, earGlow: o.earGlow || 0, ant: o.ant || 0 } });
}
// Hop (châu chấu): tai ở hai bên bụng. o: { yaw, lift, crouch, fiddle, bow, ear, earCover, wingOpen, hindUp, frontL, frontR, ant, pegs, E }
function hopAt(c, x, y, k, o = {}) {
  return drawChar(c, BY.hop, { x, y, k, yaw: o.yaw ?? -.35, lean: o.lean || 0, detail: o.detail || 0, showFx: false, expr: o.E || ex(BY.hop, 'happy'),
    pose: { lift: o.lift || 0, crouch: o.crouch || 0, fiddle: o.fiddle || 0, bow: o.bow || 0, ear: o.ear || 0, earCover: o.earCover || 0, wingOpen: o.wingOpen || 0,
      hindUp: o.hindUp || 0, frontL: o.frontL || null, frontR: o.frontR || null, ant: o.ant || 0, pegs: !!o.pegs } });
}
const chirpE = (name, t, o = {}) => ex(BY.chirp, name, { blink: blinkAt(t, .3), ...o });
const hopE = (name, t, o = {}) => ex(BY.hop, name, { blink: blinkAt(t, .75), ...o });
// điểm tai: Hop (màng nghe bên bụng, phía gần máy) và Chirp (ống chân trước bên phải) → toạ độ cảnh
// tâm màng nghe từ rig dùng chung (HOP.ear, dáng đứng yên) + độ nâng / co chân của dáng hiện tại
const hopEar = (s) => { const e = BY.hop.ear(s.yaw < 0 ? 1 : -1); return rigPt(s.x, s.y, s.k, s.yaw, 0, [e[0], e[1] - (s.lift || 0) + (s.crouch || 0) * .16, e[2]]); };
function chirpKnee(s) {
  const f = s.frontR, hip = [.24, -.7 - (s.lift || 0), .74];
  const knee = f ? [lerp(hip[0], f[0], .45), lerp(hip[1], f[1], .45) + .12, lerp(hip[2], f[2], .45)] : [.44, -.36 - (s.lift || 0), .98];
  const foot = f || [.4, 0, 1.18], e = [lerp(knee[0], foot[0], .32), lerp(knee[1], foot[1], .32), lerp(knee[2], foot[2], .32)];
  return rigPt(s.x, s.y, s.k, s.yaw, 0, e);
}

/* ================= SÂN KHẤU GỐC CÂY: móc (0–3 s), song tấu (23–28,6 s), gag (33,1–44 s) ================= */
const LW = { x: 380, r: 90 }, CHW = { x: 612, y: STUMP.top }, HPW = { x: 778, y: STUMP.top }, CRW = { x: 478, y: 1245 }, CRK = 62;
// (11/2026b) 3 s đầu máy đặt cao, thu nhẹ (z 1,6): chữ móc ở trời, kính và mặt cả bốn nhân vật ở dưới chữ; chữ rời đi thì đẩy vào như bản cũ để lao vào kính
const HOOKCAM = K([[-2.0, [608, 935, 1.56]], [-1.15, [608, 935, 1.56]], [0, [600, 928, 1.6]], [.45, [602, 926, 1.62]], [1.4, [598, 924, 1.64]], [2.4, [594, 925, 1.66]],
  [HIT.titleOut[1], [590, 962, 1.7]], [3.0, [585, 1025, 1.82]]]);
const DUETCAM = K([[HIT.exit[1] - .7, [600, 1035, 1.66]], [HIT.duet[0] + 1.15, [598, 1037, 1.68]], [HIT.star[0], [602, 1035, 1.7]], [HIT.snap3 - .25, [596, 1033, 1.72]], [HIT.zoomIn[0], [590, 1030, 1.74]]]);
const GAGCAM = K([[HIT.flip[1], [600, 1040, 1.66]], [HIT.encore[0] - .1, [600, 1037, 1.69]], [HIT.loud[1] - .1, [640, 1045, 1.8]], [HIT.chirpCover, [690, 1052, 2.0]], [HIT.loupeCover - .2, [700, 1052, 2.03]],
  [HIT.loupeCover + .05, [580, 1012, 1.8]], [line('L16').t + .45, [584, 1014, 1.8]], [HIT.giggle2 - .15, [565, 1020, 1.82]], [HIT.uncover[2], [578, 1030, 1.76]],
  [HIT.ch2[0] + .5, [600, 1030, 1.62]], [line('L18').t - .1, [600, 1034, 1.64]], [line('L18').t + .5, [592, 1030, 1.74]], [HIT.home[0] + .6, [600, 1036, 1.7]],
  [HIT.home[1], HOOKCAM(HIT.home[1] - DUR)]]);
function stageCam(t) {
  const base = t < 4 ? HOOKCAM(t) : t < MID ? DUETCAM(t) : t < HIT.home[1] ? GAGCAM(t) : HOOKCAM(TT(t));
  const loud = t > MID ? W(t, HIT.encore[0], HIT.loud[1]) * (t < HIT.chirpCover ? 1 : 0) : 0;
  const sh = decay(t, [HIT.startle, HIT.land, HIT.chirpCover, HIT.hopCover, HIT.loupeCover], 9) + .6 * loud;
  const [cx, cy, z] = base; return { cx: cx + 6 * Math.sin(t * 47) * sh, cy: cy + 5 * Math.sin(t * 39) * sh, z };
}
// kính của Miss Loupe trên sân khấu (toạ độ cảnh): rung khi có tiếng to (đã gài ở móc), giơ lên khi sắp lao vào kính / chụp
function lensStage(t) {
  const tt = TT(t), wx = LW.x, wy = groundY(LW.x) - LENS_UP * LW.r;
  const ring = t < 4 ? BAND(t, HIT.lensRing[0], HIT.lensRing[1], .15) : t > MID ? BAND(t, HIT.lensRing2[0], HIT.lensRing2[1], .15) : 0;
  const rs = t < 4 ? W(t, HIT.raise, HIT.sting[0]) : 0, up = t > HIT.stamp2 && t < MID ? BAND(t, HIT.lensUp[0], HIT.zoomIn[0] + .2, .2) : 0;
  const sw = HIT.giggle2 - .15, ch = CH2(t) ? .05 * Math.sin((t - HIT.ch2[0]) * Math.PI * 2) : 0;   // điệp khúc 2: kính đung đưa theo phách
  return { x: wx + 6 * Math.sin(t * 31) * ring + 26 * rs + 30 * up, y: wy - 4 * Math.sin(tt * 2.2) - 60 * rs - 50 * up - 14 * Math.abs(ch) / .05 * (CH2(t) ? 1 : 0), r: LW.r, ring,
    rot: -.06 + .03 * Math.sin(tt * 1.7) + .16 * Math.sin(t * 26) * ring - .08 * rs + .1 * up + ch + (t > sw && t < HIT.home[1] && !CH2(t) ? .06 * Math.sin((t - sw) * 4) * (1 - W(t, HIT.home[0] + .4, HIT.home[1])) : 0) };
}
const COVER = { handL: [-.26, -2.55, .75], handR: [.3, -2.9, .75], elbowL: [-.9, -1.95, .35], elbowR: [.9, -2.1, .35] };
function loupeStageE(t) {
  const talk = talkAt(t), tt = TT(t);
  if (t < 4) {
    const st = t > HIT.startle && t < HIT.startle + .55;
    const name = st ? 'surprised' : talk ? 'curious' : t > HIT.puzzle[0] ? 'curious' : 'happy';
    return { E: ex(BY.loupe, name, { talk: st ? 0 : talk, look: t > HIT.startle ? [.6, .2] : [.3, .25], blink: talk ? 0 : blinkAt(t) }), pose: st ? ARM.up : t > HIT.raise ? ARM.peer : ARM.shrug };
  }
  if (t < MID) {                                                                // song tấu: đung đưa theo nhạc, giơ kính chụp ở cuối
    const name = talk ? (singExpr(t) || 'explaining') : t > HIT.lensUp[0] ? 'excited' : 'laugh';
    return { E: ex(BY.loupe, name, { talk, look: [.7, -.2], blink: talk ? 0 : blinkAt(t) }), pose: t > HIT.lensUp[0] - .1 ? ARM.peer : ARM.wave };
  }
  if (t < HIT.home[0]) {                                                        // gag
    const cov = W(t, HIT.loupeCover - .12, HIT.loupeCover + .08) * (1 - W(t, HIT.uncover[2] - .1, HIT.uncover[2] + .12));
    if (cov > .02) {
      const H0 = { handL: [-.85, -1.6, .1], handR: [.85, -1.6, .1], elbowL: [-.8, -1.25, .1], elbowR: [.8, -1.25, .1] };
      const q = Object.fromEntries(Object.entries(COVER).map(([k, v]) => [k, v.map((x, i) => lerp(H0[k][i], x, cov))]));
      const name = talk ? 'worried' : t > HIT.giggle2 ? 'shy' : 'strain';
      return { E: ex(BY.loupe, name, { talk, look: [.5, .1], blink: 0 }), pose: q };
    }
    const loud = BAND(t, HIT.encore[0] + .5, HIT.loupeCover, .2);
    if (CH2(t)) { const ph = Math.floor((t - HIT.ch2[0]) * 2) % 2; return { E: ex(BY.loupe, talk ? (singExpr(t) || 'excited') : 'excited', { talk, look: [.6, -.1], blink: talk ? 0 : blinkAt(t) }), pose: ph ? ARM.wave : ARM.up }; }   // điệp khúc 2: nhún, vẫy theo phách
    const name = talk ? (singExpr(t) || 'explaining') : loud > .5 ? 'worried' : t > HIT.uncover[2] ? 'happy' : 'laugh';
    return { E: ex(BY.loupe, name, { talk, look: t > line('L18').t - .1 ? [0, 0] : [.7, -.1], blink: talk ? 0 : blinkAt(t) }), pose: t > HIT.uncover[2] ? ARM.shrug : ARM.wave };
  }
  return { E: ex(BY.loupe, 'happy', { look: [.3, .25], blink: blinkAt(tt) }), pose: ARM.shrug };
}
// Chirp trên sân khấu
function chirpStage(t) {
  const tt = TT(t), s = { x: CHW.x, y: CHW.y, k: CK, yaw: -.35, lift: 0, chirp: 0, frontL: null, frontR: null, earGlow: 0, ant: .3 * Math.sin(tt * 2), E: null };
  if (t < 4 || t >= HIT.home[1]) {                                            // móc (và khung cuối): đứng cạnh Hop; giật mình, tai đầu gối loé sáng, giơ chân về phía tiếng còi
    const pre = tt < 0 ? .08 * Math.min(1, -tt / 1.15) * Math.abs(Math.sin(tt * 5.5)) : 0;
    const st = Math.sin(Math.PI * seg(tt, HIT.startle, HIT.startle + .4)), legU = W(tt, HIT.chirpLeg[0], HIT.chirpLeg[1]) * (1 - W(tt, HIT.puzzle[0] + .1, HIT.puzzle[1]));
    s.lift = .35 * st + pre; s.earGlow = BAND(tt, HIT.startle, HIT.puzzle[0] + .3, .1); s.frontR = legU > .01 ? [lerp(.4, .62, legU), lerp(0, -.75, legU), lerp(1.18, 1.3, legU)] : null;
    s.yaw = lerp(-.35, -.6, legU) + lerp(0, .5, W(tt, HIT.puzzle[0], HIT.puzzle[0] + .25)) * (1 - W(tt, 2.75, 3.0));
    s.E = chirpE(st > .2 ? 'surprised' : tt > HIT.puzzle[0] ? 'confused' : legU > .3 ? 'curious' : 'happy', tt, { look: tt > HIT.puzzle[0] ? [.8, 0] : legU > .2 ? [-.8, .2] : [-.2, .2] });
    return s;
  }
  if (t < MID) {                                                               // song tấu: mặt nghiêng về Hop, mỗi nhịp nâng cánh gáy
    s.yaw = .18; const p = DUET.chirp.reduce((m, h) => Math.max(m, BAND(t, h - .04, h + .3, .08)), 0);
    s.chirp = p; s.lift = .06 * p; s.E = chirpE(t > HIT.duet[0] ? 'laugh' : 'happy', t, { look: [.8, 0] });
    if (t > HIT.finale) { const f = Math.sin(Math.PI * seg(t, HIT.finale, HIT.finale + .45)); s.lift = .3 * f; s.chirp = 1; s.E = chirpE('excited', t); }
    return s;
  }
  // gag: chơi lại to hơn → bịt đầu gối → bỏ tay ra (đứng như khung đầu)
  const enc = t > HIT.encore[0] && t < HIT.chirpCover, cov = W(t, HIT.chirpCover - .1, HIT.chirpCover + .08) * (1 - W(t, HIT.uncover[0], HIT.uncover[0] + .15));
  s.yaw = lerp(.18, -.35, W(t, HIT.uncover[0], HIT.uncover[0] + .3));
  if (enc) { const p = ENCORE.chirp.reduce((m, h) => Math.max(m, BAND(t, h - .03, h + .16, .05)), 0); s.chirp = p; s.lift = .05 * p; s.E = chirpE(t > HIT.loud[0] ? 'worried' : 'excited', t, { look: [.8, 0] }); }
  else s.E = chirpE(t < HIT.encore[0] ? 'happy' : 'happy', t, { look: t < HIT.encore[0] ? [-.6, .2] : [-.3, .2] });
  s.lift += .4 * Math.sin(Math.PI * seg(t, HIT.uncover[0] + .1, HIT.uncover[0] + .5)) + .12 * Math.abs(Math.sin((t - HIT.uncover[0]) * 5)) * W(t, HIT.uncover[0] + .5, HIT.uncover[0] + .7) * (1 - W(t, HIT.home[0] + .6, HIT.home[1]));
  if (cov > .01) { s.frontL = [lerp(-.4, -.18, cov), lerp(0, -1.05, cov), lerp(1.18, 1.42, cov)]; s.frontR = [lerp(.4, .18, cov), lerp(0, -1.05, cov), lerp(1.18, 1.42, cov)]; s.earGlow = cov; s.E = ex(BY.chirp, 'strain'); s.lift = .1 * Math.sin(Math.PI * seg(t, HIT.chirpCover, HIT.chirpCover + .25)); }
  if (CH2(t)) { const p = DUET2.chirp.reduce((m, h) => Math.max(m, BAND(t, h - .04, h + .3, .08)), 0); s.yaw = .18; s.chirp = .7 * p; s.lift = .05 * p; s.E = chirpE('laugh', t, { look: [.8, 0] }); }   // điệp khúc 2: gáy khe khẽ
  return s;
}
// Hop trên sân khấu
function hopStage(t) {
  const tt = TT(t), s = { x: HPW.x, y: HPW.y, k: HK, yaw: -.35, lift: 0, crouch: 0, fiddle: 0, bow: 0, ear: 0, earCover: 0, wingOpen: 0, hindUp: 0, ant: .4 * Math.sin(tt * 2.4 + 1), E: null };
  if (t < 4 || t >= HIT.home[1]) {                                            // móc: nảy "boing", tai bụng loé sáng, xoay sườn về phía tiếng còi
    const pre = tt < 0 ? .08 * Math.min(1, -tt / 1.15) * Math.abs(Math.sin(tt * 5.5 + 1.2)) : 0;
    const j = seg(tt, HIT.hopUp[0], HIT.hopUp[1]), turn = W(tt, HIT.hopTurn[0], HIT.hopTurn[1]) * (1 - W(tt, HIT.puzzle[0] + .1, HIT.puzzle[1]));
    s.lift = .75 * Math.sin(Math.PI * j) + pre; s.crouch = .5 * Math.sin(Math.PI * seg(tt, HIT.hopUp[0] - .12, HIT.hopUp[0] + .05)) + .4 * Math.sin(Math.PI * seg(tt, HIT.hopUp[1] - .02, HIT.hopUp[1] + .2));
    s.ear = BAND(tt, HIT.startle, HIT.puzzle[0] + .3, .1); s.yaw = lerp(-.35, -1.15, turn) + lerp(0, -.45, W(tt, HIT.puzzle[0], HIT.puzzle[0] + .25)) * (1 - W(tt, 2.75, 3.0));
    s.wingOpen = .5 * Math.sin(Math.PI * j);
    s.E = hopE(j > 0 && j < 1 ? 'surprised' : tt > HIT.puzzle[0] ? 'confused' : turn > .3 ? 'curious' : 'happy', tt, { look: tt > HIT.puzzle[0] ? [-.8, 0] : turn > .2 ? [-.8, .2] : [-.2, .2] });
    return s;
  }
  if (t < MID) {                                                               // rơi xuống (từ cú nhảy ra khỏi kính) rồi song tấu
    s.yaw = -.28;
    const bw = bowAt(t, DUET.hop); s.fiddle = t > HIT.duet[0] ? bw.on : 0; s.bow = bw.bow; s.hindUp = t > HIT.duet[0] ? .25 : 0;
    s.crouch = .6 * Math.sin(Math.PI * seg(t, HIT.land - .05, HIT.land + .3));
    s.E = hopE(t > HIT.duet[0] ? 'laugh' : 'excited', t, { look: [-.8, 0] });
    if (t > HIT.finale) { const f = seg(t, HIT.finale, HIT.finale + .5); s.lift = .55 * Math.sin(Math.PI * f); s.wingOpen = .6 * Math.sin(Math.PI * f); s.fiddle = 0; s.E = hopE('excited', t); }
    return s;
  }
  const enc = t > HIT.encore[0] && t < HIT.hopCover, cov = W(t, HIT.hopCover - .1, HIT.hopCover + .08) * (1 - W(t, HIT.uncover[1], HIT.uncover[1] + .15));
  s.yaw = lerp(-.28, -.35, W(t, HIT.uncover[1], HIT.uncover[1] + .3));
  if (t < HIT.encore[0]) { s.lift = .2 * Math.abs(Math.sin((t - HIT.flip[1]) * 6)) * (t < HIT.flip[1] + 1.2 ? 1 : 0); s.E = hopE('excited', t, { look: [-.8, .2] }); }
  if (enc) { const bw = bowAt(t, ENCORE.hop); s.fiddle = 1; s.bow = bw.bow; s.hindUp = .35; s.E = hopE(t > HIT.loud[0] ? 'worried' : 'excited', t, { look: [-.8, 0] }); }
  else if (t > HIT.encore[0]) s.E = hopE('happy', t, { look: [-.3, .2] });
  if (t > HIT.uncover[1]) s.lift = .45 * Math.sin(Math.PI * seg(t, HIT.uncover[1] + .1, HIT.uncover[1] + .55)) + .12 * Math.abs(Math.sin((t - HIT.uncover[1]) * 5 + 1)) * W(t, HIT.uncover[1] + .55, HIT.uncover[1] + .75) * (1 - W(t, HIT.home[0] + .6, HIT.home[1]));
  if (cov > .01) { s.earCover = cov; s.ear = cov * .6; s.E = ex(BY.hop, 'strain'); s.crouch = .3 * cov; }
  if (CH2(t)) { const bw = bowAt(t, DUET2.hop); s.yaw = -.28; s.fiddle = bw.on; s.bow = bw.bow; s.hindUp = .25; s.lift = 0; s.E = hopE('laugh', t, { look: [-.8, 0] }); }   // điệp khúc 2: kéo chân khe khẽ
  return s;
}
// Crumb trên sân khấu. Móc: thổi còi lá cỏ "PWEEET!", cười khúc khích. Song tấu: nhảy múa. Gag: "Play it again! Louder!", cười, lại nhặt lá cỏ (khung đầu)
function crumbStage(t) {
  const tt = TT(t), s = { t, x: CRW.x, k: CRK, yaw: .55, walk: 0, ph: 0, sit: 0, hop: 0, arms: ARMS.blow, E: null, q: 0, lean: 0, blade: 0, blow: 0 };
  if (t < 4 || t >= HIT.home[1] - .05) {
    const blowing = tt >= -.15 && tt < HIT.whistle[1] + .05, puff = W(tt, -.6, -.2);
    s.blade = 1 - W(tt, HIT.giggle - .2, HIT.giggle + .1); s.blow = blowing ? 1 : 0; s.lean = -.06 * (blowing ? 1 : puff);
    s.arms = s.blade > .5 ? ARMS.blow : mixArms(ARMS.blow, ARMS.tummy, W(tt, HIT.giggle - .2, HIT.giggle + .15));
    s.E = blowing || tt < 0 ? ex(BY.crumb, 'confident', { mouth: 'tiny', look: [.8, -.3], blink: 0 }) : crumbE(tt > HIT.giggle - .1 && tt < HIT.giggle + .8 ? 'laugh' : 'excited', tt, { look: [.8, -.4] });
    s.hop = tt > HIT.giggle - .1 && tt < HIT.giggle + .7 ? .06 * Math.abs(Math.sin(tt * 16)) : 0;
    return s;
  }
  if (t < MID) {                                                               // từ cú nhảy: ngước nhìn, rồi nhảy múa theo song tấu
    const d = t > HIT.duet[0] ? 1 : 0, ph = Math.floor((t - HIT.duet[0]) * 2) % 2;
    s.arms = d ? (ph ? ARMS.dance1 : ARMS.dance0) : ARMS.cheer; s.hop = d ? .12 * Math.abs(Math.sin((t - HIT.duet[0]) * Math.PI * 2)) : 0;
    s.yaw = d ? .55 + .25 * Math.sin(t * 3) : .4;
    s.E = crumbE(talkAt(t, 'crumb') ? 'excited' : d ? 'laugh' : 'surprised', t, { look: d ? [.8, -.3] : [.6, -.9] });
    return s;
  }
  if (t < HIT.encore[0]) { s.arms = ARMS.cheer; s.hop = .2 * Math.abs(Math.sin((t - HIT.flip[1]) * 7)); s.E = crumbE('excited', t, { look: [.8, -.4] }); return s; }
  if (t < HIT.chirpCover) { const ph = Math.floor((t - HIT.encore[0]) * 4) % 2; s.arms = ph ? ARMS.dance1 : ARMS.dance0; s.hop = .1 * Math.abs(Math.sin(t * 12)); s.E = crumbE(t > HIT.loud[0] ? 'surprised' : 'laugh', t, { look: [.8, -.3] }); return s; }
  if (CH2(t) && t < HIT.home[0]) {                                             // điệp khúc 2: nhảy múa khe khẽ theo nhạc
    const ph = Math.floor((t - HIT.ch2[0]) * 2) % 2; s.arms = ph ? ARMS.dance1 : ARMS.dance0; s.hop = .08 * Math.abs(Math.sin((t - HIT.ch2[0]) * Math.PI * 2)); s.yaw = .55 + .2 * Math.sin(t * 3);
    s.E = crumbE('laugh', t, { look: [.8, -.3] }); return s;
  }
  if (t < HIT.home[0]) {
    const lg = BAND(t, HIT.giggle2 - .2, HIT.giggle2 + 1.1, .2);
    s.arms = lg > .3 ? ARMS.tummy : ARMS.shrug; s.hop = .05 * lg * Math.abs(Math.sin(t * 15)); s.yaw = .55;
    s.E = crumbE(lg > .3 ? 'laugh' : t > HIT.uncover[0] ? 'happy' : 'surprised', t, { look: [.7, -.3] });
    return s;
  }
  // nhặt lá cỏ mới (cúi xuống, đứng lên), đưa lên miệng, phồng má: nối vào khung đầu
  const bend = Math.sin(Math.PI * seg(t, HIT.home[0] + .2, HIT.home[0] + 1.2)), got = W(t, HIT.home[0] + .9, HIT.home[0] + 1.4);
  s.lean = .25 * bend; s.hop = -.15 * bend; s.blade = got; s.arms = mixArms(ARMS.rest, ARMS.blow, W(t, HIT.home[0] + 1.0, HIT.home[1] - .1));
  s.E = crumbE(got > .5 ? 'confident' : 'excited', t, { look: [.8, -.3] });
  return s;
}
function stageWorld(c, t, o = {}) {
  meadowSky(c, t);
  meadowGround(c, t, { rollo: t > MID ? seg(t, HIT.rollo[0], HIT.rollo[1]) : null });
}
const HOOK = hookStack([{ text: 'HIDDEN', px: 166, fill: C.lemon, shadow: C.ink, t0: HIT.words[0] }, { text: 'EARS?!', px: 204, fill: C.pink, shadow: C.berryD, t0: HIT.words[1] }], 598);   // giữa phía trên, trên vòng kính của Miss Loupe
const HOOK_TITLE = HOOK.lines;
// nốt nhạc của song tấu (toạ độ khung): nốt rời bay lên từ nhạc cụ; mỗi hình (tim, sao, mặt cười) do 16 nốt xếp thành
const SHAPES = [['heart', HIT.heart], ['star', HIT.star], ['smile', HIT.smile]], NS = 18, SC = { x: 560, y: 495, R: 185 };
function shapeFill(c, kind, cx, cy, R) {
  const fill = kind === 'heart' ? C.pink : C.lemon, pts = [];
  if (kind === 'smile') { c.beginPath(); c.arc(cx, cy, R, 0, TAU); }
  else { for (let i = 0; i < 80; i++) pts.push(shapePt(kind, i, 80, cx, cy, R)); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); }
  c.save(); c.globalAlpha *= .55; c.fillStyle = fill; c.fill(); c.restore();
  c.strokeStyle = C.cream; c.lineWidth = 10; c.lineJoin = 'round'; c.stroke();
  if (kind === 'smile') { c.strokeStyle = 'rgba(30,27,58,.35)'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.arc(cx, cy + R * .1, R * .55, .25, Math.PI - .25); c.stroke(); for (const sd of [-1, 1]) circle(c, cx + sd * R * .38, cy - R * .3, R * .1, 'rgba(30,27,58,.35)'); }
}
function duetNotes(c, t, src) {
  const shapeOn = SHAPES.reduce((m, [, [a, b]]) => Math.max(m, BAND(t, a, b, .2)), 0);
  // nốt rời: mỗi nhịp một nốt từ Hop (nâu vàng) và Chirp (xanh chanh), bay lên, lắc lư, mờ dần
  for (const [who, list, col, kind] of [['hop', DUET.hop, N.note1, 0], ['chirp', DUET.chirp, N.note2, 1]]) list.forEach((h, i) => {
    const u = seg(t, h, h + 1.3); if (u <= 0 || u >= 1) return;
    const a = src[who], x = a[0] + (who === 'hop' ? 70 : -70) * u + 30 * Math.sin(u * 6 + i), y = a[1] - 330 * eo(u);
    c.save(); c.globalAlpha *= (1 - ss(seg(u, .5, 1))) * (1 - .6 * shapeOn); note(c, x, y, .9 + .4 * u, col, .3 * Math.sin(u * 5 + i), kind); c.restore();
  });
  // hình: một mảng màu nhạt hiện ra sau các nốt để trẻ đọc ngay hình gì
  SHAPES.forEach(([kind, [a, b]], si) => {
    const f = back(seg(t, a, a + .35), 2.2) * (1 - ss(seg(t, b - .05, b + .25)));
    if (f > 0) { c.save(); c.globalAlpha *= Math.min(1, f); const cy = SC.y + 10 * Math.sin(t * 3); c.translate(SC.x, cy); c.scale(.6 + .4 * f, .6 + .4 * f); c.translate(-SC.x, -cy); shapeFill(c, kind, SC.x, cy, SC.R); c.restore(); }
    for (let j = 0; j < NS; j++) {
      const ts = a - .55 + j * .02, u = ss(seg(t, ts, a + .15)), pop = seg(t, b - .05, b + .3); if (u <= 0 || pop >= 1) continue;
      const who = j % 2 ? 'chirp' : 'hop', from = src[who], to = shapePt(kind, j, NS, SC.x, SC.y + 10 * Math.sin(t * 3), SC.R);
      const p = arcP(from, to, u, -120), wob = 6 * Math.sin(t * 7 + j);
      c.save(); c.globalAlpha *= 1 - pop; const sc = (1 + .5 * pop) * (1 + .12 * Math.sin(Math.PI * seg(t, a + .1, a + .4)));
      note(c, p[0] + wob * u, p[1], sc * 1.05, who === 'hop' ? N.note1 : N.note2, .2 * Math.sin(t * 4 + j), j % 4 === 1 ? 1 : 0); c.restore();
    }
  });
}
// gag: nốt to dày đặc + vòng âm "TO QUÁ"
function loudNotes(c, t, src) {
  const L = BAND(t, HIT.encore[0], HIT.chirpCover + .1, .15); if (L <= 0) return;
  const dense = []; for (let h = HIT.encore[0]; h < HIT.encore[1]; h += .2) dense.push(['hop', +h.toFixed(2)], ['chirp', +(h + .1).toFixed(2)]);
  dense.forEach(([who, h], i) => {
    const u = seg(t, h, h + 1.0); if (u <= 0 || u >= 1) return;
    const a = src[who], g = W(h, HIT.encore[0], HIT.loud[1]);
    c.save(); c.globalAlpha *= (1 - u) * L;
    note(c, a[0] + (who === 'hop' ? 1 : -1) * (80 + 260 * g) * u + 20 * Math.sin(i), a[1] - (300 + 380 * g) * eo(u), 1.2 + 2.2 * g * u, who === 'hop' ? N.note1 : N.note2, .4 * Math.sin(i * 1.7), i % 2);
    c.restore();
  });
  const g = W(t, HIT.encore[0], HIT.loud[1]) * L;
  for (const [x, y] of [src.hop, src.chirp]) { c.save(); c.globalAlpha *= g; for (let k = 0; k < 3; k++) { const q = ((t * 2.2 + k / 3) % 1); c.strokeStyle = C.cream; c.lineWidth = 12 * (1 - q); c.beginPath(); c.arc(x, y, 40 + 260 * q, 0, TAU); c.stroke(); } c.restore(); }
}
// điệp khúc 2: nốt nhỏ bay lên khe khẽ từ Hop (nâu vàng) và Chirp (xanh chanh), mỗi phách một nốt
function softNotes(c, t, src) {
  for (const [who, list, col, kind] of [['hop', DUET2.hop, N.note1, 0], ['chirp', DUET2.chirp, N.note2, 1]]) list.forEach((h, i) => {
    const u = seg(t, h, h + 1.2); if (u <= 0 || u >= 1) return;
    const a = src[who], x = a[0] + (who === 'hop' ? 50 : -50) * u + 24 * Math.sin(u * 6 + i), y = a[1] - 260 * eo(u);
    c.save(); c.globalAlpha *= 1 - ss(seg(u, .5, 1)); note(c, x, y, .75 + .3 * u, col, .3 * Math.sin(u * 5 + i), kind); c.restore();
  });
}
function sStage(c, t, o = {}) {
  const cam = stageCam(t), L = lensStage(t), le = loupeStageE(t), ch = chirpStage(t), hp = hopStage(t), cr = crumbStage(t);
  const jumping = t > HIT.launch && t < HIT.land;                              // Hop đang ở trên không (vẽ ngoài, toạ độ khung)
  look(c, cam, () => {
    stageWorld(c, t);
    loupe(c, L.x, L.y, L.r, { E: le.E, rot: L.rot, pose: le.pose });
    if (L.ring > 0) ripple(c, L.x, L.y, L.r * .6, (t * 2.5) % 1, C.white, 2);
    shadow(c, ch.x + 6, STUMP.top + 4, 70, .16); chirpAt(c, ch.x, ch.y, ch.k, ch);
    if (!jumping) { shadow(c, hp.x + 6, STUMP.top + 4, 70 * (1 - .4 * Math.min(1, hp.lift)), .16); hopAt(c, hp.x, hp.y, hp.k, hp); }
    shadow(c, cr.x + 12, CRW.y + 2, 70, .18); crumbAt(c, cr.x, CRW.y, cr.k, cr);
    // móc: vòng âm từ lá cỏ tới đầu gối Chirp, bụng Hop, kính Miss Loupe (mỗi người "nghe" một chỗ)
    if (t < 4) {
      const p = seg(t, HIT.rings[0], HIT.rings[1]), src = [cr.x + 34, CRW.y - 1.35 * CRK];
      soundWaves(c, src, chirpKnee(ch), p, C.cream, 6); soundWaves(c, src, hopEar(hp), p, C.cream, 6); soundWaves(c, src, [L.x + 30, L.y + 20], p * .95, C.cream, 6);
      const r2 = seg(t, HIT.startle, HIT.startle + .9);
      if (ch.earGlow > 0) { const k = chirpKnee(ch); ripple(c, k[0], k[1], 9, r2, C.mint); }
      if (hp.ear > 0) { const e = hopEar(hp); ripple(c, e[0], e[1], 10, r2, C.mint); }
      const qa = BAND(t, HIT.puzzle[0], 3.0, .15);
      if (qa > 0) { qmark(c, ch.x - 10, ch.y - 165 - 6 * Math.sin(t * 9), .8, qa); qmark(c, hp.x + 10, hp.y - 165 - 6 * Math.sin(t * 9 + 1), .8, qa); }
    }
    if (t > MID && t < HIT.home[0]) {                                          // gag: tai ở đâu thì bịt ở đó, vòng âm nhỏ dội ra quanh chỗ bịt
      const r = BAND(t, HIT.chirpCover, HIT.loupeCover + .6, .1); if (r > 0) { const k = chirpKnee(ch), e = hopEar(hp); ripple(c, k[0], k[1] - 20, 16, (t * 3) % 1, C.cream); ripple(c, e[0], e[1], 16, (t * 3 + .4) % 1, C.cream); }
    }
    foreGrass(c, t);
  });
  seeds(c, t, 6);
  // nốt nhạc (toạ độ khung)
  const src = { hop: toScreen(cam, hp.x + 30, hp.y - 95), chirp: toScreen(cam, ch.x + 10, ch.y - 110) };
  if (t > HIT.duet[0] - .1 && t < MID) duetNotes(c, t, src);
  if (t > MID) loudNotes(c, t, src);
  if (CH2(t) || (t > HIT.ch2[0] && t < HIT.ch2[1] + 1.3)) softNotes(c, t, src);
  if (t > MID) bigWord(c, 'TOO LOUD!', 540, 330, 150, C.tang, t, HIT.chirpCover - .05, HIT.chirpCover + 2.2, { rot: -.06 });
  if (!o.noTitle && t < HIT.titleOut[1] + .05) hookTitle(c, HOOK.lines, t, { gone: W(t, HIT.titleOut[0], HIT.titleOut[1]), cy: HOOK.cy, wob: decay(t, [HIT.startle], 5) * .05 * Math.sin(t * 16) });
  return { cam, hp };
}

/* ================= KÍNH LỚN (3,8–23 s) ================= */
const lensBig = t => ({ x: 540 + 12 * Math.sin(t * 1.3), y: 690 + 10 * Math.sin(t * 1.7), r: 312 + 5 * Math.sin(t * 2.1) });
const lensCam = t => ({ cx: 560 + 8 * Math.sin(t * .4), cy: 1000 + 6 * Math.sin(t * .5), z: 1.3 });
// trong kính: điểm cảnh ở tâm kính và tỉ lệ S (px khung / px cảnh), theo nhịp của bí mật
const FOCUS = K([
  [HIT.sting[1], [700, 1052, 1.6]], [line('L02').t + .9, [695, 1050, 1.68]],                            // hai bạn đứng cạnh nhau
  [HIT.kneeGlow[0] + .3, [606, 1064, 2.7]], [HIT.kneeGlow[1], [604, 1072, 2.85]],                       // chân trước của Chirp: tai ở đầu gối
  [HIT.slide[1], [778, 1074, 2.9]], [HIT.footWag[1], [782, 1072, 2.95]],                                // chân trước của Hop: không có gì → "Nope!"
  [HIT.sweep[1], [808, 1040, 4.3]], [HIT.earOn + .3, [809, 1036, 4.7]], [HIT.chirps[1] + .3, [807, 1041, 4.2]],   // quét dọc sườn tới màng nghe
  [line('L06').t + .1, [825, 1105, 2.25]], [line('L06').t + 1.3, [827, 1103, 2.2]],                     // Crumb hỏi
  [HIT.far[0] + .3, [852, 1012, 2.0]], [HIT.far[1], [848, 1015, 2.05]],                                // châu chấu xa hát
  [HIT.stamp1 + .2, [800, 1080, 2.3]], [HIT.legUp[1], [805, 1070, 2.35]], [HIT.edge[0], [812, 1060, 2.6]], // bí mật 2: hát bằng chân
  [HIT.edge[0] + .7, [830, 1024, 3.4]], [HIT.edge[1], [832, 1026, 3.5]], [HIT.solo[0], [818, 1095, 2.25]], [HIT.stamp2, [816, 1094, 2.2]],
  [HIT.stamp2 + .4, [785, 1082, 2.1]], [HIT.crouch[1], [788, 1080, 2.2]],                               // bí mật 3: lò xo
]);
function lensView(t) { const L = lensBig(t), [px, py, S] = FOCUS(t); return { L, P: [px + 5 * Math.sin(t * .6), py + 4 * Math.sin(t * .8)], S }; }
// Chirp trong kính
function chirpLens(t) {
  const s = { x: CHW.x, y: CHW.y, k: CK, yaw: -.35, lift: 0, chirp: 0, frontR: null, earGlow: 0, ant: .3 * Math.sin(t * 2), E: null, detail: 1 };
  const kg = BAND(t, HIT.kneeGlow[0], HIT.kneeGlow[1] + .2, .25);
  if (kg > 0) { const w = Math.sin((t - HIT.kneeGlow[0]) * 9); s.frontR = [lerp(.4, .55 + .05 * w, kg), lerp(0, -.62 + .06 * w, kg), lerp(1.18, 1.38, kg)]; s.earGlow = kg; }
  const ch = HIT.chirps.reduce((m, h) => Math.max(m, BAND(t, h - .05, h + .25, .06)), 0);
  s.chirp = ch; s.lift = .05 * ch;
  s.E = chirpE(kg > .3 ? 'confident' : ch > .2 ? 'excited' : t > HIT.launch ? 'surprised' : 'happy', t, { look: kg > .3 ? [-.4, .5] : t > HIT.legUp[0] ? [.8, 0] : [.6, .1] });
  if (t > HIT.legUp[0]) s.yaw = .3;
  return s;
}
// Hop trong kính
function hopLens(t) {
  const s = { x: HPW.x, y: HPW.y, k: HK, yaw: -.35, lift: 0, crouch: 0, fiddle: 0, bow: 0, ear: 0, wingOpen: 0, hindUp: 0, frontR: null, ant: .4 * Math.sin(t * 2.4 + 1), E: null, detail: 1, pegs: false };
  // "Nope!": chân trước lắc lắc như lắc đầu
  const wag = BAND(t, HIT.footWag[0], HIT.footWag[1], .1);
  if (wag > 0) s.frontR = [.42 + .12 * Math.sin((t - HIT.footWag[0]) * 22) * wag, -.18 * wag, 1.2 + .12 * wag];
  // quét dọc sườn: xoay sườn ra máy, cánh nhấc lên như tấm rèm, màng nghe sáng; mỗi tiếng gáy / tiếng hát xa làm màng rung
  const side = W(t, HIT.sweep[0], HIT.sweep[1]);
  s.yaw = lerp(-.35, -1.12, side);
  s.wingOpen = .9 * W(t, HIT.wing[0], HIT.wing[1]) * (1 - W(t, HIT.stamp1 - .6, HIT.stamp1));
  const hits = [...HIT.chirps.map(h => h + .18), ...HIT.farRings.map(h => h + .35)];
  const buzz = hits.reduce((m, h) => Math.max(m, t >= h ? Math.exp(-(t - h) * 5) : 0), 0);
  s.ear = t > HIT.earOn - .05 && t < HIT.stamp1 ? .45 + .55 * buzz : 0;
  s.E = hopE(wag > .3 ? 'confident' : t > HIT.earOn && t < HIT.stamp1 ? (buzz > .4 ? 'excited' : 'happy') : 'happy', t, { look: wag > .3 ? [.8, .1] : t > HIT.far[0] ? [.9, -.1] : [.6, .1] });
  if (t >= HIT.stamp1) {                                                       // bí mật 2: giơ đùi sau, kéo lên xuống dọc mép cánh
    s.yaw = -1.12; const up = W(t, HIT.legUp[0], HIT.legUp[1]); s.hindUp = .35 * up;
    const bw = bowAt(t, SAWS); s.fiddle = up * (t > HIT.saw[0] - .2 && t < HIT.snap2 ? 1 : 0); s.bow = bw.bow; s.pegs = t > HIT.edge[0] && t < HIT.edge[1] + .2;
    s.E = hopE(t > HIT.solo[0] - .1 ? 'laugh' : 'confident', t, { look: [-.6, .1] });
  }
  if (t >= HIT.stamp2) {                                                       // bí mật 3: co chân (lò xo nén)
    s.yaw = lerp(-1.12, -.6, W(t, HIT.stamp2, HIT.stamp2 + .5)); s.hindUp = 0; s.fiddle = 0;
    s.crouch = W(t, HIT.crouch[0], HIT.crouch[1]); s.E = hopE(s.crouch > .4 ? 'confident' : 'happy', t, { look: [-.2, -.6] });
  }
  return s;
}
// Crumb trong kính: đứng dưới chân gốc cây, ngước lên
function crumbLens(t) {
  const s = { t, x: 548, k: CRK, yaw: .5, walk: 0, ph: 0, sit: 0, hop: 0, arms: ARMS.rest, E: null, q: 0, lean: 0 };
  if (t < HIT.walk[0]) {
    s.arms = t > line('L03').t - .2 && t < HIT.slide[0] + .4 ? ARMS.point : ARMS.rest; s.yaw = .45;
    s.E = crumbE(t > HIT.xmark && t < HIT.xmark + .6 ? 'surprised' : t > HIT.hush[0] ? 'curious' : 'excited', t, { look: [.4, -.9] }); s.lean = .08 * W(t, HIT.hush[0], HIT.hush[1]);
    return s;
  }
  if (t < HIT.walk[1]) { const u = seg(t, HIT.walk[0], HIT.walk[1]); s.x = lerp(548, 878, ss(u)); s.walk = 1; s.ph = (t - HIT.walk[0]) / .76; s.yaw = .95; s.E = crumbE('excited', t, { look: [.9, -.3] }); return s; }
  s.x = 878;
  if (t < HIT.stamp1) {
    const pat = BAND(t, HIT.tummyPat[0], HIT.tummyPat[1] + .2, .2); s.q = t > line('L06').t ? 1 : 0;
    s.arms = pat > .3 ? ARMS.tummy : ARMS.rest; s.hop = .04 * pat * Math.abs(Math.sin(t * 10)); s.yaw = .2;
    s.E = crumbE(talkAt(t, 'crumb') ? 'curious' : t > HIT.far[0] ? 'hopeful' : 'curious', t, { look: t > HIT.far[0] ? [.7, -.6] : [-.3, -.9] });
    return s;
  }
  if (t < HIT.stamp2 + .2) {                                                   // nhún theo tiếng kéo chân
    const bop = SAWS.reduce((m, h) => Math.max(m, Math.sin(Math.PI * seg(t, h, h + .25))), 0);
    s.hop = .1 * bop; s.yaw = .2 + .2 * Math.sin(t * 3); s.arms = t > HIT.solo[0] - .1 ? ARMS.dance0 : ARMS.rest; s.E = crumbE('laugh', t, { look: [-.3, -.8] });
    return s;
  }
  // bí mật 3: chạy về phía trái để nhìn cho rõ, ngước lên
  const u = seg(t, HIT.stamp2 + .3, HIT.crouch[1]); s.x = lerp(878, CRW.x, ss(u)); s.walk = u > 0 && u < 1 ? 1 : 0; s.ph = t / .4; s.yaw = u < 1 ? -.9 : .4;
  s.arms = t > HIT.launch ? ARMS.cheer : ARMS.rest; s.E = crumbE(t > HIT.launch ? 'surprised' : 'curious', t, { look: [.6, -.8] });
  return s;
}
function lensWorld(c, t) {
  meadowSky(c, t, { far: { on: BAND(t, HIT.far[0] - .4, HIT.stamp1 + .3, .3) + (t > HIT.stamp1 + .3 ? 1 : 0), saw: t > HIT.far[0] && t < HIT.far[1] ? 1 : 0 } });
  meadowGround(c, t);
  const ch = chirpLens(t), hp = hopLens(t), cr = crumbLens(t);
  shadow(c, ch.x + 6, STUMP.top + 4, 70, .16); chirpAt(c, ch.x, ch.y, ch.k, ch);
  if (t < HIT.launch) { shadow(c, hp.x + 6, STUMP.top + 4, 70, .16); hopAt(c, hp.x, hp.y, hp.k, hp); }
  shadow(c, cr.x + 12, CRW.y + 2, 70, .18); crumbAt(c, cr.x, CRW.y, cr.k, cr);
  // tai Chirp ở đầu gối: vòng sáng
  if (ch.earGlow > .05) { const k = chirpKnee(ch); c.save(); c.globalAlpha *= ch.earGlow; c.strokeStyle = C.ink; c.lineWidth = 5; c.beginPath(); c.arc(k[0], k[1], 14, 0, TAU); c.stroke(); c.strokeStyle = C.lemon; c.lineWidth = 3; c.stroke(); c.restore(); ripple(c, k[0], k[1], 9, (t * 1.6) % 1, C.mint); }
  // "Nope!": dấu X trên chân trước của Hop
  if (t > HIT.xmark && t < HIT.sweep[0] + .2) { const x = rigPt(hp.x, hp.y, hp.k, -.35, 0, [.44, -.3, 1.0]); nope(c, x[0] + 10, x[1] - 18, 14, seg(t, HIT.xmark, HIT.xmark + .3) * (1 - seg(t, HIT.sweep[0], HIT.sweep[0] + .2))); }
  // màng nghe bên bụng: vòng sáng + gợn khi có tiếng; vòng âm từ Chirp (trái) và từ hai châu chấu xa (phải) bay tới
  if (t > HIT.earOn - .1 && t < HIT.stamp1) {
    const e = hopEar(hp), on = W(t, HIT.earOn - .1, HIT.earOn + .25);
    c.save(); c.globalAlpha *= on; c.strokeStyle = C.lemon; c.lineWidth = 2.5; c.beginPath(); c.arc(e[0], e[1], 13 + 1.5 * Math.sin(t * 8), 0, TAU); c.stroke(); c.restore();
    for (const h of HIT.chirps) { soundWaves(c, chirpKnee(ch), e, seg(t, h, h + .3), C.cream, 2.5, 3); ripple(c, e[0], e[1], 9, seg(t, h + .15, h + .75), C.mint); }
    for (const h of HIT.farRings) { soundWaves(c, [FAR[0].x - 10, FAR[0].y - 14], e, seg(t, h, h + .45), C.cream, 3, 3); ripple(c, e[0], e[1], 9, seg(t, h + .3, h + .9), C.mint); }
    const rv = seg(t, HIT.earOn, HIT.earOn + .5); if (rv > 0 && rv < 1) star(c, e[0] + 16, e[1] - 14, 10 * Math.sin(Math.PI * rv), C.white);
  }
  // bí mật 2: mép cánh nơi đùi cọ vào loé sáng mỗi nhát; vòng âm toả ra từ chỗ cọ
  if (t > HIT.legUp[0] && t < HIT.snap2 + .2) {
    const m = rigPt(hp.x, hp.y, hp.k, hp.yaw, 0, [.36, -1.1 - hp.hindUp * .15, -.7]);
    for (const h of SAWS) { const q = seg(t, h, h + .45); if (q > 0 && q < 1) { ripple(c, m[0], m[1], 10, q, C.cream, 2); } }
    const eg = BAND(t, HIT.edge[0], HIT.edge[1], .2);
    if (eg > 0) { const a = rigPt(hp.x, hp.y, hp.k, hp.yaw, 0, [.3, -1.18, -.15]), b = rigPt(hp.x, hp.y, hp.k, hp.yaw, 0, [.3, -1.12, -1.1]); c.save(); c.globalAlpha *= eg * (.6 + .4 * Math.sin(t * 14)); c.strokeStyle = C.lemon; c.lineWidth = 5; c.setLineDash([9, 6]); c.lineDashOffset = -t * 40; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore();
      // mũi tên lên–xuống chỉ đường đùi kéo
      const p = rigPt(hp.x, hp.y, hp.k, hp.yaw, 0, [.5, -1.45, -.8]); c.save(); c.globalAlpha *= eg; for (const sd of [-1, 1]) { const y0 = p[1] + sd * (22 + 4 * Math.sin(t * 10)); c.fillStyle = C.ink; c.beginPath(); c.moveTo(p[0] - 14, y0); c.lineTo(p[0] + 14, y0); c.lineTo(p[0], y0 + sd * 19); c.closePath(); c.fill(); c.fillStyle = C.lemon; c.beginPath(); c.moveTo(p[0] - 9, y0 + sd * 2.5); c.lineTo(p[0] + 9, y0 + sd * 2.5); c.lineTo(p[0], y0 + sd * 14.5); c.closePath(); c.fill(); } c.restore(); }
    if (t > HIT.solo[0] - .05) HIT.solo.forEach((h, i) => { const u = seg(t, h, h + 1.0); if (u > 0 && u < 1) { c.save(); c.globalAlpha *= 1 - u; note(c, m[0] + 20 + 30 * u, m[1] - 20 - 90 * u, .45, N.note1, .2, i % 2); c.restore(); } });
  }
  // bí mật 3: lò xo cạnh chân sau nén lại
  const cs = BAND(t, HIT.stamp2 + .6, HIT.launch + .08, .2);
  if (cs > 0) coil(c, hp.x + 62, STUMP.top + 2, 22, 70, hp.crouch, cs);
}
function loupeLensE(t) {
  const talk = talkAt(t);
  const surprised = t > HIT.xmark - .05 && t < HIT.xmark + .3 || t > HIT.launch && t < HIT.launch + .5;
  const name = surprised ? 'surprised' : talk ? (singExpr(t) || 'explaining') : t > HIT.earOn && t < HIT.earOn + .7 || t > HIT.solo[0] && t < HIT.snap2 ? 'laugh' : 'happy';
  return ex(BY.loupe, name, { talk, look: [.15, .35], blink: talk ? 0 : blinkAt(t) });
}
function sLens(c, t) {
  const V = lensView(t);
  look(c, lensCam(t), () => { meadowSky(c, t); meadowGround(c, t, { noStump: true }); });   // ngoài kính lớn: chỉ có bãi cỏ (nhân vật ở trong kính)
  loupe(c, V.L.x, V.L.y, V.L.r, {
    E: loupeLensE(t), rot: -.05, pose: ARM.peer, mag: +V.S.toFixed(3), pan: +V.P[0].toFixed(1),     // (11/2026b) độ phóng và lia trong kính, cho qa_musical.py
    inside: cc => { cc.translate(V.L.x, V.L.y); cc.scale(V.S, V.S); cc.translate(-V.P[0], -V.P[1]); lensWorld(cc, t); },
  });
  // chữ (toạ độ khung)
  bigWord(c, 'NOPE!', 290, 470, 130, C.berry, t, HIT.xmark, HIT.xmark + 1.95, { rot: -.08 });
  bigWord(c, 'TUMMY!', 700, 470, 130, C.lemon, t, HIT.xmark + 1.97, HIT.xmark + 4.0, { rot: .05 });
  return V;
}
// Hop trong lúc nhảy ra khỏi kính (toạ độ khung): từ chỗ của nó trong kính, vọt lên đỉnh khung, rồi rơi xuống đúng chỗ trên gốc cây ở cảnh rộng
function hopFlight(t) {
  const V = lensView(HIT.launch), a = [V.L.x + (HPW.x - V.P[0]) * V.S, V.L.y + (HPW.y - V.P[1]) * V.S], ka = HK * V.S;
  const cam = stageCam(HIT.land), b = toScreen(cam, HPW.x, HPW.y), kb = HK * cam.z;
  const u = seg(t, HIT.launch, HIT.land), up = ei(seg(u, 0, .35)), dn = seg(u, .35, 1);
  let x, y, k;
  if (u < .35) { x = lerp(a[0], 640, up); y = lerp(a[1], 860, up); k = lerp(ka, 170, up); }
  else { const v = dn * dn; x = lerp(640, b[0], dn); y = lerp(860, b[1], v); k = lerp(170, kb, dn); }
  return { x, y, k, rot: -.25 * Math.sin(Math.PI * u), wing: Math.sin(Math.PI * Math.min(1, u * 1.3)) };
}
// cú nhảy: máy ngước theo Hop lên trời (cảnh kính trôi xuống), rồi cúi xuống cảnh rộng (cảnh rộng trôi lên)
function sJump(c, t) {
  const v1 = ei(seg(t, HIT.launch, HIT.pull[0] + .2)), v2 = 1 - eo(seg(t, HIT.pull[0] + .2, HIT.pull[1] + .25));
  const g = c.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, N.sky0); g.addColorStop(1, '#D7F3FF'); c.fillStyle = g; c.fillRect(0, 0, 1080, 1920);
  for (const [x, y, s] of [[200, 400, 1], [820, 900, .8], [400, 1500, 1.1]]) { const yy = y + (t < HIT.pull[0] + .2 ? 1 : -1) * 900 * (t < HIT.pull[0] + .2 ? v1 : v2); c.fillStyle = C.cream; c.beginPath(); for (const [a, b, r] of [[-70, 10, 52], [0, -14, 70], [74, 8, 50]]) { c.moveTo(x + a * s + r * s, yy + b * s); c.arc(x + a * s, yy + b * s, r * s, 0, TAU); } c.fill(); }
  let cam = null;
  if (t < HIT.pull[0] + .2) { c.save(); c.translate(0, 1950 * v1); sLens(c, t); c.restore(); }
  else { c.save(); c.translate(0, 1950 * v2); cam = sStage(c, t).cam; c.restore(); }
  // vệt tốc độ
  const sp = Math.sin(Math.PI * seg(t, HIT.launch, HIT.pull[1] + .2));
  if (sp > .05) for (let i = 0; i < 9; i++) { const x = 80 + i * 115, y = (t * 2600 + i * 377) % 2100 - 100; c.save(); c.globalAlpha = .35 * sp; c.strokeStyle = C.white; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 140); c.stroke(); c.restore(); }
  return cam;
}
function drawHopFlight(c, t) {
  if (t < HIT.launch || t >= HIT.land) return;
  const f = hopFlight(t);
  c.save(); c.translate(f.x, f.y - f.k * .8); c.rotate(f.rot); c.translate(-f.x, -(f.y - f.k * .8));
  hopAt(c, f.x, f.y, f.k, { yaw: -.55, lift: .45 * f.wing, wingOpen: .8 * f.wing, E: ex(BY.hop, 'excited') });
  c.restore();
}

/* ---------- sticker ---------- */
function art1(cc) {                                               // "Tummy ears!": Hop nghiêng, màng nghe sáng, vòng sóng
  drawChar(cc, BY.hop, { x: 6, y: 52, k: 74, yaw: -1.1, showFx: false, detail: 1, expr: ex(BY.hop, 'happy', { look: [.6, 0] }), pose: { ear: 1, wingOpen: .8 } });
  const e = rigPt(6, 52, 74, -1.1, 0, BY.hop.ear(1));
  cc.strokeStyle = C.lemon; cc.lineWidth = 5; for (const r of [18, 30]) { cc.beginPath(); cc.arc(e[0], e[1], r, -1.1, 1.1); cc.stroke(); cc.beginPath(); cc.arc(e[0], e[1], r, Math.PI - 1.1, Math.PI + 1.1); cc.stroke(); }
}
function art2(cc) {                                               // "Leg song!": Hop kéo chân, nốt nhạc
  drawChar(cc, BY.hop, { x: 4, y: 50, k: 66, yaw: -1.1, showFx: false, detail: 1, expr: ex(BY.hop, 'laugh'), pose: { fiddle: 1, bow: 1.3, hindUp: .35, pegs: true } });
  note(cc, 52, -58, .9, N.note1, .2, 0); note(cc, -48, -66, .8, N.note1, -.2, 1);
}
function art3(cc) {                                               // "Spring legs!": Hop đang nhảy, lò xo bên dưới
  coil(cc, 0, 92, 30, 60, 0, 1);
  drawChar(cc, BY.hop, { x: 0, y: 30, k: 62, yaw: -.6, showFx: false, expr: ex(BY.hop, 'excited'), pose: { lift: .6, wingOpen: .7 } });
}
const FILLS = [{ t: HIT.stamp1, fill: N.sky1, draw: art1, r0: 100 }, { t: HIT.stamp2, fill: C.skyL, draw: art2, r0: 100 }, { t: HIT.stamp3, fill: C.lemon, draw: art3, r0: 100 }];
const SLOTS = [{ x: 380, y: 232, r: 52 }, { x: 540, y: 232, r: 52 }, { x: 700, y: 232, r: 52 }];

/* ================= SỔ (28,65–33,1 s) ================= */
const PAGE = { x: 56, y: 190, w: 968, h: 760 }, P = [{ x: 228, y: 430, r: 118 }, { x: 540, y: 430, r: 118 }, { x: 852, y: 430, r: 118 }];
const LABELS = ['Tummy ears!', 'Leg song!', 'Spring legs!'], DIVE = { x: 540, y: 800 }, MINI = { x: 540, y: 800, r: 78 }, AL = { x: 250, y: 1450, k: 240 };
function albumHop(t) {                                            // Hop nhảy tưng tưng vào từ phải, nhún tại chỗ, nhảy vào trang đúng "go!" (toạ độ khung)
  if (t < HIT.hopIn[0] || t >= HIT.plunge[1]) return null;
  const H0 = [1250, 1180], H1 = [940, 1180], H2 = [720, 1180];
  if (t < HIT.hopIn[1]) { const u = seg(t, HIT.hopIn[0], HIT.hopIn[1]), first = u < .5, v = first ? u * 2 : u * 2 - 1, p = arcP(first ? H0 : H1, first ? H1 : H2, v, 150); return { x: p[0], y: p[1], k: 95, yaw: -.6, rot: 0, lift: .4 * Math.sin(Math.PI * v), crouch: 0 }; }
  if (t < HIT.plunge[0]) { const q = t - HIT.hopIn[1]; return { x: H2[0], y: H2[1] - 30 * Math.abs(Math.sin(q * 6)), k: 95, yaw: lerp(-.6, -.3, Math.min(1, q * 2)), rot: 0, lift: 0, crouch: .5 * W(t, HIT.plunge[0] - .3, HIT.plunge[0]) }; }
  const u = seg(t, HIT.plunge[0], HIT.plunge[1]), p = arcP(H2, [DIVE.x, DIVE.y + 30], u, 320); return { x: p[0], y: p[1], k: lerp(95, 34, ei(u)), yaw: -.5, rot: -.9 * ei(u), lift: .5, crouch: 0 };
}
function miniArt(cc) { drawChar(cc, BY.hop, { x: 0, y: 34, k: 44, yaw: -.5, showFx: false, expr: ex(BY.hop, 'laugh') }); }
function sAlbum(c, t) {
  const push = 1 + .05 * Math.sin(Math.PI * seg(t, HIT.gulp - .05, HIT.gulp + .6));
  c.save(); c.translate(540, 700); c.scale(push, push); c.translate(-540, -700);
  ground(c, N.sky0); ell(c, 200, 1760, 900, 420, 0, N.hay0); ell(c, 540, 1730, 980, 330, 0, N.hay1); ell(c, 540, 1770, 900, 280, 0, N.hayD);
  rrect(c, PAGE.x + 12, PAGE.y + 18, PAGE.w, PAGE.h, 54, C.grape); rrect(c, PAGE.x, PAGE.y, PAGE.w, PAGE.h, 54, C.cream);
  P.forEach((S, i) => {
    circle(c, S.x, S.y, S.r + 4, '#EBDDBC');
    const shown = i === 2 ? t >= HIT.zoomOut[0] : t >= HIT.slotsDown[1];
    if (!shown) return;
    const st = i === 2 ? HIT.stamp3 : HIT.slotsDown[1], p = t >= st ? back(seg(t, st, st + .22), 2.6) : 1;
    badge(c, S.x, S.y, S.r, FILLS[i].fill, cc => { const k = S.r / 100; cc.scale(k, k); FILLS[i].draw(cc); }, [-.05, .04, -.03][i], t >= st ? lerp(1.18, 1, p) : 1);
    popText(c, LABELS[i], S.x, S.y + S.r + 70, 44, C.ink, null, t, st + .05, { step: .015, font: subFont });
  });
  const rq = seg(t, HIT.gulp, HIT.gulp + .8);
  if (rq > 0 && rq < 1) for (let k = 0; k < 3; k++) { const q = clamp(rq * 1.4 - k * .2); if (q > 0 && q < 1) { c.strokeStyle = `rgba(255,216,74,${.9 * (1 - q)})`; c.lineWidth = 12 * (1 - q) + 2; c.beginPath(); c.ellipse(DIVE.x, DIVE.y, 60 + 260 * q, 26 + 90 * q, 0, 0, TAU); c.stroke(); } }
  if (t >= HIT.mini) badge(c, MINI.x, MINI.y, MINI.r, C.lemon, miniArt, .06, back(seg(t, HIT.mini, HIT.mini + .3), 2.6));
  const talk = talkAt(t, 'albie'), b = albumHop(t);
  shadow(c, AL.x + 18, AL.y + 4, 220, .18);
  albumGulp(c, t, { x: AL.x, y: AL.y, k: AL.k, talk, line: line('L14'), counts: HIT.counts, tg: HIT.gulp, look: b ? [.75, -.2] : [.5, -.7], blink: talk ? 0 : blinkAt(t, .4) });
  if (b) {
    if (b.lift < .05) shadow(c, b.x + 8, b.y + 4, 80, .16);
    c.save(); c.translate(b.x, b.y - b.k * .6); c.rotate(b.rot); c.translate(-b.x, -(b.y - b.k * .6));
    hopAt(c, b.x, b.y, b.k, { yaw: b.yaw, lift: b.lift, crouch: b.crouch, wingOpen: .5 * b.lift, E: ex(BY.hop, t > HIT.plunge[0] ? 'excited' : 'laugh', { look: [-.8, -.3] }) });
    c.restore();
  }
  c.restore();
}

/* ---------- chuyển cảnh ---------- */
const stageLensScreen = t => { const cam = stageCam(t), L = lensStage(t), p = toScreen(cam, L.x, L.y); return { x: p[0], y: p[1], r: L.r * cam.z * .86 }; };
function matchCut(c, t) {
  stickerMatchCut(c, t, { t0: HIT.zoomIn[0], t1: HIT.zoomOut[0], t2: HIT.zoomOut[1], lens: stageLensScreen(HIT.zoomIn[0]), from: cc => sStage(cc, HIT.zoomIn[0]), to: (cc, tt) => sAlbum(cc, tt),
    slot: P[2], fill: C.lemon, draw: cc => { cc.scale(P[2].r / 100, P[2].r / 100); art3(cc); }, rim: C.berry });
}
function recallTitle(c, t) { hookTitle(c, HOOK.lines, -1, { gone: 1 - back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: HOOK.cy }); }
function pageFlip(c, t) {
  const u = ss(seg(t, HIT.flip[0], HIT.flip[1])), w = 1080 * (1 - u);
  sStage(c, Math.max(t, HIT.flip[1]));
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
function lensSnap(c, t) { for (const h of [HIT.snap1, HIT.snap2]) if (t >= h && t < h + .35) snapFlash(c, t, h, lensBig(t)); }
const hookLensScreen = () => { const cam = stageCam(HIT.sting[0]), L = lensStage(HIT.sting[0]), p = toScreen(cam, L.x, L.y); return { x: p[0], y: p[1], r: L.r * cam.z }; };

export function drawFilm(c, t) {
  t = clamp(t, 0, DUR - .001);
  c.save();
  if (t >= HIT.flip[1]) sStage(c, t);
  else if (t >= HIT.flip[0]) pageFlip(c, t);
  else if (t >= HIT.zoomOut[1]) sAlbum(c, t);
  else if (t >= HIT.zoomIn[0]) matchCut(c, t);
  else if (t >= HIT.pull[1] + .25) { sStage(c, t); if (t >= HIT.snap3 && t < HIT.snap3 + .35) snapFlash(c, t, HIT.snap3, stageLensScreen(t)); }
  else if (t >= HIT.launch) sJump(c, t);
  else if (t >= HIT.sting[0]) { sLens(c, t); lensSnap(c, t); titleSting(c, t, { t0: HIT.sting[0], t1: HIT.sting[1], from: hookLensScreen() }); flyToSlot(c, t); }
  else sStage(c, t);
  drawHopFlight(c, t);
  bigWord(c, 'BOING!', 310, 425, 130, C.lemon, t, HIT.launch, HIT.launch + 2.05, { rot: -.1 });
  stickerSlots(c, t, { t0: HIT.slots, slots: SLOTS, fills: FILLS, to: { t0: HIT.slotsDown[0], t1: HIT.slotsDown[1], slots: P } });
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t, 510, SAFE.subY);
  c.restore();
}
