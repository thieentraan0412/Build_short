// SHORT-016 · Where Do Bugs Go When It Snows? — mọi khung hình là hàm thuần của t (chuẩn 11/2026b, _shared/QUALITY.md §8).
// Phim phát vòng lặp: móc và kết là cùng một vườn tuyết; cuối phim bông tuyết lớn rơi về phía kính của Miss Loupe, đúng khung đầu.
// Tập A 45 s: logo 0,8 s lồng vào cú lao vào kính (titleSting), ô sticker "1 2 3" (stickerSlots), kính lớn có máy trôi, câu cửa miệng
// có hành động (albumGulp), phụ đề có từ nhấn ở vùng an toàn (SAFE.subY). Nhân vật v2, mặt luôn vui. Dot ra mắt ở tập này.
import { LOOK } from '/_shared/characters/look.js';
LOOK.v = 2;            // phong cách nhân vật v2
LOOK.cheer = true;     // mặt nhân vật luôn vui tươi (QUALITY.md §5)
import { C, circle, ell, rrect, popText, subFont, clamp, lerp, seg, back, eo, TAU, ground, nope } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { makeTalk, blinkAt, ex, look, toScreen, loupe, ARM, badge, shadow, subtitle, LENS_UP, hookTitle, hookStack, stickerMatchCut, snapFlash, SAFE,
  titleSting, stickerSlots, flyBadge, albumGulp } from '/_shared/episode.js';
import { W, GY, bigWord, qmark, ripple, snowflake, snowfall, winterSky, winterGround, HIVE, ballCenter, hiveBox, beeBall, heatWave, monarch,
  MAP, mapPt, mapPage, TREES, labelTag, ROCK, LEAF, rock, bigLeaf, poof, ladybugPile, pilePt, sleepyLadybug } from './props.js';
import { LINES, CARDS, DUR, HIT, DOTCOUNT, ALBCOUNT, GULP } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const line = id => LINES.find(l => l.id === id);
// ba con bọ rùa được đếm, từ trái sang phải, cách xa nhau (18/11/2026: trước đó số 3 nằm sát số 1, hai số cùng hiện đọc thành "13")
const COUNTBUG = [0, 8, 4];
const lineAt = t => LINES.find(l => t >= l.t && t < l.t + l.dur);
const W01 = (t, a, b) => ss(seg(t, a, b));                                        // 0→1 êm trong [a, b]
const BAND = (t, a, b, f = .2) => ss(seg(t, a, a + f)) * (1 - ss(seg(t, b - f, b)));   // 0→1→0
const decay = (t, list, k = 6) => list.reduce((s, h) => s + (t >= h ? Math.exp(-(t - h) * k) : 0), 0);
const arcP = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];
const TT = t => (t > 40 ? t - DUR : t);                                           // giờ của móc kéo về trước điểm lặp (t âm = cuối phim)
// biểu cảm theo kiểu hát (QUALITY.md §8): hát trọn → excited · nửa hát → happy · sing-talk / nói → explaining
const singExpr = t => { const l = lineAt(t); if (!l || l.who !== 'loupe') return null; const m = l.sung ? l.sung.mode : 'speak'; return m === 'sing' ? 'excited' : m === 'half-sing' ? 'happy' : 'explaining'; };

/* ================= bố cục sân khấu (toạ độ cảnh) ================= */
const LW = { x: 730, r: 92 }, LX2 = 765, AB = { x: 505, k: 118 }, DOTK = 52, DOTL = 62;
const lensY = r => GY - LENS_UP * r;
const SC = { pose: {}, scarf: true };
const HUG = { handL: [.28, -1.18, .78], handR: [-.28, -1.12, .78], elbowL: [-.78, -1.0, .55], elbowR: [.78, -1.0, .55] };
const withScarf = p => ({ ...(p || {}), scarf: true });

/* ---------- nhân vật ---------- */
function albieS(c, x, y, k, o = {}) {
  return drawChar(c, BY.albie, { x, y, k, yaw: o.yaw ?? .32, showFx: false, expr: o.E || ex(BY.albie, 'happy'),
    pose: { hop: o.hop || 0, tilt: o.tilt || 0, tabsUp: o.tabsUp || 0, page: o.page || null, pageCurl: o.curl ?? .3, scarf: true } });
}
function dotAt(c, x, y, k, o = {}) {
  return drawChar(c, BY.dot, { x, y, k, yaw: o.yaw ?? .25, showFx: false, expr: o.E || ex(BY.dot, 'happy'), pose: { lift: o.lift || 0, scarf: o.scarf ?? true, legsUp: o.legsUp || null } });
}
function waggleAt(c, x, y, k, o = {}) {
  return drawChar(c, BY.waggle, { x, y, k, yaw: o.yaw ?? .3, showFx: false, expr: o.E || ex(BY.waggle, 'happy'), pose: { lift: o.lift ?? 0, wing: o.wing || 0, wag: o.wag || 0 } });
}

