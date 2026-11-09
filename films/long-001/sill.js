// LONG-001 · bậu cửa sổ: móc (bông tuyết), tựa, trang sổ đóng băng của bốn chương, cảnh rộng "Secret unlocked!", trang trống (chương 5).
import { C, circle, ell, capsule, rrect, poly, popText, subFont, clamp, lerp, seg, back, eo, TAU, BY, star, ex, ARM, blinkAt, loupe, zoomIn, sticker,
  K, H, talkAt, lineOf, pulse, hold, cam, shake, big, crumbAt, crumbE, UP_ARMS, DOWN_ARMS, albieW, loupeW, sparkles, breath, ss, ei, flutterAt, sugarCube } from './lib16.js';
import { windowRoom, plantPot, snowflake, frost, W, antChamber, lerpCol } from './props.js';
import { hookTitle } from '/_shared/episode.js';

export const WIN = { x: 300, y: 40, w: 1320, h: 600 }, SILL = 775;
export const POT = { x: 330, y: SILL, s: .8 }, CR = { x: 590, y: SILL + 4, k: 72 }, LP = { x: 960, r: 112 }, AL = { x: 1430, y: SILL + 2, k: 145 };
LP.y = SILL - 2.73 * LP.r;
export const FLAKE = { x: 1040, y: 430 };                        // chỗ bông tuyết đậu trên ô kính (toạ độ bậu cửa sổ)
export const TAB = [C.sky, C.lemon, C.mint, C.pink];

/* ---------- bậu cửa sổ: tường, cửa sổ tuyết rơi, chậu cây; nhân vật do cảnh gọi ---------- */
export function room(c, t, o = {}) {
  windowRoom(c, t, { win: WIN, sillY: SILL, dusk: o.dusk || 0, rollo: o.rollo });
  if (o.flake !== false) {                                       // bông tuyết đầu mùa vẫn dính trên kính (hoặc sticker thay chỗ ở cuối phim)
    const land = o.flakeLand ?? 1;
    if (land >= 1) snowflake(c, FLAKE.x, FLAKE.y, 34, .2, { arms: o.arms, glow: o.glow });
  }
  plantPot(c, POT.x, POT.y, POT.s, t);
}

