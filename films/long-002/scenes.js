// LONG-002 · các cảnh. Mỗi hàm vẽ một cảnh ở khung 1920×1080 theo t (hàm thuần của t). Mốc thời gian ở timeline.js (H).
import { C, circle, ell, capsule, rrect, poly, popText, subFont, clamp, lerp, seg, back, eo, TAU, star, ss, ei, drawChar, BY, ex, blinkAt, rigPt,
  loupe, ARM, albiePageTip, H, LINES, talkAt, lineBy, pulse, hold, after, cam, camLerp, drift, shake, big, countPop, inked,
  crumbAt, crumbE, UP_ARMS, WAVE_ARMS, albieN, loupeN, dotAt, spindleAt, paperAntennae, flutterN, waggleAt, chirpAt, rolloAt, sparkles, glints } from './lib16.js';
import { N, SILK_LEGS, DESK_Y, deskRoom, CUP, ERASER, TAPE, PAGE, SLOTS, SILK_SLOT, bookSpread, silkSticker, silkLine, clueSlots, clueIcon, dustPatch, PRINT8, footprints,
  paperWingShape, METER, legOMeter, meterBar, babyFlutter, twigLeaf, silkPad, chrysalis, photoFrame, baitFrame, silkBall, caseStamp, charSticker } from './props.js';
import { hookTitle } from '/_shared/episode.js';

const L0 = (who, text) => lineBy(who, text).t;                   // lúc một câu bắt đầu
const Llast = (who, text) => LINES.filter(l => l.who === who && l.text === text).at(-1).t;   // lần nói cuối của một câu lặp
const Ld = (who, text) => { const l = lineBy(who, text); return [l.t, l.t + l.dur]; };

/* ================= vị trí đặt sẵn trên bàn (cảnh rộng) ================= */
export const AL = { x: 1000, y: DESK_Y, k: 150 }, LP = { x: 700, r: 90 }, CR = { x: 1250, y: DESK_Y - 92, k: 58 }, DT = { x: 600, y: DESK_Y, k: 76 };
export const WIDE = { cx: 960, cy: 560, z: 1.22 };
const lpY = (y, r) => y - 2.73 * r;                               // tâm kính khi chân Miss Loupe ở y

/* ================= sợi tơ của vụ án (giăng chéo qua trang Insects) ================= */
export const THREAD = { a: [170, 230], b: [1790, 840], sag: 70 };
const threadPt = u => [lerp(THREAD.a[0], THREAD.b[0], u), lerp(THREAD.a[1], THREAD.b[1], u) + Math.sin(Math.PI * u) * THREAD.sag];
function caseThread(c, t, o = {}) { return silkLine(c, THREAD.a, THREAD.b, t, { sag: THREAD.sag, u: o.u ?? 1, twang: o.twang || 0, w: o.w }); }
// đầu 8 chân của sticker tơ (khớp silkSticker trong props.js), để đặt số đếm
export function silkLegTips(x, y, r) {
  const rot = .08, out = [];
  for (const sd of [-1, 1]) SILK_LEGS.forEach(([, ft]) => { const px = sd * r * ft[0], py = r * ft[1]; out.push([x + px * Math.cos(rot) - py * Math.sin(rot), y + px * Math.sin(rot) + py * Math.cos(rot)]); });
  return out;                                                     // thứ tự đếm: bên trái từ trên xuống, rồi bên phải từ trên xuống
}

/* ================= MÓC: trang Insects lúc nửa đêm → lia nhanh sang bàn học ================= */
const HOOKCAM = { cx: 1080, cy: 560, z: 1.45 };
export const HOOK_TITLE = [{ text: 'WHO SNUCK', y: 230, px: 150, fill: C.cream, shadow: C.grape, t0: 0 }, { text: 'IN?!', y: 400, px: 190, fill: C.lemon, shadow: C.berry, t0: .12 }];
export function hookPage(c, t, o = {}) {
  const k = { ...HOOKCAM, z: HOOKCAM.z + .06 * ss(seg(t, 0, 1.2)), cx: HOOKCAM.cx + 20 * ss(seg(t, 0, 1.2)) };
  cam(c, k, () => {
    bookSpread(c, t, { night: true, wiggle: hold(t, H.wiggle, 99, .1, .1), silkGlow: 1, noRead: true });
    caseThread(c, t, { u: lerp(.55, 1, ei(seg(t, 0, .35))), twang: Math.exp(-t * 4) * .6 });
  });
  if (!o.noTitle) hookTitle(c, HOOK_TITLE, t, { cx: 600, cy: 300, rot: -.04 });
}
export function sHook(c, t) {
  const w0 = H.whip, w1 = H.whip + .35;
  if (t < w0) return hookPage(c, t);
  if (t < w1) {                                                   // lia nhanh: trang trượt ra, bàn học trượt vào
    const u = ei(seg(t, w0, w1));
    c.save(); c.translate(-1920 * u, 0); hookPage(c, t, { noTitle: true }); c.restore();
    c.save(); c.translate(1920 * (1 - u), 0); deskHook(c, t); c.restore();
    c.fillStyle = `rgba(255,248,231,${.3 * Math.sin(Math.PI * u)})`; for (let i = 0; i < 9; i++) c.fillRect(0, 60 + i * 115, 1920, 16 + 8 * (i % 3));
  } else deskHook(c, t);
  parkedTitle(c, t, w0, w1);
}
// chữ móc ở lại qua cú lia: thu nhỏ, đậu vào góc trên trái (không che Albie), rồi thu về 0 lúc ≈ 2,4 s (readcheck: đọc được ≥ 2 s)
function parkedTitle(c, t, w0, w1) {
  const u = ei(seg(t, w0, w1)), gone = ss(seg(t, w1 + .6, w1 + .85)); if (gone >= 1) return;
  const X = lerp(600, 390, u), Y = lerp(300, 170, u), k = lerp(1, .6, u);
  c.save(); c.translate(X, Y); c.scale(k, k); c.translate(-600, -300); hookTitle(c, HOOK_TITLE, t, { cx: 600, cy: 300, rot: -.04, gone }); c.restore();
}
// bàn học: Albie giật mình (vẫn cười), Miss Loupe trượt vào, Dot ló ra sau hũ bút, Crumb nhảy lên cục tẩy, kính xoay lóe
function deskHook(c, t) {
  const k = drift(camLerp({ cx: AL.x, cy: 520, z: 1.7 }, WIDE, ss(seg(t, H.loupeIn - .2, H.loupeIn + .9))), t);
  cam(c, k, () => {
    deskRoom(c, t, { lamp: 1 });
    const pop = pulse(t, H.whip + .25, .5);
    albieN(c, AL.x, AL.y, AL.k, t, { name: t < H.loupeIn + .5 ? 'surprised' : 'curious', tabsUp: Math.max(pop, .3 * hold(t, H.whip, H.loupeIn + 1)), hop: .25 * pop, look: t < H.loupeIn ? [0, -.1] : [-.6, 0], fx: t < H.loupeIn });
    const lu = eo(seg(t, H.loupeIn, H.loupeIn + .5)), lx = lerp(-200, LP.x, lu);
    if (t >= H.loupeIn) {
      const flip = seg(t, H.lensFlip, H.lensFlip + .6);
      loupeN(c, lx, lpY(DESK_Y, LP.r), LP.r, t, { name: flip > 0 && flip < 1 ? 'excited' : 'happy', look: [.5, -.1], rot: -.08 + .25 * Math.sin(Math.PI * flip), pose: flip > 0 && flip < 1 ? ARM.up : ARM.peer });
      if (flip > 0 && flip < 1) sparkles(c, lx + 30, lpY(DESK_Y, LP.r), 150, flip, 8, C.lemon, 20);
    }
    if (t >= H.dotPop) { const u = eo(seg(t, H.dotPop, H.dotPop + .35)); dotAt(c, lerp(CUP.x + 20, DT.x, u), DT.y, DT.k, t, { lift: .5 * pulse(t, H.dotPop, .35), name: 'excited', look: [.4, -.2], legsUp: talkAt(t, 'dot') ? [[.3, -.9, .5]] : null }); }
    if (t >= H.crumbPop) { const u = seg(t, H.crumbPop, H.crumbPop + .45), ar = [lerp(CR.x + 140, CR.x, u), lerp(DESK_Y, CR.y, u) - Math.sin(Math.PI * u) * 120];
      crumbAt(c, ar[0], ar[1], CR.k, { E: crumbE('excited', t, { look: [-.6, -.2] }), arms: talkAt(t, 'crumb') ? WAVE_ARMS : UP_ARMS, yaw: -.6, hop: .2 * pulse(t, L0('crumb', 'Can I help? Can I?') + .2, .3) }); }
  });
}

