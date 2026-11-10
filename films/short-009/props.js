// Đạo cụ và bối cảnh của SHORT-009: chiếc lá to lúc hoàng hôn (trời dải cam hồng, mặt trời lặn, sao sớm), hoa hướng dương phía sau,
// huy hiệu số đếm cánh, tia "xì" khi Fizz gồng đuôi, và bản Blink của tập tách riêng tấm cánh (cases) và cánh mỏng (wings).
// Khối phẳng, không viền (Khối Kẹo Phẳng): trời là các dải phẳng chồng nhau.
import { C, circle, ell, rrect, poly, capsule, popText, TAU } from '/_shared/kit.js';
import { hash, lerp, clamp, seg, ss, eo, back } from '/core/lib.js';
import { star } from '/_shared/characters/face.js';
import { V } from '/_shared/characters/rig.js';
import { X, bugFace, leg, antenna, glassWing, halo } from '/_shared/characters/parts.js';
import { BLINK } from '/_shared/characters/cast/blink.js';

export const D = {
  sky0: '#5A33D6', sky1: '#9A3FC8', sky2: '#E8336D', sky3: '#FF7A2F', sky4: '#FFC32B', sun: '#FFE34D', sunL: '#FFF3B8',
  hill0: '#7A2E8C', hill1: '#5E2477', sil: '#4A1E6A', leaf: '#22B866', leafD: '#169150', leafL: '#6FE39A', rim: '#FFB25C',
  petal: '#FFC32B', petalD: '#E0A410', seed: '#7A4320', seedD: '#5A2F14', stem: '#2E9C52',
};

/* ---------- trời hoàng hôn: dải phẳng, mặt trời lặn, sao sớm, đồi và bóng cỏ xa ---------- */
export const SUN = { x: 860, y: 1080, r: 150 };
export function duskSky(c, t, o = {}) {
  c.fillStyle = D.sky0; c.fillRect(-1600, -1600, 4300, 3600);
  for (const [y, h, col] of [[700, 1600, D.sky1], [930, 1300, D.sky2], [1060, 1100, D.sky3], [1140, 900, D.sky4]]) ell(c, 560, y + 520, 1900, h * .5, 0, col);
  for (let i = 0; i < 30; i++) { const x = -400 + hash(i + 500) * 1900, y = -200 + hash(i + 510) * 620, tw = .5 + .5 * Math.sin(t * (1.5 + hash(i + 520)) + i); if (i % 5 === 0) star(c, x, y, (4 + 4 * hash(i)) * tw, C.cream); else circle(c, x, y, 2 + 2 * hash(i + 3) * tw, 'rgba(255,248,231,.8)'); }
  if (!o.noSun) { for (const [m, a] of [[2.2, .1], [1.6, .16]]) circle(c, SUN.x, SUN.y, SUN.r * m, `rgba(255,227,77,${a})`); circle(c, SUN.x, SUN.y, SUN.r, D.sun); circle(c, SUN.x, SUN.y, SUN.r * .7, D.sunL); }
  ell(c, 100, 1150, 760, 190, 0, D.hill0); ell(c, 1050, 1170, 820, 210, 0, D.hill1);
  for (let i = 0; i < 40; i++) { const gx = -260 + i * 42, h = 50 + hash(i + 33) * 90, sw = Math.sin(t * 1.2 + i) * 5; poly(c, [[gx - 12, 1175], [gx + 12, 1175], [gx + sw, 1175 - h]], D.sil); }
}
/* ---------- hoa hướng dương phía sau bên trái (Fizz bay vòng quanh ở cuối phim) ---------- */
export const SUNF = { x: 110, y: 830, r: 140 };
export function sunflower(c, t) {
  const sw = Math.sin(t * .8) * 8, hx = SUNF.x + sw, hy = SUNF.y;
  capsule(c, SUNF.x - 20, 1600, hx, hy + 60, 34, D.stem);
  ell(c, SUNF.x + 40, 1050, 120, 50, -.5, D.stem); ell(c, SUNF.x - 70, 1180, 110, 46, .5, D.stem);
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + t * .05; ell(c, hx + Math.cos(a) * SUNF.r * .95, hy + Math.sin(a) * SUNF.r * .95, SUNF.r * .42, SUNF.r * .17, a, i % 2 ? D.petal : D.petalD); }
  circle(c, hx, hy, SUNF.r * .62, D.seedD); circle(c, hx, hy, SUNF.r * .54, D.seed);
  for (let i = 0; i < 18; i++) { const a = i * 2.4, rr = SUNF.r * .5 * Math.sqrt((i + .5) / 18); circle(c, hx + Math.cos(a) * rr, hy + Math.sin(a) * rr, 6, D.seedD); }
}

