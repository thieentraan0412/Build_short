// Albie, cuốn sổ sưu tầm biết nói: bìa tím (grape), ruột kem (cream), góc bọc vàng mật (honey), ruy băng berry là cái lưỡi,
// mép sticker thò ra ở cạnh trên như tóc. Hai mắt tròn trên bìa. Khi nói, bìa hé ra như cái miệng (thấy ruột kem và ruy băng).
// Không tay chân: cử chỉ bằng một trang giấy thò ra từ mép sách, đi bằng cách nhún lắc trên hai góc đáy.
import { C } from '../../kit.js';
import { V, rotZ, rotY, mvec, mmul } from '../rig.js';
import { X } from '../parts.js';
import { eye, cheek, eyeOpts } from '../face.js';
const TAU = Math.PI * 2;
const W = 1.5, H = 2.0, T = .44, CV = .06;          // rộng, cao, dày, độ dày bìa

// miệng của Albie = khe bìa hé ra: kem (mép giấy) + lòng tối + ruy băng berry
function albieMouth(c, kind, talk = .6) {
  const ink = C.nightD || '#2A1478';
  c.lineCap = c.lineJoin = 'round';
  const open = { talk: .25 + .45 * talk, o: .55, grin: .7, shout: .95 }[kind];
  if (open) {
    const w = kind === 'o' ? .42 : 1, h = open;
    c.fillStyle = C.cream; c.beginPath(); c.ellipse(0, 0, w, h * .62 + .12, 0, 0, TAU); c.fill();
    c.fillStyle = X.nightD; c.beginPath(); c.ellipse(0, .06, w * .82, h * .5, 0, 0, TAU); c.fill();
    c.save(); c.clip(); c.fillStyle = C.berry; c.beginPath(); c.ellipse(.1, h * .5, w * .34, h * .34, 0, 0, TAU); c.fill(); c.restore();
    c.strokeStyle = X.creamD; c.lineWidth = .05; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * w * .3, -(h * .62 + .1)); c.lineTo(i * w * .3, -(h * .62 - .06)); c.stroke(); }
    return;
  }
  // miệng khép: nếp bìa đậm
  c.strokeStyle = X.nightD; c.lineWidth = .2; c.beginPath();
  if (kind === 'frown') c.arc(0, .7, .8, Math.PI + .6, TAU - .6);
  else if (kind === 'flat') { c.moveTo(-.5, 0); c.lineTo(.5, 0); }
  else if (kind === 'wavy') { for (let i = 0; i <= 12; i++) { const x = -.7 + i * .117; i ? c.lineTo(x, Math.sin(i * 1.05) * .13) : c.moveTo(x, 0); } }
  else if (kind === 'zig') [[-.7, 0], [-.35, .22], [0, 0], [.35, .22], [.7, 0]].forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p));
  else if (kind === 'smirk') { c.moveTo(-.6, 0); c.quadraticCurveTo(.2, .38, .78, -.25); }
  else if (kind === 'side') { c.ellipse(.4, 0, .16, .13, 0, 0, TAU); c.fillStyle = X.nightD; c.fill(); return; }
  else if (kind === 'tiny') c.arc(0, -.3, .5, .55, Math.PI - .55);
  else c.arc(0, -.6, .95, .55, Math.PI - .55);
  c.stroke();
}

export const ALBIE_POSE = { hop: 0, tilt: 0, page: null, pageCurl: .3, open: 0, tabsUp: 0, sneeze: 0, wet: 0, newPage: false, scarf: false };

