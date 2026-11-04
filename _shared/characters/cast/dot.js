// Dot, bọ rùa: vòm cam đỏ (tang) với đúng 7 chấm mực (1 chấm giữa nằm trên đường nối cánh + 3 chấm mỗi bên),
// đầu mực, tấm ngực mực có hai mảng trắng, 6 chân mực. Mùa đông: khăn len.
import { C } from '../../kit.js';
import { V } from '../rig.js';
import { X, bugFace, leg, antenna } from '../parts.js';
const TAU = Math.PI * 2;
const spot = r => c => { c.fillStyle = C.ink; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); };

export const DOT_POSE = { lift: 0, legsUp: null, scarf: false, open: 0 };
// 7 chấm: [hướng trên vòm, cỡ]
export const DOT_SPOTS = [[[0, -.62, .78], .2], [[-.62, -.55, .3], .17], [[.62, -.55, .3], .17], [[-.5, -.66, -.42], .16], [[.5, -.66, -.42], .16], [[-.78, -.1, -.3], .13], [[.78, -.1, -.3], .13]];

export const DOT = {
  id: 'dot', name: 'Dot', h: 1.35, top: -1.35, w: 1.7, realH: .09, kind: 'bug',
  face: { c: [0, -.55, .78], r: .34 }, head: { c: [0, -.95, .4], r: .7 },
  build(r, o = {}) {
    const P = { ...DOT_POSE, ...(o.pose || {}) }, E = o.E || {}, L = P.lift, Y = y => y - L;
    const EC = [0, Y(-.6), -.12], ER = [.66, .54, .7];
    // vòm cánh cứng
    r.ell(EC, ER, C.tang, { shade: { col: X.tangD, k: .26 } });
    DOT_SPOTS.forEach(([d, s]) => r.decal(EC, ER, d, s, spot(r)));
    // đường nối hai cánh (chỉ phần quay về người xem)
    const seam = [];
    for (let i = 0; i <= 16; i++) { const th = .25 + i / 16 * 2.0, p = [0, EC[1] - ER[1] * Math.sin(th), EC[2] + ER[2] * Math.cos(th)], n = [0, -Math.sin(th) / ER[1], Math.cos(th) / ER[2]]; if (r.Z(n) > -.05) seam.push(V.add(p, V.mul(V.norm(n), .01))); }
    if (seam.length > 1) r.limb(seam, .05, C.ink, { z: r.Z(EC) + .5 });
    // 6 chân mực
    const feet = [[-.42, 0, .4], [-.5, 0, 0], [-.42, 0, -.4], [.42, 0, .4], [.5, 0, 0], [.42, 0, -.4]];
    feet.forEach((f, i) => {
      const sd = i < 3 ? -1 : 1, j = i % 3, hip = [sd * .2, Y(-.24), [.3, .06, -.18][j]];
      const ft = (P.legsUp && P.legsUp[i]) || V.add(f, [0, L > 0 ? -L * .7 : 0, 0]), knee = V.lerp(hip, ft, .5); knee[0] += sd * .1; knee[1] -= .06;
      leg(r, hip, knee, ft, .075, C.ink, { toeDir: [sd * .2, 0, 1], bias: -.05 });
    });
    // tấm ngực mực, hai mảng trắng
    const PC = [0, Y(-.5), .5];
    r.ell(PC, [.46, .3, .24], C.ink, { bias: .02 });
    for (const sd of [-1, 1]) r.decal(PC, [.46, .3, .24], [sd * .72, -.25, .64], .1, c => { c.fillStyle = C.cream; c.beginPath(); c.ellipse(0, 0, 1.3, .9, 0, 0, TAU); c.fill(); }, { bias: .021 });
    if (P.scarf) {
      r.ell([0, Y(-.42), .66], [.42, .13, .2], C.sky, { bias: .05 });
      r.cap([.24, Y(-.38), .8], [.34, Y(-.12), .86], .12, C.skyL, { bias: .06 });
    }
    // đầu mực, mắt trắng to, miệng kem
    const H = [0, Y(-.5), .76];
    r.ball(H, .3, C.ink, { bias: .04 });
    bugFace(r, H, .3, E, { eyeA: .44, eyeEl: -.28, eyeR: .5, lid: C.ink, line: C.cream, cheekA: .82, cheekEl: .26, mouthEl: .5, mouthW: .26, mouthInk: C.cream, tongue: C.pink });
    for (const sd of [-1, 1]) antenna(r, [[sd * .1, Y(-.76), .9], [sd * .2, Y(-.98), 1.0], [sd * .3, Y(-1.08), 1.0]], .04, C.ink, { club: .055, bias: .05 });
  },
  exprPose: {
    surprised: { lift: .06 }, excited: { lift: .14, legsUp: [[-.42, -.85, .82], 0, 0, [.42, -.85, .82], 0, 0] },
    explaining: { legsUp: [0, 0, 0, [.4, -1.05, .85], 0, 0] }, thinking: { legsUp: [[-.2, -.58, 1.02], 0, 0, 0, 0, 0] },
    confident: {}, curious: {},
  },
};
