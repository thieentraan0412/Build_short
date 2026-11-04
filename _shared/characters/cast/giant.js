// The Giant: bàn tay và bàn chân của một bạn nhỏ. KHÔNG BAO GIỜ thấy mặt; cổ tay / cổ chân luôn ra khỏi khung.
// Màu da theo pilot (skin, skinD). Tay mũm mĩm, ngón ngắn tròn. Không bao giờ bắt, cầm hay đè côn trùng.
import { C } from '../../kit.js';
import { V, rotX, rotY, rotZ, mmul, mvec } from '../rig.js';
import { X } from '../parts.js';
const TAU = Math.PI * 2;

// cử chỉ bàn tay: độ gập từng ngón (0 duỗi, 1 nắm), ngón cái
export const GESTURE = {
  open: { f: [0, 0, 0, 0], th: 0 }, point: { f: [0, 1, 1, 1], th: .8 }, thumbs: { f: [1, 1, 1, 1], th: -1 }, wave: { f: [0, 0, 0, 0], th: 0, spread: 1.3 },
  fist: { f: [1, 1, 1, 1], th: .9 }, soft: { f: [.35, .35, .35, .35], th: .3 }, peace: { f: [0, 0, 1, 1], th: .8 }, count1: { f: [0, 1, 1, 1], th: .8 },
  spread: { f: [0, 0, 0, 0], th: -.3, spread: 1.8 }, curl: { f: [.6, .7, .8, .9], th: .5 }, tap: { f: [.15, 1, 1, 1], th: .8 },
};

export const GIANT_POSE = { part: 'hand', gesture: 'open', rot: [0, 0, 0], palm: 1, foot: 'flat', toeWiggle: 0, shadow: false };

function hand(r, P) {
  const G = { ...GESTURE.open, ...(GESTURE[P.gesture] || {}) };
  const M = mmul(rotZ(P.rot[2]), mmul(rotY(P.rot[1]), rotX(P.rot[0])));
  const T = p => mvec(M, p), sk = C.skin, skd = C.skinD;
  // cổ tay đi ra khỏi khung (xuống dưới)
  r.cap(T([0, .2, 0]), T([0, 3.5, 0]), 1.2, sk, { shade: { col: skd, k: .3, dx: -1, dy: 0 } });
  r.ell(T([0, -.55, 0]), [.95, .9, .34], sk, { rot: M, shade: { col: skd, k: .25 }, bias: .01 });
  // 4 ngón + ngón cái
  const xs = [-.62, -.21, .21, .6], lens = [1.0, 1.2, 1.12, .82], spread = G.spread || 1;
  xs.forEach((x, i) => {
    const bend = G.f[i], base = [x * .95, -1.25, 0], ang = (x * .12) * spread;
    const dir = V.norm([Math.sin(ang), -Math.cos(ang) * (1 - bend * .9), bend * 1.2 * P.palm]);
    const tip = V.add(base, V.mul(dir, lens[i] * (1 - bend * .45)));
    r.cap(T([base[0], base[1] + .25, 0]), T(tip), .42, sk, { bias: .02 + (bend > .5 ? .03 : 0) });
    if (bend < .6) r.decal(T(tip), [.21, .21, .21], mvec(M, [0, -.25, -1]), .1, c => { c.fillStyle = X.skinL; c.beginPath(); c.ellipse(0, 0, 1, 1.2, 0, 0, TAU); c.fill(); }, { bias: .03 });
  });
  const th = G.th, tb = [.82, -.35, .15], ttip = th < 0 ? [.75, -1.55, .2] : [1.4 - th * .9, -.95 + th * .35, .2 + th * .4];
  r.cap(T(tb), T(ttip), .44, sk, { bias: .04 });
  // chỉ tay: chỉ thấy ở mặt lòng bàn tay
  r.plane(T([0, -.55, .35]), mvec(M, [1, 0, 0]), mvec(M, [0, 1, 0]), c => { c.strokeStyle = skd; c.lineWidth = .08; c.lineCap = 'round'; c.beginPath(); c.moveTo(-.35, -.3); c.quadraticCurveTo(0, -.12, .32, -.22); c.moveTo(-.3, .1); c.quadraticCurveTo(-.05, .2, .15, .28); c.stroke(); }, { cull: true, bias: .015 });
}

