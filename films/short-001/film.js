// SHORT-001 · Bugs Hide Secret Senses in Their Legs! — mọi khung hình là hàm thuần của t.
// Nhân vật: rig dùng chung _shared/characters (drawChar). Đạo cụ cảnh: props.js. Thời gian: timeline.js.
import { C, REC, circle, ell, capsule, path, rrect, poly, ground, rays, hexes, popText, sticker, nope, rings, subFont, wrap, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar, resolveExpr } from '/_shared/characters/stage.js';
import { star } from '/_shared/characters/face.js';
import { BY } from '/_shared/characters/cast/index.js';
import { flower, cloud, sun, iceCream, shadow, badge } from './props.js';
import { at, BEAT, SECS, IRIS, LINES, CARDS, WAGGLE_DEG, DUR, HIT } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';
import { hookTitle, askTitle } from '/_shared/episode.js';

const secBy = id => SECS.find(s => s.id === id);
const K = keys => track(keys);
const flutter = t => Math.abs(Math.sin(t * TAU * 3.2));
const L3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
function camera(c, cx, cy, z, fn) { c.save(); c.translate(cx, cy); c.scale(z, z); c.translate(-cx, -cy); fn(); c.restore(); }

// ---------- khẩu hình: âm lượng thật của từng câu (voice/env.json, 24 giá trị mỗi giây); thiếu file thì nhép đều ----------
let ENV = null;
export const setEnv = e => { ENV = e; };
const talkAt = (t, who = 'loupe') => {
  for (const l of LINES) if (l.who === who && t >= l.t && t < l.t + l.dur) {
    const e = ENV && ENV[l.id]; if (e) return e[Math.min(e.length - 1, Math.floor((t - l.t) * 24))];
    return .35 + .65 * Math.abs(Math.sin((t - l.t) * Math.PI * 5.5));
  }
  return 0;
};
const blinkAt = (t, ph = 0) => { const p = (t * .31 + ph) % 1; return p > .965 ? 1 : 0; };

// ---------- biểu cảm: lấy từ ngữ pháp chung, thêm nhép miệng, chớp mắt, hướng nhìn ----------
function ex(CH, name, o = {}) {
  const E = resolveExpr(CH, name), R = { ...E, eye: { ...(E.eye || {}) } };
  for (const k of ['eyeL', 'eyeR']) if (E[k]) R[k] = { ...E[k] };
  if (o.look) for (const k of ['eye', 'eyeL', 'eyeR']) if (R[k]) R[k].look = o.look;
  if (o.talk > .06) { R.mouth = 'talk'; R.talk = o.talk; }
  if (o.blink) for (const k of ['eye', 'eyeL', 'eyeR']) if (R[k] && !R[k].closed) R[k].open = 1 - o.blink;
  if (o.closed) for (const k of ['eye', 'eyeL', 'eyeR']) if (R[k]) R[k].closed = o.closed;
  if (o.mouth) R.mouth = o.mouth;
  if (!o.fx) delete R.fx;
  R.tilt = o.tilt || 0;
  return R;
}
// điểm của rig (toạ độ nhân vật) → toạ độ màn hình, cùng phép biến đổi với drawChar (không lật)
function rigPt(x, y, k, yaw, lean, p) {
  const X = p[0] * Math.cos(yaw) + p[2] * Math.sin(yaw), Y = p[1], cs = Math.cos(lean), sn = Math.sin(lean);
  return [x + k * (X * cs - Y * sn), y + k * (X * sn + Y * cs)];
}

/* ---------- Miss Loupe: đặt theo TÂM KÍNH (lx, ly), bán kính kính r ----------
   Trong rig, tâm kính nằm trên điểm chân 2,73 bán kính. inside(c) vẽ cảnh phóng to trong toạ độ màn hình của cảnh:
   rig cắt sẵn theo mặt kính, rồi vẽ vành và vệt sáng lên trên. */
const LENS_UP = 2.73, LX = 540, LY = 860;
function loupe(c, lx, ly, r, o = {}) {
  const E = o.E || ex(BY.loupe, 'happy'), lean = o.rot ?? -.14, th = lean + (E.tilt || 0);
  const T0 = c.getTransform(), pose = { ...(o.pose || {}) };
  if (o.inside) pose.inside = cc => { cc.setTransform(T0); REC.mute++; o.inside(cc); REC.mute--; };
  drawChar(c, BY.loupe, { x: lx - Math.sin(th) * LENS_UP * r, y: ly + Math.cos(th) * LENS_UP * r, k: r, yaw: o.yaw || 0, lean, expr: E, pose, showFx: !!o.fx });
}
// cảnh phóng to trong kính: tâm kính (lx, ly), độ phóng mag, điểm của thế giới (wx, wy) nằm ở tâm kính
const zoomIn = (lx, ly, mag, wx, wy, draw) => c => { c.translate(lx, ly); c.scale(mag, mag); c.translate(-wx, -wy); draw(); };
const ARM = {
  peer: { handR: [.6, -1.62, .3], elbowR: [.7, -1.25, .1] },
  point: { handR: [.82, -1.7, .1], elbowR: [.8, -1.2, 0], pointR: [0, -1, 0] },
  up: { handL: [-.72, -1.75, .05], handR: [.72, -1.75, .05] },
  shrug: { handL: [-.88, -1.32, .1], handR: [.88, -1.32, .1] },
  wave: { handR: [.85, -2.0, .1], elbowR: [.72, -1.45, 0] },
};

/* ---------- côn trùng và các nhân vật khác ---------- */
function flutterAt(c, x, y, k, o = {}) {
  return drawChar(c, BY.flutter, {
    x, y, k, yaw: o.yaw ?? 1.25, lean: o.rot || 0, flip: !!o.flip, detail: o.detail || 0, showFx: false, extra: o.extra,
    expr: o.E || ex(BY.flutter, o.expr || 'happy', { look: o.look || [.3, .1] }),
    pose: { beta: o.beta ?? .32, tongue: o.tongue || 0, lift: o.lift || 0, antL: o.ant || 0, antR: o.ant || 0 },
  });
}
// điểm nếm phát sáng ở 6 bàn chân (chỉ vẽ trong kính)
const BF_FEET = [[-.3, 0, .44], [-.34, 0, .02], [-.3, 0, -.42], [.3, 0, .44], [.34, 0, .02], [.3, 0, -.42]];
const tasteGlow = glow => r => {
  if (glow <= .02) return;
  BF_FEET.forEach((f, i) => {
    const sd = i < 3 ? -1 : 1;
    for (let k = 0; k < 3; k++) {
      const q = r.P([f[0] + sd * .02, -.015, f[2] + .03 + k * .045]);
      r.flat(q[2] + .003, cc => { cc.fillStyle = 'rgba(183,240,74,.38)'; cc.beginPath(); cc.arc(q[0], q[1], .024 + .016 * glow, 0, TAU); cc.fill(); cc.fillStyle = C.lemon; cc.beginPath(); cc.arc(q[0], q[1], .014 * glow, 0, TAU); cc.fill(); });
    }
  });
};

