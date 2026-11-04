// Các trang của bộ Character Design System. Mỗi trang vẽ ở toạ độ logic (thường 1920×1080), xuất ×2.
// clean = bản không chữ cho AI tạo video; bố cục giữ nguyên để hai bản khớp nhau.
import { C } from '../kit.js';
import { Rig } from './rig.js';
import { drawChar, silhouette, VIEW, resolveExpr } from './stage.js';
import { EXPR10, EXPR_VI } from './face.js';
import { CAST, BY } from './cast/index.js';
import { POSES, POSE_KEYS, POSE_LABEL } from './poses.js';
import { BIBLE } from './bible.js';
import { lensFrame, circ } from './props.js';
const TAU = Math.PI * 2;
export const PAGE = C.cream, PANEL = '#EFE9DD', PANEL2 = '#E4DCCB', GUIDE = '#D6CAB2', NIGHT_PANEL = '#2A2650';

// ---------- chữ và khung ----------
export function label(c, s, x, y, px = 24, col = C.ink, align = 'left', w = 800) { c.font = `${w} ${px}px "Baloo 2"`; c.fillStyle = col; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
export function title(c, s, x, y, px = 46, col = C.ink) { c.font = `${px}px "Paytone One"`; c.fillStyle = col; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); return c.measureText(s).width; }
export function panel(c, x, y, w, h, col = PANEL, r = 18) { c.fillStyle = col; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); }
export function wrapText(c, s, maxW, px, w = 600) { c.font = `${w} ${px}px "Baloo 2"`; const out = []; let line = ''; for (const word of s.split(' ')) { const t = line ? line + ' ' + word : word; if (c.measureText(t).width > maxW && line) { out.push(line); line = word; } else line = t; } if (line) out.push(line); return out; }
export function header(c, o, name, kind, num) {
  c.fillStyle = PAGE; c.fillRect(0, 0, o.W || 1920, o.H || 1080);
  if (o.clean) return;
  const w = title(c, name, 34, 66, 48, C.ink);
  label(c, kind, 34 + w + 22, 52, 26, C.berry, 'left');
  label(c, `Big Secrets of Tiny Bugs · Character Design System v1 · ${num}`, (o.W || 1920) - 34, 52, 20, '#8C826F', 'right', 700);
}
const ground = (c, x, y, w) => { c.fillStyle = 'rgba(30,27,58,.1)'; c.beginPath(); c.ellipse(x, y, w, w * .12, 0, 0, TAU); c.fill(); };

