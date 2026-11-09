// LONG-001 · chương 5 (trang trống → vườn tuyết, kính nhiệt), kết (sổ ấm lại), đố vui, chào tạm biệt, "Did you spot Rollo?".
import { C, circle, ell, capsule, rrect, poly, popText, subFont, sticker, nope, rings, clamp, lerp, seg, back, eo, TAU, BY, star, ex, ARM, zoomIn, badge,
  K, H, talkAt, lineOf, pulse, hold, cam, shake, big, crumbAt, crumbE, UP_ARMS, DOWN_ARMS, albieW, loupeW, dotAt, waggleAt, chirpAt, blinkFly, rolloAt,
  flutterAt, sparkles, notes, ss, ei, blinkAt, sugarCube } from './lib16.js';
import { snowGarden, hiveBox, rock, leafPile, sleepyLadybug, woollyBear, warmWindow, antChamber, snowflake, workerAnt, hop, zip, frost, W, lerpCol } from './props.js';
import { room, pageView, pageCast, sillWide, PAGE, HOLE, TAB, AL, CR, LP, POT, FLAKE, SILL, WIN, TITLE, WIDE } from './sill.js';
import { hookTitle } from '/_shared/episode.js';
import { REC } from '/_shared/kit.js';
const REC_MUTE = fn => { REC.mute++; fn(); REC.mute--; };          // chữ trong khung nhỏ là bản sao, không phải chữ mới

/* ---------- hình trên các trang (sau khi tan) và sticker mùa đông ---------- */
export const ART = [
  cc => { flutterAt(cc, 0, 70, 70, { beta: .3, E: ex(BY.flutter, 'happy') }); },
  cc => { cc.strokeStyle = C.mint; cc.lineWidth = 16; cc.lineCap = 'round'; cc.beginPath(); cc.moveTo(-90, 60); cc.quadraticCurveTo(0, 10, 90, 50); cc.stroke(); workerAnt(cc, -20, 50, 52, .3); workerAnt(cc, 50, 58, 44, .7); },
  cc => { hop(cc, 30, 70, 62, { dir: -1, ear: 1 }); },
  cc => { zip(cc, 10, -10, 70, { dir: -1, eyeGlow: 1 }); circle(cc, -70, 60, 18, C.lemon); },
  cc => { circle(cc, -55, -10, 46, W.warmA); circle(cc, -55, -10, 26, W.warmB); sleepyLadybug(cc, 50, 30, 26); sleepyLadybug(cc, 80, 60, 20, .4); woollyBear(cc, -10, 90, 26, { curl: .9 }); },
];
const ART_COL = [C.sky, C.lemon, C.mint, C.pink, C.cream];
const ART_TXT = [['Taste', 'with feet'], ['Sniff', 'with antennae'], ['Ears on legs', '& tummies'], ['Big eyes,', 'codes & dances'], ['Winter', 'secrets']];
// trang sổ sau khi tan: một sticker lớn + hai dòng chữ (chữ có ghi cho readcheck)
export function pageSticker(n, t, t0, tText = t0) {
  return c => {
    badge(c, 640, 470, 210, ART_COL[n], cc => { cc.scale(1.9, 1.9); ART[n](cc); }, -.05, back(seg(t, t0, t0 + .4), 2));
    if (t >= tText + .2) popText(c, ART_TXT[n][0], 1260, 440, 92, [C.berryD, C.honeyD, C.leafD, C.berry, C.grape][n], null, t, tText + .2, { step: .02 });
    if (t >= tText + .35) popText(c, ART_TXT[n][1], 1260, 540, 64, C.ink, null, t, tText + .35, { font: subFont, step: .012 });
  };
}

