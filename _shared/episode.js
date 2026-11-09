// Thư viện dựng tập: các hàm dùng lại ở mọi Short (rút ra từ films/short-001/film.js).
// Nhân vật vẽ bằng rig dùng chung (drawChar); hàm ở đây chỉ đặt nhân vật vào cảnh, nhép miệng theo giọng thật, phụ đề, máy quay.
import { C, REC, circle, rrect, subFont, wrap, popText, lerp, seg, back, eo, TAU, ground, rays } from './kit.js';
import { ei, ss } from '/core/lib.js';
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

/* ---------- vùng an toàn của Shorts (QUALITY.md §5) ----------
   Ước lượng phần giao diện YouTube Shorts che trên điện thoại (khung 1080×1920): thanh trên, cột nút bên phải, vùng tên kênh/tiêu đề/nhạc ở dưới.
   Tập mới (từ SHORT-006) đặt phụ đề ở SAFE.subY: subtitle(c, card, t, 510, SAFE.subY). Tập 001–005 giữ y mặc định 1545 (không dựng lại). */
export const SAFE = { top: 150, bottom: 1530, subBottom: 1500, right: 940, rightY: [880, 1780], subY: 1400 };
// Ghi khung tấm phụ đề đang vẽ (toạ độ màn hình), cho _shared/tools/safezone.mjs. Chỉ ghi khi SUB.on; không đổi hình.
export const SUB = { on: false, box: null };

/* ---------- phụ đề: tấm giữ nguyên cỡ, chữ hiện theo câu đã nói (card = {t0, t1, text, parts}) ---------- */
export function subtitle(c, card, t, cx = 510, y = 1545) {
  const a = seg(t, card.t0, card.t0 + .14); if (a <= 0) return;
  c.save(); c.font = subFont(56); c.textAlign = 'left'; c.textBaseline = 'middle';
  const ls = wrap(c, card.text, 800), lh = 66, w = Math.max(...ls.map(l => c.measureText(l).width)) + 72, h = ls.length * lh + 34;
  let shown = card.parts.filter(p => t >= p.t).map(p => p.text).join(' ').length;
  const s = back(a, 1.6); c.translate(cx, y); c.scale(s, s);
  if (SUB.on && a >= 1) { const m = c.getTransform(), X = x => m.a * x + m.e, Y = y => m.d * y + m.f; SUB.box = { text: card.text, x0: X(-w / 2), y0: Y(-h / 2), x1: X(w / 2), y1: Y(h / 2) }; }
  rrect(c, -w / 2 + 6, -h / 2 + 10, w, h, 30, 'rgba(30,27,58,.28)');
  rrect(c, -w / 2, -h / 2, w, h, 30, C.cream);
  c.fillStyle = C.ink;
  ls.forEach((l, i) => { if (shown <= 0) return; const lw = c.measureText(l).width; c.fillText(l.slice(0, shown), -lw / 2, (i - (ls.length - 1) / 2) * lh + 3); shown -= l.length + 1; });
  c.restore();
}

/* ================= thư viện tập A theo công thức 45 s (11/2026, PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §6), dựng cùng SHORT-007 ================= */

/* ---------- logo ≤ 0,8 s lồng vào cú lao vào kính (QUALITY.md §1) ----------
   Vẽ ĐÈ lên cảnh của chính lúc đó (cảnh kính lớn của bí mật 1 đã vẽ bên dưới):
   0–36 %: kính (from: {x, y, r}, toạ độ khung) lớn dần thành cả khung, trong mặt kính là logo "BIG SECRETS of tiny bugs";
   36–68 %: logo đứng trong mặt kính, nảy nhẹ; 68–100 %: máy xuyên qua mặt kính: tấm logo mờ đi, chữ phóng to bay qua máy.
   Logo là nhận diện kênh, không phải chữ để đọc: không ghi vào REC (readcheck). Nhạc hiệu đi kèm: band.sting().
   o = { t0, t1 (mặc định t0 + .8), from: {x, y, r}, rim, bg, ray } */
