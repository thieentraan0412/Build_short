// Chirp, dế. Theo cricket() của pilot: xanh chanh, cánh lá, đùi sau to, đuôi hai gai, râu rất dài. Tai nằm ở ống chân TRƯỚC.
// Sửa so với pilot: thân chia rõ 3 phần (đầu, ngực có tấm khiên, bụng); 6 chân thấy đủ ở góc chính diện và sau lưng.
import { C } from '../../kit.js';
import { V } from '../rig.js';
import { X, bugFace, leg, antenna } from '../parts.js';

export const CHIRP_POSE = {
  lift: 0, chirp: 0, frontL: null, frontR: null, earGlow: 0, bodyPitch: 0, ant: 0, hindUp: 0,
};

export const CHIRP = {
  id: 'chirp', name: 'Chirp', h: 1.75, top: -1.75, w: 3.2, realH: .2, kind: 'bug',
  face: { c: [0, -1.08, 1.0], r: .45 }, head: { c: [0, -1.25, .7], r: .7 },
  build(r, o = {}) {
    const P = { ...CHIRP_POSE, ...(o.pose || {}) }, E = o.E || {}, L = P.lift, Y = y => y - L;
    const body = C.lime, dark = C.limeD;
    // bụng + cánh
    r.ell([0, Y(-.88), -.32], [.42, .44, .74], body, { shade: { col: dark, k: .5, dx: 0, dy: -1 } });
    for (const sd of [-1, 1]) {
      const w = [sd * .17, Y(-1.26 - P.chirp * .08), -.2];
      r.ell(w, [.2, .1, .8], C.leaf, { rot: [[1, 0, 0], [0, 1, -P.chirp * .25], [0, P.chirp * .25, 1]], bias: .05 });
      r.ell(V.add(w, [0, -.04, .02]), [.1, .05, .62], C.leafD, { rot: [[1, 0, 0], [0, 1, -P.chirp * .25], [0, P.chirp * .25, 1]], bias: .051 });
    }
    // ngực có khiên
    r.ell([0, Y(-.98), .52], [.38, .42, .3], body, { bias: .02 });
    r.ell([0, Y(-1.16), .5], [.36, .2, .26], dark, { bias: .021 });
    // đuôi hai gai
    for (const sd of [-1, 1]) r.cap([sd * .08, Y(-.92), -.98], [sd * .16, Y(-1.06), -1.46], .045, dark, { bias: -.02 });
    // chân sau: đùi to gập cao, ống chân mảnh xuống đất
    for (const sd of [-1, 1]) {
      const hip = [sd * .34, Y(-.74), -.36], knee = [sd * .5, Y(-1.36 - P.hindUp * .3), -1.0], foot = [sd * .54, 0, -1.42 + P.hindUp * .2];
      r.cap(hip, knee, .3, dark, { bias: .03 });
      r.limb([knee, foot], .1, dark, { bias: .029 });
      r.cap(foot, V.add(foot, [0, 0, .22]), .08, dark, { bias: .03 });
    }
    // chân giữa
    for (const sd of [-1, 1]) leg(r, [sd * .3, Y(-.66), .1], [sd * .52, Y(-.34), -.08], [sd * .56, 0, .1], .1, dark, { toeDir: [sd * .2, 0, 1], bias: .025 });
    // chân trước: có tai ở ống chân (chỉ vẽ to khi soi kính, detail)
    for (const sd of [-1, 1]) {
      const hip = [sd * .24, Y(-.7), .74], f = P[sd < 0 ? 'frontL' : 'frontR'];
      const foot = f || [sd * .4, 0, 1.18], knee = f ? V.lerp(hip, f, .45).map((v, i) => i === 1 ? v + .12 : v) : [sd * .44, Y(-.36), .98];
      r.cap(hip, knee, .15, dark, { bias: .04 });
      r.limb([knee, foot], .1, body, { bias: .041 });
      r.cap(foot, V.add(foot, [0, f ? -.04 : 0, .16]), .07, dark, { bias: .042 });
      if (r.detail || P.earGlow) {
        const e = V.lerp(knee, foot, .32), q = r.P(e);
        // luôn nằm trên ống chân: ống chân vẽ ở độ sâu trung bình của gối và bàn chân (+.041), nên lấy độ sâu lớn hơn của hai điểm đó
        r.flat(Math.max(r.Z(knee), r.Z(foot)) + .045, c => { c.fillStyle = C.leafD; c.beginPath(); c.ellipse(q[0], q[1], .085, .05, Math.PI / 2, 0, Math.PI * 2); c.fill(); c.fillStyle = P.earGlow ? C.mint : C.limeD; c.beginPath(); c.ellipse(q[0], q[1], .066, .034, Math.PI / 2, 0, Math.PI * 2); c.fill(); });
      }
    }
    // đầu
    const H = [0, Y(-1.06), 1.0];
    r.ball(H, .42, body, { bias: .06 });
    bugFace(r, H, .42, E, { eyeA: .44, eyeEl: -.32, eyeR: .5, lid: body, cheekA: .82, cheekEl: .28, mouthEl: .44, mouthW: .24 });
    // râu rất dài, vắt ngược qua lưng
    for (const sd of [-1, 1]) {
      const pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push([sd * (.1 + .32 * u), Y(-1.42 - 1.0 * u + u * u * .78 + Math.sin(u * 5 + P.ant) * u * .04), 1.18 - 1.7 * u]); }
      antenna(r, pts, .035, dark, { bias: .07 });
    }
  },
  exprPose: {
    surprised: { lift: .1 }, worried: { bodyPitch: .1 }, sad: {}, excited: { lift: .18, chirp: 1 },
    confident: { chirp: .5 }, thinking: { frontR: [.44, -1.15, 1.32] }, explaining: { frontR: [.46, -1.55, 1.25] }, curious: { frontR: [.4, -.35, 1.42] },
  },
};