// ---------- khung nhìn từng nhân vật ----------
export const CELL_SCALE = { chirp: .82, rollo: .6, dot: .85, waggle: .92, flutter: .95, spindle: .95 };
export const TURN_W = { loupe: 2.3, albie: 1.9, crumb: 1.9, flutter: 2.7, chirp: 3.4, waggle: 2.7, blink: 2.0, dot: 1.9, spindle: 3.0, rollo: 2.4, telly: 2.8, giant: 3.6, smudge: 1.6 };
export const BUST = {
  loupe: { c: [0, -1.55, 0], r: 1.4, yaw: .35 }, albie: { c: [0, -1.15, 0], r: 1.35, yaw: .3 }, crumb: { c: [0, -1.55, .1], r: 1.0, yaw: .4 },
  flutter: { c: [0, -.88, .5], r: .64, yaw: .5 }, chirp: { c: [0, -1.12, .95], r: .72, yaw: .7 }, waggle: { c: [0, -1.6, .55], r: .92, yaw: .5 },
  blink: { c: [0, -1.0, .5], r: .85, yaw: .45 }, dot: { c: [0, -.68, .45], r: .72, yaw: .55 }, spindle: { c: [0, -.9, .45], r: .9, yaw: .12 },
  rollo: { c: [0, -.72, .55], r: .78, yaw: .5 }, telly: { c: [0, -1.8, 0], r: 1.6, yaw: .35 }, giant: { c: [0, -2.8, 0], r: 2.3, yaw: 0 }, smudge: { c: [0, -.62, 0], r: .78, yaw: 0 },
};
export const GUIDES = {
  loupe: [-3.75, -2.73, -1.31, 0], albie: [-2.25, -2.0, -1.35, 0], crumb: [-3.0, -2.32, -1.58, -.72, 0], flutter: [-2.35, -.72, 0], chirp: [-1.7, -1.06, 0],
  waggle: [-2.6, -1.54, -1.12, -.42], blink: [-1.95, -.86, 0], dot: [-1.12, -.5, 0], spindle: [-1.6, -.8, 0], rollo: [-1.2, -.66, 0], telly: [-4.25, -3.38, -1.62, 0], giant: [-5.0, -2.95, -2.2], smudge: [-1.32, -.62, .08],
};
// tư thế trung tính cho bảng xoay 4 góc (ẩn đạo cụ để thấy rõ cấu trúc)
export const SIL_POSE = { loupe: { glass: null }, blink: { glow: 0 }, smudge: { glass: false }, rollo: { showBall: true, ball: [-1.25, -.72, -.75] } };
export const NEUTRAL = { rollo: { showBall: false }, crumb: {}, blink: { glow: .7 } };
export const SIG_EXPR = {
  loupe: [['laugh', 'Cười lăn', 'Laughing'], ['crosseyed', 'Lác mắt (bọ đậu lên kính)', 'Cross-eyed']],
  albie: [[{ eye: { lidTop: .42, lidTilt: -.35 }, mouth: 'shout', fx: 'burst' }, '"BZZT! Not a bug!"', 'Reject'], [{ eye: { closed: 'sad' }, mouth: 'shout', fx: 'tears', pose: { wet: 1 } }, 'Khóc ướt trang', 'Crying']],
  crumb: [[{ eye: { scale: 1.1 }, mouth: 'shout', q: 1, fx: 'burst' }, '"But WHY?"', 'Asking'], ['strain', 'Gắng vác', 'Straining']],
  flutter: [[{ eye: { closed: 'happy' }, mouth: 'grin', pose: { tongue: 1 } }, 'Nếm "Mmm!"', 'Tasting'], ['laugh', 'Cười khúc khích', 'Giggle']],
  chirp: [['shy', 'Rụt rè', 'Shy'], [{ eye: { closed: 'squeeze' }, mouth: 'flat', fx: 'sweat', pose: { frontL: [-.18, -1.05, 1.42], frontR: [.18, -1.05, 1.42], earGlow: 1 } }, 'Ồn quá! (bịt đầu gối)', 'Too loud']],
  waggle: [[{ eye: { closed: 'happy' }, mouth: 'grin', fx: 'sparkle', pose: { wag: .45 } }, 'Đang nhảy', 'Dancing'], [{ eye: { look: [.6, -.5] }, eyeL: { look: [-.6, .5] }, mouth: 'wavy', pose: { wag: .3 } }, 'Chóng mặt', 'Dizzy']],
  blink: [[{ eye: { lidTop: .32, look: [-.6, -.1] }, mouth: 'flat', fx: 'blush', pose: { glow: 2.2 } }, '"I\'m not glowing!"', 'Denial'], [{ eye: { closed: 'happy' }, mouth: 'grin', pose: { glow: 1.3 } }, 'Cười khúc khích', 'Giggle']],
  dot: [[{ eye: { lidBot: .2 }, mouth: 'talk', pose: { legsUp: [0, 0, 0, [.42, -1.05, .85], 0, 0] } }, '"One, two, three..."', 'Counting'], ['annoyed', 'Phát cáu', 'Annoyed']],
  spindle: [['hopeful', '"Is it my turn yet?"', 'Hopeful'], [{ eye: { closed: 'sad' }, mouth: 'shout', fx: 'tears' }, 'Kịch tính', 'Drama']],
  rollo: [['wink', 'Nháy mắt', 'Wink'], [{ eye: { lidTop: .55, look: [.4, -.4] }, mouth: 'smile', fx: 'dots' }, 'Nhớ "hồi xưa"', 'Reminiscing']],
  telly: [['laugh', 'Cười vang', 'Big laugh'], ['shout', 'Gọi to', 'Calling out']],
  giant: [['happy', 'Vẫy chào', 'Wave', { gesture: 'wave', rot: [0, .2, .2] }], ['soft', 'Nhẹ tay', 'Gentle', { gesture: 'soft', rot: [1.0, .2, 0] }]],
  smudge: [['wink', 'Ranh mãnh', 'Sneaky'], [{ eye: { closed: 'sad' }, mouth: 'frown', pose: { streak: 1, fade: .5 } }, 'Bị lau', 'Wiped']],
};
const RIG0 = new Rig(0);
function project(CH, p, yaw) { const r = new Rig(yaw); return [r.X(p), p[1]]; }

