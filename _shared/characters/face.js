// Ngữ pháp khuôn mặt dùng chung cho cả dàn nhân vật.
// Mắt: tròng trắng tròn + con ngươi mực + một đốm sáng. Không lông mày: cảm xúc nằm ở mí (khối cùng màu thân cắt vào tròng),
// con ngươi và miệng. Mọi hàm vẽ trong toạ độ đơn vị (mắt bán kính 1, miệng rộng ±1).
// Bản v2 (LOOK.v = 2): mắt có mống mắt theo màu thân, con ngươi, hai điểm sáng, bóng mí; THÊM lông mày theo biểu cảm;
// miệng nét thon hai đầu, miệng mở có răng trên, lưỡi và viền. Nhánh v1 giữ nguyên từng nét.
import { C } from '../kit.js';
import { LOOK, PASS, devStroke, irisOf, mix } from './look.js';
const TAU = Math.PI * 2;
const circ = (c, x, y, r) => { c.beginPath(); c.arc(x, y, Math.max(0, r), 0, TAU); };
const V2 = () => LOOK.v >= 2;
const ring = (c, x, y, r) => { c.moveTo(x + r, y); c.arc(x, y, Math.max(0, r), 0, TAU); };

// ---- v2: lông mày ----
// Mỗi biểu cảm có thể ghi brow: { lift, tilt, arch } (và browL / browR riêng từng bên). Không ghi thì suy ra từ mí, cỡ mắt, mắt nhắm:
// lift > 0 nhướng lên · tilt > 0 đầu trong (phía mũi) nhướng lên = lo, buồn; tilt < 0 = cau, quyết tâm · arch: độ vồng
export function autoBrow(o) {
  let lift = .04, tilt = 0, arch = .24;
  if (o.closed === 'happy') { lift = .24; arch = .34; }
  else if (o.closed === 'sad') { tilt = .75; arch = 0; lift = .06; }
  else if (o.closed === 'squeeze') { tilt = -.6; lift = -.18; arch = .06; }
  else if (o.closed) { lift = -.04; arch = .1; }
  const lt = o.lidTilt || 0;
  if (lt > .05) { tilt = Math.min(1, lt / .42) * .8; arch = .04; }
  else if (lt < -.05) { tilt = -.75; arch = .02; lift = -.12; }
  else if ((o.lidTop || 0) > .3 && !o.closed) { lift -= .16; arch = .12; }
  const sc = o.scale || 1;
  if (sc > 1.05) { lift += .36; arch += .1; } else if (sc < .9) lift -= .1;
  return { lift, tilt, arch };
}
function brow(c, o) {
  if (PASS.sil) return;   // lông mày "nổi" không có viền ngoài
  const B = { ...autoBrow(o), ...(o.brow || {}) }, side = o.side || 1, sc = Math.min(1.15, o.scale || 1);
  const col = o.browCol || o.line || C.ink, hw = .72 * sc * (o.browW || 1), y0 = -sc - .4 - B.lift * .6 + (o.browY || 0), N = 16, top = [], bot = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, x = -hw + 2 * hw * t, q = x / hw, u = -side * q;              // u = +1 ở đầu trong (phía mũi)
    const y = y0 - B.tilt * u * .34 - B.arch * (1 - q * q) * .34, th = .05 + .13 * Math.sin(Math.PI * t) + .05 * (u + 1) / 2;
    top.push([x, y - th / 2]); bot.push([x, y + th / 2]);
  }
  c.fillStyle = col; c.beginPath(); top.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); for (let i = N; i >= 0; i--) c.lineTo(bot[i][0], bot[i][1]); c.closePath(); c.fill();
}