/* ================= SÂN KHẤU VƯỜN TUYẾT ================= */
const HOOKCAM = K([[-2.5, [628, 1092, 1.38]], [0, [628, 1092, 1.4]], [1.0, [624, 1088, 1.44]], [2.0, [632, 1090, 1.47]], [2.9, [640, 1084, 1.52]]]);
// lúc kính thu về / bung ra: máy đặt sao cho kính của Miss Loupe nằm đúng chỗ kính lớn (540, 760)
const lensCamAt = (lx, ly, z) => ({ cx: lx, cy: ly + 260 / z, z });
function stageCam(t) {
  let cam;
  if (t < 3.2 || t >= HIT.home[1]) { const [cx, cy, z] = HOOKCAM(TT(t)); cam = { cx, cy, z }; }
  else if (t < 20.0) {                                                          // bí mật 2: kính thu về → hai bạn → "Nope!" → lao vào trang của Albie
    const u = ei(seg(t, HIT.lensDown[0], HIT.lensDown[1])), L0 = lensCamAt(LW.x, lensY(LW.r), 3.4);
    const A = K([[HIT.lensDown[1], [628, 1110, 1.42]], [14.6, [636, 1112, 1.48]], [15.0, [675, 1118, 1.66]], [15.45, [650, 1116, 1.6]]])(t);
    cam = t < HIT.lensDown[1] ? { cx: lerp(L0.cx, 628, u), cy: lerp(L0.cy, 1110, u), z: lerp(3.4, 1.42, u) } : { cx: A[0], cy: A[1], z: A[2] };
    if (t >= HIT.mapOpen[0]) { const v = ei(seg(t, HIT.mapOpen[0], HIT.mapOpen[1])); cam = { cx: lerp(cam.cx, AB.x + 20, v), cy: lerp(cam.cy, GY - 1.0 * AB.k, v), z: lerp(cam.z, 4.2, v) }; }
  } else if (t < 26.85) {                                                       // điệp khúc 1 → lia sang đống lá
    const A = K([[20.0, [628, 1100, 1.36]], [22.0, [634, 1096, 1.42]], [23.9, [640, 1094, 1.46]], [24.6, [810, 1120, 1.6]], [26.6, [818, 1116, 1.68]]])(t);
    cam = { cx: A[0], cy: A[1], z: A[2] };
  } else if (t < 27.25) {                                                       // vào kính lớn trên chiếc lá
    const u = ei(seg(t, 26.85, 27.25)), L1 = lensCamAt(LX2, lensY(LW.r), 3.4);
    cam = { cx: lerp(818, L1.cx, u), cy: lerp(1116, L1.cy, u), z: lerp(1.68, 3.4, u) };
  } else {                                                                      // gag → điệp khúc 2 → CTA → về khung đầu
    const A = K([[HIT.flip[1], [828, 1286, 2.7]], [39.9, [826, 1284, 2.75]], [40.2, [834, 1286, 2.95]], [40.9, [836, 1284, 2.9]],
      [41.5, [668, 1105, 1.4]], [42.1, [660, 1102, 1.4]], [45.2, [668, 1104, 1.44]], [45.8, [690, 1150, 1.7]], [46.4, [680, 1140, 1.62]], [HIT.home[1], [628, 1092, 1.38]]])(t);
    cam = { cx: A[0], cy: A[1], z: A[2] };
  }
  const sh = decay(t, [HIT.brrr[0], HIT.plop[1]], 9) + .6 * BAND(t, HIT.trees[0], HIT.trees[1], .2);
  return { cx: cam.cx + 6 * Math.sin(t * 47) * sh, cy: cam.cy + 5 * Math.sin(t * 39) * sh, z: cam.z };
}
// Miss Loupe trên sân khấu: vị trí, kính, biểu cảm, tay
function loupeStage(t) {
  const tt = TT(t), talk = talkAt(t), sx = singExpr(t);
  let x = LW.x, rot = -.08 + .03 * Math.sin(tt * 1.7), pose = {}, name = 'happy', lookD = [.3, .2], hop = 0;
  if (t < 3.2 || t >= HIT.home[1]) {                                            // móc: rùng mình → ngó trái, ngó phải → nhún vai "?"
    const br = BAND(tt, HIT.brrr[0], HIT.brrr[1], .08), lL = BAND(tt, HIT.lookL[0], HIT.lookL[1], .15), lR = BAND(tt, HIT.lookR[0], HIT.lookR[1], .15);
    rot += .06 * Math.sin(tt * 70) * br + .28 * lL - .26 * lR + .1 * W01(tt, HIT.raise, 3.0);
    pose = br > .2 ? HUG : tt > HIT.puzzle[0] ? (tt > HIT.raise ? ARM.peer : ARM.shrug) : ARM.peer;
    name = br > .3 ? 'surprised' : talk ? 'happy' : tt > HIT.puzzle[0] ? 'curious' : 'happy';
    lookD = lL > .3 ? [-.85, .1] : lR > .3 ? [.85, .1] : br > .3 ? [0, -.6] : [.2, .2];
    if (tt < 0) { lookD = [.1, -.7]; name = 'curious'; }                       // cuối phim: ngước nhìn bông tuyết đang rơi
  } else if (t < 20.0) {                                                        // bí mật 2 trên sân khấu
    const nopeT = line('L06').t;
    rot += t > nopeT && t < nopeT + .9 ? .2 * Math.sin((t - nopeT) * 18) : 0;    // "Nope!": kính lắc như lắc đầu
    pose = t > nopeT - .1 && t < nopeT + 1 ? ARM.point : talkAt(t, 'albie') ? ARM.shrug : ARM.peer;
    name = sx || (talkAt(t, 'albie') ? 'curious' : 'happy'); lookD = talkAt(t, 'albie') ? [-.8, .1] : [-.4, .1];
  } else if (t < 27.25) {                                                       // điệp khúc 1 (nhún nhảy) → nhảy sang đống lá, hát hỏi
    const dance = t < 24.0, ph = (t - 21.0) * 124 / 60;
    hop = dance ? .14 * Math.abs(Math.sin(ph * Math.PI)) : .5 * Math.sin(Math.PI * seg(t, HIT.hopTo[0], HIT.hopTo[1]));
    x = lerp(LW.x, LX2, W01(t, HIT.hopTo[0], HIT.hopTo[1])); rot += dance ? .08 * Math.sin(ph * Math.PI) : .12 * W01(t, 25.0, 26.6);
    pose = dance ? (Math.floor(ph) % 2 ? ARM.wave : ARM.up) : t > 25.0 ? ARM.peer : ARM.point;
    name = sx || (dance ? 'laugh' : 'curious'); lookD = dance ? [-.5, 0] : [.8, .4];
  } else {                                                                      // gag → điệp khúc 2 → CTA ôm → về chỗ cũ
    x = t < HIT.home[0] ? LX2 : lerp(LX2, LW.x, W01(t, HIT.home[0], HIT.home[1]));
    hop = t > HIT.home[0] ? .3 * Math.sin(Math.PI * seg(t, HIT.home[0], HIT.home[1])) : 0;
    const nopeT = line('L14').t, ch2 = t >= line('L15').t && t < line('L15').t + line('L15').dur, ph = (t - line('L15').t) * 124 / 60;
    rot += t > nopeT && t < nopeT + .9 ? .2 * Math.sin((t - nopeT) * 18) : 0;
    if (ch2) { hop = .14 * Math.abs(Math.sin(ph * Math.PI)); rot += .08 * Math.sin(ph * Math.PI); }
    const hug = BAND(t, HIT.hug[0], HIT.hug[1], .2);
    pose = hug > .3 ? HUG : ch2 ? (Math.floor(ph) % 2 ? ARM.wave : ARM.up) : t > nopeT - .1 && t < nopeT + 1 ? ARM.point : t < 40 ? ARM.shrug : ARM.peer;
    name = sx || (hug > .3 ? 'laugh' : t > HIT.giggle && t < 42 ? 'laugh' : t < nopeT ? 'curious' : 'happy');
    lookD = t > line('L16').t - .1 && t < HIT.home[0] ? [0, 0] : t < 41.5 ? [.75, .35] : [-.4, 0];
  }
  const ly = lensY(LW.r) - hop * LW.r;
  return { x, y: ly, r: LW.r, rot, pose: withScarf(pose), E: ex(BY.loupe, name, { talk, look: lookD, blink: talk ? 0 : blinkAt(t) }) };
}
// Albie trên sân khấu
function albieStage(t) {
  const tt = TT(t), talk = talkAt(t, 'albie');
  let x = AB.x, hop = 0, tilt = 0, tabs = 0, name = 'happy', lookD = [.5, -.2], page = null;
  if (t < 3.2 || t >= HIT.home[1]) {
    const sh = BAND(tt, HIT.albieShiver[0], HIT.albieShiver[1], .1); tilt = .05 * Math.sin(tt * 60) * sh; tabs = .5 * sh;
    name = tt > HIT.puzzle[0] ? 'curious' : sh > .3 ? 'surprised' : 'happy'; lookD = tt > HIT.puzzle[0] ? [-.6, -.3] : [.6, -.4];
  } else if (t < 20.0) {
    hop = .3 * Math.sin(Math.PI * seg(t, HIT.lensDown[1] - .2, HIT.lensDown[1] + .25));
    tilt = talk ? .04 * Math.sin(t * 6) : 0; tabs = talk ? .4 : 0;
    name = talk ? 'curious' : t > line('L06').t ? 'surprised' : 'happy'; lookD = [.7, -.2];
    if (t > HIT.mapOpen[0] - .3) { page = [.9, -1.4, -.4]; tabs = 1; name = 'excited'; }
  } else if (t < 27.25) {
    const ph = (t - 21.0) * 124 / 60, dance = t > 20.9 && t < 24.0;
    hop = dance ? .16 * Math.abs(Math.sin(ph * Math.PI + .5)) : 0; tilt = dance ? .1 * Math.sin(ph * Math.PI) : 0; tabs = dance ? .6 : 0;
    name = dance ? 'laugh' : 'curious'; lookD = dance ? [.6, -.2] : [.9, 0];
  } else {
    const g = BAND(t, HIT.giggle - .1, HIT.giggle + .9, .15), ch2 = t >= line('L15').t && t < line('L15').t + line('L15').dur, ph = (t - line('L15').t) * 124 / 60;
    x = lerp(AB.x, 615, W01(t, HIT.hug[0], HIT.hug[0] + .35)) ; x = lerp(x, AB.x, W01(t, HIT.home[0], HIT.home[1]));
    hop = .06 * g * Math.abs(Math.sin(t * 16)) + (ch2 ? .16 * Math.abs(Math.sin(ph * Math.PI + .5)) : 0) + .3 * Math.sin(Math.PI * seg(t, HIT.hug[0], HIT.hug[0] + .35)) + .3 * Math.sin(Math.PI * seg(t, HIT.home[0], HIT.home[1]));
    tilt = ch2 ? .1 * Math.sin(ph * Math.PI) : -.12 * BAND(t, HIT.hug[0] + .3, HIT.hug[1], .2);
    name = g > .3 ? 'laugh' : ch2 ? 'excited' : BAND(t, HIT.hug[0], HIT.hug[1]) > .3 ? 'laugh' : 'happy';
    lookD = t > line('L16').t - .1 && t < HIT.home[0] ? [0, 0] : [.7, -.1];
  }
  return { x, hop, tilt, tabs, page, E: ex(BY.albie, name, { talk, look: lookD, blink: talk ? 0 : blinkAt(t, .4) }) };
}
// Dot trên sân khấu: ló chấm cam dưới lá (khung đầu); gag: chui ra, vươn vai, hỏi, "Nope!" → kéo lá trùm lên, lặn mất
function dotStage(t) {
  const out = t > 30 ? W01(t, HIT.dotOut[0], HIT.dotOut[1]) * (1 - W01(t, HIT.dive[0], HIT.dive[1])) : 0;
  const st = BAND(t, HIT.stretch[0], HIT.stretch[1], .2);
  return { out, lift: .2 * st, legsUp: st > .3 ? [[-.42, -.95, .8], 0, 0, [.42, -.95, .8], 0, 0] : null,
    E: ex(BY.dot, talkAt(t, 'dot') ? 'happy' : st > .3 ? 'laugh' : 'happy', { talk: talkAt(t, 'dot'), look: [-.6, -.2], blink: st > .3 ? .6 : blinkAt(t, .2) }) };
}
function leafStage(t) { return t > 30 ? .35 * BAND(t, HIT.dotOut[0] - .1, HIT.plop[0], .25) : 0; }
function stageWorld(c, t, o = {}) {
  winterSky(c, t, o); winterGround(c, t, o);
  hiveBox(c, HIVE.x, HIVE.y, HIVE.s, o.heat || 0, t);
  rock(c, ROCK.x, ROCK.y, .62, o.heat || 0);
}
// đống lá: Dot (chấm cam ló ra) + chiếc lá; khi Dot chui ra thì cô đứng trên đống lá
function leafSpot(c, t, d, lift) {
  const dx = LEAF.x - 10, dy = LEAF.y + 6, under = d.out < .02 || t > HIT.plop[0];
  if (d.out < .02) dotAt(c, LEAF.x - 34, dy - 14, DOTK, { E: ex(BY.dot, 'happy', { closed: 1 }), yaw: .5 });   // vòm lưng cam của Dot ló trên mép chiếc lá (khung đầu và sau gag)
  else if (under) { const y = dy - 46 * d.out + 30 * (1 - d.out); dotAt(c, dx, y, DOTK, { E: d.E, lift: d.lift, legsUp: d.legsUp, yaw: .3 }); }
  bigLeaf(c, LEAF.x, LEAF.y, .62, lift, t);
  if (!under) { const y = dy - 46 * d.out + 30 * (1 - d.out); dotAt(c, dx, y, DOTK, { E: d.E, lift: d.lift, legsUp: d.legsUp, yaw: .3 }); }
}
const HOOK = hookStack([{ text: 'BUGS IN', px: 172, fill: C.lemon, shadow: C.ink, t0: HIT.words[0] }, { text: 'SNOW?!', px: 230, fill: C.cream, shadow: C.berryD, t0: HIT.words[1] }], 'mid');
function sStage(c, t, o = {}) {
  const cam = stageCam(t), L = loupeStage(t), A = albieStage(t), d = dotStage(t);
  look(c, cam, () => {
    stageWorld(c, t);
    leafSpot(c, t, d, leafStage(t));
    shadow(c, A.x + 14, GY + 4, 92, .16); albieS(c, A.x, GY, AB.k, { E: A.E, hop: A.hop, tilt: A.tilt, tabsUp: A.tabs, page: A.page });
    shadow(c, L.x + 8, GY + 4, 80, .16);
    loupe(c, L.x, L.y, L.r, { E: L.E, rot: L.rot, pose: L.pose, inside: o.inside ? cc => o.inside(cc, L) : null });
    // móc: dấu hỏi trên hai bạn
    const qa = t < 4 ? BAND(t, HIT.puzzle[0], 3.0, .15) : 0;
    if (qa > 0) { qmark(c, L.x - 20, L.y - 140 - 6 * Math.sin(t * 9), .9, qa); qmark(c, A.x + 10, GY - 2.3 * AB.k - 6 * Math.sin(t * 9 + 1), .9, qa); }
    // "Nope!": dấu X cạnh kính
    for (const h of [HIT.xmark, line('L14').t + .05]) if (t > h && t < h + 1.0) nope(c, L.x + 120, L.y - 60, 34, seg(t, h, h + .3) * (1 - seg(t, h + .75, h + 1.0)));
    // gag: kéo lá trùm lên, tuyết trên lá bung ra
    if (t > 40) poof(c, LEAF.x + 10, LEAF.y - 50, 62, seg(t, HIT.plop[1], HIT.plop[1] + .7));
    snowfall(c, t, { x0: cam.cx - 800, x1: cam.cx + 800, y0: cam.cy - 1100, h: 2300, n: 46, k: 1 });
  });
  snowfall(c, t * 1.3 + 3, { n: 14, k: 1.9, col: 'rgba(255,255,255,.75)' });                  // lớp tuyết gần máy (toạ độ khung)
  if (!o.noTitle && t < 3.2) hookTitle(c, HOOK.lines, t, { gone: W01(t, HIT.titleOut[0], HIT.titleOut[1]), cy: HOOK.cy, wob: decay(t, [HIT.brrr[0]], 5) * .05 * Math.sin(t * 16) });
  return { cam, L, A };
}
// bông tuyết lớn: cuối phim rơi về phía kính, khung 0 vừa chạm kính, rồi tan dần (toạ độ khung)
function bigFlake(c, t) {
  const cam = stageCam(t), L = loupeStage(t), p = toScreen(cam, L.x + 18, L.y - L.r * .55);
  if (t >= HIT.flakeFall[0]) { const u = seg(t, HIT.flakeFall[0], DUR), y = lerp(-80, p[1], ss(u)); snowflake(c, p[0] + 60 * Math.sin(u * 5) * (1 - u), y, 36, t * 1.5); }
  else if (t < 1.3) { const m = 1 - seg(t, .5, 1.3); c.save(); c.globalAlpha *= m; snowflake(c, p[0], p[1], 36 * (.6 + .4 * m), 0); c.restore(); if (t < .6) ripple(c, p[0], p[1], 30, seg(t, 0, .6), C.white); }
}

