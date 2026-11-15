// Đạo cụ và bối cảnh của SHORT-015: sân khấu hoà nhạc trên một gốc cây lúc chạng vạng (giờ xanh), vòm sân khấu là một chiếc lá thu cuộn
// màu cam, đèn sân khấu là giọt sương phát sáng, dây đèn quả mọng; cận cảnh hàng gai trên đùi Hop cào qua mép cánh (vẽ riêng: gai của rig
// chỉ là chấm nhỏ), nốt nhạc, cây vĩ cầm cạnh kính, tiếng "squeak". Bối cảnh khối phẳng, mềm hơn nhân vật; đạo cụ chính có viền mực mảnh (v2).
import { C, circle, ell, rrect, poly, capsule, popText, TAU } from '/_shared/kit.js';
import { hash, lerp, clamp, seg, ss, eo, back } from '/core/lib.js';
import { star } from '/_shared/characters/face.js';
import { devStroke } from '/_shared/characters/look.js';
import { HOP_COL } from '/_shared/characters/cast/hop.js';

export const D = {
  sky0: '#141E48', sky1: '#192A5E', sky2: '#1F3B76', sky3: '#26508C', sky4: '#2E66A0',
  shellD: '#B8521A', shell: '#EC7E2A', shellL: '#FF9F45', shellIn: '#FFC266', shellGlow: '#FFDB8F', vein: '#D7681F',
  wood: '#E5AE62', woodL: '#F3C988', ring: '#C78A42', bark: '#8E5629', barkD: '#6B3D1B', barkL: '#A96D36',
  drop: '#E6FAFF', dropD: '#A9DDEB', wire: '#0E1638', grass: '#17544E', grassL: '#21706A',
  violin: '#C8692A', violinD: '#8F4318', violinL: '#E58E45', board: '#2A1A14',
};
export const INK = '#1E1B3A';
export const STAGE = { y: 1240, cx: 540 };
const LANTERN = [C.berry, C.mango, C.mint, '#B98CFF', C.tang];

/* ---------- trời giờ xanh: dải phẳng, sao, mây mỏng ---------- */
export function sky(c, t) {
  c.fillStyle = D.sky0; c.fillRect(-1600, -1600, 4300, 4200);
  for (const [y, h, col] of [[380, 1500, D.sky1], [640, 1200, D.sky2], [860, 900, D.sky3], [1040, 600, D.sky4]]) ell(c, 540, y + 520, 2000, h * .5, 0, col);
  for (let i = 0; i < 36; i++) {
    const x = -400 + hash(i + 700) * 1900, y = -260 + hash(i + 710) * 820, tw = .55 + .45 * Math.sin(t * (1.4 + hash(i + 720)) + i * 1.7);
    if (i % 6 === 0) star(c, x, y, (5 + 4 * hash(i)) * tw, '#FFF3C4'); else circle(c, x, y, 2 + 2.2 * hash(i + 3) * tw, 'rgba(255,248,231,.75)');
  }
  // mây mỏng trôi chậm
  for (let i = 0; i < 3; i++) { const x = ((hash(i + 40) * 1400 + t * 9 * (1 + i * .3)) % 1700) - 300, y = 140 + i * 170; c.fillStyle = 'rgba(120,150,210,.16)'; c.beginPath(); c.ellipse(x, y, 190, 34, 0, 0, TAU); c.ellipse(x + 90, y - 18, 120, 30, 0, 0, TAU); c.fill(); }
}