/* ================= CHƯƠNG 5: trang trống → "Where do bugs go in winter?" → Crumb ở lại ủ ấm Albie → Miss Loupe lách ra ngoài ================= */
const L63 = () => lineOf('L63'), L65 = () => lineOf('L65');
export function sC5(c, t) {
  if (t < L65().t - .2) {                                         // cận cảnh trang cuối: trống trơn, đóng băng
    pageView(c, t, 4, { empty: true, t0: H.c5_page, tabsIce: [0, 0, 0, 0] });
    pageCast(c, t, { cname: t > L63().t ? 'surprised' : 'curious', lname: t > lineOf('L64').t ? 'thinking' : 'surprised', lpose: t > lineOf('L64').t ? ARM.shrug : {} });
    winterQ(c, t);
    return;
  }
  const droop = ss(seg(t, H.c5_droop, H.c5_droop + .8)), hug = ss(seg(t, H.c5_hug - .9, H.c5_hug)), exit = ss(seg(t, H.c5_exit, H.c5_exit + 1.2));
  const cx = lerp(CR.x, AL.x - 230, hug);
  const lx = lerp(LP.x, WIN.x + WIN.w - 120, exit), ly = lerp(LP.y, WIN.y + WIN.h - 2.73 * 70, exit), lr = lerp(LP.r, 60, exit);
  sillWide(c, t, { warm: [1, 1, 1, 1], cold: lerp(.25, .6, droop) * (1 - .6 * hug), aname: talkAt(t, 'albie') ? 'sad' : droop > .5 ? (hug > .5 ? 'happy' : 'sleepy') : 'sad', atilt: -.05 * droop, zzz: droop * (1 - hug) * .8,
    cx, cname: t > lineOf('L68').t ? 'excited' : hug > .3 ? 'happy' : 'confident', chop: .2 * pulse(t, lineOf('L67').t, .4), clook: [.8, -.2],
    lname: t > lineOf('L66').t && t < lineOf('L66').t + 2.5 ? 'confident' : 'happy', llook: [.6, -.5], lpose: t > lineOf('L66').t && t < lineOf('L66').t + 2.3 ? ARM.point : exit > 0 ? ARM.up : {},
    loupe: exit < .98, lx, ly, flake: true, after: cc => winterQ(cc, t),
    extra: cc => {
      if (hug > .3) { const p = (t * .5) % 1; for (let i = 0; i < 3; i++) { const q = (p + i / 3) % 1; cc.save(); cc.globalAlpha = (1 - q) * hug; circle(cc, AL.x - 120 + i * 40, AL.y - 260 - q * 120, 12, C.pink); cc.restore(); } }
      const ants = hold(t, H.c5_ants - .2, H.c5_exit + .3, .3, .3);
      if (ants > 0) { const bx = cx - 40, by = CR.y - 480; ell(cc, bx, by, 190 * ants, 150 * ants, 0, C.cream); circle(cc, cx - 10, CR.y - 300, 18 * ants, C.cream); circle(cc, cx, CR.y - 250, 11 * ants, C.cream); antChamber(cc, bx, by, 128, ants, t); }
      if (exit > .5) { const q = seg(t, H.c5_exit + .6, H.c5_exit + 1.2); for (let i = 0; i < 6; i++) circle(cc, WIN.x + WIN.w - 120 + Math.cos(i) * 60 * q, WIN.y + WIN.h - 40 - Math.sin(i * 2) * 40 * q, 14 * (1 - q), C.white); }
    } });
}

function winterQ(c, t) {                                          // câu hỏi lớn của chương: giữ đủ lâu để đọc (readcheck)
  const L = lineOf('L64'); if (t < L.t || t > L.t + 3.6) return;
  big(c, 'WHERE DO BUGS GO', 960, 150, 84, C.grape, C.cream, t, L.t + .1); big(c, 'IN WINTER?', 960, 250, 96, C.berry, C.cream, t, L.t + .5);
}