/* ================= KÍNH LỚN (bí mật 1: tổ ong, kính ấm; bí mật 3: đống lá) ================= */
const lensBig = t => ({ x: 540 + 10 * Math.sin(t * 1.3), y: 700 + 8 * Math.sin(t * 1.7), r: 330 + 5 * Math.sin(t * 2.1) });   // mặt Miss Loupe trên tấm phụ đề
const lensCam = t => ({ cx: 560 + 8 * Math.sin(t * .4), cy: 1080 + 6 * Math.sin(t * .5), z: 1.3 });
const [BX, BY0] = ballCenter();
const BEEFOCUS = K([
  [HIT.sting[1], [HIVE.x + 6, 1265, 1.45]], [line('L02').t + 1.0, [HIVE.x + 4, 1268, 1.62]], [HIT.heatTwist[0], [HIVE.x, 1270, 1.7]],
  [HIT.heatOn[1], [HIVE.x, 1272, 1.85]], [7.2, [BX, BY0 + 6, 2.3]], [8.9, [BX, BY0, 2.7]], [HIT.deep[1], [BX, BY0 + 2, 6.0]],
  [10.6, [BX - 4, BY0 + 3, 6.2]], [11.0, [BX + 6, BY0 - 2, 6.4]], [HIT.snap1, [BX + 8, BY0 - 3, 6.5]],
]);
const heatAt = t => W01(t, HIT.heatOn[0], HIT.heatOn[1]);
const shakeAt = t => HIT.shakes.reduce((m, h) => Math.max(m, BAND(t, h - .03, h + .2, .05)), 0);
function beeWorld(c, t, P, S) {
  const h = heatAt(t);
  if (h < 1) { stageWorld(c, t); snowfall(c, t, { x0: P[0] - 500, x1: P[0] + 500, y0: P[1] - 700, h: 1400, n: 40, k: .7 }); }
  if (h > 0) {
    c.save(); c.globalAlpha *= h; stageWorld(c, t, { heat: 1 }); snowfall(c, t, { x0: P[0] - 500, x1: P[0] + 500, y0: P[1] - 700, h: 1400, n: 40, k: .7, col: 'rgba(160,150,240,.6)' }); c.restore();
    const sk = shakeAt(t), deep = W01(t, HIT.deep[0], HIT.deep[1]);
    beeBall(c, BX, BY0, 58, t, { heat: h, beat: sk, detail: deep, hole: deep > .3 ? 22 : 0 });
    for (const s of HIT.shakes) heatWave(c, BX, BY0, 12, seg(t, s, s + .9));
    if (deep > .02) {                                                           // Waggle ở tâm quả bóng: đứng yên, ngực rung theo từng nhịp
      c.save(); c.globalAlpha *= deep;
      const jx = .9 * Math.sin(t * 90) * sk;
      circle(c, BX, BY0, 21 + 2 * sk, W.hot3);
      waggleAt(c, BX + jx, BY0 + 13, 15, { lift: 0, wing: 0, wag: .2 * sk, yaw: .35, E: ex(BY.waggle, sk > .3 ? 'excited' : 'laugh', { look: [.3, .2] }) });
      c.strokeStyle = C.ink; c.lineWidth = 1.1; c.lineCap = 'round';
      if (sk > .2) for (const sd of [-1, 1]) for (let k = 0; k < 2; k++) { const r0 = 17 + k * 3.5; c.beginPath(); c.arc(BX, BY0 + 2, r0, sd > 0 ? -.5 : Math.PI - .5, sd > 0 ? .5 : Math.PI + .5); c.stroke(); }
      c.restore();
    }
  }
}
function loupeLensE(t, mode) {
  const talk = talkAt(t), sx = singExpr(t);
  const name = sx || (mode === 'lady' && t > HIT.lift[0] && t < HIT.lift[1] + .5 ? 'surprised' : mode === 'bees' && t > HIT.heatOn[0] && t < HIT.heatOn[1] + .4 ? 'surprised' : 'happy');
  return ex(BY.loupe, name, { talk, look: [.15, -.5], blink: talk ? 0 : blinkAt(t) });
}
function sLensBees(c, t) {
  const L = lensBig(t), [px, py, S] = BEEFOCUS(t), P = [px + 4 * Math.sin(t * .6), py + 3 * Math.sin(t * .8)];
  look(c, lensCam(t), () => { winterSky(c, t); winterGround(c, t); snowfall(c, t, { n: 50 }); });
  const tw = BAND(t, HIT.heatTwist[0] - .05, HIT.heatTwist[1] + .1, .08);
  loupe(c, L.x, L.y, L.r, {
    E: loupeLensE(t, 'bees'), rot: -.05 + .12 * Math.sin((t - HIT.heatTwist[0]) * 14) * tw, pose: withScarf(tw > .2 ? ARM.point : ARM.peer), mag: S, pan: P[0],
    inside: cc => { cc.translate(L.x, L.y); cc.scale(S, S); cc.translate(-P[0], -P[1]); beeWorld(cc, t, P, S); },
  });
  // kính ấm bật: vòng màu quét quanh vành, chữ "WARM VIEW"
  const sw = seg(t, HIT.heatOn[0], HIT.heatOn[1] + .2);
  if (sw > 0 && sw < 1) { c.save(); c.strokeStyle = W.hot1; c.lineWidth = 22; c.lineCap = 'round'; c.beginPath(); c.arc(L.x, L.y, L.r + 6, -Math.PI / 2, -Math.PI / 2 + TAU * ss(sw)); c.stroke(); c.restore(); }
  bigWord(c, 'WARM VIEW!', 540, 380, 104, W.hot1, t, HIT.heatOn[0] + .1, HIT.heatOn[0] + 2.6, { rot: -.05 });
  bigWord(c, 'HEATER BEES!', 540, 380, 104, C.lemon, t, HIT.shakes[0] - .25, HIT.snap1 + .1, { rot: -.05 });   // thuật ngữ của nguồn (UMD), lời hát nói "Some bees"
  return L;
}
// bí mật 3: kính lớn trên chiếc lá
const LADYFOCUS = K([
  [27.2, [LEAF.x - 20, LEAF.y - 40, 2.3]], [HIT.lift[1], [LEAF.x - 12, LEAF.y - 50, 2.55]], [28.0, [LEAF.x - 10, LEAF.y - 62, 2.85]],
  [29.8, [LEAF.x - 12, LEAF.y - 60, 2.95]], [30.6, [LEAF.x - 60, LEAF.y - 40, 3.1]], [31.8, [LEAF.x + 40, LEAF.y - 42, 3.1]], [HIT.yawn[0], [LEAF.x - 10, LEAF.y - 58, 3.05]],
  [HIT.snap3, [LEAF.x - 10, LEAF.y - 52, 3.1]],
]);
const PILEO = { x: LEAF.x - 10, y: LEAF.y + 2, k: 1 };
function ladyDot(t) {
  const up = W01(t, HIT.dotUp[0], HIT.dotUp[1]) * (1 - W01(t, HIT.burrow[0], HIT.burrow[1])), yawn = BAND(t, HIT.yawn[0], HIT.yawn[1] + .2, .15);
  const cnt = DOTCOUNT.reduce((m, h) => Math.max(m, BAND(t, h - .05, h + .3, .08)), 0);
  return { up, y: PILEO.y - 52 * up + 30 * (1 - up), lift: .2 * Math.sin(Math.PI * seg(t, HIT.dotUp[0], HIT.dotUp[1] + .2)) + .08 * cnt,
    legsUp: yawn > .3 ? [[-.42, -.95, .8], 0, 0, [.42, -.95, .8], 0, 0] : cnt > .3 ? [0, 0, 0, [.42, -.9, .85], 0, 0] : null,
    E: ex(BY.dot, talkAt(t, 'dot') ? 'excited' : yawn > .3 ? 'laugh' : up > .5 ? 'happy' : 'happy', { talk: talkAt(t, 'dot'), look: [-.5, -.3], blink: yawn > .3 ? .7 : blinkAt(t, .2), mouth: yawn > .3 ? 'shout' : undefined }) };
}
function ladyWorld(c, t) {
  stageWorld(c, t);
  const lift = W01(t, HIT.lift[0], HIT.lift[1]) * (1 - W01(t, HIT.burrow[1] - .1, HIT.snap3 + .05) * .0), d = ladyDot(t);
  const glow = PILEO && DOTCOUNT.map((h, i) => BAND(t, h, h + 1.0, .1));
  const gl = []; COUNTBUG.forEach((pi, i) => { gl[pi] = glow[i]; });
  ladybugPile(c, PILEO.x, PILEO.y, PILEO.k, t, { glow: gl, skip: 7 });
  if (d.up > .02) dotAt(c, PILEO.x, d.y, DOTL, { E: d.E, lift: d.lift, legsUp: d.legsUp, yaw: .3 });
  else { c.save(); c.beginPath(); c.rect(PILEO.x - 90, PILEO.y - 220, 180, 214); c.clip(); dotAt(c, PILEO.x, PILEO.y + 22, DOTL, { E: ex(BY.dot, 'happy', { closed: 1 }), yaw: .2 }); c.restore(); }
  bigLeaf(c, LEAF.x, LEAF.y, .62, lift, t);
  snowfall(c, t, { x0: LEAF.x - 400, x1: LEAF.x + 400, y0: LEAF.y - 600, h: 1200, n: 26, k: .6 });
}
function sLensLady(c, t) {
  const L = lensBig(t), [px, py, S] = LADYFOCUS(t), P = [px + 4 * Math.sin(t * .6), py + 3 * Math.sin(t * .8)];
  look(c, lensCam(t), () => { winterSky(c, t); winterGround(c, t); snowfall(c, t, { n: 50 }); });
  loupe(c, L.x, L.y, L.r, {
    E: loupeLensE(t, 'lady'), rot: -.05, pose: withScarf(ARM.peer), mag: S, pan: P[0],
    inside: cc => { cc.translate(L.x, L.y); cc.scale(S, S); cc.translate(-P[0], -P[1]); ladyWorld(cc, t); },
  });
  // số đếm của Dot (toạ độ khung, trên đúng con bọ rùa trong kính)
  const toLens = (wx, wy) => [L.x + (wx - P[0]) * S, L.y + (wy - P[1]) * S];
  COUNTBUG.forEach((pi, i) => {
    const h = DOTCOUNT[i]; if (t < h || t > h + 1.6) return;
    const [qx, qy] = toLens(...pilePt(PILEO.x, PILEO.y, PILEO.k, pi));
    c.save(); c.globalAlpha *= 1 - ss(seg(t, h + 1.3, h + 1.6)); popText(c, String(i + 1), qx, qy - 70, 96, C.lemon, C.ink, t, h, { sh: 6 }); c.restore();
  });
  bigWord(c, 'SO MANY!', 540, 380, 116, C.tang, t, DOTCOUNT[2] + .45, DOTCOUNT[2] + 2.65, { rot: .05 });
  return L;
}