/* ---------- vòm sân khấu: chiếc lá thu cuộn thành vỏ sò, gân lá toả ra, viền mực ---------- */
export const SHELL = { x: 470, y: STAGE.y + 10, rx: 560, ry: 650 };
export function bandshell(c, t, glow = 1) {
  const { x, y, rx, ry } = SHELL;
  const arch = (k, col) => { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx * k, ry * k, 0, Math.PI, TAU); c.closePath(); c.fill(); };
  arch(1, D.shellD);
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, Math.PI, TAU); devStroke(c, 4, INK);
  arch(.93, D.shell); arch(.8, D.shellL);
  // lòng vòm sáng lên theo đèn sân khấu
  c.save(); c.globalAlpha *= .55 + .25 * glow; arch(.64, D.shellIn); c.globalAlpha *= .7; arch(.46, D.shellGlow); c.restore();
  // gân lá toả từ chân vòm
  c.strokeStyle = D.vein; c.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * (1.08 + i * .105), r1 = .9;
    c.lineWidth = i % 2 ? 7 : 10; c.beginPath(); c.moveTo(x, y - 6); c.quadraticCurveTo(x + Math.cos(a) * rx * .45, y + Math.sin(a) * ry * .52, x + Math.cos(a) * rx * r1, y + Math.sin(a) * ry * r1); c.stroke();
  }
  c.lineWidth = 6; c.strokeStyle = 'rgba(255,240,200,.35)';
  for (let i = 0; i < 8; i++) { const a = Math.PI * (1.13 + i * .105); c.beginPath(); c.arc(x, y, rx * .72, a - .02, a + .06); c.stroke(); }
  // dây đèn quả mọng võng dưới mép vòm
  const n = 11, p0 = [x - rx * .82, y - ry * .62], p1 = [x + rx * .86, y - ry * .55];
  const pt = u => [lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u) + 70 * Math.sin(Math.PI * u)];
  c.strokeStyle = D.wire; c.lineWidth = 4; c.beginPath(); for (let i = 0; i <= 30; i++) { const p = pt(i / 30); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke();
  for (let i = 1; i < n; i++) {
    const p = pt(i / n), col = LANTERN[i % LANTERN.length], tw = .6 + .4 * Math.sin(t * 2.3 + i * 1.9);
    circle(c, p[0], p[1] + 16, 30 * tw, `rgba(255,236,170,${.16 * tw})`);
    circle(c, p[0], p[1] + 16, 13, col); circle(c, p[0] - 4, p[1] + 11, 4.5, 'rgba(255,255,255,.75)');
    capsule(c, p[0], p[1] + 2, p[0], p[1] + 6, 6, D.wire);
  }
}

/* ---------- vệt đèn rọi chéo xuống sân khấu ---------- */
export function spotlight(c, t, x = 330, a = .1) {
  c.fillStyle = `rgba(255,236,180,${a})`;
  c.beginPath(); c.moveTo(x - 60 - 20 * Math.sin(t * .7), -200); c.lineTo(x + 60 - 20 * Math.sin(t * .7), -200); c.lineTo(x + 330, STAGE.y + 10); c.lineTo(x - 330, STAGE.y + 10); c.closePath(); c.fill();
  ell(c, x, STAGE.y + 8, 330, 52, 0, `rgba(255,236,180,${a * 1.4})`);
}
/* ---------- bụi sáng lơ lửng trong vệt đèn ---------- */
export function motes(c, t) {
  for (let i = 0; i < 22; i++) {
    const sp = 18 + 22 * hash(i + 90), y = STAGE.y - ((t * sp + hash(i + 91) * 700) % 700), x = 160 + hash(i + 92) * 420 + 16 * Math.sin(t * 1.3 + i);
    circle(c, x, y, 2.5 + 2 * hash(i + 93), `rgba(255,246,214,${.35 + .35 * Math.sin(t * 2 + i)})`);
  }
}

