// Dàn nhân vật. Tất cả dựng từ khối phẳng; `detail` là chi tiết chỉ kính lúp mới thấy.
import { C, circle, ell, capsule, path, rrect, poly, TAU, clamp, lerp } from './kit.js';

// Cô Lúp: gốc toạ độ ở tâm kính, r = bán kính kính, thân là cán kính.
export function lup(c, x, y, r, o = {}) {
  const { rot = -.14, expr = 'happy', look = [0, 0], talk = 0, blink = 0, armL = [-.42, .12], armR = [.42, .12], glass = false, hop = 0, squash = 0, body = true } = o;
  c.save(); c.translate(x, y - hop); c.rotate(rot);
  if (body) {
    const k = 1 + squash, by = r * 1.0;
    c.save(); c.translate(0, r * 2.5); c.scale(k, 1 / k); c.translate(0, -r * 2.5);
    // chân, giày
    for (const s of [-1, 1]) { capsule(c, s * r * .17, r * 2.25, s * r * .17, r * 2.56, r * .13, C.berryD); ell(c, s * r * .24, r * 2.62, r * .2, r * .11, 0, C.mango); }
    // tay sau thân
    const sh = r * 1.68;
    capsule(c, -r * .3, sh, -r * .3 + armL[0] * r, sh + armL[1] * r, r * .14, C.berryD); circle(c, -r * .3 + armL[0] * r, sh + armL[1] * r, r * .13, C.mango);
    capsule(c, r * .3, sh, r * .3 + armR[0] * r, sh + armR[1] * r, r * .14, C.berryD); circle(c, r * .3 + armR[0] * r, sh + armR[1] * r, r * .13, C.mango);
    // thân là cán kính
    capsule(c, 0, by + r * .2, 0, r * 2.2, r * .78, C.berry);
    capsule(c, r * .2, by + r * .32, r * .2, r * 2.2, r * .38, C.berryD);
    capsule(c, 0, by + r * .2, 0, r * 2.2, r * .5, C.berry);
    // cổ áo
    rrect(c, -r * .36, r * .94, r * .72, r * .17, r * .08, C.mango);
    face(c, r, expr, look, talk, blink);
    c.restore();
  }
  // vành kính là hình khuyên, trong rỗng để nhìn thấy cảnh phóng lớn
  c.fillStyle = C.berry; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.arc(0, 0, r * .85, 0, TAU, true); c.fill('evenodd');
  c.fillStyle = C.berryD; c.beginPath(); c.arc(0, 0, r, .2, 1.8); c.arc(0, 0, r * .9, 1.8, .2, true); c.closePath(); c.fill();
  if (glass) { c.fillStyle = 'rgba(223,249,255,.85)'; c.beginPath(); c.arc(0, 0, r * .85, 0, TAU); c.fill(); }
  // vệt sáng trên kính
  c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineCap = 'round'; c.lineWidth = r * .07;
  c.beginPath(); c.arc(0, 0, r * .68, Math.PI * 1.08, Math.PI * 1.36); c.stroke();
  c.beginPath(); c.arc(0, 0, r * .68, Math.PI * 1.45, Math.PI * 1.5); c.stroke();
  c.restore();
}
function face(c, r, expr, look, talk, blink) {
  const y = r * 1.42, sep = r * .25, er = r * .235;
  for (const s of [-1, 1]) {
    const ex = s * sep;
    if (expr === 'laugh') { c.strokeStyle = C.ink; c.lineWidth = r * .07; c.lineCap = 'round'; c.beginPath(); c.arc(ex, y + r * .05, er * .75, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); continue; }
    const open = clamp(1 - blink);
    ell(c, ex, y, er, er * open * (expr === 'wow' || expr === 'shock' ? 1.14 : 1), 0, C.white);
    if (open > .15) {
      const pr = er * (expr === 'wow' || expr === 'shock' ? .34 : .5);
      let lx = look[0], ly = look[1];
      if (expr === 'cross') { lx = -s * .55; ly = -.72; }
      circle(c, ex + lx * er * .5, y + ly * er * .5, pr, C.ink);
      circle(c, ex + lx * er * .5 + pr * .32, y + ly * er * .5 - pr * .32, pr * .28, C.white);
    }
  }
  const my = r * 1.86;
  ell(c, -r * .32, my - r * .08, r * .09, r * .055, 0, C.pink); ell(c, r * .32, my - r * .08, r * .09, r * .055, 0, C.pink);
  const op = expr === 'wow' ? .7 : expr === 'shock' ? .55 : expr === 'laugh' ? .95 : talk;
  if (op > .08) {
    ell(c, 0, my, r * .17 * (expr === 'wow' ? .8 : 1), r * .16 * op + r * .02, 0, C.ink);
    ell(c, 0, my + r * .1 * op, r * .1, r * .06 * op, 0, C.pink);
  } else { c.strokeStyle = C.ink; c.lineWidth = r * .055; c.lineCap = 'round'; c.beginPath(); c.arc(0, my - r * .1, r * .15, .35, Math.PI - .35); c.stroke(); }
}

