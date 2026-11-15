// Đạo cụ và bối cảnh của SHORT-012: khu vườn nhiệt đới buổi trưa (trời dải ngọc lam → vàng nắng, lá chuối to, dâm bụt cam, lối cỏ),
// bản Zip của tập có cánh "đập so le" (counter-stroke) để soi chậm, mũi tên lên/xuống trên cánh, vệt bay, chữ "STILL!", sao va chạm.
// Nền phẳng, dịu hơn nhân vật (nhân vật v2 có viền mực); đạo cụ đứng gần nhân vật (dâm bụt, mũi tên) có nét mực mảnh cho hợp.
import { C, circle, ell, rrect, poly, capsule, popText, TAU } from '/_shared/kit.js';
import { hash, lerp, clamp, seg, ss, eo, back } from '/core/lib.js';
import { star } from '/_shared/characters/face.js';
import { V } from '/_shared/characters/rig.js';
import { dirA, leg } from '/_shared/characters/parts.js';
import { eye, mouth, eyeOpts } from '/_shared/characters/face.js';
import { ZIP, ZIP_COL, ZIP_POSE } from '/_shared/characters/cast/zip.js';

export const D = {
  sky0: '#0F6E7A', sky1: '#1C8C8A', sky2: '#4FB396', sky3: '#BFE07A', sky4: '#FFE08A', sun: '#FFE34D', sunL: '#FFF6C8',
  hill0: '#2E9E78', hill1: '#23876A', leaf: '#22B866', leafD: '#169150', leafDD: '#0F7A43', leafL: '#6FE39A', vein: '#8FF0B4',
  path: '#F2C77A', pathD: '#E0A85A', grass: '#2FC46F', grassD: '#1FA65A', hib: '#FF7A2F', hibD: '#D65A1E', hibC: '#FFE34D', ink: '#1E1B3A',
  front: '#FFE34D', back: '#FF6FA8',        // cánh trước (chanh) và cánh sau (hồng) trong cảnh soi chậm
};

/* ---------- trời: dải phẳng ngọc lam ở trên (chữ móc đọc rõ), vàng nắng ở chân trời (Zip xanh trời nổi bật) ---------- */
export const SUN = { x: 820, y: 640, r: 120 };
export function sky(c, t) {
  c.fillStyle = D.sky0; c.fillRect(-1600, -1600, 4300, 3600);
  for (const [y, h, col] of [[560, 1500, D.sky1], [760, 1200, D.sky2], [900, 1000, D.sky3], [990, 900, D.sky4]]) ell(c, 540, y + 560, 2100, h * .5, 0, col);
  for (const [m, a] of [[2.0, .14], [1.5, .2]]) circle(c, SUN.x, SUN.y, SUN.r * m, `rgba(255,246,200,${a})`);
  circle(c, SUN.x, SUN.y, SUN.r, D.sun); circle(c, SUN.x - 18, SUN.y - 18, SUN.r * .62, D.sunL);
  // mây phẳng trôi chậm
  for (let i = 0; i < 4; i++) {
    const x = ((-300 + i * 520 + t * 14 * (1 + .3 * hash(i + 40))) % 1900) - 400, y = 380 + 160 * hash(i + 41);
    c.fillStyle = 'rgba(255,253,240,.85)'; c.beginPath(); c.ellipse(x, y, 120, 40, 0, 0, TAU); c.ellipse(x + 70, y - 28, 70, 50, 0, 0, TAU); c.ellipse(x - 60, y - 16, 60, 38, 0, 0, TAU); c.fill();
  }
  // đồi xa
  ell(c, 60, 1150, 820, 220, 0, D.hill0); ell(c, 1040, 1170, 860, 240, 0, D.hill1);
}

