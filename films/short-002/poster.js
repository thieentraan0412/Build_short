// SHORT-002 · poster Shorts 9:16 và thumbnail YouTube 16:9 (cùng một concept, hai bố cục).
// Concept: "Bàn chân biết nếm": Flutter dậm lên miếng dưa hấu, điểm nếm ở bàn chân sáng lên, tia "ngọt" chạy lên đầu, vòi tự bung ra.
// 16:9 thêm Albie nấp sau miếng dưa, lo lắng: trang sổ của cậu sẽ là món tiếp theo (gag của tập).
// Nhân vật vẽ bằng rig dùng chung (giữ nguyên thiết kế); chỉ khối phẳng, không viền, không gradient (Khối Kẹo Phẳng).
import { C, circle, ell, capsule, poly, ground, rays, popText, TAU, lerp } from '/_shared/kit.js';
import { BY } from '/_shared/characters/cast/index.js';
import { X } from '/_shared/characters/parts.js';
import { ex, rigPt, flutterAt, albieAt, tasteGlow, BF_FEET } from '/_shared/episode.js';
import { watermelon, gingham, cloud, sun, drop } from './props.js';

// Flutter phấn khích tột độ: mắt to hơn, con ngươi lớn lấp lánh, nhìn xuống bàn chân; vòi buông ra ("o")
function thrilled(look) {
  const E = ex(BY.flutter, 'excited', { look }); E.eye = { ...E.eye, scale: 1.4, pupil: .6, glint: 2 }; E.mouth = 'o';
  return E;
}
const STOMP = [[-.3, -.42, .64], 0, 0, 0, 0, 0];          // chân trước trái nhấc lên, năm chân còn lại đang "nếm"
const star = (c, x, y, r, col, rot = 0) => { const p = []; for (let i = 0; i < 10; i++) { const a = rot - Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } poly(c, p, col); };

function flutterStomp(c, x, y, k, o) {
  o = { beta: .78, tongue: .62, ...o };
  const yaw = o.yaw, flip = !!o.flip, s = flip ? -1 : 1;
  const P = f => { const q = rigPt(x, y, k, yaw, 0, f); return flip ? [2 * x - q[0], q[1]] : q; };
  const feet = BF_FEET.map(P).filter((_, i) => i !== 0), up = P(STOMP[0]), head = P([0, -.72, .62]);
  // bóng phẳng trên mặt dưa
  c.fillStyle = 'rgba(183,31,82,.35)'; c.beginPath(); c.ellipse(x, y + k * .02, k * .7, k * .09, 0, 0, TAU); c.fill();
  // vệt sáng phẳng dưới các bàn chân đang nếm: chanh đặc + lõi kem (khối phẳng, không trong mờ để không đục màu dưa)
  for (const [fx, fy] of feet) ell(c, fx, fy + k * .005, k * .13, k * .045, 0, C.lemon);
  for (const [fx, fy] of feet) ell(c, fx, fy + k * .005, k * .06, k * .02, 0, C.cream);
  // nước dưa bắn ra hai bên cụm chân
  const cx = feet.reduce((a, f) => a + f[0], 0) / feet.length;
  for (const [dx, dy, r] of o.drops) drop(c, cx + s * dx * k, y + dy * k, r * k, r > .045 ? C.berry : X.pinkD);
  // tia "ngọt": chuỗi sao chanh từ bàn chân chạy lên đầu
  const f0 = feet[0];
  for (let i = 0; i < 6; i++) { const u = i / 5, px = lerp(f0[0], head[0], u) + Math.sin(u * Math.PI) * s * k * .34, py = lerp(f0[1], head[1], u); star(c, px, py, k * (.05 + .03 * (1 - u)), C.lemon, u); }
  flutterAt(c, x, y, k, { yaw, flip, E: thrilled(o.look), beta: o.beta, tongue: o.tongue, ant: 1, legsUp: STOMP, detail: 1, extra: tasteGlow(1) });
  // vạch "bung" quanh vòi
  for (let i = 0; i < 5; i++) { const a = o.lineA + i * .32, r0 = k * .5, r1 = k * .68; capsule(c, head[0] + Math.cos(a) * r0, head[1] + k * .12 + Math.sin(a) * r0, head[0] + Math.cos(a) * r1, head[1] + k * .12 + Math.sin(a) * r1, k * .035, C.cream); }
  // sao lấp lánh nhỏ ở các bàn chân
  feet.forEach(([fx, fy], i) => star(c, fx + (i % 2 ? 1 : -1) * k * .12, fy - k * (.16 + .06 * (i % 3)), k * .045, C.cream, i));
}

