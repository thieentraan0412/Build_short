// Các bảng tổng hợp cả dàn: Master Art Style, Lineup, Size, Palette, Silhouette, Interaction, Backyard Garden, Locked, Master Reference.
import { C } from '../kit.js';
import { drawChar, silhouette, VIEW } from './stage.js';
import { eye, mouth, cheek, fx, EXPR10 } from './face.js';
import { X } from './parts.js';
import { CAST, BY } from './cast/index.js';
import { POSES } from './poses.js';
import { BIBLE, STYLE_PROMPT } from './bible.js';
import { sun, cloud, flower2, leaf2, sticker2, note2, nopeX, rings2, swirl2, pebble2, heart2, moon2, star2, lensFrame, circ, crumbBit } from './props.js';
import { PAGE, PANEL, PANEL2, GUIDE, label, title, panel, wrapText, header, charCell, exprCell, silCell, fitK, TURN_W, NEUTRAL, SIL_POSE, BUST } from './sheets.js';
const TAU = Math.PI * 2;
const GREY = '#8C826F', SOFT = '#6E6555';

// ---------- 00 Master Art Style Sheet ----------
function styleSheet(c, o) {
  header(c, o, 'Master Art Style Sheet', 'Khối Kẹo Phẳng · quy chuẩn hình ảnh chung của cả series', '00');
  const sec = (x, y, w, h, t) => { panel(c, x, y, w, h); if (!o.clean) label(c, t, x + 20, y + 26, 23, C.berry); };
  // 1. khối hình
  sec(30, 100, 620, 300, '1 · Khối hình — chỉ năm loại, tô phẳng');
  circ(c, 110, 230, 52, C.berry);
  c.strokeStyle = C.mango; c.lineWidth = 56; c.lineCap = 'round'; c.beginPath(); c.moveTo(205, 260); c.lineTo(265, 195); c.stroke();
  panel(c, 320, 180, 100, 100, C.leaf, 26);
  c.fillStyle = C.sky; c.beginPath(); c.ellipse(505, 230, 58, 36, -.3, 0, TAU); c.fill();
  c.fillStyle = C.grape; c.beginPath(); c.moveTo(560, 280); c.lineTo(625, 280); c.lineTo(592, 185); c.closePath(); c.fill();
  if (!o.clean) ['tròn', 'viên nang', 'chữ nhật bo', 'elip', 'đa giác'].forEach((s, i) => label(c, s, [110, 235, 370, 505, 592][i], 312, 18, SOFT, 'center', 700));
  // mảng tối phẳng
  const shadeDemo = (x, y, r, col, dk) => { c.save(); c.beginPath(); c.arc(x, y, r, 0, TAU); c.clip(); c.fillStyle = dk; c.fill(); c.fillStyle = col; c.beginPath(); c.arc(x - r * .16, y - r * .16, r, 0, TAU); c.fill(); c.restore(); };
  if (!o.clean) label(c, 'Chiều sâu = MỘT mảng tối phẳng ở dưới-phải (ánh sáng từ trên-trái)', 50, 368, 18, C.ink, 'left', 700);
  // 2. điều cấm
  sec(670, 100, 560, 300, '2 · Không viền · không gradient · không texture');
  const bad = (x, draw) => { draw(x); c.strokeStyle = C.berry; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 60, 170); c.lineTo(x + 60, 290); c.moveTo(x + 60, 170); c.lineTo(x - 60, 290); c.stroke(); };
  bad(760, x => { circ(c, x, 230, 55, C.tang); c.strokeStyle = C.ink; c.lineWidth = 8; c.beginPath(); c.arc(x, 230, 55, 0, TAU); c.stroke(); });
  bad(950, x => { const g = c.createRadialGradient(x - 20, 210, 5, x, 230, 60); g.addColorStop(0, C.white); g.addColorStop(1, C.tang); circ(c, x, 230, 55, g); });
  bad(1140, x => { circ(c, x, 230, 55, C.tang); for (let i = 0; i < 40; i++) circ(c, x + Math.cos(i * 2.4) * (i * 1.3), 230 + Math.sin(i * 2.4) * (i * 1.3), 3, X.tangD); });
  if (!o.clean) ['viền', 'gradient', 'texture'].forEach((s, i) => label(c, s, 760 + i * 190, 312, 18, SOFT, 'center', 700));
  if (!o.clean) label(c, 'Đúng: khối phẳng, mảng tối phẳng, màu tươi →', 690, 368, 18, C.ink, 'left', 700);
  shadeDemo(1150, 355, 30, C.tang, X.tangD);
  // 3. bảng màu
  sec(1250, 100, 640, 300, '3 · Bảng màu series (bảng C của kit.js)');
  const toks = ['berry', 'berryD', 'mango', 'tang', 'pink', 'grape', 'night', 'leaf', 'leafD', 'lime', 'limeD', 'mint', 'sky', 'lemon', 'honey', 'honeyD', 'cream', 'ink', 'skin', 'skinD'];
  toks.forEach((t, i) => { const x = 1270 + (i % 5) * 122, y = 145 + Math.floor(i / 5) * 62; c.fillStyle = C[t]; c.beginPath(); c.roundRect(x, y, 46, 40, 10); c.fill(); if (t === 'cream') { c.strokeStyle = GUIDE; c.lineWidth = 2; c.stroke(); } if (!o.clean) { label(c, t, x + 54, y + 12, 16, C.ink, 'left', 800); label(c, C[t], x + 54, y + 30, 13, GREY, 'left', 700); } });
  // 4. ngữ pháp khuôn mặt
  sec(30, 420, 900, 330, '4 · Ngữ pháp khuôn mặt — dùng chung cho mọi nhân vật');
  c.save(); c.translate(120, 570); c.scale(52, 52); circ(c, 0, 0, 1.45, C.berry); eye(c, { lid: C.berry }); c.restore();
  if (!o.clean) { label(c, 'tròng trắng', 205, 505, 17, SOFT, 'left', 700); label(c, 'con ngươi mực', 205, 535, 17, SOFT, 'left', 700); label(c, '1 đốm sáng', 205, 565, 17, SOFT, 'left', 700); label(c, 'mí = màu thân', 205, 595, 17, SOFT, 'left', 700); label(c, 'KHÔNG lông mày', 205, 625, 17, C.berry, 'left', 800); }
  const eyes = [{}, { lidTop: .4 }, { lidTop: .3, lidTilt: .42, pupil: .36 }, { lidBot: .25 }, { closed: 'happy' }, { closed: 'sad' }, { closed: 'squeeze' }, { scale: 1.12, pupil: .3 }];
  eyes.forEach((e, i) => { const x = 420 + (i % 4) * 120, y = 510 + Math.floor(i / 4) * 105; circ(c, x, y, 44, C.berry); c.save(); c.translate(x, y); c.scale(30, 30); eye(c, { lid: C.berry, side: 1, ...e }); c.restore(); });
  ['smile', 'tiny', 'o', 'talk', 'grin', 'frown', 'wavy', 'zig', 'smirk', 'side', 'flat', 'shout'].forEach((m, i) => { const x = 70 + i * 72, y = 700; circ(c, x, y, 30, C.lemon); c.save(); c.translate(x, y + 2); c.scale(17, 17); mouth(c, m); c.restore(); });
  // 5. ký hiệu cảm xúc
  sec(950, 420, 940, 330, '5 · Ký hiệu cảm xúc phẳng (không dùng chữ)');
  ['burst', 'q', 'qq', 'sweat', 'tear', 'sparkle', 'shine', 'idea', 'dots', 'blush'].forEach((k, i) => { const x = 1040 + (i % 5) * 180, y = 545 + Math.floor(i / 5) * 140; circ(c, x, y, 34, C.mint); c.save(); fx(c, k, x, y, 40, {}); c.restore(); if (!o.clean) label(c, k, x, y + 62, 16, SOFT, 'center', 700); });
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
  if (!o.clean) { const ls = wrapText(c, 'Ngoài kính: hình thường. Trong kính: phóng to thật cảnh đang có + chi tiết riêng (tai dế ở chân, điểm nếm ở chân bướm, 3 mắt đơn của ong).', 300, 17, 700); ls.forEach((l, i) => label(c, l, 1570, 830 + i * 24, 17, SOFT, 'left', 700)); }
}

