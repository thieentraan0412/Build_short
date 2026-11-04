// Spindle, nhện: thân hồng (pink) đốm tím (grape), 8 chân dài mảnh, 8 mắt xếp hai hàng (mắt giữa to).
// Nhện có 2 phần thân (đầu-ngực, bụng). Không lông, không răng nanh, không vẽ chân xúc giác để trẻ đếm đúng 8 chân.
import { C } from '../../kit.js';
import { V } from '../rig.js';
import { X, dirA } from '../parts.js';
import { eye, mouth, cheek, eyeOpts } from '../face.js';
const TAU = Math.PI * 2;

export const SPINDLE_POSE = {
  lift: 0, thread: false, legs: null, hidden: 0, wave: null, wings: false, sweater: false, flipUp: false,
};
// 8 bàn chân mặc định: [góc quanh thân, bán kính], 4 mỗi bên
const LEG_A = [.42, 1.1, 1.85, 2.55];

export const SPINDLE = {
  id: 'spindle', name: 'Spindle', h: 1.85, top: -1.85, w: 3.0, realH: .2, kind: 'bug',
  face: { c: [0, -.82, .7], r: .45 }, head: { c: [0, -1.25, .2], r: .8 },
  build(r, o = {}) {
    const P = { ...SPINDLE_POSE, ...(o.pose || {}) }, E = o.E || {}, L = P.lift, Y = y => y - L;
    const body = C.pink, dark = X.pinkD, leg = C.grape;
    // bụng tròn lớn có đốm tím
    const AC = [0, Y(-.98), -.62], AR = [.56, .54, .6];
    r.ell(AC, AR, body, { shade: { col: dark, k: .24 } });
    [[[0, -.7, .3], .17], [[-.55, -.5, .1], .14], [[.55, -.5, .1], .14], [[0, -.5, -.7], .15], [[-.5, -.2, -.6], .12], [[.5, -.2, -.6], .12], [[0, .1, -1], .13]].forEach(([d, s]) =>
      r.decal(AC, AR, d, s, c => { c.fillStyle = C.grape; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); }));
    if (P.sweater) { r.lathe(AC, [0, 0, 1], .6, .58, .56, t => Math.floor((t + 1) * 3.2) % 2 ? C.ink : C.lemon, { bias: .005, n: 30 }); }
    if (P.thread) { const top = r.P(V.add(AC, [0, -AR[1] + .05, 0])); r.flat(top[2] - .2, c => { c.strokeStyle = C.cream; c.lineWidth = .04; c.beginPath(); c.moveTo(top[0], top[1]); c.lineTo(top[0], -14); c.stroke(); }); }
    // eo + đầu-ngực
    r.ball([0, Y(-.82), -.06], .12, body, { bias: .01 });
    const H = [0, Y(-.8), .34], HR = .5;
    r.ell(H, [HR, .44, .44], body, { bias: .03, shade: { col: dark, k: .2 } });
    // 8 chân: hông quanh đầu-ngực, gối vồng cao, bàn chân trên đất
    let n = 0;
    for (const sd of [-1, 1]) LEG_A.forEach((a, i) => {
      const idx = n++, hip = [sd * (.3 + .1 * Math.sin(a)), Y(-.76), .3 + .22 * Math.cos(a)];
      let foot = [[sd * 1.0, 0, 1.05], [sd * 1.42, 0, .38], [sd * 1.42, 0, -.42], [sd * 1.05, 0, -1.15]][i];
      if (P.legs && P.legs[idx]) foot = P.legs[idx];
      if (P.hidden && (idx === 3 || idx === 7)) foot = [sd * .25, Y(-1.15), -1.0];
      const knee = V.add(V.lerp(hip, foot, .45), [sd * .3, -.66 - (i === 1 || i === 2 ? .1 : 0), 0]);
      // khi mặt quay về người xem, chân luôn mọc từ sau đầu-ngực để không bao giờ cắt ngang mặt
      const zAvg = (r.Z(hip) + r.Z(knee) + r.Z(foot)) / 3, faceOn = Math.cos(r.yaw) > .3;
      r.limb([hip, knee, foot], .075, leg, { z: faceOn ? Math.min(zAvg, r.Z(H) - .03) : zAvg + (Math.cos(a) > 0 ? .02 : -.02) });
    });
    // 8 mắt: hàng trước 4 (2 mắt giữa to), hàng trên 4 mắt nhỏ
    for (const sd of [-1, 1]) {
      const eo = eyeOpts(E, sd, { lid: body });
      r.feat(H, HR, dirA(sd * .24, -.06), .2, c => eye(c, eo), { cullAt: -.1 });
      r.feat(H, HR, dirA(sd * .6, .04), .085, c => eye(c, { ...eo, scale: 1, pupil: .55, lidTop: Math.min(eo.lidTop || 0, .4), lidBot: 0, closed: eo.closed ? 'flat' : null }), { cullAt: -.05 });
      for (const [a, el] of [[.15, -.5], [.42, -.42]]) r.feat(H, HR, dirA(sd * a, el), .07, c => eye(c, { ...eo, scale: 1, pupil: .55, lidTop: Math.min(eo.lidTop || 0, .4), lidBot: 0, closed: eo.closed ? 'flat' : null }), { cullAt: -.1 });
      r.feat(H, HR, dirA(sd * .66, .4), .06, c => cheek(c, X.pinkD), { cullAt: -.05 });
    }
    r.feat(H, HR, dirA(0, .42), .11, c => mouth(c, E.mouth || 'smile', { talk: E.talk ?? .6 }), { cullAt: -.3 });
    // cải trang: cánh giấy
    if (P.wings) for (const sd of [-1, 1]) r.plane([sd * .2, Y(-1.42), -.55], V.mul(V.norm([sd, -.6, .1]), .8), V.mul([0, 0, -1], .55), c => { c.fillStyle = C.cream; c.beginPath(); c.ellipse(.5, 0, .5, .5, 0, 0, TAU); c.fill(); c.fillStyle = X.creamD; c.beginPath(); c.ellipse(.55, 0, .3, .26, 0, 0, TAU); c.fill(); }, { bias: -.3 });
  },
  exprPose: {
    surprised: { lift: .1 }, excited: { lift: .15 }, explaining: { legs: [0, 0, 0, 0, [.5, -1.55, 1.15], 0, 0, 0] },
    thinking: { legs: [[-.22, -.6, .95], 0, 0, 0, 0, 0, 0, 0] }, confident: {}, sad: {},
  },
};
