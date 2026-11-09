// SHORT-007 · Fireflies Talk in Secret Light Codes! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp: khung cuối mở về khung đầu.
// Tập A đầu tiên theo công thức 45 s (PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §3): logo 0,8 s lồng vào cú lao vào kính (titleSting),
// ô sticker "1 2 3" (stickerSlots), kính lớn có máy trôi, câu cửa miệng có hành động (albumGulp), phụ đề ở vùng an toàn (SAFE.subY).
import { C, REC, circle, ell, rrect, ground, popText, subFont, clamp, lerp, seg, back, eo, TAU, nope } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { makeTalk, blinkAt, ex, rigPt, look, toScreen, loupe, zoomIn, ARM, badge, shadow, subtitle, LENS_UP, hookTitle, stickerMatchCut, snapFlash, SAFE,
  titleSting, stickerSlots, flyBadge, albumGulp } from '/_shared/episode.js';
import { N, groundY, MOON, nightSky, glowDot, bigGlow, tinyFly, garden, SHROOM, marshmallow, thought, cartoonFly, codeStrip, DOT_OPEN } from './props.js';
import { LINES, CARDS, DUR, HIT } from './timeline.js';
import { track, ss, ei, hash } from '/core/lib.js';

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const pulse = (t, list, a = .12, b = .1) => list.reduce((s, h) => s + Math.sin(Math.PI * seg(t, h - a, h + b)), 0);   // 0→1→0 quanh mỗi mốc
const spike = (t, list, w = .16) => list.reduce((s, h) => s + Math.max(0, 1 - Math.abs(t - h - w * .4) / w), 0);      // cú nháy sáng ngắn
const decay = (t, list, k = 6) => list.reduce((s, h) => s + (t >= h ? Math.exp(-(t - h) * k) : 0), 0);
const arc = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];
const line = id => LINES.find(l => l.id === id);

/* ================= nhân vật ================= */
// Crumb (không lời): kiến con hổ phách, cầm que kẹo dẻo, râu dấu hỏi
const FEET = [[-.4, 0, .3], [-.48, 0, -.1], [.4, 0, .3], [.48, 0, -.1]];
const ARMS = {
  rest: { armL: [-.4, -1.0, .45], armR: [.42, -1.05, .45] }, up: { armL: [-.62, -2.45, .2], armR: [.62, -2.45, .2] },
  stick: { armL: [-.4, -1.0, .45], armR: [.78, -1.3, .7] }, shrug: { armL: [-.85, -1.45, .2], armR: [.85, -1.45, .2] },
  mouth: { armL: [-.4, -1.0, .45], armR: [.3, -1.45, .9] },
};
const mixArms = (a, b, k) => ({ armL: a.armL.map((v, i) => lerp(v, b.armL[i], k)), armR: a.armR.map((v, i) => lerp(v, b.armR[i], k)) });
function crumbAt(c, x, y, k, o = {}) {
  const w = o.walk || 0, ph = o.ph || 0;
  const feet = FEET.map((f, i) => { const s = Math.sin(ph * TAU + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)); return [f[0], -Math.max(0, s) * .14 * w, f[2] + s * .16 * w]; });
  const pose = { carry: null, q: 0, reach: o.reach ?? .4, lift: (o.hop || 0) + Math.abs(Math.sin(ph * TAU)) * .04 * w, bodyLean: 0, feet, ...(o.arms || ARMS.rest) };
  return drawChar(c, BY.crumb, { x, y, k, yaw: o.yaw ?? .9, lean: o.lean || 0, showFx: false, expr: o.E || ex(BY.crumb, 'happy'), pose });
}
const crumbE = (name, t, o = {}) => ex(BY.crumb, name, { blink: blinkAt(t, .6), ...o });
// Blink: đom đóm. Đèn đuôi theo rig (blink.js): [0, −.62 − lift, −.78]
const BL = { x: 680, k: 95 };
function drawBlink(c, s) {
  if (s.glowR) { const p = tailOf(s); bigGlow(c, p[0], p[1], s.glowR, s.glowA ?? 1); }
  drawChar(c, BY.blink, { x: s.x, y: s.y, k: s.k, yaw: s.yaw, lean: s.lean || 0, showFx: !!s.fx, expr: s.E,
    pose: { glow: s.glow, fly: s.fly || 0, lift: s.lift || 0, tailUp: 0, legsUp: s.legsUp || null } });
}
const tailOf = s => rigPt(s.x, s.y, s.k, s.yaw, s.lean || 0, [0, -.62 - (s.lift || 0), -.78]);
const blinkE = (name, t, o = {}) => ex(BY.blink, name, { talk: talkAt(t, 'blink'), blink: talkAt(t, 'blink') ? 0 : blinkAt(t, .3), ...o });

/* ================= VƯỜN ĐÊM: móc, kính lớn, toàn cảnh ================= */
const LS = { x: 300, r: 100 };                                    // chỗ Miss Loupe đứng (cỡ trung)
const lsLens = () => [LS.x, groundY(LS.x) - LENS_UP * LS.r];
export const BASE = { cx: 560, cy: 951, z: 1.25 };
const CR = { x: 525, k: 100 }, DT = { x: 548, k: 96 }, CH = { k: 66 };

