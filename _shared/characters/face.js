// Ngữ pháp khuôn mặt dùng chung cho cả dàn nhân vật.
// Mắt: tròng trắng tròn + con ngươi mực + một đốm sáng. Không lông mày: cảm xúc nằm ở mí (khối cùng màu thân cắt vào tròng),
// con ngươi và miệng. Mọi hàm vẽ trong toạ độ đơn vị (mắt bán kính 1, miệng rộng ±1).
import { C } from '../kit.js';
const TAU = Math.PI * 2;
const circ = (c, x, y, r) => { c.beginPath(); c.arc(x, y, Math.max(0, r), 0, TAU); };

export function eye(c, o = {}) {
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

export function mouth(c, kind = 'smile', o = {}) {
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
    case 'talk': { const h = .2 + .42 * talk; c.beginPath(); c.ellipse(0, .1, .6, h, 0, 0, TAU); c.fill(); c.save(); c.clip(); c.fillStyle = tongue; c.beginPath(); c.ellipse(0, .1 + h * .95, .4, h * .55, 0, 0, TAU); c.fill(); c.restore(); break; }
    case 'grin': c.beginPath(); c.moveTo(-.95, -.12); c.lineTo(.95, -.12); c.arc(0, -.12, .95, 0, Math.PI); c.closePath(); c.fill(); c.save(); c.clip(); c.fillStyle = tongue; c.beginPath(); c.ellipse(0, .78, .55, .38, 0, 0, TAU); c.fill(); c.restore(); break;
    case 'shout': c.beginPath(); c.ellipse(0, .25, .78, .72, 0, 0, TAU); c.fill(); c.save(); c.clip(); c.fillStyle = tongue; c.beginPath(); c.ellipse(0, .86, .5, .34, 0, 0, TAU); c.fill(); c.restore(); break;
    case 'none': break;
  }
}

export function cheek(c, col = C.pink) { c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, 1, .6, 0, 0, TAU); c.fill(); }

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
};
export const EXPR10 = ['happy', 'surprised', 'curious', 'worried', 'sad', 'confident', 'confused', 'excited', 'thinking', 'explaining'];
export const EXPR_VI = { happy: 'vui vẻ', surprised: 'ngạc nhiên', curious: 'tò mò', worried: 'lo lắng', sad: 'buồn', confident: 'tự tin', confused: 'bối rối', excited: 'phấn khích', thinking: 'đang suy nghĩ', explaining: 'giải thích bí mật' };

// mắt trái/phải theo biểu cảm, có ghi đè riêng của nhân vật
export function eyeOpts(E, side, base = {}) {
  const k = side < 0 ? 'eyeL' : 'eyeR';
  return { ...base, ...(E.eye || {}), ...(E[k] || {}), side };
}

// ---- hiệu ứng phẳng quanh đầu (toạ độ màn hình; s = bán kính đầu) ----
function star4(c, x, y, r, col) { c.fillStyle = col; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * .3 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); }
function drop(c, x, y, r, col) { c.fillStyle = col; c.beginPath(); c.moveTo(x, y - r * 1.7); c.quadraticCurveTo(x + r * 1.05, y - r * .2, x, y + r); c.quadraticCurveTo(x - r * 1.05, y - r * .2, x, y - r * 1.7); c.fill(); circ(c, x, y, r * .98); c.fill(); }
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