// vẽ nhân vật vừa ô (đứng trên mặt đất của ô)
export function fitK(CH, w, h, s = 1) { return Math.min(h / CH.h, w / (TURN_W[CH.id] || CH.w)) * s; }
export function charCell(c, cell, CH, P = {}, o = {}) {
  const { x, y, w, h } = cell, lab = o.labelH ?? 0;
  if (!o.noPanel) panel(c, x, y, w, h, P.panel || o.panelCol || PANEL);
  c.save(); c.beginPath(); c.roundRect(x, y, w, h, 18); c.clip();
  if (P.lens) { lensCell(c, { x, y, w, h: h - lab }, CH, P); c.restore(); return; }
  let k = fitK(CH, w * .8, (h - lab) * .76, (P.scale || 1) * (CELL_SCALE[CH.id] || 1)), gx0 = 0;
  const tw = TURN_W[CH.id] || CH.w;
  if (P.ghosts) {
    const xs = P.ghosts.map(q => q.dx || 0), ys = P.ghosts.map(q => q.dy || 0);
    k *= Math.min(1, w * .92 / ((Math.max(...xs) - Math.min(...xs) + 1) * k * tw), (h - lab) * .86 / ((Math.max(...ys) - Math.min(...ys) + 1) * k * CH.h));
    gx0 = -(Math.max(...xs) + Math.min(...xs)) / 2;
  }
  const u = k * CH.h, uw = k * tw;
  const g = { cx: x + w / 2 + (P.dx || 0) * u + gx0 * uw, gy: y + (h - lab) * .86 + (P.dy || 0) * u, k, u, uw };
  if (CH.kind !== 'flat' && CH.kind !== 'giant' && !P.noShadow) ground(c, g.cx, g.gy, Math.min(w * .32, k * (TURN_W[CH.id] || CH.w) * .42));
  if (P.back) P.back(c, g);
  const one = (q, a = 1) => drawChar(c, CH, { x: g.cx + (q.dx || 0) * uw, y: g.gy + (q.dy || 0) * u, k, yaw: q.yaw ?? P.yaw ?? .4, expr: q.expr || P.expr || 'happy', pose: { ...(P.pose || {}), ...(q.pose || {}) }, lean: q.lean ?? P.lean ?? 0, hop: q.hop ?? P.hop ?? 0, alpha: a, detail: P.detail, props: P.props });
  if (P.ghosts) P.ghosts.forEach(q => one({ ...q, dx: (q.dx || 0) + (P.dx || 0) * 0 }, q.alpha ?? 1));
  else one({});
  if (P.front) P.front(c, g);
  c.restore();
}
// ô "qua kính lúp": nhân vật phóng to trong vòng kính của Miss Loupe
export function lensCell(c, cell, CH, P) {
  const R = Math.min(cell.w, cell.h) * .4, cx = cell.x + cell.w / 2 - R * .08, cy = cell.y + cell.h / 2 - R * .04;
  c.save(); c.beginPath(); c.arc(cx, cy, R * .86, 0, TAU); c.clip();
  c.fillStyle = P.night ? C.night : (CH.id === 'smudge' ? '#DFF9FF' : C.mintL); c.fillRect(cx - R, cy - R, R * 2, R * 2);
  if (P.fingerprint) {
    circ(c, cx, cy + R * .1, R * .8, C.skin); c.strokeStyle = C.skinD; c.lineWidth = R * .035; c.lineCap = 'round';
    for (let i = 1; i <= 9; i++) { c.beginPath(); c.ellipse(cx, cy + R * .2, R * .08 * i, R * .066 * i, 0, Math.PI * 1.02, Math.PI * 2.05); c.stroke(); }
  } else {
    const yaw = P.yaw ?? .4, zp = P.zoomOn || BUST[CH.id].c, k = (R * .78) / (BUST[CH.id].r * .9), pr = project(CH, zp, yaw);
    const dx = P.rim ? R * .55 : 0;
    drawChar(c, CH, { x: cx - pr[0] * k + dx, y: cy - pr[1] * k, k, yaw, expr: P.expr || 'happy', pose: P.pose || {}, detail: P.detail ?? 1, showFx: false });
  }
  c.restore();
  lensFrame(c, cx, cy, R);
}
// ô biểu cảm: phóng vào phần đầu
export function exprCell(c, cell, CH, expr, o = {}) {
  const { x, y, w, h } = cell, lab = o.labelH ?? 0, B = BUST[CH.id];
  panel(c, x, y, w, h, o.panelCol || PANEL);
  c.save(); c.beginPath(); c.roundRect(x, y, w, h - lab, lab ? [18, 18, 0, 0] : 18); c.clip();
  const yaw = o.yaw ?? B.yaw, k = Math.min(w, h - lab) * .5 / B.r, pr = project(CH, B.c, yaw);
  const ex = typeof expr === 'object' ? { ...expr } : expr, pose = { ...(o.pose || {}), ...((typeof expr === 'object' && expr.pose) || {}) };
  drawChar(c, CH, { x: x + w / 2 - pr[0] * k, y: y + (h - lab) * .52 - pr[1] * k, k, yaw, expr: ex, pose, exprPose: typeof expr === 'string' });
  c.restore();
}
// bóng đen đặt vừa ô
export function silCell(c, x, y, w, h, CH, yaw, col = C.ink, pose = {}) {
  const k = fitK(CH, w, h);
  const k2 = CH.id === 'rollo' ? k * .62 : k;
  c.save(); c.beginPath(); c.rect(x - 30, y - 40, w + 60, h + 40); c.clip();
  silhouette(c, CH, { x: x + w / 2 + (CH.id === 'rollo' ? w * .12 : 0), y: y + h, k: k2, yaw, pose: { ...(NEUTRAL[CH.id] || {}), ...(SIL_POSE[CH.id] || {}), ...pose }, expr: 'happy', exprPose: false }, col);
  c.restore();
}