/* ---------- lá chuối to hai bên (khung cảnh), đung đưa nhẹ ---------- */
function bananaLeaf(c, x, y, len, wid, rot, t, ph, col = D.leaf, colD = D.leafD) {
  const sw = .035 * Math.sin(t * 1.1 + ph);
  c.save(); c.translate(x, y); c.rotate(rot + sw);
  c.fillStyle = colD; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(len * .45, -wid * 1.15, len, -wid * .12); c.quadraticCurveTo(len * .5, wid * .25, 0, 0); c.fill();
  c.fillStyle = col; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(len * .45, -wid * 1.05, len, -wid * .12); c.quadraticCurveTo(len * .5, -wid * .12, 0, 0); c.fill();
  c.strokeStyle = D.vein; c.lineWidth = wid * .06; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(len * .5, -wid * .2, len, -wid * .12); c.stroke();
  c.lineWidth = wid * .035;
  for (let k = 1; k < 8; k++) { const u = k / 8, px = len * u, py = -wid * .2 * Math.sin(Math.PI * u) - wid * .12 * u; c.beginPath(); c.moveTo(px, py); c.lineTo(px + len * .06, py - wid * .7 * Math.sin(Math.PI * (u * .8 + .1))); c.stroke(); }
  c.restore();
}
/* ---------- dâm bụt cam, viền mực mảnh (đạo cụ gần nhân vật) ---------- */
export function hibiscus(c, x, y, r, t, ph = 0) {
  const rot = .1 * Math.sin(t * .9 + ph);
  c.save(); c.translate(x, y); c.rotate(rot);
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU - Math.PI / 2; c.fillStyle = i % 2 ? D.hib : '#FF8C45'; c.beginPath(); c.ellipse(Math.cos(a) * r * .55, Math.sin(a) * r * .55, r * .55, r * .4, a, 0, TAU); c.fill(); c.strokeStyle = D.ink; c.lineWidth = 3; c.stroke(); }
  circle(c, 0, 0, r * .28, D.hibD); capsule(c, 0, 0, r * .55, -r * .7, r * .08, D.hibC); circle(c, r * .58, -r * .74, r * .1, D.hibC);
  c.restore();
}
/* ---------- nền trong kính lớn: trời, đồi và bụi xa (bỏ lá chuối, hoa, lối cát cho Zip nổi), hạt phấn trôi để thấy hướng bay ---------- */
export function lensBackdrop(c, t, fx, fy) {
  sky(c, t);
  for (let i = 0; i < 9; i++) { const x = -300 + i * 210, h = 120 + 60 * hash(i + 7); ell(c, x, 1190, 150, h, 0, i % 2 ? '#2AA874' : '#33B27A'); }
  for (let i = 0; i < 26; i++) { const x = fx - 260 + ((hash(i + 60) * 520 + t * 9 * (1 + hash(i + 61))) % 520), y = fy - 200 + hash(i + 62) * 400; circle(c, x, y, 2.2 + 2.5 * hash(i + 63), 'rgba(255,246,200,.75)'); }
}
export const GY = 1240;                               // mặt lối cỏ (toạ độ cảnh), nơi nhân vật đứng
export function garden(c, t, o = {}) {
  sky(c, t);
  // bụi lá xa sau đồi
  for (let i = 0; i < 9; i++) { const x = -300 + i * 210, h = 120 + 60 * hash(i + 7); ell(c, x, 1190, 150, h, 0, i % 2 ? '#2AA874' : '#33B27A'); }
  // lá chuối hai bên khung
  bananaLeaf(c, -320, 1230, 760, 210, -1.0, t, 0); bananaLeaf(c, -300, 1180, 620, 170, -.55, t, 1.3, '#2BC070', D.leafD);
  bananaLeaf(c, 1400, 1230, 760, 210, Math.PI + 1.0, t, 2.1); bananaLeaf(c, 1380, 1170, 620, 170, Math.PI + .6, t, 3.0, '#2BC070', D.leafD);
  // lối cỏ (sân khấu) và đường mòn cát
  c.fillStyle = D.grassD; c.beginPath(); c.moveTo(-1000, GY - 20); for (let x = -1000; x <= 2100; x += 60) c.lineTo(x, GY - 26 + 8 * Math.sin(x * .01)); c.lineTo(2100, 2400); c.lineTo(-1000, 2400); c.closePath(); c.fill();
  c.fillStyle = D.grass; c.beginPath(); c.moveTo(-1000, GY - 10); for (let x = -1000; x <= 2100; x += 60) c.lineTo(x, GY - 14 + 8 * Math.sin(x * .01)); c.lineTo(2100, 2400); c.lineTo(-1000, 2400); c.closePath(); c.fill();
  ell(c, 540, GY + 70, 900, 70, 0, D.path); ell(c, 540, GY + 66, 840, 52, 0, '#F8D592');
  for (let i = 0; i < 14; i++) { const x = -150 + i * 105 + 30 * hash(i + 3), y = GY + 40 + 60 * hash(i + 9); ell(c, x, y, 16, 8, 0, D.pathD); }
  // cỏ lắc ở mép trước
  for (let i = 0; i < 46; i++) { const gx = -420 + i * 44, h = 40 + 50 * hash(i + 21), sw = 6 * Math.sin(t * 1.6 + i * .7); poly(c, [[gx - 9, GY + 190], [gx + 9, GY + 190], [gx + sw, GY + 190 - h]], i % 3 ? D.grassD : D.leafD); }
  rrect(c, -1000, GY + 185, 3100, 900, 0, D.leafDD);
  if (!o.noFlowers) { hibiscus(c, 70, 1105, 46, t, 0); hibiscus(c, 990, 1090, 40, t, 1.4); hibiscus(c, 140, 1180, 30, t, 2.2); }
}