// đường bay của Blink trong móc (toạ độ cảnh): vụt qua sát mặt kính của Miss Loupe ở khung 0, lượn vòng, đáp xuống mô rêu
const ZIP = K([[-.35, [-40, 860]], [0, [300, 880]], [.4, [490, 830]], [.8, [630, 860]], [HIT.land, [BL.x, groundY(BL.x)]]]);
function blinkState(t) {
  const gy = groundY(BL.x), s = { x: BL.x, y: gy, k: BL.k, yaw: 1.0, glow: 1 + .15 * Math.sin(t * 3), fly: 0, lift: 0, lean: 0, E: null, fx: false, legsUp: null, glowR: 0 };
  const talk = talkAt(t, 'blink');
  if (t < HIT.land) {                                             // móc: bay vụt, đuôi nháy chùm
    const [x, y] = ZIP(t), [x2] = ZIP(t + .04); s.x = x; s.y = y; s.fly = 1; s.yaw = x2 >= x ? 1.15 : -1.15; s.lean = .25 * Math.sin(t * 6);
    const b = Math.min(1, spike(t, HIT.burst)); s.glow = .7 + 1.3 * b; s.glowR = 150 * b; s.E = blinkE('excited', t, { look: [.6, -.1] });
    return s;
  }
  if (t < HIT.sting[1]) {                                         // đáp, quay ra máy, "My tummy can!", đuôi bùng sáng
    const land = Math.sin(Math.PI * seg(t, HIT.land, HIT.land + .25)), toCam = ss(seg(t, HIT.turn, HIT.turn + .3)) * (1 - ss(seg(t, 3.05, 3.6)));
    const fl = Math.sin(Math.PI * seg(t, HIT.flare[0], HIT.flare[1]));
    s.yaw = lerp(1.1, .3, toCam); s.lift = -.06 * land + .12 * fl; s.glow = 1 + 1.6 * fl; s.glowR = 330 * fl; s.glowA = fl;
    s.E = blinkE(fl > .3 ? 'excited' : 'happy', t, { look: toCam > .5 ? [0, 0] : [.5, -.2] }); s.fx = fl > .3;
    return s;
  }
  if (t < HIT.stamp1) {                                           // bí mật 1: đứng yên cho Crumb hơ kẹo dẻo, ngoái lại nhìn
    const L5 = line('L05'), cam = ss(seg(t, L5.t - .3, L5.t)) * (1 - ss(seg(t, HIT.munch, HIT.munch + .3)));
    s.yaw = lerp(1.0, .45, cam); s.glow = 1.15 + .2 * Math.sin(t * 4);
    s.E = blinkE(t > L5.t && t < L5.t + 1.1 ? 'laugh' : 'happy', t, { look: cam > .5 ? [0, 0] : [-.8, .1] });
    return s;
  }
  if (t < HIT.stamp2) {                                           // bí mật 2: "I'm a little beetle!", bật cánh cùng Dot
    const op = cases(t); s.yaw = .3; s.fly = op; s.glow = .9 + .2 * op;
    const L8 = line('L08'); s.lift = .08 * Math.sin(Math.PI * seg(t, L8.t, L8.t + .4));
    s.E = blinkE(op > .5 ? 'excited' : t > HIT.bubble[0] && t < HIT.bubblePop ? 'curious' : 'happy', t, { look: t < HIT.bubblePop ? [-.8, -.6] : [.1, 0] });
    return s;
  }
  if (t < HIT.wide[0]) {                                          // bí mật 3: "No!" (quay đi), đuôi tự nháy, "Okay, yes.", nháy mật mã
    const away = ss(seg(t, HIT.away, HIT.away + .2)) * (1 - ss(seg(t, HIT.tattle[0] + .05, HIT.tattle[0] + .3)));
    const tat = Math.min(1.4, spike(t, HIT.tattle, .14)), code = codeGlow(t), up = ss(seg(t, HIT.code[0] - .5, HIT.code[0] - .1));
    s.yaw = lerp(.4, 1.55, away); s.legsUp = away > .3 ? [[.2, -.95, .85], 0, 0, [-.2, -1.0, .85], 0, 0] : null;
    s.glow = t < HIT.code[0] - .5 ? 1 + 1.6 * tat : .3 + 2 * code; s.glowR = 260 * Math.max(tat, code); s.glowA = Math.max(tat, code);
    s.fly = up; s.lift = .55 * up + .06 * Math.sin(t * 5) * up; s.y = groundY(BL.x) - 30 * up;
    const L12 = line('L12');
    s.E = t > HIT.tattle[0] - .05 && t < HIT.tattle[2] + .3 ? blinkE('surprised', t, { look: [-.9, .3] })
      : t > L12.t - .3 && t < L12.t + 1.1 ? blinkE('shy', t) : away > .3 ? blinkE('annoyed', t, { look: [.5, -.4] }) : blinkE(up > .5 ? 'confident' : 'happy', t, { look: [0, 0] });
    s.fx = t > L12.t - .3 && t < L12.t + 1.1;
    return s;
  }
  // toàn cảnh: bay lượn giữa vườn, nháy theo phách
  const u = ss(seg(t, HIT.wide[0], HIT.wide[1] + .4)), hx = 620 + 50 * Math.sin(t * 1.4), hy = 850 + 26 * Math.sin(t * 2.3);
  s.x = lerp(BL.x, hx, u); s.y = lerp(groundY(BL.x) - 30, hy, u); s.fly = 1; s.lift = .55; s.yaw = .35 + .25 * Math.sin(t * 1.1);
  const sy = Math.min(1, spike(t, HIT.sync, .2)); s.glow = .6 + 1.6 * sy; s.glowR = 200 * sy; s.glowA = sy;
  s.E = blinkE(talkAt(t, 'blink') ? 'excited' : 'laugh', t, { look: [0, 0] }); s.fx = true;
  return s;
}
const codeGlow = t => Math.min(1, spike(t, HIT.code.slice(0, 2), .14) + (t > HIT.code[2] && t < HIT.code[2] + HIT.codeLong ? 1 : 0) * ss(seg(t, HIT.code[2], HIT.code[2] + .06)));
// tấm cánh mở (0..1) của Blink và Dot: mở ở clack[0], khép ở clack[1], mở ở clack[2], khép ở clack[3]
const cases = t => { const c = HIT.clack; return ss(seg(t, c[0] - .06, c[0] + .08)) * (1 - ss(seg(t, c[1] - .06, c[1] + .08))) + ss(seg(t, c[2] - .06, c[2] + .08)) * (1 - ss(seg(t, c[3] - .06, c[3] + .08))); };

