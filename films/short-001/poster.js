// SHORT-001 · poster Shorts 9:16 và thumbnail YouTube 16:9 (cùng một concept, hai bố cục).
// Concept: "Tai của dế nằm ở đâu?" Miss Loupe sững sờ: trong kính, chiếc tai trên chân trước của Chirp đang sáng lên và bắt sóng âm.
// Nhân vật vẽ bằng rig dùng chung (giữ nguyên thiết kế); chỉ khối phẳng, không viền, không gradient (Khối Kẹo Phẳng).
import { C, circle, ell, capsule, ground, rays, popText, lerp } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { X } from '/_shared/characters/parts.js';
import { ex, rigPt, loupe, zoomIn, shadow } from '/_shared/episode.js';

// ---------- Chirp: chân trước nhấc lên khoe tai (giống cảnh đáp án của phim) ----------
const L3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const CK_HIP = [-.24, -.7, .74], CK_FOOT0 = [-.4, 0, 1.18], CK_FOOT1 = [-.5, -1.3, 1.4];
const ckFront = lift => L3(CK_FOOT0, CK_FOOT1, lift);
function ckEarRig(lift) { const f = ckFront(lift), knee = L3(CK_HIP, f, .45); knee[1] += .12; return L3(knee, f, .32); }
const earAt = (x, y, k, yaw, lift) => rigPt(x, y, k, yaw, 0, ckEarRig(lift));
function chirpAt(c, x, y, k, o = {}) {
  return drawChar(c, BY.chirp, {
    x, y, k, yaw: o.yaw ?? 1.15, detail: o.detail || 0, showFx: false,
    expr: o.E || ex(BY.chirp, 'confident', { look: [.5, -.1] }),
    pose: { chirp: o.chirp ?? .9, frontL: ckFront(o.lift ?? .55), earGlow: 1, ant: o.ant || 0 },
  });
}

// Miss Loupe sững sờ: mắt to hơn hẳn, con ngươi nhỏ, miệng hét chữ O, hai tay giơ lên
function shocked(look) {
  const E = ex(BY.loupe, 'surprised', { fx: true, look });
  E.eye = { ...E.eye, scale: 1.34, pupil: .24, glint: 2 }; E.mouth = 'shout';
  return E;
}
const HANDS_UP = { handL: [-.86, -1.95, .12], handR: [.86, -1.95, .12], elbowL: [-.62, -1.45, .1], elbowR: [.62, -1.45, .1] };

// vạch "sững sờ" phẳng quanh vành kính (thay cho fx của biểu cảm, để không vẽ đè vào trong kính)
// quầng sáng sau kính: hai đĩa phẳng trong mờ (ngoại lệ ánh sáng như quầng của Blink), làm kính nổi lên trên nền đêm
const halo = (c, x, y, r) => { circle(c, x, y, r * 1.55, 'rgba(255,227,77,.10)'); circle(c, x, y, r * 1.28, 'rgba(255,227,77,.14)'); };
function shockLines(c, x, y, r, a0, a1, n, col) {
  for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * i / (n - 1), r0 = r * 1.16, r1 = r * (1.36 + (i % 2) * .1); capsule(c, x + Math.cos(a) * r0, y + Math.sin(a) * r0, x + Math.cos(a) * r1, y + Math.sin(a) * r1, r * .07, col); }
}
function stars(c, W, H, n, seed, col) {
  let s = seed; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) circle(c, rnd() * W, rnd() * H * .7, 4 + rnd() * 6, col);
}
function moon(c, x, y, r) { circle(c, x, y, r, C.cream); circle(c, x + r * .42, y - r * .22, r * .86, C.night); }
// sóng âm đi vào tai (bạc hà, trong kính) và sóng phát ra từ cánh (chanh, ngoài kính): các cung phẳng nhỏ dần
function arcs(c, x, y, s, n, col, spans) {
  for (let i = 0; i < n; i++) for (const [a0, a1] of spans) {
    const r = s * (1 + i * .62); c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = s * (.24 - i * .045);
    c.beginPath(); c.arc(x, y, r, a0, a1); c.stroke();
  }
}

