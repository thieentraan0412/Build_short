// Ảnh bìa LONG-001 (nâng cấp 11/2026). Ba bản, cùng một concept "Ký ức mùa hè cứu Albie":
//   thumb    · thumbnail YouTube 16:9 (1920×1080): chữ móc ngắn SAVE ALBIE! (tựa đầy đủ đã nằm ngay cạnh, trong tiêu đề video)
//   poster   · poster dọc 9:16 (1080×1920): tựa đầy đủ + dải "A SNOWY ADVENTURE" + tên kênh
//   poster16 · poster.jpg 16:9: cùng cảnh với thumbnail, tựa đầy đủ thay cho chữ móc
// Tương phản lạnh–ấm: cửa sổ tuyết xanh lạnh; Albie đóng băng, buồn ngủ (chuyện của phim: cứu Albie trước khi cậu ngủ suốt mùa đông);
// trong kính Miss Loupe là ký ức mùa hè ấm, nơi bí mật đầu tiên đang sáng (Flutter nếm quả dâu bằng chân). Crumb reo lên.
// Khác ảnh bìa các Short (mỗi Short một bí mật đơn): đây là ảnh bìa duy nhất có Albie làm nhân vật chính và có tuyết.
// Khối phẳng, không viền, không gradient; nhân vật vẽ bằng rig dùng chung. Không phụ đề, không chữ kêu gọi.
import { C, circle, ell, capsule, rrect, popText, subFont, TAU, BY, ex, rigPt, star, crumbAt, albieW, loupeW, ARM, UP_ARMS } from './lib16.js';
import { c1World } from './memories.js';
import { snowflake, W } from './props.js';
import { H } from './lib16.js';

const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
const T = 0;                                                       // thời điểm "giả" cho rig (không lời, không chớp mắt)

/* ---------- nền: tường ấm, khung cửa sổ lớn không song, vườn tuyết, tuyết rơi; bậu gỗ ở mép dưới ---------- */
function backdrop(c, w, h, win, sillY, o = {}) {
  c.fillStyle = W.wall; c.fillRect(0, 0, w, h);
  for (let i = -2; i < w / 180 + 2; i++) rrect(c, i * 180 + 40, -100, 70, h + 200, 35, 'rgba(246,201,140,.35)');
  rrect(c, win.x - 40, win.y - 40, win.w + 80, win.h + 80, 34, W.woodD);
  rrect(c, win.x - 24, win.y - 24, win.w + 48, win.h + 48, 26, W.wood);
  c.save(); c.beginPath(); c.roundRect(win.x, win.y, win.w, win.h, 16); c.clip();
  c.fillStyle = W.pane; c.fillRect(win.x, win.y, win.w, win.h);
  const yb = win.y + win.h, x0 = win.x;
  ell(c, x0 + win.w * .22, yb + 40, win.w * .55, (o.hill || 220), 0, W.snowS); ell(c, x0 + win.w * .82, yb + 30, win.w * .5, (o.hill || 220) * .85, 0, W.snow);
  for (const [fx, hh] of o.trees || []) {                          // cây trụi lá có tuyết
    const bx = x0 + win.w * fx, s = hh / 300;
    rrect(c, bx - 12 * s, yb - hh, 24 * s, hh, 12 * s, '#6B4A8F');
    capsule(c, bx, yb - hh * .6, bx + 75 * s, yb - hh * .86, 12 * s, '#6B4A8F'); capsule(c, bx, yb - hh * .45, bx - 62 * s, yb - hh * .7, 11 * s, '#6B4A8F');
    ell(c, bx + 62 * s, yb - hh * .88, 38 * s, 12 * s, -.4, W.snow); ell(c, bx - 52 * s, yb - hh * .72, 30 * s, 10 * s, .5, W.snow); ell(c, bx, yb - hh - 4, 16 * s, 8 * s, 0, W.snow);
  }
  for (let i = 0; i < (o.snow || 60); i++) {                       // tuyết rơi
    const sx = x0 + hash(i) * win.w, sy = win.y + hash(i + 9) * win.h, r = 5 + hash(i + 5) * 9;
    circle(c, sx, sy, r, 'rgba(255,255,255,.9)');
  }
  c.restore();
  for (const [cx, s] of [[win.x, 1], [win.x + win.w, -1]]) for (let i = 0; i < 5; i++) ell(c, cx + s * (40 + i * 46), yb - 18 - (i % 2) * 10, 62 - i * 8, 34 - i * 4, 0, 'rgba(244,251,255,.8)');   // sương góc kính
  rrect(c, -40, sillY - 12, w + 80, 70, 20, W.woodL); rrect(c, -40, sillY + 40, w + 80, h, 0, W.wood); rrect(c, -40, sillY + 40, w + 80, 18, 0, W.woodD);
}

