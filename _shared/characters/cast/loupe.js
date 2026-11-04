// Miss Loupe: kính lúp biết đi. Đơn vị: bán kính kính = 1, mặt đất y = 0. Giữ đúng tỷ lệ của lup() trong pilot.
import { C } from '../../kit.js';
import { V, rotX, rotZ, mmul, mvec } from '../rig.js';
import { eye, mouth, cheek, eyeOpts, fx } from '../face.js';
const TAU = Math.PI * 2;
export const GLASS = '#DFF9FF';

// Vành kính: mặt sau tối lệch theo độ dày, mặt trước berry, kính trong, hai vệt sáng.
// inside(c) vẽ cảnh phóng to bên trong kính (toạ độ của mặt kính, bán kính 0.85).
// bao lồi của các điểm 2D (để vẽ cạnh dày của vành kính khi nhìn nghiêng)
function hull(pts) {
  pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const p of pts) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of pts.reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
export function lensRing(r, LC, M, o = {}) {
  const { rim = C.berry, rimD = C.berryD, glass = GLASS, inside = null, t = .2, k = 1, bias = .2, smudge = null } = o;
  let n = mvec(M, [0, 0, 1]); const U = V.mul(mvec(M, [1, 0, 0]), k), W = V.mul(mvec(M, [0, 1, 0]), k);
  if (r.Z(n) < 0) n = V.mul(n, -1);                     // mặt gần người xem luôn là mặt sáng
  const back = V.sub(LC, V.mul(n, t / 2)), front = V.add(LC, V.mul(n, t / 2));
  const ring = (c, col) => { c.fillStyle = col; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.arc(0, 0, .85, 0, TAU, true); c.fill('evenodd'); };
  // cạnh vành: bao lồi của vành sau và vành trước
  const pts = [];
  for (const O of [back, front]) for (let i = 0; i < 48; i++) { const a = i * TAU / 48, p = V.add(O, V.add(V.mul(U, Math.cos(a)), V.mul(W, Math.sin(a)))); pts.push([r.X(p), p[1]]); }
  const H = hull(pts), F = r.P(front);
  r.flat(r.Z(back) + bias - .01, c => {
    c.fillStyle = rimD; c.beginPath(); H.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath();
    if (!glass) { c.save(); c.transform(r.X(U), U[1], r.X(W), W[1], F[0], F[1]); c.moveTo(.85, 0); c.arc(0, 0, .85, 0, TAU); c.restore(); c.fill('evenodd'); } else c.fill();
  });
  r.plane(front, U, W, (c, f) => {
    if (glass) { c.fillStyle = glass; c.beginPath(); c.arc(0, 0, .86, 0, TAU); c.fill(); }
    if (inside) { c.save(); c.beginPath(); c.arc(0, 0, .86, 0, TAU); c.clip(); inside(c, f); c.restore(); }
    if (smudge) smudge(c, f);
    ring(c, rim);
    c.fillStyle = rimD; c.beginPath(); c.arc(0, 0, 1, .2, 1.8); c.arc(0, 0, .9, 1.8, .2, true); c.closePath(); c.fill();
    if (!glass) return;                                   // vệt sáng chỉ có trên mặt kính
    c.strokeStyle = 'rgba(255,255,255,.78)'; c.lineCap = 'round'; c.lineWidth = .07;
    const s = f >= 0 ? 1 : -1; c.scale(s, 1);
    c.beginPath(); c.arc(0, 0, .68, Math.PI * 1.08, Math.PI * 1.36); c.stroke();
    c.beginPath(); c.arc(0, 0, .68, Math.PI * 1.45, Math.PI * 1.5); c.stroke();
  }, { bias });
}

// bàn tay tròn (mango); ngón trỏ khi chỉ
export function mitt(r, p, rad, col, o = {}) {
  r.ball(p, rad, col, { bias: o.bias || 0 });
  if (o.point) { const d = V.norm(o.point), tip = V.add(p, V.mul(d, rad * 1.45)); r.cap(p, tip, rad * .62, col, { bias: (o.bias || 0) + .001 }); }
  if (o.thumb) { const tip = V.add(p, V.mul(V.norm(o.thumb), rad * 1.15)); r.cap(p, tip, rad * .58, col, { bias: (o.bias || 0) + .001 }); }
}

const SH = { L: [-.3, -1.05, 0], R: [.3, -1.05, 0] }, HIP = { L: [-.17, -.48, 0], R: [.17, -.48, 0] };
export const LOUPE_POSE = {
  handL: [-.72, -.93, 0], handR: [.72, -.93, 0], elbowL: null, elbowR: null,
  footL: [-.17, -.17, 0], footR: [.17, -.17, 0], lensPitch: 0, lensRoll: 0, pointL: null, pointR: null, thumbL: null, thumbR: null,
  inside: null, smudge: null, glass: GLASS, scarf: false,
};