/* ================= MỞ: bông tuyết rơi lên kính → "Six arms... is it a bug?" → kéo xa ra bậu cửa sổ ================= */
export const TITLE = [{ text: 'IS IT', y: 190, px: 150, fill: C.cream, shadow: C.grape, t0: 0 }, { text: 'A BUG?!', y: 350, px: 176, fill: C.lemon, shadow: C.berry, t0: .12 }];
const flakeFall = t => { const u = ss(seg(t, 0, H.flake + .3)); return { x: lerp(FLAKE.x - 250, FLAKE.x, u), y: lerp(FLAKE.y - 70, FLAKE.y, u), rot: lerp(-1.8, .2, u), land: u >= 1 ? 1 : 0 }; };
const armsAt = t => [0, 1, 2, 3, 4, 5].map(i => hold(t, .9 + i * .18, 3.6 - i * .05, .15, .4));
export const WIDE = { cx: 960, cy: 610, z: 1.3 };                 // cảnh rộng ở bậu cửa sổ: máy đẩy vào để nhân vật đủ to trong khung 16:9
function hookCam(t) { const u = ss(seg(t, H.pull, H.pull + 1.0)); return { cx: lerp(FLAKE.x - 20, WIDE.cx, u), cy: lerp(FLAKE.y - 20, WIDE.cy, u), z: lerp(1.9, WIDE.z, u) }; }
export function sHook(c, t, o = {}) {
  const k = hookCam(t), f = flakeFall(t), arms = armsAt(t), tryO = t > H.tryOpen && t < H.tryOpen + 1.6;
  c.save(); c.translate(shake(t, H.tryOpen + .2, .5, 6), 0);
  cam(c, k, () => {
    room(c, t, { flake: false });
    if (t < H.flake + .3) snowflake(c, f.x, f.y, 34, f.rot, { glow: .4 }); else snowflake(c, FLAKE.x, FLAKE.y, 34, .2, { arms, glow: hold(t, H.flake + .3, 2.4) });
    if (t > H.flake + .3 && t < H.flake + .9) sparkles(c, FLAKE.x, FLAKE.y, 70, seg(t, H.flake + .3, H.flake + .9), 6, C.cream, 10);
    hookCast(c, t, o);
  });
  c.restore();
  const wob = t > H.pull ? 0 : Math.sin(t * 9) * .012;
  hookTitle(c, TITLE, t, { cx: 960, cy: 270, wob, gone: ss(seg(t, H.pull - .1, H.pull + .4)) });
  // "BZZT! Not a bug!" → bảng so sánh: 6 cánh tuyết ≠ 6 chân côn trùng
  const L2 = lineOf('L02'), L3 = lineOf('L03');
  if (t > L2.t && t < L3.t + 3.4) big(c, 'BZZT!', 1580, 300, 120, C.lemon, C.berry, t, L2.t, { step: .04 });
  const cmp = hold(t, L3.t - .1, L3.t + L3.dur + 1.2);
  if (cmp > 0) armsVsLegs(c, 760, 230, cmp, t, L3.t);
  if (t > H.tabs - .1 && t < H.yawn + 1.5) senseIcons(c, t);
}
function hookCast(c, t, o) {
  // Miss Loupe trồi lên từ dưới, kính đặt ngay trên bông tuyết; trong kính bông tuyết phóng to, sáu cánh sáng lần lượt
  const up = ss(seg(t, .55, 1.05)), lx = lerp(FLAKE.x - 30, LP.x, ss(seg(t, H.pull, H.pull + 1))), ly = lerp(LP.y + 420, LP.y, up);
  const name = t < 2.2 ? 'surprised' : t < H.tabs ? 'curious' : t < lineOf('L07').t + 2.5 ? 'explaining' : t < H.yawn + 1 ? 'worried' : 'happy';
  const peer = t < H.pull + .6;
  if (!o.noLup) loupeW(c, lx, ly, LP.r, t, { name, look: peer ? [.1, -.6] : t < H.crumbPop ? [.6, -.1] : t < lineOf('L09').t ? [-.6, 0] : [.5, 0], rot: peer ? -.05 : -.1,
    pose: peer ? ARM.peer : name === 'explaining' ? ARM.point : {},
    inside: peer && up > .1 ? zoomIn(lx, ly, 2.2, FLAKE.x, FLAKE.y, () => { room(c, t, { flake: false }); snowflake(c, FLAKE.x, FLAKE.y, 34, .2, { arms: armsAt(t), glow: .6 }); }) : null });
  // Albie: run cầm cập, quàng khăn; cố mở bìa (băng kêu răng rắc); ngáp
  const al = ss(seg(t, H.pull + .3, H.pull + .9)), tryO = pulse(t, H.tryOpen, 1.2), yawn = hold(t, H.yawn, H.yawn + 3.2, .3, .6);
  if (al > 0) {
    const ice = t < H.tabs ? [1, 1, 1, 1] : [1, 1, 1, 1];
    const glow = [0, 1, 2, 3].map(i => hold(t, H.tabs + i * .35, H.tabs + i * .35 + 1.0, .15, .4));
    albieW(c, AL.x + (1 - al) * 500, AL.y, AL.k, t, { cold: 1, name: t < lineOf('L02').t + 1 ? 'shout' : yawn > .5 ? 'sleepy' : tryO > .3 ? 'strain' : talkAt(t, 'albie') ? 'talk' : 'worried',
      look: [-.6, -.1], tabsIce: ice, tabsGlow: glow, hop: .08 * tryO * Math.abs(Math.sin(t * 30)), page: lineOf('L03').t < t && t < lineOf('L03').t + 2.6 ? [.55, -1.1, -.3] : null, zzz: yawn });
  }
  // Crumb ló ra sau chậu cây, vác viên đường
  const pop = ss(seg(t, H.crumbPop, H.crumbPop + .3));
  if (pop > 0) {
    const hp = .3 * pulse(t, H.crumbPop, .4) + .25 * pulse(t, lineOf('L09').t, .4);
    crumbAt(c, CR.x, CR.y + (1 - pop) * 160, CR.k, { hop: hp, E: crumbE(t < lineOf('L06').t ? 'surprised' : t < lineOf('L09').t ? 'worried' : 'confident', t, { look: [.7, -.2] }), yaw: .8 });
    plantPot(c, POT.x, POT.y, POT.s, t);                         // chậu cây che chân Crumb khi còn đang trồi lên
  }
}
function armsVsLegs(c, x, y, p, t, t0) {                       // 6 ARMS (bông tuyết) ≠ 6 LEGS (côn trùng)
  const s = back(p, 2); c.save(); c.translate(x + 200, y); c.scale(s, s); c.translate(-x - 200, -y);
  rrect(c, x - 10, y - 110, 420, 230, 30, 'rgba(30,27,58,.2)'); rrect(c, x - 20, y - 120, 420, 230, 30, C.cream);
  snowflake(c, x + 70, y - 20, 58, t * .3, { col: W.iceD });
  popText(c, '≠', x + 190, y + 20, 110, C.berry, null, -1, 0, { read: false });
  c.save(); c.translate(x + 310, y + 30); for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) capsule(c, sd * 18, -30 + i * 18, sd * 62, -10 + i * 26, 8, C.ink); ell(c, 0, -30, 26, 30, 0, C.honey); circle(c, 0, -74, 22, C.honey); ell(c, 0, 18, 30, 40, 0, C.honey); c.restore();
  popText(c, '6 ARMS', x + 70, y + 92, 40, C.sky, null, t, t0, { font: subFont }); popText(c, '6 LEGS', x + 310, y + 92, 40, C.honeyD, null, t, t0 + .8, { font: subFont });
  c.restore();
}
const SENSE = [['TASTE', C.sky], ['SMELL', C.lemon], ['HEAR', C.mint], ['SEE', C.pink]];
function senseIcons(c, t) {                                     // bốn tab = bốn giác quan, sáng lần lượt
  SENSE.forEach(([w, col], i) => {
    const t0 = H.tabs + i * .35, p = back(seg(t, t0, t0 + .25), 2.2) * (1 - ss(seg(t, H.yawn + 1.2, H.yawn + 1.5))); if (p <= 0) return;
    const x = 1150 + i * 175, y = 120;
    c.save(); c.translate(x, y); c.scale(p, p); rrect(c, -80, -46, 160, 92, 30, col); c.restore();
    popText(c, w, x, y + 16, 40, C.ink, null, t, t0 + .05, { font: subFont, step: .01 });
  });
}