/* ================= TỰA: nhạc hiệu 2 s ================= */
export function sTitle(c, t) {
  c.fillStyle = C.grape; c.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 16; i++) { const a = -t * .12 + i * TAU / 16; c.fillStyle = C.nightL; c.beginPath(); c.moveTo(960, 540); c.lineTo(960 + Math.cos(a) * 2400, 540 + Math.sin(a) * 2400); c.lineTo(960 + Math.cos(a + TAU / 32) * 2400, 540 + Math.sin(a + TAU / 32) * 2400); c.fill(); }
  popText(c, 'BIG', 960, 420, 190, C.lemon, C.night, t, H.jingle, { step: .07 });
  popText(c, 'SECRETS', 960, 630, 190, C.lemon, C.night, t, H.jingle - .1, { step: .04 });
  popText(c, 'of tiny bugs', 960, 720, 46, C.cream, null, t, H.jingle + 1.0, { font: subFont, step: .015, read: false });
  silkLine(c, [-50, 860], [1970, 860], t, { sag: 40, u: ei(seg(t, H.jingle, H.jingle + .5)) });
  silkSticker(c, 330, 300, 90, t, { glow: .6 }); clueIcon(c, 1, 1590, 300, 70, t);
}

/* ================= trang sổ có dàn nhân vật đứng phía trước (hiện trường, manh mối 1, 3, ôn bài) ================= */
const PC = { x: 190, y: 1075, k: 70 }, PL = { x: 1770, r: 100 };
function pageCast(c, t, o = {}) {
  if (o.crumb !== false) crumbAt(c, o.cx ?? PC.x, o.cy ?? PC.y, o.ck ?? PC.k, { E: crumbE(o.cname || 'curious', t, { look: o.clook || [.6, -.4] }), yaw: o.cyaw ?? .8, arms: o.carms, hop: o.chop || 0, reach: o.creach || 0 });
  if (o.loupe !== false) loupeN(c, o.lx ?? PL.x, o.ly ?? lpY(1080, PL.r), o.lr ?? PL.r, t, { name: o.lname || 'happy', look: o.llook || [-.5, -.2], pose: o.lpose || ARM.peer, rot: o.lrot ?? .08, inside: o.inside });
}

/* ================= HIỆN TRƯỜNG ================= */
export function sScene(c, t) {
  // 1 · trang Insects (máy trôi vào sticker lạ); Dot leo lên sticker, đếm chân; số 8 to
  if (t < H.s_rule) {
    const near = ss(seg(t, H.dotClimb - .3, H.dotClimb + .6));
    const k = drift(camLerp({ cx: 960, cy: 520, z: 1.0 }, { cx: SILK_SLOT.x - 20, cy: SILK_SLOT.y + 40, z: 2.2 }, near), t, .6);
    cam(c, k, () => {
      bookSpread(c, t, { silkGlow: .5 });
      caseThread(c, t);
      const tips = silkLegTips(SILK_SLOT.x, SILK_SLOT.y, 112), [a0, a1] = Ld('dot', 'One, two, three, four...'), [b0, b1] = Ld('dot', 'five, six, seven, eight!');
      tips.forEach((p, i) => countPop(c, i + 1, p[0] + (i < 4 ? -30 : 30), p[1], t, i < 4 ? lerp(a0, a1 - .3, i / 3) : lerp(b0, b1 - .3, (i - 4) / 3), { r: 20 }));
      if (t >= H.dotClimb) { const u = eo(seg(t, H.dotClimb, H.dotClimb + .5)); dotAt(c, lerp(SILK_SLOT.x + 200, SILK_SLOT.x + 10, u), SILK_SLOT.y - 112 + 6 - 40 * Math.sin(Math.PI * u), 46, t, { name: 'excited', look: [-.2, .5], legsUp: talkAt(t, 'dot') ? [[.3, -.9, .5]] : null }); }
    });
    if (t < H.dotClimb + .2) pageCast(c, t, { lname: 'curious', cname: 'curious' });
    if (t >= H.eight) { const p = hold(t, H.eight, H.s_rule + .2, .15, .2); if (p > 0) { c.save(); c.globalAlpha = p; big(c, '8 LEGS?!', 960, 300, 170, C.lemon, C.berry, t, H.eight); c.restore(); } }
    return;
  }
  // 2 · Albie giữ luật: "Insects have SIX!" · Crumb: "But WHY?" · "Rules are rules!"
  if (t < H.s_clues) {
    const k = drift(camLerp({ cx: AL.x + 60, cy: 560, z: 1.9 }, { cx: AL.x + 140, cy: 590, z: 1.6 }, ss(seg(t, L0('crumb', 'But WHY?') - .3, L0('crumb', 'But WHY?') + .4))), t);
    cam(c, k, () => {
      deskRoom(c, t);
      const six = hold(t, L0('albie', 'Eight legs?! Insects have SIX!') + 1.2, H.s_clues, .2, .3);
      albieN(c, AL.x, AL.y, AL.k, t, { name: 'excited', tabsUp: six, hop: .15 * pulse(t, L0('albie', 'Rules are rules!'), .4), look: t > L0('crumb', 'But WHY?') ? [.7, .1] : [0, -.1],
        page: six > .1 ? [.75 * six, -1.3, -.35 * six] : null });
      if (six > 0) { const tip = albiePageTip([.75 * six, -1.3, -.35 * six]), p = rigPt(AL.x, AL.y, AL.k, -.3, 0, tip); sixBadge(c, p[0] + 60, p[1] - 70, 60 * back(six, 2)); }
      crumbAt(c, CR.x, CR.y, CR.k, { E: crumbE(t > L0('crumb', 'But WHY?') && t < L0('albie', 'Rules are rules!') ? 'curious' : 'happy', t, { look: [-.7, -.3] }), yaw: -.7, q: hold(t, L0('crumb', 'But WHY?'), L0('albie', 'Rules are rules!') + .5), arms: UP_ARMS });
      dotAt(c, DT.x + 120, DT.y, DT.k, t, { look: [.6, -.2] });
    });
    return;
  }
  // 3 · ba ô manh mối hiện ra; "Let's zoom in!" (kính giơ cao, lóe)
  const k = drift({ cx: 960, cy: 520, z: 1.02 }, t, .5);
  cam(c, k, () => { bookSpread(c, t); caseThread(c, t); });
  const z = L0('loupe', "Let's zoom in!"), up = hold(t, z - .1, 1e9, .25, .1);
  dotAt(c, 560, 1060, 92, t, { name: 'excited', look: [.6, -.5], legsUp: talkAt(t, 'dot') ? [[.3, -.9, .5], [.25, -.85, .3], [.2, -.8, .1]] : null });
  pageCast(c, t, { lname: up > .5 ? 'excited' : 'happy', lpose: up > .5 ? ARM.up : ARM.peer, lrot: .08 - .1 * up, cname: 'excited', carms: WAVE_ARMS });
  if (up > .5) sparkles(c, PL.x - 20, lpY(1080, PL.r), 170, seg(t, z, z + .7), 8, C.lemon, 22);
}
function sixBadge(c, x, y, r) { if (r <= 0) return; inked(c, cc => cc.arc(x, y, r, 0, TAU), C.lime, 6); popText(c, '6', x, y + r * .42, r * 1.3, C.ink, null, -1, 0, { font: subFont, read: false }); }

