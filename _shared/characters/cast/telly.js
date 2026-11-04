// Uncle Telly, ống nhòm: anh họ của Miss Loupe nên dựng cùng một ngữ pháp (kính ở trên, thân là cán, mặt trên thân, tay chân ống).
// Khác Miss Loupe: HAI ống kính thân xanh lá (leaf), tròng vàng chanh đặc (lemon), cao to hơn, miệng rộng, cười vang.
import { C } from '../../kit.js';
import { V } from '../rig.js';
import { X } from '../parts.js';
import { eye, mouth, cheek, eyeOpts } from '../face.js';
import { mitt } from './loupe.js';
const TAU = Math.PI * 2;

const SH = { L: [-.4, -1.32, 0], R: [.4, -1.32, 0] }, HIP = { L: [-.22, -.56, 0], R: [.22, -.56, 0] };
export const TELLY_POSE = {
  handL: [-.9, -1.15, 0], handR: [.9, -1.15, 0], elbowL: null, elbowR: null, footL: [-.22, -.18, 0], footR: [.22, -.18, 0],
  pointL: null, pointR: null, thumbL: null, thumbR: null, lensPitch: 0, glint: 0,
};

export const TELLY = {
  id: 'telly', name: 'Uncle Telly', h: 4.25, top: -4.25, w: 2.8, realH: 1.13, kind: 'object',
  face: { c: [0, -1.5, 0], r: .62 }, head: { c: [0, -2.15, 0], r: .85 },
  build(r, o = {}) {
    const P = { ...TELLY_POSE, ...(o.pose || {}) }, E = o.E || {};
    const body = C.leaf, dark = C.leafD, acc = C.lemon;
    for (const s of ['L', 'R']) {
      const sx = s === 'L' ? -1 : 1, f = P['foot' + s];
      r.cap(HIP[s], f, .16, dark, { bias: -.05 });
      r.ell(V.add(f, [sx * .06, .07, .07]), [.23, .13, .28], acc, { bias: -.04 });
    }
    r.cap([0, -1.9, 0], [0, -.66, 0], 1.0, body, { shade: { col: dark, k: .34, dx: -1, dy: -.1 } });
    r.flat(.01, c => { c.fillStyle = acc; c.beginPath(); c.roundRect(r.X([0, 0, 0]) - .46, -2.48, .92, .2, .1); c.fill(); });
    // mặt to, miệng rộng
    const FC = [0, -1.62, -.3], RV = .8, phi = Math.asin(.3 / RV);
    for (const sd of [-1, 1]) {
      const eo = eyeOpts(E, sd, { lid: body });
      r.feat(FC, RV, [Math.sin(sd * phi), 0, Math.cos(sd * phi)], .27, c => eye(c, eo));
      const cp = Math.asin(.4 / RV);
      r.feat([0, -1.18, -.3], RV, [Math.sin(sd * cp), 0, Math.cos(sd * cp)], E.fx === 'blush' ? .15 : .11, c => cheek(c), { bias: .001, cullAt: -.1 });
    }
    r.feat([0, -1.08, -.3], RV, [0, 0, 1], .24, c => mouth(c, E.mouth || 'smile', { talk: E.talk ?? .6, lw: .32 }), { cullAt: -.3 });
    for (const s of ['L', 'R']) {
      const pts = [SH[s], P['elbow' + s], P['hand' + s]].filter(Boolean);
      r.limb(pts, .17, dark, { z: Math.max(r.Z(P['hand' + s]), r.Z(SH[s])) - .02 });
      mitt(r, P['hand' + s], .16, acc, { point: P['point' + s], thumb: P['thumb' + s], bias: .001 });
    }
    // cổ nối hai ống
    r.cap([0, -2.62, 0], [0, -3.0, 0], .42, dark, { bias: .1 });
    // hai ống kính: trụ xanh lá chĩa về phía trước, đầu trước là tròng vàng chanh, đầu sau là thị kính mực
    const pc = Math.cos(P.lensPitch), ps = Math.sin(P.lensPitch), ax = [0, -ps, pc];
    for (const sd of [-1, 1]) {
      const c0 = [sd * .66, -3.38, 0];
      r.lathe(c0, ax, .55, .62, .62, t => t > .86 ? X.leafL : body, { profile: () => 1, bias: .2, n: 14 });
      const fr = V.add(c0, V.mul(ax, .56)), bk = V.add(c0, V.mul(ax, -.62));
      const U = [.62, 0, 0], W = [0, .62 * pc, .62 * ps];
      r.plane(fr, U, W, (c, f) => { if (f <= 0) return; c.fillStyle = dark; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); c.fillStyle = acc; c.beginPath(); c.arc(0, 0, .74, 0, TAU); c.fill(); c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = .1; c.lineCap = 'round'; c.beginPath(); c.arc(0, 0, .5, Math.PI * 1.1, Math.PI * 1.4); c.stroke(); if (P.glint) { c.fillStyle = C.white; c.beginPath(); c.arc(-.25, -.25, .18, 0, TAU); c.fill(); } }, { bias: .21 });
      r.plane(bk, U, W, (c, f) => { if (f >= 0) return; c.fillStyle = dark; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); c.fillStyle = C.ink; c.beginPath(); c.arc(0, 0, .55, 0, TAU); c.fill(); }, { bias: .21 });
    }
    // cầu nối + bánh xe chỉnh nét
    r.cap([-.66, -3.38, 0], [.66, -3.38, 0], .5, dark, { bias: .205 });
    r.ell([0, -3.78, 0], [.2, .1, .2], acc, { bias: .22 });
  },
  exprPose: {
    happy: {}, surprised: { handL: [-1.0, -1.65, .1], handR: [1.0, -1.65, .1] }, curious: { handR: [.5, -1.5, .55], elbowR: [.8, -1.05, .3] },
    worried: { handL: [-.15, -1.0, .55], handR: [.15, -1.0, .55], elbowL: [-.6, -.95, .25], elbowR: [.6, -.95, .25] }, sad: { handL: [-.7, -.75, 0], handR: [.7, -.75, 0] },
    confident: { handL: [-.5, -.75, .05], handR: [.5, -.75, .05], elbowL: [-.98, -1.0, 0], elbowR: [.98, -1.0, 0] }, confused: { handR: [.5, -2.55, .2], elbowR: [1.0, -1.85, .1] },
    excited: { handL: [-.95, -2.3, .05], handR: [.95, -2.3, .05] }, thinking: { handR: [.2, -.98, .62], elbowR: [.75, -.85, .3] },
    explaining: { handR: [1.05, -2.2, .1], elbowR: [1.02, -1.55, 0], pointR: [0, -1, 0] },
  },
};