// ---- v2: mắt ----
function eye2(c, o) {
  const { look = [0, 0], open = 1, pupil = .5, lidTop = 0, lidTilt = 0, lidBot = 0, lid = C.berry, side = 1, closed = null, glint = 1,
    white = C.white, ink = C.ink, line = C.ink, scale = 1 } = o;
  if (closed) {
    c.strokeStyle = line; c.lineWidth = .3; c.lineCap = c.lineJoin = 'round'; c.beginPath();
    if (closed === 'happy') c.arc(0, .42, .78, Math.PI * 1.16, Math.PI * 1.84);
    else if (closed === 'sad') c.arc(0, -.5, .78, Math.PI * .18, Math.PI * .82);
    else if (closed === 'squeeze') { c.moveTo(-.7 * side, -.45); c.lineTo(.55 * side, 0); c.lineTo(-.7 * side, .45); }
    else { c.moveTo(-.72, .1); c.lineTo(.72, .1); }
    c.stroke();
  } else {
    const iris = o.iris || irisOf(lid), W = PASS.W;
    c.save(); c.scale(scale, scale * Math.max(.04, open));
    c.fillStyle = white; circ(c, 0, 0, 1); c.fill();
    c.save(); circ(c, 0, 0, 1); c.clip();
    const px = look[0] * (1 - pupil) * .95, py = look[1] * (1 - pupil) * .95, ri = pupil * 1.04;
    c.fillStyle = mix(iris, ink, .5); circ(c, px, py, ri); c.fill();                       // vành mống mắt
    c.fillStyle = iris; circ(c, px, py, ri * .84); c.fill();
    c.save(); circ(c, px, py, ri * .84); c.clip();                                          // ánh phản chiếu dưới đáy mống mắt
    c.fillStyle = mix(iris, '#FFFFFF', .4); c.beginPath(); ring(c, px, py, ri * .84); ring(c, px, py - ri * .34, ri * .84); c.fill('evenodd'); c.restore();
    c.fillStyle = ink; circ(c, px, py, pupil * .55); c.fill();
    c.fillStyle = 'rgba(46,28,110,.14)'; c.beginPath(); ring(c, 0, 0, 1); ring(c, 0, .24, 1); c.fill('evenodd');   // bóng mí trên nhãn cầu
    if (glint) {
      const g = glint > 1 ? 1.18 : 1;
      c.fillStyle = white; circ(c, px + ri * .34, py - ri * .36, ri * .3 * g); c.fill();
      circ(c, px - ri * .38, py + ri * .3, ri * .13 * g); c.fill();
      if (glint > 1) { circ(c, px + ri * .5, py + ri * .14, ri * .07); c.fill(); }
    }
    c.fillStyle = lid;
    if (lidTop > 0) { c.save(); c.translate(0, -1 + 2 * lidTop); c.rotate(lidTilt * side); c.fillRect(-3, -4, 6, 4); c.beginPath(); c.moveTo(-3, 0); c.lineTo(3, 0); devStroke(c, W * .9); c.restore(); }
    if (lidBot > 0) { circ(c, 0, 1 - 2 * lidBot + 1.5, 1.5); c.fill(); devStroke(c, W * .9); }
    c.restore();
    circ(c, 0, 0, 1); devStroke(c, W);
    c.restore();
  }
  if (o.brow !== false) brow(c, o);
}

export function eye(c, o = {}) {
  if (V2()) return eye2(c, o);
  const { look = [0, 0], open = 1, pupil = .5, lidTop = 0, lidTilt = 0, lidBot = 0, lid = C.berry, side = 1, closed = null, glint = 1,
    white = C.white, ink = C.ink, line = C.ink, scale = 1 } = o;
  if (closed) {
    c.strokeStyle = line; c.lineWidth = .32; c.lineCap = c.lineJoin = 'round'; c.beginPath();
    if (closed === 'happy') c.arc(0, .42, .78, Math.PI * 1.16, Math.PI * 1.84);
    else if (closed === 'sad') c.arc(0, -.5, .78, Math.PI * .18, Math.PI * .82);
    else if (closed === 'squeeze') { c.moveTo(-.7 * side, -.45); c.lineTo(.55 * side, 0); c.lineTo(-.7 * side, .45); }
    else { c.moveTo(-.72, .1); c.lineTo(.72, .1); }
    c.stroke(); return;
  }
  c.save(); c.scale(scale, scale * Math.max(.04, open));
  c.fillStyle = white; circ(c, 0, 0, 1); c.fill();
  c.save(); circ(c, 0, 0, 1); c.clip();
  const px = look[0] * (1 - pupil) * .95, py = look[1] * (1 - pupil) * .95;
  c.fillStyle = ink; circ(c, px, py, pupil); c.fill();
  if (glint) { c.fillStyle = white; circ(c, px + pupil * .34, py - pupil * .34, pupil * .3); c.fill(); }
  if (glint > 1) { c.fillStyle = white; circ(c, px - pupil * .38, py + pupil * .36, pupil * .16); c.fill(); }
  c.fillStyle = lid;
  if (lidTop > 0) { c.save(); c.translate(0, -1 + 2 * lidTop); c.rotate(lidTilt * side); c.fillRect(-3, -4, 6, 4); c.restore(); }
  if (lidBot > 0) { circ(c, 0, 1 - 2 * lidBot + 1.5, 1.5); c.fill(); }
  c.restore(); c.restore();
}

