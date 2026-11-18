// Ảnh bìa LONG-002. Ba bản, cùng một concept "Kính lúp bắt quả tang" (khoảnh khắc wow 2 của phim, cảnh 23):
//   thumb    · thumbnail YouTube 16:9 (1920×1080): chữ móc WHO SNUCK IN?! (tựa đầy đủ nằm ngay cạnh, trong tiêu đề video)
//   poster   · poster dọc 9:16 (1080×1920): tựa đầy đủ + dải "A TINY DETECTIVE MYSTERY" + tên kênh
//   poster16 · poster.jpg 16:9: cùng cảnh với thumbnail, tựa đầy đủ thay cho chữ móc
// Bức tường LEG-O-METER mờ tối quanh một vòng kính lớn; trong kính là lưng Spindle trong áo len sọc ong, hai chân giấu đang vẫy, số 7 và 8
// nảy trên hai chân (đếm được). Dot reo đếm, Miss Loupe giơ tay chỉ, Albie bật dậy (mặt vẫn cười).
// Khác ảnh bìa LONG-001 (tuyết, Albie đóng băng) và ảnh bìa các Short (một bí mật đơn): đây là ảnh bìa đầu tiên có Spindle.
// Không phụ đề, không chữ kêu gọi.
import { LOOK } from '/_shared/characters/look.js';
LOOK.v = 2; LOOK.cheer = true;
import { C, rrect, popText, subFont, star, loupeN, albieN, dotAt, ARM, H, TAU } from './lib16.js';
import { lineupWorld, hiddenLegsLens } from './scenes.js';

const T = H.l_lens + 1.6;                                          // trong kính: hai chân giấu đang vẫy, trước lúc bật ra
const title = (c, s, x, y, px, fill, sh) => popText(c, s, x, y, px, fill, sh, -1, 0, { read: false, sh: px * .08 });
function ribbon(c, str, x, y, px, rot = -.04) {                    // dải chữ phụ (khối phẳng, bóng lệch), hai ngôi sao hai đầu
  c.save(); c.font = subFont(px); const w = c.measureText(str).width + px * 2.6, h = px * 1.5;
  c.translate(x, y); c.rotate(rot);
  rrect(c, -w / 2 + 8, -h / 2 + 10, w, h, h / 2, 'rgba(30,27,58,.3)'); rrect(c, -w / 2, -h / 2, w, h, h / 2, C.berry);
  c.fillStyle = C.cream; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(str, 0, px * .06);
  star(c, -w / 2 + h * .55, 0, h * .26, C.lemon); star(c, w / 2 - h * .55, 0, h * .26, C.lemon);
  c.restore();
}
// nền: hàng nghi phạm (không có Spindle), phủ tối quanh vòng kính
function backdrop(c, w, h, cx, cy, R, view) {
  c.save(); c.translate(w / 2, h / 2); c.scale(view.z, view.z); c.translate(-view.cx, -view.cy); lineupWorld(c, H.s_lq + 3, {}); c.restore();
  c.fillStyle = 'rgba(30,27,58,.7)'; c.beginPath(); c.rect(0, 0, w, h); c.arc(cx, cy, R, 0, TAU, true); c.fill('evenodd');
  for (let i = 0; i < 7; i++) { const a = -2.9 + i * .45; star(c, cx + Math.cos(a) * (R + 90), cy + Math.sin(a) * (R + 90), 18 + 10 * (i % 2), C.lemon); }
}

/* ================= THUMBNAIL YOUTUBE 16:9 ================= */
function scene16(c) {
  const cx = 1290, cy = 520, R = 430;
  backdrop(c, 1920, 1080, cx, cy, R, { cx: 960, cy: 520, z: 1.0 });
  hiddenLegsLens(c, T, cx, cy, R, T - 1.2);
  dotAt(c, 300, 1050, 150, T, { name: 'excited', yaw: .5, look: [.7, -.5], legsUp: [[.3, -.9, .5]] });
  loupeN(c, 720, 1050 - 2.73 * 80, 80, T, { name: 'excited', look: [.7, -.3], pose: ARM.point, rot: -.1 });
  albieN(c, 1800, 1140, 150, T, { name: 'surprised', yaw: -.5, look: [-.8, -.3], tabsUp: 1 });
}
export function thumb(c) {
  scene16(c);
  title(c, 'WHO', 380, 250, 200, C.cream, C.grape);
  title(c, 'SNUCK', 410, 450, 200, C.cream, C.grape);
  title(c, 'IN?!', 400, 680, 240, C.lemon, C.berry);
}
export function poster16(c) {
  scene16(c);
  title(c, 'WHO SNUCK', 440, 230, 120, C.cream, C.grape);
  title(c, 'INTO THE', 440, 380, 120, C.lemon, C.berry);
  title(c, 'BUG BOOK?', 440, 550, 130, C.pink, C.berryD);
  ribbon(c, 'A TINY DETECTIVE MYSTERY', 440, 680, 36);
}

/* ================= POSTER DỌC 9:16 ================= */
export function poster(c) {
  const cx = 540, cy = 1130, R = 400;
  backdrop(c, 1080, 1920, cx, cy, R, { cx: 1260, cy: 600, z: 1.5 });
  title(c, 'WHO SNUCK', 540, 210, 132, C.cream, C.grape);
  title(c, 'INTO THE', 540, 360, 132, C.lemon, C.berry);
  title(c, 'BUG BOOK?', 540, 540, 160, C.pink, C.berryD);
  ribbon(c, 'A TINY DETECTIVE MYSTERY', 540, 670, 44);
  hiddenLegsLens(c, T, cx, cy, R, T - 1.2);
  dotAt(c, 190, 1770, 130, T, { name: 'excited', yaw: .5, look: [.7, -.6], legsUp: [[.3, -.9, .5]] });
  albieN(c, 930, 1800, 150, T, { name: 'surprised', yaw: -.5, look: [-.7, -.4], tabsUp: 1 });
  c.font = subFont(50); c.fillStyle = C.cream; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('BIG SECRETS OF TINY BUGS', 540, 1870);
}