/* ---------- sân khấu gốc cây: mặt cắt có vân vòng, vỏ cây, đèn giọt sương ---------- */
export function stump(c, t) {
  const cx = STAGE.cx, top = STAGE.y + 20, rx = 660, ry = 96;
  // mặt trước (vỏ cây)
  c.fillStyle = D.bark; c.beginPath(); c.moveTo(cx - rx, top); c.lineTo(cx - rx - 30, 2400); c.lineTo(cx + rx + 30, 2400); c.lineTo(cx + rx, top); c.closePath(); c.fill();
  for (let i = 0; i < 16; i++) { const x = cx - rx + 30 + i * 86 + 14 * Math.sin(i * 2.1); c.fillStyle = i % 2 ? D.barkD : D.barkL; c.beginPath(); c.moveTo(x, top + 40); c.quadraticCurveTo(x + 18 * Math.sin(i), top + 380, x - 10, 2400); c.lineTo(x + 18, 2400); c.quadraticCurveTo(x + 22 + 18 * Math.sin(i), top + 380, x + 16, top + 40); c.closePath(); c.fill(); }
  // mép trên sáng + mặt cắt
  ell(c, cx, top + 14, rx + 6, ry + 8, 0, D.barkD);
  ell(c, cx, top, rx, ry, 0, D.woodL);
  c.beginPath(); c.ellipse(cx, top, rx, ry, 0, 0, TAU); devStroke(c, 3.5, INK);
  ell(c, cx, top + 4, rx * .95, ry * .9, 0, D.wood);
  c.strokeStyle = D.ring; c.lineWidth = 4;
  for (const k of [.82, .64, .46, .28, .12]) { c.beginPath(); c.ellipse(cx + 20 * (1 - k), top + 6 * (1 - k), rx * k, ry * k * .9, 0, 0, TAU); c.stroke(); }
  // đèn giọt sương dọc mép trước
  for (let i = 0; i < 13; i++) {
    const a = Math.PI * (.08 + i * .07), x = cx + Math.cos(a) * rx * .97, y = top + Math.sin(a) * ry * .97 + 6, tw = .75 + .25 * Math.sin(t * 3 + i * 2.2);
    circle(c, x, y - 4, 40 * tw, `rgba(255,230,150,${.13 * tw})`);
    c.fillStyle = D.drop; c.beginPath(); c.moveTo(x, y - 30); c.quadraticCurveTo(x + 17, y - 6, x, y + 6); c.quadraticCurveTo(x - 17, y - 6, x, y - 30); c.fill();
    c.beginPath(); c.moveTo(x, y - 30); c.quadraticCurveTo(x + 17, y - 6, x, y + 6); c.quadraticCurveTo(x - 17, y - 6, x, y - 30); devStroke(c, 2.5, INK);
    circle(c, x - 4, y - 8, 4, '#FFFFFF'); circle(c, x + 3, y - 2, 7 * tw, 'rgba(255,224,120,.55)');
  }
}
/* ---------- cỏ tiền cảnh hai góc dưới (trôi nhanh hơn máy) ---------- */
export function foreground(c, t) {
  for (const [x0, sd] of [[-40, 1], [1120, -1]]) for (let i = 0; i < 9; i++) {
    const x = x0 + sd * i * 26, h = 150 + 120 * hash(i + (sd > 0 ? 300 : 340)), sw = 10 * Math.sin(t * 1.4 + i);
    poly(c, [[x - 14, 1960], [x + 14, 1960], [x + sd * 30 + sw, 1960 - h]], i % 2 ? D.grass : D.grassL);
  }
}

/* ---------- nốt nhạc (móc đơn / hai móc nối), viền mực ---------- */
export const NOTE_COL = [C.lemon, C.cream, C.pink, C.mint, '#FFB45E'];
export function noteGlyph(c, x, y, s, col, rot = 0, kind = 0, a = 1) {
  if (a <= .01 || s <= .01) return;
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const head = (hx, hy) => { c.beginPath(); c.ellipse(hx, hy, 15, 11, -.4, 0, TAU); };
  const draw = () => {
    if (kind % 2) { head(-18, 22); head(22, 14); c.rect(-6, -36, 7, 58); c.rect(34, -44, 7, 58); c.moveTo(-6, -36); c.lineTo(41, -44); c.lineTo(41, -30); c.lineTo(-6, -22); c.closePath(); }
    else { head(0, 18); c.rect(9, -40, 7, 58); c.moveTo(16, -40); c.quadraticCurveTo(40, -24, 34, 0); c.quadraticCurveTo(30, -18, 16, -24); c.closePath(); }
  };
  draw(); devStroke(c, 7 * devK(c), INK); c.fillStyle = col; draw(); c.fill();
  c.restore();
}


/* ---------- cận cảnh hàng gai (toạ độ mặt kính: tâm 0,0, bán kính R) ----------
   st = { u: chỉ số gai đang ở đỉnh gờ mép cánh, lift: 0..1 đùi nhấc khỏi mép cánh, ticks: [{t, i}] đã qua, t, glint: [t0, t1], fast: 0..1, notes: [{t, i}] }
   Gai to (bán kính 34 trên R = 300) để đọc được ở cỡ điện thoại: khoảng 6 gai trong mặt kính, hàng gai rộng hơn nửa khung. */