/* ================= BẢN ĐỒ (bí mật 2) ================= */
const MAPCAM = K([[HIT.mapOpen[1], [540, 980, 1.0]], [16.6, [540, 1010, 1.0]], [18.0, [500, 1880, 1.0]], [HIT.arrive, [470, 1960, 1.05]],
  [HIT.trees[0], [450, 2050, 1.3]], [HIT.trees[1], [440, 2080, 1.62]], [20.0, [440, 2085, 1.66]]]);
const FLOCK = [...Array(9)].map((_, i) => ({ d: .1 * i - .02 * (i % 3), off: [-60, 30, -15, 70, -80, 10, 55, -35, 40][i], s: [1.25, 1, 1.1, .95, 1.15, 1.05, .9, 1.2, 1][i] }));
const flockU = (t, f) => clamp((t - HIT.flight[0] - f.d) / (HIT.arrive - HIT.flight[0]));
function sMap(c, t, o = {}) {
  const [cx, cy, z] = MAPCAM(t), cam = { cx, cy, z };
  ground(c, W.paper);
  const orange = W01(t, HIT.trees[0], HIT.trees[1]), lead = flockU(t, FLOCK[0]);
  look(c, cam, () => {
    mapPage(c, t, { orange, dash: clamp(lead * 1.05) });
    FLOCK.forEach((f, i) => {
      const u = flockU(t, f); if (u <= 0) return;
      const [x, y, a] = mapPt(u), nx = -Math.sin(a), ny = Math.cos(a), bob = 14 * Math.sin(t * 6 + i);
      const land = W01(t, HIT.arrive + .05 * i - .2, HIT.arrive + .05 * i + .4), tr = TREES[i % TREES.length], tx = MAP.forest.x + tr[0], ty = MAP.forest.y + tr[1] - 50;
      const px = lerp(x + nx * f.off + bob * .3, tx, land), py = lerp(y + ny * f.off + bob, ty, land);
      monarch(c, px, py, f.s * lerp(.62, .32, land), t * 7 + i * .7, a - Math.PI / 2 + .25 * Math.sin(t * 3 + i), { eyes: true });
    });
  });
  if (o.bare) return cam;
  // nhãn (toạ độ khung, để readcheck đo): miền đông Bắc Mỹ ở đầu, Mexico khi tới nơi
  const n1 = BAND(t, HIT.mapOpen[1] - .05, 19.0, .2); if (n1 > 0) { c.save(); c.globalAlpha *= n1; labelTag(c, 'EASTERN NORTH AMERICA', 560, 560, 48, C.ink, C.lemon); c.restore(); }
  const n3 = BAND(t, 16.45, 19.45, .2); if (n3 > 0) { c.save(); c.globalAlpha *= n3; labelTag(c, 'up to 3,000 miles!', 720, 1160, 46, C.ink, C.cream); c.restore(); }
  const n2 = W01(t, 17.75, 18.05); if (n2 > 0) { const p = toScreen(cam, MAP.forest.x + 40, MAP.forest.y + 230); labelTag(c, 'MEXICO', p[0], Math.min(p[1], 1290), 72, C.cream, C.berry); }
  // Miss Loupe đứng trước tấm bản đồ, chỉ theo đàn bướm và hát (người nói có trên hình)
  const talk = talkAt(t), sx = singExpr(t), lx = 205, ly = 1085 - 10 * Math.abs(Math.sin(t * 3));
  shadow(c, lx + 8, ly + LENS_UP * 96, 70, .2);
  loupe(c, lx, ly, 96, { E: ex(BY.loupe, sx || 'happy', { talk, look: [.7, -.5], blink: talk ? 0 : blinkAt(t) }), rot: .12, pose: withScarf(ARM.point) });
  return cam;
}
// lao vào trang của Albie (sân khấu → bản đồ) và gập lại (bản đồ → sân khấu)
function mapIn(c, t) {
  sStage(c, t, { noTitle: true });
  const v = ss(seg(t, HIT.mapOpen[0] + .25, HIT.mapOpen[1])); if (v <= 0) return;
  c.save(); c.globalAlpha *= v; const k = lerp(.25, 1, v); c.translate(540, 960); c.scale(k, k); c.translate(-540, -960); sMap(c, HIT.mapOpen[1], { bare: true }); c.restore();
}
function mapOut(c, t) {
  sStage(c, t, { noTitle: true });
  const v = 1 - ss(seg(t, HIT.back[0], HIT.back[1])); if (v <= 0) return;
  const cam = stageCam(t), A = toScreen(cam, AB.x, GY - AB.k);
  c.save(); c.globalAlpha *= Math.min(1, v * 1.5); const k = lerp(.12, 1, v); c.translate(lerp(A[0], 540, v), lerp(A[1], 960, v)); c.scale(k, k); c.translate(-540, -960); sMap(c, HIT.back[0], { bare: true }); c.restore();
}

