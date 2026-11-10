// Zip, chuồn chuồn (khách mời, ra mắt ở SHORT-010, vai chính ở tập 4 Mùa 1). Không lời, chỉ "zip!": lượn vụt, đứng yên giữa trời, bay lùi.
// Đặc điểm khoá: thân xanh trời rất dài có vòng chanh, hai vòm mắt kép xanh cốm KHỔNG LỒ chiếm gần hết đầu và chạm nhau ở đỉnh đầu
// (FACTS của SHORT-010), bốn cánh dài trong suốt xoè ngang có chấm sẫm ở đầu cánh, sáu chân ngắn gom dưới ngực.
// Khác các bọ khác của kênh: Blink bạc hà tròn, Fizz xanh than mắt đỏ, Crumb hổ phách. Khối phẳng, một mảng tối.
import { C } from '../../kit.js';
import { V } from '../rig.js';
import { X, dirA, leg } from '../parts.js';
import { eye, mouth, eyeOpts } from '../face.js';

export const ZIP_COL = { body: C.sky, bodyD: '#1EA3DB', ring: C.lemon, eye: C.lime, eyeD: '#86C72C', eyeL: '#E2FF9E', wing: 'rgba(225,246,255,.72)', vein: 'rgba(120,190,235,.8)', spot: '#2B5C9E' };
// flap: pha đập cánh (rad) · beat: biên độ đập 0..1 (0 = cánh xoè yên) · blur 0..1: bóng mờ cánh khi đứng yên giữa trời · curl: đuôi cong lên (+) / xuống (−)
// lift: nhấc khỏi mặt đất · peek: xoay hai mắt hoạt hình quanh vòm mắt (rad, âm = sang trái/ra sau) để cho thấy Zip đang nhìn về phía sau
export const ZIP_POSE = { lift: 0, flap: 0, beat: 0, blur: 0, curl: 0, peek: 0, legsUp: null, look: null };

export const ZIP = {
  id: 'zip', name: 'Zip', h: 1.25, top: -1.25, w: 3.2, realH: .06, kind: 'bug', guest: true,
  face: { c: [0, -.74, .78], r: .4 }, head: { c: [0, -.8, .55], r: .6 },
  build(r, o = {}) {
    const P = { ...ZIP_POSE, ...(o.pose || {}) }, E = o.E || {}, L = P.lift, Y = y => y - L, K = ZIP_COL;
    // bốn cánh dài xoè ngang (hai cặp), đập lên xuống quanh trục thân; chấm sẫm ở đầu cánh
    const wing = (sd, front, da = 0, alpha = 1) => {
      const a = (front ? 1 : -1) * .35 * P.beat * Math.sin(P.flap + (front ? 0 : Math.PI)) + da, base = [sd * .14, Y(-.72), front ? .22 : -.02];
      const U = V.norm([sd * Math.cos(a), -Math.sin(a) * .9 - .16, front ? .12 : -.18]), W = [0, -.16, front ? .3 : .34];   // cánh xoè ngang, nghiêng nhẹ để thấy mặt cánh từ phía trước
      r.plane(base, V.mul(U, 1.55), W, c => {
        c.globalAlpha *= alpha;
        c.fillStyle = K.wing; c.beginPath(); c.ellipse(.5, 0, .5, .5, 0, 0, Math.PI * 2); c.fill();
        c.strokeStyle = K.vein; c.lineWidth = .02; c.lineCap = 'round';
        for (const k of [-.22, 0, .22]) { c.beginPath(); c.moveTo(.03, k * .5); c.lineTo(.95, k * .8); c.stroke(); }
        c.fillStyle = K.spot; c.beginPath(); c.ellipse(.86, -.18, .055, .12, 0, 0, Math.PI * 2); c.fill();
      }, { bias: -.2 });
    };
    for (const sd of [-1, 1]) {
      if (P.blur > 0) for (const da of [-.42, .42]) { wing(sd, false, -da, .3 * P.blur); wing(sd, true, da, .3 * P.blur); }   // cánh đập nhanh (đứng yên giữa trời): hai bóng mờ
      wing(sd, false); wing(sd, true);
    }
    // đuôi (bụng) rất dài: chuỗi đốt xanh trời, vòng chanh; curl uốn đuôi
    const segs = 7, pts = [];
    for (let i = 0; i <= segs; i++) { const u = i / segs, z = -.25 - 2.0 * u, y = Y(-.6) - P.curl * .6 * u * u + .08 * u; pts.push([0, y, z]); }
    r.limb(pts, .2, K.body, { bias: -.02 });
    for (let i = 1; i < segs; i += 2) r.ball(pts[i], .105, K.ring, { bias: -.019 });
    r.ball(pts[segs], .12, K.bodyD, { bias: -.018 });
    // sáu chân ngắn gom dưới ngực (chuồn chuồn đậu bằng chân như cái giỏ)
    const feet = [[-.22, 0, .42], [-.28, 0, .18], [-.26, 0, -.06], [.22, 0, .42], [.28, 0, .18], [.26, 0, -.06]];
    feet.forEach((f, i) => {
      const sd = i < 3 ? -1 : 1, j = i % 3, hip = [sd * .1, Y(-.42), [.28, .14, 0][j]];
      const ft = (P.legsUp && P.legsUp[i]) || V.add(f, [0, L > 0 ? -L * .7 : 0, 0]), knee = V.lerp(hip, ft, .45); knee[0] += sd * .16; knee[1] -= .1;
      leg(r, hip, knee, ft, .045, C.ink, { toeDir: [sd * .2, 0, 1], bias: -.03 });
    });
    // ngực xanh trời, hai sọc chanh chéo
    const TC = [0, Y(-.58), .12], TR = [.3, .28, .38];
    r.ell(TC, TR, K.body, { shade: { col: K.bodyD, k: .3 }, bias: .005 });
    for (const sd of [-1, 1]) r.decal(TC, TR, [sd * .7, -.45, .4], .12, c => { c.fillStyle = K.ring; c.beginPath(); c.ellipse(0, 0, 1.7, .55, sd * .6, 0, Math.PI * 2); c.fill(); }, { bias: .006 });
    // đầu: hai vòm mắt kép khổng lồ chạm nhau ở đỉnh đầu, chiếm gần hết đầu; mặt nhỏ bên dưới
    const H = [0, Y(-.7), .62];
    r.ball(H, .26, K.body, { bias: .02 });
    for (const sd of [-1, 1]) {
      const D = [sd * .2, Y(-.86), .6];
      r.ball(D, .36, K.eye, { bias: .03, shade: { col: K.eyeD, k: .3 } });
      r.feat(D, .36, dirA(sd * .55, -.6), .09, c => { c.fillStyle = K.eyeL; c.beginPath(); c.arc(0, 0, 1, 0, Math.PI * 2); c.fill(); }, { bias: .002, cullAt: -.1 });
      const eo = eyeOpts(E, sd, { lid: K.eye });
      if (P.look) eo.look = P.look;
      r.feat(D, .36, dirA(sd * .32 + P.peek, -.05), .19, c => eye(c, eo), { bias: .003, cullAt: -.15 });
    }
    r.feat(H, .26, dirA(0, .55), .1, c => mouth(c, E.mouth || 'smile', { ink: C.ink, tongue: C.pink, talk: E.talk ?? .6 }), { bias: .045, cullAt: -.3 });
  },
  exprPose: {
    happy: {}, curious: {}, surprised: { lift: .06 }, excited: { beat: 1, lift: .2 }, confident: {}, sad: { curl: -.3 },
  },
};