// ---- v2: miệng ----
const MOUTH_IN = '#5C1838';
// nét thon hai đầu (dày ở giữa) đi qua các điểm
function taper(c, pts, w, col) {
  const n = pts.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const t = i / (n - 1), hw = w * (.42 + .58 * Math.sin(Math.PI * t)) / 2;
    L.push([pts[i][0] - dy / l * hw, pts[i][1] + dx / l * hw]); R.push([pts[i][0] + dy / l * hw, pts[i][1] - dx / l * hw]);
  }
  c.fillStyle = col; c.beginPath(); L.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); for (let i = n - 1; i >= 0; i--) c.lineTo(R[i][0], R[i][1]); c.closePath(); c.fill();
  circ(c, pts[0][0], pts[0][1], w * .21); c.fill(); circ(c, pts[n - 1][0], pts[n - 1][1], w * .21); c.fill();
}
const arcPts = (cx, cy, r, a0, a1, n = 18) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
const linePts = (pts, n = 4) => pts.slice(1).flatMap((b, j) => { const a = pts[j]; return Array.from({ length: n }, (_, i) => [a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]); }).concat([pts[pts.length - 1]]);
// miệng mở: lòng miệng, răng trên, lưỡi, viền. shape(c) vẽ đường bao miệng; top = mép trên; h = độ mở
function openMouth(c, shape, top, h, o, teeth = true) {
  const { ink = C.ink, tongue = C.pink } = o;
  c.save(); shape(c); c.fillStyle = MOUTH_IN; c.fill(); c.clip();
  c.fillStyle = tongue; c.beginPath(); c.ellipse(0, top + h * 1.02, .62, h * .55, 0, 0, TAU); c.fill();
  c.fillStyle = mix(tongue, '#FFFFFF', .35); c.beginPath(); c.ellipse(-.12, top + h * .78, .2, h * .12, 0, 0, TAU); c.fill();
  if (teeth && h > .3) { c.fillStyle = C.white; c.beginPath(); c.roundRect(-1.2, top - .4, 2.4, .4 + Math.min(.24, h * .26), .08); c.fill(); }
  c.restore();
  shape(c); devStroke(c, PASS.W * .85, ink);
}
function mouth2(c, kind, o) {
  const { ink = C.ink, tongue = C.pink, talk = .6, lw = .3 } = o, w = lw * 1.3;
  switch (kind) {
    case 'smile': taper(c, arcPts(0, -.62, 1, .52, Math.PI - .52), w, ink); break;
    case 'tiny': taper(c, arcPts(0, -.3, .55, .55, Math.PI - .55, 12), w * .9, ink); break;
    case 'frown': taper(c, arcPts(0, .82, .9, Math.PI + .62, TAU - .62), w, ink); break;
    case 'flat': taper(c, linePts([[-.55, .1], [.55, .1]], 8), w * .9, ink); break;
    case 'wavy': taper(c, Array.from({ length: 17 }, (_, i) => [-.8 + i * .1, .12 + (i ? Math.sin(i * .79) * .16 : 0)]), w * .9, ink); break;
    case 'zig': taper(c, linePts([[-.75, .05], [-.38, .3], [0, 0], [.38, .3], [.75, .05]], 3), w * .9, ink); break;
    case 'smirk': taper(c, Array.from({ length: 15 }, (_, i) => { const t = i / 14, a = [-.65, .02], b = [.2, .42], d = [.82, -.28]; return [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * b[0] + t * t * d[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * b[1] + t * t * d[1]]; }), w, ink); break;
    case 'side': c.fillStyle = MOUTH_IN; c.beginPath(); c.ellipse(.42, .12, .2, .17, 0, 0, TAU); c.fill(); devStroke(c, PASS.W * .8, ink); break;
    case 'o': openMouth(c, cc => { cc.beginPath(); cc.ellipse(0, .14, .34, .42, 0, 0, TAU); }, -.28, .42 * 1.2, o, false); break;
    case 'talk': {
      if (LOOK.cheer) { const h = .26 + .5 * talk; openMouth(c, cc => { cc.beginPath(); cc.moveTo(-.72, -.08); cc.quadraticCurveTo(0, .04, .72, -.08); cc.ellipse(0, -.08, .72, h, 0, 0, Math.PI); cc.closePath(); }, -.08, h * .95, o); break; }   // vui tươi: nói bằng miệng cười
      const h = .2 + .42 * talk; openMouth(c, cc => { cc.beginPath(); cc.ellipse(0, .1, .6, h, 0, 0, TAU); }, .1 - h, h * 1.15, o); break;
    }
    case 'grin': openMouth(c, cc => { cc.beginPath(); cc.moveTo(-.95, -.12); cc.lineTo(.95, -.12); cc.arc(0, -.12, .95, 0, Math.PI); cc.closePath(); }, -.12, .82, o); break;
    case 'shout': openMouth(c, cc => { cc.beginPath(); cc.ellipse(0, .25, .78, .72, 0, 0, TAU); }, -.47, .95, o); break;
    case 'tongue': {   // tinh nghịch: cười, lè lưỡi
      c.save(); c.translate(.22, .02); c.rotate(-.12);
      c.fillStyle = tongue; c.beginPath(); c.moveTo(-.3, 0); c.lineTo(-.3, .38); c.arc(0, .38, .3, Math.PI, 0, true); c.lineTo(.3, 0); c.closePath(); c.fill(); devStroke(c, PASS.W * .8, ink);
      c.strokeStyle = mix(tongue, MOUTH_IN, .45); c.lineWidth = .06; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, .1); c.lineTo(0, .42); c.stroke(); c.restore();
      taper(c, arcPts(0, -.62, 1, .52, Math.PI - .52), w, ink); break;
    }
    case 'none': break;
  }
}

