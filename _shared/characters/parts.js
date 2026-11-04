// Phụ tùng dùng chung: bảng màu mở rộng (các sắc tối để tô mảng bóng), mặt côn trùng, chân, râu, cánh.
import { C } from '../kit.js';
import { V } from './rig.js';
import { eye, mouth, cheek, eyeOpts } from './face.js';
const TAU = Math.PI * 2;

// Màu gốc lấy từ bảng C của kit.js; các sắc dưới đây chỉ là mảng tối/sáng của chính màu đó (như berryD, leafD trong pilot).
export const X = {
  nightD: '#2A1478', tangD: '#D65A1E', mangoD: '#E0A410', lemonD: '#E5C22E', mintD: '#45D3AF', pinkD: '#F27AAE',
  grapeD: '#4424B2', skyD: '#1EA3DB', inkL: '#3A3566', creamD: '#EBDDBC', wing: '#EFFFFA', skinL: '#FFDCC2', leafL: '#5BD892',
  honeyL: C.honeyL, glow: 'rgba(255,227,77,.32)', glow2: 'rgba(255,227,77,.18)',
};

// hướng từ góc quay ngang a (quanh trục đứng) và góc ngẩng el (âm = lên trên)
export const dirA = (a, el = 0) => [Math.sin(a) * Math.cos(el), Math.sin(el), Math.cos(a) * Math.cos(el)];

// mặt côn trùng: hai mắt to trên đầu tròn, má hồng, miệng. Mắt to hơn đầu một chút cũng được (như dế của pilot).
export function bugFace(r, H, R, E, o = {}) {
  const { eyeA = .42, eyeEl = -.2, eyeR = .36, lid, white = C.white, ink = C.ink, line = C.ink, cheekCol = C.pink, cheekA = .7, cheekEl = .22,
    showCheek = true, mouthEl = .42, mouthW = .2, mouthInk = C.ink, tongue = C.pink, eyeK = 1, mouthFn = null } = o;
  for (const sd of [-1, 1]) {
    const eo = eyeOpts(E, sd, { lid, white, ink, line });
    r.feat(H, R * eyeK, dirA(sd * eyeA, eyeEl), R * eyeR, c => eye(c, eo), { cullAt: -.12 });
    if (showCheek || E.fx === 'blush') r.feat(H, R, dirA(sd * cheekA, cheekEl), R * (E.fx === 'blush' ? .2 : .13), c => cheek(c, cheekCol), { bias: .001, cullAt: -.05 });
  }
  if (mouthFn) mouthFn();
  else r.feat(H, R, dirA(0, mouthEl), R * mouthW, c => mouth(c, E.mouth || 'smile', { ink: mouthInk, tongue, talk: E.talk ?? .6 }), { cullAt: -.3 });
}

// chân hai đốt: hông → gối → bàn chân, thêm bàn chân ngắn
export function leg(r, hip, knee, foot, w, col, o = {}) {
  r.limb([hip, knee, foot], w, col, { bias: o.bias || 0 });
  if (o.toe !== false) { const d = o.toeDir || [0, 0, 1], t = V.add(foot, V.mul(V.norm(d), w * 1.3)); r.cap(foot, t, w * .9, col, { bias: (o.bias || 0) + .001 }); }
}

// râu: đường cong qua các điểm; đầu râu có thể là chấm tròn
export function antenna(r, pts, w, col, o = {}) {
  r.limb(pts, w, col, { smooth: true, bias: o.bias || 0 });
  if (o.club) r.ball(pts[pts.length - 1], o.club, o.clubCol || col, { bias: (o.bias || 0) + .001 });
}

// cánh trong suốt (ong, đom đóm khi bay): hình elip trên một mặt phẳng
export function glassWing(r, base, U, W, o = {}) {
  const { len = 1, wid = .45, col = X.wing, vein = C.mintL, bias = -.2 } = o;
  r.plane(base, U, W, c => {
    c.fillStyle = col; c.beginPath(); c.ellipse(len * .5, 0, len * .5, wid, 0, 0, TAU); c.fill();
    c.fillStyle = vein; c.beginPath(); c.ellipse(len * .52, 0, len * .32, wid * .52, 0, 0, TAU); c.fill();
  }, { bias });
}

// vòng sáng phẳng (đuôi đom đóm): các vòng tròn đồng tâm trong suốt
export function halo(r, p, rad, k = 1) {
  const q = r.P(p);
  r.flat(q[2] - .5, c => { for (const [m, col] of [[2.4, X.glow2], [1.7, X.glow]]) { c.fillStyle = col; c.beginPath(); c.arc(q[0], q[1], rad * m * k, 0, TAU); c.fill(); } });
}