const CK_HIP = [-.24, -.7, .74], CK_FOOT0 = [-.4, 0, 1.18], CK_FOOT1 = [-.5, -1.3, 1.4];   // chân trước gần người xem (bên trái của dế)
const ckFront = lift => L3(CK_FOOT0, CK_FOOT1, lift);
function ckEarRig(lift) {
  const f = ckFront(lift), knee = L3(CK_HIP, f, .45); knee[1] += .12;
  return L3(knee, f, .32);
}
function chirpAt(c, x, y, k, o = {}) {
  return drawChar(c, BY.chirp, {
    x, y, k, yaw: o.yaw ?? 1.15, detail: o.detail || 0, showFx: false,
    expr: o.E || ex(BY.chirp, o.expr || 'happy', { look: o.look || [.4, 0] }),
    pose: { chirp: o.chirp || 0, frontL: ckFront(o.lift || 0), earGlow: o.earGlow || 0, ant: o.ant || 0 },
  });
}
// Waggle. center: (x, y) là tâm thân (để xoay quanh thân khi nhảy trên tầng tổ). heading: hướng bò (radian, 0 = sang phải)
function waggleAt(c, x, y, k, o = {}) {
  const lift = o.lift ?? .42, yc = (1.05 + lift) * k;
  let lean = o.rot || 0, flip = !!o.flip;
  if (o.heading !== undefined) { const h = o.heading; if (Math.cos(h) < 0) { flip = true; lean = Math.PI - h; } else { flip = false; lean = h; } }
  if (o.center) { x -= (flip ? -1 : 1) * yc * Math.sin(lean); y += yc * Math.cos(lean); }
  return drawChar(c, BY.waggle, {
    x, y, k, yaw: o.yaw ?? Math.PI / 2, lean, flip, showFx: false,
    expr: o.E || ex(BY.waggle, o.expr || 'happy', { look: o.look || [.4, 0], mouth: o.mouth }),
    pose: { lift, wing: o.wing || 0, wag: o.wag || 0 },
  });
}
// Mr. Rollo: lăn viên tròn theo đường thẳng. Viên tròn vẽ phẳng ở đây để nó quay đúng quãng đường ÷ bán kính.
function rolloAt(c, x, y, k, dist) {
  const yaw = 1.4, B = rigPt(x, y, k, yaw, 0, [0, -.72, -1.55]), R = .72 * k, spin = -dist / R;
  c.save(); c.beginPath(); c.arc(B[0], B[1], R, 0, TAU); c.clip();
  c.fillStyle = '#8E430B'; c.fill(); circle(c, B[0] - R * .14, B[1] - R * .14, R, C.honeyD);
  for (const [a, rr, s] of [[0, .45, .26], [2.1, .5, .2], [4.0, .38, .17], [5.2, .62, .13]]) circle(c, B[0] + Math.cos(a + spin) * R * rr, B[1] + Math.sin(a + spin) * R * rr, R * s, C.honey);
  c.restore();
  drawChar(c, BY.rollo, { x, y, k, yaw, showFx: false, expr: ex(BY.rollo, 'happy', { look: [.3, .1] }), pose: { showBall: false } });
}
function albieAt(c, x, y, k, o = {}) {
  return drawChar(c, BY.albie, {
    x, y, k, yaw: o.yaw ?? .32, showFx: !!o.fx, expr: o.E || ex(BY.albie, 'happy'),
    pose: { hop: o.hop || 0, tilt: o.tilt || 0, tabsUp: o.tabsUp || 0, page: o.page || null, pageCurl: o.curl ?? .3 },
  });
}

/* ---------- MỞ: bàn chân The Giant giẫm kem ----------
   Nhịp móc 0–3,5 s (HOOK.md): bàn chân lơ lửng ngay trên kem từ khung đầu, ngón ngọ nguậy "đánh hơi" → chạm thử "boop" ngay sau chữ "taste"
   → lấy đà → giẫm bẹp đúng 1,5 s → Miss Loupe bật lên sững sờ → chân rút đi, Flutter sà xuống chỗ kem bẹp và dậm chân
   → trong kính, bàn chân bướm lóe sáng (gợi bí mật 1, chưa giải thích) → kính nở thành tựa. */