/* ---------- bản Zip của tập: cánh trước và cánh sau đập so le (counter-stroke) ----------
   Như _shared/characters/cast/zip.js, chỉ khác phần cánh:
   - pose.cs 0..1: 0 = hai cặp cánh cùng pha (như rig dùng chung), 1 = cánh trước lên khi cánh sau xuống (so le 180°, FACTS §3);
   - pose.amp: biên độ đập (rad, mặc định .35 như rig chung; soi chậm dùng lớn hơn cho dễ thấy);
   - pose.tint 0..1: tô cánh trước màu chanh, cánh sau màu hồng (chỉ trong cảnh soi chậm) để trẻ phân biệt hai cặp cánh.
   Ghi chú: trong rig chung, công thức góc cánh sau là (−1)·sin(flap + π) = sin(flap), nên hai cặp cánh luôn cùng pha. Rig chung giữ nguyên. */
export const ZIP12 = {
  ...ZIP, id: 'zip',
  build(r, o = {}) {
    const P = { ...ZIP_POSE, cs: 0, amp: .35, tint: 0, wtilt: 0, ...(o.pose || {}) }, E = o.E || {}, L = P.lift, Y = y => y - L, K = ZIP_COL;
    const ang = front => P.amp * P.beat * Math.sin(P.flap + (front ? 0 : Math.PI * P.cs));
    const wing = (sd, front, da = 0, alpha = 1) => {
      const a = ang(front) + da, base = [sd * .14, Y(-.72), front ? .22 : -.02];
      const U = V.norm([sd * Math.cos(a), -Math.sin(a) * .9 - .16, front ? .12 : -.18]), W = [0, -.16 - P.wtilt * .26, (front ? .3 : .34) * (1 - .35 * P.wtilt)];
      const tc = front ? D.front : D.back;
      r.plane(base, V.mul(U, 1.55), W, c => {
        c.globalAlpha *= alpha;
        c.fillStyle = K.wing; c.beginPath(); c.ellipse(.5, 0, .5, .5, 0, 0, Math.PI * 2); c.fill();
        if (P.tint > 0) { c.save(); c.globalAlpha *= .85 * P.tint; c.fillStyle = tc; c.beginPath(); c.ellipse(.5, 0, .5, .5, 0, 0, Math.PI * 2); c.fill(); c.restore(); }
        c.strokeStyle = K.vein; c.lineWidth = .02; c.lineCap = 'round';
        for (const k of [-.22, 0, .22]) { c.beginPath(); c.moveTo(.03, k * .5); c.lineTo(.95, k * .8); c.stroke(); }
        c.fillStyle = K.spot; c.beginPath(); c.ellipse(.86, -.18, .055, .12, 0, 0, Math.PI * 2); c.fill();
      }, { bias: -.2, line: 'first' });
    };
    for (const sd of [-1, 1]) {
      if (P.blur > 0) for (const da of [-.42, .42]) { wing(sd, false, -da, .3 * P.blur); wing(sd, true, da, .3 * P.blur); }
      wing(sd, false); wing(sd, true);
    }
    // phần thân, chân, mắt: giống hệt rig chung (cast/zip.js)
    const segs = 7, pts = [];
    for (let i = 0; i <= segs; i++) { const u = i / segs, z = -.25 - 2.0 * u, y = Y(-.6) - P.curl * .6 * u * u + .08 * u; pts.push([0, y, z]); }
    r.limb(pts, .2, K.body, { bias: -.02 });
    for (let i = 1; i < segs; i += 2) r.ball(pts[i], .105, K.ring, { bias: -.019 });
    r.ball(pts[segs], .12, K.bodyD, { bias: -.018 });
    const feet = [[-.22, 0, .42], [-.28, 0, .18], [-.26, 0, -.06], [.22, 0, .42], [.28, 0, .18], [.26, 0, -.06]];
    feet.forEach((f, i) => {
      const sd = i < 3 ? -1 : 1, j = i % 3, hip = [sd * .1, Y(-.42), [.28, .14, 0][j]];
      const ft = (P.legsUp && P.legsUp[i]) || V.add(f, [0, L > 0 ? -L * .7 : 0, 0]), knee = V.lerp(hip, ft, .45); knee[0] += sd * .16; knee[1] -= .1;
      leg(r, hip, knee, ft, .045, C.ink, { toeDir: [sd * .2, 0, 1], bias: -.03 });
    });
    const TC = [0, Y(-.58), .12], TR = [.3, .28, .38];
    r.ell(TC, TR, K.body, { shade: { col: K.bodyD, k: .3 }, bias: .005 });
    for (const sd of [-1, 1]) r.decal(TC, TR, [sd * .7, -.45, .4], .12, c => { c.fillStyle = K.ring; c.beginPath(); c.ellipse(0, 0, 1.7, .55, sd * .6, 0, Math.PI * 2); c.fill(); }, { bias: .006 });
    const H = [0, Y(-.7), .62];
    r.ball(H, .26, K.body, { bias: .02 });
    for (const sd of [-1, 1]) {
      const Dm = [sd * .2, Y(-.86), .6];
      r.ball(Dm, .36, K.eye, { bias: .03, shade: { col: K.eyeD, k: .3 } });
      r.feat(Dm, .36, dirA(sd * .55, -.6), .09, c => { c.fillStyle = K.eyeL; c.beginPath(); c.arc(0, 0, 1, 0, Math.PI * 2); c.fill(); }, { bias: .002, cullAt: -.1 });
      const e = eyeOpts(E, sd, { lid: K.eye });
      if (P.look) e.look = P.look;
      r.feat(Dm, .36, dirA(sd * .32 + P.peek, -.05), .19, c => eye(c, e), { bias: .003, cullAt: -.15 });
    }
    r.feat(H, .26, dirA(0, .55), .1, c => mouth(c, E.mouth || 'smile', { ink: C.ink, tongue: C.pink, talk: E.talk ?? .6 }), { bias: .045, cullAt: -.3 });
  },
};