function crumbState(t) {
  const s = { x: CR.x, k: CR.k, yaw: .9, arms: ARMS.rest, hop: 0, walk: 0, lean: 0, E: null, stick: 0, q: 0, mouth: 0 };
  if (t < HIT.mallowIn[0]) { s.x = -300; return s; }
  if (t < HIT.mallowIn[1]) { const u = seg(t, HIT.mallowIn[0], HIT.mallowIn[1]); s.x = lerp(170, CR.x, ss(u)); s.walk = 1; s.arms = ARMS.stick; s.stick = .6; s.E = crumbE('excited', t, { look: [.6, -.1] }); return s; }
  if (t < HIT.stamp1) {
    const reach = ss(seg(t, HIT.hold[0] - .3, HIT.hold[0])) * (1 - ss(seg(t, HIT.hold[1], HIT.hold[1] + .3)));
    const shrug = Math.sin(Math.PI * seg(t, HIT.hold[1] + .2, HIT.hold[1] + .9)), eat = ss(seg(t, HIT.munch - .3, HIT.munch));
    s.stick = lerp(.6, 1, reach) * (1 - eat); s.lean = .1 * reach; s.arms = shrug > .1 ? mixArms(ARMS.stick, ARMS.shrug, shrug) : t > HIT.munch - .3 ? mixArms(ARMS.stick, ARMS.mouth, eat) : ARMS.stick;
    s.hop = .05 * decay(t, HIT.ticks, 9) + .1 * Math.sin(Math.PI * seg(t, HIT.munch, HIT.munch + .3)) + (t > HIT.munch ? .04 * Math.abs(Math.sin((t - HIT.munch) * 12)) * (t < HIT.munch + .9) : 0);
    s.q = t > HIT.ask && t < HIT.munch - .2 ? back(seg(t, HIT.ask, HIT.ask + .25), 2.4) : 0;
    s.E = t > HIT.munch ? crumbE('laugh', t) : s.q > .2 ? crumbE('confused', t, { look: [.8, -.1] }) : crumbE('curious', t, { look: [.9, .05] });
    s.mouth = t > HIT.munch - .05 && t < HIT.munch + .9;
    return s;
  }
  if (t < HIT.wide[0]) {
    s.x = CR.x - 120; s.yaw = .7;
    const think = t > HIT.bubble[0] - .2 && t < HIT.bubblePop, clk = decay(t, HIT.clack, 8), tat = decay(t, HIT.tattle, 7);
    s.hop = .06 * Math.min(1, clk) + .06 * Math.min(1, tat);
    s.E = think ? crumbE('thinking', t) : t < HIT.stamp2 ? crumbE(clk > .3 ? 'excited' : 'happy', t, { look: [.9, -.1] }) : crumbE(tat > .2 ? 'laugh' : 'happy', t, { look: [.9, -.3] });
    return s;
  }
  // toàn cảnh: nhún nhảy theo phách
  const beat = Math.abs(Math.sin((t - 26) * Math.PI * 2)), dance = ss(seg(t, 26, 26.4));
  s.x = CR.x - 115; s.yaw = .5 + .3 * Math.sin(t * 2.2) * dance; s.hop = .14 * beat * dance; s.arms = dance > .5 ? (Math.floor(t * 2) % 2 ? mixArms(ARMS.up, ARMS.rest, .5) : ARMS.up) : ARMS.rest;
  s.E = crumbE('laugh', t);
  return s;
}
function dotState(t) {
  if (t < HIT.dotIn[0]) return null;
  const u = seg(t, HIT.dotIn[0], HIT.dotIn[1]), p = arc([400, groundY(400)], [DT.x, groundY(DT.x)], ss(u), 160);
  const op = t < HIT.stamp2 ? cases(t) : 0, beat = t > 26 ? Math.abs(Math.sin((t - 26) * Math.PI * 2)) : 0;
  return { x: p[0], y: p[1] - 40 * beat * ss(seg(t, 26, 26.4)), yaw: -.3 + .1 * Math.sin(t * 2), op, E: ex(BY.dot, op > .5 ? 'excited' : u < 1 ? 'surprised' : 'happy', { blink: blinkAt(t, .9), look: [.3, -.1] }) };
}