/* ---------- chiếc lá to (mặt lá là "sân khấu"), viền nắng chiều ---------- */
export const LEAF = { x0: -280, x1: 1360, y: 1240, bow: 24 };
export const leafY = x => LEAF.y - LEAF.bow * Math.sin(Math.PI * clamp((x - LEAF.x0) / (LEAF.x1 - LEAF.x0)));
export function leaf(c) {
  c.fillStyle = D.leafD; c.beginPath(); c.moveTo(LEAF.x0, leafY(LEAF.x0) + 30);
  for (let x = LEAF.x0; x <= LEAF.x1; x += 40) c.lineTo(x, leafY(x) + 74 + 26 * Math.sin(Math.PI * (x - LEAF.x0) / (LEAF.x1 - LEAF.x0)));
  for (let x = LEAF.x1; x >= LEAF.x0; x -= 40) c.lineTo(x, leafY(x) + 10); c.closePath(); c.fill();
  c.fillStyle = D.leaf; c.beginPath(); c.moveTo(LEAF.x0, leafY(LEAF.x0));
  for (let x = LEAF.x0; x <= LEAF.x1; x += 40) c.lineTo(x, leafY(x) - 6);
  for (let x = LEAF.x1; x >= LEAF.x0; x -= 40) c.lineTo(x, leafY(x) + 54 + 22 * Math.sin(Math.PI * (x - LEAF.x0) / (LEAF.x1 - LEAF.x0)));
  c.closePath(); c.fill();
  c.strokeStyle = D.rim; c.lineCap = 'round'; c.lineWidth = 7; c.beginPath(); for (let x = LEAF.x0; x <= LEAF.x1; x += 40) c.lineTo(x, leafY(x) - 3); c.stroke();
  c.strokeStyle = D.leafL; c.lineWidth = 10; c.beginPath(); for (let x = LEAF.x0; x <= LEAF.x1; x += 40) { const y = leafY(x) + 24; x === LEAF.x0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
  c.lineWidth = 6; for (let x = -100; x < 1300; x += 170) { c.beginPath(); c.moveTo(x, leafY(x) + 24); c.lineTo(x + 70, leafY(x) + 48); c.stroke(); }
  // bụi lá phía dưới (lấp nửa dưới khung)
  for (let x = -300, i = 0; x < 1500; x += 220, i++) circle(c, x, 1470 + (i % 2) * 40, 220, i % 2 ? '#139A55' : D.leafD);
  rrect(c, -400, 1650, 1900, 900, 0, '#0F7A43');
}

/* ---------- quầng sáng nhỏ, đốm sáng ---------- */
export function bigGlow(c, x, y, r, a = 1) { if (a <= .01) return; for (const [k, al] of [[1, .1], [.7, .15], [.45, .22]]) circle(c, x, y, r * k, `rgba(255,232,110,${al * a})`); }

/* ---------- huy hiệu số đếm (toạ độ khung): bật lên, nảy; ghi vào readcheck ---------- */
export function countBadge(c, x, y, n, t, t0, fill = C.cream, ink = C.ink, r = 58) {
  if (t < t0) return;
  const p = back(seg(t, t0, t0 + .28), 2.6);
  c.save(); c.translate(x, y); c.scale(p, p);
  circle(c, 6, 8, r, 'rgba(30,27,58,.3)'); circle(c, 0, 0, r, fill); c.strokeStyle = ink; c.lineWidth = 7; c.beginPath(); c.arc(0, 0, r - 4, 0, TAU); c.stroke();
  c.restore();
  popText(c, String(n), x, y + r * .36, r * 1.05, ink, null, t, t0, { step: 0 });
  const q = seg(t, t0, t0 + .5); if (q > 0 && q < 1) { c.strokeStyle = `rgba(255,248,231,${1 - q})`; c.lineWidth = 8 * (1 - q) + 2; c.beginPath(); c.arc(x, y, r * (1.1 + .7 * eo(q)), 0, TAU); c.stroke(); }
}

/* ---------- tia "xì" (Fizz gồng đuôi): vài tia sáng nhỏ rồi một cụm khói xám ---------- */
export function fizzle(c, x, y, p) {
  if (p <= 0 || p >= 1) return;
  for (let i = 0; i < 5; i++) { const a = -1.2 + i * .6, d = 30 + 60 * eo(p); star(c, x + Math.cos(a) * d, y + Math.sin(a) * d, 12 * (1 - p), C.lemon); }
  for (let i = 0; i < 3; i++) { const q = clamp(p * 1.3 - i * .15); if (q > 0 && q < 1) circle(c, x - 20 - 40 * q - i * 16, y - 10 - 50 * q + i * 6, (16 + 18 * q) * (1 - .2 * i), `rgba(190,180,210,${.8 * (1 - q)})`); }
}

/* ---------- Blink của tập: tấm cánh (cases) và cánh mỏng (wings) mở riêng ----------
   Như _shared/characters/cast/blink.js, chỉ khác: pose.cases 0..1 nâng tấm cánh lên cao hẳn (thấy rõ hai tấm), pose.wings 0..1 mở hai cánh mỏng.
   Dùng drawChar(c, BLINK_WINGS, …) với pose { glow, cases, wings, lift, legsUp }. Rig dùng chung giữ nguyên. */
export const BLINK_WINGS = {
  ...BLINK, id: 'blink',
  build(r, o = {}) {
    const P = { lift: 0, glow: .7, cases: 0, wings: 0, legsUp: null, tailUp: 0, ...(o.pose || {}) }, E = o.E || {}, L = P.lift, Y = y => y - L, g = P.glow;
    const tail = [0, Y(-.62 + P.tailUp * .2), -.78];
    if (g > .05) halo(r, tail, .36, .6 + g * .6);
    r.ell(tail, [.4, .36, .4], g > .05 ? C.lemon : C.cream, { bias: -.02, shade: { col: g > .05 ? C.mango : X.creamD, k: .25 } });
    r.ell(V.add(tail, [0, .02, .2]), [.42, .3, .2], X.mintD, { bias: -.019 });
    if (P.wings > 0) for (const sd of [-1, 1]) glassWing(r, [sd * .2, Y(-1.15), -.05], V.mul(V.norm([sd * .9, -.45, -.35]), 1.3 * P.wings), V.mul([0, 0, -1], .5), { len: 1, wid: .42, bias: -.3 });
    for (const sd of [-1, 1]) {
      const open = P.cases * 1.15, ctr = [sd * (.2 + open * .32), Y(-.88 - open * .32), -.22 + open * .05], a = open * sd * .75;
      r.ell(ctr, [.32, .38, .62], C.mint, { rot: [[Math.cos(a), -Math.sin(a), 0], [Math.sin(a), Math.cos(a), 0], [0, 0, 1]], bias: .01 + .05 * P.cases, shade: { col: X.mintD, k: .3 } });
    }
    const feet = [[-.34, 0, .42], [-.4, 0, .02], [-.34, 0, -.38], [.34, 0, .42], [.4, 0, .02], [.34, 0, -.38]];
    feet.forEach((f, i) => {
      const sd = i < 3 ? -1 : 1, j = i % 3, hip = [sd * .16, Y(-.5), [.3, .1, -.12][j]];
      const ft = (P.legsUp && P.legsUp[i]) || V.add(f, [0, L > 0 ? -L * .6 : 0, 0]), knee = V.lerp(hip, ft, .5); knee[0] += sd * .1; knee[1] -= .1;
      leg(r, hip, knee, ft, .075, C.ink, { toeDir: [sd * .2, 0, 1], bias: -.03 });
    });
    const H = [0, Y(-.86), .52];
    r.ball(H, .4, C.mint, { bias: .04 });
    r.ell([0, Y(-1.18), .36], [.44, .2, .36], X.mintD, { bias: .045 });
    bugFace(r, H, .4, E, { eyeA: .45, eyeEl: -.08, eyeR: .44, lid: C.mint, cheekA: .9, cheekEl: .36, mouthEl: .52, mouthW: .26 });
    for (const sd of [-1, 1]) antenna(r, [[sd * .12, Y(-1.28), .66], [sd * .26, Y(-1.56), .82], [sd * .42, Y(-1.72), .9]], .05, C.ink, { club: .06, bias: .05 });
  },
};
// tâm tấm cánh và tâm cánh mỏng (toạ độ rig), để đặt số đếm
export const caseCenter = (sd, cases, lift = 0) => { const open = cases * 1.15; return [sd * (.2 + open * .32), -.88 - open * .32 - lift - .2, .1]; };
export const wingCenter = (sd, wings, lift = 0) => { const d = V.norm([sd * .9, -.45, -.35]); return V.add([sd * .2, -1.15 - lift, -.05], V.mul(d, .65 * 1.3 * wings)); };
export const fizzWingCenter = (sd, flap, lift = 0) => { const a = flap, dir = V.norm([sd * (.35 + .9 * a), -.2 - .5 * a, -1 + .7 * a]); return V.add([sd * .16, -1.1 - lift, -.02], V.mul(dir, .6)); };