export function mouth(c, kind = 'smile', o = {}) {
  if (V2()) return mouth2(c, kind, o);
  const { ink = C.ink, tongue = C.pink, talk = .6, lw = .3 } = o;
  c.lineCap = c.lineJoin = 'round'; c.strokeStyle = ink; c.lineWidth = lw; c.fillStyle = ink;
  const st = () => c.stroke();
  switch (kind) {
    case 'smile': c.beginPath(); c.arc(0, -.62, 1, .52, Math.PI - .52); st(); break;
    case 'tiny': c.beginPath(); c.arc(0, -.3, .55, .55, Math.PI - .55); st(); break;
    case 'frown': c.beginPath(); c.arc(0, .82, .9, Math.PI + .62, TAU - .62); st(); break;
    case 'flat': c.beginPath(); c.moveTo(-.55, .1); c.lineTo(.55, .1); st(); break;
    case 'wavy': c.beginPath(); for (let i = 0; i <= 16; i++) { const x = -.8 + i * .1; i ? c.lineTo(x, .12 + Math.sin(i * .79) * .16) : c.moveTo(x, .12); } st(); break;
    case 'zig': c.beginPath(); [[-.75, .05], [-.38, .3], [0, 0], [.38, .3], [.75, .05]].forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); st(); break;
    case 'smirk': c.beginPath(); c.moveTo(-.65, .02); c.quadraticCurveTo(.2, .42, .82, -.28); st(); break;
    case 'side': c.beginPath(); c.ellipse(.42, .12, .2, .17, 0, 0, TAU); c.fill(); break;
    case 'o': c.beginPath(); c.ellipse(0, .14, .34, .42, 0, 0, TAU); c.fill(); c.fillStyle = tongue; c.beginPath(); c.ellipse(0, .38, .2, .12, 0, 0, TAU); c.fill(); break;
    case 'talk': {
      if (LOOK.cheer) { const h = .26 + .5 * talk; c.beginPath(); c.moveTo(-.72, -.08); c.quadraticCurveTo(0, .04, .72, -.08); c.ellipse(0, -.08, .72, h, 0, 0, Math.PI); c.closePath(); c.fill(); c.save(); c.clip(); c.fillStyle = tongue; c.beginPath(); c.ellipse(0, -.08 + h * .95, .45, h * .5, 0, 0, TAU); c.fill(); c.restore(); break; }   // (11/2026) vui tươi: nói bằng miệng cười
      const h = .2 + .42 * talk; c.beginPath(); c.ellipse(0, .1, .6, h, 0, 0, TAU); c.fill(); c.save(); c.clip(); c.fillStyle = tongue; c.beginPath(); c.ellipse(0, .1 + h * .95, .4, h * .55, 0, 0, TAU); c.fill(); c.restore(); break;
    }
    case 'grin': c.beginPath(); c.moveTo(-.95, -.12); c.lineTo(.95, -.12); c.arc(0, -.12, .95, 0, Math.PI); c.closePath(); c.fill(); c.save(); c.clip(); c.fillStyle = tongue; c.beginPath(); c.ellipse(0, .78, .55, .38, 0, 0, TAU); c.fill(); c.restore(); break;
    case 'shout': c.beginPath(); c.ellipse(0, .25, .78, .72, 0, 0, TAU); c.fill(); c.save(); c.clip(); c.fillStyle = tongue; c.beginPath(); c.ellipse(0, .86, .5, .34, 0, 0, TAU); c.fill(); c.restore(); break;
    case 'tongue': c.fillStyle = tongue; c.beginPath(); c.ellipse(.22, .32, .26, .34, 0, 0, TAU); c.fill(); c.beginPath(); c.arc(0, -.62, 1, .52, Math.PI - .52); st(); break;
    case 'none': break;
  }
}

