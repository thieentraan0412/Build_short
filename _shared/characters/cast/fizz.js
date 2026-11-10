// Fizz, ruồi nhà (khách mời, ra mắt ở SHORT-009, vai chính ở tập 9 Mùa 1). Không lời: cọ hai chân trước, vo ve, tò mò, hay bắt chước.
// Khác hẳn Blink ở hình (QUALITY.md §3): thân xanh than có sọc xám (Blink bạc hà), hai vòm mắt kép đỏ to (Blink mắt trắng trên đầu bạc hà),
// đúng HAI cánh trong (ruồi là "Diptera", một cặp cánh; Blink có tấm cánh cứng trùm hai cánh mỏng), hai núm thăng bằng tí hon sau cánh,
// vòi ngắn, râu cụt. Khối phẳng, một mảng tối, như mọi nhân vật của kênh.
import { C } from '../../kit.js';
import { V } from '../rig.js';
import { X, dirA, leg } from '../parts.js';
import { eye, mouth, eyeOpts } from '../face.js';

export const FIZZ_COL = { body: '#3D4470', bodyD: '#2B3054', band: '#6E78B4', eye: C.berry, eyeD: C.berryD, eyeL: '#FF8FB0', wing: 'rgba(222,240,255,.78)', vein: 'rgba(150,180,230,.75)' };
// flap 0..1: cánh xoè ra hai bên (đếm cánh, bay); buzz: pha vỗ cánh (cánh mờ nhoè khi > 0); rub 0..1: cọ hai chân trước
export const FIZZ_POSE = { lift: 0, flap: 0, buzz: 0, rub: 0, legsUp: null };