// mắt tròn dùng chung cho côn trùng
function bugEye(c, x, y, r, look) { circle(c, x, y, r, C.white); circle(c, x + look[0] * r * .4, y + look[1] * r * .4, r * .55, C.ink); circle(c, x + look[0] * r * .4 + r * .2, y + look[1] * r * .4 - r * .2, r * .17, C.white); }

// vòi bướm: tongue 0 = cuộn tròn ốc dưới miệng, 1 = duỗi chéo xuống trước (vào nhuỵ hoa)
function proboscis(c, x, y, L, tongue, w, f) {
  const n = 70, pts = [], R = .16, cx = x + R * .2, cy = y + R;
  for (let i = 0; i <= n; i++) {
    const s = i / n, th = -Math.PI / 2 + s * Math.PI * 3.2, rr = R * (1 - .78 * s);
    const sp = [cx + Math.cos(th) * rr, cy + Math.sin(th) * rr];
    const st = [x + Math.cos(1.2) * L * s, y + Math.sin(1.2) * L * s];
    pts.push([lerp(sp[0], st[0], tongue), lerp(sp[1], st[1], tongue)]);
  }
  path(c, pts, w, f);
}

// Bướm nhìn ngang, mặt quay phải. s = nửa chiều cao thân; chân chạm đất ở y = +.62
export const BF = { foot: [-.42, .63], feet: [-.42, .02, .44], head: [.62, -.04], ground: .66 };
export function butterfly(c, x, y, s, o = {}) {
  const { flap = 0, rot = 0, flip = 1, look = [.3, 0], tongue = 0, detail = 0, glow = 0, wingA = C.berry, wingB = C.tang, legs = 1 } = o;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(flip * s, s);
  const k = lerp(1, .22, flap);
  c.save(); c.translate(0, -.04); c.scale(1, k);          // cánh gập theo trục thân
  ell(c, .06, -.94, .6, .88, -.3, C.night); ell(c, -.5, -.3, .5, .44, .5, '#D65A1E');   // cánh xa
  ell(c, -.08, -.9, .6, .88, -.34, wingA); ell(c, -.64, -.26, .5, .44, .5, wingB);       // cánh gần
  circle(c, .02, -1.2, .24, C.mango); circle(c, .02, -1.2, .1, C.cream); circle(c, -.28, -.72, .13, C.cream); circle(c, -.74, -.28, .15, C.mango);
  c.restore();
  // chân sau thân
  if (legs) BF.feet.forEach((fx, i) => {
    const hx = lerp(-.2, .2, i / 2), kx = lerp(hx, fx, .7) + (i - 1) * .04;
    capsule(c, hx, .1, kx, .34, .075, C.ink); capsule(c, kx, .34, fx, .62, .055, C.ink);
    capsule(c, fx - .08, .635, fx + .1, .635, .055, C.ink);
    if (detail) {
      for (let j = 0; j < 4; j++) {
        const px = lerp(fx - .08, fx + .1, j / 3);
        capsule(c, px, .625, px + .012, .6, .006, C.ink);
        circle(c, px, .635, .014, glow > .02 ? C.lime : C.mintL);
        if (glow > .02) circle(c, px, .635, .014 + .02 * glow, 'rgba(183,240,74,.35)');
      }
    }
  });
  capsule(c, -.5, .08, .36, .02, .32, C.ink);
  circle(c, .56, -.03, .22, C.ink);
  bugEye(c, .6, -.09, .13, look);
  proboscis(c, .72, .1, .78, tongue, .065, C.tang);
  // râu
  for (const a of [-.12, .04]) { const pts = []; for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push([.62 + u * .62 + a * u, -.2 - u * .62 + u * u * .2]); } path(c, pts, .026, C.ink); const e = pts[12]; circle(c, e[0], e[1], .05, C.mango); }
  c.restore();
}