export function cheek(c, col = C.pink) {
  c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, 1, .6, 0, 0, TAU); c.fill();
  if (V2()) { c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(.42, -.2, .2, .13, -.3, 0, TAU); c.fill(); }   // đốm bóng nhỏ trên má
}

// Mười biểu cảm chuẩn của series (cùng một ngữ pháp cho mọi nhân vật) + vài trạng thái riêng
export const EXPR = {
  happy: { eye: {}, mouth: 'smile' },
  surprised: { eye: { scale: 1.12, pupil: .3 }, mouth: 'o', fx: 'burst' },
  curious: { eyeL: { lidTop: .32, look: [.45, -.35] }, eyeR: { scale: 1.08, look: [.45, -.35] }, mouth: 'tiny', tilt: .14, fx: 'q' },
  worried: { eye: { pupil: .36, lidTop: .3, lidTilt: .42 }, mouth: 'wavy', fx: 'sweat' },
  sad: { eye: { look: [0, .55], lidTop: .42, lidTilt: .45 }, mouth: 'frown', fx: 'tear', tilt: -.06 },
  confident: { eye: { lidTop: .38, lidBot: .14, look: [.15, 0] }, mouth: 'smirk', fx: 'shine' },
  confused: { eyeL: { scale: .82, look: [-.5, -.2] }, eyeR: { scale: 1.12, pupil: .34, look: [.4, .3] }, mouth: 'zig', fx: 'qq', tilt: -.12 },
  excited: { eye: { scale: 1.1, pupil: .58, glint: 2 }, mouth: 'grin', fx: 'sparkle' },
  thinking: { eyeL: { look: [.55, -.6], lidTop: .22 }, eyeR: { look: [.55, -.6], lidTop: .22 }, mouth: 'side', fx: 'dots', tilt: .08 },
  explaining: { eye: { lidBot: .2 }, mouth: 'talk', talk: .65, fx: 'idea' },
  // trạng thái phụ dùng chung
  laugh: { eye: { closed: 'happy' }, mouth: 'grin', fx: 'sparkle' },
  talk: { eye: {}, mouth: 'talk', talk: .8 },
  crosseyed: { eyeL: { look: [.75, -.55], pupil: .44 }, eyeR: { look: [-.75, -.55], pupil: .44 }, mouth: 'wavy' },
  wink: { eyeL: { closed: 'happy' }, eyeR: {}, mouth: 'smile', fx: 'shine' },
  sleepy: { eye: { lidTop: .6 }, mouth: 'flat' },
  shy: { eye: { look: [-.4, .5], lidTop: .2 }, mouth: 'tiny', fx: 'blush' },
  annoyed: { eye: { lidTop: .45, lidTilt: -.3 }, mouth: 'flat', fx: 'puff' },
  hopeful: { eye: { scale: 1.12, pupil: .56, glint: 2, look: [0, -.3] }, mouth: 'tiny', fx: 'shine' },
  cry: { eye: { closed: 'sad' }, mouth: 'shout', fx: 'tears' },
  strain: { eye: { closed: 'squeeze' }, mouth: 'flat', fx: 'sweat' },
  shout: { eye: { scale: 1.08 }, mouth: 'shout', fx: 'burst' },
  // 11/2026 (v2): tinh nghịch, buồn cười: nháy một mắt, lè lưỡi
  silly: { eyeL: { closed: 'happy' }, eyeR: { scale: 1.1, pupil: .54, look: [.25, -.25], glint: 2 }, browR: { lift: .45, arch: .3 }, mouth: 'tongue', fx: 'sparkle', tilt: .12 },
};
// lông mày (chỉ v2) của các biểu cảm cần nhấn hơn mức suy ra tự động
const BROWS = {
  happy: { brow: { lift: .1, arch: .3 } }, explaining: { brow: { lift: .22, arch: .28 } }, excited: { brow: { lift: .5, arch: .36 } },
  confident: { browL: { lift: -.1, tilt: -.25, arch: .1 }, browR: { lift: .18, arch: .3 } }, thinking: { browL: { lift: -.12, tilt: -.2 }, browR: { lift: .32, arch: .3 } },
  curious: { browL: { lift: -.06, tilt: -.15 }, browR: { lift: .42, arch: .32 } }, hopeful: { brow: { lift: .3, tilt: .45, arch: .1 } },
  shout: { brow: { lift: .2, tilt: -.45, arch: .1 } }, laugh: { brow: { lift: .3, arch: .36 } }, talk: { brow: { lift: .12, arch: .28 } },
};
for (const [k, b] of Object.entries(BROWS)) Object.assign(EXPR[k], b);
export const EXPR10 = ['happy', 'surprised', 'curious', 'worried', 'sad', 'confident', 'confused', 'excited', 'thinking', 'explaining'];
// năm biểu cảm "gương mặt thương hiệu" (bảng 22): vui, ngạc nhiên, tò mò, phấn khích, buồn cười
export const EXPR5 = ['happy', 'surprised', 'curious', 'excited', 'silly'];
export const EXPR_VI = { happy: 'vui vẻ', surprised: 'ngạc nhiên', curious: 'tò mò', worried: 'lo lắng', sad: 'buồn', confident: 'tự tin', confused: 'bối rối', excited: 'phấn khích', thinking: 'đang suy nghĩ', explaining: 'giải thích bí mật', silly: 'buồn cười' };