/* ================= MANH MỐI 1 · SỢI TƠ ================= */
export function sC1(c, t) {
  if (t < H.s_c1a) {                                              // kính lướt dọc sợi tơ; Crumb gảy; "Only spiders?" — "Nope!"
    const u = lerp(.18, .42, ss(seg(t, H.c1_find, H.c1_find + 2.2))), p = threadPt(u), k = drift({ cx: p[0] + 40, cy: p[1] + 40, z: 1.55 }, t);
    const tw = t > H.c1_twang ? Math.exp(-(t - H.c1_twang) * 3) * 1.4 : 0;
    cam(c, k, () => {
      bookSpread(c, t);
      caseThread(c, t, { twang: tw });
      const cp = threadPt(.3);
      shadowE(c, cp[0] - 30, cp[1] + 225, 60);
      crumbAt(c, cp[0] - 30, cp[1] + 225, 74, { E: crumbE(t > L0('loupe', 'Only spiders?') ? 'curious' : 'excited', t, { look: [.5, -.6] }), yaw: .5, reach: hold(t, H.c1_twang - .3, H.c1_twang + .4),
        arms: t > H.c1_twang - .3 && t < H.c1_twang + .5 ? { armL: [-.32, -2.5, .25], armR: [.5, -3.05, .45] } : UP_ARMS, hop: .15 * pulse(t, H.c1_twang, .3) });
      const nope = hold(t, L0('loupe', 'Nope!') - .05, H.s_c1a, .15, .2);
      const q = threadPt(u + .1), lx = q[0] + 20, ly = q[1], lr = 125;
      loupeN(c, lx, ly, lr, t, { name: nope > .3 ? 'excited' : 'curious', look: [-.4, .3], rot: -.1 + .06 * Math.sin(t * 2),
        inside: cc => silkMacro(cc, lx, ly, lr, t, tw) });
      if (nope > 0) big(c, 'NOPE!', lx, ly - 210, 90, C.berry, C.cream, t, L0('loupe', 'Nope!'));
    });
    return;
  }
  if (t < H.s_c1m) {                                              // Albie: "Look! My baby pictures!" → lật trang
    const k = drift({ cx: AL.x + 100, cy: 560, z: 1.85 }, t);
    const desk = cc => cam(cc, k, () => { deskRoom(cc, t); albieN(cc, AL.x, AL.y, AL.k, t, { name: 'excited', page: [.8, -1.25, -.3], tabsUp: .4, look: [.5, -.1] }); crumbAt(cc, CR.x, CR.y, CR.k, { E: crumbE('excited', t, { look: [-.7, -.3] }), yaw: -.7 }); });
    return pageFlipTo(c, t, H.c1_flip, H.s_c1m, desk, cc => babyPage(cc, H.s_c1m));
  }
  if (t < H.s_c1b) return babyPage(c, t);
  // về bàn: Flutter bay vào; "So Flutter is a suspect!"; "Mmm?!"; biểu tượng sợi tơ bay vào ô 1
  const k = drift({ cx: 1180, cy: 560, z: 1.55 }, t);
  cam(c, k, () => {
    deskRoom(c, t);
    albieN(c, AL.x, AL.y, AL.k, t, { name: 'curious', look: [.7, 0] });
    const u = eo(seg(t, H.flutterIn, H.flutterIn + .9)), fx = lerp(2000, 1500, u), fy = lerp(380, DESK_Y, u), mm = pulse(t, H.c1_mmm, .6);
    flutterN(c, fx, fy, 92, t, { yaw: -1.2, name: t > H.c1_mmm - .1 && t < H.c1_mmm + 1 ? 'surprised' : 'happy', lift: .3 * mm + (1 - u) * .2, alpha: u < 1 ? .5 + .4 * Math.sin(t * 30) : .78 + .1 * mm * Math.sin(t * 40), look: [-.6, -.1] });
    if (mm > 0) popText(c, 'Mmm?!', fx, fy - 300, 56, C.mint, C.ink, t, H.c1_mmm, { font: subFont });
    crumbAt(c, CR.x, CR.y, CR.k, { E: crumbE('excited', t, { look: [.7, -.2] }), yaw: .6, arms: talkAt(t, 'crumb') ? { armL: [-.32, -2.5, .25], armR: [.95, -2.0, .3] } : UP_ARMS });
    dotAt(c, 760, DESK_Y, 70, t, { name: talkAt(t, 'dot') ? 'excited' : 'happy', look: [.7, -.2], legsUp: talkAt(t, 'dot') ? [[.3, -.9, .5]] : null });
  });
}
// trong kính: sợi tơ phóng to thành sợi xoắn bóng, lấp lánh (rung khi bị gảy)
function silkMacro(c, x, y, r, t, tw) {
  c.fillStyle = N.paper; c.fillRect(x - r, y - r, 2 * r, 2 * r);
  for (let i = 0; i < 4; i++) capsule(c, x - r, y - r + 40 + i * 70, x + r, y - r + 40 + i * 70, 6, 'rgba(191,215,242,.7)');
  const wob = Math.sin(t * 60) * 10 * (tw || 0);
  c.save(); c.translate(x, y + wob); c.rotate(.36);
  capsule(c, -r * 1.2, 6, r * 1.2, 6, 34, 'rgba(30,27,58,.25)');
  capsule(c, -r * 1.2, 0, r * 1.2, 0, 30, N.silkD); capsule(c, -r * 1.2, -4, r * 1.2, -4, 18, N.silk);
  c.strokeStyle = 'rgba(160,150,210,.8)'; c.lineWidth = 3; for (let i = -6; i <= 6; i++) { const xx = i * 22 + (t * 30 % 22); c.beginPath(); c.moveTo(xx - 8, -14); c.quadraticCurveTo(xx, 0, xx + 8, 14); c.stroke(); }
  c.restore();
  glints(c, x, y, r * .7, t, 4, C.white, 16);
}
const shadowE = (c, x, y, w) => ell(c, x, y + 2, w, w * .2, 0, 'rgba(30,27,58,.18)');
function silkFibers(c, x, y, t) { for (let i = 0; i < 5; i++) { const a = t * .8 + i; capsule(c, x - 80 + i * 40, y - 4 + Math.sin(a) * 4, x - 40 + i * 40, y + 4 - Math.sin(a) * 4, 2, 'rgba(201,194,234,.9)'); } glints(c, x, y, 70, t, 4, C.cream, 10); }
function pageFlipTo(c, t, t0, t1, from, to) {
  const u = ss(seg(t, t0, t1)); if (u <= 0) return from(c);
  to(c); if (u >= 1) return;
  c.save(); c.beginPath(); c.rect(0, 0, 1920 * (1 - u), 1080); c.clip(); from(c); c.restore();
  const x = 1920 * (1 - u); ell(c, x, 540, 60 * Math.sin(Math.PI * u) + 4, 620, 0, 'rgba(30,27,58,.22)'); rrect(c, x - 6, -20, 12, 1120, 6, C.cream);
}
// trang "BABY PICTURES": ảnh lớn của Flutter lúc còn là sâu (gặm lá → nhả nệm tơ → treo chữ J → nhộng → bướm)
export function babyPage(c, t) {
  const k = drift({ cx: 900, cy: 520, z: 1.06 }, t, .5);
  cam(c, k, () => {
    bookSpread(c, t, { title: 'BABY PICTURES', title2: 'so cute!', stickers: false });
    photoFrame(c, 640, 480, 760, 500, -.03, (cc, w, h) => babyFilm(cc, t, w, h), 'Flutter, age: tiny');
    photoFrame(c, 1340, 360, 330, 230, .06, (cc, w, h) => { cc.fillStyle = C.mintL; cc.fillRect(0, 0, w, h); circle(cc, w / 2, h * .62, 40, '#FFFDF4'); circle(cc, w / 2 + 50, h * .66, 34, '#FFFDF4'); }, 'eggs!');
    photoFrame(c, 1360, 720, 330, 230, -.05, (cc, w, h) => { cc.fillStyle = C.lemon; cc.fillRect(0, 0, w, h); babyFlutter(cc, w / 2 + 20, h * .66, 150, t * .5, {}); }, 'first leaf');
  });
  loupeN(c, 1770, lpY(1080, 100), 100, t, { name: 'explaining', look: [-.7, -.2], pose: ARM.point, rot: .1 });
  crumbAt(c, 170, 1075, 66, { E: crumbE('excited', t, { look: [.7, -.4] }), yaw: .8, arms: t > L0('crumb', 'Oh! To make a cocoon?') ? WAVE_ARMS : UP_ARMS });
}
function babyFilm(c, t, w, h) {
  c.fillStyle = C.skyL; c.fillRect(0, 0, w, h);
  circle(c, w * .85, h * .2, 60, 'rgba(255,255,255,.5)');
  const ty = h * .3, tx = w * .45;
  twigLeaf(c, tx, ty, w * .45, after(t, 'c1_munch', .8));
  const spin = seg(t, H.c1_spin, H.c1_spin + 1.4), hang = seg(t, H.c1_hang, H.c1_hang + 1.0), pupa = seg(t, H.c1_hang + .9, H.c1_hang + 1.4);
  silkPad(c, tx - 30, ty + 18, 40, spin);
  if (pupa < 1) { c.save(); c.globalAlpha = 1 - pupa;
    const curl = ss(hang), sx = lerp(tx + 60, tx - 30, curl), sy = lerp(ty - 34, ty + 18 + 230 * .5, curl);
    babyFlutter(c, sx, sy, 230, t, { munch: t < H.c1_spin ? hold(t, H.c1_munch, H.c1_spin, .1, .2) : 0, curl });
    if (spin > 0 && spin < 1) for (let i = 0; i < 4; i++) { const q = (t * 2 + i / 4) % 1; circle(c, lerp(sx + 110, tx - 30, q), lerp(sy - 10, ty + 18, q), 5, '#FFFFFF'); }
    c.restore(); }
  const fly = seg(t, H.c1_hang + 1.7, H.c1_hang + 2.6);
  if (pupa > 0 && fly < 1) { c.save(); c.globalAlpha = pupa * (1 - fly); chrysalis(c, tx - 30, ty + 22, 150, t, seg(t, H.c1_hang + 1.3, H.c1_hang + 1.8)); c.restore(); } if (fly > 0) flutterN(c, lerp(tx - 30, w * .8, eo(fly)), lerp(ty + 200, h * .55, eo(fly)), 60, t, { yaw: 1.2, alpha: .5 + .4 * Math.sin(t * 28), lift: .2 });
}