/* ================= TỰA (≤ 2 s): giống mọi tập, có tuyết rơi; nhạc hiệu ================= */
export function sTitle(c, t) {
  c.fillStyle = C.grape; c.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 16; i++) { const a = -t * .12 + i * TAU / 16; c.fillStyle = C.nightL; c.beginPath(); c.moveTo(960, 540); c.lineTo(960 + Math.cos(a) * 2400, 540 + Math.sin(a) * 2400); c.lineTo(960 + Math.cos(a + TAU / 32) * 2400, 540 + Math.sin(a + TAU / 32) * 2400); c.fill(); }
  for (let i = 0; i < 40; i++) { const x = (i * 211) % 1920 + Math.sin(t + i) * 20, y = ((i * 97 + (t - H.jingle) * 120) % 1200) - 60; circle(c, x, y, 5 + (i % 4) * 2, 'rgba(255,255,255,.8)'); }
  popText(c, 'BIG', 960, 420, 190, C.lemon, C.night, t, H.jingle, { step: .07 });
  popText(c, 'SECRETS', 960, 630, 190, C.lemon, C.night, t, H.jingle - .1, { step: .04 });
  popText(c, 'of tiny bugs', 960, 720, 46, C.cream, null, t, H.jingle + 1.0, { font: subFont, step: .015, read: false });
  snowflake(c, 360, 300, 70, t * .8, { glow: .5 }); snowflake(c, 1560, 760, 56, -t * .7, { glow: .5 });
}

