// SHORT-004 · Ants Sniff With Their Antennae! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp: khung cuối mở về khung đầu.
import { C, REC, circle, ell, capsule, rrect, poly, ground, rays, popText, sticker, nope, subFont, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { hookTitle, stickerMatchCut, snapFlash } from '/_shared/episode.js';
import { makeTalk, blinkAt, ex, rigPt, look, loupe, zoomIn, ARM, albieAt, badge, shadow, subtitle, LENS_UP } from '/_shared/episode.js';
import { iceCream, workerAnt, antTip, aphid, honeydew, tinyMap, soil, grassTuft, pebble, cloud, cookie, web } from './props.js';
import { at, BEAT, SECS, IRIS, LINES, CARDS, DUR, HIT } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const secBy = id => SECS.find(s => s.id === id);
const LX = 540, LY = 860;                                       // chỗ kính đứng khi nở thành cảnh sau (như SHORT-001)
const lineOf = id => LINES.find(l => l.id === id);

/* ---------- Crumb: kiến con hổ phách, râu dấu hỏi; luôn vác vật to hơn mình ---------- */
const FEET = [[-.4, 0, .3], [-.48, 0, -.1], [.4, 0, .3], [.48, 0, -.1]];
const UP_ARMS = { armL: [-.32, -2.5, .25], armR: [.32, -2.5, .25] };
function crumbAt(c, x, y, k, o = {}) {
  const w = o.walk || 0, ph = o.ph || 0;
  const feet = FEET.map((f, i) => { const s = Math.sin(ph * TAU + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)); return [f[0], -Math.max(0, s) * .14 * w, f[2] + s * .16 * w]; });
  const pose = { carry: null, q: o.q ?? 0, lift: (o.hop || 0) + Math.abs(Math.sin(ph * TAU)) * .04 * w, bodyLean: o.lean || 0, feet, ...(o.arms || UP_ARMS), ...(o.prop ? { prop: o.prop } : {}) };
  return drawChar(c, BY.crumb, { x, y, k, yaw: o.yaw ?? .7, flip: !!o.flip, showFx: false, expr: o.E || ex(BY.crumb, 'happy'), pose });
}
const crumbE = (name, t, o = {}) => ex(BY.crumb, name, { talk: talkAt(t, 'crumb'), blink: talkAt(t, 'crumb') ? 0 : blinkAt(t, .6), ...o });
// đỉnh đầu của Crumb (để đặt vụn bánh vác trên đầu) và đầu râu (để soi kính)
const crumbTop = (x, y, k, hop = 0) => [x, y - (2.55 + hop) * k];
const crumbAnt = (x, y, k, o = {}) => rigPt(x, y, k, o.yaw ?? .7, 0, [.22, -2.38 - (o.hop || 0), .34]).map((v, i) => i === 0 && o.flip ? 2 * x - v : v);

/* ---------- The Giant: một ngón tay khổng lồ thò xuống từ trên ---------- */
function finger(c, x, y, k, t, o = {}) {                         // tilt: nghiêng cả cánh tay (ra từ góc trên phải)
  const wig = Math.sin(t * 9) * .12 + (o.dip || 0) * .08;
  c.save(); c.translate(x, y); c.rotate(o.tilt || 0); c.translate(-x, -y);
  drawChar(c, BY.giant, { x, y, k, showFx: false, pose: { part: 'hand', gesture: 'point', rot: [Math.PI, 0, wig] } });
  c.restore();
}
function sniffLines(c, x, y, s, p) {                            // ba vạch "khịt khịt" cong
  if (p <= 0 || p >= 1) return; c.strokeStyle = C.cream; c.lineCap = 'round'; c.lineWidth = s * .12 * (1 - p);
  for (let i = 0; i < 3; i++) { const a = -.9 + i * .5, r = s * (.8 + .5 * p); c.beginPath(); c.arc(x, y, r, a - .25, a + .25); c.stroke(); }
}

/* ---------- vườn ban ngày, sát mặt đất ---------- */
function garden(c, t, o = {}) {
  const y0 = o.y0 ?? 1180, x0 = o.x0 ?? -800, x1 = o.x1 ?? 1900;
  ground(c, C.sky); rays(c, o.sunX ?? 860, o.sunY ?? 260, C.skyL, t * .05, 14, 3400);
  cloud(c, 200 + (o.cloudDx || 0), 330, 130); cloud(c, 900 + (o.cloudDx || 0), 520, 90);
  for (let x = x0, i = 0; x < x1; x += 190, i++) ell(c, x, y0 - 10 + (i % 2) * 14, 150, 110, 0, i % 2 ? C.leaf : C.leafD);
  soil(c, x0, x1, y0, 1400, t);
  for (let x = x0 + 60, i = 0; x < x1; x += 330, i++) grassTuft(c, x + (i % 3) * 40, y0 + 18, 120 + (i % 3) * 50, t, i % 2 ? C.leafD : C.leaf);
  for (let x = x0 + 150, i = 0; x < x1; x += 410, i++) pebble(c, x, y0 + 150 + (i % 3) * 90, 26 + (i % 2) * 14);
}