/* ---------- vệt gió: những nét cong phía sau hướng bay (toạ độ cảnh) ---------- */
export function windLines(c, x, y, dir, len, a, t, n = 4, col = 'rgba(255,253,240,') {
  if (a <= .02) return;
  c.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const oy = (i - (n - 1) / 2) * 26 + 6 * Math.sin(t * 20 + i), L = len * (.6 + .4 * hash(i + 3)), ox = -dir * (20 + 30 * hash(i + 5));
    c.strokeStyle = col + (.85 * a) + ')'; c.lineWidth = 9 - i % 2 * 3;
    c.beginPath(); c.moveTo(x + ox, y + oy); c.lineTo(x + ox - dir * L, y + oy); c.stroke();
  }
}
/* ---------- phanh: hai cụm "phụt" gió trước mũi ---------- */
export function brakePuff(c, x, y, dir, p) {
  if (p <= 0 || p >= 1) return;
  for (let i = 0; i < 4; i++) { const a = (i - 1.5) * .45, d = 20 + 70 * eo(p); circle(c, x + dir * Math.cos(a) * d, y + Math.sin(a) * d, (18 + 10 * i % 2) * (1 - p), `rgba(255,253,240,${.9 * (1 - p)})`); }
}
/* ---------- mũi tên lên / xuống trên cánh (toạ độ khung) ---------- */
export function strokeArrow(c, x, y, up, s, col, a = 1) {
  if (a <= .02) return;
  c.save(); c.globalAlpha *= a; c.translate(x, y); if (!up) c.scale(1, -1);
  const P = [[0, -s], [s * .8, -s * .1], [s * .32, -s * .1], [s * .32, s * .8], [-s * .32, s * .8], [-s * .32, -s * .1], [-s * .8, -s * .1]];
  c.fillStyle = 'rgba(30,27,58,.35)'; c.beginPath(); P.forEach(([px, py], i) => i ? c.lineTo(px + 6, py + 8) : c.moveTo(px + 6, py + 8)); c.closePath(); c.fill();
  c.fillStyle = col; c.beginPath(); P.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.closePath(); c.fill();
  c.strokeStyle = D.ink; c.lineWidth = 6; c.lineJoin = 'round'; c.stroke();
  c.restore();
}
/* ---------- sao va chạm nhẹ (gag): vài ngôi sao nhỏ quay vòng, không có gì đau ---------- */
export function bumpStars(c, x, y, p) {
  if (p <= 0 || p >= 1) return;
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + p * 5, d = 40 + 30 * eo(p); star(c, x + Math.cos(a) * d, y + Math.sin(a) * d * .45, 18 * (1 - p * .6), C.lemon); }
}
/* ---------- đường "đứng yên" chấm chấm ngang qua thân Zip (toạ độ khung) ---------- */
export function levelLine(c, x0, x1, y, a, t) {
  if (a <= .02) return;
  c.save(); c.globalAlpha *= a; c.setLineDash([22, 18]); c.lineDashOffset = 0; c.lineCap = 'round';
  c.strokeStyle = 'rgba(30,27,58,.55)'; c.lineWidth = 12; c.beginPath(); c.moveTo(x0, y + 4); c.lineTo(x1, y + 4); c.stroke();
  c.strokeStyle = C.cream; c.lineWidth = 7; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
  c.restore();
}