const stomp = HIT.stomp, HK = HIT.hook;
const FT = K([[0, [600]], [.45, [640]], [HK.boop, [712]], [HK.boop + .12, [700]], [.9, [560]], [1.3, [120]], [stomp, [952]], [HK.footOut, [952]], [HK.footOut + .1, [900]], [HK.footOut + .45, [-420]], [9, [-420]]]);
function shockedLoupe(look) {                                    // sững sờ: mắt to hơn, con ngươi nhỏ, miệng chữ O (cùng biểu cảm với ảnh bìa)
  const E = ex(BY.loupe, 'surprised', { look }); E.eye = { ...E.eye, scale: 1.34, pupil: .24, glint: 2 }; E.mouth = 'shout';
  return E;
}
function flutterHook(c, t, detail) {                             // Flutter có mặt từ khung đầu: lơ lửng bên trái, tròn mắt nhìn bàn chân, giật nảy khi chân giẫm;
  const p = ss(seg(t, HK.bfIn, HK.bfLand)), landed = t >= HK.bfLand, B = HK.bf, H = HK.hover;   // rồi sà xuống đúng chỗ kem bẹp, dậm hai cái; chỉ trong kính mới thấy bàn chân sáng
  const flinch = t > stomp ? Math.sin(Math.PI * seg(t, stomp, stomp + .35)) : 0;
  const hx = H.x + Math.sin(t * 2.4) * 10, hy = H.y + Math.sin(t * 4.2) * 14 - 60 * flinch;
  const x = lerp(hx, B.x, p), y = lerp(hy, B.y, p) - (landed ? 0 : Math.sin(p * Math.PI) * 60), k = lerp(H.k, B.k, p);
  const tap = HK.taps.reduce((a, s) => Math.max(a, Math.sin(Math.PI * seg(t, s - .14, s))), 0);
  const glow = detail ? ss(seg(t, HK.taps[0], HK.taps[0] + .25)) : 0;
  if (glow > 0) for (const f of BF_FEET) {                       // vệt sáng phẳng dưới bàn chân trên mặt kem: chanh đặc + lõi kem (chỉ trong kính)
    const P = rigPt(x, y, k, 1.25, 0, f); ell(c, P[0], P[1] + 3, k * .13 * glow, k * .045 * glow, 0, C.lemon); ell(c, P[0], P[1] + 3, k * .06 * glow, k * .02 * glow, 0, C.cream);
  }
  let E = ex(BY.flutter, 'happy', { look: landed ? [.45, .85] : [.3, .1] });
  if (t < HK.bfIn) {                                             // khung đầu: mắt tròn xoe (×1,2) rồi phồng to hẳn trong 0,25 s; giẫm thì phồng thêm
    E = ex(BY.flutter, 'surprised', { look: t < stomp ? [.55, -.45] : [.6, .25] });
    E.eye = { ...E.eye, scale: lerp(1.2, 1.45, back(seg(t, 0, .25), 2.5)) + .15 * flinch, pupil: .3 };
  }
  drawChar(c, BY.flutter, {
    x, y, k, yaw: 1.25, lean: landed ? 0 : -.12, detail: detail ? 1 : 0, showFx: false, extra: glow > 0 ? tasteGlow(glow) : null, expr: E,
    pose: { beta: landed ? .22 + .5 * Math.exp(-(t - HK.bfLand) * 6) : .25 + flutter(t), lift: landed ? 0 : .3 * (1 - p), legsUp: [[-.3, -.32 * tap, .44 + .1 * tap], 0, 0, 0, 0, 0] },
  });
  if (detail) HK.taps.forEach(s => {                             // mỗi cú dậm, hai đốm sao nháy lên ở bàn chân (chỉ trong kính)
    const q = seg(t, s, s + .45); if (q <= 0 || q >= 1) return;
    [BF_FEET[0], BF_FEET[3]].forEach((f, i) => { const P = rigPt(x, y, k, 1.25, 0, f); star(c, P[0] + (i ? 30 : -30), P[1] + 10 - 22 * eo(q), 20 * Math.sin(Math.PI * q), C.lemon); });
  });
}
function sHook(c, t, o = {}) {
  ground(c, C.mango); rays(c, 540, 1040, C.mangoL, t * .1);
  rrect(c, -40, 1330, 1160, 700, 0, C.tang);
  const sq = ss(seg(t, stomp, stomp + .1));
  c.save(); if (t > stomp && t < stomp + .3) c.translate(0, Math.sin((t - stomp) * 60) * 10 * (1 - (t - stomp) / .3));
  shadow(c, 540, 1342, 230 * (.6 + .4 * sq), .14);
  const jig = t > HK.boop && t < HK.boop + .6 ? Math.sin((t - HK.boop) * 34) * Math.exp(-(t - HK.boop) * 7) * .06 : 0;   // kem rung khi bị chạm thử
  c.save(); c.translate(540, 1306); c.scale(1 + jig, 1 - jig); c.translate(-540, -1306);
  iceCream(c, 540, 960 + sq * 92, 1.65, sq);
  c.restore();
  if (t >= stomp) for (let i = 0; i < 9; i++) { const a = -2.9 + i * .34, p = seg(t, stomp, stomp + .5); if (p < 1) circle(c, 540 + Math.cos(a) * (150 + 300 * eo(p)), 900 + Math.sin(a) * (120 + 280 * eo(p)) + 300 * p * p, 26 * (1 - p), C.pink); }
  flutterHook(c, t, o.noLup);
  const fy = FT(t)[0] + Math.sin(t * 11) * 10 * (1 - seg(t, .3, .45));                    // lơ lửng nhấp nhô trước khi chạm thử
  const wig = t < .95 ? 1 + t * 1.6 : t > stomp && t < HK.footOut + .1 ? 1 + (t - stomp) * 2 : 0;   // ngón chân ngọ nguậy: "đánh hơi", rồi ngoáy trong kem
  if (fy > -400) {
    drawChar(c, BY.giant, { x: 468, y: fy, k: 108, yaw: Math.PI / 2, pose: { part: 'foot', toeWiggle: wig }, showFx: false });
    rrect(c, 468 - 108 * .88, fy - 2400, 108 * 1.6, 1500, 0, C.skin);                                     // cổ chân luôn ra khỏi khung
  }
  c.restore();
  const wob = t > stomp ? Math.sin((t - stomp) * 14) * Math.exp(-(t - stomp) * 5) * .05 : 0;
  c.save(); c.translate(540, 340); c.rotate(-.03 + wob); c.translate(-540, -340);
  const tp = lerp(.8, 1, back(seg(t, 0, .22), 2.5));               // chữ móc bật ra ngay khung đầu (đọc được từ khung 0, "pop" đến cỡ thật trong 0,22 s)
  c.save(); c.translate(540, 290); c.scale(tp, tp); c.translate(-540, -290); popText(c, 'TASTE WITH', 540, 290, 140, C.grape, C.cream, t, -.5, { sh: 9 }); c.restore();
  popText(c, 'FEET?!', 540, 500, 230, C.berry, C.cream, t, .55, { sh: 10 });
  c.restore();
  if (!o.noLup && t > HK.lupIn) {                                 // Miss Loupe bật lên từ góc dưới-phải (vọt quá rồi nảy lại), sững sờ; "Butterflies can!" thì bật cười
    const u = HK.lupIn, [x, y, r] = K([[u, [1250, 1660, 190]], [u + .22, [830, 1095, 216]], [u + .36, [852, 1132, 212]], [L02T, [846, 1124, 214]], [2.85, [660, 1000, 225]], [3.5, [LX, LY, 240]]])(t);
    const E = t < L02T ? shockedLoupe([-.65, -.35]) : ex(BY.loupe, t < HK.taps[0] - .1 ? 'laugh' : 'excited', { talk: talkAt(t), look: [-.15, -.9] });   // rồi ngước nhìn vào kính
    loupe(c, x, y, r, { E, rot: -.2, pose: ARM.up, inside: zoomIn(x, y, 1.5, x, y, () => sHook(c, t, { noLup: true })) });
  }
}
const L02T = LINES.find(l => l.id === 'L02').t;