// ---------- 14 Lineup ----------
const LINE_H = { loupe: 600, albie: 380, crumb: 320, flutter: 330, chirp: 210, waggle: 290, blink: 230, dot: 165, spindle: 230, rollo: 230, telly: 670, giant: 600, smudge: 240 };
function lineupSheet(c, o) {
  header(c, o, 'Character Lineup', 'Dàn nhân vật định kỳ · thang trình bày (không theo tỷ lệ thật, xem bảng Size)', '14');
  panel(c, 30, 100, o.W - 60, o.H - 130);
  const gy = 900; let x = 60;
  const ws = CAST.map(CH => Math.max(160, LINE_H[CH.id] / CH.h * (TURN_W[CH.id] || CH.w) * (CH.id === 'rollo' ? 1.15 : .92)));
  const scale = (o.W - 120) / ws.reduce((a, b) => a + b, 0), hs = Math.min(1, scale);
  c.fillStyle = PANEL2; c.fillRect(30, gy, o.W - 60, 6);
  CAST.forEach((CH, i) => {
    const w = ws[i] * scale, cx = x + w / 2; x += w;
    const pose = CH.id === 'rollo' ? { ball: [0, -.72, -1.6] } : CH.id === 'giant' ? { gesture: 'wave', rot: [0, .15, .1] } : {};
    if (CH.id === 'giant') { c.save(); c.beginPath(); c.rect(cx - w / 2, 100, w, gy - 100); c.clip(); drawChar(c, CH, { x: cx, y: gy + 40, h: LINE_H.giant * hs, yaw: .2, pose }); c.restore(); }
    else drawChar(c, CH, { x: cx + (CH.id === 'rollo' ? -w * .12 : 0), y: gy, h: LINE_H[CH.id] * hs, yaw: CH.id === 'chirp' ? .9 : CH.id === 'rollo' ? -.95 : CH.id === 'smudge' ? 0 : .42, pose, expr: 'happy' });
    if (!o.clean) { label(c, CH.name, cx, gy + 44, 26, C.ink, 'center'); wrapText(c, BIBLE[CH.id].species, w - 16, 16, 700).forEach((l, j) => label(c, l, cx, gy + 76 + j * 20, 16, SOFT, 'center', 700)); }
  });
}

