// Bộ vẽ của Khối Kẹo Phẳng: chỉ tô phẳng, không viền, không gradient.
import { TAU, clamp, lerp, seg, back, eo } from '/core/lib.js';

export const C = {
  mango: '#FFC32B', mangoL: '#FFD35F', tang: '#FF7A2F', berry: '#E8336D', berryD: '#B71F52', pink: '#FF9CC2',
  grape: '#5A33D6', night: '#3B1F9E', nightL: '#4B2BB8', leaf: '#22B866', leafD: '#169150', lime: '#B7F04A', limeD: '#86C72C',
  sky: '#3CC8FF', skyL: '#7EDCFF', mint: '#7BF0D0', mintL: '#A9F7E2', lemon: '#FFE34D', honey: '#E8871E', honeyL: '#F2A33A', honeyD: '#B85C12',
  cream: '#FFF8E7', ink: '#1E1B3A', white: '#FFFFFF', skin: '#FFC9A3', skinD: '#F2A77C',
};
export const FONT = { big: '"Paytone One"', sub: '800 __px "Baloo 2"' };

export const circle = (c, x, y, r, f) => { c.fillStyle = f; c.beginPath(); c.arc(x, y, Math.max(0, r), 0, TAU); c.fill(); };
export const ell = (c, x, y, rx, ry, rot, f) => { c.fillStyle = f; c.beginPath(); c.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), rot, 0, TAU); c.fill(); };
export function capsule(c, x0, y0, x1, y1, w, f) { c.strokeStyle = f; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
export function path(c, pts, w, f) { c.strokeStyle = f; c.lineWidth = w; c.lineCap = c.lineJoin = 'round'; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); }
export function rrect(c, x, y, w, h, r, f) { c.fillStyle = f; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); }
export function poly(c, pts, f) { c.fillStyle = f; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); }
export const ground = (c, f) => { c.fillStyle = f; c.fillRect(-2000, -2000, 5080, 5920); };

// hình sao nhiều cánh phẳng để làm nền nắng
export function rays(c, x, y, f, rot, n = 12, R = 2400) {
  c.fillStyle = f; c.beginPath();
  for (let i = 0; i < n; i++) { const a = rot + i * TAU / n, b = a + TAU / n / 2; c.moveTo(x, y); c.lineTo(x + Math.cos(a) * R, y + Math.sin(a) * R); c.lineTo(x + Math.cos(b) * R, y + Math.sin(b) * R); c.closePath(); }
  c.fill();
}
// lưới tổ ong phẳng
export function hexes(c, s, f, x0 = -200, y0 = -200, x1 = 1280, y1 = 2120, gap = .9) {
  const w = s * 1.732, h = s * 1.5; c.fillStyle = f; c.beginPath();
  for (let j = Math.floor(y0 / h); j * h < y1; j++) for (let i = Math.floor(x0 / w) - 1; i * w < x1; i++) {
    const cx = i * w + (j & 1 ? w / 2 : 0), cy = j * h;
    for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * TAU / 6, px = cx + Math.cos(a) * s * gap, py = cy + Math.sin(a) * s * gap; k ? c.lineTo(px, py) : c.moveTo(px, py); }
    c.closePath();
  }
  c.fill();
}

const seger = new Intl.Segmenter('vi', { granularity: 'grapheme' });
export const glyphs = s => [...seger.segment(s.normalize('NFC'))].map(g => g.segment);
export const bigFont = px => `${px}px ${FONT.big}`;
export const subFont = px => `800 ${px}px "Baloo 2"`;

// Ghi lại chữ đang hiện để window.TEXTS báo cho readcheck.mjs. mute > 0 khi vẽ bản sao trong kính lúp (không phải chữ mới).
export const REC = { on: false, mute: 0, list: [] };
function record(c, id, text, x0, y0, x1, y1) {
  if (!REC.on || REC.mute) return;
  const m = c.getTransform(), ps = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([x, y]) => m.transformPoint({ x, y }));
  REC.list.push({ id, text, x0: Math.min(...ps.map(p => p.x)), y0: Math.min(...ps.map(p => p.y)), x1: Math.max(...ps.map(p => p.x)), y1: Math.max(...ps.map(p => p.y)) });
}