/* ================= MỞ: vụn bánh tự bước đi, ngón tay khổng lồ "ngửi", Crumb bật lên ================= */
const TITLE = [{ text: 'SMELL WITH', y: 284, px: 150, fill: C.grape, shadow: C.cream, t0: HIT.words[0] }, { text: 'FINGERS?!', y: 476, px: 184, fill: C.berry, shadow: C.cream, t0: HIT.words[1] }];
const HK = { x: 420, y: 1420, k: 150 };
function hookWorld(c, t) {
  garden(c, t, { y0: 1200 });
  const pop = ss(seg(t, HIT.pop, HIT.pop + .2)), walk = 1 - ss(seg(t, .85, 1.0)), x = HK.x + Math.min(t, .9) * 60 - 30;
  // ngón tay: ngọ nguậy, cúi xuống "ngửi" hai lần, giật mình rút lên khi Crumb bật dậy
  const dip = HIT.sniff.reduce((a, s) => a + Math.sin(Math.PI * clamp(seg(t, s - .1, s + .2))), 0), recoil = ss(seg(t, HIT.pop, HIT.pop + .35)), gone = ss(seg(t, 2.2, 2.8));
  const fx = 820 - 70 * dip - 120 * recoil * 0, fy = 1030 + 50 * dip - 220 * recoil - 1100 * gone;
  shadow(c, x + 10, HK.y + 4, 180, .2);
  const E = pop > 0 ? crumbE(t < 2.0 ? 'curious' : 'excited', t, { look: [.5, -.3] }) : ex(BY.crumb, 'happy', { look: [.6, .2] });
  if (pop > 0) {                                                // Crumb đứng thẳng, nhấc bổng vụn bánh lên quá đầu
    const hop = .25 * Math.sin(Math.PI * seg(t, HIT.pop, HIT.pop + .3));
    crumbAt(c, x, HK.y, HK.k, { hop, E, q: t < 2.4 ? 1 : 0, arms: UP_ARMS });
    const [cx, cy] = crumbTop(x, HK.y, HK.k, hop); cookie(c, cx, cy - lerp(-.9, .35, pop) * HK.k, HK.k * 1.25, -.1);
  } else {                                                      // vụn bánh tự bước đi: chỉ thấy sáu cái chân bé xíu bên dưới
    crumbAt(c, x, HK.y, HK.k, { walk, ph: t * 2.4, hop: -.35, E, arms: { armL: [-.32, -1.7, .3], armR: [.32, -1.7, .3] } });
    cookie(c, x + 6, HK.y - 1.55 * HK.k + Math.sin(t * 2.4 * TAU) * 4 * walk, HK.k * 1.35, Math.sin(t * 2.4 * TAU) * .03 * walk);
  }
  if (gone < 1) { finger(c, fx, fy, 260, t, { dip, tilt: .5 }); HIT.sniff.forEach(s => sniffLines(c, fx - 120, fy + 10, 80, seg(t, s, s + .45))); }
  if (t > HIT.pop && t < HIT.pop + .5) { const b = seg(t, HIT.pop, HIT.pop + .5); for (let i = 0; i < 5; i++) star(c, x - 120 + i * 60, HK.y - 3.6 * HK.k - 40 * eo(b), 14 * (1 - b), C.lemon); }
}
function sHook(c, t, o = {}) {
  const shake = t > HIT.pop && t < HIT.pop + .25 ? Math.sin((t - HIT.pop) * 70) * 8 * (1 - (t - HIT.pop) / .25) : 0;
  c.save(); c.translate(0, shake); hookWorld(c, t); c.restore();
  const wob = t > HIT.pop ? Math.sin((t - HIT.pop) * 14) * Math.exp(-(t - HIT.pop) * 5) * .05 : 0;
  hookTitle(c, TITLE, t, { wob, cy: 360 });                      // v2: tựa móc dùng chung: hiện đủ ở khung 0, từng dòng nảy có tiếng
  if (!o.noLup && t > HIT.lensHook) {                           // Miss Loupe trồi lên, kính tới chỗ sẽ nở thành tựa
    const [x, y, r] = K([[HIT.lensHook, [1300, 1200, 190]], [3.3, [LX + 40, LY + 60, 230]], [3.5, [LX, LY, 240]]])(t);
    loupe(c, x, y, r, { E: ex(BY.loupe, 'laugh', { talk: talkAt(t) }), rot: -.2, pose: ARM.up, inside: zoomIn(x, y, 1.5, x, y, () => sHook(c, t, { noLup: true })) });
  }
}

/* ================= TỰA: giống mọi tập (chữ "of tiny bugs" tí hon chỉ đọc được trong kính) · nhạc hiệu 2 s ================= */
function titleWorld(c, t) {
  ground(c, C.grape); rays(c, 540, 600, C.nightL, -t * .12);
  popText(c, 'BIG', 540, 440, 200, C.lemon, C.night, t, at(2), { step: .07 });
  popText(c, 'SECRETS', 540, 650, 200, C.lemon, C.night, t, at(2) - .04, { step: .05 });
  popText(c, 'of tiny bugs', 540, LY + 12, 34, C.cream, null, t, at(2, 2), { font: subFont, step: .015, read: false });
}
function sTitle(c, t, o = {}) {
  titleWorld(c, t);
  if (o.noLup) return;
  const [x, y] = K([[at(2), [-300, 940]], [at(2, 1.4), [300, 870]], [at(2, 2.4), [LX, LY]], [at(3), [LX, LY]]])(t);
  loupe(c, x, y, 240, { E: ex(BY.loupe, 'laugh', { talk: talkAt(t) }), rot: -.1, pose: ARM.up, inside: zoomIn(x, y, 1.9, x, LY, () => titleWorld(c, t)) });
}