// vườn và nhân vật (toạ độ cảnh). o.chirp: vẽ Chirp trên cây nấm (chỉ ở toàn cảnh, để mặt Chirp không vào cột nút của Shorts ở khung kính)
function gardenWorld(c, t, o = {}) {
  nightSky(c, t, { rollo: t > HIT.rollo[0] && t < HIT.rollo[1] ? seg(t, HIT.rollo[0], HIT.rollo[1]) : null });
  garden(c, t);
  // đốm sáng đáp từ bãi cỏ xa, thấp, sau một nhịp nghỉ (FACTS §3)
  const rp = Math.min(1, spike(t, HIT.reply, .22)); if (t > HIT.reply[0] - .5 && t < HIT.wide[1]) tinyFly(c, 930, groundY(930) - 12, 13, rp, { dir: -1 });
  if (o.sync) syncField(c, t);
  if (o.chirp) chirpAt(c, t);
  const cs = crumbState(t);
  if (cs.x > -200 && !o.noChars) {
    const gy = groundY(cs.x); shadow(c, cs.x + 20, gy + 2, 110, .18);
    crumbAt(c, cs.x, gy, cs.k, { ...cs, ph: t * 2.6 });
    const head = rigPt(cs.x, gy, cs.k, cs.yaw, cs.lean, [0, -2.45 - cs.hop, .3]);
    if (cs.q > 0) { c.save(); c.font = `${Math.round(60 * cs.q)}px "Paytone One"`; c.textAlign = 'center'; c.fillStyle = C.lemon; c.strokeStyle = C.ink; c.lineWidth = 8; for (const dx of [-30, 34]) { c.strokeText('?', head[0] + dx, head[1] + 6 * Math.sin(t * 8 + dx)); c.fillText('?', head[0] + dx, head[1] + 6 * Math.sin(t * 8 + dx)); } c.restore(); }
    if (cs.stick > 0) {                                           // que kẹo dẻo: từ tay Crumb tới ánh đèn đuôi
      const hand = rigPt(cs.x, gy, cs.k, cs.yaw, cs.lean, [.78, -1.3 - cs.hop, .7]), tail = tailOf(blinkState(t)), tip = [lerp(hand[0] + 70, tail[0] - 42, cs.stick), lerp(hand[1] - 10, tail[1] - 2, cs.stick)];
      marshmallow(c, hand[0], hand[1], tip[0], tip[1], 1.05, t > HIT.hold[0] ? 1 : 0);
    }
    if (cs.mouth) { const m = rigPt(cs.x, gy, cs.k, cs.yaw, cs.lean, [.25, -1.5 - cs.hop, .9]); const q = seg(t, HIT.munch - .05, HIT.munch + .25); if (q < 1) { c.save(); c.translate(m[0], m[1]); c.scale(1 - q, 1 - q); rrect(c, -20, -22, 40, 44, 14, C.white); c.restore(); } }
  }
  const ds = dotState(t);
  if (ds && !o.noChars) { shadow(c, ds.x, groundY(ds.x) + 2, 80, .18); drawChar(c, DOT_OPEN, { x: ds.x, y: ds.y, k: DT.k, yaw: ds.yaw, showFx: false, expr: ds.E, pose: { open: ds.op } }); }
  const bs = blinkState(t); if (!o.noBlink && !o.noChars) drawBlink(c, bs);
  // bí mật 1: tíc tắc (vòng đồng hồ nhỏ) trên viên kẹo dẻo · bí mật 2: bong bóng nghĩ, "Nope!" · tiếng "clack"
  for (const h of HIT.ticks) { const q = seg(t, h, h + .35); if (q > 0 && q < 1) { const tp = tailOf(bs); c.strokeStyle = `rgba(255,248,231,${1 - q})`; c.lineWidth = 5; c.beginPath(); c.arc(tp[0] - 70, tp[1] - 80, 16 + 20 * q, -Math.PI / 2, -Math.PI / 2 + TAU * q); c.stroke(); } }
  const bp = t > HIT.bubble[0] && t < HIT.bubblePop + .05 ? seg(t, HIT.bubble[0], HIT.bubble[1]) : 0;
  if (bp > 0) { const hd = rigPt(cs.x, groundY(cs.x), cs.k, cs.yaw, 0, [.2, -2.5, .3]); thought(c, hd[0] + 20, hd[1] - 10, hd[0] + 110, hd[1] - 150, 230, 150, bp, cc => { cartoonFly(cc, -20, 6, 1.1, t); cc.font = '64px "Paytone One"'; cc.fillStyle = C.berry; cc.textAlign = 'center'; cc.fillText('?', 70, 26 + 6 * Math.sin(t * 9)); }); }
  const np = seg(t, HIT.bubblePop, HIT.bubblePop + .5);
  if (np > 0 && np < 1) { const hd = rigPt(cs.x, groundY(cs.x), cs.k, cs.yaw, 0, [.2, -2.5, .3]); nope(c, hd[0] + 110, hd[1] - 150, 70 * (1 - .3 * np), Math.min(1, np * 3) * (np < .8 ? 1 : (1 - np) * 5));
    for (let i = 0; i < 8; i++) { const a = i * TAU / 8; circle(c, hd[0] + 110 + Math.cos(a) * 160 * eo(np), hd[1] - 150 + Math.sin(a) * 110 * eo(np), 12 * (1 - np), C.cream); } }
}
function chirpAt(c, t) {
  const top = SHROOM.top(), on = t > HIT.chirp[0] && t < HIT.chirp[1], ph = on ? Math.abs(Math.sin((t - HIT.chirp[0]) * Math.PI * 2)) : 0;
  shadow(c, SHROOM.x, top + 4, 60, .2);
  drawChar(c, BY.chirp, { x: SHROOM.x, y: top + 6, k: CH.k, yaw: -.75, showFx: false, expr: ex(BY.chirp, on ? 'excited' : 'happy', { blink: blinkAt(t, 1.3), look: [-.5, -.1] }), pose: { chirp: ph, lift: .05 * ph, ant: t * 3 } });
  if (on) for (let i = 0; i < 3; i++) { const q = ((t - HIT.chirp[0]) * 2 + i / 3) % 1; c.strokeStyle = `rgba(183,240,74,${.7 * (1 - q)})`; c.lineWidth = 5; c.beginPath(); c.arc(SHROOM.x + 10, top - 90, 30 + 70 * q, -2.6, -1.4); c.stroke(); }
}
// cả vườn nháy cùng nhịp: các đốm sáng bật theo từng phách, thành làn sóng từ gần ra xa (FACTS §4)
const SWARM = Array.from({ length: 54 }, (_, i) => ({ x: 120 + hash(i + 200) * 900, y: 470 + hash(i + 210) * 660, s: 9 + 9 * hash(i + 220) + (i % 9 === 0 ? 8 : 0), d: hash(i + 230) }));
function syncField(c, t) {
  for (const f of SWARM) {
    const x = f.x + 16 * Math.sin(t * .9 + f.d * 9), y = f.y + 12 * Math.sin(t * 1.3 + f.d * 7);
    const on = t > HIT.sync[0] - .1 ? Math.min(1, spike(t, HIT.sync.map(h => h + f.d * .16), .26)) : .25 * Math.max(0, Math.sin(t * 2 + f.d * 20));
    glowDot(c, x, y, f.s * .7, .2 + .8 * on);
  }
}

/* ---------- máy quay ---------- */
function hookCam(t) {
  const [cx, cy, z] = K([[-1, [440, 975, 1.42]], [0, [440, 975, 1.42]], [.35, [480, 978, 1.54]], [.8, [545, 985, 1.58]], [HIT.land + .1, [580, 990, 1.62]], [HIT.flare[0], [590, 994, 1.68]],
    [HIT.flare[1], [582, 990, 1.62]], [HIT.sting[0], [565, 985, 1.58]]])(t);
  const sh = decay(t, [HIT.startle, HIT.land], 9) + .6 * decay(t, [HIT.flare[0]], 7);
  return { cx: cx + 6 * Math.sin(t * 47) * sh, cy: cy + 5 * Math.sin(t * 39) * sh, z };
}
const lensCam = t => ({ cx: BASE.cx + 8 * Math.sin(t * .4), cy: BASE.cy + 6 * Math.sin(t * .5), z: BASE.z });
const WIDE = t => ({ cx: 575 + 25 * Math.sin((t - 26) * .35), cy: 945 - 12 * seg(t, 26, 30.4), z: 1.22 + .06 * seg(t, 26, 30.4) });
function hookLoupe(t) {                                           // kính cỡ trung của Miss Loupe trong móc (toạ độ cảnh)
  const [wx, wy] = lsLens(), j = decay(t, [HIT.startle], 4), hop = 34 * Math.sin(Math.PI * seg(t, HIT.startle, HIT.startle + .5)), rs = ss(seg(t, HIT.raise, HIT.sting[0]));
  return { x: wx + 24 * Math.sin(t * 38) * j + 40 * rs, y: wy - hop - 70 * rs, r: LS.r, rot: -.1 + .25 * Math.sin(t * 30) * j - .08 * rs };
}