// ---------- trang 1: Design Sheet ----------
function designSheet(c, o, CH, n) {
  const B = BIBLE[CH.id];
  header(c, o, CH.name, 'Character Design Sheet · ' + B.vi, `${n}-1`);
  const V4 = [['front', 'Chính diện', 'Front'], ['q', 'Ba phần tư', '3/4'], ['side', 'Nghiêng', 'Side'], ['back', 'Phía sau', 'Back']];
  const tx = 30, ty = 100, th = 560, gap = 8, PW = 1232;
  panel(c, tx, ty, PW, th, PANEL);
  // nhân vật dài và thấp: xếp 2×2 để hình to hơn; còn lại xếp 4 ô ngang. Mọi góc dùng chung một tỷ lệ.
  const wide = (TURN_W[CH.id] || CH.w) / CH.h > 1.2, cols = wide ? 2 : 4, rows = wide ? 2 : 1;
  const cw = (PW - gap * (cols - 1)) / cols, rh = th / rows;
  const k = fitK(CH, cw * .86, (rh - (wide ? 40 : 0)) * .78);
  V4.forEach(([v, vi, en], i) => {
    const col = i % cols, row = Math.floor(i / cols), cx = tx + cw * col + gap * col + cw / 2, gy = ty + rh * (row + 1) - (wide ? 46 : 64);
    if (col === 0) {   // đường chuẩn tỷ lệ chạy qua cả hàng
      c.save(); c.strokeStyle = GUIDE; c.lineWidth = 2; c.setLineDash([10, 8]);
      (GUIDES[CH.id] || []).forEach(yy => { c.beginPath(); c.moveTo(tx + 12, gy + yy * k); c.lineTo(tx + PW - 12, gy + yy * k); c.stroke(); });
      c.restore();
    }
    if (CH.kind !== 'flat' && CH.kind !== 'giant') ground(c, cx, gy, cw * .34);
    drawChar(c, CH, { x: cx, y: gy, k, yaw: VIEW[v], pose: { ...(NEUTRAL[CH.id] || {}) }, expr: 'happy' });
    if (!o.clean) label(c, `${vi} · ${en}`, cx, gy + (wide ? 24 : 38), wide ? 21 : 24, C.ink, 'center');
  });
  if (!o.clean) label(c, `Cao ${Math.round(CH.h * 100) / 100} đơn vị · bằng ${Math.round(CH.realH * 100)}% chiều cao Miss Loupe (thang truyện)`, tx + 14, ty + 22, 19, '#8C826F', 'left', 700);
  // cột phải: bảng màu + bóng đen
  const rx = 1290, rw = 600;
  panel(c, rx, ty, rw, 330, PANEL);
  if (!o.clean) label(c, 'Bảng màu · Palette', rx + 20, ty + 26, 24, C.berry);
  B.pal.forEach(([tok, hex, use], i) => {
    const yy = ty + 56 + i * 44;
    c.fillStyle = hex; c.beginPath(); c.roundRect(rx + 20, yy, i === 0 ? 120 : 84, 32, 9); c.fill();
    if (hex.startsWith('rgba')) { c.strokeStyle = GUIDE; c.lineWidth = 2; c.stroke(); }
    if (!o.clean) { label(c, tok, rx + 152, yy + 7, 19, C.ink, 'left'); label(c, hex.startsWith('#') ? hex : 'trong suốt', rx + 152, yy + 27, 15, '#8C826F', 'left', 700); wrapText(c, use, 250, 16, 600).slice(0, 2).forEach((l, j, a) => label(c, l, rx + 330, yy + 16 + (j - (a.length - 1) / 2) * 18, 16, '#6E6555', 'left', 600)); }
  });
  panel(c, rx, ty + 342, rw, 218, PANEL);
  if (!o.clean) label(c, 'Bóng đen & cỡ nhỏ · Silhouette', rx + 20, ty + 366, 24, C.berry);
  silCell(c, rx + 20, ty + 392, 250, 150, CH, VIEW.q);
  [[110, 340], [64, 470], [32, 545]].forEach(([s, xx]) => { const k2 = s / CH.h; drawChar(c, CH, { x: rx + xx, y: ty + 528, k: Math.min(k2, s * 1.4 / (TURN_W[CH.id] || CH.w)), yaw: VIEW.q, pose: NEUTRAL[CH.id] || {}, showFx: false }); if (!o.clean) label(c, `${s}px`, rx + xx, ty + 546, 15, '#8C826F', 'center', 700); });
  // hàng dưới: so kích thước, dưới kính, đặc điểm khóa
  const by = 680, bh = 380;
  panel(c, 30, by, 440, bh, PANEL);
  if (!o.clean) label(c, 'So với Miss Loupe · Size', 50, by + 26, 24, C.berry);
  sizeVsLoupe(c, 30, by + 40, 440, bh - 40, CH);
  charCell(c, { x: 490, y: by, w: 400, h: bh }, CH, POSES[CH.id].observe, {});
  if (!o.clean) label(c, 'Dưới kính lúp · Under the lens', 510, by + 26, 24, C.berry);
  panel(c, 910, by, 980, bh, PANEL);
  if (!o.clean) {
    label(c, 'Đặc điểm khóa — không được thay đổi', 930, by + 26, 24, C.berry);
    let yy = by + 62;
    B.locked.forEach((s, i) => { circ(c, 946, yy, 13, C.berry); label(c, String(i + 1), 946, yy + 1, 16, C.cream, 'center'); const ls = wrapText(c, s, 900, 19, 600); ls.forEach((l, j) => label(c, l, 970, yy + j * 24, 19, C.ink, 'left', 600)); yy += ls.length * 24 + 10; });
    const d = wrapText(c, 'Phân biệt: ' + B.distinct, 940, 18, 700); d.forEach((l, j) => label(c, l, 930, Math.min(by + bh - 70, yy + 4) + j * 22, 18, '#6E6555', 'left', 700));
    const m = wrapText(c, 'Di chuyển: ' + B.move, 940, 18, 700); m.forEach((l, j) => label(c, l, 930, by + bh - 24 - (m.length - 1 - j) * 22, 18, '#6E6555', 'left', 700));
  } else {
    // bản không chữ: thêm ba biểu cảm then chốt
    ['happy', 'surprised', 'explaining'].forEach((e, i) => exprCell(c, { x: 920 + i * 323, y: by + 10, w: 313, h: bh - 20 }, CH, e, { panelCol: PANEL2 }));
  }
}
// so kích thước theo thang truyện: Miss Loupe nhạt phía sau; nhân vật quá nhỏ có thêm ô phóng to
function sizeVsLoupe(c, x, y, w, h, CH) {
  const gy = y + h - 30, Lh = h * .8;
  const kRef = (Lh / Math.max(1, CH.realH)) / BY.loupe.h;          // px trên 1 đơn vị của Miss Loupe
  const refH = kRef * BY.loupe.h, chH = refH * CH.realH;
  silhouette(c, BY.loupe, { x: x + w * .3, y: gy, k: kRef, yaw: .3, pose: { glass: null } }, PANEL2);
  if (CH.id === 'loupe') { drawChar(c, CH, { x: x + w * .3, y: gy, k: kRef, yaw: .3 }); return; }
  const kc = chH / CH.h, cx = x + w * .62;
  if (CH.id === 'giant') {   // bàn chân trẻ em: dài gần bằng chiều cao Miss Loupe
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    const kf = refH * 1.0 / 3.4; drawChar(c, CH, { x: x + w * .72, y: gy, k: kf, yaw: Math.PI / 2, pose: { part: 'foot' } }); c.restore(); return;
  }
  drawChar(c, CH, { x: cx, y: gy, k: kc, yaw: .45, pose: CH.id === 'rollo' ? SIL_POSE.rollo : (NEUTRAL[CH.id] || {}), showFx: false });
  if (chH < 70) {    // ô phóng to
    const R = 70, lx = x + w - R - 26, ly = y + R + 14;
    c.save(); c.strokeStyle = C.berry; c.lineWidth = 3; c.setLineDash([6, 6]); c.beginPath(); c.moveTo(cx, gy - chH * .6); c.lineTo(lx - R * .6, ly + R * .6); c.stroke(); c.restore();
    c.save(); c.beginPath(); c.arc(lx, ly, R * .86, 0, TAU); c.clip(); c.fillStyle = C.mintL; c.fillRect(lx - R, ly - R, 2 * R, 2 * R);
    const kz = R * 1.3 / Math.max(CH.h, (TURN_W[CH.id] || CH.w) * .8); drawChar(c, CH, { x: lx, y: ly + R * .55, k: kz, yaw: .45, pose: NEUTRAL[CH.id] || {}, showFx: false }); c.restore();
    lensFrame(c, lx, ly, R, false);
  }
}