/* ---------- sticker ---------- */
function art1(cc) { cc.fillStyle = W.coldA; cc.fillRect(-120, -120, 240, 240); beeBall(cc, 0, 6, 64, 0, { heat: 1, detail: 1, n: 30, hole: 20 }); waggleAt(cc, 0, 24, 17, { E: ex(BY.waggle, 'laugh') }); }
function art2(cc) { cc.strokeStyle = C.berry; cc.lineWidth = 9; cc.setLineDash([2, 22]); cc.lineCap = 'round'; cc.beginPath(); cc.moveTo(60, -70); cc.quadraticCurveTo(10, 0, -50, 70); cc.stroke(); cc.setLineDash([]); monarch(cc, 0, -6, 1.05, .1, -.25, { eyes: true }); }
function art3(cc) { ladybugPile(cc, 0, 50, 1.3, 0, {}); dotAt(cc, 0, 44, 50, { E: ex(BY.dot, 'happy', { closed: 1 }) }); bigLeaf(cc, -10, 6, .55, .55, 0); }
const FILLS = [{ t: HIT.stamp1, fill: W.coldA, draw: art1, r0: 100 }, { t: HIT.stamp2, fill: C.skyL, draw: art2, r0: 100 }, { t: HIT.stamp3, fill: C.mintL, draw: art3, r0: 100 }];
const SLOTS = [{ x: 380, y: 232, r: 52 }, { x: 540, y: 232, r: 52 }, { x: 700, y: 232, r: 52 }];
// điệp khúc 1: ô nào ứng với từ đang hát thì nảy lên (ô 3 còn trống: dấu "?" lắc)
function slotBounce(c, t) {
  const l = line('L08'); if (t < l.t || t > l.t + l.dur + .2) return;
  const ns = l.sung.notes, at = w => l.t + ns.find(n => n.w === w).t;
  [[0, at(0)], [1, at(1)], [2, at(4)]].forEach(([i, h]) => {
    const p = Math.sin(Math.PI * seg(t, h, h + .4)); if (p <= 0) return;
    const S = SLOTS[i]; c.save(); c.strokeStyle = C.lemon; c.lineWidth = 8; c.beginPath(); c.arc(S.x, S.y, S.r * (1.15 + .25 * p), 0, TAU); c.stroke(); c.restore();
    if (i === 2) qmark(c, S.x + 54, S.y - 40 - 20 * p, .7, p);
  });
}
// điệp khúc 2: ba sticker bật lên trên đầu hai bạn theo từng từ khoá
function chorusBadges(c, t) {
  const l = line('L15'); if (t < l.t || t > HIT.hug[1]) return;
  const ns = l.sung.notes, at = w => l.t + ns.find(n => n.w === w).t;
  [[0, at(0), 330], [1, at(1), 540], [2, at(4), 750]].forEach(([i, h, x]) => {
    if (t < h) return;
    const p = back(seg(t, h, h + .35), 2.4), fade = 1 - ss(seg(t, HIT.hug[1] - .3, HIT.hug[1]));
    c.save(); c.globalAlpha *= fade; badge(c, x, 400 + 8 * Math.sin(t * 4 + i), 92, FILLS[i].fill, cc => { cc.scale(.92, .92); FILLS[i].draw(cc); }, [-.06, .03, -.04][i], p); c.restore();
  });
}