/* ================= BÍ MẬT 1: Crumb ra mắt, râu ngửi, "Tap, tap, hello!" ================= */
const MC = { x: 360, y: 1400, k: 140 }, A2 = { x: 700, y: 1410, s: 92 }, STAND = { x: 870, y: 880, r: 185 };
const DOWN = 7.9, CK_GROUND = { x: 560, y: 1395 };                 // Crumb đặt vụn bánh xuống đất ngay trước khi soi râu
const meetCrumbX = t => lerp(-150, MC.x, ss(seg(t, HIT.walk1[0], HIT.walk1[1])));
const meetLean = t => HIT.taps.reduce((a, s) => a + .14 * Math.sin(Math.PI * clamp(seg(t, s - .12, s + .1))), 0);
function meetWorld(c, t, detail) {
  garden(c, t, { y0: 1190 });
  const x = meetCrumbX(t), walking = t < HIT.walk1[1], put = ss(seg(t, DOWN, DOWN + .35));
  if (put >= 1) cookie(c, CK_GROUND.x, CK_GROUND.y - 55, MC.k * .8, .1);   // vụn bánh nằm trên đất
  // kiến thợ thứ hai tới, chạm râu, rồi đi tiếp sang phải
  const ax = K([[HIT.ant2[0], [1250]], [HIT.ant2[1], [A2.x]], [HIT.ant2Out[0], [A2.x]], [HIT.ant2Out[1], [1300]]])(t)[0];
  const back2 = t > HIT.ant2Out[0], tap = HIT.taps.reduce((a, s) => a + Math.sin(Math.PI * clamp(seg(t, s - .12, s + .1))), 0);
  if (t > HIT.ant2[0]) { shadow(c, ax, A2.y + 4, 80, .16); workerAnt(c, ax, A2.y, A2.s, t * 2.6, { dir: back2 ? 1 : -1, tap: back2 ? 0 : tap }); }
  shadow(c, x + 10, MC.y + 4, 170, .2);
  const talk = talkAt(t, 'crumb'), E = crumbE(t > HIT.taps[0] - .2 && t < 15 ? 'excited' : walking ? 'happy' : 'curious', t, { look: t > HIT.ant2[0] ? [.6, .1] : [.4, -.4] });
  crumbAt(c, x, MC.y, MC.k, { walk: walking ? 1 : 0, ph: t * 2.2, lean: meetLean(t), E, q: 0, arms: put < 1 ? UP_ARMS : { armL: [-.4, -1.0, .45], armR: [.42, -1.05, .45] } });
  if (put < 1) { const [cx, cy] = crumbTop(x, MC.y, MC.k); cookie(c, lerp(cx - 10, CK_GROUND.x, put), lerp(cy - .2 * MC.k, CK_GROUND.y - 55, put), MC.k * lerp(1.15, .8, put), .08); }
  // chạm râu: tia sáng ở chỗ hai đầu râu gặp nhau
  HIT.taps.forEach(s => { const q = seg(t, s, s + .4); if (q <= 0 || q >= 1) return; const p = antTip(ax, A2.y, A2.s, { dir: -1, tap: 1 }); for (let i = 0; i < 5; i++) { const a = i * TAU / 5; star(c, p[0] - 10 + Math.cos(a) * 30 * eo(q), p[1] + Math.sin(a) * 30 * eo(q), 10 * (1 - q), C.lemon); } });
  if (!detail) return;
  // trong kính: hạt mùi (chấm màu) bay từ bên phải vào đầu râu, đầu râu lóe sáng
  const tip = crumbAnt(x, MC.y, MC.k), on = ss(seg(t, HIT.scent - .1, HIT.scent + .3)) * (1 - ss(seg(t, HIT.lensOut - .2, HIT.lensOut + .2)));
  if (on > 0) {
    for (let i = 0; i < 14; i++) {
      const ph = ((t * .55 + i / 14) % 1), sx = lerp(CK_GROUND.x, tip[0], ph) + Math.sin(ph * 7 + i) * 30 * (1 - ph), sy = lerp(CK_GROUND.y - 90, tip[1], ph) + (i % 3 - 1) * 24 * Math.sin(Math.PI * ph);   // mùi bốc từ vụn bánh lên đầu râu
      circle(c, sx, sy, (5 + (i % 3) * 2) * on * (1 - ph * .5), [C.pink, C.lemon, C.mint][i % 3]);
    }
    const g = .5 + .5 * Math.sin(t * 10); circle(c, tip[0], tip[1], 12 * on * (1 + .3 * g), 'rgba(255,227,77,.55)'); circle(c, tip[0], tip[1], 6 * on, C.lemon);
  }
}
function meetLens(t) {                                          // Miss Loupe: vào, soi đầu râu, lùi về
  const tip = crumbAnt(MC.x, MC.y, MC.k);
  let [x, y, r] = K([[HIT.lupIn, [1320, 1250, 190]], [8.4, [STAND.x, STAND.y, STAND.r]], [9.1, [STAND.x, STAND.y, STAND.r]], [HIT.zoom, [tip[0] + 40, tip[1] + 20, 230]], [HIT.lensOut, [tip[0] + 40, tip[1] + 20, 230]], [HIT.lensOut + .6, [STAND.x, STAND.y, STAND.r]], [15.5, [STAND.x, STAND.y, STAND.r]]])(t);
  const m = ss(seg(t, HIT.zoom, HIT.zoom + .35)) * (1 - ss(seg(t, HIT.lensOut, HIT.lensOut + .3)));
  return { x, y, r, m, mag: lerp(1.3, 3.2, m), fx: tip[0], fy: tip[1] };
}
function sMeet(c, t, o = {}) {
  meetWorld(c, t, 0);
  sticker(c, 'SECRET 1', 60, 170, C.honey, C.ink, seg(t, at(3), at(3, .6)));
  if (t > HIT.taps[0] - .05 && t < 15.5) { popText(c, 'TAP,', 120, 820, 120, C.lemon, C.grape, t, HIT.taps[0], { align: 'left', step: .03 }); popText(c, 'TAP!', 420, 820, 120, C.lemon, C.grape, t, HIT.taps[1], { align: 'left', step: .03 }); }
  if (o.noLup || t < HIT.lupIn) return;
  const L = meetLens(t), name = t < HIT.zoom ? 'happy' : t < HIT.lensOut ? 'surprised' : t > HIT.taps[0] ? 'laugh' : 'happy';
  loupe(c, L.x, L.y, L.r, {
    E: ex(BY.loupe, name, { talk: talkAt(t), look: L.m > .3 ? [-.3, .5] : [-.7, .2], blink: name === 'happy' ? blinkAt(t) : 0 }), rot: L.m > .3 ? -.3 : -.08, pose: L.m > .3 ? ARM.peer : {},
    inside: L.m > .01 ? zoomIn(L.x, L.y, L.mag, lerp(L.x, L.fx, L.m), lerp(L.y, L.fy, L.m), () => meetWorld(c, t, L.m > .3 ? 1 : 0)) : null,
  });
}