// cảnh đêm của dế. ck = { x, y (chân), k, yaw, look, stalk: [x0, x1, y] lá nâng dế lên (16:9) }
function nightWorld(c, W, H, ck, o = {}) {
  ground(c, C.night);
  rays(c, o.rx, o.ry, C.nightL, .08, 16, 3600);
  if (!o.detail) { stars(c, W, H, o.stars ?? 26, 7, C.grape); if (o.moon) moon(c, ...o.moon); }
  ell(c, W * .15, H * 1.03, W * .7, H * .26, 0, X.nightD); ell(c, W * .95, H * 1.08, W * .62, H * .3, 0, C.grape);
  const g = ck.stalk ? ck.stalk[2] : ck.y;
  if (ck.stalk) {                                       // lá nâng dế lên: phiến lá nhọn hai đầu, cuống cong xuống đất
    const [x0, x1] = ck.stalk, w = ck.k * .34, mx = (x0 + x1) / 2;
    c.strokeStyle = C.leafD; c.lineWidth = ck.k * .13; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x0 + 30, g + 10); c.quadraticCurveTo(x0 - 60, g + 260, x0 + 40, H + 60); c.stroke();
    const blade = (dy, ww, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(x0, g + dy); c.quadraticCurveTo(mx, g + dy - ww, x1, g + dy - 30); c.quadraticCurveTo(mx, g + dy + ww, x0, g + dy); c.fill(); };
    blade(ck.k * .1, w, C.leafD); blade(0, w, C.leaf);
    c.strokeStyle = C.leafD; c.lineWidth = ck.k * .035; c.beginPath(); c.moveTo(x0 + 20, g); c.quadraticCurveTo(mx, g - 8, x1 - 40, g - 28); c.stroke();
  } else {
    for (let i = 0; i < 12; i++) { const x = ck.x - ck.k * 2.4 + i * ck.k * .45; capsule(c, x, g + ck.k * .4, x + 18 * Math.sin(i * 1.7), g - ck.k * (.4 + (i % 3) * .22), ck.k * .09, C.leafD); }
    ell(c, ck.x, g + ck.k * .26, ck.k * 3, ck.k * .5, -.03, C.leaf); ell(c, ck.x, g + ck.k * .44, ck.k * 2.6, ck.k * .26, -.03, C.leafD);
  }
  shadow(c, ck.x, g + ck.k * .03, ck.k * 1.3, .22);
  if (!o.detail && o.wing) { const w = rigPt(ck.x, ck.y, ck.k, ck.yaw, 0, [0, -1.35, -.5]); arcs(c, w[0] + o.wing.dx, w[1] + o.wing.dy, ck.k * o.wing.s, 2, C.lime, o.wing.spans); }   // cánh đang gáy
  drawChar(c, BY.chirp, {
    x: ck.x, y: ck.y, k: ck.k, yaw: ck.yaw, detail: 1, showFx: false,
    expr: ex(BY.chirp, 'confident', { look: ck.look || [0, .4] }), pose: { chirp: .9, earGlow: 1, ant: .5 },
  });
  if (o.detail) arcs(c, o.ear[0], o.ear[1], ck.k * .12, 3, C.mint, [[-.75, .75], [Math.PI - .75, Math.PI + .75]]);
}
// tai trên chân trước (toạ độ rig, chân đứng): sd = -1 trái, 1 phải
const earRig = sd => { const hip = [sd * .24, -.7, .74], foot = [sd * .4, 0, 1.18], knee = [sd * .44, -.36, .98]; return L3(knee, foot, .32); };
const earOf = (ck, sd) => rigPt(ck.x, ck.y, ck.k, ck.yaw, 0, earRig(sd));

const title = (c, s, x, y, px, fill, sh, o = {}) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075, ...o });

/* ================= 9:16 · 1080×1920 =================
   Trên: câu móc. Giữa: mặt Chirp to, vênh váo nhìn xuống. Dưới-trái: kính đặt đúng vào tai trên chân, Miss Loupe sững sờ.
   Nội dung chính nằm trong y 180–1500 và x ≥ 90 (chừa vùng chữ và nút của Shorts). */
export function poster(c) {
  const W = 1080, H = 1920, ck = { x: 640, y: 1250, k: 440, yaw: -.35, look: [-.45, .55] };
  const ear = earOf(ck, -1), R = 215, LX = ear[0], LY = ear[1];
  nightWorld(c, W, H, ck, { rx: LX, ry: LY, moon: [150, 640, 52], wing: { dx: 120, dy: -40, s: .22, spans: [[-1.25, -.35]] } });
  halo(c, LX, LY, R);
  shockLines(c, LX, LY, R, -2.75, -1.95, 3, C.cream);
  shockLines(c, LX, LY, R, -.35, .45, 3, C.cream);
  loupe(c, LX, LY, R, {
    E: shocked([.25, -.55]), rot: -.05, pose: HANDS_UP,
    inside: zoomIn(LX, LY, 2.3, ear[0], ear[1], () => nightWorld(c, W, H, ck, { rx: LX, ry: LY, detail: 1, ear })),
  });
  title(c, 'EARS ON', 540, 300, 160, C.lemon, X.nightD);
  title(c, 'ITS LEGS?!', 540, 470, 168, C.cream, C.berry);
}

/* ================= 16:9 · 1920×1080 =================
   Trái: Chirp đứng trên lá cao, Miss Loupe từ dưới với kính lên đúng tai. Phải: tiêu đề. Góc dưới-phải để trống (ô thời lượng). */
export function thumb(c) {
  const W = 1920, H = 1080, ck = { x: 600, y: 630, k: 300, yaw: .35, look: [-.4, .55], stalk: [150, 1080, 630] };
  const ear = earOf(ck, -1), R = 190, LX = ear[0], LY = ear[1];
  nightWorld(c, W, H, ck, { rx: LX, ry: LY, stars: 40, moon: [1740, 140, 54], wing: { dx: -150, dy: 10, s: .2, spans: [[-2.7, -1.9]] } });
  halo(c, LX, LY, R);
  shockLines(c, LX, LY, R, -2.9, -2.1, 3, C.cream);
  loupe(c, LX, LY, R, {
    E: shocked([.2, -.6]), rot: .06, pose: HANDS_UP,
    inside: zoomIn(LX, LY, 2.4, ear[0], ear[1], () => nightWorld(c, W, H, ck, { rx: LX, ry: LY, detail: 1, ear })),
  });
  title(c, 'LEGS', 1180, 300, 210, C.lemon, X.nightD, { align: 'left' });
  title(c, 'THAT', 1180, 480, 150, C.cream, C.berry, { align: 'left' });
  title(c, 'HEAR?!', 1180, 650, 170, C.mint, X.nightD, { align: 'left' });
}