/* ================= VƯỜN TUYẾT: tổ ong (kính nhiệt), bọ rùa dưới lá (Dot đếm), sâu gấu len, kính mờ, về theo khung cửa ấm ================= */
const GX = { door: 420, hive: 1250, rock: 2250, bear: 3150 }, GY = 830, GR = 95;
function lupX(t) {
  return K([[H.s_c5o, [GX.door]], [H.c5_hiveSeen, [GX.door + 60]], [H.c5_hiveSeen + .8, [GX.hive - 330]], [H.c5_toRock, [GX.hive - 330]], [H.c5_toRock + 1.4, [GX.rock - 330]], [H.c5_toLeaf, [GX.rock - 330]], [H.c5_toLeaf + 1.2, [GX.bear - 320]],
    [H.c5_lost, [GX.bear - 320]], [H.c5_lost + 1.4, [GX.bear - 420]], [H.c5_home, [GX.bear - 420]], [H.c5_home + 2.6, [GX.door + 140]], [H.c5_in + 1, [GX.door + 140]]])(t)[0];
}
const walking = t => [[H.c5_hiveSeen, .8], [H.c5_toRock, 1.4], [H.c5_toLeaf, 1.2], [H.c5_lost, 1.4], [H.c5_home, 2.6]].some(([a, d]) => t > a && t < a + d);
function gardenCam(t) { const x = lupX(t); return { cx: clamp(x + 200, 700, 3400), cy: 640, z: 1.45 }; }
// thế giới vườn tuyết; heat: vẽ bản "kính nhiệt" (lạnh tím xanh, ấm cam đỏ)
function gardenWorld(c, t, o = {}) {
  const heat = o.heat;
  if (heat) { c.fillStyle = W.coldA; c.fillRect(-3000, -2000, 9000, 6000); c.fillStyle = W.coldB; c.fillRect(-3000, 800, 9000, 3000); for (const fx of [180, 1100, 2300, 3200]) rrect(c, fx - 14, 300, 28, 540, 14, '#2A1E70'); }
  else snowGarden(c, t, { y0: 760 });
  // nhà: tường + khung cửa sổ ấm ở bên trái (nơi Miss Loupe đi ra và về)
  rrect(c, -800, -200, 900, 1100, 0, heat ? '#3A2E9A' : W.wall); rrect(c, 60, -200, 40, 1100, 0, heat ? '#2A1E70' : W.wallD);
  warmWindow(c, -620, 220, 520, 420, heat ? 1 : 0);
  if (heat) { circle(c, -360, 430, 340, 'rgba(255,138,47,.35)'); rrect(c, -620, 220, 520, 420, 12, W.warmA); circle(c, -360, 430, 120, W.warmB); }
  // tổ ong
  hiveBox(c, GX.hive, GY + 10, .62, heat ? 1 : 0, t);
  // hòn đá + đống lá: bọ rùa ngủ đông thành đám; Dot thức dậy đếm
  const lift = ss(seg(t, H.c5_lift, H.c5_lift + .6)) * (1 - ss(seg(t, H.c5_dotSleep + .2, H.c5_dotSleep + .9)));
  rock(c, GX.rock + 120, GY + 20, 1.1, !heat);
  const LB = [[-90, -20, .2], [-50, -34, -.3], [-10, -22, .4], [30, -36, 0], [70, -20, -.4], [-70, -52, .1], [-28, -60, -.2], [14, -56, .3], [52, -50, -.1]];
  if (lift > .02 || heat) LB.forEach(([dx, dy, a], i) => sleepyLadybug(c, GX.rock + dx, GY + dy, 24, a));
  if (lift > .02) { const wake = hold(t, H.c5_dotWake, H.c5_dotSleep, .2, .3); dotAt(c, GX.rock - 10, GY - 64 - 30 * wake, 60, { lift: .1 * wake, E: ex(BY.dot, wake > .5 ? 'excited' : 'sleepy', { talk: talkAt(t, 'dot'), look: [-.3, .2], closed: wake > .3 ? 0 : 'happy' }), legsUp: wake > .5 ? [[-.42, -.85, .82], 0, 0, 0, 0, 0] : null }); }
  leafPile(c, GX.rock, GY, 1, lift);
  // sâu gấu len dưới một chiếc lá, đông cứng
  const bearLeaf = ss(seg(t, H.c5_toLeaf + 1.0, H.c5_toLeaf + 1.4));
  woollyBear(c, GX.bear, GY - 30, 64, { freeze: heat ? 0 : .45, curl: .95, t });
  c.save(); c.translate(GX.bear + 20 + 140 * bearLeaf, GY - 70 - 120 * bearLeaf); c.rotate(-.3 + bearLeaf * .8); ell(c, 0, 0, 120, 48, 0, '#C9692A'); capsule(c, -110, 0, 110, 0, 6, '#7A3A10'); c.restore();
  if (!heat) for (let i = 0; i < 5; i++) ell(c, GX.bear - 200 + i * 110, GY + 10, 70, 18, 0, W.snow);
}
export function sC5o(c, t) {
  const k = gardenCam(t), x = lupX(t), lx = x, ly = GY - 2.73 * GR;
  const shiver = t < H.c5_hiveSeen ? Math.sin(t * 50) * 3 : 0, heatOn = hold(t, H.c5_heat, H.c5_toRock, .2, .3), fog = ss(seg(t, H.c5_fog, H.c5_fog + 1.0)), heat2 = ss(seg(t, lineOf('L78').t + .6, lineOf('L78').t + 1.0));
  const lensHeat = Math.max(heatOn, heat2 * (1 - ss(seg(t, H.c5_in, H.c5_in + .5))));
  cam(c, k, () => {
    gardenWorld(c, t);
    const facing = (t > H.c5_lost && t < H.c5_lost + .7) ? Math.sin(t * 10) * .8 : t > H.c5_window ? -1 : 1;
    const name = t < H.c5_hiveSeen ? 'worried' : t < H.c5_heat ? 'curious' : t < H.c5_toRock ? 'surprised' : t < H.c5_found ? (talkAt(t) ? 'explaining' : 'happy') : t < H.c5_found + 1 ? 'excited' : t < lineOf('L78').t ? 'worried' : t < H.c5_window ? 'confident' : 'excited';
    const lpose = t > H.c5_lift - .3 && t < H.c5_lift + .6 ? { handR: [.9, -.3, .3], elbowR: [.6, -.6, .2] } : walking(t) ? {} : t > lineOf('L79').t && t < H.c5_home ? ARM.point : (lensHeat > .3 || t > H.c5_toLeaf + 1.2 && t < H.c5_found) ? ARM.peer : {};
    loupeW(c, lx + shiver, ly - (walking(t) ? Math.abs(Math.sin(t * 9)) * 8 : 0), GR, t, { name, look: facing < 0 ? [-.7, .1] : [.6, .2], yaw: facing < 0 ? -.5 : 0, rot: walking(t) ? .06 * Math.sin(t * 9) : -.06, pose: lpose,
      inside: lensHeat > .02 ? cc => { const win = t > lineOf('L78').t, fx = win ? lerp(lx, -360, ss(seg(t, lineOf('L78').t + .6, H.c5_window))) : GX.hive, fy = win ? 430 : GY - 120, z = win ? .32 : 1.1;   // kính nhiệt nhìn vào tổ ong; lúc lạc đường thì quét về phía khung cửa ấm
        cc.save(); cc.translate(lx, ly); cc.scale(z, z); cc.translate(-fx, -fy); gardenWorld(cc, t, { heat: true }); cc.restore(); } : null });
    if (fog > 0) { circle(c, lx, ly, GR * .92, `rgba(244,251,255,${.92 * fog * (1 - heat2)})`); for (let i = 0; i < 6; i++) circle(c, lx + Math.cos(i) * GR * .5, ly + Math.sin(i * 1.7) * GR * .4, GR * .22, `rgba(255,255,255,${.5 * fog * (1 - heat2)})`); }
    // ba bí mật mùa đông: ba sticker nhỏ bay lên trên đầu
    const fd = hold(t, H.c5_found, H.c5_fog + .3, .3, .3); if (fd > 0) [0, 1, 2].forEach(i => badge(c, lx - 170 + i * 170, ly - 260, 62, [W.warmB, C.tang, '#C9692A'][i], cc => { cc.scale(.55, .55); [() => { circle(cc, 0, 10, 60, W.warmA); circle(cc, 0, 10, 34, W.warmB); }, () => { sleepyLadybug(cc, -20, 10, 30); sleepyLadybug(cc, 30, 30, 24, .5); }, () => woollyBear(cc, 0, 40, 40, { curl: .9 })][i](); }, 0, back(seg(t, H.c5_found + i * .2, H.c5_found + i * .2 + .3), 2.4) * fd));
  });
  // bão tuyết khi lạc đường
  const storm = hold(t, H.c5_fog, H.c5_window + .5, .6, .6);
  if (storm > 0) { c.fillStyle = `rgba(244,251,255,${.35 * storm})`; c.fillRect(0, 0, 1920, 1080); for (let i = 0; i < 90; i++) { const sx = (i * 173 + t * 900) % 2100 - 100, sy = (i * 97 + t * 300) % 1100; capsule(c, sx, sy, sx - 40, sy + 12, 6, `rgba(255,255,255,${.8 * storm})`); } }
  // chữ
  if (t > lineOf('L71').t && t < H.c5_toRock + .8) { big(c, 'A WARM', 1500, 170, 90, W.warmA, C.ink, t, lineOf('L71').t + .4); big(c, 'BEE BALL!', 1500, 270, 96, W.warmB, C.ink, t, lineOf('L71').t + .7); }
  const D = lineOf('L73'); if (t > D.t && t < H.c5_dotSleep + .9) ['1', '2', '3'].forEach((n, i) => { const p = back(seg(t, D.t + i * .35, D.t + i * .35 + .2), 2.6); if (p <= 0) return; const sx = 960 + (-180 + i * 120), sy = 360; c.save(); c.translate(sx, sy); c.scale(p, p); circle(c, 0, -30, 46, C.cream); c.restore(); popText(c, n, sx, sy + 2, 70, C.tang, null, -1, 0, { read: false }); });
  if (t > lineOf('L76').t - .1 && t < H.c5_found) springBubble(c, t, 1350, 330, seg(t, lineOf('L76').t - .1, lineOf('L76').t + .3));
  if (lensHeat > .3 && t > lineOf('L78').t) big(c, 'HEAT LENS!', 960, 170, 96, W.warmB, W.coldA, t, lineOf('L78').t + .6);
}
function springBubble(c, t, x, y, p) {                            // "…and wakes up in spring!": sâu gấu len bò đi giữa hoa
  if (p <= 0) return; const s = back(p, 2);
  c.save(); c.translate(x, y); c.scale(s, s);
  circle(c, -200, 190, 22, C.cream); circle(c, -240, 230, 14, C.cream); ell(c, 0, 0, 280, 190, 0, C.cream);
  c.save(); c.beginPath(); c.ellipse(0, 0, 260, 172, 0, 0, TAU); c.clip(); c.fillStyle = C.skyL; c.fillRect(-300, -200, 600, 400); c.fillStyle = C.leaf; c.fillRect(-300, 60, 600, 200);
  for (const fx of [-180, -60, 170]) { capsule(c, fx, 60, fx, 0, 8, C.leafD); for (let k = 0; k < 5; k++) circle(c, fx + Math.cos(k * 1.26) * 22, Math.sin(k * 1.26) * 22, 14, C.pink); circle(c, fx, 0, 12, C.lemon); }
  woollyBear(c, ((t * 50) % 260) - 130, 70, 34, { curl: 0, freeze: 0, sleep: 0, wake: 1, t });
  circle(c, 200, -110, 40, C.lemon); c.restore(); c.restore();
}

