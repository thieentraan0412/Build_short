// Ảnh bìa LONG-003. Ba bản, cùng một concept "Chạy trên viên tròn dưới Dải Ngân Hà" (khoảnh khắc móc của phim, cảnh 1):
//   thumb    · thumbnail YouTube 16:9 (1920×1080): chữ móc LOST AT NIGHT! (tựa đầy đủ nằm ngay cạnh, trong tiêu đề video)
//   poster   · poster dọc 9:16 (1080×1920): tựa đầy đủ + dải "A STARRY RESCUE ADVENTURE" + tên kênh
//   poster16 · poster.jpg 16:9: cùng cảnh với thumbnail, tựa đầy đủ thay cho chữ móc
// Vườn đêm rực dưới Dải Ngân Hà; Miss Loupe đứng chạy trên đỉnh viên tròn của Rollo, Crumb chạy theo vẫy tay. Mọi mặt đều vui.
// Khác ảnh bìa LONG-001 (tuyết, Albie đóng băng), LONG-002 (kính lúp bắt quả tang Spindle) và ảnh bìa các Short (một bí mật đơn):
// đây là ảnh bìa đầu tiên có trời sao và Rollo. Không phụ đề, không chữ kêu gọi.
import { LOOK } from '/_shared/characters/look.js';
LOOK.v = 2; LOOK.cheer = true;
import { C, rrect, popText, subFont, star } from './lib16.js';
import { hookScene } from './scenes.js';

const T = 2.15;                                                    // Miss Loupe đang chạy trên viên tròn, Crumb chạy bên cạnh vẫy tay xin cầm kính
const title = (c, s, x, y, px, fill, sh) => popText(c, s, x, y, px, fill, sh, -1, 0, { read: false, sh: px * .08 });
function ribbon(c, str, x, y, px, rot = -.04) {                    // dải chữ phụ (khối phẳng, bóng lệch), hai ngôi sao hai đầu
  c.save(); c.font = subFont(px); const w = c.measureText(str).width + px * 2.6, h = px * 1.5;
  c.translate(x, y); c.rotate(rot);
  rrect(c, -w / 2 + 8, -h / 2 + 10, w, h, h / 2, 'rgba(30,27,58,.3)'); rrect(c, -w / 2, -h / 2, w, h, h / 2, C.berry);
  c.fillStyle = C.cream; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(str, 0, px * .06);
  star(c, -w / 2 + h * .55, 0, h * .26, C.lemon); star(c, w / 2 - h * .55, 0, h * .26, C.lemon);
  c.restore();
}
// cảnh móc (không chữ), phóng to quanh điểm (fx, fy) của khung 1920×1080 và đặt điểm đó vào (x, y) của ảnh bìa
function backdrop(c, w, h, x, y, z, fx, fy) {
  c.save(); c.beginPath(); c.rect(0, 0, w, h); c.clip();
  c.translate(x, y); c.scale(z, z); c.translate(-fx, -fy); hookScene(c, T, { noTitle: true }); c.restore();
}

/* ================= THUMBNAIL YOUTUBE 16:9 ================= */
const scene16 = c => backdrop(c, 1920, 1080, 1180, 640, 1.25, 900, 600);
export function thumb(c) {
  scene16(c);
  title(c, 'LOST', 440, 220, 240, C.lemon, C.berry);
  title(c, 'AT NIGHT!', 490, 430, 132, C.cream, C.grape);
}
export function poster16(c) {
  scene16(c);
  title(c, 'LOST AT NIGHT!', 520, 150, 104, C.lemon, C.berry);
  title(c, 'HOW DO BUGS', 480, 275, 88, C.cream, C.grape);
  title(c, 'FIND THEIR', 480, 380, 88, C.cream, C.grape);
  title(c, 'WAY HOME?', 480, 495, 100, C.pink, C.berryD);
  ribbon(c, 'A STARRY RESCUE ADVENTURE', 470, 610, 32);
}

/* ================= POSTER DỌC 9:16 ================= */
export function poster(c) {
  backdrop(c, 1080, 1920, 540, 1330, 1.5, 1000, 600);
  title(c, 'LOST', 540, 200, 230, C.lemon, C.berry);
  title(c, 'AT NIGHT!', 540, 400, 160, C.cream, C.grape);
  title(c, 'HOW DO BUGS FIND', 540, 560, 84, C.cream, C.grape);
  title(c, 'THEIR WAY HOME?', 540, 670, 90, C.pink, C.berryD);
  ribbon(c, 'A STARRY RESCUE ADVENTURE', 540, 790, 40);
  c.font = subFont(50); c.fillStyle = C.cream; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('BIG SECRETS OF TINY BUGS', 540, 1870);
}