const title = (c, s, x, y, px, fill, sh, o = {}) => popText(c, s, x, y, px, fill, sh, -1, -1, { sh: px * .075, ...o });

/* ================= 9:16 · 1080×1920 =================
   Góc thấp, Flutter ở giữa khung và chiếm gần nửa chiều cao; miếng dưa là sân khấu; câu móc ở trên cùng.
   Nội dung chính nằm trong y 180–1500 (chừa vùng chữ và nút của Shorts). */
export function poster(c) {
  const W = 1080, H = 1920, FX = 540, FY = 1390, K = 480;
  ground(c, C.sky);
  rays(c, FX, FY - 330, C.skyL, .1, 14, 3600);
  cloud(c, 140, 640, 110); cloud(c, 970, 700, 90);
  ell(c, 200, 1300, 700, 150, 0, C.leafD); ell(c, 980, 1320, 600, 130, 0, C.leaf);
  gingham(c, -10, 1300, W + 10, H + 10, 100);
  watermelon(c, FX, FY, 640);
  flutterStomp(c, FX, FY, K, { yaw: .4, beta: 1.0, look: [.05, .62], lineA: -.55, drops: [[-.62, -.3, .05], [-.86, -.12, .034], [-.42, -.5, .03], [.62, -.28, .048], [.86, -.1, .032], [.44, -.52, .028]] });
  title(c, 'FEET THAT', W / 2, 300, 160, C.lemon, C.night);
  title(c, 'TASTE?!', W / 2, 500, 200, C.berry, C.cream);
}

/* ================= 16:9 · 1920×1080 =================
   Trái: tiêu đề. Phải: Flutter dậm chân trên miếng dưa, quay về phía chữ; Albie nấp sau miếng dưa, lo lắng.
   Góc dưới-phải chỉ có thịt dưa (để trống cho ô thời lượng). */
export function thumb(c) {
  const W = 1920, H = 1080, FX = 1290, FY = 770, K = 290;
  ground(c, C.sky);
  rays(c, FX, FY - 150, C.skyL, .05, 16, 3600);
  cloud(c, 220, 140, 110); sun(c, 1780, 150, 62, .2);
  ell(c, 400, 760, 900, 170, 0, C.leafD); ell(c, 1500, 780, 800, 150, 0, C.leaf);
  gingham(c, -10, 720, W + 10, H + 10, 92);
  albieAt(c, 1650, 905, 190, { yaw: -.35, E: ex(BY.albie, 'worried', { fx: true, look: [-.7, .1] }), tabsUp: .6, fx: true });
  watermelon(c, FX + 10, FY, 640);
  flutterStomp(c, FX, FY, K, { yaw: 1.0, flip: true, look: [-.2, .55], lineA: 2.2, drops: [[-.62, -.32, .055], [-.9, -.12, .036], [-.44, -.55, .03], [.6, -.3, .05], [.85, -.1, .034]] });
  title(c, 'TASTING', 100, 330, 170, C.lemon, C.night, { align: 'left' });
  title(c, 'WITH', 100, 490, 130, C.cream, C.night, { align: 'left' });
  title(c, 'FEET?!', 100, 690, 200, C.berry, C.cream, { align: 'left' });
}
