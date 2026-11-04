// Mr. Rollo, bọ hung: đen bóng (ink) với vệt sáng xanh trời (sky), đầu hình xẻng răng cưa, chân trước có răng.
// Viên tròn nâu (honeyD) là một phần nhận diện: luôn đi kèm. Đi thẳng tắp, không bao giờ rẽ. Mí mắt hơi sụp: già, điềm tĩnh.
import { C } from '../../kit.js';
import { V } from '../rig.js';
import { X, bugFace, leg, antenna } from '../parts.js';
const TAU = Math.PI * 2;

export const ROLLO_POSE = { lift: 0, ball: [0, -.72, -1.55], ballR: .72, showBall: true, legsUp: null, headstand: 0, ballSpin: 0 };

export function dungBall(r, p, R, spin = 0) {
  r.ball(p, R, C.honeyD, { shade: { col: '#8E430B', k: .2 } });
  [[.3, -.4, .3], [-.45, .1, .2], [.1, .45, .24], [-.15, -.62, .16]].forEach(([a, b, s], i) => {
    const ang = spin + i * 1.7, d = [Math.cos(ang) * a - Math.sin(ang) * b, Math.sin(ang) * a + Math.cos(ang) * b, .7];
    r.decal(p, [R, R, R], d, s * R * .5, c => { c.fillStyle = C.honey; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); }, { bias: .004 });
  });
}

export const ROLLO = {
  id: 'rollo', name: 'Mr. Rollo', h: 1.5, top: -1.5, w: 2.0, realH: .12, kind: 'bug',
  face: { c: [0, -.62, .9], r: .34 }, head: { c: [0, -.95, .5], r: .75 },
  expr: { happy: { eye: { lidTop: .26 } }, explaining: { eye: { lidTop: .22, lidBot: .2 } }, confident: { eye: { lidTop: .4, lidBot: .16 } } },
  build(r, o = {}) {
    const P = { ...ROLLO_POSE, ...(o.pose || {}) }, E = o.E || {}, L = P.lift, Y = y => y - L;
    const EC = [0, Y(-.7), -.25], ER = [.62, .5, .72];
    // cánh cứng bóng + vệt sáng xanh trời
    r.ell(EC, ER, C.ink, { shade: { col: '#100E22', k: .2 } });
    r.decal(EC, ER, [-.42, -.72, .3], .3, c => { c.fillStyle = C.sky; c.beginPath(); c.ellipse(0, 0, 1.2, .38, -.5, 0, TAU); c.fill(); c.beginPath(); c.ellipse(.9, .7, .28, .2, -.5, 0, TAU); c.fill(); }, { bias: .01 });
    const seam = [];
    for (let i = 0; i <= 16; i++) { const th = .3 + i / 16 * 2.2, p = [0, EC[1] - ER[1] * Math.sin(th), EC[2] + ER[2] * Math.cos(th)], n = [0, -Math.sin(th) / ER[1], Math.cos(th) / ER[2]]; if (r.Z(n) > -.05) seam.push(V.add(p, V.mul(V.norm(n), .01))); }
    if (seam.length > 1) r.limb(seam, .04, X.inkL, { z: r.Z(EC) + .5 });
    // 6 chân, chân trước có răng
    const feet = [[-.5, 0, .62], [-.62, 0, 0], [-.56, 0, -.62], [.5, 0, .62], [.62, 0, 0], [.56, 0, -.62]];
    feet.forEach((f, i) => {
      const sd = i < 3 ? -1 : 1, j = i % 3, hip = [sd * .26, Y(-.42), [.42, .12, -.2][j]];
      const ft = (P.legsUp && P.legsUp[i]) || V.add(f, [0, L > 0 ? -L * .7 : 0, 0]), knee = V.lerp(hip, ft, .5); knee[0] += sd * .14; knee[1] -= .2;
      leg(r, hip, knee, ft, .1, C.ink, { toeDir: [sd * .3, 0, j === 2 ? -1 : 1], bias: -.05 });
      if (j === 0) { const q = r.P(V.lerp(knee, ft, .5)); r.flat(q[2] - .049, c => { c.fillStyle = C.ink; for (const k of [-1, 0, 1]) { c.beginPath(); c.moveTo(q[0] + sd * .03 + k * .07 * Math.cos(r.yaw), q[1] + k * .09); c.lineTo(q[0] + sd * .14, q[1] + k * .09 - .03); c.lineTo(q[0] + sd * .03 + k * .07 * Math.cos(r.yaw), q[1] + k * .09 + .06); c.fill(); } }); }
    });
    // tấm ngực
    const PC = [0, Y(-.66), .46];
    r.ell(PC, [.56, .4, .32], C.ink, { bias: .02, shade: { col: '#100E22', k: .18 } });
    r.decal(PC, [.56, .4, .32], [-.38, -.78, .3], .14, c => { c.fillStyle = C.sky; c.beginPath(); c.ellipse(0, 0, 1.3, .4, -.4, 0, TAU); c.fill(); }, { bias: .021 });
    // đầu xẻng răng cưa
    const H = [0, Y(-.56), .82];
    r.ell(H, [.44, .26, .3], C.ink, { bias: .04 });
    r.plane([0, Y(-.4), .98], [.52, 0, 0], [0, 0, .32], c => { c.fillStyle = C.ink; c.beginPath(); c.moveTo(-1, -.5); for (let i = 0; i <= 8; i++) { const x = -1 + i * .25; c.lineTo(x, i % 2 ? .62 : .2); } c.lineTo(1, -.5); c.closePath(); c.fill(); }, { bias: .041 });
    bugFace(r, [0, Y(-.66), .8], .34, E, { eyeA: .5, eyeEl: -.38, eyeR: .5, lid: C.ink, line: C.cream, cheekA: .9, cheekEl: .2, mouthEl: .32, mouthW: .28, mouthInk: C.cream });
    for (const sd of [-1, 1]) antenna(r, [[sd * .2, Y(-.78), 1.0], [sd * .34, Y(-.9), 1.1], [sd * .44, Y(-.86), 1.16]], .05, C.ink, { club: .08, bias: .05 });
    if (P.showBall && P.ball) dungBall(r, V.add(P.ball, [0, -L, 0]), P.ballR, P.ballSpin);
  },
  exprPose: {
    excited: { lift: .08 }, explaining: { legsUp: [0, 0, 0, [.5, -.95, 1.05], 0, 0] }, thinking: { legsUp: [[-.25, -.62, 1.12], 0, 0, 0, 0, 0] },
  },
};
