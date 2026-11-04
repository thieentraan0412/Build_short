// Đặt nhân vật lên trang: dựng rig, áp dáng + biểu cảm, vẽ hiệu ứng quanh đầu, bóng đen cho bảng silhouette.
import { C } from '../kit.js';
import { Rig } from './rig.js';
import { EXPR, fx } from './face.js';

const FACE_FX = new Set(['tear', 'tears', 'blush']);
export const VIEW = { front: 0, q: .62, side: Math.PI / 2, back: Math.PI, ql: -.62 };

export function resolveExpr(CH, expr) {
  if (typeof expr === 'object') return expr;
  const base = EXPR[expr] || EXPR.happy, own = (CH.expr && CH.expr[expr]) || {};
  return { name: expr, ...base, ...own, eye: { ...(base.eye || {}), ...(own.eye || {}) } };
}

// vẽ nhân vật: (x, y) là điểm giữa chân trên mặt đất; h là chiều cao mong muốn (px) hoặc k là hệ số trực tiếp
export function drawChar(c, CH, o = {}) {
  const { x = 0, y = 0, yaw = 0, alpha = 1, pose = {}, expr = 'happy', lean = 0, hop = 0, flip = false, detail = 0, showFx = true, props = null } = o;
  const k = o.k ?? (o.h ?? 300) / CH.h;
  const E = resolveExpr(CH, expr);
  const ep = (o.exprPose !== false && CH.exprPose && typeof expr === 'string') ? (CH.exprPose[expr] || {}) : {};
  const r = new Rig(yaw, { detail });
  CH.build(r, { pose: { ...ep, ...pose }, E, detail, yaw });
  if (o.extra) o.extra(r);
  c.save(); c.globalAlpha *= alpha; c.translate(x, y - hop * k); if (flip) c.scale(-1, 1); c.rotate(lean + (E.tilt || 0) * (CH.tiltK ?? 1)); c.scale(k, k);
  r.draw(c);
  if (props) props(c, r);
  if (showFx && E.fx && CH.face) {
    const f = (FACE_FX.has(E.fx) ? CH.face : CH.head) || CH.face, p = r.P(f.c), side = Math.cos(yaw) < -.2 ? -1 : 1;
    c.save(); c.translate(p[0], p[1]); if (flip) c.scale(-1, 1); c.scale(side, 1);
    fx(c, E.fx, 0, 0, f.r, { ink: f.fxInk || C.ink, light: f.fxLight || C.cream, qcol: f.qcol, dotCol: f.dotCol, tearX: f.tearX, tearY: f.tearY });
    c.restore();
  }
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
  drawChar(oc, CH, { ...o, showFx: false });
  oc.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 5; i++) oc.drawImage(OFF, 0, 0);   // làm đặc các phần trong suốt (Smudge, cánh)
  oc.globalCompositeOperation = 'source-in'; oc.fillStyle = col; oc.fillRect(0, 0, W, H); oc.globalCompositeOperation = 'source-over';
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(OFF, 0, 0); c.restore();
}