// ---------- 15 Size Comparison ----------
function sizeSheet(c, o) {
  header(c, o, 'Character Size Comparison', 'Thang truyện: chiều cao tính theo Miss Loupe (= 1)', '15');
  panel(c, 30, 100, o.W - 60, o.H - 130);
  const gy = 940, L = 600, RX = [0, .25, .5, .75, 1, 1.13];
  // thước
  c.save(); c.strokeStyle = GUIDE; c.lineWidth = 2; c.setLineDash([10, 8]);
  RX.forEach(f => { c.beginPath(); c.moveTo(40, gy - f * L); c.lineTo(o.W - 40, gy - f * L); c.stroke(); });
  c.restore();
  c.fillStyle = PANEL2; c.fillRect(30, gy, o.W - 60, 6);
  const put = (CH, x, pose = {}, yaw = .4) => { const k = L * CH.realH / CH.h; drawChar(c, CH, { x, y: gy, k, yaw, pose, showFx: false }); if (!o.clean) { label(c, CH.name, x, gy + 32, 20, C.ink, 'center'); label(c, `${Math.round(CH.realH * 100)}%`, x, gy + 56, 16, SOFT, 'center', 700); } return k; };
  put(BY.telly, 270);
  put(BY.loupe, 540, { smudge: (cc) => drawChar(cc, BY.smudge, { x: .3, y: .2, k: .42, pose: { glass: false }, showFx: false }) });
  put(BY.albie, 780);
  // côn trùng trên mặt đất; năm con nhỏ nhất có ô kính phóng to
  const bugs = ['flutter', 'chirp', 'spindle', 'waggle', 'rollo', 'crumb', 'blink', 'dot'], zoomed = ['waggle', 'rollo', 'crumb', 'blink', 'dot'];
  // xếp theo bề ngang thật của từng con để không chồng lên nhau
  let bx = 950; const BX = {}; bugs.forEach(id => { const CH = BY[id], w = L * CH.realH / CH.h * (TURN_W[id] || CH.w) * (id === 'rollo' ? 1.35 : .82); BX[id] = bx + w / 2; bx += w + 26; });
  bugs.forEach((id, i) => {
    const CH = BY[id], x = BX[id], pose = id === 'rollo' ? { ball: [0, -.72, -1.55] } : {}, yaw = id === 'rollo' ? -.9 : .5;
    const k = L * CH.realH / CH.h; drawChar(c, CH, { x, y: gy, k, yaw, pose, showFx: false });
    if (!o.clean) { label(c, CH.name.replace('Mr. ', ''), x, gy + 32, 17, C.ink, 'center'); label(c, `${Math.round(CH.realH * 100)}%`, x, gy + 54, 15, SOFT, 'center', 700); }
    const zi = zoomed.indexOf(id); if (zi < 0) return;
    const R = 56, lx = x, ly = 330 + (zi % 2) * 130;
    c.save(); c.strokeStyle = C.berry; c.lineWidth = 2.5; c.setLineDash([5, 6]); c.beginPath(); c.moveTo(x, gy - k * CH.h - 6); c.lineTo(lx, ly + R); c.stroke(); c.restore();
    const kz = Math.min(R * 1.25 / CH.h, R * 1.5 / (TURN_W[id] || CH.w)) * (id === 'rollo' ? .7 : 1);
    c.save(); c.beginPath(); c.arc(lx, ly, R * .86, 0, TAU); c.clip(); c.fillStyle = C.mintL; c.fillRect(lx - R, ly - R, 2 * R, 2 * R); drawChar(c, CH, { x: lx, y: ly + R * .58, k: kz, yaw, pose, showFx: false }); c.restore();
    lensFrame(c, lx, ly, R, false);
  });
  if (!o.clean) label(c, 'ô kính = phóng to cùng nhân vật', BX.rollo, 230, 17, C.berry, 'center', 800);
  // The Giant: bàn chân trẻ em, dài gần bằng chiều cao Miss Loupe; chân đi ra khỏi khung
  c.save(); c.beginPath(); c.rect(30, 100, o.W - 60, gy - 100 + 6); c.clip();
  const fx0 = Math.max(bx + 40, o.W - 440);
  drawChar(c, BY.giant, { x: fx0 + 410, y: gy, k: L * 1.0 / 3.4, yaw: -Math.PI / 2 + .1, pose: { part: 'foot' } });
  c.restore();
  if (!o.clean) { label(c, 'The Giant (bàn chân)', fx0 + 200, gy + 32, 20, C.ink, 'center'); label(c, 'dài ≈ 100%', fx0 + 200, gy + 56, 16, SOFT, 'center', 700); }
  // nhãn thước nằm trên cùng để không bị nhân vật che
  if (!o.clean) RX.forEach(f => { const s = f === 1.13 ? '1.13' : String(f); c.font = '700 16px "Baloo 2"'; const w = c.measureText(s).width + 14; panel(c, 40, gy - f * L - 12, w, 24, PAGE, 12); label(c, s, 47, gy - f * L, 16, GREY, 'left', 700); });
  if (!o.clean) { const t = wrapText(c, 'Trong cảnh chung được phép phóng to côn trùng tới khoảng 2,5 lần thang truyện để trẻ nhìn rõ, nhưng luôn giữ thứ tự to–nhỏ: Dot < Blink < Crumb ≈ Rollo < Waggle < Chirp ≈ Spindle < Flutter < Albie < Miss Loupe < Uncle Telly. Smudge chiếm khoảng ¼ mặt kính.', 1040, 18, 700); t.forEach((l, i) => label(c, l, 110, 126 + i * 24, 18, SOFT, 'left', 700)); }
}

// ---------- 16 Color Palette ----------
function paletteSheet(c, o) {
  header(c, o, 'Character Color Palette', 'Mỗi nhân vật một màu chủ đạo, không trùng nhau', '16');
  // dải màu chủ đạo
  panel(c, 30, 100, o.W - 60, 150);
  CAST.forEach((CH, i) => {
    const B = BIBLE[CH.id], hex = B.pal[0][1], x = 70 + i * 140;
    c.fillStyle = hex; c.beginPath(); c.roundRect(x, 130, 110, 60, 16); c.fill();
    if (hex.startsWith('rgba')) { c.fillStyle = '#DFF9FF'; c.beginPath(); c.roundRect(x, 130, 110, 60, 16); c.fill(); c.fillStyle = hex; c.beginPath(); c.roundRect(x, 130, 110, 60, 16); c.fill(); }
    if (!o.clean) { label(c, CH.name.replace('Uncle ', '').replace('Mr. ', '').replace('Miss ', '').replace('The ', ''), x + 55, 208, 17, C.ink, 'center'); label(c, B.pal[0][0], x + 55, 230, 14, SOFT, 'center', 700); }
  });
  // thẻ từng nhân vật
  const cw = 258, ch = 360;
  CAST.forEach((CH, i) => {
    const col = i % 7, row = Math.floor(i / 7), x = 34 + col * (cw + 8) + (row ? cw / 2 + 4 : 0), y = 266 + row * (ch + 10), B = BIBLE[CH.id];
    panel(c, x, y, cw, ch);
    c.save(); c.beginPath(); c.roundRect(x, y, cw, 200, 18); c.clip();
    c.fillStyle = PANEL2; c.fillRect(x, y, cw, 200);
    const P = { ...(POSES[CH.id].stand) }; if (CH.id === 'rollo') P.pose = { ball: [-1.2, -.72, -.8] };
    drawChar(c, CH, { x: x + cw / 2, y: y + 185 + (CH.id === 'giant' ? 50 : 0), k: fitK(CH, cw * .8, 160) * (CH.id === 'rollo' ? .7 : 1), yaw: P.yaw ?? .4, pose: P.pose || {}, showFx: false });
    c.restore();
    B.pal.slice(0, 6).forEach(([tok, hex], j) => {
      const yy = y + 208 + j * 25;
      c.fillStyle = hex.startsWith('rgba') ? '#DFF9FF' : hex; c.beginPath(); c.roundRect(x + 14, yy, j === 0 ? 70 : 44, 22, 6); c.fill();
      if (hex.startsWith('rgba')) { c.fillStyle = hex; c.beginPath(); c.roundRect(x + 14, yy, 44, 22, 6); c.fill(); }
      if (!o.clean) { label(c, tok, x + 94, yy + 11, 15, C.ink, 'left', 800); label(c, hex.startsWith('#') ? hex : 'trong suốt', x + cw - 12, yy + 11, 13, SOFT, 'right', 700); }
    });
    if (!o.clean) label(c, CH.name, x + 14, y + 20, 18, C.ink, 'left');
  });
  if (!o.clean) {
    const notes = ['Ghi chú 1: Flutter dùng tím đậm night (#3B1F9E) cho cánh trước, không dùng grape như pilot, vì kế hoạch đã giao grape (#5A33D6) cho bìa Albie.', 'Ghi chú 2: Chirp (lime #B7F04A) và Uncle Telly (leaf #22B866) cùng họ xanh lá nhưng khác token, khác độ sáng và khác hẳn bóng dáng; Telly gần như không xuất hiện cùng Chirp ở Mùa 1.'];
    label(c, notes[0], 40, 1030, 16, SOFT, 'left', 700); label(c, notes[1], 40, 1056, 16, SOFT, 'left', 700);
  }
}