/* ---------- TỰA: "of tiny bugs" viết tí hon, chỉ kính mới đọc được · nhạc hiệu 2 s ---------- */
function titleWorld(c, t) {
  ground(c, C.grape); rays(c, 540, 600, C.nightL, -t * .12);
  popText(c, 'BIG', 540, 440, 200, C.lemon, C.night, t, at(2), { step: .07 });
  popText(c, 'SECRETS', 540, 650, 200, C.lemon, C.night, t, at(2) - .04, { step: .05 });
  // chữ tí hon là trò đùa thị giác; lời dẫn đọc to đúng câu này cùng lúc nên không tính vào readcheck
  popText(c, 'of tiny bugs', 540, LY + 12, 34, C.cream, null, t, at(2, 2), { font: subFont, step: .015, read: false });
}
function sTitle(c, t, o = {}) {
  titleWorld(c, t);
  if (o.noLup) return;
  const [x, y] = K([[at(2), [-300, 940]], [at(2, 1.4), [300, 870]], [at(2, 2.4), [LX, LY]], [at(3), [LX, LY]]])(t);
  loupe(c, x, y, 240, { E: ex(BY.loupe, 'laugh', { talk: talkAt(t) }), rot: -.1, pose: ARM.up, inside: zoomIn(x, y, 1.9, x, LY, () => titleWorld(c, t)) });
}

/* ---------- BÍ MẬT 1: BƯỚM (Flutter) ---------- */
const FL = { x: 560, y: 820, r: 225 }, BFK = 175, BFYAW = 1.25, BFX = 560, BFY = FL.y - 22;
const FOOT = rigPt(BFX, BFY, BFK, BFYAW, 0, BF_FEET[0]);
function bfWorld(c, t, detail) {
  const u = t - at(3), landed = u >= 2, glow = ss(seg(u, 4.4, 5.2)) * (1 - seg(u, 8.4, 9));
  ground(c, C.mint);
  ell(c, 160, 1500, 760, 360, 0, C.mintL); ell(c, 1000, 1560, 640, 340, 0, C.mintL);
  rrect(c, -40, 1400, 1160, 700, 0, C.leaf);
  cloud(c, 830, 270, 140); cloud(c, 170, 430, 96);
  flower(c, 150, 1180, 90, { petal: C.tang, heart: C.cream, stem: 300, sway: Math.sin(t) * 12 });
  flower(c, 950, 1110, 110, { petal: C.grape, heart: C.lemon, stem: 380, sway: Math.sin(t + 1) * 12 });
  const dip = landed ? Math.exp(-(u - 2) * 7) * Math.sin((u - 2) * 22) * 14 : 0;
  flower(c, FL.x, FL.y + dip, FL.r, { petal: C.berry, heart: C.lemon, stem: 640, n: 7 });
  if (detail && glow > 0) for (let i = 0; i < 10; i++) {                       // giọt mật dâng lên chân
    const ph = ((u * .8 + i * .1) % 1), fx = FOOT[0] - 34 + (i * 29) % 76, fy = FOOT[1] + 40 - ph * 36;
    circle(c, fx, fy, 5.5 * (1 - ph * .5) * glow, C.tang);
  }
  const p = ss(seg(u, 0, 2));
  const x = lerp(-140, BFX, p) + (landed ? 0 : Math.sin(u * 3.4) * 60 * (1 - p)), y = lerp(260, BFY, p) + (landed ? dip : Math.sin(u * 6) * 36 * (1 - p));
  const flap = landed ? .16 + .16 * Math.sin(t * 2.4) : flutter(t);
  flutterAt(c, x, y, BFK, {
    beta: .22 + flap * 1.0, rot: landed ? 0 : -.14, lift: landed ? 0 : .3 * (1 - p), detail, tongue: ss(seg(u, 7.8, 9)),
    look: u > 7.8 ? [.6, .45] : [.3, .1], E: ex(BY.flutter, u > 8.3 && u < 10 ? 'laugh' : 'happy', { look: u > 7.8 ? [.6, .45] : [.3, .1] }),
    extra: detail ? tasteGlow(glow) : null,
  });
}
function sButterfly(c, t, o = {}) {
  const u = t - at(3), z = 1 + .2 * ss(seg(u, 7.4, 8.6)) * (1 - ss(seg(u, 9.8, 10.6)));
  camera(c, 700, 720, z, () => bfWorld(c, t, 0));
  sticker(c, 'SECRET 1', 60, 170, C.berry, C.cream, seg(t, at(3), at(3, .6)));
  if (!o.noLup && u >= 2.2) {
    const P0 = [FOOT[0] + 10, FOOT[1] + 50];
    const [x, y] = K([[2.2, [1320, 1150]], [3, P0], [7, P0], [7.5, [120, 1200]], [10.4, [120, 1200]], [11, [LX, LY]]])(u);
    const r = K([[2.2, [200]], [3, [250]], [7, [250]], [7.5, [160]], [10.4, [160]], [11, [240]]])(u)[0];
    const m = ss(seg(u, 3.6, 4.2)) * (1 - ss(seg(u, 7, 7.5))), mag = lerp(1.4, 4.2, m);
    const name = u < 3.6 ? 'happy' : u < 7.4 ? 'surprised' : 'laugh';
    loupe(c, x, y, r, {
      E: ex(BY.loupe, name, { talk: u < 3.6 || u > 7.4 ? talkAt(t) : 0, look: [-.3, -.5] }), rot: u < 7.4 ? -.3 : -.1, pose: ARM.peer,
      inside: zoomIn(x, y, mag, lerp(x, FOOT[0] + 6, m), lerp(y, FOOT[1] - 4, m), () => bfWorld(c, t, m > .3 ? 1 : 0)),
    });
  }
  if (u > 7.9 && u < 10.6) { c.save(); c.translate(690, 1250); c.rotate(-.05); popText(c, 'SWEET!', 0, 0, 170, C.berry, C.cream, t, HIT.sweet, { step: .05, sh: 9 }); c.restore(); }
}

