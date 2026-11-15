// Các bảng của phong cách v2 "Kẹo Phẳng Viền" (11/2026): 00 quy chuẩn hình ảnh v2, 22 năm gương mặt thương hiệu (23 so sánh v1 / v2 nằm ở ensemble.js, cạnh cảnh vườn).
import { C } from '../kit.js';
import { Rig } from './rig.js';
import { drawChar } from './stage.js';
import { eye, mouth, cheek, fx, EXPR, EXPR5, EXPR_VI, eyeOpts } from './face.js';
import { LOOK, PASS, devStroke, mix, shadeOf, lightOf } from './look.js';
import { X } from './parts.js';
import { CAST, BY } from './cast/index.js';
import { BIBLE } from './bible.js';
import { lensFrame, circ } from './props.js';
import { PAGE, PANEL, PANEL2, GUIDE, label, title, panel, wrapText, header, exprCell } from './sheets.js';
const TAU = Math.PI * 2;
const GREY = '#8C826F', SOFT = '#6E6555';
export const EXPR_EN = { happy: 'Happy', surprised: 'Surprised', curious: 'Curious', excited: 'Excited', silly: 'Silly' };

// đặt độ dày viền cho các hình vẽ ngoài drawChar (mắt, miệng mẫu): T tính theo px logic của trang
function withLine(T, fn) {
  const s = { ...PASS }, Td = T * (LOOK.norm || 1), W = Td * .6;
  Object.assign(PASS, { T: Td, W, Lo: Td - W / 2, sil: false }); fn(); Object.assign(PASS, s);
}
const ringOut = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); devStroke(c, PASS.W); };
// một khối mẫu dựng bằng Rig thật (cùng đổ bóng và viền như nhân vật), toạ độ = px của trang
function demo(c, T, build) { const r = new Rig(0, { unit: 300 }); build(r); withLine(T, () => r.draw(c)); }