/* ================= SỔ (33,8–38,2 s) ================= */
const PAGE = { x: 56, y: 190, w: 968, h: 760 }, P3 = [{ x: 228, y: 430, r: 118 }, { x: 540, y: 430, r: 118 }, { x: 852, y: 430, r: 118 }];
const LABELS = ['Huddle!', 'Fly away!', 'Hide!'], AL = { x: 250, y: 1450, k: 240 };
function sAlbum(c, t) {
  const push = 1 + .05 * Math.sin(Math.PI * seg(t, GULP - .05, GULP + .6)) + .03 * W01(t, GULP - .65, GULP - .05);
  c.save(); c.translate(540, 700); c.scale(push, push); c.translate(-540, -700);
  ground(c, W.sky); ell(c, 200, 1760, 900, 420, 0, W.snowS); ell(c, 540, 1730, 980, 330, 0, W.snow); ell(c, 540, 1770, 900, 280, 0, W.snowD);
  snowfall(c, t, { n: 30 });
  rrect(c, PAGE.x + 12, PAGE.y + 18, PAGE.w, PAGE.h, 54, C.grape); rrect(c, PAGE.x, PAGE.y, PAGE.w, PAGE.h, 54, C.cream);
  P3.forEach((S, i) => {
    circle(c, S.x, S.y, S.r + 4, '#EBDDBC');
    const shown = i === 2 ? t >= HIT.zoomOut[0] : t >= HIT.slotsDown[1];
    if (!shown) return;
    const st = i === 2 ? HIT.stamp3 : HIT.slotsDown[1], p = t >= st ? back(seg(t, st, st + .22), 2.6) : 1;
    badge(c, S.x, S.y, S.r, FILLS[i].fill, cc => { const k = S.r / 100; cc.scale(k, k); FILLS[i].draw(cc); }, [-.05, .04, -.03][i], t >= st ? lerp(1.18, 1, p) : 1);
    popText(c, LABELS[i], S.x, S.y + S.r + 70, 46, C.ink, null, t, st + .05, { step: .015, font: subFont });
  });
  const rq = seg(t, GULP, GULP + .8);
  if (rq > 0 && rq < 1) for (let k = 0; k < 3; k++) { const q = clamp(rq * 1.4 - k * .2); if (q > 0 && q < 1) { c.strokeStyle = `rgba(255,216,74,${.9 * (1 - q)})`; c.lineWidth = 12 * (1 - q) + 2; c.beginPath(); c.ellipse(540, 760, 60 + 260 * q, 26 + 90 * q, 0, 0, TAU); c.stroke(); } }
  const talk = talkAt(t, 'albie');
  shadow(c, AL.x + 18, AL.y + 4, 220, .18);
  albumGulp(c, t, { x: AL.x, y: AL.y, k: AL.k, talk, line: line('L12'), counts: ALBCOUNT, tg: GULP, look: [.55, -.6], blink: talk ? 0 : blinkAt(t, .4) });
  c.restore();
}