/* ---------- MÓC (0–3 s) ---------- */
const TITLE = [{ text: 'GLOWING', y: 300, px: 182, fill: C.lemon, shadow: C.ink, t0: HIT.words[0] }, { text: 'TUMMY?!', y: 500, px: 186, fill: C.pink, shadow: C.ink, t0: HIT.words[1] }];
function glint(c, x, y, s) { if (s <= .02) return; star(c, x, y, 34 * s, C.cream); star(c, x, y, 16 * s, C.white); circle(c, x, y, 22 * s, 'rgba(255,255,255,.25)'); }
function sHook(c, t, o = {}) {
  const cam = hookCam(t), H = hookLoupe(t);
  look(c, cam, () => {
    const flying = t < HIT.land; gardenWorld(c, t, { noBlink: flying });
    const name = t < .7 ? 'surprised' : talkAt(t) ? 'explaining' : t > HIT.flare[0] ? 'excited' : 'curious';
    loupe(c, H.x, H.y, H.r, { E: ex(BY.loupe, name, { talk: talkAt(t), look: [.8, -.1], blink: talkAt(t) ? 0 : blinkAt(t) }), rot: H.rot, pose: t < .7 ? ARM.up : ARM.peer });
    const g = Math.sin(Math.PI * seg(t, HIT.glint0, HIT.glint0 + .4)); glint(c, H.x + H.r * .55, H.y - H.r * .62, g);
    if (flying) drawBlink(c, blinkState(t));
  });
  const wob = [HIT.land, HIT.flare[0]].reduce((a, h) => a + (t > h ? Math.sin((t - h) * 16) * Math.exp(-(t - h) * 5) * .06 : 0), 0);
  if (!o.noTitle) hookTitle(c, TITLE, t, { gone: ss(seg(t, HIT.titleOut[0], HIT.titleOut[1])), cy: 400, wob });
}

/* ---------- KÍNH LỚN (3,8–25,2 s): ba bí mật ---------- */
function lensBig(t) {
  const sh = decay(t, [HIT.bubblePop, ...HIT.clack, HIT.away], 10) * 4;
  return { x: 540 + 12 * Math.sin(t * 1.3) + sh * Math.sin(t * 50), y: 690 + 10 * Math.sin(t * 1.7), r: 310 + 6 * Math.sin(t * 2.1) };
}
// điểm cảnh ở tâm kính và độ phóng, đi theo nhịp của bí mật
const FOCUS = K([[HIT.sting[1], [690, 1110, 1.6]], [HIT.mallowIn[0], [650, 1105, 1.45]], [HIT.mallowIn[1], [610, 1100, 1.4]], [HIT.hold[0] + .2, [620, 1110, 1.5]], [HIT.ask, [600, 1045, 1.42]],
  [line('L05').t + .2, [625, 1080, 1.45]], [HIT.munch + .2, [600, 1080, 1.4]], [HIT.snap1, [605, 1085, 1.4]], [line('L06').t + .3, [610, 960, .85]], [HIT.bubblePop, [612, 965, .88]],
  [HIT.dotIn[1], [600, 1110, 1.4]], [HIT.clack[0], [612, 1100, 1.5]], [HIT.clack[3], [615, 1098, 1.52]], [HIT.snap2, [615, 1100, 1.5]], [line('L10').t + .4, [680, 1090, 1.5]],
  [HIT.tattle[0], [690, 1095, 1.65]], [HIT.tattle[2] + .3, [685, 1090, 1.65]], [HIT.code[0] - .5, [680, 1050, 1.45]], [HIT.code[2] + .5, [680, 1030, 1.4]], [HIT.wide[0], [680, 1020, 1.3]]]);
function lensView(t) {
  // Phép phóng trong kính: điểm cảnh P nằm ở tâm kính, tỉ lệ S (điểm khung = tâm kính + S·(điểm cảnh − P)).
  // Trong cú lùi ra toàn cảnh (wide), kính lớn dần phủ cả khung, P và S tiến về đúng máy WIDE, nên hết cú lùi thì trong kính chính là toàn cảnh.
  const L = lensBig(t), w = ss(seg(t, HIT.wide[0], HIT.wide[1])), [fx, fy, mag] = FOCUS(t), S0 = mag * BASE.z;
  if (w <= 0) return { L, S: S0, P: [fx, fy], w, outer: lensCam(t) };
  const wc = WIDE(t), e = ss(w), lc = lensCam(t);
  return { L: { x: lerp(L.x, 540, e), y: lerp(L.y, 960, e), r: lerp(L.r, 1320, e) }, S: Math.exp(lerp(Math.log(S0), Math.log(wc.z), e)), P: [lerp(fx, wc.cx, e), lerp(fy, wc.cy, e)], w,
    outer: { cx: lerp(lc.cx, wc.cx, e), cy: lerp(lc.cy, wc.cy, e), z: lerp(lc.z, wc.z, e) } };
}
function sLens(c, t) {
  const V = lensView(t), wideish = V.w > .5;
  look(c, V.outer, () => { gardenWorld(c, t, { sync: V.w > 0, chirp: V.w > 0, noChars: V.w <= 0 }); if (V.w > .7) loupeWide(c, t); });   // ngoài kính lớn: chỉ có vườn (nhân vật ở trong kính)
  const talk = talkAt(t), surprised = t > HIT.tattle[0] && t < HIT.tattle[2] + .4 || (t > HIT.bubblePop && t < HIT.bubblePop + .4);
  const name = surprised ? 'surprised' : talk ? 'explaining' : t > HIT.clack[0] && t < HIT.stamp2 ? 'laugh' : t > HIT.reply[0] && t < HIT.wide[0] ? 'excited' : 'happy';
  loupe(c, V.L.x, V.L.y, V.L.r, {
    E: ex(BY.loupe, name, { talk, look: [.15, .35], blink: talk ? 0 : blinkAt(t) }), rot: -.05, pose: ARM.peer,
    inside: cc => { cc.translate(V.L.x, V.L.y); cc.scale(V.S, V.S); cc.translate(-V.P[0], -V.P[1]); gardenWorld(cc, t, { sync: V.w > 0, chirp: V.w > 0 }); if (wideish) loupeWide(cc, t); },
  });
  if (V.w > 0) return;
  // ánh lóe trên vành kính (gài cho gag) ở mỗi cú chụp
  for (const h of [HIT.snap1, HIT.snap2]) glint(c, V.L.x + V.L.r * .6, V.L.y - V.L.r * .66, Math.sin(Math.PI * seg(t, h, h + .4)));
  // chữ và dải mật mã (ngoài kính, toạ độ khung)
  if (t > HIT.clack[0] - .02 && t < HIT.clack[0] + 1.95) { const pu = 1 + .12 * Math.sin(Math.PI * seg(t, HIT.clack[0], HIT.clack[0] + .25)); c.save(); c.translate(300, 350); c.scale(pu, pu); c.translate(-300, -350); popText(c, 'CLACK!', 300, 385, 104, C.mango, C.ink, t, HIT.clack[0], { step: .03, sh: 8 }); c.restore(); }
  codeStrip(c, t, 540, 330, HIT.code, true, ss(seg(t, HIT.code[0] - .1, HIT.code[0] + .1)) * (1 - ss(seg(t, HIT.wide[0] - .2, HIT.wide[0]))));
}
function loupeWide(c, t) {                                        // Miss Loupe cỡ trung ở toàn cảnh (toạ độ cảnh): giơ kính, ngắm, chụp
  const [wx, wy] = lsLens(), aim = ss(seg(t, HIT.snap3 - .5, HIT.snap3 - .1)), beat = t > 26 ? Math.abs(Math.sin((t - 26) * Math.PI * 2)) : 0;
  loupe(c, wx + 30 * aim, wy - 12 * beat - 40 * aim, LS.r, { E: ex(BY.loupe, aim > .5 ? 'curious' : 'laugh', { look: [.8, -.2], blink: blinkAt(t) }), rot: -.08 + .1 * Math.sin(t * 3) * (1 - aim) - .1 * aim, pose: aim > .5 ? ARM.peer : ARM.up });
}
const wideLens = t => { const [wx, wy] = lsLens(), aim = ss(seg(t, HIT.snap3 - .5, HIT.snap3 - .1)), cam = WIDE(t), p = toScreen(cam, wx + 30 * aim, wy - 40 * aim); return { x: p[0], y: p[1], r: LS.r * cam.z }; };
function sWide(c, t) { look(c, WIDE(t), () => { gardenWorld(c, t, { sync: true, chirp: true }); loupeWide(c, t); }); }

