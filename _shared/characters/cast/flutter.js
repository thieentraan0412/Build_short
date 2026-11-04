// Flutter, bướm. Theo butterfly() của pilot: thân mực, cánh trước tím, cánh sau cam, đốm xoài-kem, vòi cam cuộn ốc, râu đầu tròn xoài.
// Sửa so với pilot: thân chia rõ 3 phần (đầu, ngực, bụng); cánh trước đổi từ grape sang night để không trùng màu chủ đạo của Albie.
import { C } from '../../kit.js';
import { V } from '../rig.js';
import { eye, eyeOpts } from '../face.js';
import { X, dirA, leg, antenna } from '../parts.js';
const TAU = Math.PI * 2;
export const FLUTTER_COL = { fore: C.night, foreD: X.nightD, hind: C.tang, hindD: X.tangD, spot: C.mango, spot2: C.cream };

// vòi: tongue 0 = cuộn tròn, 1 = duỗi thẳng xuống trước; kind đổi dáng theo biểu cảm
function proboscisPath(c, k, kind) {
  const pts = [], n = 60;
  for (let i = 0; i <= n; i++) {
    const s = i / n, th = -Math.PI / 2 + s * Math.PI * 3.2, rr = .9 * (1 - .78 * s);
    let sp = [Math.cos(th) * rr * .9, .9 + Math.sin(th) * rr];
    if (kind === 'loose') sp = [Math.cos(th * .7) * rr * 1.2, .7 + Math.sin(th * .7) * rr * 1.5];
    if (kind === 'droop') sp = [Math.sin(s * 2.2) * .5, s * 3.1];
    if (kind === 'wavy') sp = [Math.sin(s * 9) * .35, s * 2.8];
    const st = [Math.cos(1.25) * 4.6 * s, Math.sin(1.25) * 4.6 * s];
    pts.push([sp[0] + (st[0] - sp[0]) * k, sp[1] + (st[1] - sp[1]) * k]);
  }
  c.strokeStyle = C.tang; c.lineWidth = .42; c.lineCap = c.lineJoin = 'round'; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
}
const MOUTH2PROB = { o: 'loose', grin: 'loose', shout: 'loose', frown: 'droop', wavy: 'wavy', zig: 'wavy', talk: 'loose' };

export const FLUTTER_POSE = {
  beta: .32, alpha: .78, tongue: 0, lift: 0,
  feet: null,            // ghi đè vị trí 6 bàn chân
  legsUp: null,          // chân trước giơ lên (vẫy, chỉ)
  antL: 0, antR: 0,      // râu: dương = vểnh, âm = cụp
};

