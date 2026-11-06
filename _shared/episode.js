// Thư viện dựng tập: các hàm dùng lại ở mọi Short (rút ra từ films/short-001/film.js).
// Nhân vật vẽ bằng rig dùng chung (drawChar); hàm ở đây chỉ đặt nhân vật vào cảnh, nhép miệng theo giọng thật, phụ đề, máy quay.
import { C, REC, circle, rrect, subFont, wrap, popText, lerp, seg, back, eo, TAU } from './kit.js';
import { ei } from '/core/lib.js';
import { drawChar, resolveExpr } from './characters/stage.js';
import { BY } from './characters/cast/index.js';

// ---------- khẩu hình: âm lượng thật của từng câu (voice/env.json, 24 giá trị mỗi giây); thiếu file thì nhép đều ----------
export function makeTalk(LINES) {
  let ENV = null;
  return {
    setEnv: e => { ENV = e; },
    talkAt: (t, who = 'loupe') => {
      for (const l of LINES) if (l.who === who && t >= l.t && t < l.t + l.dur) {
        const e = ENV && ENV[l.id]; if (e) return e[Math.min(e.length - 1, Math.floor((t - l.t) * 24))];
        return .35 + .65 * Math.abs(Math.sin((t - l.t) * Math.PI * 5.5));
      }
      return 0;
    },
  };
}
export const blinkAt = (t, ph = 0) => { const p = (t * .31 + ph) % 1; return p > .965 ? 1 : 0; };
export const flutterWave = t => Math.abs(Math.sin(t * TAU * 3.2));

// ---------- biểu cảm: ngữ pháp chung + nhép miệng, chớp mắt, hướng nhìn ----------
export function ex(CH, name, o = {}) {
  const E = resolveExpr(CH, name), R = { ...E, eye: { ...(E.eye || {}) } };
  for (const k of ['eyeL', 'eyeR']) if (E[k]) R[k] = { ...E[k] };
  if (o.look) for (const k of ['eye', 'eyeL', 'eyeR']) if (R[k]) R[k].look = o.look;
  if (o.talk > .06) { R.mouth = 'talk'; R.talk = o.talk; }
  if (o.blink) for (const k of ['eye', 'eyeL', 'eyeR']) if (R[k] && !R[k].closed) R[k].open = 1 - o.blink;
  if (o.closed) for (const k of ['eye', 'eyeL', 'eyeR']) if (R[k]) R[k].closed = o.closed;
  if (o.mouth) R.mouth = o.mouth;
  if (!o.fx) delete R.fx;
  R.tilt = o.tilt || 0;
  return R;
}
// điểm của rig (toạ độ nhân vật) → toạ độ cảnh, cùng phép biến đổi với drawChar (không lật)
export function rigPt(x, y, k, yaw, lean, p) {
  const X = p[0] * Math.cos(yaw) + p[2] * Math.sin(yaw), Y = p[1], cs = Math.cos(lean), sn = Math.sin(lean);
  return [x + k * (X * cs - Y * sn), y + k * (X * sn + Y * cs)];
}
// máy quay "nhìn vào" (cx, cy) với độ phóng z; điểm cảnh → khung hình
export const look = (c, cam, fn) => { c.save(); c.translate(540, 960); c.scale(cam.z, cam.z); c.translate(-cam.cx, -cam.cy); fn(); c.restore(); };
export const toScreen = (cam, x, y) => [540 + (x - cam.cx) * cam.z, 960 + (y - cam.cy) * cam.z];

/* ---------- Miss Loupe: đặt theo TÂM KÍNH (lx, ly), bán kính kính r ----------
   Trong rig, tâm kính nằm trên điểm chân 2,73 bán kính. inside(c) vẽ cảnh phóng to trong toạ độ của cảnh đang vẽ:
   rig cắt sẵn theo mặt kính rồi vẽ vành và vệt sáng lên trên. */
export const LENS_UP = 2.73;
export function loupe(c, lx, ly, r, o = {}) {
  const E = o.E || ex(BY.loupe, 'happy'), lean = o.rot ?? -.14, th = lean + (E.tilt || 0);
  const T0 = c.getTransform(), pose = { ...(o.pose || {}) };
  if (o.inside) pose.inside = cc => { cc.setTransform(T0); REC.mute++; o.inside(cc); REC.mute--; };
  return drawChar(c, BY.loupe, { x: lx - Math.sin(th) * LENS_UP * r, y: ly + Math.cos(th) * LENS_UP * r, k: r, yaw: o.yaw || 0, lean, expr: E, pose, showFx: !!o.fx });
}
// cảnh phóng to trong kính: tâm kính (lx, ly), độ phóng mag, điểm (wx, wy) của cảnh nằm ở tâm kính
export const zoomIn = (lx, ly, mag, wx, wy, draw) => c => { c.translate(lx, ly); c.scale(mag, mag); c.translate(-wx, -wy); draw(); };
export const ARM = {
  peer: { handR: [.6, -1.62, .3], elbowR: [.7, -1.25, .1] },
  point: { handR: [.82, -1.7, .1], elbowR: [.8, -1.2, 0], pointR: [0, -1, 0] },
  up: { handL: [-.72, -1.75, .05], handR: [.72, -1.75, .05] },
  shrug: { handL: [-.88, -1.32, .1], handR: [.88, -1.32, .1] },
  wave: { handR: [.85, -2.0, .1], elbowR: [.72, -1.45, 0] },
};