export function titleSting(c, t, o) {
  const t0 = o.t0, t1 = o.t1 ?? t0 + .8; if (t < t0 || t >= t1) return;
  const u = (t - t0) / (t1 - t0), grow = ei(seg(u, 0, .36)), fade = ss(seg(u, .68, 1)), fly = ei(seg(u, .68, 1));
  const R = lerp(o.from.r, 1250, grow), cx = lerp(o.from.x, 540, grow), cy = lerp(o.from.y, 960, grow);
  c.save(); c.globalAlpha *= 1 - fade;
  if (grow < 1) circle(c, cx, cy, R + 24 * (1 - grow) + 6, o.rim || C.berry);
  c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip();
  ground(c, o.bg || C.night); rays(c, cx, cy, o.ray || C.nightL, (t - t0) * 1.2, 16);
  const s = (1 + 1.4 * fly) * (1 + .05 * Math.sin(Math.PI * seg(u, .36, .6))), sc = lerp(o.from.r / 520, 1, grow);
  c.translate(cx, cy); c.scale(sc * s, sc * s); c.translate(-540, -960);
  popText(c, 'BIG', 540, 900, 210, C.lemon, C.ink, t, t0 + .06, { step: .05, read: false });
  popText(c, 'SECRETS', 540, 1080, 170, C.lemon, C.ink, t, t0 + .12, { step: .025, read: false });
  popText(c, 'of tiny bugs', 540, 1180, 72, C.cream, C.ink, t, t0 + .22, { step: .015, read: false, font: subFont });
  c.restore();
  // vệt sáng của mặt kính quét qua
  const sw = seg(u, .1, .55);
  if (sw > 0 && sw < 1) { c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip(); c.translate(cx, cy); c.rotate(-.6); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(-R + 2 * R * sw - 60, -R, 120, 2 * R); c.restore(); }
  c.restore();
}

/* ---------- ba ô sticker "1 2 3": vòng mở của tập A (QUALITY.md §2) ----------
   Ô tròn nét đứt, nhỏ, dưới thanh trên của Shorts (toạ độ khung, y ≈ 200–300). Hiện ở o.t0 (khi chữ móc rời đi);
   mỗi ô lấp bằng sticker của bí mật ở fills[i].t (nảy lên + vòng sáng; tiếng 'stamp' do mix.py của tập);
   o.to = { t0, t1, slots } : các ô bay xuống đúng chỗ của chúng trên trang sổ (toạ độ khung); ô còn trống thì mờ dần trên đường bay.
   Sau o.to.t1 hàm không vẽ nữa: trang sổ của tập tự vẽ sticker ở đúng chỗ đó.
   o = { t0, slots: [{x, y, r}], fills: [{t, fill, draw(cc) (cỡ theo r0), r0}], to } */