// ---------- 17 Silhouette Sheet ----------
function silSheet(c, o) {
  header(c, o, 'Character Silhouette Sheet', 'Nhận ra được chỉ qua bóng đen, kể cả khi rất nhỏ', '17');
  const cw = 258, ch = 330;
  CAST.forEach((CH, i) => {
    const col = i % 7, row = Math.floor(i / 7), x = 34 + col * (cw + 8) + (row ? cw / 2 + 4 : 0), y = 100 + row * (ch + 10);
    panel(c, x, y, cw, ch);
    silCell(c, x + 20, y + 30, cw - 40, ch - 90, CH, CH.id === 'smudge' ? 0 : CH.id === 'giant' ? .2 : .45);
    if (!o.clean) { circ(c, x + 26, y + 26, 15, C.berry); label(c, String(i + 1), x + 26, y + 27, 16, C.cream, 'center'); label(c, CH.name, x + cw / 2, y + ch - 30, 20, C.ink, 'center'); }
  });
  // dải cỡ nhỏ
  panel(c, 30, 790, o.W - 60, 260);
  if (!o.clean) { label(c, 'Cỡ 64 px', 50, 820, 20, C.berry); label(c, 'Cỡ 32 px', 50, 960, 20, C.berry); }
  CAST.forEach((CH, i) => {
    const x = 210 + i * 128;
    silCell(c, x - 50, 840, 100, 64, CH, CH.id === 'smudge' ? 0 : .45);
    silCell(c, x - 25, 985, 50, 32, CH, CH.id === 'smudge' ? 0 : .45);
    if (!o.clean) label(c, String(i + 1), x, 935, 15, SOFT, 'center', 800);
  });
}