/* ================= TRANG SỔ (cận cảnh): trang đóng băng, Crumb hà hơi, lỗ băng tan → lặn vào ký ức ================= */
export const PAGE = { x: 210, y: 70, w: 1500, h: 810 };
export const HOLE = { x: 980, y: 470 };
// n: chương 0..4; mem(c): vẽ cảnh ký ức (toạ độ khung) để hiện qua lỗ; hole 0..1 lỗ tan; melt 0..1 cả trang tan; sticker(c) hình trên trang sau khi tan
export function pageView(c, t, n, o = {}) {
  c.fillStyle = W.wood; c.fillRect(0, 0, 1920, 1080);
  const br = 1.012 + .012 * Math.sin(t * .9); c.translate(960, 500); c.scale(br, br); c.rotate(.004 * Math.sin(t * .7)); c.translate(-960, -500);   // máy trôi chậm
  rrect(c, PAGE.x - 34, PAGE.y - 30, PAGE.w + 68, PAGE.h + 70, 40, C.grape);                 // bìa tím
  rrect(c, PAGE.x - 34, PAGE.y + PAGE.h + 10, PAGE.w + 68, 30, 14, '#3E1FA8');
  TAB.forEach((col, i) => rrect(c, PAGE.x + 220 + i * 280, PAGE.y - 66, 150, 90, 26, col));
  if (o.tabIce !== false) TAB.forEach((col, i) => { const ice = (o.tabsIce || [1, 1, 1, 1])[i]; if (ice > .01) rrect(c, PAGE.x + 220 + i * 280, PAGE.y - 66, 150, 60, 26, `rgba(214,240,255,${.9 * ice})`); });
  rrect(c, PAGE.x + PAGE.w / 2 - 8, PAGE.y - 66, 16, 40, 6, 'rgba(0,0,0,0)');
  // tab của chương đang mở nảy lên
  rrect(c, PAGE.x + 220 + n * 280, PAGE.y - 80 - 10 * pulse(t, o.t0 ?? 0, .4), 150, 104, 26, TAB[n] || C.cream);
  rrect(c, PAGE.x, PAGE.y, PAGE.w, PAGE.h, 26, C.cream);
  rrect(c, PAGE.x + PAGE.w / 2 - 6, PAGE.y, 12, PAGE.h, 6, '#EBDDBC');                      // gáy giữa hai trang
  if (o.sticker && (o.melt || 0) > .02) o.sticker(c);
  const hr = (o.hole || 0) * 250;
  if (o.mem && (o.melt || 0) < .5) {                             // hình ký ức nằm dưới lớp băng: thấy mờ mờ; chỗ lỗ băng đã tan thấy rõ
    c.save(); c.beginPath(); c.roundRect(PAGE.x, PAGE.y, PAGE.w, PAGE.h, 26); c.clip(); c.globalAlpha = .45 * (1 - (o.melt || 0) * 2); c.translate(PAGE.x, PAGE.y); c.scale(PAGE.w / 1920, PAGE.h / 1080); o.mem(c); c.restore();
    if (hr > 1) { c.save(); c.beginPath(); c.arc(HOLE.x, HOLE.y, hr, 0, TAU); c.clip(); o.mem(c); c.restore(); }
  }
  if (o.empty) { popText(c, '?', 1300, 560, 220, '#E3D6B6', null, -1, 0, { read: false }); }
  frost(c, PAGE.x, PAGE.y, PAGE.w, PAGE.h, { melt: o.melt || 0, mx: HOLE.x, my: HOLE.y, crack: o.crack || 0, t, r: 26, cut: hr });
  if (hr > 1 && (o.melt || 0) < .02) { c.save(); c.beginPath(); c.rect(PAGE.x, PAGE.y, PAGE.w, PAGE.h); c.clip(); c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 16; c.beginPath(); c.arc(HOLE.x, HOLE.y, hr, 0, TAU); c.stroke();
    for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + .2, q = (t * 1.5 + i * .2) % 1; ell(c, HOLE.x + Math.cos(a) * hr, HOLE.y + Math.sin(a) * hr + q * 50, 8, 12, 0, W.iceD); } c.restore(); }
}
// nhân vật ở tiền cảnh của cận cảnh trang sổ: Crumb (trái, hà hơi), Miss Loupe (phải)
export const PC = { x: 330, y: 1070, k: 66 }, PL = { x: 1735, r: 100 }; PL.y = 1075 - 2.73 * PL.r;
export function pageCast(c, t, o = {}) {
  const huff = o.huff || 0, talkC = talkAt(t, 'crumb');
  crumbAt(c, PC.x, PC.y, PC.k, { E: crumbE(o.cname || (huff > 0 && huff < 1 ? 'strain' : talkC ? 'excited' : 'happy'), t, { look: [.8, -.4], mouth: huff > 0 && huff < 1 ? 'o' : undefined }), yaw: .9, lean: huff > 0 && huff < 1 ? .12 : 0, hop: o.hop || 0 });
  if (huff > 0 && huff < 1) breath(c, PC.x + 70, PC.y - 1.8 * PC.k, 60, huff);
  if (!o.noLup) loupeW(c, o.lx ?? PL.x, o.ly ?? PL.y, o.lr ?? PL.r, t, { name: o.lname || 'happy', look: [-.7, -.2], rot: o.lrot ?? -.05, pose: o.lpose || {}, inside: o.inside || null });
}