/* ---------- sticker ---------- */
function art1(cc) {                                               // "Cold light": đèn đuôi sáng và viên kẹo dẻo vẫn trắng
  bigGlow(cc, -20, 10, 110, 1); circle(cc, -20, 10, 44, C.lemon); circle(cc, -34, -4, 14, 'rgba(255,255,255,.8)');
  marshmallow(cc, 110, 90, 38, 6, 1.2, 1);
}
function art2(cc) {                                               // "Beetle!": Blink bật tấm cánh
  drawChar(cc, BY.blink, { x: 0, y: 72, k: 66, yaw: .3, showFx: false, expr: ex(BY.blink, 'excited'), pose: { glow: .9, fly: 1 } });
}
function art3(cc) {                                               // "Light code": đom đóm nháy trong đêm, dải chấm gạch
  for (const [x, y, r] of [[-52, -40, 9], [10, -62, 7], [56, -28, 10], [-20, 6, 8], [40, 30, 7]]) glowDot(cc, x, y, r, 1);
  circle(cc, -40, 60, 10, C.lemon); circle(cc, -10, 60, 10, C.lemon); rrect(cc, 18, 50, 46, 20, 10, C.lemon);
}
const FILLS = [{ t: HIT.stamp1, fill: C.night, draw: art1, r0: 100 }, { t: HIT.stamp2, fill: C.skyL, draw: art2, r0: 100 }, { t: HIT.stamp3, fill: C.night, draw: art3, r0: 100 }];
const SLOTS = [{ x: 380, y: 232, r: 52 }, { x: 540, y: 232, r: 52 }, { x: 700, y: 232, r: 52 }];