// ---------- 18 Interaction Sheet ----------
const scene = (c, x, y, w, h, sky, gnd = C.leaf, night = false) => {
  c.fillStyle = sky; c.fillRect(x, y, w, h);
  if (night) { for (let i = 0; i < 14; i++) circ(c, x + ((i * 97) % w), y + 20 + ((i * 53) % (h * .5)), 2.5, C.cream); }
  c.fillStyle = gnd; c.beginPath(); c.ellipse(x + w * .5, y + h * 1.18, w * .9, h * .42, 0, 0, TAU); c.fill();
};
const IA = [
  { t: 'Miss Loupe ↔ Albie', s: '"That\'s not a secret. That\'s a crumb."', sky: C.mintL, draw: (c, x, y, w, h) => { drawChar(c, BY.loupe, { x: x + w * .32, y: y + h * .9, h: h * .72, yaw: .5, expr: 'happy', pose: { handR: [.85, -1.5, .4], elbowR: [.7, -1.1, .2] }, props: (cc, r) => { const p = r.P([.85, -1.6, .4]); crumbBit(cc, p[0], p[1] - .1, .14); } }); drawChar(c, BY.albie, { x: x + w * .74, y: y + h * .9, h: h * .42, yaw: -.4, expr: 'annoyed', pose: { page: [.0, -1.3, 0] } }); } },
  { t: 'Miss Loupe ↔ Crumb', s: '"Can I hold the lens?" — "Not yet!"', sky: C.skyL, draw: (c, x, y, w, h) => { drawChar(c, BY.loupe, { x: x + w * .62, y: y + h * .9, h: h * .72, yaw: -.35, lean: -.08, expr: 'laugh', pose: { lensRoll: .25 } }); drawChar(c, BY.crumb, { x: x + w * .3, y: y + h * .9, h: h * .42, yaw: .6, expr: 'hopeful', pose: { carry: null, armR: [.7, -2.7, .4], armL: [.3, -2.6, .4] } }); } },
  { t: 'Spindle ↔ Albie', s: '"Six legs! See?" — "BZZT! Not a bug!"', sky: C.lemon, draw: (c, x, y, w, h) => { drawChar(c, BY.spindle, { x: x + w * .3, y: y + h * .9, h: h * .3, yaw: .5, expr: 'hopeful', pose: { hidden: 1, wings: true } }); drawChar(c, BY.albie, { x: x + w * .72, y: y + h * .9, h: h * .5, yaw: -.4, expr: { eye: { lidTop: .42, lidTilt: -.35 }, mouth: 'shout', fx: 'burst' } }); nopeX(c, x + w * .5, y + h * .3, 26); } },
  { t: 'Spindle ↔ Crumb', s: 'Bạn thân bất chấp luật lệ: "But WHY can\'t she?"', sky: C.pink, draw: (c, x, y, w, h) => { drawChar(c, BY.spindle, { x: x + w * .62, y: y + h * .9, h: h * .34, yaw: -.4, expr: 'happy' }); drawChar(c, BY.crumb, { x: x + w * .3, y: y + h * .9, h: h * .36, yaw: .5, expr: { eye: { scale: 1.1 }, mouth: 'shout', q: 1 }, pose: { carry: null, armR: [.75, -2.0, .4] } }); heart2(c, x + w * .47, y + h * .28, 16, C.berry); } },
  { t: 'Blink ↔ Chirp', s: 'Night Band: Chirp chơi nhạc, Blink lo đèn', sky: C.night, night: true, draw: (c, x, y, w, h) => { drawChar(c, BY.chirp, { x: x + w * .4, y: y + h * .88, h: h * .3, yaw: 1.0, expr: { eye: { closed: 'happy' }, mouth: 'tiny' }, pose: { chirp: 1 } }); drawChar(c, BY.blink, { x: x + w * .74, y: y + h * .45, h: h * .3, yaw: -.5, expr: 'laugh', pose: { fly: 1, glow: 1.4 } }); note2(c, x + w * .3, y + h * .35, 22, C.lemon); note2(c, x + w * .5, y + h * .25, 18, C.pink); } },
  { t: 'Blink ↔ Miss Loupe', s: 'Đuôi Blink sáng trước khi Miss Loupe kịp đoán', sky: C.nightL, night: true, draw: (c, x, y, w, h) => { drawChar(c, BY.loupe, { x: x + w * .32, y: y + h * .9, h: h * .72, yaw: .4, expr: 'thinking' }); drawChar(c, BY.blink, { x: x + w * .75, y: y + h * .88, h: h * .28, yaw: -.5, expr: { eye: { lidTop: .32, look: [-.6, -.1] }, mouth: 'flat', fx: 'blush' }, pose: { glow: 2.2 } }); } },
  { t: 'Dot ↔ Miss Loupe', s: 'Miss Loupe đếm vội, Dot đếm lại cùng trẻ', sky: C.mintL, draw: (c, x, y, w, h) => { drawChar(c, BY.loupe, { x: x + w * .3, y: y + h * .9, h: h * .72, yaw: .5, expr: 'confused' }); drawChar(c, BY.dot, { x: x + w * .72, y: y + h * .9, h: h * .22, yaw: -.5, expr: 'explaining', pose: { legsUp: [[-.42, -1.05, .85], 0, 0, 0, 0, 0] } }); [0, 1, 2].forEach(i => pebble2(c, x + w * (.55 + i * .1), y + h * .93, 9, '#C9BFAE')); } },
  { t: 'Flutter ↔ Albie', s: 'Flutter nếm góc trang — Albie sợ nhất', sky: C.skyL, draw: (c, x, y, w, h) => { drawChar(c, BY.albie, { x: x + w * .45, y: y + h * .9, h: h * .6, yaw: .3, expr: 'worried', pose: { tilt: -.05 } }); drawChar(c, BY.flutter, { x: x + w * .6, y: y + h * .36, h: h * .26, yaw: -.9, expr: { eye: { closed: 'happy' }, mouth: 'grin' }, pose: { tongue: 1 } }); } },
  { t: 'Waggle ↔ Crumb', s: 'Crumb học điệu nhảy của ong và lần nào cũng ngã', sky: C.honeyL, draw: (c, x, y, w, h) => { drawChar(c, BY.waggle, { x: x + w * .32, y: y + h * .86, h: h * .4, yaw: .7, expr: 'laugh', pose: { wag: .45 } }); drawChar(c, BY.crumb, { x: x + w * .72, y: y + h * .92, h: h * .42, yaw: -.4, lean: .9, expr: { eye: { look: [.6, -.5] }, eyeL: { look: [-.6, .5] }, mouth: 'wavy' }, pose: { carry: null, armL: [-.7, -1.6, .3], armR: [.7, -1.8, .3] } }); swirl2(c, x + w * .74, y + h * .42, 16, C.ink); } },
  { t: 'Mr. Rollo ↔ Uncle Telly', s: 'Bạn cũ cùng ngắm sao', sky: C.night, night: true, draw: (c, x, y, w, h) => { drawChar(c, BY.telly, { x: x + w * .3, y: y + h * .92, h: h * .76, yaw: .5, expr: look2(), pose: { lensPitch: -.55 } }); drawChar(c, BY.rollo, { x: x + w * .7, y: y + h * .9, h: h * .2, yaw: -.6, expr: { eye: { lidTop: .4, look: [-.3, -.6] }, mouth: 'smile' }, pose: { ball: [1.2, -.72, -.4] } }); star2(c, x + w * .62, y + h * .2, 12); star2(c, x + w * .82, y + h * .14, 8); moon2(c, x + w * .86, y + h * .3, 16, C.night); } },
  { t: 'The Giant ↔ cả vườn', s: 'Bóng khổng lồ, nhưng luôn nhẹ tay', sky: C.mintL, draw: (c, x, y, w, h) => { c.fillStyle = 'rgba(30,27,58,.14)'; c.beginPath(); c.ellipse(x + w * .45, y + h * .9, w * .4, h * .08, 0, 0, TAU); c.fill(); c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); drawChar(c, BY.giant, { x: x + w * .86, y: y + h * .82, h: h * 1.0, yaw: .2, pose: { gesture: 'point', rot: [0, -.3, -.95] } }); c.restore(); drawChar(c, BY.loupe, { x: x + w * .22, y: y + h * .9, h: h * .5, yaw: .5, expr: 'surprised' }); drawChar(c, BY.dot, { x: x + w * .42, y: y + h * .9, h: h * .1, yaw: .5, expr: 'surprised' }); } },
  { t: 'Smudge ↔ Miss Loupe', s: 'Vết bẩn làm mờ kính đúng lúc gay cấn', sky: C.lemon, draw: (c, x, y, w, h) => { drawChar(c, BY.loupe, { x: x + w * .5, y: y + h * .92, h: h * .82, yaw: .1, expr: 'crosseyed', pose: { handL: [-.85, -1.3, .1], handR: [.85, -1.3, .1], smudge: cc => drawChar(cc, BY.smudge, { x: .15, y: .5, k: .62, pose: { glass: false }, expr: 'confident', showFx: false }) } }); } },
];
function look2() { return { eye: { look: [.3, -.7] }, mouth: 'smile' }; }
function interactionSheet(c, o) {
  header(c, o, 'Character Interaction Sheet', 'Các cặp quan hệ định kỳ (§2.4 kế hoạch)', '18');
  const cw = 457, ch = 312;
  IA.forEach((v, i) => {
    const x = 30 + (i % 4) * (cw + 10), y = 100 + Math.floor(i / 4) * (ch + 10);
    c.save(); c.beginPath(); c.roundRect(x, y, cw, ch, 18); c.clip();
    scene(c, x, y, cw, ch, v.sky, v.night ? C.leafD : C.leaf, v.night);
    v.draw(c, x, y, cw, ch * .87);
    if (!o.clean) { c.fillStyle = 'rgba(255,248,231,.92)'; c.beginPath(); c.roundRect(x + 10, y + ch - 62, cw - 20, 52, 12); c.fill(); label(c, v.t, x + 22, y + ch - 46, 19, C.berry, 'left'); label(c, v.s, x + 22, y + ch - 23, 16, C.ink, 'left', 700); }
    c.restore();
  });
}