/* ================= MANH MỐI 2 · DẤU CHÂN TRONG BỤI TẨY ================= */
const DUST = { x: 960, y: 520 };
export function sC2(c, t) {
  if (t < H.s_c2a) {                                              // máy lia tới đống vụn tẩy
    const k = drift(camLerp(WIDE, { cx: ERASER.x - 120, cy: DESK_Y - 60, z: 2.1 }, ss(seg(t, H.c2_pan, H.c2_pan + 1.2))), t);
    cam(c, k, () => {
      deskRoom(c, t);
      footprints(c, ERASER.x - 20, DESK_Y + 44, .45, t, {}); footprints(c, ERASER.x + 90, DESK_Y + 34, .45, t, {});
      loupeN(c, ERASER.x - 330, lpY(DESK_Y + 10, 70), 70, t, { name: 'curious', look: [.7, .4], pose: ARM.point, rot: -.18 });
      dotAt(c, ERASER.x - 420, DESK_Y + 10, 56, t, { look: [.7, 0] });
    });
    return;
  }
  if (t < H.s_c2b) return dustTop(c, t);
  // về bàn (nhìn ngang): Flutter in 6 dấu; "Then who has eight legs?"; bóng 8 chân lướt trên tường
  const sh = seg(t, H.c2_shadow, H.c2_shadow + 1.4);
  const k = drift(camLerp({ cx: 1150, cy: 610, z: 1.7 }, { cx: 1000, cy: 470, z: 1.15 }, ss(seg(t, H.c2_shadow - .4, H.c2_shadow + .3))), t);
  cam(c, k, () => {
    deskRoom(c, t, { shadow: sh });
    const land = eo(seg(t, H.c2_flutter, H.c2_flutter + .6));
    flutterN(c, lerp(1500, 1180, land), lerp(500, DESK_Y + 30, land), 80, t, { yaw: -1.3, alpha: land < 1 ? .5 + .4 * Math.sin(t * 28) : .78, name: 'happy', look: [-.3, .5] });
    if (land >= 1) { c.save(); c.translate(1180, DESK_Y + 46); c.scale(1, .45); footprints(c, 0, 0, .5, t, { n: 6, pts: [[-60, -50], [-75, 0], [-60, 50], [60, -50], [75, 0], [60, 50]] }); c.restore(); bubbleSix(c, 1180, DESK_Y - 250, t, H.c2_flutter + .6); }
    crumbAt(c, CR.x + 80, CR.y, CR.k, { E: crumbE(t > H.c2_shadow ? 'surprised' : 'excited', t, { look: t > H.c2_shadow ? [-.5, -.8] : [-.6, -.1] }), yaw: -.6, arms: t > H.c2_shadow ? { armL: [-.9, -2.2, .3], armR: [.3, -2.5, .25] } : UP_ARMS, fx: t > H.c2_shadow && t < H.c2_shadow + 1 });
    loupeN(c, 820, lpY(DESK_Y, 80), 80, t, { name: t > L0('loupe', 'Then who has eight legs?') + 1.5 ? 'happy' : 'curious', look: [.6, 0], pose: t > L0('loupe', 'Then who has eight legs?') + 1.5 && t < H.c2_shadow ? ARM.shrug : ARM.peer });
    dotAt(c, 640, DESK_Y, 64, t, { look: [.6, -.2] });
  });
}
function bubbleSix(c, x, y, t, t0) { const p = back(seg(t, t0, t0 + .3), 2); if (p <= 0) return; c.save(); c.translate(x, y); c.scale(p, p); inked(c, cc => { cc.ellipse(0, 0, 110, 80, 0, 0, TAU); }, C.cream, 6); popText(c, '6', -30, 30, 90, C.leaf, null, -1, 0, { font: subFont, read: false }); footprints(c, 45, 0, .22, t, { n: 6, pts: [[-60, -50], [-75, 0], [-60, 50], [60, -50], [75, 0], [60, 50]] }); c.restore(); }
// nhìn thẳng từ trên xuống: hai bước, mỗi bước 8 dấu sáng lần lượt theo lời Dot; Rollo lăn qua để lại rãnh thẳng
export function dustTop(c, t) {
  c.fillStyle = N.wood; c.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 14; i++) capsule(c, -100, i * 90, 2100, i * 90 + 12, 5, 'rgba(184,101,43,.35)');
  const k = drift({ cx: 960, cy: 520, z: 1 + .05 * ss(seg(t, H.s_c2a, H.s_c2a + 6)) }, t, .6);
  cam(c, k, () => {
    dustPatch(c, 960, 520, 1500, 700, t);
    const [a0, a1] = lineBy2('dot', 'One, two, three, four...', 1), [b0, b1] = lineBy2('dot', 'five, six, seven, eight!', 1);
    const lit = PRINT8.map((_, i) => i < 4 ? lerp(a0, a1 - .3, i / 3) : lerp(b0, b1 - .3, (i - 4) / 3));
    footprints(c, 620, 470, 1.6, t, { lit });
    footprints(c, 1320, 560, 1.6, t, { lit: lit.map(x => x + 1e3) });
    PRINT8.forEach(([dx, dy], i) => countPop(c, i + 1, 620 + dx * 1.6 + (dx > 0 ? 70 : -70), 470 + dy * 1.6, t, lit[i], { r: 30 }));
    if (t > H.rollo1) { const u = seg(t, H.rollo1, H.rollo1 + 1.4); capsule(c, -100, 880, lerp(-100, 2100, u), 880, 26, 'rgba(124,114,152,.55)'); if (u < 1) rolloAt(c, lerp(-150, 2100, u), 900, 80, t, lerp(-150, 2100, u) + 150, { yaw: 1.4, name: 'happy' }); }
  });
  dotAt(c, 250, 330, 130, t, { name: 'excited', yaw: .5, look: [.6, .4], legsUp: talkAt(t, 'dot') ? [[.3, -.9, .5], [.25, -.85, .3]] : null });
  const e8 = hold(t, L0('dot', 'Eight feet in every step!'), H.rollo1 + 1.2, .2, .3); if (e8 > 0) { c.save(); c.globalAlpha = e8; big(c, '8 FEET!', 1250, 250, 130, C.lemon, C.berry, t, L0('dot', 'Eight feet in every step!')); c.restore(); }
}
function lineBy2(who, text, nth) { const l = lineByNth(who, text, nth); return [l.t, l.t + l.dur]; }
function lineByNth(who, text, nth) { return LINES.filter(l => l.who === who && l.text === text)[nth] || LINES.find(l => l.who === who && l.text === text); }