/* ---------- BÍ MẬT 2: DẾ (Chirp) ---------- */
const CKX = 470, CKY = 925, CKK = 205, CKYAW = 1.15;
const earW = lift => rigPt(CKX, CKY, CKK, CKYAW, 0, ckEarRig(lift));
const HEAD = rigPt(CKX, CKY, CKK, CKYAW, 0, [0, -1.12, 1.0]), WING = rigPt(CKX, CKY, CKK, CKYAW, 0, [-.17, -1.3, -.2]);
function ckWorld(c, t, detail) {
  const u = t - at(9), silent = u >= 5 && u < 6, glow = ss(seg(u, 6, 6.3)), lift = ss(seg(u, 8, 8.6));
  ground(c, C.night);
  for (let i = 0; i < 22; i++) { const x = (i * 197 + 80) % 1080, y = 90 + (i * 311) % 560; circle(c, x, y, 5 + (i % 3) * 2, C.grape); }
  circle(c, 930, 610, 78, C.cream); circle(c, 960, 590, 64, C.night);
  ell(c, 240, 1420, 800, 400, 0, C.nightL); ell(c, 980, 1520, 640, 420, 0, C.grape);
  for (let i = 0; i < 9; i++) { const x = 40 + i * 128; capsule(c, x, 1060, x + Math.sin(t + i) * 10 + 20, 850 - (i % 3) * 46, 22, C.leafD); }   // cỏ mọc sau lá
  ell(c, 520, 1060, 720, 150, -.02, C.leaf); ell(c, 500, 1090, 620, 80, -.02, C.leafD);
  const beat = (t / BEAT) % 1, chirp = silent ? 0 : (beat < .5 ? Math.abs(Math.sin(beat * TAU * 3)) : 0);
  if (!silent && u < 6) rings(c, WING[0] - 20, WING[1] - 40, 60, 360, 3, u * .9, C.lime, 12, -2.4, -.8);
  shadow(c, CKX + 40, CKY + 6, 300, .22);
  chirpAt(c, CKX, CKY, CKK, { chirp, detail, earGlow: detail && glow > .02 ? 1 : 0, lift, ant: t * 2.2, look: u >= 8 ? [.1, .15] : [.5, -.1], E: ex(BY.chirp, u >= 8 && u < 9 ? 'confident' : 'happy', { look: u >= 8 ? [.1, .15] : [.5, -.1] }) });
  if (detail && glow > 0 && u < 8) { const [ex_, ey] = earW(lift); rings(c, ex_, ey, 12, 90, 3, 1 - ((u * .9) % 1), C.mint, 5); }
}
function sCricket(c, t, o = {}) {
  const u = t - at(9), punch = 1 + (u >= 6 ? .03 * Math.exp(-(u - 6) * 8) : 0);
  camera(c, 540, 900, punch, () => ckWorld(c, t, 0));
  sticker(c, 'SECRET 2', 60, 170, C.lime, C.ink, seg(t, at(9), at(9, .6)));
  const [q1, q2, q0] = u < 6 ? ['WHERE ARE', 'ITS EARS?', at(9, 2)] : ['EARS ON', 'ITS LEGS!', at(12)];
  popText(c, q1, 540, 310, 104, C.lemon, C.grape, t, q0); popText(c, q2, 540, 420, 104, C.lemon, C.grape, t, q0 + .3);
  if (o.noLup || u < 2) return;
  const E0 = earW(0), H = [HEAD[0] + 10, HEAD[1] + 10], tH = HIT.ckHead - at(9), tN = HIT.ckNope - at(9);
  const [x, y] = K([[2, [1320, 1100]], [tH, H], [4.6, H], [5.95, E0], [7.9, E0], [8.4, [180, 1130]], [8.8, [180, 1130]], [9, [LX, LY]]])(u);
  const r = K([[2, [190]], [tH, [220]], [5.95, [220]], [6.1, [250]], [7.9, [250]], [8.4, [180]], [8.8, [180]], [9, [240]]])(u)[0];
  const mag = u < 5.9 ? 1.7 : lerp(1.7, 4.2, eo(seg(u, 5.9, 6.1))) * (1 - .6 * ss(seg(u, 7.9, 8.3)));
  const name = u < tH ? 'happy' : u < tN ? 'curious' : u < 5 ? 'surprised' : u < 6 ? 'thinking' : u < 7.8 ? 'surprised' : 'laugh';
  loupe(c, x, y, r, {
    E: ex(BY.loupe, name, { talk: talkAt(t), look: u >= 4.6 && u < 6 ? [-.3, .6] : [-.2, -.5] }), rot: -.24, pose: u >= tN && u < 5 ? ARM.shrug : ARM.peer,
    inside: zoomIn(x, y, mag, x, y, () => ckWorld(c, t, u > 5.8 && u < 8.1 ? 1 : 0)),
  });
  if (u > tN && u < 5.4) nope(c, H[0] + 210, H[1] - 110, 74, seg(u, tN, tN + .2));
}

