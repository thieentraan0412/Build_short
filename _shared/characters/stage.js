// Đặt nhân vật lên trang: dựng rig, áp dáng + biểu cảm, vẽ hiệu ứng quanh đầu, bóng đen cho bảng silhouette.
import { C, REC } from '../kit.js';
import { Rig } from './rig.js';
import { EXPR, fx } from './face.js';
import { LOOK, PASS, lineFor } from './look.js';
export { LOOK };

const FACE_FX = new Set(['tear', 'tears', 'blush']);
export const VIEW = { front: 0, q: .62, side: Math.PI / 2, back: Math.PI, ql: -.62 };
// Ghi vị trí mặt nhân vật theo toạ độ màn hình (px), cho _shared/tools/safezone.mjs (vùng giao diện Shorts, người nói có trên hình).
// Chỉ ghi khi FACES.on; không vẽ gì nên không đổi hình của tập nào. { who, x, y, r, clip }: tâm, bán kính mặt; clip = vẽ trong kính hoặc vòng iris (REC.mute).
export const FACES = { on: false, list: [] };
let OFF_DRAW = 0;

export function resolveExpr(CH, expr) {
  if (typeof expr === 'object') return expr;
  const base = EXPR[expr] || EXPR.happy, own = (CH.expr && CH.expr[expr]) || {};
  return { name: expr, ...base, ...own, eye: { ...(base.eye || {}), ...(own.eye || {}) } };
}

// ---- (11/2026) "mặt luôn vui tươi" (QUALITY.md §5, bật bằng LOOK.cheer = true) ----
// Tên biểu cảm buồn / lo / cáu đổi sang biểu cảm vui gần nghĩa nhất (cả dáng theo biểu cảm của nhân vật đi theo tên mới)
export const CHEER_NAME = { worried: 'curious', sad: 'hopeful', cry: 'laugh', strain: 'excited', annoyed: 'happy', confused: 'curious', shout: 'excited',
  crosseyed: 'silly', sleepy: 'happy' };
const CHEER_MOUTH = { frown: 'smile', wavy: 'smile', zig: 'smile', flat: 'smile', shout: 'grin', o: 'grin', side: 'tiny', smirk: 'smile' };
const CHEER_FX = { sweat: null, tear: null, tears: 'sparkle', puff: null, qq: 'q' };
const cheerEye = e => {
  if (!e) return e; const o = { ...e };
  if (o.closed && o.closed !== 'happy' && o.closed !== 'flat') o.closed = 'happy';   // nhắm buồn, nhắm nhăn → cười híp mắt (chớp mắt 'flat' giữ nguyên)
  if (o.lidTilt) o.lidTilt = 0; if ((o.lidTop || 0) > .2) o.lidTop = .2;               // bỏ mí xếch lo âu / cau có, bỏ mí sụp
  return o;
};
const cheerBrow = b => { if (!b) return b; const o = { ...b }; if (Math.abs(o.tilt || 0) > .12) o.tilt = 0; if ((o.lift ?? 0) < 0) o.lift = .05; return o; };
// biểu cảm (đã giải) → bản vui: miệng cười, mắt không buồn, lông mày không lo / cau, không giọt mồ hôi, nước mắt
export function cheerExpr(E) {
  const o = { ...E };
  for (const k of ['eye', 'eyeL', 'eyeR']) if (E[k]) o[k] = cheerEye(E[k]);
  for (const k of ['brow', 'browL', 'browR']) if (E[k]) o[k] = cheerBrow(E[k]);
  if (o.mouth in CHEER_MOUTH) o.mouth = CHEER_MOUTH[o.mouth];
  if (o.fx in CHEER_FX) o.fx = CHEER_FX[o.fx];
  if ((o.tilt || 0) < -.04) o.tilt = -o.tilt;                                          // nghiêng đầu buồn → nghiêng đầu tinh nghịch
  o.cheer = true; return o;
}
// mặt đang "không vui" (để safezone.mjs / qa.py đo): miệng mếu, lượn sóng, răng cưa, hét; mắt nhắm buồn / nhăn; mí xếch; nước mắt, mồ hôi
export function sadFace(E) {
  if (!E) return false;
  const eyes = [E.eye, E.eyeL, E.eyeR].filter(Boolean);
  return ['frown', 'wavy', 'zig', 'shout'].includes(E.mouth) || ['tear', 'tears', 'sweat', 'puff'].includes(E.fx)
    || eyes.some(e => e.closed === 'sad' || e.closed === 'squeeze' || Math.abs(e.lidTilt || 0) > .1);
}