/* ---------- Flutter ---------- */
export const BF_FEET = [[-.3, 0, .44], [-.34, 0, .02], [-.3, 0, -.42], [.3, 0, .44], [.34, 0, .02], [.3, 0, -.42]];
export function flutterAt(c, x, y, k, o = {}) {
  return drawChar(c, BY.flutter, {
    x, y, k, yaw: o.yaw ?? 1.25, lean: o.rot || 0, flip: !!o.flip, detail: o.detail || 0, showFx: false, extra: o.extra,
    expr: o.E || ex(BY.flutter, o.expr || 'happy', { look: o.look || [.3, .1] }),
    pose: { beta: o.beta ?? .32, tongue: o.tongue || 0, lift: o.lift || 0, antL: o.ant || 0, antR: o.ant || 0, ...(o.legsUp ? { legsUp: o.legsUp } : {}) },
  });
}
// điểm nếm phát sáng ở 6 bàn chân (chỉ vẽ trong kính); glow 0..1
export const tasteGlow = glow => r => {
  if (glow <= .02) return;
  BF_FEET.forEach((f, i) => {
    const sd = i < 3 ? -1 : 1;
    for (let k = 0; k < 3; k++) {
      const q = r.P([f[0] + sd * .02, -.015, f[2] + .03 + k * .045]);
      r.flat(q[2] + .003, cc => { cc.fillStyle = 'rgba(183,240,74,.38)'; cc.beginPath(); cc.arc(q[0], q[1], .024 + .016 * glow, 0, TAU); cc.fill(); cc.fillStyle = C.lemon; cc.beginPath(); cc.arc(q[0], q[1], .014 * glow, 0, TAU); cc.fill(); });
    }
  });
};

/* ---------- Albie ---------- */
export function albieAt(c, x, y, k, o = {}) {
  return drawChar(c, BY.albie, {
    x, y, k, yaw: o.yaw ?? .32, showFx: !!o.fx, expr: o.E || ex(BY.albie, 'happy'),
    pose: { hop: o.hop || 0, tilt: o.tilt || 0, tabsUp: o.tabsUp || 0, page: o.page || null, pageCurl: o.curl ?? .3 },
  });
}
// đầu trang giấy làm "tay" của Albie (toạ độ rig), theo cách albie.js dựng: page = [dài, độ cao, lệch]
export const ALBIE_W = 1.5;
export const albiePageTip = (page, f = 1) => {
  const base = [ALBIE_W / 2 - .05, page[1] ?? -1.1, .05], tip = [ALBIE_W / 2 + page[0], (page[1] ?? -1.1) + (page[2] ?? 0), .12];
  return [base[0] + (tip[0] - base[0]) * f, base[1] + (tip[1] - base[1]) * f, base[2] + (tip[2] - base[2]) * f];
};

/* ---------- sticker tròn có hình nhân vật bên trong ---------- */
export function badge(c, x, y, r, fill, draw, rot = 0, s = 1) {
  if (s <= 0) return;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  circle(c, 8, 10, r, 'rgba(30,27,58,.18)'); circle(c, 0, 0, r, fill);
  c.save(); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.clip(); draw(c); c.restore();
  c.restore();
}
/* ---------- tựa móc của mọi Short (QUALITY.md §1) ----------
   Chữ to, tương phản cao, đọc được ngay ở khung 0 (hiện đủ 100%, để khung cuối của vòng lặp khớp đúng), rồi từng dòng nảy lên
   (1 → ≈1,17 → 1 trong 0,32 s, kèm một tiếng động ở mỗi dòng). lines: [{ text, y, px, fill, shadow, t0 }].
   o.gone 0..1: thu nhỏ biến mất (âm: phóng to quá đà khi chữ trở lại ở cuối phim); o.wob: lắc; o.cx, o.cy: tâm co giãn; o.rot: nghiêng */