function foot(r, P) {
  const sk = C.skin, skd = C.skinD, w = P.toeWiggle;
  const lift = P.foot === 'tiptoe' ? 1 : 0, M = rotX(-lift * .5);
  const T = p => V.add(mvec(M, V.sub(p, [0, 0, 1.6])), [0, -lift * .3, 1.6]);
  r.cap(T([0, -1.2, -.1]), [0, -9, -.1 - lift * .6], 1.6, sk, { shade: { col: skd, k: .32, dx: -1, dy: 0 } });
  r.ell(T([0, -.6, .55]), [.95, .6, 1.55], sk, { shade: { col: skd, k: .3 } });
  const toes = [[.62, .5, .3, 2.05], [.3, .38, .26, 2.12], [.0, .34, .23, 2.06], [-.28, .31, .21, 1.94], [-.52, .29, .19, 1.76]];
  toes.forEach(([x, rr, _, z], i) => {
    const up = Math.max(0, Math.sin(w * 12 + i * .9)) * .2 * Math.min(1, w);
    const p = T([x * .95 - .02, -rr - up, z]);
    r.ball(p, rr, i === 0 ? sk : sk, { bias: .02 + i * .001, shade: { col: skd, k: .2 } });
    r.decal(p, [rr, rr, rr], [0, -.55, .8], rr * .4, c => { c.fillStyle = X.skinL; c.beginPath(); c.ellipse(0, 0, 1, .8, 0, 0, TAU); c.fill(); }, { bias: .003 });
  });
}

export const GIANT = {
  id: 'giant', name: 'The Giant', h: 5.2, top: -5.2, w: 3.2, realH: 1.25, kind: 'giant', noFace: true,
  face: { c: [0, -2.4, 0], r: 1.4 }, head: { c: [0, -2.6, 0], r: 1.5 },
  build(r, o = {}) {
    const P = { ...GIANT_POSE, ...(o.pose || {}) };
    if (P.part === 'foot') return foot(r, P);
    hand(wrapShift(r, [0, -2.4, 0]), P);   // dời bàn tay lên để cổ tay nằm ở mặt đất của ô
  },
  // "biểu cảm" của The Giant là cử chỉ tay (không có mặt)
  exprPose: {
    happy: { gesture: 'wave', rot: [0, .2, .12] }, surprised: { gesture: 'spread', rot: [0, 0, 0] }, curious: { gesture: 'tap', rot: [.6, .3, -.5] },
    worried: { gesture: 'curl', rot: [.2, .3, .1] }, sad: { gesture: 'soft', rot: [.9, .3, .3] }, confident: { gesture: 'thumbs', rot: [0, -.2, 0], palm: -1 },
    confused: { gesture: 'soft', rot: [0, 1.0, .5] }, excited: { gesture: 'spread', rot: [0, 0, -.25] }, thinking: { gesture: 'tap', rot: [.3, .8, .2] },
    explaining: { gesture: 'point', rot: [0, -.25, .45] },
  },
};
// dời toàn bộ toạ độ của một rig (để bàn tay đứng trong ô như các nhân vật khác)
function wrapShift(r, off) {
  const S = p => V.add(p, off);
  return {
    detail: r.detail, yaw: r.yaw, X: p => r.X(p), Z: p => r.Z(p), P: p => r.P(S(p)),
    ball: (p, ...a) => r.ball(S(p), ...a), ell: (p, ...a) => r.ell(S(p), ...a), cap: (a, b, ...x) => r.cap(S(a), S(b), ...x),
    limb: (pts, ...a) => r.limb(pts.map(S), ...a), plane: (O, ...a) => r.plane(S(O), ...a), feat: (c0, ...a) => r.feat(S(c0), ...a),
    decal: (c0, ...a) => r.decal(S(c0), ...a), flat: (z, fn) => r.flat(z, fn), lathe: (c0, ...a) => r.lathe(S(c0), ...a),
  };
}