/* ================= KẾT: ba sticker mùa đông vào trang cuối, sổ ấm lại, "Secret unlocked!" ================= */
export function sEnd(c, t) {
  if (t < lineOf('L81').t - .3) {
    const melt = ss(seg(t, H.e_warm, H.e_warm + 1.0));
    pageView(c, t, 4, { melt, tabsIce: [0, 0, 0, 0], t0: H.e_page, sticker: pageSticker(4, t, H.e_stick, 1e9) });
    if (t > H.e_stick && melt < .02) { const p = ss(seg(t, H.e_stick, H.e_stick + 1.0)); [0, 1, 2].forEach(i => badge(c, lerp(2100, 640 + (i - 1) * 120, p), lerp(-100 + i * 80, 470, p), 70, [W.warmB, C.tang, '#C9692A'][i], cc => {}, 0, 1)); }
    pageCast(c, t, { cname: 'excited', lname: 'laugh' });
    return;
  }
  sillWide(c, t, { warm: [1, 1, 1, 1], cold: 0, unlock: true, t0u: lineOf('L81').t, glowI: 3, aname: talkAt(t, 'albie') ? 'excited' : 'laugh', cname: 'excited', lname: 'laugh', chop: .25 * pulse(t, lineOf('L81').t, .4), pages: 4, pagesT: lineOf('L81').t,
    extra: cc => { for (let i = 0; i < 4; i++) { const p = rigTab(i); circle(cc, p[0], p[1], 34 + 6 * Math.sin(t * 4 + i), 'rgba(255,248,231,.5)'); } } });
}
const rigTab = i => [AL.x - 70 + i * 48, AL.y - 2.42 * AL.k];

