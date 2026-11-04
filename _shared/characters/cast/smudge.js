// Smudge: vết dấu tay trên kính. Phản diện vô hại, chỉ sống trên mặt kính (luôn phẳng như một lớp màng).
// Màu: mực trong suốt (khói tím xám) với các vòng vân tay đậm hơn; mắt và miệng theo ngữ pháp chung, chỉ thấy ở mặt trước.
import { C } from '../../kit.js';
import { eye, mouth, eyeOpts } from '../face.js';
import { GLASS } from './loupe.js';
const TAU = Math.PI * 2;
export const SMUDGE_COL = { body: 'rgba(58,53,102,.30)', ridge: 'rgba(58,53,102,.32)', edge: 'rgba(58,53,102,.16)' };

// hình vết: elip hơi méo; sx/sy kéo giãn, wob làm méo mép, streak = vệt bị lau
function blob(c, sx, sy, wob, ph) {
  c.beginPath();
  for (let i = 0; i <= 40; i++) { const a = i * TAU / 40, k = 1 + wob * (.06 * Math.sin(a * 3 + ph) + .04 * Math.sin(a * 5 - ph * 1.3)); const x = Math.cos(a) * sx * k, y = Math.sin(a) * sy * k; i ? c.lineTo(x, y) : c.moveTo(x, y); }
  c.closePath();
}
export const SMUDGE_POSE = { sx: 1, sy: 1, wob: 1, ph: 0, glass: true, streak: 0, fade: 1, drip: 0, lift: .62, under: null };

export const SMUDGE = {
  id: 'smudge', name: 'Smudge', h: 1.35, top: -1.35, w: 1.5, realH: .15, kind: 'flat',
  face: { c: [0, -.62, 0], r: .36, fxLight: C.cream }, head: { c: [0, -.7, 0], r: .62 },
  build(r, o = {}) {
    const P = { ...SMUDGE_POSE, ...(o.pose || {}) }, E = o.E || {};
    const O = [0, -P.lift, 0];
    if (P.glass) r.plane([0, -P.lift, -.01], [.7, 0, 0], [0, .7, 0], c => { c.fillStyle = GLASS; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); if (P.under) P.under(c); }, { bias: -.5 });
    if (Math.abs(Math.cos(r.yaw)) < .25) r.flat(0, c => { c.fillStyle = P.glass ? GLASS : 'rgba(0,0,0,0)'; c.fillRect(-.035, -P.lift - .7, .07, 1.4); c.fillStyle = SMUDGE_COL.body; c.fillRect(-.06, -P.lift - .5 * P.sy, .12, P.sy); });   // nhìn nghiêng: chỉ còn một nét mỏng
    r.plane(O, [.5, 0, 0], [0, .5, 0], (c, f) => {
      c.globalAlpha = P.fade;
      if (P.streak) { c.fillStyle = SMUDGE_COL.edge; for (let i = -2; i <= 2; i++) { c.beginPath(); c.roundRect(-1.1 + P.streak * .4, i * .26 - .07, 2.2 + P.streak * 1.6, .14, .07); c.fill(); } }
      c.fillStyle = SMUDGE_COL.edge; blob(c, P.sx * 1.08, P.sy * 1.08, P.wob, P.ph); c.fill();
      c.fillStyle = SMUDGE_COL.body; blob(c, P.sx, P.sy, P.wob, P.ph); c.fill();
      if (P.drip) { c.fillStyle = SMUDGE_COL.body; c.beginPath(); c.roundRect(.3 * P.sx, .4 * P.sy, .16, .5 + P.drip * .6, .08); c.fill(); c.beginPath(); c.arc(.38 * P.sx, .9 * P.sy + P.drip * .6, .12, 0, TAU); c.fill(); }
      // vân tay: các vòng xoáy lồng nhau
      c.save(); c.scale(P.sx, P.sy); c.strokeStyle = SMUDGE_COL.ridge; c.lineWidth = .07; c.lineCap = 'round';
      for (let k = 1; k <= 5; k++) { const rr = k * .15; c.beginPath(); c.ellipse(0, .05 * k, rr * 1.08, rr, 0, Math.PI * (1.05 - k * .02), Math.PI * (2.0 + .05 * k)); c.stroke(); }
      c.restore();
      if (f < 0) return;                                         // nhìn từ sau kính: chỉ thấy vết, không thấy mặt
      for (const sd of [-1, 1]) { c.save(); c.translate(sd * .32 * P.sx, -.12 * P.sy); c.scale(.25, .25); eye(c, eyeOpts(E, sd, { lid: '#C9CBE0' })); c.restore(); }
      c.save(); c.translate(0, .36 * P.sy); c.scale(.2, .2); mouth(c, E.mouth || 'smile', { talk: E.talk ?? .6 }); c.restore();
    });
  },
  expr: { happy: { mouth: 'smirk' } },
  exprPose: {
    surprised: { sx: 1.1, sy: 1.1, wob: 2.5 }, worried: { sx: .9, sy: .92, wob: .4 }, sad: { sy: 1.1, sx: .9, drip: .7 }, confident: { sx: 1.15, sy: 1.05 },
    confused: { wob: 2.2, ph: 1.4 }, excited: { sx: 1.2, sy: 1.15, wob: 3 }, thinking: { ph: .8 }, explaining: { sx: 1.05 },
  },
};