/* ================= SỔ (30,45–34,9 s) ================= */
const PAGE = { x: 56, y: 190, w: 968, h: 760 }, P = [{ x: 228, y: 430, r: 118 }, { x: 540, y: 430, r: 118 }, { x: 852, y: 430, r: 118 }];
const LABELS = ['Cold light', 'Beetle!', 'Light code'], DIVE = { x: 540, y: 800 }, MINI = { x: 540, y: 800, r: 78 }, AL = { x: 250, y: 1450, k: 240 };
function albumBlink(t) {                                          // Blink bay vào, lượn quanh Albie, lao vào trang sổ đúng "go!" (toạ độ khung)
  if (t < HIT.blinkIn[0] || t >= HIT.dive[1]) return null;
  if (t < HIT.blinkIn[1]) { const u = ss(seg(t, HIT.blinkIn[0], HIT.blinkIn[1])), p = arc([1250, 980], [600, 1080], u, 160); return { x: p[0], y: p[1], k: 92, yaw: -1.1, rot: 0 }; }
  if (t < HIT.dive[0]) return { x: 600 + 30 * Math.sin((t - HIT.blinkIn[1]) * 3), y: 1080 + 18 * Math.sin((t - HIT.blinkIn[1]) * 5), k: 92, yaw: -.6 + .3 * Math.sin(t * 2), rot: 0 };
  const u = seg(t, HIT.dive[0], HIT.dive[1]), p = arc([600, 1080], [DIVE.x, DIVE.y + 30], u, 300); return { x: p[0], y: p[1], k: lerp(92, 34, ei(u)), yaw: -.4, rot: -1.2 * ei(u) };
}
function miniArt(cc) { bigGlow(cc, -16, 22, 70, 1); drawChar(cc, BY.blink, { x: 0, y: 50, k: 46, yaw: .4, showFx: false, expr: ex(BY.blink, 'laugh'), pose: { glow: 1.3 } }); }
function sAlbum(c, t) {
  const push = 1 + .05 * Math.sin(Math.PI * seg(t, HIT.gulp - .05, HIT.gulp + .6));
  c.save(); c.translate(540, 700); c.scale(push, push); c.translate(-540, -700);
  ground(c, C.mint); ell(c, 200, 1760, 900, 420, 0, C.mintL); ell(c, 540, 1730, 980, 330, 0, C.leaf); ell(c, 540, 1770, 900, 280, 0, C.leafD);
  rrect(c, PAGE.x + 12, PAGE.y + 18, PAGE.w, PAGE.h, 54, C.grape); rrect(c, PAGE.x, PAGE.y, PAGE.w, PAGE.h, 54, C.cream);
  P.forEach((S, i) => {
    circle(c, S.x, S.y, S.r + 4, '#EBDDBC');
    const shown = i === 2 ? t >= HIT.zoomOut[0] : t >= HIT.slotsDown[1];
    if (!shown) return;
    const st = i === 2 ? HIT.stamp3 : HIT.slotsDown[1], p = t >= st ? back(seg(t, st, st + .22), 2.6) : 1;
    badge(c, S.x, S.y, S.r, FILLS[i].fill, cc => { const k = S.r / 100; cc.scale(k, k); FILLS[i].draw(cc); }, [-.05, .04, -.03][i], t >= st ? lerp(1.18, 1, p) : 1);
    popText(c, LABELS[i], S.x, S.y + S.r + 70, 52, C.ink, null, t, st + .05, { step: .015, font: subFont });
  });
  // trang gợn sáng khi Blink lao vào, rồi sticker Blink tí hon bật lên
  const rq = seg(t, HIT.gulp, HIT.gulp + .8);
  if (rq > 0 && rq < 1) for (let k = 0; k < 3; k++) { const q = clamp(rq * 1.4 - k * .2); if (q > 0 && q < 1) { c.strokeStyle = `rgba(255,227,77,${.9 * (1 - q)})`; c.lineWidth = 12 * (1 - q) + 2; c.beginPath(); c.ellipse(DIVE.x, DIVE.y, 60 + 260 * q, 26 + 90 * q, 0, 0, TAU); c.stroke(); } }
  if (t >= HIT.mini) badge(c, MINI.x, MINI.y, MINI.r, C.night, miniArt, .06, back(seg(t, HIT.mini, HIT.mini + .3), 2.6));
  // Albie: câu cửa miệng có hành động (đếm chân Blink bằng trang giấy, há miệng, "đớp" đúng "go!")
  const talk = talkAt(t, 'albie'), b = albumBlink(t);
  shadow(c, AL.x + 18, AL.y + 4, 220, .18);
  albumGulp(c, t, { x: AL.x, y: AL.y, k: AL.k, talk, line: line('L15'), counts: HIT.counts, tg: HIT.gulp, look: b ? [.75, -.4] : [.5, -.7], blink: talk ? 0 : blinkAt(t, .4) });
  if (b) {
    c.save(); c.translate(b.x, b.y - b.k); c.rotate(b.rot); c.translate(-b.x, -(b.y - b.k));
    const cnt = Math.min(1, pulse(t, HIT.counts, .05, .12)), legs = cnt > .2 ? [0, [-.55, -.55, .1], 0, 0, [.55, -.55, .1], 0] : null;
    drawBlink(c, { x: b.x, y: b.y, k: b.k, yaw: b.yaw, fly: 1, lift: .3, glow: 1.2 + .4 * Math.sin(t * 6), E: ex(BY.blink, t > HIT.dive[0] ? 'excited' : 'laugh', { look: [-.6, .2] }), legsUp: legs, glowR: 120, glowA: .6 });
    c.restore();
  }
  c.restore();
}

/* ================= GAG (34,9–44 s): ánh lóe trên kính, đốm sáng nháy đáp ================= */
const LF = { x: 720, s: 30 };
const lfHome = () => [LF.x, groundY(LF.x) - 12];
function lfState(t) {                                             // đốm đom đóm nhỏ dưới cỏ (toạ độ cảnh)
  const replies = [...HIT.reply1, ...HIT.reply2, ...HIT.reply3], on = Math.min(1, spike(t, replies, .2));
  const [hx, hy] = lfHome();
  if (t < HIT.joy[0]) { const hop = 22 * Math.min(1, pulse(t, replies, .04, .22)); return { x: hx, y: hy - hop, on: .15 + .85 * on, wing: hop > 2 ? t * 40 : 0, dir: -1 }; }
  const u = ss(seg(t, HIT.joy[0], HIT.joy[1])), loop = Math.sin(Math.PI * u) * 90;
  const x = lerp(hx, 640, u) + Math.cos(u * TAU) * 30 * Math.sin(Math.PI * u), y = lerp(hy, 1000, u) - loop + 14 * Math.sin(t * 4) * u;
  const beat = .5 + .5 * Math.sin(t * 7);
  return { x, y, on: Math.max(on, beat), wing: t * 40, dir: Math.cos(t * 2) > 0 ? 1 : -1 };
}
function gagCam(t) {
  // trôi chậm, đẩy vào phía đốm sáng khi Miss Loupe hỏi, lùi ra khi cô nháy mắt; đẩy chậm vào khi hỏi người xem
  const L16 = line('L16'), L17 = line('L17'), p = ss(seg(t, L17.t - .3, HIT.loop[0])), d = seg(t, HIT.flip[1], DUR);
  const ask = ss(seg(t, L16.t - .4, L16.t + .6)) * (1 - ss(seg(t, HIT.wink - .2, HIT.wink + .4)));
  const bump = decay(t, [...HIT.reply1, ...HIT.reply2, ...HIT.reply3], 9);
  return { cx: 540 + 40 * Math.sin(d * 2.4) + 25 * ask + 15 * p, cy: 990 - 10 * d + 20 * ask - 15 * p + 5 * Math.sin(t * 31) * bump, z: 1.45 + .05 * Math.sin(d * 3) + .09 * ask + .1 * p };
}
const gagLens = t => {
  const wx = 370, wy = groundY(370) - LENS_UP * LS.r, tilt = ss(seg(t, HIT.flip[1], HIT.flip[1] + .5)), L16 = line('L16');   // gag: Miss Loupe đứng gần giữa khung hơn
  const lean = ss(seg(t, L16.t - .3, L16.t + .4)) * (1 - ss(seg(t, HIT.wink + .5, HIT.wink + 1)));          // nghiêng về phía đốm sáng khi hỏi
  const hop = 26 * Math.min(1, pulse(t, [...HIT.reply1, ...HIT.reply2, ...HIT.reply3, HIT.wink], .05, .25));  // nhún mỗi lần đốm sáng nháy đáp
  return { x: wx + 20 * tilt + 45 * lean, y: wy - 30 * tilt - 10 * Math.sin(t * 2.2) - hop, r: LS.r, rot: .14 * tilt + .06 * Math.sin(t * 1.7) + .12 * lean };
};
function sGag(c, t, o = {}) {
  const cm = gagCam(t), G = gagLens(t), lf = lfState(t);
  look(c, cm, () => {
    nightSky(c, t); garden(c, t);
    const glints = [HIT.glint1, HIT.glint2, ...HIT.glint3], gl = Math.min(1, pulse(t, glints, .05, .3));
    const talk = talkAt(t), rep = Math.min(1, pulse(t, [...HIT.reply1, ...HIT.reply2, ...HIT.reply3], .05, .3));
    const name = talk ? 'explaining' : t > HIT.wink - .05 && t < HIT.wink + .7 ? 'wink' : t > HIT.joy[0] ? 'laugh' : rep > .3 ? 'surprised' : 'curious';
    loupe(c, G.x, G.y, G.r, { E: ex(BY.loupe, name, { talk, look: talk ? [.2, .1] : [.85, .3], blink: talk || name === 'wink' ? 0 : blinkAt(t) }), rot: G.rot - .08 * gl, pose: talk ? ARM.wave : ARM.peer });
    const gx = G.x + G.r * .62 * Math.cos(G.rot) + G.r * .55 * Math.sin(G.rot), gy = G.y - G.r * .62;
    if (gl > .05) { c.save(); c.globalAlpha = .35 * gl; c.strokeStyle = N.moon; c.lineWidth = 26; c.lineCap = 'round'; c.beginPath(); c.moveTo(MOON.x - 40, MOON.y + 60); c.lineTo(gx, gy); c.stroke(); c.restore(); }   // ánh trăng chạm vành kính
    glint(c, gx, gy, gl * 1.3);
    if (!o.noFly) tinyFly(c, lf.x, lf.y, LF.s, lf.on, { dir: lf.dir, wing: lf.wing });
  });
}
function glowIris(c, t) {                                         // đốm sáng bay về phía máy, phình thành vòng tròn sáng, mở về đúng khung đầu
  sGag(c, t, { noFly: true });
  const cm = gagCam(HIT.lift), lf = lfState(HIT.lift), p = toScreen(cm, lf.x, lf.y), u = ei(seg(t, HIT.loop[0], DUR - .04));
  const R = lerp(LF.s * 1.6, 2300, u), cx = lerp(p[0], 540, u), cy = lerp(p[1], 960, u);
  circle(c, cx, cy, R + 40, C.mango); circle(c, cx, cy, R + 18, C.lemon);
  c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip(); REC.mute++; sHook(c, t - DUR); REC.mute--; c.restore();
}
function liftFly(c, t) {                                          // đốm sáng bay lên về phía máy (trước vòng tròn)
  const cm = gagCam(t), lf = lfState(HIT.lift), p0 = toScreen(cm, lf.x, lf.y), u = seg(t, HIT.lift, HIT.loop[0]);
  const x = lerp(p0[0], 600, ei(u)), y = lerp(p0[1], 900, ei(u)) - 120 * Math.sin(Math.PI * u), s = lerp(LF.s * cm.z, 60, ei(u));
  tinyFly(c, x, y, s, 1, { dir: -1, wing: t * 40 });
}