/* ---------- Albie đóng băng: băng phủ chân, cột băng dài, tuyết trên đầu, mắt díp lại vì buồn ngủ, run lập cập ---------- */
function frozenAlbie(c, x, y, k) {
  const yaw = -.3, E = ex(BY.albie, 'worried', { look: [-.45, -.15] });
  for (const e of ['eye', 'eyeL', 'eyeR']) if (E[e]) E[e] = { ...E[e], lidTop: .5, lidTilt: .2 };
  // run lập cập: vệt rung hai bên
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const px = x + s * k * (1.02 + i * .02), py = y - k * (1.0 + i * .42); capsule(c, px, py - k * .1, px + s * k * .08, py + k * .1, k * .045, 'rgba(255,255,255,.95)'); }
  albieW(c, x, y, k, T, { cold: 1, E, tabsIce: [1, 1, 1, 1], yaw });
  const P = q => rigPt(x, y, k, yaw, 0, q);
  // tuyết đọng trên đầu sổ
  const top = P([0, -2.32, .1]); ell(c, top[0], top[1] - k * .02, k * .72, k * .13, 0, W.snow); ell(c, top[0] - k * .25, top[1] - k * .1, k * .3, k * .12, 0, W.snow);
  // cột băng dài dưới mép bìa
  [[-.55, .32], [-.3, .5], [-.05, .26], [.2, .44], [.45, .3]].forEach(([u, l]) => { const q = P([u, -2.2, .44]); c.fillStyle = W.ice; c.beginPath(); c.moveTo(q[0] - k * .07, q[1]); c.lineTo(q[0] + k * .07, q[1]); c.lineTo(q[0] + k * .01, q[1] + k * l); c.closePath(); c.fill(); ell(c, q[0] - k * .02, q[1] + k * .08, k * .015, k * .05, 0, C.white); });
  // khối băng đóng quanh chân
  const b0 = P([-.86, -.55, .5]), b1 = P([.86, -.55, .5]);
  const bx = Math.min(b0[0], b1[0]) - k * .1, bw = Math.abs(b1[0] - b0[0]) + k * .2, by = y - k * .62;
  rrect(c, bx, by, bw, k * .66, k * .16, 'rgba(191,230,250,.82)');
  rrect(c, bx + k * .1, by + k * .08, bw * .55, k * .07, k * .035, 'rgba(255,255,255,.75)');
  capsule(c, bx + bw * .72, by + k * .2, bx + bw * .86, by + k * .42, k * .03, 'rgba(255,255,255,.7)');
}

/* ---------- Miss Loupe soi ký ức mùa hè: Flutter đậu quả dâu, sáu bàn chân sáng lên (nếm bằng chân) ---------- */
const MEM_T = H.c1_zoom + 1.6;                                     // sau đáp án: điểm nếm ở chân đang sáng, Flutter cười tít, tim bay lên
function summerLoupe(c, lx, ly, r, o = {}) {
  for (let i = 3; i >= 1; i--) circle(c, lx, ly, r + i * 34, `rgba(255,211,77,${.11 * (4 - i) / 3 + .04})`);   // hơi ấm toả ra từ kính
  const mag = o.mag ?? r / 170, wx = o.wx ?? 1388, wy = o.wy ?? 452;
  loupeW(c, lx, ly, r, T, { E: ex(BY.loupe, 'excited', { look: [.35, -.55] }), rot: o.rot ?? -.06, pose: ARM.up,
    inside: cc => { cc.translate(lx, ly); cc.scale(mag, mag); cc.translate(-wx, -wy); c1World(cc, MEM_T, { detail: true, cast: false }); } });
  for (let i = 0; i < 5; i++) { const a = -2.6 + i * .55; star(c, lx + Math.cos(a) * r * 1.2, ly + Math.sin(a) * r * 1.2, r * (.06 + .03 * (i % 2)), C.lemon); }
}