/* ---------- BÍ MẬT 3: ONG (Waggle) ---------- */
const DC = { x: 540, y: 880 }, A = WAGGLE_DEG * Math.PI / 180, DIR = [Math.sin(A), -Math.cos(A)], RUN = 200;
const NOR = [-DIR[1], DIR[0]];
function wagglePos(ph) {                                       // một vòng: chạy, vòng phải, chạy, vòng trái
  ph = ((ph % 1) + 1) % 1; const a = [DC.x - DIR[0] * RUN, DC.y - DIR[1] * RUN], b = [DC.x + DIR[0] * RUN, DC.y + DIR[1] * RUN];
  const heading = Math.atan2(DIR[1], DIR[0]);
  if (ph < .25 || (ph >= .5 && ph < .75)) { const q = (ph % .5) / .25, s = Math.sin(q * TAU * 7) * 24; return { p: [lerp(a[0], b[0], q) + NOR[0] * s, lerp(a[1], b[1], q) + NOR[1] * s], rot: heading + Math.sin(q * TAU * 7) * .3, wag: Math.sin(q * TAU * 7) * .5, run: 1 }; }
  const side = ph < .5 ? 1 : -1, q = (ph % .5 - .25) / .25, ang = q * Math.PI;
  const x = DC.x + DIR[0] * RUN * Math.cos(ang) + NOR[0] * side * RUN * 1.05 * Math.sin(ang), y = DC.y + DIR[1] * RUN * Math.cos(ang) + NOR[1] * side * RUN * 1.05 * Math.sin(ang);
  return { p: [x, y], rot: heading + Math.PI + side * (Math.PI / 2 - ang), wag: 0, run: 0 };
}
function hiveWorld(c, t, o = {}) {
  const u = t - at(14), dancing = u >= 2 || o.still;
  ground(c, C.honeyD); hexes(c, 92, C.honey, -300, -300, 1400, 2200);
  hexes(c, 92, C.honeyL, -300, 1180, 1400, 2200, .62);
  // "lên trên" trong tổ = hướng mặt trời ngoài vườn
  sun(c, DC.x, 330, 46, t * .3);
  c.setLineDash([4, 30]); path(c, [[DC.x, 420], [DC.x, DC.y]], 10, C.lemon); c.setLineDash([]);
  if (dancing) {
    c.fillStyle = 'rgba(255,248,231,.35)'; c.beginPath(); c.moveTo(DC.x, DC.y); c.arc(DC.x, DC.y, 230, -Math.PI / 2, -Math.PI / 2 + A); c.closePath(); c.fill();
    const pts = []; for (let i = 0; i <= 120; i++) pts.push(wagglePos(i / 120 + .25).p);
    c.setLineDash([2, 34]); path(c, pts, 16, C.cream); c.setLineDash([]);
    capsule(c, DC.x - DIR[0] * RUN, DC.y - DIR[1] * RUN, DC.x + DIR[0] * RUN, DC.y + DIR[1] * RUN, 18, C.lemon);
  }
  const ph = o.still ? .1 : (t - HIT.dance) / 4;
  if (dancing) [[150, 1110], [930, 1090], [150, 560], [930, 590]].forEach((b, i) => waggleAt(c, b[0], b[1] + 60 + Math.sin(t * 6 + i) * 8 - Math.abs(Math.sin((t + i * .25) * Math.PI / BEAT / 2)) * 26, 50, { yaw: b[0] < 540 ? .9 : -.9, lift: .3, wing: Math.sin(t * 60 + i), look: [b[0] < 540 ? .6 : -.6, b[1] > 880 ? -.5 : .5] }));
  if (dancing && !o.still) for (let i = 2; i >= 1; i--) { const w = wagglePos(ph - i * .2); waggleAt(c, w.p[0], w.p[1], 46, { center: true, heading: w.rot, lift: 0, wing: Math.sin(t * 70 + i) * .5, look: [.5, 0] }); }
  if (dancing) { const w = wagglePos(ph); waggleAt(c, w.p[0], w.p[1], 82, { center: true, heading: w.rot, lift: 0, wag: w.wag, wing: w.run ? Math.sin(t * 90) * .6 : Math.sin(t * 50) * .2, look: [.5, .1], expr: 'excited' }); }
  else {
    const x = 540 + Math.sin(u * 3) * 40, y = 1000 + Math.sin(u * 4.3) * 24, open = Math.abs(Math.sin(u * 5));
    waggleAt(c, x, y, 118, { yaw: .75, lift: .42, wing: Math.sin(t * 80), look: [.4, -.1], E: ex(BY.waggle, 'worried', { look: [.4, -.1], mouth: open > .5 ? 'o' : 'wavy' }) });
  }
}
function sBee(c, t, o = {}) {
  const u = t - at(14), z = 1 + .05 * seg(u, 0, 2) * (1 - seg(u, 2, 2.05));
  camera(c, 540, 880, z, () => hiveWorld(c, t));
  sticker(c, 'SECRET 3', 60, 170, C.lemon, C.ink, seg(t, at(14), at(14, .6)));
  if (u < 2 && u > .2) {                                       // bóng thoại rỗng: ong không nói được
    const p = back(seg(u, .2, .5), 2);
    c.save(); c.translate(760, 560); c.scale(p, p); circle(c, 0, 0, 130, C.cream); poly(c, [[-90, 76], [-164, 170], [-20, 120]], C.cream);
    for (let i = 0; i < 3; i++) circle(c, -60 + i * 60, -4 - Math.abs(Math.sin(u * 5 + i)) * 18, 18, C.ink); c.restore();
  }
  if (u >= 2) popText(c, 'DANCE!', 540, 1380, 220, C.lemon, C.honeyD, t, HIT.dance, { step: .06, sh: 12 });
}

/* ---------- CẢNH ĐẶC TRƯNG: điệu nhảy là đường đi thật · Rollo lăn ngang bãi cỏ ---------- */
const HIVE = { x: 232, y: 2640, s: 150 }, SUN = { x: 232, y: 230 };
const FLOWER = { x: HIVE.x + Math.tan(A) * 2330, y: 2640 - 2330 };
const ROLLO = { y: 1765, x0: 1330, x1: 600, k: 58 };
function mapCam(u) {
  const p = ss(seg(u, 0, 1)), tilt = ss(seg(u, 1, 2.4)), wide = ss(seg(u, 2.4, 3.2));
  let cx = lerp(HIVE.x, HIVE.x + 180, p), cy = lerp(HIVE.y, HIVE.y - 660, p);
  cx = lerp(cx, FLOWER.x, tilt); cy = lerp(cy, FLOWER.y + 300, tilt);
  cx = lerp(cx, (HIVE.x + FLOWER.x) / 2, wide); cy = lerp(cy, (HIVE.y + SUN.y) / 2 + 20, wide);
  return { cx, cy, z: Math.exp(lerp(Math.log(HIVE_Z0), 0, p)) * lerp(1, .6, wide) * (1 + .04 * ss(seg(u, 3.2, 5))) };
}
const HIVE_K = HIVE.s / 960 * 1.1, HIVE_Z0 = 1 / HIVE_K;     // ở u = 0 tổ ong hiện đúng tỉ lệ 1:1 như cảnh trước, cắt không giật
const toScreen = (m, x, y) => [540 + (x - m.cx) * m.z, 980 + (y - m.cy) * m.z];
function mapWorld(c, t, u) {
  c.fillStyle = C.leaf; c.fillRect(-1200, -600, 3600, 4400);
  for (let i = 0; i < 26; i++) { const x = (i * 263 + 40) % 1120, y = 120 + (i * 491) % 2500; ell(c, x, y, 120 + (i % 3) * 30, 62, .1 * (i % 4), C.leafD); }
  for (const [x, y, r, p] of [[880, 2260, 70, C.mango], [110, 1900, 60, C.pink], [960, 1560, 76, C.tang], [150, 1160, 66, C.grape], [960, 880, 60, C.mint]]) flower(c, x, y, r, { petal: p, heart: C.cream });
  ell(c, 760, 1990, 200, 110, .1, C.sky); ell(c, 730, 1970, 120, 60, .1, C.skyL);
  sun(c, SUN.x, SUN.y, 104, t * .3);
  c.setLineDash([8, 44]); path(c, [[HIVE.x, HIVE.y - 150], [SUN.x, SUN.y + 170]], 18, C.lemon); c.setLineDash([]);
  c.fillStyle = 'rgba(255,248,231,.4)'; c.beginPath(); c.moveTo(HIVE.x, HIVE.y - 40); c.arc(HIVE.x, HIVE.y - 40, 380, -Math.PI / 2, -Math.PI / 2 + A); c.closePath(); c.fill();
  const L = ss(seg(u, .7, 2.4));
  capsule(c, HIVE.x, HIVE.y - 40, lerp(HIVE.x, FLOWER.x, L), lerp(HIVE.y - 40, FLOWER.y, L), 26, C.cream);
  flower(c, FLOWER.x, FLOWER.y, 190, { petal: C.berry, heart: C.lemon, n: 7, open: Math.max(.4, back(seg(u, 2.2, 2.6), 2)) });
  // Find Rollo! Đi thẳng tắp, không bao giờ rẽ; viên tròn quay đúng quãng đường ÷ bán kính
  const tr = seg(t, HIT.rolloIn, HIT.rolloOut);
  if (t >= HIT.rolloIn) { const x = lerp(ROLLO.x0, ROLLO.x1, tr); shadow(c, x - 30, ROLLO.y + 4, 90, .18); rolloAt(c, x, ROLLO.y, ROLLO.k, ROLLO.x0 - x); }
}
function mapHive(c, t) {                                       // tổ ong: bên trong là chính cảnh nhảy, thu nhỏ
  const s = HIVE.s;
  c.save(); c.beginPath(); c.roundRect(HIVE.x - s, HIVE.y - s * 1.3, s * 2, s * 2.6, s * .36); c.clip();
  c.translate(HIVE.x, HIVE.y); c.scale(HIVE_K, HIVE_K); c.translate(-540, -980);
  hiveWorld(c, t); c.restore();
}
function sMap(c, t) {
  const u = t - at(17), m = mapCam(u);
  c.save(); c.translate(540, 980); c.scale(m.z, m.z); c.translate(-m.cx, -m.cy);
  mapWorld(c, t, u); mapHive(c, t);
  const ang = Math.atan2(FLOWER.y - (HIVE.y - 40), FLOWER.x - HIVE.x);
  if (u > .8) for (let i = 0; i < 7; i++) { const s = ss(seg(u, .8 + i * .1, 2.4 + i * .06)); if (s > .01) waggleAt(c, lerp(HIVE.x, FLOWER.x - 10, s) + Math.sin(t * 7 + i) * 14, lerp(HIVE.y - 40, FLOWER.y + 70, s), 34, { center: true, heading: ang, lift: .42, wing: Math.sin(t * 70 + i) }); }
  c.restore();
  if (u > 2.5) { popText(c, 'THE DANCE', 70, 520, 72, C.cream, C.leafD, t, 36.6, { step: .03, align: 'left' }); popText(c, 'SHOWS THE WAY!', 70, 610, 72, C.lemon, C.leafD, t, 36.8, { step: .03, align: 'left' }); }
}
const FL_END = toScreen(mapCam(5), FLOWER.x, FLOWER.y);