/* ---------- chuyển cảnh ---------- */
function matchCut(c, t) {
  stickerMatchCut(c, t, { t0: HIT.zoomIn[0], t1: HIT.zoomOut[0], t2: HIT.zoomOut[1], lens: wideLens(HIT.zoomIn[0]), from: cc => sWide(cc, HIT.zoomIn[0]), to: (cc, tt) => sAlbum(cc, tt),
    slot: P[2], fill: C.night, draw: cc => { cc.scale(P[2].r / 100, P[2].r / 100); art3(cc); }, rim: C.berry });
}
function recallTitle(c, t) { hookTitle(c, TITLE, -1, { gone: 1 - back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: 400 }); }
function pageFlip(c, t) {
  const u = ss(seg(t, HIT.flip[0], HIT.flip[1])), w = 1080 * (1 - u);
  sGag(c, Math.max(t, HIT.flip[1]));
  c.save(); c.beginPath(); c.rect(0, 0, w, 1920); c.clip(); sAlbum(c, t); c.restore();
  c.fillStyle = 'rgba(30,27,58,.22)'; c.fillRect(w, 0, 34 * (1 - u), 1920);
  rrect(c, w - 60 * Math.sin(Math.PI * u), 0, 60 * Math.sin(Math.PI * u) + 2, 1920, 0, C.cream);
}
// sticker bay từ kính lên ô của nó
function flyToSlot(c, t) {
  for (const [i, f, cam] of [[0, HIT.fly1], [1, HIT.fly2]]) {
    const u = seg(t, f[0], f[1]); if (u <= 0 || u >= 1) continue;
    const L = lensBig(f[0]); flyBadge(c, u, { x: L.x, y: L.y, r: L.r * .8 }, SLOTS[i], FILLS[i].fill, FILLS[i].draw, 100);
  }
}
function lensSnap(c, t) {                                         // chớp sáng trong kính lớn khi "chụp" bí mật 1, 2
  for (const h of [HIT.snap1, HIT.snap2]) if (t >= h && t < h + .35) snapFlash(c, t, h, lensBig(t));
}

export function drawFilm(c, t) {
  t = clamp(t, 0, DUR - .001);
  c.save();
  if (t >= HIT.loop[0]) glowIris(c, t);
  else if (t >= HIT.lift) { sGag(c, t, { noFly: true }); liftFly(c, t); }
  else if (t >= HIT.flip[1]) sGag(c, t);
  else if (t >= HIT.flip[0]) pageFlip(c, t);
  else if (t >= HIT.zoomOut[1]) sAlbum(c, t);
  else if (t >= HIT.zoomIn[0]) matchCut(c, t);
  else if (t >= HIT.wide[1]) { sWide(c, t); snapFlash(c, t, HIT.snap3, wideLens(t)); }
  else if (t >= HIT.sting[0]) { sLens(c, t); lensSnap(c, t); titleSting(c, t, { t0: HIT.sting[0], t1: HIT.sting[1], from: (() => { const H = hookLoupe(HIT.sting[0]), p = toScreen(hookCam(HIT.sting[0]), H.x, H.y); return { x: p[0], y: p[1], r: H.r * hookCam(HIT.sting[0]).z }; })() }); flyToSlot(c, t); }
  else sHook(c, t);
  stickerSlots(c, t, { t0: HIT.slots, slots: SLOTS, fills: FILLS, to: { t0: HIT.slotsDown[0], t1: HIT.slotsDown[1], slots: P } });
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t, 510, SAFE.subY);
  c.restore();
}