/* ================= BÍ MẬT 2: "So, they follow a map?" — "Nope!" — đường mùi (cảnh đặc trưng), Rollo lăn cắt ngang ================= */
const TR = { y: 1320, k: 100, nestX: -100 };                   // đường của đàn kiến (toạ độ cảnh); cảnh rộng hơn khung: x từ -500 tới 2600
const trailY = x => TR.y - 6 + Math.sin(x * .011) * 26 + Math.sin(x * .027 + 1) * 10;   // đường mùi uốn lượn trên mặt đất
const trailCam = t => { const u = ss(seg(t, HIT.slide[0], HIT.slide[1])); return { cx: lerp(540, 1900, u), cy: 960, z: 1 }; };
const ANTS = [0, 1, 2, 3, 4, 5, 6];
const antX = (i, t) => { const frz = clamp(seg(t, HIT.freeze[0], HIT.freeze[0] + .1)) * (1 - clamp(seg(t, HIT.freeze[1] - .1, HIT.freeze[1]))); const run = t - (frz > .5 ? 0 : 0); return -300 + i * 260 + (Math.min(t, HIT.freeze[0]) - 16) * 120 + Math.max(0, t - HIT.freeze[1]) * 120; };
const CRX = 330, CRY = 1430, CRK = 118;                       // Crumb ở tiền cảnh trái với tấm bản đồ
function trailWorld(c, t, detail) {
  garden(c, t, { y0: 1160, x0: -800, x1: 3200, sunX: 860, cloudDx: 0 });
  // lỗ tổ kiến bên trái
  ell(c, -40, 1300, 120, 40, 0, '#B9712F'); ell(c, -40, 1298, 70, 22, 0, '#5A2A0C');
  // đường mùi: chỉ hiện trong kính
  if (detail) {
    const on = ss(seg(t, HIT.trail - .05, HIT.trail + .35));
    c.save(); c.globalAlpha = 1; c.strokeStyle = C.mint; c.lineCap = 'round'; c.lineWidth = 26 * on;
    c.beginPath(); for (let x = -200; x <= 3000; x += 20) { const y = trailY(x) + 10; x === -200 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
    c.strokeStyle = C.mintL; c.lineWidth = 9 * on; c.setLineDash([24, 30]); c.lineDashOffset = -t * 120;
    c.beginPath(); for (let x = -200; x <= 3000; x += 20) { const y = trailY(x) + 10; x === -200 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); c.setLineDash([]);
    for (let i = 0; i < 10; i++) { const ph = ((t * .5 + i / 10) % 1), x = -200 + ((i * 337 + t * 60) % 3100); circle(c, x, trailY(x) - 20 - ph * 60, 5 * (1 - ph) * on, C.mint); }   // mùi bốc lên khe khẽ
    c.restore();
  }
  // đàn kiến bước đúng trên đường mùi; khựng lại khi Rollo lăn ngang qua
  const frozen = t > HIT.freeze[0] && t < HIT.freeze[1];
  for (const i of ANTS) { const x = antX(i, t); if (x < -300 || x > 3100) continue; workerAnt(c, x, trailY(x) + 8, 62, frozen ? 0 : t * 2.8 + i * .3, { dir: 1, tap: frozen ? .6 : 0 }); if (frozen) { c.font = subFont(40); c.fillStyle = C.berry; c.textAlign = 'center'; c.fillText('!', x + 30, trailY(x) - 70); } }
  // Rollo lăn cắt ngang (trứng phục sinh): đi thẳng tắp, viên tròn quay đúng quãng đường
  const tr = seg(t, HIT.rollo[0], HIT.rollo[1]);
  if (t > HIT.rollo[0] && t < HIT.rollo[1]) { const x = lerp(1900 + 700, 1900 - 700, tr), y = TR.y + 120; shadow(c, x - 30, y + 4, 90, .18); rolloAt(c, x, y, 62, 1400 * tr); }
  // thân cây ở cuối đường (lối lên trại rệp)
  rrect(c, 2380, 300, 60, 900, 30, C.leafD); ell(c, 2470, 520, 170, 70, -.35, C.leaf);
}
function rolloAt(c, x, y, k, dist) {
  const yaw = -1.4, B = rigPt(x, y, k, yaw, 0, [0, -.72, -1.55]), R = .72 * k, spin = dist / R;
  c.save(); c.beginPath(); c.arc(B[0], B[1], R, 0, TAU); c.clip();
  c.fillStyle = '#8E430B'; c.fill(); circle(c, B[0] - R * .14, B[1] - R * .14, R, C.honeyD);
  for (const [a, rr, s] of [[0, .45, .26], [2.1, .5, .2], [4.0, .38, .17], [5.2, .62, .13]]) circle(c, B[0] + Math.cos(a + spin) * R * rr, B[1] + Math.sin(a + spin) * R * rr, R * s, C.honey);
  c.restore();
  drawChar(c, BY.rollo, { x, y, k, yaw, showFx: false, expr: ex(BY.rollo, 'happy', { look: [.3, .1] }), pose: { showBall: false } });
}
const MAP_ARMS = { armL: [-.3, -1.35, .7], armR: [.34, -1.4, .72] };
function trailCrumb(c, t) {                                     // Crumb ở tiền cảnh (toạ độ khung, không trôi theo máy): giơ tấm bản đồ, rồi cất đi đi theo đàn kiến
  const mapOn = ss(seg(t, HIT.map, HIT.map + .25)) * (1 - ss(seg(t, HIT.trail, HIT.trail + .3)));
  const x = CRX, talk = talkAt(t, 'crumb'), walking = t > HIT.slide[0] && t < HIT.slide[1];
  shadow(c, x + 10, CRY + 4, 170, .2);
  const E = t < HIT.nope ? crumbE('curious', t, { look: [.4, -.2] }) : t < HIT.trail ? crumbE('surprised', t, { look: [.6, -.3] }) : crumbE('excited', t, { look: [.6, .4] });
  crumbAt(c, x, CRY, CRK, { E, q: t < HIT.nope ? 1 : 0, arms: mapOn > .3 ? MAP_ARMS : UP_ARMS, walk: walking ? 1 : 0, ph: t * 2.4 });
  if (mapOn > .3) { const p = rigPt(x, CRY, CRK, .7, 0, [.05, -1.42, .95]); tinyMap(c, p[0], p[1], 170 * mapOn, 120 * mapOn, -.08); if (t > HIT.nope) nope(c, p[0] + 60, p[1] - 30, 46, seg(t, HIT.nope, HIT.nope + .2)); }
  else { const [cx, cy] = crumbTop(x, CRY, CRK); cookie(c, cx - 10, cy - .2 * CRK, CRK * 1.1, .08); }
}
function trailLens(t) {                                         // kính: đứng cạnh → hạ xuống mặt đất ngay khi hết khoảng lặng → trượt dọc đường mùi
  const cm = trailCam(t);
  const [sx, sy, r] = K([[16, [STAND.x, STAND.y, STAND.r]], [HIT.rest[0], [STAND.x, STAND.y, STAND.r]], [HIT.trail, [660, 1300, 230]], [27.2, [660, 1300, 230]], [27.5, [LX, LY, 240]]])(t);
  const m = ss(seg(t, HIT.rest[0] + .2, HIT.trail)) * (1 - ss(seg(t, 27.1, 27.5)));
  const wx = (sx - 540) / cm.z + cm.cx, wy = (sy - 960) / cm.z + cm.cy;                         // tâm kính ra toạ độ cảnh
  return { sx, sy, r, m, mag: lerp(1.2, 1.6, m), wx, wy };
}
function sTrail(c, t, o = {}) {
  const cm = trailCam(t);
  look(c, cm, () => trailWorld(c, t, 0));
  trailCrumb(c, t);
  sticker(c, 'SECRET 2', 60, 170, C.mint, C.ink, seg(t, at(8), at(8, .6)));
  if (t > HIT.trail + .3 && t < 27.4) { popText(c, 'SMELL', 70, 560, 104, C.lemon, C.leafD, t, HIT.trail + .35, { align: 'left', step: .03 }); popText(c, 'TRAIL!', 70, 670, 104, C.mint, C.leafD, t, HIT.trail + .55, { align: 'left', step: .03 }); }
  if (o.noLup) return;
  const L = trailLens(t), name = t < HIT.nope ? 'curious' : t < HIT.trail ? 'thinking' : 'surprised';
  loupe(c, L.sx, L.sy, L.r, {
    E: ex(BY.loupe, name, { talk: talkAt(t), look: L.m > .3 ? [-.2, .6] : [-.7, .3] }), rot: L.m > .3 ? -.25 : -.08, pose: L.m > .3 ? ARM.peer : name === 'thinking' ? ARM.shrug : {},
    inside: L.m > .01 ? zoomIn(L.sx, L.sy, L.mag, L.sx, L.sy, () => look(c, cm, () => trailWorld(c, t, L.m > .3 ? 1 : 0))) : null,
  });
}

/* ================= BÍ MẬT 3: kiến "chăn" rệp lấy giọt ngọt; Spindle ló ra ở góc ================= */
const SLOT3 = { x: 240, y: 760, r: 92 }, sticker3 = cc => { aphid(cc, 0, 44, 46); honeydew(cc, -40, 22, 9); };   // sticker thứ ba ("Keep tiny cows"): đích của match cut
const LEAF = { x: 400, y: 1130 }, APH = [[300, 1062, 92, 1], [480, 1046, 80, -1], [610, 1080, 70, -1]], FA = { x: 130, y: 1082, s: 86 }, FARM_LENS = { x: 830, y: 720, r: 190 };
function farmWorld(c, t, detail) {
  ground(c, C.sky); rays(c, 900, 200, C.skyL, t * .05, 14, 3400);
  cloud(c, 230, 300, 120);
  for (let x = -100, i = 0; x < 1200; x += 190, i++) ell(c, x, 1590 + (i % 2) * 14, 150, 110, 0, i % 2 ? C.leaf : C.leafD);
  soil(c, -100, 1200, 1600, 400, t);                             // mặt đất: Crumb đứng dưới, ngước nhìn lên lá
  rrect(c, 700, 1100, 64, 520, 32, C.leafD);                     // thân cây
  c.fillStyle = C.leaf; c.beginPath(); c.moveTo(20, LEAF.y + 20); c.quadraticCurveTo(LEAF.x, LEAF.y - 150, 760, LEAF.y + 10); c.quadraticCurveTo(LEAF.x, LEAF.y + 190, 20, LEAF.y + 20); c.fill();   // chiếc lá lớn
  c.strokeStyle = C.leafD; c.lineWidth = 10; c.beginPath(); c.moveTo(60, LEAF.y + 20); c.quadraticCurveTo(LEAF.x, LEAF.y - 30, 740, LEAF.y + 10); c.stroke();
  // ba chú rệp; chú đầu tiên được kiến chạm râu → nhả một giọt ngọt ở phía sau
  APH.forEach(([x, y, s, dir], i) => { const sq = i === 0 ? HIT.aphidTap.reduce((a, h) => a + Math.sin(Math.PI * clamp(seg(t, h - .05, h + .12))), 0) : 0; aphid(c, x, y + Math.sin(t * 2 + i) * 3, s, { dir, sq }); });
  const dropR = 13 * ss(seg(t, HIT.drop, HIT.drop + .25)) * (1 - ss(seg(t, HIT.sip, HIT.sip + .4)));
  if (dropR > .5) { honeydew(c, APH[0][0] - 64, APH[0][1] - 26, dropR); if (t < HIT.drop + .5) for (let i = 0; i < 4; i++) { const a = i * TAU / 4, q = seg(t, HIT.drop, HIT.drop + .5); star(c, APH[0][0] - 64 + Math.cos(a) * 30 * eo(q), APH[0][1] - 30 + Math.sin(a) * 30 * eo(q), 8 * (1 - q), C.lemon); } }
  const tap = HIT.aphidTap.reduce((a, h) => a + Math.sin(Math.PI * clamp(seg(t, h - .12, h + .08))), 0), sip = ss(seg(t, HIT.sip - .1, HIT.sip + .2)) * (1 - ss(seg(t, HIT.sip + .7, HIT.sip + 1)));
  workerAnt(c, FA.x + 40 * sip, FA.y, FA.s, 0, { dir: 1, tap: Math.max(tap, sip * .8), sip });
  workerAnt(c, 680, LEAF.y - 40, 64, t * 1.2, { dir: -1 });
  // Spindle ló ra từ mạng nhện ở góc trên phải (đúng một nhịp)
  web(c, 1080, 0, 300, Math.PI / 2);
  const sp = Math.sin(Math.PI * clamp(seg(t, HIT.spindle[0], HIT.spindle[1])));
  if (sp > .01) drawChar(c, BY.spindle, { x: 960, y: 140 + 90 * sp, k: 70, yaw: -.3, showFx: false, expr: ex(BY.spindle, 'happy', { look: [-.6, .4] }), pose: { thread: true } });
}
function sFarm(c, t, o = {}) {
  farmWorld(c, t, 0);
  // Crumb đứng trên thân lá, vác vụn bánh, tròn mắt nhìn
  const cx = 460, cy = 1560, talk = talkAt(t, 'crumb');   // Crumb đứng dưới đất, ngước nhìn lên lá
  const d2 = seg(t, HIT.drop2[0], HIT.drop2[1]), yay = Math.sin(Math.PI * seg(t, HIT.drop2[1], HIT.drop2[1] + .45));   // giọt ngọt thứ hai rơi trúng vụn bánh → Crumb nhảy cẫng
  crumbAt(c, cx, cy, 96, { E: crumbE(t < HIT.drop ? 'curious' : 'excited', t, { look: t > HIT.drop2[0] && t < HIT.drop2[1] ? [-.3, -.9] : [-.6, -.1] }), q: t < HIT.drop ? 1 : 0, flip: true, arms: UP_ARMS, hop: .3 * yay });
  const [kx, ky] = crumbTop(cx, cy, 96, .3 * yay); cookie(c, kx + 8, ky - .2 * 96, 96 * 1.05, -.08);
  if (d2 > 0 && d2 < 1) honeydew(c, lerp(APH[0][0] - 64, kx + 8, d2), lerp(APH[0][1] - 26, ky - .2 * 96 - 40, d2 * d2), 12);
  if (t > HIT.drop2[1]) { circle(c, kx - 10, ky - .2 * 96 - 30, 10, C.honeyL); if (t < HIT.drop2[1] + .5) { const b = seg(t, HIT.drop2[1], HIT.drop2[1] + .5); for (let i = 0; i < 4; i++) { const a = i * TAU / 4; star(c, kx + 8 + Math.cos(a) * 60 * eo(b), ky - 60 + Math.sin(a) * 40 * eo(b), 10 * (1 - b), C.lemon); } } }
  sticker(c, 'SECRET 3', 60, 170, C.lime, C.ink, seg(t, at(14), at(14, .6)));
  if (t > HIT.cows - .05 && t < 35.4) { popText(c, 'TINY', 330, 560, 120, C.lemon, C.leafD, t, HIT.cows, { step: .03 }); popText(c, 'COWS!', 330, 690, 140, C.cream, C.berry, t, HIT.cows + .15, { step: .03 }); }
  if (o.noLup) return;
  const m = Math.max(ss(seg(t, 28.6, 29.0)) * (1 - ss(seg(t, 31.8, 32.2))), ss(seg(t, HIT.aim[0], HIT.aim[1]))), [x, y, r] =   // v2: soi lại chú rệp trước cú chụp
    K([[28, [1300, 760, 190]], [28.6, [FARM_LENS.x, FARM_LENS.y, FARM_LENS.r]], [35.5, [FARM_LENS.x, FARM_LENS.y, FARM_LENS.r]]])(t);
  loupe(c, x, y, r, { E: ex(BY.loupe, t < HIT.drop ? 'curious' : 'surprised', { talk: talkAt(t), look: [-.3, .6] }), rot: -.2, pose: ARM.peer,
    inside: m > .01 ? zoomIn(x, y, lerp(1.2, 2.1, m), lerp(x, APH[0][0] - 70, m), lerp(y, APH[0][1] - 40, m), () => farmWorld(c, t, 1)) : null });   // chỗ râu kiến chạm vào rệp và giọt ngọt hiện ra
}

/* ================= SỔ: ba sticker, Albie, "Can I hold the lens?" — "Not yet!" ================= */
const AL = { x: 250, y: 1440, k: 138 }, AL_LENS = { x: 790, y: 1440 - LENS_UP * 150, r: 150 }, AC = { x: 560, y: 1450, k: 92 };
function sAlbum(c, t, o = {}) {
  ground(c, C.sky); ell(c, 200, 1760, 900, 420, 0, C.skyL);
  ell(c, 540, 1720, 980, 330, 0, C.leaf); ell(c, 540, 1760, 900, 280, 0, C.leafD);
  rrect(c, 96, 208, 890, 680, 54, C.grape); rrect(c, 84, 190, 890, 680, 54, C.cream);
  const rows = [
    { y: 300, f: C.honey, t1: 'Sniff', t2: 'with antennae', col: C.tang, d: cc => crumbAt(cc, -6, 60, 30, { E: ex(BY.crumb, 'curious'), q: 1, carry: null, arms: { armL: [-.4, -1.0, .4], armR: [.4, -1.0, .4] } }) },
    { y: 530, f: C.mint, t1: 'Follow', t2: 'smell trails', col: C.leafD, d: cc => { cc.strokeStyle = C.cream; cc.lineWidth = 12; cc.lineCap = 'round'; cc.beginPath(); cc.moveTo(-60, 30); cc.quadraticCurveTo(0, -10, 60, 20); cc.stroke(); workerAnt(cc, -10, 20, 30, .2); workerAnt(cc, 38, 26, 26, .6); } },
    { y: 760, f: C.lime, t1: 'Keep', t2: 'tiny cows', col: C.berry, d: cc => { aphid(cc, 0, 44, 46); honeydew(cc, -40, 22, 9); } },
  ];
  rows.forEach((r, i) => {
    const t0 = HIT.stamp[i];
    circle(c, 240, r.y, 94, '#EBDDBC');
    const inPlace = i === 2;                                     // v2: sticker thứ ba nằm sẵn ở chỗ (máy lùi ra từ chính nó, match cut), hai sticker kia vẫn bay vào
    if (inPlace ? t < HIT.irisB : t < t0 - .3) return;
    const p = t >= t0 ? back(seg(t, t0, t0 + .22), 2.6) : 1, fly = inPlace ? 0 : 760 * (1 - ss(seg(t, t0 - .3, t0))), settle = .06 * Math.sin(Math.PI * seg(t, HIT.sayIn, HIT.sayIn + .25));
    badge(c, 240 + fly, r.y - fly * .25, 92, r.f, cc => r.d(cc), -.05 + i * .05, t >= t0 ? lerp(1.25, 1, p) - settle : inPlace ? 1 : .9);
    popText(c, r.t1, 390, r.y - 4, 86, r.col, null, t, t0 + .1, { align: 'left', step: .02 });
    popText(c, r.t2, 390, r.y + 60, 56, C.ink, null, t, t0 + .2, { align: 'left', step: .012, font: subFont });
  });
  const talk = talkAt(t, 'albie'), hop = HIT.stamp.reduce((s, ts) => s + .1 * Math.sin(Math.PI * seg(t, ts, ts + .2)), 0);
  shadow(c, AL.x + 14, AL.y + 4, 140, .18);
  albieAt(c, AL.x, AL.y, AL.k, { E: ex(BY.albie, 'happy', { talk, look: talk ? [.5, -.6] : [.6, .1], blink: talk ? 0 : blinkAt(t, .4) }), hop, page: t > HIT.sayIn - .2 ? [.72, -1.62, -.35] : null, curl: -.2 });
  // Crumb xin cầm kính; Miss Loupe: "Not yet!" (mạch mùa)
  const ask = lineOf('L13').t, no = lineOf('L14').t, droop = ss(seg(t, no + .3, no + .6)) * (1 - ss(seg(t, no + 1.6, no + 2.1)));
  shadow(c, AC.x, AC.y + 4, 120, .18);
  const cE = t < ask ? crumbE('happy', t, { look: [.6, -.3] }) : t < no + .3 ? crumbE('excited', t, { look: [.7, -.6] }) : droop > .5 ? crumbE('sad', t, { look: [.5, -.4] }) : crumbE('confident', t, { look: [.6, -.3] });
  crumbAt(c, AC.x, AC.y, AC.k, { E: cE, q: t > ask - .2 && t < no ? 1 : 0, hop: t > ask && t < ask + .4 ? .2 * Math.sin(Math.PI * seg(t, ask, ask + .4)) : 0, arms: t > ask && t < no + .3 ? { armL: [-.5, -2.4, .4], armR: [.6, -2.6, .5] } : droop > .5 ? { armL: [-.3, -.9, .4], armR: [.3, -.9, .4] } : UP_ARMS });
  if (!(t > ask && t < no + .3) && droop <= .5) { const [kx, ky] = crumbTop(AC.x, AC.y, AC.k); cookie(c, kx - 6, ky - .2 * AC.k, AC.k * 1.0, .08); }
  if (!o.noLup) {
    shadow(c, AL_LENS.x, AL.y + 4, 150, .16);
    const lt = talkAt(t), say = t >= no - .1 && t < no + 1;
    loupe(c, AL_LENS.x, AL_LENS.y, AL_LENS.r, { E: ex(BY.loupe, say ? 'explaining' : 'happy', { talk: lt, look: [-.7, .2], blink: blinkAt(t) }), rot: 0, pose: say ? ARM.wave : {} });
  }
}

/* ================= KẾT: Crumb lần theo đường mùi tới cây kem của tập 1 — kem đổ ụp lên kính — ngón tay khổng lồ ================= */
const IC = { x: 470, y: 1100, s: .95 }, GL = { x: 790, y: 740, r: 220 }, GC = { x: 300, y: 1440, k: 120 };
function gagWorld(c, t) {
  garden(c, t, { y0: 1180 });
  const lift = ss(seg(t, HIT.lift[0], HIT.lift[1])), tip = ss(seg(t, HIT.topple, HIT.splat)), gone = t > HIT.splat;
  const wob = t > HIT.lift[1] - .2 && t < HIT.topple ? Math.sin(t * 40) * .06 : 0;
  // Crumb đi theo mùi tới chân cây kem, hít hít, rồi nhấc bổng cả cây kem
  const x = lerp(-160, GC.x + 120, ss(seg(t, HIT.gagWalk[0], HIT.gagWalk[1])));
  shadow(c, x + 10, GC.y + 4, 160, .2);
  const E = t < HIT.gagWalk[1] ? crumbE('happy', t, { look: [.6, -.3] }) : t < HIT.lift[0] ? crumbE('confident', t, { look: [.6, -.6] }) : t < HIT.splat ? crumbE('surprised', t, { look: [.3, -.9] }) : crumbE('worried', t, { look: [.5, -.6] });
  crumbAt(c, x, GC.y, GC.k, { walk: t < HIT.gagWalk[1] ? 1 : 0, ph: t * 2.2, E, q: t > HIT.gagSniff && t < 47.3 ? 1 : 0, arms: UP_ARMS, hop: -.05 * lift });
  if (!gone) iceCream(c, lerp(IC.x, x + 40, lift), lerp(IC.y, GC.y - 2.55 * GC.k - 210 * IC.s, lift) - 30 * tip, IC.s, 0, lerp(0, .2, lift) + wob + tip * 1.3);   // nhấc bổng cả cây kem (to gấp mấy lần Crumb), lắc lư rồi đổ sang phải
  if (t < HIT.lift[0]) { const [kx, ky] = crumbTop(x, GC.y, GC.k); cookie(c, kx - 6, ky - .2 * GC.k, GC.k * 1.0, .08); }
}
function splatOnGlass(c, x, y, r, p) {                          // kem dính bẹp trên mặt kính
  if (p <= 0) return; const s = back(Math.min(1, p * 1.4), 2);
  c.save(); c.beginPath(); c.arc(x, y, r * .92, 0, TAU); c.clip();
  circle(c, x + r * .05, y - r * .1, r * .55 * s, C.pink); for (const [dx, dy, rr] of [[-.45, .1, .24], [.42, .18, .22], [.05, .45, .2], [-.2, -.5, .18], [.38, -.4, .16]]) circle(c, x + dx * r * s, y + dy * r * s, rr * r * s, C.pink);
  for (const [dx, h] of [[-.3, .5], [.12, .62], [.4, .4]]) capsule(c, x + dx * r * s, y + .2 * r, x + dx * r * s, y + (.2 + h * Math.min(1, p)) * r, r * .12, C.pink);
  circle(c, x - .02 * r, y - .62 * r * s, r * .07, C.berry); ell(c, x + .25 * r, y - .45 * r * s, r * .05, r * .08, .4, C.mint);
  c.restore();
}
function sGag(c, t, o = {}) {
  gagWorld(c, t);
  if (o.noLup) return;
  const splat = seg(t, HIT.splat, HIT.splat + .3), hop = t > HIT.laugh ? Math.abs(Math.sin((t - HIT.laugh) * 8)) * 18 * (1 - seg(t, HIT.laugh, 51)) : 0;
  const name = t < HIT.topple ? 'curious' : t < HIT.splat ? 'surprised' : t < HIT.laugh ? 'crosseyed' : 'laugh';
  loupe(c, GL.x, GL.y - hop, GL.r, { E: ex(BY.loupe, name, { talk: talkAt(t), look: [-.4, .6] }), rot: -.06, pose: name === 'crosseyed' ? ARM.shrug : ARM.peer });
  splatOnGlass(c, GL.x, GL.y - hop, GL.r, splat * (1 - ss(seg(t, HIT.finger[1] - .2, HIT.loopIris[1]))));
  // ngón tay khổng lồ thò xuống, ngọ nguậy trong vệt kem ("ngửi" kem)
  const fp = ss(seg(t, HIT.finger[0], HIT.finger[0] + .4));
  if (fp > 0) finger(c, GL.x + 60, lerp(-260, GL.y - 20, fp), 240, t, { dip: 0, tilt: .35 });
}

/* ---------- vòng lặp: kính nở ra, bên trong là khung đầu (ngón tay ngọ nguậy cạnh vụn bánh) ---------- */
function loopOut(c, t) {
  const u = ei(seg(t, HIT.loopIris[0], DUR - .04)), R = lerp(GL.r, 2300, u);
  sGag(c, t, { noLup: true });
  loupe(c, GL.x, GL.y, R, { E: ex(BY.loupe, 'laugh'), rot: -.06, pose: ARM.up, inside: () => sHook(c, t - DUR, { noLup: true }) });
}

function matchCut(c, t) {                                      // v2: kính "chụp" chú rệp → máy lao xuyên qua mặt kính → hình hoá thành sticker thứ ba → lùi ra lộ trang sổ
  stickerMatchCut(c, t, { t0: HIT.zoomIn[0], t1: HIT.zoomOut[0], t2: HIT.zoomOut[1], lens: { x: FARM_LENS.x, y: FARM_LENS.y, r: FARM_LENS.r }, from: cc => sFarm(cc, HIT.zoomIn[0]), to: (cc, tt) => sAlbum(cc, tt), slot: SLOT3, fill: C.lime, draw: sticker3 });
}
function recallTitle(c, t) { hookTitle(c, TITLE, -1, { gone: 1 - back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: 360 }); }   // v2: chữ móc trở lại đúng chỗ, đúng cỡ của khung đầu
const SC = { hook: sHook, title: sTitle, meet: sMeet, trail: sTrail, farm: sFarm, album: sAlbum, gag: sGag };
const IRISES = IRIS.map(i => i.from === 'album' ? { ...i, x: AL_LENS.x, y: AL_LENS.y, r0: AL_LENS.r } : i.from === 'farm' ? { ...i, x: FARM_LENS.x, y: FARM_LENS.y, r0: FARM_LENS.r } : { ...i, x: LX, y: LY, r0: 240 });
export function drawFilm(c, t) {
  t = clamp(t, 0, DUR - .001);
  const sec = SECS.find(s => t >= s.t0 && t < s.t1) || SECS[SECS.length - 1];
  const ir = IRISES.find(i => t >= i.t0 && t < i.t1);
  c.save();
  if (t >= HIT.loopIris[0]) loopOut(c, t);
  else if (t >= HIT.zoomIn[0] && t < HIT.zoomOut[1]) matchCut(c, t);
  else if (t >= HIT.zoomOut[1] && t < secBy('album').t0) sAlbum(c, t);
  else if (ir) {
    const u = ei(seg(t, ir.t0, ir.t1)), R = lerp(ir.r0, 2200, u), tt = Math.max(t, secBy(ir.to).t0);
    SC[ir.from](c, t, { noLup: true });
    loupe(c, ir.x, ir.y, R, { E: ex(BY.loupe, 'surprised', { talk: talkAt(t), look: [0, -.4] }), rot: -.1, pose: ARM.up, inside: () => SC[ir.to](c, tt, { noLup: true }) });
  } else { SC[sec.id](c, t); if (sec.id === 'farm') snapFlash(c, t, HIT.snap, FARM_LENS); }
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t);
  c.restore();
}
