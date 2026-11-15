// Công tắc phong cách nhân vật và các công cụ vẽ viền / đổ bóng của bản v2.
//   LOOK.v = 1  "Khối Kẹo Phẳng" (mặc định): khối phẳng, không viền, một mảng tối. Các tập đã giao dựng lại phải ra y hệt, nên giữ mặc định này.
//   LOOK.v = 2  "Kẹo Phẳng Viền" (11/2026): viền mực đồng nhất (viền ngoài dày hơn nét trong), đổ bóng cel mềm hai tông + vành sáng,
//               mắt có mống mắt và hai điểm sáng, lông mày, miệng có răng lưỡi. Tập mới bật bằng: import { LOOK } ...; LOOK.v = 2;
// Không import gì khác để rig.js, face.js đều dùng được.
export const LOOK = {
  v: 1,
  ink: '#1E1B3A',          // màu viền (mực của bảng C)
  lineK: 1,                // nhân độ dày viền (1 = chuẩn)
  norm: null,              // số px thiết bị cho 1 px logic của khung 1920×1080 (bảng hình đặt = scale); null = tự tính từ cỡ canvas
  cheer: false,            // (11/2026) mặt luôn vui tươi: biểu cảm buồn, lo, cáu, nhăn được đổi sang dạng vui (stage.js cheerExpr). Tập từ SHORT-011 bật
};
// Trạng thái lượt vẽ hiện tại (drawChar đặt và trả lại): T = tổng độ dày viền ngoài, W = nét trong, Lo = phần viền ngoài thò ra ngoài khối (px thiết bị)
export const PASS = { sil: false, T: 0, W: 0, Lo: 0 };
export const v2 = () => LOOK.v >= 2;

// ---- màu ----
const cache = new Map();
export function rgba(col) {
  if (typeof col !== 'string') return [0, 0, 0, 1];
  let v = cache.get(col); if (v) return v;
  let m;
  if ((m = /^#([0-9a-f]{3})$/i.exec(col))) v = [...m[1]].map(h => parseInt(h + h, 16)).concat(1);
  else if ((m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(col))) v = [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16)).concat(m[2] ? parseInt(m[2], 16) / 255 : 1);
  else if ((m = /^rgba?\(([^)]+)\)$/i.exec(col))) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); v = [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
  else v = [0, 0, 0, 1];
  cache.set(col, v); return v;
}
export const alphaOf = s => typeof s === 'string' ? rgba(s)[3] : 1;   // gradient / pattern coi như đặc
const hex = v => '#' + v.slice(0, 3).map(x => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
export function mix(a, b, t) { const A = rgba(a), B = rgba(b); return hex([0, 1, 2].map(i => A[i] + (B[i] - A[i]) * t)); }
export const lum = col => { const [r, g, b] = rgba(col); return (.299 * r + .587 * g + .114 * b) / 255; };
// sắc tối tự động: pha về tím than (bóng lạnh, không pha đen) · sắc sáng: pha trắng ấm
export const shadeOf = col => mix(col, '#2E1C6E', .3);
export const lightOf = col => lum(col) < .2 ? mix(col, '#8C86C8', .45) : mix(col, '#FFFDF4', .38);
// mống mắt tự động theo màu mí (màu thân): đậm, đủ khác con ngươi
export const irisOf = col => lum(col) < .22 ? '#5B46B8' : mix(col, '#1E1B3A', .42);

// ---- nét ----
// tỷ lệ thiết bị / transform hiện tại
export const devScale = c => { const m = c.getTransform(); return Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) || 1; };
// tô viền đường đang có theo bề rộng px thiết bị (đều nhau dù transform bị bóp méo)
export function devStroke(c, w, col = LOOK.ink) {
  if (!(w > 0)) return;
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.strokeStyle = col; c.lineWidth = w; c.lineCap = c.lineJoin = 'round'; c.setLineDash([]); c.stroke(); c.restore();
}
// độ dày viền theo cỡ nhân vật trên khung: lớn lên chậm (mũ 0,3) để nhân vật cạnh nhau có nét gần nhau, nhân vật tí hon vẫn đọc được
export function lineFor(c, hDev) {
  const cv = c.canvas, norm = LOOK.norm || Math.sqrt((cv.width * cv.height) / (1920 * 1080)) || 1;
  const hn = Math.max(24, hDev / norm), T = .95 * Math.pow(hn, .3) * norm * LOOK.lineK, W = T * .6;
  return { T, W, Lo: T - W / 2 };
}

// Bọc context để thêm viền cho các hàm vẽ tự do (mặt phẳng, khối vẽ tay):
//   'sil'   lượt viền ngoài: mỗi lần tô / nét đặc (alpha ≥ .5) thành một vòng mực rộng 2·Lo quanh đường đó (không tô gì khác)
//   'first' vẽ bình thường + nét mực W quanh lần tô đầu tiên (thường là khối nền của mặt) · 'all' quanh mọi lần tô / nét đặc
export function lineCtx(c, mode) {
  let n = 0;
  const solid = s => alphaOf(s) * c.globalAlpha >= .5;
  const want = () => mode === 'all' || n === 0;
  const H = {
    fill(...a) {
      if (mode === 'sil') { if (solid(c.fillStyle) && !(a[0] instanceof Path2D)) devStroke(c, 2 * PASS.Lo); return; }
      c.fill(...a);
      if (solid(c.fillStyle) && want() && !(a[0] instanceof Path2D)) devStroke(c, PASS.W);
      n++;
    },
    stroke(...a) {
      if (!solid(c.strokeStyle) || a.length) { if (mode !== 'sil') c.stroke(...a); return; }
      const s = devScale(c), lw = c.lineWidth * s;
      if (mode === 'sil') { devStroke(c, lw + 2 * PASS.Lo); return; }
      if (want()) devStroke(c, lw + PASS.W);
      c.stroke(); n++;
    },
    fillRect(x, y, w, h) {
      if (mode === 'sil') { if (solid(c.fillStyle)) { c.beginPath(); c.rect(x, y, w, h); devStroke(c, 2 * PASS.Lo); } return; }
      c.fillRect(x, y, w, h);
      if (solid(c.fillStyle) && want()) { c.beginPath(); c.rect(x, y, w, h); devStroke(c, PASS.W); }
      n++;
    },
    drawImage(...a) { if (mode !== 'sil') c.drawImage(...a); },
    fillText(...a) { if (mode !== 'sil') c.fillText(...a); },
    strokeText(...a) { if (mode !== 'sil') c.strokeText(...a); },
  };
  return new Proxy(c, {
    get(t, k) { if (k in H) return H[k]; const v = t[k]; return typeof v === 'function' ? v.bind(t) : v; },
    set(t, k, v) { t[k] = v; return true; },
  });
}