// chữ lớn: khối phẳng + bóng lệch một màu đậm, mỗi ký tự pop theo thời gian
export function popText(c, str, x, y, px, fill, shadow, t, t0, o = {}) {
  const { step = .035, dur = .26, sh = px * .07, align = 'center', font = bigFont, read = true } = o;
  c.save(); c.font = font(px); c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  const gs = glyphs(str), ws = gs.map(g => c.measureText(g).width), tot = ws.reduce((a, b) => a + b, 0);
  let cx = x - (align === 'center' ? tot / 2 : align === 'right' ? tot : 0);
  if (read && (t < 0 || t > t0)) record(c, str, str, cx, y - px * .78, cx + tot, y + px * .22);
  gs.forEach((g, i) => {
    const p = t < 0 ? 1 : back(seg(t, t0 + i * step, t0 + i * step + dur), 2.4);
    if (p > .001) {
      const mx = cx + ws[i] / 2, my = y - px * .34;
      c.save(); c.translate(mx, my); c.scale(p, p); c.translate(-mx, -my);
      if (shadow) { c.fillStyle = shadow; c.fillText(g, cx + sh * .55, y + sh); }
      c.fillStyle = fill; c.fillText(g, cx, y); c.restore();
    }
    cx += ws[i];
  });
  c.restore();
  return tot;
}

// ngắt dòng cho phụ đề
export function wrap(c, str, maxW) {
  const out = []; let line = '';
  for (const w of str.split(' ')) { const nx = line ? line + ' ' + w : w; if (c.measureText(nx).width > maxW && line) { out.push(line); line = w; } else line = nx; }
  if (line) out.push(line); return out;
}
export function subtitle(c, str, a, cx = 510, y = 1545) {
  if (a <= 0) return;
  c.save(); c.font = subFont(56); c.textAlign = 'center'; c.textBaseline = 'middle';
  const ls = wrap(c, str, 800), lh = 66, w = Math.max(...ls.map(l => c.measureText(l).width)) + 72, h = ls.length * lh + 34;
  const s = back(a, 1.6); c.translate(cx, y); c.scale(s, s);
  rrect(c, -w / 2 + 6, -h / 2 + 10, w, h, 30, 'rgba(30,27,58,.28)');
  rrect(c, -w / 2, -h / 2, w, h, 30, C.cream);
  c.fillStyle = C.ink; ls.forEach((l, i) => c.fillText(l, 0, (i - (ls.length - 1) / 2) * lh + 3));
  c.restore();
}
export function sticker(c, str, x, y, fill, ink, p) {
  if (p <= 0) return;
  c.save(); c.font = subFont(46); c.textBaseline = 'middle'; c.textAlign = 'center';
  const w = c.measureText(str).width + 56, s = back(p, 2);
  c.translate(x + w / 2, y); c.rotate(-.05); record(c, 'sticker:' + str, str, -w / 2, -38, w / 2, 38); c.scale(s, s);
  rrect(c, -w / 2 + 6, -38 + 8, w, 76, 24, 'rgba(30,27,58,.28)');
  rrect(c, -w / 2, -38, w, 76, 24, fill);
  c.fillStyle = ink; c.fillText(str, 0, 3); c.restore();
}
// dấu X đỏ
export function nope(c, x, y, r, p) {
  if (p <= 0) return; const s = back(p, 2.6);
  c.save(); c.translate(x, y); c.rotate(-.1); c.scale(s, s);
  circle(c, 0, 0, r, C.berry); capsule(c, -r * .42, -r * .42, r * .42, r * .42, r * .24, C.cream); capsule(c, r * .42, -r * .42, -r * .42, r * .42, r * .24, C.cream);
  c.restore();
}
// vòng lan toả (âm thanh, vị)
export function rings(c, x, y, r0, r1, n, phase, f, w = 12, a0 = 0, a1 = TAU) {
  c.strokeStyle = f; c.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const p = (phase + i / n) % 1, r = lerp(r0, r1, p), k = 1 - p;
    if (k <= .02) continue;
    c.lineWidth = w * k; c.beginPath(); c.arc(x, y, r, a0, a1); c.stroke();
  }
}
export { clamp, lerp, seg, back, eo, TAU };