// Dế nhìn ngang, mặt quay phải. Chân đứng ở y = +.92
export const CK = { ear: [1.2, .63], head: [1.02, -.16], body: [-.1, -.04], ground: .92 };
export function cricket(c, x, y, s, o = {}) {
  const { chirp = 0, look = [.4, 0], detail = 0, glow = 0, legLift = 0, ant = 0, talk = 0 } = o;
  c.save(); c.translate(x, y); c.scale(s, s);
  // chân sau (lớn)
  capsule(c, -.5, .16, -1.1, -.46, .32, C.limeD); capsule(c, -1.1, -.46, -1.5, .84, .1, C.limeD); capsule(c, -1.58, .9, -1.34, .9, .08, C.limeD);
  // chân giữa
  capsule(c, .06, .24, -.1, .62, .14, C.limeD); capsule(c, -.1, .62, .08, .9, .08, C.limeD);
  // đuôi
  capsule(c, -.94, .02, -1.42, -.12, .04, C.limeD); capsule(c, -.94, .06, -1.42, .1, .04, C.limeD);
  // thân
  ell(c, -.02, 0, 1, .48, 0, C.lime);
  c.save(); c.beginPath(); c.ellipse(-.02, 0, 1, .48, 0, 0, TAU); c.clip(); ell(c, -.02, .42, 1, .3, 0, C.limeD); c.restore();
  // cánh rung khi gáy
  c.save(); c.translate(.5, -.2); c.rotate(-.06 - chirp * .14);
  ell(c, -.62, 0, .78, .25, .03, C.leaf); ell(c, -.62, -.03, .66, .13, .03, C.leafD);
  c.restore();
  // đầu
  circle(c, 1.0, -.14, .42, C.lime);
  bugEye(c, 1.1, -.24, .21, look);
  ell(c, .86, .06, .08, .05, 0, C.pink);
  if (talk > .1) ell(c, 1.3, .05, .09, .06 * talk + .02, 0, C.ink); else { c.strokeStyle = C.ink; c.lineWidth = .03; c.lineCap = 'round'; c.beginPath(); c.arc(1.24, -.0, .1, .5, 2.2); c.stroke(); }
  // râu dài
  for (const [a, b] of [[.0, .3], [.14, .0]]) { const pts = []; for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push([1.16 - u * 1.4 + a, -.48 - u * 1.2 + u * u * (1 + b) + Math.sin(u * 6 + ant) * u * .05]); } path(c, pts, .03, C.limeD); }
  // chân trước, có thể nâng lên; tai nằm phần trên ống chân
  const knee = [lerp(1.0, 1.28, legLift), lerp(.62, .22, legLift)], fA = lerp(1.12, -.75, legLift);
  const foot = [knee[0] + Math.cos(fA) * .34, knee[1] + Math.sin(fA) * .34];
  capsule(c, .78, .26, knee[0], knee[1], .16, C.limeD); capsule(c, knee[0], knee[1], foot[0], foot[1], .1, C.lime);
  capsule(c, foot[0], foot[1], foot[0] + .18, foot[1] + (legLift ? -.06 : .02), .06, C.limeD);
  if (detail) {
    const ex = lerp(knee[0], foot[0], .32), ey = lerp(knee[1], foot[1], .32);
    ell(c, ex, ey, .085, .045, fA, C.leafD);
    ell(c, ex, ey, .066 + .01 * glow, .03 + .006 * glow, fA, glow > .02 ? C.mint : C.limeD);
    circle(c, ex - .02, ey - .008, .012, C.white);
  }
  c.restore();
}
export function cricketEar(legLift = 0) {
  const knee = [lerp(1.0, 1.28, legLift), lerp(.62, .22, legLift)], fA = lerp(1.12, -.75, legLift), foot = [knee[0] + Math.cos(fA) * .34, knee[1] + Math.sin(fA) * .34];
  return [lerp(knee[0], foot[0], .32), lerp(knee[1], foot[1], .32)];
}

// Ong, mặt quay phải theo rot
export function bee(c, x, y, s, o = {}) {
  const { rot = 0, wing = 0, look = [.4, 0], mouth = 'smile', flip = 1, body = C.lemon } = o;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s * flip, s);
  // cánh
  for (const [dx, a] of [[-.28, -.32], [.14, .12]]) { c.save(); c.translate(dx, -.5); c.rotate(a + wing * .34); ell(c, 0, -.5, .34, .62, 0, '#EFFFFA'); ell(c, 0, -.46, .2, .42, 0, C.mintL); c.restore(); }
  poly(c, [[-1.12, -.1], [-1.46, 0], [-1.12, .1]], C.ink);
  ell(c, 0, 0, 1.16, .76, 0, body);
  c.save(); c.beginPath(); c.ellipse(0, 0, 1.16, .76, 0, 0, TAU); c.clip();
  c.fillStyle = C.ink; c.fillRect(-.74, -1, .3, 2); c.fillRect(-.14, -1, .3, 2); c.restore();
  bugEye(c, .7, -.14, .25, look);
  ell(c, .46, .24, .1, .06, 0, C.pink);
  if (mouth === 'smile') { c.strokeStyle = C.ink; c.lineWidth = .05; c.lineCap = 'round'; c.beginPath(); c.arc(.72, .2, .14, .4, 2.3); c.stroke(); }
  else ell(c, .76, .3, .12, .1, 0, C.ink);
  for (const a of [-.2, .16]) { const pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push([.66 + u * .5 + a * u, -.66 - u * .58 + u * u * .22]); } path(c, pts, .05, C.ink); const e = pts[8]; circle(c, e[0], e[1], .08, C.ink); }
  c.restore();
}

