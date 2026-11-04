// Blink, đom đóm. Thân bạc hà, đuôi phát sáng vàng chanh; nhỏ, tròn, cánh cứng khép như áo choàng.
// Đom đóm là bọ cánh cứng: đầu (dưới tấm khiên), ngực (tấm khiên như mũ trùm), bụng (dưới áo choàng cánh cứng) + đèn đuôi.
import { C } from '../../kit.js';
import { V } from '../rig.js';
import { X, bugFace, leg, antenna, glassWing, halo } from '../parts.js';

export const BLINK_POSE = { lift: 0, glow: .7, fly: 0, legsUp: null, tailUp: 0 };

export const BLINK = {
  id: 'blink', name: 'Blink', h: 1.95, top: -1.95, w: 1.9, realH: .1, kind: 'bug',
  face: { c: [0, -.98, .62], r: .4 }, head: { c: [0, -1.25, .3], r: .75 },
  build(r, o = {}) {
    const P = { ...BLINK_POSE, ...(o.pose || {}) }, E = o.E || {}, L = P.lift, Y = y => y - L;
    const g = P.glow;
    // đèn đuôi (thò ra sau áo choàng)
    const tail = [0, Y(-.62 + P.tailUp * .2), -.78];
    if (g > .05) halo(r, tail, .36, .6 + g * .6);
    r.ell(tail, [.4, .36, .4], g > .05 ? C.lemon : C.cream, { bias: -.02, shade: { col: g > .05 ? C.mango : X.creamD, k: .25 } });
    r.ell(V.add(tail, [0, .02, .2]), [.42, .3, .2], X.mintD, { bias: -.019 });
    // cánh trong khi bay
    if (P.fly > 0) for (const sd of [-1, 1]) glassWing(r, [sd * .2, Y(-1.15), -.05], V.mul(V.norm([sd * .9, -.5, -.3]), 1.25 * P.fly), V.mul([0, 0, -1], .5), { len: 1, wid: .42, bias: -.3 });
    // áo choàng cánh cứng: hai nửa, mở ra khi bay
    for (const sd of [-1, 1]) {
      const open = P.fly * .9, ctr = [sd * (.2 + open * .25), Y(-.88 - open * .2), -.22];
      r.ell(ctr, [.32, .38, .62], C.mint, { rot: [[Math.cos(open * sd * .6), -Math.sin(open * sd * .6), 0], [Math.sin(open * sd * .6), Math.cos(open * sd * .6), 0], [0, 0, 1]], bias: .01, shade: { col: X.mintD, k: .3 } });
    }
    // 6 chân mực ngắn
    const feet = [[-.34, 0, .42], [-.4, 0, .02], [-.34, 0, -.38], [.34, 0, .42], [.4, 0, .02], [.34, 0, -.38]];
    feet.forEach((f, i) => {
      const sd = i < 3 ? -1 : 1, j = i % 3, hip = [sd * .16, Y(-.5), [.3, .1, -.12][j]];
      const ft = (P.legsUp && P.legsUp[i]) || V.add(f, [0, L > 0 ? -L * .6 : 0, 0]), knee = V.lerp(hip, ft, .5); knee[0] += sd * .1; knee[1] -= .1;
      leg(r, hip, knee, ft, .075, C.ink, { toeDir: [sd * .2, 0, 1], bias: -.03 });
    });
    // đầu + khiên ngực như mũ trùm
    const H = [0, Y(-.86), .52];
    r.ball(H, .4, C.mint, { bias: .04 });
    r.ell([0, Y(-1.18), .36], [.44, .2, .36], X.mintD, { bias: .045 });
    bugFace(r, H, .4, E, { eyeA: .45, eyeEl: -.08, eyeR: .44, lid: C.mint, cheekA: .9, cheekEl: .36, mouthEl: .52, mouthW: .26 });
    for (const sd of [-1, 1]) antenna(r, [[sd * .12, Y(-1.28), .66], [sd * .26, Y(-1.56), .82], [sd * .42, Y(-1.72), .9]], .05, C.ink, { club: .06, bias: .05 });
  },
  expr: {
    excited: { fx: 'sparkle' }, shy: { fx: 'blush' },
  },
  exprPose: {
    happy: { glow: .7 }, surprised: { glow: 1.2, lift: .1 }, curious: { glow: .5 }, worried: { glow: .9 }, sad: { glow: .05 },
    confident: { glow: .8 }, confused: { glow: .6 }, excited: { glow: 1.5, fly: 1, lift: .25 }, thinking: { glow: .35, legsUp: [[-.3, -1.0, .95], 0, 0, 0, 0, 0] },
    explaining: { glow: 1.1, legsUp: [0, 0, 0, [.4, -1.5, .8], 0, 0] }, shy: { glow: 1.6 },
  },
};