export const FIZZ = {
  id: 'fizz', name: 'Fizz', h: 1.55, top: -1.55, w: 1.9, realH: .007, kind: 'bug', guest: true,
  face: { c: [0, -.95, .7], r: .36 }, head: { c: [0, -.98, .55], r: .5 },
  build(r, o = {}) {
    const P = { ...FIZZ_POSE, ...(o.pose || {}) }, E = o.E || {}, L = P.lift, Y = y => y - L, K = FIZZ_COL;
    // hai cánh trong, gốc ở lưng ngực; flap xoè ra hai bên; buzz: thêm hai bóng mờ (đang vỗ)
    const wingAt = (sd, a, alpha) => {
      const base = [sd * .16, Y(-1.1), -.02], dir = V.norm([sd * (.35 + .9 * a), -.2 - .5 * a, -1 + .7 * a]), side = V.norm([sd * .1, -1, .15]);
      r.plane(base, V.mul(dir, 1.15), V.mul(side, .42), c => {
        c.globalAlpha *= alpha;
        c.fillStyle = K.wing; c.beginPath(); c.ellipse(.5, 0, .5, .42, 0, 0, Math.PI * 2); c.fill();
        c.strokeStyle = K.vein; c.lineWidth = .045; c.lineCap = 'round';
        for (const k of [-.18, .06, .26]) { c.beginPath(); c.moveTo(.04, 0); c.quadraticCurveTo(.5, k * .7, .96, k); c.stroke(); }
      }, { bias: -.25 });
    };
    for (const sd of [-1, 1]) {
      wingAt(sd, P.flap, 1);
      if (P.buzz) for (const k of [-.3, .3]) wingAt(sd, Math.min(1, Math.max(0, P.flap + k * Math.sin(P.buzz))), .35);
      // núm thăng bằng (halteres): cánh sau đã thành hai núm tí hon
      const hb = [sd * .2, Y(-.86), -.24], ht = [sd * .32, Y(-.98), -.34];
      r.cap(hb, ht, .035, C.cream, { bias: -.01 }); r.ball(ht, .055, C.cream, { bias: -.005 });
    }
    // bụng: sọc xám (đặc điểm ruồi nhà)
    const AC = [0, Y(-.66), -.42], AR = [.36, .3, .48];
    r.ell(AC, AR, K.body, { shade: { col: K.bodyD, k: .3 } });
    for (const [d, s] of [[[0, -.75, .1], .26], [[0, -.62, -.45], .22]]) r.decal(AC, AR, d, s, c => { c.fillStyle = K.band; c.beginPath(); c.ellipse(0, 0, 1.6, .5, 0, 0, Math.PI * 2); c.fill(); });
    // 6 chân mảnh; rub: hai chân trước đưa lên trước mặt, cọ vào nhau
    const feet = [[-.36, 0, .42], [-.44, 0, .02], [-.38, 0, -.4], [.36, 0, .42], [.44, 0, .02], [.38, 0, -.4]];
    feet.forEach((f, i) => {
      const sd = i < 3 ? -1 : 1, j = i % 3, hip = [sd * .14, Y(-.6), [.26, .06, -.16][j]];
      let ft = (P.legsUp && P.legsUp[i]) || V.add(f, [0, L > 0 ? -L * .6 : 0, 0]);
      if (P.rub && j === 0) ft = V.lerp(ft, [sd * (.05 + .06 * Math.sin(P.rub * 40)), Y(-.78), .98], Math.min(1, P.rub));
      const knee = V.lerp(hip, ft, .5); knee[0] += sd * .12; knee[1] -= .1;
      leg(r, hip, knee, ft, .055, C.ink, { toeDir: [sd * .2, 0, 1], bias: -.03 });
    });
    // ngực xanh than, vài sợi lông cứng
    const TC = [0, Y(-.86), .1];
    r.ell(TC, [.4, .36, .4], K.body, { shade: { col: K.bodyD, k: .3 }, bias: .01 });
    for (const sd of [-1, 0, 1]) r.limb([[sd * .14, Y(-1.18), .02 + .1 * Math.abs(sd)], [sd * .2, Y(-1.3), -.02]], .03, C.ink, { bias: .015 });
    // đầu, vòi ngắn, râu cụt
    const H = [0, Y(-.92), .56];
    r.ball(H, .3, K.body, { bias: .03 });
    r.cap([0, Y(-.78), .78], [0, Y(-.62), .86], .075, K.bodyD, { bias: .045 }); r.ball([0, Y(-.6), .87], .07, K.band, { bias: .046 });
    for (const sd of [-1, 1]) { r.cap([sd * .07, Y(-1.18), .76], [sd * .14, Y(-1.3), .84], .045, C.ink, { bias: .05 }); r.ball([sd * .14, Y(-1.3), .84], .04, C.ink, { bias: .051 }); }
    // hai vòm mắt kép đỏ to, mỗi vòm một con mắt hoạt hình (trắng, đồng tử, ánh sáng)
    for (const sd of [-1, 1]) {
      const D = [sd * .23, Y(-1.0), .66];
      r.ball(D, .25, K.eye, { bias: .04, shade: { col: K.eyeD, k: .3 } });
      r.feat(D, .25, dirA(sd * .55, -.55), .07, c => { c.fillStyle = K.eyeL; c.beginPath(); c.arc(0, 0, 1, 0, Math.PI * 2); c.fill(); }, { bias: .002, cullAt: -.1 });
      const eo = eyeOpts(E, sd, { lid: K.eye });
      r.feat(D, .25, dirA(sd * .3, -.05), .15, c => eye(c, eo), { bias: .003, cullAt: -.12 });
    }
    r.feat(H, .3, dirA(0, .5), .08, c => mouth(c, E.mouth || 'smile', { ink: C.cream, tongue: C.pink, talk: E.talk ?? .6 }), { bias: .002, cullAt: -.3 });
  },
  exprPose: {
    happy: {}, curious: {}, confused: { legsUp: [[-.2, -1.15, .7], 0, 0, 0, 0, 0] }, surprised: { lift: .08, flap: .5 },
    excited: { lift: .14, flap: 1 }, proud: { flap: .7 }, sad: { flap: 0 }, thinking: { rub: .6 },
  },
};