/* ---------- SỔ SƯU TẦM: Albie ra mắt ---------- */
// Albie cao ≈ 59% Miss Loupe (bảng kích thước khóa: 55%), trang sổ ở nửa trên, hai nhân vật đứng nửa dưới
const AL = { x: 286, y: 1440, k: 138 }, AL_LENS = { x: 772, y: 1440 - LENS_UP * 140, r: 140 };
function sAlbum(c, t, o = {}) {
  const u = t - at(20), wake = HIT.albieWake - at(20);
  ground(c, C.sky); ell(c, 200, 1760, 900, 420, 0, C.skyL);
  ell(c, 540, 1720, 980, 330, 0, C.leaf); ell(c, 540, 1760, 900, 280, 0, C.leafD);
  rrect(c, 96, 208, 890, 680, 54, C.grape); rrect(c, 84, 190, 890, 680, 54, C.cream);
  const rows = [
    { y: 300, f: C.mint, t1: 'Taste', t2: 'with feet', col: C.berry, d: cc => flutterAt(cc, -8, 62, 50, { beta: .3 }) },
    { y: 530, f: C.night, t1: 'Hear', t2: 'with legs', col: C.grape, d: cc => chirpAt(cc, -22, 46, 52, { detail: 1, earGlow: 1, yaw: 1.2 }) },
    { y: 760, f: C.honey, t1: 'Talk', t2: 'by dancing', col: C.tang, d: cc => waggleAt(cc, 2, 66, 48, { yaw: .8, lift: .2 }) },
  ];
  rows.forEach((r, i) => {
    const t0 = HIT.stamp[i];
    circle(c, 240, r.y, 94, '#EBDDBC');                                   // chỗ trống chờ sticker
    if (t < t0 - .3) return;
    const p = t >= t0 ? back(seg(t, t0, t0 + .22), 2.6) : 1, fly = 760 * (1 - ss(seg(t, t0 - .3, t0))), settle = .06 * Math.sin(Math.PI * seg(t, HIT.albieIn, HIT.albieIn + .25));   // "In you go!": cả ba sticker ấn xuống trang
    badge(c, 240 + fly, r.y - fly * .25, 92, r.f, cc => r.d(cc), -.05 + i * .05, t >= t0 ? lerp(1.25, 1, p) - settle : .9);
    popText(c, r.t1, 390, r.y - 4, 86, r.col, null, t, t0 + .1, { align: 'left', step: .02 });
    popText(c, r.t2, 390, r.y + 60, 56, C.ink, null, t, t0 + .2, { align: 'left', step: .012, font: subFont });
  });
  // Albie: đang ngủ → giật mình mở mắt → "Six legs? In you go!" → nảy theo từng sticker → giữ tĩnh
  const hop = .3 * Math.sin(Math.PI * seg(u, wake, wake + .35)) + HIT.stamp.slice(1).reduce((s, ts) => s + .1 * Math.sin(Math.PI * seg(t, ts, ts + .2)), 0);
  const talk = talkAt(t, 'albie'), asleep = u < wake;
  let E;
  if (asleep) E = ex(BY.albie, 'sleepy', { closed: 'line', mouth: 'flat' });
  else if (t < HIT.stamp[2] + .4) E = ex(BY.albie, 'surprised', { look: [.5, -.65] });
  else if (talk > 0) E = ex(BY.albie, 'happy', { talk, look: t < HIT.albieIn ? [.55, -.65] : [.15, -.05] });
  else E = ex(BY.albie, 'happy', { look: [.15, -.05], blink: blinkAt(t, .4) });
  shadow(c, AL.x + 14, AL.y + 4, 140, .18);
  const breathe = asleep ? Math.sin(t * 3) * .015 : 0;
  albieAt(c, AL.x, AL.y, AL.k * (1 + breathe), { E, hop, tabsUp: asleep ? 0 : 1 - seg(u, wake, wake + 1.2), page: t > HIT.albieIn - .2 ? [.72, -1.62, -.35] : null, curl: -.2 });
  if (asleep) for (let i = 0; i < 2; i++) { const ph = (t * .8 + i * .5) % 1; c.save(); c.globalAlpha = 1 - ph; c.font = subFont(40 + i * 12); c.fillStyle = C.grape; c.fillText('z', AL.x + 100 + ph * 40 + i * 26, AL.y - 2.25 * AL.k - 10 - ph * 70 - i * 34); c.restore(); }
  // Miss Loupe đứng cạnh, nói câu kết; chính kính của cô sẽ mở sang cảnh cuối
  if (!o.noLup) {
    shadow(c, AL_LENS.x, AL.y + 4, 150, .16);
    const lt = talkAt(t), say = t >= LINES.find(l => l.id === 'L17').t - .1;
    loupe(c, AL_LENS.x, AL_LENS.y, AL_LENS.r, { E: ex(BY.loupe, say ? 'explaining' : 'happy', { talk: lt, look: say ? [0, .1] : [-.7, -.2], blink: blinkAt(t) }), rot: 0, pose: say ? ARM.point : {} });
  }
}