/* ================= ĐỐ VUI: "Do you remember?" — bốn câu, trẻ trả lời to, rồi tấm che bật ra lộ sticker ================= */
const Q = [['q1', 'q1c', 0], ['q2', 'q2c', 1], ['q3', 'q3c', 2], ['q4', 'q4c', 4]];
export function sQuiz(c, t) {
  const cur = [...Q].reverse().find(([q]) => t >= H[q] - .3) || Q[0], [q, qc, n] = cur;
  pageView(c, t, Math.min(n, 3), { melt: 1, tabsIce: [0, 0, 0, 0], t0: H[q], sticker: pageSticker(n, t, H[q] - .3, 1e9) });   // không hiện chữ đáp án (lời và phụ đề của Crumb đã nói; chữ chỉ kịp hiện 1 s)
  // tấm che "?" chờ trẻ trả lời, bật ra khi Crumb nói đáp án
  const off = ss(seg(t, H[qc] + 2.4, H[qc] + 2.75));
  const wob = off < .01 ? Math.sin(t * 7) * .06 : 0, bob = off < .01 ? Math.abs(Math.sin(t * 3.5)) * 14 : 0;   // tấm che lắc lư chờ trẻ trả lời
  if (off < 1) { c.save(); c.translate(640 + 400 * off, 470 - 300 * off - bob); c.rotate(.6 * off + wob); circle(c, 0, 0, 226, C.grape); popText(c, '?', 0, 70, 260, C.lemon, null, -1, 0, { read: false }); c.restore(); }
  // đồng hồ chờ: ba chấm sáng dần trong lúc trẻ nghĩ
  const wait = hold(t, H[qc], H[qc] + 2.45, .1, .1); if (wait > 0) for (let i = 0; i < 3; i++) circle(c, 600 + i * 40, 760, 13, t > H[qc] + .3 + i * .7 ? C.lemon : 'rgba(255,255,255,.4)');
  pageCast(c, t, { cname: t > H[qc] + 2.4 ? 'excited' : 'thinking', lname: talkAt(t) ? 'explaining' : 'curious', hop: .2 * pulse(t, H[qc] + 2.4, .4) });
  if (t < H.q1 + 1.4) big(c, 'DO YOU REMEMBER?', 960, 1000 - 860, 80, C.grape, C.cream, t, H.s_quiz);
}