// ---------- trang 2: Expression Sheet ----------
function exprSheet(c, o, CH, n) {
  const B = BIBLE[CH.id];
  header(c, o, CH.name, CH.noFace ? 'Expression Sheet · biểu cảm bằng cử chỉ (không bao giờ thấy mặt)' : 'Expression Sheet · 10 biểu cảm chuẩn + 2 biểu cảm riêng', `${n}-2`);
  const cols = 6, cw = 300, ch = 470, gx = 12, x0 = 30, y0 = 100;
  const items = EXPR10.map(e => [e, EXPR_VI[e], e[0].toUpperCase() + e.slice(1)]).concat(SIG_EXPR[CH.id].map(s => [s[0], s[1], s[2], s[3]]));
  items.forEach(([e, vi, en, pose], i) => {
    const cx = x0 + (i % cols) * (cw + gx), cy = y0 + Math.floor(i / cols) * (ch + 12);
    exprCell(c, { x: cx, y: cy, w: cw, h: ch }, CH, e, { labelH: 64, pose: pose || {}, panelCol: i >= 10 ? PANEL2 : PANEL });
    if (!o.clean) { label(c, en, cx + cw / 2, cy + ch - 44, 24, i >= 10 ? C.berry : C.ink, 'center'); label(c, vi.length > 26 ? vi : vi[0].toUpperCase() + vi.slice(1), cx + cw / 2, cy + ch - 18, 18, '#6E6555', 'center', 700); }
  });
}