/* ================= MANH MỐI 3 · CÁNH GIẤY ================= */
const WING = { x: 1490, y: 560 };
export function sC3(c, t) {
  const flap = .5 + .5 * Math.sin(t * 7);
  if (t < H.s_c3b) {                                              // dưới góc sticker có gì phập phồng; Flutter xoè cánh so
    const k = drift({ cx: 1300, cy: 560, z: 1.6 }, t);
    cam(c, k, () => {
      bookSpread(c, t, { extra: cc => { paperWingShape(cc, WING.x, WING.y, 120 + 10 * flap, .25 * flap); charSticker(cc, 'dot', 1360, 470, 104, t, .05 - .06 * after(t, 'c3_flap', .4)); } });
      const u = eo(seg(t, H.c3_compare, H.c3_compare + .7));
      flutterN(c, lerp(1950, 1650, u), 760, 96, t, { yaw: -1.25, alpha: u < 1 ? .5 + .4 * Math.sin(t * 28) : .2 + .1 * Math.sin(t * 3), name: 'excited', look: [-.6, .2] });
      crumbAt(c, 1130, 790, 74, { E: crumbE('surprised', t, { look: [.7, -.3] }), yaw: .7, arms: { armL: [-.32, -2.5, .25], armR: [.95, -2.0, .3] }, fx: t < H.c3_flap + 1 });
      loupeN(c, 900, lpY(800, 95), 95, t, { name: 'curious', look: [.8, -.1], pose: ARM.peer });
    });
    return;
  }
  // kính lớn trên cánh giấy: vân giấy, nét chì, mép răng cưa, băng dính
  const k = drift({ cx: 1350, cy: 540, z: 1.3 }, t, .5);
  cam(c, k, () => { bookSpread(c, t, { extra: cc => { paperWingShape(cc, WING.x, WING.y, 120 + 10 * flap, .25 * flap); charSticker(cc, 'dot', 1360, 470, 104, t, -.01); } }); });
  const ip = eo(seg(t, H.c3_lens, H.c3_lens + .6)), lx = lerp(1700, 1060, ip), ly = lerp(560, 370, ip), lr = lerp(110, 255, ip);
  loupeN(c, lx, ly, lr, t, { name: 'excited', look: [.2, -.2], rot: -.04,
    inside: cc => { cc.fillStyle = N.paper; cc.fillRect(lx - lr, ly - lr, 2 * lr, 2 * lr); cc.translate(lx, ly); cc.scale(2.6, 2.6); cc.translate(-WING.x - 45, -WING.y + 30); paperWingShape(cc, WING.x, WING.y, 130, 0, { grain: true }); } });
  crumbAt(c, 170, 1075, 70, { E: crumbE(t > L0('crumb', 'A paper wing? But WHY?') - .2 ? 'curious' : 'excited', t, { look: [.7, -.4] }), yaw: .8, q: hold(t, L0('crumb', 'A paper wing? But WHY?'), L0('loupe', 'Somebody wanted to LOOK like a bug!') + .3) });
  if (t > H.c3_slot - .6) { const u = eo(seg(t, H.c3_slot - .6, H.c3_slot - .1)); dotAt(c, lerp(-120, 330, u), 1060, 100, t, { name: 'excited', look: [.7, -.4], legsUp: talkAt(t, 'dot') ? [[.3, -.9, .5]] : null }); }
  const dis = L0('albie', 'A disguise! In MY book!');
  if (t > dis - .2) { const u = eo(seg(t, dis - .2, dis + .2)); albieN(c, lerp(2150, 1820, u), 1090, 150, t, { name: 'excited', yaw: -.5, look: [-.7, -.2], tabsUp: .6 * pulse(t, dis + .2, .5) }); }
  if (ip > .9) labels(c, t, [['scissor zigzag!', 640, 230, H.c3_lens + .7], ['pencil lines', 1480, 200, H.c3_lens + 1.2], ['sticky tape!', 1500, 560, L0('loupe', "It's paper! With sticky tape!") + .9]]);
}
function paperGrain(c, x, y, t) { c.strokeStyle = 'rgba(201,189,160,.6)'; c.lineWidth = 1.2; for (let i = 0; i < 26; i++) { c.beginPath(); c.moveTo(x - 140 + i * 11, y - 120); c.lineTo(x - 150 + i * 11 + 20 * Math.sin(i), y + 120); c.stroke(); } }
function labels(c, t, list) { for (const [s, x, y, t0] of list) { const p = back(seg(t, t0, t0 + .3), 2.2); if (p <= 0) continue; c.save(); c.translate(x, y); c.scale(p, p); c.font = subFont(40); const w = c.measureText(s).width + 40; inked(c, cc => cc.roundRect(-w / 2, -32, w, 64, 20), C.lemon, 5); popText(c, s, 0, 14, 40, C.ink, null, -1, 0, { font: subFont }); c.restore(); } }

/* ================= TÓM TẮT ba manh mối → "Time for a lineup!" ================= */
export function sSum(c, t) {
  const k = drift({ cx: 960, cy: 520, z: 1.0 }, t, .4);
  cam(c, k, () => { bookSpread(c, t, { title: false, stickers: false }); });
  const [a, b] = Ld('loupe', 'Silk... eight feet... a paper wing.');
  [0, 1, 2].forEach(i => { const t0 = lerp(a, b - .4, i / 2), p = back(seg(t, t0, t0 + .3), 2.2); if (p <= 0) return; c.save(); c.translate(480 + i * 480, 430); c.scale(p, p); inked(c, cc => cc.arc(0, 0, 150, 0, TAU), C.cream, 8); clueIcon(c, i, 0, 0, 105, t); c.restore(); if (i < 2 && t > t0 + .3) popText(c, '+', 720 + i * 480, 470, 120, C.grape, null, -1, 0, { read: false }); });
  const q = L0('loupe', 'Time for a lineup!'); if (t > q) { big(c, 'LINEUP!', 960, 800, 150, C.lemon, C.berry, t, q); }
  loupeN(c, 1780, lpY(1080, 96), 96, t, { name: t > q ? 'excited' : 'explaining', look: [-.7, -.2], pose: t > q ? ARM.up : ARM.point, rot: .1 });
}