/* ---------- KẾT: bướm nếm lại Miss Loupe ---------- */
function sGag(c, t) {
  const g0 = secBy('gag').t0, u = t - g0, land = HIT.gagLand - g0, z = 1 + .05 * seg(u, 0, 4);
  camera(c, 540, 760, z, () => {
    ground(c, C.mint); rays(c, 540, 640, C.mintL, t * .1);
    const ask = t >= LINES.find(l => l.id === 'L19').t - .1;           // v4: hỏi thẳng trẻ: thôi cười, nhìn ra người xem
    const hop = t > HIT.gagLaugh ? Math.abs(Math.sin((t - HIT.gagLaugh) * 8)) * 22 * (1 - ss(seg(t, HIT.gagLaugh + .3, HIT.gagLaugh + .5))) : 0, x = 540, y = 600, r = 320;
    const name = u < land - .1 ? 'happy' : t < HIT.gagLaugh ? 'crosseyed' : ask ? 'happy' : 'laugh';
    loupe(c, x, y - hop, r, { E: ex(BY.loupe, name, { talk: talkAt(t), blink: name === 'happy' && !ask ? blinkAt(t) : 0, look: ask ? [0, 0] : [0, -.3] }), rot: 0, pose: name === 'crosseyed' ? ARM.shrug : ask ? ARM.point : ARM.up });
    const p = ss(seg(u, 0, land)), bx = lerp(1240, 548, p), by = lerp(170, y + 40 - hop, p) + (u < land ? Math.sin(u * 8) * 40 * (1 - p) : 0);
    flutterAt(c, bx, by, 110, { beta: u < land ? .22 + flutter(t) : .2 + .14 * Math.sin(t * 2.4), tongue: ss(seg(t, HIT.gagSlurp - .2, HIT.gagSlurp + .6)), rot: u < land ? -.14 : 0, lift: u < land ? .25 : 0, E: ex(BY.flutter, t > HIT.gagSlurp ? 'laugh' : 'happy', { look: [.4, .5] }) });
  });
}

/* ---------- phụ đề: tấm giữ nguyên cỡ, chữ hiện theo câu đã nói ---------- */
function subtitle(c, card, t) {
  const a = seg(t, card.t0, card.t0 + .14); if (a <= 0) return;
  c.save(); c.font = subFont(56); c.textAlign = 'left'; c.textBaseline = 'middle';
  const ls = wrap(c, card.text, 800), lh = 66, w = Math.max(...ls.map(l => c.measureText(l).width)) + 72, h = ls.length * lh + 34;
  let shown = card.parts.filter(p => t >= p.t).map(p => p.text).join(' ').length;
  const s = back(a, 1.6); c.translate(510, 1545); c.scale(s, s);
  rrect(c, -w / 2 + 6, -h / 2 + 10, w, h, 30, 'rgba(30,27,58,.28)');
  rrect(c, -w / 2, -h / 2, w, h, 30, C.cream);
  c.fillStyle = C.ink;
  ls.forEach((l, i) => { if (shown <= 0) return; const lw = c.measureText(l).width, part = l.slice(0, shown); c.fillText(part, -lw / 2, (i - (ls.length - 1) / 2) * lh + 3); shown -= l.length + 1; });
  c.restore();
}

const SC = { hook: sHook, title: sTitle, butterfly: sButterfly, cricket: sCricket, bee: sBee, map: sMap, album: sAlbum, gag: sGag };
const IRISES = IRIS.map(i => i.kind === 'flower' ? { ...i, x: FL_END[0], y: FL_END[1], r0: 60 } : i.kind === 'albumLens' ? { ...i, x: AL_LENS.x, y: AL_LENS.y, r0: AL_LENS.r } : { ...i, x: LX, y: LY, r0: 240 });
// v3: chữ móc trở lại ở cuối phim, đúng chỗ và đúng cỡ như ở khung mở (TASTE WITH / FEET?!)
const TITLE = [{ text: 'TASTE WITH', y: 290, px: 140, fill: C.grape, shadow: C.cream, t0: 0 }, { text: 'FEET?!', y: 500, px: 230, fill: C.berry, shadow: C.cream, t0: .12 }];
function recallTitle(c, t) { hookTitle(c, TITLE, t - HIT.recall, { gone: 1 - .62 * back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: 340, dy: -200 }); }   // nhỏ lại và nằm trên kính: không che Flutter đang nếm kính (gag cuối)
export function drawFilm(c, t) {
  t = clamp(t, 0, DUR - .001);
  const sec = SECS.find(s => t >= s.t0 && t < s.t1) || SECS[SECS.length - 1];
  const ir = IRISES.find(i => t >= i.t0 && t < i.t1);
  c.save();
  if (ir) {
    const u = ei(seg(t, ir.t0, ir.t1)), R = lerp(ir.r0, 2200, u), tt = Math.max(t, secBy(ir.to).t0);
    SC[ir.from](c, t, { noLup: true });
    if (ir.kind === 'flower') {
      flower(c, ir.x, ir.y, R * 1.3, { petal: C.berry, heart: C.lemon, n: 7 });
      c.save(); c.beginPath(); c.arc(ir.x, ir.y, R * .43, 0, TAU); c.clip(); REC.mute++; SC[ir.to](c, tt, { noLup: true }); REC.mute--; c.restore();
    } else {
      const album = ir.kind === 'albumLens';
      loupe(c, ir.x, ir.y, R, { E: ex(BY.loupe, album ? 'explaining' : 'surprised', { talk: talkAt(t), look: [0, -.4] }), rot: album ? 0 : -.14, pose: album ? ARM.point : ARM.up, inside: () => SC[ir.to](c, tt, { noLup: true }) });
    }
  } else SC[sec.id](c, t);
  askTitle(c, t, HIT.ask[0], HIT.ask[1], { small: 'Can YOUR', big: 'FEET TASTE?', cy: 170, px: 112, shadow: C.cream, fill: C.berry, ink: C.grape, q: C.grape });   // v4: câu hỏi kết hiện to ở đúng chỗ chữ móc sẽ trở lại
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t);
  c.restore();
}