// ---------- trang 3: Pose & Action Sheet ----------
function poseSheet(c, o, CH, n) {
  header(c, o, CH.name, 'Pose & Action Sheet · tư thế tái sử dụng', `${n}-3`);
  const cols = 4, cw = 457, ch = 312, x0 = 30, y0 = 100;
  POSE_KEYS.forEach((key, i) => {
    const P = POSES[CH.id][key] || POSES[CH.id].stand, x = x0 + (i % cols) * (cw + 10), y = y0 + Math.floor(i / cols) * (ch + 10);
    charCell(c, { x, y, w: cw, h: ch }, CH, P, { labelH: 40, panelCol: key === 'move' ? PANEL2 : PANEL });
    if (!o.clean) { const [vi, en] = POSE_LABEL[key]; label(c, `${String(i + 1).padStart(2, '0')}  ${vi} · ${en}`, x + 18, y + ch - 22, 21, key === 'move' ? C.berry : C.ink, 'left'); }
  });
}

// ---------- trang 4: Expression & Pose Atlas (tham chiếu cho AI) ----------
function atlasSheet(c, o, CH, n) {
  c.fillStyle = PAGE; c.fillRect(0, 0, 1920, 1080);
  if (!o.clean) { title(c, CH.name, 30, 46, 34); label(c, 'Expression & Pose Atlas', 30 + c.measureText(CH.name).width + 18, 34, 22, C.berry); }
  const top = o.clean ? 20 : 60;
  // hàng 1: 4 góc + 2 biểu cảm riêng + dưới kính
  const k = fitK(CH, 230, 300), gy = top + 340;
  panel(c, 20, top, 1010, 380, PANEL);
  ['front', 'q', 'side', 'back'].forEach((v, i) => { const cx = 20 + 126 + i * 252; if (CH.kind !== 'flat' && CH.kind !== 'giant') ground(c, cx, gy, 90); drawChar(c, CH, { x: cx, y: gy, k, yaw: VIEW[v], pose: NEUTRAL[CH.id] || {} }); });
  SIG_EXPR[CH.id].forEach((s, i) => exprCell(c, { x: 1040 + i * 296, y: top, w: 286, h: 380 }, CH, s[0], { pose: s[3] || {}, panelCol: PANEL2 }));
  charCell(c, { x: 1632, y: top, w: 268, h: 380 }, CH, POSES[CH.id].observe);
  // hàng 2: 10 biểu cảm
  const ey = top + 392, ew = 186;
  EXPR10.forEach((e, i) => exprCell(c, { x: 20 + i * (ew + 2), y: ey, w: ew, h: 300 }, CH, e, {}));
  // hàng 3: 11 tư thế
  const py = ey + 312, pw = 169, ph = 1080 - py - 18;
  POSE_KEYS.slice(0, 11).forEach((key, i) => charCell(c, { x: 20 + i * (pw + 2), y: py, w: pw, h: ph }, CH, POSES[CH.id][key], { panelCol: PANEL }));
}

// ---------- danh sách trang ----------
export const SHEETS = [];
CAST.forEach((CH, i) => {
  const n = String(i + 1).padStart(2, '0'), slug = `${n}-${CH.id}`;
  SHEETS.push({ id: `${slug}-1-design`, file: `${slug}-1-design-sheet`, w: 1920, h: 1080, draw: (c, o) => designSheet(c, o, CH, n) });
  SHEETS.push({ id: `${slug}-2-expressions`, file: `${slug}-2-expression-sheet`, w: 1920, h: 1080, draw: (c, o) => exprSheet(c, o, CH, n) });
  SHEETS.push({ id: `${slug}-3-poses`, file: `${slug}-3-pose-action-sheet`, w: 1920, h: 1080, draw: (c, o) => poseSheet(c, o, CH, n) });
  SHEETS.push({ id: `${slug}-4-atlas`, file: `${slug}-4-expression-pose-atlas`, w: 1920, h: 1080, draw: (c, o) => atlasSheet(c, o, CH, n) });
});
export function drawSheet(c, s, o) { s.draw(c, { ...o, W: s.w, H: s.h }); }