/* ================= HÀNG NGHI PHẠM · LEG-O-METER ================= */
export const SX = { waggle: 300, flutter: 650, chirp: 1000, spindle: 1360, rollo: 1660 };
const BAR = id => SX[id] - 150;
const LINE_WIDE = { cx: 960, cy: 520, z: 1.0 };
export function sLine(c, t) {
  if (t < H.in_w) {                                               // Albie: "Suspects! Step in line!"
    const k = drift({ cx: AL.x + 40, cy: 560, z: 1.9 }, t);
    cam(c, k, () => { deskRoom(c, t); albieN(c, AL.x, AL.y, AL.k, t, { name: 'excited', tabsUp: .5, page: [.9, -1.6, -.6], look: [.4, -.1], hop: .15 * pulse(t, H.s_line + .3, .4) }); });
    return;
  }
  // máy: rộng → theo Dot đếm từng người → Spindle → kính lớn → thân → râu → rộng
  const camAt = () => {
    const P = [[H.in_w, LINE_WIDE], [H.s_lw, { cx: SX.waggle + 120, cy: 500, z: 1.45 }], [H.s_lf, { cx: (SX.flutter + SX.chirp) / 2, cy: 520, z: 1.3 }], [H.s_ls, { cx: SX.spindle, cy: 520, z: 1.55 }],
      [H.s_body, { cx: 900, cy: 520, z: 1.05 }], [H.s_ant, { cx: 960, cy: 440, z: 1.15 }], [H.l_up, { cx: SX.spindle, cy: 430, z: 1.35 }], [H.s_lq, LINE_WIDE]];
    let k = P[0][1]; for (let i = 1; i < P.length; i++) k = camLerp(k, P[i][1], ss(seg(t, P[i][0] - .2, P[i][0] + .6)));
    return drift(k, t, .7);
  };
  const k = camAt();
  cam(c, k, () => lineupWorld(c, t));
  // Miss Loupe tiền cảnh trái (có lời), Albie tiền cảnh phải (có lời)
  const lt = talkAt(t, 'loupe') > 0 || t > H.s_body - .3 && t < H.l_up;
  if (t < H.l_lens - .1 || t > H.l_pop + 1.2) loupeN(c, 130, lpY(1100, 100), 100, t, { name: lt ? 'explaining' : 'happy', look: [.7, -.2], pose: ARM.point, rot: -.1 });
  if (t > H.s_lq - .4) { const u = eo(seg(t, H.s_lq - .4, H.s_lq + .1)); crumbAt(c, lerp(-150, 340, u), 930, 80, { E: crumbE('curious', t, { look: [.6, -.4] }), yaw: .7, q: hold(t, H.s_lq, L0('loupe', "Then let's catch the intruder... in the act!")) }); }
  const at = talkAt(t, 'albie') > 0;
  albieN(c, 1840, 1110, 140, t, { name: at ? 'excited' : 'curious', yaw: -.55, look: [-.8, -.2], tabsUp: at ? .4 : 0 });
  // kính lớn sau lưng Spindle: hai chân giấu đang vẫy → "Seven... eight!"
  const li = hold(t, H.l_lens, H.l_pop + 1.1, .35, .3);
  if (li > 0) lensPOV(c, t, li);
}
// nhìn qua kính (POV): vòng kính lớn đầy khung, bên trong là lưng Spindle phóng to, hai chân giấu đang vẫy → "Seven... eight!"
function lensPOV(c, t, a) {
  const R = lerp(140, 470, eo(a)), cx = 960, cy = 500;
  c.save(); c.globalAlpha = Math.min(1, a * 1.5); c.fillStyle = 'rgba(30,27,58,.72)'; c.beginPath(); c.rect(0, 0, 1920, 1080); c.arc(cx, cy, R, 0, TAU, true); c.fill('evenodd'); c.restore();
  hiddenLegsLens(c, t, cx, cy, R, Ld('dot', 'Seven... eight!')[0]);
  dotAt(c, 300, 1000, 120, t, { name: 'excited', look: [.7, -.4], legsUp: talkAt(t, 'dot') ? [[.3, -.9, .5]] : null, yaw: .5 });
}
// vòng kính và lưng Spindle phóng to trong kính (dùng cả ở ảnh bìa, poster.js): số 7, 8 nảy trên hai chân giấu từ lúc s0, cách nhau 0,55 s
export function hiddenLegsLens(c, t, cx, cy, R, s0, mag = 2.3 * R / 470) {
  c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip();
  c.translate(cx, cy); c.scale(mag, mag); c.translate(-SX.spindle, -(DESK_Y - 130)); lineupWorld(c, t, { only: 'spindle', back: true });
  c.restore();
  c.lineWidth = 34; c.strokeStyle = C.berry; c.beginPath(); c.arc(cx, cy, R + 17, 0, TAU); c.stroke(); c.lineWidth = 6; c.strokeStyle = C.ink; c.beginPath(); c.arc(cx, cy, R + 34, 0, TAU); c.stroke();
  c.save(); c.globalAlpha = .5; c.lineWidth = 14; c.strokeStyle = C.white; c.beginPath(); c.arc(cx, cy, R - 40, -2.7, -2.0); c.stroke(); c.restore();
  const k = mag / 2.3;
  [...TUCK].sort((p, q) => p[0] - q[0]).forEach(([wx, wy], i) => { const x = cx + (wx - SX.spindle) * mag, y = cy + (wy - (DESK_Y - 130)) * mag, on = t > s0 + i * .55;
    c.lineWidth = 9 * k; c.strokeStyle = on ? C.lemon : 'rgba(255,227,77,' + (.5 + .4 * Math.sin(t * 9)) + ')'; c.beginPath(); c.arc(x, y, (58 + 6 * Math.sin(t * 8 + i)) * k, 0, TAU); c.stroke();
    countPop(c, 7 + i, x, y - 100 * k, t, s0 + i * .55, { r: 50 * k }); });
}
// thế giới hàng nghi phạm (toạ độ 1920×1080)
export function lineupWorld(c, t, o = {}) {
  legOMeter(c, t, { read: !o.back });
  const enter = (name, d = .6) => eo(seg(t, H[name], H[name] + d));
  // cột đo
  if (!o.back) {
    meterBar(c, BAR('waggle'), 6, t, H.m_w, { col: C.lemon }); meterBar(c, BAR('flutter'), 6, t, H.m_f, { col: C.mint }); meterBar(c, BAR('chirp'), 6, t, H.m_c, { col: C.skyL });
    if (t >= H.m_s6) { const to8 = t >= H.l_pop; meterBar(c, BAR('spindle'), to8 ? 8 : 6, t, to8 ? H.l_pop : H.m_s6, { col: to8 ? C.berry : C.pink }); if (to8) sparkles(c, BAR('spindle'), METER.y0 - 8 * METER.step - 44, 120, seg(t, H.l_pop + .3, H.l_pop + 1.1), 8, C.lemon, 20); }
  }
  const out = t > H.l_up;
  const only = id => !o.only || o.only === id;
  // Waggle, Flutter, Chirp
  if (only('waggle') && t >= H.in_w) { const u = enter('in_w'); waggleAt(c, lerp(-200, SX.waggle, u), DESK_Y, 98, t, { yaw: .5, wing: Math.sin(t * 40) * .5 + .5, name: 'happy', look: [.4, 0] }); bodyParts(c, t, 'waggle'); antBoing(c, t, SX.waggle + 40, DESK_Y - 285, 0); }
  if (only('flutter') && t >= H.in_f) { const u = enter('in_f'); flutterN(c, lerp(-200, SX.flutter, u), DESK_Y - 30 * (1 - u), 100, t, { yaw: .6, name: 'happy', alpha: u < 1 ? .5 + .4 * Math.sin(t * 28) : .78, look: [.4, 0] }); antBoing(c, t, SX.flutter + 30, DESK_Y - 280, 1); }
  if (only('chirp') && t >= H.in_c) { const u = seg(t, H.in_c, H.in_c + .6); chirpAt(c, lerp(-200, SX.chirp, eo(u)), DESK_Y - Math.sin(Math.PI * u) * 160, 118, t, { yaw: .9, name: 'happy', chirp: pulse(t, H.in_c + .5, .4), look: [.4, 0] }); antBoing(c, t, SX.chirp + 120, DESK_Y - 230, 2); }
  // Spindle: thả tơ xuống; áo sọc ong, râu giấy, giấu 2 chân (o.back: nhìn từ sau trong kính)
  if (only('spindle') && t >= H.in_s && t < H.rollo) {
    const d = eo(seg(t, H.in_s, H.in_s + .9)), up = ei(seg(t, H.l_up, H.l_up + 1.2)), y = DESK_Y - (1 - d) * 700 - up * 900;
    const hidden = t < H.l_pop ? 1 : 0, droop = seg(t, H.a_droop, H.a_droop + .5) + seg(t, H.a_droop + .7, H.a_droop + 1.3);
    const talk = talkAt(t, 'spindle') > 0, name = t >= H.l_pop && t < H.l_pop + 1.2 ? 'surprised' : talk ? 'talk' : 'happy';
    if (o.back) {                                                 // nhìn từ sau (trong kính): hai chân giấu đang giơ lên sau lưng, vẫy
      const w = .1 * Math.sin(t * 9);
      spindleAt(c, SX.spindle, y, 120, t, { yaw: 2.5, sweater: true, name, legs: [0, 0, 0, [-.55, -2.05 + w, -1.25], 0, 0, 0, [.55, -2.05 - w, -1.25]] });
    } else spindleAt(c, SX.spindle, y, 120, t, { yaw: -.25, thread: d < 1 || up > 0, hidden, sweater: true, ant: t < H.a_droop + 1.4 ? 1 : 0, droop, name, look: [-.3, 0] });
    bodyParts(c, t, 'spindle');
  }
  // Rollo: đứng cuối hàng, không ai để ý; cuối cảnh ngó quanh rồi lăn đi
  if (only('rollo') && t >= H.rollo2) {
    const u = eo(seg(t, H.rollo2, H.rollo2 + .6)), go = seg(t, H.rollo + .6, H.rollo + 1.3), x = lerp(2100, SX.rollo, u) + go * 500;
    rolloAt(c, x, DESK_Y, 82, t, x, { yaw: -1.3, name: 'happy', look: t > H.rollo && t < H.rollo + .6 ? [Math.sin(t * 8) * .6, 0] : [-.3, 0] });
  }
  // Dot đếm, đi dọc hàng
  if (!o.back) {
    const DX = [[H.s_lw, SX.waggle + 150], [H.s_lf, SX.flutter + 150], [H.m_f + .3, SX.chirp + 170], [H.s_ls, SX.spindle - 230], [H.s_body, 960], [H.l_up, 960]];
    let dx = 960; for (const [tt, x] of DX) dx = lerp(dx, x, ss(seg(t, tt - .5, tt)));
    if (t > H.in_s) dotAt(c, dx, DESK_Y + 70, 72, t, { name: talkAt(t, 'dot') ? 'talk' : 'happy', look: [-.4, -.5], legsUp: talkAt(t, 'dot') ? [[.3, -.9, .5]] : null, yaw: .3 });
  }
}
const TUCK = [-1, 1].map(sd => rigPt(SX.spindle, DESK_Y, 120, 2.5, 0, [sd * .55, -2.05, -1.25]));   // hai bàn chân giấu (nhìn từ sau, yaw 2.5)
function tuckedGlow(c, t) { return; for (const sd of [-1, 1]) { const x = SX.spindle + sd * 32, y = DESK_Y - 150; c.lineWidth = 6; c.strokeStyle = 'rgba(255,227,77,' + (.6 + .3 * Math.sin(t * 8)) + ')'; c.beginPath(); c.arc(x, y, 30 + 4 * Math.sin(t * 8), 0, TAU); c.stroke(); } }
// đếm phần thân: số nảy trên đầu, ngực, bụng (Waggle) hoặc đầu-ngực, bụng (Spindle)
function bodyParts(c, t, id) {
  if (t < H.s_body || t > H.s_ant) return;
  const t0 = id === 'waggle' ? H.b_w : H.b_s, P = id === 'waggle' ? [[SX.waggle + 95, DESK_Y - 175], [SX.waggle + 10, DESK_Y - 150], [SX.waggle - 80, DESK_Y - 110]] : [[SX.spindle - 10, DESK_Y - 105], [SX.spindle + 60, DESK_Y - 150]];
  P.forEach(([x, y], i) => { const tt = t0 + .25 + i * .45; if (t > tt) { circle(c, x, y, 52, 'rgba(255,227,77,.35)'); countPop(c, i + 1, x, y - 80, t, tt, { r: 30, fill: id === 'waggle' ? C.lime : C.pink }); } });
}
function antBoing(c, t, x, y, i) {
  if (t < H.a_boing || t > H.s_lq) return; const t0 = H.a_boing + i * .3, p = pulse(t, t0, .4);
  if (t > t0) { countPop(c, 2, x, y - 40 - 20 * p, t, t0, { r: 26, fill: C.lime }); }
}

