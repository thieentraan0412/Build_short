// Waggle, ong mật. Theo bee() của pilot: vàng chanh, sọc mực, ngòi mực, cánh trong, râu mực đầu tròn.
// Sửa so với pilot (bee() chỉ có một khối, không chân): 3 phần thân, 6 chân, 4 cánh, 5 mắt (2 mắt to + 3 mắt đơn trên đỉnh đầu, tập 8 cần).
import { C } from '../../kit.js';
import { V } from '../rig.js';
import { X, bugFace, dirA, leg, antenna, glassWing } from '../parts.js';
const TAU = Math.PI * 2;

export const WAGGLE_POSE = { lift: .42, wing: 0, wag: 0, legsUp: null, pitch: 0, ocelliBlink: [1, 1, 1] };

export const WAGGLE = {
  id: 'waggle', name: 'Waggle', h: 2.65, top: -2.65, w: 2.4, realH: .15, kind: 'bug', hover: true,
  face: { c: [0, -1.5, .8], r: .48 }, head: { c: [0, -1.7, .5], r: .75 },
  build(r, o = {}) {
    const P = { ...WAGGLE_POSE, ...(o.pose || {}) }, E = o.E || {}, L = P.lift, Y = y => y - L;
    // bụng sọc: khối tròn xoay, đuôi có ngòi
    const ac = [0, Y(-.98), -.55], ax = V.norm([Math.sin(P.wag) * .5, Math.sin(P.pitch) * .3 + .18, -1]);
    r.lathe(ac, ax, .8, .6, .62, t => (t > -.64 && t < -.38) || (t > .2 && t < .44) || t > .96 ? C.ink : C.lemon, { bias: 0 });
    const tip = V.add(ac, V.mul(ax, .86)), tip2 = V.add(ac, V.mul(ax, 1.14));
    r.cap(tip, tip2, .1, C.ink, { bias: -.01 });
    // ngực (xoài, đậm hơn để thấy đủ 3 phần)
    r.ell([0, Y(-1.08), .22], [.44, .44, .36], C.mango, { bias: .02 });
    // 4 cánh trong suốt
    const base = [0, Y(-1.44), .18];
    for (const sd of [-1, 1]) {
      const b = P.wing, up = V.norm([sd * Math.sin(.32 + b * .5), -Math.cos(.32 + b * .5), 0]);
      glassWing(r, V.add(base, [sd * .1, 0, 0]), V.mul(up, 1.12), V.mul(V.norm([sd * .5, 0, -1]), .62), { len: 1, wid: .5, bias: -.25 });
      glassWing(r, V.add(base, [sd * .1, .1, -.18]), V.mul(V.norm([sd * Math.sin(.9 + b * .4), -Math.cos(.9 + b * .4), 0]), .72), V.mul(V.norm([sd * .5, 0, -1]), .46), { len: 1, wid: .45, bias: -.26 });
    }
    // 6 chân mực, buông khi bay
    const feet = [[-.34, Y(-.22), .62], [-.42, Y(-.12), .18], [-.36, Y(-.18), -.3], [.34, Y(-.22), .62], [.42, Y(-.12), .18], [.36, Y(-.18), -.3]];
    feet.forEach((f, i) => {
      const sd = i < 3 ? -1 : 1, j = i % 3, hip = [sd * .2, Y(-.78), [.42, .24, .06][j]];
      const ft = (P.legsUp && P.legsUp[i]) || f, knee = V.lerp(hip, ft, .5); knee[0] += sd * .14; knee[1] -= .05;
      leg(r, hip, knee, ft, .08, C.ink, { toeDir: [sd * .2, .3, 1], bias: .01 });
    });
    // đầu, 2 mắt to, 3 mắt đơn
    const H = [0, Y(-1.12), .78];
    r.ball(H, .46, C.lemon, { bias: .05 });
    bugFace(r, H, .46, E, { eyeA: .44, eyeEl: -.16, eyeR: .44, lid: C.lemon, cheekA: .9, cheekEl: .3, mouthEl: .5, mouthW: .26 });
    [[-.2, -.86], [0, -.98], [.2, -.86]].forEach(([a, el], i) => r.feat(H, .46, dirA(a, el), .055, c => { c.fillStyle = C.ink; c.beginPath(); c.ellipse(0, 0, 1, Math.max(.12, P.ocelliBlink[i]), 0, 0, TAU); c.fill(); }, { cullAt: -.6, flat: true }));
    // râu gãy khúc, đầu tròn
    for (const sd of [-1, 1]) antenna(r, [[sd * .1, Y(-1.5), .98], [sd * .2, Y(-1.82), 1.1], [sd * .34, Y(-1.98), 1.32]], .055, C.ink, { club: .085, bias: .06 });
  },
  exprPose: {
    surprised: { lift: .55, wing: .6 }, worried: { lift: .32 }, sad: { lift: .2, wing: -.3 }, excited: { lift: .6, wing: 1, wag: .3 },
    confused: { wag: -.2 }, thinking: { legsUp: [[-.3, -1.28, 1.15], 0, 0, 0, 0, 0] }, explaining: { legsUp: [0, 0, 0, [.42, -1.7, 1.0], 0, 0] },
    curious: { pitch: .2 },
  },
};