// ---------- 00 Master Art Style Sheet (v2) ----------
export function styleSheet2(c, o) {
  header(c, o, 'Master Art Style Sheet', 'Kẹo Phẳng Viền (v2) · quy chuẩn hình ảnh chung của cả series', '00');
  const sec = (x, y, w, h, t) => { panel(c, x, y, w, h); if (!o.clean) label(c, t, x + 20, y + 26, 23, C.berry); };
  const note = (s, x, y, w, px = 17, col = SOFT) => wrapText(c, s, w, px, 700).forEach((l, i) => label(c, l, x, y + i * (px + 5), px, col, 'left', 700));
  // 1. khối bo tròn + viền
  sec(30, 100, 620, 300, '1 · Khối bo tròn · viền mực đồng nhất');
  demo(c, 7, r => {
    r.ball([110, 225, 0], 50, C.berry);
    r.cap([205, 258, 0], [265, 193, 0], 54, C.mango);
    r.flat(0, cc => { cc.fillStyle = C.leaf; cc.beginPath(); cc.roundRect(322, 178, 96, 96, 26); cc.fill(); }, { line: 'first' });
    r.ell([505, 228, 0], [58, 36, 30], C.sky, { rot: [[Math.cos(-.3), -Math.sin(-.3), 0], [Math.sin(-.3), Math.cos(-.3), 0], [0, 0, 1]] });
    r.flat(0, cc => { cc.fillStyle = C.grape; cc.beginPath(); cc.moveTo(560, 276); cc.quadraticCurveTo(592, 284, 624, 276); cc.quadraticCurveTo(606, 222, 592, 186); cc.quadraticCurveTo(578, 222, 560, 276); cc.fill(); }, { line: 'first' });
  });
  if (!o.clean) {
    ['tròn', 'viên nang', 'chữ nhật bo', 'elip', 'giọt'].forEach((s, i) => label(c, s, [110, 235, 370, 505, 592][i], 312, 18, SOFT, 'center', 700));
    note('Viền ngoài ≈ 1,7× nét trong, cùng màu mực #1E1B3A cho cả dàn. Mỗi bộ phận (tay, chân, râu, cánh, mắt, mí, lông mày, miệng) là một khối riêng có nét riêng: dễ rig, không vỡ hình khi chuyển động.', 50, 340, 580, 16);
  }
  // 2. đổ bóng cel mềm
  sec(670, 100, 560, 300, '2 · Đổ bóng cel mềm (soft cel), ánh sáng trên-trái');
  // trước: một mảng tối phẳng (v1)
  { const x = 760, y = 228, rr = 58; c.save(); c.beginPath(); c.arc(x, y, rr, 0, TAU); c.clip(); c.fillStyle = X.tangD; c.fill(); c.fillStyle = C.tang; c.beginPath(); c.arc(x - rr * .16, y - rr * .16, rr, 0, TAU); c.fill(); c.restore(); }
  c.strokeStyle = GUIDE; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(840, 228); c.lineTo(880, 228); c.moveTo(866, 214); c.lineTo(880, 228); c.lineTo(866, 242); c.stroke();
  demo(c, 7, r => r.ball([975, 228, 0], 70, C.tang, { shade: { col: X.tangD, k: .26 } }));
  if (!o.clean) {
    label(c, 'v1: một mảng tối', 760, 312, 16, SOFT, 'center', 700); label(c, 'v2: 4 tông', 975, 316, 16, C.ink, 'center', 800);
    [['tông gốc', 1072, 168, C.tang], ['bán tối', 1072, 200, mix(C.tang, X.tangD, .5)], ['tối (mép khuất)', 1072, 232, X.tangD], ['vành sáng', 1072, 264, lightOf(C.tang)]].forEach(([s, x, y, col]) => { c.fillStyle = col; c.beginPath(); c.roundRect(x, y - 11, 26, 22, 6); c.fill(); label(c, s, x + 34, y, 16, C.ink, 'left', 700); });
    note('Mảng bóng có mép gọn (không gradient mượt, không texture, không chất liệu 3D); sắc tối pha về tím than chứ không pha đen.', 690, 352, 520);
  }
  // 3. bảng màu
  sec(1250, 100, 640, 300, '3 · Bảng màu series (bảng C của kit.js)');
  const toks = ['berry', 'berryD', 'mango', 'tang', 'pink', 'grape', 'night', 'leaf', 'leafD', 'lime', 'limeD', 'mint', 'sky', 'lemon', 'honey', 'honeyD', 'cream', 'ink', 'skin', 'skinD'];
  toks.forEach((t, i) => { const x = 1270 + (i % 5) * 122, y = 145 + Math.floor(i / 5) * 62; c.fillStyle = C[t]; c.beginPath(); c.roundRect(x, y, 46, 40, 10); c.fill(); if (t === 'cream') { c.strokeStyle = GUIDE; c.lineWidth = 2; c.stroke(); } if (!o.clean) { label(c, t, x + 54, y + 12, 16, C.ink, 'left', 800); label(c, C[t], x + 54, y + 30, 13, GREY, 'left', 700); } });
  // 4. khuôn mặt
  sec(30, 420, 900, 330, '4 · Khuôn mặt v2 — mắt long lanh, lông mày, miệng');
  withLine(4.5, () => {
    c.save(); c.translate(116, 580); c.scale(42, 42); circ(c, 0, 0, 1.75, C.berry); c.restore(); ringOut(c, 116, 580, 73.5);
    c.save(); c.translate(116, 580); c.scale(42, 42); eye(c, { lid: C.berry, look: [.15, .1], brow: { lift: .1, arch: .3 } }); c.restore();
  });
  if (!o.clean) ['lông mày (theo cảm xúc)', 'tròng trắng + viền', 'mống mắt theo màu thân', 'con ngươi mực', '2 điểm sáng', 'bóng mí trên nhãn cầu'].forEach((s, i) => label(c, s, 200, 486 + i * 26, 15, i === 0 ? C.berry : SOFT, 'left', i === 0 ? 800 : 700));
  const eyes = [['happy', {}], ['surprised', EXPR.surprised], ['curious', EXPR.curious], ['worried', EXPR.worried], ['sad', EXPR.sad], ['confident', EXPR.confident], ['excited', EXPR.excited], ['laugh', EXPR.laugh]];
  withLine(3, () => eyes.forEach(([k, E], i) => {
    const x = 456 + (i % 4) * 118, y = 500 + Math.floor(i / 4) * 102, EE = { ...EXPR[k], ...E };
    circ(c, x, y, 38, C.berry); ringOut(c, x, y, 38);
    for (const sd of [-1, 1]) { c.save(); c.translate(x + sd * 16, y + 3); c.scale(12.5, 12.5); eye(c, eyeOpts(EE, sd, { lid: C.berry })); c.restore(); }
    if (!o.clean) label(c, EXPR_VI[k] || 'cười lớn', x, y + 48, 13, SOFT, 'center', 700);
  }));
  withLine(2.8, () => ['smile', 'tiny', 'o', 'talk', 'grin', 'shout', 'tongue', 'frown', 'wavy', 'zig', 'smirk', 'side'].forEach((m, i) => {
    const x = 64 + i * 72, y = 712; circ(c, x, y, 27, C.lemon); ringOut(c, x, y, 27); c.save(); c.translate(x, y + 2); c.scale(15, 15); mouth(c, m); c.restore();
  }));
  // 5. ký hiệu cảm xúc
  sec(950, 420, 940, 330, '5 · Ký hiệu cảm xúc phẳng có viền (không dùng chữ)');
  withLine(3.4, () => ['burst', 'q', 'qq', 'sweat', 'tear', 'sparkle', 'shine', 'idea', 'dots', 'blush'].forEach((k, i) => { const x = 1040 + (i % 5) * 180, y = 545 + Math.floor(i / 5) * 140; circ(c, x, y, 34, C.mint); ringOut(c, x, y, 34); c.save(); fx(c, k, x, y, 40, {}); c.restore(); if (!o.clean) label(c, k, x, y + 62, 16, SOFT, 'center', 700); }));
  // 6. sinh học
  sec(30, 770, 900, 290, '6 · Đúng sinh học — kênh dạy điều này nên hình không được sai');
  drawChar(c, BY.crumb, { x: 190, y: 1005, h: 190, yaw: Math.PI / 2, pose: { carry: null }, showFx: false });
  drawChar(c, BY.spindle, { x: 520, y: 1005, h: 120, yaw: Math.PI / 2 - .2, showFx: false });
  drawChar(c, BY.dot, { x: 800, y: 1005, h: 90, yaw: 2.4 });
  if (!o.clean) { label(c, 'Côn trùng: 3 phần thân · 6 chân', 190, 1038, 18, C.ink, 'center'); label(c, 'Nhện: 2 phần thân · 8 chân · 8 mắt', 520, 1038, 18, C.ink, 'center'); label(c, 'Bọ rùa: đúng 7 chấm', 800, 1038, 18, C.ink, 'center'); }
  // 7. thủ pháp kính
  sec(950, 770, 940, 290, '7 · Thủ pháp kính lúp: chi tiết bí mật chỉ hiện TRONG kính');
  drawChar(c, BY.chirp, { x: 1130, y: 1030, h: 70, yaw: 1.2 });
  c.save(); c.beginPath(); c.arc(1400, 920, 95 * .86, 0, TAU); c.clip(); c.fillStyle = C.night; c.fillRect(1300, 820, 200, 200);
  { const kz = 240, ax = .42 * Math.cos(1.2) + 1.0 * Math.sin(1.2); drawChar(c, BY.chirp, { x: 1400 - ax * kz, y: 920 + .3 * kz, k: kz, yaw: 1.2, detail: 1, pose: { earGlow: 1 }, showFx: false }); } c.restore();
  lensFrame(c, 1400, 920, 95, false);
  c.save(); c.strokeStyle = C.berry; c.lineWidth = 4; c.setLineDash([8, 8]); c.beginPath(); c.moveTo(1170, 1015); c.lineTo(1318, 960); c.stroke(); c.restore();
  if (!o.clean) note('Ngoài kính: hình thường. Trong kính: phóng to thật cảnh đang có + chi tiết riêng (tai dế ở chân, điểm nếm ở chân bướm, 3 mắt đơn của ong).', 1570, 830, 300);
}