// mắt trái/phải theo biểu cảm, có ghi đè riêng của nhân vật
export function eyeOpts(E, side, base = {}) {
  const k = side < 0 ? 'eyeL' : 'eyeR', b = E.brow || E[side < 0 ? 'browL' : 'browR'] ? { brow: { ...(E.brow || {}), ...(E[side < 0 ? 'browL' : 'browR'] || {}) } } : {};
  return { ...base, ...(E.eye || {}), ...(E[k] || {}), ...b, side };
}

// ---- hiệu ứng phẳng quanh đầu (toạ độ màn hình; s = bán kính đầu) ----
const fxLine = c => { if (V2() && PASS.W > 0) devStroke(c, PASS.W * .75); };
function star4(c, x, y, r, col) { c.fillStyle = col; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * .3 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); fxLine(c); }
function drop(c, x, y, r, col) {
  c.fillStyle = col; c.beginPath(); c.moveTo(x, y - r * 1.7); c.quadraticCurveTo(x + r * 1.05, y - r * .2, x, y + r); c.quadraticCurveTo(x - r * 1.05, y - r * .2, x, y - r * 1.7); c.fill(); circ(c, x, y, r * .98); c.fill();
  if (V2() && PASS.W > 0) { c.beginPath(); c.moveTo(x, y - r * 1.7); c.quadraticCurveTo(x + r * 1.02, y - r * .2, x + r * .98, y); c.arc(x, y, r * .98, 0, Math.PI); c.quadraticCurveTo(x - r * 1.02, y - r * .2, x, y - r * 1.7); fxLine(c); c.fillStyle = 'rgba(255,255,255,.8)'; circ(c, x - r * .35, y - r * .1, r * .22); c.fill(); }
}
function qmark(c, x, y, s, col) { c.strokeStyle = col; c.fillStyle = col; c.lineWidth = s * .26; c.lineCap = 'round'; c.beginPath(); c.arc(x, y - s * .55, s * .42, Math.PI * 1.1, Math.PI * 2.3); c.quadraticCurveTo(x, y - s * .05, x, y + s * .22); c.stroke(); circ(c, x, y + s * .62, s * .15); c.fill(); }
export const star = star4;
export function fx(c, kind, x, y, s, o = {}) {
  const ink = o.ink || C.ink, light = o.light || C.cream;
  switch (kind) {
    case 'burst': c.strokeStyle = ink; c.lineCap = 'round'; c.lineWidth = s * .09;
      for (const a of [-2.5, -1.95, -1.2, -.65]) { c.beginPath(); c.moveTo(x + Math.cos(a) * s * 1.25, y + Math.sin(a) * s * 1.25); c.lineTo(x + Math.cos(a) * s * 1.6, y + Math.sin(a) * s * 1.6); c.stroke(); } break;
    case 'q': qmark(c, x + s * 1.15, y - s * 1.0, s * .5, o.qcol || ink); break;
    case 'qq': qmark(c, x + s * 1.1, y - s * 1.05, s * .5, o.qcol || ink); qmark(c, x - s * 1.05, y - s * .85, s * .36, o.qcol || ink); break;
    case 'sweat': drop(c, x + s * 1.02, y - s * .55, s * .16, C.sky); break;
    case 'tear': drop(c, x + (o.tearX ?? s * .45), y + (o.tearY ?? s * .35), s * .12, C.sky); break;
    case 'tears': drop(c, x - s * .6, y + s * .3, s * .13, C.sky); drop(c, x + s * .6, y + s * .3, s * .13, C.sky); break;
    case 'sparkle': star4(c, x - s * 1.25, y - s * .7, s * .26, C.lemon); star4(c, x + s * 1.3, y - s * .9, s * .2, C.lemon); star4(c, x + s * 1.1, y + s * .1, s * .13, C.lemon); break;
    case 'shine': star4(c, x + s * 1.1, y - s * .55, s * .22, o.shineCol || C.lemon); break;
    case 'idea': star4(c, x + s * 1.05, y - s * 1.05, s * .3, C.lemon); circ(c, x + s * 1.05, y - s * 1.05, s * .1); c.fillStyle = C.white; c.fill(); break;
    case 'dots': c.fillStyle = o.dotCol || C.sky; for (const [dx, dy, r] of [[.95, -.55, .09], [1.15, -.9, .13], [1.35, -1.32, .2]]) { circ(c, x + dx * s, y + dy * s, r * s); c.fill(); } break;
    case 'blush': c.fillStyle = C.pink; for (const sx of [-1, 1]) { c.beginPath(); c.ellipse(x + sx * s * .55, y + s * .25, s * .2, s * .1, 0, 0, TAU); c.fill(); } break;
    case 'puff': c.fillStyle = o.dotCol || C.sky; for (const [dx, dy, r] of [[1.15, -.3, .12], [1.35, -.45, .09], [1.28, -.12, .08]]) { circ(c, x + dx * s, y + dy * s, r * s); c.fill(); } break;
  }
}