export const FLUTTER = {
  id: 'flutter', name: 'Flutter', h: 2.4, top: -2.4, w: 2.6, realH: .24, kind: 'bug',
  face: { c: [0, -.72, .5], r: .3, fxLight: C.cream }, head: { c: [0, -1.3, .3], r: .8 },
  build(r, o = {}) {
    const P = { ...FLUTTER_POSE, ...(o.pose || {}) }, E = o.E || {}, K = FLUTTER_COL, lift = P.lift;
    const Y = y => y - lift;
    // cánh: mỗi cánh một mặt phẳng; U chạy dọc cánh (trước-ngoài cho cánh trước, sau-ngoài cho cánh sau), W hướng lên-ngoài
    const hinge = [0, Y(-.74), .08];
    for (const sd of [-1, 1]) {
      const up = [sd * Math.sin(P.beta), -Math.cos(P.beta), 0], far = r.Z([sd, 0, 0]) < -.3;
      const Uf = V.norm([sd * Math.sin(P.alpha), 0, Math.cos(P.alpha)]), Uh = V.norm([sd * Math.sin(P.alpha), 0, -Math.cos(P.alpha)]);
      r.plane(V.add(hinge, [0, 0, -.06]), Uh, up, c => {
        c.fillStyle = far ? K.hindD : K.hind; c.beginPath(); c.ellipse(.42, .3, .5, .42, -.35, 0, TAU); c.fill();
        c.fillStyle = K.spot; c.beginPath(); c.arc(.55, .38, .15, 0, TAU); c.fill();
      }, { bias: -.32 + (far ? -.05 : 0) });
      r.plane(hinge, Uf, up, c => {
        c.fillStyle = far ? K.foreD : K.fore; c.beginPath(); c.ellipse(.16, .86, .58, .86, .3, 0, TAU); c.fill();
        c.fillStyle = K.spot; c.beginPath(); c.arc(.22, 1.18, .24, 0, TAU); c.fill();
        c.fillStyle = K.spot2; c.beginPath(); c.arc(.22, 1.18, .1, 0, TAU); c.fill();
        c.beginPath(); c.arc(.3, .62, .13, 0, TAU); c.fill();
      }, { bias: -.3 + (far ? -.05 : 0) });
    }
    // thân 3 phần
    r.ell([0, Y(-.6), -.38], [.13, .13, .4], C.ink, { rot: [[1, 0, 0], [0, .99, .1], [0, -.1, .99]] });
    r.ell([0, Y(-.66), .14], [.17, .16, .2], C.ink);
    const H = [0, Y(-.72), .5]; r.ball(H, .23, C.ink, { bias: .02 });
    // 6 chân mảnh màu mực
    const feet = P.feet || [[-.3, 0, .44], [-.34, 0, .02], [-.3, 0, -.42], [.3, 0, .44], [.34, 0, .02], [.3, 0, -.42]];
    feet.forEach((f, i) => {
      const sd = i < 3 ? -1 : 1, j = i % 3, hip = [sd * .08, Y(-.56), [.24, .12, 0][j]];
      let ft = lift ? [f[0] * .8, -lift + .1, f[2] * .9] : f;
      if (P.legsUp && P.legsUp[i]) ft = P.legsUp[i];
      const knee = V.lerp(hip, ft, .5); knee[1] -= .22; knee[0] += sd * .08;
      leg(r, hip, knee, ft, .07, C.ink, { toeDir: [sd * .3, 0, 1], bias: -.01 });
      if (r.detail) for (let k = 0; k < 3; k++) r.ball(V.add(ft, [sd * .02, -.015, .03 + k * .045]), .026, C.lime, { bias: .002 });   // điểm nếm ở bàn chân (chỉ thấy trong kính)
    });
    // râu đầu chùy xoài
    for (const sd of [-1, 1]) {
      const a = sd < 0 ? P.antL : P.antR, b = [sd * .07, Y(-.9), .58];
      const pts = [b, [sd * (.16 - a * .05), Y(-1.12 - a * .1), .74 + a * .05], [sd * (.26 - a * .1), Y(-1.28 - a * .18), .94 + a * .12], [sd * (.36 - a * .1), Y(-1.36 - a * .32 + Math.max(0, -a) * .5), 1.1 + a * .1]];
      antenna(r, pts, .045, C.ink, { club: .065, clubCol: C.mango, bias: .03 });
    }
    // mắt trên đầu mực: mí cùng màu mực, nhắm mắt vẽ bằng nét kem
    for (const sd of [-1, 1]) {
      const eo = eyeOpts(E, sd, { lid: C.ink, line: C.cream });
      r.feat(H, .23, dirA(sd * .5, -.22), .12, c => eye(c, eo), { cullAt: -.15 });
    }
    // vòi
    const kind = MOUTH2PROB[E.mouth] || 'coil', tg = P.tongue;
    r.feat(H, .23, dirA(0, .62), .075, c => proboscisPath(c, tg, kind), { cullAt: -.45, bias: .004 });
  },
  exprPose: {
    happy: {}, surprised: { beta: .5, antL: .8, antR: .8, lift: .08 }, curious: { antL: .5, antR: -.2 },
    worried: { beta: .12, antL: -.6, antR: -.6 }, sad: { beta: .05, antL: -1, antR: -1 }, confident: { beta: .45, antL: .4, antR: .4 },
    confused: { antL: .8, antR: -.8 }, excited: { beta: .7, lift: .25, antL: 1, antR: 1, tongue: .5 }, thinking: { antL: -.3, antR: .5 },
    explaining: { legsUp: [[-.28, -1.0, .78], 0, 0, 0, 0, 0], antL: .4, antR: .4 },
  },
};