export const LOUPE = {
  id: 'loupe', name: 'Miss Loupe', h: 3.75, top: -3.75, w: 2.3, realH: 1.0, kind: 'object',
  face: { c: [0, -1.2, 0], r: .5 }, head: { c: [0, -1.85, 0], r: .72 },
  lid: C.berry, ink: C.ink,
  build(r, o = {}) {
    const P = { ...LOUPE_POSE, ...(o.pose || {}) }, E = o.E || {};
    const body = C.berry, dark = C.berryD, acc = C.mango;
    // chân, giày
    for (const s of ['L', 'R']) {
      const sx = s === 'L' ? -1 : 1, f = P['foot' + s];
      r.cap(HIP[s], f, .13, dark, { bias: -.05 });
      r.ell(V.add(f, [sx * .05, .065, .06]), [.19, .11, .23], acc, { bias: -.04 });
    }
    // thân là cán kính
    r.cap([0, -1.53, 0], [0, -.53, 0], .78, body, { shade: { col: dark, k: .34, dx: -1, dy: -.12 } });
    r.flat(r.Z([0, 0, 0]) + .01, c => { c.fillStyle = acc; c.beginPath(); c.roundRect(r.X([0, 0, 0]) - .36, -1.79, .72, .17, .08); c.fill(); });
    if (P.scarf) {
      r.flat(r.Z([0, 0, 0]) + .015, c => { c.fillStyle = C.sky; c.beginPath(); c.roundRect(r.X([0, 0, 0]) - .44, -1.62, .88, .2, .1); c.fill(); });
      r.cap([.16, -1.5, .3], [.26, -1.05, .36], .16, C.skyL, { bias: .02 });
    }
    // mặt: trên một trụ ảo đặt lùi sau mặt thân để mắt to vẫn tròn khi nhìn thẳng
    const FC = [0, -1.31, -.21], RV = .6, phi = Math.asin(.25 / RV);
    for (const sd of [-1, 1]) {
      const eo = eyeOpts(E, sd, { lid: body });
      r.feat(FC, RV, [Math.sin(sd * phi), 0, Math.cos(sd * phi)], .235, c => eye(c, eo));
      const cp = Math.asin(.32 / RV);
      if (!(E.fx === 'blush')) r.feat([0, -.95, -.21], RV, [Math.sin(sd * cp), 0, Math.cos(sd * cp)], .09, c => cheek(c), { bias: .001, cullAt: -.1 });
    }
    if (E.fx === 'blush') for (const sd of [-1, 1]) { const cp = Math.asin(.32 / RV); r.feat([0, -.95, -.21], RV, [Math.sin(sd * cp), 0, Math.cos(sd * cp)], .13, c => cheek(c), { bias: .001 }); }
    r.feat([0, -.89, -.21], RV, [0, 0, 1], .16, c => mouth(c, E.mouth || 'smile', { talk: E.talk ?? .6, lw: .34 }), { cullAt: -.3 });
    // tay (sau thân khi nhìn thẳng, trước thân khi tay gần người xem)
    for (const s of ['L', 'R']) {
      const pts = [SH[s], P['elbow' + s], P['hand' + s]].filter(Boolean);
      const z = r.Z(P['hand' + s]), sz = r.Z(SH[s]);
      r.limb(pts, .14, dark, { z: Math.max(z, sz) - .02, bias: 0 });
      mitt(r, P['hand' + s], .13, acc, { point: P['point' + s], thumb: P['thumb' + s], bias: .001 });
    }
    // kính
    const piv = [0, -1.72, 0], M = mmul(rotZ(P.lensRoll), rotX(P.lensPitch));
    const LC = V.add(piv, mvec(M, [0, -1.01, 0]));
    lensRing(r, LC, M, { inside: P.inside, smudge: P.smudge, glass: P.glass });
    this.lensCenter = LC;
  },
  // dáng tay theo biểu cảm (dùng cho bảng biểu cảm)
  exprPose: {
    happy: {}, surprised: { handL: [-.82, -1.25, .1], handR: [.82, -1.25, .1] },
    curious: { handR: [.42, -1.15, .45], elbowR: [.6, -.85, .25] },
    worried: { handL: [-.12, -.8, .45], handR: [.12, -.8, .45], elbowL: [-.5, -.75, .2], elbowR: [.5, -.75, .2] },
    sad: { handL: [-.55, -.62, 0], handR: [.55, -.62, 0] },
    confident: { handL: [-.38, -.6, .05], handR: [.38, -.6, .05], elbowL: [-.75, -.82, 0], elbowR: [.75, -.82, 0] },
    confused: { handR: [.36, -1.98, .2], elbowR: [.75, -1.4, .1] },
    excited: { handL: [-.72, -1.75, .05], handR: [.72, -1.75, .05] },
    thinking: { handR: [.16, -.78, .5], elbowR: [.58, -.68, .25] },
    explaining: { handR: [.82, -1.7, .1], elbowR: [.8, -1.2, 0], pointR: [0, -1, 0] },
  },
};