/* ================= TẠM BIỆT: ngáp, "See you in spring!", hắt xì → sticker bay như tuyết, một tấm đậu đúng chỗ bông tuyết đầu phim ================= */
const STK = Array.from({ length: 14 }, (_, i) => ({ col: [C.sky, C.lemon, C.mint, C.pink, C.cream][i % 5], a: i * 2.39, r: 300 + (i * 97) % 500, n: i % 5 }));
export function sBye(c, t) {
  const yawn = hold(t, H.e_yawn, H.e_yawn + 2.2, .3, .6), sneeze = pulse(t, H.e_sneeze + 1.4, .5), dusk = ss(seg(t, H.s_bye, H.s_bye + 4));
  const push = ss(seg(t, H.e_land - .4, H.e_land + .6)), k = { cx: lerp(WIDE.cx, FLAKE.x - 20, push), cy: lerp(WIDE.cy, FLAKE.y + 60, push), z: lerp(WIDE.z, 2.45, push) };
  const landed = t > H.e_land;
  sillWide(c, t, { warm: [1, 1, 1, 1], cold: 0, dusk, cam: k, flake: false, aname: t > H.e_sneeze && t < H.e_sneeze + 1.4 ? 'strain' : sneeze > .2 ? 'shout' : yawn > .4 ? 'sleepy' : 'happy', sneeze, ahop: .15 * sneeze,
    cname: yawn > .4 ? 'sleepy' : 'happy', lname: yawn > .4 ? 'sleepy' : landed ? 'laugh' : t > lineOf('L94').t ? 'explaining' : 'happy', lpose: landed ? ARM.peer : t > lineOf('L94').t && t < lineOf('L94').t + 2 ? ARM.point : {},
    lx: lerp(LP.x, FLAKE.x - 30, push), extra: cc => {
      // sticker bay lả tả như tuyết
      const fl = seg(t, H.e_fly, H.e_land + .2);
      if (fl > 0 && fl < 1) STK.forEach((s, i) => { const u = clamp(fl * 1.2 - i * .015), x = AL.x + Math.cos(s.a) * s.r * eo(u) - 700 * u * u, y = AL.y - 300 - Math.sin(s.a) * s.r * eo(u) * .6 + 500 * u * u; badge(cc, x, y, 34, s.col, () => {}, t * 3 + i, 1 - u * .2); });
      if (t > H.e_land - .5) { const u = ss(seg(t, H.e_land - .5, H.e_land)); badge(cc, lerp(FLAKE.x + 300, FLAKE.x, u), lerp(FLAKE.y - 200, FLAKE.y, u), 40, C.tang, b => { b.scale(.32, .32); dotAt(b, 0, 60, 70, { E: ex(BY.dot, 'laugh') }); }, .2 * (1 - u), 1); }
    } });
  if (t > lineOf('L94').t && t < H.e_sneeze + 1.0) { big(c, 'LOOK CLOSELY...', 960, 150, 84, C.cream, C.grape, t, lineOf('L94').t + .1); big(c, 'EVEN IN WINTER.', 960, 250, 84, C.lemon, C.grape, t, lineOf('L94').t + .9); }
  if (t > H.e_sneeze + 1.3 && t < H.e_sneeze + 3.4) big(c, 'CHOO!', 1500, 260, 140, C.cream, C.berry, t, H.e_sneeze + 1.35);
  if (t >= H.recall) hookTitle(c, TITLE, -1, { cx: 960, cy: 270, gone: 1 - back(seg(t, H.recall, H.recall + .32), 2.4) });
}