const G = 104, PR = 34;                             // khoảng cách giữa hai gai, bán kính gai (đơn vị của R = 300)
export const MACRO = { gap: G, crest: 78 };
const edgeY = (x, vib) => MACRO.crest + .0016 * x * x + vib(x);
export function macro(c, R, st) {
  const k = R / 300, t = st.t;
  c.save(); c.scale(k, k);
  // nền: không gian mờ phía sau chân, đốm đèn sân khấu nhoè
  c.fillStyle = '#123A3F'; c.fillRect(-320, -320, 640, 640);
  for (let i = 0; i < 9; i++) circle(c, -260 + hash(i + 60) * 520, -290 + hash(i + 61) * 140, 30 + 40 * hash(i + 62), `rgba(${i % 2 ? '255,214,140' : '120,220,200'},${.12 + .08 * Math.sin(t * 1.5 + i)})`);
  // rung của gờ mép cánh sau mỗi tiếng tách (sóng tắt dần quanh đỉnh)
  const vib = x => {
    let v = 0;
    for (const T of st.ticks) { const d = t - T.t; if (d >= 0 && d < .45) v += 13 * Math.exp(-d * 9) * Math.sin(d * 70) * Math.exp(-x * x / 14000); }
    return v + st.fast * 9 * Math.sin(t * 90 + x * .05) * Math.exp(-x * x / 30000);
  };
  // cánh trước: tấm da nâu vàng có gân, mép trên là một gờ
  const wingPath = () => { c.beginPath(); c.moveTo(-330, 330); for (let x = -330; x <= 330; x += 15) c.lineTo(x, edgeY(x, vib) + 16); c.lineTo(330, 330); c.closePath(); };
  wingPath(); c.fillStyle = HOP_COL.wing; c.fill();
  c.save(); wingPath(); c.clip();
  c.strokeStyle = 'rgba(156,122,52,.8)'; c.lineWidth = 7;
  for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-330 + i * 130, 340); c.quadraticCurveTo(-290 + i * 124, 220, -250 + i * 112, edgeY(-250 + i * 112, vib) + 34); c.stroke(); }
  c.strokeStyle = 'rgba(255,236,190,.35)'; c.lineWidth = 4;
  for (let i = 0; i < 12; i++) { const x = -300 + hash(i + 80) * 600, y = edgeY(x, vib) + 70 + hash(i + 81) * 200; c.beginPath(); c.ellipse(x, y, 30 + 20 * hash(i + 82), 16, hash(i + 83) * 3, 0, TAU); c.stroke(); }
  c.restore();
  // gờ mép cánh: dải sẫm có viền mực + vệt sáng trên đỉnh
  c.lineCap = 'round'; c.lineJoin = 'round';
  const ridge = dy => { c.beginPath(); for (let x = -330; x <= 330; x += 10) { const y = edgeY(x, vib) + dy; x === -330 ? c.moveTo(x, y) : c.lineTo(x, y); } };
  ridge(10); devStroke(c, 40 * devK(c), INK); c.strokeStyle = HOP_COL.wingD; c.lineWidth = 32; c.stroke();
  ridge(1); c.strokeStyle = '#EBCB86'; c.lineWidth = 8; c.stroke();
  // vòng rung quanh đỉnh sau mỗi tiếng tách
  const rings = (q, al) => { c.strokeStyle = `rgba(255,236,150,${al})`; c.lineWidth = 8 * (1 - q) + 3; for (const sd of [-1, 1]) { c.beginPath(); c.arc(0, MACRO.crest + 8, 60 + 170 * eo(q), sd > 0 ? -.5 : Math.PI - .3, sd > 0 ? .3 : Math.PI + .5); c.stroke(); } };
  for (const T of st.ticks) { const d = t - T.t; if (d >= 0 && d < .4) rings(d / .4, .85 * (1 - d / .4)); }
  if (st.fast > .05) for (let j = 0; j < 3; j++) rings((t * 6 + j / 3) % 1, .55 * st.fast);
  // đùi: khối xanh lá to, sọc chữ V trượt theo đùi, hàng gai nhô xuống ở mép dưới
  const lift = st.lift * 70, pegY = MACRO.crest - 6 - PR - lift, fh = 250, fy = pegY - fh / 2 + 6, a = -.05;
  c.save(); c.rotate(a);
  const femur = () => { c.beginPath(); c.roundRect(-430, fy - fh / 2, 860, fh, 90); };
  const shift = st.u * G, i0 = Math.ceil((-380 + shift) / G), i1 = Math.floor((380 + shift) / G), pegs = [];
  for (let i = i0; i <= i1; i++) pegs.push({ i, x: i * G - shift });
  const blur = st.fast;
  const pegPath = x => { c.beginPath(); c.arc(x, pegY, PR, -.15, Math.PI + .15); c.closePath(); };
  for (const p of pegs) { pegPath(p.x); devStroke(c, 8 * devK(c), INK); }
  femur(); devStroke(c, 9 * devK(c), INK);
  femur(); c.fillStyle = HOP_COL.body; c.fill();
  c.save(); femur(); c.clip();
  c.fillStyle = HOP_COL.bodyD; c.fillRect(-440, fy - fh / 2 - 10, 880, 70);
  c.fillStyle = 'rgba(255,255,255,.16)'; c.fillRect(-440, fy + 20, 880, 30);
  c.strokeStyle = HOP_COL.bodyD; c.lineWidth = 22; c.lineCap = 'round'; c.lineJoin = 'round';
  const per = 220; for (let j = -4; j <= 4; j++) { const x = j * per - (((shift % per) + per) % per); c.beginPath(); c.moveTo(x - 70, fy - 60); c.lineTo(x, fy + 14); c.lineTo(x + 70, fy - 60); c.stroke(); }
  if (blur > .05) { c.strokeStyle = `rgba(255,255,255,${.4 * blur})`; c.lineWidth = 7; for (let j = 0; j < 5; j++) { const y = fy - 70 + j * 34; c.beginPath(); c.moveTo(-300 + 40 * j, y); c.lineTo(300 - 30 * j, y); c.stroke(); } }
  c.restore();
  for (const p of pegs) {
    const g = st.glint ? clamp(1 - Math.abs(t - (st.glint[0] + (p.x + 300) / 600 * (st.glint[1] - st.glint[0] - .2))) / .18) : 0;
    const hit = st.ticks.filter(T => T.i === p.i && t >= T.t && t - T.t < .35).reduce((m, T) => Math.max(m, 1 - (t - T.t) / .35), 0);
    c.save(); c.globalAlpha *= 1 - .4 * blur;
    pegPath(p.x); c.fillStyle = HOP_COL.peg; c.fill();
    c.beginPath(); c.arc(p.x, pegY, PR * .62, .2, Math.PI - .2); c.strokeStyle = 'rgba(255,240,200,.35)'; c.lineWidth = 6; c.stroke();
    circle(c, p.x - 11, pegY + 14, 7, 'rgba(255,240,200,.65)');
    c.restore();
    if (hit > 0) { circle(c, p.x, pegY + 12, 52 * hit + 16, `rgba(255,227,77,${.45 * hit})`); pegPath(p.x); c.fillStyle = `rgba(255,227,77,${.85 * hit})`; c.fill(); }
    if (g > 0) star(c, p.x + 12, pegY + 10, 30 * g, C.cream);
  }
  c.restore();
  // nốt nhạc bật ra từ chỗ chạm, bay lên
  for (const N of st.notes) {
    const d = t - N.t; if (d < 0 || d > 1.1) continue;
    const sd = N.i % 2 ? 1 : -1, x = sd * (70 + 150 * eo(d / 1.1)) + 20 * Math.sin(d * 6 + N.i), y = 20 - 320 * eo(d / 1.1);
    noteGlyph(c, x, y, (1.5 + .3 * (N.i % 3)) * back(clamp(d / .2), 2.6), NOTE_COL[N.i % NOTE_COL.length], .25 * sd * Math.sin(d * 5), N.i, 1 - seg(d, .8, 1.1));
  }
  c.restore();
}
const devK = c => { const m = c.getTransform(); return Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) || 1; };   // px thiết bị cho 1 đơn vị đang vẽ