export function flower(c, x, y, r, o = {}) {
  const { n = 6, petal = C.mango, heart = C.berry, stem = 0, leafy = 1, sway = 0, open = 1 } = o;
  if (stem) { capsule(c, x, y, x + sway * .3, y + stem, r * .16, C.leaf); if (leafy) { ell(c, x + r * .5, y + stem * .55, r * .52, r * .2, -.5, C.leaf); ell(c, x - r * .5, y + stem * .75, r * .52, r * .2, .5, C.leafD); } }
  for (let i = 0; i < n; i++) { const a = i * TAU / n + .2 + sway * .002; circle(c, x + Math.cos(a) * r * .62 * open, y + Math.sin(a) * r * .62 * open, r * .46 * open, petal); }
  circle(c, x, y, r * .44, heart);
}

export function cloud(c, x, y, s, f = C.cream) { circle(c, x, y, s * .5, f); circle(c, x + s * .55, y + s * .08, s * .38, f); circle(c, x - s * .55, y + s * .1, s * .34, f); rrect(c, x - s * .9, y + s * .1, s * 1.8, s * .34, s * .17, f); }
export function sun(c, x, y, r, rot = 0) { for (let i = 0; i < 10; i++) { const a = rot + i * TAU / 10; capsule(c, x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3, x + Math.cos(a) * r * 1.62, y + Math.sin(a) * r * 1.62, r * .16, C.lemon); } circle(c, x, y, r, C.lemon); }

export function iceCream(c, x, y, s, sq = 0, o = {}) {
  const { toes = 0 } = o;
  c.save(); c.translate(x, y); c.scale(s, s);
  // ốc quế
  poly(c, [[-92, 0], [92, 0], [0, 210]], '#E8A85C');
  c.save(); c.beginPath(); c.moveTo(-92, 0); c.lineTo(92, 0); c.lineTo(0, 210); c.closePath(); c.clip();
  for (let i = -5; i < 7; i++) { capsule(c, i * 36 - 60, 0, i * 36 + 60, 210, 6, '#C98638'); capsule(c, i * 36 + 60, 0, i * 36 - 60, 210, 6, '#C98638'); }
  c.restore();
  // kem bị ép dẹt khi giẫm
  const k = lerp(1, .42, sq), w = lerp(1, 1.5, sq);
  c.save(); c.scale(w, k);
  circle(c, 0, -46, 110, C.pink);
  circle(c, -60, -28, 56, C.pink); circle(c, 60, -28, 56, C.pink);
  if (sq < .2) { circle(c, 0, -146, 12, C.berry); ell(c, -30, -120, 8, 14, .4, C.mint); ell(c, 34, -112, 8, 14, -.5, C.lemon); }
  c.restore();
  if (sq > .3) { for (const [dx, h] of [[-120, 62], [-74, 92], [66, 74], [124, 52]]) { capsule(c, dx, 6, dx, 6 + h * sq, 28, C.pink); } }
  c.restore();
}
// bàn chân giẫm từ trên xuống; (x, y) là gót dưới
export function bareFoot(c, x, y, s, wiggle = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rrect(c, -86, -1400, 172, 1330, 40, C.skin);
  rrect(c, 30, -1400, 56, 1330, 28, C.skinD);
  rrect(c, -92, -96, 300, 96, 48, C.skin);
  rrect(c, -92, -30, 300, 30, 15, C.skinD);
  const toes = [[206, -48, 40], [160, -34, 25], [122, -30, 22], [88, -28, 20], [58, -26, 18]];
  toes.forEach(([tx, ty, r], i) => circle(c, tx, ty - Math.max(0, Math.sin(wiggle * 12 + i * .9)) * 12 * clamp(wiggle), r, i === 0 ? C.skin : C.skinD));
  c.restore();
}