// ---------- 19 Backyard Garden ----------
function hive(c, x, y, s) {
  c.fillStyle = C.honeyD; c.fillRect(x - s * .06, y + s * .5, s * .12, s * 2.2);
  c.fillStyle = C.honey; c.beginPath(); c.roundRect(x - s * .5, y - s * .55, s, s * 1.1, s * .3); c.fill();
  c.fillStyle = C.honeyL; for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) { const hx = x - s * .3 + i * s * .3 + (j % 2) * s * .15 - s * .07, hy = y - s * .38 + j * s * .25; if (hx < x + s * .38) { c.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * TAU / 6; c.lineTo(hx + Math.cos(a) * s * .11, hy + Math.sin(a) * s * .11); } c.fill(); } }
  circ(c, x, y + s * .3, s * .12, X.nightD);
}
function fence(c, x0, x1, y, h) { c.fillStyle = C.cream; c.fillRect(x0, y + h * .3, x1 - x0, h * .12); c.fillRect(x0, y + h * .7, x1 - x0, h * .12); for (let x = x0; x < x1; x += h * .42) { c.beginPath(); c.roundRect(x, y, h * .28, h, [h * .14, h * .14, 0, 0]); c.fill(); } }
function gardenBG(c, W, H, gy) {
  c.fillStyle = C.sky; c.fillRect(0, 0, W, H);
  sun(c, W * .86, H * .15, Math.min(W, H) * .07, .2);
  cloud(c, W * .16, H * .13, Math.min(W, H) * .16); cloud(c, W * .5, H * .09, Math.min(W, H) * .12); cloud(c, W * .66, H * .22, Math.min(W, H) * .1);
  c.fillStyle = C.leafD; c.beginPath(); c.ellipse(W * .25, gy + 30, W * .45, H * .12, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(W * .8, gy + 20, W * .4, H * .1, 0, 0, TAU); c.fill();
  fence(c, -20, W + 20, gy - H * .14, H * .17);
  c.fillStyle = C.leaf; c.fillRect(0, gy, W, H - gy);
  c.fillStyle = X.leafL; for (let i = 0; i < 18; i++) { const x = (i * 211) % W, y = gy + 30 + ((i * 97) % (H - gy - 40)); c.beginPath(); c.ellipse(x, y, 40, 9, 0, 0, TAU); c.fill(); }
}
function gardenSheet(c, o, vertical) {
  const W = o.W, H = o.H, gy = vertical ? 1180 : 640;
  gardenBG(c, W, H, gy);
  const S = vertical ? 1.05 : 1;   // hệ số nhân vật
  const P = vertical ? {
    pond: [250, 1760, 230, 66], flower: [860, 1250, 640], hive: [140, 640], loupe: [540, 1610, 560], albie: [880, 1620, 290], telly: [250, 1420, 540], crumb: [715, 1660, 120], dot: [200, 1755, 80], chirp: [560, 1800, 120],
    spindle: [560, 400], blink: [620, 880], waggle: [340, 540], flutter: [860, 590], rollo: [985, 1205, 60], giant: [1030, 2260, 520],
  } : {
    pond: [470, 975, 270, 66], flower: [1330, 900, 520], hive: [1690, 470], loupe: [860, 980, 500], albie: [1090, 990, 270], telly: [600, 900, 540], crumb: [1250, 1000, 115], dot: [300, 1010, 80], chirp: [420, 930, 115],
    spindle: [200, 420], blink: [1150, 430], waggle: [1560, 560], flutter: [1330, 360], rollo: [150, 655, 52], giant: [1800, 1290, 600],
  };
  // ao
  const [px, py, prx, pry] = P.pond; c.fillStyle = C.sky; c.beginPath(); c.ellipse(px, py, prx, pry, 0, 0, TAU); c.fill(); c.fillStyle = C.skyL; c.beginPath(); c.ellipse(px - prx * .2, py - pry * .2, prx * .55, pry * .4, 0, 0, TAU); c.fill(); leaf2(c, px + prx * .45, py + pry * .1, 46, .3, C.leafD);
  // hoa lớn, tổ ong
  const [fx0, fy0, fh] = P.flower; c.strokeStyle = C.leafD; c.lineWidth = 26; c.lineCap = 'round'; c.beginPath(); c.moveTo(fx0, fy0); c.lineTo(fx0, fy0 - fh); c.stroke(); leaf2(c, fx0 + 70, fy0 - fh * .4, 70, -.5, C.leafD); leaf2(c, fx0 - 70, fy0 - fh * .6, 60, .5, C.leafD);
  flower2(c, fx0, fy0 - fh, 120, C.berry, C.lemon);
  hive(c, P.hive[0], P.hive[1], 150);
  // hoa nhỏ, sỏi
  [[.06, .9, C.tang], [.33, .97, C.grape], [.62, .93, C.mango], [.95, .9, C.pink], [.12, .78, C.mint]].forEach(([a, b, col]) => flower2(c, W * a, H * b, 26, col, C.cream, 40));
  pebble2(c, P.dot[0], P.dot[1] + 6, 60, '#C9BFAE');
  // Rollo trốn sau, chân hàng rào ("Find Rollo!")
  drawChar(c, BY.rollo, { x: P.rollo[0], y: P.rollo[1], h: P.rollo[2], yaw: 1.4, pose: { ball: [0, -.72, 1.6] }, expr: 'wink', showFx: false });
  drawChar(c, BY.telly, { x: P.telly[0], y: P.telly[1], h: P.telly[2] * S, yaw: .45, expr: 'laugh' });
  drawChar(c, BY.chirp, { x: P.chirp[0], y: P.chirp[1], h: P.chirp[2] * S, yaw: .9, expr: 'happy', pose: { chirp: .5 } });
  drawChar(c, BY.dot, { x: P.dot[0], y: P.dot[1] - 30, h: P.dot[2] * S, yaw: .6, expr: 'explaining', pose: { legsUp: [0, 0, 0, [.42, -1.05, .85], 0, 0] } });
  drawChar(c, BY.loupe, { x: P.loupe[0], y: P.loupe[1], h: P.loupe[2] * S, yaw: .35, expr: 'happy', pose: { handR: [.85, -2.05, .1], elbowR: [.72, -1.45, 0], smudge: cc => drawChar(cc, BY.smudge, { x: .42, y: -.05, k: .3, pose: { glass: false }, expr: 'wink', showFx: false }) } });
  drawChar(c, BY.albie, { x: P.albie[0], y: P.albie[1], h: P.albie[2] * S, yaw: -.25, expr: 'happy', pose: { page: [.6, -1.4, -.4] } });
  drawChar(c, BY.crumb, { x: P.crumb[0], y: P.crumb[1], h: P.crumb[2] * S, yaw: -.3, expr: 'happy' });
  drawChar(c, BY.flutter, { x: P.flutter[0], y: P.flutter[1], h: 150 * S, yaw: .6, expr: 'happy', pose: { tongue: .8 } });
  drawChar(c, BY.waggle, { x: P.waggle[0], y: P.waggle[1], h: 130 * S, yaw: -.6, expr: 'happy', pose: { wing: .6 } });
  drawChar(c, BY.blink, { x: P.blink[0], y: P.blink[1], h: 100 * S, yaw: -.4, expr: 'laugh', pose: { fly: 1, glow: 1.2 } });
  // Spindle treo tơ từ trên xuống
  drawChar(c, BY.spindle, { x: P.spindle[0], y: P.spindle[1], h: 120 * S, yaw: .4, expr: 'happy', pose: { thread: true } });
  // The Giant: bàn tay từ mép khung, chỉ nhẹ nhàng, không chạm côn trùng
  drawChar(c, BY.giant, { x: P.giant[0], y: P.giant[1], h: P.giant[2], yaw: .2, lean: vertical ? -.3 : -.35, pose: { gesture: 'wave', rot: [0, .2, .1] } });
}

// ---------- 20 Locked features ----------
const CALL = {
  loupe: [[[0, -3.62, 0], 'Vành kính rỗng, 2 vệt sáng'], [[.3, -1.0, 0], 'Thân viên nang, mảng tối bên phải'], [[0, -1.3, .4], 'Mặt trên thân'], [[0, -1.7, .2], 'Cổ áo, tay, giày xoài'], [[-.6, -.95, 0], 'Tay chân ống mảnh']],
  albie: [[[-.72, -1.0, .2], 'Gáy trái, bìa grape'], [[.3, -1.35, .23], '2 mắt trên bìa'], [[0, -.64, .23], 'Miệng = bìa hé'], [[0, -2.15, 0], '4 mép sticker = tóc'], [[.72, -.05, .2], 'Góc bọc honey']],
  crumb: [[[0, -1.58, .5], 'Đầu to, mặt em bé'], [[.25, -2.35, .3], 'Râu khuỷu, cuộn "?"'], [[0, -.72, -.1], '3 phần thân, eo nhỏ'], [[.5, -.05, -.1], '6 chân'], [[0, -2.75, 0], 'Luôn vác đồ to']],
  flutter: [[[-.4, -1.5, .5], 'Cánh trước tím đậm + đốm'], [[.4, -.8, -.5], 'Cánh sau cam'], [[0, -.5, .7], 'Vòi cam cuộn ốc'], [[.3, -1.3, 1.0], 'Râu đầu tròn xoài'], [[.3, -.05, .4], '6 chân mảnh']],
  chirp: [[[.5, -1.36, -1.0], 'Đùi sau gập cao'], [[.3, -1.6, 0], 'Râu dài vắt ra sau'], [[.42, -.25, 1.05], 'TAI ở chân trước'], [[0, -1.3, -.2], 'Cánh lá trên lưng'], [[.16, -1.06, -1.46], 'Đuôi 2 gai']],
  waggle: [[[0, -1.55, .9], '3 mắt đơn trên đỉnh'], [[0, -1.0, -.6], '2 sọc + chóp có ngòi'], [[.4, -2.1, 0], '4 cánh trong'], [[.4, -.6, .2], '6 chân mực'], [[0, -1.1, .2], 'Ngực xoài: 3 phần thân']],
  blink: [[[0, -.62, -.78], 'Đèn đuôi + quầng sáng'], [[.3, -.9, -.2], 'Áo choàng cánh cứng'], [[0, -1.18, .36], 'Khiên ngực như mũ trùm'], [[.4, -.1, .1], '6 chân mực ngắn']],
  dot: [[[.5, -.85, -.3], 'Đúng 7 chấm'], [[0, -1.05, .2], 'Đường nối cánh'], [[0, -.5, .8], 'Đầu mực, mắt trắng'], [[.35, -.55, .6], 'Ngực mực, 2 mảng trắng'], [[.5, -.05, 0], '6 chân mực']],
  spindle: [[[0, -1.3, -.6], 'Bụng tròn đốm tím'], [[0, -.8, .8], '8 mắt, 2 mắt giữa to'], [[1.1, -1.2, .4], '8 chân, gối vồng cao'], [[0, -.82, .3], '2 phần thân'], [[0, -.4, .8], 'Không nanh, không lông']],
  rollo: [[[-.3, -1.15, -.2], 'Vệt bóng xanh trời'], [[0, -.4, 1.1], 'Đầu xẻng răng cưa'], [[0, -.75, 1.0], 'Mí mắt sụp nhẹ'], [[.55, -.3, .5], 'Chân trước có răng'], [[-1.25, -.72, -.75], 'Viên tròn nâu']],
  telly: [[[.66, -3.38, .6], 'Tròng vàng chanh đặc'], [[0, -3.78, 0], 'Bánh xe chỉnh nét'], [[0, -1.6, .45], 'Mặt trên thân'], [[0, -2.38, .3], 'Cổ áo, tay, giày chanh']],
  giant: [[[0, -4.6, 0], 'Ngón ngắn, đầu tròn'], [[0, -2.0, 0], 'Cổ tay ra khỏi khung'], [[.6, -3.0, .3], 'Không bao giờ thấy mặt']],
  smudge: [[[0, -.62, .02], 'Vân tay 5 vòng'], [[.3, -.75, .02], 'Mắt theo ngữ pháp chung'], [[-.45, -.3, .02], 'Khói trong suốt'], [[0, -.05, .02], 'Chỉ sống trên kính']],
};
function lockedSheet(c, o) {
  header(c, o, 'Locked Features', 'Bảng chi tiết ngoại hình KHÔNG được thay đổi', '20');
  const cw = 457, ch = 360;
  CAST.forEach((CH, i) => {
    const x = 30 + (i % 4) * (cw + 10), y = 100 + Math.floor(i / 4) * (ch + 10);
    panel(c, x, y, cw, ch);
    const wideC = (TURN_W[CH.id] || CH.w) / CH.h > 1.2, k = fitK(CH, wideC ? 225 : 200, 260) * (CH.id === 'rollo' ? .62 : 1), gx = x + (CH.id === 'rollo' ? 150 : 122), gy = y + ch - 40, yaw = CH.id === 'smudge' || CH.id === 'giant' ? 0 : .45;
    const pose = CH.id === 'rollo' ? SIL_POSE.rollo : (NEUTRAL[CH.id] || {});
    c.save(); c.beginPath(); c.roundRect(x, y, cw, ch, 18); c.clip();
    const r = drawChar(c, CH, { x: gx, y: gy + (CH.id === 'giant' ? 30 : 0), k, yaw, pose, showFx: false });
    (CALL[CH.id] || []).forEach(([p], j) => { const sx = gx + r.X(p) * k, sy = gy + (CH.id === 'giant' ? 30 : 0) + p[1] * k; circ(c, sx, sy, 13, C.berry); c.fillStyle = C.cream; label(c, String(j + 1), sx, sy + 1, 15, C.cream, 'center'); });
    c.restore();
    label(c, CH.name, x + 240, y + 30, 22, C.ink, 'left');
    (CALL[CH.id] || []).forEach(([, s], j) => { circ(c, x + 252, y + 70 + j * 46, 12, C.berry); label(c, String(j + 1), x + 252, y + 71 + j * 46, 14, C.cream, 'center'); wrapText(c, s, 180, 16, 700).forEach((l, m) => label(c, l, x + 272, y + 70 + j * 46 + m * 19, 16, C.ink, 'left', 700)); });
  });
  // quy tắc chung
  const x = 30 + 1 * (cw + 10), y = 100 + 3 * (ch + 10), w = cw * 3 + 20;
  panel(c, x, y, w, ch, PANEL2);
  label(c, 'Quy tắc chung cho cả dàn', x + 20, y + 30, 24, C.berry);
  ['Côn trùng: đúng 6 chân, 3 phần thân. Nhện: đúng 8 chân, 2 phần thân, 8 mắt. Bọ rùa Dot: đúng 7 chấm. Ong Waggle: 5 mắt, 4 cánh.', 'Mỗi nhân vật một màu chủ đạo trong bảng C, không trùng nhau; không đổi màu theo cảnh (chỉ đổi màu nền).', 'Không viền, không gradient, không texture; chiều sâu bằng một mảng tối phẳng ở dưới-phải.', 'Mắt: tròng trắng + con ngươi mực + 1 đốm sáng; KHÔNG lông mày; cảm xúc nằm ở mí, con ngươi, miệng.', 'The Giant không bao giờ lộ mặt, không bao giờ bắt/cầm/đè côn trùng. Spindle không nanh, không lông.', 'Không thêm phụ kiện ngoài danh sách (khăn len mùa đông cho Dot, Miss Loupe, Albie; kính tí hon của Crumb từ sau tập 12).']
    .forEach((s, i) => { circ(c, x + 32, y + 72 + i * 46, 6, C.berry); wrapText(c, s, w - 70, 18, 700).forEach((l, m) => label(c, l, x + 50, y + 72 + i * 46 + m * 21, 18, C.ink, 'left', 700)); });
}

// ---------- 21 Master Character Reference Sheet ----------
function masterSheet(c, o) {
  c.fillStyle = PAGE; c.fillRect(0, 0, o.W, o.H);
  const top = o.clean ? 20 : 96;
  if (!o.clean) { title(c, 'Big Secrets of Tiny Bugs — Master Character Reference', 30, 62, 42); label(c, 'Ảnh tham chiếu chính cho AI tạo video · 13 nhân vật · 4 góc + 2 biểu cảm', o.W - 30, 50, 20, GREY, 'right', 700); }
  const rows = 7, cw = (o.W - 70) / 2, ch = (o.H - top - 20 - (rows - 1) * 10) / rows;
  CAST.forEach((CH, i) => {
    const col = i < 7 ? 0 : 1, row = i < 7 ? i : i - 7, x = 30 + col * (cw + 10), y = top + row * (ch + 10);
    panel(c, x, y, cw, ch);
    const vw = (cw - 20) / 6.2, k = fitK(CH, vw * .9, ch * (o.clean ? .78 : .7)) * (CH.id === 'rollo' ? 1 : 1);
    const ro = CH.id === 'rollo';
    ['front', 'q', 'side', 'back'].forEach((v, j) => { const cx = x + 10 + vw * (j + .5) + (ro ? vw * .18 : 0); c.save(); c.beginPath(); c.rect(x + 10 + vw * j, y, vw, ch); c.clip(); drawChar(c, CH, { x: cx, y: y + ch - (o.clean ? 14 : 34), k: ro ? k * .66 : k, yaw: VIEW[v], pose: ro ? SIL_POSE.rollo : (NEUTRAL[CH.id] || {}), showFx: false }); c.restore(); });
    ['happy', 'surprised'].forEach((e, j) => charCell(c, { x: x + 10 + vw * 4 + j * (vw * 1.1 + 4), y: y + 8, w: vw * 1.1, h: ch - 16 }, CH, { yaw: BUST[CH.id].yaw, expr: e, pose: ro ? SIL_POSE.rollo : (NEUTRAL[CH.id] || {}) }, { panelCol: PANEL2 }));
    if (!o.clean) label(c, CH.name, x + 16, y + ch - 14, 18, C.ink, 'left');
  });
  if (CAST.length % 2) { const x = 30 + cw + 10, y = top + 6 * (ch + 10); panel(c, x, y, cw, ch, PANEL2); if (!o.clean) { label(c, 'Phong cách', x + 20, y + 26, 20, C.berry); wrapText(c, 'Hoạt hình 2D phẳng, chỉ khối hình học, không viền, không gradient, không texture; một mảng tối phẳng ở dưới-phải; mắt tròn trắng, con ngươi mực, má hồng, không lông mày.', cw - 40, 16, 700).forEach((l, m) => label(c, l, x + 20, y + 54 + m * 20, 16, C.ink, 'left', 700)); } else { ['berry', 'grape', 'honey', 'night', 'tang', 'lime', 'lemon', 'mint', 'pink', 'ink', 'leaf', 'skin'].forEach((t, j) => { c.fillStyle = C[t]; c.beginPath(); c.roundRect(x + 20 + (j % 6) * (cw - 40) / 6, y + 20 + Math.floor(j / 6) * (ch / 2 - 10), (cw - 40) / 6 - 10, ch / 2 - 30, 12); c.fill(); }); } }
}

export const ENSEMBLE = [
  { id: '00-style', file: '00-master-art-style-sheet', w: 1920, h: 1080, first: true, draw: styleSheet },
  { id: '14-lineup', file: '14-character-lineup', w: 2560, h: 1080, draw: lineupSheet },
  { id: '15-size', file: '15-character-size-comparison', w: 2560, h: 1080, draw: sizeSheet },
  { id: '16-palette', file: '16-character-color-palette', w: 1920, h: 1080, draw: paletteSheet },
  { id: '17-silhouette', file: '17-character-silhouette-sheet', w: 1920, h: 1080, draw: silSheet },
  { id: '18-interaction', file: '18-character-interaction-sheet', w: 1920, h: 1080, draw: interactionSheet },
  { id: '19-garden', file: '19-backyard-garden-group', w: 1920, h: 1080, draw: (c, o) => gardenSheet(c, o, false) },
  { id: '19b-garden-vertical', file: '19b-backyard-garden-group-vertical', w: 1080, h: 1920, draw: (c, o) => gardenSheet(c, o, true) },
  { id: '20-locked', file: '20-locked-features', w: 1920, h: 1580, clean: false, draw: lockedSheet },
  { id: '21-master', file: '21-MASTER-CHARACTER-REFERENCE', w: 1920, h: 1920, draw: masterSheet },
];
