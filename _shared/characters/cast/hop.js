// Hop, châu chấu (khách mời, ra mắt ở SHORT-013, vai chính SHORT-013/014/015). Không lời: nảy "boing", kéo "vĩ cầm" bằng chân sau.
// Cố ý cùng "họ hình" với Chirp (dế) để tập 013 mở bằng "trông khá giống nhau", nhưng khác hẳn ở hình (QUALITY.md §3):
//   - màu: thân xanh lá đậm (leaf), cánh nâu vàng, sọc chanh dọc bụng · Chirp: xanh chanh (lime), cánh lá
//   - râu: NGẮN, dày, chĩa về trước (châu chấu) · Chirp: râu rất dài vắt ra sau lưng (dế)
//   - tai: hai màng nghe tròn ở HAI BÊN BỤNG (đốt bụng đầu) · Chirp: tai ở ống chân trước
//   - đùi sau có sọc chữ V và một hàng gai nhỏ ở mặt trong (chỉ rõ trong kính): cọ vào mép cánh để "hát" · Chirp: cọ hai cánh
//   - lưng có tấm yên ngựa sẫm (pronotum), không có đuôi hai gai
import { C } from '../../kit.js';
import { V } from '../rig.js';
import { X, bugFace, leg, antenna } from '../parts.js';
const TAU = Math.PI * 2;
export const HOP_COL = { body: C.leaf, bodyD: C.leafD, wing: '#C9A050', wingD: '#9C7A34', belly: C.lemon, ear: C.cream, earRim: C.leafD, peg: '#5E4A1C' };

// lift: nhảy lên · crouch 0..1: co chân sau lấy đà · fiddle 0..1 + bow (rad): đùi sau kéo lên xuống dọc mép cánh (hát)
// ear 0..1: màng nghe sáng + gợn sóng · earCover 0..1: hai chân trước áp lên hai bên bụng (bịt "tai")
// frontL/frontR: ghi đè bàn chân trước · ant: râu ngọ nguậy · hindUp: giơ đùi sau · pegs: luôn vẽ hàng gai (mặc định chỉ khi detail)
export const HOP_POSE = { lift: 0, crouch: 0, fiddle: 0, bow: 0, ear: 0, earCover: 0, frontL: null, frontR: null, ant: 0, hindUp: 0, pegs: false, wingOpen: 0 };