/* ================= CẢNH RỘNG Ở BẬU CỬA SỔ: "Secret unlocked!", trò chuyện, lật trang ================= */
// warm[i] 0..1: tab thứ i đã tan; glowI: tab vừa mở; t0u: lúc "Secret unlocked!"
export function sillWide(c, t, o = {}) {
  const warm = o.warm || [0, 0, 0, 0], ice = warm.map(w => 1 - w), gl = o.glowI != null ? [0, 1, 2, 3].map(i => i === o.glowI ? hold(t, o.t0u - .2, o.t0u + 3.2, .2, .6) : 0) : [0, 0, 0, 0];
  const cold = o.cold ?? lerp(1, .25, warm.reduce((a, b) => a + b, 0) / 4);
  cam(c, o.cam || WIDE, () => {
    room(c, t, { flake: o.flake !== false, dusk: o.dusk || 0, rollo: o.rollo, arms: o.arms, glow: o.flakeGlow });
    const talkA = talkAt(t, 'albie');
    albieW(c, AL.x, AL.y, AL.k, t, { cold, name: o.aname || (talkA ? 'talk' : o.unlock ? 'excited' : 'happy'), look: o.alook || [-.6, -.1], tabsIce: ice, tabsGlow: gl, hop: o.ahop ?? (o.unlock ? .12 * pulse(t, o.t0u, .5) : 0), zzz: o.zzz, sneeze: o.sneeze, page: o.apage || null, tilt: o.atilt || 0, fx: o.afx });
    if (o.crumb !== false) crumbAt(c, o.cx ?? CR.x, CR.y, CR.k, { E: crumbE(o.cname || 'happy', t, { look: o.clook || [.7, -.2] }), hop: o.chop || 0, yaw: o.cyaw ?? .8, flip: !!o.cflip, arms: o.carms, walk: o.cwalk || 0, ph: t * 2.2 });
    if (o.loupe !== false) loupeW(c, o.lx ?? LP.x, o.ly ?? LP.y, LP.r, t, { name: o.lname || 'happy', look: o.llook || [.5, 0], pose: o.lpose || {}, rot: o.lrot ?? -.08 });
    if (o.extra) o.extra(c);
  });
  if (o.after) o.after(c);
  if (o.unlock) {
    sticker(c, 'SECRET UNLOCKED!', 1060, 170, TAB[o.glowI] || C.lemon, C.ink, seg(t, o.t0u, o.t0u + .5) * (1 - ss(seg(t, o.t0u + 3.4, o.t0u + 3.7))));
    sparkles(c, AL.x, AL.y - 2.5 * AL.k, 160, seg(t, o.t0u, o.t0u + .9), 8, C.lemon, 18);
  }
  if (o.pages != null) pageCounter(c, t, o.pages, o.pagesT);
}
function pageCounter(c, t, n, t0) {                               // 4 ô trang: ô đã ấm sáng màu tab, ô vừa ấm nảy
  for (let i = 0; i < 4; i++) {
    const x = 120 + i * 92, y = 120, on = i < n, p = on && i === n - 1 ? back(seg(t, t0, t0 + .3), 2.6) : 1;
    c.save(); c.translate(x, y); c.scale(p, p); rrect(c, -36, -46, 72, 92, 16, on ? TAB[i] : 'rgba(214,240,255,.9)'); if (!on) { capsule(c, -18, -18, 14, 10, 6, C.white); } else star(c, 0, 0, 20, C.cream); c.restore();
  }
}
// lật trang: trang cũ cuộn sang trái, lộ trang mới (cả hai do caller vẽ)
export function pageFlip(c, t, t0, t1, from, to) {
  const u = ss(seg(t, t0, t1)); to(c);
  if (u >= 1) return;
  c.save(); c.beginPath(); c.rect(0, 0, 1920 * (1 - u), 1080); c.clip(); from(c); c.restore();
  const x = 1920 * (1 - u); ell(c, x, 540, 60 * Math.sin(Math.PI * u) + 4, 620, 0, 'rgba(30,27,58,.18)'); rrect(c, x - 6, -20, 12, 1120, 6, C.cream);
}