/* ---------- cây vĩ cầm và cây vĩ (toạ độ khung), cây vĩ kéo theo bow -1..1 ---------- */
export function violin(c, x, y, s, bow, rot = 0) {
  if (s <= .01) return;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const body = () => {
    c.beginPath();
    c.moveTo(0, -150); c.bezierCurveTo(48, -150, 70, -128, 66, -96); c.bezierCurveTo(62, -70, 38, -66, 40, -40);
    c.bezierCurveTo(42, -16, 82, -8, 84, 40); c.bezierCurveTo(86, 96, 50, 120, 0, 120);
    c.bezierCurveTo(-50, 120, -86, 96, -84, 40); c.bezierCurveTo(-82, -8, -42, -16, -40, -40);
    c.bezierCurveTo(-38, -66, -62, -70, -66, -96); c.bezierCurveTo(-70, -128, -48, -150, 0, -150); c.closePath();
  };
  body(); devStroke(c, 8 * devK(c), INK); body(); c.fillStyle = D.violin; c.fill();
  c.save(); body(); c.clip(); ell(c, -30, -30, 50, 170, .1, D.violinL); ell(c, 50, 40, 40, 120, 0, D.violinD); c.restore();
  // lỗ chữ f, ngựa đàn, cần đàn, đầu cuộn
  c.strokeStyle = INK; c.lineWidth = 5; c.lineCap = 'round';
  for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(sd * 30, -10); c.bezierCurveTo(sd * 20, 10, sd * 40, 30, sd * 30, 52); c.stroke(); }
  rrect(c, -24, 18, 48, 10, 4, C.cream);
  rrect(c, -13, -250, 26, 250, 10, D.board);
  c.beginPath(); c.arc(0, -262, 20, 0, TAU); c.fillStyle = D.violinD; c.fill(); devStroke(c, 6 * devK(c), INK);
  c.beginPath(); c.arc(0, -262, 8, 0, TAU); c.fillStyle = D.violin; c.fill();
  c.strokeStyle = 'rgba(255,248,231,.9)'; c.lineWidth = 2; for (const dx of [-7, -2.5, 2.5, 7]) { c.beginPath(); c.moveTo(dx, -240); c.lineTo(dx * 1.4, 20); c.stroke(); }
  rrect(c, -18, 92, 36, 22, 6, D.board);
  // cây vĩ: thân gỗ sẫm + lông vĩ kem, nằm ngang qua dây đàn, kéo trái phải
  const bx = 55 * bow;
  c.save(); c.translate(bx, -2); c.rotate(-.12);
  c.beginPath(); c.roundRect(-190, -14, 380, 10, 5); devStroke(c, 7 * devK(c), INK); c.fillStyle = '#5A3418'; c.fill();
  c.strokeStyle = C.cream; c.lineWidth = 6; c.beginPath(); c.moveTo(-178, 4); c.lineTo(168, 4); c.stroke();
  rrect(c, 150, -18, 34, 30, 6, INK); rrect(c, -196, -18, 14, 26, 5, '#5A3418');
  c.restore();
  c.restore();
}