/* ---------- chuyển cảnh ---------- */
function matchCut(c, t) {
  stickerMatchCut(c, t, { t0: HIT.zoomIn[0], t1: HIT.zoomOut[0], t2: HIT.zoomOut[1], lens: lensBig(HIT.zoomIn[0]), from: cc => sLensLady(cc, HIT.zoomIn[0]), to: (cc, tt) => sAlbum(cc, tt),
    slot: P3[2], fill: C.mintL, draw: cc => { cc.scale(P3[2].r / 100, P3[2].r / 100); art3(cc); }, rim: C.berry });
}
function recallTitle(c, t) { hookTitle(c, HOOK.lines, -1, { gone: 1 - back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: HOOK.cy }); }
function pageFlip(c, t) {
  const u = ss(seg(t, HIT.flip[0], HIT.flip[1])), w = 1080 * (1 - u);
  sStage(c, Math.max(t, HIT.flip[1]));
  c.save(); c.beginPath(); c.rect(0, 0, w, 1920); c.clip(); sAlbum(c, t); c.restore();
  c.fillStyle = 'rgba(30,27,58,.22)'; c.fillRect(w, 0, 34 * (1 - u), 1920);
  rrect(c, w - 60 * Math.sin(Math.PI * u), 0, 60 * Math.sin(Math.PI * u) + 2, 1920, 0, C.cream);
}
// kính của Miss Loupe trên sân khấu (toạ độ khung) lúc logo lao vào
const hookLensScreen = () => { const cam = stageCam(HIT.sting[0] - .01), L = loupeStage(HIT.sting[0] - .01), p = toScreen(cam, L.x, L.y); return { x: p[0], y: p[1], r: L.r * cam.z }; };
function flyToSlot(c, t) {
  const u1 = seg(t, HIT.fly1[0], HIT.fly1[1]); if (u1 > 0 && u1 < 1) { const L = lensBig(HIT.fly1[0]); flyBadge(c, u1, { x: L.x, y: L.y, r: L.r * .8 }, SLOTS[0], FILLS[0].fill, FILLS[0].draw, 100); }
  const u2 = seg(t, HIT.fly2[0], HIT.fly2[1]); if (u2 > 0 && u2 < 1) flyBadge(c, u2, { x: 470, y: 900, r: 230 }, SLOTS[1], FILLS[1].fill, FILLS[1].draw, 100);
}
// kính lớn thu về sân khấu (bí mật 1 → 2): máy lùi ra từ chính kính của Miss Loupe; trong kính vẫn là tổ ong nhiệt
const stageInsideBees = (cc, L) => { const S = 2.6; cc.translate(L.x, L.y); cc.scale(S, S); cc.translate(-BX, -BY0); beeWorld(cc, HIT.snap1, [BX, BY0], S); };
const stageInsideLeaf = (cc, L) => { const S = 2.3; cc.translate(L.x, L.y); cc.scale(S, S); cc.translate(-(LEAF.x - 20), -(LEAF.y - 40)); ladyWorld(cc, 27.2); };