export function hookTitle(c, lines, t, o = {}) {
  const gone = o.gone || 0; if (gone >= 1) return;
  const cx = o.cx ?? 540, cy = o.cy ?? 350;
  c.save(); c.translate(cx, cy + (o.dy || 0)); c.scale(1 - gone, 1 - gone); c.rotate((o.rot ?? -.03) + (o.wob || 0)); c.translate(-cx, -cy);   // o.dy: nhích cả khối lên/xuống (ví dụ nhường chỗ cho cánh bướm)
  for (const L of lines) {
    const t0 = L.t0 ?? 0, u = seg(t, t0, t0 + .32), p = t < t0 ? 0 : Math.sin(Math.PI * u) * (1 - .35 * u), s = 1 + .17 * p, my = L.y - L.px * .34;
    c.save(); c.translate(cx, my); c.scale(s, s); c.translate(-cx, -my);
    popText(c, L.text, cx, L.y, L.px, L.fill, L.shadow, -1, -1, { sh: L.px * .065 });
    c.restore();
  }
  c.restore();
}
/* ---------- chuyển cảnh kính → sổ (QUALITY.md §2): "chụp" rồi match cut qua sticker ----------
   t0–t1: máy lao xuyên qua mặt kính, hình trong kính hoá thành sticker (vành kính mỏng dần thành mép sticker);
   t1–t2: máy lùi ra từ chính sticker đó, lộ trang sổ (sticker đã nằm đúng chỗ của nó trên trang).
   o = { t0, t1, t2, lens: {x, y, r} (toạ độ khung lúc t0), from(c) vẽ khung trước (đứng lại), to(c, t) vẽ trang sổ,
         slot: {x, y, r} chỗ sticker trên trang, fill màu nền sticker, draw(cc) hình trong sticker (cỡ theo slot.r), rim màu vành kính } */
export const MATCH_R = 1150;
export function stickerMatchCut(c, t, o) {
  if (t < o.t1) {
    const u = ei(seg(t, o.t0, o.t1)); o.from(c);
    const cx = lerp(o.lens.x, 540, u), cy = lerp(o.lens.y, 960, u), R = lerp(o.lens.r * .94, MATCH_R, u);
    circle(c, cx, cy, R + 22 * (1 - u), o.rim || C.berry);
    badge(c, cx, cy, R, o.fill, cc => { const k = R / o.slot.r; cc.scale(k, k); o.draw(cc); }, -.05 * u, 1);
    const f = 1 - seg(t, o.t0, o.t0 + .2); if (f > 0) circle(c, cx, cy, R, `rgba(255,255,255,${.6 * f})`);
  } else {
    const v = eo(seg(t, o.t1, o.t2)), k = lerp(MATCH_R / o.slot.r, 1, v), cx = lerp(540, o.slot.x, v), cy = lerp(960, o.slot.y, v);
    c.save(); c.translate(cx, cy); c.scale(k, k); c.translate(-o.slot.x, -o.slot.y); o.to(c, t); c.restore();
  }
}
// chớp sáng trong mặt kính lúc "chụp" (L: {x, y, r} toạ độ khung)
export function snapFlash(c, t, t0, L) {
  const a = 1 - seg(t, t0, t0 + .3); if (a <= 0 || t < t0) return;
  circle(c, L.x, L.y, L.r * .96, `rgba(255,255,255,${.85 * a})`);
  c.strokeStyle = C.lemon; c.lineCap = 'round'; c.lineWidth = 10 * a;
  for (let i = 0; i < 8; i++) { const g = i / 8 * TAU, r0 = L.r * 1.1, r1 = L.r * (1.1 + .35 * (1 - a)); c.beginPath(); c.moveTo(L.x + Math.cos(g) * r0, L.y + Math.sin(g) * r0); c.lineTo(L.x + Math.cos(g) * r1, L.y + Math.sin(g) * r1); c.stroke(); }
}
export const shadow = (c, x, y, w, a = .16) => { c.fillStyle = `rgba(30,27,58,${a})`; c.beginPath(); c.ellipse(x, y, w, w * .17, 0, 0, TAU); c.fill(); };

/* ---------- phụ đề: tấm giữ nguyên cỡ, chữ hiện theo câu đã nói (card = {t0, t1, text, parts}) ---------- */
export function subtitle(c, card, t, cx = 510, y = 1545) {
  const a = seg(t, card.t0, card.t0 + .14); if (a <= 0) return;
  c.save(); c.font = subFont(56); c.textAlign = 'left'; c.textBaseline = 'middle';
  const ls = wrap(c, card.text, 800), lh = 66, w = Math.max(...ls.map(l => c.measureText(l).width)) + 72, h = ls.length * lh + 34;
  let shown = card.parts.filter(p => t >= p.t).map(p => p.text).join(' ').length;
  const s = back(a, 1.6); c.translate(cx, y); c.scale(s, s);
  rrect(c, -w / 2 + 6, -h / 2 + 10, w, h, 30, 'rgba(30,27,58,.28)');
  rrect(c, -w / 2, -h / 2, w, h, 30, C.cream);
  c.fillStyle = C.ink;
  ls.forEach((l, i) => { if (shown <= 0) return; const lw = c.measureText(l).width; c.fillText(l.slice(0, shown), -lw / 2, (i - (ls.length - 1) / 2) * lh + 3); shown -= l.length + 1; });
  c.restore();
}