/* ---------- "squeak." bé tí: vòng tia ở chiếc giày (sx, sy), chữ ở (tx, ty), một nốt nhạc bé rơi xuống (toạ độ khung) ---------- */
export function squeakFx(c, sx, sy, tx, ty, t, t0, k = 1) {
  const d = t - t0; if (d < 0 || d > 2.15) return;
  const p = back(clamp(d / .18), 3), fade = 1 - seg(d, 1.95, 2.15), q0 = clamp(d / .35);
  if (q0 < 1) for (let i = 0; i < 5; i++) { const a = -2.6 + i * .5; c.strokeStyle = `rgba(255,248,231,${1 - q0})`; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(sx + Math.cos(a) * 26 * k, sy + Math.sin(a) * 26 * k); c.lineTo(sx + Math.cos(a) * (36 + 34 * q0) * k, sy + Math.sin(a) * (36 + 34 * q0) * k); c.stroke(); }
  c.save(); c.globalAlpha *= fade; c.translate(tx, ty); c.rotate(-.08 + .05 * Math.sin(d * 18) * Math.exp(-d * 4)); c.scale(p, p);
  c.scale(k, k); popText(c, 'squeak.', 0, 0, 72, C.cream, INK, -1, -1, { font: px => `800 ${px}px "Baloo 2"`, sh: 6 });
  c.restore();
  const q = seg(d, .1, 1.3); if (q > 0 && q < 1) noteGlyph(c, sx + 30 + 40 * q, sy - 40 + 170 * q * q, .55 * k, C.cream, .6 * q, 0, 1 - q);
}