export const ALBIE = {
  id: 'albie', name: 'Albie', h: 2.25, top: -2.25, w: 1.7, realH: .55, kind: 'object',
  face: { c: [0, -1.2, .25], r: .55 }, head: { c: [0, -1.55, .2], r: .8 },
  build(r, o = {}) {
    const P = { ...ALBIE_POSE, ...(o.pose || {}) }, E = o.E || {};
    // khung quay của sách: nghiêng trên một góc đáy khi đi
    const piv = [P.tilt > 0 ? W / 2 : -W / 2, -P.hop, 0], R = rotZ(P.tilt);
    const Tf = p => V.add(piv, mvec(R, V.sub(p, [piv[0], 0, 0])));
    const face = (O, U, Vv, fn, bias = 0) => r.plane(Tf(O), mvec(R, U), mvec(R, Vv), fn, { cull: true, bias });
    const yC = -H / 2;
    // ruột giấy (kem) giữa hai bìa
    face([W / 2 - .02, yC, 0], [0, 0, -(T / 2 - CV)], [0, H / 2 - .04, 0], c => { c.fillStyle = C.cream; c.fillRect(-1, -1, 2, 2); c.fillStyle = X.creamD; for (let i = -3; i <= 3; i++) c.fillRect(i * .27 - .02, -1, .04, 2); });   // mép trước (phải)
    face([0, -H + .02, 0], [W / 2 - .04, 0, 0], [0, 0, T / 2 - CV], c => { c.fillStyle = C.cream; c.fillRect(-1, -1, 2, 2); c.fillStyle = X.creamD; for (let i = -3; i <= 3; i++) c.fillRect(-1, i * .27 - .02, 2, .04); });   // mép trên
    face([0, -.02, 0], [W / 2 - .04, 0, 0], [0, 0, -(T / 2 - CV)], c => { c.fillStyle = C.cream; c.fillRect(-1, -1, 2, 2); });                                                      // mép dưới
    // gáy sách (trái): bìa tím bọc vòng
    face([-W / 2, yC, 0], [0, 0, T / 2], [0, H / 2, 0], c => { c.fillStyle = X.grapeD; c.fillRect(-1, -1, 2, 2); c.fillStyle = C.grape; c.fillRect(-1, -.78, 2, .14); c.fillRect(-1, .64, 2, .14); });
    // bìa sau
    face([0, yC, -T / 2], [-W / 2, 0, 0], [0, H / 2, 0], c => {
      c.fillStyle = C.grape; c.fillRect(-1, -1, 2, 2);
      c.fillStyle = C.honey; for (const [x, y] of [[-1, -1], [-1, 1]]) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + .34, y); c.lineTo(x, y - Math.sign(y) * .26); c.fill(); }
      c.fillStyle = X.grapeD; c.beginPath(); c.roundRect(-.55, -.3, 1.1, .6, .12); c.fill();
    });
    // cạnh bìa (độ dày bìa) để hai bìa không mỏng như giấy
    for (const z of [T / 2 - CV / 2, -T / 2 + CV / 2]) {
      face([W / 2, yC, z], [0, 0, -CV / 2], [0, H / 2, 0], c => { c.fillStyle = X.grapeD; c.fillRect(-1, -1, 2, 2); }, .001);
      face([0, -H, z], [W / 2, 0, 0], [0, 0, CV / 2], c => { c.fillStyle = X.grapeD; c.fillRect(-1, -1, 2, 2); }, .001);
    }
    // bìa trước: mắt, má, miệng, góc bọc
    face([0, yC, T / 2], [W / 2, 0, 0], [0, H / 2, 0], (c, f) => {
      c.fillStyle = C.grape; c.fillRect(-1, -1, 2, 2);
      c.fillStyle = X.grapeD; c.fillRect(-1, -1, .1, 2);
      c.fillStyle = C.honey; for (const [x, y] of [[1, -1], [1, 1]]) { c.beginPath(); c.moveTo(x, y); c.lineTo(x - .34, y); c.lineTo(x, y - Math.sign(y) * .26); c.fill(); }
      if (P.wet) { c.fillStyle = C.skyL; for (const [x, y] of [[-.5, .3], [.5, .3]]) { c.beginPath(); c.ellipse(x, y + .2, .08, .3 * P.wet, 0, 0, TAU); c.fill(); } }
      for (const sd of [-1, 1]) {
        c.save(); c.translate(sd * .4, -.35); c.scale(.25 / (W / 2), .25 / (H / 2));
        eye(c, eyeOpts(E, sd, { lid: C.grape })); c.restore();
        c.save(); c.translate(sd * .68, .02); c.scale(.1 / (W / 2), .1 / (H / 2)); cheek(c); c.restore();
      }
      c.save(); c.translate(0, .36); c.scale(.3 / (W / 2), .3 / (H / 2)); albieMouth(c, E.mouth || 'smile', E.talk ?? .6); c.restore();
    }, .002);
    // mép sticker thò lên như tóc
    const tabs = [[-.42, C.sky, -.25], [-.12, C.lemon, .08], [.18, C.mint, -.05], [.44, C.pink, .22]];
    tabs.forEach(([x, col, a], i) => { const R2 = mmul(R, rotZ(a + P.tabsUp * (i % 2 ? .3 : -.3))); r.plane(Tf([x, -H - .04, -.04 + i * .02]), mvec(R2, [.12, 0, 0]), mvec(R2, [0, .2, 0]), c => { c.fillStyle = col; c.beginPath(); c.roundRect(-1, -1.2, 2, 1.8, .6); c.fill(); }, { bias: -.01 }); });
    // ruy băng đuôi (berry), thò ra ở đáy
    r.plane(Tf([.12, .04, .02]), mvec(R, [.07, 0, 0]), mvec(R, [0, .16, 0]), c => { c.fillStyle = C.berry; c.fillRect(-1, -1, 2, 1.9); c.beginPath(); c.moveTo(-1, .9); c.lineTo(-1, 1.6); c.lineTo(0, 1.05); c.lineTo(1, 1.6); c.lineTo(1, .9); c.fill(); }, { bias: -.03 });
    // trang giấy làm tay: thò ra từ mép trước
    if (P.page) {
      const base = Tf([W / 2 - .05, P.page[1] ?? -1.1, .05]), tip = Tf([W / 2 + P.page[0], (P.page[1] ?? -1.1) + (P.page[2] ?? 0), .12]);
      const q0 = r.P(base), q1 = r.P(tip);
      r.flat(Math.max(q0[2], q1[2]) + .1, c => {
        const dx = q1[0] - q0[0], dy = q1[1] - q0[1], L = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
        c.translate(q0[0], q0[1]); c.rotate(a);
        c.fillStyle = C.cream; c.beginPath(); c.moveTo(0, -.22); c.lineTo(L * .82, -.2); c.quadraticCurveTo(L * 1.05, -.18, L, .05 + P.pageCurl * .1); c.quadraticCurveTo(L * .8, .2, 0, .22); c.closePath(); c.fill();
        c.fillStyle = X.creamD; c.beginPath(); c.ellipse(L * .9, .02, L * .1, .12, 0, 0, TAU); c.fill();
      });
    }
    if (P.newPage) face([W / 2 + .1, -1.0, .12], [.3, 0, 0], [0, .5, 0], c => { c.fillStyle = C.mintL; c.beginPath(); c.roundRect(-1, -1, 2, 2, .2); c.fill(); }, .2);
    if (P.scarf) { const q = r.P(Tf([0, -1.82, T / 2 + .02])); r.flat(q[2] + .3, c => { c.fillStyle = C.sky; c.beginPath(); c.roundRect(q[0] - .8, q[1] - .1, 1.6, .2, .1); c.fill(); c.fillStyle = C.skyL; c.beginPath(); c.roundRect(q[0] + .3, q[1], .18, .5, .09); c.fill(); }); }
  },
  exprPose: {
    surprised: { hop: .18, tabsUp: 1 }, excited: { hop: .3, tabsUp: 1, page: [.75, -1.6, -.35] }, sad: { tilt: -.04 }, worried: { tilt: .03 },
    confident: { page: [.6, -.7, .1] }, confused: { tilt: -.08, tabsUp: .6 }, thinking: { page: [.45, -1.0, -.5] }, explaining: { page: [.8, -1.4, -.55], pageCurl: -.4 },
    curious: { tilt: .08 },
  },
};