// vẽ nhân vật: (x, y) là điểm giữa chân trên mặt đất; h là chiều cao mong muốn (px) hoặc k là hệ số trực tiếp
export function drawChar(c, CH, o = {}) {
  const { x = 0, y = 0, yaw = 0, alpha = 1, pose = {}, expr = 'happy', lean = 0, hop = 0, flip = false, detail = 0, showFx = true, props = null } = o;
  const k = o.k ?? (o.h ?? 300) / CH.h;
  const ex = LOOK.cheer && typeof expr === 'string' ? (CHEER_NAME[expr] || expr) : expr;
  const E = LOOK.cheer ? cheerExpr(resolveExpr(CH, ex)) : resolveExpr(CH, expr);
  const ep = (o.exprPose !== false && CH.exprPose && typeof ex === 'string') ? (CH.exprPose[ex] || {}) : {};
  const r = new Rig(yaw, { detail, unit: CH.h });
  CH.build(r, { pose: { ...ep, ...pose }, E, detail, yaw });
  if (o.extra) o.extra(r);
  c.save(); c.globalAlpha *= alpha; c.translate(x, y - hop * k); if (flip) c.scale(-1, 1); c.rotate(lean + (E.tilt || 0) * (CH.tiltK ?? 1)); c.scale(k, k);
  // v2: độ dày viền theo chiều cao nhân vật trên khung (px thiết bị); o.line ghi đè tổng độ dày viền ngoài (px logic của trang)
  const saved = r.v2 ? { ...PASS } : null;
  if (r.v2) { const m = c.getTransform(), L = lineFor(c, CH.h * Math.hypot(m.a, m.b)); if (o.line) { const T = o.line * (LOOK.norm || 1) * LOOK.lineK; L.T = T; L.W = T * .6; L.Lo = T - L.W / 2; } Object.assign(PASS, L, { sil: false }); }
  r.draw(c);
  if (FACES.on && !OFF_DRAW && CH.face) {
    const m = c.getTransform(), p = r.P(CH.face.c);
    FACES.list.push({ who: CH.id, x: m.a * p[0] + m.c * p[1] + m.e, y: m.b * p[0] + m.d * p[1] + m.f, r: CH.face.r * Math.hypot(m.a, m.b), clip: REC.mute > 0, sad: !CH.noFace && sadFace(E),
      ex: typeof ex === 'string' ? ex : (E.name || null) });   // ex: tên biểu cảm (qa_musical.py: đổi biểu cảm là một nhịp đổi hình)
  }
  if (props) props(c, r);
  if (showFx && E.fx && CH.face) {
    const f = (FACE_FX.has(E.fx) ? CH.face : CH.head) || CH.face, p = r.P(f.c), side = Math.cos(yaw) < -.2 ? -1 : 1;
    c.save(); c.translate(p[0], p[1]); if (flip) c.scale(-1, 1); c.scale(side, 1);
    fx(c, E.fx, 0, 0, f.r, { ink: f.fxInk || C.ink, light: f.fxLight || C.cream, qcol: f.qcol, dotCol: f.dotCol, tearX: f.tearX, tearY: f.tearY });
    c.restore();
  }
  if (saved) Object.assign(PASS, saved);
  c.restore();
  return r;
}

// bóng đen: vẽ vào canvas phụ rồi tô một màu
let OFF = null;
export function silhouette(c, CH, o = {}, col = C.ink) {
  const W = c.canvas.width, H = c.canvas.height;
  if (!OFF || OFF.width !== W || OFF.height !== H) { OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H; }
  const oc = OFF.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, W, H);
  oc.setTransform(c.getTransform());
  OFF_DRAW++; drawChar(oc, CH, { ...o, showFx: false }); OFF_DRAW--;   // bóng đen trên canvas phụ: không ghi mặt
  oc.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 5; i++) oc.drawImage(OFF, 0, 0);   // làm đặc các phần trong suốt (Smudge, cánh)
  oc.globalCompositeOperation = 'source-in'; oc.fillStyle = col; oc.fillRect(0, 0, W, H); oc.globalCompositeOperation = 'source-over';
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(OFF, 0, 0); c.restore();
}