export function drawFilm(c, t, o = {}) {                                       // o.noSub: ảnh bìa không có phụ đề
  t = clamp(t, 0, DUR - .001);
  c.save();
  if (t >= HIT.flip[1]) sStage(c, t);
  else if (t >= HIT.flip[0]) pageFlip(c, t);
  else if (t >= HIT.zoomOut[1]) sAlbum(c, t);
  else if (t >= HIT.zoomIn[0]) matchCut(c, t);
  else if (t >= 27.25) { sLensLady(c, t); if (t >= HIT.snap3 && t < HIT.snap3 + .35) snapFlash(c, t, HIT.snap3, lensBig(t)); }
  else if (t >= 26.85) sStage(c, t, { inside: stageInsideLeaf });
  else if (t >= HIT.back[1]) sStage(c, t);
  else if (t >= HIT.back[0]) mapOut(c, t);
  else if (t >= HIT.mapOpen[1]) { sMap(c, t); if (t >= HIT.snap2 && t < HIT.snap2 + .35) snapFlash(c, t, HIT.snap2, { x: 470, y: 900, r: 260 }); }
  else if (t >= HIT.mapOpen[0]) mapIn(c, t);
  else if (t >= HIT.lensDown[0]) sStage(c, t, { inside: t < HIT.lensDown[1] + .1 ? stageInsideBees : null });
  else if (t >= HIT.sting[0]) { sLensBees(c, t); if (t >= HIT.snap1 && t < HIT.snap1 + .35) snapFlash(c, t, HIT.snap1, lensBig(t)); titleSting(c, t, { t0: HIT.sting[0], t1: HIT.sting[1], from: hookLensScreen() }); }
  else sStage(c, t);
  if (t < 3.2 || t >= HIT.flakeFall[0]) bigFlake(c, t);
  bigWord(c, 'MILLIONS!', 560, 400, 128, W.mon, t, HIT.trees[0] + .05, HIT.back[1], { rot: -.05 });
  flyToSlot(c, t);
  stickerSlots(c, t, { t0: HIT.slots, slots: SLOTS, fills: FILLS, to: { t0: HIT.slotsDown[0], t1: HIT.slotsDown[1], slots: P3 } });
  slotBounce(c, t);
  chorusBadges(c, t);
  if (t >= HIT.recall) recallTitle(c, t);
  const card = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (card && !o.noSub) subtitle(c, card, t, 510, SAFE.subY);
  c.restore();
}
