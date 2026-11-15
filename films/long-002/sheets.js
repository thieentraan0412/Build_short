// Bảng hình của LONG-002, vẽ bằng đúng code của phim (rig dùng chung, LOOK.v = 2 và LOOK.cheer bật trong film.js):
// ?mode=model — đạo cụ và dáng mới của tập (Spindle cải trang, Flutter lúc là sâu, sticker tơ, cánh giấy, ô manh mối, LEG-O-METER);
// ?mode=board — 12 khung storyboard (BOARD trong timeline.js), mỗi khung ghi số cảnh, khung hình, độ dài và lời.
import { C, popText, subFont, rrect, wrap, circle, drawChar, BY, ex, inked, TAU } from './lib16.js';
import { spindleAt, flutterN } from './lib16.js';
import { drawFilm } from './film.js';
import { BOARD } from './timeline.js';
import { silkSticker, paperWingShape, babyFlutter, twigLeaf, silkPad, chrysalis, clueIcon, baitFrame, N } from './props.js';

function label(c, s, x, y, px = 26, f = C.ink, align = 'center') { c.font = subFont(px); c.fillStyle = f; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
const cell = (c, x, y, w, h, col) => rrect(c, x, y, w, h, 28, col);

export function modelSheet(c, W, H) {
  c.setTransform(W / 1920, 0, 0, W / 1920, 0, 0);
  c.fillStyle = C.cream; c.fillRect(0, 0, 1920, 1080);
  label(c, 'LONG-002 · Who Snuck Into the Bug Book? — new looks & props (look v2, always cheerful)', 40, 46, 34, C.ink, 'left');
  // Spindle: thường · cải trang trong hàng nghi phạm (áo sọc ong, râu giấy, giấu 2 chân) · siêu cải trang lúc bẫy (thêm cánh giấy) · treo trên tơ
  const S = [['Spindle · 8 legs, 2 body parts', {}], ['lineup disguise: sweater, paper antennae, 2 legs tucked', { sweater: true, hidden: 1, ant: 1 }], ['super disguise (trap): + paper wings', { sweater: true, hidden: 1, ant: 1, wings: true }], ['paper antennae droop & fall', { sweater: true, ant: 1, droop: .9 }]];
  S.forEach(([s, o], i) => { const x = 40 + i * 330; cell(c, x, 90, 310, 420, i ? C.skyL : C.mintL); spindleAt(c, x + 155, 420, 90, 3, { yaw: -.3, ...o, name: i === 3 ? 'laugh' : 'happy' }); c.font = subFont(20); wrap(c, s, 280).forEach((l, k) => label(c, l, x + 155, 450 + k * 26, 20)); });
  // Flutter lúc còn là sâu
  cell(c, 1370, 90, 510, 420, C.lemon);
  twigLeaf(c, 1610, 170, 200, .8); silkPad(c, 1580, 188, 34, 1); chrysalis(c, 1580, 192, 120, 2);
  babyFlutter(c, 1560, 430, 220, 1.3, { munch: .5 });
  label(c, 'baby Flutter (caterpillar) · silk pad · chrysalis', 1625, 485, 20);
  // sticker tơ, cánh giấy, mồi bẫy, ô manh mối
  cell(c, 40, 540, 420, 500, '#ECE8FB'); silkSticker(c, 250, 760, 150, 1.2, { glow: .8 }); label(c, 'silk sticker (Spindle\'s self-portrait)', 250, 990, 21);
  cell(c, 480, 540, 420, 500, N.paper); paperWingShape(c, 690, 760, 170, 0); label(c, 'paper wing · scissor zigzag · tape', 690, 990, 21);
  cell(c, 920, 540, 420, 500, C.mintL); baitFrame(c, 1130, 770, 120, 1.0, 1); label(c, 'Crumb\'s trap: the shiny empty spot', 1130, 990, 21);
  cell(c, 1360, 540, 520, 500, C.pink);
  [0, 1, 2].forEach(i => { const x = 1460 + i * 160, y = 720; inked(c, cc => cc.arc(x, y, 64, 0, TAU), C.berry, 6); circle(c, x, y, 52, C.cream); clueIcon(c, i, x, y, 44, 1); });
  label(c, 'clue slots: silk · 8 footprints · paper wing', 1620, 860, 21);
  label(c, 'Spindle: always 8 legs, 8 eyes (2 legs tucked)', 1620, 990, 20);
}

// 12 khung storyboard (16:9), lưới 4 × 3; off = canvas 1920×1080 để vẽ từng khung bằng drawFilm
export function storyboard(c, W, H, off) {
  c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = C.ink; c.fillRect(0, 0, W, H);
  label(c, 'LONG-002 · Who Snuck Into the Bug Book? A Tiny Detective Mystery — storyboard (frames drawn with the film\'s own code)', 30, 44, 30, C.cream, 'left');
  const cols = 4, gap = 24, fw = (W - gap * (cols + 1)) / cols, fh = fw * 9 / 16, cap = 116, top = 84;
  BOARD.forEach((b, i) => {
    const x = gap + (i % cols) * (fw + gap), y = top + Math.floor(i / cols) * (fh + cap + gap);
    const oc = off.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, 1920, 1080); drawFilm(oc, b.t);
    c.drawImage(off, x, y, fw, fh);
    rrect(c, x, y + fh, fw, cap, 0, '#2A2650');
    label(c, `Shot ${b.shot} · ${b.frame} · ${b.dur}`, x + 14, y + fh + 26, 20, C.lemon, 'left');
    label(c, `${fmt(b.t)}`, x + fw - 14, y + fh + 26, 18, '#A9A3D9', 'right');
    c.font = subFont(23); wrap(c, b.line, fw - 28).slice(0, 2).forEach((l, k) => label(c, l, x + 14, y + fh + 62 + k * 30, 23, C.cream, 'left'));
  });
}
const fmt = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