export const HOP = {
  id: 'hop', name: 'Hop', h: 1.8, top: -1.8, w: 3.2, realH: .25, kind: 'bug', guest: true,
  face: { c: [0, -1.06, 1.02], r: .44 }, head: { c: [0, -1.2, .75], r: .7 },
  // vị trí màng nghe (để tập phim đặt kính, gợn sóng): hai bên đốt bụng đầu, sau chân giữa
  ear: sd => [sd * .352, -.82, -.264],   // tâm màng nghe = điểm dán decal trên bụng (AC + hướng [±.95, −.05, .42] chạm elip AR)
  build(r, o = {}) {
    const P = { ...HOP_POSE, ...(o.pose || {}) }, E = o.E || {}, K = HOP_COL;
    const cr = P.crouch, L = P.lift, Y = y => y - L + cr * .16 * (y < -.2 ? 1 : 0), J = Math.min(1, L / .3);   // J: dáng nhảy (chân duỗi)
    // bụng dài, sọc chanh dọc bụng dưới
    const AC = [0, Y(-.8), -.42], AR = [.36, .36, .8];
    r.ell(AC, AR, K.body, { shade: { col: K.bodyD, k: .45, dx: 0, dy: -1 } });
    r.decal(AC, AR, [0, .75, .3], .2, c => { c.fillStyle = K.belly; c.beginPath(); c.ellipse(0, 0, 1.0, 3.2, 0, 0, TAU); c.fill(); }, { bias: .002 });
    // tai: màng nghe tròn hai bên đốt bụng đầu (TAI CỦA HOP Ở BỤNG)
    for (const sd of [-1, 1]) {
      const g = P.ear;
      r.decal(AC, AR, [sd * .95, -.05, .42], .13 * (1 + (r.detail ? .25 : 0)), c => {
        c.fillStyle = K.earRim; c.beginPath(); c.arc(0, 0, 1.25, 0, TAU); c.fill();
        c.fillStyle = g > 0 ? C.mintL : K.ear; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill();
        if (g > 0) { c.strokeStyle = C.mint; c.lineWidth = .16; for (const k of [.45, .75]) { c.beginPath(); c.arc(0, 0, k * (1 + .08 * Math.sin(g * 20 + k * 6)), 0, TAU); c.stroke(); } }
      }, { bias: .004 });
    }
    // cánh xếp dọc hai bên lưng như mái nhà (nâu vàng), xoè ra khi nhảy
    for (const sd of [-1, 1]) {
      const w = [sd * (.2 + P.wingOpen * .2), Y(-1.0 - P.wingOpen * .1), -.3], a = sd * (.45 + P.wingOpen * .5), rot = [[Math.cos(a), -Math.sin(a), 0], [Math.sin(a), Math.cos(a), 0], [0, 0, 1]];
      r.ell(w, [.1, .24, .88], K.wing, { rot, bias: .05, shade: { col: K.wingD, k: .5, dx: sd * .6, dy: -.8 } });
    }
    // ngực có tấm yên ngựa sẫm
    r.ell([0, Y(-.96), .46], [.36, .38, .3], K.body, { bias: .02 });
    r.ell([0, Y(-1.13), .44], [.37, .22, .3], K.bodyD, { bias: .021 });
    // chân sau: đùi to (sọc chữ V, hàng gai mặt trong) gập cao, ống chân mảnh có gai xuống đất
    for (const sd of [-1, 1]) {
      const saw = P.fiddle * Math.sin(P.bow), hip = [sd * .32, Y(-.76), -.3];
      let knee = [sd * .47, Y(-1.38 - P.hindUp * .3 - saw * .2) + cr * .12, -.98 + cr * .1], foot = [sd * .52, 0, -1.4 + P.hindUp * .2 + cr * .25];
      if (J > 0) { knee = V.lerp(knee, [sd * .45, Y(-.95), -1.2], J); foot = V.lerp(foot, [sd * .48, Y(-.42), -1.85], J); }   // nhảy: chân sau duỗi thẳng ra sau
      r.cap(hip, knee, .31, K.body, { bias: .03, shade: { col: K.bodyD, k: .4, dx: 0, dy: -1 } });
      for (const t of [.3, .55, .8]) { const m = V.lerp(hip, knee, t); r.decal(m, [.16, .16, .16], [sd, 0, .25], .07, c => { c.strokeStyle = K.bodyD; c.lineWidth = .35; c.lineCap = 'round'; c.beginPath(); c.moveTo(-.8, -.6); c.lineTo(0, .4); c.lineTo(.8, -.6); c.stroke(); }, { bias: .031 }); }
      if (r.detail || P.pegs) for (let i = 0; i < 9; i++) { const m = V.lerp(hip, knee, .18 + i * .08); r.ball(V.add(m, [-sd * .1, .1, .04]), .026, K.peg, { bias: .033, line: false, auto: false }); }
      r.limb([knee, foot], .09, K.bodyD, { bias: .029 });
      for (const t of [.35, .55, .75]) { const m = V.lerp(knee, foot, t); r.limb([m, V.add(m, [sd * .05, -.02, -.07])], .03, K.bodyD, { bias: .0295 }); }
      r.cap(foot, V.add(foot, [0, 0, .22]), .08, K.bodyD, { bias: .03 });
    }
    // chân giữa
    for (const sd of [-1, 1]) leg(r, [sd * .28, Y(-.66), .12], [sd * .5, Y(-.36), -.04], [sd * .55, -L * .75, .1], .09, K.bodyD, { toeDir: [sd * .2, 0, 1], bias: .025 });
    // chân trước (KHÔNG có tai); earCover: áp lên hai bên bụng
    for (const sd of [-1, 1]) {
      const hip = [sd * .23, Y(-.72), .74], f = P[sd < 0 ? 'frontL' : 'frontR'], cov = P.earCover;
      let foot = f || [sd * .4, -L * .75, 1.15];
      if (cov > 0) foot = V.lerp(foot, [sd * .44, Y(-.86), -.02], cov);
      const knee = (f || cov > 0) ? V.add(V.lerp(hip, foot, .45), [sd * .14, .1 - cov * .25, 0]) : [sd * .44, Y(-.36) + L * .25, .96];
      r.cap(hip, knee, .14, K.bodyD, { bias: .04 + cov * .1 });
      r.limb([knee, foot], .09, K.body, { bias: .041 + cov * .1 });
      r.cap(foot, V.add(foot, [0, -.02, .14]), .07, K.bodyD, { bias: .042 + cov * .1 });
    }
    // đầu
    const H = [0, Y(-1.04), 1.0];
    r.ball(H, .41, K.body, { bias: .06 });
    bugFace(r, H, .41, E, { eyeA: .46, eyeEl: -.3, eyeR: .48, lid: K.body, cheekA: .82, cheekEl: .3, mouthEl: .5, mouthW: .24 });
    // râu NGẮN, dày, chĩa về trước-lên
    for (const sd of [-1, 1]) {
      const a = P.ant, pts = [];
      for (let i = 0; i <= 4; i++) { const u = i / 4; pts.push([sd * (.12 + .26 * u), Y(-1.38 - .5 * u + u * u * .12 + Math.sin(u * 4 + a) * u * .04), 1.12 + .3 * u]); }
      antenna(r, pts, .055, K.bodyD, { club: .045, bias: .07 });
    }
  },
  expr: { excited: { fx: 'sparkle' } },
  exprPose: {
    happy: {}, surprised: { lift: .12, ant: 1 }, curious: { ant: .6, frontR: [.42, -.4, 1.42] }, worried: { crouch: .5, earCover: .5 },
    sad: { crouch: .3 }, excited: { lift: .3, wingOpen: .6, fiddle: .6, bow: 1.2 }, confident: { fiddle: .4, bow: .6 },
    thinking: { frontR: [.4, -1.12, 1.35] }, explaining: { frontR: [.46, -1.5, 1.25] }, silly: { hindUp: .6, ant: 2 },
  },
};