/* ================= BẪY BAN ĐÊM ================= */
const BAIT_PAGE = [1.15, -1.35, -.25];
const baitPos = () => { const tip = albiePageTip(BAIT_PAGE); return rigPt(AL.x, AL.y, AL.k, -.3, 0, tip); };
const TRAP_A = [1740, 470];                                       // đầu sợi tơ: khớp cần đèn
export function sTrap(c, t) {
  const lamp = t < H.t_lamp0 ? 1 : t < H.t_lamp1 ? 1 - ss(seg(t, H.t_lamp0, H.t_lamp0 + .25)) : ss(seg(t, H.t_lamp1, H.t_lamp1 + .2));
  const moon = 1 - lamp, bp = baitPos(), B = [bp[0] + 70, bp[1] - 40];
  const k = (() => { let k = { cx: 1060, cy: 560, z: 1.24 }; k = camLerp(k, { cx: 1350, cy: 520, z: 1.65 }, ss(seg(t, H.s_snap - .3, H.s_snap + .5))); k = camLerp(k, { cx: 1180, cy: 560, z: 1.25 }, ss(seg(t, H.t_lamp1, H.t_lamp1 + .6))); return drift(k, t, .6); })();
  cam(c, k, () => {
    deskRoom(c, t, { lamp, moon,
      cupPeek: cc => { if (t < H.t_hide) return; const u = eo(seg(t, H.t_hide, H.t_hide + .5)), out = eo(seg(t, H.t_lamp1, H.t_lamp1 + .4)); loupeN(cc, CUP.x + 10, CUP.y - CUP.h - 70 + (1 - u) * 160 - out * 60, 70, t, { name: t > H.t_come ? 'curious' : 'happy', look: [.8, .1], pose: ARM.peer }); },
      tapePeek: (cc, x, y) => { if (t < H.t_hide) return; cc.save(); cc.beginPath(); cc.arc(x, y, 30, 0, TAU); cc.clip(); crumbAt(cc, x + 4, y + 110, 46, { E: crumbE('excited', t, { look: [-.8, -.2] }), yaw: -.7, carry: null }); cc.restore(); } });
    // Rollo nấp sau hũ bút (trứng phục sinh)
    rolloAt(c, CUP.x - 150, DESK_Y, 60, t, 0, { yaw: 1.3, look: [.6, -.2] });
    // Albie giả ngủ, giơ mồi bằng "tay" trang giấy
    const sleeping = t > H.t_lamp0 && t < H.t_lamp1;
    albieN(c, AL.x, AL.y, AL.k, t, { name: sleeping ? 'wink' : 'happy', page: t > H.t_bait ? BAIT_PAGE : null, look: [.6, -.1], closed: sleeping && t < H.t_come ? 'happy' : null });
    if (t > H.t_bait) baitFrame(c, B[0], B[1], 80, t, seg(t, H.t_bait, H.t_bait + .4));
    if (sleeping && t < H.s_snap) zzz(c, AL.x + 40, AL.y - 360, t);
    // Dot sau cục tẩy
    if (t > H.t_hide) dotAt(c, ERASER.x - 60, ERASER.y - 92 + 30 * (1 - eo(seg(t, H.t_hide, H.t_hide + .4))), 52, t, { look: [-.7, .1] });
    else crumbAt(c, B[0] - 80, DESK_Y, 64, { E: crumbE('excited', t, { look: [.4, -.6] }), yaw: .6, arms: WAVE_ARMS });
    // sợi tơ từ cần đèn tới gần mồi; kẻ cải trang đi trên tơ → trượt → cuộn thành cục tơ nảy như bạt nhún → bung
    if (t > H.t_come - .2) {
      const bounce = t > H.t_tangle ? Math.abs(Math.sin((t - H.t_tangle) * 7)) * Math.exp(-(t - H.t_tangle) * .8) : 0;
      const pt = silkLine(c, TRAP_A, [B[0] + 120, B[1] - 30], t, { sag: 40 + 160 * bounce, u: 1 });
      const walk = seg(t, H.t_come, H.t_step + .8), wu = lerp(.05, .62, walk), p = pt(wu);
      if (t < H.t_tangle) spindleAt(c, p[0], p[1] + 4, 66, t, { yaw: -.9, hidden: 1, wings: true, sweater: true, ant: 1, lean: Math.sin(t * 9) * .12, name: t > H.t_step ? 'surprised' : 'happy', look: [-.6, .2] });
      else if (t < H.t_pop) { const q = seg(t, H.t_tangle, H.t_tangle + .5); silkBall(c, p[0], p[1] + 40 - bounce * 120, 70, t, q); if (q < 1) spindleAt(c, p[0], p[1] + 4, 66, t, { yaw: t * 8, hidden: 1, wings: true, sweater: true, ant: 1, alpha: 1 - q }); boingFx(c, p[0], p[1] + 40 - bounce * 120, t); }
      else {                                                       // bung ra: đồ cải trang bay, 8 chân bật, Spindle treo trên tơ của mình
        const q = seg(t, H.t_pop, H.t_pop + .8);
        disguiseBurst(c, p[0], p[1] + 30, t, q);
        spindleAt(c, p[0], p[1] + 230 - 40 * (1 - eo(q)), 70, t, { thread: true, name: t < H.t_lamp1 + .4 ? 'surprised' : 'laugh', look: [-.6, 0] });
      }
    }
    if (t > H.t_lamp1) { const u = eo(seg(t, H.t_lamp1, H.t_lamp1 + .5)); crumbAt(c, lerp(TAPE.x, TAPE.x - 120, u), DESK_Y - 120 * Math.sin(Math.PI * u), 60, { E: crumbE('excited', t, { look: [-.5, -.4] }), yaw: -.6, arms: WAVE_ARMS }); }
  });
  if (t > H.t_come && t < H.s_snap) { const [d0] = Ld('dot', 'One, two... six legs!'); if (t > d0) big(c, '6?', 1500, 260, 120, C.lemon, C.berry, t, d0); }
  if (t > H.t_lamp1) { const g = L0('crumb', 'Gotcha!'); big(c, 'GOTCHA!', 960, 200, 150, C.lemon, C.berry, t, g); }
}
function zzz(c, x, y, t) { for (let i = 0; i < 3; i++) { const p = (t * .5 + i / 3) % 1; c.save(); c.globalAlpha = 1 - p; popText(c, 'z', x + p * 90 + i * 20, y - p * 120, 40 + i * 14, C.cream, C.grape, -1, 0, { font: subFont, read: false }); c.restore(); } }
function boingFx(c, x, y, t) { for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + (i - 1) * .6; capsule(c, x + Math.cos(a) * 95, y + Math.sin(a) * 95, x + Math.cos(a) * 125, y + Math.sin(a) * 125, 9, C.lemon); } }
function disguiseBurst(c, x, y, t, q) {
  if (q >= 1.6) return; const e = eo(clamp(q));
  c.save(); c.translate(x - 260 * e, y - 220 * e); c.rotate(q * 6); paperWingShape(c, 0, 0, 90, 0); c.restore();
  c.save(); c.translate(x + 240 * e, y - 260 * e); c.rotate(-q * 5); paperWingShape(c, 0, 0, 90, 0); c.restore();
  c.save(); c.translate(x + 60 * e, y - 360 * e); c.rotate(q * 4); for (let i = 0; i < 4; i++) rrect(c, -60, -50 + i * 26, 120, 26, 8, i % 2 ? C.ink : C.lemon); c.lineWidth = 5; c.strokeStyle = C.ink; c.strokeRect(-60, -50, 120, 104); c.restore();
  paperAntennae(c, x - 120 * e, y - 120 - 200 * e, 60, 0, 1, 1.6 * e, t, q * 3);
  sparkles(c, x, y, 260, clamp(q), 10, C.lemon, 24);
}