/* ---------- Crumb reo lên, hai tay giơ cao ---------- */
const crumbCheer = (c, x, y, k, look = [.7, -.6]) => crumbAt(c, x, y, k, { E: ex(BY.crumb, 'excited', { look }), yaw: .85, arms: UP_ARMS, cube: false, hop: .08 });

/* ---------- chữ ---------- */
const title = (c, s, x, y, px, fill, sh) => popText(c, s, x, y, px, fill, sh, -1, 0, { read: false, sh: px * .08 });
function ribbon(c, str, x, y, px, rot = -.04) {                    // dải chữ phụ (khối phẳng, có bóng lệch), hai bông tuyết hai đầu
  c.save(); c.font = subFont(px); const w = c.measureText(str).width + px * 2.6, h = px * 1.5;
  c.translate(x, y); c.rotate(rot);
  rrect(c, -w / 2 + 8, -h / 2 + 10, w, h, h / 2, 'rgba(30,27,58,.3)'); rrect(c, -w / 2, -h / 2, w, h, h / 2, C.grape);
  c.fillStyle = C.cream; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(str, 0, px * .06);
  snowflake(c, -w / 2 + h * .55, 0, h * .3, .2); snowflake(c, w / 2 - h * .55, 0, h * .3, -.2);
  c.restore();
}

/* ================= THUMBNAIL YOUTUBE 16:9 ================= */
const SILL16 = 1000, WIN16 = { x: 46, y: -60, w: 1828, h: 1010 };
function scene16(c) {
  backdrop(c, 1920, 1080, WIN16, SILL16, { trees: [[.04, 330], [.6, 420], [.95, 300]], snow: 70, hill: 240 });
  snowflake(c, 1720, 190, 92, .25, { glow: 1, arms: [1, 1, 1, 1, 1, 1] });   // bông tuyết sáu cánh của câu móc
  crumbCheer(c, 330, SILL16 + 4, 96);
  const r = 228; summerLoupe(c, 1060, SILL16 - 2.73 * r, r);
  frozenAlbie(c, 1600, SILL16 + 2, 238);
}
export function thumb(c) {
  scene16(c);
  title(c, 'SAVE', 420, 300, 230, C.lemon, C.ink);
  title(c, 'ALBIE!', 430, 540, 210, C.pink, C.berryD);
}
export function poster16(c) {
  scene16(c);
  title(c, 'HOW DO BUGS', 450, 190, 112, C.cream, C.grape);
  title(c, 'TASTE, SMELL', 450, 330, 112, C.lemon, C.berry);
  title(c, '& HEAR?', 450, 490, 150, C.pink, C.berryD);
  ribbon(c, 'A SNOWY ADVENTURE', 450, 610, 46);
}

/* ================= POSTER DỌC 9:16 ================= */
export function poster(c) {
  const SILL = 1650, WIN = { x: 40, y: -60, w: 1000, h: 1660 };
  backdrop(c, 1080, 1920, WIN, SILL, { trees: [[.08, 420], [.9, 380]], snow: 70, hill: 260 });
  snowflake(c, 930, 820, 64, .25, { glow: 1, arms: [1, 1, 1, 1, 1, 1] });
  title(c, 'HOW DO BUGS', 540, 210, 118, C.cream, C.grape);
  title(c, 'TASTE, SMELL', 540, 360, 118, C.lemon, C.berry);
  title(c, '& HEAR?', 540, 540, 170, C.pink, C.berryD);
  ribbon(c, 'A SNOWY ADVENTURE', 540, 670, 48);
  crumbCheer(c, 175, SILL + 4, 84, [.8, -.5]);
  const r = 230; summerLoupe(c, 470, SILL - 2.73 * r, r);
  frozenAlbie(c, 850, SILL + 2, 205);
  c.font = subFont(50); c.fillStyle = C.cream; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('BIG SECRETS OF TINY BUGS', 540, 1800);
}
