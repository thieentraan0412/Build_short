// Crumb, kiến con: hổ phách (honey), chân honeyD, đầu to như em bé, hai râu gập khuỷu cuộn đầu.
// Khi hỏi, râu cuộn thành hai dấu "?". Luôn vác một vật to hơn mình. Kiến thợ: KHÔNG có cánh.
import { C } from '../../kit.js';
import { V } from '../rig.js';
import { X, bugFace, leg } from '../parts.js';
const TAU = Math.PI * 2;

// vụn bánh: khối tròn méo màu mật sáng, vài hạt đậm
export function cookieCrumb(r, p, s, bias = .2) {
  r.ell(p, [s * 1.1, s * .78, s * .9], C.honeyL, { bias, shade: { col: C.honey, k: .3 } });
  [[-.4, -.3, .7], [.35, -.1, .75], [-.05, .35, .8], [.5, .4, .6]].forEach(([a, b, z], i) => r.decal(p, [s * 1.1, s * .78, s * .9], [a, b, z], s * (.13 + (i % 2) * .05), c => { c.fillStyle = C.honeyD; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); }, { bias: .003 }));
}
// râu: cuống thẳng lên tới khuỷu, phần sau là đường cong; q = 0 móc nhẹ, 1 = dấu hỏi tròn
// reach 0..1: râu nghiêng về phía trước (mặt nhân vật, +z) để chạm đầu râu với kiến khác (SHORT-005). 0 = như cũ.
export const antennaElbow = (sd, y, reach = 0) => [sd * (.22 - .06 * reach), y + .12 * reach, .34 + .28 * reach];
export const antennaU = (sd, reach = 0) => [sd * (.42 - .36 * reach), 0, .5 * reach];
function antennaQ(r, base, elbow, sd, q, col, reach = 0) {
  r.limb([base, elbow], .07, col, { bias: .06 });
  r.plane(elbow, antennaU(sd, reach), [0, .42, 0], c => {
    c.strokeStyle = col; c.lineWidth = .16; c.lineCap = 'round'; c.beginPath();
    if (q > .5) { c.moveTo(0, 0); c.lineTo(0, -.35); c.arc(.42, -.78, .55, Math.PI * .72, Math.PI * 1.95 + .9); }   // dấu hỏi
    else { c.moveTo(0, 0); c.quadraticCurveTo(.1, -.9, .62, -1.05); c.quadraticCurveTo(1.0, -1.1, 1.0, -.72); }   // móc nhẹ
    c.stroke();
    if (q > .5) { c.fillStyle = col; c.beginPath(); c.arc(1.02, -.6, .12, 0, TAU); c.fill(); }
  }, { bias: .061 });
}

export const CRUMB_POSE = {
  lift: 0, carry: 'crumb', armL: [-.32, -2.5, .25], armR: [.32, -2.5, .25], q: 0,
  feet: [[-.4, 0, .3], [-.48, 0, -.1], [.4, 0, .3], [.48, 0, -.1]], prop: null, bodyLean: 0, reach: 0,
};

export const CRUMB = {
  id: 'crumb', name: 'Crumb', h: 3.0, top: -3.0, w: 1.8, realH: .12, kind: 'bug',
  face: { c: [0, -1.6, .2], r: .5 }, head: { c: [0, -1.75, 0], r: .62 },
  expr: { curious: { q: 1 }, confused: { q: 1, fx: null }, thinking: { q: 1, fx: null } },
  build(r, o = {}) {
    const P = { ...CRUMB_POSE, ...(o.pose || {}) }, E = o.E || {}, L = P.lift, Y = y => y - L, lean = P.bodyLean;
    const body = C.honey, dark = C.honeyD;
    // bụng (gaster) thấp phía sau, eo nhỏ, ngực dựng
    r.ell([0, Y(-.52), -.5 - lean * .2], [.38, .36, .46], body, { rot: [[1, 0, 0], [0, .9, .44], [0, -.44, .9]], shade: { col: dark, k: .26 } });
    r.ball([0, Y(-.72), -.1], .12, body, { bias: .01 });
    r.ell([0, Y(-1.0), .02 + lean * .1], [.22, .32, .22], body, { bias: .02, rot: [[1, 0, 0], [0, .94, -.34], [0, .34, .94]] });
    // 4 chân đứng (giữa, sau)
    [[-1, .02, 0], [-1, -.12, 1], [1, .02, 2], [1, -.12, 3]].forEach(([sd, hz, i]) => {
      const hip = [sd * .14, Y(-.86), hz], ft = P.feet[i], knee = V.lerp(hip, ft, .5); knee[0] += sd * .16; knee[1] -= .14;
      leg(r, hip, knee, ft, .085, dark, { toeDir: [sd * .25, 0, 1], bias: -.02 });
    });
    // 2 chân trước làm tay (giơ cao đỡ đồ)
    for (const [sd, k] of [[-1, 'armL'], [1, 'armR']]) {
      const sh = [sd * .16, Y(-1.18), .1], hd = V.add(P[k], [0, -L, 0]), el = V.lerp(sh, hd, .5); el[0] += sd * .2;
      r.limb([sh, el, hd], .085, dark, { bias: .07 });
      r.ball(hd, .07, dark, { bias: .071 });
    }
    // đầu to, mặt em bé
    const H = [0, Y(-1.58), .14];
    r.ball(H, .5, body, { bias: .05, shade: { col: dark, k: .18 } });
    bugFace(r, H, .5, E, { eyeA: .38, eyeEl: -.04, eyeR: .4, lid: body, cheekA: .74, cheekEl: .3, mouthEl: .46, mouthW: .24 });
    const q = E.q ?? P.q, rr = Array.isArray(P.reach) ? P.reach : [P.reach || 0, P.reach || 0];
    for (const sd of [-1, 1]) { const re = rr[sd < 0 ? 0 : 1]; antennaQ(r, [sd * .14, Y(-1.98), .3], antennaElbow(sd, Y(-2.32), re), sd, q, dark, re); }
    // đồ vác trên đầu
    if (P.carry === 'crumb') cookieCrumb(r, V.add(V.lerp(P.armL, P.armR, .5), [0, -.44 - L, -.05]), .5, .2);
    if (P.prop) P.prop(r, P);
  },
  exprPose: {
    surprised: { armL: [-.62, -1.72, .3], armR: [.62, -1.72, .3], carry: null, lift: .1 }, sad: { armL: [-.3, -.85, .4], armR: [.3, -.85, .4], carry: null },
    worried: { armL: [-.12, -1.2, .62], armR: [.12, -1.2, .62], carry: null }, curious: { armL: [-.3, -2.5, .25], armR: [.62, -1.5, .5] },
    confident: { armL: [-.26, -2.55, .2], armR: [.62, -2.3, .2] }, confused: { armL: [-.5, -1.3, .5], armR: [.5, -1.3, .5], carry: null },
    excited: { armL: [-.62, -2.45, .2], armR: [.62, -2.45, .2], carry: null, lift: .2 }, thinking: { armR: [.18, -1.32, .62], armL: [-.4, -.9, .4], carry: null },
    explaining: { armR: [.5, -2.5, .4], armL: [-.4, -1.0, .4], carry: null }, happy: {},
  },
};