/* ================= "Did you spot Rollo?": sticker Rollo lăn dọc bậu cửa sổ; bốn chỗ Rollo đã trốn; kết ================= */
export function sRollo(c, t, minis) {
  const dusk = 1;
  if (t < H.e_spots) {
    sillWide(c, t, { warm: [1, 1, 1, 1], cold: 0, dusk, flake: false, aname: 'sleepy', cname: 'happy', lname: t > lineOf('L97').t ? 'wink' : 'surprised', llook: [.7, .3], zzz: .5,
      extra: cc => { const u = seg(t, H.e_rollo, H.e_rollo + 1.4); if (u > 0) { const x = lerp(2000, 160, ss(u)), r = 70; badge(cc, x, SILL - r - 4, r, C.honeyL, b => { b.scale(.6, .6); rolloAt(b, 0, 70, 50, 0); }, -(lerp(2000, 160, ss(u)) - 2000) / r, 1); } } });
    if (t > H.e_rollo + .3) big(c, 'FIND ROLLO!', 960, 170, 100, C.honeyL, C.ink, t, H.e_rollo + .3);
    return;
  }
  // bốn khung nhỏ: bốn chỗ Rollo đã lăn qua trong các trang ký ức
  c.fillStyle = C.grape; c.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 40; i++) circle(c, (i * 211) % 1920, ((i * 97 + t * 60) % 1100), 4 + (i % 3) * 2, 'rgba(255,255,255,.5)');
  minis.forEach((m, i) => {                                       // lưới 2×2, mỗi khung 640×360
    const p = back(seg(t, H.e_spots + i * .6, H.e_spots + i * .6 + .35), 2), x = 560 + (i % 2) * 800 + Math.sin(t * 1.3 + i) * 10, y = 345 + Math.floor(i / 2) * 400 + Math.sin(t * 1.7 + i * 2) * 12; if (p <= 0) return;
    const fw = 640, fh = 360, k = fw / 1920;
    c.save(); c.translate(x, y); c.scale(p, p); c.rotate(-.03 + .02 * i);
    rrect(c, -fw / 2 - 16, -fh / 2 - 16, fw + 32, fh + 32, 20, C.cream);
    c.save(); c.beginPath(); c.roundRect(-fw / 2, -fh / 2, fw, fh, 12); c.clip(); c.translate(-fw / 2, -fh / 2); c.scale(k, k); REC_MUTE(() => m.draw(c)); c.restore();
    const ring = seg(t, H.e_spots + i * .6 + .4, H.e_spots + i * .6 + .9); c.strokeStyle = C.berry; c.lineWidth = 10; c.beginPath(); c.arc(m.rx * k - fw / 2, m.ry * k - fh / 2, 52, -Math.PI / 2, -Math.PI / 2 + TAU * ring); c.stroke();
    c.restore();
  });
  if (t > H.e_spots + .2) big(c, 'ROLLO WAS HERE!', 960, 108, 76, C.lemon, C.night, t, H.e_spots + .2);
  if (t > H.e_end) { const p = ss(seg(t, H.e_end, H.e_end + .6)); c.fillStyle = `rgba(59,31,158,${.92 * p})`; c.fillRect(0, 0, 1920, 1080); if (p > .5) { snowflake(c, 960, 520, 120, t * .4, { glow: 1, arms: [1, 1, 1, 1, 1, 1] }); big(c, 'SEE YOU IN SPRING!', 960, 820, 90, C.lemon, C.night, t, H.e_end + .3); } }
}