export function stickerSlots(c, t, o) {
  if (t < o.t0 || (o.to && t >= o.to.t1)) return;
  const a = back(seg(t, o.t0, o.t0 + .3), 2.2);
  o.slots.forEach((S, i) => {
    const F = o.fills[i], filled = F && t >= F.t, dn = o.to ? ss(seg(t, o.to.t0 + i * .05, o.to.t1 - (o.slots.length - 1 - i) * .05)) : 0;
    const T2 = o.to ? o.to.slots[i] : S, x = lerp(S.x, T2.x, dn), y = lerp(S.y, T2.y, dn) - 120 * Math.sin(Math.PI * dn) * (o.to ? 1 : 0), r = lerp(S.r, T2.r, dn) * a;
    if (r <= 1) return;
    if (!filled) {
      c.save(); c.globalAlpha *= 1 - dn;
      circle(c, x + 4, y + 6, r, 'rgba(30,27,58,.3)'); circle(c, x, y, r, 'rgba(30,27,58,.55)');
      c.setLineDash([r * .32, r * .22]); c.lineWidth = Math.max(3, r * .1); c.strokeStyle = C.cream; c.beginPath(); c.arc(x, y, r * .9, t * .5, t * .5 + TAU); c.stroke(); c.setLineDash([]);
      popText(c, String(i + 1), x, y + r * .36, r * .95, C.cream, null, -1, -1, { read: false });
      c.restore();
      return;
    }
    const p = back(seg(t, F.t, F.t + .25), 2.6), q = seg(t, F.t, F.t + .55);
    if (q > 0 && q < 1) { c.strokeStyle = `rgba(255,227,77,${1 - q})`; c.lineWidth = 10 * (1 - q) + 2; c.beginPath(); c.arc(x, y, r * (1.05 + .7 * eo(q)), 0, TAU); c.stroke(); }
    badge(c, x, y, r, F.fill, cc => { const k = r / (F.r0 || 100); cc.scale(k, k); F.draw(cc); }, 0, lerp(1.4, 1, p));
  });
}
// một sticker bay từ kính lên ô của nó (toạ độ khung): u 0..1, from {x, y, r}, to {x, y, r}
export function flyBadge(c, u, from, to, fill, draw, r0 = 100) {
  if (u <= 0 || u >= 1) return;
  const e = ss(u), x = lerp(from.x, to.x, e), y = lerp(from.y, to.y, e) - 140 * Math.sin(Math.PI * u), r = lerp(from.r, to.r, e);
  badge(c, x, y, r, fill, cc => { const k = r / r0; cc.scale(k, k); draw(cc); }, -.6 * Math.sin(Math.PI * u), 1);
}

/* ---------- Albie nói câu cửa miệng trong lúc có hành động (QUALITY.md §2: "Six legs? In you go!") ----------
   Albie nhún theo nhịp câu nói, trang giấy chạm vào từng mốc đếm (counts: "Six legs?"), há miệng thật to trước mốc tg
   rồi "đớp" đúng tg: khép miệng, nảy lên một nhịp, mép sticker dựng lên, lắc người; sau đó cười.
   item(c, u): vẽ vật bay vào miệng (u 0..1 trong [tg − .45, tg]); tập không dùng thì bỏ trống. Tiếng 'paper' + 'boing' ở tg do mix.py của tập.
   o = { x, y, k, talk, line: {t, dur}, counts: [t…], tg, look, blink, item } */
export function albumGulp(c, t, o) {
  const tg = o.tg, open = ss(seg(t, tg - .42, tg - .14)) * (1 - seg(t, tg, tg + .07));
  const gulp = Math.sin(Math.PI * seg(t, tg, tg + .34)), after = t > tg ? Math.exp(-(t - tg) * 4) : 0;
  const cnt = (o.counts || []).reduce((s, h) => s + Math.sin(Math.PI * seg(t, h - .03, h + .17)), 0);
  const L = o.line, inLine = L && t >= L.t && t < L.t + L.dur;
  const bob = inLine ? .07 * Math.abs(Math.sin((t - L.t) * Math.PI * 2)) : 0;
  const name = t > tg + .3 ? 'laugh' : open > .3 ? 'surprised' : 'happy';
  const E = ex(BY.albie, name, { talk: open > .3 || gulp > .2 ? 0 : (o.talk || 0), look: o.look, blink: o.blink || 0, mouth: open > .3 ? 'shout' : gulp > .2 ? 'smile' : undefined });
  const counting = o.counts && t > o.counts[0] - .3 && t < o.counts.at(-1) + .35;
  const page = counting ? [.95 + .1 * cnt, -1.3 + .12 * cnt, -.25] : open > .3 ? [.7, -1.75, -.6] : null;
  albieAt(c, o.x, o.y, o.k, { E, hop: bob + .34 * gulp + .05 * cnt, tilt: -.06 * open + .08 * after * Math.sin((t - tg) * 22), tabsUp: Math.max(open, gulp), page, curl: .3 - .5 * cnt });
  if (o.item && t > tg - .45 && t < tg) o.item(c, seg(t, tg - .45, tg));
}