/* ================= THÚ NHẬN ================= */
const SP = { x: 1330, y: 640 };
export function sConf(c, t) {
  const k = drift(t < H.s_confb ? { cx: 1180, cy: 520, z: 1.6 } : { cx: 1150, cy: 540, z: 1.4 }, t);
  cam(c, k, () => {
    deskRoom(c, t);
    silkLine(c, TRAP_A, [SP.x + 10, SP.y - 300], t, { sag: 10, glint: false });
    const up = ei(seg(t, H.c_up, H.c_up + 1.2)), give = eo(seg(t, H.c_give, H.c_give + .7));
    const talk = talkAt(t, 'spindle') > 0;
    const name = t > L0('spindle', 'Okay! Maybe one day?') - .1 ? 'hopeful' : talk ? 'talk' : t > H.c_sticker ? 'shy' : 'happy';
    spindleAt(c, SP.x, SP.y - up * 800, 100, t, { thread: true, name, look: [-.6, .1], legs: [0, 0, 0, 0, [-.4, -1.0, 1.1], 0, 0, 0] });
    albieN(c, AL.x, AL.y, AL.k, t, { name: t > L0('albie', 'Rules are rules.') && t < H.c_give ? 'confident' : 'happy', look: [.7, -.2], page: give > 0 ? [.75, -1.3, -.2] : null });
    // sticker tơ: trên chân Spindle → sang "tay" trang của Albie
    const sp = [SP.x - 70, SP.y - 120 - up * 800], tip = rigPt(AL.x, AL.y, AL.k, -.3, 0, albiePageTip([.75, -1.3, -.2])), at = [lerp(sp[0], tip[0] + 40, give), lerp(sp[1], tip[1] - 50, give) - Math.sin(Math.PI * give) * 120];
    if (t > H.c_sticker) silkSticker(c, at[0], at[1], 70, t, { glow: hold(t, H.c_sticker, 1e9, .3, .1), s: back(seg(t, H.c_sticker, H.c_sticker + .4), 2) });
    crumbAt(c, 1560, DESK_Y, 66, { E: crumbE(t > L0('crumb', "But WHY can't she join?") - .1 ? 'curious' : 'happy', t, { look: [-.7, -.3] }), yaw: -.7, q: hold(t, L0('crumb', "But WHY can't she join?"), L0('albie', 'This book is for insects.') + .5) });
    dotAt(c, 760, DESK_Y, 64, t, { look: [.7, -.3] });
  });
}
// Albie một mình dưới đèn bàn, ngắm sticker tơ, giấu dưới dải ruy băng
export function sAlone(c, t) {
  const k = drift({ cx: AL.x + 60, cy: 520, z: 2.2 }, t, .4);
  cam(c, k, () => {
    deskRoom(c, t);
    const tuck = eo(seg(t, H.a_tuck, H.a_tuck + .9)), talk = talkAt(t, 'albie') > 0;
    albieN(c, AL.x, AL.y, AL.k, t, { name: talk ? 'talk' : t > H.a_tuck + .8 ? 'shy' : 'hopeful', look: tuck > .3 ? [.3, .4] : [.9, .1], page: tuck < 1 ? [.75 * (1 - tuck * .7), -1.3, -.2] : null, hop: .1 * pulse(t, H.a_tuck + .9, .4) });
    const tip = rigPt(AL.x, AL.y, AL.k, -.3, 0, albiePageTip([.75 * (1 - tuck * .7), -1.3, -.2])), ribbon = rigPt(AL.x, AL.y, AL.k, -.3, 0, [.1, -.02, .1]);
    if (tuck < 1) silkSticker(c, lerp(tip[0] + 40, ribbon[0], tuck), lerp(tip[1] - 50, ribbon[1], tuck), 70 * (1 - .6 * tuck), t, { glow: 1 - tuck });
    if (tuck >= 1) { glints(c, ribbon[0], ribbon[1] + 20, 40, t, 3, N.silk, 12); }
  });
}

/* ================= KẾT VỤ ÁN · ÔN BÀI ================= */
export function sRecap(c, t) {
  const k = drift({ cx: 960, cy: 520, z: 1.0 }, t, .4);
  cam(c, k, () => {
    bookSpread(c, t, { silk: false });
    caseStamp(c, 960, 560, t, H.stamp + .1);
  });
  const q1 = Llast('dot', 'Six legs!'), q2 = Llast('dot', 'Eight legs!');   // câu trả lời ôn bài (Dot cũng nói "Eight legs!" lúc bẫy sập)
  if (t > q1 - .05) { const p = hold(t, q1 - .05, H.r_msg + .2, .2, .3); c.save(); c.globalAlpha = p; ansCard(c, 620, 330, '6', 'BUG', C.lime, t, q1); c.restore(); }
  if (t > q2 - .05) { const p = hold(t, q2 - .05, H.r_msg + .2, .2, .3); c.save(); c.globalAlpha = p; ansCard(c, 1300, 330, '8', 'SPIDER', C.pink, t, q2); c.restore(); }
  dotAt(c, 300, 1065, 110, t, { name: talkAt(t, 'dot') ? 'excited' : 'happy', look: [.6, -.5], legsUp: talkAt(t, 'dot') ? [[.3, -.9, .5], [.25, -.85, .3]] : null });
  loupeN(c, 1770, lpY(1080, 100), 100, t, { name: 'explaining', look: [-.7, -.2], pose: t > H.r_msg ? ARM.up : ARM.point, rot: .1 });
}
function ansCard(c, x, y, n, word, col, t, t0) {
  const p = back(seg(t, t0, t0 + .3), 2.4); c.save(); c.translate(x, y); c.scale(p, p);
  inked(c, cc => cc.roundRect(-180, -150, 360, 300, 40), col, 8);
  popText(c, n, 0, 40, 170, C.ink, null, -1, 0, { font: subFont }); popText(c, word, 0, 120, 54, C.ink, null, -1, 0, { font: subFont });
  c.restore();
}

/* ================= "DID YOU SPOT ROLLO?" ================= */
export function sRollo(c, t, minis) {
  c.fillStyle = C.grape; c.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 16; i++) { const a = -t * .1 + i * TAU / 16; c.fillStyle = C.nightL; c.beginPath(); c.moveTo(960, 540); c.lineTo(960 + Math.cos(a) * 2400, 540 + Math.sin(a) * 2400); c.lineTo(960 + Math.cos(a + TAU / 32) * 2400, 540 + Math.sin(a + TAU / 32) * 2400); c.fill(); }
  const W = 560, Hh = 315;
  minis.forEach((m, i) => {
    const t0 = H.e_spots + i * 1.2, p = back(seg(t, t0, t0 + .35), 1.8); if (p <= 0) return;
    const x = 360 + i * 600, y = 470;
    c.save(); c.translate(x, y); c.scale(p, p); c.rotate((i - 1) * .04);
    rrect(c, -W / 2 - 14, -Hh / 2 - 14, W + 28, Hh + 28, 22, C.cream);
    c.save(); c.beginPath(); c.roundRect(-W / 2, -Hh / 2, W, Hh, 14); c.clip(); c.translate(-W / 2, -Hh / 2); c.scale(W / 1920, W / 1920); m.draw(c); c.restore();
    const ring = seg(t, t0 + .5, t0 + .9); if (ring > 0) { c.lineWidth = 10; c.strokeStyle = C.berry; c.beginPath(); c.arc(-W / 2 + m.rx * W / 1920, -Hh / 2 + m.ry * W / 1920, 50 + 10 * Math.sin(t * 6), 0, TAU * ring); c.stroke(); }
    c.restore();
  });
  crumbAt(c, 150, 1075, 80, { E: crumbE('excited', t, { look: [.6, -.6] }), yaw: .7, arms: WAVE_ARMS });   // góc trái, ngoài tấm phụ đề
  rolloAt(c, lerp(-200, 2100, seg(t, H.s_rollo, H.s_rollo + 6.5)), 1030, 70, t, lerp(-200, 2100, seg(t, H.s_rollo, H.s_rollo + 6.5)) + 200, { yaw: 1.4 });
}

/* ================= TẠM BIỆT · GAG CUỐI · gợi lại móc ================= */
export function sBye(c, t) {
  const k = drift({ cx: 960, cy: 600, z: 1.5 }, t, .5);
  cam(c, k, () => {
    deskRoom(c, t);
    albieN(c, 900, AL.y, AL.k, t, { name: 'laugh', look: [-.4, 0], tabsUp: t > H.s_end + 2.4 ? .6 : 0 });
    if (t > H.recall) { const d = eo(seg(t, H.recall, H.recall + .5)); spindleAt(c, 1230, 180 + d * 330, 82, t, { thread: true, name: talkAt(t, 'spindle') ? 'talk' : 'laugh', look: [-.3, .3] }); }
  });
  // Dot quay sang người xem: đếm "chân" của bạn
  const cnt = L0('dot', 'One, two... Two legs! Not a bug either!');
  dotAt(c, 250, 1000, 200, t, { yaw: .35, name: talkAt(t, 'dot') ? 'excited' : 'happy', look: [0, .1], legsUp: talkAt(t, 'dot') ? [[.3, -.9, .55]] : null });
  [0, 1].forEach(i => { const t0 = cnt + .1 + i * .55; if (t > t0 && t < H.recall + .3) countPop(c, i + 1, 380 + i * 760, 760, t, t0, { r: 60 }); });
  if (t > cnt + 1.2 && t < H.recall + .3) big(c, '2 LEGS!', 1200, 300, 130, C.lemon, C.berry, t, cnt + 1.2);
  // móc trở lại: sợi tơ lóe ngang khung đúng như khung 0
  if (t > H.recall) silkLine(c, [-60, 120], [1980, 420], t, { sag: 60, u: ei(seg(t, H.recall, H.recall + .35)) });
  if (t > H.s_end) {
    loupeN(c, 1720, lpY(1080, 110), 110, t, { name: t > L0('dot', 'Nope!') ? 'laugh' : 'explaining', look: [-.6, -.1], pose: t > L0('dot', 'Nope!') ? ARM.up : ARM.point, rot: .1 });
    crumbAt(c, 1480, 900, 74, { E: crumbE('laugh', t, { look: [-.6, -.3] }), yaw: -.7, arms: WAVE_ARMS, hop: .2 * pulse(t, L0('dot', 'Nope!'), .4) });
    if (t > L0('dot', 'Nope!')) big(c, 'NOPE!', 960, 330, 200, C.berry, C.cream, t, L0('dot', 'Nope!'));
  }
}