// ---------- 22 Brand Expression Sheet: 5 gương mặt thương hiệu ----------
export function brandSheet(c, o) {
  c.fillStyle = PAGE; c.fillRect(0, 0, o.W, o.H);
  const top = o.clean ? 20 : 96;
  if (!o.clean) { title(c, 'Big Secrets of Tiny Bugs — 5 Brand Expressions', 30, 62, 42); label(c, 'Vui vẻ · Ngạc nhiên · Tò mò · Phấn khích · Buồn cười — cùng một ngữ pháp mặt cho cả dàn (v2)', o.W - 30, 50, 19, GREY, 'right', 700); }
  const rows = 7, cw = (o.W - 70) / 2, ch = (o.H - top - 20 - (rows - 1) * 10) / rows, nameH = o.clean ? 0 : 34, gap = 8;
  CAST.forEach((CH, i) => {
    const col = i < 7 ? 0 : 1, row = i < 7 ? i : i - 7, x = 30 + col * (cw + 10), y = top + row * (ch + 10);
    panel(c, x, y, cw, ch, PANEL2);
    if (!o.clean) label(c, CH.name, x + 16, y + 20, 19, C.ink, 'left');
    const ew = (cw - 16 - gap * 4) / 5, eh = ch - nameH - 8;
    EXPR5.forEach((e, j) => exprCell(c, { x: x + 8 + j * (ew + gap), y: y + nameH, w: ew, h: eh }, CH, e, { labelH: o.clean ? 0 : 26, panelCol: PANEL }));
    if (!o.clean) EXPR5.forEach((e, j) => label(c, `${EXPR_EN[e]} · ${EXPR_VI[e]}`, x + 8 + j * (ew + gap) + ew / 2, y + nameH + eh - 13, 14, SOFT, 'center', 700));
  });
  const x = 30 + cw + 10, y = top + 6 * (ch + 10);
  panel(c, x, y, cw, ch, PANEL);
  if (!o.clean) {
    label(c, 'Gương mặt thương hiệu', x + 20, y + 26, 20, C.berry);
    wrapText(c, 'Mắt to tròng trắng, mống mắt theo màu thân, hai điểm sáng; lông mày nổi kể cảm xúc; miệng nét thon, miệng mở có răng trên và lưỡi. Viền mực đồng nhất, bóng cel mềm. Mỗi nhân vật giữ nguyên màu, dáng và đặc điểm khoá của mình.', cw - 40, 16, 700).forEach((l, m) => label(c, l, x + 20, y + 56 + m * 21, 16, C.ink, 'left', 700));
  } else {
    ['berry', 'grape', 'honey', 'night', 'tang', 'lime', 'lemon', 'mint', 'pink', 'ink', 'leaf', 'skin'].forEach((t, j) => { c.fillStyle = C[t]; c.beginPath(); c.roundRect(x + 20 + (j % 6) * (cw - 40) / 6, y + 20 + Math.floor(j / 6) * (ch / 2 - 10), (cw - 40) / 6 - 10, ch / 2 - 30, 12); c.fill(); });
  }
}
